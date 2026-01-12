import DiaryDetailClient from './DiaryDetailClient';

// 1. 빌드 에러 방지를 위한 정적 경로 생성 (서버 전용)
export async function generateStaticParams() {
  // 실제 데이터가 있다면 fetch를 사용하고, 없으면 빈 배열을 반환해도 됩니다.
  return [{ id: '1' }];
}

// 2. 빌드 타임에 없는 ID도 클라이언트 사이드에서 처리하도록 설정
export const dynamicParams = true;

export default function Page({ params }: { params: { id: string } }) {
  // 클라이언트 로직을 담은 컴포넌트를 호출합니다.
  return <DiaryDetailClient id={params.id} />;
}