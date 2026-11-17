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

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <form method="GET" action="/books" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px' }}>
            <label htmlFor="search-q" className="form-label">
              Tìm sách
            </label>
            <input
              id="search-q"
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Nhập tên sách..."
              className="form-input"
            />
          </div>

          <div style={{ width: '220px' }}>
            <label htmlFor="select-category" className="form-label">
              Chuyên mục
            </label>
            <select id="select-category" name="category" defaultValue={category} className="form-select">
              <option value="">Tất cả</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              Lọc
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
        <p style={{ fontWeight: 600, color: '#334155' }}>Tìm thấy {books.length} sách</p>
        <p>Render lúc: {renderTime}</p>
      </div>

      {books.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>Không tìm thấy sách nào</p>
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Tác giả</th>
              <th align="left">Chuyên mục</th>
              <th align="center">Số bản</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <Link
                    href={`/books/${book.id}`}
                    style={{ color: 'var(--primary)', fontWeight: 600 }}
                  >
                    {book.title}
                  </Link>
                </td>
                <td>{book.author}</td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#475569', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {book.category}
                  </span>
                </td>
                <td align="center">
                  <span style={{ fontWeight: 600 }}>Số bản: {book.copies}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
