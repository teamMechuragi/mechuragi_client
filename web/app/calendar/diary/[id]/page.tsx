export async function generateStaticParams() {
  return []; // 빌드 에러 방지용
}

import DiaryDetailClient from './DiaryDetailClient';
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  console.log("[DiaryDetailPage - Client] Rendering with id:", id);

  // 실제 데이터는 DiaryDetailClient의 useEffect에서 로컬 스토리지로부터 로드됨
  return <DiaryDetailClient id={id} />;
}
