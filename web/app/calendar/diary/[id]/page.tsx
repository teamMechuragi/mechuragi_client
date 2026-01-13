export async function generateStaticParams() {
  // output: 'export' 모드에서는 최소 1개의 경로가 필요
  // 실제 ID는 클라이언트에서 동적으로 처리됨
  return [{ id: 'placeholder' }];
}

import DiaryDetailClient from './DiaryDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  console.log("[DiaryDetailPage - Client] Rendering with id:", params.id);

  // 실제 데이터는 DiaryDetailClient의 useEffect에서 로컬 스토리지로부터 로드됨
  return <DiaryDetailClient id={params.id} />;
}
