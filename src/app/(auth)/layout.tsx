// src/app/(auth)/layout.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 20 }).map((_, i) => ({
    top: `${(i * 7) % 100}%`,
    left: `${(i * 9) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    size: `${Math.floor(Math.random() * 3) + 1}px`,
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));
  
  return (
    <div className="flex min-h-screen flex-col overflow-hidden relative">
      {/* Dark cyber background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0a0b1e] via-[#0f1a2b] to-[#0a192f]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 bg-[url('/grid-tech.svg')] bg-[length:20px_20px] bg-repeat opacity-10"></div>
      
      {/* Digital circuit lines */}
      <div className="absolute inset-0 overflow-hidden opacity-5 -z-10">
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
      
      {/* Moving circles with blur */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[#00d2ff]/5 filter blur-[100px] animate-float" style={{ animationDuration: '30s' }}></div>
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-[#00fff0]/5 filter blur-[100px] animate-float" style={{ animationDuration: '25s', animationDelay: '2s' }}></div>
      <div className="absolute top-[50%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-[#0077ff]/5 filter blur-[100px] animate-float" style={{ animationDuration: '28s', animationDelay: '1s' }}></div>
      
      {/* Cyber particles */}
      <div className="particles absolute inset-0 -z-10">
        {particlePositions.map((pos, i) => (
          <div 
            key={i} 
            className="particle absolute rounded-full"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.size,
              height: pos.size,
              backgroundColor: i % 3 === 0 ? 'rgba(0, 255, 255, 0.7)' : 'rgba(0, 200, 255, 0.7)',
              boxShadow: i % 4 === 0 ? '0 0 5px rgba(0, 255, 255, 0.8)' : 'none',
              opacity: pos.opacity,
              animation: `float ${pos.animationDuration} linear infinite`,
              animationDelay: pos.animationDelay
            }}
          />
        ))}
      </div>
      
      {/* Digital scan line effect - only on client */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-5 -z-10"></div>
      )}
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image 
              src="/sprite-logo.png" 
              alt="AI Sprite Sheet Generator" 
              width={32} 
              height={32}
              className="object-contain" 
            />
          </div>
          <motion.span 
            className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#00fff0] to-[#0077ff]"
            initial={mounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            AI Sprite<span className="font-bold">Sheet Generator</span>
          </motion.span>
        </Link>
        
        <AnimatePresence>
          {mounted && (
            <motion.div 
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-4 text-center text-sm text-white/50 relative z-10">
        <p>
          © {new Date().getFullYear()} AI Sprite Sheet Generator. All rights reserved.
        </p>
      </div>
    </div>
  );
}
