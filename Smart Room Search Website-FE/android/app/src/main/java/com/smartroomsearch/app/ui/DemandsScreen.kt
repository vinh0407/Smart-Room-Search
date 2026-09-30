package com.smartroomsearch.app.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartroomsearch.app.model.RoomDemand
import com.smartroomsearch.app.model.LocationsData

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DemandsScreen(viewModel: MainViewModel) {
    val demands by viewModel.demands.collectAsState()
    val isLoggedIn by viewModel.isLoggedIn.collectAsState()
    val selectedCity by viewModel.selectedCity.collectAsState()

    var selectedCityFilter by remember(selectedCity) { mutableStateOf(selectedCity) }
    var selectedDistrictFilter by remember { mutableStateOf("Tất cả") }
    var selectedWardFilter by remember { mutableStateOf("Tất cả") }

    var demandToDelete by remember { mutableStateOf<RoomDemand?>(null) }
    var showCreateSheet by remember { mutableStateOf(false) }

    val cityOptions = listOf("Tất cả") + LocationsData.CITIES.map { it.name }
    val districtOptions = remember(selectedCityFilter) {
        if (selectedCityFilter == "Tất cả") {
            LocationsData.ALL_HCM_DISTRICTS
        } else {
            LocationsData.getDistrictsForCity(selectedCityFilter)
        }
    }
    val wardOptions = remember(selectedDistrictFilter) {
        if (selectedDistrictFilter == "Tất cả") emptyList()
        else listOf("Tất cả") + LocationsData.getWardsForDistrict(selectedDistrictFilter)
    }

    val filteredDemands = remember(demands, selectedCityFilter, selectedDistrictFilter, selectedWardFilter) {
        demands.filter { d ->
            val loc = "${d.district ?: ""} ${d.note ?: ""}".lowercase()
            val cityMatch = if (selectedCityFilter == "Tất cả") true else {
                val clean = selectedCityFilter.replace("TP. ", "").replace("Thành phố ", "").lowercase().trim()
                loc.contains(clean)
            }
            val distMatch = if (selectedDistrictFilter == "Tất cả") true else {
                val clean = selectedDistrictFilter.replace(Regex("^(quận|huyện)\\s+", RegexOption.IGNORE_CASE), "").lowercase().trim()
                loc.contains(clean)
            }
            val wardMatch = if (selectedWardFilter == "Tất cả") true else {
                val clean = selectedWardFilter.replace(Regex("^(phường|xã)\\s+", RegexOption.IGNORE_CASE), "").lowercase().trim()
                loc.contains(clean)
            }
            cityMatch && distMatch && wardMatch
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Nhu cầu tìm phòng", fontWeight = FontWeight.Bold) },
                actions = {
                    IconButton(onClick = { viewModel.loadPublicData() }) {
                        Icon(Icons.Default.Refresh, null)
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { showCreateSheet = true },
                icon = { Icon(Icons.Default.Add, null) },
                text = { Text("Đăng nhu cầu", fontWeight = FontWeight.Bold) },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = androidx.compose.ui.graphics.Color.White
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Thanh bộ lọc Tỉnh thành / Quận huyện / Phường cho nhu cầu
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 1.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(vertical = 8.dp)) {
                    // Dòng 1: Chọn Tỉnh / Thành
                    Text(
                        text = "Tỉnh / Thành phố",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)
                    )
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(cityOptions) { c ->
                            FilterChip(
                                selected = selectedCityFilter == c,
                                onClick = {
                                    selectedCityFilter = c
                                    selectedDistrictFilter = "Tất cả"
                                    selectedWardFilter = "Tất cả"
                                },
                                label = { Text(if (c == "Tất cả") "Toàn quốc" else c.replace("TP. ", ""), fontSize = 12.sp) }
                            )
                        }
                    }

                    Spacer(Modifier.height(4.dp))

                    // Dòng 2: Chọn Quận / Huyện
                    Text(
                        text = "Quận / Huyện",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)
                    )
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(districtOptions) { d ->
                            FilterChip(
                                selected = selectedDistrictFilter == d,
                                onClick = {
                                    selectedDistrictFilter = d
                                    selectedWardFilter = "Tất cả"
                                },
                                label = { Text(d, fontSize = 12.sp) }
                            )
                        }
                    }

                    // Dòng 3: Chọn Phường / Xã (khi đã chọn quận cụ thể)
                    if (wardOptions.isNotEmpty()) {
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = "Phường / Xã",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 2.dp)
                        )
                        LazyRow(
                            contentPadding = PaddingValues(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(wardOptions) { w ->
                                FilterChip(
                                    selected = selectedWardFilter == w,
                                    onClick = { selectedWardFilter = w },
                                    label = { Text(w, fontSize = 12.sp) }
                                )
                            }
                        }
                    }
                }
            }

            // Danh sách bài đăng nhu cầu
            if (filteredDemands.isEmpty()) {
                EmptyState(
                    icon = Icons.Default.List,
                    title = if (demands.isEmpty()) "Chưa có nhu cầu nào" else "Không tìm thấy nhu cầu phù hợp",
                    description = if (demands.isEmpty()) "Hãy đăng nhu cầu tìm phòng của bạn để chủ trọ có thể liên hệ trực tiếp!" else "Thử đổi bộ lọc tỉnh thành, quận huyện hoặc phường khác.",
                    actionLabel = "Đăng nhu cầu ngay",
                    onActionClick = { showCreateSheet = true },
                    modifier = Modifier.weight(1f)
                )
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(filteredDemands) { demand ->
                        DemandCard(
                            demand = demand,
                            isAdmin = isLoggedIn,
                            onDelete = { demandToDelete = demand }
                        )
                    }
                }
            }
        }
    }

    if (showCreateSheet) {
        CreateDemandSheet(
            viewModel = viewModel,
            onDismiss = { showCreateSheet = false }
        )
    }

    demandToDelete?.let { demand ->
        AlertDialog(
            onDismissRequest = { demandToDelete = null },
            title = { Text("Xóa nhu cầu") },
            text = { Text("Xóa bài đăng nhu cầu của ${demand.fullName ?: "Khách hàng"}?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.deleteDemand(demand.id)
                        demandToDelete = null
                    }
                ) { Text("Xóa", color = MaterialTheme.colorScheme.error) }
            },
            dismissButton = {
                TextButton(onClick = { demandToDelete = null }) { Text("Hủy") }
            }
        )
    }
}

