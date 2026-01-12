'use client';

interface DiaryThumbnailProps {
  images: string[];
  onClick?: () => void;
}

export default function DiaryThumbnail({ images, onClick }: DiaryThumbnailProps) {
  // 이미지가 없는 경우
  if (!images || images.length === 0) {
    return null;
  }

  const extraCount = images.length > 4 ? images.length - 4 : 0;

  // 이미지가 1장인 경우
  if (images.length === 1) {
    return (
      <button
        onClick={onClick}
        className="w-full h-full rounded-lg overflow-hidden bg-gray-100 active:scale-[0.98] transition-transform"
      >
        <img
          src={images[0]}
          alt="일기 사진"
          className="w-full h-full object-cover"
        />
      </button>
    );
  }

  // 2장 이상인 경우 - 캘린더와 동일한 2x2 그리드 로직 적용
  return (
    <button
      onClick={onClick}
      className="w-full h-full rounded-lg overflow-hidden bg-gray-50 active:scale-[0.98] transition-transform"
    >
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-[1px]">
        {/* 사진 2장: 좌우 분할 */}
        {images.length === 2 && (
          <>
            <img src={images[0]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
            <img src={images[1]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
          </>
        )}

        {/* 사진 3장: 왼쪽 크게, 오른쪽 2개 세로 분할 */}
        {images.length === 3 && (
          <>
            <img src={images[0]} className="col-span-1 row-span-2 w-full h-full object-cover" alt="" />
            <div className="col-span-1 row-span-2 grid grid-rows-2 gap-[1px]">
              <img src={images[1]} className="w-full h-full object-cover" alt="" />
              <img src={images[2]} className="w-full h-full object-cover" alt="" />
            </div>
          </>
        )}

        {/* 사진 4장 이상: 2x2 격자 및 +N 표시 */}
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
    </button>
  );
}