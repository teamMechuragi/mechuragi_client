'use client';

import LoginForm from "./components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center w-full min-h-[100dvh] bg-[#F2F4F6]">
      <div className="relative flex flex-col w-full max-w-[430px] h-[100dvh] bg-white overflow-hidden shadow-2xl">
        
        {/* [배경] 온보딩의 오로라 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[15%] w-[350px] h-[350px] rounded-full blur-[100px] opacity-[0.1] bg-[#3CDCBA]" />
        </div>

        {/* [상단 컨텐츠] 로고와 문구를 하나의 그룹으로 묶음 */}
        <div className="relative z-10 px-9 pt-24 pb-12 flex flex-col items-center">
          
          {/* [로고 스타일 변경] 단순 이미지가 아닌 원형 유리질(Glassmorphism) 스타일 적용 */}
          <div className="relative w-24 h-24 mb-10 flex items-center justify-center">
            {/* 로고 뒤의 은은한 퍼짐 효과 */}
            <div className="absolute inset-0 bg-[#3CDCBA]/10 rounded-full scale-125 blur-xl animate-pulse" />
            <div className="relative w-full h-full bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex items-center justify-center p-4">
              <Image 
                src="/loginLogo.png" 
                alt="Logo" 
                width={70} 
                height={70} 
                className="contrast-[1.05]"
                priority 
              />
            </div>
          </div>

          {/* [문구] 중앙 정렬로 변경하여 로고와의 일체감 형성 */}
          <div className="text-center space-y-3">
             <p className="text-[12px] font-black tracking-[0.3em] text-[#3CDCBA] opacity-80 uppercase">
              Taste and Record
            </p>
            <h1 className="text-[26px] font-black text-[#1a1a1a] leading-[1.4] tracking-[-0.03em]">
              당신의 미식 기록이<br />
              시작됩니다
            </h1>
          </div>
        </div>

        {/* [입력 섹션] */}
        <div className="relative z-10 px-9 flex-1">
          <div className="w-full animate-fade-in-up">
            <LoginForm />
          </div>
        </div>
        
        <div className="h-12 shrink-0" />
      </div>
    </div>
  );
}