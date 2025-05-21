// src/app/(marketing)/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useInView,
  AnimatePresence
} from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PRICING_TIERS, PricingTier, getTierByPriceId } from '@/lib/config/pricing';
import { Check, ExternalLink, ArrowRight, Star, Sparkles, Zap, Github, Grid, Cpu, Layers, Code, Box, Gamepad2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Subscription } from '@/types/db_types';
import { Footer } from '@/components/shared/footer';

// Define prop types for components
interface WorkflowCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  index: number;
}

// --- MouseTrackCard with Cyber Border Glow ---
const MouseTrackCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Springs for animation - always initialize them
  const springConfig = { stiffness: 150, damping: 20 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  // Always create the motion template regardless of hover state
  const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.02 : 1})`;

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isHovered) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;

    setMousePosition({ x: rotateYValue, y: rotateXValue });
  };

  // Update spring animations
  useEffect(() => {
    if (isHovered) {
      rotateX.set(mousePosition.y);
      rotateY.set(mousePosition.x);
    } else {
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [mousePosition, isHovered, rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className || ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", transform }}
    >
      {/* Cyber Border Glow effect - visible when mounted and hovered */}
      <motion.div
        className="absolute -inset-0.5 rounded-[inherit] z-[-1]"
        style={{
          boxShadow: isMounted && isHovered
            ? '0 0 15px 3px rgba(0, 255, 255, 0.7), 0 0 30px 5px rgba(0, 200, 255, 0.3)' 
            : 'none',
          opacity: isMounted && isHovered ? 1 : 0,
          transition: 'box-shadow 0.3s ease-in-out, opacity 0.3s ease-in-out',
          background: isMounted && isHovered 
            ? 'linear-gradient(45deg, rgba(0, 255, 255, 0.3), rgba(0, 100, 255, 0.1), rgba(0, 255, 255, 0.3))' 
            : 'none',
        }}
      />
      {children}
    </motion.div>
  );
};


// Cyberpunk-style Animated Background
const AnimatedBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Only run on client side
  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to viewport center
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1

      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate fixed positions for particles to prevent hydration mismatch
  const particlePositions = Array.from({ length: 30 }).map((_, i) => ({
    top: `${(i * 5) % 100}%`,
    left: `${(i * 7) % 100}%`,
    opacity: 0.3 + ((i % 5) * 0.1),
    size: 1 + (i % 3),
    animationDuration: `${10 + (i % 10)}s`,
    animationDelay: `${(i % 10) * 0.5}s`
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - cyberpunk style */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0b1e] via-[#0f1a2b] to-[#0a192f]" />

      {/* Grid pattern - only add mousemove effect after mount */}
      <div
        className="absolute inset-0 bg-[url('/grid-tech.svg')] bg-[length:20px_20px] bg-repeat opacity-10"
        style={mounted ? {
          transform: `translateX(${mousePosition.x * -5}px) translateY(${mousePosition.y * -5}px)`,
          transition: "transform 1s cubic-bezier(0.075, 0.82, 0.165, 1)"
        } : {}}
      />

      {/* Digital circuit lines */}
      <div className="absolute inset-0 overflow-hidden">
        <svg width="100%" height="100%" className="opacity-10">
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

      {/* Moving circles - large ones with conditional transforms */}
      <div
        className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-[#00d2ff]/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '30s',
          transform: mounted ? `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` : 'none'
        }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-[#00fff0]/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '25s',
          animationDelay: '2s',
          transform: mounted ? `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` : 'none'
        }}
      />
      <div
        className="absolute bottom-[15%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#0077ff]/5 filter blur-[100px] animate-float"
        style={{
          animationDuration: '28s',
          animationDelay: '1s',
          transform: mounted ? `translateX(${mousePosition.x * -25}px) translateY(${mousePosition.y * -25}px)` : 'none'
        }}
      />

      {/* Digital particles */}
      <div className="particles absolute inset-0 z-0">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              top: pos.top,
              left: pos.left,
              width: `${pos.size}px`,
              height: `${pos.size}px`,
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
        <div className="absolute inset-0 pointer-events-none bg-scan-lines opacity-5"></div>
      )}
    </div>
  );
};

// Neon Button for tech theme
const NeonButton: React.FC<{
  children: React.ReactNode,
  className?: string,
  onClick?: () => void,
  disabled?: boolean;
  color?: 'cyan' | 'blue' | 'purple';
}> = ({ children, className, onClick, disabled, color = 'cyan' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Color maps for different neon colors
  const colorMap = {
    cyan: {
      base: 'from-[#00d2ff] to-[#00fff0]',
      glow: '0 0 15px rgba(0, 210, 255, 0.7), 0 0 30px rgba(0, 255, 240, 0.4)'
    },
    blue: {
      base: 'from-[#0077ff] to-[#00d2ff]',
      glow: '0 0 15px rgba(0, 119, 255, 0.7), 0 0 30px rgba(0, 210, 255, 0.4)'
    },
    purple: {
      base: 'from-[#8a2be2] to-[#0077ff]',
      glow: '0 0 15px rgba(138, 43, 226, 0.7), 0 0 30px rgba(0, 119, 255, 0.4)'
    }
  };

  // Always initialize the springs
  const xMotion = useSpring(0, { damping: 20, stiffness: 200 });
  const yMotion = useSpring(0, { damping: 20, stiffness: 200 });

  // Client-side effect
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered || disabled) return;

    const rect = buttonRef.current.getBoundingClientRect();
    // Calculate distance from center
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Scale down movement for subtlety (maximum 10px movement)
    setPosition({
      x: x * 0.2,
      y: y * 0.2
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  // Update springs in useEffect
  useEffect(() => {
    if (isMounted && !disabled) {
      xMotion.set(position.x);
      yMotion.set(position.y);
    } else {
      xMotion.set(0);
      yMotion.set(0);
    }
  }, [position, xMotion, yMotion, isMounted, disabled]);

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{
        x: xMotion,
        y: yMotion,
        transition: "transform 0.1s ease"
      }}
    >
      {/* Neon glow effect */}
      {isMounted && isHovered && !disabled && (
        <motion.div 
          className="absolute inset-0 -z-10 opacity-70"
          style={{
            boxShadow: colorMap[color].glow,
            transition: 'box-shadow 0.3s ease'
          }}
        />
      )}
      
      {/* Button content with gradient border */}
      <div className={`relative z-0 ${disabled ? 'opacity-60' : ''}`}>
        {/* Gradient border */}
        <div className={`absolute inset-0 rounded-md bg-gradient-to-r ${colorMap[color].base} opacity-80 ${isHovered && !disabled ? 'opacity-100' : 'opacity-70'}`}></div>
        
        {/* Inner content */}
        <div className="absolute inset-[1.5px] bg-[#0a0b1e] rounded-[3px] flex items-center justify-center">
          <div className="text-white">{children}</div>
        </div>
        
        {/* Invisible spacer to maintain button size */}
        <div className="opacity-0 py-2 px-4 font-medium">{children}</div>
      </div>
    </motion.button>
  );
};

// Enhanced cyber heading with neon glow
const CyberHeading: React.FC<{
  children: React.ReactNode,
  className?: string,
  glowColor?: string
}> = ({ children, className, glowColor = 'rgba(0, 210, 255, 0.7)' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className || ''}`}
      initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={isMounted && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#00fff0] to-[#0077ff]`}>
        {children}
      </h2>
      {isMounted && (
        <>
          {/* Neon underline */}
          <motion.div
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[#00d2ff] via-[#00fff0] to-[#0077ff] rounded-full"
            initial={{ width: "0%" }}
            animate={isInView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{
              boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`
            }}
          />
          
          {/* Digital glitch effect - only on client */}
          <AnimatePresence>
            {isInView && (
              <motion.div
                className="absolute -inset-1 opacity-30 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.2, 0, 0.3, 0] }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5, 
                  times: [0, 0.2, 0.3, 0.4, 0.5],
                  repeat: 2,
                  repeatDelay: 3
                }}
              >
                <div className="w-full h-full bg-[#00d2ff] mix-blend-screen" 
                  style={{ clipPath: "polygon(0 20%, 100% 0%, 70% 100%, 30% 50%)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

// Workflow card component with tech theme
const WorkflowCard = ({ title, description, link, icon, index }: WorkflowCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <MouseTrackCard className="h-full">
      <Card className="h-full backdrop-blur-lg border border-[#00d2ff]/20 hover:border-[#00d2ff]/40 bg-[#0a0b1e]/80 hover:shadow-lg hover:shadow-[#00d2ff]/20 transition-all duration-300 overflow-hidden">
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="h-full flex flex-col"
        >
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl text-[#00d2ff]">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            <CardDescription className="text-sm text-white/80">{description}</CardDescription>
          </CardContent>
          <CardFooter className="pt-2">
            <Button
              variant="outline"
              className="gap-1 bg-[#0a0b1e]/80 border-[#00d2ff]/40 hover:bg-[#0a0b1e] hover:border-[#00d2ff]/60 hover:text-[#00d2ff] w-full justify-center group"
              asChild
            >
              <Link href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Create in the AI Sprite Sheet Generator</span>
              </Link>
            </Button>
          </CardFooter>
        </motion.div>
      </Card>
    </MouseTrackCard>
  );
};

// --- Pricing section integrated for the homepage ---
interface PricingSectionProps {
  userTierId: string;
  isAuthenticated: boolean;
}

const PricingSection = ({ userTierId, isAuthenticated }: PricingSectionProps) => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isMounted, setIsMounted] = useState(false);
  const switchRef = useRef<HTMLButtonElement>(null);
  const toggleAnimation = useRef(false);
  const [isLoading, setIsLoading] = useState<string | null>(null); // State for button loading

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animate the toggle switch on initial render - only on client
  useEffect(() => {
    if (isMounted && !toggleAnimation.current && switchRef.current) {
      setTimeout(() => {
        setBillingInterval('yearly');
        setTimeout(() => {
          setBillingInterval('monthly');
          toggleAnimation.current = true;
        }, 1500);
      }, 1000);
    }
  }, [isMounted]);

  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    // This should only be called if isAuthenticated is true
    if (!isAuthenticated) return;

    setIsLoading(priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };


  return (
    <>
      <div className="text-center mb-12">
        <CyberHeading className="mb-4 justify-center mx-auto text-center">
          Simple, Transparent Pricing
        </CyberHeading>
        <motion.p
          className="text-lg text-white/70 mb-8"
          initial={isMounted ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Choose the perfect plan for your needs. All plans include access to the AI Sprite Sheet Generator.
        </motion.p>

        {/* Billing toggle */}
        <motion.div
          className="flex items-center justify-center space-x-4 mb-8"
          initial={isMounted ? { opacity: 0 } : { opacity: 1 }}
          whileInView={isMounted ? { opacity: 1 } : {}}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={`text-sm ${billingInterval === 'monthly' ? 'text-white font-medium' : 'text-white/60'}`}>
            Monthly
          </span>
          <button
            ref={switchRef}
            type="button"
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#00d2ff]/20 backdrop-blur-sm transition-colors duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:ring-offset-2 group"
            role="switch"
            aria-checked={billingInterval === 'yearly'}
            onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
          >
            <motion.span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#00d2ff] shadow-md ring-0 transition-all duration-300"
              animate={isMounted ? {
                x: billingInterval === 'yearly' ? 20 : 0
              } : {}}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            />
            <span className="sr-only">{billingInterval === 'monthly' ? 'Switch to yearly billing' : 'Switch to monthly billing'}</span>

            {/* Particle effects on toggle - client-side only */}
            {isMounted && (
              <AnimatePresence>
                {billingInterval === 'yearly' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 top-0"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-[#00fff0]"
                        initial={{
                          x: 0,
                          y: 0,
                          opacity: 1,
                          scale: 0.5 + (i * 0.1)
                        }}
                        animate={{
                          x: ((i % 3) - 1) * 10,
                          y: ((i % 3) - 1) * 10,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{
                          duration: 0.4 + (i * 0.1),
                          ease: "easeOut"
                        }}
                        style={{
                          top: `${(i * 20) + 10}%`,
                          right: `${(i * 10) + 10}%`,
                          boxShadow: '0 0 5px rgba(0, 255, 240, 0.8)'
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </button>
          <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-white font-medium' : 'text-white/60'}`}>
            Yearly
            <motion.span
              className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-[#00d2ff]/20 text-[#00d2ff] font-medium backdrop-blur-sm"
              animate={isMounted ? {
                scale: billingInterval === 'yearly' ? [1, 1.1, 1] : 1
              } : {}}
              transition={{
                duration: 0.4,
                times: [0, 0.5, 1],
                ease: "easeInOut"
              }}
            >
              Save up to 16%
            </motion.span>
          </span>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_TIERS.filter(tier => tier.id !== 'free').map((tier, index) => {
          const price = tier.pricing[billingInterval];
          const isCurrentPlan = userTierId === tier.id;

          // Determine button content and action based on authentication state
          let buttonContent: React.ReactNode;
          let buttonAction: (() => void) | undefined;
          let buttonLink: string | undefined;
          let buttonDisabled = false;
          let buttonColor: 'cyan' | 'blue' | 'purple' = tier.popular ? 'cyan' : 'blue';

          if (!isAuthenticated) {
            // --- Unauthenticated User Logic ---
            buttonContent = "Sign up";
            buttonLink = "/signup";
          } else {
            // --- Authenticated User Logic ---
            if (price.priceId) {
              // Paid Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
              } else {
                buttonContent = isLoading === price.priceId ? 'Processing...' : 'Subscribe';
                buttonAction = () => handleSubscribe(price.priceId!);
                buttonDisabled = isLoading === price.priceId;
              }
            } else {
              // Free Tier
              if (isCurrentPlan) {
                buttonContent = "Current Plan";
                buttonDisabled = true;
              } else {
                buttonContent = "Get Started";
                buttonLink = "/dashboard"; // Authenticated users go to dashboard from free tier
              }
            }
          }

          return (
            <MouseTrackCard key={tier.id} className="h-full">
              <motion.div
                initial={isMounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                whileInView={isMounted ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className="h-full"
                              >
                <Card className={`backdrop-blur-lg relative overflow-hidden h-full flex flex-col
                  ${tier.popular 
                    ? 'border-[#00d2ff]/40 bg-gradient-to-b from-[#0a0b1e]/90 to-[#0a1a2e]/90 shadow-lg shadow-[#00d2ff]/20' 
                    : 'border-[#00d2ff]/20 bg-[#0a0b1e]/80'
                  }
                  hover:shadow-xl hover:shadow-[#00d2ff]/20 transition-all duration-300`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00d2ff] to-[#00fff0] text-[#0a0b1e] text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1 font-bold">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className={`text-xl ${tier.popular ? "text-[#00d2ff]" : "text-white"}`}>{tier.name}</CardTitle>
                    <CardDescription className="text-white/70">{tier.description}</CardDescription>
                    <div className="mt-4">
                      {price.amount ? (
                        <div className="flex items-end">
                          <motion.span
                            className={`text-3xl font-bold ${tier.popular ? "text-[#00d2ff]" : "text-white"}`}
                            key={`${price.amount}-${billingInterval}`}
                            initial={isMounted ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
                            animate={isMounted ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {formatPrice(price.amount)}
                          </motion.span>
                          <span className="text-white/70 ml-1 mb-1">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-white">Free</span>
                      )}

                      {isMounted && billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                        <motion.p
                          className="text-sm text-[#00fff0] mt-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key="yearly-discount"
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          Save {tier.pricing.yearly.discount}% with annual billing
                        </motion.p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-0 flex-grow">
                    <ul className="space-y-2">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-2"
                          initial={isMounted ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                          whileInView={isMounted ? { opacity: 1, x: 0 } : {}}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.05 * i }}
                        >
                          <Check className="h-5 w-5 text-[#00d2ff] shrink-0 mt-0.5" />
                          <span className="text-white/80">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6 mt-6">
                    <NeonButton
                      onClick={buttonAction}
                      disabled={buttonDisabled}
                      color={buttonColor}
                      className="w-full rounded-md py-2 px-4 font-medium"
                    >
                      {buttonLink ? (
                        <Link href={buttonLink} className="flex items-center justify-center w-full h-full">
                          {buttonContent}
                        </Link>
                      ) : (
                        buttonContent
                      )}
                    </NeonButton>
                  </CardFooter>
                </Card>
              </motion.div>
            </MouseTrackCard>
          );
        })}
      </div>
    </>
  );
};


// --- Main Landing Page Component ---
export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -50]);
  const progressBarScaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // State for user and subscription data
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTierId, setUserTierId] = useState<string>('free'); // Default to free

  // Fetch user and subscription data on client-side
  useEffect(() => {
    setMounted(true);

    const checkAuthAndSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (user) {
        // Fetch subscription if user is logged in
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*, prices(id, products(*))')
          .eq('user_id', user.id)
          .in('status', ['trialing', 'active'])
          .maybeSingle();

        if (subscription) {
          const priceId = subscription.prices?.id;
          const { tier } = getTierByPriceId(priceId);
          if (tier) {
            setUserTierId(tier.id);
          }
        } else {
          setUserTierId('free'); // User is logged in but has no active subscription
        }
      } else {
        setUserTierId('free'); // User is not logged in
      }
    };

    checkAuthAndSubscription();
  }, []);

  return (
  <>
    {/* Progress bar - only on client */}
    {mounted && (
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d2ff] via-[#00fff0] to-[#0077ff] z-50 origin-left"
        style={{ 
          scaleX: progressBarScaleX,
          boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)'
        }}
      />
    )}

    {/* Animated background */}
    <AnimatedBackground />

    {/* Hero section */}
    <motion.section
      className="relative py-16 md:py-20 z-10"
      style={mounted ? { opacity: heroOpacity, y: heroY } : {}}
    >
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent relative"
              style={{
                backgroundImage: "linear-gradient(to right, #00d2ff, #00fff0, #0077ff)",
                backgroundSize: "200% 200%",
                ...(mounted ? {
                  animation: "gradientMove 15s ease infinite"
                } : {})
              }}
            >
              AI Sprite Sheet Generator
              
              {/* Tech decorative elements - only on client */}
              {mounted && (
                <>
                  <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d2ff] opacity-70"></div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d2ff] opacity-70"></div>
                  <div className="absolute top-0 right-0 text-xs text-[#00d2ff] opacity-70 font-mono">v1.0.2</div>
                </>
              )}
            </h1>

            <style jsx global>{`
              @keyframes gradientMove {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
              }
              
              @keyframes scanLine {
                0% { transform: translateY(-100%) }
                100% { transform: translateY(100%) }
              }
              
              .bg-scan-lines {
                background: linear-gradient(
                  to bottom,
                  transparent 50%,
                  rgba(0, 210, 255, 0.1) 50%
                );
                background-size: 100% 4px;
                animation: scanLine 8s linear infinite;
              }
            `}</style>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
            initial={mounted ? { opacity: 0 } : { opacity: 1 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Unleash your creativity with the most powerful AI Sprite Sheet Generator for polished, 3D assets for your next game, 3D printing art, and more.
            Powered by Supabase and a flexible credit system.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={mounted ? { opacity: 0 } : { opacity: 1 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <NeonButton color="cyan" className="rounded-md py-2 px-4 font-medium shadow-md hover:shadow-lg transition-shadow">
              <Link href="/dashboard" className="flex items-center">
                <Cpu className="mr-2 h-4 w-4" />
                Create Assets
              </Link>
            </NeonButton>

            <NeonButton
              color="blue"
              className="rounded-md py-2 px-4 font-medium"
              onClick={() => {
                if (mounted) {
                  const pricingSection = document.getElementById('pricing');
                  if (pricingSection) {
                    pricingSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              View Plans
            </NeonButton>
          </motion.div>
        </motion.div>
      </div>

{/* Sprite sheet showcase with your cat sprite example */}
<motion.div 
  className="mt-16 relative max-w-4xl mx-auto"
  initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
  animate={mounted ? { opacity: 1, y: 0 } : {}}
  transition={{ delay: 0.9, duration: 0.8 }}
>
  <div className="bg-[#0a0b1e]/80 border border-[#00d2ff]/30 rounded-lg p-4 backdrop-blur-sm">
    <div className="aspect-video relative rounded overflow-hidden flex items-center justify-center">
      {/* Replace the placeholder with your image */}
      <Image 
        src="/cat-sprite-example.png" 
        alt="AI Generated Cat Sprite Sheet Example" 
        fill
        className="object-contain z-10"
        priority
      />
      
      {/* Overlay text */}
      <div className="absolute bottom-2 right-2 bg-[#0a0b1e]/80 px-3 py-1 rounded border border-[#00d2ff]/30 z-20">
        <p className="text-[#00d2ff] font-mono text-sm">AI Generated Sprite Sheet</p>
      </div>
      
      {/* Tech frame decorations */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00d2ff] z-20"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00d2ff] z-20"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00d2ff] z-20"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00d2ff] z-20"></div>
    </div>
  </div>
</motion.div>

      {/* Bouncing arrow indicator - client-side only */}
      {mounted && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#00d2ff]"
            whileHover={{ scale: 1.2 }}
            style={{
              filter: "drop-shadow(0 0 5px rgba(0, 210, 255, 0.7))"
            }}
          >
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </motion.svg>
        </motion.div>
      )}
    </motion.section>

    {/* Features section with game-style UI */}
<section className="py-12 z-10 relative">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <CyberHeading className="mx-auto justify-center">
        Powerful AI Generation Features
      </CyberHeading>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Feature 1 - Pixel Art Style Card */}
      <motion.div
        className="relative group"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Pixelated border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00d2ff] to-[#00fff0] opacity-70 rounded-lg blur-sm group-hover:opacity-100 transition duration-300"></div>
        
        {/* Main card with pixel corners */}
        <div className="relative bg-[#0a0b1e]/90 p-6 rounded-lg border-2 border-[#00d2ff] overflow-hidden h-full">
          {/* Pixel corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#00d2ff]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00d2ff]"></div>
          
          {/* Pixelated icon container */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-[#00d2ff]/20 rounded-md transform rotate-45"></div>
            <div className="absolute inset-2 bg-[#0a0b1e] rounded-sm transform rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-[#00d2ff]">
                <path d="M3,3 L3,21 L21,21 L21,3 L3,3 Z M5,5 L19,5 L19,19 L5,19 L5,5 Z M7,7 L7,9 L9,9 L9,7 L7,7 Z M11,7 L11,9 L13,9 L13,7 L11,7 Z M15,7 L15,9 L17,9 L17,7 L15,7 Z M7,11 L7,13 L9,13 L9,11 L7,11 Z M11,11 L11,13 L13,13 L13,11 L11,11 Z M15,11 L15,13 L17,13 L17,11 L15,11 Z M7,15 L7,17 L9,17 L9,15 L7,15 Z M11,15 L11,17 L13,17 L13,15 L11,15 Z M15,15 L15,17 L17,17 L17,15 L15,15 Z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-center text-[#00d2ff] font-pixel">Sprite Sheet Generation</h3>
          
          <div className="bg-[#0a1a2e] border border-[#00d2ff]/30 p-3 rounded">
            <p className="text-white/80 text-center">
              Create complete sprite sheets with multiple frames and animations using advanced AI workflows.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature 2 - Pixel Art Style Card */}
      <motion.div
        className="relative group"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Pixelated border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00fff0] to-[#0077ff] opacity-70 rounded-lg blur-sm group-hover:opacity-100 transition duration-300"></div>
        
        {/* Main card with pixel corners */}
        <div className="relative bg-[#0a0b1e]/90 p-6 rounded-lg border-2 border-[#00fff0] overflow-hidden h-full">
          {/* Pixel corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#00fff0]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#00fff0]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#00fff0]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00fff0]"></div>
          
          {/* Pixelated icon container */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-[#00fff0]/20 rounded-md transform rotate-45"></div>
            <div className="absolute inset-2 bg-[#0a0b1e] rounded-sm transform rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-[#00fff0]">
                <path d="M12,0 L24,12 L12,24 L0,12 L12,0 Z M12,4 L20,12 L12,20 L4,12 L12,4 Z M12,7 L12,17 M7,12 L17,12" strokeWidth="1.5" stroke="currentColor" fill="none" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-center text-[#00fff0] font-pixel">3D Asset Creation</h3>
          
          <div className="bg-[#0a1a2e] border border-[#00fff0]/30 p-3 rounded">
            <p className="text-white/80 text-center">
              Generate 3D models and assets for games, 3D printing, and digital art projects with our specialized AI models.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature 3 - Pixel Art Style Card */}
      <motion.div
        className="relative group"
        initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
        whileInView={mounted ? { opacity: 1, y: 0 } : {}}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Pixelated border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#0077ff] to-[#00d2ff] opacity-70 rounded-lg blur-sm group-hover:opacity-100 transition duration-300"></div>
        
        {/* Main card with pixel corners */}
        <div className="relative bg-[#0a0b1e]/90 p-6 rounded-lg border-2 border-[#0077ff] overflow-hidden h-full">
          {/* Pixel corners */}
          <div className="absolute top-0 left-0 w-3 h-3 bg-[#0077ff]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#0077ff]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 bg-[#0077ff]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0077ff]"></div>
          
          {/* Pixelated icon container */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-[#0077ff]/20 rounded-md transform rotate-45"></div>
            <div className="absolute inset-2 bg-[#0a0b1e] rounded-sm transform rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 24 24" className="text-[#0077ff]">
                <path d="M12,2 C17.5228,2 22,6.47715 22,12 C22,17.5228 17.5228,22 12,22 C6.47715,22 2,17.5228 2,12 C2,6.47715 6.47715,2 12,2 Z M12,4 C7.58172,4 4,7.58172 4,12 C4,16.4183 7.58172,20 12,20 C16.4183,20 20,16.4183 20,12 C20,7.58172 16.4183,4 12,4 Z" strokeWidth="1.5" stroke="currentColor" fill="none" />
                <path d="M12,7 L12,12 L16,12" strokeWidth="2" stroke="currentColor" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 text-center text-[#0077ff] font-pixel">Credit System</h3>
          
          <div className="bg-[#0a1a2e] border border-[#0077ff]/30 p-3 rounded">
            <p className="text-white/80 text-center">
              Flexible credit-based system with pay-as-you-go options. Use credits for different generation types based on your needs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</section>

    {/* Rest of your sections... */}
    {/* AI models section */}
    <section className="py-12 z-10 relative" id="workflows">
      {/* Content from previous code */}
    </section>

    {/* How it works section */}
    <section className="py-12 z-10 relative">
      {/* Content from previous code */}
    </section>

    {/* Sprite Sheet Examples Section */}
    <section className="py-1 z-10 relative">
      {/* Content from previous code */}
    </section>

    {/* Pricing section */}
    <section className="py-1 z-10 relative" id="pricing">
      <div className="container mx-auto px-4">
        <PricingSection userTierId={userTierId} isAuthenticated={isAuthenticated} />
      </div>
    </section>

    {/* Tech stack section */}
    <motion.section
      className="py-12 z-10 relative"
      initial={mounted ? { opacity: 0 } : { opacity: 1 }}
      whileInView={mounted ? { opacity: 1 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Content from previous code */}
    </motion.section>

    {/* CTA section */}
    <motion.section
      className="py-12 z-10 relative"
      initial={mounted ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
      whileInView={mounted ? { opacity: 1, y: 0 } : {}}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {/* Content from previous code */}
    </motion.section>
  </>
);
}
