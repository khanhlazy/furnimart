# 🛋️ FurniMart - Nền tảng thương mại điện tử nội thất

FurniMart là hệ thống quản lý bán hàng nội thất đa vai trò, xây dựng với Next.js, NestJS và MongoDB.

## 🚀 Bắt đầu nhanh với Docker

### Yêu cầu
- Docker & Docker Compose

### Chạy toàn bộ hệ thống

```bash
# Clone hoặc tải project
cd furnimart

# Copy file env
cp .env.example .env

# Khởi động tất cả service
docker-compose up -d

# Xem logs
docker-compose logs -f
```

### Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs
- **MongoDB**: mongodb://admin:admin123@localhost:27017/furnimart

---

## 🛠️ Chạy trên Local (không dùng Docker)

### Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Khởi động MongoDB (nếu chưa có)
# Trên Windows: download từ mongodb.com

# Tạo file .env
cp .env.example .env

# Chạy development
npm run dev

# Server chạy tại http://localhost:3001
```

### Frontend

```bash
cd frontend

# Cài đặt dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local

# Chạy development
npm run dev

# App chạy tại http://localhost:3000
```

---

## 📚 Tài liệu API

Swagger docs: http://localhost:3001/api/docs

### Các endpoint chính

**Auth**
- POST `/auth/register` - Đăng ký
- POST `/auth/login` - Đăng nhập
- POST `/auth/me` - Lấy thông tin user hiện tại

**Products**
- GET `/products` - Danh sách sản phẩm
- GET `/products/:id` - Chi tiết sản phẩm
- POST `/products` - Tạo sản phẩm (Admin/Employee)
- PUT `/products/:id` - Cập nhật sản phẩm
- DELETE `/products/:id` - Xóa sản phẩm

**Orders**
- POST `/orders` - Tạo đơn hàng
- GET `/orders/my-orders` - Đơn hàng của tôi
- GET `/orders` - Tất cả đơn hàng (Admin/Manager)
- GET `/orders/:id` - Chi tiết đơn hàng
- PUT `/orders/:id/status` - Cập nhật trạng thái

**Shipping**
- GET `/shipping/order/:orderId` - Thông tin vận chuyển
- GET `/shipping/my-deliveries` - Danh sách giao hàng (Shipper)
- PUT `/shipping/order/:orderId/update` - Cập nhật vận chuyển

**Reviews**
- POST `/reviews` - Tạo đánh giá
- GET `/reviews/product/:productId` - Đánh giá của sản phẩm
- GET `/reviews/my-reviews` - Đánh giá của tôi

**Dashboard**
- GET `/dashboard/stats` - Thống kê chung
- GET `/dashboard/orders-stats` - Thống kê đơn hàng
- GET `/dashboard/top-products` - Top sản phẩm
- GET `/dashboard/orders-by-status` - Đơn hàng theo trạng thái

---

## 👥 Phân vai trò người dùng

1. **customer** - Khách hàng (mua hàng, đánh giá)
2. **employee** - Nhân viên cửa hàng (quản lý đơn, sản phẩm)
3. **manager** - Quản lý chi nhánh (kho hàng, báo cáo)
4. **shipper** - Nhân viên giao hàng (cập nhật vận chuyển)
5. **admin** - Quản trị viên (toàn quyền)

---

## 🏗️ Cấu trúc dự án
