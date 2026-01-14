'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/common/Header';
import { getDiaryDetail, createDiary, updateDiary, uploadImage } from '@/app/api/diaryApi';

interface ImageFile {
  url: string;
  file?: File;
}

// 1. useSearchParams를 사용하는 실제 폼 내용을 별도 컴포넌트로 분리
function DiaryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const selectedDate = searchParams.get('date'); // 캘린더/갤러리에서 선택한 날짜

  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const starContainerRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const recommendedTags = ['맛있음', '가성비', '분위기갑', '재방문의사', '데이트', '혼밥'];

  useEffect(() => {
    if (editId) {
      // 수정 모드: API에서 일기 불러오기
      const loadDiary = async () => {
        try {
          const diary = await getDiaryDetail(Number(editId));
          setTitle(diary.title || '');
          setContent(diary.content || '');
          setRating(diary.rating || 0);
          setTags(diary.tags || []);
          setSelectedImages(diary.images.map(img => ({ url: img.imageUrl })));
          if (diary.title) setShowTitleInput(true);
        } catch (error) {
          console.error('일기 불러오기 실패:', error);
          alert('일기를 불러오는데 실패했습니다.');
        }
      };
      loadDiary();
    } else {
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
    }
  }, [editId]);

  useEffect(() => {
    if (showTitleInput && titleInputRef.current) titleInputRef.current.focus();
  }, [showTitleInput]);

  const onDragStart = (index: number) => { dragItem.current = index; };
  const onDragEnter = (index: number) => { dragOverItem.current = index; };
  const onDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const copyListItems = [...selectedImages];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = null;
      dragOverItem.current = null;
      setSelectedImages(copyListItems);
    }
  };

  const addTag = (text: string) => {
    const cleanText = text.replace(/#/g, '').trim(); 
    if (!cleanText) return;
    const formattedTag = `#${cleanText}`;
    if (!tags.includes(formattedTag)) { setTags([...tags, formattedTag]); }
    setTagInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; 
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleStarInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!starContainerRef.current) return;
    const rect = starContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = clientX - rect.left;
    const width = rect.width;
    let score = Math.max(0.5, Math.min(5, Math.ceil(((x / width) * 5) * 2) / 2));
    setRating(score);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name}은(는) 10MB를 초과합니다.`);
        continue;
      }

      // 이미지 타입 검증
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
        continue;
      }

      try {
        const data = await uploadImage(file);
        setSelectedImages(prev => [...prev, { url: data.imageUrl, file }]);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        alert(`${file.name} 업로드에 실패했습니다.`);
      }
    }
  };

  const handleSave = async () => {
    // 날짜 검증
    const today = new Date().toISOString().split('T')[0];
    const diaryDate = selectedDate || new Date().toISOString().split('T')[0]; // 선택된 날짜 또는 현재 날짜

    if (diaryDate > today) {
      alert('미래 날짜는 선택할 수 없습니다.');
      return;
    }

    try {
      if (editId) {
        // 일기 수정
        const response = await updateDiary(Number(editId), {
          title: title.trim(),
          content: content.trim(),
          rating,
          imageUrls: selectedImages.map(img => img.url),
          tags,
        });
        router.push(`/calendar/diary/detail?id=${response.id}`);
      } else {
        // 일기 등록
        const response = await createDiary({
          title: title.trim(),
          content: content.trim(),
          rating,
          diaryDate,
          imageUrls: selectedImages.map(img => img.url),
          tags,
        });
        router.push(`/calendar/diary/detail?id=${response.id}`);
      }
    } catch (error: any) {
      console.error('일기 저장 오류:', error);
      alert(error.message || '일기 저장에 실패했습니다.');
    }
  };

  const isFormValid = selectedImages.length > 0 || content.trim() !== '';

  return (
    <div className="min-h-screen bg-white pb-20 max-w-sm mx-auto">
      <Header 
        title={editId ? "일기 수정" : "먹방 일기 작성"}
        isWrite={true}
        submitText={editId ? "수정" : "등록"}
        submitDisabled={!isFormValid}
        onSubmit={handleSave}
      />

      <main className="pt-14 px-6 space-y-6">
        <div className="pt-4 space-y-3">
          <div className="bg-[#F0FDFA] border border-[#CCF6EE] rounded-xl p-3">
            <p className="text-[11px] text-[#2D9B82] leading-relaxed">
              • 사진을 <span className="font-bold">길게 눌러서 끌면</span> 순서를 바꿀 수 있습니다.<br/>
              • <span className="font-bold">앞 4장</span>이 캘린더 썸네일로 사용됩니다.
            </p>
          </div>

          <div className="overflow-x-auto flex gap-3 scrollbar-hide py-2">
            <label className="flex-shrink-0 w-28 h-28 border border-[#3CDCBA] rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-white">
              <svg className="w-6 h-6 text-[#3CDCBA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-[12px] text-[#3CDCBA] font-bold mt-1">사진 추가</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {selectedImages.map((img, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={() => onDragStart(i)}
                onDragEnter={() => onDragEnter(i)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="relative flex-shrink-0 w-28 h-28 group cursor-grab active:cursor-grabbing"
              >
                <img 
                  src={img.url} 
                  className={`w-full h-full object-cover rounded-2xl transition-all ${
                    i < 4 ? 'ring-2 ring-[#3CDCBA]' : 'opacity-40 grayscale-[0.5]'
                  }`} 
                  alt="" 
                />
                <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm pointer-events-none ${
                  i < 4 ? 'bg-[#3CDCBA]' : 'bg-gray-400'
                }`}>
                  {i < 4 ? i + 1 : '제외'}
                </div>
                <button 
                  onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} 
                  className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900 border-2 border-white rounded-full text-white text-[10px] flex items-center justify-center shadow-lg z-30"
                >✕</button>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3CDCBA]/90 text-white text-[10px] text-center rounded-b-2xl py-1 font-bold pointer-events-none">
                    메인 대표
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {!showTitleInput && !title ? (
            <button onClick={() => setShowTitleInput(true)} className="text-2xl font-bold text-gray-300 block w-full text-left">제목</button>
          ) : (
            <input 
              ref={titleInputRef} 
              className="w-full text-2xl font-bold focus:outline-none placeholder:text-gray-300" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              onBlur={() => !title && setShowTitleInput(false)} 
              placeholder="제목" 
            />
          )}
          <textarea 
            className="w-full min-h-[120px] text-base text-gray-700 focus:outline-none resize-none placeholder:text-gray-300" 
            placeholder="먹방 일기를 작성해보세요!" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
        </div>

        <div className="py-4 border-t border-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-[#F0FDFA] text-[#3CDCBA] text-xs font-bold rounded-full flex items-center border border-[#CCF6EE]">
                {tag}
                <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="ml-1.5 text-[#3CDCBA]/60 hover:text-[#3CDCBA]">✕</button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1 border-b border-gray-100 pb-2 focus-within:border-[#3CDCBA] transition-colors">
            <span className={`text-lg font-bold ${tagInput ? 'text-[#3CDCBA]' : 'text-gray-300'}`}>#</span>
            <input
              type="text"
              className="flex-1 text-sm text-gray-700 focus:outline-none placeholder:text-gray-300"
              placeholder="태그 입력 (엔터 또는 스페이스)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] text-gray-400 w-full mb-1">추천 태그:</span>
            {recommendedTags.map((rec) => (
              <button key={rec} onClick={() => addTag(rec)} className="text-[11px] px-2 py-1 bg-gray-50 text-gray-500 rounded-md border border-gray-100 hover:bg-white hover:border-[#3CDCBA] hover:text-[#3CDCBA] transition-colors">#{rec}</button>
            ))}
          </div>
        </div>

        <div className="py-4 border-t border-gray-50">
          <p className="font-bold text-gray-800 mb-3 text-lg">메뉴 만족도</p>
          <div 
            ref={starContainerRef} 
            className="flex gap-1 w-fit cursor-pointer touch-none" 
            onClick={handleStarInteraction} 
            onTouchMove={handleStarInteraction} 
            onMouseMove={(e) => e.buttons === 1 && handleStarInteraction(e)}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} fill={rating >= star ? 100 : rating >= star - 0.5 ? 50 : 0} />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">별점: 터치, 드래그로 조절 ({rating}점)</p>
        </div>
      </main>
    </div>
  );
}

// 2. 메인 페이지 컴포넌트: Suspense로 감싸기
export default function NewDiaryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">불러오는 중...</div>}>
      <DiaryFormContent />
    </Suspense>
  );
}

function StarIcon({ fill }: { fill: number }) {
  const id = `star-${fill}-${Math.random()}`;
  return (
    <div className="w-10 h-10">
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <linearGradient id={id}><stop offset={`${fill}%`} stopColor="#3CDCBA" /><stop offset={`${fill}%`} stopColor="#E5E7EB" /></linearGradient>
        </defs>
        <path fill={`url(#${id})`} d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
  );
}