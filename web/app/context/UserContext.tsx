"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  emailVerified?: boolean;
  provider?: string;
  role?: string;
  status?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 사용자 정보 조회 함수
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        // 토큰이 없으면 localStorage에서 가져오기 (오프라인용)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        return;
      }

      // localStorage에서 memberId 가져오기
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        return;
      }

      const currentUser = JSON.parse(storedUser);
      const memberId = currentUser.id;

      if (!memberId) {
        console.error("memberId가 없습니다.");
        return;
      }

      // ✅ 수정: 올바른 엔드포인트로 사용자 정보 조회
      const response = await fetch(
        `https://mechuragi.kro.kr/api/members/${memberId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // 401 에러면 토큰 만료 → 로그아웃 처리
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }
        throw new Error("사용자 정보 조회 실패");
      }

      const data = await response.json();

      // ✅ API 명세서 응답 구조에 맞게 매핑
      const userData: User = {
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
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      
      // 에러 시 localStorage의 정보라도 사용
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  };

  // 초기 로드 시 사용자 정보 가져오기
  useEffect(() => {
    const initUser = async () => {
      await fetchUserProfile();
      setIsInitialized(true);
    };

    initUser();
  }, []);

  // refreshUser 함수 추가 (다른 컴포넌트에서 호출 가능)
  const refreshUser = async () => {
    await fetchUserProfile();
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}