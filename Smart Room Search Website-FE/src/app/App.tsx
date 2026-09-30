import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  MapPin,
  Phone,
  MessageCircle,
  Heart,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Home,
  SlidersHorizontal,
  Wifi,
  Car,
  Wind,
  UtensilsCrossed,
  Bath,
  Layers,
  PawPrint,
  Eye,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  Image as ImageIcon,
  Tag,
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  Navigation,
  Share2,
  Bookmark,
  TrendingUp,
  Users,
  Building2,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  ZoomIn,
  Maximize2,
  Clock,
  Check,
  LayoutDashboard,
  Settings,
  Bell,
  Camera,
  Upload,
  ArrowRight,
  Percent,
  Map,
  ExternalLink,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import api from "../lib/api";
import { useNavigate, useLocation } from "react-router";

const RoomMap = lazy(() => import("./components/RoomMap"));
import { REAL_ROOMS } from "../data/realRooms";
import {
  CITIES,
  DISTRICT_CATEGORIES,
  DISTRICT_CATEGORIES_BY_CITY,
  CITY_COORDINATES,
  getDistrictCategoriesForCity,
  getDistrictsForCity,
  isRoomInCity,
  SOURCE_OPTIONS,
  getWardsForDistrict,
  CityItem,
} from "../data/locations";

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════
type Status = "available" | "rented" | "maintenance";
type View = "home" | "rooms" | "detail" | "favorites" | "map";
type SortOption = "newest" | "price_asc" | "price_desc" | "area_desc" | "distance";

interface RoomReview {
  id: number;
  roomId?: number | string;
  room_id?: number | string;
  userName?: string;
  user_name?: string;
  rating: number;
  comment: string;
  isAnonymous?: boolean;
  is_anonymous?: boolean;
  createdAt?: string;
  created_at?: string;
}

interface Demand {
  id: number;
  full_name?: string;
  phone?: string;
  gender?: string | null;
  district?: string | null;
  max_price: number;
  people_count: number;
  note?: string | null;
  created_at?: string;
}

const sortDemandsNewestFirst = (items: Demand[]) => [...items].sort((a, b) => {
  const aTime = a.created_at ? Date.parse(a.created_at) : Number.NaN;
  const bTime = b.created_at ? Date.parse(b.created_at) : Number.NaN;

  if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
    return bTime - aTime;
  }

  return Number(b.id) - Number(a.id);
});

const asDemandList = (payload: unknown): Demand[] => {
  if (Array.isArray(payload)) return sortDemandsNewestFirst(payload as Demand[]);
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return sortDemandsNewestFirst((payload as { data: Demand[] }).data);
  }
  return [];
};

interface Room {
  id: number | string;
  name: string;
  price: number;
  electricity?: number;
  water?: number;
  internet?: number;
  serviceFee?: number;
  area?: number;
  maxPeople?: number;
  address: string;
  district: string;
  city: string;
  lat?: number;
  lng?: number;
  status: Status;
  description: string;
  amenities: string[];
  images: string[];
  phone?: string;
  zaloLink?: string;
  views: number;
  contacts: number;
  createdAt?: string;
  isFeatured: boolean;
  isNew: boolean;
  isCheap: boolean;
  rating: number | null;
  source?: string;
  externalUrl?: string;
}

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  color: string;
}

interface ServicePrice {
  id: string;
  label: string;
  value: number;
  unit: string;
}

interface FilterState {
  search: string;
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  district: string;
  ward?: string;
  districtCategory?: string;
  city?: string;
  amenities: string[];
  status: string;
  source?: string;
}

// ═══════════════════════════════════════════════════════
// STATIC DATA
// ═══════════════════════════════════════════════════════
const AMENITY_META: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  ac: { label: "Máy lạnh", icon: <Wind size={12} /> },
  private_wc: { label: "WC riêng", icon: <Bath size={12} /> },
  washing_machine: {
    label: "Máy giặt",
    icon: <Layers size={12} />,
  },
  kitchen: {
    label: "Bếp",
    icon: <UtensilsCrossed size={12} />,
  },
  balcony: { label: "Ban công", icon: <Home size={12} /> },
  loft: { label: "Gác lửng", icon: <Layers size={12} /> },
  parking: { label: "Để xe", icon: <Car size={12} /> },
  ev_charging: { label: "Sạc xe điện", icon: <Zap size={12} /> },
  pet_friendly: {
    label: "Nuôi thú",
    icon: <PawPrint size={12} />,
  },
  wifi: { label: "Wifi", icon: <Wifi size={12} /> },
};

const DISTRICTS = [
  "Tất cả",
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Tân Phú",
  "Phú Nhuận",
  "Bình Chánh",
  "Bình Tân",
  "Thủ Đức",
  "Cần Giờ",
  "Củ Chi",
  "Hóc Môn",
  "Nhà Bè",
];




const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: "Tìm phòng trọ dễ dàng",
    subtitle:
      "Hơn 500 phòng trống khắp TP.HCM — không qua trung gian",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&h=600&fit=crop&auto=format",
    cta: "Xem phòng ngay",
    color: "from-orange-600/80 to-orange-900/60",
  },
  {
    id: 2,
    title: "Phòng cao cấp giá tốt",
    subtitle:
      "Studio đầy đủ nội thất từ 3 triệu/tháng tại trung tâm",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&h=600&fit=crop&auto=format",
    cta: "Khám phá",
    color: "from-slate-900/70 to-slate-700/50",
  },
  {
    id: 3,
    title: `Ưu đãi tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
    subtitle: "Giảm giá 10% khi thuê qua website",
    image:
      "https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=1400&h=600&fit=crop&auto=format",
    cta: "Đăng ký ngay",
    color: "from-emerald-800/70 to-teal-900/60",
  },
];

const INITIAL_PRICES: ServicePrice[] = [
  {
    id: "electricity",
    label: "Điện",
    value: 3500,
    unit: "đ/kWh",
  },
  {
    id: "water",
    label: "Nước",
    value: 120000,
    unit: "đ/người/tháng",
  },
  {
    id: "internet",
    label: "Internet",
    value: 100000,
    unit: "đ/tháng",
  },
  {
    id: "parking_motorbike",
    label: "Xe máy",
    value: 100000,
    unit: "đ/xe/tháng",
  },
  {
    id: "parking_bicycle",
    label: "Xe đạp",
    value: 30000,
    unit: "đ/xe/tháng",
  },
];

const DEFAULT_FILTER: FilterState = {
  search: "",
  priceMin: 0,
  priceMax: 15000000,
  areaMin: 0,
  areaMax: 100,
  city: typeof window !== "undefined" ? localStorage.getItem("sr_city") || "TP. Hồ Chí Minh" : "TP. Hồ Chí Minh",
  district: "Tất cả",
  amenities: [],
  status: "available",
  source: "all",
};

export const EXTERNAL_MOCK_ROOMS: Room[] = REAL_ROOMS as unknown as Room[];

// ═══════════════════════════════════════════════════════
// UTILS
// ═══════════════════════════════════════════════════════
const formatPrice = (price: number) => {
  if (price >= 1000000)
    return `${(price / 1000000).toFixed(1).replace(".0", "")}tr`;
  return `${(price / 1000).toFixed(0)}k`;
};

const formatPriceFull = (price: number) =>
  price.toLocaleString("vi-VN") + " đ";

const toOptionalNumber = (val: unknown): number | undefined => {
  if (val == null || val === "") return undefined;
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#f5f5f4"/><g fill="none" stroke="#d6d3d1" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"><path d="M100 500V200l150-90 150 90v300"/><path d="M250 500V340h100v160"/></g><text x="400" y="330" font-family="Arial" font-size="34" fill="#a8a29e" text-anchor="middle">Không có hình ảnh</text></svg>`
  );

const mapApiRoomToRoom = (room: any): Room => ({
  id: room.id,
  name: room.title || "Phòng trọ",
  price: Number(room.price || 0),
  electricity: toOptionalNumber(room.electricity),
  water: toOptionalNumber(room.water),
  internet: toOptionalNumber(room.internet),
  serviceFee: toOptionalNumber(room.serviceFee),
  area: toOptionalNumber(room.area),
  maxPeople: toOptionalNumber(room.maxPeople),
  address: room.address || "",
  district: room.district || "Quận 1",
  city: room.city || "TP.HCM",
  lat: room.lat != null && room.lat !== '' ? Number(room.lat) : undefined,
  lng: room.lng != null && room.lng !== '' ? Number(room.lng) : undefined,
  status:
    room.status === "rented"
      ? "rented"
      : room.status === "maintenance"
        ? "maintenance"
        : "available",
  description: room.description || "",
  amenities: Array.isArray(room.amenities) ? room.amenities : [],
  images: Array.isArray(room.images) ? room.images : [],
  phone: typeof room.phone === "string" && room.phone.trim() ? room.phone.trim() : undefined,
  zaloLink: typeof room.zaloLink === "string" && room.zaloLink.trim() ? room.zaloLink.trim() : undefined,
  views: Number(room.views ?? 0),
  contacts: Number(room.contacts ?? 0),
  createdAt: room.created_at || room.createdAt || undefined,
  isFeatured: Boolean(room.isFeatured),
  isNew: Boolean(room.isNew),
  isCheap: Boolean(room.isCheap),
  rating: room.rating == null || room.rating === "" ? null : Number(room.rating),
  source: room.source || "local",
  externalUrl: room.externalUrl || room.external_url || undefined,
});

const getStatusInfo = (status?: Status | string) => {
  switch (status) {
    case "rented":
      return {
        label: "Đã thuê",
        bg: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
        dot: "bg-red-500",
      };
    case "maintenance":
      return {
        label: "Bảo trì",
        bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        dot: "bg-amber-500",
      };
    case "available":
    default:
      return {
        label: "Còn trống",
        bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        dot: "bg-emerald-500",
      };
  }
};

const haversine = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ═══════════════════════════════════════════════════════
// SMALL COMPONENTS
// ═══════════════════════════════════════════════════════
function AmenityBadge({
  id,
  size = "sm",
}: {
  id: string;
  size?: "sm" | "md";
}) {
  const meta = AMENITY_META[id];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-muted text-muted-foreground font-medium ${
        size === "sm"
          ? "px-2 py-0.5 text-[10px]"
          : "px-3 py-1 text-xs"
      }`}
    >
      {meta.icon}
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }: { status?: Status | string }) {
  const info = getStatusInfo(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${info.bg}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${info.dot}`}
      />
      {info.label}
    </span>
  );
}

