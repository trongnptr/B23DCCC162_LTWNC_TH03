'use server';

import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { LoanStatus } from '@/types';

export async function reviewLoan(id: number, status: 'approved' | 'rejected') {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'loan:review')) {
    throw new Error('Không có quyền');
  }

  const loan = db.loans.find((l) => l.id === id);
  if (!loan) {
    return;
  }

  // Chỉ đổi yêu cầu đang pending
  if (loan.status === 'pending') {
    loan.status = status;
    revalidatePath('/admin');
  }
}
