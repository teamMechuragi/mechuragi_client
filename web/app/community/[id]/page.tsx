import CommunityDetailClient from './CommunityDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  return <CommunityDetailClient id={params.id} />;
}
