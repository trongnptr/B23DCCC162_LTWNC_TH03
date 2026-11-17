'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" className="logo-badge">
            <span style={{ fontSize: '1.4rem' }}>📚</span>
            <span>Thư viện CNTT</span>
          </Link>
          <nav className="nav-links">
            <Link
              href="/"
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
            >
              Trang chủ
            </Link>
            <Link
              href="/books"
              className={`nav-link ${pathname.startsWith('/books') ? 'active' : ''}`}
            >
              Sách
            </Link>

            {session?.user && (
              <Link
                href="/loans"
                className={`nav-link ${pathname.startsWith('/loans') ? 'active' : ''}`}
              >
                Sách đã mượn
              </Link>
            )}

            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                Quản trị
              </Link>
            )}
          </nav>
        </div>

        <div>
          {status === 'loading' ? null : session?.user ? (
            <div className="user-info">
              <span className="user-badge">
                Xin chào, {session.user.name} ({session.user.role})
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-signout"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-signin">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
