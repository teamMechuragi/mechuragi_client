"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface HeaderProps {
  title?: string;
  backLink?: string;
  close?: boolean;
  isHome?: boolean;
  isSignup?: boolean;
  isOnboarding?: boolean;
  onSkip?: () => void;
  showPrev?: boolean;
  onPrev?: () => void;
  currentSlide?: number;
  totalSlides?: number;
  // 👇 글쓰기용 추가
  isWrite?: boolean;
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export default function Header({ 
  title, 
  backLink, 
  close, 
  isHome = false, 
  isSignup = false,
  isOnboarding = false,
  onSkip,
  showPrev = false,
  onPrev,
  currentSlide = 0,
  totalSlides = 4,
  isWrite = false,
  onSubmit,
  submitDisabled = true
}: HeaderProps) {
  const router = useRouter();

  // 닫기(X) 헤더
  if (close) {
    return (
      <div className="relative w-full max-w-sm px-6 py-4 flex items-center min-h-[56px]">
        <button onClick={() => router.push("/Home")}>
          <Image src="/icon/x.png" alt="닫기" width={24} height={24} />
        </button>
        {title && <div className="flex-1 text-center text-lg font-bold">{title}</div>}
        {title && <div className="w-[24px]" />}
      </div>
    );
  }

  // 홈 헤더
  if (isHome) {
    return (
      <div className="relative w-full max-w-sm px-6 py-4 flex items-center justify-between min-h-[56px]">
        <Image src="/icon/logo.png" alt="로고" width={36} height={36} />
        <button onClick={() => router.push("/notifications")}>
          <Image src="/icon/bell.png" alt="알림" width={24} height={24} />
        </button>
      </div>
    );
  }

  // 회원가입 헤더
  if (isSignup) {
    return (
      <div className="relative w-full px-6 py-4 flex items-center min-h-[56px] bg-white z-10">
        {backLink ? (
          <button onClick={() => router.push(backLink)}>
            <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
          </button>
        ) : (
          <div className="w-[24px]" />
        )}
        <h2 className="text-lg font-bold flex-1 text-center">{title}</h2>
        <div className="w-[24px]" />
      </div>
    );
  }

  // 온보딩 헤더
  if (isOnboarding) {
    return (
      <div className="relative w-full max-w-sm px-6 py-4 min-h-[56px]">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onPrev}
            className={`text-gray-400 text-base ${!showPrev ? 'invisible' : ''}`}
          >
            이전
          </button>
          <button 
            onClick={onSkip}
            className="text-teal-500 font-medium text-base"
          >
            건너뛰기
          </button>
        </div>
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-teal-500' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // 👇 글쓰기 헤더 추가
  if (isWrite) {
    return (
      <div className="relative w-full px-6 py-4 flex items-center justify-between min-h-[56px] bg-white border-b border-gray-100">
        {backLink ? (
          <button onClick={() => router.push(backLink)}>
            <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
          </button>
        ) : (
          <div className="w-[24px]" />
        )}
        <h2 className="text-lg font-bold flex-1 text-center">{title}</h2>
        <button
          onClick={onSubmit}
          disabled={submitDisabled}
          className={`px-4 py-2 rounded-full font-medium text-sm ${
            !submitDisabled ? 'bg-[#3CDCBA] text-white' : 'bg-gray-200 text-gray-400'
          }`}
        >
          등록
        </button>
      </div>
    );
  }

  // 일반 헤더
  return (
    <div className="relative w-full max-w-sm px-6 py-4 flex items-center min-h-[56px]">
      {backLink ? (
        <button onClick={() => router.push(backLink)}>
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
      ) : (
        <div className="w-[24px]" />
      )}
      <h2 className="text-lg font-bold flex-1 text-center">{title}</h2>
      <div className="w-[24px]" />
    </div>
  );
}