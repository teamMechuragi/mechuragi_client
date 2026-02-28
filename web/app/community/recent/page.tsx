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
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header title="최근 투표" backLink="/community" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#3CDCBA]"></div>
        </div>
        <Footer type="nav" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="최근 투표" backLink="/community" />

      <main className="p-4 pt-14 space-y-4">
        {votes.length > 0 ? (
          <div className="space-y-4">
            {votes.map(vote => (
              <div 
                key={vote.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <PostCard vote={vote} />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 pt-14 py-20 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm">
            아직 투표가 없습니다
          </div>
        )}

        {hasMore && votes.length > 0 && (
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="w-full py-4 bg-white rounded-2xl border border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            {loadingMore ? '불러오는 중...' : '투표 더 보기'}
          </button>
        )}
      </main>

      <Footer type="nav" />
    </div>
  );
}