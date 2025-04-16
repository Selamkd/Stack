import { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout(props: { children: ReactNode }) {
  return (
    <div className="bg-custom-base min-h-screen text-zinc-200">
      <Sidebar />
      <main className="p-4 sm:p-6 max-w-7xl border mx-auto">
        {props?.children}
      </main>
    </div>
  );
}
