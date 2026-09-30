package com.smartroomsearch.app.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.smartroomsearch.app.model.LocationsData

@Composable
fun HomeScreen(viewModel: MainViewModel, onRoomClick: (Int) -> Unit) {
    val rooms by viewModel.rooms.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val favorites by viewModel.favorites.collectAsState()
    val selectedCity by viewModel.selectedCity.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedDistrict by remember { mutableStateOf("Tất cả") }
    var selectedWard by remember { mutableStateOf("Tất cả phường") }
    var showCityDialog by remember { mutableStateOf(false) }

    if (showCityDialog) {
        CitySelectionDialog(
            currentCity = selectedCity,
            onCitySelected = { 
                viewModel.selectCity(it)
                selectedDistrict = "Tất cả"
                selectedWard = "Tất cả phường"
            },
            onDismiss = { showCityDialog = false }
        )
    }

    val filteredRooms = rooms.filter {
        val matchCity = LocationsData.isRoomInCity(it.city, it.address, it.district, selectedCity)

        val matchDistrict = selectedDistrict == "Tất cả" ||
                it.district.equals(selectedDistrict, ignoreCase = true) ||
                it.district.contains(selectedDistrict, ignoreCase = true) ||
                selectedDistrict.contains(it.district, ignoreCase = true)

        val matchWard = selectedWard == "Tất cả phường" ||
                it.address.contains(selectedWard, ignoreCase = true)

        val matchQuery = searchQuery.isEmpty() ||
                it.title.contains(searchQuery, ignoreCase = true) ||
                it.address.contains(searchQuery, ignoreCase = true)

        matchCity && matchDistrict && matchWard && matchQuery
    }

    val featuredRooms = filteredRooms.filter { it.isFeatured }
    val newRooms = filteredRooms.filter { it.isNew || !it.isFeatured }

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(bottom = 12.dp)
            ) {
                HomeHeader(
                    selectedCity = selectedCity,
                    onCityClick = { showCityDialog = true }
                )
                AppSearchBar(
                    query = searchQuery,
                    onQueryChange = { q ->
                        searchQuery = q
                        val qLower = q.lowercase().trim()
                        val detectedCity = when {
                            qLower.contains("hà nội") || qLower.contains("ha noi") || qLower.contains("cầu giấy") || qLower.contains("đống đa") || qLower.contains("thanh xuân") || qLower.contains("ba đình") || qLower.contains("hà đông") -> "Hà Nội"
                            qLower.contains("đà nẵng") || qLower.contains("da nang") || qLower.contains("hải châu") || qLower.contains("sơn trà") -> "Đà Nẵng"
                            qLower.contains("bình dương") || qLower.contains("dĩ an") || qLower.contains("thuận an") -> "Bình Dương"
                            qLower.contains("cần thơ") || qLower.contains("ninh kiều") -> "Cần Thơ"
                            qLower.contains("hải phòng") || qLower.contains("lê chân") -> "Hải Phòng"
                            qLower.contains("hồ chí minh") || qLower.contains("hcm") || qLower.contains("sài gòn") -> "TP. Hồ Chí Minh"
                            else -> null
                        }
                        if (detectedCity != null && detectedCity != selectedCity) {
                            viewModel.selectCity(detectedCity)
                            selectedDistrict = "Tất cả"
                            selectedWard = "Tất cả phường"
                        }
                    },
                    placeholder = "Tìm quận, địa chỉ, tên đường...",
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(10.dp))
                HomeDistrictChips(
                    selected = selectedDistrict,
                    city = selectedCity,
                    onSelected = {
                        selectedDistrict = it
                        selectedWard = "Tất cả phường"
                    }
                )
                if (selectedDistrict != "Tất cả") {
                    HomeWardChips(
                        district = selectedDistrict,
                        selectedWard = selectedWard,
                        onWardSelected = { selectedWard = it }
                    )
                }
            }
        }
    ) { padding ->
        if (isLoading && rooms.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        } else if (filteredRooms.isEmpty()) {
            EmptyState(
                icon = Icons.Default.Search,
                title = "Không tìm thấy phòng phù hợp",
                description = "Thử đổi từ khóa hoặc chọn quận/huyện khác xem sao bạn nhé!",
                actionLabel = "Đặt lại bộ lọc",
                onActionClick = {
                    searchQuery = ""
                    selectedDistrict = "Tất cả"
                },
                modifier = Modifier.padding(padding)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(bottom = 24.dp)
            ) {
                item { HeroBanner() }

                val partnerRooms = filteredRooms.filter { it.source != null && it.source != "local" }
                if (partnerRooms.isNotEmpty()) {
                    item {
                        SectionHeader(
                            title = "Tin Đăng Đối Tác",
                            subtitle = "Cập nhật thời gian thực từ Chợ Tốt Nhà, Batdongsan & Phongtro123"
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            items(partnerRooms) { room ->
                                Box(modifier = Modifier.width(290.dp)) {
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

                if (featuredRooms.isNotEmpty()) {
                    item {
                        SectionHeader(
                            title = "Phòng Nổi Bật",
                            subtitle = "Các phòng chất lượng cao được ưu tiên chọn nhiều nhất"
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            items(featuredRooms) { room ->
                                Box(modifier = Modifier.width(290.dp)) {
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

                item {
                    SectionHeader(
                        title = "Danh Sách Phòng Mới",
                        subtitle = "Tin đăng phòng trọ mới nhất tại $selectedCity"
                    )
                }

                items(newRooms) { room ->
                    Box(modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)) {
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
}

@Composable
fun HomeHeader(
    selectedCity: String,
    onCityClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(
                text = "TrọXịn",
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.primary,
                letterSpacing = (-0.5).sp
            )
            Text(
                text = "Tìm phòng trọ $selectedCity dễ dàng",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Surface(
            onClick = onCityClick,
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.LocationOn,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = selectedCity,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(2.dp))
                Icon(
                    imageVector = Icons.Default.ArrowDropDown,
                    contentDescription = "Chọn tỉnh thành",
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}

@Composable
fun HomeDistrictChips(selected: String, city: String, onSelected: (String) -> Unit) {
    val districts = remember(city) {
        LocationsData.getDistrictsForCity(city)
    }
    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(districts) { district ->
            val isSelected = selected == district
            FilterChip(
                selected = isSelected,
                onClick = { onSelected(district) },
                label = {
                    Text(
                        text = district,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                },
                shape = RoundedCornerShape(10.dp),
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = MaterialTheme.colorScheme.primary,
                    selectedLabelColor = Color.White,
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                    labelColor = MaterialTheme.colorScheme.onSurfaceVariant
                )
            )
        }
    }
}

@Composable
fun HomeWardChips(district: String, selectedWard: String, onWardSelected: (String) -> Unit) {
    val wards = remember(district) {
        listOf("Tất cả phường") + LocationsData.getWardsForDistrict(district)
    }
    if (wards.size > 1) {
        Column(modifier = Modifier.padding(top = 6.dp)) {
            Text(
                text = "Phường thuộc $district:",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)
            )
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(wards) { ward ->
                    val isSelected = selectedWard == ward
                    FilterChip(
                        selected = isSelected,
                        onClick = { onWardSelected(ward) },
                        label = {
                            Text(
                                text = ward,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.85f),
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }
    }
}

@Composable
fun HeroBanner() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(170.dp)
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(20.dp))
    ) {
        AsyncImage(
            model = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f))
                    )
                )
        )
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.Bottom
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = BrandPrimary,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Ưu đãi phòng trọ mới nhất",
                    color = Color.White,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Text(
                text = "Hàng trăm phòng trọ chính chủ, đầy đủ tiện nghi với giá hợp lý",
                color = Color.White.copy(alpha = 0.85f),
                fontSize = 12.sp,
                modifier = Modifier.padding(top = 4.dp)
            )
        }
    }
}
