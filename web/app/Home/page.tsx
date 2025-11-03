import PopularMenuList from "./components/PopularMenuList";
import AiRecommendationGrid from "./components/AiRecommendationGrid";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen px-4 pt-4 pb-24 bg-white">
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-2">오늘의 실시간 인기 메뉴</h2>
        <PopularMenuList />
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">AI로 나에게 딱 맞는 메뉴 추천받기</h2>
        <AiRecommendationGrid />
      </section>
    </div>
  );
}
