"use client";

import { usePathname } from "next/navigation";
import Header from "./common/Header";
import Footer from "./common/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 커뮤니티 상세 페이지 여부
  const isCommunityDetail = pathname.startsWith("/community/") && pathname !== "/community";

  // 1. 헤더를 숨길 경로들 (여기에 숨기고 싶은 경로를 계속 추가하세요)
  const hideHeaderPaths = [
    "/signup",         // 회원가입
    "/onboarding",     // 온보딩
    "/recommend/result",
    "/settings/details/new",
    "/settings/details/edit",
    "/mypage",
    "/recommend/ingredients",
    "/recommend/ingredients/seasoning"
  ];

  // 2. 푸터를 숨길 경로들 (여기에 숨기고 싶은 경로를 계속 추가하세요)
  const hideFooterPaths = [
    "/",                   // 로그인
    "/terms",              // 약관
    "/signup",             // 회원가입
    "/settings/details/new",   // 상세 설정 (새로 만들기)
    "/settings/details/edit",  // 상세 설정 (수정)
    "/notifications",
    "/mypage/profile",
    "/mypage/account",
    "/mypage/account/pwchange",
    "/mypage/account/withdrawal",
    "/mypage/notifications",
    "/recommend/mood",
    "/recommend/weather",
    "/recommend/time",
    "/recommend/ingredients",
    "/recommend/ingredients/seasoning",
    "/recommend/Aichat",
    "/recommend/result",
    "/calendar/diary/new",
    "/onboarding"
  ];

  // 최종 노출 여부 판단
  const shouldHideHeader = hideHeaderPaths.includes(pathname);
  const shouldHideFooter = hideFooterPaths.includes(pathname) || isCommunityDetail;

  const isHome = pathname === "/Home";

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto bg-white shadow-2xl shadow-black/5 relative overflow-x-hidden">
      
      {/* 1. 헤더 렌더링 */}
      {!shouldHideHeader && <Header isHome={isHome} />}

      {/* 2. 메인 컨텐츠 영역 */}
      <main className={`flex-1 w-full 
        ${!shouldHideHeader ? "pt-[60px]" : ""} 
        ${!shouldHideFooter ? "pb-24" : ""}
      `}>
        {children}
      </main>

      {/* 3. 푸터 렌더링 */}
      {!shouldHideFooter && <Footer type="nav" />}
    </div>
  );
}