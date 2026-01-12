"use client";

import { useEffect, useState } from "react";

export default function PopularMenuList() {
  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPopularMenus = async () => {
      try {
        setLoading(true);
        // 실제 연동 시: const response = await fetch('YOUR_API_URL');
        // const data = await response.json();
        
        // 백엔드 API 응답을 가정함
        const data = [
          "김치찜", "알리오올리오", "비빔밥", "부대찌개", 
          "삼겹살덮밥", "제육볶음", "돈까스", "파스타",
          "된장찌개", "샐러드", "라면", "초밥"
        ];
        
        setMenus(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularMenus();
  }, []);

  if (loading) return <div className="h-[100px] flex items-center text-gray-400 text-[12px]">인기 메뉴 로딩 중...</div>;
  if (error) return <div className="h-[100px] flex items-center text-red-400 text-[12px]">메뉴를 불러오지 못했습니다.</div>;

  // 무한 루프를 위해 데이터를 반으로 나누고 각각 복제함
  const half = Math.ceil(menus.length / 2);
  const row1 = [...menus.slice(0, half), ...menus.slice(0, half)];
  const row2 = [...menus.slice(half), ...menus.slice(half)];

  return (
    <div className="w-full flex flex-col gap-3 overflow-hidden py-2">
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          gap: 8px;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll-reverse {
          display: flex;
          gap: 8px;
          width: max-content;
          animation: scroll 25s linear infinite reverse;
        }
        .animate-scroll:hover, .animate-scroll-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 첫 번째 줄 (왼쪽으로 흐름) */}
      <div className="flex w-full overflow-hidden">
        <div className="animate-scroll">
          {row1.map((menu, idx) => (
            <button
              key={`row1-${idx}`}
              className="px-[16px] py-[8px] rounded-full bg-[#F2F2F4] text-[#1A1A1A] text-[14px] font-medium whitespace-nowrap shrink-0 active:scale-95"
            >
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* 두 번째 줄 (오른쪽으로 흐름) */}
      <div className="flex w-full overflow-hidden">
        <div className="animate-scroll-reverse">
          {row2.map((menu, idx) => (
            <button
              key={`row2-${idx}`}
              className="px-[16px] py-[8px] rounded-full bg-[#F2F2F4] text-[#1A1A1A] text-[14px] font-medium whitespace-nowrap shrink-0 active:scale-95"
            >
              {menu}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}