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

  const hideFooterPaths = ["/login", "/signup", "/onboarding", "/terms"];
  
  if (type === "nav" && hideFooterPaths.includes(pathname)) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      {/* 버튼 푸터 */}
      {type === "button" && (
        <div className="px-6 py-4">
          <button
            className={`w-full py-4 rounded-[16px] font-bold transition-all active:scale-[0.98] ${
              disabled ? "bg-[#CCCCCC] text-white cursor-not-allowed" : "bg-[#3CDCBA] text-white"
            }`}
            onClick={onButtonClick}
            disabled={disabled}
          >
            {buttonText}
          </button>
        </div>
      )}

      {/* 네비게이션 푸터 - 아이콘 확대 및 텍스트 제거 */}
      {type === "nav" && (
        <div className="flex justify-around items-center bg-white h-16 px-2 border-t border-gray-50">
          <button 
            onClick={() => router.push("/Home")} 
            className="flex items-center justify-center flex-1 h-full transition-transform active:scale-90"
          >
            <img 
              src={isActive("/Home") ? "/icon/home-active.png" : "/icon/home.png"} 
              alt="홈" 
              className="w-10 h-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/calendar")} 
            className="flex items-center justify-center flex-1 h-full transition-transform active:scale-90"
          >
            <img 
              src={isActive("/calendar") ? "/icon/calender-active.png" : "/icon/calender.png"} 
              alt="캘린더" 
              className="w-10 h-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/community")} 
            className="flex items-center justify-center flex-1 h-full transition-transform active:scale-90"
          >
            <img 
              src={isActive("/community") ? "/icon/community-active.png" : "/icon/community.png"} 
              alt="커뮤니티" 
              className="w-10 h-10 object-contain" 
            />
          </button>
          
          <button 
            onClick={() => router.push("/mypage")} 
            className="flex items-center justify-center flex-1 h-full transition-transform active:scale-90"
          >
            <img 
              src={isActive("/mypage") ? "/icon/mypage-active.png" : "/icon/mypage.png"} 
              alt="마이페이지" 
              className="w-10 h-10 object-contain" 
            />
          </button>
        </div>
      )}
    </div>
  );
}