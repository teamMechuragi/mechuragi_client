"use client";

import { usePathname } from "next/navigation";
import Header from "./common/Header";
import Footer from "./common/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 커뮤니티 상세 페이지 체크
  const isCommunityDetail = pathname.startsWith("/community/") && pathname !== "/community";
  
  // 헤더와 푸터를 숨길 경로들
  const hideLayout = [
    "/terms", "/signup", "/notifications", "/mypage/profile",
    "/settings/details", "/mypage/account", "/mypage/account/pwchange",
    "/mypage/account/withdrawal", "/mypage/notifications", "/recommend/mood",
    "/recommend/weather", "/recommend/time", "/recommend/ingredients",
    "/recommend/Aichat", "/recommend/result", "/onboarding", "/community",
    "/calendar", "/calendar/gallery", "/calendar/diary/new"
  ].includes(pathname) || isCommunityDetail;

  const isHome = pathname === "/Home";

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-white shadow-lg">
      {/* 1. 헤더 렌더링 */}
      {!hideLayout && <Header isHome={isHome} />}

      {/* 2. 메인 컨텐츠 영역 */}
      <main className={`flex-1 ${!hideLayout ? "pt-14 pb-20" : ""}`}>
        {/* !hideLayout일 때(헤더가 있을 때)만 pt-14(56px)를 주어 
          컨텐츠가 헤더 아래로 파고드는 것을 방지합니다. 
          pb-20은 푸터 높이를 고려한 여백입니다.
        */}
        {children}
      </main>

      {/* 3. 푸터 렌더링 */}
      {!hideLayout && <Footer type="nav" />}
    </div>
  );
}