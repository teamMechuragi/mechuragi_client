import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"], // Pretendard 추가
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'scale-in': 'scaleIn 0.8s ease-out forwards',
        'background-pan': 'backgroundPan 20s ease infinite alternate',
        'soft-reveal': 'soft-reveal 0.8s ease-out forwards' // 배경 애니메이션 추가
      },
      keyframes: {
        'soft-reveal': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        backgroundPan: { // 배경 애니메이션 키프레임
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
