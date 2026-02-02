"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();

  // trailing slash 정규화 (루트 경로 제외)
  const pathname = rawPathname === "/" ? "/" : rawPathname.replace(/\/$/, "");

  useEffect(() => {
    console.log("[ClientLayout] Pathname changed:", pathname);
    console.log("[ClientLayout] Current URL:", window.location.href);
  }, [pathname]);

  // 🔴 OAuth 콜백 경로는 레이아웃 없이 children만 렌더링
  if (pathname.startsWith("/login/oauth2") || pathname.startsWith("/oauth2/callback")) {
    return <>{children}</>;
  }

  // 커뮤니티 상세 페이지 여부
  const isCommunityDetail = pathname.startsWith("/community/") && pathname !== "/community";

  // 1. 헤더를 숨길 경로들 (여기에 숨기고 싶은 경로를 계속 추가하세요)
  const hideHeaderPaths = [
    "/", "/login", "/signup", "/terms", "/onboarding",
    "/menu-select/result", "/settings/details/new", "/settings/details/edit",
    "/settings/details", "/mypage", "/menu-select/ingredients",
    "/menu-select/ingredients/seasoning", "/menu-select/mood", "/menu-select/weather"
  ];

  // 2. 푸터를 숨길 경로들 (여기에 숨기고 싶은 경로를 계속 추가하세요)
  const hideFooterPaths = [
    "/", "/login", "/terms", "/signup", "/settings/details/new",
    "/settings/details/edit", "/settings/details", "/notifications",
    "/mypage/profile", "/mypage/account", "/mypage/account/pwchange",
    "/mypage/account/withdrawal", "/mypage/notifications", "/menu-select/mood",
    "/menu-select/weather", "/menu-select/time", "/menu-select/ingredients",
    "/menu-select/ingredients/seasoning", "/menu-select/Aichat",
    "/menu-select/result", "/calendar/diary/new", "/onboarding"
  ];

  // 최종 노출 여부 판단 (정확히 일치하거나 해당 경로로 시작하는 경우 숨김)
  const shouldHideHeader = hideHeaderPaths.some(path => pathname === path || (path !== "/" && pathname.startsWith(path + "/")));
  const shouldHideFooter = hideFooterPaths.some(path => pathname === path || (path !== "/" && pathname.startsWith(path + "/"))) || isCommunityDetail;

  const isHome = pathname === "/Home";

  // 온보딩/인증 계열은 화면 전환 시 스크롤바 깜빡임 방지용으로 스크롤을 잠금
  // (콘텐츠가 1px이라도 넘치면 overflow-y-auto가 스크롤바를 붙였다 떼는 현상이 발생할 수 있음)
  const lockScrollPaths = ["/onboarding", "/login", "/signup", "/terms"];
  const shouldLockScroll = lockScrollPaths.some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(path + "/"))
  );

  return (
    /* [핵심 수정] 
      1. h-[100dvh]: 화면 높이를 기기 높이에 고정 (위아래 잘림 방지)
      2. max-w-[430px]: 모든 페이지의 너비를 통일
      3. overflow-hidden: 액자 밖으로 내용이 나가지 않게 함
    */
    <div className="flex flex-col h-[100dvh] max-w-sm mx-auto bg-white shadow-2xl relative overflow-hidden border-x border-gray-100">
      
      {/* 1. 헤더 (상단 고정) */}
      {!shouldHideHeader && <Header isHome={isHome} />}

      {/* 2. 메인 컨텐츠 영역 
        - overflow-y-auto: 내용이 길면 여기서만 스크롤이 생김 (푸터/헤더는 고정)
        - custom-scrollbar: globals.css에 설정한 예쁜 스크롤바 적용
      */}
      <main className={`flex-1 w-full relative ${shouldLockScroll ? "overflow-y-hidden" : "overflow-y-auto"}
        ${!shouldHideHeader ? "pt-[60px]" : ""} 
        ${!shouldHideFooter ? "pb-24" : ""}
      `}>
        {children}
      </main>

      {/* 3. 푸터 (하단 고정) */}
      {!shouldHideFooter && <Footer type="nav" />}
    </div>
  );
}