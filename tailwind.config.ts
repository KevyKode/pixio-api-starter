import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
            50: "#eef4ff",
            100: "#e0eaff",
            200: "#c7d7fe",
            300: "#a4bcfd",
            400: "#819afa",
            500: "#4F7DF2", // Main tech blue
            600: "#3464e0",
            700: "#2750c9",
            800: "#2342a5",
            900: "#213a83",
            },
    secondary: {
      DEFAULT: "oklch(var(--secondary))",
      foreground: "oklch(var(--secondary-foreground))",
        50: "#ecfefe",
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e3f9",
        400: "#22ccee",
        500: "#06ADC9", // Cyber teal
        600: "#088bab",
        700: "#0e708c",
        800: "#155b73",
        900: "#164b61",
        },
  accent: {
    DEFAULT: "oklch(var(--accent))",
    foreground: "oklch(var(--accent-foreground))",
      50: "#f4f0ff",
      100: "#ebe3ff",
      200: "#d9c9ff",
      300: "#bfa1ff",
      400: "#a378ff",
      500: "#8A49F7", // Electric purple
      600: "#7a32ed",
      700: "#6923ce",
      800: "#5920a9",
      900: "#4a1d88",
        },
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px 0 rgba(112, 104, 244, 0.4)' },
          '50%': { boxShadow: '0 0 30px 5px rgba(112, 104, 244, 0.7)' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 6s ease-in-out infinite",
        "sway": "sway 8s ease-in-out infinite",
        "shimmer": "shimmer 8s ease-in-out infinite",
        "pulse": "pulse 3s ease-in-out infinite",
        "glow": "glow 4s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 0deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
