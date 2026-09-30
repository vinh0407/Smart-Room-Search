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

export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'TP. Hồ Chí Minh': { lat: 10.7769, lng: 106.7009 },
  'TP.HCM': { lat: 10.7769, lng: 106.7009 },
  'Hà Nội': { lat: 21.0285, lng: 105.8542 },
  'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
  'Bình Dương': { lat: 10.9804, lng: 106.6519 },
  'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
  'Hải Phòng': { lat: 20.8449, lng: 106.6881 },
  'Đồng Nai': { lat: 10.9574, lng: 106.8427 },
  'Bà Rịa - Vũng Tàu': { lat: 10.3460, lng: 107.0843 },
};

export const DISTRICT_CATEGORIES_BY_CITY: Record<string, DistrictCategory[]> = {
  'TP. Hồ Chí Minh': [
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
  ],
  'Hà Nội': [
    {
      name: 'Khu vực Trung tâm (Nội đô)',
      districts: ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Hai Bà Trưng'],
    },
    {
      name: 'Khu vực Phía Tây (Sinh viên & Văn phòng)',
      districts: ['Quận Cầu Giấy', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Quận Thanh Xuân', 'Quận Hà Đông'],
    },
    {
      name: 'Khu vực Phía Bắc & Phía Đông',
      districts: ['Quận Tây Hồ', 'Quận Long Biên', 'Huyện Đông Anh', 'Huyện Gia Lâm'],
    },
    {
      name: 'Khu vực Phía Nam',
      districts: ['Quận Hoàng Mai', 'Huyện Thanh Trì', 'Huyện Thường Tín'],
    },
  ],
  'Đà Nẵng': [
    {
      name: 'Khu vực Trung tâm',
      districts: ['Quận Hải Châu', 'Quận Thanh Khê'],
    },
    {
      name: 'Khu vực Ven biển',
      districts: ['Quận Sơn Trà', 'Quận Ngũ Hành Sơn'],
    },
    {
      name: 'Khu vực Phía Tây & Ngoại ô',
      districts: ['Quận Liên Chiểu', 'Quận Cẩm Lệ', 'Huyện Hòa Vang'],
    },
  ],
  'Bình Dương': [
    {
      name: 'Khu vực Đô thị Trung tâm',
      districts: ['Thành phố Thủ Dầu Một', 'Thành phố Dĩ An', 'Thành phố Thuận An'],
    },
    {
      name: 'Khu vực Công nghiệp Mở rộng',
      districts: ['Thị xã Bến Cát', 'Thị xã Tân Uyên', 'Huyện Bàu Bàng'],
    },
  ],
  'Cần Thơ': [
    {
      name: 'Khu vực Trung tâm',
      districts: ['Quận Ninh Kiều', 'Quận Bình Thủy', 'Quận Cái Răng'],
    },
    {
      name: 'Khu vực Vùng ven',
      districts: ['Quận Ô Môn', 'Quận Thốt Nốt', 'Huyện Phong Điền'],
    },
  ],
  'Hải Phòng': [
    {
      name: 'Khu vực Nội thành',
      districts: ['Quận Hồng Bàng', 'Quận Ngô Quyền', 'Quận Lê Chân', 'Quận Hải An'],
    },
    {
      name: 'Khu vực Mở rộng',
      districts: ['Quận Kiến An', 'Quận Đồ Sơn', 'Huyện Thủy Nguyên'],
    },
  ],
};

export const DISTRICT_CATEGORIES: DistrictCategory[] = DISTRICT_CATEGORIES_BY_CITY['TP. Hồ Chí Minh'];

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
  // TP.HCM
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
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 11',
    'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 17', 'Phường 19', 'Phường 21',
    'Phường 22', 'Phường 24', 'Phường 25', 'Phường 26', 'Phường 27', 'Phường 28'
  ],
  'Gò Vấp': [
    'Phường 1', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7', 'Phường 8',
    'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15', 'Phường 16', 'Phường 17'
  ],
  'Tân Bình': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14', 'Phường 15'
  ],
  'Tân Phú': [
    'Hiệp Tân', 'Hòa Thạnh', 'Phú Thạnh', 'Phú Thọ Hòa', 'Phú Trung',
    'Sơn Kỳ', 'Tân Quý', 'Tân Sơn Nhì', 'Tân Thành', 'Tân Thới Hòa', 'Tây Thạnh'
  ],
  'Phú Nhuận': [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 7',
    'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 13', 'Phường 15', 'Phường 17'
  ],
  'Bình Tân': [
    'An Lạc', 'An Lạc A', 'Bình Hưng Hòa', 'Bình Hưng Hòa A', 'Bình Hưng Hòa B',
    'Bình Trị Đông', 'Bình Trị Đông A', 'Bình Trị Đông B', 'Tân Tạo', 'Tân Tạo A'
  ],
  'Thành phố Thủ Đức': [
    'An Khánh', 'An Lợi Đông', 'An Phú', 'Bình Chiểu', 'Bình Thọ', 'Cát Lái', 'Hiệp Bình Chánh',
    'Hiệp Bình Phước', 'Hiệp Phú', 'Linh Chiểu', 'Linh Đông', 'Linh Tây', 'Linh Trung',
    'Linh Xuân', 'Long Bình', 'Long Phước', 'Long Thạnh Mỹ', 'Long Trường', 'Phú Hữu',
    'Phước Bình', 'Phước Long A', 'Phước Long B', 'Tam Bình', 'Tam Phú', 'Tăng Nhơn Phú A',
    'Tăng Nhơn Phú B', 'Thạnh Mỹ Lợi', 'Thảo Điền', 'Thủ Thiêm', 'Trường Thạnh', 'Trường Thọ'
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

  // Hà Nội
  'Quận Cầu Giấy': ['Dịch Vọng', 'Dịch Vọng Hậu', 'Mai Dịch', 'Nghĩa Đô', 'Nghĩa Tân', 'Quan Hoa', 'Trung Hòa', 'Yên Hòa'],
  'Cầu Giấy': ['Dịch Vọng', 'Dịch Vọng Hậu', 'Mai Dịch', 'Nghĩa Đô', 'Nghĩa Tân', 'Quan Hoa', 'Trung Hòa', 'Yên Hòa'],
  'Quận Đống Đa': ['Cát Linh', 'Hàng Bột', 'Khâm Thiên', 'Khương Thượng', 'Kim Liên', 'Láng Hạ', 'Láng Thượng', 'Nam Đồng', 'Ô Chợ Dừa', 'Phương Mai', 'Quang Trung', 'Thịnh Quang', 'Trung Liệt', 'Văn Miếu'],
  'Đống Đa': ['Cát Linh', 'Hàng Bột', 'Khâm Thiên', 'Khương Thượng', 'Kim Liên', 'Láng Hạ', 'Láng Thượng', 'Nam Đồng', 'Ô Chợ Dừa', 'Phương Mai', 'Quang Trung', 'Thịnh Quang', 'Trung Liệt', 'Văn Miếu'],
  'Quận Ba Đình': ['Cống Vị', 'Điện Biên', 'Đội Cấn', 'Giảng Võ', 'Kim Mã', 'Liễu Giai', 'Ngọc Hà', 'Ngọc Khánh', 'Thành Công', 'Trúc Bạch', 'Vĩnh Phúc'],
  'Ba Đình': ['Cống Vị', 'Điện Biên', 'Đội Cấn', 'Giảng Võ', 'Kim Mã', 'Liễu Giai', 'Ngọc Hà', 'Ngọc Khánh', 'Thành Công', 'Trúc Bạch', 'Vĩnh Phúc'],
  'Quận Hai Bà Trưng': ['Bạch Đằng', 'Bách Khoa', 'Bạch Mai', 'Cầu Dền', 'Đồng Nhân', 'Đồng Tâm', 'Lê Đại Hành', 'Minh Khai', 'Phố Huế', 'Quỳnh Lôi', 'Thanh Nhàn', 'Trương Định', 'Vĩnh Tuy'],
  'Hai Bà Trưng': ['Bạch Đằng', 'Bách Khoa', 'Bạch Mai', 'Cầu Dền', 'Đồng Nhân', 'Đồng Tâm', 'Lê Đại Hành', 'Minh Khai', 'Phố Huế', 'Quỳnh Lôi', 'Thanh Nhàn', 'Trương Định', 'Vĩnh Tuy'],
  'Quận Thanh Xuân': ['Hạ Đình', 'Khương Đình', 'Khương Mai', 'Khương Trung', 'Kim Giang', 'Nhân Chính', 'Phương Liệt', 'Thanh Xuân Bắc', 'Thanh Xuân Nam', 'Thanh Xuân Trung', 'Thượng Đình'],
  'Thanh Xuân': ['Hạ Đình', 'Khương Đình', 'Khương Mai', 'Khương Trung', 'Kim Giang', 'Nhân Chính', 'Phương Liệt', 'Thanh Xuân Bắc', 'Thanh Xuân Nam', 'Thanh Xuân Trung', 'Thượng Đình'],
  'Quận Nam Từ Liêm': ['Cầu Diễn', 'Đại Mỗ', 'Mễ Trì', 'Mỹ Đình 1', 'Mỹ Đình 2', 'Phú Đô', 'Phương Canh', 'Tây Mỗ', 'Trung Văn', 'Xuân Phương'],
  'Nam Từ Liêm': ['Cầu Diễn', 'Đại Mỗ', 'Mễ Trì', 'Mỹ Đình 1', 'Mỹ Đình 2', 'Phú Đô', 'Phương Canh', 'Tây Mỗ', 'Trung Văn', 'Xuân Phương'],
  'Quận Bắc Từ Liêm': ['Cổ Nhuế 1', 'Cổ Nhuế 2', 'Đông Ngạc', 'Đức Thắng', 'Liên Mạc', 'Minh Khai', 'Phú Diễn', 'Phúc Diễn', 'Tây Tựu', 'Thượng Cát', 'Thụy Phương', 'Xuân Đỉnh', 'Xuân Tảo'],
  'Bắc Từ Liêm': ['Cổ Nhuế 1', 'Cổ Nhuế 2', 'Đông Ngạc', 'Đức Thắng', 'Liên Mạc', 'Minh Khai', 'Phú Diễn', 'Phúc Diễn', 'Tây Tựu', 'Thượng Cát', 'Thụy Phương', 'Xuân Đỉnh', 'Xuân Tảo'],
  'Quận Hoàng Mai': ['Định Công', 'Đại Kim', 'Giáp Bát', 'Hoàng Liệt', 'Hoàng Văn Thụ', 'Lĩnh Nam', 'Mai Động', 'Tân Mai', 'Thịnh Liệt', 'Trần Phú', 'Tương Mai', 'Vĩnh Hưng', 'Yên Sở'],
  'Hoàng Mai': ['Định Công', 'Đại Kim', 'Giáp Bát', 'Hoàng Liệt', 'Hoàng Văn Thụ', 'Lĩnh Nam', 'Mai Động', 'Tân Mai', 'Thịnh Liệt', 'Trần Phú', 'Tương Mai', 'Vĩnh Hưng', 'Yên Sở'],
  'Quận Hà Đông': ['Biên Giang', 'Đồng Mai', 'Dương Nội', 'Hà Cầu', 'Kiến Hưng', 'La Khê', 'Mộ Lao', 'Nguyễn Trãi', 'Phú La', 'Phúc La', 'Quang Trung', 'Vạn Phúc', 'Văn Quán', 'Yên Nghĩa'],
  'Hà Đông': ['Biên Giang', 'Đồng Mai', 'Dương Nội', 'Hà Cầu', 'Kiến Hưng', 'La Khê', 'Mộ Lao', 'Nguyễn Trãi', 'Phú La', 'Phúc La', 'Quang Trung', 'Vạn Phúc', 'Văn Quán', 'Yên Nghĩa'],
  'Quận Tây Hồ': ['Bưởi', 'Nhật Tân', 'Phú Thượng', 'Quảng An', 'Thụy Khuê', 'Tứ Liên', 'Xuân La', 'Yên Phụ'],
  'Tây Hồ': ['Bưởi', 'Nhật Tân', 'Phú Thượng', 'Quảng An', 'Thụy Khuê', 'Tứ Liên', 'Xuân La', 'Yên Phụ'],

  // Đà Nẵng
  'Quận Hải Châu': ['Hải Châu 1', 'Hải Châu 2', 'Thạch Thang', 'Thanh Bình', 'Thuận Phước', 'Hòa Thuận Tây', 'Hòa Thuận Đông', 'Nam Dương', 'Phước Ninh', 'Bình Thuận', 'Bình Hiên', 'Hòa Cường Bắc', 'Hòa Cường Nam'],
  'Hải Châu': ['Hải Châu 1', 'Hải Châu 2', 'Thạch Thang', 'Thanh Bình', 'Thuận Phước', 'Hòa Thuận Tây', 'Hòa Thuận Đông', 'Nam Dương', 'Phước Ninh', 'Bình Thuận', 'Bình Hiên', 'Hòa Cường Bắc', 'Hòa Cường Nam'],
  'Quận Sơn Trà': ['An Hải Bắc', 'An Hải Đông', 'An Hải Tây', 'Mân Thái', 'Nại Hiên Đông', 'Phước Mỹ', 'Thọ Quang'],
  'Sơn Trà': ['An Hải Bắc', 'An Hải Đông', 'An Hải Tây', 'Mân Thái', 'Nại Hiên Đông', 'Phước Mỹ', 'Thọ Quang'],
  'Quận Ngũ Hành Sơn': ['Khuê Mỹ', 'Mỹ An', 'Hòa Hải', 'Hòa Quý'],
  'Ngũ Hành Sơn': ['Khuê Mỹ', 'Mỹ An', 'Hòa Hải', 'Hòa Quý'],
  'Quận Thanh Khê': ['An Khê', 'Chính Gián', 'Hòa Khê', 'Tam Thuận', 'Tân Chính', 'Thạc Gián', 'Thanh Khê Đông', 'Thanh Khê Tây', 'Vĩnh Trung', 'Xuân Hà'],
  'Thanh Khê': ['An Khê', 'Chính Gián', 'Hòa Khê', 'Tam Thuận', 'Tân Chính', 'Thạc Gián', 'Thanh Khê Đông', 'Thanh Khê Tây', 'Vĩnh Trung', 'Xuân Hà'],
  'Quận Liên Chiểu': ['Hòa Hiệp Bắc', 'Hòa Hiệp Nam', 'Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Minh'],
  'Liên Chiểu': ['Hòa Hiệp Bắc', 'Hòa Hiệp Nam', 'Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Minh'],

  // Bình Dương
  'Thành phố Thủ Dầu Một': ['Chánh Mỹ', 'Chánh Nghĩa', 'Định Hòa', 'Hiệp An', 'Hiệp Thành', 'Hòa Phú', 'Phú Cường', 'Phú Hòa', 'Phú Lợi', 'Phú Mỹ', 'Phú Tân', 'Phú Thọ', 'Tân An'],
  'Thủ Dầu Một': ['Chánh Mỹ', 'Chánh Nghĩa', 'Định Hòa', 'Hiệp An', 'Hiệp Thành', 'Hòa Phú', 'Phú Cường', 'Phú Hòa', 'Phú Lợi', 'Phú Mỹ', 'Phú Tân', 'Phú Thọ', 'Tân An'],
  'Thành phố Dĩ An': ['An Bình', 'Bình An', 'Bình Thắng', 'Dĩ An', 'Đông Hòa', 'Tân Bình', 'Tân Đông Hiệp'],
  'Dĩ An': ['An Bình', 'Bình An', 'Bình Thắng', 'Dĩ An', 'Đông Hòa', 'Tân Bình', 'Tân Đông Hiệp'],
  'Thành phố Thuận An': ['An Phú', 'An Thạnh', 'Bình Chuẩn', 'Bình Hòa', 'Bình Nhâm', 'Hưng Định', 'Lái Thiêu', 'Thuận Giao', 'Vĩnh Phú'],
  'Thuận An': ['An Phú', 'An Thạnh', 'Bình Chuẩn', 'Bình Hòa', 'Bình Nhâm', 'Hưng Định', 'Lái Thiêu', 'Thuận Giao', 'Vĩnh Phú'],
};

