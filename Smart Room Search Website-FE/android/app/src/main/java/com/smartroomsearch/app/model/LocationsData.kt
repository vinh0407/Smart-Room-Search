package com.smartroomsearch.app.model

data class CityItem(
    val id: String,
    val name: String,
    val shortName: String,
    val isPopular: Boolean = false
)

data class DistrictCategory(
    val name: String,
    val districts: List<String>
)

object LocationsData {
    val CITIES = listOf(
        CityItem("hcm", "TP. Hồ Chí Minh", "TP.HCM", isPopular = true),
        CityItem("hn", "Hà Nội", "Hà Nội", isPopular = true),
        CityItem("dn", "Đà Nẵng", "Đà Nẵng", isPopular = true),
        CityItem("bd", "Bình Dương", "Bình Dương", isPopular = true),
        CityItem("ct", "Cần Thơ", "Cần Thơ"),
        CityItem("hp", "Hải Phòng", "Hải Phòng"),
        CityItem("dnai", "Đồng Nai", "Đồng Nai"),
        CityItem("vt", "Bà Rịa - Vũng Tàu", "Vũng Tàu")
    )

    val CITY_COORDINATES: Map<String, Pair<Double, Double>> = mapOf(
        "TP. Hồ Chí Minh" to Pair(10.7769, 106.7009),
        "TP.HCM" to Pair(10.7769, 106.7009),
        "Hà Nội" to Pair(21.0285, 105.8542),
        "Đà Nẵng" to Pair(16.0544, 108.2022),
        "Bình Dương" to Pair(10.9804, 106.6519),
        "Cần Thơ" to Pair(10.0452, 105.7469),
        "Hải Phòng" to Pair(20.8449, 106.6881),
        "Đồng Nai" to Pair(10.9574, 106.8427),
        "Bà Rịa - Vũng Tàu" to Pair(10.3460, 107.0843)
    )

    val DISTRICT_CATEGORIES_BY_CITY: Map<String, List<DistrictCategory>> = mapOf(
        "TP. Hồ Chí Minh" to listOf(
            DistrictCategory("Khu vực Trung tâm", listOf("Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 10", "Phú Nhuận")),
            DistrictCategory("Khu vực Phía Đông", listOf("Thành phố Thủ Đức", "Thủ Đức", "Bình Thạnh")),
            DistrictCategory("Khu vực Phía Tây", listOf("Tân Bình", "Tân Phú", "Bình Tân", "Gò Vấp", "Quận 6", "Quận 11", "Quận 12")),
            DistrictCategory("Khu vực Phía Nam", listOf("Quận 7", "Quận 8", "Nhà Bè", "Bình Chánh", "Cần Giờ")),
            DistrictCategory("Khu vực Ngoại thành", listOf("Hóc Môn", "Củ Chi"))
        ),
        "Hà Nội" to listOf(
            DistrictCategory("Khu vực Trung tâm", listOf("Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Đống Đa", "Quận Hai Bà Trưng")),
            DistrictCategory("Khu vực Phía Tây", listOf("Quận Cầu Giấy", "Quận Nam Từ Liêm", "Quận Bắc Từ Liêm", "Quận Thanh Xuân", "Quận Hà Đông")),
            DistrictCategory("Khu vực Phía Bắc & Phía Đông", listOf("Quận Tây Hồ", "Quận Long Biên", "Huyện Đông Anh", "Huyện Gia Lâm")),
            DistrictCategory("Khu vực Phía Nam", listOf("Quận Hoàng Mai", "Huyện Thanh Trì"))
        ),
        "Đà Nẵng" to listOf(
            DistrictCategory("Khu vực Trung tâm", listOf("Quận Hải Châu", "Quận Thanh Khê")),
            DistrictCategory("Khu vực Ven biển", listOf("Quận Sơn Trà", "Quận Ngũ Hành Sơn")),
            DistrictCategory("Khu vực Phía Tây", listOf("Quận Liên Chiểu", "Quận Cẩm Lệ", "Huyện Hòa Vang"))
        ),
        "Bình Dương" to listOf(
            DistrictCategory("Khu vực Đô thị Trung tâm", listOf("Thành phố Thủ Dầu Một", "Thành phố Dĩ An", "Thành phố Thuận An")),
            DistrictCategory("Khu vực Công nghiệp", listOf("Thị xã Bến Cát", "Thị xã Tân Uyên", "Huyện Bàu Bàng"))
        ),
        "Cần Thơ" to listOf(
            DistrictCategory("Khu vực Trung tâm", listOf("Quận Ninh Kiều", "Quận Bình Thủy", "Quận Cái Răng")),
            DistrictCategory("Khu vực Vùng ven", listOf("Quận Ô Môn", "Quận Thốt Nốt"))
        ),
        "Hải Phòng" to listOf(
            DistrictCategory("Khu vực Nội thành", listOf("Quận Hồng Bàng", "Quận Ngô Quyền", "Quận Lê Chân", "Quận Hải An")),
            DistrictCategory("Khu vực Mở rộng", listOf("Quận Kiến An", "Quận Đồ Sơn"))
        )
    )

