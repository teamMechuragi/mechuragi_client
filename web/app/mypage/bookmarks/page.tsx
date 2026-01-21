'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import { getScrappedFoods, unscrapFood, type RecommendedFoodResponse } from '@/app/api/bookmarkApi';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<RecommendedFoodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const data = await getScrappedFoods();
        setBookmarks(data);
      } catch (error) {
        console.error('북마크 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  const handleUnscrap = async (foodId: number) => {
    if (!confirm('북마크를 해제하시겠습니까?')) return;

    try {
      await unscrapFood(foodId);
      setBookmarks(prev => prev.filter(item => item.id !== foodId));
    } catch (error) {
      console.error('북마크 해제 실패:', error);
      alert('북마크 해제에 실패했습니다.');
    }
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
        {bookmarks.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {bookmarks.map(item => (
              <div
                key={item.id}
                className="px-6 py-4 flex items-center gap-4"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.foodName}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{item.foodName}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleUnscrap(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
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
