"use client";

import Image from "next/image";

interface TermsDetailsProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  content: string;
  expanded: boolean;
  onToggle: () => void;
}

export default function TermsDetails({ label, checked, onChange, content, expanded, onToggle }: TermsDetailsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center cursor-pointer" onClick={onChange}>
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              checked={checked} 
              readOnly 
              className="appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:bg-[#3CDCBA] checked:border-[#3CDCBA] transition-colors cursor-pointer"
            />
            {checked && (
              <svg 
                className="absolute w-3 h-3 text-white pointer-events-none"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className={`ml-3 text-[15px] ${checked ? 'text-[#1a1a1a] font-semibold' : 'text-gray-400'}`}>
            {label}
          </span>
        </div>
        
        <button onClick={onToggle} className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
          <Image src="/icon/arrow-right.png" alt="자세히 보기" width={20} height={20} className="opacity-30" />
        </button>
      </div>

      {expanded && (
        <div className="mt-3 p-4 border border-white/20 rounded-xl bg-white/40 backdrop-blur-md shadow-sm animate-fade-in">
          <p className="text-[14px] leading-[1.6] text-[#4E5968] whitespace-pre-line font-medium">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}