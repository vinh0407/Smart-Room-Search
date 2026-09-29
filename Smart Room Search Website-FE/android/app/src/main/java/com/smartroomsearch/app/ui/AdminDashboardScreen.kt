package com.smartroomsearch.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartroomsearch.app.model.RoomStats
import com.smartroomsearch.app.model.Tenant

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(
    viewModel: MainViewModel,
    onAddRoom: () -> Unit,
    onManageRooms: () -> Unit,
    onManageTenants: () -> Unit,
    onManageDemands: () -> Unit
) {
    val stats by viewModel.stats.collectAsState()
    val tenants by viewModel.tenants.collectAsState()
    val demands by viewModel.demands.collectAsState()
    var showLogoutDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Bảng Quản Trị", fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(7.dp).background(Color(0xFF10B981), CircleShape))
                            Spacer(Modifier.width(4.dp))
                            Text("Hệ thống Online", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { viewModel.refreshAdmin() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Làm mới")
                    }
                    IconButton(onClick = { showLogoutDialog = true }) {
                        Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = "Đăng xuất", tint = MaterialTheme.colorScheme.error)
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                SectionHeader("Thống kê tổng quan", subtitle = "Số liệu thực tế từ cơ sở dữ liệu hệ thống")
            }

            item {
                val s: RoomStats = stats ?: RoomStats()
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        StatCard("Tổng phòng trọ", s.total.toString(), Icons.Default.Home, MaterialTheme.colorScheme.primary, Modifier.weight(1f))
                        StatCard("Còn trống", s.available.toString(), Icons.Default.Check, Color(0xFF10B981), Modifier.weight(1f))
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        StatCard("Đã cho thuê", s.rented.toString(), Icons.Default.Person, Color(0xFFEF4444), Modifier.weight(1f))
                        StatCard("Khách thuê", tenants.size.toString(), Icons.Default.Person, Color(0xFF3B82F6), Modifier.weight(1f))
                    }
                }
            }

            item {
                SectionHeader("Tác vụ quản lý nhanh", subtitle = "Truy cập các tính năng cốt lõi của chủ trọ")
            }

            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    QuickActionButton(
                        icon = Icons.Default.Star,
                        title = "Đăng phòng mới (AI Parse)",
                        subtitle = "Nhập dữ liệu thông minh bằng AI tiếng Việt",
                        color = MaterialTheme.colorScheme.primary,
                        onClick = onAddRoom
                    )
                    QuickActionButton(
                        icon = Icons.Default.Home,
                        title = "Quản lý danh sách phòng",
                        subtitle = "Đổi trạng thái, chỉnh sửa & xóa phòng trọ",
                        color = Color(0xFF3B82F6),
                        onClick = onManageRooms
                    )
                    QuickActionButton(
                        icon = Icons.Default.Person,
                        title = "Quản lý khách thuê (${tenants.size})",
                        subtitle = "Hợp đồng thuê, tiền cọc & lịch sử trả phòng",
                        color = Color(0xFFF59E0B),
                        onClick = onManageTenants
                    )
                    QuickActionButton(
                        icon = Icons.Default.List,
                        title = "Nhu cầu tìm phòng (${demands.size})",
                        subtitle = "Danh sách khách hàng đang tìm phòng cần liên hệ",
                        color = Color(0xFF8B5CF6),
                        onClick = onManageDemands
                    )
                }
            }

            if (tenants.isNotEmpty()) {
                item {
                    SectionHeader("Khách thuê mới đây", subtitle = "Danh sách hợp đồng thuê trọ đang hoạt động")
                }
                items(tenants.take(3)) { tenant: Tenant ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                color = Color(0xFF3B82F6).copy(alpha = 0.12f),
                                shape = CircleShape,
                                modifier = Modifier.size(40.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(Icons.Default.Person, null, tint = Color(0xFF3B82F6), modifier = Modifier.size(20.dp))
                                }
                            }
                            Spacer(Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(tenant.fullName, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text("Phòng: ${tenant.roomTitle ?: "Chưa xếp"}", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                            }
                            Text(tenant.phone, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }
    }

    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = { Text("Đăng xuất Quản trị") },
            text = { Text("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Quản trị viên?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        showLogoutDialog = false
                        viewModel.logout()
                    }
                ) {
                    Text("Đăng xuất", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) { Text("Hủy") }
            }
        )
    }
}

@Composable
fun QuickActionButton(
    icon: ImageVector,
    title: String,
    subtitle: String,
    color: Color,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = color.copy(alpha = 0.12f),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.size(48.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, null, tint = color, modifier = Modifier.size(24.dp))
                }
            }
            Spacer(Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                Text(subtitle, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Icon(Icons.AutoMirrored.Filled.ArrowForward, null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}