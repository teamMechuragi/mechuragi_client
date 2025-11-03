"use client";

import { useEffect, useState } from "react";

export default function PopularMenuList() {
  const [menus, setMenus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // ✅ 목업 데이터 사용
    const timeout = setTimeout(() => {
      const fakeMenus = ["김치찌개", "알리오올리오", "비빔밥", "부대찌개", "삼겹살덮밥","아무말","길게길게말해보기","그다음은 뭐지뭐지"];
      setMenus(fakeMenus);
      setLoading(false);
    }, 500); // 0.5초 딜레이

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm">인기 메뉴 불러오는 중...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm">인기 메뉴를 불러오지 못했어요.</p>;
  }

  return (
    <section>
      <div className="flex flex-wrap gap-[10px] max-h-[72px] overflow-y-auto">
        {menus.map((menu, idx) => (
          <button
            key={idx}
            className=" px-[14px] py-[6px] rounded-full bg-gray-100 whitespace-nowrap text-sm text-[12px] font-regular"
          >
            {menu}
          </button>
        ))}
      </div>
    </section>
  );
}
