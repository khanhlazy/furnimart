# 🚀 Hướng dẫn Setup FurniMart

## 1. Khởi động với Docker (Khuyến nghị)

```bash
cd furnimart

# Khởi động tất cả service
docker-compose up -d

# Chạy seed data
docker exec furnimart-backend npm run seed

# Xem logs
docker-compose logs -f backend
```

---

## 2. Chạy Local (Không dùng Docker)

### Backend Setup

```bash
cd backend

# Cài dependencies
npm install

# Tạo .env
cat > .env << EOF
PORT=3001
MONGODB_URI=mongodb://localhost:27017/furnimart
JWT_SECRET=furnimart-secret-key-2024
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF

# Chạy development server
npm run dev

# Terminal khác - Chạy seed data
npm run seed
```

### Frontend Setup

```bash
cd frontend

# Cài dependencies
npm install

# Tạo .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF

# Chạy development
npm run dev
```

---

## 3. Chạy Tests

```bash
cd backend

# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

---

## 📝 Dữ liệu mẫu sau Seed

### Tài khoản Admin
