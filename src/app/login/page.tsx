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
    <div>
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
