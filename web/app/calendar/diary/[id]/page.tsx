export async function generateStaticParams() {
  return []; // 빌드 에러 방지용
}

import DiaryDetailClient from './DiaryDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  console.log("[DiaryDetailPage - Client] Rendering with id:", params.id);

  // 실제 데이터는 DiaryDetailClient의 useEffect에서 로컬 스토리지로부터 로드됨
  return <DiaryDetailClient id={params.id} />;
}
