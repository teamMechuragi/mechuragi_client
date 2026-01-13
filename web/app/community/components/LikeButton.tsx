'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { toggleLike, isLiked, getLikeCount } from '@/app/api/voteApi';

interface LikeButtonProps {
  voteId: number;
  initialCount: number;
}

export default function LikeButton({ voteId, initialCount }: LikeButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  // 초기 좋아요 상태 조회
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user) return;

      try {
        const { liked: likedStatus } = await isLiked(voteId);
        setLiked(likedStatus);
      } catch (error) {
        console.error('좋아요 상태 조회 실패:', error);
      }
    };

    fetchLikeStatus();
  }, [voteId, user]);

  // 좋아요 토글 핸들러
  const handleLikeToggle = async () => {
    // 로그인 체크
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (isLoading) return;

    // 낙관적 업데이트
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!liked);
    setCount(prev => liked ? prev - 1 : prev + 1);
    setIsLoading(true);

    try {
      const { liked: newLiked } = await toggleLike(voteId);
      // API 응답으로 최종 상태 확정
      setLiked(newLiked);

      // 좋아요 수 다시 조회 (정확성)
      const { count: newCount } = await getLikeCount(voteId);
      setCount(newCount);
    } catch (error) {
      console.error('좋아요 토글 실패:', error);
      // Rollback
      setLiked(prevLiked);
      setCount(prevCount);
      alert('좋아요 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {/* 하트 아이콘 SVG */}
      <svg
        className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-gray-600'}`}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-gray-600'}`}>
        {count}
      </span>
    </button>
  );
}
