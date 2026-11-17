import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div style={{ background: '#eef2ff', padding: '0.5rem 1rem', marginBottom: '1rem', borderRadius: '4px', color: '#3730a3', fontWeight: 500 }}>
        Khu vực thành viên
      </div>
      {children}
    </div>
  );
}
