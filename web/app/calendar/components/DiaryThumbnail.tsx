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

  // 이미지가 1장인 경우
  if (images.length === 1) {
    return (
      <button
        onClick={onClick}
        className="w-full h-full rounded-lg overflow-hidden bg-gray-100"
      >
        <img
          src={images[0]}
          alt="일기 사진"
          className="w-full h-full object-cover"
        />
      </button>
    );
  }

  // 이미지가 2~6장인 경우 - 그리드로 표시
  return (
    <button
      onClick={onClick}
      className="w-full h-full"
    >
      <div className="grid grid-cols-3 gap-0.5 h-full">
        {images.slice(0, 6).map((img, idx) => (
          <div
            key={idx}
            className="aspect-square bg-gray-100 rounded-sm overflow-hidden"
          >
            <img
              src={img}
              alt={`일기 사진 ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </button>
  );
}