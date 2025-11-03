import Image from "next/image";

interface InputFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  iconSrc: string;
}

export default function InputField({
  type,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  iconSrc,
}: InputFieldProps) {
  return (
    <div className="flex items-center px-3 py-3">
      <Image src={iconSrc} alt="아이콘" width={20} height={20} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full ml-2 text-gray-600 placeholder-gray-400 focus:outline-none text-base"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}