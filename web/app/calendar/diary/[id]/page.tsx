'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/common/Header';

export default function DiaryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // 상태 관리: 로컬 스토리지에서 불러온 일기 데이터
  const [diary, setDiary] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);

  // --- 추가된 모달 상태 ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 인디케이터 및 슬라이더 제어를 위한 상태와 Ref
  const [currentIdx, setCurrentIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewerScrollRef = useRef<HTMLDivElement>(null);

  // 1. 페이지 로드 시 로컬 스토리지에서 해당 ID의 데이터 불러오기
  useEffect(() => {
    /* // [BACKEND API] 일기 상세 정보 불러오기
      const fetchDiary = async () => {
        try {
          const response = await fetch(`/api/diaries/${id}`);
          const data = await response.json();
          setDiary(data);
        } catch (error) {
          console.error("Failed to fetch diary:", error);
        }
      };
      fetchDiary();
    */

    const saved = localStorage.getItem('myDiaries');
    if (saved) {
      const diaries = JSON.parse(saved);
      const found = diaries.find((d: any) => d.id === id);
      if (found) {
        setDiary(found);
      }
    }
  }, [id]);

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

  // 메인 슬라이더 스크롤 시 현재 인덱스 계산
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setCurrentIdx(index);
    }
  };

  // 라이트박스 닫기
  const closeViewer = () => {
    setIsViewerOpen(false);
    setShowUI(true);
  };

  // 사진 클릭 시 UI 토글
  const toggleUI = () => {
    if (isViewerOpen) setShowUI(!showUI);
  };

  // --- 추가된 수정 및 삭제 로직 시작 ---

  // 삭제 로직 (팝업 내 '삭제' 버튼 클릭 시 실행)
  const handleDelete = async () => {
    /* // [BACKEND API] 일기 삭제 요청
      try {
        const response = await fetch(`/api/diaries/${id}`, { method: 'DELETE' });
        if (response.ok) router.push('/calendar');
      } catch (error) {
        console.error("Delete failed:", error);
      }
    */

    // 로컬 스토리지 삭제 처리
    const saved = localStorage.getItem('myDiaries');
    if (saved) {
      const diaries = JSON.parse(saved);
      const filtered = diaries.filter((d: any) => d.id !== id);
      localStorage.setItem('myDiaries', JSON.stringify(filtered));
      router.push('/calendar');
    }
  };

  // 수정 로직 (기존 작성 페이지로 바로 이동하도록 수정)
  const handleEdit = () => {
    // 갤러리가 아닌 작성이 이루어지는 'new' 페이지로 이동해야 기존 데이터가 채워집니다.
    router.push(`/calendar/diary/new?editId=${id}`); 
  };

  // --- 추가된 수정 및 삭제 로직 끝 ---

  // 데이터가 없을 때 노출
  if (!diary) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="먹방 일기" />
        <div className="pt-20 text-center text-gray-400">일기를 불러오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative max-w-sm mx-auto">
      {/* 뒤로가기 시 캘린더 화면으로 이동하도록 backLink 설정 */}
      <Header 
        title="먹방 일기" 
        isDetail={true}
        backLink="/calendar"
        onDelete={() => setIsDeleteModalOpen(true)} // 브라우저 confirm 대신 모달 오픈
        onEdit={handleEdit}
      />
      
      <main className="pt-14 pb-10">
        <p className="text-center text-gray-400 text-sm mb-4">{diary.date}</p>

        {/* 1. 이미지 슬라이더 영역 */}
        <div className="px-6 mb-8">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-3xl relative"
          >
            {diary.images && diary.images.length > 0 ? (
              diary.images.map((img: string, idx: number) => (
                <div key={idx} className="relative w-full aspect-square snap-center flex-shrink-0">
                  <img
                    src={img}
                    alt="food"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      setCurrentIdx(idx); 
                      setIsViewerOpen(true);
                    }}
                  />
                  {/* --- 수정 포인트: 앞 4장에만 썸네일 표시 뱃지 추가 --- */}
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
          
          {/* 인디케이터 */}
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

        {/* 2. 텍스트 영역 */}
        <div className="px-6 space-y-4">
          {diary.title && (
            <h1 className="text-2xl font-bold text-gray-900">{diary.title}</h1>
          )}
          
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {diary.content}
          </p>

          <div className="flex flex-wrap gap-2">
            {diary.tags && diary.tags.map((tag: string) => (
              <span key={tag} className="text-[#3CDCBA] font-medium">{tag}</span>
            ))}
          </div>
        </div>

        {/* 3. 만족도 영역 */}
        <div className="px-6 mt-8">
          <p className="font-bold text-gray-800 mb-2 font-lg">메뉴 만족도</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon 
                key={star} 
                fill={diary.satisfaction >= star ? 100 : diary.satisfaction >= star - 0.5 ? 50 : 0} 
              />
            ))}
          </div>
        </div>
      </main>

      {/* --- 커스텀 삭제 확인 모달 --- */}
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

      {/* 4. 이미지 전체화면 뷰어 */}
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
            {diary.images.map((img: string, idx: number) => (
              <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center">
                <img 
                  src={img} 
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