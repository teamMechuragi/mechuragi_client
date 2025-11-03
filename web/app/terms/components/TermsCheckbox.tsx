"use client";

interface TermsCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function TermsCheckbox({ label, checked, onChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-center mb-4">
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
  );
}