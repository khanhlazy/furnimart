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
Set `NEXT_PUBLIC_API_BASE` in a `.env.local` file if you want to point components at a running backend (defaults to `http://localhost:5000/api`).

## Production build
```bash
npm run build
npm start
```
