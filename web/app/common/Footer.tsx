"use client";

import { usePathname, useRouter } from "next/navigation";

interface FooterProps {
  type: "button" | "nav";
  buttonText?: string;
  onButtonClick?: () => void;
  disabled?: boolean;
}

export default function Footer({ type, buttonText, onButtonClick, disabled }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 로그인/회원가입/온보딩/약관 등에서는 푸터 숨김
  const hideFooterPaths = ["/login", "/signup", "/onboarding", "/terms"];
  
  // type이 "button"일 때는 hideFooterPaths 체크 안 함 (버튼은 무조건 표시)
  if (type === "nav" && hideFooterPaths.includes(pathname)) return null;

  // 현재 경로 체크 함수
  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-6 py-4 bg-white">
      {/* 버튼 푸터 */}
      {type === "button" && (
        <button
          className={`w-full py-3 rounded-[50px] font-bold transition-all ${
            disabled ? "bg-[#CCCCCC] text-white cursor-not-allowed" : "bg-[#3CDCBA] text-white"
          }`}
          onClick={onButtonClick}
          disabled={disabled}
        >
          {buttonText}
        </button>
      )}

      {/* 네비게이션 푸터 */}
      {type === "nav" && (
        <div className="flex justify-center gap-10 bg-white py-2">
          <button 
            onClick={() => router.push("/Home")} 
            className="flex items-center justify-center w-16"
          >
            <img 
              src={isActive("/Home") ? "/icon/home-active.png" : "/icon/home.png"} 
              alt="홈" 
              className="w-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/calendar")} 
            className="flex items-center justify-center w-16"
          >
            <img 
              src={isActive("/calendar") ? "/icon/calender-active.png" : "/icon/calender.png"} 
              alt="캘린더" 
              className="w-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/community")} 
            className="flex items-center justify-center w-16"
          >
            <img 
              src={isActive("/community") ? "/icon/community-active.png" : "/icon/community.png"} 
              alt="커뮤니티" 
              className="w-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/mypage")} 
            className="flex items-center justify-center w-16"
          >
            <img 
              src={isActive("/mypage") ? "/icon/mypage-active.png" : "/icon/mypage.png"} 
              alt="마이페이지" 
              className="w-10 object-contain" 
            />
          </button>
        </div>
      )}
    </div>
  );
}