package com.smartroomsearch.app.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun RoomDetailScreen(roomId: Int, viewModel: MainViewModel, onBack: () -> Unit) {
    val rooms by viewModel.rooms.collectAsState()
    val favorites by viewModel.favorites.collectAsState()
    val room = rooms.find { it.id == roomId }
    val context = LocalContext.current

    LaunchedEffect(roomId) {
        viewModel.trackView(roomId)
    }

    if (room == null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
        return
    }

    val isFavorite = favorites.any { it.id == room.id }
    val heartScale by animateFloatAsState(
        targetValue = if (isFavorite) 1.25f else 1.0f,
        animationSpec = spring(dampingRatio = 0.4f),
        label = "heartScaleDetail"
    )

    val similarRooms = rooms.filter { it.id != room.id && (it.district == room.district || it.price in (room.price * 0.8)..(room.price * 1.2)) }.take(5)

    var reviews by remember {
        mutableStateOf(
            listOf(
                com.smartroomsearch.app.model.RoomReview(1, room.id, "Người thuê ẩn danh", 5, "Phòng sạch sẽ, giờ giấc tự do, điện nước tính đúng giá cam kết. Rất hài lòng!"),
                com.smartroomsearch.app.model.RoomReview(2, room.id, "Sinh viên thuê trọ", 5, "An ninh tốt, gần chợ và trạm xe buýt. Chủ trọ nhiệt tình hỗ trợ."),
                com.smartroomsearch.app.model.RoomReview(3, room.id, "Khách thuê thực tế", 4, "Phòng thoáng mát, wifi ổn định. Đáng để thuê lâu dài.")
            )
        )
    }
    var showReviewDialog by remember { mutableStateOf(false) }
    var reviewRating by remember { mutableStateOf(5) }
    var reviewAuthor by remember { mutableStateOf("") }
    var reviewComment by remember { mutableStateOf("") }

    if (showReviewDialog) {
        AlertDialog(
            onDismissRequest = { showReviewDialog = false },
            title = { Text("Viết đánh giá phòng trọ", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Đánh giá không cần đăng nhập. Bạn có thể để ẩn danh.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("Số sao đánh giá:", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    Row {
                        (1..5).forEach { star ->
                            IconButton(onClick = { reviewRating = star }) {
                                Icon(
                                    Icons.Default.Star,
                                    contentDescription = null,
                                    tint = if (star <= reviewRating) Color(0xFFF59E0B) else Color.LightGray
                                )
                            }
                        }
                    }
                    OutlinedTextField(
                        value = reviewAuthor,
                        onValueChange = { reviewAuthor = it },
                        label = { Text("Tên của bạn (Để trống = Ẩn danh)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )
                    OutlinedTextField(
                        value = reviewComment,
                        onValueChange = { reviewComment = it },
                        label = { Text("Cảm nhận về phòng trọ (an ninh, chủ trọ...)") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (reviewComment.isNotBlank()) {
                            val newRev = com.smartroomsearch.app.model.RoomReview(
                                id = System.currentTimeMillis(),
                                roomId = room.id,
                                author = reviewAuthor.ifBlank { "Người dùng ẩn danh" },
                                rating = reviewRating,
                                comment = reviewComment
                            )
                            reviews = listOf(newRev) + reviews
                            reviewComment = ""
                            reviewAuthor = ""
                            showReviewDialog = false
                        }
                    }
                ) {
                    Text("Gửi đánh giá")
                }
            },
            dismissButton = {
                TextButton(onClick = { showReviewDialog = false }) {
                    Text("Hủy")
                }
            }
        )
    }

    Scaffold(
        bottomBar = {
            Surface(
                shadowElevation = 12.dp,
                color = MaterialTheme.colorScheme.surface
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Favorite Toggle Button
                    IconButton(
                        onClick = { viewModel.toggleFavorite(room) },
                        modifier = Modifier
                            .size(48.dp)
                            .background(
                                color = if (isFavorite) Color(0xFFEF4444).copy(alpha = 0.12f) else MaterialTheme.colorScheme.surfaceVariant,
                                shape = RoundedCornerShape(12.dp)
                            )
                    ) {
                        Icon(
                            imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Yêu thích",
                            tint = if (isFavorite) Color(0xFFEF4444) else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.scale(heartScale)
                        )
                    }

                    // Call Button
                    Button(
                        onClick = {
                            viewModel.trackContact(room.id)
                            val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${room.phone}"))
                            context.startActivity(intent)
                        },
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(Icons.Default.Phone, null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Gọi Điện", fontWeight = FontWeight.Bold)
                    }

                    // Zalo Button
                    OutlinedButton(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(room.zaloLink))
                            context.startActivity(intent)
                        },
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = MaterialTheme.colorScheme.primary)
                    ) {
                        Icon(Icons.Default.Email, null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Chat Zalo", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Image Gallery Header
            item {
                Box(modifier = Modifier.fillMaxWidth().height(320.dp)) {
                    if (room.images.isNotEmpty()) {
                        LazyRow(
                            modifier = Modifier.fillMaxSize(),
                            horizontalArrangement = Arrangement.spacedBy(1.dp)
                        ) {
                            items(room.images) { imageUrl ->
                                AsyncImage(
                                    model = imageUrl,
                                    contentDescription = room.title,
                                    modifier = Modifier
                                        .fillParentMaxWidth()
                                        .fillMaxHeight(),
                                    contentScale = ContentScale.Crop
                                )
                            }
                        }
                    } else {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(MaterialTheme.colorScheme.surfaceVariant),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                Icons.Default.Info,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    // Back Button Top Bar
                    IconButton(
                        onClick = onBack,
                        modifier = Modifier
                            .padding(16.dp)
                            .size(40.dp)
                            .background(Color.Black.copy(0.4f), CircleShape)
                    ) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, null, tint = Color.White)
                    }

                    // Image count indicator
                    if (room.images.size > 1) {
                        Surface(
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .padding(16.dp),
                            color = Color.Black.copy(0.6f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text(
                                text = "1/${room.images.size} ảnh",
                                color = Color.White,
                                fontSize = 12.sp,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            // Main Room Info
            item {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            StatusBadge(room.status)
                            SourceBadge(room.source)
                        }
                        RatingBar(room.rating)
                    }

                    Spacer(Modifier.height(10.dp))
                    Text(
                        text = room.title,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(
                            text = room.address,
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Spacer(Modifier.height(20.dp))

                    // Key Specs Grid
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp),
                            horizontalArrangement = Arrangement.SpaceAround
                        ) {
                            DetailStat(
                                label = "Giá thuê",
                                value = formatPriceShort(room.price) + "/tháng",
                                color = MaterialTheme.colorScheme.primary
                            )
                            DetailStat(
                                label = "Diện tích",
                                value = "${room.area} m²",
                                color = MaterialTheme.colorScheme.onSurface
                            )
                            DetailStat(
                                label = "Sức chứa",
                                value = "${room.maxPeople} người",
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }

                    Spacer(Modifier.height(24.dp))

                    // Monthly Expenses Section
                    Text(
                        text = "Chi phí hàng tháng",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(Modifier.height(12.dp))
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            PriceCard("Tiền điện", room.electricity.toDouble().formatPriceFull() + " / kWh")
                            HorizontalDivider(Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                            PriceCard("Tiền nước", room.water.toDouble().formatPriceFull() + " / người")
                            HorizontalDivider(Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                            PriceCard("Internet / Wifi", room.internet.toDouble().formatPriceFull() + " / tháng")
                            HorizontalDivider(Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                            PriceCard("Phí dịch vụ & Rác", room.serviceFee.toDouble().formatPriceFull() + " / tháng")
                        }
                    }

                    if (room.amenities.isNotEmpty()) {
                        Spacer(Modifier.height(24.dp))
                        Text(
                            text = "Tiện nghi & Dịch vụ",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(Modifier.height(12.dp))
                        FlowRow(
                            modifier = Modifier.fillMaxWidth(),
                            maxItemsInEachRow = 3
                        ) {
                            room.amenities.forEach { AmenityBadge(it, modifier = Modifier.padding(2.dp)) }
                        }
                    }

                    Spacer(Modifier.height(24.dp))
                    Text(
                        text = "Mô tả chi tiết",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = room.description ?: "Phòng trọ chính chủ sạch sẽ, thoáng mát, an ninh tốt.",
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        lineHeight = 22.sp
                    )

                    if (!room.externalUrl.isNullOrEmpty()) {
                        Spacer(Modifier.height(16.dp))
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(room.externalUrl))
                                context.startActivity(intent)
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEA580C))
                        ) {
                            Icon(Icons.Default.Share, null, modifier = Modifier.size(18.dp), tint = Color.White)
                            Spacer(Modifier.width(8.dp))
                            val sourceName = when (room.source?.lowercase()) {
                                "nhatot" -> "Chợ Tốt Nhà"
                                "batdongsan" -> "Batdongsan.com.vn"
                                "phongtro123" -> "Phongtro123.com"
                                else -> "Trang nguồn"
                            }
                            Text("Mở bài đăng gốc ($sourceName)", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }

                    Spacer(Modifier.height(24.dp))

                    Spacer(Modifier.height(24.dp))

                    // Location Card & Interactive OpenStreetMap
                    Text(
                        text = "Vị trí & Bản đồ (OpenStreetMap)",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(Modifier.height(12.dp))
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(0.4f))
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(Modifier.width(8.dp))
                                Text(
                                    text = room.address,
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.weight(1f)
                                )
                            }
                            Spacer(Modifier.height(12.dp))

                            // Embedded OpenStreetMap with Leaflet (100% Free & Smooth)
                            androidx.compose.ui.viewinterop.AndroidView(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(180.dp)
                                    .clip(RoundedCornerShape(12.dp)),
                                factory = { ctx ->
                                    android.webkit.WebView(ctx).apply {
                                        settings.javaScriptEnabled = true
                                        settings.domStorageEnabled = true
                                        settings.cacheMode = android.webkit.WebSettings.LOAD_DEFAULT
                                        settings.mixedContentMode = android.webkit.WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                                        webChromeClient = android.webkit.WebChromeClient()
                                        webViewClient = object : android.webkit.WebViewClient() {
                                            override fun onReceivedSslError(
                                                view: android.webkit.WebView?,
                                                handler: android.webkit.SslErrorHandler?,
                                                error: android.net.http.SslError?
                                            ) {
                                                handler?.proceed()
                                            }
                                        }
                                        val escapedTitle = room.title
                                            .replace("\\", "\\\\")
                                            .replace("'", "\\'")
                                            .replace("\"", "\\\"")
                                            .replace("\r", " ")
                                            .replace("\n", " ")
                                        val html = """
                                            <!DOCTYPE html><html><head>
                                            <meta charset="utf-8" />
                                            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
                                            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" />
                                            <style>body,html,#map{margin:0;padding:0;width:100%;height:100%;background:#f8fafc;}</style>
                                            <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>
                                            <script>
                                                if (typeof L === 'undefined') {
                                                    document.write('<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"><\\/script>');
                                                }
                                            </script>
                                            </head><body><div id="map"></div>
                                            <script>
                                            function initMiniMap() {
                                                if (typeof L === 'undefined') {
                                                    setTimeout(initMiniMap, 80);
                                                    return;
                                                }
                                                if (window._miniMapReady) return;
                                                try {
                                                    var map = L.map('map', {zoomControl: false, preferCanvas: true}).setView([${room.lat}, ${room.lng}], 15);
                                                    window._miniMapReady = true;
                                                    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                                                    L.marker([${room.lat}, ${room.lng}]).addTo(map).bindPopup("<b>$escapedTitle</b>").openPopup();
                                                    setTimeout(function() { map.invalidateSize(); }, 200);
                                                    setTimeout(function() { map.invalidateSize(); }, 600);
                                                } catch(e) {
                                                    console.error("Mini map error:", e);
                                                }
                                            }
                                            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                                                initMiniMap();
                                            } else {
                                                document.addEventListener('DOMContentLoaded', initMiniMap);
                                                window.addEventListener('load', initMiniMap);
                                            }
                                            setTimeout(initMiniMap, 100);
                                            </script></body></html>
                                        """.trimIndent()
                                        loadDataWithBaseURL("https://openstreetmap.org/", html, "text/html", "UTF-8", null)
                                    }
                                }
                            )

                            Spacer(Modifier.height(12.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Tọa độ: ${room.lat}, ${room.lng}",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                Button(
                                    onClick = {
                                        val gmmUri = Uri.parse("https://www.google.com/maps/search/?api=1&query=${Uri.encode("${room.title} ${room.address}")}")
                                        val mapIntent = Intent(Intent.ACTION_VIEW, gmmUri)
                                        try {
                                            mapIntent.setPackage("com.google.android.apps.maps")
                                            context.startActivity(mapIntent)
                                        } catch (e: Exception) {
                                            context.startActivity(Intent(Intent.ACTION_VIEW, gmmUri))
                                        }
                                    },
                                    shape = RoundedCornerShape(12.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                                ) {
                                    Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(16.dp))
                                    Spacer(Modifier.width(6.dp))
                                    Text("Xem & Đánh giá trên Google Maps", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    Spacer(Modifier.height(28.dp))

                    // Đánh giá từ người dùng (Review Section - Ẩn danh & Trực tiếp)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Đánh giá & Trải nghiệm",
                                fontWeight = FontWeight.Bold,
                                fontSize = 18.sp,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(16.dp))
                                Spacer(Modifier.width(4.dp))
                                Text(
                                    text = "4.9 / 5.0 (${reviews.size} đánh giá)",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        Button(
                            onClick = { showReviewDialog = true },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("Viết đánh giá", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(Modifier.height(12.dp))

                    // Danh sách các đánh giá
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        reviews.forEach { rev ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(0.3f))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = rev.author,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp
                                        )
                                        Row {
                                            repeat(rev.rating) {
                                                Icon(
                                                    Icons.Default.Star,
                                                    contentDescription = null,
                                                    tint = Color(0xFFF59E0B),
                                                    modifier = Modifier.size(14.dp)
                                                )
                                            }
                                        }
                                    }
                                    Spacer(Modifier.height(4.dp))
                                    Text(
                                        text = rev.comment,
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }

                    if (similarRooms.isNotEmpty()) {
                        Spacer(Modifier.height(32.dp))
                        Text(
                            text = "Phòng tương tự cùng khu vực",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Spacer(Modifier.height(12.dp))
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(14.dp)
                        ) {
                            items(similarRooms) { simRoom ->
                                Box(modifier = Modifier.width(260.dp)) {
                                    RoomCard(
                                        room = simRoom,
                                        isFavorite = favorites.any { it.id == simRoom.id },
                                        onFavoriteClick = { viewModel.toggleFavorite(simRoom) },
                                        onClick = { onBack() }
                                    )
                                }
                            }
                        }
                    }

                    Spacer(Modifier.height(32.dp))
                }
            }
        }
    }
}

@Composable
fun DetailStat(label: String, value: String, color: Color) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(Modifier.height(4.dp))
        Text(value, fontSize = 16.sp, fontWeight = FontWeight.ExtraBold, color = color)
    }
}

@Composable
fun PriceCard(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(value, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
    }
}

@Composable
fun RatingBar(rating: Double) {
    Surface(
        color = Color(0xFFF59E0B).copy(alpha = 0.12f),
        shape = RoundedCornerShape(10.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.Star, null, tint = Color(0xFFF59E0B), modifier = Modifier.size(14.dp))
            Spacer(Modifier.width(4.dp))
            Text(
                text = rating.toString(),
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFF59E0B)
            )
        }
    }
}
