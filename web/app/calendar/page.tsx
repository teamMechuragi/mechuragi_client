'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import CalendarGrid from './components/CalendarGrid';
import Footer from '@/app/common/Footer';
import { getMonthlyDiaries } from '@/app/api/diaryApi';

interface DiaryEntry {
  id: string;
  date: string;
  images: string[];
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 데이터 페칭: 백엔드 API 연동
  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const data = await getMonthlyDiaries(year, month + 1);
        // API 응답을 프론트엔드 형식에 맞게 변환
        const entries: DiaryEntry[] = data.diaries.map(d => ({
          id: String(d.diaryId),
          date: d.diaryDate,
          images: d.thumbnails.slice(0, 4), // 썸네일은 앞 4장만
        }));
        setDiaryEntries(entries);
      } catch (error) {
        console.error('캘린더 데이터 로드 실패:', error);
        setDiaryEntries([]);
      }
    };

    fetchDiaryEntries();
  }, [year, month]);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      distance > 0 ? handleNextMonth() : handlePrevMonth();
    }
  };

  // --- 수정된 부분: 날짜 매칭 로직 (숫자 기반 비교) ---
  const handleDateClick = (date: string) => {
    // 1. 클릭한 날짜 문자열에서 숫자만 추출 (예: "2026-01-05" -> "20260105")
    const clickedDateNumeric = date.replace(/[^0-9]/g, '');

    // 2. 저장된 일기 데이터 중 날짜 숫자가 일치하는 항목 찾기
    const entry = diaryEntries.find(e => {
      const savedDateNumeric = e.date.replace(/[^0-9]/g, '');
      return savedDateNumeric === clickedDateNumeric;
    });

    if (entry) {
      // 일기가 있다면 상세 페이지로 이동
      router.push(`/calendar/diary/detail?id=${entry.id}`);
    } else {
      // 일기가 없다면 갤러리/작성 페이지로 이동
      router.push(`/calendar/gallery?date=${date}`);
    }
  };
  // ------------------------------------------------

  return (
    <div 
      className="min-h-screen bg-white pb-24 font-sans select-none touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 수정된 부분: 수동 header 대신 공통 Header 컴포넌트 사용 */}
      <Header 
        isCalendar 
        title={`${year}년 ${month + 1}월`} 
        onCalendarClick={() => setShowMonthPicker(true)} 
      />

      {/* 헤더가 fixed이므로 본문 겹침 방지를 위해 pt-14 추가 */}
      <main className="pt-14 px-1">
        <CalendarGrid
          year={year}
          month={month}
          diaryEntries={diaryEntries}
          onDateClick={handleDateClick}
        />
      </main>

      {showMonthPicker && (
        <MonthPicker 
          initialYear={year}
          initialMonth={month}
          onSelect={(y: number, m: number) => {
            setCurrentDate(new Date(y, m, 1));
            setShowMonthPicker(false);
          }}
          onClose={() => setShowMonthPicker(false)}
        />
      )}

      <Footer type="nav" />
    </div>
  );
}

// MonthPicker의 props 인터페이스 정의
interface MonthPickerProps {
  initialYear: number;
  initialMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

function MonthPicker({ initialYear, initialMonth, onSelect, onClose }: MonthPickerProps) {
  const [viewYear, setViewYear] = useState(initialYear);
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setViewYear(viewYear - 1)} className="p-2 text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xl font-extrabold">{viewYear}년</span>
          <button onClick={() => setViewYear(viewYear + 1)} className="p-2 text-gray-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {months.map(m => (
            <button 
              key={m} 
              onClick={() => onSelect(viewYear, m)}
              className={`py-4 rounded-2xl text-sm font-bold ${
                viewYear === initialYear && m === initialMonth
                ? 'bg-[#3CDCBA] text-white shadow-lg shadow-[#3CDCBA]/30'
                : 'bg-gray-50 text-gray-600'
              }`}
            >
              {m + 1}월
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}