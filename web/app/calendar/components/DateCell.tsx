'use client';

interface DateCellProps {
  day: number;
  date: string;
  thumbnail?: string;
  images?: string[]; // 추가!
  onClick: () => void;
  isWeekend: boolean;
  isSunday: boolean;
}

export default function DateCell({ 
  day, 
  date, 
  thumbnail, 
  images,  // 추가!
  onClick, 
  isWeekend, 
  isSunday 
}: DateCellProps) {
  const today = new Date();
  const isToday = 
    today.getDate() === day &&
    today.getMonth() === parseInt(date.split('-')[1]) - 1 &&
    today.getFullYear() === parseInt(date.split('-')[0]);

  return (
    <button
      onClick={onClick}
      className="relative h-20 border-b border-r border-gray-100 hover:bg-gray-50 transition-colors"
    >
      {/* 날짜 숫자 */}
      <div className={`absolute top-1 left-1 text-xs font-medium z-10 ${
        isToday 
          ? 'bg-[#3CDCBA] text-white w-5 h-5 rounded-full flex items-center justify-center' 
          : isSunday 
            ? 'text-red-500' 
            : isWeekend 
              ? 'text-[#3CDCBA]' 
              : 'text-gray-900'
      }`}>
        {day}
      </div>

      {/* 썸네일 표시 */}
      {(images || thumbnail) && (
        <div className="w-full h-full pt-6 px-1">
          {images && images.length > 1 ? (
            // 여러 장 - 그리드로 표시
            <div className="grid grid-cols-3 gap-0.5 h-full">
              {images.slice(0, 6).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-200 rounded-sm overflow-hidden"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            // 1장 - 전체 크기
            <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={thumbnail || images?.[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      )}
    </button>
  );
}