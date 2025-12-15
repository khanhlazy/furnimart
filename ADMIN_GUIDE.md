# 🔐 Hướng dẫn truy cập Admin và MongoDB

## 1. Truy cập trang Admin

### Bước 1: Đăng nhập với tài khoản Admin

1. Mở trình duyệt và truy cập: **http://localhost:3000**
2. Click vào **"Đăng nhập"** hoặc truy cập trực tiếp: **http://localhost:3000/auth/login**
3. Đăng nhập với thông tin sau:

```
Email: admin@furnimart.com
Password: password123
```

4. Sau khi đăng nhập thành công, bạn sẽ được chuyển về trang chủ
5. Truy cập trang Admin Dashboard: **http://localhost:3000/admin/dashboard**

### Các trang Admin có sẵn:

- **Dashboard**: http://localhost:3000/admin/dashboard
- **Quản lý Users**: http://localhost:3000/admin/users
- **Quản lý Categories**: http://localhost:3000/admin/categories

### Lưu ý:
- Nếu chưa có tài khoản admin, chạy lệnh seed để tạo dữ liệu mẫu:
  ```bash
  cd backend
  npm run seed
  ```

---

## 2. Truy cập MongoDB để sửa Database

### Cách 1: Sử dụng MongoDB Compass (GUI - Khuyên dùng)

1. **Tải MongoDB Compass**: https://www.mongodb.com/try/download/compass
2. **Kết nối với database**:

#### Nếu dùng Docker:
```
mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin
```

#### Nếu dùng MongoDB local (không Docker):
```
mongodb://localhost:27017/furnimart
```

3. **Sau khi kết nối**, bạn có thể:
   - Xem tất cả collections (users, products, orders, ...)
   - Sửa, xóa, thêm documents
   - Chạy queries
   - Xem indexes

---

### Cách 2: Sử dụng MongoDB Shell (mongosh)

#### Nếu dùng Docker:
```bash
# Kết nối vào container MongoDB
docker exec -it furnimart-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Chọn database
use furnimart

# Xem các collections
show collections

# Xem tất cả users
db.users.find().pretty()

# Tìm user admin
db.users.findOne({ email: "admin@furnimart.com" })

# Sửa password của user (ví dụ)
db.users.updateOne(
  { email: "admin@furnimart.com" },
  { $set: { password: "$2b$10$newHashedPassword..." } }
)

# Xem tất cả products
db.products.find().pretty()

# Xem tất cả orders
db.orders.find().pretty()
```

#### Nếu dùng MongoDB local:
```bash
# Kết nối trực tiếp
mongosh mongodb://localhost:27017/furnimart

# Hoặc
mongosh
use furnimart
```

---

### Cách 3: Sử dụng VS Code Extension

1. Cài extension **"MongoDB for VS Code"**
2. Thêm connection string:
   - Docker: `mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin`
   - Local: `mongodb://localhost:27017/furnimart`
3. Browse và edit documents trực tiếp trong VS Code

---

### Cách 4: Sử dụng Studio 3T (MongoDB GUI khác)

1. Tải Studio 3T: https://studio3t.com/download/
2. Tạo connection mới với thông tin tương tự như MongoDB Compass

---

## 3. Các thao tác thường dùng trong MongoDB

### Xem tất cả users:
```javascript
db.users.find().pretty()
```

### Tìm user theo email:
```javascript
db.users.findOne({ email: "admin@furnimart.com" })
```

### Sửa thông tin user:
```javascript
db.users.updateOne(
  { email: "admin@furnimart.com" },
  { 
    $set: { 
      name: "Tên mới",
      phone: "0123456789"
    } 
  }
)
```

### Xóa user:
```javascript
db.users.deleteOne({ email: "user@example.com" })
```

### Tạo user mới:
```javascript
db.users.insertOne({
  email: "newuser@furnimart.com",
  password: "$2b$10$hashedPassword...", // Cần hash password trước
  name: "Tên người dùng",
  role: "customer",
  phone: "0123456789",
  isActive: true
})
```

### Xem tất cả products:
```javascript
db.products.find().pretty()
```

### Sửa giá sản phẩm:
```javascript
db.products.updateOne(
  { _id: ObjectId("product_id_here") },
  { $set: { price: 500000 } }
)
```

### Xem tất cả orders:
```javascript
db.orders.find().pretty()
```

### Sửa trạng thái đơn hàng:
```javascript
db.orders.updateOne(
  { _id: ObjectId("order_id_here") },
  { $set: { status: "delivered" } }
)
```

---

## 4. Thông tin kết nối Database

### Docker Setup:
- **Host**: localhost
- **Port**: 27017
- **Database**: furnimart
- **Username**: admin
- **Password**: admin123
- **Auth Source**: admin
- **Connection String**: `mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin`

### Local Setup (không Docker):
- **Host**: localhost
- **Port**: 27017
- **Database**: furnimart
- **Connection String**: `mongodb://localhost:27017/furnimart`

---

## 5. Các Collections chính trong Database

- **users** - Người dùng (admin, customer, employee, manager, shipper)
- **products** - Sản phẩm
- **categories** - Danh mục sản phẩm
- **orders** - Đơn hàng
- **shippings** - Thông tin vận chuyển
- **reviews** - Đánh giá sản phẩm
- **chats** - Chat hỗ trợ
- **messages** - Tin nhắn chat
- **warehouses** - Kho hàng
- **warehouse_transactions** - Giao dịch kho
- **disputes** - Tranh chấp

---

## 6. Lưu ý quan trọng

⚠️ **Cảnh báo**: 
- Khi sửa database trực tiếp, hãy cẩn thận với:
  - Password phải được hash bằng bcrypt (không lưu plain text)
  - ObjectId phải đúng format
  - Schema phải đúng với Mongoose models
- Nên backup database trước khi sửa:
  ```bash
  # Export database
  mongodump --uri="mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin" --out=./backup
  
  # Import database
  mongorestore --uri="mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin" ./backup/furnimart
  ```

---

## 7. Troubleshooting

### Không kết nối được MongoDB:
```bash
# Kiểm tra MongoDB có đang chạy không
docker ps  # Nếu dùng Docker
# hoặc
mongosh mongodb://localhost:27017  # Nếu dùng local
```

### Quên password admin:
1. Kết nối MongoDB
2. Tìm user admin: `db.users.findOne({ email: "admin@furnimart.com" })`
3. Reset password (cần hash mới) hoặc chạy lại seed: `npm run seed`

### Database bị lỗi:
```bash
# Xóa và tạo lại database
docker exec -it furnimart-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
use furnimart
db.dropDatabase()

# Sau đó chạy lại seed
cd backend
npm run seed
```

---

## 8. Tài khoản mẫu sau khi seed

Sau khi chạy `npm run seed`, các tài khoản sau sẽ được tạo:

- **Admin**: admin@furnimart.com / password123
- **Manager**: manager@furnimart.com / password123
- **Employee**: employee1@furnimart.com / password123
- **Shipper**: shipper1@furnimart.com / password123
- **Customer**: customer1@furnimart.com / password123

