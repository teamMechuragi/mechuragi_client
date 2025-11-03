'use client';

import Image from 'next/image';

interface VoteOptionInputProps {
  voteType: '사진' | '일반';
  options: string[];
  setOptions: (options: string[]) => void;
  images: File[];
  setImages: (images: File[]) => void;
  imagePreviews: string[];
  setImagePreviews: (previews: string[]) => void;
}

export default function VoteOptionInput({
  voteType,
  options,
  setOptions,
  images,
  setImages,
  imagePreviews,
  setImagePreviews
}: VoteOptionInputProps) {

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      if (voteType === '사진') {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleImageUpload = (index: number, file: File) => {
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result as string;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages[index] = null as any;
    newPreviews[index] = '';
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="mb-6">
      <div className="space-y-3">
        {options.map((option, index) => (
          <div key={index}>
            {voteType === '사진' && (
              <div className="mb-3">
                {imagePreviews[index] ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={imagePreviews[index]}
                      alt={`옵션 ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full aspect-video rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm text-gray-400">사진을 올려보세요</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder="항목 입력"
                className="flex-1 px-4 py-3.5 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#3CDCBA] text-sm"
              />
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {options.length < 10 && (
        <button
          onClick={addOption}
          className="w-full mt-3 py-3.5 bg-gray-100 rounded-full text-gray-600 font-medium hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm">항목 추가</span>
        </button>
      )}
    </div>
  );
}