"use client";

// props에 id를 추가하여 어떤 항목이 클릭되었는지 식별할 수 있게 합니다.
interface ToggleItemProps {
  id: string; 
  label: string;
  isChecked: boolean; // 내부 state 대신 부모의 state를 props로 받습니다.
  onToggle: (id: string, checked: boolean) => void; 
  onEdit: (id: string) => void;
}

export default function ToggleItem({ 
  id,
  label, 
  isChecked,
  onToggle,
  onEdit 
}: ToggleItemProps) {

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 div의 onEdit(페이지 이동)이 실행되지 않도록 차단
    onToggle(id, !isChecked); // 부모에게 변경 사실을 알림
  };

  return (
    <div 
      onClick={() => onEdit(id)} // 전체 영역 클릭 시 수정 페이지로 이동
      className="flex items-center justify-between py-4 bg-[#F7F8F9] px-5 rounded-2xl mb-3 cursor-pointer hover:bg-gray-100 transition-all"
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[#1A1A1A] text-[15px] font-bold">{label}</span>
        <span className="text-gray-400 text-[11px]">클릭하여 상세 수정</span>
      </div>

      <button
        onClick={handleToggle}
        className="relative inline-block w-11 h-6 focus:outline-none"
        aria-label={`${label} 토글`}
      >
        {/* 배경 애니메이션 */}
        <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
          isChecked ? 'bg-[#3CDCBA]' : 'bg-gray-300'
        }`} />
        
        {/* 스위치 원형 애니메이션 */}
        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}