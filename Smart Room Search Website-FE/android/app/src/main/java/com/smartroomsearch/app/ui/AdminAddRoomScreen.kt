package com.smartroomsearch.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.Create
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartroomsearch.app.model.RoomStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminAddRoomScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    var selectedTab by remember { mutableStateOf(0) } // 0: AI Parse, 1: Manual Form

    var aiInputText by remember { mutableStateOf("") }
    var isParsingAi by remember { mutableStateOf(false) }

    var title by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    var district by remember { mutableStateOf("Quận 10") }
    var price by remember { mutableStateOf("") }
    var area by remember { mutableStateOf("") }
    var maxPeople by remember { mutableStateOf("2") }
    var phone by remember { mutableStateOf("") }
    var images by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var status by remember { mutableStateOf(RoomStatus.available) }

    var isSubmitting by remember { mutableStateOf(false) }
    var submitError by remember { mutableStateOf<String?>(null) }
    var aiLoading by remember { mutableStateOf(false) }
    val snackbarHostState = remember { SnackbarHostState() }

    val districts = listOf("Quận 1", "Quận 3", "Quận 7", "Quận 10", "Bình Thạnh", "Gò Vấp", "Tân Bình", "Phú Nhuận", "Tân Phú")

    fun parseAiText() {
        if (aiInputText.isBlank()) {
            submitError = "Vui lòng dán văn bản bài đăng phòng trọ"
            return
        }
        submitError = null
        isParsingAi = true

        val text = aiInputText.lowercase()

        districts.find { d -> text.contains(d.lowercase()) }?.let { district = it }

        val priceMatch = Regex("(\\d+(?:[.,]\\d+)?)\\s*(tr|triệu|k)").find(text)
        if (priceMatch != null) {
            val num = priceMatch.groupValues[1].replace(',', '.').toDoubleOrNull() ?: 0.0
            val unit = priceMatch.groupValues[2]
            val finalPrice = if (unit == "k") num * 1000 else num * 1000000
            if (finalPrice > 0) price = finalPrice.toLong().toString()
        }

        val areaMatch = Regex("(\\d+(?:[.,]\\d+)?)\\s*m2").find(text)
        if (areaMatch != null) {
            area = areaMatch.groupValues[1]
        }

        val phoneMatch = Regex("(0\\d{9})").find(text)
        if (phoneMatch != null) {
            phone = phoneMatch.groupValues[1]
        }

        if (title.isBlank()) {
            title = "Phòng trọ đẹp ${if (area.isNotBlank()) "${area}m² " else ""}$district"
        }

        if (address.isBlank()) {
            address = "Đường chính, $district, TP.HCM"
        }

        if (description.isBlank()) {
            description = aiInputText.trim()
        }

        isParsingAi = false
        selectedTab = 1
    }

    fun doCreate() {
        val priceVal = price.toDoubleOrNull()
        val areaVal = area.toDoubleOrNull()
        val maxPeopleVal = maxPeople.toIntOrNull() ?: 2
        if (title.isBlank() || address.isBlank() || priceVal == null) {
            submitError = "Vui lòng nhập tiêu đề, địa chỉ và giá thuê hợp lệ"
            return
        }
        submitError = null
        val imageList = images.lines()
            .map { it.trim() }
            .filter { it.isNotEmpty() && it.startsWith("http") }

        val body = mapOf(
            "title" to title.trim(),
            "description" to description.trim(),
            "address" to address.trim(),
            "price" to priceVal,
            "area" to (areaVal ?: 20.0),
            "status" to status.name,
            "images" to imageList,
            "electricity" to 3500,
            "water" to 150000,
            "internet" to 100000,
            "serviceFee" to 200000,
            "maxPeople" to maxPeopleVal,
            "district" to district.trim(),
            "city" to "TP.HCM",
            "lat" to 10.7731,
            "lng" to 106.6952,
            "amenities" to listOf("wifi", "máy lạnh", "tủ quần áo"),
            "phone" to phone.trim(),
            "zaloLink" to "https://zalo.me/${phone.trim()}",
            "views" to 0,
            "contacts" to 0,
            "isFeatured" to false,
            "isNew" to true,
            "isCheap" to false,
            "rating" to 4.5
        )
        isSubmitting = true
        viewModel.createRoom(body) { success ->
            isSubmitting = false
            if (success) {
                onBack()
            } else {
                submitError = "Đăng phòng thất bại, kiểm tra lại dữ liệu"
            }
        }
    }

    fun doAiDescription() {
        if (title.isBlank() || address.isBlank()) {
            submitError = "Nhập tiêu đề và địa chỉ trước khi tạo mô tả bằng AI"
            return
        }
        aiLoading = true
        submitError = null
        viewModel.generateAiDescription(
            title = title.trim(),
            address = address.trim(),
            price = price.toDoubleOrNull() ?: 0.0,
            area = area.toDoubleOrNull() ?: 0.0,
            amenities = listOf("wifi", "máy lạnh"),
            onResult = { result ->
                aiLoading = false
                if (result.isNotBlank()) {
                    description = result
                } else {
                    submitError = "Chưa tạo được mô tả, thử lại sau"
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Thêm phòng trọ mới", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, null)
                    }
                }
            )
        },
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Star, null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
                            Spacer(Modifier.width(6.dp))
                            Text("Nhập liệu AI Parse", fontWeight = FontWeight.Bold)
                        }
                    }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Form Chi Tiết", fontWeight = FontWeight.Bold) }
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                if (selectedTab == 0) {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.08f))
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, null, tint = MaterialTheme.colorScheme.primary)
                                Spacer(Modifier.width(8.dp))
                                Text("AI Natural Language Parser", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                            }
                            Spacer(Modifier.height(6.dp))
                            Text(
                                "Dán văn bản tin đăng tiếng Việt tự nhiên bên dưới. AI sẽ tự động phân tích và trích xuất giá, diện tích, địa chỉ, tiện nghi...",
                                fontSize = 13.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }

                    OutlinedTextField(
                        value = aiInputText,
                        onValueChange = { aiInputText = it },
                        placeholder = { Text("Ví dụ: Cho thuê phòng trọ Quận 10 giá 4.5 triệu, diện tích 25m2, điện 3.5k, nước 100k, có máy lạnh ban công. SĐT 0901234567...") },
                        modifier = Modifier.fillMaxWidth().height(160.dp),
                        shape = RoundedCornerShape(14.dp)
                    )

                    Button(
                        onClick = { parseAiText() },
                        enabled = !isParsingAi,
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        if (isParsingAi) {
                            CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White)
                        } else {
                            Icon(Icons.Default.Star, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Phân Tích Dữ Liệu Bằng AI", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }
                } else {
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        label = { Text("Tiêu đề phòng trọ *") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedTextField(
                        value = address,
                        onValueChange = { address = it },
                        label = { Text("Địa chỉ chi tiết *") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Text("Chọn Quận / Huyện", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(districts) { d ->
                            FilterChip(
                                selected = district == d,
                                onClick = { district = d },
                                label = { Text(d, fontSize = 12.sp) }
                            )
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        OutlinedTextField(
                            value = price,
                            onValueChange = { price = it },
                            label = { Text("Giá thuê (đ) *") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        OutlinedTextField(
                            value = area,
                            onValueChange = { area = it },
                            label = { Text("Diện tích (m²)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        OutlinedTextField(
                            value = maxPeople,
                            onValueChange = { maxPeople = it },
                            label = { Text("Số người tối đa") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            label = { Text("SĐT liên hệ") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        )
                    }

                    OutlinedTextField(
                        value = images,
                        onValueChange = { images = it },
                        label = { Text("Link ảnh (mỗi dòng 1 link URL)") },
                        modifier = Modifier.fillMaxWidth().height(90.dp),
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Mô tả chi tiết phòng trọ") },
                        modifier = Modifier.fillMaxWidth().height(140.dp),
                        shape = RoundedCornerShape(12.dp)
                    )

                    OutlinedButton(
                        onClick = { doAiDescription() },
                        enabled = !aiLoading,
                        modifier = Modifier.fillMaxWidth().height(48.dp),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        if (aiLoading) {
                            CircularProgressIndicator(modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                            Spacer(Modifier.width(8.dp))
                            Text("AI đang sáng tạo bài viết...")
                        } else {
                            Icon(Icons.Default.Create, null, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("AI Tạo Bài Viết Mô Tả Tự Động")
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Trạng thái phòng", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            RoomStatus.values().forEach { s ->
                                FilterChip(
                                    selected = s == status,
                                    onClick = { status = s },
                                    label = {
                                        Text(
                                            when (s) {
                                                RoomStatus.available -> "Còn trống"
                                                RoomStatus.rented -> "Đã thuê"
                                                RoomStatus.maintenance -> "Bảo trì"
                                            },
                                            fontSize = 12.sp
                                        )
                                    }
                                )
                            }
                        }
                    }

                    submitError?.let {
                        Text(it, color = MaterialTheme.colorScheme.error, fontSize = 13.sp)
                    }

                    Button(
                        onClick = { doCreate() },
                        enabled = !isSubmitting,
                        modifier = Modifier.fillMaxWidth().height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
                    ) {
                        if (isSubmitting) {
                            CircularProgressIndicator(modifier = Modifier.size(22.dp), color = Color.White)
                        } else {
                            Icon(Icons.AutoMirrored.Filled.Send, null)
                            Spacer(Modifier.width(8.dp))
                            Text("Xác Nhận Đăng Phòng", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                    }
                }
                Spacer(Modifier.height(24.dp))
            }
        }
    }
}