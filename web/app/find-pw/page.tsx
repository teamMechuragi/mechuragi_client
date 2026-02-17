"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import FindPwForm from "./components/FindPwForm";
import { useToast } from "@/app/common/ToastProvider";
import { sendVerificationEmail, verifyEmailCode } from "@/app/api/emailApi";
import { resetPassword } from "@/app/api/memberApi";

function FindPwContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };
    if (name === 'email') {
      if (!value.trim()) newErrors.email = '이메일을 입력해주세요.';
      else if (!isValidEmail(value)) newErrors.email = '유효한 이메일을 입력해주세요.';
      else delete newErrors.email;
    }
    if (name === 'newPassword') {
      if (!value.trim()) newErrors.newPassword = '비밀번호를 입력해주세요.';
      else if (!isValidPassword(value)) newErrors.newPassword = '8~20자, 영문/숫자/특수문자 포함';
      else delete newErrors.newPassword;

      if (form.confirmPassword && value !== form.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      } else if (form.confirmPassword && value === form.confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }
    if (name === 'confirmPassword') {
      if (form.newPassword !== value) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      else delete newErrors.confirmPassword;
    }
    setErrors(newErrors);
  };

  const handleSendVerification = async () => {
    if (!form.email.trim() || !isValidEmail(form.email)) {
      showToast('유효한 이메일을 입력해주세요.', 'error');
      return;
    }
    try {
      await sendVerificationEmail(form.email);
      setEmailSent(true);
      showToast('인증 메일이 발송되었습니다.', 'success');
    } catch (error: any) {
      showToast(error.message || '인증 메일 발송 중 오류가 발생했습니다.', 'error');
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

  const handleNextStep = () => {
    setStep(2);
  };

  const handleResetPassword = async () => {
    if (loading) return;

    const newErrors: Record<string, string> = {};
    if (!form.newPassword.trim()) {
      newErrors.newPassword = '비밀번호를 입력해주세요.';
    } else if (!isValidPassword(form.newPassword)) {
      newErrors.newPassword = '8~20자, 영문/숫자/특수문자 포함';
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호를 다시 입력해주세요.';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email: form.email, newPassword: form.newPassword });
      showToast('비밀번호가 재설정되었습니다.', 'success');
      setTimeout(() => router.push('/login'), 1000);
    } catch (error: any) {
      showToast(error.message || '비밀번호 재설정에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = isEmailVerified;
  const isStep2Valid =
    form.newPassword.trim() !== '' &&
    form.confirmPassword.trim() !== '' &&
    Object.keys(errors).length === 0;

  return (
    <div className="relative flex flex-col w-full h-full bg-[#F2F4F6]">
      <div className="relative flex flex-col w-full h-full bg-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#3CDCBA]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[25%] -left-20 w-64 h-64 bg-[#3CDCBA]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-20 pt-2 bg-white">
          <Header title="비밀번호 찾기" backLink="/login" isSignup />
        </div>

        <div className="relative z-10 px-9 pt-14 pb-2 bg-white">
          <h1 className="text-[32px] font-black text-[#1a1a1a] leading-[1.25] tracking-[-0.06em]">
            {step === 1 ? (
              <>
                가입한<br />
                <span className="text-[#3CDCBA]">이메일을 </span><br />
                인증해주세요
              </>
            ) : (
              <>
                새로운<br />
                <span className="text-[#3CDCBA]">비밀번호를 </span><br />
                설정해주세요
              </>
            )}
          </h1>
        </div>

        <div className="relative flex-1 bg-[#F8F9FA] rounded-t-[40px] px-9 pt-12 z-10 overflow-y-auto no-scrollbar pb-32 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.08)]">
          <FindPwForm
            step={step}
            form={form}
            onFormChange={handleChange}
            errors={errors}
            emailSent={emailSent}
            isEmailVerified={isEmailVerified}
            onSendVerification={handleSendVerification}
            onVerifyCode={handleVerifyCode}
          />
        </div>

        <Footer
          type="button"
          buttonText={
            step === 1
              ? '다음'
              : loading
                ? '변경 중...'
                : '비밀번호 재설정'
          }
          onButtonClick={step === 1 ? handleNextStep : handleResetPassword}
          disabled={step === 1 ? !isStep1Valid : !isStep2Valid || loading}
        />
      </div>
    </div>
  );
}

export default function FindPwPage() {
  return <FindPwContent />;
}
