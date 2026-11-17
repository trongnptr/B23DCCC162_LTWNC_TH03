import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function LoansPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=%2Floans');
  }

  return (
    <div>
      <h1>Sách đã mượn</h1>
      <p>Trang quản lý sách đã mượn (đang hoàn thiện ở Phần 3)</p>
    </div>
  );
}
