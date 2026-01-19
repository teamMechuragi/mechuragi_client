'use client';

import { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/common/Header';
import { uploadImage } from '@/app/api/diaryApi';

interface Photo {
  id: string;
  url: string;
  file: File;
}

// 1. useSearchParams를 사용하는 로직을 별도 컴포넌트로 분리
function GalleryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPhotos: Photo[] = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file),
        file: file,
      }));
      setPhotos(prev => [...newPhotos, ...prev]);
    }
  };

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(id)) {
        return prev.filter(pId => pId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleNext = async () => {
    if (selectedPhotos.length === 0) return;

    setIsUploading(true);

    try {
      // 선택된 사진들을 서버에 업로드
      const uploadPromises = selectedPhotos.map(async (id) => {
        const photo = photos.find(p => p.id === id);
        if (!photo) return null;

        const data = await uploadImage(photo.file);
        return { url: data.imageUrl };
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      const validPhotos = uploadedPhotos.filter(p => p !== null);

      localStorage.setItem('selectedPhotos', JSON.stringify(validPhotos));
      router.push(`/calendar/diary/new?date=${date}`);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans max-w-sm mx-auto">
      <Header
        isWrite
        title="갤러리"
        submitText={isUploading ? "업로드 중..." : "다음"}
        submitDisabled={selectedPhotos.length === 0 || isUploading}
        onSubmit={handleNext}
      />

      <input 
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <main className="pt-14 grid grid-cols-3 gap-[1px]">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative aspect-square bg-gray-50 flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-200"
        >
          <svg className="w-8 h-8 text-[#3CDCBA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
          </svg>
          <span className="text-[10px] text-gray-400 mt-1">사진 불러오기</span>
        </div>

        {photos.map((photo) => {
          const selectIndex = selectedPhotos.indexOf(photo.id);
          const isSelected = selectIndex !== -1;

          return (
            <div 
              key={photo.id}
              onClick={() => togglePhotoSelection(photo.id)}
              className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer"
            >
              <img 
                src={photo.url} 
                alt="Selected" 
                className={`w-full h-full object-cover transition-all ${isSelected ? 'scale-110' : 'scale-100'}`}
              />
              
              <div className="absolute top-2 right-2 z-20">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[12px] font-bold transition-all ${
                  isSelected 
                    ? 'bg-[#3CDCBA] border-[#3CDCBA] text-white' 
                    : 'bg-black/20 border-white text-transparent'
                }`}>
                  {isSelected ? selectIndex + 1 : ''}
                </div>
              </div>

              {isSelected && <div className="absolute inset-0 bg-black/20 z-10" />}
            </div>
          );
        })}
      </main>

      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <p className="text-sm">첫 번째 칸을 눌러</p>
          <p className="text-sm">내 기기의 사진을 선택하세요!</p>
        </div>
      )}
    </div>
  );
}

// 2. 메인 export 컴포넌트에서 Suspense 적용
export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GalleryContent />
    </Suspense>
  );
}