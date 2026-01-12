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
  const editId = searchParams.get('editId'); // URL에서 수정 ID 추출

  const [selectedImages, setSelectedImages] = useState<ImageFile[]>([]);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [showTitleInput, setShowTitleInput] = useState<boolean>(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const starContainerRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const recommendedTags = ['맛있음', '가성비', '분위기갑', '재방문의사', '데이트', '혼밥'];

  // --- 수정 모드 데이터 불러오기 로직 추가 ---
  useEffect(() => {
    if (editId) {
      const saved = localStorage.getItem('myDiaries');
      if (saved) {
        const diaries = JSON.parse(saved);
        const target = diaries.find((d: any) => d.id === editId);
        if (target) {
          setTitle(target.title || '');
          setContent(target.content || '');
          setSatisfaction(target.satisfaction || 0);
          setTags(target.tags || []);
          setSelectedImages(target.images.map((url: string) => ({ url })));
          if (target.title) setShowTitleInput(true);
        }
      }
    } else {
      // 신규 작성일 때만 갤러리에서 넘어온 사진 처리
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
    setSatisfaction(score);
  };

  // --- 저장 로직 (신규 등록 및 수정 분기 처리) ---
  const handleSave = () => {
    const saved = localStorage.getItem('myDiaries');
    const existingDiaries = saved ? JSON.parse(saved) : [];

    if (editId) {
      // [수정 모드] 해당 ID만 찾아서 업데이트
      const updatedDiaries = existingDiaries.map((d: any) => 
        d.id === editId 
          ? { 
              ...d, 
              title: title.trim(), 
              content: content.trim(), 
              tags, 
              satisfaction, 
              images: selectedImages.map(img => img.url) 
            } 
          : d
      );
      localStorage.setItem('myDiaries', JSON.stringify(updatedDiaries));
      router.push(`/calendar/diary/${editId}`);
    } else {
      // [신규 작성 모드] 새 데이터 추가
      const newId = Date.now().toString(); 
      const newDiary = {
        id: newId,
        date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\. /g, '.'),
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        satisfaction: satisfaction,
        images: selectedImages.map(img => img.url) 
      };
      localStorage.setItem('myDiaries', JSON.stringify([newDiary, ...existingDiaries]));
      router.push(`/calendar/diary/${newId}`);
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
              <input type="file" multiple accept="image/*" className="hidden" />
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
                <div className="absolute top-2 right-8 opacity-50 pointer-events-none">
                   <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                     <path d="M7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm4-8h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
                   </svg>
                </div>
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
              <StarIcon key={star} fill={satisfaction >= star ? 100 : satisfaction >= star - 0.5 ? 50 : 0} />
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-medium">별점: 터치, 드래그로 조절 ({satisfaction}점)</p>
        </div>
      </main>
    </div>
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