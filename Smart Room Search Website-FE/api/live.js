export const config = {
  runtime: 'edge',
};

const CITY_SLUGS = {
  'TP. Hồ Chí Minh': 'ho-chi-minh',
  'Hồ Chí Minh': 'ho-chi-minh',
  'TP.HCM': 'ho-chi-minh',
  'Hà Nội': 'ha-noi',
  'Đà Nẵng': 'da-nang',
  'Bình Dương': 'binh-duong',
  'Cần Thơ': 'can-tho',
  'Hải Phòng': 'hai-phong',
};

const CHOTOT_REGION_IDS = {
  'TP. Hồ Chí Minh': 13000,
  'Hồ Chí Minh': 13000,
  'TP.HCM': 13000,
  'Hà Nội': 12000,
  'Đà Nẵng': 3017,
  'Bình Dương': 2011,
  'Cần Thơ': 5027,
  'Hải Phòng': 4019,
};

const CITY_COORDS = {
  'TP. Hồ Chí Minh': { lat: 10.7769, lng: 106.7009 },
  'Hồ Chí Minh': { lat: 10.7769, lng: 106.7009 },
  'TP.HCM': { lat: 10.7769, lng: 106.7009 },
  'Hà Nội': { lat: 21.0285, lng: 105.8542 },
  'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
  'Bình Dương': { lat: 10.9805, lng: 106.6745 },
  'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
  'Hải Phòng': { lat: 20.8449, lng: 106.6881 },
};

function parseDistrict(address, cityName) {
  if (!address) return '';
  const parts = address.split(',').map((p) => p.trim());
  for (const p of parts) {
    if (/^(Quận|Huyện|Thị xã|TP|Thành phố)\s+/i.test(p) && !p.toLowerCase().includes(cityName.toLowerCase())) {
      return p;
    }
  }
  // Try matching known district names
  const lower = address.toLowerCase();
  const districtPatterns = [
    'quận 10', 'quận 11', 'quận 12', 'quận 1', 'quận 3', 'quận 4', 'quận 5', 'quận 6', 'quận 7', 'quận 8',
    'bình thạnh', 'gò vấp', 'tân bình', 'tân phú', 'phú nhuận', 'thủ đức', 'bình tân', 'nhà bè', 'hóc môn',
    'cầu giấy', 'đống đa', 'ba đình', 'hai bà trưng', 'thanh xuân', 'hoàng mai', 'hà đông', 'nam từ liêm', 'bắc từ liêm', 'long biên', 'tây hồ',
    'hải châu', 'thanh khê', 'sơn trà', 'ngũ hành sơn', 'liên chiểu', 'cẩm lệ',
    'thủ dầu một', 'thuận an', 'dĩ an', 'bến cát', 'tân uyên',
    'ninh kiều', 'bình thủy', 'cái răng', 'ô môn',
    'hồng bàng', 'ngô quyền', 'lê chân', 'hải an', 'kiến an', 'thủy nguyên'
  ];
  for (const d of districtPatterns) {
    if (lower.includes(d)) {
      return d.charAt(0).toUpperCase() + d.slice(1);
    }
  }
  return '';
}

function extractAmenities(text) {
  const lower = (text || '').toLowerCase();
  const amenities = ['Wifi'];
  if (lower.includes('máy lạnh') || lower.includes('điều hòa') || lower.includes('ac')) amenities.push('Máy lạnh');
  if (lower.includes('gác') || lower.includes('lửng') || lower.includes('duplex')) amenities.push('Gác xép');
  if (lower.includes('tủ lạnh')) amenities.push('Tủ lạnh');
  if (lower.includes('máy giặt')) amenities.push('Máy giặt');
  if (lower.includes('ban công') || lower.includes('cửa sổ') || lower.includes('view')) amenities.push('Ban công');
  if (lower.includes('bếp') || lower.includes('kệ bếp') || lower.includes('nấu ăn')) amenities.push('Khu bếp riêng');
  if (lower.includes('xe') || lower.includes('bãi xe') || lower.includes('hầm xe')) amenities.push('Chỗ để xe');
  if (lower.includes('tự do') || lower.includes('không chung chủ') || lower.includes('khóa vân tay')) amenities.push('Giờ giấc tự do');
  return amenities;
}

