'use client';

interface DateCellProps {
  day: number;
  images?: string[];
  onClick: () => void;
  isSunday: boolean;
  isSaturday: boolean;
  isToday: boolean;
}

export default function DateCell({ day, images, onClick, isSunday, isSaturday, isToday }: DateCellProps) {
  const hasImages = images && images.length > 0;
  const extraCount = images && images.length > 4 ? images.length - 4 : 0;

  return (
    <button
      onClick={onClick}
      // h-32를 h-full로 변경하여 부모 그리드 높이에 맞춤
      className="relative h-full w-full flex flex-col items-center overflow-hidden border-b border-r border-gray-100 transition-all active:scale-95 bg-white"
    >
      {/* 1. 날짜 표시: 사진이 없는 날에만 중앙에 표시 */}
      {!hasImages && (
        <span className={`relative z-10 text-[11px] font-bold mt-4 ${
          isToday 
            ? 'bg-[#3CDCBA] text-white w-5 h-5 rounded-full flex items-center justify-center' 
            : isSunday 
              ? 'text-red-500' 
              : isSaturday 
                ? 'text-[#3CDCBA]' 
                : 'text-gray-800'
        }`}>
          {day}
        </span>
      )}

      {/* 2. 사진 그리드 영역 */}
      {hasImages && (
        <div className="absolute inset-0 z-0">
          <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-[0.5px]">
            {/* 사진 1장 */}
            {images.length === 1 && (
              <img src={images[0]} className="col-span-2 row-span-2 w-full h-full object-cover" alt="" />
            )}
            
            {/* 사진 2장 */}
            {images.length === 2 && (
              <>
                <img src={images[0]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
                <img src={images[1]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
              </>
            )}

            {/* 사진 3장 */}
            {images.length === 3 && (
              <>
                <img src={images[0]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
                <div className="col-span-1 row-span-2 grid grid-rows-2 gap-[0.5px]">
                  <img src={images[1]} className="w-full h-full object-cover" alt="" />
                  <img src={images[2]} className="w-full h-full object-cover" alt="" />
                </div>
              </>
            )}

            {/* 사진 4장 이상 */}
            {images.length >= 4 && (
              <>
                <img src={images[0]} className="w-full h-full object-cover" alt="" />
                <img src={images[1]} className="w-full h-full object-cover" alt="" />
                <img src={images[2]} className="w-full h-full object-cover" alt="" />
                <div className="relative w-full h-full">
                  <img src={images[3]} className="w-full h-full object-cover" alt="" />
                  {extraCount > 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">+{extraCount}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </button>
  );
}