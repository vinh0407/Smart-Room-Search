import { useEffect, useRef, useState, Component, ErrorInfo, ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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
}

const formatPrice = (price?: number) =>
  price ? `${price.toLocaleString('vi-VN')} đ/tháng` : '';

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || window.matchMedia('(hover: none)').matches);

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
}

function FitBounds({
  rooms,
  userLat,
  userLng,
  variant = 'overview',
}: {
  rooms: RoomMarker[];
  userLat?: number | null;
  userLng?: number | null;
  variant?: 'overview' | 'detail';
}) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const roomPoints: [number, number][] = rooms.map((r) => [r.lat, r.lng]);
    if (roomPoints.length === 0) {
      if (userLat && userLng) {
        map.setView([userLat, userLng], 14);
      }
      return;
    }

    if (variant === 'detail') {
      map.setView(roomPoints[0], 16);
      return;
    }

    const points: [number, number][] = [...roomPoints];
    if (userLat && userLng) points.push([userLat, userLng]);

    try {
      if (points.length === 1) {
        map.setView(points[0], 15);
      } else if (points.length > 1) {
        map.fitBounds(points, {
          padding: [50, 50],
          maxZoom: 16,
          animate: false,
        });
      }
    } catch (e) {
      console.warn('Map fitBounds warning', e);
    }
  }, [rooms.length, userLat, userLng, map, variant]);
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

  return (
    <Marker
      ref={markerRef}
      position={[room.lat, room.lng]}
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

class MapErrorBoundary extends Component<{ children: ReactNode; fallbackHeight?: string }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallbackHeight?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RoomMap ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ height: this.props.fallbackHeight || '360px' }}
          className="w-full rounded-2xl border border-border bg-muted/40 flex flex-col items-center justify-center p-6 text-center gap-3"
        >
          <div className="text-primary font-bold text-sm">Bản đồ đang được tải lại</div>
          <p className="text-xs text-muted-foreground max-w-sm">
            Vui lòng thử làm mới hoặc mở trực tiếp trên Google Maps.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-95"
          >
            Tải lại bản đồ
          </button>
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

  // Hiển thị tối đa 120 phòng gần nhất để bản đồ luôn mượt mà không bị giật lag
  const displayedRooms = validRooms.slice(0, 120);

  const center: [number, number] =
    validRooms.length > 0
      ? [validRooms[0].lat, validRooms[0].lng]
      : userLat && userLng
        ? [userLat, userLng]
        : [10.7769, 106.7009];

  const showUserRadius = variant === 'overview' && userLat && userLng;

  return (
    <MapErrorBoundary fallbackHeight={height}>
      <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={variant === 'detail' ? 16 : 13}
          style={{ height: '100%', width: '100%', minHeight: '240px' }}
          scrollWheelZoom={variant === 'overview'}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
          />
          <MapResizer />
          <FitBounds rooms={displayedRooms} userLat={userLat} userLng={userLng} variant={variant} />

          {userLat && userLng && (
            <Marker position={[userLat, userLng]} icon={userIcon}>
              <Popup>
                <div className="font-bold text-xs p-1 text-center">Vị trí của bạn</div>
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
