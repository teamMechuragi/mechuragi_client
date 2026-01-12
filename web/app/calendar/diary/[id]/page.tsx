import DiaryDetailClient from './DiaryDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  return <DiaryDetailClient id={params.id} />;
}