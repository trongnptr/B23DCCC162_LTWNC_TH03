import { describe, it, expect } from 'vitest';
import { validateLoan, toLoanData, type LoanInput } from './loan-validate';
import type { Book } from '@/types';

const mockBooks: Book[] = [
  { id: 1, title: 'Lập trình C căn bản', author: 'Nguyễn Văn Hùng', category: 'Lập trình', copies: 1 },
  { id: 2, title: 'Cấu trúc dữ liệu', author: 'Trần Minh Đức', category: 'Lập trình', copies: 3 },
];

describe('Kiểm tra dữ liệu loan-validate.ts', () => {
  it('validateLoan: dữ liệu hợp lệ trả object rỗng', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '14',
      quantity: '1',
      reason: 'Mượn sách phục vụ nghiên cứu môn học',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors).toEqual({});
  });

  it('validateLoan: form trống báo đủ lỗi', () => {
    const input: LoanInput = {
      bookId: '',
      pickupDate: '',
      term: '',
      quantity: '',
      reason: '',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.quantity).toBe('Số quyển phải từ 1 trở lên');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('validateLoan: ngày lấy sách quá khứ báo lỗi', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2020-01-01',
      term: '7',
      quantity: '1',
      reason: 'Lý do hợp lệ trên 10 ký tự',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('validateLoan: lý do dưới 10 ký tự hoặc toàn khoảng trắng', () => {
    const inputShort: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '7',
      quantity: '1',
      reason: 'Ngắn',
    };
    expect(validateLoan(inputShort, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');

    const inputWhitespace: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '7',
      quantity: '1',
      reason: '            ',
    };
    expect(validateLoan(inputWhitespace, mockBooks).reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('validateLoan: số quyển vượt số bản của sách đã chọn', () => {
    const input: LoanInput = {
      bookId: '1', // Sách id 1 có 1 bản
      pickupDate: '2026-12-01',
      term: '7',
      quantity: '2',
      reason: 'Lý do hợp lệ dài hơn 10 ký tự',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('validateLoan: số quyển không phải số nguyên dương', () => {
    const inputZero: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '7',
      quantity: '0',
      reason: 'Lý do hợp lệ dài hơn 10 ký tự',
    };
    expect(validateLoan(inputZero, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');

    const inputFloat: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '7',
      quantity: '1.5',
      reason: 'Lý do hợp lệ dài hơn 10 ký tự',
    };
    expect(validateLoan(inputFloat, mockBooks).quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('validateLoan: thời hạn không hợp lệ', () => {
    const input: LoanInput = {
      bookId: '1',
      pickupDate: '2026-12-01',
      term: '10',
      quantity: '1',
      reason: 'Lý do hợp lệ dài hơn 10 ký tự',
    };
    const errors = validateLoan(input, mockBooks);
    expect(errors.term).toBe('Hãy chọn thời hạn');
  });

  it('toLoanData: ép kiểu số từ chuỗi', () => {
    const input: LoanInput = {
      bookId: '2',
      pickupDate: '2026-12-05',
      term: '30',
      quantity: '2',
      reason: '   Đọc tài liệu ôn thi học phần nâng cao   ',
    };
    const data = toLoanData(input);
    expect(data.bookId).toBe(2);
    expect(data.pickupDate).toBe('2026-12-05');
    expect(data.term).toBe(30);
    expect(data.quantity).toBe(2);
    expect(data.reason).toBe('Đọc tài liệu ôn thi học phần nâng cao');
  });
});
