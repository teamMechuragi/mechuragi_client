export async function generateStaticParams() {
  return []; // 빌드 에러 방지용
}

import EditDetailsClient from "./EditDetailsClient";

export default function EditDetailsPage({ params }: { params: { id: string } }) {
  console.log("[EditDetailsPage - Client] Rendering with id:", params.id);

  // 실제 데이터는 EditDetailsClient의 useEffect에서 API를 통해 로드됨
  return <EditDetailsClient id={params.id} />;
}
