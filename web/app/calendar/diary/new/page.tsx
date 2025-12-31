'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/common/Header';

interface ImageFile {
  url: string;
  file?: File;
}

export default function NewDiaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get('date');

  // State 선언
  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>(''); // 본문 추가
  const [satisfaction, setSatisfaction] = useState<number>(0); // 0, 0.5, 1, 1.5, ... 5
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
  
  // Refs
  const titleInputRef = useRef<HTMLInputElement>(null);
  const starContainerRef = useRef<HTMLDivElement>(null);

  // localStorage에서 갤러리에서 선택한 사진 불러오기
  useEffect(() => {
    const savedPhotos = localStorage.getItem('selectedPhotos');
    if (savedPhotos) {
      try {
        const photos = JSON.parse(savedPhotos) as ImageFile[];
        setSelectedImages(photos);
        localStorage.removeItem('selectedPhotos');
      } catch (error) {
        console.error('사진 불러오기 실패:', error);
      }
    }
  }, []);

  // 제목 입력창 표시 시 포커스
  useEffect(() => {
    if (showTitleInput && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [showTitleInput]);

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      selectedImages.forEach((img) => {
        if (img.url.startsWith('blob:')) {
          URL.revokeObjectURL(img.url);
        }
      });
    };
  }, [selectedImages]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    
    if (selectedImages.length + fileArray.length > 4) {
      alert('사진은 최대 4장까지 선택할 수 있습니다.');
      return;
    }
    
    const imageFiles = fileArray.filter((file) => file.type.startsWith('image/'));
    
    if (imageFiles.length !== fileArray.length) {
      alert('이미지 파일만 업로드 가능합니다.');
    }
    
    const newImages: ImageFile[] = imageFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file: file
    }));
    
    setSelectedImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  // 이미지 삭제
  const removeImage = (index: number) => {
    const imageToRemove = selectedImages[index];
    if (imageToRemove && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 별점 터치/드래그 처리
  const handleStarInteraction = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!starContainerRef.current) return;
    
    const rect = starContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const starWidth = rect.width / 5;
    const newRating = x / starWidth;
    
    // 0.5 단위로 반올림
    const roundedRating = Math.round(newRating * 2) / 2;
    
    if (roundedRating >= 0.5 && roundedRating <= 5) {
      setSatisfaction(roundedRating);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // 저장
  const handleSave = async () => {
    const formData = new FormData();
    formData.append('date', date || '');
    formData.append('title', title);
    formData.append('content', content); // 본문 추가
    formData.append('satisfaction', satisfaction.toString());
    formData.append('tags', JSON.stringify(tags));
    
    selectedImages.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });

    const diaryData = {
      date,
      imageUrls: selectedImages.map((img) => img.url),
      title,
      content,
      satisfaction,
      tags,
    };
    console.log('저장할 데이터:', diaryData);
    
    router.push('/calendar');
  };

  const isFormValid = selectedImages.length > 0 || title.trim() !== '';

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header 
        title="먹방 일기 작성"
        isWrite={true}
        backLink="/calendar"
        onSubmit={handleSave}
        submitDisabled={!isFormValid}
      />

      <div className="px-6 py-4 space-y-6">
        {/* 이미지 업로드 */}
        <div>
          {selectedImages.length === 0 ? (
            <label className="block w-full border-2 border-dashed border-[#3CDCBA] rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 mb-3 flex items-center justify-center">
                  <svg className="w-10 h-10 text-[#3CDCBA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[#3CDCBA] font-semibold text-lg">사진 추가</p>
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3 overflow-x-auto pb-2 pt-2 px-1">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative flex-shrink-0 w-32 h-32">
                    <img 
                      src={img.url} 
                      alt={`선택된 이미지 ${index + 1}`} 
                      className="w-full h-full object-cover rounded-2xl shadow-md" 
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all shadow-lg"
                      type="button"
                    >
                      <span className="text-sm leading-none">×</span>
                    </button>
                  </div>
                ))}
              </div>
              {selectedImages.length < 4 && (
                <button
                  onClick={() => router.push(`/calendar/diary/gallery?date=${date}`)}
                  className="text-sm text-[#3CDCBA] hover:text-[#35C4A8] flex items-center gap-1"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  사진 더 추가하기
                </button>
              )}
            </div>
          )}
        </div>

        {/* 제목 입력 */}
        <div>
          {!showTitleInput && !title ? (
            <button
              onClick={() => setShowTitleInput(true)}
              className="w-full text-left text-gray-400 text-xl py-1 font-bold"
              type="button"
            >
              제목
            </button>
          ) : (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                if (!title) setShowTitleInput(false);
              }}
              placeholder="제목"
              className="w-full p-0 border-0 bg-transparent focus:outline-none text-xl text-gray-800 font-bold"
            />
          )}
        </div>

        {/* 본문 입력 */}
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="먹방 일기를 작성해보세요!"
            className="w-full p-0 border-0 bg-transparent focus:outline-none text-base text-gray-800 resize-none min-h-[100px]"
            rows={4}
          />
        </div>

        {/* 만족도 - 터치/드래그 가능 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-3">
            메뉴 만족도
            <span className="text-xs text-gray-400 font-normal ml-2">(터치, 드래그로 조절)</span>
          </label>
          <div 
            ref={starContainerRef}
            className="flex gap-1 justify-start cursor-pointer select-none"
            onClick={handleStarInteraction}
            onTouchMove={handleStarInteraction}
            onTouchStart={handleStarInteraction}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const fillPercentage = satisfaction >= star ? 100 : satisfaction >= star - 0.5 ? 50 : 0;
              
              return (
                <div key={star} className="relative w-10 h-10">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`star-gradient-${star}`}>
                        <stop offset={`${fillPercentage}%`} stopColor="#3CDCBA" />
                        <stop offset={`${fillPercentage}%`} stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill={`url(#star-gradient-${star})`}
                      stroke="#3CDCBA"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>

        {/* 태그 */}
        <div>
          <label className="block text-base font-bold text-gray-800 mb-3">태그</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="태그를 입력하세요"
              className="flex-1 p-3 border-0 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CDCBA] focus:bg-white transition-all text-sm"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-5 py-3 bg-[#3CDCBA] text-white rounded-lg font-medium hover:bg-[#35C4A8] transition-colors text-sm"
            >
              추가
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-gray-500 hover:text-gray-700 text-base"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}