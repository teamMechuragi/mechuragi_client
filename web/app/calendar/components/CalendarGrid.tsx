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
  
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  // 마지막 주 빈 칸 계산
  const totalCells = daysInMonth + firstDayOfMonth;
  const trailingBlanksCount = (7 - (totalCells % 7)) % 7;
  const trailingBlanks = Array.from({ length: trailingBlanksCount }, (_, i) => i);

  return (
    <div className="w-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 w-full border-t border-l border-gray-100">
        {weekDays.map((label, i) => (
          <div key={label} className={`text-center text-[10px] py-2 font-bold ${i === 0 ? 'text-red-500' : i === 6 ? 'text-[#3CDCBA]' : 'text-gray-400'}`}>
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 그리드: w-full과 grid-cols-7을 명시적으로 고정 */}
      <div className="grid grid-cols-7 w-full border-t border-l border-gray-100">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="h-24 bg-gray-50/10 border-b border-r border-gray-100" />
        ))}
        
        {days.map((day) => {
          const currentTarget = `${year}${String(month + 1).padStart(2, '0')}${String(day).padStart(2, '0')}`;
          const entry = diaryEntries.find(e => e.date.replace(/[^0-9]/g, '') === currentTarget);
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          return (
            <div key={day} className="h-24 border-b border-r border-gray-100 bg-white">
              <DateCell
                day={day}
                images={entry?.images}
                onClick={() => onDateClick(dateString)}
                isSunday={new Date(year, month, day).getDay() === 0}
                isSaturday={new Date(year, month, day).getDay() === 6}
                isToday={new Date().getFullYear() === year && new Date().getMonth() === month && new Date().getDate() === day}
              />
            </div>
          );
        })}

        {trailingBlanks.map((_, i) => (
          <div key={`trailing-${i}`} className="h-24 bg-gray-50/10 border-b border-r border-gray-100" />
        ))}
      </div>
    </div>
  );
}