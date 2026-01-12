import DiaryDetailClient from './DiaryDetailClient';

export async function generateStaticParams() {
  // Static export를 위해 더미 페이지 생성
  // 실제 데이터는 로컬 스토리지에서 동적으로 로드됨
  return [{ id: '1' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <DiaryDetailClient id={params.id} />;
}