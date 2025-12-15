"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

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
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr/api';
          console.log("사용자 정보 조회 시도:", `${apiUrl}/members/me`);

          const response = await fetch(`${apiUrl}/members/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log("사용자 정보 조회 응답:", response.status, response.statusText);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("API 에러 응답:", errorText);
            throw new Error(`사용자 정보 조회 실패: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          console.log("사용자 정보 조회 성공:", data);

          // 3. 사용자 정보 저장
          const userData = {
            id: data.id,
            username: data.nickname,
            email: data.email,
            emailVerified: data.emailVerified,
            provider: data.provider,
            role: data.role,
            status: data.status,
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          console.log("OAuth 로그인 성공:", userData);

          // 4. 홈으로 이동
          router.replace("/Home");
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다");
          router.replace("/login");
        }
      } else {
        alert("로그인 실패 또는 토큰이 없습니다");
        router.replace("/login");
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