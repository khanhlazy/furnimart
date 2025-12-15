# 🚀 Quick Start Guide

## Windows

```batch
# Run installation
INSTALL.bat

# Then in separate terminals:

# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Seed Data (after backend running)
cd backend && npm run seed
```

## macOS / Linux

```bash
# Run installation
chmod +x INSTALL.sh
./INSTALL.sh

# Then in separate terminals:

# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Seed Data (after backend running)
cd backend && npm run seed
```

## Docker (All Platforms)

```bash
# Start all services
docker-compose up -d

# Seed data
docker exec furnimart-backend npm run seed

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📍 Access Points

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:3000 | React App |
| Backend | http://localhost:3001 | NestJS Server |
| API Docs | http://localhost:3001/api/docs | Swagger |
| MongoDB | mongodb://localhost:27017 | Database |

## 🔐 Test Credentials

**Admin Account**
- Email: `admin@furnimart.com`
- Password: `password123`

**Customer Account**
- Email: `customer1@furnimart.com`
- Password: `password123`

**Employee Account**
- Email: `employee1@furnimart.com`
- Password: `password123`

**Shipper Account**
- Email: `shipper1@furnimart.com`
- Password: `password123`

## 🛠 Troubleshooting

### Port Already in Use
```bash
# Change port in backend .env
PORT=3002

# Change port in frontend package.json
npm run dev -- -p 3001
```

### MongoDB Connection Error
```bash
# Start MongoDB locally
mongod

# Or use Docker
docker run -d -p 27017:27017 mongo:7.0
```

### Clear All Data
```bash
# Docker
docker-compose down -v

# Local MongoDB
mongo furnimart --eval "db.dropDatabase()"
```

## 📚 Next Steps

1. ✅ Setup completed
2. ✅ Dependencies installed
3. ⏭️ Run servers
4. ⏭️ Seed data
5. ⏭️ Login & explore
6. ⏭️ Check API docs

Happy coding! 🎉
