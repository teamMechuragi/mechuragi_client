"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { getMyInfo } from "@/app/api/memberApi";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setUser } = useUser();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // React Strict Mode에서 중복 실행 방지
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (accessToken && refreshToken) {
        // 1. 토큰 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        try {
          // 2. 토큰으로 사용자 정보 가져오기
          console.log("사용자 정보 조회 시도");
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

          // 4. 홈으로 이동
          window.location.href = "/Home";
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다");
          window.location.href = "/login";
        }
      } else {
        alert("로그인 실패 또는 토큰이 없습니다");
        window.location.href = "/login";
      }
    };

    handleOAuthCallback();
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