    val DISTRICT_CATEGORIES: List<DistrictCategory> = DISTRICT_CATEGORIES_BY_CITY["TP. Hồ Chí Minh"] ?: emptyList()

    val ALL_HCM_DISTRICTS = listOf(
        "Tất cả",
        "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
        "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
        "Bình Thạnh", "Gò Vấp", "Tân Bình", "Tân Phú", "Phú Nhuận",
        "Bình Tân", "Thành phố Thủ Đức", "Thủ Đức", "Bình Chánh",
        "Hóc Môn", "Nhà Bè", "Củ Chi", "Cần Giờ"
    )

    fun normalizeCityName(cityName: String?): String {
        if (cityName.isNullOrBlank()) return "TP. Hồ Chí Minh"
        val c = cityName.trim().lowercase()
        return when {
            c.contains("hồ chí minh") || c.contains("hcm") || c.contains("sài gòn") -> "TP. Hồ Chí Minh"
            c.contains("hà nội") || c.contains("ha noi") -> "Hà Nội"
            c.contains("đà nẵng") || c.contains("da nang") -> "Đà Nẵng"
            c.contains("bình dương") || c.contains("binh duong") -> "Bình Dương"
            c.contains("cần thơ") || c.contains("can tho") -> "Cần Thơ"
            c.contains("hải phòng") || c.contains("hai phong") -> "Hải Phòng"
            c.contains("đồng nai") || c.contains("dong nai") -> "Đồng Nai"
            c.contains("vũng tàu") || c.contains("vung tau") -> "Bà Rịa - Vũng Tàu"
            else -> cityName
        }
    }

    fun getDistrictCategoriesForCity(cityName: String?): List<DistrictCategory> {
        val norm = normalizeCityName(cityName)
        return DISTRICT_CATEGORIES_BY_CITY[norm] ?: DISTRICT_CATEGORIES_BY_CITY["TP. Hồ Chí Minh"] ?: emptyList()
    }

    fun getDistrictsForCity(cityName: String?): List<String> {
        val categories = getDistrictCategoriesForCity(cityName)
        val list = mutableListOf("Tất cả")
        categories.forEach { cat ->
            cat.districts.forEach { d ->
                if (!list.contains(d)) list.add(d)
            }
        }
        return list
    }

