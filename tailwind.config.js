/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Telegram-inspired dark theme
                telegram: {
                    bg: {
                        primary: '#0E1621',
                        secondary: '#17212B',
                        tertiary: '#1C2733',
                        hover: '#242F3D',
                    },
                    text: {
                        primary: '#FFFFFF',
                        secondary: '#8B9CAE',
                        muted: '#6C7883',
                    },
                    accent: {
                        blue: '#2AABEE',
                        green: '#4CAF50',
                        purple: '#8774E1',
                    },
                    bubble: {
                        sent: '#2B5278',
                        received: '#182533',
                    },
                    border: '#1F2936',
                },
                // Light theme
                light: {
                    bg: {
                        primary: '#FFFFFF',
                        secondary: '#F0F2F5',
                        tertiary: '#E4E6EB',
                        hover: '#E8E8E8',
                    },
                    text: {
                        primary: '#000000',
                        secondary: '#65676B',
                        muted: '#8A8D91',
                    },
                    bubble: {
                        sent: '#E7FDD8',
                        received: '#FFFFFF',
                    },
                    border: '#E5E7EB',
                },
            },
            fontFamily: {
                sans: [
                    'SF Pro Display',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Helvetica Neue',
                    'Arial',
                    'sans-serif',
                ],
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-in-left': 'slideInLeft 0.25s ease-out',
                'slide-in-right': 'slideInRight 0.25s ease-out',
                'slide-up': 'slideUp 0.2s ease-out',
                'bubble-pop': 'bubblePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                'pulse-soft': 'pulseSoft 1.5s ease-in-out infinite',
                'typing': 'typing 1.4s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                bubblePop: {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '50%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '0.4' },
                    '50%': { opacity: '1' },
                },
                typing: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
            },
            boxShadow: {
                'telegram': '0 1px 2px rgba(0, 0, 0, 0.2)',
                'bubble': '0 1px 0.5px rgba(0, 0, 0, 0.13)',
            },
        },
    },
    plugins: [],
}
