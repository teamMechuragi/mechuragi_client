"use client";

import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react"; // X 아이콘 추가
import { useRouter } from "next/navigation"; // 메인화면 이동 기능 추가
import SocialLogin from "./SocialLogin"; // 소셜 로그인 컴포넌트 
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태 추가
  const router = useRouter(); // Next.js 라우터 추가

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError("");

    if (!isValidEmail(email) || password.length < 1) {
      setError("아이디 또는 비밀번호가 잘못되었습니다. 정확히 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError("아이디 또는 비밀번호가 잘못되었습니다. 정확히 입력해주세요.");
        return;
      }

      console.log("로그인 성공:", data);
      router.push("/");
    } catch {
      setError("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mt-8 relative">
      {/* 로고와 입력 폼 간격 추가 */}
      <div className="mt-6"></div>

      {/* 입력 필드를 감싸는 박스 */}
      <div className="border border-[#BDBDBD] rounded-2xl overflow-hidden w-full relative">
        {/* 이메일 입력 필드 */}
        <div className="flex items-center px-3 py-3 border-b border-gray-300">
          <img src="/icon/user.png" alt="이메일 아이콘" className="w-5 h-5" />
          <input
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField("")}
            className="w-full ml-2 text-gray-600 placeholder-gray-400 focus:outline-none text-base"
          />
        </div>

        {/* 비밀번호 입력 필드 + 비밀번호 보기 버튼 */}
        <div className="flex items-center px-3 py-3 relative">
          <img src="/icon/lock.png" alt="비밀번호 아이콘" className="w-5 h-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField("")}
            className="w-full ml-2 text-gray-600 placeholder-gray-400 focus:outline-none text-base"
          />
          {/* 👁 비밀번호 보기 버튼 */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-500 hover:text-[#3CDCBA] transition-all"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ✅ 로그인 실패 시 오류 메시지 */}
      {error && (
        <p className="text-red-500 text-xs mt-2 text-center">
          {error}
        </p>
      )}

      {/* 로그인 버튼 */}
      <button
        className={`w-full py-3 rounded-[50px] font-bold mt-6 text-base transition-all ${
          isValidEmail(email) && password
            ? "bg-[#3CDCBA] text-white"
            : "bg-[#CCCCCC] text-white"
        }`}
        onClick={handleLogin}
      >
        로그인
      </button>

      {/* 링크 (아이디 찾기 | 비밀번호 찾기 | 회원가입) */}
      <div className="flex justify-center items-center text-sm text-gray-500 mt-4 gap-4">
        <a href="#" className="px-2">아이디 찾기</a>
        <span className="text-gray-300">|</span>
        <a href="#" className="px-2">비밀번호 찾기</a>
        <span className="text-gray-300">|</span>
        <Link href="/terms" className="text-[#3CDCBA] px-2">회원가입</Link>
      </div>

      {/* 간편 로그인 구분선 */}
      <div className="relative w-full flex items-center justify-center py-4 mt-6">
        <div className="absolute w-full border-t border-gray-300"></div>
        <span className="bg-white px-4 text-gray-500 text-sm relative z-10">
          간편 로그인
        </span>
      </div>

      {/* 소셜 로그인 추가 */}
      <SocialLogin />
    </div>
  );
}
