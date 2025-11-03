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
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative flex items-center">
            <input 
              type="checkbox" 
              checked={checked} 
              onChange={onChange} 
              className="appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:bg-[#3CDCBA] checked:border-[#3CDCBA] cursor-pointer"
            />
            {checked && (
              <svg 
                className="absolute w-3 h-3 text-white pointer-events-none left-1"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-gray-700 ml-2">{label}</span>
        </div>
        <button onClick={onToggle}>
          <Image src="/icon/arrow-right.png" alt="자세히 보기" width={20} height={20} />
        </button>
      </div>
      {expanded && (
        <div className="mt-2 p-3 border border-gray-300 rounded-md bg-white text-sm text-gray-700">
          {content}
        </div>
      )}
    </div>
  );
}