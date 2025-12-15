# FurniMart Backend (NestJS)

API dịch vụ cho nền tảng FurniMart, hỗ trợ đăng nhập JWT, quản lý sản phẩm/đơn hàng/giỏ hàng/đánh giá và phục vụ tệp tĩnh `uploads` cho ảnh sản phẩm.

## Yêu cầu
- Node.js 20+
- MongoDB đang chạy (mặc định `mongodb://localhost:27017/furnimart`)

## Thiết lập nhanh
```bash
npm install
cp .env.example .env
npm run start:dev
```

API sẽ chạy ở `http://localhost:5000/api` với CORS bật sẵn cho frontend.

## Docker Compose
Có thể khởi chạy MongoDB và API bằng Docker:
```bash
docker compose up --build
```
Compose tạo 2 service `mongo` và `api` (node 20), mount mã nguồn để thuận tiện phát triển.

## Lưu ý
- Ảnh tải lên được lưu tại thư mục `uploads/` (đã được phục vụ tĩnh ở `/uploads`).
- Tất cả DTO dùng `class-validator` để kiểm tra dữ liệu đầu vào, bật `ValidationPipe` ở mức global.
- Endpoint health: `GET /api/health` trả `{ ok: true, version }`.
