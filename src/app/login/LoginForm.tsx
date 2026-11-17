'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          placeholder="sv01@ptit.edu.vn"
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="login-password" className="form-label">
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="form-input"
        />
      </div>

      {state?.error && (
        <div
          role="alert"
          style={{
            padding: '0.65rem 0.85rem',
            background: 'var(--danger-bg)',
            color: 'var(--danger)',
            borderRadius: '6px',
            fontSize: '0.85rem',
            border: '1px solid #fecaca',
            fontWeight: 500,
          }}
        >
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary"
        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
      >
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', color: '#64748b' }}>
        <strong>Tài khoản mẫu:</strong><br />
        • Sinh viên: <code>sv01@ptit.edu.vn</code> (mk: <code>sv123456</code>)<br />
        • Quản trị: <code>admin@ptit.edu.vn</code> (mk: <code>admin123</code>)
      </div>
    </form>
  );
}
