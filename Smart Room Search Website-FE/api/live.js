export const config = {
  runtime: 'edge',
};

const REGION_IDS = {
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
  const limit = Math.min(Number(url.searchParams.get('limit')) || 50, 60);

  const cityName = String(city).trim();
  const regId = REGION_IDS[cityName] || 13000;
  const defCoords = CITY_COORDS[cityName] || { lat: 10.7769, lng: 106.7009 };

  try {
    const targetUrl = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=${regId}&cg=1050&limit=${limit}&o=0`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status}`);
    }

    const data = await response.json();
    const ads = data.ads || [];
    const now = Date.now();

    const rooms = ads
      .filter((ad) => ad && ad.list_id && ad.price > 0 && ad.images && ad.images.length > 0)
      .map((ad, idx) => {
        const district = ad.area_name || '';
        const street = ad.street_name ? `${ad.street_name}, ` : '';
        const ward = ad.ward_name ? `${ad.ward_name}, ` : '';
        const fullAddress = `${street}${ward}${district || cityName}, ${cityName}`;

        const text = ((ad.subject || '') + ' ' + (ad.body || '')).toLowerCase();
        const amenities = ['Wifi'];
        if (text.includes('máy lạnh') || text.includes('điều hòa')) amenities.push('Máy lạnh');
        if (text.includes('gác') || text.includes('duplex')) amenities.push('Gác xép');
        if (text.includes('tủ lạnh')) amenities.push('Tủ lạnh');
        if (text.includes('máy giặt')) amenities.push('Máy giặt');
        if (text.includes('ban công') || text.includes('cửa sổ')) amenities.push('Ban công');
        if (text.includes('bếp') || text.includes('kệ bếp')) amenities.push('Khu bếp riêng');
        if (text.includes('xe') || text.includes('bãi xe')) amenities.push('Chỗ để xe');
        if (text.includes('tự do') || text.includes('không chung chủ')) amenities.push('Giờ giấc tự do');

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
          lat: Number(ad.latitude) || (defCoords.lat + (Math.random() - 0.5) * 0.05),
          lng: Number(ad.longitude) || (defCoords.lng + (Math.random() - 0.5) * 0.05),
          amenities,
          description: ad.body || ad.subject || '',
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
          created_at: timestamp,
          createdAt: timestamp,
          updated_at: timestamp,
          updatedAt: timestamp,
        };
      });

    return new Response(JSON.stringify(rooms), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=30, s-maxage=60',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
