// src/components/pricing/pricing-client.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';
import { PRICING_TIERS, PricingTier, CREDIT_PACKS } from '@/lib/config/pricing';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

// Component for toggling between monthly and yearly billing
function BillingToggle({ 
  billingInterval, 
  setBillingInterval 
}: { 
  billingInterval: 'monthly' | 'yearly',
  setBillingInterval: (interval: 'monthly' | 'yearly') => void 
}) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <span className={`text-sm ${billingInterval === 'monthly' ? 'text-white font-medium' : 'text-white/60'}`}>
        Monthly
      </span>
      <button
        type="button"
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#00d2ff]/20 backdrop-blur-sm transition-colors duration-300 ease-spring focus:outline-none focus:ring-2 focus:ring-[#00d2ff]/30 focus:ring-offset-2 group"
        role="switch"
        aria-checked={billingInterval === 'yearly'}
        onClick={() => setBillingInterval(billingInterval === 'monthly' ? 'yearly' : 'monthly')}
      >
        <motion.span
          aria-hidden="true"
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#00d2ff] shadow-md ring-0 transition-all duration-300"
          animate={{
            x: billingInterval === 'yearly' ? 20 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
        />
      </button>
      <span className={`text-sm flex items-center gap-1.5 ${billingInterval === 'yearly' ? 'text-white font-medium' : 'text-white/60'}`}>
        Yearly
        <motion.span
          className="inline-block px-1.5 py-0.5 text-xs rounded-full bg-[#00d2ff]/20 text-[#00d2ff] font-medium backdrop-blur-sm"
          animate={{
            scale: billingInterval === 'yearly' ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 0.4,
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
        >
          Save up to 15%
        </motion.span>
      </span>
    </div>
  );
}

export interface PricingClientProps { 
  initialBillingInterval: 'monthly' | 'yearly';
  pricingTiers: PricingTier[];
  userTierId: string;
  isAuthenticated: boolean;
  creditPacks?: typeof CREDIT_PACKS; // Make credit packs optional
}

export function PricingClient({ 
  initialBillingInterval,
  pricingTiers,
  userTierId,
  isAuthenticated,
  creditPacks = CREDIT_PACKS // Default to imported CREDIT_PACKS
}: PricingClientProps) {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>(initialBillingInterval);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  // Function to handle subscription with redirect checkout
  const handleSubscribe = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setIsLoading(priceId);
    
    try {
      console.log(`Creating checkout session for price: ${priceId}`);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        console.log(`Redirecting to checkout: ${data.url}`);
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error(error.message || 'Something went wrong');
      setIsLoading(null);
    }
  };

  // Function to handle credit pack purchase
  const handleCreditPackPurchase = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setIsLoading(priceId);
    
    try {
      console.log(`Creating checkout session for credit pack: ${priceId}`);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, mode: 'payment' }), // Use payment mode for one-time purchase
      });
      
      const data = await response.json();
      
      if (response.ok && data.url) {
        console.log(`Redirecting to checkout: ${data.url}`);
        window.location.href = data.url;
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
      <BillingToggle 
        billingInterval={billingInterval} 
        setBillingInterval={setBillingInterval} 
      />
      
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingTiers.map((tier, index) => {
          const price = tier.pricing[billingInterval];
          const isCurrentPlan = userTierId === tier.id;
          // Use fixed colors instead of dynamic string interpolation
          const tierColorClass = tier.popular 
            ? "text-[#00d2ff] border-[#00d2ff]" 
            : index === 0 
              ? "text-[#00fff0] border-[#00fff0]" 
              : "text-[#0077ff] border-[#0077ff]";
          
          const tierBgClass = tier.popular 
            ? "bg-[#00d2ff]" 
            : index === 0 
              ? "bg-[#00fff0]" 
              : "bg-[#0077ff]";
          
          const tierBorderClass = tier.popular 
            ? "border-[#00d2ff]" 
            : index === 0 
              ? "border-[#00fff0]" 
              : "border-[#0077ff]";
          
          const gradientClass = tier.popular 
            ? "from-[#00d2ff] to-[#00fff0]" 
            : index === 0 
              ? "from-[#00fff0] to-[#0077ff]" 
              : "from-[#0077ff] to-[#00d2ff]";
          
          return (
            <motion.div 
              key={tier.id}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              {/* Pixelated border effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${gradientClass} opacity-70 rounded-lg blur-sm group-hover:opacity-100 transition duration-300`}></div>
              
              {/* Main card with pixel corners */}
              <div className={`relative bg-[#0a0b1e]/90 rounded-lg border-2 ${tierBorderClass} overflow-hidden h-full`}>
                {/* Pixel corners */}
                <div className={`absolute top-0 left-0 w-3 h-3 ${tierBgClass}`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 ${tierBgClass}`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 ${tierBgClass}`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${tierBgClass}`}></div>
                
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00d2ff] to-[#00fff0] text-[#0a0b1e] text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1 font-bold z-10">
                    <Star className="h-3 w-3" />
                    <span>Popular</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className={`text-xl font-bold mb-2 text-center ${tierColorClass.split(' ')[0]} font-pixel`}>{tier.name}</h3>
                  <p className="text-white/70 mb-4 text-center">{tier.description}</p>
                  
                  {/* Price display in game UI style */}
                  <div className={`mb-6 bg-[#0a1a2e] border border-${tierBorderClass.split(' ')[0]}/30 p-3 rounded text-center`}>
                    {price.amount ? (
                      <div>
                        <span className={`text-3xl font-bold ${tierColorClass.split(' ')[0]}`}>
                          {formatPrice(price.amount)}
                        </span>
                        <span className="text-white/70 ml-1">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                        
                        {billingInterval === 'yearly' && tier.pricing.yearly.discount && (
                          <p className="text-sm text-[#00fff0] mt-1">
                            Save {tier.pricing.yearly.discount}% with annual billing
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-3xl font-bold text-white">Free</span>
                    )}
                  </div>
                  
                  {/* Features list in game UI style */}
                  <div className={`mb-6 bg-[#0a1a2e] border border-${tierBorderClass.split(' ')[0]}/30 p-3 rounded`}>
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <motion.li 
                          key={featureIndex} 
                          className="flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.05 * featureIndex }}
                        >
                          <Check className={`h-5 w-5 ${tierColorClass.split(' ')[0]} shrink-0 mt-0.5`} />
                          <span className="text-white/80">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Action button with pixel art style */}
                  {price.priceId ? (
                    isCurrentPlan && billingInterval === initialBillingInterval ? (
                      <div className={`w-full py-2 px-4 bg-[#0a1a2e] border-2 border-${tierBorderClass.split(' ')[0]}/50 text-white/50 rounded text-center font-pixel`}>
                        CURRENT PLAN
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSubscribe(price.priceId!)}
                        className={`w-full py-2 px-4 ${tierBgClass} text-[#0a0b1e] font-bold rounded hover:opacity-90 transition-colors font-pixel`}
                        disabled={isLoading === price.priceId}
                      >
                        {isLoading === price.priceId ? 'PROCESSING...' : (isCurrentPlan ? 'CHANGE PLAN' : 'SUBSCRIBE')}
                      </button>
                    )
                  ) : (
                    <Link 
                      href={isCurrentPlan ? '/dashboard' : (isAuthenticated ? '/dashboard' : '/signup')}
                      className={`block w-full py-2 px-4 ${tierBgClass} text-[#0a0b1e] font-bold rounded hover:opacity-90 transition-colors text-center font-pixel`}
                    >
                      {isCurrentPlan ? 'DASHBOARD' : 'GET STARTED'}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Credit Packs Section */}
      {creditPacks && creditPacks.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[#00d2ff]/20">
          <h3 className="text-2xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] to-[#00fff0] font-pixel">
            ADDITIONAL CREDIT PACKS
          </h3>
          <p className="text-white/70 text-center mb-8">
            Need more credits? Purchase additional credit packs anytime
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {creditPacks.map((pack, index) => {
              // Use fixed colors instead of dynamic string interpolation
              const packColorClass = index === 0 
                ? "text-[#00d2ff] border-[#00d2ff]" 
                : index === 1 
                  ? "text-[#00fff0] border-[#00fff0]" 
                  : "text-[#0077ff] border-[#0077ff]";
              
              const packBgClass = index === 0 
                ? "bg-[#00d2ff]" 
                : index === 1 
                  ? "bg-[#00fff0]" 
                  : "bg-[#0077ff]";
              
              const packBorderClass = index === 0 
                ? "border-[#00d2ff]" 
                : index === 1 
                  ? "border-[#00fff0]" 
                  : "border-[#0077ff]";
              
              const packGradientClass = index === 0 
                ? "from-[#00d2ff] to-[#00fff0]" 
                : index === 1 
                  ? "from-[#00fff0] to-[#0077ff]" 
                  : "from-[#0077ff] to-[#00d2ff]";
              
              return (
                <motion.div 
                  key={pack.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  {/* Pixelated border effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${packGradientClass} opacity-70 rounded-lg blur-sm group-hover:opacity-100 transition duration-300`}></div>
                  
                  {/* Main card with pixel corners */}
                  <div className={`relative bg-[#0a0b1e]/90 p-6 rounded-lg border-2 ${packBorderClass} overflow-hidden`}>
                    {/* Pixel corners */}
                    <div className={`absolute top-0 left-0 w-3 h-3 ${packBgClass}`}></div>
                    <div className={`absolute top-0 right-0 w-3 h-3 ${packBgClass}`}></div>
                    <div className={`absolute bottom-0 left-0 w-3 h-3 ${packBgClass}`}></div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${packBgClass}`}></div>
                    
                    <h4 className={`text-xl font-bold mb-1 text-center ${packColorClass.split(' ')[0]} font-pixel`}>{pack.name}</h4>
                    <p className="text-white/70 text-sm mb-4 text-center">{pack.description}</p>
                    
                    <div className={`mb-5 bg-[#0a1a2e] border border-${packBorderClass.split(' ')[0]}/30 p-3 rounded text-center`}>
                      <div className={`text-2xl font-bold ${packColorClass.split(' ')[0]}`}>{formatPrice(pack.price)}</div>
                    </div>
                    
                    <button 
                      onClick={() => handleCreditPackPurchase(pack.priceId)}
                      className={`w-full py-2 px-4 ${packBgClass} text-[#0a0b1e] font-bold rounded hover:opacity-90 transition-colors font-pixel`}
                      disabled={isLoading === pack.priceId || !isAuthenticated}
                    >
                      {!isAuthenticated ? (
                        <Link href="/login">SIGN IN</Link>
                      ) : isLoading === pack.priceId ? (
                        'PROCESSING...'
                      ) : (
                        'PURCHASE'
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
