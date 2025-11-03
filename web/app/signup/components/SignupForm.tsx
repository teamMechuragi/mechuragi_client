"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  form: { email: string; username: string; password: string; confirmPassword: string };
  onFormChange: (name: string, value: string) => void;
  errors: Partial<Record<keyof SignupFormProps["form"], string>>;
  emailChecked: boolean;
  usernameChecked: boolean;
  onEmailCheck: () => Promise<void>;
  onUsernameCheck: () => Promise<void>;
  isLoadingNickname?: boolean; // 추가
}

export default function SignupForm({ 
  form, 
  onFormChange, 
  errors,
  emailChecked,
  usernameChecked,
  onEmailCheck,
  onUsernameCheck,
  isLoadingNickname = false // 추가
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* 이메일 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${errors.email ? "text-red-500" : "text-gray-600"}`}>
          이메일
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              className={`w-full border-b py-2 focus:outline-none transition-all ${
                errors.email ? "border-red-500" : emailChecked ? "border-[#3CDCBA]" : "border-gray-300"
              }`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            {emailChecked && !errors.email && (
              <p className="text-[#3CDCBA] text-xs mt-1">✓ 사용 가능한 이메일입니다.</p>
            )}
          </div>
          <button
            type="button"
            onClick={onEmailCheck}
            disabled={emailChecked || !form.email.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap h-fit transition-all ${
              emailChecked 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-[#3CDCBA] text-white hover:bg-[#35c4a9]"
            }`}
          >
            {emailChecked ? '확인완료' : '중복확인'}
          </button>
        </div>
      </div>

      {/* 닉네임 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${errors.username ? "text-red-500" : "text-gray-600"}`}>
          닉네임
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              name="username"
              type="text"
              placeholder={isLoadingNickname ? "닉네임 생성 중..." : "닉네임을 입력해주세요"}
              disabled={isLoadingNickname}
              className={`w-full border-b py-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-wait ${
                errors.username ? "border-red-500" : usernameChecked ? "border-[#3CDCBA]" : "border-gray-300"
              }`}
              value={form.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            {usernameChecked && !errors.username && (
              <p className="text-[#3CDCBA] text-xs mt-1">✓ 사용 가능한 닉네임입니다.</p>
            )}
            {!isLoadingNickname && !usernameChecked && (
              <p className="text-xs text-gray-500 mt-1">자동 생성된 닉네임을 사용하거나 직접 수정할 수 있어요</p>
            )}
          </div>
          <button
            type="button"
            onClick={onUsernameCheck}
            disabled={usernameChecked || !form.username.trim() || isLoadingNickname}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap h-fit transition-all ${
              usernameChecked 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {usernameChecked ? '확인완료' : '중복확인'}
          </button>
        </div>
      </div>

      {/* 비밀번호 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${errors.password ? "text-red-500" : "text-gray-600"}`}>
          비밀번호
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className={`text-xs mt-1 ${errors.password ? "text-red-500" : "text-gray-500"}`}>
          영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요.
        </p>
      </div>

      {/* 비밀번호 확인 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${
          errors.confirmPassword 
            ? "text-red-500" 
            : form.confirmPassword && form.password === form.confirmPassword 
              ? "text-[#3CDCBA]" 
              : "text-gray-600"
        }`}>
          비밀번호 확인
        </label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.confirmPassword 
                ? "border-red-500" 
                : form.confirmPassword && form.password === form.confirmPassword
                  ? "border-[#3CDCBA]"
                  : "border-gray-300"
            }`}
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
        {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
          <p className="text-[#3CDCBA] text-xs mt-1">비밀번호가 일치합니다.</p>
        )}
      </div>
    </div>
  );
}