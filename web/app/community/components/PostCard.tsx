'use client';

import { useRouter } from 'next/navigation';
import type { VoteResponse } from '@/types/vote';

interface PostCardProps {
  vote: VoteResponse;
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

export default function PostCard({ vote }: PostCardProps) {
  const router = useRouter();

  // 첫 번째 옵션의 이미지를 대표 이미지로 사용
  const thumbnailImage = vote.options.find(opt => opt.imageUrl)?.imageUrl || null;

  return (
    <div
      onClick={() => router.push(`/community/${vote.id}`)}
      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <h3 className="font-bold text-base mb-2">{vote.title}</h3>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span>{vote.authorName}</span>
        <span>·</span>
        <span>{getRelativeTime(vote.createdAt)}</span>
        <span>·</span>
        <span>{vote.status === 'ACTIVE' ? '투표중' : '종료'}</span>
      </div>

      <div className="flex gap-3">
        <p className="flex-1 text-sm text-gray-700 line-clamp-2">
          {vote.description || '투표에 참여해주세요!'}
        </p>

        {thumbnailImage && (
          <img
            src={thumbnailImage}
            alt="투표 이미지"
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 flex gap-3">
        <span>👥 {vote.totalParticipants}명 참여</span>
        <span>❤️ {vote.totalLikes}</span>
      </div>
    </div>
  );
}
