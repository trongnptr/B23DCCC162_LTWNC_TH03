import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/data/books';

export default function HomePage() {
  const totalBooks = db.books.length;
  const totalCategories = CATEGORIES.length;

  return (
    <div style={{ padding: '2rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e293b' }}>
          Thư viện khoa CNTT PTIT
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '2rem' }}>
          {totalBooks} đầu sách · {totalCategories} chuyên mục
        </p>
        <Link
          href="/books"
          className="btn-primary"
          style={{ fontSize: '1.1rem', padding: '0.8rem 2rem', textDecoration: 'none' }}
        >
          Xem danh mục sách ➔
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {CATEGORIES.map((cat) => {
          const count = db.books.filter((b) => b.category === cat).length;
          return (
            <div key={cat} className="card" style={{ textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                {cat}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{count} đầu sách</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
