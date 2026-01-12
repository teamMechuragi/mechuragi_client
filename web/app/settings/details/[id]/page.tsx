import EditDetailsClient from './EditDetailsClient';

export async function generateStaticParams() {
  return [];
}

export default function Page({ params }: { params: { id: string } }) {
  return <EditDetailsClient id={params.id} />;
}
