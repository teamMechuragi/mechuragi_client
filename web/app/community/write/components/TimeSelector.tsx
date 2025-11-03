'use client';

import { useRef, useEffect, useState } from 'react';

interface TimeSelectorProps {
  initialDays: number;
  initialHours: number;
  initialMinutes: number;
  onConfirm: (days: number, hours: number, minutes: number) => void;
  onCancel: () => void;
}

export default function TimeSelector({
  initialDays,
  initialHours,
  initialMinutes,
  onConfirm,
  onCancel
}: TimeSelectorProps) {
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [selectedHours, setSelectedHours] = useState(initialHours);
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);

  const daysRef = useRef<HTMLDivElement>(null);
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);

  const daysArray = Array.from({ length: 8 }, (_, i) => i);
  const hoursArray = Array.from({ length: 24 }, (_, i) => i);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  const ITEM_HEIGHT = 48;

  const scrollToIndex = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    if (ref.current) {
      ref.current.scrollTop = index * ITEM_HEIGHT;
    }
  };

  const handleScrollEnd = (
    ref: React.RefObject<HTMLDivElement>,
    setter: (val: number) => void
  ) => {
    if (!ref.current) return;
    const scrollTop = ref.current.scrollTop;
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    setter(index);
    scrollToIndex(ref, index);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollToIndex(daysRef, initialDays);
      scrollToIndex(hoursRef, initialHours);
      scrollToIndex(minutesRef, initialMinutes);
    }, 50);
  }, []);

  useEffect(() => {
    let daysTimer: NodeJS.Timeout;
    let hoursTimer: NodeJS.Timeout;
    let minutesTimer: NodeJS.Timeout;

    const daysEl = daysRef.current;
    const hoursEl = hoursRef.current;
    const minutesEl = minutesRef.current;

    const handleDaysScroll = () => {
      clearTimeout(daysTimer);
      daysTimer = setTimeout(() => handleScrollEnd(daysRef, setSelectedDays), 100);
    };

    const handleHoursScroll = () => {
      clearTimeout(hoursTimer);
      hoursTimer = setTimeout(() => handleScrollEnd(hoursRef, setSelectedHours), 100);
    };

    const handleMinutesScroll = () => {
      clearTimeout(minutesTimer);
      minutesTimer = setTimeout(() => handleScrollEnd(minutesRef, setSelectedMinutes), 100);
    };

    if (daysEl) daysEl.addEventListener('scroll', handleDaysScroll);
    if (hoursEl) hoursEl.addEventListener('scroll', handleHoursScroll);
    if (minutesEl) minutesEl.addEventListener('scroll', handleMinutesScroll);

    return () => {
      if (daysEl) daysEl.removeEventListener('scroll', handleDaysScroll);
      if (hoursEl) hoursEl.removeEventListener('scroll', handleHoursScroll);
      if (minutesEl) minutesEl.removeEventListener('scroll', handleMinutesScroll);
      clearTimeout(daysTimer);
      clearTimeout(hoursTimer);
      clearTimeout(minutesTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" onClick={onCancel}>
      <div className="bg-white w-full max-w-sm rounded-t-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <h3 className="text-center font-bold text-lg mb-6">종료시간 지정하기</h3>

          {/* 라벨 */}
          <div className="flex justify-center gap-8 mb-4">
            <div className="w-16 text-center">
              <p className="text-sm text-gray-500">일</p>
            </div>
            <div className="w-16 text-center">
              <p className="text-sm text-gray-500">시간</p>
            </div>
            <div className="w-16 text-center">
              <p className="text-sm text-gray-500">분</p>
            </div>
          </div>

          {/* 스크롤 영역 */}
          <div className="flex justify-center items-center gap-8 mb-6 relative" style={{ height: '144px' }}>
            {/* 선택 영역 표시 */}
            <div 
              className="absolute left-0 right-0 bg-[#3CDCBA]/10 border-y-2 border-[#3CDCBA] pointer-events-none rounded-lg" 
              style={{ 
                height: '48px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />

            {/* 일 */}
            <div className="flex flex-col items-center">
              <div 
                ref={daysRef}
                className="overflow-y-scroll hide-scrollbar"
                style={{ 
                  height: '144px',
                  width: '64px'
                }}
              >
                <div style={{ height: '48px', flexShrink: 0 }} />
                {daysArray.map((day) => (
                  <div
                    key={day}
                    onClick={() => {
                      setSelectedDays(day);
                      scrollToIndex(daysRef, day);
                    }}
                    style={{ 
                      height: '48px',
                      color: day === selectedDays ? '#3CDCBA' : '#D1D5DB',
                      flexShrink: 0
                    }}
                    className="flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors"
                  >
                    {day}
                  </div>
                ))}
                <div style={{ height: '48px', flexShrink: 0 }} />
              </div>
            </div>

            {/* 시간 */}
            <div className="flex flex-col items-center">
              <div 
                ref={hoursRef}
                className="overflow-y-scroll hide-scrollbar"
                style={{ 
                  height: '144px',
                  width: '64px'
                }}
              >
                <div style={{ height: '48px', flexShrink: 0 }} />
                {hoursArray.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => {
                      setSelectedHours(hour);
                      scrollToIndex(hoursRef, hour);
                    }}
                    style={{ 
                      height: '48px',
                      color: hour === selectedHours ? '#3CDCBA' : '#D1D5DB',
                      flexShrink: 0
                    }}
                    className="flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors"
                  >
                    {hour}
                  </div>
                ))}
                <div style={{ height: '48px', flexShrink: 0 }} />
              </div>
            </div>

            {/* 분 */}
            <div className="flex flex-col items-center">
              <div 
                ref={minutesRef}
                className="overflow-y-scroll hide-scrollbar"
                style={{ 
                  height: '144px',
                  width: '64px'
                }}
              >
                <div style={{ height: '48px', flexShrink: 0 }} />
                {minutesArray.map((minute) => (
                  <div
                    key={minute}
                    onClick={() => {
                      setSelectedMinutes(minute);
                      scrollToIndex(minutesRef, minute);
                    }}
                    style={{ 
                      height: '48px',
                      color: minute === selectedMinutes ? '#3CDCBA' : '#D1D5DB',
                      flexShrink: 0
                    }}
                    className="flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors"
                  >
                    {minute}
                  </div>
                ))}
                <div style={{ height: '48px', flexShrink: 0 }} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3.5 bg-gray-200 rounded-full font-bold text-gray-700"
            >
              취소
            </button>
            <button
              onClick={() => onConfirm(selectedDays, selectedHours, selectedMinutes)}
              className="flex-1 py-3.5 bg-[#3CDCBA] rounded-full font-bold text-white"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}