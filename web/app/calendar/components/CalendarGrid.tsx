'use client';

import DateCell from './DateCell';

interface DiaryEntry {
  date: string;
  thumbnail: string;
}

interface CalendarGridProps {
  year: number;
  month: number;
  diaryEntries: DiaryEntry[];
  onDateClick: (date: string) => void;
}

export default function CalendarGrid({ year, month, diaryEntries, onDateClick }: CalendarGridProps) {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="w-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 px-4 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-400' : index === 6 ? 'text-[#3CDCBA]' : 'text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 - 꽉 채움 */}
      <div className="grid grid-cols-7">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-20" />
        ))}

        {days.map((day) => {
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = diaryEntries.find(e => e.date === dateString);
          const dayOfWeek = new Date(year, month, day).getDay();

          return (
            <DateCell
              key={day}
              day={day}
              date={dateString}
              thumbnail={entry?.thumbnail}
              onClick={() => onDateClick(dateString)}
              isWeekend={dayOfWeek === 0 || dayOfWeek === 6}
              isSunday={dayOfWeek === 0}
            />
          );
        })}
      </div>
    </div>
  );
}