import DetailsClient from './EditDetailsClient';

export async function generateStaticParams() {
  // 정적 빌드를 위한 더미 (필요에 따라 수정 가능)
  return [{ id: 'new' }];
}

export default function Page({ params }: { params: { id: string } }) {
  // params.id가 'new'가 아니면 수정 모드로 동작하게 됩니다.
  return <DetailsClient id={params.id} />;
}