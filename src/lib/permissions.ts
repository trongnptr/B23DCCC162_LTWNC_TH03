import type { Role } from '@/types';

export type Action =
  | 'book:view'
  | 'loan:create'
  | 'loan:view-own'
  | 'loan:view-all'
  | 'loan:review';

export function can(role: Role | undefined, action: Action): boolean {
  if (!role) {
    // guest (chưa đăng nhập)
    return action === 'book:view';
  }

  if (role === 'student') {
    return action === 'book:view' || action === 'loan:create' || action === 'loan:view-own';
  }

  if (role === 'admin') {
    return action === 'book:view' || action === 'loan:view-all' || action === 'loan:review';
  }

  return false;
}