    fun isRoomInCity(
        roomCity: String?,
        roomAddress: String?,
        roomDistrict: String?,
        targetCity: String?
    ): Boolean {
        if (targetCity.isNullOrBlank() || targetCity == "Tất cả") return true

        val targetNorm = normalizeCityName(targetCity).lowercase()
        val roomCityNorm = normalizeCityName(roomCity).lowercase()
        val addressLower = (roomAddress ?: "").lowercase()
        val districtLower = (roomDistrict ?: "").lowercase()

        return when {
            targetNorm.contains("hồ chí minh") -> {
                val isHCM = roomCityNorm.contains("hồ chí minh") ||
                        addressLower.contains("hồ chí minh") ||
                        addressLower.contains("tp.hcm") ||
                        addressLower.contains("tp hcm") ||
                        addressLower.contains("sài gòn")
                val isOther = addressLower.contains("hà nội") ||
                        addressLower.contains("đà nẵng") ||
                        addressLower.contains("bình dương") ||
                        roomCityNorm.contains("hà nội") ||
                        roomCityNorm.contains("đà nẵng")
                isHCM && !isOther
            }
            targetNorm.contains("hà nội") -> {
                val isHN = roomCityNorm.contains("hà nội") ||
                        addressLower.contains("hà nội") ||
                        addressLower.contains("ha noi") ||
                        districtLower.contains("cầu giấy") ||
                        districtLower.contains("đống đa") ||
                        districtLower.contains("ba đình") ||
                        districtLower.contains("hai bà trưng") ||
                        districtLower.contains("thanh xuân") ||
                        districtLower.contains("hà đông") ||
                        districtLower.contains("tây hồ") ||
                        districtLower.contains("nam từ liêm") ||
                        districtLower.contains("bắc từ liêm") ||
                        districtLower.contains("hoàng mai")
                val isOther = roomCityNorm.contains("hồ chí minh") ||
                        addressLower.contains("hồ chí minh") ||
                        addressLower.contains("tp.hcm")
                isHN && !isOther
            }
            targetNorm.contains("đà nẵng") -> {
                val isDN = roomCityNorm.contains("đà nẵng") ||
                        addressLower.contains("đà nẵng") ||
                        districtLower.contains("hải châu") ||
                        districtLower.contains("sơn trà") ||
                        districtLower.contains("ngũ hành sơn") ||
                        districtLower.contains("thanh khê") ||
                        districtLower.contains("liên chiểu")
                val isOther = roomCityNorm.contains("hồ chí minh") || roomCityNorm.contains("hà nội")
                isDN && !isOther
            }
            targetNorm.contains("bình dương") -> {
                roomCityNorm.contains("bình dương") ||
                        addressLower.contains("bình dương") ||
                        districtLower.contains("thủ dầu một") ||
                        districtLower.contains("dĩ an") ||
                        districtLower.contains("thuận an")
            }
            targetNorm.contains("cần thơ") -> {
                roomCityNorm.contains("cần thơ") ||
                        addressLower.contains("cần thơ") ||
                        districtLower.contains("ninh kiều") ||
                        districtLower.contains("bình thủy")
            }
            targetNorm.contains("hải phòng") -> {
                roomCityNorm.contains("hải phòng") ||
                        addressLower.contains("hải phòng") ||
                        districtLower.contains("hồng bàng") ||
                        districtLower.contains("ngô quyền")
            }
            else -> {
                val clean = targetNorm.replace("tp.", "").replace("thành phố", "").trim()
                roomCityNorm.contains(clean) || addressLower.contains(clean)
            }
        }
    }

