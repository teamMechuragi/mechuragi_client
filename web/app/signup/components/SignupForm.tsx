"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface SignupFormProps {
  form: { email: string; username: string; password: string; confirmPassword: string };
  onFormChange: (name: string, value: string) => void;
  errors: Partial<Record<keyof SignupFormProps["form"], string>>;
  emailChecked: boolean;
  usernameChecked: boolean;
  onEmailCheck: () => Promise<void>;
  onUsernameCheck: () => Promise<void>;
}

export default function SignupForm({
  form,
  onFormChange,
  errors,
  emailChecked,
  usernameChecked,
  onEmailCheck,
  onUsernameCheck,
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInputStyle = (name: keyof SignupFormProps["form"], isChecked: boolean) => `
    w-full bg-transparent border-b-2 py-3 transition-all outline-none text-[17px] font-semibold
    ${errors[name] 
      ? "border-red-400 text-red-500" 
      : isChecked 
        ? "border-[#3CDCBA]" 
        : "border-gray-200 focus:border-gray-400 text-gray-800"}
  `;

  return (
    <div className="w-full space-y-10">
      
      {/* 이메일 */}
      <div>
        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Email</label>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <input
              name="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              className={getInputStyle('email', emailChecked)}
              value={form.email}
              onChange={(e) => onFormChange(e.target.name, e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={onEmailCheck}
            disabled={emailChecked || !form.email.trim()}
            className={`px-5 py-2.5 text-[12px] font-black rounded-2xl transition-all h-fit mb-1 ${
              emailChecked 
                ? "bg-gray-200 text-gray-500" 
                : "bg-[#3CDCBA] text-white shadow-lg shadow-[#3CDCBA]/20"
            }`}
          >
            {emailChecked ? '확인됨' : '중복확인'}
          </button>
        </div>
        {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.email}</p>}
      </div>

      {/* 닉네임 */}
      <div>
        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Nickname</label>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <input
              name="username"
              type="text"
              placeholder="닉네임을 입력해주세요"
              className={getInputStyle('username', usernameChecked)}
              value={form.username}
              onChange={(e) => onFormChange(e.target.name, e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={onUsernameCheck}
            disabled={usernameChecked || !form.username.trim()}
            className={`px-5 py-2.5 text-[12px] font-black rounded-2xl transition-all h-fit mb-1 ${
              usernameChecked
                ? "bg-gray-200 text-gray-500"
                : "bg-[#3CDCBA] text-white shadow-lg shadow-[#3CDCBA]/20"
            }`}
          >
            {usernameChecked ? '확인됨' : '중복확인'}
          </button>
        </div>
        {errors.username && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.username}</p>}
      </div>

      {/* 비밀번호 */}
      <div>
        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Password</label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="8~20자 영문, 숫자, 특수문자"
            className={getInputStyle('password', false)}
            value={form.password}
            onChange={(e) => onFormChange(e.target.name, e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 bottom-3 text-gray-400 p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.password}</p>}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Confirm Password</label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호 재입력"
            className={getInputStyle('confirmPassword', form.confirmPassword !== '' && form.password === form.confirmPassword)}
            value={form.confirmPassword}
            onChange={(e) => onFormChange(e.target.name, e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 bottom-3 text-gray-400 p-1"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.confirmPassword}</p>
        )}
        {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
          <div className="flex items-center gap-1 mt-2 ml-1 text-[#3CDCBA]">
            <CheckCircle2 size={12} strokeWidth={3} />
            <span className="text-[11px] font-black">비밀번호가 일치합니다</span>
          </div>
        )}
      </div>
    </div>
  );
}