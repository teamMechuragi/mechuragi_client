"use client";

import { useRouter } from "next/navigation";

interface FooterProps {
  type: "button" | "nav";
  buttonText?: string;
  onButtonClick?: () => void;
  disabled?: boolean; // 🔹 비활성화 상태 추가
}

export default function Footer({ type, buttonText, onButtonClick, disabled }: FooterProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-6 py-4 bg-white">
      {/* 버튼 푸터 */}
      {type === "button" && (
        <button
          className={`w-full py-3 rounded-[50px] font-bold transition-all ${
            disabled ? "bg-gray-300 text-gray-500 cursor-default" : "bg-[#3CDCBA] text-white"
          }`}
          onClick={onButtonClick}
          disabled={disabled} // 🔹 버튼 비활성화 상태 적용
        >
          {buttonText}
        </button>
      )}

      {/* 네비게이션 푸터 */}
      {type === "nav" && (
        <div className="flex justify-around">
          <button onClick={() => router.push("/home")}>🏠 홈</button>
          <button onClick={() => router.push("/search")}>🔍 검색</button>
          <button onClick={() => router.push("/profile")}>👤 프로필</button>
        </div>
      )}
    </div>
  );
}
