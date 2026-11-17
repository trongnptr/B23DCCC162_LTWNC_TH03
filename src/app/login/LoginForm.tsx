'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} style={{ maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div>
        <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.25rem' }}>
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {state?.error && (
        <div role="alert" style={{ color: 'red', fontSize: '0.9rem' }}>
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending} style={{ padding: '0.5rem', cursor: 'pointer' }}>
        {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
