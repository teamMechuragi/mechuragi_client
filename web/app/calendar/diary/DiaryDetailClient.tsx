// calendar/diary/DiaryDetailClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import { getDiaryDetail, deleteDiary, DiaryResponse } from '@/app/api/diaryApi';

export default function DiaryDetailClient() {
  const router = useRouter();
  const [id, setId] = useState<string>('');

  // URL 파라미터에서 ID 가져오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setId(params.get('id') || '');
    }
  }, []);

  // 상태 관리: API에서 불러온 일기 데이터
  const [diary, setDiary] = useState<DiaryResponse | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);

  // --- 추가된 모달 상태 ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 인디케이터 및 슬라이더 제어를 위한 상태와 Ref
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewerScrollRef = useRef<HTMLDivElement>(null);

  // 1. 페이지 로드 시 API에서 일기 데이터 불러오기
  useEffect(() => {
    if (!id) return; // id가 없으면 실행하지 않음

    const loadDiary = async () => {
      try {
        const data = await getDiaryDetail(Number(id));
        setDiary(data);
      } catch (error) {
        console.error('일기 불러오기 실패:', error);
        alert('일기를 불러오는데 실패했습니다.');
        router.push('/calendar');
      }
    };
    loadDiary();
  }, [id, router]);

  // 2. 전체화면 뷰어 오픈 시 클릭한 사진 위치로 스크롤 이동
  useEffect(() => {
    if (isViewerOpen && viewerScrollRef.current) {
      const viewerWidth = viewerScrollRef.current.clientWidth;
      viewerScrollRef.current.scrollTo({
        left: viewerWidth * currentIdx,
        behavior: 'auto'
      });
    }
  }, [isViewerOpen, currentIdx]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentIdx(index);
    }
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setShowUI(true);
  };

  const toggleUI = () => {
    if (isViewerOpen) setShowUI(!showUI);
  };

  const handleDelete = async () => {
    try {
      await deleteDiary(Number(id));
      router.push('/calendar');
    } catch (error) {
      console.error('일기 삭제 실패:', error);
      alert('일기 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    router.push(`/calendar/diary/new?editId=${id}`); 
  };

  if (!diary) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="먹방 일기" />
        <div className="pt-24 text-center text-gray-400">일기를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative max-w-sm mx-auto">
      <Header 
        title="먹방 일기" 
        isDetail={true}
        backLink="/calendar"
        onDelete={() => setIsDeleteModalOpen(true)}
        onEdit={handleEdit}
      />
      
      <main className="pt-14 pb-10">
        <p className="text-center text-gray-400 text-sm mb-4">{diary.diaryDate}</p>

        <div className="px-6 mb-8">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-3xl relative"
          >
            {diary.images && diary.images.length > 0 ? (
              diary.images.map((img, idx: number) => (
                <div key={idx} className="relative w-full aspect-square snap-center flex-shrink-0">
                  <img
                    src={img.imageUrl}
                    alt="food"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setCurrentIdx(idx);
                      setIsViewerOpen(true);
                    }}
                  />
                  {idx < 4 && (
                    <div className="absolute top-4 left-4 bg-[#3CDCBA] text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10">
                      썸네일 {idx + 1}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full aspect-square bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                등록된 사진이 없습니다.
              </div>
            )}
          </div>
          
          {diary.images && diary.images.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {diary.images.map((_: any, i: number) => (
                <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIdx ? 'bg-[#3CDCBA] w-4' : 'bg-gray-200'
                  }`} 
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 space-y-4">
          {diary.title && (
            <h1 className="text-2xl font-bold text-gray-900">{diary.title}</h1>
          )}
          
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {diary.content}
          </p>

          <div className="flex flex-wrap gap-2">
            {diary.tags && diary.tags.map((tag: string, idx: number) => (
              <span key={idx} className="text-[#3CDCBA] font-medium">{tag.startsWith('#') ? tag : `#${tag}`}</span>
            ))}
          </div>
        </div>

        <div className="px-6 mt-8">
          <p className="font-bold text-gray-800 mb-2 font-lg">메뉴 만족도</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                fill={Number(diary.rating) >= star ? 100 : Number(diary.rating) >= star - 0.5 ? 50 : 0}
              />
            ))}
          </div>
        </div>
      </main>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-[280px] text-center shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">일기 삭제</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              정말로 이 일기를 삭제하시겠습니까?<br/>삭제된 내용은 복구할 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm"
              >
                취소
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-3 bg-[#FF4B4B] text-white rounded-xl font-bold text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewerOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center overflow-hidden">
          {showUI && (
            <button 
              onClick={(e) => { e.stopPropagation(); closeViewer(); }}
              className="absolute top-12 right-6 z-[110] w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
            >
              <span className="text-2xl">✕</span>
            </button>
          )}

          <div 
            ref={viewerScrollRef}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onClick={toggleUI}
          >
            {diary.images?.map((img, idx: number) => (
              <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center">
                <img
                  src={img.imageUrl}
                  className="max-w-full max-h-full object-contain"
                  alt="full view"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StarIcon({ fill }: { fill: number }) {
  const id = `detail-star-${fill}-${Math.random()}`;
  return (
    <div className="w-6 h-6">
      <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
          <linearGradient id={id}>
            <stop offset={`${fill}%`} stopColor="#3CDCBA" />
            <stop offset={`${fill}%`} stopColor="#E5E7EB" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id})`} d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
  );
}