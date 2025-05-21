// src/app/(app)/layout.tsx
import { Navbar } from '@/components/shared/navbar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden"> 
      {/* Updated Background Gradient to match the cyber theme */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0b1e] via-[#0f1a2b] to-[#0a192f]" />

      {/* Updated Grid pattern with tech theme */}
      <div className="absolute inset-0 -z-10 bg-[url('/grid-tech.svg')] bg-[length:20px_20px] bg-repeat opacity-10"></div>

      {/* Digital circuit lines */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-5">
        <svg width="100%" height="100%">
          <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M10 10 H90 V90 H10 Z" fill="none" stroke="rgba(0, 255, 255, 0.5)" strokeWidth="0.5" />
            <path d="M30 10 V30 H50 V70 H70 V90" fill="none" stroke="rgba(0, 255, 255, 0.5)" strokeWidth="0.5" />
            <path d="M70 10 V30 H30 V70 H10" fill="none" stroke="rgba(0, 200, 255, 0.5)" strokeWidth="0.5" />
            <circle cx="10" cy="10" r="2" fill="rgba(0, 255, 255, 0.5)" />
            <circle cx="90" cy="90" r="2" fill="rgba(0, 255, 255, 0.5)" />
            <circle cx="10" cy="90" r="2" fill="rgba(0, 200, 255, 0.5)" />
            <circle cx="90" cy="10" r="2" fill="rgba(0, 200, 255, 0.5)" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>

      {/* Pass a prop to Navbar to ensure it stays dark */}
      <Navbar alwaysDark={true} />

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-8 z-10">
        {children}
      </main>
    </div>
  );
}
