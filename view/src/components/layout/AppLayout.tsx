import { ReactNode } from 'react';

export default function AppLayout(props: { children: ReactNode }) {
  return (
    <div className="bg-custom-dark-base min-h-screen text-zinc-200">
      <main className="p-4 sm:p-6">{props?.children}</main>
    </div>
  );
}
