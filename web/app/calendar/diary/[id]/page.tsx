import DiaryDetailClient from './DiaryDetailClient';

// ✅ 빌드 시점에 더미 페이지만 생성
export async function generateStaticParams() {
  return [{ id: '1' }];
}

// ✅ 정의되지 않은 ID로 접속해도 클라이언트 사이드 렌더링 허용
export const dynamicParams = true;

export default function Page({ params }: { params: { id: string } }) {
  // 실제 데이터는 DiaryDetailClient의 useEffect에서 로컬 스토리지로부터 로드됨
  return <DiaryDetailClient id={params.id} />;
}