'use client';

import { useActionState } from 'react';
import type { Book } from '@/types';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState } from '@/lib/loan-validate';

interface LoanFormProps {
  books: Book[];
  defaultBookId?: number;
  action: (
    prev: LoanFormState,
    formData: FormData
  ) => Promise<LoanFormState>;
}

export function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const initialState: LoanFormState = {
    errors: {},
    values: {
      bookId: defaultBookId ? String(defaultBookId) : '',
      quantity: '1',
    },
  };

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Key để reset / dựng lại form theo đúng giá trị trả về
  const formKey = `${state.ok ? 'success' : 'state'}-${JSON.stringify(state.values)}-${state.message ?? ''}`;

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '6px' }}>
      <h2>Đăng ký mượn sách</h2>

      <form key={formKey} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="loan-bookId" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Sách
          </label>
          <select
            id="loan-bookId"
            name="bookId"
            defaultValue={state.values?.bookId ?? (defaultBookId ? String(defaultBookId) : '')}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.copies} bản)
              </option>
            ))}
          </select>
          {state.errors?.bookId && (
            <div role="alert" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {state.errors.bookId}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="loan-pickupDate" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Ngày lấy sách
          </label>
          <input
            id="loan-pickupDate"
            name="pickupDate"
            type="date"
            defaultValue={state.values?.pickupDate ?? ''}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {state.errors?.pickupDate && (
            <div role="alert" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {state.errors.pickupDate}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="loan-term" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Thời hạn mượn
          </label>
          <select
            id="loan-term"
            name="term"
            defaultValue={state.values?.term ?? ''}
            style={{ width: '100%', padding: '0.5rem' }}
          >
            <option value="">-- Chọn thời hạn --</option>
            <option value="7">{TERM_LABEL[7]}</option>
            <option value="14">{TERM_LABEL[14]}</option>
            <option value="30">{TERM_LABEL[30]}</option>
          </select>
          {state.errors?.term && (
            <div role="alert" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {state.errors.term}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="loan-quantity" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Số quyển
          </label>
          <input
            id="loan-quantity"
            name="quantity"
            type="number"
            min={1}
            defaultValue={state.values?.quantity ?? '1'}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {state.errors?.quantity && (
            <div role="alert" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {state.errors.quantity}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="loan-reason" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500 }}>
            Lý do mượn
          </label>
          <textarea
            id="loan-reason"
            name="reason"
            rows={3}
            defaultValue={state.values?.reason ?? ''}
            placeholder="Lý do mượn tối thiểu 10 ký tự..."
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {state.errors?.reason && (
            <div role="alert" style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {state.errors.reason}
            </div>
          )}
        </div>

        {state.message && (
          <div
            role="alert"
            style={{
              padding: '0.75rem',
              borderRadius: '4px',
              color: state.ok ? '#15803d' : '#b91c1c',
              background: state.ok ? '#dcfce7' : '#fee2e2',
            }}
          >
            {state.message}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isPending}
            style={{
              padding: '0.6rem 1.2rem',
              cursor: isPending ? 'not-allowed' : 'pointer',
              background: '#0284c7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Gửi yêu cầu
          </button>
        </div>
      </form>
    </div>
  );
}
