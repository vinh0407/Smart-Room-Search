const fs = require('fs');
const path = require('path');

const targets = [
  { city: 'Hà Nội', region: '12000', latRange: [20.98, 21.06], lngRange: [105.77, 105.86], pages: 5 },
  { city: 'Đà Nẵng', region: '3017', latRange: [16.03, 16.08], lngRange: [108.19, 108.24], pages: 3 },
  { city: 'Bình Dương', region: '2011', latRange: [10.94, 11.00], lngRange: [106.65, 106.72], pages: 2 },
  { city: 'Cần Thơ', region: '5027', latRange: [10.02, 10.06], lngRange: [105.74, 105.79], pages: 1 },
  { city: 'Hải Phòng', region: '4019', latRange: [20.83, 20.87], lngRange: [106.67, 106.71], pages: 1 }
];

const cleanDistrictName = (rawDistrict = '') => {
  if (!rawDistrict) return '';
  let d = rawDistrict.trim();
  return d;
};

async function main() {
  const existingRoomsPath = path.join(__dirname, '..', 'Smart Room Search Website-FE', 'src', 'data', 'realRoomsData.json');
  const existingRooms = JSON.parse(fs.readFileSync(existingRoomsPath, 'utf8'));
  console.log('Existing rooms:', existingRooms.length);

  const newRooms = [];
  let nextId = 50000;

  for (const t of targets) {
    let cityAds = [];
    const seenIds = new Set();

    for (let p = 0; p < t.pages; p++) {
      try {
        const offset = p * 50;
        const url = `https://gateway.chotot.com/v1/public/ad-listing?region_v2=${t.region}&cg=1050&limit=50&o=${offset}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ads && Array.isArray(data.ads)) {
            for (const ad of data.ads) {
              if (!ad.list_id || seenIds.has(ad.list_id)) continue;
              seenIds.add(ad.list_id);
              cityAds.push(ad);
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching ${t.city} page ${p}:`, err.message);
      }
    }

    console.log(`Fetched ${cityAds.length} unique ads for ${t.city}`);

    for (const ad of cityAds) {
      if (!ad.subject || (!ad.image && (!ad.images || ad.images.length === 0))) continue;
      
      const price = Number(ad.price) || (2000000 + Math.floor(Math.random() * 40) * 100000);
      const area = Number(ad.size) || (15 + Math.floor(Math.random() * 25));
      const district = cleanDistrictName(ad.area_name) || 'Trung tâm';
      const ward = ad.ward_name ? `${ad.ward_name}, ` : '';
      const street = ad.street_name ? `${ad.street_name}, ` : '';
      const address = `${street}${ward}${district}, ${t.city}`;

      let images = [];
      if (ad.images && Array.isArray(ad.images)) {
        images = ad.images.filter(img => typeof img === 'string' && img.startsWith('http'));
      }
      if (images.length === 0 && ad.image) {
        images = [ad.image];
      }
      if (images.length === 0) continue;

      const amenities = ['Wifi'];
      const text = (ad.subject + ' ' + (ad.body || '')).toLowerCase();
      if (text.includes('máy lạnh') || text.includes('điều hòa')) amenities.push('Máy lạnh');
      if (text.includes('gác') || text.includes('duplex') || text.includes('lửng')) amenities.push('Gác lửng');
      if (text.includes('tủ lạnh')) amenities.push('Tủ lạnh');
      if (text.includes('máy giặt')) amenities.push('Máy giặt');
      if (text.includes('ban công') || text.includes('cửa sổ')) amenities.push('Ban công');
      if (text.includes('bảo vệ') || text.includes('an ninh') || text.includes('camera')) amenities.push('Bảo vệ 24/7');
      if (text.includes('xe') || text.includes('bãi xe')) amenities.push('Bãi xe');

      // Random lat/lng inside city bounding box
      const lat = Number((t.latRange[0] + Math.random() * (t.latRange[1] - t.latRange[0])).toFixed(6));
      const lng = Number((t.lngRange[0] + Math.random() * (t.lngRange[1] - t.lngRange[0])).toFixed(6));

      newRooms.push({
        id: nextId++,
        title: ad.subject,
        name: ad.subject,
        description: ad.body || `Phòng trọ cao cấp, vị trí đẹp tại ${district}, ${t.city}. Đầy đủ tiện nghi, an ninh đảm bảo, giờ giấc tự do.`,
        address,
        price,
        area,
        images,
        image: images[0],
        status: 'available',
        electricity: 3800,
        water: 100000,
        internet: 100000,
        serviceFee: 150000,
        maxPeople: 2,
        district,
        city: t.city,
        lat,
        lng,
        amenities,
        phone: '0908889999',
        zaloLink: 'https://zalo.me/0908889999',
        views: Math.floor(Math.random() * 400) + 100,
        contacts: Math.floor(Math.random() * 30) + 5,
        isFeatured: Math.random() > 0.6,
        isNew: true,
        isCheap: price <= 3000000,
        rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
        source: 'Chợ Tốt Nhà',
        externalUrl: `https://www.chotot.com/${ad.list_id}.htm`,
        verified: true,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  console.log(`Generated ${newRooms.length} new rooms for other cities.`);

  // Keep all existing TP.HCM rooms (ensure city is set to 'TP. Hồ Chí Minh')
  const updatedExisting = existingRooms.map(r => ({
    ...r,
    city: 'TP. Hồ Chí Minh'
  }));

  const allMergedRooms = [...updatedExisting, ...newRooms];
  console.log(`Total combined rooms: ${allMergedRooms.length}`);

  // Summary per city
  const cityCounts = {};
  allMergedRooms.forEach(r => {
    cityCounts[r.city] = (cityCounts[r.city] || 0) + 1;
  });
  console.log('Final city counts:', cityCounts);

  // Write to FE
  fs.writeFileSync(existingRoomsPath, JSON.stringify(allMergedRooms, null, 2), 'utf8');
  console.log('Saved to:', existingRoomsPath);

  // Write to Android assets
  const androidAssetsPath = path.join(__dirname, '..', 'Smart Room Search Website-FE', 'android', 'app', 'src', 'main', 'assets', 'real_rooms.json');
  if (fs.existsSync(path.dirname(androidAssetsPath))) {
    fs.writeFileSync(androidAssetsPath, JSON.stringify(allMergedRooms, null, 2), 'utf8');
    console.log('Saved to Android assets:', androidAssetsPath);
  }
}

main().catch(console.error);
