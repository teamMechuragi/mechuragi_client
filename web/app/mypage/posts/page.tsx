'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import PostCard from '@/app/community/components/PostCard';
import { getMyVotes } from '@/app/api/voteApi';
import type { VoteResponse } from '@/types/vote';

export default function MyPostsPage() {
  const [votes, setVotes] = useState<VoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasFetched = useRef(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMyVotes = async () => {
      try {
        setLoading(true);
        const response = await getMyVotes(0, 10);
        setVotes(response.content || []);
        setHasMore(!response.last);
      } catch (error) {
        console.error('내 게시물 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVotes();
  }, []);

  // 더 보기
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getMyVotes(nextPage, 10);
      setVotes(prev => [...prev, ...(response.content || [])]);
      setPage(nextPage);
      setHasMore(!response.last);
    } catch (error) {
      console.error('추가 로딩 실패:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header backLink="/mypage" title="내 게시물" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA]"></div>
        </div>
        <Footer type="nav" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/mypage" title="내 게시물" />

      <div className="flex-1 pt-14 pb-20 overflow-y-auto">
        {votes.length > 0 ? (
          <>
            <div className="divide-y divide-gray-100">
              {votes.map(vote => (
                <PostCard key={vote.id} vote={vote} />
              ))}
            </div>

            {hasMore && (
              <div className="px-6 py-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full py-3 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {loadingMore ? '로딩 중...' : '더 보기'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-center">
              아직 작성한 게시물이 없습니다
            </p>
            <p className="text-gray-400 text-sm mt-2">
              커뮤니티에서 첫 투표를 만들어보세요!
            </p>
          </div>
        )}
      </div>

      <Footer type="nav" />
    </div>
  );
}
