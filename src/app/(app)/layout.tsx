import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="member-banner">
        <span>🔒</span>
        <span>Khu vực thành viên</span>
      </div>
      {children}
    </div>
  );
}
