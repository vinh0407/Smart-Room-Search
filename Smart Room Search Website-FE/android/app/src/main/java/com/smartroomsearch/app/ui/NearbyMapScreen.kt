package com.smartroomsearch.app.ui

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import coil.compose.AsyncImage
import com.smartroomsearch.app.model.Room
import java.text.DecimalFormat

@Composable
fun NearbyMapScreen(
    viewModel: MainViewModel,
    onBack: (() -> Unit)? = null,
    onRoomClick: (Int) -> Unit
) {
    val rooms by viewModel.rooms.collectAsState()
    NearbyMapScreen(
        rooms = rooms,
        onBack = onBack ?: {},
        onRoomClick = { room -> onRoomClick(room.id) }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@SuppressLint("SetJavaScriptEnabled")
@Composable
fun NearbyMapScreen(
    rooms: List<Room>,
    onBack: () -> Unit,
    onRoomClick: (Room) -> Unit
) {
    val context = LocalContext.current
    var selectedRadius by remember { mutableStateOf("5 km") }
    val radiusOptions = listOf("1 km", "3 km", "5 km", "10 km", "Tất cả")

    // Vị trí mặc định tại trung tâm TP.HCM (hoặc tọa độ phòng đầu tiên)
    val userLat = 10.7769
    val userLng = 106.7009

    fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val r = 6371.0 // Bán kính Trái Đất (km)
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
        val c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return r * c
    }

    val radiusLimit = when (selectedRadius) {
        "1 km" -> 1.0
        "3 km" -> 3.0
        "5 km" -> 5.0
        "10 km" -> 10.0
        else -> Double.MAX_VALUE
    }

    val nearbyRooms = remember(rooms, selectedRadius) {
        rooms.filter { r ->
            r.lat in 8.0..24.0 && r.lng in 102.0..110.0 && calculateDistance(userLat, userLng, r.lat, r.lng) <= radiusLimit
        }.sortedBy { calculateDistance(userLat, userLng, it.lat, it.lng) }.take(120)
    }

    var selectedRoomOnMap by remember { mutableStateOf<Room?>(nearbyRooms.firstOrNull()) }

    // Tạo HTML chứa OpenStreetMap (Leaflet.js) - 100% Miễn phí, mượt mà
    val mapHtml = remember(nearbyRooms) {
        val markersJs = nearbyRooms.joinToString(",") { r ->
            val escapedTitle = r.title.replace("'", "\\'").replace("\"", "\\\"").replace("\n", " ")
            val priceStr = "${DecimalFormat("#,###").format(r.price)} đ"
            """
            {
                id: ${r.id},
                lat: ${r.lat},
                lng: ${r.lng},
                title: "$escapedTitle",
                price: "$priceStr"
            }
            """.trimIndent()
        }

        """
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #f8fafc; }
                .price-badge {
                    background: #ea580c;
                    color: white;
                    font-weight: bold;
                    font-size: 11px;
                    padding: 3px 6px;
                    border-radius: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    white-space: nowrap;
                    text-align: center;
                }
                .user-pin {
                    background: #2563eb;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(37,99,235,0.8);
                }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                try {
                    var map = L.map('map', { zoomControl: false }).setView([$userLat, $userLng], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '© OpenStreetMap'
                    }).addTo(map);

                    // User Location Pin
                    var userIcon = L.divIcon({ className: 'user-pin', iconSize: [14, 14] });
                    L.marker([$userLat, $userLng], { icon: userIcon }).addTo(map).bindPopup("<b>Vị trí của bạn</b>");

                    var markers = [$markersJs];
                    if (markers.length > 0) {
                        var bounds = L.latLngBounds([[$userLat, $userLng]]);
                        markers.forEach(function(m) {
                            if (m.lat && m.lng) {
                                bounds.extend([m.lat, m.lng]);
                                var badgeIcon = L.divIcon({
                                    className: 'custom-div-icon',
                                    html: '<div class="price-badge">' + m.price + '</div>',
                                    iconSize: [60, 20],
                                    iconAnchor: [30, 10]
                                });
                                var marker = L.marker([m.lat, m.lng], { icon: badgeIcon }).addTo(map);
                                marker.on('click', function() {
                                    if (window.AndroidBridge) {
                                        window.AndroidBridge.onRoomSelected(m.id);
                                    }
                                });
                            }
                        });
                        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
                    }
                    setTimeout(function() { map.invalidateSize(); }, 300);
                } catch(e) {
                    console.error("Map init error:", e);
                }
            </script>
        </body>
        </html>
        """.trimIndent()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Bản đồ trọ gần tôi", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text(
                            text = "Tìm thấy ${nearbyRooms.size} phòng trọ xung quanh",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Quay lại")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.surface)
            )
        }
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Leaflet OpenStreetMap View
            AndroidView(
                modifier = Modifier.fillMaxSize(),
                factory = { ctx ->
                    WebView(ctx).apply {
                        settings.javaScriptEnabled = true
                        settings.domStorageEnabled = true
                        webViewClient = WebViewClient()
                        addJavascriptInterface(object {
                            @JavascriptInterface
                            fun onRoomSelected(roomId: Int) {
                                post {
                                    val found = rooms.find { it.id == roomId }
                                    if (found != null) {
                                        selectedRoomOnMap = found
                                    }
                                }
                            }
                        }, "AndroidBridge")
                        tag = mapHtml
                        loadDataWithBaseURL("https://openstreetmap.org", mapHtml, "text/html", "UTF-8", null)
                    }
                },
                update = { webView ->
                    if (webView.tag != mapHtml) {
                        webView.tag = mapHtml
                        webView.loadDataWithBaseURL("https://openstreetmap.org", mapHtml, "text/html", "UTF-8", null)
                    }
                }
            )

            // Radius Selector (Top Overlay)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(12.dp)
                    .align(Alignment.TopCenter),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f)),
                elevation = CardDefaults.cardElevation(6.dp)
            ) {
                Column(modifier = Modifier.padding(10.dp)) {
                    Text(
                        text = "Khoảng cách tìm kiếm:",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(Modifier.height(6.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(radiusOptions) { option ->
                            val isSelected = selectedRadius == option
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier.clickable { selectedRadius = option }
                            ) {
                                Text(
                                    text = option,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                                )
                            }
                        }
                    }
                }
            }

            // Bottom Selected Room Preview Card
            selectedRoomOnMap?.let { room ->
                val dist = calculateDistance(userLat, userLng, room.lat, room.lng)
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .align(Alignment.BottomCenter)
                        .clickable { onRoomClick(room) },
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = room.images.firstOrNull(),
                            contentDescription = null,
                            modifier = Modifier
                                .size(80.dp)
                                .clip(RoundedCornerShape(12.dp)),
                            contentScale = ContentScale.Crop
                        )
                        Spacer(Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = room.title,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                text = "${DecimalFormat("#,###").format(room.price)} đ/tháng · ${room.area}m²",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                            Spacer(Modifier.height(2.dp))
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.secondary,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(Modifier.width(4.dp))
                                Text(
                                    text = "Cách bạn ${if (dist < 1) "${(dist * 1000).toInt()}m" else "${String.format("%.1f", dist)}km"}",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                        IconButton(
                            onClick = {
                                val gmmIntentUri = Uri.parse("geo:${room.lat},${room.lng}?q=${Uri.encode(room.address)}")
                                val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                                mapIntent.setPackage("com.google.android.apps.maps")
                                try {
                                    context.startActivity(mapIntent)
                                } catch (e: Exception) {
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/search/?api=1&query=${Uri.encode(room.address)}")))
                                }
                            }
                        ) {
                            Icon(
                                Icons.Default.LocationOn,
                                contentDescription = "Chỉ đường trên Google Maps",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
            }
        }
    }
}
