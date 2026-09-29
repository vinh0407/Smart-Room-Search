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

    val DISTRICT_CATEGORIES = listOf(
        DistrictCategory(
            name = "Khu vực Trung tâm",
            districts = listOf("Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 10", "Phú Nhuận")
        ),
        DistrictCategory(
            name = "Khu vực Phía Đông",
            districts = listOf("Thành phố Thủ Đức", "Thủ Đức", "Bình Thạnh")
        ),
        DistrictCategory(
            name = "Khu vực Phía Tây",
            districts = listOf("Tân Bình", "Tân Phú", "Bình Tân", "Gò Vấp", "Quận 6", "Quận 11", "Quận 12")
        ),
        DistrictCategory(
            name = "Khu vực Phía Nam",
            districts = listOf("Quận 7", "Quận 8", "Nhà Bè", "Bình Chánh", "Cần Giờ")
        ),
        DistrictCategory(
            name = "Khu vực Ngoại thành",
            districts = listOf("Hóc Môn", "Củ Chi")
        )
    )

    val ALL_HCM_DISTRICTS = listOf(
        "Tất cả",
        "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6",
        "Quận 7", "Quận 8", "Quận 10", "Quận 11", "Quận 12",
        "Bình Thạnh", "Gò Vấp", "Tân Bình", "Tân Phú", "Phú Nhuận",
        "Bình Tân", "Thành phố Thủ Đức", "Thủ Đức", "Bình Chánh",
        "Hóc Môn", "Nhà Bè", "Củ Chi", "Cần Giờ"
    )

    val WARDS_BY_DISTRICT: Map<String, List<String>> = mapOf(
        "Quận 1" to listOf(
            "Bến Nghé", "Bến Thành", "Cô Giang", "Cầu Kho", "Cầu Ông Lãnh",
            "Đa Kao", "Nguyễn Cư Trinh", "Nguyễn Thái Bình", "Phạm Ngũ Lão", "Tân Định"
        ),
        "Quận 3" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5",
            "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 14", "Võ Thị Sáu"
        ),
        "Quận 4" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 6", "Phường 8",
            "Phường 9", "Phường 10", "Phường 13", "Phường 14", "Phường 15", "Phường 16", "Phường 18"
        ),
        "Quận 5" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"
        ),
        "Quận 6" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14"
        ),
        "Quận 7" to listOf(
            "Bình Thuận", "Phú Mỹ", "Phú Thuận", "Tân Hưng", "Tân Kiểng",
            "Tân Phong", "Tân Phú", "Tân Quy", "Tân Thuận Đông", "Tân Thuận Tây"
        ),
        "Quận 8" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"
        ),
        "Quận 10" to listOf(
            "Phường 1", "Phường 2", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15"
        ),
        "Quận 11" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 16"
        ),
        "Quận 12" to listOf(
            "An Phú Đông", "Đông Hưng Thuận", "Hiệp Thành", "Tân Chánh Hiệp", "Tân Hưng Thuận",
            "Tân Thới Hiệp", "Tân Thới Nhất", "Thạnh Lộc", "Thạnh Xuân", "Thới An", "Trung Mỹ Tây"
        ),
        "Bình Thạnh" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 5", "Phường 6", "Phường 7",
            "Phường 11", "Phường 12", "Phường 13", "Phường 14", "Phường 15", "Phường 17",
            "Phường 19", "Phường 21", "Phường 22", "Phường 24", "Phường 25", "Phường 26", "Phường 27", "Phường 28"
        ),
        "Gò Vấp" to listOf(
            "Phường 1", "Phường 3", "Phường 4", "Phường 5", "Phường 6", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12", "Phường 13",
            "Phường 14", "Phường 15", "Phường 16", "Phường 17"
        ),
        "Phú Nhuận" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 7",
            "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 13", "Phường 15", "Phường 17"
        ),
        "Tân Bình" to listOf(
            "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5", "Phường 6",
            "Phường 7", "Phường 8", "Phường 9", "Phường 10", "Phường 11", "Phường 12",
            "Phường 13", "Phường 14", "Phường 15"
        ),
        "Tân Phú" to listOf(
            "Hiệp Tân", "Hòa Thạnh", "Phú Thạnh", "Phú Thọ Hòa", "Phú Trung",
            "Sơn Kỳ", "Tân Quý", "Tân Sơn Nhì", "Tân Thành", "Tân Thới Hòa", "Tây Thạnh"
        ),
        "Bình Tân" to listOf(
            "An Lạc", "An Lạc A", "Bình Hưng Hòa", "Bình Hưng Hòa A", "Bình Hưng Hòa B",
            "Bình Trị Đông", "Bình Trị Đông A", "Bình Trị Đông B", "Tân Tạo", "Tân Tạo A"
        ),
        "Thành phố Thủ Đức" to listOf(
            "An Khánh", "An Lợi Đông", "An Phú", "Bình Chiểu", "Bình Thọ", "Bình Trưng Đông",
            "Bình Trưng Tây", "Cát Lái", "Hiệp Bình Chánh", "Hiệp Bình Phước", "Hiệp Phú",
            "Linh Chiểu", "Linh Đông", "Linh Tây", "Linh Trung", "Linh Xuân", "Long Bình",
            "Long Phước", "Long Thạnh Mỹ", "Long Trường", "Phú Hữu", "Phước Bình", "Phước Long A",
            "Phước Long B", "Tam Bình", "Tam Phú", "Tăng Nhơn Phú A", "Tăng Nhơn Phú B", "Thạnh Mỹ Lợi",
            "Thảo Điền", "Thủ Thiêm", "Trường Thạnh", "Trường Thọ"
        ),
        "Thủ Đức" to listOf(
            "Hiệp Bình Chánh", "Hiệp Bình Phước", "Linh Chiểu", "Linh Đông", "Linh Tây",
            "Linh Trung", "Linh Xuân", "Tam Bình", "Tam Phú", "Bình Chiểu", "Bình Thọ"
        ),
        "Bình Chánh" to listOf(
            "Tân Kiên", "Tân Nhựt", "Tân Túc", "An Phú Tây", "Bình Chánh",
            "Bình Hưng", "Bình Lợi", "Đa Phước", "Hưng Long", "Lê Minh Xuân",
            "Phạm Văn Hai", "Phong Phú", "Quy Đức", "Tân Quý Tây", "Vĩnh Lộc A", "Vĩnh Lộc B"
        ),
        "Hóc Môn" to listOf(
            "Bà Điểm", "Đông Thạnh", "Nhị Bình", "Tân Hiệp", "Tân Thới Nhì",
            "Tân Xuân", "Thới Tam Thôn", "Trung Chánh", "Xuân Thới Đông", "Xuân Thới Sơn", "Xuân Thới Thượng"
        ),
        "Nhà Bè" to listOf(
            "Hiệp Phước", "Long Thới", "Nhơn Đức", "Phú Xuân", "Phước Kiển", "Phước Lộc"
        ),
        "Củ Chi" to listOf(
            "Thị trấn Củ Chi", "An Nhơn Tây", "An Phú", "Bình Mỹ", "Hòa Phú",
            "Nhuận Đức", "Phạm Văn Cội", "Phú Hòa Đông", "Tân An Hội", "Tân Thạnh Đông"
        ),
        "Cần Giờ" to listOf(
            "Cần Thạnh", "An Thới Đông", "Bình Khánh", "Long Hòa", "Lý Nhơn", "Tam Thôn Hiệp", "Thạnh An"
        )
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
