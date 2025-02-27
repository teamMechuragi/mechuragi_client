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
    <div
      className={`flex items-center border rounded-2xl px-4 py-2 mb-3 transition-all ${
        isFocused ? "border-[#3CDCBA]" : "border-[#BDBDBD]"
      }`}
    >
      <Image src={iconSrc} alt="아이콘" width={20} height={20} />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full ml-2 focus:outline-none text-lg placeholder:text-lg text-[#3C3C43] placeholder-opacity-30 font-pretendard placeholder:font-pretendard placeholder:font-semibold"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
