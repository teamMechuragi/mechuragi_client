"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SignupForm from "./components/SignupForm";
import { useToast } from "@/app/common/ToastProvider";
import { signup, checkEmail, checkNickname } from "@/app/api/memberApi";
import { ApiError } from "@/app/api/apiClient";
import { sendVerificationEmail, verifyEmailCode } from "@/app/api/emailApi";

function SignupPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
    verificationCode?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'email') setEmailChecked(false);
    if (name === 'username') setUsernameChecked(false);

    let newErrors = { ...errors };
    if (name === 'email') {
      if (!value.trim()) newErrors.email = '이메일을 입력해주세요.';
      else if (!isValidEmail(value)) newErrors.email = '유효한 이메일을 입력해주세요.';
      else delete newErrors.email;
    }
    if (name === 'username') {
      if (!value.trim()) newErrors.username = '닉네임을 입력해주세요.';
      else delete newErrors.username;
    }
    if (name === 'password') {
      if (!value.trim()) newErrors.password = '비밀번호를 입력해주세요.';
      else if (!isValidPassword(value)) newErrors.password = '8~20자, 영문/숫자/특수문자 포함';
      else delete newErrors.password;
    }
    if (name === 'confirmPassword') {
      if (form.password !== value) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      else delete newErrors.confirmPassword;
    }
    setErrors(newErrors);
  };

  const handleEmailCheck = async () => {
    if (!form.email.trim() || !isValidEmail(form.email)) {
      showToast('유효한 이메일을 입력해주세요.', 'error');
      return;
    }
    try {
      const isExist = await checkEmail(form.email);
      if (!isExist) {
        setEmailChecked(true);
        showToast('사용 가능한 이메일입니다.', 'success');
      } else {
        showToast('이미 사용 중인 이메일입니다. 카카오로 가입하셨다면 카카오 로그인을 이용해주세요.', 'error');
      }
    } catch (error) {
      showToast('중복 확인 중 오류 발생', 'error');
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail(form.email);
      setEmailSent(true);
      showToast('인증 메일이 발송되었습니다.', 'success');
    } catch (error: any) {
      showToast(error.message || '인증 메일 발송 중 오류 발생', 'error');
    }
  };

  const handleUsernameCheck = async () => {
    if (!form.username.trim()) {
      showToast('닉네임을 입력해주세요.', 'error');
      return;
    }
    try {
      const isExist = await checkNickname(form.username);
      if (!isExist) {
        setUsernameChecked(true);
        showToast('사용 가능한 닉네임입니다.', 'success');
      } else {
        showToast('이미 사용중인 닉네임입니다.', 'error');
      }
    } catch (error) {
      showToast('중복 확인 중 오류 발생', 'error');
    }
  };

  const handleVerifyCode = async () => {
    if (!form.verificationCode.trim()) {
      showToast('인증번호를 입력해주세요.', 'error');
      return;
    }
    try {
      await verifyEmailCode(form.email, form.verificationCode);
      setIsEmailVerified(true);
      showToast('이메일 인증이 완료되었습니다.', 'success');
    } catch (error: any) {
      showToast(error.message || '인증번호가 올바르지 않습니다.', 'error');
    }
  };

  const handleSignup = async () => {
    if (loading) return;
    if (!emailChecked || !usernameChecked) {
      showToast('중복 확인을 해주세요.', 'error');
      return;
    }
    setLoading(true);
    try {
      await signup({ email: form.email, nickname: form.username, password: form.password });
      showToast("회원가입 성공!", "success");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.code === 'M005') {
          setServerError('카카오로 가입된 이메일입니다. 카카오 로그인을 이용해주세요.');
        } else if (error.code === 'M002') {
          setServerError('이미 사용 중인 이메일입니다. 이메일 중복 확인을 다시 해주세요.');
        } else {
          setServerError(error.message || '서버 통신 실패');
        }
      } else {
        setServerError(error.message || '서버 통신 실패');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // ClientLayout이 h/[max-w]를 제공하므로, 여기서는 컨텐츠만 렌더링
    <div className="relative flex flex-col w-full h-full bg-[#F2F4F6]">
      <div className="relative flex flex-col w-full h-full bg-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#3CDCBA]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[25%] -left-20 w-64 h-64 bg-[#3CDCBA]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-20 pt-2 bg-white">
          <Header title="회원가입" backLink="/terms" isSignup />
        </div>

        {/* 상단 섹션: 폰트 사이즈 키움 (text-[32px]) */}
        <div className="relative z-10 px-9 pt-14 pb-2 bg-white">
          <h1 className="text-[32px] font-black text-[#1a1a1a] leading-[1.25] tracking-[-0.06em]">
            반가워요!<br />
            <span className="text-[#3CDCBA]">계정을 </span><br />
            만들어주세요
          </h1>
        </div>

        <div className="relative flex-1 bg-[#F8F9FA] rounded-t-[40px] px-9 pt-12 z-10 overflow-y-auto no-scrollbar pb-32 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.08)]">
          <SignupForm
            form={form}
            onFormChange={handleChange}
            errors={errors}
            emailChecked={emailChecked}
            emailSent={emailSent}
            usernameChecked={usernameChecked}
            isEmailVerified={isEmailVerified}
            onEmailCheck={handleEmailCheck}
            onSendVerification={handleSendVerification}
            onUsernameCheck={handleUsernameCheck}
            onVerifyCode={handleVerifyCode}
          />
          {serverError && <p className="text-red-500 text-sm mt-6 text-center font-bold">{serverError}</p>}
        </div>

        <Footer
          type="button"
          buttonText={loading ? '가입 중...' : '완료'}
          onButtonClick={handleSignup}
          disabled={!(form.email && form.username && form.password && form.confirmPassword && emailChecked && usernameChecked && Object.keys(errors).length === 0) || loading}
        />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <SignupPageContent />;
}