'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../common/Header';
import Footer from '../common/Footer';
import HotPostsCarousel from './components/HotPostsCarousel';
import PostCard from './components/PostCard';
import FloatingWriteButton from './components/FloatingWriteButton';
import { getHotVotes, getActiveVotes } from '@/app/api/voteApi';
import type { VoteResponse } from '@/types/vote';

export default function CommunityPage() {
  const router = useRouter();
  const [hotVotes, setHotVotes] = useState<VoteResponse[]>([]);
  const [recentVotes, setRecentVotes] = useState<VoteResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        setLoading(true);

        // 핫한 투표 가져오기
        try {
          const hot = await getHotVotes(10);
          setHotVotes(hot);
        } catch (error) {
          console.error('핫한 투표 로딩 실패:', error);
        }

        // 최근 투표 가져오기 (메인에서는 5개만)
        try {
          const response = await getActiveVotes(0, 5);
          setRecentVotes(response?.content || []);
        } catch (error) {
          console.error('최근 투표 로딩 실패:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <Header title="커뮤니티" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA]"></div>
        </div>
        <Footer type="nav" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="커뮤니티" />

      {/* 핫한 투표 섹션 */}
      <div className="bg-white pb-6">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold">핫한 투표</h2>
        </div>
        <HotPostsCarousel votes={hotVotes} />
      </div>

      {/* 최근 투표 섹션 */}
      <div className="mt-2 bg-white">
        <div
          className="px-6 py-4 flex items-center justify-between border-b border-gray-100 cursor-pointer"
          onClick={() => router.push('/community/recent')}
        >
          <h2 className="text-lg font-bold">최근 투표</h2>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <div className="divide-y divide-gray-100">
          {recentVotes.length > 0 ? (
            recentVotes.map(vote => (
              <PostCard key={vote.id} vote={vote} />
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              아직 투표가 없습니다
            </div>
          )}
        </div>
      </div>

      <FloatingWriteButton />
      <Footer type="nav" />
    </div>
  );
}
