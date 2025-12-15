# FurniMart Frontend

Next.js 13 static prototype for the FurniMart multi-role experience. It illustrates customer shopping, cart/checkout, account screens, and operational dashboards for admins, staff, and delivery.

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Linking to the API
Copy `.env.local.example` to `.env.local` to configure the API base (defaults to `http://localhost:5000/api`).

When using the root-level `docker-compose.yml`, the frontend will rebuild against the local API automatically.

## Production build
```bash
npm run build
npm start
```
