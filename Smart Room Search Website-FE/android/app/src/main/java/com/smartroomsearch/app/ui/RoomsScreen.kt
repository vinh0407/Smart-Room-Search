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

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun RoomsScreen(viewModel: MainViewModel, onRoomClick: (Int) -> Unit) {
    val rooms by viewModel.rooms.collectAsState()
    val favorites by viewModel.favorites.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedDistrict by remember { mutableStateOf("Tất cả") }
    var priceFilter by remember { mutableStateOf("Tất cả") }
    var selectedStatus by remember { mutableStateOf("Tất cả") }
    var selectedAmenities by remember { mutableStateOf(setOf<String>()) }
    var selectedSource by remember { mutableStateOf("Tất cả") }
    var showFilterSheet by remember { mutableStateOf(false) }

    val districts = listOf("Tất cả", "Quận 1", "Quận 3", "Quận 7", "Quận 10", "Bình Thạnh", "Gò Vấp", "Tân Bình", "Phú Nhuận", "Tân Phú")
    val priceOptions = listOf("Tất cả", "< 3 triệu", "3 - 5 triệu", "5 - 8 triệu", "> 8 triệu")
    val sourceOptions = listOf("Tất cả", "Chợ Tốt Nhà", "Batdongsan", "Phongtro123")
    val amenityOptions = listOf("wifi", "máy lạnh", "tủ lạnh", "máy giặt", "ban công", "gác lửng", "bãi xe", "bảo vệ 24/7")

    val filteredRooms = rooms.filter { room ->
        val matchQuery = searchQuery.isEmpty() ||
                room.title.contains(searchQuery, ignoreCase = true) ||
                room.address.contains(searchQuery, ignoreCase = true)

        val matchDistrict = selectedDistrict == "Tất cả" ||
                room.district.equals(selectedDistrict, ignoreCase = true) ||
                room.district.contains(selectedDistrict, ignoreCase = true) ||
                selectedDistrict.contains(room.district, ignoreCase = true)

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
            "Chợ Tốt Nhà" -> room.source?.lowercase() == "nhatot"
            "Batdongsan" -> room.source?.lowercase() == "batdongsan"
            "Phongtro123" -> room.source?.lowercase() == "phongtro123"
            else -> true
        }

        val matchAmenities = selectedAmenities.isEmpty() || selectedAmenities.all { target ->
            room.amenities.any { it.contains(target, ignoreCase = true) }
        }

        matchQuery && matchDistrict && matchPrice && matchStatus && matchAmenities && matchSource
    }

    val activeFiltersCount = (if (selectedDistrict != "Tất cả") 1 else 0) +
            (if (priceFilter != "Tất cả") 1 else 0) +
            (if (selectedStatus != "Tất cả") 1 else 0) +
            selectedAmenities.size

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Tìm kiếm phòng trọ",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp
                    )
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
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            // Source Filter Chips Bar (Chợ Tốt Nhà, Batdongsan, Phongtro123)
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 4.dp),
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

            // Active Filters Bar
            if (activeFiltersCount > 0) {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    if (selectedDistrict != "Tất cả") {
                        item {
                            ActiveFilterBadge(label = selectedDistrict) { selectedDistrict = "Tất cả" }
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
                            selectedDistrict = "Tất cả"
                            priceFilter = "Tất cả"
                            selectedStatus = "Tất cả"
                            selectedAmenities = emptySet()
                        }) {
                            Text("Xóa tất cả", fontSize = 12.sp, color = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            } else {
                // District Scrollable Chips
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(districts) { district ->
                        val isSelected = selectedDistrict == district
                        FilterChip(
                            selected = isSelected,
                            onClick = { selectedDistrict = district },
                            label = { Text(district, fontSize = 12.sp) }
                        )
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
                        selectedDistrict = "Tất cả"
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
                            selectedDistrict = "Tất cả"
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