    val WARDS_BY_DISTRICT: Map<String, List<String>> = mapOf(
        // TP.HCM
        "Quận 1" to listOf("Bến Nghé", "Bến Thành", "Cô Giang", "Cầu Kho", "Cầu Ông Lãnh", "Đa Kao", "Nguyễn Cư Trinh", "Nguyễn Thái Bình", "Phạm Ngũ Lão", "Tân Định"),
        "Quận 3" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 14", "Võ Thị Sáu"),
        "Quận 4" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 6", "Phường 8", "Phường 9", "Phường 10", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 18"),
        "Quận 5" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"),
        "Quận 6" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"),
        "Quận 7" to listOf("Bình Thuận", "Phú Mỹ", "Phú Thuận", "Tân Hưng", "Tân Kiểng", "Tân Phong", "Tân Phú", "Tân Quy", "Tân Thuận Đông", "Tân Thuận Tây"),
        "Quận 8" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"),
        "Quận 10" to listOf("Phường 1", "Phường 2", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"),
        "Quận 11" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"),
        "Quận 12" to listOf("An Phú Đông", "Đông Hưng Thuận", "Hiệp Thành", "Tân Chánh Hiệp", "Tân Hưng Thuận", "Tân Thới Hiệp", "Tân Thới Nhất", "Thạnh Lộc", "Thạnh Xuân", "Thới An", "Trung Mỹ Tây"),
        "Bình Thạnh" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17", "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"),
        "Gò Vấp" to listOf("Phường 1", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 17"),
        "Tân Bình" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"),
        "Tân Phú" to listOf("Hiệp Tân", "Hòa Thạnh", "Phú Thạnh", "Phú Thọ Hòa", "Phú Trung", "Sơn Kỳ", "Tân Quý", "Tân Sơn Nhì", "Tân Thành", "Tân Thới Hòa", "Tây Thạnh"),
        "Phú Nhuận" to listOf("Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 13", "Phường 15", "Phường 17"),
        "Bình Tân" to listOf("An Lạc", "An Lạc A", "Bình Hưng Hòa", "Bình Hưng Hòa A", "Bình Hưng Hòa B", "Bình Trị Đông", "Bình Trị Đông A", "Bình Trị Đông B", "Tân Tạo", "Tân Tạo A"),
        "Thành phố Thủ Đức" to listOf("An Khánh", "An Lợi Đông", "An Phú", "Bình Chiểu", "Bình Thọ", "Cát Lái", "Hiệp Bình Chánh", "Hiệp Bình Phước", "Hiệp Phú", "Linh Chiểu", "Linh Đông", "Linh Tây", "Linh Trung", "Linh Xuân", "Long Bình", "Long Phước", "Long Thạnh Mỹ", "Long Trường", "Phú Hữu", "Phước Bình", "Phước Long A", "Phước Long B", "Tam Bình", "Tam Phú", "Tăng Nhơn Phú A", "Tăng Nhơn Phú B", "Thạnh Mỹ Lợi", "Thảo Điền", "Thủ Thiêm", "Trường Thạnh", "Trường Thọ"),
        "Thủ Đức" to listOf("Hiệp Bình Chánh", "Hiệp Bình Phước", "Linh Chiểu", "Linh Đông", "Linh Tây", "Linh Trung", "Linh Xuân", "Tam Bình", "Tam Phú", "Bình Chiểu", "Bình Thọ"),
        "Bình Chánh" to listOf("Tân Kiên", "Tân Nhựt", "Tân Túc", "An Phú Tây", "Bình Chánh", "Bình Hưng", "Bình Lợi", "Đa Phước", "Hưng Long", "Lê Minh Xuân", "Phạm Văn Hai", "Phong Phú", "Quy Đức", "Tân Quý Tây", "Vĩnh Lộc A", "Vĩnh Lộc B"),
        "Hóc Môn" to listOf("Bà Điểm", "Đông Thạnh", "Nhị Bình", "Tân Hiệp", "Tân Thới Nhì", "Tân Xuân", "Thới Tam Thôn", "Trung Chánh", "Xuân Thới Đông", "Xuân Thới Sơn", "Xuân Thới Thượng"),
        "Nhà Bè" to listOf("Hiệp Phước", "Long Thới", "Nhơn Đức", "Phú Xuân", "Phước Kiển", "Phước Lộc"),
        "Củ Chi" to listOf("Thị trấn Củ Chi", "An Nhơn Tây", "An Phú", "Bình Mỹ", "Hòa Phú", "Nhuận Đức", "Phạm Văn Cội", "Phú Hòa Đông", "Tân An Hội", "Tân Thạnh Đông"),
        "Cần Giờ" to listOf("Cần Thạnh", "An Thới Đông", "Bình Khánh", "Long Hòa", "Lý Nhơn", "Tam Thôn Hiệp", "Thạnh An"),

        // Hà Nội
        "Quận Cầu Giấy" to listOf("Dịch Vọng", "Dịch Vọng Hậu", "Mai Dịch", "Nghĩa Đô", "Nghĩa Tân", "Quan Hoa", "Trung Hòa", "Yên Hòa"),
        "Cầu Giấy" to listOf("Dịch Vọng", "Dịch Vọng Hậu", "Mai Dịch", "Nghĩa Đô", "Nghĩa Tân", "Quan Hoa", "Trung Hòa", "Yên Hòa"),
        "Quận Đống Đa" to listOf("Cát Linh", "Hàng Bột", "Khâm Thiên", "Khương Thượng", "Kim Liên", "Láng Hạ", "Láng Thượng", "Nam Đồng", "Ô Chợ Dừa", "Phương Mai", "Quang Trung", "Thịnh Quang", "Trung Liệt", "Văn Miếu"),
        "Đống Đa" to listOf("Cát Linh", "Hàng Bột", "Khâm Thiên", "Khương Thượng", "Kim Liên", "Láng Hạ", "Láng Thượng", "Nam Đồng", "Ô Chợ Dừa", "Phương Mai", "Quang Trung", "Thịnh Quang", "Trung Liệt", "Văn Miếu"),
        "Quận Ba Đình" to listOf("Cống Vị", "Điện Biên", "Đội Cấn", "Giảng Võ", "Kim Mã", "Liễu Giai", "Ngọc Hà", "Ngọc Khánh", "Thành Công", "Trúc Bạch", "Vĩnh Phúc"),
        "Ba Đình" to listOf("Cống Vị", "Điện Biên", "Đội Cấn", "Giảng Võ", "Kim Mã", "Liễu Giai", "Ngọc Hà", "Ngọc Khánh", "Thành Công", "Trúc Bạch", "Vĩnh Phúc"),
        "Quận Hai Bà Trưng" to listOf("Bạch Đằng", "Bách Khoa", "Bạch Mai", "Cầu Dền", "Đồng Nhân", "Đồng Tâm", "Lê Đại Hành", "Minh Khai", "Phố Huế", "Quỳnh Lôi", "Thanh Nhàn", "Trương Định", "Vĩnh Tuy"),
        "Hai Bà Trưng" to listOf("Bạch Đằng", "Bách Khoa", "Bạch Mai", "Cầu Dền", "Đồng Nhân", "Đồng Tâm", "Lê Đại Hành", "Minh Khai", "Phố Huế", "Quỳnh Lôi", "Thanh Nhàn", "Trương Định", "Vĩnh Tuy"),
        "Quận Thanh Xuân" to listOf("Hạ Đình", "Khương Đình", "Khương Mai", "Khương Trung", "Kim Giang", "Nhân Chính", "Phương Liệt", "Thanh Xuân Bắc", "Thanh Xuân Nam", "Thanh Xuân Trung", "Thượng Đình"),
        "Thanh Xuân" to listOf("Hạ Đình", "Khương Đình", "Khương Mai", "Khương Trung", "Kim Giang", "Nhân Chính", "Phương Liệt", "Thanh Xuân Bắc", "Thanh Xuân Nam", "Thanh Xuân Trung", "Thượng Đình"),
        "Quận Nam Từ Liêm" to listOf("Cầu Diễn", "Đại Mỗ", "Mễ Trì", "Mỹ Đình 1", "Mỹ Đình 2", "Phú Đô", "Phương Canh", "Tây Mỗ", "Trung Văn", "Xuân Phương"),
        "Nam Từ Liêm" to listOf("Cầu Diễn", "Đại Mỗ", "Mễ Trì", "Mỹ Đình 1", "Mỹ Đình 2", "Phú Đô", "Phương Canh", "Tây Mỗ", "Trung Văn", "Xuân Phương"),
        "Quận Bắc Từ Liêm" to listOf("Cổ Nhuế 1", "Cổ Nhuế 2", "Đông Ngạc", "Đức Thắng", "Liên Mạc", "Minh Khai", "Phú Diễn", "Phúc Diễn", "Tây Tựu", "Thượng Cát", "Thụy Phương", "Xuân Đỉnh", "Xuân Tảo"),
        "Bắc Từ Liêm" to listOf("Cổ Nhuế 1", "Cổ Nhuế 2", "Đông Ngạc", "Đức Thắng", "Liên Mạc", "Minh Khai", "Phú Diễn", "Phúc Diễn", "Tây Tựu", "Thượng Cát", "Thụy Phương", "Xuân Đỉnh", "Xuân Tảo"),
        "Quận Hoàng Mai" to listOf("Định Công", "Đại Kim", "Giáp Bát", "Hoàng Liệt", "Hoàng Văn Thụ", "Lĩnh Nam", "Mai Động", "Tân Mai", "Thịnh Liệt", "Trần Phú", "Tương Mai", "Vĩnh Hưng", "Yên Sở"),
        "Hoàng Mai" to listOf("Định Công", "Đại Kim", "Giáp Bát", "Hoàng Liệt", "Hoàng Văn Thụ", "Lĩnh Nam", "Mai Động", "Tân Mai", "Thịnh Liệt", "Trần Phú", "Tương Mai", "Vĩnh Hưng", "Yên Sở"),
        "Quận Hà Đông" to listOf("Biên Giang", "Đồng Mai", "Dương Nội", "Hà Cầu", "Kiến Hưng", "La Khê", "Mộ Lao", "Nguyễn Trãi", "Phú La", "Phúc La", "Quang Trung", "Vạn Phúc", "Văn Quán", "Yên Nghĩa"),
        "Hà Đông" to listOf("Biên Giang", "Đồng Mai", "Dương Nội", "Hà Cầu", "Kiến Hưng", "La Khê", "Mộ Lao", "Nguyễn Trãi", "Phú La", "Phúc La", "Quang Trung", "Vạn Phúc", "Văn Quán", "Yên Nghĩa"),
        "Quận Tây Hồ" to listOf("Bưởi", "Nhật Tân", "Phú Thượng", "Quảng An", "Thụy Khuê", "Tứ Liên", "Xuân La", "Yên Phụ"),
        "Tây Hồ" to listOf("Bưởi", "Nhật Tân", "Phú Thượng", "Quảng An", "Thụy Khuê", "Tứ Liên", "Xuân La", "Yên Phụ"),

        // Đà Nẵng
        "Quận Hải Châu" to listOf("Hải Châu 1", "Hải Châu 2", "Thạch Thang", "Thanh Bình", "Thuận Phước", "Hòa Thuận Tây", "Hòa Thuận Đông", "Nam Dương", "Phước Ninh", "Bình Thuận", "Bình Hiên", "Hòa Cường Bắc", "Hòa Cường Nam"),
        "Hải Châu" to listOf("Hải Châu 1", "Hải Châu 2", "Thạch Thang", "Thanh Bình", "Thuận Phước", "Hòa Thuận Tây", "Hòa Thuận Đông", "Nam Dương", "Phước Ninh", "Bình Thuận", "Bình Hiên", "Hòa Cường Bắc", "Hòa Cường Nam"),
        "Quận Sơn Trà" to listOf("An Hải Bắc", "An Hải Đông", "An Hải Tây", "Mân Thái", "Nại Hiên Đông", "Phước Mỹ", "Thọ Quang"),
        "Sơn Trà" to listOf("An Hải Bắc", "An Hải Đông", "An Hải Tây", "Mân Thái", "Nại Hiên Đông", "Phước Mỹ", "Thọ Quang"),
        "Quận Ngũ Hành Sơn" to listOf("Khuê Mỹ", "Mỹ An", "Hòa Hải", "Hòa Quý"),
        "Ngũ Hành Sơn" to listOf("Khuê Mỹ", "Mỹ An", "Hòa Hải", "Hòa Quý"),
        "Quận Thanh Khê" to listOf("An Khê", "Chính Gián", "Hòa Khê", "Tam Thuận", "Tân Chính", "Thạc Gián", "Thanh Khê Đông", "Thanh Khê Tây", "Vĩnh Trung", "Xuân Hà"),
        "Thanh Khê" to listOf("An Khê", "Chính Gián", "Hòa Khê", "Tam Thuận", "Tân Chính", "Thạc Gián", "Thanh Khê Đông", "Thanh Khê Tây", "Vĩnh Trung", "Xuân Hà"),
        "Quận Liên Chiểu" to listOf("Hòa Hiệp Bắc", "Hòa Hiệp Nam", "Hòa Khánh Bắc", "Hòa Khánh Nam", "Hòa Minh"),
        "Liên Chiểu" to listOf("Hòa Hiệp Bắc", "Hòa Hiệp Nam", "Hòa Khánh Bắc", "Hòa Khánh Nam", "Hòa Minh"),

        // Bình Dương
        "Thành phố Thủ Dầu Một" to listOf("Chánh Mỹ", "Chánh Nghĩa", "Định Hòa", "Hiệp An", "Hiệp Thành", "Hòa Phú", "Phú Cường", "Phú Hòa", "Phú Lợi", "Phú Mỹ", "Phú Tân", "Phú Thọ", "Tân An"),
        "Thủ Dầu Một" to listOf("Chánh Mỹ", "Chánh Nghĩa", "Định Hòa", "Hiệp An", "Hiệp Thành", "Hòa Phú", "Phú Cường", "Phú Hòa", "Phú Lợi", "Phú Mỹ", "Phú Tân", "Phú Thọ", "Tân An"),
        "Thành phố Dĩ An" to listOf("An Bình", "Bình An", "Bình Thắng", "Dĩ An", "Đông Hòa", "Tân Bình", "Tân Đông Hiệp"),
        "Dĩ An" to listOf("An Bình", "Bình An", "Bình Thắng", "Dĩ An", "Đông Hòa", "Tân Bình", "Tân Đông Hiệp"),
        "Thành phố Thuận An" to listOf("An Phú", "An Thạnh", "Bình Chuẩn", "Bình Hòa", "Bình Nhâm", "Hưng Định", "Lái Thiêu", "Thuận Giao", "Vĩnh Phú"),
        "Thuận An" to listOf("An Phú", "An Thạnh", "Bình Chuẩn", "Bình Hòa", "Bình Nhâm", "Hưng Định", "Lái Thiêu", "Thuận Giao", "Vĩnh Phú")
    )

    fun getWardsForDistrict(district: String): List<String> {
        val cleanName = district.trim()
        return WARDS_BY_DISTRICT[cleanName]
            ?: WARDS_BY_DISTRICT.entries.firstOrNull {
                cleanName.contains(it.key, ignoreCase = true) || it.key.contains(cleanName, ignoreCase = true)
            }?.value
            ?: emptyList()
    }
}
