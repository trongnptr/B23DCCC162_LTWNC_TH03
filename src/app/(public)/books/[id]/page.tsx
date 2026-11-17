import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBookById } from '@/lib/books';
import { db } from '@/lib/db';

export const revalidate = 60;

export async function generateStaticParams() {
  return db.books.slice(0, 12).map((book) => ({
    id: String(book.id),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(Number(id));

  if (!book) {
    return {
      title: 'Không tìm thấy sách',
    };
  }

  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản.`,
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = Number(id);
  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }

  const updatedTime = new Date().toLocaleTimeString('vi-VN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/books" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 500 }}>
          ← Quay lại danh mục sách
        </Link>
      </div>

      <div className="card">
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{book.title}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', padding: '1rem 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Tác giả: </span>
            <strong style={{ color: '#1e293b' }}>{book.author}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Chuyên mục: </span>
            <strong style={{ color: '#1e293b' }}>{book.category}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Số bản: </span>
            <strong style={{ color: 'var(--primary)' }}>{book.copies}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Cập nhật lúc: </span>
            <span style={{ color: '#64748b' }}>{updatedTime}</span>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <Link
            href={`/loans?book=${book.id}`}
            className="btn-primary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
          >
            Mượn sách này
          </Link>
        </div>
      </div>
    </div>
  );
}
