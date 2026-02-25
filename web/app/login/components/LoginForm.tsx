'use client';

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import SocialLogin from "./SocialLogin";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { login } from "@/app/api/authApi";
import { ApiError } from "@/app/api/apiClient";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser, refreshPreferences } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.replace('/Home');
    }
  }, []);

  const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email) || password.length < 1) {
      setError('아이디 또는 비밀번호가 잘못되었습니다.');
      return;
    }

    try {
      const data = await login({ email, password });
      localStorage.setItem("accessToken", data.tokens.accessToken);
      localStorage.setItem("refreshToken", data.tokens.refreshToken);

      const userData = {
        id: data.member.id,
        username: data.member.nickname,
        email: data.member.email,
        emailVerified: data.member.emailVerified,
        provider: data.member.provider,
        role: data.member.role,
        status: data.member.status,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      await refreshPreferences();
      router.push("/Home");
    } catch (err) {
      if (err instanceof ApiError && err.code === 'M005') {
        setError('카카오로 가입된 계정입니다. 아래 카카오 로그인을 이용해주세요.');
      } else {
        setError("아이디 또는 비밀번호가 잘못되었습니다.");
      }
    }
  };

  const isButtonActive = isValidEmail(email) && password;

  return (
    <div className="flex flex-col items-center w-full relative">
      
      {/* 1. 이메일 입력 칸 */}
      <div className={`w-full flex items-center px-4 py-4 rounded-[28px] border transition-all duration-300 mb-3 ${
        focusedField === 'email' 
        ? 'border-[#3CDCBA] bg-white shadow-[0_4px_12px_rgba(60,220,186,0.1)]' 
        : 'border-[#E0E0E0] bg-[#F9FAFB]'
      }`}>
        <img 
          src="/icon/user.png" 
          alt="user" 
          className={`w-5 h-5 transition-all duration-300 ${focusedField === 'email' ? 'brightness-0' : 'opacity-30'}`} 
        />
        <input
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField('')}
          className="w-full ml-3 text-gray-700 placeholder-gray-400 focus:outline-none text-base bg-transparent"
        />
      </div>

      {/* 2. 비밀번호 입력 칸 */}
      <div className={`w-full flex items-center px-4 py-4 rounded-[28px] border transition-all duration-300 ${
        focusedField === 'password' 
        ? 'border-[#3CDCBA] bg-white shadow-[0_4px_12px_rgba(60,220,186,0.1)]' 
        : 'border-[#E0E0E0] bg-[#F9FAFB]'
      }`}>
        <img 
          src="/icon/lock.png" 
          alt="lock" 
          className={`w-5 h-5 transition-all duration-300 ${focusedField === 'password' ? 'brightness-0' : 'opacity-30'}`} 
        />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField('')}
          className="w-full ml-3 text-gray-700 placeholder-gray-400 focus:outline-none text-base bg-transparent"
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-gray-400 hover:text-gray-600 transition-colors">
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {error && <p className="text-red-500 text-[12px] font-bold mt-3 animate-shake">{error}</p>}

      {/* 3. 로그인 버튼 - 메인 컬러 적용 */}
      <button
        disabled={!isButtonActive}
        className={`w-full py-3.5 rounded-[45px] font-bold mt-4 text-[17px] transition-all duration-300 active:scale-[0.98] ${
          isButtonActive 
          ? 'bg-[#3CDCBA] text-white shadow-[0_8px_20px_-4px_rgba(60,220,186,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(60,220,186,0.5)]' 
          : 'bg-[#CCCCCC] text-white cursor-not-allowed'
        }`}
        onClick={handleLogin}
      >
        로그인
      </button>

      {/* 4. 보조 메뉴 */}
      <div className="flex justify-center items-center text-[13px] text-gray-400 mt-6 gap-3">
        <Link href="/find-pw" className="hover:text-gray-700 transition-colors">비밀번호 찾기</Link>
      </div>

      {/* 5. 간편 로그인 구분선 */}
      <div className="w-full flex justify-center mt-12 mb-2">
        
        <span className="text-gray-300 text-[11px] font-bold tracking-widest uppercase">SNS LOGIN</span>
        
      </div>

      <SocialLogin />

      {/* 6. 회원가입 독립 배치 */}
      <div className="mt-6 text-center pb-6">
        <span className="text-[14px] text-gray-400">아직 계정이 없으신가요?</span>
        <Link href="/terms" className="ml-3 text-[14px] font-bold text-[#191F28] border-b-2 border-[#191F28] pb-0.5 hover:text-[#3CDCBA] hover:border-[#3CDCBA] transition-all">
          회원가입하기
        </Link>
      </div>
    </div>
  );
}