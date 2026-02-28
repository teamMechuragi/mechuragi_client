'use client';

import { useRouter } from 'next/navigation';
import type { VoteResponse } from '@/types/vote';

interface PostCardProps {
  vote: VoteResponse;
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

export default function PostCard({ vote }: PostCardProps) {
  const router = useRouter();

  const thumbnailImage = vote.options.find(opt => opt.imageUrl)?.imageUrl || null;
  const isExpired = new Date(vote.deadline) < new Date();
  const isVoteActive = vote.status === 'ACTIVE' && !isExpired;

  return (
    <div
      onClick={() => router.push(`/community/detail?id=${vote.id}`)}
      className="group bg-white p-5 mx-4 my-3 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-[#3CDCBA]/30 cursor-pointer"
    >
      {/* 1. 상단: 배지와 시간 */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isVoteActive ? 'bg-[#3CDCBA]/10 text-[#3CDCBA]' : 'bg-gray-100 text-gray-500'}`}>
          {isVoteActive ? '투표중' : '종료'}
        </span>
        <span className="text-xs text-gray-400">{getRelativeTime(vote.createdAt)}</span>
      </div>

      {/* 2. 본문 영역 */}
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base mb-1.5 leading-snug truncate">
            {vote.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {vote.description || '투표에 참여해주세요!'}
          </p>
        </div>
        
        {/* 이미지 있으면 크게 강조 */}
        {thumbnailImage && (
          <img
            src={thumbnailImage}
            alt="투표 이미지"
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-gray-50"
          />
        )}
      </div>

      {/* 하단 통계 */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium">
        <div className="flex items-center gap-3">
          {/* 참여자 수 */}
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-gray-700">{vote.totalParticipants.toLocaleString()}</span>
          </div>
    
          {/* 좋아요 */}
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-gray-700">{vote.totalLikes.toLocaleString()}</span>
          </div>
        </div>

        {/* 작성자명 (오른쪽 정렬) */}
        <span className="text-gray-400">by {vote.authorName}</span>
      </div>
    </div>
  );
}