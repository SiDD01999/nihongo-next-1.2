/** @type {import('tailwindcss').Config} */
module.exports = {
        darkMode: ["class"],
        content: [
                "./src/**/*.{js,jsx,ts,tsx}",
                "./public/index.html"
        ],
        safelist: [
                'bg-white',
                'bg-red-500',
                'backdrop-blur-xl',
        ],
        theme: {
                extend: {
                        fontFamily: {
                                sans: ['Noto Sans JP', 'sans-serif'],
                                serif: ['Cormorant Garamond', 'serif'],
                        },
                        borderRadius: {
                                lg: 'var(--radius)',
                                md: 'calc(var(--radius) - 2px)',
                                sm: 'calc(var(--radius) - 4px)'
                        },
                        colors: {
                                background: 'hsl(var(--background) / <alpha-value>)',
                                foreground: 'hsl(var(--foreground) / <alpha-value>)',
                                card: {
                                        DEFAULT: 'hsl(var(--card) / <alpha-value>)',
                                        foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
                                        foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
                                },
                                primary: {
                                        DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
                                        foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
                                        light: 'hsl(var(--primary-light) / <alpha-value>)'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
                                        foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
                                        foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
                                        foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
                                        foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
                                },
                                success: {
                                        DEFAULT: 'hsl(var(--success) / <alpha-value>)',
                                        foreground: 'hsl(var(--success-foreground) / <alpha-value>)'
                                },
                                border: 'hsl(var(--border) / <alpha-value>)',
                                input: 'hsl(var(--input) / <alpha-value>)',
                                ring: 'hsl(var(--ring) / <alpha-value>)',
                                sakura: 'hsl(var(--sakura-pink) / <alpha-value>)',
                                bamboo: 'hsl(var(--bamboo-green) / <alpha-value>)'
                        },
                        boxShadow: {
                                'sm': 'var(--shadow-sm)',
                                'DEFAULT': 'var(--shadow)',
                                'md': 'var(--shadow-md)',
                                'lg': 'var(--shadow-lg)',
                        },
                        keyframes: {
                                'accordion-down': {
                                        from: { height: '0' },
                                        to: { height: 'var(--radix-accordion-content-height)' }
                                },
                                'accordion-up': {
                                        from: { height: 'var(--radix-accordion-content-height)' },
                                        to: { height: '0' }
                                },
                                'fade-in': {
                                        from: { opacity: '0', transform: 'translateY(10px)' },
                                        to: { opacity: '1', transform: 'translateY(0)' }
                                },
                                'slide-in': {
                                        from: { transform: 'translateX(100%)' },
                                        to: { transform: 'translateX(0)' }
                                },
                                'float': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                }
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                'fade-in': 'fade-in 0.6s ease-out',
                                'slide-in': 'slide-in 0.5s ease-out',
                                'float': 'float 3s ease-in-out infinite'
                        }
                }
        },
        plugins: [require("tailwindcss-animate")],
};