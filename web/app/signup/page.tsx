"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SignupForm from "./components/SignupForm";
import { ToastProvider, useToast } from "./components/ToastContainer";

function SignupPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ email?: string; username?: string; password?: string; confirmPassword?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(null);
  
  // 중복확인 상태
  const [emailChecked, setEmailChecked] = useState(false);
  const [usernameChecked, setUsernameChecked] = useState(false);
  
  // 닉네임 자동생성 로딩
  const [isLoadingNickname, setIsLoadingNickname] = useState(true);

  useEffect(() => {
    const storedTerms = localStorage.getItem("termsAgreement");
    if (storedTerms) {
      setTerms(JSON.parse(storedTerms));
    }
    
    // 닉네임 자동 생성
    generateNickname();
  }, []);
  
  // 닉네임 자동생성 - API 수정
  const generateNickname = async () => {
    try {
      const response = await fetch("http://15.165.136.100:8080/api/auth/nickname/generate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setForm(prev => ({ ...prev, username: data.nickname || "" }));
      }
    } catch (error) {
      console.error("닉네임 생성 실패:", error);
    } finally {
      setIsLoadingNickname(false);
    }
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password); // 8~20자로 수정

  // 실시간 검증
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
    
    // 입력값이 변경되면 중복확인 초기화
    if (name === "email") setEmailChecked(false);
    if (name === "username") setUsernameChecked(false);
    
    let newErrors = { ...errors };
    
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "이메일을 입력해주세요.";
      } else if (!isValidEmail(value)) {
        newErrors.email = "유효한 이메일을 입력해주세요.";
      } else {
        delete newErrors.email;
      }
    }
    
    if (name === "username") {
      if (!value.trim()) {
        newErrors.username = "닉네임을 입력해주세요.";
      } else {
        delete newErrors.username;
      }
    }
    
    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "비밀번호를 입력해주세요.";
      } else if (!isValidPassword(value)) {
        newErrors.password = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
      } else {
        delete newErrors.password;
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
      } else if (form.password !== value) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      } else {
        delete newErrors.confirmPassword;
      }
    }
    
    setErrors(newErrors);
  };

  // 이메일 중복확인 - API 수정
  const handleEmailCheck = async () => {
    if (!form.email.trim()) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }
    
    if (!isValidEmail(form.email)) {
      showToast('유효한 이메일을 입력해주세요.', 'error');
      return;
    }

    try {
      const response = await fetch(`http://15.165.136.100:8080/api/members/check/email?email=${encodeURIComponent(form.email)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const isExist = await response.json(); // true: 중복, false: 사용가능
      
      if (!isExist) {
        setEmailChecked(true);
        showToast('사용 가능한 이메일입니다.', 'success');
      } else {
        showToast('이미 사용중인 이메일입니다.', 'error');
      }
    } catch (error) {
      showToast('중복확인 중 오류가 발생했습니다.', 'error');
    }
  };

  // 닉네임 중복확인 - API 수정
  const handleUsernameCheck = async () => {
    if (!form.username.trim()) {
      showToast('닉네임을 입력해주세요.', 'error');
      return;
    }

    try {
      const response = await fetch(`http://15.165.136.100:8080/api/members/check/nickname?nickname=${encodeURIComponent(form.username)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const isExist = await response.json(); // true: 중복, false: 사용가능
      
      if (!isExist) {
        setUsernameChecked(true);
        showToast('사용 가능한 닉네임입니다.', 'success');
      } else {
        showToast('이미 사용중인 닉네임입니다.', 'error');
      }
    } catch (error) {
      showToast('중복확인 중 오류가 발생했습니다.', 'error');
    }
  };

  // 회원가입 - API 수정
  const handleSignup = async () => {
    if (loading) return;
    
    // 중복확인 체크
    if (!emailChecked) {
      showToast('이메일 중복확인을 해주세요.', 'error');
      return;
    }
    
    if (!usernameChecked) {
      showToast('닉네임 중복확인을 해주세요.', 'error');
      return;
    }
    
    setLoading(true);
    setServerError(null);

    // 최종 검증
    let newErrors: { email?: string; username?: string; password?: string; confirmPassword?: string } = {};

    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
    }

    if (!form.username.trim()) {
      newErrors.username = "닉네임을 입력해주세요.";
    }

    if (!form.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(form.password)) {
      newErrors.password = "비밀번호는 8~20자, 영문/숫자/특수문자를 포함해야 합니다.";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://15.165.136.100:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          nickname: form.username,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("회원가입 성공!", "success");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setServerError(data.message || "서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      setServerError("서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 버튼 활성화 조건
  const isFormValid = 
    form.email.trim() !== "" &&
    form.username.trim() !== "" &&
    form.password.trim() !== "" &&
    form.confirmPassword.trim() !== "" &&
    emailChecked &&
    usernameChecked &&
    Object.keys(errors).length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full max-w-sm mx-auto">
        <Header title="회원가입" backLink="/terms" isSignup />
      </div>

      <div className="w-full max-w-sm mx-auto px-6 pb-24 flex-1 mt-6">
        <SignupForm 
          form={form} 
          onFormChange={handleChange} 
          errors={errors}
          emailChecked={emailChecked}
          usernameChecked={usernameChecked}
          onEmailCheck={handleEmailCheck}
          onUsernameCheck={handleUsernameCheck}
          isLoadingNickname={isLoadingNickname}
        />
        {serverError && <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>}
      </div>

      <Footer
        type="button"
        buttonText={loading ? "가입 중..." : "완료"}
        onButtonClick={handleSignup}
        disabled={!isFormValid || loading}
      />
    </div>
  );
}

export default function SignupPage() {
  return (
    <ToastProvider>
      <SignupPageContent />
    </ToastProvider>
  );
}