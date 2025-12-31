'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface DiaryData {
  id: string;
  date: string;
  images: string[];
  title: string;
  content: string;
  satisfaction: number;
  tags: string[];
}

export default function DiaryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const diaryId = params.id as string;
  
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // localStorage에서 일기 데이터 불러오기
    const loadDiary = () => {
      try {
        const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
        const foundDiary = diaries.find((d: DiaryData) => d.id === diaryId);
        
        if (foundDiary) {
          setDiary(foundDiary);
        } else {
          // TODO: API에서 불러오기
          console.error('일기를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('일기 불러오기 실패:', error);
      }
    };

    loadDiary();
  }, [diaryId]);

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      const diaries = JSON.parse(localStorage.getItem('diaries') || '[]');
      const updatedDiaries = diaries.filter((d: DiaryData) => d.id !== diaryId);
      localStorage.setItem('diaries', JSON.stringify(updatedDiaries));
      
      // TODO: API 삭제 호출
      
      router.push('/calendar');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (!diary) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center justify-between border-b">
        <button onClick={() => router.back()}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold">먹방 일기</h1>
        <div className="flex gap-3">
          {/* 삭제 아이콘 */}
          <button onClick={handleDelete}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          {/* 수정 아이콘 */}
          <button onClick={() => router.push(`/calendar/diary/edit?id=${diary.id}`)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* 날짜 */}
        <div className="text-center text-gray-500 text-sm">
          {diary.date}
        </div>

        {/* 이미지 슬라이더 */}
        <div className="relative">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={diary.images[currentImageIndex]}
              alt={`음식 사진 ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 이미지 인디케이터 */}
          {diary.images.length > 1 && (
            <div className="flex justify-center gap-2 mt-3">
              {diary.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-[#3CDCBA]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-bold text-gray-900">
          {diary.title}
        </h2>

        {/* 본문 */}
        <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
          {diary.content}
        </p>

        {/* 태그 */}
        {diary.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {diary.tags.map((tag, index) => (
              <span
                key={index}
                className="text-[#3CDCBA] text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 만족도 */}
        <div>
          <h3 className="text-base font-bold text-gray-800 mb-2">메뉴 만족도</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const fillPercentage = diary.satisfaction >= star ? 100 : diary.satisfaction >= star - 0.5 ? 50 : 0;
              
              return (
                <div key={star} className="w-8 h-8">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <defs>
                      <linearGradient id={`detail-star-${star}`}>
                        <stop offset={`${fillPercentage}%`} stopColor="#3CDCBA" />
                        <stop offset={`${fillPercentage}%`} stopColor="#E5E7EB" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill={`url(#detail-star-${star})`}
                      stroke="#3CDCBA"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}