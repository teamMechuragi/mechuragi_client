export async function generateStaticParams() {
  // output: 'export' 모드에서는 최소 1개의 경로가 필요
  // 실제 ID는 클라이언트에서 동적으로 처리됨
  return [{ id: 'placeholder' }];
}

import EditDetailsClient from "./EditDetailsClient";

export default function EditDetailsPage({ params }: { params: { id: string } }) {
  console.log("[EditDetailsPage - Client] Rendering with id:", params.id);

  // 실제 데이터는 EditDetailsClient의 useEffect에서 API를 통해 로드됨
  return <EditDetailsClient id={params.id} />;
}