export const SOURCE_OPTIONS = [
  { value: 'all', label: 'Tất cả nguồn' },
  { value: 'local', label: 'Website của tôi (Chính chủ)' },
  { value: 'external', label: 'Nguồn ngoài (Chợ Tốt, BĐS, Phongtro123)' },
  { value: 'nhatot', label: 'Chợ Tốt Nhà' },
  { value: 'batdongsan', label: 'Batdongsan.com.vn' },
  { value: 'phongtro123', label: 'Phongtro123.com' },
];

export function normalizeCityName(cityName?: string): string {
  if (!cityName) return 'TP. Hồ Chí Minh';
  const c = cityName.trim().toLowerCase();
  if (c.includes('hồ chí minh') || c.includes('hcm') || c.includes('sài gòn')) return 'TP. Hồ Chí Minh';
  if (c.includes('hà nội') || c.includes('ha noi')) return 'Hà Nội';
  if (c.includes('đà nẵng') || c.includes('da nang')) return 'Đà Nẵng';
  if (c.includes('bình dương') || c.includes('binh duong')) return 'Bình Dương';
  if (c.includes('cần thơ') || c.includes('can tho')) return 'Cần Thơ';
  if (c.includes('hải phòng') || c.includes('hai phong')) return 'Hải Phòng';
  if (c.includes('đồng nai') || c.includes('dong nai')) return 'Đồng Nai';
  if (c.includes('vũng tàu') || c.includes('vung tau')) return 'Bà Rịa - Vũng Tàu';
  return cityName;
}

