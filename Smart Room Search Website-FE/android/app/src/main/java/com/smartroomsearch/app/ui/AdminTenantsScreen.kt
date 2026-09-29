package com.smartroomsearch.app.ui

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartroomsearch.app.model.Tenant

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminTenantsScreen(viewModel: MainViewModel, onBack: () -> Unit) {
    val tenants by viewModel.tenants.collectAsState()
    var tenantToDelete by remember { mutableStateOf<Tenant?>(null) }
    var deleteReason by remember { mutableStateOf("") }
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Quản lý khách thuê", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, null)
                    }
                }
            )
        }
    ) { padding ->
        if (tenants.isEmpty()) {
            EmptyState(
                icon = Icons.Default.Person,
                title = "Chưa có hợp đồng khách thuê",
                description = "Hiện tại chưa có thông tin khách đang thuê phòng trọ trong hệ thống.",
                modifier = Modifier.padding(padding)
            )
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(tenants) { tenant ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                                shape = CircleShape,
                                modifier = Modifier.size(44.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        Icons.Default.Person,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }

                            Spacer(Modifier.width(14.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(tenant.fullName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(Modifier.height(2.dp))
                                Text(
                                    text = if (tenant.phone.isNotBlank()) tenant.phone else "Chưa có SĐT",
                                    fontSize = 13.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                                if (tenant.roomTitle?.isNotBlank() == true) {
                                    Spacer(Modifier.height(4.dp))
                                    Surface(
                                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                                        shape = RoundedCornerShape(6.dp)
                                    ) {
                                        Text(
                                            text = "Phòng: ${tenant.roomTitle}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                            }

                            if (tenant.phone.isNotBlank()) {
                                IconButton(onClick = {
                                    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:${tenant.phone}"))
                                    context.startActivity(intent)
                                }) {
                                    Icon(Icons.Default.Phone, contentDescription = "Gọi", tint = MaterialTheme.colorScheme.primary)
                                }
                            }

                            IconButton(
                                onClick = {
                                    tenantToDelete = tenant
                                    deleteReason = ""
                                }
                            ) {
                                Icon(Icons.Default.Delete, contentDescription = "Kết thúc hợp đồng", tint = MaterialTheme.colorScheme.error)
                            }
                        }
                    }
                }
            }
        }
    }

    tenantToDelete?.let { tenant ->
        AlertDialog(
            onDismissRequest = { tenantToDelete = null },
            title = { Text("Kết thúc hợp đồng thuê") },
            text = {
                Column {
                    Text("Xác nhận trả phòng cho khách ${tenant.fullName}? Hồ sơ hợp đồng sẽ được lưu vào Lịch sử thuê trọ và trạng thái phòng sẽ tự chuyển về Còn trống.")
                    Spacer(Modifier.height(14.dp))
                    OutlinedTextField(
                        value = deleteReason,
                        onValueChange = { deleteReason = it },
                        label = { Text("Lý do trả phòng (không bắt buộc)") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    )
                }
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.deleteTenant(tenant.id, deleteReason.trim())
                        tenantToDelete = null
                    }
                ) { Text("Xác Nhận Trả Phòng", color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Bold) }
            },
            dismissButton = {
                TextButton(onClick = { tenantToDelete = null }) { Text("Hủy") }
            }
        )
    }
}