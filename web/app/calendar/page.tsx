'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CalendarGrid from './components/CalendarGrid';
import Footer from '@/app/common/Footer';

interface DiaryEntry {
  date: string;
  thumbnail: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    fetchDiaryEntries(year, month);
  }, [year, month]);

  const fetchDiaryEntries = async (year: number, month: number) => {
    try {
      // TODO: API 연동
      setDiaryEntries([
        { date: '2024-12-07', thumbnail: '/images/food1.jpg' },
        { date: '2024-12-15', thumbnail: '/images/food2.jpg' },
        { date: '2024-12-24', thumbnail: '/images/food3.jpg' },
      ]);
    } catch (error) {
      console.error('일기 데이터 가져오기 실패:', error);
    }
  };

  const handleDateClick = (date: string) => {
    router.push(`/calendar/gallery?date=${date}`);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const handleMonthSelect = (selectedYear: number, selectedMonth: number) => {
    setCurrentDate(new Date(selectedYear, selectedMonth));
    setShowMonthPicker(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      handleNextMonth();
    }
    if (touchStart - touchEnd < -75) {
      handlePrevMonth();
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 헤더 영역 */}
      <div className="px-6 pt-4 pb-4">
        {/* 년/월 선택 */}
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => setShowMonthPicker(!showMonthPicker)}
            className="flex items-center gap-2 text-lg font-bold"
          >
            {year}년 {month + 1}월
            <svg 
              className={`w-5 h-5 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 월 선택 드롭다운 */}
        {showMonthPicker && (
          <MonthPicker
            currentYear={year}
            currentMonth={month}
            onSelect={handleMonthSelect}
            onClose={() => setShowMonthPicker(false)}
          />
        )}
      </div>

      {/* 캘린더 그리드 */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CalendarGrid
          year={year}
          month={month}
          diaryEntries={diaryEntries}
          onDateClick={handleDateClick}
        />
      </div>

      <Footer type="nav" />
    </div>
  );
}

// 월 선택 컴포넌트
interface MonthPickerProps {
  currentYear: number;
  currentMonth: number;
  onSelect: (year: number, month: number) => void;
  onClose: () => void;
}

function MonthPicker({ currentYear, currentMonth, onSelect, onClose }: MonthPickerProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
      
      <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg z-50 p-4 w-80">
        {/* 년도 선택 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedYear(selectedYear - 1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-bold">{selectedYear}년</span>
          <button
            onClick={() => setSelectedYear(selectedYear + 1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 월 그리드 */}
        <div className="grid grid-cols-4 gap-2">
          {months.map((monthName, index) => (
            <button
              key={index}
              onClick={() => onSelect(selectedYear, index)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                selectedYear === currentYear && index === currentMonth
                  ? 'bg-[#3CDCBA] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {monthName}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}