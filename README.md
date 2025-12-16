# 🛋️ FurniMart - E-Commerce Platform for Furniture

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

FurniMart is a full-stack e-commerce platform for furniture sales, built with modern technologies and best practices. The system supports multiple user roles (Admin, Manager, Employee, Shipper, Customer) with comprehensive features from shopping to order management, warehouse, chat support, and dispute resolution.

## ✨ Features

### 👤 Customer
- 🏠 Homepage with featured products
- 📦 Product browsing with advanced filters
- 👁️ Product details with 3D Viewer (Three.js)
- 🛒 Shopping cart management
- 💳 Order checkout and payment
- 📋 Order history and tracking
- ⭐ Product reviews
- 💬 Live chat support
- 👤 Personal profile management

### 👔 Employee
- 📊 Dashboard overview
- 📦 Order management (confirm, update status)
- 🛋️ Product management (CRUD)
- 💬 Customer chat support

### 👨‍💼 Manager
- 📊 Revenue and performance dashboard
- 📦 Warehouse management
- 🚚 Order assignment to shippers
- 📈 Detailed reports

### 🚚 Shipper
- 📋 Assigned orders list
- ✅ Delivery status updates
- 📸 Delivery proof upload
- ✍️ Customer signature collection

### 👑 Admin
- 📊 System-wide dashboard
- 👥 User and role management
- 📁 Category management
- ⚙️ System configuration (Newsletter, Footer, Header customization)
- 📈 System-wide reports
- ⚖️ Dispute resolution

## 🚀 Quick Start

### Prerequisites

- **Docker** >= 20.10 (optional, for Docker setup)
- **Node.js** >= 18.x
- **MongoDB** >= 5.0 (or use Docker)
- **npm** or **yarn**

---

## 🛠️ Chạy từng service riêng lẻ (Manual Setup)

### Terminal 1: Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3001`

**Backend .env Configuration:**
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,exp://localhost:8081,http://10.0.2.2:8081
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

**Frontend .env.local Configuration:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Terminal 3: Mobile (React Native + Expo)

**Lưu ý:** Project sử dụng Expo SDK 54. Đảm bảo Expo Go trên điện thoại cũng là SDK 54.

```bash
cd mobile
npm install
npx expo install --fix  # Tự động sửa dependencies về đúng version
npx expo start --clear
# Hoặc
npm run start:clear
```

**Nếu gặp lỗi "Project is incompatible":**
- Xem file `mobile/UPGRADE_SDK54.md` để nâng cấp
- Hoặc chạy: `npx expo install --fix` để tự động sửa

**Cách chạy trên điện thoại thật:**

#### Bước 1: Tìm IP máy tính của bạn

**Windows:**
```bash
ipconfig
# Tìm "IPv4 Address" (ví dụ: 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# Hoặc
ip addr
# Tìm IP của WiFi adapter (ví dụ: 192.168.1.100)
```

**Hoặc dùng script:**
```bash
cd mobile
npm run find-ip
```

#### Bước 2: Cập nhật IP trong code

Mở file `mobile/src/config/api.ts` và thay đổi:
```typescript
const YOUR_COMPUTER_IP = '192.168.1.100'; // ⚠️ THAY BẰNG IP CỦA BẠN
```

#### Bước 3: Đảm bảo Backend đang chạy

Backend phải đang chạy và accessible từ network:
```bash
cd backend
npm run start:dev
```

#### Bước 4: Chạy Expo

```bash
cd mobile
npx expo start
```

#### Bước 5: Kết nối điện thoại

**Cách 1: Expo Go (Khuyến nghị)**
1. Tải app **Expo Go** từ App Store (iOS) hoặc Play Store (Android)
2. Đảm bảo điện thoại và máy tính **cùng WiFi network**
3. Quét QR code hiển thị trong terminal
4. App sẽ tự động load trên điện thoại

**Cách 2: Tunnel (nếu khác WiFi)**
```bash
npx expo start --tunnel
```
Sau đó quét QR code (chậm hơn nhưng hoạt động từ xa)

