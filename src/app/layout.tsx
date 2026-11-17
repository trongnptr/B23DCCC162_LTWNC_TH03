const BUILD_TAG = "rb-6129";
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Thư viện khoa CNTT',
    template: '%s | Thư viện khoa',
  },
  description: 'Hệ thống quản lý mượn sách Thư viện khoa CNTT',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
