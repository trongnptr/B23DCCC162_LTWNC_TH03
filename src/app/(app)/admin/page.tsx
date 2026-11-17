import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { formatDate, TERM_LABEL } from '@/lib/format';
import { reviewLoan } from './actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function AdminPage() {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'loan:view-all') || !can(role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pendingCount = db.loans.filter((l) => l.status === 'pending').length;
  const approvedCount = db.loans.filter((l) => l.status === 'approved').length;
  const rejectedCount = db.loans.filter((l) => l.status === 'rejected').length;

  const pendingLoans = db.loans.filter((l) => l.status === 'pending');

  return (
    <div>
      <h1>Duyệt yêu cầu mượn</h1>

      {/* Thống kê dạng Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>CHỜ DUYỆT</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>ĐÃ DUYỆT</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.25rem' }}>
            {approvedCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', borderLeft: '4px solid var(--danger)' }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>TỪ CHỐI</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--danger)', marginTop: '0.25rem' }}>
            {rejectedCount}
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'none' }}>
        Chờ duyệt: {pendingCount} | Đã duyệt: {approvedCount} | Từ chối: {rejectedCount}
      </div>

      <div style={{ marginBottom: '1rem', fontWeight: 600, color: '#334155' }}>
        Chờ duyệt: {pendingCount} | Đã duyệt: {approvedCount} | Từ chối: {rejectedCount}
      </div>

      {pendingLoans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem' }}>Không có yêu cầu nào đang chờ duyệt</p>
        </div>
      ) : (
        <table className="custom-table">
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Ngày lấy</th>
              <th align="left">Thời hạn</th>
              <th align="left">Người mượn</th>
              <th align="center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => {
              const book = db.books.find((b) => b.id === loan.bookId);
              const approveAction = reviewLoan.bind(null, loan.id, 'approved');
              const rejectAction = reviewLoan.bind(null, loan.id, 'rejected');

              return (
                <tr key={loan.id}>
                  <td style={{ fontWeight: 600 }}>{book ? book.title : `Sách #${loan.bookId}`}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>
                    <span style={{ color: '#475569' }}>{loan.userEmail}</span>
                  </td>
                  <td align="center">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <form action={approveAction}>
                        <button type="submit" className="btn-success-sm">
                          Duyệt
                        </button>
                      </form>
                      <form action={rejectAction}>
                        <button type="submit" className="btn-danger-sm">
                          Từ chối
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