**Cách 3: Development Build**
```bash
# Android
npm run android

# iOS (chỉ macOS)
npm run ios
```

**Mobile API Configuration:**
- Android Emulator: `http://10.0.2.2:3001/api`
- iOS Simulator: `http://localhost:3001/api`
- Thiết bị thật: `http://YOUR_COMPUTER_IP:3001/api` (phải cùng WiFi)

---

## 🐳 Docker Setup (Optional)

### Chạy tất cả services (Backend + Frontend + MongoDB)

```bash
docker compose up -d --build
```

### Xem logs

```bash
# Xem logs tất cả
docker compose logs -f

# Xem logs từng service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Dừng tất cả

```bash
docker compose down
```

### Xóa TẤT CẢ và chạy lại từ đầu (Clean All)

```bash
# Dừng và xóa volumes
docker compose down -v

# Xóa tất cả containers
docker container prune -f

# Xóa tất cả images
docker image prune -a -f

# Xóa tất cả volumes
docker volume prune -f

# Xóa tất cả networks
docker network prune -f

# Sau đó chạy lại:
docker compose up -d --build
```

### Restart một service cụ thể

```bash
docker compose restart backend
docker compose restart frontend
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs
- MongoDB: mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin

---

## 📦 Setup ban đầu (chỉ cần chạy 1 lần)

### 1. Cài đặt dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Mobile
cd ../mobile
npm install
```

### 2. Setup MongoDB

#### Nếu dùng Docker:
```bash
docker compose up -d mongodb
```

#### Nếu dùng MongoDB local:
- Cài đặt MongoDB local hoặc dùng MongoDB Atlas
- Cập nhật connection string trong `backend/.env`

### 3. Seed database (tạo dữ liệu mẫu)

```bash
cd backend
npm run seed
```

---

## 🔧 Các lệnh hữu ích

### Backend

```bash
cd backend
npm run build          # Build production
npm run start:prod     # Chạy production
npm run seed           # Seed database
npm run lint           # Kiểm tra code
```

### Frontend

```bash
cd frontend
npm run build          # Build production
npm run start          # Chạy production
npm run lint           # Kiểm tra code
```

### Mobile

```bash
cd mobile
npx expo start          # Chạy development
npx expo start --clear  # Chạy với clear cache
npx expo start --android # Chạy trực tiếp Android
npx expo start --ios    # Chạy trực tiếp iOS
```

---

## 🧹 Clean Cache & Rebuild

### Clean Mobile App (Expo)

```bash
cd mobile
rm -rf node_modules .expo .expo-shared
npm cache clean --force
npm install
npx expo start --clear
```

### Clean Frontend (Next.js)

```bash
cd frontend
rm -rf node_modules .next
npm cache clean --force
npm install
npm run dev
```

### Clean Backend (NestJS)

```bash
cd backend
rm -rf node_modules dist
npm cache clean --force
npm install
npm run start:dev
```

---

## 📱 Mobile App

### Tính năng

- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý tài khoản và địa chỉ
- ✅ Duyệt, tìm kiếm và lọc sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm vào giỏ hàng và đặt hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Toast notifications
- ✅ Modern UI với icons và animations

### Công nghệ

- **React Native** với Expo
- **TypeScript**
- **React Navigation** - Điều hướng
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **@expo/vector-icons** - Icons
- **react-native-toast-message** - Notifications

### Cấu trúc thư mục

```
mobile/
├── src/
│   ├── config/          # Cấu hình (API, constants)
│   ├── context/          # React Context
│   ├── navigation/      # Navigation setup
│   ├── screens/          # Các màn hình
│   │   ├── auth/         # Login, Register
│   │   ├── home/         # Home screen
│   │   ├── products/     # Products list, Product detail
│   │   ├── cart/         # Cart screen
│   │   ├── checkout/     # Checkout screen
│   │   ├── account/      # Account, Address management
│   │   └── orders/       # Orders list, Order detail
│   ├── services/         # API services
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   ├── theme/            # Design system (colors, spacing, typography)
│   ├── components/       # Reusable components (Card, Button, Toast)
│   └── hooks/            # Custom hooks (useToast)
├── App.tsx               # Root component
├── app.json              # Expo config
└── package.json
```

### Kết nối với Backend

Mobile app sử dụng cùng backend API với web frontend:

- **Base URL**: 
  - Android Emulator: `http://10.0.2.2:3001/api`
  - iOS Simulator: `http://localhost:3001/api`
  - Thiết bị thật: `http://YOUR_IP:3001/api`
