"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

export default function OAuthSuccess() {
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
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
          const response = await fetch("http://13.125.127.106/api/user/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            // 3. 사용자 정보 저장
            const userData = {
              username: data.username || data.nickname,
              email: data.email,
            };

            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            // 4. 홈으로 이동
            router.push("/");
          } else {
            alert("사용자 정보를 가져오는데 실패했습니다");
            router.push("/login");
          }
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다");
          router.push("/login");
        }
      } else {
        alert("로그인 실패 또는 토큰 없음");
        router.push("/login");
      }
    };

    handleOAuthCallback();
  }, [router, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA] mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중입니다...</p>
      </div>
    </div>
  );
}