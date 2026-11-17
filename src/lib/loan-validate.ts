import type { Book, Term } from '@/types';

export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors; // lỗi từng ô
  values: Partial<LoanInput>; // giá trị đã nhập, để hiện lại khi có lỗi
  message?: string; // thông báo chung (thành công hoặc lỗi từ server)
  ok?: boolean; // true nếu message là thông báo thành công
}

export function today(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toLoanInput(raw: unknown): LoanInput {
  if (raw instanceof FormData) {
    return {
      bookId: (raw.get('bookId') as string) ?? '',
      pickupDate: (raw.get('pickupDate') as string) ?? '',
      term: (raw.get('term') as string) ?? '',
      quantity: (raw.get('quantity') as string) ?? '',
      reason: (raw.get('reason') as string) ?? '',
    };
  }

  if (typeof raw === 'object' && raw !== null) {
    const obj = raw as Record<string, unknown>;
    return {
      bookId: typeof obj.bookId === 'string' ? obj.bookId : (obj.bookId != null ? String(obj.bookId) : ''),
      pickupDate: typeof obj.pickupDate === 'string' ? obj.pickupDate : (obj.pickupDate != null ? String(obj.pickupDate) : ''),
      term: typeof obj.term === 'string' ? obj.term : (obj.term != null ? String(obj.term) : ''),
      quantity: typeof obj.quantity === 'string' ? obj.quantity : (obj.quantity != null ? String(obj.quantity) : ''),
      reason: typeof obj.reason === 'string' ? obj.reason : (obj.reason != null ? String(obj.reason) : ''),
    };
  }

  return {
    bookId: '',
    pickupDate: '',
    term: '',
    quantity: '',
    reason: '',
  };
}

export function validateLoan(input: LoanInput, books: Book[]): LoanErrors {
  const errors: LoanErrors = {};

  // 1. Sách
  if (!input.bookId || input.bookId.trim() === '') {
    errors.bookId = 'Hãy chọn sách';
  } else {
    const bookIdNum = Number(input.bookId);
    const book = books.find((b) => b.id === bookIdNum);
    if (!book) {
      errors.bookId = 'Hãy chọn sách';
    }
  }

  // 2. Ngày lấy sách
  if (!input.pickupDate || input.pickupDate.trim() === '') {
    errors.pickupDate = 'Hãy chọn ngày';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.pickupDate)) {
      errors.pickupDate = 'Hãy chọn ngày';
    } else {
      const todayStr = today();
      if (input.pickupDate < todayStr) {
        errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
      }
    }
  }

  // 3. Thời hạn mượn
  if (!input.term || input.term.trim() === '') {
    errors.term = 'Hãy chọn thời hạn';
  } else {
    const termNum = Number(input.term);
    if (![7, 14, 30].includes(termNum)) {
      errors.term = 'Hãy chọn thời hạn';
    }
  }

  // 4. Số quyển
  let quantityNum = 0;
  if (!input.quantity || input.quantity.trim() === '') {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else {
    quantityNum = Number(input.quantity);
    if (!Number.isInteger(quantityNum) || quantityNum < 1) {
      errors.quantity = 'Số quyển phải từ 1 trở lên';
    } else {
      // kiểm tra chéo với số bản của sách đã chọn
      const selectedBook = books.find((b) => b.id === Number(input.bookId));
      if (selectedBook && quantityNum > selectedBook.copies) {
        errors.quantity = `Vượt số bản của sách (${selectedBook.copies} bản)`;
      }
    }
  }

  // 5. Lý do mượn
  const trimmedReason = (input.reason ?? '').trim();
  if (trimmedReason.length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
}

export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate.trim(),
    term: Number(input.term) as 7 | 14 | 30,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
