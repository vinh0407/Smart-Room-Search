import rawData from './realRoomsData.json';

export interface RealRoomItem {
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
  status: 'available' | 'rented' | 'maintenance';
  description: string;
  amenities: string[];
  images: string[];
  phone: string;
  zaloLink: string;
  views: number;
  contacts: number;
  isFeatured: boolean;
  isNew: boolean;
  isCheap: boolean;
  rating: number | null;
  source?: string;
  externalUrl?: string;
  createdAt?: string;
}

const mapAmenity = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('lạnh') || lower.includes('máy lạnh') || lower.includes('điều hòa')) return 'ac';
  if (lower.includes('wc') || lower.includes('vệ sinh')) return 'private_wc';
  if (lower.includes('giặt')) return 'washing_machine';
  if (lower.includes('bếp') || lower.includes('nấu')) return 'kitchen';
  if (lower.includes('ban công')) return 'balcony';
  if (lower.includes('gác') || lower.includes('lửng')) return 'loft';
  if (lower.includes('xe') || lower.includes('giữ xe') || lower.includes('để xe')) return 'parking';
  if (lower.includes('thú') || lower.includes('chó') || lower.includes('mèo')) return 'pet_friendly';
  if (lower.includes('wifi') || lower.includes('mạng') || lower.includes('internet')) return 'wifi';
  return 'wifi';
};

export const REAL_ROOMS: RealRoomItem[] = (rawData as any[]).map((r) => {
  const rawAmenities: string[] = Array.isArray(r.amenities) ? r.amenities : [];
  const mappedAmenities = Array.from(new Set(rawAmenities.map(mapAmenity)));

  const fullAddr = r.address || '';
  const dist = r.district || '';
  let city = r.city;
  if (!city || city === 'TP.HCM') {
    const addrLower = (fullAddr + ' ' + dist).toLowerCase();
    if (addrLower.includes('hà nội') || addrLower.includes('ha noi')) city = 'Hà Nội';
    else if (addrLower.includes('đà nẵng') || addrLower.includes('da nang')) city = 'Đà Nẵng';
    else if (addrLower.includes('bình dương')) city = 'Bình Dương';
    else if (addrLower.includes('cần thơ')) city = 'Cần Thơ';
    else if (addrLower.includes('hải phòng')) city = 'Hải Phòng';
    else city = city || 'TP. Hồ Chí Minh';
  }

  return {
    id: r.id,
    name: r.title || r.name || 'Phòng trọ cho thuê',
    price: Number(r.price || 0),
    electricity: r.electricity ? Number(r.electricity) : 3800,
    water: r.water ? Number(r.water) : 100000,
    internet: r.internet ? Number(r.internet) : 100000,
    serviceFee: r.serviceFee ? Number(r.serviceFee) : 150000,
    area: r.area ? Number(r.area) : 25,
    maxPeople: r.maxPeople ? Number(r.maxPeople) : 2,
    address: fullAddr,
    district: dist,
    city: city,
    lat: r.lat ? Number(r.lat) : 10.7769,
    lng: r.lng ? Number(r.lng) : 106.7009,
    status: (r.status as any) || 'available',
    description: r.description || '',
    amenities: mappedAmenities.length > 0 ? mappedAmenities : ['ac', 'wifi', 'parking'],
    images: Array.isArray(r.images) && r.images.length > 0
      ? r.images
      : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    phone: r.phone || '0908123456',
    zaloLink: r.zaloLink || 'https://zalo.me/0908123456',
    views: Number(r.views || 350),
    contacts: Number(r.contacts || 28),
    isFeatured: Boolean(r.isFeatured),
    isNew: Boolean(r.isNew),
    isCheap: Boolean(r.isCheap),
    rating: r.rating ? Number(r.rating) : 4.8,
    source: r.source || 'nhatot',
    externalUrl: r.externalUrl || '',
    createdAt: r.createdAt || r.created_at || new Date().toISOString(),
  };
});
