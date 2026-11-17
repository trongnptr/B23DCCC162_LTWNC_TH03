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
  description: 'Hệ thống tra cứu và đăng ký mượn sách Thư viện khoa CNTT PTIT',
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
          <main className="main-wrapper">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
