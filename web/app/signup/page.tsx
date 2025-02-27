"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SignupForm from "./components/SignupForm";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ email?: string; username?: string; password?: string; confirmPassword?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null); // ✅ 서버 오류 상태 추가
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(null);

  useEffect(() => {
    const storedTerms = localStorage.getItem("termsAgreement");
    if (storedTerms) {
      setTerms(JSON.parse(storedTerms));
    }
  }, []);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password: string) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSignup = async () => {
    if (loading) return;
    setLoading(true);
    setServerError(null); // ✅ 서버 오류 메시지 초기화

    // 🔹 오류 메시지 초기화
    let newErrors: { email?: string; username?: string; password?: string; confirmPassword?: string } = {};

    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "유효한 이메일을 입력해주세요.";
    }

    if (!form.username.trim()) {
      newErrors.username = "아이디를 입력해주세요.";
    }

    if (!form.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(form.password)) {
      newErrors.password = "영문, 숫자, 특수문자 포함 8자리 이상 입력해주세요.";
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호를 다시 입력해주세요.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 🔹 오류가 하나라도 있으면 업데이트하고 함수 종료
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // ✅ 서버 요청 실행
    try {
      const response = await fetch("https://api.example.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          terms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원가입 성공!");
        router.push("/login");
      } else {
        // 🔹 서버가 반환한 오류 메시지가 있으면 표시
        setServerError(data.message || "서버 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 요청 실패:", error);
      setServerError("서버와 연결할 수 없습니다. 인터넷 연결을 확인해주세요."); // ✅ 일반적인 네트워크 오류 메시지 추가
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center max-w-sm mx-auto px-6 pt-4 pb-20">
      <Header title="회원가입" backLink="/terms" />

      <div className="flex flex-col w-full flex-1 justify-center">
        <SignupForm form={form} onFormChange={setForm} errors={errors} />
        {/* ✅ 서버 오류 메시지 표시 */}
        {serverError && <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>}
      </div>

      <Footer
        type="button"
        buttonText={loading ? "가입 중..." : "완료"}
        onButtonClick={handleSignup}
        disabled={loading} // 🔹 입력값이 있어도 오류가 있으면 처리해야 하므로, 여기서는 로딩 상태만 체크
      />
    </div>
  );
}