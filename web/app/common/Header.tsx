"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  title: string;
  backLink?: string; // 뒤로가기 버튼을 표시할지 여부
  close?: boolean; // 닫기 버튼 (X) 표시 여부
}

export default function Header({ title, backLink, close }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="relative w-full max-w-sm py-4 flex items-center">
      {/* 🔹 닫기 버튼 (X) - 왼쪽 정렬 */}
      {close ? (
        <button onClick={() => router.push("/")} className="pl-0 ml-[-4px]">
          <Image src="/icon/x.png" alt="닫기" width={24} height={24} />
        </button>
      ) : backLink ? (
        <button onClick={() => router.push(backLink)} className="pl-0 ml-[-4px]">
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
      ) : (
        <div className="w-[24px]" /> // ✅ 균형을 맞추기 위한 빈 공간 추가
      )}

      {/* 🔹 헤더 제목 (가운데 정렬) */}
      <h2 className="text-lg font-bold flex-1 text-center">{title}</h2>

      {/* 🔹 오른쪽 빈 공간 (닫기 버튼이 없을 경우 대비) */}
      <div className="w-[24px]" /> 
    </div>
  );
}
