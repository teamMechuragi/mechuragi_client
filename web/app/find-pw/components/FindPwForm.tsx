"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface FindPwFormProps {
  step: 1 | 2;
  form: {
    email: string;
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
  };
  onFormChange: (name: string, value: string) => void;
  errors: Partial<Record<string, string>>;
  emailSent: boolean;
  isEmailVerified: boolean;
  onSendVerification: () => Promise<void>;
  onVerifyCode: () => Promise<void>;
}

export default function FindPwForm({
  step,
  form,
  onFormChange,
  errors,
  emailSent,
  isEmailVerified,
  onSendVerification,
  onVerifyCode,
}: FindPwFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getInputStyle = (name: string, isChecked: boolean) => `
    w-full bg-transparent border-b-2 py-3 transition-all outline-none text-[17px] font-semibold
    ${errors[name]
      ? "border-red-400 text-red-500"
      : isChecked
        ? "border-[#3CDCBA]"
        : "border-gray-200 focus:border-gray-400 text-gray-800"}
  `;

  return (
    <div className="w-full space-y-10">
      {step === 1 && (
        <>
          {/* 이메일 입력 */}
          <div>
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Email</label>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input
                  name="email"
                  type="email"
                  placeholder="가입한 이메일을 입력해주세요"
                  className={getInputStyle('email', emailSent)}
                  value={form.email}
                  onChange={(e) => onFormChange(e.target.name, e.target.value)}
                  disabled={emailSent}
                />
              </div>
              <button
                type="button"
                onClick={onSendVerification}
                disabled={emailSent || !form.email.trim()}
                className={`px-5 py-2.5 text-[12px] font-black rounded-2xl transition-all h-fit mb-1 ${
                  emailSent
                    ? "bg-gray-200 text-gray-500"
                    : "bg-[#3CDCBA] text-white shadow-lg shadow-[#3CDCBA]/20"
                }`}
              >
                {emailSent ? '발송됨' : '인증메일 발송'}
              </button>
            </div>
            {errors.email && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* 인증코드 입력 */}
          {emailSent && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Verification Code</label>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <input
                    name="verificationCode"
                    type="text"
                    placeholder="인증번호 6자리를 입력해주세요"
                    className={getInputStyle('verificationCode', isEmailVerified)}
                    value={form.verificationCode}
                    onChange={(e) => onFormChange(e.target.name, e.target.value)}
                    disabled={isEmailVerified}
                  />
                </div>
                <button
                  type="button"
                  onClick={onVerifyCode}
                  disabled={isEmailVerified || !form.verificationCode.trim()}
                  className={`px-5 py-2.5 text-[12px] font-black rounded-2xl transition-all h-fit mb-1 ${
                    isEmailVerified
                      ? "bg-gray-200 text-gray-500"
                      : "bg-[#3CDCBA] text-white shadow-lg shadow-[#3CDCBA]/20"
                  }`}
                >
                  {isEmailVerified ? '인증됨' : '인증하기'}
                </button>
              </div>
              {errors.verificationCode && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.verificationCode}</p>}
              {isEmailVerified && (
                <div className="flex items-center gap-1 mt-2 ml-1 text-[#3CDCBA]">
                  <CheckCircle2 size={12} strokeWidth={3} />
                  <span className="text-[11px] font-black">이메일 인증이 완료되었습니다</span>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {step === 2 && (
        <>
          {/* 새 비밀번호 */}
          <div>
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="8~20자 영문, 숫자, 특수문자"
                className={getInputStyle('newPassword', false)}
                value={form.newPassword}
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
            {errors.newPassword && <p className="text-red-500 text-[11px] font-bold mt-1 ml-1">{errors.newPassword}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest ml-0">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호 재입력"
                className={getInputStyle('confirmPassword', form.confirmPassword !== '' && form.newPassword === form.confirmPassword)}
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
            {!errors.confirmPassword && form.confirmPassword && form.newPassword === form.confirmPassword && (
              <div className="flex items-center gap-1 mt-2 ml-1 text-[#3CDCBA]">
                <CheckCircle2 size={12} strokeWidth={3} />
                <span className="text-[11px] font-black">비밀번호가 일치합니다</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
