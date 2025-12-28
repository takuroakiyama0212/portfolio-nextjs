/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: "",
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
          border: "var(--color-border)", // slate-200
          input: "var(--color-input)", // slate-200
          ring: "var(--color-ring)", // blue-600
          background: "var(--color-background)", // gray-50
          foreground: "var(--color-foreground)", // slate-800
          surface: "var(--color-surface)", // white
          primary: {
            DEFAULT: "var(--color-primary)", // blue-600
            foreground: "var(--color-primary-foreground)", // white
          },
          secondary: {
            DEFAULT: "var(--color-secondary)", // slate-500
            foreground: "var(--color-secondary-foreground)", // white
          },
          destructive: {
            DEFAULT: "var(--color-destructive)", // red-600
            foreground: "var(--color-destructive-foreground)", // white
          },
          muted: {
            DEFAULT: "var(--color-muted)", // slate-100
            foreground: "var(--color-muted-foreground)", // slate-500
          },
          accent: {
            DEFAULT: "var(--color-accent)", // emerald-500
            foreground: "var(--color-accent-foreground)", // white
          },
          popover: {
            DEFAULT: "var(--color-popover)", // white
            foreground: "var(--color-popover-foreground)", // slate-800
          },
          card: {
            DEFAULT: "var(--color-card)", // white
            foreground: "var(--color-card-foreground)", // slate-800
          },
          success: {
            DEFAULT: "var(--color-success)", // emerald-600
            foreground: "var(--color-success-foreground)", // white
          },
          warning: {
            DEFAULT: "var(--color-warning)", // amber-600
            foreground: "var(--color-warning-foreground)", // white
          },
          error: {
            DEFAULT: "var(--color-error)", // red-600
            foreground: "var(--color-error-foreground)", // white
          },
          text: {
            primary: "var(--color-text-primary)", // slate-800
            secondary: "var(--color-text-secondary)", // slate-500
          },
          brand: {
            primary: {
              DEFAULT: "var(--color-brand-primary)", // gray-800
              foreground: "var(--color-brand-primary-foreground)", // white
            },
            secondary: {
              DEFAULT: "var(--color-brand-secondary)", // blue-500
              foreground: "var(--color-brand-secondary-foreground)", // white
            },
          },
          conversion: {
            DEFAULT: "var(--color-conversion-accent)", // red-400
            foreground: "var(--color-conversion-accent-foreground)", // white
          },
          trust: {
            DEFAULT: "var(--color-trust-builder)", // green-400
            foreground: "var(--color-trust-builder-foreground)", // white
          },
          cta: {
            DEFAULT: "var(--color-cta)", // orange-500
            foreground: "var(--color-cta-foreground)", // white
          },
        },
        fontFamily: {
          headline: ["var(--font-headline)", "Inter", "sans-serif"],
          body: ["var(--font-body)", "Inter", "sans-serif"],
          mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
        },
        spacing: {
          '0': '0px',
          '1': '8px',
          '2': '16px',
          '3': '24px',
          '4': '32px',
          '6': '48px',
          '8': '64px',
          '12': '96px',
          '16': '128px',
        },
        borderRadius: {
          lg: "var(--radius-base)",
          md: "calc(var(--radius-base) - 2px)",
          sm: "calc(var(--radius-base) - 4px)",
        },
        boxShadow: {
          subtle: "var(--shadow-subtle)",
          elevation: "var(--shadow-elevation)",
        },
        transitionDuration: {
          base: "var(--transition-base)",
          slow: "var(--transition-slow)",
        },
        transitionTimingFunction: {
          'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
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
          "fade-in": {
            from: { opacity: "0" },
            to: { opacity: "1" },
          },
          "slide-in-right": {
            from: { transform: "translateX(-20px)", opacity: "0" },
            to: { transform: "translateX(0)", opacity: "1" },
          },
          "slide-up": {
            from: { transform: "translateY(20px)", opacity: "0" },
            to: { transform: "translateY(0)", opacity: "1" },
          },
          "cursor-blink": {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fade-in 0.3s ease-out",
          "slide-in-right": "slide-in-right 0.3s ease-out",
          "slide-up": "slide-up 0.3s ease-out",
          "cursor-blink": "cursor-blink 1s infinite",
        },
      },
    },
    plugins: [],
  }