import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'FurniMart - Nền tảng thương mại điện tử nội thất',
  description: 'Mua sắm nội thất chất lượng cao với giá tốt nhất trên thị trường',
  keywords: 'nội thất, sofa, bàn, ghế, giường, tủ, mua bán nội thất',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        {/* Google Fonts cho Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛋️</text></svg>" />
      </head>
      <body className="app-body font-sans antialiased text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
