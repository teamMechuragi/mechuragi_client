'use client';

interface VoteTypeSelectProps {
  voteType: '사진' | '일반' | null;
  onSelect: (type: '사진' | '일반') => void;
}

export default function VoteTypeSelect({ voteType, onSelect }: VoteTypeSelectProps) {
  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => onSelect('사진')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
          voteType === '사진'
            ? 'bg-[#3CDCBA] text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">사진</span>
      </button>
      
      <button
        onClick={() => onSelect('일반')}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all ${
          voteType === '일반'
            ? 'bg-[#3CDCBA] text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        <span className="text-sm font-medium">일반</span>
      </button>
    </div>
  );
}