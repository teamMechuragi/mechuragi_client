'use client';

import LoginForm from "./components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    // 1. 최외곽 컨테이너는 화면 중앙 정렬만 담당
    <div className="flex justify-center items-center w-full min-h-[100dvh] bg-[#F2F4F6]">
      
      {/* 2. [수정] h-[100dvh]와 overflow-hidden을 제거하거나 min-h로 변경 */}
      <div className="relative flex flex-col w-full max-w-[430px] min-h-[100dvh] bg-white shadow-2xl">
        
        {/* [배경] 온보딩의 오로라 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[15%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.1] bg-[#3CDCBA]" />
        </div>

        {/* [상단 컨텐츠] 여백 조정 (pb-12 -> pb-8, mb-10 -> mb-6) */}
        <div className="relative z-10 px-9 pt-12 pb-8 flex flex-col items-center">
          
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center"> {/* 로고 크기 살짝 축소 */}
            <div className="absolute inset-0 bg-[#3CDCBA]/10 rounded-full scale-125 blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-white rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-center p-4">
              <Image 
                src="/loginLogo.png" 
                alt="Logo" 
                width={60} 
                height={60} 
                className="contrast-[1.05]"
                priority 
              />
            </div>
          </div>

          <div className="text-center space-y-2">
             <p className="text-[11px] font-black tracking-[0.3em] text-[#3CDCBA] opacity-80 uppercase">
              Taste and Record
            </p>
            <h1 className="text-[22px] font-black text-[#1a1a1a] leading-[1.4] tracking-[-0.03em]">
              당신의 미식 기록이<br />
              시작됩니다
            </h1>
          </div>
        </div>

        {/* [입력 섹션] flex-1을 유지하되 하단 여백 확보 */}
        <div className="relative z-10 px-9 pb-10 flex-1">
          <div className="w-full animate-fade-in-up">
            <LoginForm />
          </div>
        </div>
        
        {/* 하단 여백 최적화 */}
        <div className="h-6 shrink-0" />
      </div>
    </div>
  );
}