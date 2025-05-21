// src/components/shared/navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/db_types';
import { LogOut, Settings, User as UserIcon } from 'lucide-react';
import { logout } from '@/lib/actions/auth.actions';
import { CreditsDisplay } from '@/components/shared/credits-display';

export function Navbar({ alwaysDark = false }: { alwaysDark?: boolean }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  const isMarketing = pathname === '/' || pathname === '/pricing';
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUser(data);
      }
      
      setLoading(false);
    }
    
    getUser();
  }, []);
  
  // Determine the background class based on context and scroll state
  const navBackground = isMarketing
    ? scrolled
      ? "bg-[#0a0b1e]/90 backdrop-blur-md border-b border-[#00d2ff]/20" // Scrolled marketing pages
      : "bg-transparent" // Top of marketing pages
    : "bg-[#0a0b1e]/90 backdrop-blur-md border-b border-[#00d2ff]/20"; // App pages
  
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
      navBackground
    )}>
      <div className="container flex items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-auto">
          <Image 
            src="/sprite-logo.png" 
            alt="AI Sprite Sheet Generator" 
            height={50} 
            width={50} 
            className="object-contain" 
            priority
          />
          </div>
          </Link>
        
        <div className="flex items-center gap-4">
          {isMarketing ? (
            // Marketing navigation
            <>
              {!loading && user ? (
                <Link href="/dashboard">
                  <Button className="relative overflow-hidden bg-transparent border border-[#00d2ff]/60 text-white hover:bg-[#00d2ff]/10 transition-colors">
                    <span className="relative z-10">Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:bg-[#00d2ff]/10">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="relative overflow-hidden bg-transparent border border-[#00d2ff]/60 text-white hover:bg-[#00d2ff]/10 transition-colors">
                      <span className="relative z-10">Sign up</span>
                    </Button>
                  </Link>
                </>
              )}
            </>
          ) : (
            // Authenticated navigation
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-[#00d2ff]/10">Dashboard</Button>
              </Link>
              
              {!loading && user && (
                <>
                  {/* Add credits display with glassmorphic style */}
                  <CreditsDisplay />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-[#00d2ff]/10">
                        <Avatar className="h-8 w-8 border border-[#00d2ff]/30">
                          <AvatarImage src={user.avatar_url || ''} alt={user.full_name || 'User'} />
                          <AvatarFallback className="bg-[#00d2ff]/10">{user.full_name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0a0b1e]/90 backdrop-blur-md border border-[#00d2ff]/20 text-white">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          {user.full_name && <p className="font-medium">{user.full_name}</p>}
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-[#00d2ff]/20" />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="w-full flex justify-between items-center hover:bg-[#00d2ff]/10 text-white focus:bg-[#00d2ff]/10 focus:text-white">
                          Account <Settings className="h-4 w-4" />
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <form action={logout} className="w-full">
                          <button type="submit" className="w-full flex justify-between items-center text-white hover:bg-[#00d2ff]/10 focus:bg-[#00d2ff]/10 focus:text-white">
                            Logout <LogOut className="h-4 w-4" />
                          </button>
                        </form>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}