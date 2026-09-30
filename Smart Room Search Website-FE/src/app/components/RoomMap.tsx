import { useEffect, useRef, useState, Component, ErrorInfo, ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Tự tạo SVG Marker độc lập 100%, không phụ thuộc bất kỳ CDN ngoài (như unpkg hay github raw)
// Tránh hoàn toàn lỗi bị chặn mạng, CORS, hay CSP ở Việt Nam
const createRoomPinIcon = () =>
  L.divIcon({
    className: 'custom-room-marker',
    html: `
      <div style="position: relative; width: 32px; height: 40px; transform: translate(-50%, -100%); cursor: pointer;">
        <svg viewBox="0 0 384 512" width="32" height="40" style="filter: drop-shadow(0 3px 5px rgba(0,0,0,0.38));">
          <path fill="#ea580c" stroke="#ffffff" stroke-width="18" d="M384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"/>
          <path fill="#ffffff" d="M192 105l-68 54v82h46v-46h44v46h46v-82z"/>
        </svg>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -38],
  });

const createUserPinIcon = () =>
  L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; background: rgba(37, 99, 235, 0.35); border-radius: 50%;"></div>
        <div style="width: 14px; height: 14px; background: #2563eb; border: 2.5px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -14],
  });

const roomPinIcon = createRoomPinIcon();
const userPinIcon = createUserPinIcon();

export interface RoomMarker {
  id: number | string;
  title: string;
  lat: number;
  lng: number;
  price?: number;
  address?: string;
  area?: number;
  district?: string;
}

interface RoomMapProps {
  rooms: RoomMarker[];
  userLat?: number | null;
  userLng?: number | null;
  radiusKm?: number;
  height?: string;
  onViewRoom?: (id: number | string) => void;
  /** detail = zoom vào phòng; overview = xem nhiều phòng + vị trí user */
  variant?: 'overview' | 'detail';
  cityCenter?: [number, number];
}

const formatPrice = (price?: number) =>
  price ? `${price.toLocaleString('vi-VN')} đ/tháng` : '';

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || window.matchMedia('(hover: none)').matches);

/**
 * Controller an toàn điều khiển góc nhìn bản đồ mà KHÔNG cần unmount MapContainer bằng key
 * Tránh lỗi "Map container is already initialized" khi đổi tỉnh thành hoặc dữ liệu phòng
 */
function MapViewController({
  rooms,
  userLat,
  userLng,
  center,
  variant = 'overview',
}: {
  rooms: RoomMarker[];
  userLat?: number | null;
  userLng?: number | null;
  center: [number, number];
  variant?: 'overview' | 'detail';
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Đảm bảo kích thước bản đồ luôn chuẩn xác kể cả khi container thay đổi hoặc mới mount
    map.invalidateSize();

    const timer = setTimeout(() => {
      try {
        map.invalidateSize();

        if (variant === 'detail') {
          if (rooms.length > 0 && typeof rooms[0].lat === 'number' && typeof rooms[0].lng === 'number') {
            map.setView([rooms[0].lat, rooms[0].lng], 16, { animate: true });
          } else {
            map.setView(center, 16, { animate: true });
          }
          return;
        }

        const validPoints: [number, number][] = rooms
          .filter((r) => typeof r.lat === 'number' && typeof r.lng === 'number' && !isNaN(r.lat) && !isNaN(r.lng))
          .map((r) => [r.lat, r.lng]);

        if (userLat != null && userLng != null && !isNaN(userLat) && !isNaN(userLng)) {
          validPoints.push([userLat, userLng]);
        }

        const size = map.getSize();
        if (size.x > 0 && size.y > 0) {
          if (validPoints.length === 0) {
            map.setView(center, 13, { animate: true });
          } else if (validPoints.length === 1) {
            map.setView(validPoints[0], 15, { animate: true });
          } else {
            map.fitBounds(validPoints, {
              padding: [45, 45],
              maxZoom: 16,
              animate: true,
            });
          }
        } else {
          map.setView(center, 13);
        }
      } catch (err) {
        console.warn('MapViewController adjust view warning:', err);
      }
    }, 100);

    const handleResize = () => {
      try {
        map.invalidateSize();
      } catch {}
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map, rooms, userLat, userLng, center[0], center[1], variant]);

  return null;
}

function RoomMarkerItem({
  room,
  onViewRoom,
}: {
  room: RoomMarker;
  onViewRoom?: (id: number | string) => void;
}) {
  const markerRef = useRef<L.Marker>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearCloseTimer = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => markerRef.current?.closePopup(), 280);
  };

  const openPopup = () => {
    clearCloseTimer();
    markerRef.current?.openPopup();
  };

  if (!room.lat || !room.lng || isNaN(room.lat) || isNaN(room.lng)) {
    return null;
  }

  return (
    <Marker
      ref={markerRef}
      position={[room.lat, room.lng]}
      icon={roomPinIcon}
      eventHandlers={{
        mouseover: () => {
          if (!isTouchDevice()) openPopup();
        },
        mouseout: () => {
          if (!isTouchDevice()) scheduleClose();
        },
        click: () => openPopup(),
      }}
    >
      <Popup
        className="room-map-popup-wrap"
        closeButton
        eventHandlers={{
          mouseover: clearCloseTimer,
          mouseout: () => {
            if (!isTouchDevice()) scheduleClose();
          },
        }}
      >
        <div className="room-map-popup p-1 max-w-[220px]">
          <p className="font-bold text-xs text-foreground line-clamp-2">{room.title}</p>
          {room.price != null && room.price > 0 && (
            <p className="font-extrabold text-xs text-primary mt-1">{formatPrice(room.price)}</p>
          )}
          {(room.district || room.area) && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {[room.district, room.area ? `${room.area} m²` : ''].filter(Boolean).join(' · ')}
            </p>
          )}
          {room.address && (
            <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{room.address}</p>
          )}
          {onViewRoom && (
            <button
              type="button"
              className="mt-2 w-full rounded-lg bg-primary py-1.5 text-center text-xs font-bold text-white hover:brightness-95 transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                onViewRoom(room.id);
              }}
            >
              Xem chi tiết phòng
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

class MapErrorBoundary extends Component<{ children: ReactNode; fallbackHeight?: string }, { hasError: boolean; errorMsg?: string }> {
  constructor(props: { children: ReactNode; fallbackHeight?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error?.message || 'Lỗi hiển thị bản đồ' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoomMap ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ height: this.props.fallbackHeight || '360px' }}
          className="w-full rounded-2xl border border-border bg-card flex flex-col items-center justify-center p-6 text-center gap-3 shadow-inner"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div className="text-foreground font-bold text-sm">Bản đồ đang được chuẩn bị</div>
          <p className="text-xs text-muted-foreground max-w-sm">
            Hệ thống đang đồng bộ dữ liệu vị trí phòng trọ. Bấm nút dưới đây để làm mới bản đồ ngay lập tức.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-95 transition-all shadow-sm"
            >
              Tải lại bản đồ
            </button>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-muted px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/80 transition-all"
            >
              Mở Google Maps
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RoomMap({
  rooms,
  userLat,
  userLng,
  radiusKm = 5,
  height = '360px',
  onViewRoom,
  variant = 'overview',
  cityCenter,
}: RoomMapProps) {
  const validRooms = rooms.filter(
    (r) =>
      r.lat != null &&
      r.lng != null &&
      !isNaN(r.lat) &&
      !isNaN(r.lng) &&
      r.lat >= -90 &&
      r.lat <= 90 &&
      r.lng >= -180 &&
      r.lng <= 180
  );

  // Hiển thị tối đa 60 phòng gần nhất để bản đồ luôn mượt mà đạt 60 FPS
  const displayedRooms = validRooms.slice(0, 60);

  const center: [number, number] =
    validRooms.length > 0
      ? [validRooms[0].lat, validRooms[0].lng]
      : userLat && userLng && !isNaN(userLat) && !isNaN(userLng)
        ? [userLat, userLng]
        : cityCenter && !isNaN(cityCenter[0]) && !isNaN(cityCenter[1])
          ? cityCenter
          : [10.7769, 106.7009];

  const hasValidUserGps = userLat != null && userLng != null && !isNaN(userLat) && !isNaN(userLng);
  const showUserRadius = variant === 'overview' && hasValidUserGps;

  return (
    <MapErrorBoundary fallbackHeight={height}>
      <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={variant === 'detail' ? 16 : 13}
          preferCanvas={true}
          style={{ height: '100%', width: '100%', minHeight: '240px' }}
          scrollWheelZoom={variant === 'overview'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
          />
          <MapViewController
            rooms={displayedRooms}
            userLat={userLat}
            userLng={userLng}
            center={center}
            variant={variant}
          />

          {hasValidUserGps && (
            <Marker position={[userLat!, userLng!]} icon={userPinIcon}>
              <Popup>
                <div className="font-bold text-xs p-1 text-center">Vị trí hiện tại của bạn</div>
              </Popup>
            </Marker>
          )}

          {showUserRadius && (
            <Circle
              center={[userLat!, userLng!]}
              radius={radiusKm * 1000}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.08 }}
            />
          )}

          {displayedRooms.map((room) => (
            <RoomMarkerItem key={room.id} room={room} onViewRoom={onViewRoom} />
          ))}
        </MapContainer>
      </div>
    </MapErrorBoundary>
  );
}
