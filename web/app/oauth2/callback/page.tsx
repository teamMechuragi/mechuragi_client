"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getMyInfo } from "@/app/api/memberApi";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setUser, refreshPreferences } = useUser();
  const hasProcessed = useRef(false);

  useEffect(() => {
    console.log("🔴 [OAuth] useEffect 시작");
    console.log("🔴 [OAuth] hasProcessed.current:", hasProcessed.current);

    // React Strict Mode에서 중복 실행 방지
    if (hasProcessed.current) {
      console.log("🔴 [OAuth] 이미 처리됨 - early return");
      return;
    }
    hasProcessed.current = true;

    const handleOAuthCallback = async () => {
      console.log("🔴 [OAuth] handleOAuthCallback 시작");
      console.log("🔴 [OAuth] window.location.search:", window.location.search);

      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");
      const errorCode = params.get("error");
      const errorMessage = params.get("message");

      console.log("🔴 [OAuth] accessToken 존재:", !!accessToken);
      console.log("🔴 [OAuth] refreshToken 존재:", !!refreshToken);

      // 백엔드 OAuth2FailureHandler가 에러 코드를 쿼리파라미터로 전달한 경우
      if (errorCode) {
        console.error("🔴 [OAuth] 로그인 실패 - errorCode:", errorCode, "message:", errorMessage);
        if (errorCode === "M002") {
          alert("이미 이메일로 가입된 계정입니다. 이메일과 비밀번호로 로그인해주세요.");
        } else {
          alert(errorMessage || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
        router.push("/login");
        return;
      }

      if (accessToken && refreshToken) {
        // 1. 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("🔴 [OAuth] 토큰 저장 완료");

        // 2. URL에서 토큰 즉시 제거 (브라우저 히스토리에 토큰 노출 방지)
        window.history.replaceState({}, "", window.location.pathname);
        console.log("🔴 [OAuth] URL에서 토큰 제거 완료");

        try {
          // 2. 토큰으로 사용자 정보 가져오기
          console.log("🔴 [OAuth] getMyInfo 호출 시작");
          const data = await getMyInfo();
          console.log("사용자 정보 조회 성공:", data);

          // 3. 사용자 정보 저장
          const userData = {
            id: data.id,
            username: data.nickname,
            email: data.email,
            profileImage: data.profileImageUrl,
            emailVerified: data.emailVerified,
            provider: data.provider,
            role: data.role,
            status: data.status,
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          console.log("OAuth 로그인 성공:", userData);

          // 4. preferences 로드
          await refreshPreferences();

          // 5. 홈으로 이동 (window.location.href 대신 router.push 사용)
          // window.location.href는 풀 리로드 → CloudFront가 루트 index.html(온보딩) fallback → 온보딩+홈 섞임
          router.push("/Home");
        } catch (error) {
          console.error("🔴 [OAuth] getMyInfo 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다");
          router.push("/login");
        }
      } else {
        console.log("🔴 [OAuth] 토큰이 없음 - else 블록 진입");
        alert("로그인 실패 또는 토큰이 없습니다");
        router.push("/login");
      }
    };

    handleOAuthCallback().catch((err) => {
      console.error("🔴 [OAuth] handleOAuthCallback 예외:", err);
    });
  }, [router, setUser]); // 의존성 배열에 router와 setUser 추가

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA] mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}