- **Authentication**: JWT Bearer token
- **Response Format**: Backend wrap response trong `{ success, statusCode, message, data }`

### API Endpoints sử dụng

- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/me` - Lấy thông tin user hiện tại
- `GET /products` - Lấy danh sách sản phẩm
- `GET /products/:id` - Lấy chi tiết sản phẩm
- `GET /categories` - Lấy danh sách danh mục
- `POST /orders` - Tạo đơn hàng
- `GET /orders/my-orders` - Lấy đơn hàng của tôi
- `GET /orders/:id` - Lấy chi tiết đơn hàng
- `GET /users/profile` - Lấy profile
- `PUT /users/:id` - Cập nhật profile

---

## 🔐 Admin & MongoDB Access

### Truy cập trang Admin

1. Mở trình duyệt: **http://localhost:3000**
2. Đăng nhập với:
   - Email: `admin@furnimart.com`
   - Password: `password123`
3. Truy cập: **http://localhost:3000/admin/dashboard**

### Truy cập MongoDB

#### MongoDB Compass (GUI - Khuyên dùng)

Connection String:
```
mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin
```

#### MongoDB Shell

```bash
# Nếu dùng Docker
docker exec -it furnimart-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Chọn database
use furnimart

# Xem collections
show collections

# Xem users
db.users.find().pretty()
```

#### VS Code Extension

1. Cài extension **"MongoDB for VS Code"**
2. Connection string: `mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin`

### Các Collections chính

- **users** - Người dùng
- **products** - Sản phẩm
- **categories** - Danh mục
- **orders** - Đơn hàng
- **reviews** - Đánh giá
- **chats** - Chat hỗ trợ
- **settings** - Cấu hình hệ thống

---

## 🔌 API Documentation

Swagger UI: http://localhost:3001/api/docs

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login
- `POST /api/auth/me` - Get current user

#### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin/Employee)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get my orders
- `GET /api/orders` - Get all orders (Admin/Manager/Employee)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

#### Settings
- `GET /api/settings/theme` - Get theme settings
- `PUT /api/settings/theme` - Update theme settings (Admin)

#### Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

---

## 👥 User Roles

1. **customer** - Customer: Shopping, reviews, chat support
2. **employee** - Store employee: Order management, products, chat
3. **manager** - Branch manager: Warehouse, assignment, reports
4. **shipper** - Delivery staff: Delivery status updates
5. **admin** - System administrator: Full system access

---

## 🔐 Default Test Accounts

Sau khi chạy seed:

- **Admin**: admin@furnimart.com / password123
- **Manager**: manager@furnimart.com / password123
- **Employee**: employee1@furnimart.com / password123
- **Shipper**: shipper1@furnimart.com / password123
- **Customer**: customer1@furnimart.com / password123

---

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport JWT** - Authentication
- **Swagger** - API documentation
- **Class Validator** - Validation
- **Multer** - File uploads

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Hook Form** - Form handling
- **Axios** - HTTP client

### Mobile
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **@expo/vector-icons** - Icons
- **react-native-toast-message** - Notifications

---

## 📁 Project Structure

```
furnimart/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/         # Feature modules
│   │   │   ├── auth/        # Authentication
│   │   │   ├── users/       # User management
│   │   │   ├── products/    # Products
│   │   │   ├── categories/  # Categories
│   │   │   ├── orders/      # Orders
│   │   │   ├── reviews/     # Reviews
│   │   │   ├── settings/    # Settings (Theme customization)
│   │   │   ├── upload/     # File uploads
│   │   │   └── ...
│   │   ├── common/          # Shared modules
│   │   └── main.ts          # Entry point
│   └── package.json
│
├── frontend/                # Next.js Frontend
│   ├── app/                 # App router (Next.js 14)
│   │   ├── admin/           # Admin routes
│   │   ├── employee/         # Employee routes
│   │   ├── manager/          # Manager routes
│   │   ├── shipper/         # Shipper routes
│   │   └── ...             # Customer routes
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   └── package.json
│
├── mobile/                  # React Native Mobile App
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   ├── theme/           # Design system
│   │   └── components/      # Reusable components
│   └── package.json
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md
```

---

## 🔍 Troubleshooting

### Port đã được sử dụng

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3000
lsof -i :3001
```

