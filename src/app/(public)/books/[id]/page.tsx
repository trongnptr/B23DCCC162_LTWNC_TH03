import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBookById } from '@/lib/books';
import { db } from '@/lib/db';

export const revalidate = 60;

export async function generateStaticParams() {
  // Chỉ sinh sẵn 12 sách đầu
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
    <div>
      <h1>{book.title}</h1>
      <p>Tác giả: {book.author}</p>
      <p>Chuyên mục: {book.category}</p>
      <p>Số bản: {book.copies}</p>
      <p>Cập nhật lúc: {updatedTime}</p>
      <div style={{ marginTop: '1rem' }}>
        <Link
          href={`/loans?book=${book.id}`}
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Mượn sách này
        </Link>
      </div>
    </div>
  );
}