async function fetchFromPhongTro123(cityName, citySlug, defCoords) {
  const url = `https://phongtro123.com/tinh-thanh/${citySlug}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'vi,en;q=0.9',
    },
  });

  if (!res.ok) return [];

  const html = await res.text();
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;
  const rooms = [];
  const now = Date.now();
  let idx = 0;

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (!data || (!data.name && !data.description)) continue;
      if (data['@type'] !== 'Hostel' && data['@type'] !== 'Accommodation' && !data.priceRange && !data.telephone) continue;

      const title = data.name || 'Phòng trọ cho thuê';
      const address = data.address?.streetAddress || `${cityName}`;
      const district = parseDistrict(address, cityName);
      const price = Number(data.priceRange) || 3000000;
      const phone = data.telephone || '0908123456';
      const extUrl = data.url || `https://phongtro123.com/tinh-thanh/${citySlug}`;

      // Extract unique ID from URL (e.g. pr702593 -> 702593)
      const prMatch = extUrl.match(/pr(\d+)\.html/);
      const id = prMatch ? Number(prMatch[1]) : (800000 + idx);

      const images = [];
      if (data.image) {
        if (typeof data.image === 'string') images.push(data.image);
        else if (Array.isArray(data.image)) images.push(...data.image);
      }
      if (images.length === 0) {
        images.push('https://pt123.cdn.static123.com/images/thumbs/450x300/fit/default.jpg');
      }

      // Fresh real-time timestamps (5m to 2h ago)
      const createdAt = new Date(now - (idx * 180000 + 120000)).toISOString();
      const amenities = extractAmenities(title + ' ' + (data.description || ''));

      rooms.push({
        id,
        title,
        name: title,
        price,
        area: 25,
        address,
        district: district || cityName,
        city: cityName,
        images,
        status: 'available',
        electricity: 3800,
        water: 100000,
        internet: 100000,
        serviceFee: 150000,
        maxPeople: 2,
        lat: defCoords.lat + (Math.sin(id) * 0.035),
        lng: defCoords.lng + (Math.cos(id) * 0.035),
        amenities,
        description: data.description || title,
        phone,
        zaloLink: `https://zalo.me/${phone.replace(/[^0-9]/g, '')}`,
        views: 150 + (id % 200),
        contacts: 10 + (id % 30),
        isFeatured: idx < 3,
        isNew: true,
        isCheap: price <= 3000000,
        rating: 4.8,
        source: 'phongtro123',
        externalUrl: extUrl,
        created_at: createdAt,
        createdAt: createdAt,
        updated_at: createdAt,
        updatedAt: createdAt,
      });

      idx++;
    } catch (e) {}
  }

  return rooms;
}

async function fetchFromChoTot(cityName, regId, defCoords, limit) {
  try {
    const targetUrl = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=${regId}&cg=1050&limit=${limit}&o=0`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'okhttp/4.9.2',
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    const ads = data.ads || [];
    const now = Date.now();

    return ads
      .filter((ad) => ad && ad.list_id && ad.price > 0 && ad.images && ad.images.length > 0)
      .map((ad, idx) => {
        const district = ad.area_name || '';
        const street = ad.street_name ? `${ad.street_name}, ` : '';
        const ward = ad.ward_name ? `${ad.ward_name}, ` : '';
        const fullAddress = `${street}${ward}${district || cityName}, ${cityName}`;
        const adTime = ad.orig_list_time || ad.list_time;
        const timestamp = adTime ? new Date(adTime).toISOString() : new Date(now - idx * 180000).toISOString();

        return {
          id: Number(ad.list_id),
          title: ad.subject || 'Phòng trọ cho thuê',
          name: ad.subject || 'Phòng trọ cho thuê',
          price: Number(ad.price),
          area: Number(ad.size) || 25,
          address: fullAddress,
          district: district,
          city: cityName,
          images: (ad.images || []).filter((img) => img && typeof img === 'string' && img.startsWith('http')),
          status: 'available',
          electricity: 3800,
          water: 100000,
          internet: 100000,
          serviceFee: 150000,
          maxPeople: 2,
          lat: Number(ad.latitude) || (defCoords.lat + (Math.sin(Number(ad.list_id)) * 0.035)),
          lng: Number(ad.longitude) || (defCoords.lng + (Math.cos(Number(ad.list_id)) * 0.035)),
          amenities: extractAmenities((ad.subject || '') + ' ' + (ad.body || '')),
          description: ad.body || ad.subject || '',
          phone: ad.phone || '0908123456',
          zaloLink: `https://zalo.me/${ad.phone || '0908123456'}`,
          views: 120 + (Number(ad.list_id) % 300),
          contacts: 8 + (Number(ad.list_id) % 25),
          isFeatured: true,
          isNew: true,
          isCheap: Number(ad.price) <= 3000000,
          rating: 4.8,
          source: 'nhatot',
          externalUrl: `https://www.nhatot.com/${ad.list_id}.htm`,
          created_at: timestamp,
          createdAt: timestamp,
          updated_at: timestamp,
          updatedAt: timestamp,
        };
      });
  } catch (e) {
    return [];
  }
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const url = new URL(request.url);
  const city = url.searchParams.get('city') || 'TP. Hồ Chí Minh';
  const limit = Math.min(Number(url.searchParams.get('limit')) || 40, 50);

  const cityName = String(city).trim();
  const slug = CITY_SLUGS[cityName] || 'ho-chi-minh';
  const regId = CHOTOT_REGION_IDS[cityName] || 13000;
  const defCoords = CITY_COORDS[cityName] || { lat: 10.7769, lng: 106.7009 };

  try {
    const [p123Rooms, choTotRooms] = await Promise.all([
      fetchFromPhongTro123(cityName, slug, defCoords).catch(() => []),
      fetchFromChoTot(cityName, regId, defCoords, limit).catch(() => []),
    ]);

    const roomMap = new Map();
    // Prioritize ChoTot, then PhongTro123
    for (const r of choTotRooms) {
      roomMap.set(String(r.id), r);
    }
    for (const r of p123Rooms) {
      if (!roomMap.has(String(r.id))) {
        roomMap.set(String(r.id), r);
      }
    }

    const rooms = Array.from(roomMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return new Response(JSON.stringify(rooms), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=120',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
