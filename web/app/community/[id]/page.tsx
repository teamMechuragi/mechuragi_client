export async function generateStaticParams() {
  // output: 'export' 모드에서는 최소 1개의 경로가 필요
  // 실제 ID는 클라이언트에서 동적으로 처리됨
  return [{ id: 'placeholder' }];
}

import CommunityDetailClient from './CommunityDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  console.log("[CommunityDetailPage - Client] Rendering with id:", params.id);

  // 클라이언트 컴포넌트에 ID만 전달합니다.
  // 실제 데이터는 CommunityDetailClient 내부의 useEffect가 브라우저에서 가져옵니다.
  return <CommunityDetailClient id={params.id} />;
}