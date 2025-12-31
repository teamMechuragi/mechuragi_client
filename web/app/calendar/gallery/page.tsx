'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  file?: File;
}

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const newPhotos: Photo[] = files.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        file: file,
      }));

      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const togglePhotoSelection = (id: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (newSelection.size >= 4) {
        alert('사진은 최대 4장까지 선택할 수 있습니다.');
        return;
      }
      newSelection.add(id);
    }
    setSelectedPhotos(newSelection);
  };

  const handleDeletePhoto = (id: string) => {
    const photoToDelete = photos.find(p => p.id === id);
    if (photoToDelete) {
      URL.revokeObjectURL(photoToDelete.url);
    }
    
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    setSelectedPhotos(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleNext = async () => {
    if (selectedPhotos.size === 0) {
      alert('사진을 최소 1장 선택해주세요.');
      return;
    }

    setIsUploading(true);

    try {
      const selectedPhotoObjects = photos.filter(photo => 
        selectedPhotos.has(photo.id)
      );

      // localStorage에 선택된 사진 정보 저장
      const photoData = selectedPhotoObjects.map(photo => ({
        id: photo.id,
        url: photo.url,
        // file 객체는 저장 불가하므로 나중에 서버 업로드 시 처리
      }));
      
      localStorage.setItem('selectedPhotos', JSON.stringify(photoData));
      
      // 파일 객체들도 별도로 저장 (IndexedDB 사용하면 더 좋지만 일단 간단하게)
      // 실제로는 여기서 바로 서버에 업로드하는 것을 추천
      
      router.push(`/calendar/diary/new?date=${date}`);
    } catch (error) {
      console.error('사진 처리 실패:', error);
      alert('사진 처리에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  // 메모리 정리
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.url.startsWith('blob:')) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <button onClick={() => router.back()}>
          <Image src="/icon/arrow-left.png" alt="뒤로가기" width={24} height={24} />
        </button>
        <h1 className="text-lg font-bold">갤러리</h1>
        <button 
          onClick={handleNext}
          disabled={selectedPhotos.size === 0 || isUploading}
          className={`font-medium text-sm ${
            selectedPhotos.size > 0 && !isUploading ? 'text-[#3CDCBA]' : 'text-gray-300'
          }`}
        >
          {isUploading ? '처리 중...' : '다음'}
        </button>
      </div>

      {/* 사진 선택 버튼들 */}
      <div className="px-6 py-4 border-b bg-gray-50 space-y-3">
        {/* 카메라로 찍기 */}
        <label className="flex items-center gap-2 cursor-pointer text-[#3CDCBA] font-medium">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>사진 찍기</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>

        {/* 갤러리에서 선택 */}
        <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>갤러리에서 선택</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
        
        <p className="text-xs text-gray-500">최대 4장까지 선택할 수 있습니다</p>
      </div>

      {/* 선택된 사진 수 */}
      {selectedPhotos.size > 0 && (
        <div className="px-6 py-3 bg-[#E6F9F4] text-[#3CDCBA] text-sm font-medium">
          {selectedPhotos.size}장 선택됨
        </div>
      )}

      {/* 사진 그리드 */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">사진을 찍거나 선택해주세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 p-1">
          {photos.map((photo) => (
            <div 
              key={photo.id}
              className="relative aspect-square"
            >
              <img 
                src={photo.url} 
                alt="선택된 음식 사진" 
                className="w-full h-full object-cover"
              />
              
              {/* 선택 체크박스 */}
              <div
                onClick={() => togglePhotoSelection(photo.id)}
                className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  selectedPhotos.has(photo.id)
                    ? 'bg-[#3CDCBA]'
                    : 'bg-white bg-opacity-60 border-2 border-white'
                }`}
              >
                {selectedPhotos.has(photo.id) && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* 삭제 버튼 */}
              <button
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-80"
              >
                <span className="text-white text-sm">×</span>
              </button>

              {/* 선택 오버레이 */}
              {selectedPhotos.has(photo.id) && (
                <div className="absolute inset-0 bg-[#3CDCBA] bg-opacity-20 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}