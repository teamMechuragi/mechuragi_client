'use client';

import LoginForm from "./components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative flex flex-col w-full h-full bg-[#F2F4F6]">
      {/* [배경] 온보딩의 오로라 - 불투명도를 살짝 낮춰 더 고급스럽게 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[5%] -left-[10%] w-[320px] h-[320px] rounded-full blur-[110px] opacity-[0.08] bg-[#3CDCBA]" />
      </div>

      {/* [상단 컨텐츠] */}
      <div className="relative z-10 px-9 pt-20 pb-10 flex flex-col items-center">
        
        {/* 로고: 박스 형태를 세련되게 다듬음 */}
        <div className="relative w-20 h-20 mb-7 flex items-center justify-center">
          {/* 블러 효과를 조금 더 은은하게 */}
          <div className="absolute inset-0 bg-[#3CDCBA]/15 rounded-full blur-2xl animate-pulse" />
          
          <div className="relative w-full h-full bg-white rounded-[24px] shadow-[0_12px_24px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-center p-4">
            <Image 
              src="/loginLogo.png" 
              alt="Logo" 
              width={48} 
              height={48} 
              className="contrast-[1.02] object-contain"
              priority 
            />
          </div>
        </div>

        {/* 텍스트 섹션: 위계 질서 부여 */}
        <div className="text-center space-y-2">
          {/* 영문: font-black보다는 font-bold나 medium이 더 고급스러움 */}
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#3CDCBA] opacity-90 uppercase">
            LESS THINKING · FULLY PERSONAL
          </p>
          <h1 className="text-[26px] font-black text-[#1a1a1a] leading-tight tracking-[-0.04em]">
            고민은 가볍게 <br />
            취향은 가득히
          </h1>
        </div>
      </div>

      {/* [입력 섹션] */}
      <div className="relative z-10 px-9 flex-1">
        <div className="w-full animate-fade-in-up" style={{ animationDuration: '0.8s' }}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}