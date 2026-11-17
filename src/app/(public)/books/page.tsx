import Link from 'next/link';
import { loadBooksShift } from '@/lib/books';
import { CATEGORIES } from '@/data/books';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = '', q = '' } = await searchParams;
  const books = await loadBooksShift({ category, q });

  const renderTime = new Date().toLocaleTimeString('vi-VN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div>
      <h1>Danh mục sách</h1>

      <form method="GET" action="/books" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label htmlFor="search-q" style={{ marginRight: '0.5rem' }}>Tìm sách</label>
          <input
            id="search-q"
            name="q"
            type="text"
            defaultValue={q}
            placeholder="Nhập tên sách..."
          />
        </div>

        <div>
          <label htmlFor="select-category" style={{ marginRight: '0.5rem' }}>Chuyên mục</label>
          <select id="select-category" name="category" defaultValue={category}>
            <option value="">Tất cả</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Lọc</button>
      </form>

      <div style={{ marginBottom: '1rem', color: '#555' }}>
        <p>Tìm thấy {books.length} sách</p>
        <p>Render lúc: {renderTime}</p>
      </div>

      {books.length === 0 ? (
        <p>Không tìm thấy sách nào</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Tác giả</th>
              <th align="left">Số bản</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <Link href={`/books/${book.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
                    {book.title}
                  </Link>
                </td>
                <td>{book.author}</td>
                <td>Số bản: {book.copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
