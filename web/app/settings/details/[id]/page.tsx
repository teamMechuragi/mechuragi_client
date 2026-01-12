import EditDetailsClient from './EditDetailsClient';

export async function generateStaticParams() {
  // Static export를 위해 더미 페이지 생성
  // 실제 데이터는 클라이언트 사이드에서 동적으로 로드됨
  return [{ id: '1' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditDetailsClient id={params.id} />;
}
