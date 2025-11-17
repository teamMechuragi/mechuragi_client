"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/common/Header";
import Footer from "@/app/common/Footer";
import PasswordChangeForm from "./PasswordChangeForm";

export default function PasswordChangePage() {
  const router = useRouter();
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
      // ✅ 수정: localStorage에서 사용자 정보 가져오기
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        setServerError('로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const memberId = user.id;

      // ✅ 수정: 엔드포인트 경로 변경
      const response = await fetch(`http://15.165.136.100:8080/api/members/${memberId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      // ✅ 수정: 200 OK는 응답 본문이 없을 수 있음
      if (response.ok) {
        alert('비밀번호가 변경되었습니다.');
        router.push('/mypage/account');
      } else {
        // 에러 응답 처리
        try {
          const data = await response.json();
          setServerError(data.message || '현재 비밀번호가 일치하지 않습니다.');
        } catch {
          setServerError('현재 비밀번호가 일치하지 않습니다.');
        }
      }
    } catch (error) {
      console.error('비밀번호 변경 요청 실패:', error);
      setServerError('서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
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
        />
        {serverError && <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>}
      </div>

      <Footer
        type="button"
        buttonText={loading ? "변경 중..." : "완료"}
        onButtonClick={handlePasswordChange}
        disabled={!isFormValid || loading}
      />
    </div>
  );
}