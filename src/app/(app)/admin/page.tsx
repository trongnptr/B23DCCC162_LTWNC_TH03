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

  // Kiểm tra lại quyền bằng can() ngay trong trang (phòng khi proxy cấu hình sai)
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

      <div style={{ marginBottom: '1rem', fontWeight: 500 }}>
        Chờ duyệt: {pendingCount} | Đã duyệt: {approvedCount} | Từ chối: {rejectedCount}
      </div>

      {pendingLoans.length === 0 ? (
        <p>Không có yêu cầu nào đang chờ duyệt</p>
      ) : (
        <table border={1} cellPadding={8} style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th align="left">Tên sách</th>
              <th align="left">Ngày lấy</th>
              <th align="left">Thời hạn</th>
              <th align="left">Người mượn</th>
              <th align="left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingLoans.map((loan) => {
              const book = db.books.find((b) => b.id === loan.bookId);
              const approveAction = reviewLoan.bind(null, loan.id, 'approved');
              const rejectAction = reviewLoan.bind(null, loan.id, 'rejected');

              return (
                <tr key={loan.id}>
                  <td>{book ? book.title : `Sách #${loan.bookId}`}</td>
                  <td>{formatDate(loan.pickupDate)}</td>
                  <td>{TERM_LABEL[loan.term]}</td>
                  <td>{loan.userEmail}</td>
                  <td style={{ display: 'flex', gap: '0.5rem' }}>
                    <form action={approveAction}>
                      <button type="submit" style={{ cursor: 'pointer', background: '#dcfce7', border: '1px solid #16a34a', color: '#166534', padding: '0.25rem 0.5rem' }}>
                        Duyệt
                      </button>
                    </form>
                    <form action={rejectAction}>
                      <button type="submit" style={{ cursor: 'pointer', background: '#fee2e2', border: '1px solid #dc2626', color: '#991b1b', padding: '0.25rem 0.5rem' }}>
                        Từ chối
                      </button>
                    </form>
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
