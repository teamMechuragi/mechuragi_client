'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/common/Header'; // 공통 헤더 임포트

interface Photo {
  id: string;
  url: string;
  file: File; // 실제 서버 전송을 위한 파일 객체
}

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');
  
  // 사용자가 기기에서 직접 선택한 사진들이 담깁니다.
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 기기(폰/컴퓨터)의 파일을 불러오는 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const newPhotos: Photo[] = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 11),
        url: URL.createObjectURL(file), // 미리보기용 URL 생성
        file: file,
      }));

      // 기존 사진들에 새로 선택한 사진 추가 (최신순)
      setPhotos(prev => [...newPhotos, ...prev]);
    }
  };

  // 사진 선택/해제 로직 (개수 제한 해제)
  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(id)) {
        // 이미 선택된 경우 제거
        return prev.filter(pId => pId !== id);
      } else {
        // [수정] 4장 제한 alert 및 체크 로직 삭제
        // 선택되지 않은 경우 목록 끝에 추가 (선택 순서 유지)
        return [...prev, id];
      }
    });
  };

  const handleNext = () => {
    if (selectedPhotos.length === 0) return;
    
    // 선택된 순서대로 사진 데이터 정리 (URL만 로컬스토리지 전달)
    const selectedData = selectedPhotos.map(id => {
      const p = photos.find(photo => photo.id === id);
      return { id: p?.id, url: p?.url };
    });

    localStorage.setItem('selectedPhotos', JSON.stringify(selectedData));
    router.push(`/calendar/diary/new?date=${date}`);
  };

  return (
    <div className="min-h-screen bg-white font-sans max-w-sm mx-auto">
      {/* 공통 Header 컴포넌트 사용 */}
      <Header 
        isWrite 
        title="갤러리" 
        submitText="다음"
        submitDisabled={selectedPhotos.length === 0}
        onSubmit={handleNext}
      />

      {/* 숨겨진 Input: 실제 기기의 탐색기/갤러리를 엽니다 */}
      <input 
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* 헤더가 fixed이므로 pt-14로 여백 확보 */}
      <main className="pt-14 grid grid-cols-3 gap-[1px]">
        {/* 카메라 버튼 칸: 클릭 시 내 폰/컴퓨터 사진 선택창 오픈 */}
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

        {/* 불러온 사진들 표시 */}
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
              
              {/* 숫자 인디케이터 (선택한 순서대로 번호 표시) */}
              <div className="absolute top-2 right-2 z-20">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[12px] font-bold transition-all ${
                  isSelected 
                    ? 'bg-[#3CDCBA] border-[#3CDCBA] text-white' 
                    : 'bg-black/20 border-white text-transparent'
                }`}>
                  {isSelected ? selectIndex + 1 : ''}
                </div>
              </div>

              {/* 선택 오버레이 */}
              {isSelected && <div className="absolute inset-0 bg-black/20 z-10" />}
            </div>
          );
        })}
      </main>

      {/* 안내 문구 */}
      {photos.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-32 text-gray-400">
          <p className="text-sm">첫 번째 칸을 눌러</p>
          <p className="text-sm">내 기기의 사진을 선택하세요!</p>
        </div>
      )}
    </div>
  );
}