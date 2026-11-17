import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const { callbackUrl = '/loans' } = await searchParams;

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🔐</span>
          <h1 style={{ fontSize: '1.6rem', marginTop: '0.5rem', marginBottom: '0.25rem' }}>Đăng nhập</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Vui lòng đăng nhập để tiếp tục</p>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
