import { db } from './db';
import { can } from './permissions';
import type { Loan, LoanStatus, Role } from '../types';
import type { LoanData } from './loan-validate';

export interface Viewer {
  email: string;
  role: Role;
}

export interface LoanItem extends Loan {
  bookTitle: string;
}

export interface ListLoansResult {
  items: LoanItem[];
  total: number;
  page: number;
  totalPages: number;
}

export function parseStatus(v?: string | null): LoanStatus | undefined {
  if (v === 'pending' || v === 'approved' || v === 'rejected') {
    return v;
  }
  return undefined;
}

export function listLoans(
  viewer: Viewer,
  status?: string | null,
  pageParam: number = 1
): ListLoansResult {
  let list = db.loans;

  // Quyền: student chỉ thấy yêu cầu của chính mình, admin thấy tất cả
  if (viewer.role === 'student') {
    list = list.filter((l) => l.userEmail === viewer.email);
  }

  // Lọc status
  const parsed = parseStatus(status);
  if (parsed) {
    list = list.filter((l) => l.status === parsed);
  }

  const total = list.length;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Kẹp page vào 1..totalPages
  let currentPage = pageParam;
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const slice = list.slice(startIndex, startIndex + pageSize);

  const items: LoanItem[] = slice.map((l) => {
    const book = db.books.find((b) => b.id === l.bookId);
    return {
      ...l,
      bookTitle: book ? book.title : `Sách #${l.bookId}`,
    };
  });

  return {
    items,
    total,
    page: currentPage,
    totalPages,
  };
}

export function submitLoan(
  email: string,
  data: LoanData
): { ok: true; loan: Loan } | { ok: false; message: string } {
  const book = db.books.find((b) => b.id === data.bookId);
  const totalCopies = book ? book.copies : 0;

  // Kiểm tra tồn kho: tổng quantity của các yêu cầu chưa bị từ chối cùng sách, cùng ngày lấy
  const conflictingLoans = db.loans.filter(
    (l) =>
      l.bookId === data.bookId &&
      l.pickupDate === data.pickupDate &&
      l.status !== 'rejected'
  );

  const currentBorrowed = conflictingLoans.reduce((sum, l) => sum + l.quantity, 0);

  if (currentBorrowed + data.quantity > totalCopies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const newLoan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  // Thêm vào đầu mảng
  db.loans.unshift(newLoan);

  return { ok: true, loan: newLoan };
}

export function cancelLoan(
  email: string,
  id: number
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index === -1) {
    return 'not-found';
  }

  const loan = db.loans[index];
  if (loan.userEmail !== email) {
    return 'forbidden';
  }

  if (loan.status !== 'pending') {
    return 'not-pending';
  }

  db.loans.splice(index, 1);
  return 'ok';
}
