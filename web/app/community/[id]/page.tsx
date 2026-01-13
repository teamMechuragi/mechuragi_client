export async function generateStaticParams() {
  return []; // 빌드 에러 방지용
}

import CommunityDetailClient from './CommunityDetailClient';

export default function Page({ params }: { params: { id: string } }) {
  console.log("[CommunityDetailPage - Client] Rendering with id:", params.id);

  // 클라이언트 컴포넌트에 ID만 전달합니다.
  // 실제 데이터는 CommunityDetailClient 내부의 useEffect가 브라우저에서 가져옵니다.
  return <CommunityDetailClient id={params.id} />;
}