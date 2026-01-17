"use client";

interface TermsCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function TermsCheckbox({ label, checked, onChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-center mb-1 cursor-pointer" onClick={onChange}>
      <div className="relative flex items-center">
        <input 
          type="checkbox" 
          checked={checked} 
          readOnly
          className="appearance-none w-6 h-6 border-2 border-gray-200 rounded-full checked:bg-[#3CDCBA] checked:border-[#3CDCBA] transition-all cursor-pointer"
        />
        {checked && (
          <svg 
            className="absolute w-3.5 h-3.5 text-white pointer-events-none left-[5px]"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`ml-3 text-[17px] font-bold ${checked ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}