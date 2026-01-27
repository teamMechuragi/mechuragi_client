'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import PostCard from '../components/PostCard';
import { getActiveVotes } from '@/app/api/voteApi';
import type { VoteResponse } from '@/types/vote';

export default function RecentVotesPage() {
  const [votes, setVotes] = useState<VoteResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchVotes = useCallback(async (pageNum: number, isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await getActiveVotes(pageNum, 20);
      const newVotes = response?.content || [];

      if (isInitial) {
        setVotes(newVotes);
      } else {
        setVotes(prev => [...prev, ...newVotes]);
      }

      setHasMore(!response?.last);
    } catch (error) {
      console.error('투표 로딩 실패:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchVotes(0, true);
  }, [fetchVotes]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchVotes(nextPage);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <Header title="최근 투표" backLink="/community" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA]"></div>
        </div>
        <Footer type="nav" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header title="최근 투표" backLink="/community" />

      <div>
        <div className="divide-y divide-gray-100">
          {votes.length > 0 ? (
            votes.map(vote => (
              <PostCard key={vote.id} vote={vote} />
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              아직 투표가 없습니다
            </div>
          )}
        </div>

        {hasMore && votes.length > 0 && (
          <div className="px-6 py-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="w-full py-3 bg-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-200 transition-colors"
            >
              {loadingMore ? '불러오는 중...' : '더 보기'}
            </button>
          </div>
        )}
      </div>

      <Footer type="nav" />
    </div>
  );
}
