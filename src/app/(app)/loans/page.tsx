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

      {viewer.role === 'student' && (
        <LoanForm
          books={db.books}
          defaultBookId={defaultBookId}
          action={createLoanAction}
        />
      )}

      {/* Bộ lọc */}
      <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <form method="GET" action="/loans" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {book && <input type="hidden" name="book" value={book} />}
          <label htmlFor="filter-status" className="form-label" style={{ marginBottom: 0 }}>
            Trạng thái
          </label>
          <select id="filter-status" name="status" defaultValue={status} className="form-select" style={{ maxWidth: '200px' }}>
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Từ chối</option>
          </select>
          <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
            Lọc
          </button>
        </form>
      </div>

      {loansResult.items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>Không có yêu cầu mượn nào</p>
        </div>
      ) : (
        <table className="custom-table" style={{ marginBottom: '1.5rem' }}>
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Ngày lấy</th>
              <th align="left">Thời hạn</th>
              <th align="center">Số quyển</th>
              <th align="center">Trạng thái</th>
              {viewer.role === 'student' && <th align="center">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {loansResult.items.map((loan) => {
              const cancelAction = cancelLoanAction.bind(null, loan.id);
              const badgeClass =
                loan.status === 'approved'
                  ? 'badge-approved'
                  : loan.status === 'rejected'
                  ? 'badge-rejected'
                  : 'badge-pending';

              return (
                <tr key={loan.id}>
                  <td style={{ fontWeight: 600 }}>{loan.bookTitle}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td align="center">{loan.quantity} quyển</td>
                  <td align="center">
                    <span className={`badge-status ${badgeClass}`}>
                      {STATUS_LABEL[loan.status]}
                    </span>
                  </td>
                  {viewer.role === 'student' && (
                    <td align="center">
                      {loan.status === 'pending' && loan.userEmail === viewer.email && (
                        <form action={cancelAction}>
                          <button type="submit" className="btn-danger-outline">
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
      <div className="pagination">
        {loansResult.page > 1 ? (
          <Link
            href={`/loans?status=${encodeURIComponent(status)}&page=${loansResult.page - 1}${book ? `&book=${book}` : ''}`}
            className="pagination-link"
          >
            Trước
          </Link>
        ) : (
          <span className="pagination-disabled">Trước</span>
        )}

        <span style={{ color: '#475569', fontWeight: 600 }}>
          Trang {loansResult.page}/{loansResult.totalPages}
        </span>

        {loansResult.page < loansResult.totalPages ? (
          <Link
            href={`/loans?status=${encodeURIComponent(status)}&page=${loansResult.page + 1}${book ? `&book=${book}` : ''}`}
            className="pagination-link"
          >
            Sau
          </Link>
        ) : (
          <span className="pagination-disabled">Sau</span>
        )}
      </div>
    </div>
  );
}
