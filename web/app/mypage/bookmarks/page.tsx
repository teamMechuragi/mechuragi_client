'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import { getBookmarkedSessions, toggleSessionBookmark, type BookmarkedSessionResponse } from '@/app/api/bookmarkApi';

export default function BookmarksPage() {
  const [sessions, setSessions] = useState<BookmarkedSessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await getBookmarkedSessions();
        setSessions(data);
      } catch (error) {
        console.error('북마크 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleRemoveBookmark = async (sessionId: number) => {
    if (!confirm('북마크를 해제하시겠습니까?')) return;

    try {
      await toggleSessionBookmark(sessionId);
      setSessions(prev => prev.filter(session => session.sessionId !== sessionId));
    } catch (error) {
      console.error('북마크 해제 실패:', error);
      alert('북마크 해제에 실패했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header backLink="/mypage" title="북마크" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3CDCBA]"></div>
        </div>
        <Footer type="nav" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/mypage" title="북마크" />

      <div className="flex-1 pt-14 pb-20 overflow-y-auto">
        {sessions.length > 0 ? (
          <div className="px-4 py-4 space-y-4">
            {sessions.map(session => (
              <div
                key={session.sessionId}
                className="bg-gray-50 rounded-2xl overflow-hidden"
              >
                {/* 세션 헤더 */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedSession(
                    expandedSession === session.sessionId ? null : session.sessionId
                  )}
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{formatDate(session.createdAt)}</p>
                    <p className="font-semibold text-gray-800 mt-1">
                      {session.foods.map(f => f.name).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBookmark(session.sessionId);
                      }}
                      className="p-2 text-[#00D9A0] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedSession === session.sessionId ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* 펼쳐진 음식 목록 */}
                {expandedSession === session.sessionId && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {session.foods.map((food, index) => (
                      <div key={index} className="bg-white rounded-xl p-4">
                        <h4 className="font-bold text-[#00D9A0] mb-2">{food.name}</h4>
                        {food.description && (
                          <p className="text-sm text-gray-700 mb-2">{food.description}</p>
                        )}
                        {food.reason && (
                          <p className="text-sm text-gray-600">{food.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔖</div>
            <p className="text-gray-500 text-center">
              저장한 북마크가 없습니다
            </p>
            <p className="text-gray-400 text-sm mt-2">
              추천받은 음식을 저장해보세요!
            </p>
          </div>
        )}
      </div>

      <Footer type="nav" />
    </div>
  );
}
