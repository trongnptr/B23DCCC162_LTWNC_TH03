'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header style={{ borderBottom: '1px solid #ccc', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/">Trang chủ</Link>
        <Link href="/books">Sách</Link>
      </nav>
    </header>
  );
}
