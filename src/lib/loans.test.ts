import { describe, it, expect, beforeEach } from 'vitest';
import { listLoans, submitLoan, cancelLoan } from './loans';
import { db } from './db';
import { generateBooks, generateLoans } from '@/data/books';

describe('Kiểm tra nghiệp vụ loans.ts', () => {
  beforeEach(() => {
    // Reset db trước mỗi test
    db.books = generateBooks(24);
    db.loans = generateLoans(37);
    db.nextLoanId = 38;
  });

  it('listLoans: sv01 có 27 yêu cầu chia 3 trang (10/10/7), admin thấy 37, trang vượt giới hạn bị kẹp lại', () => {
    const studentViewer = { email: 'sv01@ptit.edu.vn', role: 'student' as const };
    const adminViewer = { email: 'admin@ptit.edu.vn', role: 'admin' as const };

    // sv01 có 27 yêu cầu
    const resPage1 = listLoans(studentViewer, undefined, 1);
    expect(resPage1.total).toBe(27);
    expect(resPage1.totalPages).toBe(3);
    expect(resPage1.items.length).toBe(10);
    expect(resPage1.page).toBe(1);

    const resPage2 = listLoans(studentViewer, undefined, 2);
    expect(resPage2.items.length).toBe(10);

    const resPage3 = listLoans(studentViewer, undefined, 3);
    expect(resPage3.items.length).toBe(7);

    // Trang vượt giới hạn bị kẹp lại
    const resOverPage = listLoans(studentViewer, undefined, 999);
    expect(resOverPage.page).toBe(3);
    expect(resOverPage.items.length).toBe(7);

    // Trang < 1 bị kẹp lại
    const resUnderPage = listLoans(studentViewer, undefined, -5);
    expect(resUnderPage.page).toBe(1);

    // admin thấy tất cả 37
    const adminRes = listLoans(adminViewer, undefined, 1);
    expect(adminRes.total).toBe(37);
    expect(adminRes.totalPages).toBe(4);
  });

  it('submitLoan: trả hết bản với sách id 6 ngày 2026-12-02', () => {
    // Sách id 6 có 1 bản, loan mẫu id 28 là sách 6 ngày 2026-12-02 trạng thái approved
    const res = submitLoan('sv01@ptit.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách an toàn mạng để học',
    });

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.message).toBe('Sách đã hết bản vào ngày này');
    }
  });

  it('tạo được yêu cầu mới rồi cancelLoan đúng 3 mã (forbidden, ok, not-found)', () => {
    // Tạo yêu cầu mới thành công
    const submitRes = submitLoan('sv01@ptit.edu.vn', {
      bookId: 3,
      pickupDate: '2026-12-03',
      term: 14,
      quantity: 1,
      reason: 'Mượn sách thiết kế csdl môn học',
    });

    expect(submitRes.ok).toBe(true);
    if (!submitRes.ok) return;

    const newLoanId = submitRes.loan.id;

    // 1. forbidden nếu người khác hủy
    const forbiddenRes = cancelLoan('sv02@ptit.edu.vn', newLoanId);
    expect(forbiddenRes).toBe('forbidden');

    // 2. ok nếu chính chủ hủy khi còn pending
    const okRes = cancelLoan('sv01@ptit.edu.vn', newLoanId);
    expect(okRes).toBe('ok');

    // 3. not-found khi hủy lại hoặc id không tồn tại
    const notFoundRes = cancelLoan('sv01@ptit.edu.vn', newLoanId);
    expect(notFoundRes).toBe('not-found');
  });
});
