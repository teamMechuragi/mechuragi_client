'use client';

import DateCell from './DateCell';

interface CalendarGridProps {
  year: number;
  month: number;
  diaryEntries: any[];
  onDateClick: (date: string) => void;
}

export default function CalendarGrid({ year, month, diaryEntries, onDateClick }: CalendarGridProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const weekDays = [
    { label: '일', color: 'text-red-500' },
    { label: '월', color: 'text-gray-400' },
    { label: '화', color: 'text-gray-400' },
    { label: '수', color: 'text-gray-400' },
    { label: '목', color: 'text-gray-400' },
    { label: '금', color: 'text-gray-400' },
    { label: '토', color: 'text-[#3CDCBA]' },
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day) => (
          <div key={day.label} className={`text-center text-[10px] py-2 font-bold ${day.color}`}>
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-t border-l border-gray-100">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-24 border-b border-r border-gray-100 bg-gray-50/10" />
        ))}
        {days.map((day) => {
          // 1. 현재 셀의 날짜를 숫자만 추출 (예: 20260105)
          const currentTarget = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
          
          // 2. 일기 데이터 중 날짜 숫자만 추출해서 일치하는지 확인
          const entry = diaryEntries.find(e => {
            const savedDateNumeric = e.date.replace(/[^0-9]/g, ''); // "2026. 01. 05." -> "20260105"
            return savedDateNumeric === currentTarget;
          });

          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayOfWeek = new Date(year, month, day).getDay();

          return (
            <DateCell
              key={day}
              day={day}
              images={entry?.images}
              onClick={() => onDateClick(dateString)}
              isSunday={dayOfWeek === 0}
              isSaturday={dayOfWeek === 6}
              isToday={
                new Date().getFullYear() === year &&
                new Date().getMonth() === month &&
                new Date().getDate() === day
              }
            />
          );
        })}
      </div>
    </div>
  );
}