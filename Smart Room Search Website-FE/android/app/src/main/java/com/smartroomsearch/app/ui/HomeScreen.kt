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

@Composable
fun HomeScreen(viewModel: MainViewModel, onRoomClick: (Int) -> Unit) {
    val rooms by viewModel.rooms.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val favorites by viewModel.favorites.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedDistrict by remember { mutableStateOf("Tất cả") }

    val filteredRooms = rooms.filter {
        (selectedDistrict == "Tất cả" ||
         it.district.equals(selectedDistrict, ignoreCase = true) ||
         it.district.contains(selectedDistrict, ignoreCase = true) ||
         selectedDistrict.contains(it.district, ignoreCase = true)) &&
        (searchQuery.isEmpty() || it.title.contains(searchQuery, ignoreCase = true) || it.address.contains(searchQuery, ignoreCase = true))
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
                HomeHeader()
                AppSearchBar(
                    query = searchQuery,
                    onQueryChange = { searchQuery = it },
                    placeholder = "Tìm quận, địa chỉ, tên đường...",
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                HomeDistrictChips(
                    selected = selectedDistrict,
                    onSelected = { selectedDistrict = it }
                )
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
                        subtitle = "Tin đăng phòng trọ mới nhất tại TP.HCM"
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
fun HomeHeader() {
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
                text = "Tìm phòng trọ TP.HCM dễ dàng",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Surface(
            color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
            shape = RoundedCornerShape(12.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "TP.HCM",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
fun HomeDistrictChips(selected: String, onSelected: (String) -> Unit) {
    val districts = listOf("Tất cả", "Quận 1", "Quận 3", "Quận 7", "Quận 10", "Bình Thạnh", "Gò Vấp", "Tân Bình", "Phú Nhuận", "Tân Phú")
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
