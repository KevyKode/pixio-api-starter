// src/lib/config/pricing.ts
export interface PricingTier {
  id: 'free' | 'basic' | 'indie' | 'studio';
  name: string;
  description: string;
  features: string[];
  popular: boolean;
  credits: number;
  pricing: {
    monthly: {
      priceId: string | null;
      amount: number | null;
    };
    yearly: {
      priceId: string | null;
      amount: number | null;
      discount?: number;
    };
  };
}

// Read price IDs from environment variables - using your current env var names
export const STRIPE_PRICE_IDS = {
  // Map the old env var names to our new tier structure
  BASIC_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
  BASIC_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  INDIE_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '', // Temporarily use PRO for both
  INDIE_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || '',
  STUDIO_MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY || '',
  STUDIO_YEARLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY || '',
  // Credit pack price IDs
  CREDIT_PACK_1000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_1000 || '',
  CREDIT_PACK_2500: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_2500 || '',
  CREDIT_PACK_5000: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDIT_PACK_5000 || '',
};

// Define credit packs for purchase
export const CREDIT_PACKS = [
  {
    id: 'credits-1000',
    name: '1000 Credits',
    description: 'Top up with a small credit pack',
    amount: 1000,
    price: 1000, // $10 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_1000,
  },
  {
    id: 'credits-2500',
    name: '2500 Credits',
    description: 'Best value for regular users',
    amount: 2500,
    price: 2500, // $25 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_2500,
  },
  {
    id: 'credits-5000',
    name: '5000 Credits',
    description: 'Best value for power users',
    amount: 5000,
    price: 5000, // $50 in cents
    priceId: STRIPE_PRICE_IDS.CREDIT_PACK_5000,
  }
];

// Check if price IDs are configured
const isPricingConfigured = () => {
  return (
    STRIPE_PRICE_IDS.BASIC_MONTHLY &&
    STRIPE_PRICE_IDS.BASIC_YEARLY &&
    STRIPE_PRICE_IDS.INDIE_MONTHLY &&
    STRIPE_PRICE_IDS.INDIE_YEARLY &&
    STRIPE_PRICE_IDS.STUDIO_MONTHLY &&
    STRIPE_PRICE_IDS.STUDIO_YEARLY
  );
};

// Show warning if price IDs are not configured in production
if (process.env.NODE_ENV === 'production' && !isPricingConfigured()) {
  console.warn('Warning: Stripe price IDs are not configured in environment variables.');
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Pay as you go for occasional use',
    credits: 500, // 500 initial credits
    features: [
      '500 starter credits',
      'Access to 1 basic AI model',
      'Pay-as-you-go credit packs',
      '1 concurrent generation job',
      'Standard resolution sprites',
      'Community support'
    ],
    popular: false,
    pricing: {
      monthly: {
        priceId: STRIPE_PRICE_IDS.BASIC_MONTHLY || null,
        amount: 900, // $9/month
      },
      yearly: {
        priceId: STRIPE_PRICE_IDS.BASIC_YEARLY || null,
        amount: 9900, // $99/year
        discount: 8,  // 8% discount compared to monthly
      },
    },
  },
  {
    id: 'indie',
    name: 'Indie',
    description: 'Perfect for individual creators and small projects',
    credits: 2000, // 2000 credits for indie tier
    features: [
      '2,000 credits per month',
      'Access to 3 AI sprite models',
      'Private projects',
      '2 concurrent generation jobs',
      'Download in PNG format',
      'Standard resolution sprites',
      'Email support'
    ],
    popular: true,
    pricing: {
      monthly: {
        priceId: STRIPE_PRICE_IDS.INDIE_MONTHLY || null,
        amount: 1900, // $19/month
      },
      yearly: {
        priceId: STRIPE_PRICE_IDS.INDIE_YEARLY || null,
        amount: 19900, // $199/year
        discount: 12,  // 12% discount compared to monthly
      },
    },
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'For professional game developers and studios',
    credits: 6000, // 6000 credits for studio tier
    features: [
      '6,000 credits per month',
      'Unlimited access to all 5 AI models',
      'Priority generation queue',
      '5 concurrent generation jobs',
      'Download in multiple formats (PNG, SVG, Sheets)',
      'High-resolution sprites',
      'Priority support'
    ],
    popular: false,
    pricing: {
      monthly: {
        priceId: STRIPE_PRICE_IDS.STUDIO_MONTHLY || null,
        amount: 4900, // $49/month
      },
      yearly: {
        priceId: STRIPE_PRICE_IDS.STUDIO_YEARLY || null,
        amount: 49900, // $499/year
        discount: 15,  // 15% discount compared to monthly
      },
    },
  },
  // Keep the free tier in the array but hidden from display
  // This ensures backward compatibility with existing code
  {
    id: 'free',
    name: 'Free',
    description: 'Essential features for individuals',
    credits: 0,
    features: [
      'Basic dashboard access',
      'Limited access to features',
      'Community support',
      '0 credits per month',
    ],
    popular: false,
    pricing: {
      monthly: {
        priceId: null,
        amount: null,
      },
      yearly: {
        priceId: null,
        amount: null,
      },
    },
  },
];

// Helper function to get a tier by ID
export function getTierById(id: string): PricingTier | undefined {
  return PRICING_TIERS.find(tier => tier.id === id);
}

// Build a mapping of price IDs to tier information for easy lookup
export type PriceIdInfo = {
  tierId: 'free' | 'basic' | 'indie' | 'studio';  // Updated tier IDs
  interval: 'monthly' | 'yearly';
};

// Create a map of price IDs to tier info
export const PRICE_ID_MAP: Record<string, PriceIdInfo> = {};

// Populate the price ID map
PRICING_TIERS.forEach(tier => {
  // Add monthly price ID if exists
  if (tier.pricing.monthly.priceId) {
    PRICE_ID_MAP[tier.pricing.monthly.priceId] = {
      tierId: tier.id as 'free' | 'basic' | 'indie' | 'studio',
      interval: 'monthly'
    };
  }

  // Add yearly price ID if exists
  if (tier.pricing.yearly.priceId) {
    PRICE_ID_MAP[tier.pricing.yearly.priceId] = {
      tierId: tier.id as 'free' | 'basic' | 'indie' | 'studio',
      interval: 'yearly'
    };
  }
});

export function getVisiblePricingTiers(): PricingTier[] {
  return PRICING_TIERS.filter(tier => tier.id !== 'free');
}

// Helper function to get tier info from a price ID
export function getTierByPriceId(priceId: string | null | undefined): { 
  tier: PricingTier | undefined, 
  interval: 'monthly' | 'yearly' | undefined 
} {
  if (!priceId) {
    // Default to free tier with no interval
    const freeTier = getTierById('free');
    return { tier: freeTier, interval: undefined };
  }

  const priceInfo = PRICE_ID_MAP[priceId];

  if (!priceInfo) {
    // Price ID not found in our configuration
    return { tier: undefined, interval: undefined };
  }

  const tier = getTierById(priceInfo.tierId);

  return { 
    tier,
    interval: priceInfo.interval
  };
}
