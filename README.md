# Smart Room Search — Trọ Xịn

> **Nền tảng tìm kiếm và quản lý phòng trọ thông minh toàn quốc** — kết nối trực tiếp người thuê và chủ trọ tại **TP.HCM, Hà Nội, Đà Nẵng, Bình Dương, Cần Thơ, Hải Phòng,...** Tích hợp nguồn tin tổng hợp đa kênh từ **Chợ Tốt Nhà, Batdongsan & Phongtro123**, hỗ trợ bộ lọc 3 cấp liên hoàn (**Tỉnh/Thành phố $\rightarrow$ Quận/Huyện $\rightarrow$ Phường/Xã**), bản đồ tương tác định vị khoảng cách, tối ưu hiệu năng mượt mà và bảo mật cao.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-2-7F52FF?logo=kotlin&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-3DDC84?logo=android&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white)
![TiDB Cloud](https://img.shields.io/badge/TiDB%20Cloud-00AFB9?logo=tidb&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)

---

## 🌐 Trải nghiệm trực tiếp

| Thành phần | URL | Mô tả |
|---|---|---|
| 🏠 **Website người thuê** | [smart-room-search.vercel.app](https://smart-room-search.vercel.app) | Tìm phòng, bản đồ, lọc 3 cấp, đăng nhu cầu, liên hệ chủ trọ |
| 🛡️ **Admin Web** (quản trị) | [smart-room-admin.vercel.app](https://smart-room-admin.vercel.app) | Quản lý phòng, khách thuê, nhu cầu, AI Data Entry, thống kê |
| ⚡ **Backend API** | [smart-room-api.smart-room-backend.workers.dev/api](https://smart-room-api.smart-room-backend.workers.dev/api) | Serverless REST API chạy trên Cloudflare Workers toàn cầu |
| 💓 **Health Check** | [smart-room-api.smart-room-backend.workers.dev/health](https://smart-room-api.smart-room-backend.workers.dev/health) | Kiểm tra trạng thái hoạt động backend & database |

> 🔑 **Tài khoản Admin mặc định:** `admin` / `123`

---

## 📱 Tải Ứng Dụng Android (APK)

Tải trực tiếp file cài đặt APK mới nhất cho điện thoại Android:

| Phiên bản | Tải file APK | Dung lượng | Trạng thái |
|---|---|---|---|
| 🚀 **Smart Room Search v2.0 (Khuyên dùng)** | [📥 **Tải SmartRoomSearch-v2.0.apk**](https://github.com/vinh0407/Smart-Room-Search/raw/main/APK/SmartRoomSearch-v2.0.apk) | ~28.8 MB | **Mới nhất · Đã kiểm thử** |
| 📦 Smart Room Search v1.0 | [📥 Tải SmartRoomSearch-v1.0.apk](https://github.com/vinh0407/Smart-Room-Search/raw/main/APK/SmartRoomSearch-v1.0.apk) | ~28.0 MB | Bản tiền nhiệm |

### 🌟 Điểm mới nổi bật trên bản v2.0:
1. **Phạm vi Toàn quốc**: Mở rộng dữ liệu và tìm kiếm tại mọi tỉnh thành trọng điểm (TP.HCM, Hà Nội, Đà Nẵng, Cần Thơ, Hải Phòng, Bình Dương, Đồng Nai,...).
2. **Bộ lọc 3 cấp liên hoàn**: Lựa chọn chính xác theo **Tỉnh/Thành phố $\rightarrow$ Quận/Huyện $\rightarrow$ Phường/Xã** trên cả thanh tìm kiếm phòng và biểu mẫu đăng nhu cầu tìm phòng.
3. **Phân loại nguồn phòng đa kênh**: Phân loại rõ ràng phòng chính chủ hệ thống và nguồn tổng hợp từ **Chợ Tốt Nhà, Batdongsan.com.vn & Phongtro123**, tự động cập nhật đúng theo tỉnh thành bạn đang xem.
4. **Khắc phục triệt để lỗi Bản đồ Mobile**: Nâng cấp WebView Leaflet sang cơ chế **Multi-CDN** (`cdnjs.cloudflare.com` + `cdn.jsdelivr.net` + `unpkg.com`), polling kiểm tra an toàn thư viện, tự động resize hiển thị mượt mà, loại bỏ hoàn toàn lỗi màn hình trắng hay chặn mạng.
5. **Tối ưu tốc độ & không giật lag**: Áp dụng phân trang cuốn chiếu mượt mà (Progressive Pagination), bộ nhớ tạm Card Memoization và Map Canvas siêu nhẹ.

> 💡 **Hướng dẫn cài đặt APK:**  
> Tải file APK về điện thoại $\rightarrow$ Nhấp mở file $\rightarrow$ Chọn **"Cho phép cài đặt từ nguồn không xác định"** nếu được hỏi $\rightarrow$ Chọn **Cài đặt**. (Ứng dụng debug-signed an toàn, phục vụ mục đích demo và thử nghiệm).

---

## ✨ Tính năng chính

### 1. Website Người Thuê (React 18 + Vite + Tailwind CSS)
- **Tìm kiếm đa tầng**: Lọc theo từ khóa, khoảng giá slider, diện tích, tiện nghi (máy lạnh, wifi, gác lửng, ban công, bếp, tự do giờ giấc,...), và phân loại khu vực.
- **Lọc 3 cấp chuẩn xác**: Chọn Tỉnh/Thành $\rightarrow$ Quận/Huyện $\rightarrow$ Phường/Xã với dữ liệu địa giới hành chính cập nhật.
- **Bản đồ tương tác Leaflet (OpenStreetMap)**: Hiển thị vị trí trực quan, bán kính tìm kiếm và khoảng cách thực tế (km) từ tọa độ GPS của người dùng.
- **Trang chi tiết phòng đầy đủ**: Gallery ảnh đa phương tiện, bảng kê chi phí hàng tháng (điện, nước, internet, phí dịch vụ), bản đồ vệ tinh mini và gợi ý phòng tương tự.
- **Đăng nhu cầu thông minh**: Người thuê có thể điền form 3 cấp hoặc nhập văn bản tự nhiên; hệ thống tự động phân tích và lưu trữ để chủ trọ liên hệ.
- **Tương tác trực tiếp**: Gọi điện thoại hoặc chat Zalo 1 chạm với chủ phòng (hệ thống tự động ghi nhận lượt liên hệ).
- **Yêu thích & Chế độ tối**: Lưu danh sách phòng yêu thích offline (LocalStorage), hỗ trợ Dark Mode bảo vệ mắt.

### 2. App Android Native (Kotlin + Jetpack Compose)
- **Kiến trúc hiện đại**: Viết 100% bằng Kotlin + Jetpack Compose (Material 3), ViewModel, Coroutines và StateFlow.
- **Bản đồ định vị mượt mà**: Tích hợp OpenStreetMap WebView với cơ chế Multi-CDN chống lỗi mạng, hiển thị marker tương tác và dẫn đường.
- **Bộ lọc & Nhu cầu đa cấp**: Giao diện FilterChip trực quan cho Tỉnh/Thành, Quận/Huyện, Phường/Xã.
- **Lưu trữ Offline**: Tích hợp cơ sở dữ liệu Room DB lưu các phòng yêu thích ngay cả khi không có kết nối Internet.
- **Mục Quản trị tích hợp**: Chủ trọ có thể đăng nhập admin ngay trên app để xem Dashboard thống kê, thêm/sửa/xóa phòng và quản lý khách thuê.

### 3. Admin Web & App Quản Trị
- **Dashboard số liệu thực tế**: Thống kê tổng số phòng, phòng đang trống, phòng đã cho thuê, đang bảo trì, tổng khách thuê và nhu cầu tìm phòng.
- **Nhập liệu thông minh bằng AI (AI Data Entry)**: Dán đoạn văn bản mô tả tiếng Việt bất kỳ (từ Facebook, Zalo, tin nhắn), hệ thống tự động trích xuất các trường thông tin (giá, diện tích, tiền cọc, địa chỉ, tiện nghi, thông tin liên hệ) qua endpoint `POST /api/rooms/parse`.
- **Quản lý toàn diện**: Quản lý phòng, cập nhật trạng thái nhanh, theo dõi hợp đồng và lịch sử khách thuê, duyệt nhu cầu tìm phòng.
- **AI sinh mô tả & Geocoding**: Tự động tạo bài viết mô tả phòng hấp dẫn và xác định tọa độ kinh độ/vĩ độ từ địa chỉ.

### 4. Backend Serverless & Database
- **Cloudflare Workers**: Chạy trên hạ tầng Edge toàn cầu của Cloudflare, độ trễ cực thấp, không cần duy trì máy chủ truyền thống.
- **TiDB Cloud (Distributed MySQL)**: Cơ sở dữ liệu phân tán chuẩn MySQL kết nối qua TiDB Data Service (HTTP Digest Auth bảo mật).
- **Bảo mật**: Mã hóa mật khẩu `bcryptjs`, xác thực phiên `JWT`, cơ chế chống brute-force đăng nhập.

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────┐   ┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│       App Android Native        │   │         Website FE              │   │           Admin Web             │
│   (Kotlin + Jetpack Compose)    │   │      (React 18 + Vite)          │   │      (React 18 + Vite)          │
└────────────────┬────────────────┘   └────────────────┬────────────────┘   └────────────────┬────────────────┘
                 │                                     │                                     │
                 └─────────────────────────────────────┼─────────────────────────────────────┘
                                                       │ HTTPS REST API
                                                       ▼
                                            ┌─────────────────────┐
                                            │ Cloudflare Workers  │
                                            │ (Production API)    │
                                            │ Express (Local Dev) │
                                            └──────────┬──────────┘
                                                       │ HTTP + Digest Auth
                                                       ▼
                                            ┌─────────────────────┐
                                            │  TiDB Data Service  │
                                            │    (TiDB Cloud)     │
                                            └──────────┬──────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────────┐
                                            │ MySQL smart_room_db │
                                            └─────────────────────┘
```

---

## 📁 Cấu trúc thư mục

```
Smart-Room-Search/
├── APK/                                     # Bộ cài đặt Android APK hoàn chỉnh
│   ├── SmartRoomSearch-v2.0.apk             # Bản phát hành v2.0 (mới nhất)
│   └── SmartRoomSearch-v1.0.apk             # Bản phát hành v1.0
├── Smart Room Search Website-FE/            # Website người thuê & Mã nguồn Android
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.tsx                      # Toàn bộ giao diện chính của Website
│   │   │   └── App.test.ts                  # Bộ kiểm thử giao diện & logic
│   │   └── components/
│   │       ├── RoomMap.tsx                  # Component bản đồ Leaflet OpenStreetMap
│   │       └── ...
│   ├── android/                             # Dự án App Android Native (Kotlin Compose)
│   │   └── app/src/main/java/com/smartroomsearch/app/
│   │       ├── ui/                          # Màn hình Compose (Home, Demands, Map, Detail, Admin)
│   │       ├── api/                         # RetrofitClient & API Service
│   │       ├── model/                       # Data models & ExternalRoomsData
│   │       └── repository/                  # Room Database & Repository
│   └── android_apk/                         # Thư mục chứa file APK cho web download
├── Smart Room Search Website-BE/            # Backend API (Express & Cloudflare Worker)
│   ├── src/
│   │   ├── server.js                        # Máy chủ Node.js Express (Local development)
│   │   ├── worker.js                        # Mã nguồn Cloudflare Worker (Production)
│   │   ├── controllers/                     # Xử lý logic API (room, tenant, demand, auth, ai, geocode)
│   │   ├── utils/roomParser.js              # Bộ phân tích văn bản tiếng Việt thông minh
│   │   └── config/                          # Cấu hình Database & TiDB Data Service
│   ├── sql/schema.sql                       # Cấu trúc bảng MySQL/TiDB
│   └── wrangler.jsonc                       # Cấu hình triển khai Cloudflare Workers
├── Admin/                                   # Admin Web quản trị độc lập (React + Vite)
└── README.md                                # Tài liệu hướng dẫn dự án
```

---

## 🛠️ Hướng dẫn cài đặt & Chạy thử nghiệm

### Yêu cầu môi trường:
- **Node.js**: $\ge$ 20 (khuyến nghị Node.js 22 LTS)
- **Java/JDK**: JDK 21 hoặc JBR (kèm theo Android Studio)
- **Android Studio**: Hỗ trợ Compose (Ladybug / Koala hoặc mới hơn)

---

### 1. Khởi chạy Website Người Thuê (Frontend)

```bash
cd "Smart Room Search Website-FE"
npm install
npm run dev
```
- Mở trình duyệt tại: `http://localhost:5173`
- Chạy kiểm thử tự động:
  ```bash
  npm test
  ```
- Đóng gói bản production:
  ```bash
  npm run build
  ```

---

### 2. Khởi chạy Backend (Local Express hoặc Cloudflare Worker)

```bash
cd "Smart Room Search Website-BE"
npm install
copy .env.example .env     # Điền thông tin kết nối database của bạn
npm run dev                # Chạy server tại http://localhost:4000
```

Kiểm tra healthcheck: `http://localhost:4000/health` $\rightarrow$ `{"status":"ok"}`

**Triển khai lên Cloudflare Workers:**
```bash
npx wrangler login
npx wrangler secret put JWT_SECRET
npx wrangler secret put TIDB_DATA_PUBLIC_KEY
npx wrangler secret put TIDB_DATA_PRIVATE_KEY
npx wrangler deploy
```

---

### 3. Biên dịch Ứng dụng Android (Kotlin Jetpack Compose)

Mở dự án tại thư mục `Smart Room Search Website-FE/android` bằng **Android Studio**, hoặc dùng lệnh Gradle:

```powershell
cd "Smart Room Search Website-FE/android"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr" # Thay đường dẫn JDK 21 của bạn
.\gradlew.bat assembleDebug
```
File APK sau khi build sẽ nằm tại:  
`Smart Room Search Website-FE/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📡 Danh sách API chính

| Method | Endpoint | Xác thực | Mô tả |
|---|---|---|---|
| `POST` | `/api/login` | Công khai | Đăng nhập tài khoản quản trị (trả về JWT token) |
| `GET` | `/api/rooms` | Công khai | Lấy danh sách phòng (kèm bộ lọc: city, district, price, area, status, search) |
| `GET` | `/api/rooms/:id` | Công khai | Lấy thông tin chi tiết một phòng trọ |
| `POST` | `/api/rooms/:id/view` | Công khai | Tăng lượt xem phòng |
| `POST` | `/api/rooms/:id/contact`| Công khai | Tăng lượt liên hệ Zalo/Phone của phòng |
| `POST` | `/api/rooms/parse` | Quản trị | **AI Data Entry**: Parse văn bản tự do thành phòng trọ |
| `POST` | `/api/rooms` | Quản trị | Thêm phòng mới |
| `PUT` | `/api/rooms/:id` | Quản trị | Sửa thông tin phòng |
| `DELETE`| `/api/rooms/:id` | Quản trị | Xóa phòng |
| `PUT` | `/api/rooms/:id/status`| Quản trị | Đổi trạng thái nhanh (`available`, `rented`, `maintenance`) |
| `GET` | `/api/rooms/stats` | Quản trị | Thống kê số liệu Dashboard |
| `GET` | `/api/demands` | Công khai | Lấy danh sách các nhu cầu thuê phòng |
| `POST` | `/api/demands` | Công khai | Đăng ký nhu cầu tìm phòng mới |
| `GET` | `/api/tenants` | Quản trị | Danh sách khách thuê hiện tại |
| `GET` | `/api/tenant-history` | Quản trị | Lịch sử khách đã từng thuê phòng |
| `POST` | `/api/ai/room-description` | Quản trị | AI sinh nội dung bài đăng giới thiệu phòng trọ |
| `GET` | `/api/geocode` | Quản trị | Geocoding chuyển đổi địa chỉ thành tọa độ GPS |
| `GET` | `/health` | Công khai | Health check trạng thái server |

---

## 🔒 Bản quyền & Liên hệ

Dự án được xây dựng và duy trì bởi:
- **Tác giả**: Ưng Đỗ Thế Vinh
- **GitHub**: [@vinh0407](https://github.com/vinh0407)
- **Repository**: [vinh0407/Smart-Room-Search](https://github.com/vinh0407/Smart-Room-Search)
- **Zalo / Hotline**: 0337244067
- **Bản quyền**: © 2025 - 2026 Smart Room Search — Trọ Xịn. Mọi quyền được bảo lưu.
