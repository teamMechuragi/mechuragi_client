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
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={onChange} 
            className="w-5 h-5 accent-[#3CDCBA] mr-2"
          />
          <span className="text-gray-700">{label}</span>
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
