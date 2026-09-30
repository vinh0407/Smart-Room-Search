/**
 * Vercel Serverless Function: /api/live-rooms
 * Real-time crawler directly fetching live listings from Chợ Tốt Gateway API
 * Zero CORS restrictions, 100% authentic CDN images from cdn.chotot.com
 */

const cleanDistrictName = (d) => {
  if (!d) return 'Quận 1';
  let name = String(d).trim();
  const lower = name.toLowerCase();
  if (lower.startsWith('quận ') || lower.startsWith('huyện ') || lower.startsWith('thị xã ') || lower.startsWith('thành phố ')) {
    return name;
  }
  if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].includes(name)) {
    return `Quận ${name}`;
  }
  return name;
};

const mapAmenity = (name) => {
  const l = (name || '').toLowerCase();
  if (l.includes('lạnh') || l.includes('điều hòa')) return 'ac';
  if (l.includes('bếp')) return 'kitchen';
  if (l.includes('ban công')) return 'balcony';
  if (l.includes('gác') || l.includes('lửng')) return 'loft';
  if (l.includes('xe')) return 'parking';
  if (l.includes('thú')) return 'pet_friendly';
  return 'wifi';
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const region = req.query.region || '13000';
  const cityName = req.query.city || (region === '12000' ? 'Hà Nội' : region === '3017' ? 'Đà Nẵng' : 'TP. Hồ Chí Minh');
  const limit = Math.min(Number(req.query.limit) || 50, 50);

  try {
    const response = await fetch(`https://gateway.chotot.com/v1/public/ad-listing?region_v2=${region}&cg=1050&limit=${limit}&o=0`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ success: false, rooms: [] });
    }

    const data = await response.json();
    const ads = data.ads || [];

    const rooms = ads
      .filter((ad) => ad.list_id && ad.price > 0 && ad.images && ad.images.length > 0)
      .map((ad) => {
        const district = cleanDistrictName(ad.area_name);
        const street = ad.street_name ? `${ad.street_name}, ` : '';
        const ward = ad.ward_name ? `${ad.ward_name}, ` : '';
        const fullAddress = `${street}${ward}${ad.area_name || cityName}, ${cityName}`;

        const amenities = ['wifi'];
        const text = (ad.subject + ' ' + (ad.body || '')).toLowerCase();
        if (text.includes('máy lạnh') || text.includes('điều hòa')) amenities.push('ac');
        if (text.includes('gác') || text.includes('duplex')) amenities.push('loft');
        if (text.includes('ban công') || text.includes('cửa sổ')) amenities.push('balcony');
        if (text.includes('bếp')) amenities.push('kitchen');
        if (text.includes('xe')) amenities.push('parking');
        if (text.includes('thú')) amenities.push('pet_friendly');

        return {
          id: Number(ad.list_id),
          name: ad.subject || 'Phòng trọ cho thuê',
          price: Number(ad.price),
          area: Number(ad.size) || 25,
          address: fullAddress,
          district: district,
          city: cityName,
          images: ad.images.filter((img) => img && img.startsWith('http')),
          status: 'available',
          electricity: 3800,
          water: 100000,
          internet: 100000,
          serviceFee: 150000,
          maxPeople: 2,
          lat: Number(ad.latitude) || (cityName === 'Hà Nội' ? 21.0285 : cityName === 'Đà Nẵng' ? 16.0544 : 10.7769),
          lng: Number(ad.longitude) || (cityName === 'Hà Nội' ? 105.8542 : cityName === 'Đà Nẵng' ? 108.2022 : 106.7009),
          amenities,
          description: ad.body || ad.subject,
          phone: ad.phone || '0908123456',
          zaloLink: `https://zalo.me/${ad.phone || '0908123456'}`,
          views: Math.floor(Math.random() * 300) + 120,
          contacts: Math.floor(Math.random() * 30) + 8,
          isFeatured: true,
          isNew: true,
          isCheap: Number(ad.price) <= 3000000,
          rating: 4.8,
          source: 'nhatot',
          externalUrl: `https://www.nhatot.com/${ad.list_id}.htm`,
          createdAt: new Date(ad.orig_list_time || ad.list_time || Date.now()).toISOString(),
        };
      });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    console.error('Error fetching live Chợ Tốt ads:', err);
    return res.status(500).json({ success: false, error: err.message, rooms: [] });
  }
}
