"use client";

import { usePathname } from "next/navigation";
import Header from "./common/Header";
import Footer from "./common/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 커뮤니티 상세 페이지 체크
  const isCommunityDetail = pathname.startsWith("/community/") && pathname !== "/community";
  
  const hideLayout = pathname === "/" 
    || pathname === "/terms" 
    || pathname === "/signup" 
    || pathname === "/mypage/profile" 
    || pathname === "/settings/details" 
    || pathname === "/mypage/account" 
    || pathname === "/mypage/account/pwchange"
    || pathname === "/mypage/account/withdrawal" 
    || pathname === "/recommend/mood" 
    || pathname === "/recommend/weather"
    || pathname === "/onboarding" 
    || pathname === "/community" 
    || isCommunityDetail;

  const isHome = pathname === "/Home";

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-white">
      {!hideLayout && <Header isHome={isHome} />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer type="nav" />}
    </div>
  );
}