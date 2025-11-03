'use client';

import { useState } from 'react';

interface ToggleItemProps {
  label: string;
  defaultChecked: boolean;
  onChange?: (checked: boolean) => void;
  onClick?: () => void; // 클릭 시 페이지 이동용
}

export default function ToggleItem({ 
  label, 
  defaultChecked,
  onChange,
  onClick 
}: ToggleItemProps) {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모의 onClick 실행 방지
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange?.(newValue);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex items-center justify-between py-3 bg-gray-50 px-4 rounded-lg ${
        onClick ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
    >
      <span className="text-gray-700 text-sm">{label}</span>
      <button
        onClick={handleToggle}
        className="relative inline-block w-11 h-6 focus:outline-none"
        aria-label={`${label} 토글`}
      >
        <div className={`w-11 h-6 rounded-full transition-colors ${
          isChecked ? 'bg-[#3CDCBA]' : 'bg-gray-300'
        }`} />
        
        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}