export function getDistrictCategoriesForCity(cityName?: string): DistrictCategory[] {
  const norm = normalizeCityName(cityName);
  return DISTRICT_CATEGORIES_BY_CITY[norm] || DISTRICT_CATEGORIES_BY_CITY['TP. Hồ Chí Minh'];
}

export function getDistrictsForCity(cityName?: string): string[] {
  const categories = getDistrictCategoriesForCity(cityName);
  const districtList: string[] = ['Tất cả'];
  categories.forEach((cat) => {
    cat.districts.forEach((d) => {
      if (!districtList.includes(d)) districtList.push(d);
    });
  });
  return districtList;
}

export function getWardsForDistrict(district: string): string[] {
  if (!district || district === 'Tất cả') return [];
  if (WARDS_BY_DISTRICT[district]) {
    return ['Tất cả', ...WARDS_BY_DISTRICT[district]];
  }
  const cleanDistrict = district.replace(/^Quận\s+/i, '').replace(/^Thành phố\s+/i, '').replace(/^Thị xã\s+/i, '').trim();
  for (const [key, wards] of Object.entries(WARDS_BY_DISTRICT)) {
    if (key.includes(cleanDistrict) || district.includes(key)) {
      return ['Tất cả', ...wards];
    }
  }
  return ['Tất cả'];
}

