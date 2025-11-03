'use client';

import { useState } from 'react';
import DateCell from './DateCell';

export default function CalendarGrid() {
  const [currentDate] = useState(new Date(2024, 11)); // 2024년 12월
  const [images, setImages] = useState<Record<number, string[]>>({});

  // 날짜 계산
  const getDays = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const days = [];
    
    // 빈 칸 추가 (달의 첫 날 이전)
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // 날짜 추가
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (day: number, files: FileList) => {
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), ...urls]
    }));
  };

  return (
    <div className="p-4">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
          <div 
            key={day} 
            className={`text-center text-sm font-medium py-2 ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {getDays().map((day, idx) => (
          <DateCell 
            key={idx} 
            day={day} 
            images={images[day || 0] || []}
            dayOfWeek={idx % 7}
            onImageUpload={handleImageUpload}
          />
        ))}
      </div>
    </div>
  );
}