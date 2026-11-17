import Link from 'next/link';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { formatDate, TERM_LABEL, STATUS_LABEL } from '@/lib/format';
import { listLoans } from '@/lib/loans';
import { LoanForm } from '@/components/LoanForm';
import { createLoanAction, cancelLoanAction } from './actions';

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
    book?: string;
  }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Floans');
  }

  const { status = '', page = '1', book = '' } = await searchParams;
  const pageNum = parseInt(page, 10) || 1;
  const defaultBookId = book ? parseInt(book, 10) : undefined;

  const viewer = {
    email: session.user.email ?? '',
    role: session.user.role,
  };

  const loansResult = listLoans(viewer, status, pageNum);

  return (
    <div>
      <h1>Sách đã mượn</h1>

      {/* Form gửi yêu cầu chỉ hiện với student */}
      {viewer.role === 'student' && (
        <LoanForm
          books={db.books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      {/* Form lọc */}
      <div style={{ margin: '1.5rem 0' }}>
        <form method="GET" action="/loans" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {book && <input type="hidden" name="book" value={book} />}
          <label htmlFor="filter-status" style={{ fontWeight: 500 }}>
            Trạng thái
          </label>
          <select id="filter-status" name="status" defaultValue={status} style={{ padding: '0.4rem' }}>
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button type="submit" style={{ padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            Lọc
          </button>
        </form>
      </div>

      {/* Bảng danh sách */}
      {loansResult.items.length === 0 ? (
        <p>Không có yêu cầu mượn nào</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Ngày lấy</th>
              <th align="left">Thời hạn</th>
              <th align="left">Số quyển</th>
              <th align="left">Trạng thái</th>
              {viewer.role === 'student' && <th align="left">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {loansResult.items.map((loan) => {
              const cancelAction = cancelLoanAction.bind(null, loan.id);

              return (
                <tr key={loan.id}>
                  <td>{loan.bookTitle}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.quantity} quyển</td>
                  <td>{STATUS_LABEL[loan.status]}</td>
                  {viewer.role === 'student' && (
                    <td>
                      {loan.status === 'pending' && loan.userEmail === viewer.email && (
                        <form action={cancelAction}>
                          <button
                            type="submit"
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '3px',
                              cursor: 'pointer',
                            }}
                          >
                            Hủy
                          </button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Phân trang */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {loansResult.page > 1 ? (
          <Link
            href={`/loans?status=${encodeURIComponent(status)}&page=${loansResult.page - 1}${book ? `&book=${book}` : ''}`}
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Trước
          </Link>
        ) : (
          <span style={{ color: '#999' }}>Trước</span>
        )}

        <span>
          Trang {loansResult.page}/{loansResult.totalPages}
        </span>

        {loansResult.page < loansResult.totalPages ? (
          <Link
            href={`/loans?status=${encodeURIComponent(status)}&page=${loansResult.page + 1}${book ? `&book=${book}` : ''}`}
            style={{ color: 'blue', textDecoration: 'underline' }}
          >
            Sau
          </Link>
        ) : (
          <span style={{ color: '#999' }}>Sau</span>
        )}
      </div>
    </div>
  );
}