export function isRoomInCity(
  room: { city?: string; address?: string; district?: string },
  targetCity?: string
): boolean {
  if (!targetCity || targetCity === 'Tất cả') return true;

  const targetNorm = normalizeCityName(targetCity).toLowerCase();
  const roomCityNorm = normalizeCityName(room.city).toLowerCase();
  const addressLower = (room.address || '').toLowerCase();
  const districtLower = (room.district || '').toLowerCase();

  if (targetNorm.includes('hồ chí minh')) {
    const isHCM =
      roomCityNorm.includes('hồ chí minh') ||
      addressLower.includes('hồ chí minh') ||
      addressLower.includes('tp.hcm') ||
      addressLower.includes('tp hcm') ||
      addressLower.includes('sài gòn');
    const isOther =
      addressLower.includes('hà nội') ||
      addressLower.includes('đà nẵng') ||
      addressLower.includes('bình dương') ||
      roomCityNorm.includes('hà nội') ||
      roomCityNorm.includes('đà nẵng');
    return isHCM && !isOther;
  }

  if (targetNorm.includes('hà nội')) {
    const isHN =
      roomCityNorm.includes('hà nội') ||
      addressLower.includes('hà nội') ||
      addressLower.includes('ha noi') ||
      districtLower.includes('cầu giấy') ||
      districtLower.includes('đống đa') ||
      districtLower.includes('ba đình') ||
      districtLower.includes('hai bà trưng') ||
      districtLower.includes('thanh xuân') ||
      districtLower.includes('hà đông') ||
      districtLower.includes('tây hồ') ||
      districtLower.includes('nam từ liêm') ||
      districtLower.includes('bắc từ liêm') ||
      districtLower.includes('hoàng mai');
    const isOther =
      roomCityNorm.includes('hồ chí minh') ||
      addressLower.includes('hồ chí minh') ||
      addressLower.includes('tp.hcm');
    return isHN && !isOther;
  }

  if (targetNorm.includes('đà nẵng')) {
    const isDN =
      roomCityNorm.includes('đà nẵng') ||
      addressLower.includes('đà nẵng') ||
      districtLower.includes('hải châu') ||
      districtLower.includes('sơn trà') ||
      districtLower.includes('ngũ hành sơn') ||
      districtLower.includes('thanh khê') ||
      districtLower.includes('liên chiểu');
    const isOther =
      roomCityNorm.includes('hồ chí minh') ||
      roomCityNorm.includes('hà nội');
    return isDN && !isOther;
  }

  if (targetNorm.includes('bình dương')) {
    return (
      roomCityNorm.includes('bình dương') ||
      addressLower.includes('bình dương') ||
      districtLower.includes('thủ dầu một') ||
      districtLower.includes('dĩ an') ||
      districtLower.includes('thuận an')
    );
  }

  if (targetNorm.includes('cần thơ')) {
    return (
      roomCityNorm.includes('cần thơ') ||
      addressLower.includes('cần thơ') ||
      districtLower.includes('ninh kiều') ||
      districtLower.includes('bình thủy')
    );
  }

  if (targetNorm.includes('hải phòng')) {
    return (
      roomCityNorm.includes('hải phòng') ||
      addressLower.includes('hải phòng') ||
      districtLower.includes('hồng bàng') ||
      districtLower.includes('ngô quyền') ||
      districtLower.includes('lê chân')
    );
  }

  const clean = targetNorm.replace(/^tp\.?\s*/i, '').replace(/^thành phố\s*/i, '').trim();
  return roomCityNorm.includes(clean) || addressLower.includes(clean);
}
