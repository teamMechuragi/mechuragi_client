'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VoteResponse } from '@/types/vote';

interface HotPostsCarouselProps {
  votes: VoteResponse[];
}

function getRelativeTime(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  return created.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function HotPostsCarousel({ votes }: HotPostsCarouselProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 1. 투표 데이터가 아예 없을 때
  if (!votes || votes.length === 0) {
    return (
      <div className="px-6">
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100 shadow-sm">
          아직 핫한 투표가 없습니다
        </div>
      </div>
    );
  }

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? votes.length - 1 : prev - 1));
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === votes.length - 1 ? 0 : prev + 1));
  };

  const currentVote = votes[currentSlide];
  
  // 투표 만료 여부 확인 로직 유지
  const isExpired = currentVote ? new Date(currentVote.deadline) < new Date() : false;
  const isVoteActive = currentVote?.status === 'ACTIVE' && !isExpired;

  return (
    <div className="relative px-12">
      {/* 왼쪽 화살표 */}
      <button 
        onClick={handlePrevSlide}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-gray-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      {/* 카드 내용 */}
      <div
        onClick={() => router.push(`/community/detail?id=${currentVote.id}`)}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-300"
      >
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight truncate">
            {currentVote.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <span className="font-medium text-gray-700">{currentVote.authorName}</span>
            <span>·</span>
            <span>{getRelativeTime(currentVote.createdAt)}</span>
            <span className="ml-auto font-bold text-[#3CDCBA]">
              {isVoteActive ? `${currentVote.totalParticipants.toLocaleString()}표 투표중` : '투표 종료'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            {currentVote.options.slice(0, 2).map((option) => (
              <div key={option.id} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt={option.optionText} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">이미지 없음</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1.5 text-center truncate px-1">
                  {option.optionText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인디케이터 (원본 유지) */}
        <div className="flex justify-center gap-1.5 pt-2">
          {votes.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide ? 'w-6 bg-[#3CDCBA]' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 오른쪽 화살표 */}
      <button 
        onClick={handleNextSlide}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 text-gray-400 hover:text-gray-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  );
}