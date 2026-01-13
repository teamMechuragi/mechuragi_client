export async function generateStaticParams() {
  return []; // 빌드 에러 방지용
}

import EditDetailsClient from "./EditDetailsClient";
import { useParams } from "next/navigation";

export default function EditDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  console.log("[EditDetailsPage - Client] Rendering with id:", id);

  // 실제 데이터는 EditDetailsClient의 useEffect에서 API를 통해 로드됨
  return <EditDetailsClient id={id} />;
}
