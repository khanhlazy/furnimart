# FurniMart Monorepo

This workspace contains the NestJS API (`furnimart-backend`) and Next.js UI (`furnimart-frontend`) that power FurniMart. Use Docker Compose for a synchronized, VS Code–friendly setup.

## Stack overview
- **Backend**: NestJS + MongoDB (via Mongoose)
- **Frontend**: Next.js 13 with TypeScript
- **Database**: MongoDB running in Docker (no external SQL Server dependency required)

## Run everything with Docker
1. (Optional) Copy env templates:
   ```bash
   cp furnimart-backend/.env.example furnimart-backend/.env
   cp furnimart-frontend/.env.local.example furnimart-frontend/.env.local
   ```
2. Start the stack:
   ```bash
   docker compose up --build
   ```
   - API: http://localhost:${BACKEND_PORT:-5000}/api
   - Frontend: http://localhost:${FRONTEND_PORT:-3000}
   - MongoDB: mongodb://localhost:27017

The compose file mounts the source directories, so code changes picked up in VS Code hot-reload in the running containers.

## Running locally without Docker
- **Backend**: follow `furnimart-backend/README.md` (copy `.env.example`, `npm install`, `npm run start:dev`).
- **Frontend**: follow `furnimart-frontend/README.md` (copy `.env.local.example`, `npm install`, `npm run dev`).
