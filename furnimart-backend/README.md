# FurniMart Backend

NestJS service powering the multi-role FurniMart experience (customers, staff, managers, shippers, admins). It exposes REST endpoints for authentication, catalog browsing, cart, checkout, and reviews.

## Prerequisites
- Node.js 20+
- npm 9+
- MongoDB 6+ (local or remote)

## Quick start (local)
1. Copy the example environment and adjust if needed:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the API with live reload:
   ```bash
   npm run start:dev
   ```
4. The API listens on `http://localhost:${PORT:-5000}` with a `/api` prefix (e.g. `GET /api/products`).

### Seed sample data
Populate MongoDB with demo users, products, orders, and reviews. The script wipes the related collections before inserting:

```bash
npm run seed
```

## Docker compose (full stack)
A root-level `docker-compose.yml` wires MongoDB, this API, and the Next.js frontend together for local development or VS Code Dev Containers:

```bash
docker compose up --build
```

Environment variables can be adjusted by creating a `.env` next to the compose file or editing the defaults in `.env.example`.

## Production build
```bash
npm run build
npm run start:prod
```

## Docker compose
A compose file is provided for MongoDB + API:
```bash
docker compose up --build
```
The API will be available at `http://localhost:5000/api` and MongoDB at `mongodb://localhost:27017`.

## Key endpoints
- `POST /api/auth/register` and `POST /api/auth/login`
- `GET /api/products`, `POST /api/products` (staff/admin)
- `GET /api/categories`, `POST /api/categories` (staff/manager/admin)
- `GET /api/cart`, `POST/PUT/DELETE /api/cart/:productId`
- `POST /api/orders` and `GET /api/orders/me`
- `GET /api/reviews/:productId` and `POST /api/reviews/:productId`
- `GET /api/users/me`

All protected routes expect an `Authorization: Bearer <token>` header obtained from the auth endpoints.
