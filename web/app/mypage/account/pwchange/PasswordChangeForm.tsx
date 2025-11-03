"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordChangeFormProps {
  form: { 
    currentPassword: string; 
    newPassword: string; 
    confirmPassword: string;
  };
  onFormChange: (name: string, value: string) => void;
  errors: Partial<Record<keyof PasswordChangeFormProps["form"], string>>;
}

export default function PasswordChangeForm({ 
  form, 
  onFormChange, 
  errors,
}: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      {/* 기존 비밀번호 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${errors.currentPassword ? "text-red-500" : "text-gray-600"}`}>
          기존 비밀번호
        </label>
        <div className="relative">
          <input
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.currentPassword ? "border-red-500" : "border-gray-300"
            }`}
            value={form.currentPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.currentPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
        )}
      </div>

      {/* 새로운 비밀번호 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${errors.newPassword ? "text-red-500" : "text-gray-600"}`}>
          새로운 비밀번호
        </label>
        <div className="relative">
          <input
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            value={form.newPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className={`text-xs mt-1 ${errors.newPassword ? "text-red-500" : "text-gray-500"}`}>
          영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요.
        </p>
      </div>

      {/* 새로운 비밀번호 확인 입력 필드 */}
      <div>
        <label className={`text-sm font-bold block mb-2 ${
          errors.confirmPassword 
            ? "text-red-500" 
            : form.confirmPassword && form.newPassword === form.confirmPassword 
              ? "text-[#3CDCBA]" 
              : "text-gray-600"
        }`}>
          새로운 비밀번호 확인
        </label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.confirmPassword 
                ? "border-red-500" 
                : form.confirmPassword && form.newPassword === form.confirmPassword
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
        {!errors.confirmPassword && form.confirmPassword && form.newPassword === form.confirmPassword && (
          <p className="text-[#3CDCBA] text-xs mt-1">비밀번호가 일치합니다.</p>
        )}
      </div>
    </div>
  );
}