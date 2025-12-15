# FurniMart Monorepo

Hai ứng dụng mẫu:
- **furnimart-backend**: API NestJS (JWT, Mongoose) với module sản phẩm, đơn hàng, giỏ hàng, đánh giá, danh mục và người dùng.
- **furnimart-frontend**: Prototype giao diện Next.js thể hiện hành trình mua sắm và dashboard đa vai trò.

## Chạy nhanh
```bash
# Backend
cd furnimart-backend
npm install
cp .env.example .env
npm run start:dev

# Frontend
cd ../furnimart-frontend
npm install
npm run dev
```

Docker Compose cho backend: `cd furnimart-backend && docker compose up --build`.

Uploads tĩnh của backend nằm ở thư mục `furnimart-backend/uploads` và được phục vụ dưới đường dẫn `/uploads`.
