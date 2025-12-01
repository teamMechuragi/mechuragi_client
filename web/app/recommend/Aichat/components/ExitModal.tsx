interface ExitModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ExitModal({ isOpen, onCancel, onConfirm }: ExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      
      {/* 모달 */}
      <div className="relative bg-white rounded-3xl p-8 mx-6 w-full max-w-sm shadow-2xl">
        <h2 className="text-xl font-bold text-center mb-8">
          대화를 종료할까요?
        </h2>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-[#00D9A0] text-white rounded-2xl font-semibold hover:bg-[#00C090] transition-colors"
          >
            종료
          </button>
        </div>
      </div>
    </div>
  );
}