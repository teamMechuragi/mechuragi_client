import LoginForm from "./components/LoginForm";
import Image from "next/image";
import Header from "../common/Header";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center min-h-screen px-6 pt-4 pb-20">
      {/* 🔹 헤더 (닫기 버튼 포함) */}
      <Header title="" close />

      {/* 🔹 로고 + 로그인 폼 (전체 화면 중앙 정렬) */}
      <div className="flex flex-col items-center justify-center flex-1 w-full">
        <Image src="/loginLogo.png" alt="Logo" width={120} height={120} priority />
        <LoginForm />
      </div>
    </div>
  );
}
