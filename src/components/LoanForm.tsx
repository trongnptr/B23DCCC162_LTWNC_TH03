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
  const formKey = `${state.ok ? 'success' : 'state'}-${JSON.stringify(state.values)}-${state.message ?? ''}`;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h2>Đăng ký mượn sách</h2>

      <form key={formKey} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="loan-bookId" className="form-label">
            Sách
          </label>
          <select
            id="loan-bookId"
            name="bookId"
            defaultValue={state.values?.bookId ?? (defaultBookId ? String(defaultBookId) : '')}
            className="form-select"
          >
            <option value="">-- Chọn sách --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.copies} bản)
              </option>
            ))}
          </select>
          {state.errors?.bookId && (
            <div role="alert" className="form-error">
              {state.errors.bookId}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="loan-pickupDate" className="form-label">
              Ngày lấy sách
            </label>
            <input
              id="loan-pickupDate"
              name="pickupDate"
              type="date"
              defaultValue={state.values?.pickupDate ?? ''}
              className="form-input"
            />
            {state.errors?.pickupDate && (
              <div role="alert" className="form-error">
                {state.errors.pickupDate}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="loan-term" className="form-label">
              Thời hạn mượn
            </label>
            <select
              id="loan-term"
              name="term"
              defaultValue={state.values?.term ?? ''}
              className="form-select"
            >
              <option value="">-- Chọn thời hạn --</option>
              <option value="7">{TERM_LABEL[7]}</option>
              <option value="14">{TERM_LABEL[14]}</option>
              <option value="30">{TERM_LABEL[30]}</option>
            </select>
            {state.errors?.term && (
              <div role="alert" className="form-error">
                {state.errors.term}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="loan-quantity" className="form-label">
              Số quyển
            </label>
            <input
              id="loan-quantity"
              name="quantity"
              type="number"
              min={1}
              defaultValue={state.values?.quantity ?? '1'}
              className="form-input"
            />
            {state.errors?.quantity && (
              <div role="alert" className="form-error">
                {state.errors.quantity}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="loan-reason" className="form-label">
            Lý do mượn
          </label>
          <textarea
            id="loan-reason"
            name="reason"
            rows={3}
            defaultValue={state.values?.reason ?? ''}
            placeholder="Lý do mượn tối thiểu 10 ký tự..."
            className="form-textarea"
          />
          {state.errors?.reason && (
            <div role="alert" className="form-error">
              {state.errors.reason}
            </div>
          )}
        </div>

        {state.message && (
          <div
            role="alert"
            style={{
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              fontWeight: 500,
              fontSize: '0.9rem',
              color: state.ok ? 'var(--success)' : 'var(--danger)',
              background: state.ok ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${state.ok ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {state.message}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary"
          >
            {isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </div>
      </form>
    </div>
  );
}
