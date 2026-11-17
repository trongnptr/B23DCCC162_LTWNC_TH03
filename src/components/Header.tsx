'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header
      style={{
        borderBottom: '1px solid #ccc',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link href="/">Trang chủ</Link>
        <Link href="/books">Sách</Link>

        {session?.user && (
          <Link href="/loans">Sách đã mượn</Link>
        )}

        {session?.user?.role === 'admin' && (
          <Link href="/admin">Quản trị</Link>
        )}
      </nav>

      <div>
        {status === 'loading' ? null : session?.user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>
              Xin chào, {session.user.name} ({session.user.role})
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              style={{ padding: '0.25rem 0.5rem', cursor: 'pointer' }}
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>
            Đăng nhập
          </Link>
        )}
      </div>
    </header>
  );
}
