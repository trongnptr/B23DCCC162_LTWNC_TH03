import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/data/books';

export default function HomePage() {
  const totalBooks = db.books.length;
  const totalCategories = CATEGORIES.length;

  return (
    <div>
      <h1>Thư viện khoa CNTT PTIT</h1>
      <p>{totalBooks} đầu sách · {totalCategories} chuyên mục</p>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/books" style={{ textDecoration: 'underline', color: 'blue' }}>
          Xem danh mục sách
        </Link>
      </div>
    </div>
  );
}
