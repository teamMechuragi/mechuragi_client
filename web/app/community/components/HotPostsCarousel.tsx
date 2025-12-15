'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { VoteResponse } from '@/types/vote';

interface HotPostsCarouselProps {
  votes: VoteResponse[];
}

// 시간 포맷 함수 (상대 시간)
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

  // 투표가 없으면 빈 상태 표시
  if (!votes || votes.length === 0) {
    return (
      <div className="px-6">
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
          아직 핫한 투표가 없습니다
        </div>
      </div>
    );
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? votes.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === votes.length - 1 ? 0 : prev + 1));
  };

  const currentVote = votes[currentSlide];

  // currentVote가 없으면 빈 상태 표시
  if (!currentVote) {
    return (
      <div className="px-6">
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
          아직 핫한 투표가 없습니다
        </div>
      </div>
    );
  }

  return (
    <div className="px-6">
      <div
        onClick={() => router.push(`/community/${currentVote.id}`)}
        className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="p-4">
          <h3 className="font-bold text-base mb-2">{currentVote.title}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{currentVote.authorName}</span>
            <span>·</span>
            <span>{getRelativeTime(currentVote.createdAt)}</span>
            <span>·</span>
            <span>{currentVote.status === 'ACTIVE' ? '투표중' : '종료'}</span>
            <span className="text-[#3CDCBA] ml-auto">{currentVote.totalParticipants}표 투표중</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {currentVote.options.slice(0, 4).map((option) => (
              <div key={option.id} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                {option.imageUrl ? (
                  <img
                    src={option.imageUrl}
                    alt={option.optionText}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">이미지 없음</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm py-2 text-center">
                  {option.optionText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 py-3">
          {votes.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 막기
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide
                  ? 'w-6 bg-[#3CDCBA]'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>


    </div>
  );
}