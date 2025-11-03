"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  username: string;
  email: string;
  profileImage?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // ========== 실제 서버 연결 시 사용할 코드 ==========
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          // 토큰이 없으면 로그인 페이지로 리다이렉트
          return;
        }
    
        // 서버에서 사용자 정보 가져오기
        const response = await fetch("http://13.125.127.106/api/user/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (!response.ok) {
          throw new Error("사용자 정보 조회 실패");
        }
    
        const data = await response.json();
    
        // 서버에서 받은 사용자 정보 설정
        const userData = {
          username: data.username,
          email: data.email,
          profileImage: data.profileImageUrl, // 서버에 저장된 이미지 URL
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
    
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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