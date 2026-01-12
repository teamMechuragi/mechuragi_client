"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import NotificationBell from '@/app/components/NotificationBell';

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
  isCalendar?: boolean;
  onCalendarClick?: () => void;
  isWrite?: boolean;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitText?: string;
  isDetail?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
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
  isCalendar = false,
  onCalendarClick,
  isWrite = false,
  onSubmit,
  submitDisabled = true,
  submitText = "등록",
  isDetail = false,
  onEdit,
  onDelete
}: HeaderProps) {
  const router = useRouter();

  // 수정 포인트: px-6을 px-4로 변경하여 본문(px-4)과 시작점을 일치시킴
  const headerBaseStyle = "fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 bg-white border-b border-gray-50 h-14 flex items-center px-4";

  // 1. 닫기(X) 헤더
  if (close) {
    return (
      <header className={headerBaseStyle}>
        <button onClick={() => router.push("/Home")} className="p-1 -ml-1">
          <Image src="/icon/x.png" alt="닫기" width={24} height={24} />
        </button>
        {title && <div className="flex-1 text-center text-[18px] font-bold">{title}</div>}
        <div className="w-[24px]" />
      </header>
    );
  }

  // 2. 홈 헤더
  if (isHome) {
    return (
      <header className={`${headerBaseStyle} justify-between`}>
        <div className="flex items-center">
          {/* 로고와 하단 텍스트 정렬을 위해 추가적인 여백 없이 깔끔하게 배치 */}
          <Image src="/icon/logo.png" alt="로고" width={32} height={32} />
        </div>
        <NotificationBell onClick={() => router.push("/notifications")} />
      </header>
    );
  }

  // 3. 회원가입/일반 헤더
  if (isSignup) {
    return (
      <header className={headerBaseStyle}>
        {backLink ? (
          <button onClick={() => router.push(backLink)} className="p-1 -ml-1">
            <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
          </button>
        ) : (
          <div className="w-[24px]" />
        )}
        <h2 className="text-[18px] font-bold flex-1 text-center">{title}</h2>
        <div className="w-[24px]" />
      </header>
    );
  }

  // 4. 온보딩 헤더
  if (isOnboarding) {
    // 온보딩 역시 px-6에서 px-4로 수정하여 통일감 부여
    return (
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-sm z-50 bg-white px-4 pt-4 pb-2 border-b border-gray-50">
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onPrev}
            className={`text-gray-400 text-sm font-medium ${!showPrev ? 'invisible' : ''}`}
          >
            이전
          </button>
          <button 
            onClick={onSkip}
            className="text-[#3CDCBA] font-bold text-sm"
          >
            건너뛰기
          </button>
        </div>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-[#3CDCBA]' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </header>
    );
  }

  // 5. 캘린더 전용 헤더
  if (isCalendar) {
    return (
      <header className={`${headerBaseStyle} justify-center`}>
        <button
          onClick={onCalendarClick}
          className="flex items-center gap-1 text-[18px] font-bold text-gray-900"
        >
          {title}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </header>
    );
  }

  // 6. 글쓰기/갤러리 헤더
  if (isWrite) {
    return (
      <header className={`${headerBaseStyle} justify-between`}>
        <button onClick={() => (backLink ? router.push(backLink) : router.back())} className="p-1 -ml-1">
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
        <h2 className="text-[18px] font-bold flex-1 text-center">{title}</h2>
        <button
          onClick={onSubmit}
          disabled={submitDisabled}
          className={`font-bold text-[16px] transition-colors ${
            !submitDisabled ? 'text-[#3CDCBA]' : 'text-gray-300'
          }`}
        >
          {submitText}
        </button>
      </header>
    );
  }

  // 8. 상세페이지 헤더
  if (isDetail) {
    return (
      <header className={headerBaseStyle}>
        <button onClick={() => (backLink ? router.push(backLink) : router.back())} className="p-1 -ml-1">
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
        <h2 className="text-[18px] font-bold absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {title}
        </h2>
        <div className="ml-auto flex gap-2">
          <button onClick={onDelete} className="p-1">
            <Image src="/icon/trash.png" alt="삭제" width={22} height={22} />
          </button>
          <button onClick={onEdit} className="p-1">
            <Image src="/icon/edit.png" alt="수정" width={22} height={22} />
          </button>
        </div>
      </header>
    );
  }

  // 기본 헤더
  return (
    <header className={headerBaseStyle}>
      {backLink ? (
        <button onClick={() => router.push(backLink)} className="p-1 -ml-1">
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
      ) : (
        <div className="w-[24px]" />
      )}
      <h2 className="text-[18px] font-bold flex-1 text-center">{title}</h2>
      <div className="w-[24px]" />
    </header>
  );
}