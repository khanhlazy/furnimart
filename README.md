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
- ⚙️ System configuration
- 📈 System-wide reports
- ⚖️ Dispute resolution

## 🚀 Quick Start

### Prerequisites

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 18.x (for local development)
- **MongoDB** >= 5.0 (for local development)

### 🐳 Docker Setup (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd furnimart

# Build and start all services
docker compose up -d --build

# Wait for services to be ready (about 30-40 seconds)
# Then seed database manually
docker exec furnimart-backend npm run seed

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Swagger Docs: http://localhost:3001/api/docs
- MongoDB: mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin

**Note:** After running `docker compose up -d --build`, wait for services to be healthy, then run the seed command.

### 💻 Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Server runs at http://localhost:3001
```

**Backend .env Configuration:**
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# App runs at http://localhost:3000
```

**Frontend .env.local Configuration:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🛠️ Development with VSCode

### Prerequisites

Install recommended VSCode extensions:
- ESLint
- Prettier
- Docker
- TypeScript

### Tasks

Use VSCode tasks (Ctrl+Shift+P → "Tasks: Run Task"):
- `docker: up` - Build and start Docker services
- `docker: down` - Stop Docker services
- `docker: build` - Build Docker images
- `docker: logs` - View logs
- `docker: seed` - Seed database
- `docker: exec backend` - Open backend shell

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
│   │   │   ├── shipping/    # Shipping
│   │   │   ├── reviews/     # Reviews
│   │   │   ├── chat/        # Chat support
│   │   │   ├── warehouse/   # Warehouse
│   │   │   ├── disputes/    # Disputes
│   │   │   └── dashboard/   # Dashboard & Stats
│   │   ├── common/          # Shared modules
│   │   │   ├── base/        # Base classes
│   │   │   ├── decorators/  # Custom decorators
│   │   │   ├── guards/      # Auth guards
│   │   │   └── interceptors/# Interceptors
│   │   └── main.ts          # Entry point
│   ├── Dockerfile           # Production Dockerfile
│   ├── Dockerfile.dev       # Development Dockerfile
│   └── package.json
│
├── frontend/                # Next.js Frontend
│   ├── app/                 # App router (Next.js 14)
│   │   ├── admin/           # Admin routes
│   │   ├── employee/        # Employee routes
│   │   ├── manager/         # Manager routes
│   │   ├── shipper/         # Shipper routes
│   │   └── ...             # Customer routes
│   ├── components/          # React components
│   ├── services/            # API services
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   ├── Dockerfile           # Production Dockerfile
│   ├── Dockerfile.dev       # Development Dockerfile
│   └── package.json
│
├── .vscode/                 # VSCode configuration
│   ├── launch.json          # Debug configurations
│   ├── tasks.json           # Task definitions
│   └── settings.json        # Workspace settings
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md
```

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
- `PUT /api/orders/:id/assign-shipper` - Assign shipper

## 👥 User Roles

1. **customer** - Customer: Shopping, reviews, chat support
2. **employee** - Store employee: Order management, products, chat
3. **manager** - Branch manager: Warehouse, assignment, reports
4. **shipper** - Delivery staff: Delivery status updates
5. **admin** - System administrator: Full system access

## 🔐 Default Test Accounts

After running seed:

- **Admin**: admin@furnimart.com / password123
- **Manager**: manager@furnimart.com / password123
- **Employee**: employee1@furnimart.com / password123
- **Shipper**: shipper1@furnimart.com / password123
- **Customer**: customer1@furnimart.com / password123

## 🛠️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Passport JWT** - Authentication
- **Swagger** - API documentation
- **Class Validator** - Validation

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

## 📝 Scripts

### Backend
```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm run test         # Run tests
npm run seed         # Seed database
```

### Frontend
```bash
npm run dev          # Development mode
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
```

### Docker Commands
```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down

# Restart services
docker compose restart

# Seed database
docker exec furnimart-backend npm run seed

# Access backend shell
docker exec -it furnimart-backend sh

# Access MongoDB shell
docker exec -it furnimart-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

## 🔒 Security

- JWT Authentication
- Role-based Access Control (RBAC)
- Password hashing with bcrypt
- CORS protection
- Input validation
- SQL Injection protection (MongoDB)

## 📄 License

MIT License

## 👨‍💻 Authors

FurniMart Development Team

---

**Note:** This is a demo/educational project. For production use, additional security measures and optimizations are required.
