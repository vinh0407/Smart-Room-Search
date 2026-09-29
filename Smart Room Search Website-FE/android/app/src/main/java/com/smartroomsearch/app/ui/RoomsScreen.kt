package com.smartroomsearch.app.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartroomsearch.app.model.Room
import com.smartroomsearch.app.model.RoomStatus
import com.smartroomsearch.app.model.LocationsData

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun RoomsScreen(viewModel: MainViewModel, onRoomClick: (Int) -> Unit) {
    val rooms by viewModel.rooms.collectAsState()
    val favorites by viewModel.favorites.collectAsState()
    val selectedCity by viewModel.selectedCity.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Tất cả khu vực") }
    var selectedDistrict by remember { mutableStateOf("Tất cả") }
    var selectedWard by remember { mutableStateOf("Tất cả phường") }
    var priceFilter by remember { mutableStateOf("Tất cả") }
    var selectedStatus by remember { mutableStateOf("Tất cả") }
    var selectedAmenities by remember { mutableStateOf(setOf<String>()) }
    var selectedSource by remember { mutableStateOf("Tất cả") }
    var showFilterSheet by remember { mutableStateOf(false) }
    var showCityDialog by remember { mutableStateOf(false) }

    if (showCityDialog) {
        CitySelectionDialog(
            currentCity = selectedCity,
            onCitySelected = {
                viewModel.selectCity(it)
                selectedCategory = "Tất cả khu vực"
                selectedDistrict = "Tất cả"
                selectedWard = "Tất cả phường"
            },
            onDismiss = { showCityDialog = false }
        )
    }

    val categoryOptions = listOf("Tất cả khu vực", "Trung tâm", "Phía Đông", "Phía Tây", "Phía Nam", "Ngoại thành")
    val priceOptions = listOf("Tất cả", "< 3 triệu", "3 - 5 triệu", "5 - 8 triệu", "> 8 triệu")
    val sourceOptions = listOf("Tất cả", "✨ Chính chủ (Web tôi)", "Chợ Tốt Nhà", "Batdongsan", "Phongtro123")
    val amenityOptions = listOf("wifi", "máy lạnh", "tủ lạnh", "máy giặt", "ban công", "gác lửng", "bãi xe", "bảo vệ 24/7")

    val filteredRooms = rooms.filter { room ->
        val matchCity = selectedCity == "Tất cả" ||
                room.city.contains(selectedCity, ignoreCase = true) ||
                selectedCity.contains(room.city, ignoreCase = true) ||
                (selectedCity == "TP.HCM" && (room.city.contains("Hồ Chí Minh", ignoreCase = true) || room.city.contains("HCM", ignoreCase = true)))

        val matchQuery = searchQuery.isEmpty() ||
                room.title.contains(searchQuery, ignoreCase = true) ||
                room.address.contains(searchQuery, ignoreCase = true)

        val matchCategory = when (selectedCategory) {
            "Tất cả khu vực" -> true
            else -> {
                val cat = LocationsData.DISTRICT_CATEGORIES.firstOrNull { it.name.contains(selectedCategory, ignoreCase = true) }
                cat?.districts?.any { d -> room.district.contains(d, ignoreCase = true) || d.contains(room.district, ignoreCase = true) } ?: true
            }
        }

        val matchDistrict = selectedDistrict == "Tất cả" ||
                room.district.equals(selectedDistrict, ignoreCase = true) ||
                room.district.contains(selectedDistrict, ignoreCase = true) ||
                selectedDistrict.contains(room.district, ignoreCase = true)

        val matchWard = selectedWard == "Tất cả phường" ||
                room.address.contains(selectedWard, ignoreCase = true)

        val matchPrice = when (priceFilter) {
            "< 3 triệu" -> room.price < 3000000
            "3 - 5 triệu" -> room.price in 3000000.0..5000000.0
            "5 - 8 triệu" -> room.price in 5000000.0..8000000.0
            "> 8 triệu" -> room.price > 8000000
            else -> true
        }

        val matchStatus = when (selectedStatus) {
            "Còn trống" -> room.status == RoomStatus.available
            else -> true
        }

        val matchSource = when (selectedSource) {
            "✨ Chính chủ (Web tôi)" -> room.source == null || room.source == "local" || room.source == ""
            "Chợ Tốt Nhà" -> room.source?.lowercase() == "nhatot"
            "Batdongsan" -> room.source?.lowercase() == "batdongsan"
            "Phongtro123" -> room.source?.lowercase() == "phongtro123"
            else -> true
        }

        val matchAmenities = selectedAmenities.isEmpty() || selectedAmenities.all { target ->
            room.amenities.any { it.contains(target, ignoreCase = true) }
        }

        matchCity && matchQuery && matchCategory && matchDistrict && matchWard && matchPrice && matchStatus && matchAmenities && matchSource
    }

    val activeFiltersCount = (if (selectedCategory != "Tất cả khu vực") 1 else 0) +
            (if (selectedDistrict != "Tất cả") 1 else 0) +
            (if (selectedWard != "Tất cả phường") 1 else 0) +
            (if (selectedSource != "Tất cả") 1 else 0) +
            (if (priceFilter != "Tất cả") 1 else 0) +
            (if (selectedStatus != "Tất cả") 1 else 0) +
            selectedAmenities.size

    val availableDistricts = remember(selectedCategory) {
        if (selectedCategory == "Tất cả khu vực") {
            LocationsData.ALL_HCM_DISTRICTS
        } else {
            val cat = LocationsData.DISTRICT_CATEGORIES.firstOrNull { it.name.contains(selectedCategory, ignoreCase = true) }
            listOf("Tất cả") + (cat?.districts ?: emptyList())
        }
    }

    val availableWards = remember(selectedDistrict) {
        if (selectedDistrict == "Tất cả") {
            emptyList()
        } else {
            listOf("Tất cả phường") + LocationsData.getWardsForDistrict(selectedDistrict)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text(
                            text = "Tìm kiếm phòng",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        Surface(
                            onClick = { showCityDialog = true },
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = selectedCity,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                Icon(
                                    imageVector = Icons.Default.ArrowDropDown,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }
                },
                actions = {
                    Surface(
                        onClick = { showFilterSheet = true },
                        shape = RoundedCornerShape(12.dp),
                        color = if (activeFiltersCount > 0) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                        modifier = Modifier.padding(end = 16.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Settings,
                                contentDescription = "Lọc",
                                tint = if (activeFiltersCount > 0) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(Modifier.width(6.dp))
                            Text(
                                text = if (activeFiltersCount > 0) "Lọc ($activeFiltersCount)" else "Bộ lọc",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (activeFiltersCount > 0) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Search Input
            AppSearchBar(
                query = searchQuery,
                onQueryChange = { searchQuery = it },
                placeholder = "Nhập quận, tên đường, loại phòng...",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )

            // Source Filter Chips Bar (Tất cả, Web tôi, Chợ Tốt Nhà, Batdongsan, Phongtro123)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 3.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(sourceOptions) { src ->
                    val isSelected = selectedSource == src
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedSource = src },
                        label = {
                            Text(
                                text = src,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }

            // District Category Chips Bar (Trung tâm, Phía Đông, Phía Tây, Phía Nam, Ngoại thành)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 3.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categoryOptions) { cat ->
                    val isSelected = selectedCategory == cat
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            selectedCategory = cat
                            selectedDistrict = "Tất cả"
                            selectedWard = "Tất cả phường"
                        },
                        label = {
                            Text(
                                text = cat,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        }
                    )
                }
            }

            // District Scrollable Chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 3.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(availableDistricts) { district ->
                    val isSelected = selectedDistrict == district
                    FilterChip(
                        selected = isSelected,
                        onClick = {
                            selectedDistrict = district
                            selectedWard = "Tất cả phường"
                        },
                        label = { Text(district, fontSize = 12.sp) }
                    )
                }
            }

            // Ward Chips Bar (when district != "Tất cả")
            if (availableWards.isNotEmpty()) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 3.dp),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(availableWards) { ward ->
                        val isSelected = selectedWard == ward
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedWard = ward },
                            label = {
                                Text(
                                    text = ward,
                                    fontSize = 11.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                                )
                            }
                        )
                    }
                }
            }

            // Active Filters Bar
            if (activeFiltersCount > 0) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (selectedCategory != "Tất cả khu vực") {
                        item {
                            ActiveFilterBadge(label = selectedCategory) {
                                selectedCategory = "Tất cả khu vực"
                            }
                        }
                    }
                    if (selectedDistrict != "Tất cả") {
                        item {
                            ActiveFilterBadge(label = selectedDistrict) {
                                selectedDistrict = "Tất cả"
                                selectedWard = "Tất cả phường"
                            }
                        }
                    }
                    if (selectedWard != "Tất cả phường") {
                        item {
                            ActiveFilterBadge(label = selectedWard) { selectedWard = "Tất cả phường" }
                        }
                    }
                    if (selectedSource != "Tất cả") {
                        item {
                            ActiveFilterBadge(label = selectedSource) { selectedSource = "Tất cả" }
                        }
                    }
                    if (priceFilter != "Tất cả") {
                        item {
                            ActiveFilterBadge(label = priceFilter) { priceFilter = "Tất cả" }
                        }
                    }
                    if (selectedStatus != "Tất cả") {
                        item {
                            ActiveFilterBadge(label = selectedStatus) { selectedStatus = "Tất cả" }
                        }
                    }
                    selectedAmenities.forEach { amenity ->
                        item {
                            ActiveFilterBadge(label = amenity) {
                                selectedAmenities = selectedAmenities - amenity
                            }
                        }
                    }
                    item {
                        TextButton(onClick = {
                            selectedCategory = "Tất cả khu vực"
                            selectedDistrict = "Tất cả"
                            selectedWard = "Tất cả phường"
                            selectedSource = "Tất cả"
                            priceFilter = "Tất cả"
                            selectedStatus = "Tất cả"
                            selectedAmenities = emptySet()
                        }) {
                            Text("Xóa tất cả", fontSize = 12.sp, color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }

            // Results count
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Tìm thấy ${filteredRooms.size} kết quả",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (filteredRooms.isEmpty()) {
                EmptyState(
                    icon = Icons.Default.Search,
                    title = "Không có phòng thỏa điều kiện",
                    description = "Vui lòng điều chỉnh lại khoảng giá hoặc quận/huyện để tìm kết quả phù hợp hơn.",
                    actionLabel = "Đặt lại bộ lọc",
                    onActionClick = {
                        searchQuery = ""
                        selectedCategory = "Tất cả khu vực"
                        selectedDistrict = "Tất cả"
                        selectedWard = "Tất cả phường"
                        selectedSource = "Tất cả"
                        priceFilter = "Tất cả"
                        selectedStatus = "Tất cả"
                        selectedAmenities = emptySet()
                    }
                )
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(filteredRooms) { room ->
                        RoomCard(
                            room = room,
                            isFavorite = favorites.any { it.id == room.id },
                            onFavoriteClick = { viewModel.toggleFavorite(room) },
                            onClick = { onRoomClick(room.id) }
                        )
                    }
                }
            }
        }
    }

    // Filter Bottom Sheet
    if (showFilterSheet) {
        ModalBottomSheet(
            onDismissRequest = { showFilterSheet = false },
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Bộ Lọc Phòng Trọ", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    IconButton(onClick = { showFilterSheet = false }) {
                        Icon(Icons.Default.Close, null)
                    }
                }

                Spacer(Modifier.height(16.dp))

                // Price Section
                Text("Khoảng giá", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    priceOptions.forEach { opt ->
                        FilterChip(
                            selected = priceFilter == opt,
                            onClick = { priceFilter = opt },
                            label = { Text(opt, fontSize = 12.sp) }
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                // Status Section
                Text("Trạng thái", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    listOf("Tất cả", "Còn trống").forEach { st ->
                        FilterChip(
                            selected = selectedStatus == st,
                            onClick = { selectedStatus = st },
                            label = { Text(st, fontSize = 12.sp) }
                        )
                    }
                }

                Spacer(Modifier.height(16.dp))

                // Amenities Section
                Text("Tiện nghi", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(Modifier.height(8.dp))
                FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    amenityOptions.forEach { am ->
                        val isChecked = selectedAmenities.contains(am)
                        FilterChip(
                            selected = isChecked,
                            onClick = {
                                selectedAmenities = if (isChecked) selectedAmenities - am else selectedAmenities + am
                            },
                            label = { Text(am, fontSize = 12.sp) }
                        )
                    }
                }

                Spacer(Modifier.height(24.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            selectedCategory = "Tất cả khu vực"
                            selectedDistrict = "Tất cả"
                            selectedWard = "Tất cả phường"
                            selectedSource = "Tất cả"
                            priceFilter = "Tất cả"
                            selectedStatus = "Tất cả"
                            selectedAmenities = emptySet()
                        },
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Đặt lại")
                    }

                    Button(
                        onClick = { showFilterSheet = false },
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Áp dụng", fontWeight = FontWeight.Bold)
                    }
                }
                Spacer(Modifier.height(16.dp))
            }
        }
    }
}

@Composable
fun ActiveFilterBadge(label: String, onRemove: () -> Unit) {
    Surface(
        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(label, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.width(4.dp))
            Icon(
                imageVector = Icons.Default.Close,
                contentDescription = null,
                modifier = Modifier
                    .size(14.dp)
                    .clickable(onClick = onRemove),
                tint = MaterialTheme.colorScheme.primary
            )
        }
    }
}
