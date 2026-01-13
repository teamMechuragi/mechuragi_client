import CommunityDetailClient from './CommunityDetailClient';

// ✅ 빌드 시점에 모든 데이터를 가져오지 않도록 빈 배열이나 더미를 반환합니다.
// 이렇게 하면 빌드 워커가 과부하로 죽지 않습니다.
export async function generateStaticParams() {
  return [{ id: '1' }]; 
}

// ✅ 중요: 정의되지 않은 ID로 접속해도 에러 대신 클라이언트 사이드 렌더링을 허용합니다.
export const dynamicParams = true; 

export default function Page({ params }: { params: { id: string } }) {
  // 클라이언트 컴포넌트에 ID만 전달합니다. 
  // 실제 데이터는 CommunityDetailClient 내부의 useEffect가 브라우저에서 가져옵니다.
  return <CommunityDetailClient id={params.id} />;
}