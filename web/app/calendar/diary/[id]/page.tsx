import DiaryDetailClient from './DiaryDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  // 클라이언트 로직을 담은 컴포넌트를 호출합니다.
  return <DiaryDetailClient id={params.id} />;
}