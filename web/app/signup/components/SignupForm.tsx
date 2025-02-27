"use client";

import { useState } from "react"; // ✅ useState 추가!
import { Eye, EyeOff } from "lucide-react"; // 👁 아이콘 (Lucide 아이콘 사용)

interface SignupFormProps {
  form: { email: string; username: string; password: string; confirmPassword: string };
  onFormChange: (form: any) => void;
  errors: Partial<Record<keyof SignupFormProps["form"], string>>; // ✅ 타입 수정
}

export default function SignupForm({ form, onFormChange, errors }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFormChange({ ...form, [name]: value });
  };

  return (
    <div className="w-full max-w-sm space-y-16">
      {/* 이메일 & 아이디 입력 필드 */}
      {[
        { label: "이메일", name: "email", type: "email", placeholder: "이메일을 입력해주세요" },
        { label: "아이디", name: "username", type: "text", placeholder: "아이디를 입력해주세요" },
      ].map(({ label, name, type, placeholder }) => (
        <div key={name}>
          <label className={`text-sm font-bold ${errors[name as keyof typeof errors] ? "text-red-500" : "text-gray-600"}`}>
            {label}
          </label>
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full border-b py-2 focus:outline-none transition-all ${
              errors[name as keyof typeof errors] ? "border-red-500 text-red-500" : "border-gray-300"
            }`}
            value={form[name as keyof typeof form]} // ✅ 부모 `form` 상태 사용
            onChange={handleChange}
          />
          {errors[name as keyof typeof errors] && <p className="text-red-500 text-sm mt-1">{errors[name as keyof typeof errors]}</p>}
        </div>
      ))}

      {/* 비밀번호 입력 필드 (눈 아이콘 포함) */}
      <div className="relative">
        <label className={`text-sm font-bold ${errors.password ? "text-red-500" : "text-gray-600"}`}>
          비밀번호
        </label>

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.password ? "border-red-500 text-red-500" : "border-gray-300"
            }`}
            value={form.password}
            onChange={handleChange}
          />

          {/* 눈 아이콘 */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* ✅ 비밀번호 조건 문구 추가 */}
        <p className={`text-sm mt-1 ${errors.password ? "text-red-500" : "text-gray-500"}`}>
          영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요.
        </p>
      </div>

      {/* 비밀번호 확인 입력 필드 (눈 아이콘 포함) */}
      <div className="relative">
        <label className={`text-sm font-bold ${errors.confirmPassword ? "text-red-500" : "text-gray-600"}`}>
          비밀번호 확인
        </label>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요"
            className={`w-full border-b py-2 pr-10 focus:outline-none transition-all ${
              errors.confirmPassword ? "border-red-500 text-red-500" : "border-gray-300"
            }`}
            value={form.confirmPassword}
            onChange={handleChange}
          />

          {/* 눈 아이콘 */}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
}
