export interface CityItem {
  id: string;
  name: string;
  shortName: string;
  isPopular?: boolean;
}

export const CITIES: CityItem[] = [
  { id: 'hcm', name: 'TP. Hồ Chí Minh', shortName: 'TP.HCM', isPopular: true },
  { id: 'hn', name: 'Hà Nội', shortName: 'Hà Nội', isPopular: true },
  { id: 'dn', name: 'Đà Nẵng', shortName: 'Đà Nẵng', isPopular: true },
  { id: 'bd', name: 'Bình Dương', shortName: 'Bình Dương', isPopular: true },
  { id: 'ct', name: 'Cần Thơ', shortName: 'Cần Thơ', isPopular: false },
  { id: 'hp', name: 'Hải Phòng', shortName: 'Hải Phòng', isPopular: false },
  { id: 'dnai', name: 'Đồng Nai', shortName: 'Đồng Nai', isPopular: false },
  { id: 'vt', name: 'Bà Rịa - Vũng Tàu', shortName: 'Vũng Tàu', isPopular: false },
];

export interface DistrictCategory {
  name: string;
  districts: string[];
}

export const DISTRICT_CATEGORIES: DistrictCategory[] = [
  {
    name: 'Khu vực Trung tâm',
    districts: ['Quận 1', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 10', 'Phú Nhuận'],
  },
  {
    name: 'Khu vực Phía Đông (TP. Thủ Đức)',
    districts: ['Thành phố Thủ Đức', 'Thủ Đức', 'Bình Thạnh'],
  },
  {
    name: 'Khu vực Phía Tây / Tây Bắc',
    districts: ['Tân Bình', 'Tân Phú', 'Bình Tân', 'Gò Vấp', 'Quận 6', 'Quận 11', 'Quận 12'],
  },
  {
    name: 'Khu vực Phía Nam',
    districts: ['Quận 7', 'Quận 8', 'Nhà Bè', 'Bình Chánh', 'Cần Giờ'],
  },
  {
    name: 'Khu vực Ngoại thành',
    districts: ['Hóc Môn', 'Củ Chi'],
  },
];

export const ALL_HCM_DISTRICTS: string[] = [
  'Tất cả',
  'Quận 1',
  'Quận 3',
  'Quận 4',
  'Quận 5',
  'Quận 6',
  'Quận 7',
  'Quận 8',
  'Quận 10',
  'Quận 11',
  'Quận 12',
  'Bình Thạnh',
  'Gò Vấp',
  'Tân Bình',
  'Tân Phú',
  'Phú Nhuận',
  'Bình Tân',
  'Thành phố Thủ Đức',
  'Thủ Đức',
  'Bình Chánh',
  'Hóc Môn',
  'Nhà Bè',
  'Củ Chi',
  'Cần Giờ',
];

export const WARDS_BY_DISTRICT: Record<string, string[]> = {
  'Quận 1': [
    'Bến Nghé', 'Bến Thành', 'Cô Giang', 'Cầu Kho', 'Cầu Ông Lãnh',
    'Đa Kao', 'Nguyễn Cư Trinh', 'Nguyễn Thái Bình', 'Phạm Ngũ Lão', 'Tân Định'
  ],
  'Quận 3': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 14', 'Võ Thị Sáu'
  ],
  'Quận 4': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 6', 'Phường 8',
    'Phường 9', 'Phường 10', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16', 'Phường 18'
  ],
  'Quận 5': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'
  ],
  'Quận 6': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14'
  ],
  'Quận 7': [
    'Bình Thuận', 'Phú Mỹ', 'Phú Thuận', 'Tân Hưng', 'Tân Kiểng',
    'Tân Phong', 'Tân Phú', 'Tân Quy', 'Tân Thuận Đông', 'Tân Thuận Tây'
  ],
  'Quận 8': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16'
  ],
  'Quận 10': [
    'Phường 1', 'Phường 2', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'
  ],
  'Quận 11': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16'
  ],
  'Quận 12': [
    'An Phú Đông', 'Đông Hưng Thuận', 'Hiệp Thành', 'Tân Chánh Hiệp', 'Tân Hưng Thuận',
    'Tân Thới Hiệp', 'Tân Thới Nhất', 'Thạnh Lộc', 'Thạnh Xuân', 'Thới An', 'Trung Mỹ Tây'
  ],
  'Bình Thạnh': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17',
    'Phường 19', 'Phường 21', 'Phường 22', 'Phường 24', 'Phường 25', 'Phường 26', 'Phường 27', 'Phường 28'
  ],
  'Gò Vấp': [
    'Phường 1', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13',
    'Phường 14', 'Phường 15', 'Phường 16', 'Phường 17'
  ],
  'Phú Nhuận': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 13', 'Phường 15', 'Phường 17'
  ],
  'Tân Bình': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6',
    'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12',
    'Phường 13', 'Phường 14', 'Phường 15'
  ],
  'Tân Phú': [
    'Hiệp Tân', 'Hòa Thạnh', 'Phú Thạnh', 'Phú Thọ Hòa', 'Phú Trung',
    'Sơn Kỳ', 'Tân Quý', 'Tân Sơn Nhì', 'Tân Thành', 'Tân Thới Hòa', 'Tây Thạnh'
  ],
  'Bình Tân': [
    'An Lạc', 'An Lạc A', 'Bình Hưng Hòa', 'Bình Hưng Hòa A', 'Bình Hưng Hòa B',
    'Bình Trị Đông', 'Bình Trị Đông A', 'Bình Trị Đông B', 'Tân Tạo', 'Tân Tạo A'
  ],
  'Thành phố Thủ Đức': [
    'An Khánh', 'An Lợi Đông', 'An Phú', 'Bình Chiểu', 'Bình Thọ', 'Bình Trưng Đông',
    'Bình Trưng Tây', 'Cát Lái', 'Hiệp Bình Chánh', 'Hiệp Bình Phước', 'Hiệp Phú',
    'Linh Chiểu', 'Linh Đông', 'Linh Tây', 'Linh Trung', 'Linh Xuân', 'Long Bình',
    'Long Phước', 'Long Thạnh Mỹ', 'Long Trường', 'Phú Hữu', 'Phước Bình', 'Phước Long A',
    'Phước Long B', 'Tam Bình', 'Tam Phú', 'Tăng Nhơn Phú A', 'Tăng Nhơn Phú B', 'Thạnh Mỹ Lợi',
    'Thảo Điền', 'Thủ Thiêm', 'Trường Thạnh', 'Trường Thọ'
  ],
  'Thủ Đức': [
    'Hiệp Bình Chánh', 'Hiệp Bình Phước', 'Linh Chiểu', 'Linh Đông',
    'Linh Tây', 'Linh Trung', 'Linh Xuân', 'Tam Bình', 'Tam Phú', 'Bình Chiểu', 'Bình Thọ', 'Trường Thọ'
  ],
  'Bình Chánh': [
    'Thị trấn Tân Túc', 'An Phú Tây', 'Bình Chánh', 'Bình Hưng', 'Bình Lợi',
    'Đa Phước', 'Hưng Long', 'Lê Minh Xuân', 'Phạm Văn Hai', 'Phong Phú',
    'Quy Đức', 'Tân Kiên', 'Tân Nhựt', 'Tân Quý Tây', 'Vĩnh Lộc A', 'Vĩnh Lộc B'
  ],
  'Hóc Môn': [
    'Thị trấn Hóc Môn', 'Bà Điểm', 'Đông Thạnh', 'Nhị Bình', 'Tân Hiệp',
    'Tân Thới Nhì', 'Tân Xuân', 'Thới Tam Thôn', 'Trung Chánh', 'Xuân Thới Đông',
    'Xuân Thới Sơn', 'Xuân Thới Thượng'
  ],
  'Nhà Bè': [
    'Thị trấn Nhà Bè', 'Hiệp Phước', 'Long Thới', 'Nhơn Đức', 'Phú Xuân', 'Phước Kiển', 'Phước Lộc'
  ],
  'Củ Chi': [
    'Thị trấn Củ Chi', 'An Nhơn Tây', 'An Phú', 'Bình Mỹ', 'Hòa Phú',
    'Nhuận Đức', 'Phạm Văn Cội', 'Phú Hòa Đông', 'Phú Mỹ Hưng', 'Tân An Hội',
    'Tân Phú Trung', 'Tân Thạnh Đông', 'Tân Thạnh Tây', 'Tân Thông Hội', 'Thái Mỹ', 'Trung An', 'Trung Lập Hạ', 'Trung Lập Thượng'
  ],
  'Cần Giờ': [
    'Thị trấn Cần Thạnh', 'An Thới Đông', 'Bình Khánh', 'Long Hòa', 'Lý Nhơn', 'Tam Thôn Hiệp', 'Thạnh An'
  ],
};

export const SOURCE_OPTIONS = [
  { value: 'all', label: 'Tất cả nguồn' },
  { value: 'local', label: 'Website của tôi (Chính chủ)' },
  { value: 'external', label: 'Nguồn ngoài (Chợ Tốt, BĐS, Phongtro123)' },
  { value: 'nhatot', label: 'Chợ Tốt Nhà' },
  { value: 'batdongsan', label: 'Batdongsan.com.vn' },
  { value: 'phongtro123', label: 'Phongtro123.com' },
];

export function getWardsForDistrict(district: string): string[] {
  if (!district || district === 'Tất cả') return [];
  // Direct match or normalized match
  if (WARDS_BY_DISTRICT[district]) {
    return ['Tất cả', ...WARDS_BY_DISTRICT[district]];
  }
  const cleanDistrict = district.replace(/^Quận\s+/i, '').trim();
  for (const [key, wards] of Object.entries(WARDS_BY_DISTRICT)) {
    if (key.includes(cleanDistrict) || district.includes(key)) {
      return ['Tất cả', ...wards];
    }
  }
  return ['Tất cả'];
}