### Clear cache

```bash
# Backend
cd backend
rm -rf node_modules dist
npm install

# Frontend
cd frontend
rm -rf node_modules .next
npm install

# Mobile
cd mobile
rm -rf node_modules .expo
npm install
```

### Reset MongoDB

```bash
# Nếu dùng Docker
docker compose down -v
docker compose up -d mongodb
cd backend
npm run seed
```

### Mobile - Lỗi kết nối API

**Trên thiết bị thật:**
1. Kiểm tra API URL trong `mobile/src/config/api.ts` - phải là IP máy tính, KHÔNG phải localhost
2. Đảm bảo backend đang chạy và accessible từ network
3. Đảm bảo điện thoại và máy tính **cùng WiFi network**
4. Kiểm tra firewall không chặn port 3001
5. Test backend từ điện thoại: mở browser trên điện thoại, truy cập `http://YOUR_IP:3001/api/docs`

**Trên emulator:**
- Android Emulator: dùng `http://10.0.2.2:3001/api`
- iOS Simulator: dùng `http://localhost:3001/api`

**Lỗi "Failed to download remote update" (Expo Error):**
1. Clear cache: `npx expo start --clear` hoặc `npm run start:clear`
2. Thử LAN mode: `npx expo start --lan` hoặc `npm run start:lan`
3. Trên điện thoại: Nhấn "Reload" trong Expo Go hoặc shake → Reload
4. Kiểm tra firewall không chặn port 8081, 19000, 19001
5. Thử tunnel mode: `npx expo start --tunnel` hoặc `npm run start:tunnel`

**Lỗi "Network request failed":**
- Kiểm tra IP đã đúng chưa (dùng `npm run find-ip` trong mobile folder)
- Kiểm tra backend có đang chạy không
- Kiểm tra CORS settings trên backend
- Thử dùng tunnel: `npx expo start --tunnel`

---

## 📝 Environment Variables

### Backend (.env)

```env
PORT=3001
MONGODB_URI=mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,exp://localhost:8081,http://10.0.2.2:8081
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Mobile

Cấu hình trong `mobile/src/config/api.ts`:
- Android Emulator: `http://10.0.2.2:3001/api`
- iOS Simulator: `http://localhost:3001/api`
- Thiết bị thật: `http://YOUR_IP:3001/api`

---

## ✅ Checklist chạy project

- [ ] Cài đặt Node.js (v18+)
- [ ] Cài đặt MongoDB (hoặc dùng Docker)
- [ ] Clone repository
- [ ] Cài đặt dependencies cho backend, frontend, mobile
- [ ] Setup environment variables
- [ ] Chạy MongoDB
- [ ] Seed database
- [ ] Chạy backend
- [ ] Chạy frontend
- [ ] (Tùy chọn) Chạy mobile

---

## 🔒 Security

- JWT Authentication
- Role-based Access Control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL Injection protection (MongoDB)

---

## 📄 License

MIT License

---

## 👨‍💻 Authors

FurniMart Development Team

---

**Note:** This is a demo/educational project. For production use, additional security measures and optimizations are required.
