"use client";

interface TermsCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function TermsCheckbox({ label, checked, onChange }: TermsCheckboxProps) {
  return (
    <div className="flex items-center mb-4">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="w-5 h-5 accent-[#3CDCBA] mr-2"
      />
      <span className="text-gray-700">{label}</span>
    </div>
  );
}
