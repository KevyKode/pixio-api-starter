// src/app/(auth)/login/page.tsx
'use client';

import { LoginForm } from './login-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  return (
    <div className="relative">
      {/* Animated cyber background elements - only visible after mount */}
      {mounted && (
        <>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00d2ff]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00fff0]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%">
              <pattern id="circuit-pattern-small" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M10 10 H40 V40 H10 Z" fill="none" stroke="rgba(0, 210, 255, 0.8)" strokeWidth="0.5" />
                <path d="M20 10 V20 H30 V40" fill="none" stroke="rgba(0, 255, 240, 0.8)" strokeWidth="0.5" />
                <circle cx="10" cy="10" r="1" fill="rgba(0, 210, 255, 0.8)" />
                <circle cx="40" cy="40" r="1" fill="rgba(0, 255, 240, 0.8)" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#circuit-pattern-small)" />
            </svg>
          </div>
        </>
      )}

      {/* Main card with pixel corners */}
      <motion.div
        className="relative"
        initial={mounted ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        animate={mounted ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff] to-[#00fff0] opacity-70 rounded-lg blur-sm"></div>
        
        <Card className="relative w-full bg-[#0a0b1e]/90 border-2 border-[#00d2ff] rounded-lg overflow-hidden">
          {/* Pixel corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00d2ff]"></div>
          
          <CardHeader className="space-y-1 pb-2">
            <div className="w-16 h-16 mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-[#00d2ff]/20 rounded-md transform rotate-45"></div>
              <div className="absolute inset-2 bg-[#0a0b1e] rounded-sm transform rotate-45"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="h-8 w-8 text-[#00d2ff]" />
              </div>
            </div>
            
            <motion.div
              initial={mounted ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl text-center font-pixel bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#00fff0] to-[#0077ff]">
                LOGIN
              </CardTitle>
            </motion.div>
            
            <motion.div
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardDescription className="text-center text-white/70">
                Enter your credentials to access the AI Sprite Sheet Generator
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-[#0a1a2e] border border-[#00d2ff]/30 p-4 rounded-md mb-4">
              <LoginForm />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2 border-t border-[#00d2ff]/20 pt-4">
            <motion.div
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-white/70 text-center"
            >
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#00d2ff] hover:text-[#00fff0] underline-offset-4 hover:underline transition-colors">
                Sign up
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