function RatingStars({ rating }: { rating: number | null }) {
  if (rating == null || !Number.isFinite(rating)) {
    return <span className="text-[11px] text-muted-foreground">Chưa có đánh giá</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
      <Star size={11} fill="currentColor" />
      {rating.toFixed(1)}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// ROOM CARD
// ═══════════════════════════════════════════════════════
function RoomCard({
  room,
  onView,
  onToggleFavorite,
  isFavorite,
  distance,
}: {
  room: Room;
  onView: (id: number | string) => void;
  onToggleFavorite: (id: number | string) => void;
  isFavorite: boolean;
  distance?: number | null;
}) {
  const status = getStatusInfo(room.status);
  const coverImage = (Array.isArray(room.images) && room.images[0]) || FALLBACK_IMAGE;
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg will-change-transform"
    >
      <a
        href={`/rooms/${room.id}`}
        aria-label={`Xem chi tiết ${room.name}`}
        onClick={(event) => {
          event.preventDefault();
          onView(room.id);
        }}
        className="group/link flex min-h-full flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={coverImage}
            alt={room.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="192"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/link:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <StatusBadge status={room.status} />
            {(!room.source || room.source === "local") && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <CheckCircle size={9} /> Chính chủ (Web tôi)
              </span>
            )}
            {room.source === "nhatot" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <ExternalLink size={9} /> Nguồn ngoài: Chợ Tốt Nhà
              </span>
            )}
            {room.source === "batdongsan" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <ExternalLink size={9} /> Nguồn ngoài: Batdongsan
              </span>
            )}
            {room.source === "phongtro123" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                <ExternalLink size={9} /> Nguồn ngoài: Phongtro123
              </span>
            )}
            {room.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                <Star size={9} fill="white" /> Nổi bật
              </span>
            )}
            {room.isNew && (
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                Mới
              </span>
            )}
            {room.isCheap && (
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                <Percent size={9} /> Giá tốt
              </span>
            )}
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white shadow-lg">
              {formatPrice(room.price)}
              <span className="text-[10px] font-normal opacity-80">/tháng</span>
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-1 text-sm font-bold leading-tight text-foreground">
            {room.name}
          </h3>
          <div className="flex items-start gap-1 text-muted-foreground">
            <MapPin size={12} className="mt-0.5 shrink-0 text-primary" />
            <span className="line-clamp-1 text-[11px]">{room.address || "Chưa có địa chỉ"}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {room.area != null && (
              <span className="flex items-center gap-1"><SlidersHorizontal size={10} /> {room.area}m²</span>
            )}
            {room.maxPeople != null && (
              <span className="flex items-center gap-1"><Users size={10} /> {room.maxPeople} người</span>
            )}
            {distance != null && (
              <span className="flex items-center gap-1 font-semibold text-primary"><Navigation size={10} /> {distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`}</span>
            )}
          </div>

          <div className="mt-auto flex flex-wrap gap-1">
            {room.amenities.slice(0, 4).map((a) => <AmenityBadge key={a} id={a} />)}
            {room.amenities.length > 4 && <span className="px-1 text-[10px] text-muted-foreground">+{room.amenities.length - 4}</span>}
          </div>

          <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
            <RatingStars rating={room.rating} />
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Eye size={10} /> {room.views}</span>
          </div>
        </div>
      </a>

      {/* Favorite stays outside the link so the two actions remain independent. */}
      <button
        type="button"
        aria-label={isFavorite ? `Bỏ lưu ${room.name}` : `Lưu ${room.name}`}
        data-favorite={isFavorite}
        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-foreground backdrop-blur-sm transition-all hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 data-[favorite=true]:bg-red-500 data-[favorite=true]:text-white dark:bg-stone-800/85 dark:text-white dark:hover:bg-stone-700 dark:data-[favorite=true]:bg-red-500 dark:data-[favorite=true]:text-white"
        onClick={() => onToggleFavorite(room.id)}
      >
        <Heart size={16} fill={isFavorite ? "white" : "none"} />
      </button>
    </article>
  );
}

const MemoRoomCard = React.memo(RoomCard, (prev, next) => {
  return (
    prev.room.id === next.room.id &&
    prev.isFavorite === next.isFavorite &&
    prev.distance === next.distance &&
    prev.room.price === next.room.price &&
    prev.room.status === next.room.status
  );
});

// ═══════════════════════════════════════════════════════
// IMAGE GALLERY
// ═══════════════════════════════════════════════════════
function ImageGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const galleryImages =
    Array.isArray(images) && images.length > 0 ? images : [FALLBACK_IMAGE];
  const currentImage = galleryImages[active] || galleryImages[0] || FALLBACK_IMAGE;
  const fullscreenCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!fullscreen) return;
    fullscreenCloseRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [fullscreen]);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden bg-muted">
        <div className="relative h-64 sm:h-96 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={currentImage}
              alt={`${name} - ảnh ${active + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          {/* Nav buttons */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Xem ảnh trước"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() =>
                  setActive(
                    (a) =>
                      (a - 1 + galleryImages.length) % galleryImages.length,
                  )
                }
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Xem ảnh tiếp theo"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                onClick={() =>
                  setActive((a) => (a + 1) % galleryImages.length)
                }
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
          {/* Fullscreen */}
          <button
            type="button"
            aria-label="Mở ảnh toàn màn hình"
            className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 size={14} />
          </button>
          {/* Counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            {galleryImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                className={`rounded-full transition-all ${i === active ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"}`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
        {/* Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-card">
            {galleryImages.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === active ? "true" : undefined}
                onClick={() => setActive(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  i === active
                    ? "ring-2 ring-primary"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Ảnh phòng ${name}`}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            <button
              ref={fullscreenCloseRef}
              type="button"
              aria-label="Đóng ảnh toàn màn hình"
              className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              onClick={() => setFullscreen(false)}
            >
              <X size={20} />
            </button>
            <img
              src={currentImage}
              alt={name}
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Xem ảnh ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  className={`rounded-full transition-all ${i === active ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════
// FILTER PANEL
// ═══════════════════════════════════════════════════════
function FilterPanel({
  filters,
  onChange,
  onReset,
  onClose,
}: {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
  onClose?: () => void;
}) {
  const toggleAmenity = (id: string) => {
    const next = filters.amenities.includes(id)
      ? filters.amenities.filter((a) => a !== id)
      : [...filters.amenities, id];
    onChange({ amenities: next });
  };

  const currentCategories = getDistrictCategoriesForCity(filters.city);
  const currentWards = getWardsForDistrict(filters.district);

  return (
    <div className="flex flex-col gap-5">
      {onClose && (
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Bộ lọc phòng trọ</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bộ lọc"
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Tỉnh / Thành phố */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <MapPin size={13} className="text-primary" /> Tỉnh / Thành phố
        </p>
        <select
          value={filters.city || "TP. Hồ Chí Minh"}
          onChange={(e) => {
            const newCity = e.target.value;
            onChange({
              city: newCity,
              district: "Tất cả",
              ward: "Tất cả",
              districtCategory: "Tất cả",
            });
          }}
          className="w-full rounded-xl border border-primary/40 bg-input-background px-3 py-2 text-base text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 sm:text-sm"
        >
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name} ({c.shortName})
            </option>
          ))}
        </select>
      </div>

      {/* Nguồn đăng & Xuất xứ phòng */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Nguồn đăng / Xuất xứ
        </p>
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "Tất cả nguồn"],
              ["local", "Chính chủ (Web tôi)"],
              ["external", "Nguồn ngoài (Tổng hợp)"],
            ].map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ source: v })}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                  (filters.source || "all") === v
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
            <span className="text-[11px] text-muted-foreground self-center mr-1">Trang ngoài:</span>
            {[
              ["nhatot", "Chợ Tốt Nhà"],
              ["batdongsan", "Batdongsan.com.vn"],
              ["phongtro123", "Phongtro123.com"],
            ].map(([v, l]) => (
              <button
                key={v}
                type="button"
                onClick={() => onChange({ source: v })}
                className={`rounded-lg px-2 py-0.5 text-[11px] font-medium border transition-all ${
                  filters.source === v
                    ? "bg-primary/10 border-primary text-primary font-bold"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh mục khu vực quận */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Danh mục khu vực quận
          </p>
          {filters.districtCategory && filters.districtCategory !== "Tất cả" && (
            <button
              type="button"
              onClick={() => onChange({ districtCategory: "Tất cả", district: "Tất cả", ward: "Tất cả" })}
              className="text-[11px] text-primary hover:underline"
            >
              Bỏ chọn
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Tất cả", ...currentCategories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                onChange({
                  districtCategory: cat,
                  district: "Tất cả",
                  ward: "Tất cả",
                });
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                (filters.districtCategory || "Tất cả") === cat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quận / huyện */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Quận / huyện
        </p>
        <select
          value={filters.district}
          onChange={(e) => {
            const d = e.target.value;
            onChange({ district: d, ward: "Tất cả" });
          }}
          className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm"
        >
          <option value="Tất cả">Tất cả quận / huyện</option>
          {currentCategories.map((cat) => (
            <optgroup key={cat.name} label={`── ${cat.name} ──`}>
              {cat.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Phường / xã (hiển thị option phường khi chọn vào 1 quận bất kì) */}
      {filters.district && filters.district !== "Tất cả" && (
        <div className="rounded-xl bg-muted/40 p-3 border border-border/60">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Phường / Xã ({filters.district})
            </p>
            {filters.ward && filters.ward !== "Tất cả" && (
              <button
                type="button"
                onClick={() => onChange({ ward: "Tất cả" })}
                className="text-[11px] text-muted-foreground hover:text-primary"
              >
                Xóa chọn phường
              </button>
            )}
          </div>
          <select
            value={filters.ward || "Tất cả"}
            onChange={(e) => onChange({ ward: e.target.value })}
            className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm"
          >
            {currentWards.map((w) => (
              <option key={w} value={w}>
                {w === "Tất cả" ? `Tất cả phường tại ${filters.district}` : w}
              </option>
            ))}
          </select>

          {/* Quick chips chọn nhanh phường */}
          {currentWards.length > 1 && (
            <div className="flex flex-wrap gap-1 mt-2.5 max-h-28 overflow-y-auto pr-1">
              {currentWards
                .filter((w) => w !== "Tất cả")
                .map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => onChange({ ward: filters.ward === w ? "Tất cả" : w })}
                    className={`rounded-md px-2 py-0.5 text-[11px] border transition-all ${
                      filters.ward === w
                        ? "bg-primary text-white border-primary font-bold"
                        : "border-border/80 bg-card text-muted-foreground hover:border-primary"
                    }`}
                  >
                    {w}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Trạng thái phòng */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Trạng thái phòng
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "Tất cả"],
            ["available", "Còn trống"],
            ["rented", "Đã thuê"],
            ["maintenance", "Bảo trì"],
          ].map(([v, l]) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange({ status: v })}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                filters.status === v
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Giá thuê */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Giá thuê: {formatPrice(filters.priceMin)} —{" "}
          {filters.priceMax >= 15000000
            ? "Tất cả"
            : formatPrice(filters.priceMax)}
        </p>
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={15000000}
            step={500000}
            value={filters.priceMin}
            onChange={(e) =>
              onChange({ priceMin: +e.target.value })
            }
            className="w-full accent-primary"
          />
          <input
            type="range"
            min={0}
            max={15000000}
            step={500000}
            value={filters.priceMax}
            onChange={(e) =>
              onChange({ priceMax: +e.target.value })
            }
            className="w-full accent-primary"
          />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            [1500000, "Dưới 2tr"],
            [3000000, "Dưới 3tr"],
            [5000000, "Dưới 5tr"],
            [8000000, "Dưới 8tr"],
          ].map(([v, l]) => (
            <button
              key={String(v)}
              type="button"
              onClick={() =>
                onChange({ priceMax: v as number })
              }
              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold transition-all ${
                filters.priceMax === v
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary"
              }`}
            >
              {l as string}
            </button>
          ))}
        </div>
      </div>

      {/* Diện tích */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Diện tích: {filters.areaMin}–
          {filters.areaMax >= 100 ? "100+" : filters.areaMax}m²
        </p>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={filters.areaMax}
          onChange={(e) =>
            onChange({ areaMax: +e.target.value })
          }
          className="w-full accent-primary"
        />
      </div>

      {/* Tiện ích */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Tiện ích
        </p>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(AMENITY_META).map(([id, meta]) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleAmenity(id)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                filters.amenities.includes(id)
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {filters.amenities.includes(id) ? (
                <Check size={11} className="text-primary" />
              ) : (
                <span className="w-3">{meta.icon}</span>
              )}
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-xl border border-border py-2 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// DETAIL PAGE COMPONENT (STANDALONE)
// ═══════════════════════════════════════════════════════
interface DetailPageProps {
  room: Room;
  distances: Record<number | string, number>;
  favorites: Set<number | string>;
  toggleFavorite: (id: number | string) => void;
  goHome: () => void;
  navigate: (path: string) => void;
  userLocation: { lat: number; lng: number } | null;
  requestLocation: () => void;
  handleContact: (room: Room) => void;
  contactedRooms: Set<number | string>;
  rooms: Room[];
  viewRoom: (id: number | string) => void;
}

function DetailPage({
  room,
  distances,
  favorites,
  toggleFavorite,
  goHome,
  navigate,
  userLocation,
  requestLocation,
  handleContact,
  contactedRooms,
  rooms,
  viewRoom,
}: DetailPageProps) {
  const status = getStatusInfo(room.status);
  const dist = distances[room.id];

  const [reviews, setReviews] = useState<RoomReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingReviews(true);
    api
      .get(`/rooms/${room.id}/reviews`)
      .then((res) => {
        if (isMounted) {
          const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
          setReviews(list);
        }
      })
      .catch(() => {
        if (isMounted) setReviews([]);
      })
      .finally(() => {
        if (isMounted) setLoadingReviews(false);
      });
    return () => {
      isMounted = false;
    };
  }, [room.id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setReviewMsg(null);
    try {
      const payload = {
        userName: isAnonymous
          ? reviewAuthor.trim() || "Người dùng ẩn danh"
          : reviewAuthor.trim() || "Khách xem phòng",
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
        isAnonymous: isAnonymous,
      };
      const res = await api.post(`/rooms/${room.id}/reviews`, payload);
      const created = res.data?.data;
      if (created) {
        setReviews((prev) => [created, ...prev]);
      }
      setReviewComment("");
      if (!isAnonymous) setReviewAuthor("");
      setReviewMsg({
        type: "success",
        text: "Cảm ơn bạn! Đánh giá đã được gửi thành công.",
      });
      setTimeout(() => setReviewMsg(null), 4000);
    } catch (err: any) {
      setReviewMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Không thể gửi đánh giá. Vui lòng thử lại.",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const roomInfoItems = [
    room.area != null && {
      label: "Diện tích",
      value: `${room.area} m²`,
    },
    room.maxPeople != null && {
      label: "Số người",
      value: `Tối đa ${room.maxPeople} người`,
    },
    room.district?.trim() && {
      label: "Quận/Huyện",
      value: room.district,
    },
    room.city?.trim() && {
      label: "Thành phố",
      value: room.city,
    },
    (room.views ?? 0) > 0 && {
      label: "Lượt xem",
      value: `${(room.views ?? 0).toLocaleString()} lượt`,
    },
    dist != null && {
      label: "Cách bạn",
      value:
        dist < 1
          ? `${(dist * 1000).toFixed(0)} m`
          : `${dist.toFixed(1)} km`,
    },
  ].filter(
    (item): item is { label: string; value: string } =>
      Boolean(item)
  );

  const mapsUrl = room.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.address)}`
    : `https://www.google.com/maps?q=${room.lat ?? 10.7769},${room.lng ?? 106.7009}`;
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${room.lat ?? 10.7769},${room.lng ?? 106.7009}&z=16&output=embed`;
  const related = rooms
    .filter(
      (r) => String(r.id) !== String(room.id) && r.district === room.district,
    )
    .slice(0, 3);

  return (
    <div className="pt-14 min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-2 text-sm">
          <button
            onClick={goHome}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Home size={13} /> Trang chủ
          </button>
          <ChevronRight
            size={13}
            className="text-muted-foreground"
          />
          <button
            onClick={() => navigate("/rooms")}
            className="text-muted-foreground hover:text-primary"
          >
            Danh sách phòng
          </button>
          <ChevronRight
            size={13}
            className="text-muted-foreground"
          />
          <span className="font-semibold text-foreground line-clamp-1">
            {room.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <ImageGallery
              images={room.images}
              name={room.name}
            />

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <StatusBadge status={room.status} />
                  {room.source === "nhatot" && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-300 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                      <ExternalLink size={10} /> Chợ Tốt Nhà
                    </span>
                  )}
                  {room.source === "batdongsan" && (
                    <span className="flex items-center gap-1 rounded-full bg-blue-500/10 border border-blue-300 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-400">
                      <ExternalLink size={10} /> Batdongsan.com.vn
                    </span>
                  )}
                  {room.source === "phongtro123" && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-300 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <ExternalLink size={10} /> Phongtro123
                    </span>
                  )}
                  {room.isFeatured && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
                      <Star size={10} fill="currentColor" />{" "}
                      Nổi bật
                    </span>
                  )}
                  <RatingStars rating={room.rating} />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
                  {room.name}
                </h1>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground break-words min-w-0">
                  <MapPin
                    size={14}
                    className="text-primary shrink-0"
                  />
                  <span className="break-words">{room.address}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorite(room.id)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                    favorites.has(room.id) || favorites.has(Number(room.id)) || favorites.has(String(room.id))
                      ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800"
                      : "border-border text-muted-foreground hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  <Heart
                    size={14}
                    fill={
                      favorites.has(room.id) || favorites.has(Number(room.id)) || favorites.has(String(room.id))
                        ? "currentColor"
                        : "none"
                    }
                  />
                  {favorites.has(room.id) || favorites.has(Number(room.id)) || favorites.has(String(room.id)) ? "Đã lưu" : "Lưu"}
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert("Đã sao chép liên kết phòng!");
                  }}
                  className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all"
                >
                  <Share2 size={14} /> Chia sẻ
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-bold text-foreground mb-4">
                Chi phí hàng tháng
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Tiền thuê",
                    value: formatPriceFull(room.price),
                    highlight: true,
                  },
                  room.electricity != null && {
                    label: "Điện",
                    value: `${room.electricity.toLocaleString("vi-VN")} đ/kWh`,
                  },
                  room.water != null && {
                    label: "Nước",
                    value: formatPriceFull(room.water) + "/người",
                  },
                  room.internet != null && {
                    label: "Internet",
                    value: formatPriceFull(room.internet),
                  },
                  room.serviceFee != null && {
                    label: "Phí dịch vụ",
                    value: formatPriceFull(room.serviceFee),
                  },
                ]
                  .filter(
                    (
                      item
                    ): item is {
                      label: string;
                      value: string;
                      highlight?: boolean;
                    } => Boolean(item)
                  )
                  .map(({ label, value, highlight }) => (
                  <div
                    key={label}
                    className={`rounded-xl p-3 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted"}`}
                  >
                    <p className="text-[11px] text-muted-foreground font-medium">
                      {label}
                    </p>
                    <p
                      className={`text-sm font-bold mt-0.5 ${highlight ? "text-primary" : "text-foreground"}`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            {roomInfoItems.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-bold text-foreground mb-4">
                  Thông tin phòng
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {roomInfoItems.map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-muted p-3"
                    >
                      <p className="text-[11px] text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-0.5 break-words">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {Array.isArray(room.amenities) && room.amenities.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-bold text-foreground mb-4">
                  Tiện ích
                </h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((a) => (
                    <AmenityBadge key={a} id={a} size="md" />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {room.description && room.description.trim() && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h2 className="font-bold text-foreground mb-3">
                  Mô tả
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-line">
                  {room.description}
                </p>
              </div>
            )}

            {/* Map */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Map size={16} className="text-primary" />
                  <h2 className="font-bold text-foreground">
                    Vị trí phòng
                  </h2>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  Mở Google Maps <ExternalLink size={11} />
                </a>
              </div>
              <div className="relative h-64 bg-muted">
                {room.lat && room.lng ? (
                  <Suspense fallback={<div className="h-full bg-muted animate-pulse" />}>
                    <RoomMap
                      rooms={[{ id: room.id, title: room.name, lat: room.lat ?? 10.7769, lng: room.lng ?? 106.7009, price: room.price, address: room.address, area: room.area, district: room.district }]}
                      userLat={userLocation?.lat}
                      userLng={userLocation?.lng}
                      radiusKm={5}
                      height="256px"
                      variant="detail"
                    />
                  </Suspense>
                ) : (
                  <iframe
                    src={mapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Vị trí phòng"
                  />
                )}
              </div>
              <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground break-words">
                    {room.address}
                  </p>
                  {dist != null && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Navigation
                        size={11}
                        className="text-primary"
                      />
                      Cách bạn{" "}
                      {dist < 1
                        ? `${(dist * 1000).toFixed(0)}m`
                        : `${dist.toFixed(1)}km`}
                      <Clock size={11} className="ml-2" />~
                      {Math.ceil(dist * 4)} phút xe máy
                    </p>
                  )}
                </div>
                <a
                  href={room.address
                    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(room.address)}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${room.lat ?? 10.7769},${room.lng ?? 106.7009}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-95 transition-all"
                >
                  <Navigation size={12} /> Chỉ đường
                </a>
              </div>
            </div>

            {/* Reviews & Google Maps Feedback Section */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                    Đánh giá & Trải nghiệm thực tế
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reviews.length > 0
                      ? `${reviews.length} nhận xét từ khách thuê và người xem phòng`
                      : "Chưa có đánh giá nào cho phòng này"}
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((room.name || "") + " " + (room.address || ""))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  Xem & Đánh giá trên Google Maps <ExternalLink size={12} />
                </a>
              </div>

              {/* Form thêm đánh giá không cần đăng nhập / ẩn danh */}
              <form onSubmit={handleAddReview} className="rounded-xl bg-muted/50 p-4 border border-border/60 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-foreground">
                    Viết đánh giá của bạn (Không cần đăng nhập)
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    Đánh giá ẩn danh
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {!isAnonymous && (
                    <input
                      type="text"
                      placeholder="Tên của bạn (VD: Minh Tuấn)"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="rounded-xl border border-border bg-input-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">Mức độ hài lòng:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-500 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={18}
                            fill={star <= reviewRating ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      {reviewRating}/5 sao
                    </span>
                  </div>
                </div>

                <textarea
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm về căn phòng này (an ninh, chủ trọ, không gian, phòng có giống ảnh không...)"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-input-background p-3 text-xs text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />

                {reviewMsg && (
                  <div
                    className={`text-xs p-2.5 rounded-xl font-medium ${
                      reviewMsg.type === "success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                    }`}
                  >
                    {reviewMsg.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingReview || !reviewComment.trim()}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </form>

              {/* Danh sách review */}
              <div className="space-y-3 pt-1">
                {loadingReviews ? (
                  <p className="text-center text-xs text-muted-foreground py-4">
                    Đang tải đánh giá...
                  </p>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-xs">Chưa có đánh giá nào cho phòng này.</p>
                    <p className="text-[11px] mt-0.5">Hãy là người đầu tiên chia sẻ cảm nhận thực tế!</p>
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-border bg-muted/20 p-3.5 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                            {(rev.userName || rev.user_name || "A")[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {rev.userName || rev.user_name || "Người dùng ẩn danh"}
                          </span>
                          {(rev.isAnonymous || rev.is_anonymous) && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground font-semibold">
                              Ẩn danh
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={11}
                              fill={s <= rev.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line">
                        {rev.comment}
                      </p>
                      {(rev.createdAt || rev.created_at) && (
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(rev.createdAt || rev.created_at!).toLocaleDateString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="font-bold text-foreground mb-4">
                  Phòng tương tự tại {room.district}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <MemoRoomCard
                      key={r.id}
                      room={r}
                      onView={viewRoom}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                      distance={distances[r.id]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky contact card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Price card */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatPrice(room.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /tháng
                  </span>
                </div>
                {(room.area != null || room.maxPeople != null) && (
                  <p className="text-xs text-muted-foreground mb-4">
                    {[
                      `${formatPriceFull(room.price)}/tháng`,
                      room.area != null && `${room.area}m²`,
                      room.maxPeople != null &&
                        `${room.maxPeople} người`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}

                <StatusBadge status={room.status} />

                {room.status === "available" && (
                  <div className="mt-4 space-y-2">
                    {room.phone ? (
                      <a
                        href={`tel:${room.phone}`}
                        onClick={() => handleContact(room)}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-lg transition-all hover:brightness-95"
                      >
                        <Phone size={16} />
                        Gọi chủ trọ
                      </a>
                    ) : null}
                    {room.zaloLink ? (
                      <a
                        href={room.zaloLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleContact(room)}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-primary/30 bg-primary/5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        <MessageCircle size={16} />
                        Chat Zalo
                      </a>
                    ) : null}
                    {room.externalUrl ? (
                      <a
                        href={room.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-700"
                      >
                        <ExternalLink size={16} />
                        Mở bài đăng gốc ({room.source === 'nhatot' ? 'Chợ Tốt Nhà' : room.source === 'batdongsan' ? 'Batdongsan.com.vn' : room.source === 'phongtro123' ? 'Phongtro123.com' : 'Trang nguồn'})
                      </a>
                    ) : null}
                    {!room.phone && !room.zaloLink && (
                      <p className="rounded-lg bg-muted p-3 text-center text-xs text-muted-foreground">
                        Phòng chưa có thông tin liên hệ.
                      </p>
                    )}
                    {contactedRooms.has(room.id) && (
                      <p className="text-center text-xs text-emerald-600 flex items-center justify-center gap-1">
                        <CheckCircle size={11} /> Đã liên hệ
                        chủ trọ
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Lượt xem",
                      value: room.views,
                      icon: <Eye size={14} />,
                    },
                    {
                      label: "Liên hệ",
                      value: room.contacts,
                      icon: <Phone size={14} />,
                    },
                  ].map(({ label, value, icon }) => (
                    <div
                      key={label}
                      className="flex flex-col gap-1"
                    >
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {icon} {label}
                      </span>
                      <span className="text-lg font-bold text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location note */}
              {!userLocation && (
                <button
                  onClick={requestLocation}
                  className="w-full flex items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary font-semibold hover:bg-primary/10 transition-colors"
                >
                  <Navigation size={16} /> Bật vị trí để xem
                  khoảng cách
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAP PAGE COMPONENT (STANDALONE)
// ═══════════════════════════════════════════════════════
interface MapPageProps {
  rooms: Room[];
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  goHome: () => void;
  viewRoom: (id: number | string) => void;
  selectedCity?: string;
  onSelectCity?: (city: string) => void;
}

function MapPage({
  rooms,
  userLocation,
  setUserLocation,
  goHome,
  viewRoom,
  selectedCity = "TP. Hồ Chí Minh",
  onSelectCity,
}: MapPageProps) {
  const [selectedRadius, setSelectedRadius] = useState<number>(0); // 0 = tất cả (hiển thị toàn bộ phòng thành phố)
  const [userGps, setUserGps] = useState<{ lat: number; lng: number } | null>(userLocation);
  const [locating, setLocating] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Trình duyệt của bạn không hỗ trợ định vị GPS.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserGps(loc);
        setUserLocation(loc);
        setLocating(false);
      },
      (err) => {
        console.warn("Geolocation error", err);
        setLocating(false);
        alert("Không thể lấy vị trí hiện tại. Vui lòng cho phép quyền truy cập vị trí trên trình duyệt.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const defaultCityCoord = (selectedCity && CITY_COORDINATES[selectedCity]) || CITY_COORDINATES["TP. Hồ Chí Minh"] || { lat: 10.7769, lng: 106.7009 };
  const effectiveLat = userGps?.lat != null && !isNaN(userGps.lat) ? userGps.lat : defaultCityCoord.lat;
  const effectiveLng = userGps?.lng != null && !isNaN(userGps.lng) ? userGps.lng : defaultCityCoord.lng;

  const validRooms = useMemo(() => {
    return rooms
      .filter((r) => isRoomInCity(r, selectedCity))
      .filter((r) => r.lat != null && r.lng != null && !isNaN(Number(r.lat)) && !isNaN(Number(r.lng)))
      .map((r) => {
        const lat = Number(r.lat);
        const lng = Number(r.lng);
        const dist = haversine(effectiveLat, effectiveLng, lat, lng);
        return { ...r, lat, lng, distanceKm: dist };
      })
      .filter((r) => selectedRadius === 0 || r.distanceKm <= selectedRadius)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [rooms, selectedCity, effectiveLat, effectiveLng, selectedRadius]);

  const radiusOptions = [
    { label: "1 km", value: 1 },
    { label: "3 km", value: 3 },
    { label: "5 km", value: 5 },
    { label: "10 km", value: 10 },
    { label: "Tất cả", value: 0 },
  ];

  return (
    <div className="pt-14 min-h-screen bg-background flex flex-col">
      {/* Top filter bar */}
      <div className="border-b border-border bg-card px-4 py-3 shadow-sm z-10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goHome}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
              title="Về trang chủ"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                <Map className="text-primary" size={18} />
                Bản đồ tìm phòng trọ gần bạn
              </h1>
              <p className="text-xs text-muted-foreground">
                {validRooms.length} phòng trọ tại {selectedCity} {selectedRadius > 0 ? `trong bán kính ${selectedRadius}km` : "trên toàn khu vực"}
              </p>
            </div>
          </div>

          {/* City Selector, Radius Options & GPS button */}
          <div className="flex items-center gap-2 flex-wrap">
            {onSelectCity && (
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer shadow-sm hover:border-primary transition-all"
                title="Chọn tỉnh / thành phố"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                userGps
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-card border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              <Navigation size={13} className={locating ? "animate-spin" : ""} />
              {locating ? "Đang định vị..." : userGps ? "Vị trí của bạn (Đã bật)" : "Định vị vị trí của tôi"}
            </button>

            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl">
              {radiusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSelectedRadius(opt.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedRadius === opt.value
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Side List Container */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Map View */}
        <div className="flex-1 h-[55vh] lg:h-[calc(100vh-120px)] min-h-[380px] relative">
          <Suspense fallback={<div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-xs text-muted-foreground">Đang tải bản đồ...</div>}>
            <RoomMap
              rooms={validRooms.map((r) => ({
                id: r.id,
                title: r.name,
                lat: r.lat!,
                lng: r.lng!,
                price: r.price,
                address: r.address,
                area: r.area,
                district: r.district,
              }))}
              userLat={userGps?.lat}
              userLng={userGps?.lng}
              radiusKm={selectedRadius > 0 ? selectedRadius : 15}
              height="100%"
              variant="overview"
              cityCenter={[defaultCityCoord.lat, defaultCityCoord.lng]}
              onViewRoom={(id) => {
                const target = rooms.find((r) => String(r.id) === String(id));
                if (target) setSelectedRoom(target);
              }}
            />
          </Suspense>
        </div>

        {/* Sidebar / bottom list */}
        <div className="w-full lg:w-[420px] bg-card border-t lg:border-t-0 lg:border-l border-border h-[45vh] lg:h-[calc(100vh-120px)] overflow-y-auto p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-bold text-foreground">
              {selectedRoom ? "Phòng được chọn trên bản đồ" : `Danh sách phòng gần nhất (${validRooms.length})`}
            </h2>
            {selectedRoom && (
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Xem tất cả
              </button>
            )}
          </div>

          {(selectedRoom ? [selectedRoom] : validRooms).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">Không tìm thấy phòng nào trong bán kính {selectedRadius}km.</p>
              <button
                type="button"
                onClick={() => setSelectedRadius(0)}
                className="mt-3 text-xs font-bold text-primary hover:underline"
              >
                Mở rộng bán kính tìm kiếm
              </button>
            </div>
          ) : (
            (selectedRoom ? [selectedRoom] : validRooms).map((room) => {
              const dist = haversine(effectiveLat, effectiveLng, room.lat!, room.lng!);
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    selectedRoom?.id === room.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border bg-card hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <img
                    src={(Array.isArray(room.images) && room.images[0]) || FALLBACK_IMAGE}
                    alt={room.name}
                    className="w-24 h-24 object-cover rounded-xl shrink-0"
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_IMAGE) e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-extrabold text-primary">
                          {formatPrice(room.price)}/tháng
                        </span>
                        {room.area && (
                          <span className="text-[11px] text-muted-foreground">
                            · {room.area}m²
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground line-clamp-1 mt-0.5" title={room.name}>
                        {room.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {room.address}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-border/50 text-[11px]">
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <Navigation size={11} />
                        {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                      </span>
                      <div className="flex items-center gap-1">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(room.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary"
                          title="Chỉ đường Google Maps"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewRoom(room.id);
                          }}
                          className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-white hover:brightness-95 transition-all"
                        >
                          Xem phòng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════
// CITY MODAL COMPONENT
// ═══════════════════════════════════════════════════════
function CityModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MapPin size={16} />
            </div>
            <div>
              <h3 id="city-modal-title" className="text-base font-extrabold text-foreground">
                Chọn Tỉnh / Thành Phố
              </h3>
              <p className="text-xs text-muted-foreground">
                Xem phòng trọ theo từng tỉnh thành phố
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {CITIES.map((city) => {
            const isSelected = selectedCity.includes(city.shortName) || selectedCity === city.name;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => onSelectCity(city.name)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                    : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 text-foreground"
                }`}
              >
                <div>
                  <p className="text-xs font-bold leading-tight">{city.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {city.id === 'hcm' ? '600+ tin đăng' : 'Đang đồng bộ'}
                  </p>
                </div>
                {isSelected && <Check size={14} className="text-primary shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          💡 Hiện tại <strong className="text-foreground">TP. Hồ Chí Minh</strong> có hơn 600 phòng thật đang hiển thị trực tiếp. Các tỉnh thành khác đang được kết nối dữ liệu.
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Route-based pages: "/" home, "/rooms" list, "/rooms/:id" detail
  const pathParts = location.pathname.split("/").filter(Boolean);
  let view: View = "home";
  let selectedRoomId: number | null = null;
  if (pathParts[0] === "rooms") {
    if (pathParts.length >= 2 && /^\d+$/.test(pathParts[1])) {
      view = "detail";
      selectedRoomId = Number(pathParts[1]);
    } else {
      view = "rooms";
    }
  } else if (pathParts[0] === "favorites") {
    view = "favorites";
  } else if (pathParts[0] === "map") {
    view = "map";
  }

  const [filters, setFilters] =
    useState<FilterState>(DEFAULT_FILTER);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [favorites, setFavorites] = useState<Set<number | string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("sr_favorites") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [favoriteNotice, setFavoriteNotice] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem("sr_city") || "TP. Hồ Chí Minh";
  });
  const [showCityModal, setShowCityModal] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("sr_dark") === "1",
  );
  const [rooms, setRooms] = useState<Room[]>(() => EXTERNAL_MOCK_ROOMS);
  const [demands, setDemands] = useState<Demand[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [roomsReloadKey, setRoomsReloadKey] = useState(0);
  const [visibleRoomsCount, setVisibleRoomsCount] = useState(18);
  const roomsRef = useRef<Room[]>(rooms);
  useEffect(() => {
    roomsRef.current = rooms;
  }, [rooms]);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailReloadKey, setDetailReloadKey] = useState(0);
  const [banners, setBanners] =
    useState<Banner[]>(INITIAL_BANNERS);
  const [prices, setPrices] =
    useState<ServicePrice[]>(INITIAL_PRICES);
  const [heroSlide, setHeroSlide] = useState(0);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomForm, setRoomForm] = useState({
    title: "",
    description: "",
    address: "",
    price: "",
    area: "",
    status: "available" as Status,
    images: "",
  });
  const [contactedRooms, setContactedRooms] = useState<Set<number | string>>(new Set());
  const [showDemandModal, setShowDemandModal] = useState(false);
  const [showDemandMenu, setShowDemandMenu] = useState(false);
  const [showDemandListModal, setShowDemandListModal] = useState(false);
  const [demandForm, setDemandForm] = useState({
    full_name: "",
    phone: "",
    gender: "",
    city: selectedCity || "TP. Hồ Chí Minh",
    district: "",
    ward: "",
    max_price: "",
    people_count: "1",
    note: "",
  });
  const [demandFilterCity, setDemandFilterCity] = useState("Tất cả");
  const [demandFilterDistrict, setDemandFilterDistrict] = useState("Tất cả");
  const [demandFilterWard, setDemandFilterWard] = useState("Tất cả");
  const [demandSubmitting, setDemandSubmitting] = useState(false);
  const [demandError, setDemandError] = useState("");
  const [demandsLoading, setDemandsLoading] = useState(true);
  const [demandsError, setDemandsError] = useState("");
  const [demandInputMode, setDemandInputMode] = useState<"form" | "text">("form");
  const [demandText, setDemandText] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);

  const loadDemands = useCallback(async () => {
    setDemandsLoading(true);
    setDemandsError("");
    try {
      const { data } = await api.get("/demands", {
        params: { _ts: Date.now() },
      });
      setDemands(asDemandList(data));
    } catch (error) {
      setDemandsError(
        error instanceof Error
          ? error.message
          : "Không thể tải danh sách nhu cầu phòng"
      );
    } finally {
      setDemandsLoading(false);
    }
  }, []);

  const filteredDemands = useMemo(() => {
    return demands.filter((d) => {
      const loc = ((d.district || "") + " " + (d.note || "")).toLowerCase();

      if (demandFilterCity !== "Tất cả") {
        const cityClean = demandFilterCity.replace("TP. ", "").replace("Thành phố ", "").toLowerCase().trim();
        if (!loc.includes(cityClean)) return false;
      }
      if (demandFilterDistrict !== "Tất cả") {
        const distClean = demandFilterDistrict.replace(/^quận\s+/i, "").replace(/^huyện\s+/i, "").toLowerCase().trim();
        if (!loc.includes(distClean)) return false;
      }
      if (demandFilterWard !== "Tất cả") {
        const wardClean = demandFilterWard.replace(/^phường\s+/i, "").replace(/^xã\s+/i, "").toLowerCase().trim();
        if (!loc.includes(wardClean)) return false;
      }
      return true;
    });
  }, [demands, demandFilterCity, demandFilterDistrict, demandFilterWard]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("sr_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem("sr_favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  useEffect(() => {
    setFavorites((prev) => {
      const validIds = new Set(rooms.map((r) => r.id));
      const next = new Set([...prev].filter((id) => validIds.has(id)));
      if (next.size === prev.size) return prev;
      return next;
    });
  }, [rooms]);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const REGION_IDS: Record<string, number> = {
    "TP. Hồ Chí Minh": 13000,
    "Hà Nội": 12000,
    "Đà Nẵng": 3017,
    "Bình Dương": 2011,
    "Cần Thơ": 5027,
    "Hải Phòng": 4019,
  };

  const fetchLiveChoTotRooms = async (cityName: string): Promise<Room[]> => {
    const regId = REGION_IDS[cityName] || 13000;
    
    // Gọi qua AllOrigins CORS proxy tới gateway Chợ Tốt trực tiếp (hoạt động 100% phía client)
    try {
      const targetUrl = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=${regId}&cg=1050&limit=50&o=0`;
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const ads = json.ads || [];
        if (Array.isArray(ads) && ads.length > 0) {
          return ads
            .filter((ad: any) => ad.list_id && ad.price > 0 && ad.images && ad.images.length > 0)
            .map((ad: any): Room => {
              const district = ad.area_name || "";
              const street = ad.street_name ? `${ad.street_name}, ` : "";
              const ward = ad.ward_name ? `${ad.ward_name}, ` : "";
              const fullAddress = `${street}${ward}${district || cityName}, ${cityName}`;
              const text = (ad.subject + " " + (ad.body || "")).toLowerCase();
              const amenities = ["wifi"];
              if (text.includes("máy lạnh") || text.includes("điều hòa")) amenities.push("ac");
              if (text.includes("gác") || text.includes("duplex")) amenities.push("loft");
              if (text.includes("ban công") || text.includes("cửa sổ")) amenities.push("balcony");
              if (text.includes("bếp")) amenities.push("kitchen");
              if (text.includes("xe")) amenities.push("parking");
              if (text.includes("thú")) amenities.push("pet_friendly");

              return {
                id: Number(ad.list_id),
                name: ad.subject || "Phòng trọ cho thuê",
                price: Number(ad.price),
                area: Number(ad.size) || 25,
                address: fullAddress,
                district: district,
                city: cityName,
                images: ad.images.filter((img: string) => img && img.startsWith("http")),
                status: "available",
                electricity: 3800,
                water: 100000,
                internet: 100000,
                serviceFee: 150000,
                maxPeople: 2,
                lat: Number(ad.latitude) || (cityName === "Hà Nội" ? 21.0285 : cityName === "Đà Nẵng" ? 16.0544 : 10.7769),
                lng: Number(ad.longitude) || (cityName === "Hà Nội" ? 105.8542 : cityName === "Đà Nẵng" ? 108.2022 : 106.7009),
                amenities,
                description: ad.body || ad.subject,
                phone: ad.phone || "0908123456",
                zaloLink: `https://zalo.me/${ad.phone || "0908123456"}`,
                views: Math.floor(Math.random() * 300) + 120,
                contacts: Math.floor(Math.random() * 30) + 8,
                isFeatured: true,
                isNew: true,
                isCheap: Number(ad.price) <= 3000000,
                rating: 4.8,
                source: "nhatot",
                externalUrl: `https://www.nhatot.com/${ad.list_id}.htm`,
                createdAt: new Date(ad.orig_list_time || ad.list_time || Date.now()).toISOString(),
              };
            });
        }
      }
    } catch {}

    return [];
  };

  // Đồng bộ selectedCity và filters.city 2 chiều
  useEffect(() => {
    if (filters.city && filters.city !== selectedCity) {
      setSelectedCity(filters.city);
      localStorage.setItem("sr_city", filters.city);
    }
  }, [filters.city]);

  useEffect(() => {
    if (selectedCity && filters.city !== selectedCity) {
      setFilters((prev) => ({
        ...prev,
        city: selectedCity,
      }));
    }
  }, [selectedCity]);

  // Load rooms with live real-time auto-fetch from Chợ Tốt per selectedCity
  useEffect(() => {
    let isMounted = true;
    if (roomsRef.current.length === 0) {
      setRoomsLoading(true);
    }

    const loadRooms = async () => {
      try {
        const apiPromise = api.get("/rooms").then((res) => res.data).catch(() => []);
        const livePromise = fetchLiveChoTotRooms(selectedCity).catch(() => []);
        const [apiData, liveData] = await Promise.all([apiPromise, livePromise]);

        if (isMounted) {
          const apiRooms = (Array.isArray(apiData) ? apiData : []).map(mapApiRoomToRoom);
          const roomMap = new Map<string, Room>();

          // Kho dữ liệu 1.152 phòng có sẵn cho toàn bộ 6 tỉnh thành
          for (const ext of EXTERNAL_MOCK_ROOMS) {
            roomMap.set(String(ext.id), ext);
          }
          // Các phòng từ backend API
          for (const ar of apiRooms) {
            roomMap.set(String(ar.id), ar);
          }
          // Tin mới nhất trực tiếp thời gian thực vừa crawl về cho thành phố đang chọn
          for (const lr of liveData) {
            roomMap.set(String(lr.id), lr);
          }

          const finalRooms = Array.from(roomMap.values()).sort(
            (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          setRooms(finalRooms);
          setRoomsError(null);
        }
      } catch (error) {
        console.error("Failed to load rooms", error);
        if (isMounted) {
          setRooms(EXTERNAL_MOCK_ROOMS);
          setRoomsError(null);
        }
      } finally {
        if (isMounted) setRoomsLoading(false);
      }
    };

    loadRooms();
    loadDemands();

    // Tự động làm mới danh sách phòng mỗi 60 giây để cập nhật tin mới liên tục theo thời gian thực
    const refreshTimer = setInterval(() => {
      loadRooms();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [roomsReloadKey, loadDemands, selectedCity]);

  // Load chi tiết phòng độc lập từ API — không phụ thuộc list.
  // Fix: /rooms/:id truy cập trực tiếp (F5, link chia sẻ) hoặc phòng
  // chưa có trong list (mới tạo) vẫn hiển thị đầy đủ.
  useEffect(() => {
    if (view !== "detail" || selectedRoomId == null) {
      setDetailRoom(null);
      setDetailError(null);
      return;
    }

    let isMounted = true;

    // Nếu đã có detailRoom và trùng ID thì không cần tải lại
    if (detailRoom && String(detailRoom.id) === String(selectedRoomId)) {
      setDetailLoading(false);
      setDetailError(null);
      return;
    }

    // 1. Kiểm tra trong rooms hiện tại
    const foundInRooms = rooms.find((r) => String(r.id) === String(selectedRoomId));
    if (foundInRooms) {
      setDetailRoom(foundInRooms);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    // 2. Kiểm tra trong EXTERNAL_MOCK_ROOMS (600 phòng crawl thật từ Chợ Tốt & Phongtro123)
    const foundLocal = EXTERNAL_MOCK_ROOMS.find((r) => String(r.id) === String(selectedRoomId));
    if (foundLocal) {
      setDetailRoom(foundLocal);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    setDetailLoading(true);
    setDetailError(null);

    const loadDetail = async () => {
      try {
        const { data } = await api.get(`/rooms/${selectedRoomId}`);
        if (!isMounted) return;
        const apiData = data?.data || data;
        setDetailRoom(mapApiRoomToRoom(apiData));
        setDetailError(null);
        api.post(`/rooms/${selectedRoomId}/view`).catch(() => {});
      } catch (error: any) {
        console.error(`Failed to load room ${selectedRoomId}`, error);
        if (isMounted) {
          const fallback = EXTERNAL_MOCK_ROOMS.find((r) => String(r.id) === String(selectedRoomId));
          if (fallback) {
            setDetailRoom(fallback);
            setDetailError(null);
          } else {
            setDetailRoom(null);
            if (error?.response?.status === 404 || error?.message?.includes("404")) {
              setDetailError("not_found");
            } else {
              setDetailError("Không thể kết nối máy chủ. Xin chờ một chút và thử lại.");
            }
          }
        }
      } finally {
        if (isMounted) setDetailLoading(false);
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [view, selectedRoomId, detailReloadKey, rooms]);

  // Hero auto-rotate (chỉ khi đang ở trang chủ để tránh re-render thừa)
  useEffect(() => {
    if (view !== "home") return;
    const id = setInterval(
      () => setHeroSlide((s) => (s + 1) % banners.length),
      5000,
    );
    return () => clearInterval(id);
  }, [view, banners.length]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      if (filters.search) {
        const rawQ = filters.search.toLowerCase().trim();
        const cleanQ = rawQ
          .replace(/^(tìm\s+phòng|phòng\s+trọ|nhà\s+trọ|nhà\s+ở|thuê\s+phòng)\s*(ở|tại)?\s*/i, "")
          .trim();
        const isCitySearch = ["hà nội", "ha noi", "hồ chí minh", "tp.hcm", "tphcm", "đà nẵng", "da nang", "bình dương", "cần thơ", "hải phòng"].some((c) => cleanQ === c || rawQ === c);
        if (!isCitySearch && cleanQ.length > 0) {
          const matchTitle = (r.name || "").toLowerCase().includes(cleanQ);
          const matchAddr = (r.address || "").toLowerCase().includes(cleanQ);
          const matchDist = (r.district || "").toLowerCase().includes(cleanQ);
          const matchCity = (r.city || "").toLowerCase().includes(cleanQ);
          const matchDesc = (r.description || "").toLowerCase().includes(cleanQ);
          if (!matchTitle && !matchAddr && !matchDist && !matchCity && !matchDesc) {
            return false;
          }
        }
      }
      if (r.price < filters.priceMin) return false;
      if (
        filters.priceMax < 15000000 &&
        r.price > filters.priceMax
      )
        return false;
      if (filters.areaMin > 0 && (r.area == null || r.area < filters.areaMin)) return false;
      if (
        filters.areaMax < 100 &&
        (r.area == null || r.area > filters.areaMax)
      )
        return false;
      // Lọc theo tỉnh / thành phố (chính xác tuyệt đối)
      const targetCity = filters.city || selectedCity;
      if (targetCity && targetCity !== "Tất cả") {
        if (!isRoomInCity(r, targetCity)) {
          return false;
        }
      }

      // Lọc theo danh mục khu vực quận
      if (filters.districtCategory && filters.districtCategory !== "Tất cả") {
        const categories = getDistrictCategoriesForCity(targetCity);
        const cat = categories.find((c) => c.name === filters.districtCategory);
        if (cat) {
          const matchDist = cat.districts.some(
            (d) => r.district === d || (r.address && r.address.includes(d)) || r.district.toLowerCase().includes(d.toLowerCase())
          );
          if (!matchDist) return false;
        }
      }

      // Lọc theo quận / huyện
      if (
        filters.district !== "Tất cả" &&
        r.district !== filters.district &&
        !r.district.toLowerCase().includes(filters.district.toLowerCase().replace("quận ", "")) &&
        !filters.district.toLowerCase().includes(r.district.toLowerCase().replace("quận ", ""))
      )
        return false;

      // Lọc theo phường / xã khi chọn quận bất kì
      if (filters.ward && filters.ward !== "Tất cả") {
        const cleanWard = filters.ward.toLowerCase().replace(/^phường\s+/i, "").replace(/^xã\s+/i, "").trim();
        const addressLower = (r.address || "").toLowerCase();
        if (!addressLower.includes(cleanWard)) {
          return false;
        }
      }

      // Lọc theo nguồn phòng (web tôi vs web ngoài)
      if (filters.source && filters.source !== "all") {
        const roomSource = (r.source || "local").toLowerCase();
        if (filters.source === "local") {
          if (roomSource !== "local") return false;
        } else if (filters.source === "external") {
          if (roomSource === "local") return false;
        } else {
          if (roomSource !== filters.source.toLowerCase()) return false;
        }
      }
      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => r.amenities.includes(a))
      )
        return false;
      if (
        filters.status !== "all" &&
        r.status !== filters.status
      )
        return false;
      return true;
    });
  }, [rooms, filters, selectedCity]);

  const distances = useMemo(() => {
    if (!userLocation) return {};
    return Object.fromEntries(
      rooms
        .filter((r) => r.lat != null && r.lng != null)
        .map((r) => [
          r.id,
          haversine(userLocation.lat, userLocation.lng, r.lat!, r.lng!),
        ]),
    );
  }, [rooms, userLocation]);

  const sortedFilteredRooms = useMemo(() => {
    return [...filteredRooms].sort((a, b) => {
      if (sortOption === "price_asc") return a.price - b.price;
      if (sortOption === "price_desc") return b.price - a.price;
      if (sortOption === "area_desc") return (b.area ?? -1) - (a.area ?? -1);
      if (sortOption === "distance") {
        return (distances[a.id] ?? Infinity) - (distances[b.id] ?? Infinity);
      }
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return b.id - a.id;
    });
  }, [filteredRooms, distances, sortOption]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => {},
    );
  }, []);

  const viewRoom = useCallback((id: number | string) => {
    const found = roomsRef.current.find((r) => String(r.id) === String(id))
      || EXTERNAL_MOCK_ROOMS.find((r) => String(r.id) === String(id));
    if (found) {
      setDetailRoom(found);
      setDetailError(null);
    }
    navigate(`/rooms/${id}`);
    setShowFilters(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const toggleFavorite = useCallback((id: number | string) => {
    let wasFavorite = false;
    setFavorites((prev) => {
      wasFavorite = prev.has(id as any) || prev.has(Number(id)) || prev.has(String(id));
      const next = new Set(prev);
      if (wasFavorite) {
        next.delete(id as any);
        next.delete(Number(id));
        next.delete(String(id));
      } else {
        next.add(id);
      }
      return next;
    });
    const roomName = roomsRef.current.find((room) => String(room.id) === String(id))?.name || "phòng này";
    setFavoriteNotice(wasFavorite ? `Đã bỏ lưu ${roomName}` : `Đã lưu ${roomName}`);
    window.setTimeout(() => setFavoriteNotice(""), 1800);
  }, []);

  useEffect(() => {
    setVisibleRoomsCount(18);
  }, [filters, selectedCity, sortOption]);

  const submitDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    const locationParts = [demandForm.ward, demandForm.district, demandForm.city].filter(Boolean);
    const locationStr = locationParts.join(", ") || demandForm.district || null;
    const payload = {
      full_name: demandForm.full_name.trim(),
      phone: demandForm.phone.trim(),
      gender: demandForm.gender || null,
      district: locationStr,
      max_price: Number(demandForm.max_price || 0),
      people_count: Number(demandForm.people_count || 1),
      note: demandForm.note.trim(),
    };
    setDemandSubmitting(true);
    setDemandError("");
    try {
      const { data } = await api.post("/demands", payload);
      const created = data?.data as Demand | undefined;
      if (!data?.success || !created) {
        throw new Error(data?.message || "Không thể gửi nhu cầu phòng");
      }
      setDemands((previous) => sortDemandsNewestFirst([created, ...previous.filter((item) => item.id !== created.id)]));
      setShowDemandModal(false);
    } catch (error) {
      setDemandError(error instanceof Error ? error.message : "Gửi nhu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setDemandSubmitting(false);
    }
  };

  const submitDemandFromText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandText.trim()) {
      setDemandError("Vui lòng nhập nội dung nhu cầu phòng");
      return;
    }
    setDemandSubmitting(true);
    setDemandError("");
    try {
      const { data } = await api.post("/demands/parse", { text: demandText });
      if (data?.success && data.data) {
        const parsed = data.data;
        const hasFullName = Boolean(parsed.full_name && String(parsed.full_name).trim());
        const hasPhone = Boolean(parsed.phone && String(parsed.phone).trim());

        if (hasFullName && hasPhone) {
          // Both name & phone are present -> directly submit
          const createdResponse = await api.post("/demands", parsed);
          const created = createdResponse.data?.data as Demand | undefined;
          if (!createdResponse.data?.success || !created) {
            throw new Error(createdResponse.data?.message || "Không thể gửi nhu cầu phòng");
          }
          setDemands((previous) => sortDemandsNewestFirst([created, ...previous.filter((item) => item.id !== created.id)]));
          setShowDemandModal(false);
        } else {
          // Pre-fill parsed fields into form and switch to form tab for user to fill missing name/phone
          setDemandForm((prev) => ({
            ...prev,
            full_name: parsed.full_name || prev.full_name,
            phone: parsed.phone || prev.phone,
            district: parsed.district || prev.district,
            max_price: parsed.max_price ? String(parsed.max_price) : prev.max_price,
            people_count: parsed.people_count ? String(parsed.people_count) : prev.people_count,
            note: parsed.note || demandText.trim(),
            gender: parsed.gender || prev.gender,
          }));
          setDemandInputMode("form");
          setDemandError("");
        }
      } else {
        setDemandError(data?.message || "Không thể phân tích nhu cầu phòng");
      }
    } catch (error) {
      setDemandError(error instanceof Error ? error.message : "Phân tích nhu cầu thất bại. Vui lòng thử lại.");
    } finally {
      setDemandSubmitting(false);
    }
  };

const handleContact = useCallback((room: Room) => {
    setContactedRooms((prev) => new Set([...prev, room.id]));
    setRooms((rs) =>
      rs.map((r) =>
        r.id === room.id
          ? { ...r, contacts: r.contacts + 1 }
          : r,
      ),
    );
    api.post(`/rooms/${room.id}/contact`).catch(() => {});
  }, []);

  const updateFilter = useCallback(
    (partial: Partial<FilterState>) =>
      setFilters((current) => {
        const next = { ...current, ...partial };
        if (next.priceMin > next.priceMax) {
          if (partial.priceMin !== undefined) next.priceMax = next.priceMin;
          else next.priceMin = next.priceMax;
        }
        if (next.areaMin > next.areaMax) {
          if (partial.areaMin !== undefined) next.areaMax = next.areaMin;
          else next.areaMin = next.areaMax;
        }
        return next;
      }),
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({
      ...DEFAULT_FILTER,
      city: selectedCity,
    });
    setSortOption("newest");
  }, [selectedCity]);

const goHome = () => {
    navigate("/");
    window.scrollTo({ top: 0 });
  };

  // Bỏ qua scroll-to-top khi điều hướng do tap ô tìm kiếm
  // (tránh layout nhảy làm đóng bàn phím trên mobile)
  const skipScrollRef = useRef(false);

  // Scroll to top when switching between main pages
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }
    if (location.pathname === "/" || location.pathname === "/rooms") {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname]);

  // ─── HEADER ─────────────────────────────────────────
  const Header = () => (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-40 pt-safe transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-card"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center gap-3">
          {/* Logo */}
          <button
            type="button"
            aria-label="Về trang chủ Trọ Xịn"
            className="flex shrink-0 items-center gap-2"
            onClick={goHome}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="hidden sm:block text-lg font-extrabold text-foreground tracking-tight">
              Trọ<span className="text-primary">Xịn</span>
            </span>
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-auto">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-input-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <Search
                size={15}
                className="shrink-0 text-muted-foreground"
              />
              <span className="sr-only">Tìm kiếm phòng</span>
              <input
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
                placeholder="Tìm quận, địa chỉ, tên phòng..."
                value={filters.search}
                onChange={(e) => {
                  const val = e.target.value;
                  if (view !== "rooms") {
                    skipScrollRef.current = true;
                    navigate("/rooms", { preventScrollReset: true });
                  }
                  const q = val.toLowerCase().trim();
                  let detected: string | null = null;
                  if (q.includes("hà nội") || q.includes("ha noi") || q.includes("cầu giấy") || q.includes("đống đa") || q.includes("thanh xuân") || q.includes("ba đình") || q.includes("hà đông") || q.includes("nam từ liêm") || q.includes("bắc từ liêm") || q.includes("hoàng mai") || q.includes("tây hồ")) {
                    detected = "Hà Nội";
                  } else if (q.includes("đà nẵng") || q.includes("da nang") || q.includes("hải châu") || q.includes("sơn trà") || q.includes("ngũ hành sơn") || q.includes("thanh khê") || q.includes("liên chiểu")) {
                    detected = "Đà Nẵng";
                  } else if (q.includes("bình dương") || q.includes("thủ dầu một") || q.includes("dĩ an") || q.includes("thuận an")) {
                    detected = "Bình Dương";
                  } else if (q.includes("cần thơ") || q.includes("ninh kiều") || q.includes("bình thủy") || q.includes("cái răng")) {
                    detected = "Cần Thơ";
                  } else if (q.includes("hải phòng") || q.includes("hồng bàng") || q.includes("ngô quyền") || q.includes("lê chân")) {
                    detected = "Hải Phòng";
                  } else if (q.includes("hồ chí minh") || q.includes("hcm") || q.includes("sài gòn") || q.includes("bình thạnh") || q.includes("gò vấp") || q.includes("tân bình") || q.includes("tân phú")) {
                    detected = "TP. Hồ Chí Minh";
                  }

                  if (detected && detected !== selectedCity) {
                    setSelectedCity(detected);
                    localStorage.setItem("sr_city", detected);
                    updateFilter({
                      search: val,
                      city: detected,
                      district: "Tất cả",
                      ward: "Tất cả",
                      districtCategory: "Tất cả",
                    });
                  } else {
                    updateFilter({ search: val });
                  }
                }}
              />
              {filters.search && (
                <button
                  type="button"
                  aria-label="Xóa tìm kiếm"
                  onClick={() => updateFilter({ search: "" })}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X
                    size={13}
                    className="text-muted-foreground"
                  />
                </button>
              )}
            </label>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              aria-label="Mở danh sách phòng"
              onClick={() => navigate("/rooms")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                view === "rooms"
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Danh sách phòng
            </button>
            <button
              type="button"
              aria-label="Mở bản đồ trọ gần tôi"
              onClick={() => navigate("/map")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                view === "map"
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Map size={14} />
              Bản đồ gần tôi
            </button>
            <button
              type="button"
              aria-label="Mở form nhu cầu phòng"
              onClick={() => setShowDemandMenu(true)}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Nhu cầu phòng
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Nút chọn Tỉnh / Thành phố */}
            <button
              type="button"
              onClick={() => setShowCityModal(true)}
              className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-primary transition-all shadow-sm"
              title="Chọn tỉnh / thành phố"
            >
              <MapPin size={13} className="text-primary shrink-0" />
              <span className="max-w-[70px] sm:max-w-[120px] truncate">{selectedCity.replace("TP. ", "")}</span>
              <ChevronDown size={11} className="text-primary/70 shrink-0" />
            </button>

            <button
              type="button"
              aria-label="Mở phòng đã thích"
              onClick={() => navigate("/favorites")}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title="Phòng đã thích"
            >
              <Heart size={15} className={favorites.size > 0 ? "text-red-500" : "text-muted-foreground"} fill={favorites.size > 0 ? "currentColor" : "none"} />
              {favorites.size > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{favorites.size}</span>
              )}
            </button>
            <button
              type="button"
              aria-label={darkMode ? "Tắt chế độ tối" : "Bật chế độ tối"}
              aria-pressed={darkMode}
              onClick={() => setDarkMode((d) => !d)}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {darkMode ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )}
            </button>
            <button
              type="button"
              aria-label={mobileMenu ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenu}
              className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
              onClick={() => setMobileMenu((m) => !m)}
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-card overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowCityModal(true);
                  setMobileMenu(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-bold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <MapPin size={16} /> Khu vực: {selectedCity}
                </span>
                <span className="text-xs bg-primary text-white rounded-md px-2 py-0.5">Đổi tỉnh</span>
              </button>
              <button
                onClick={() => {
                  navigate("/rooms");
                  setMobileMenu(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                Danh sách phòng
              </button>
              <button
                onClick={() => {
                  navigate("/map");
                  setMobileMenu(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                  view === "map" ? "bg-primary text-white" : "text-foreground hover:bg-muted"
                }`}
              >
                <Map size={16} className={view === "map" ? "text-white" : "text-primary"} />
                Bản đồ gần tôi
              </button>
              <button
                onClick={() => {
                  setShowDemandMenu(true);
                  setMobileMenu(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                Nhu cầu phòng
              </button>
              <button
                onClick={() => {
                  navigate("/favorites");
                  setMobileMenu(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-foreground hover:bg-muted"
              >
                Phòng đã thích
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{favoriteNotice}</span>
    </header>
  );

  // ─── HOME ────────────────────────────────────────────
  const HomePage = () => {
    const currentCityRooms = rooms.filter((r) => isRoomInCity(r, selectedCity));
    const featuredRooms = currentCityRooms.filter(
      (r) => r.isFeatured && r.status === "available",
    );
    const newRooms = currentCityRooms.filter((r) => r.isNew);
    const cheapRooms = currentCityRooms.filter(
      (r) => r.isCheap && r.status === "available",
    );
    const nearRooms = userLocation
      ? [...currentCityRooms]
          .sort(
            (a, b) =>
              (distances[a.id] ?? 99) - (distances[b.id] ?? 99),
          )
          .slice(0, 6)
      : [];

    return (
      <div className="pt-14">
        {/* Hero Banner */}
        <div className="relative h-64 sm:h-80 md:h-[420px] overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={banners[heroSlide].image}
                alt={banners[heroSlide].title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banners[heroSlide].color}`}
              />
            </motion.div>
          </AnimatePresence>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-end pb-10 px-6 sm:px-12 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`txt-${heroSlide}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-lg leading-tight">
                  {banners[heroSlide].title}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/80 max-w-md">
                  {banners[heroSlide].subtitle}
                </p>
                <button
                  onClick={() => navigate("/rooms")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 transition-all shadow-lg"
                >
                  {banners[heroSlide].cta}{" "}
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-4 right-6 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`rounded-full transition-all ${i === heroSlide ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/40"}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-primary text-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-center gap-8 flex-wrap text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Building2 size={14} />{" "}
              {
                currentCityRooms.filter((r) => r.status === "available")
                  .length
              }{" "}
              phòng còn trống
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} />{" "}
              {new Set(currentCityRooms.map((r) => r.district)).size}{" "}
              quận/huyện ({selectedCity.replace("TP. ", "")})
            </span>
            <span className="flex items-center gap-2">
              <Users size={14} /> 2,400+ người đã thuê
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 space-y-12">
          {/* Category quick filters */}
          <div>
            <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
              {[
                {
                  label: "Tất cả",
                  icon: <Home size={14} />,
                  action: () => {
                    resetFilters();
                    navigate("/rooms");
                  },
                },
                {
                  label: "Còn trống",
                  icon: <CheckCircle size={14} />,
                  action: () => {
                    updateFilter({ status: "available" });
                    navigate("/rooms");
                  },
                },
                {
                  label: "Giá rẻ",
                  icon: <Percent size={14} />,
                  action: () => {
                    updateFilter({ priceMax: 2500000 });
                    navigate("/rooms");
                  },
                },
                {
                  label: "Máy lạnh",
                  icon: <Wind size={14} />,
                  action: () => {
                    updateFilter({ amenities: ["ac"] });
                    navigate("/rooms");
                  },
                },
                {
                  label: "WC riêng",
                  icon: <Bath size={14} />,
                  action: () => {
                    updateFilter({ amenities: ["private_wc"] });
                    navigate("/rooms");
                  },
                },
                {
                  label: "Có bếp",
                  icon: <UtensilsCrossed size={14} />,
                  action: () => {
                    updateFilter({ amenities: ["kitchen"] });
                    navigate("/rooms");
                  },
                },
                {
                  label: "Nuôi thú",
                  icon: <PawPrint size={14} />,
                  action: () => {
                    updateFilter({
                      amenities: ["pet_friendly"],
                    });
                    navigate("/rooms");
                  },
                },
                {
                  label: "Ban công",
                  icon: <Home size={14} />,
                  action: () => {
                    updateFilter({ amenities: ["balcony"] });
                    navigate("/rooms");
                  },
                },
                ...getDistrictsForCity(selectedCity)
                  .filter((d) => d !== "Tất cả")
                  .slice(0, 4)
                  .map((d) => ({
                    label: d,
                    icon: <MapPin size={14} />,
                    action: () => {
                      updateFilter({ district: d, city: selectedCity, ward: "Tất cả" });
                      navigate("/rooms");
                    },
                  })),
              ].map(({ label, icon, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-sm"
                >
                  <span className="text-primary">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* External Partners Section */}
          {currentCityRooms.some((r) => r.source && r.source !== "local") && (
            <Section
              title={`Tin đăng từ Chợ Tốt Nhà, Batdongsan & Phongtro123 (${selectedCity.replace("TP. ", "")})`}
              icon={<ExternalLink size={16} className="text-orange-500" />}
              onMore={() => {
                updateFilter({ source: "external", city: selectedCity, district: "Tất cả", ward: "Tất cả" });
                navigate("/rooms");
              }}
            >
              <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {currentCityRooms
                  .filter((r) => r.source && r.source !== "local")
                  .slice(0, 8)
                  .map((r) => (
                    <div key={r.id} className="w-72 shrink-0">
                      <MemoRoomCard
                        room={r}
                        onView={viewRoom}
                        onToggleFavorite={toggleFavorite}
                        isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                        distance={distances[r.id]}
                      />
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {/* Featured rooms */}
          {featuredRooms.length > 0 && (
            <Section
              title="Phòng nổi bật"
              icon={
                <Star
                  size={16}
                  className="text-primary"
                  fill="currentColor"
                />
              }
              onMore={() => {
                updateFilter({ status: "available" });
                navigate("/rooms");
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredRooms.slice(0, 3).map((r) => (
                  <MemoRoomCard
                    key={r.id}
                    room={r}
                    onView={viewRoom}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                    distance={distances[r.id]}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Near you */}
          {!userLocation ? (
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Navigation
                  size={24}
                  className="text-primary"
                />
              </div>
              <div>
                <h3 className="font-bold text-foreground">
                  Phòng gần bạn
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Cho phép truy cập vị trí để xem phòng gần nhất
                  với khoảng cách thực tế
                </p>
              </div>
              <button
                onClick={requestLocation}
                className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-95 transition-all"
              >
                Cho phép
              </button>
            </div>
          ) : (
            nearRooms.length > 0 && (
              <Section
                title="Phòng gần bạn"
                icon={
                  <Navigation
                    size={16}
                    className="text-primary"
                  />
                }
                onMore={() => navigate("/rooms")}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearRooms.slice(0, 3).map((r) => (
                    <MemoRoomCard
                      key={r.id}
                      room={r}
                      onView={viewRoom}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                      distance={distances[r.id]}
                    />
                  ))}
                </div>
              </Section>
            )
          )}

          {/* New */}
          {newRooms.length > 0 && (
            <Section
              title="Mới đăng"
              icon={
                <Bell size={16} className="text-blue-500" />
              }
              onMore={() => navigate("/rooms")}
            >
              <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {newRooms.slice(0, 8).map((r) => (
                  <div key={r.id} className="w-72 shrink-0">
                    <MemoRoomCard
                      room={r}
                      onView={viewRoom}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                      distance={distances[r.id]}
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Cheap */}
          {cheapRooms.length > 0 && (
            <Section
              title="Phòng giá rẻ"
              icon={
                <Percent
                  size={16}
                  className="text-emerald-500"
                />
              }
              onMore={() => {
                updateFilter({ priceMax: 2500000 });
                navigate("/rooms");
              }}
            >
              <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {cheapRooms.slice(0, 8).map((r) => (
                  <div key={r.id} className="w-72 shrink-0">
                    <MemoRoomCard
                      room={r}
                      onView={viewRoom}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                      distance={distances[r.id]}
                    />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* All rooms preview */}
          <Section
            title={`Tất cả phòng trống tại ${selectedCity}`}
            icon={
              <Building2 size={16} className="text-primary" />
            }
            onMore={() => {
              updateFilter({ city: selectedCity, district: "Tất cả", ward: "Tất cả" });
              navigate("/rooms");
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentCityRooms
                .filter((r) => r.status === "available")
                .slice(0, 6)
                .map((r) => (
                  <MemoRoomCard
                    key={r.id}
                    room={r}
                    onView={viewRoom}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                    distance={distances[r.id]}
                  />
                ))}
            </div>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                  <Building2 size={16} className="text-white" />
                </div>
                <span className="text-lg font-extrabold">
                  Trọ<span className="text-primary">Xịn</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Nền tảng tìm phòng trọ nhanh, minh bạch, không
                qua trung gian tại TP.HCM.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">
                Liên kết
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button
                  onClick={goHome}
                  className="block hover:text-primary"
                >
                  Trang chủ
                </button>
                <button
                  onClick={() => navigate("/rooms")}
                  className="block hover:text-primary"
                >
                  Danh sách phòng
                </button>
                <button
                  onClick={() => {
                    navigate("/rooms");
                    setTimeout(() => setShowDemandModal(true), 0);
                  }}
                  className="block hover:text-primary"
                >
                  Kiếm phòng ngay
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-sm">
                Liên hệ hỗ trợ tìm phòng
              </h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a
                  href="tel:0337244067"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Phone size={13} /> 0337244067
                </a>
                <a
                  href="https://zalo.me/0337244067"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <MessageCircle size={13} /> Zalo: Thế Vinh
                </a>
                <p className="flex items-center gap-2">
                  <MapPin size={13} /> TP. Hồ Chí Minh
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
            © 2025 TrọXịn. Tất cả quyền được bảo lưu.
          </div>
        </footer>
      </div>
    );
  };

  // ─── ROOMS LIST ──────────────────────────────────────
  const RoomsPage = () => (
    <div className="pt-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Top bar */}
        <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Smart Room Search · TP.HCM
            </p>
            <h1 id="rooms-heading" className="text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
              Tìm nơi ở hợp với bạn
            </h1>
            <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
              {sortedFilteredRooms.length} phòng phù hợp với tiêu chí hiện tại
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/map")}
              className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              <Map size={15} className="text-primary" />
              Xem trên bản đồ
            </button>
            <button
              type="button"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((f) => !f)}
              className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                showFilters
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              <SlidersHorizontal size={15} />
              Bộ lọc
              {(() => {
                const count = filters.amenities.length +
                  (filters.district !== "Tất cả" ? 1 : 0) +
                  (filters.status !== "available" ? 1 : 0) +
                  (filters.priceMin > 0 ? 1 : 0) +
                  (filters.priceMax < 15000000 ? 1 : 0) +
                  (filters.areaMin > 0 ? 1 : 0) +
                  (filters.areaMax < 100 ? 1 : 0) +
                  (filters.search ? 1 : 0);
                return count > 0 ? (
                  <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/20 px-1 text-[10px]">
                    {count}
                  </span>
                ) : null;
              })()}
            </button>
            <label className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Sắp xếp</span>
              <select
                aria-label="Sắp xếp danh sách phòng"
                value={sortOption}
                onChange={(event) => setSortOption(event.target.value as SortOption)}
                className="bg-transparent font-semibold text-foreground outline-none"
              >
                <option value="newest">Mới nhất</option>
                <option value="price_asc">Giá thấp → cao</option>
                <option value="price_desc">Giá cao → thấp</option>
                <option value="area_desc">Diện tích lớn</option>
                <option value="distance" disabled={!userLocation}>Gần tôi</option>
              </select>
            </label>
          </div>
        </div>

        {/* Origin & Source Filter Tabs */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {[
            { id: "all", label: "Tất cả tin (600+)" },
            { id: "local", label: "✨ Chính chủ (Web tôi)" },
            { id: "external", label: "🌐 Nguồn ngoài (Tổng hợp)" },
            { id: "nhatot", label: "Chợ Tốt Nhà" },
            { id: "batdongsan", label: "Batdongsan.com.vn" },
            { id: "phongtro123", label: "Phongtro123.com" },
          ].map((item) => {
            const isActive = (filters.source || "all") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => updateFilter({ source: item.id })}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* District Categories Filter Tabs */}
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          <span className="text-xs text-muted-foreground font-semibold shrink-0">Khu vực:</span>
          {[
            { id: "Tất cả", label: "Toàn thành phố" },
            ...getDistrictCategoriesForCity(selectedCity).map((c) => ({ id: c.name, label: c.name.replace("Khu vực ", "") })),
          ].map((item) => {
            const isActive = (filters.districtCategory || "Tất cả") === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  updateFilter({
                    districtCategory: item.id,
                    district: "Tất cả",
                    ward: "Tất cả",
                  })
                }
                className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all ${
                  isActive
                    ? "bg-foreground text-background border-foreground font-bold shadow-sm"
                    : "border-border/80 bg-muted/30 text-muted-foreground hover:border-primary hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Ward Pills (hiển thị khi chọn 1 quận bất kì) */}
        {filters.district && filters.district !== "Tất cả" && (
          <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <MapPin size={13} /> Phường / Xã tại {filters.district}:
              </span>
              {filters.ward && filters.ward !== "Tất cả" && (
                <button
                  type="button"
                  onClick={() => updateFilter({ ward: "Tất cả" })}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Xem tất cả phường
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {getWardsForDistrict(filters.district).map((w) => {
                const isWardActive = (filters.ward || "Tất cả") === w;
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => updateFilter({ ward: w })}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                      isWardActive
                        ? "bg-primary text-white border-primary font-bold shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filter */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ x: -12, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -12, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Bộ lọc danh sách phòng"
                className="hidden w-[280px] shrink-0 overflow-visible lg:block"
              >
                <div className="sticky top-20 w-[280px] rounded-lg border border-border bg-card p-5">
                  <FilterPanel
                    filters={filters}
                    onChange={updateFilter}
                    onReset={resetFilters}
                  />
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="min-w-0 flex-1" aria-labelledby="rooms-heading">
          {/* Grid */}
          <div className="flex-1">
            {roomsLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Đang tải danh sách phòng" role="status">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="h-48 animate-pulse bg-muted" />
                    <div className="space-y-3 p-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-full animate-pulse rounded bg-muted" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                      <div className="h-8 w-full animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            ) : roomsError ? (
              <div className="flex flex-col items-center justify-center py-20 text-center" role="alert">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <AlertCircle size={28} className="text-foreground" />
                </div>
                <h3 className="font-bold text-foreground">
                  Không thể tải danh sách phòng
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {roomsError}
                </p>
                <button
                  onClick={() => setRoomsReloadKey((k) => k + 1)}
                  className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
                >
                  Thử lại
                </button>
              </div>
            ) : sortedFilteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center" role="status">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                  <Search
                    size={28}
                    className="text-muted-foreground"
                  />
                </div>
                <h3 className="font-bold text-foreground">
                  Không tìm thấy phòng phù hợp
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
                >
                  Xóa bộ lọc và xem tất cả phòng
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedFilteredRooms.slice(0, visibleRoomsCount).map((r) => (
                    <MemoRoomCard
                      key={r.id}
                      room={r}
                      onView={viewRoom}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.has(r.id) || favorites.has(Number(r.id)) || favorites.has(String(r.id))}
                      distance={distances[r.id]}
                    />
                  ))}
                </div>

                {visibleRoomsCount < sortedFilteredRooms.length && (
                  <div className="flex flex-col items-center justify-center pt-4 pb-8 text-center">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">
                      Đang hiển thị {Math.min(visibleRoomsCount, sortedFilteredRooms.length)} / {sortedFilteredRooms.length} phòng
                    </p>
                    <button
                      type="button"
                      onClick={() => setVisibleRoomsCount((prev) => prev + 18)}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md hover:brightness-105 active:scale-95 transition-all"
                    >
                      <Plus size={16} />
                      <span>Xem thêm phòng ({sortedFilteredRooms.length - visibleRoomsCount} phòng còn lại)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          </main>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Bộ lọc phòng"
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-xl bg-card p-6 pb-safe lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />
              <FilterPanel
                filters={filters}
                onChange={updateFilter}
                onReset={resetFilters}
                onClose={() => setShowFilters(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  // Admin UI removed (managed by database/admin-app)

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div
      className="min-h-screen bg-background"
      style={{
        fontFamily:
          "var(--font-family, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      {Header()}

      <AnimatePresence mode="wait">
        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {HomePage()}
          </motion.div>
        )}
        {view === "rooms" && (
          <motion.div
            key="rooms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {RoomsPage()}
          </motion.div>
        )}
        {view === "detail" && detailRoom && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DetailPage
              room={detailRoom}
              distances={distances}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              goHome={goHome}
              navigate={navigate}
              userLocation={userLocation}
              requestLocation={requestLocation}
              handleContact={handleContact}
              contactedRooms={contactedRooms}
              rooms={rooms}
              viewRoom={viewRoom}
            />
          </motion.div>
        )}
        {view === "favorites" && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pt-14 min-h-screen">
              <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => navigate("/rooms")}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 className="text-xl font-extrabold text-foreground">Phòng đã thích</h1>
                    <p className="text-sm text-muted-foreground">{favorites.size} phòng</p>
                  </div>
                </div>
                {favorites.size === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Heart size={48} className="text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Bạn chưa thích phòng nào.</p>
                    <button onClick={() => navigate("/rooms")} className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">
                      Xem danh sách phòng
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.filter((r) => favorites.has(r.id)).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => viewRoom(r.id)}
                        className="cursor-pointer rounded-2xl border border-border bg-card p-4 hover:shadow-md transition-shadow"
                      >
                        {r.images?.[0] && (
                          <img src={r.images[0]} alt={r.name} className="w-full h-40 object-cover rounded-xl mb-3" />
                        )}
                        <h3 className="font-bold text-foreground">{r.name}</h3>
                        <p className="text-sm text-muted-foreground">{r.address}</p>
                        <p className="text-primary font-bold mt-1">{r.price.toLocaleString("vi-VN")} VNĐ/tháng</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {view === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MapPage
              rooms={rooms}
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              goHome={goHome}
              viewRoom={viewRoom}
              selectedCity={selectedCity}
              onSelectCity={setSelectedCity}
            />
          </motion.div>
        )}
        {view === "detail" && !detailRoom && (
          <motion.div
            key="detail-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 min-h-screen px-4"
          >
            <div className="mx-auto max-w-md flex flex-col items-center text-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                {detailLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Building2 size={28} className="text-muted-foreground" />
                )}
              </div>
              <h2 className="font-bold text-foreground">
                {detailLoading
                  ? "Đang tải thông tin phòng..."
                  : detailError === "not_found"
                    ? "Không tìm thấy phòng này."
                    : detailError
                      ? "Không thể tải thông tin phòng"
                      : "Đang tải thông tin phòng..."}
              </h2>
              <p className="text-sm text-muted-foreground">
                {detailLoading
                  ? "Xin chờ một chút, hệ thống đang lấy dữ liệu phòng."
                  : detailError === "not_found"
                    ? "Phòng có thể đã bị xóa hoặc liên kết không đúng."
                    : detailError
                      ? detailError
                      : "Xin chờ một chút, hệ thống đang lấy dữ liệu phòng."}
              </p>
              {detailError && detailError !== "not_found" && (
                <button
                  onClick={() => setDetailReloadKey((k) => k + 1)}
                  className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
                >
                  Thử lại
                </button>
              )}
              <button
                onClick={() => navigate("/rooms")}
                className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white"
              >
                Xem danh sách phòng
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CityModal
        isOpen={showCityModal}
        onClose={() => setShowCityModal(false)}
        selectedCity={selectedCity}
        onSelectCity={(cityName) => {
          setSelectedCity(cityName);
          localStorage.setItem("sr_city", cityName);
          updateFilter({
            city: cityName,
            district: "Tất cả",
            ward: "Tất cả",
            districtCategory: "Tất cả",
          });
          setShowCityModal(false);
        }}
      />

      <AnimatePresence>
        {showDemandMenu && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demand-menu-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDemandMenu(false)}
          >
            <motion.div
              initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 id="demand-menu-title" className="font-extrabold text-foreground">Nhu cầu phòng</h2>
                <button type="button" onClick={() => setShowDemandMenu(false)} className="rounded-full p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Đóng menu nhu cầu phòng"><X size={17} /></button>
              </div>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDemandMenu(false); setShowDemandListModal(true); void loadDemands(); }}
                  className="rounded-xl border border-border px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Xem danh sách nhu cầu <span className="ml-1 text-xs text-muted-foreground">({demands.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDemandMenu(false); setShowDemandModal(true); }}
                  className="rounded-xl bg-primary px-4 py-3 text-left text-sm font-bold text-white hover:opacity-90"
                >
                  Tạo nhu cầu phòng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemandListModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demand-list-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowDemandListModal(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-card p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 id="demand-list-title" className="text-lg font-extrabold text-foreground">Danh sách nhu cầu phòng</h2>
                  <p className="text-sm text-muted-foreground">Các nhu cầu mới nhất từ người đang tìm phòng.</p>
                </div>
                <button type="button" onClick={() => setShowDemandListModal(false)} className="rounded-full p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Đóng danh sách nhu cầu"><X size={18} /></button>
              </div>

              {/* Bộ lọc Tỉnh thành / Quận huyện / Phường cho danh sách nhu cầu */}
              <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl border border-border bg-muted/40 p-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">Tỉnh / Thành phố</label>
                  <select
                    value={demandFilterCity}
                    onChange={(e) => {
                      setDemandFilterCity(e.target.value);
                      setDemandFilterDistrict("Tất cả");
                      setDemandFilterWard("Tất cả");
                    }}
                    className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-medium"
                  >
                    <option value="Tất cả">Toàn quốc (Tất cả)</option>
                    {CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">Quận / Huyện</label>
                  <select
                    value={demandFilterDistrict}
                    onChange={(e) => {
                      setDemandFilterDistrict(e.target.value);
                      setDemandFilterWard("Tất cả");
                    }}
                    className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-medium"
                  >
                    <option value="Tất cả">Tất cả quận / huyện</option>
                    {getDistrictsForCity(demandFilterCity === "Tất cả" ? "TP. Hồ Chí Minh" : demandFilterCity)
                      .filter((d) => d !== "Tất cả")
                      .map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">Phường / Xã</label>
                  <select
                    value={demandFilterWard}
                    disabled={demandFilterDistrict === "Tất cả"}
                    onChange={(e) => setDemandFilterWard(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground font-medium disabled:opacity-50"
                  >
                    <option value="Tất cả">Tất cả phường / xã</option>
                    {(getWardsForDistrict(demandFilterDistrict) || []).map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Hiển thị <strong>{filteredDemands.length}</strong> nhu cầu</span>
                {(demandFilterCity !== "Tất cả" || demandFilterDistrict !== "Tất cả" || demandFilterWard !== "Tất cả") && (
                  <button
                    type="button"
                    onClick={() => {
                      setDemandFilterCity("Tất cả");
                      setDemandFilterDistrict("Tất cả");
                      setDemandFilterWard("Tất cả");
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              <div className="min-h-0 space-y-2 overflow-y-auto pr-1">
                {demandsLoading && <p className="rounded-xl bg-muted p-4 text-center text-sm text-muted-foreground">Đang tải nhu cầu...</p>}
                {demandsError && !demandsLoading && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-700"><p>{demandsError}</p><button type="button" onClick={loadDemands} className="mt-2 underline">Thử lại</button></div>}
                {!demandsLoading && !demandsError && filteredDemands.length === 0 && <p className="rounded-xl bg-muted p-5 text-center text-sm text-muted-foreground">Chưa có nhu cầu phòng nào phù hợp với bộ lọc.</p>}
                {!demandsLoading && !demandsError && filteredDemands.map((d) => (
                  <article key={d.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-primary">{d.district || 'Chưa xác định'}</span>
                      {d.max_price > 0 && <span className="text-xs font-semibold text-primary">≤ {Number(d.max_price).toLocaleString('vi-VN')} VNĐ</span>}
                    </div>
                    <p className="text-sm font-semibold text-foreground">{d.full_name} {d.gender ? `(${d.gender})` : ''}</p>
                    <p className="text-xs text-muted-foreground">{d.people_count || 1} người</p>
                    {d.created_at && <p className="text-[11px] text-muted-foreground mt-1">Đăng lúc: {d.created_at}</p>}
                    {d.note && <p className="text-xs text-muted-foreground mt-1 italic">{d.note}</p>}
                  </article>
                ))}
              </div>
              <a
                href="https://zalo.me/0337244067"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowDemandListModal(false)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle size={16} />
                Liên hệ để cho thuê phòng
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemandModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setShowDemandModal(false); setDemandError(""); }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="demand-modal-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 id="demand-modal-title" className="text-lg font-extrabold text-foreground">Biểu mẫu nhu cầu phòng</h2>
                  <p className="text-sm text-muted-foreground">Điền nhu cầu để chủ trọ liên hệ bạn.</p>
                </div>
                <button type="button" aria-label="Đóng biểu mẫu nhu cầu phòng" onClick={() => { setShowDemandModal(false); setDemandError(""); }} className="rounded-full p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <X size={18} />
                </button>
              </div>
              {demandError && (
                <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {demandError}
                </div>
              )}
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  aria-pressed={demandInputMode === "form"}
                  onClick={() => setDemandInputMode("form")}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    demandInputMode === "form"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  📋 Nhập form
                </button>
                <button
                  type="button"
                  aria-pressed={demandInputMode === "text"}
                  onClick={() => setDemandInputMode("text")}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    demandInputMode === "text"
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  🤖 Nhập tự do (AI phân tích)
                </button>
              </div>
              {demandInputMode === "form" && (
                <form onSubmit={submitDemand} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Họ tên <span aria-hidden="true">*</span></span><input value={demandForm.full_name} onChange={(e) => setDemandForm((s) => ({ ...s, full_name: e.target.value }))} placeholder="Nguyễn Văn A" required className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm" /></label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Số điện thoại <span aria-hidden="true">*</span></span><input value={demandForm.phone} onChange={(e) => setDemandForm((s) => ({ ...s, phone: e.target.value }))} type="tel" placeholder="09xxxxxxxx" required className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm" /></label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Giới tính</span><select aria-label="Giới tính" value={demandForm.gender} onChange={(e) => setDemandForm((s) => ({ ...s, gender: e.target.value }))} className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm">
                    <option value="">Giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select></label>
                  {/* Tỉnh / Thành phố */}
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
                    <span>Tỉnh / Thành phố <span aria-hidden="true">*</span></span>
                    <select
                      aria-label="Tỉnh thành mong muốn"
                      value={demandForm.city}
                      onChange={(e) => setDemandForm((s) => ({ ...s, city: e.target.value, district: "", ward: "" }))}
                      className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm font-medium"
                    >
                      {CITIES.map((c) => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>

                  {/* Quận / Huyện */}
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
                    <span>Quận / Huyện mong muốn</span>
                    <select
                      aria-label="Quận huyện mong muốn"
                      value={demandForm.district}
                      onChange={(e) => setDemandForm((s) => ({ ...s, district: e.target.value, ward: "" }))}
                      className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm font-medium"
                    >
                      <option value="">Chọn quận / huyện</option>
                      {getDistrictsForCity(demandForm.city || "TP. Hồ Chí Minh")
                        .filter((d) => d !== "Tất cả")
                        .map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                  </label>

                  {/* Phường / Xã */}
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
                    <span>Phường / Xã mong muốn</span>
                    <select
                      aria-label="Phường xã mong muốn"
                      value={demandForm.ward}
                      disabled={!demandForm.district}
                      onChange={(e) => setDemandForm((s) => ({ ...s, ward: e.target.value }))}
                      className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm font-medium disabled:opacity-50"
                    >
                      <option value="">{demandForm.district ? "Chọn phường / xã" : "Chọn quận trước"}</option>
                      {(getWardsForDistrict(demandForm.district) || []).map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Giá tối đa mỗi tháng</span><input aria-label="Giá mong muốn tối đa" value={demandForm.max_price} onChange={(e) => setDemandForm((s) => ({ ...s, max_price: e.target.value }))} type="number" min="0" inputMode="numeric" placeholder="Ví dụ: 4000000" className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm" /></label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Số người ở</span><input aria-label="Số người ở" value={demandForm.people_count} onChange={(e) => setDemandForm((s) => ({ ...s, people_count: e.target.value }))} type="number" min="1" inputMode="numeric" placeholder="Ví dụ: 2" className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm" /></label>
                  <label className="sm:col-span-2 flex flex-col gap-1 text-xs font-semibold text-muted-foreground"><span>Ghi chú nhu cầu</span><textarea aria-label="Ghi chú nhu cầu phòng" value={demandForm.note} onChange={(e) => setDemandForm((s) => ({ ...s, note: e.target.value }))} placeholder="Tiện ích hoặc thời gian muốn chuyển vào" rows={4} className="rounded-xl border border-border bg-input-background px-3 py-2 text-base text-foreground sm:text-sm" /></label>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowDemandModal(false); setDemandError(""); }} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">Đóng</button>
                    <button type="submit" disabled={demandSubmitting} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed">
                      {demandSubmitting ? "Đang gửi..." : "Gửi nhu cầu"}
                    </button>
                  </div>
                </form>
              )}
              {demandInputMode === "text" && (
                <form onSubmit={submitDemandFromText} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Nhập nhu cầu phòng bằng văn bản tự do, ví dụ:
                    <br />
                    <span className="text-primary">"Cần phòng Q12 giá 2-4 triệu, 20m2, 2 người, nhận tháng 9"</span>
                  </p>
                  <textarea
                    value={demandText}
                    onChange={(e) => setDemandText(e.target.value)}
                    placeholder="Ví dụ: Tôi cần phòng ở Quận 12 khoảng 2 đến 4 triệu, diện tích từ 20m2, 2 người ở, có chỗ để xe và muốn chuyển vào đầu tháng 9."
                    rows={6}
                    className="w-full rounded-xl border border-border bg-input-background px-3 py-2 text-base resize-none sm:text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => { setShowDemandModal(false); setDemandError(""); setDemandText(""); }} className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">Đóng</button>
                    <button type="submit" disabled={demandSubmitting} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed">
                      {demandSubmitting ? "Đang phân tích..." : "Phân tích & Gửi"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ═══════════════════════════════════════════════════════
// HELPER: Section wrapper
// ═══════════════════════════════════════════════════════
function Section({
  title,
  icon,
  onMore,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  onMore?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
          {icon}
          {title}
        </h2>
        {onMore && (
          <button
            onClick={onMore}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Xem tất cả <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
