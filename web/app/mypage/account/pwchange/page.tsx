"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import PasswordChangeForm from "./PasswordChangeForm";
import { changePassword } from "@/app/api/memberApi";
import { useUser } from "@/app/context/UserContext";
import { ToastProvider, useToast } from "@/app/signup/components/ToastContainer";

function PasswordChangeContent() {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 카카오 로그인 사용자 체크
  const isKakaoUser = user?.provider === "KAKAO";
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isKakaoUser && !hasShownToast.current) {
      hasShownToast.current = true;
      showToast("카카오 소셜로그인 사용자는 비밀번호 변경이 불가합니다.", "error");
    }
  }, [isKakaoUser]);

  const isValidPassword = (password: string) => 
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);

  // 실시간 검증
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    
    let newErrors = { ...errors };
    
    if (name === "currentPassword") {
      if (!value.trim()) {
        newErrors.currentPassword = "기존 비밀번호를 입력해주세요.";
      } else {
        delete newErrors.currentPassword;
      }
    }
    
    if (name === "newPassword") {
      if (!value.trim()) {
        newErrors.newPassword = "새로운 비밀번호를 입력해주세요.";
      } else if (!isValidPassword(value)) {
        newErrors.newPassword = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
      } else {
        delete newErrors.newPassword;
      }
      
      if (form.confirmPassword && value !== form.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      } else if (form.confirmPassword && value === form.confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }
    
    if (name === "confirmPassword") {
      if (!value.trim()) {
        newErrors.confirmPassword = "비밀번호를 다시 입력해주세요.";
      } else if (form.newPassword !== value) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setErrors(newErrors);
  };

  // 비밀번호 변경
  const handlePasswordChange = async () => {
    if (loading) return;
    
    setLoading(true);
    setServerError(null);

    // 최종 검증
    let newErrors: { 
      currentPassword?: string; 
      newPassword?: string; 
      confirmPassword?: string;
    } = {};

    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "기존 비밀번호를 입력해주세요.";
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = "새로운 비밀번호를 입력해주세요.";
    } else if (!isValidPassword(form.newPassword)) {
      newErrors.newPassword = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // API를 통한 비밀번호 변경
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      alert('비밀번호가 변경되었습니다.');
      router.push('/mypage/account');
    } catch (error: any) {
      console.error('비밀번호 변경 요청 실패:', error);
      setServerError(error.message || '현재 비밀번호가 일치하지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 버튼 활성화 조건
  const isFormValid = 
    form.currentPassword.trim() !== "" &&
    form.newPassword.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    Object.keys(errors).length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="비밀번호 변경" backLink="/mypage/account" />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <PasswordChangeForm
          form={form}
          onFormChange={handleChange}
          errors={errors}
          disabled={isKakaoUser}
        />
        {serverError && <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>}
      </div>

      <Footer
        type="button"
        buttonText={loading ? "변경 중..." : "완료"}
        onButtonClick={handlePasswordChange}
        disabled={!isFormValid || loading || isKakaoUser}
      />
    </div>
  );
}

export default function PasswordChangePage() {
  return (
    <ToastProvider>
      <PasswordChangeContent />
    </ToastProvider>
  );
}