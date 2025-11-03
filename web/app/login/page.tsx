import LoginForm from "./components/LoginForm";
import Image from "next/image";
import Header from "../common/Header";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="w-full max-w-sm mx-auto">
        <Header />
      </div>

      {/* 로고 + 로그인 폼 */}
      <div className="flex flex-col items-center w-full max-w-sm mx-auto px-6 flex-1">
        <div className="flex justify-center mt-16 mb-8">
          <Image src="/loginLogo.png" alt="Logo" width={140} height={140} priority />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}