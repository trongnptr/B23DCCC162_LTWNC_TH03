import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoanForm } from './LoanForm';
import type { Book } from '@/types';
import type { LoanFormState } from '@/lib/loan-validate';

const mockBooks: Book[] = [
  { id: 1, title: 'Lập trình C căn bản', author: 'Nguyễn Văn Hùng', category: 'Lập trình', copies: 1 },
  { id: 6, title: 'An toàn mạng', author: 'Bùi Ngọc Anh', category: 'Mạng máy tính', copies: 1 },
];

describe('Kiểm tra component LoanForm.tsx', () => {
  it('(1) action trả errors thì lỗi hiện ra dưới đúng ô', async () => {
    const mockAction = vi.fn().mockResolvedValue({
      errors: {
        bookId: 'Hãy chọn sách',
        pickupDate: 'Hãy chọn ngày',
        term: 'Hãy chọn thời hạn',
        quantity: 'Số quyển phải từ 1 trở lên',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
      ok: false,
    } as LoanFormState);

    const user = userEvent.setup();
    render(<LoanForm books={mockBooks} action={mockAction} />);

    const submitBtn = screen.getByRole('button', { name: /Gửi yêu cầu/i });
    await user.click(submitBtn);

    expect(await screen.findByText('Hãy chọn sách')).toBeInTheDocument();
    expect(screen.getByText('Hãy chọn ngày')).toBeInTheDocument();
    expect(screen.getByText('Hãy chọn thời hạn')).toBeInTheDocument();
    expect(screen.getByText('Số quyển phải từ 1 trở lên')).toBeInTheDocument();
    expect(screen.getByText('Lý do tối thiểu 10 ký tự')).toBeInTheDocument();
  });

  it('(2) điền hợp lệ bằng userEvent thì action được gọi 1 lần và FormData có đúng bookId, term, quantity', async () => {
    let capturedFormData: FormData | null = null;
    const mockAction = vi.fn().mockImplementation(async (_prev: LoanFormState, formData: FormData) => {
      capturedFormData = formData;
      return {
        errors: {},
        values: {},
        ok: true,
        message: 'Đã gửi yêu cầu, chờ duyệt',
      } as LoanFormState;
    });

    const user = userEvent.setup();
    render(<LoanForm books={mockBooks} action={mockAction} />);

    await user.selectOptions(screen.getByLabelText(/^Sách$/i), '1');
    await user.type(screen.getByLabelText(/Ngày lấy sách/i), '2026-12-10');
    await user.selectOptions(screen.getByLabelText(/Thời hạn mượn/i), '14');
    
    const quantityInput = screen.getByLabelText(/Số quyển/i);
    await user.clear(quantityInput);
    await user.type(quantityInput, '1');

    await user.type(screen.getByLabelText(/Lý do mượn/i), 'Mượn sách phục vụ làm bài tập lớn môn học');

    await user.click(screen.getByRole('button', { name: /Gửi yêu cầu/i }));

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(capturedFormData).not.toBeNull();
    expect(capturedFormData!.get('bookId')).toBe('1');
    expect(capturedFormData!.get('term')).toBe('14');
    expect(capturedFormData!.get('quantity')).toBe('1');
  });

  it('(3) action trả message “Sách đã hết bản vào ngày này” cùng values thì thông báo hiện ra và lý do đã nhập vẫn còn', async () => {
    const mockAction = vi.fn().mockResolvedValue({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Mượn sách học bài và ôn thi',
      },
      message: 'Sách đã hết bản vào ngày này',
      ok: false,
    } as LoanFormState);

    const user = userEvent.setup();
    render(<LoanForm books={mockBooks} action={mockAction} />);

    await user.click(screen.getByRole('button', { name: /Gửi yêu cầu/i }));

    expect(await screen.findByText('Sách đã hết bản vào ngày này')).toBeInTheDocument();
    const reasonInput = screen.getByLabelText(/Lý do mượn/i);
    expect(reasonInput).toHaveValue('Mượn sách học bài và ôn thi');
  });

  it('(4) có defaultBookId thì ô Sách được chọn sẵn', () => {
    const mockAction = vi.fn();
    render(<LoanForm books={mockBooks} defaultBookId={6} action={mockAction} />);

    const bookSelect = screen.getByLabelText(/^Sách$/i) as HTMLSelectElement;
    expect(bookSelect.value).toBe('6');
  });
});
