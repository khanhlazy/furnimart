'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

/**
 * Layout component để tránh lặp lại Navbar + Footer ở mọi page
 */
export default function Layout({ 
  children, 
  showNavbar = true, 
  showFooter = true 
}: LayoutProps) {
  return (
    <div className="page-shell">
      {showNavbar && <Navbar />}
      {children}
      {showFooter && <Footer />}
    </div>
  );
}