@Composable
fun DemandCard(demand: RoomDemand, isAdmin: Boolean = false, onDelete: () -> Unit = {}) {
    val context = LocalContext.current
    val phoneStr = demand.phone?.trim()

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = demand.district?.ifBlank { null } ?: "TP.HCM (Khu vực bất kỳ)",
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    val priceText = demand.maxPrice?.let { "≤ ${it.formatPriceFull()}" } ?: "Ngân sách linh hoạt"
                    Text(
                        text = priceText,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurface
                    )

                    if (isAdmin) {
                        IconButton(onClick = onDelete) {
                            Icon(Icons.Default.Delete, null, tint = MaterialTheme.colorScheme.error)
                        }
                    }
                }
            }

            Spacer(Modifier.height(10.dp))
            Text(text = demand.fullName ?: "Khách hàng", fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Person, null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(text = "${demand.peopleCount} người", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(start = 4.dp, end = 12.dp))
                
                if (!phoneStr.isNullOrEmpty()) {
                    Icon(Icons.Default.Phone, null, modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(text = phoneStr, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(start = 4.dp))
                } else {
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        shape = RoundedCornerShape(6.dp)
                    ) {
                        Text(
                            text = "Đã bảo mật SĐT",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }

            demand.note?.let {
                if (it.isNotBlank()) {
                    Spacer(Modifier.height(8.dp))
                    Text(
                        text = "“ $it ”",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                    )
                }
            }

            if (isAdmin && !phoneStr.isNullOrEmpty()) {
                Spacer(Modifier.height(12.dp))
                Button(
                    onClick = {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phoneStr"))
                        context.startActivity(intent)
                    },
                    modifier = Modifier.fillMaxWidth().height(40.dp),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Icon(Icons.Default.Phone, null, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Liên hệ ngay", fontSize = 13.sp)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateDemandSheet(viewModel: MainViewModel, onDismiss: () -> Unit) {
    val currentCity by viewModel.selectedCity.collectAsState()
    var selectedCity by remember { mutableStateOf(currentCity) }
    var selectedDistrict by remember(selectedCity) {
        val dists = LocationsData.getDistrictsForCity(selectedCity).filter { it != "Tất cả" }
        mutableStateOf(dists.firstOrNull() ?: "Quận 1")
    }
    var selectedWard by remember(selectedDistrict) { mutableStateOf("") }

    var fullName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var maxPrice by remember { mutableStateOf("") }
    var peopleCount by remember { mutableStateOf("2") }
    var note by remember { mutableStateOf("") }

    var errorMsg by remember { mutableStateOf<String?>(null) }
    var isSubmitting by remember { mutableStateOf(false) }

    val cityList = LocationsData.CITIES.map { it.name }
    val districtList = remember(selectedCity) {
        LocationsData.getDistrictsForCity(selectedCity).filter { it != "Tất cả" }
    }
    val wardList = remember(selectedDistrict) {
        LocationsData.getWardsForDistrict(selectedDistrict)
    }

    fun submit() {
        if (fullName.isBlank() || phone.isBlank()) {
            errorMsg = "Vui lòng nhập Họ tên và Số điện thoại"
            return
        }
        val priceVal = maxPrice.toDoubleOrNull()
        val peopleVal = peopleCount.toIntOrNull() ?: 2

        isSubmitting = true
        errorMsg = null

        val fullLocation = listOfNotNull(
            selectedWard.ifBlank { null },
            selectedDistrict.ifBlank { null },
            selectedCity.ifBlank { null }
        ).joinToString(", ")

        viewModel.createDemand(
            fullName = fullName.trim(),
            phone = phone.trim(),
            district = fullLocation,
            maxPrice = priceVal,
            peopleCount = peopleVal,
            note = note.trim(),
            onResult = { success ->
                isSubmitting = false
                if (success) {
                    onDismiss()
                } else {
                    errorMsg = "Gửi nhu cầu thất bại, vui lòng kiểm tra lại SĐT (từ 9 - 11 chữ số)"
                }
            }
        )
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
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
                Text("Đăng Nhu Cầu Tìm Phòng", fontSize = 20.sp, fontWeight = FontWeight.Bold)
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, null)
                }
            }

            Spacer(Modifier.height(16.dp))

            OutlinedTextField(
                value = fullName,
                onValueChange = { fullName = it },
                label = { Text("Họ và tên *") },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(Modifier.height(12.dp))

            OutlinedTextField(
                value = phone,
                onValueChange = { phone = it },
                label = { Text("Số điện thoại liên hệ *") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(Modifier.height(12.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = maxPrice,
                    onValueChange = { maxPrice = it },
                    label = { Text("Ngân sách tối đa (đ)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
                OutlinedTextField(
                    value = peopleCount,
                    onValueChange = { peopleCount = it },
                    label = { Text("Số người ở") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp)
                )
            }

            Spacer(Modifier.height(14.dp))

            // Chọn Tỉnh / Thành phố
            Text("Tỉnh / Thành phố *", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(cityList) { c ->
                    FilterChip(
                        selected = selectedCity == c,
                        onClick = {
                            selectedCity = c
                            selectedDistrict = LocationsData.getDistrictsForCity(c).firstOrNull { it != "Tất cả" } ?: ""
                            selectedWard = ""
                        },
                        label = { Text(c.replace("TP. ", ""), fontSize = 12.sp) }
                    )
                }
            }

            Spacer(Modifier.height(10.dp))

            // Chọn Quận / Huyện
            Text("Quận / Huyện *", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.height(6.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(districtList) { d ->
                    FilterChip(
                        selected = selectedDistrict == d,
                        onClick = {
                            selectedDistrict = d
                            selectedWard = ""
                        },
                        label = { Text(d, fontSize = 12.sp) }
                    )
                }
            }

            // Chọn Phường / Xã
            if (wardList.isNotEmpty()) {
                Spacer(Modifier.height(10.dp))
                Text("Phường / Xã (tùy chọn)", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.height(6.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(wardList) { w ->
                        FilterChip(
                            selected = selectedWard == w,
                            onClick = { selectedWard = if (selectedWard == w) "" else w },
                            label = { Text(w, fontSize = 12.sp) }
                        )
                    }
                }
            }

            Spacer(Modifier.height(12.dp))

            OutlinedTextField(
                value = note,
                onValueChange = { note = it },
                label = { Text("Yêu cầu thêm (Máy lạnh, giờ tự do, nuôi pet...)") },
                modifier = Modifier.fillMaxWidth().height(90.dp),
                shape = RoundedCornerShape(12.dp)
            )

            errorMsg?.let {
                Spacer(Modifier.height(8.dp))
                Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp)
            }

            Spacer(Modifier.height(20.dp))

            Button(
                onClick = { submit() },
                enabled = !isSubmitting,
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = androidx.compose.ui.graphics.Color.White)
                } else {
                    Text("Gửi Nhu Cầu", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(Modifier.height(16.dp))
        }
    }
}
