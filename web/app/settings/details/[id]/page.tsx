import EditDetailsClient from "./EditDetailsClient";

interface PageProps {
  params: {
    id: string;
  };
}

// ✅ 빌드 시점에 더미 페이지만 생성
export async function generateStaticParams() {
  return [{ id: 'new' }];
}

// ✅ 정의되지 않은 ID로 접속해도 클라이언트 사이드 렌더링 허용
export const dynamicParams = true;

export default function EditDetailsPage({ params }: PageProps) {
  console.log("[EditDetailsPage - Server] Rendering with params:", params);

  // 실제 데이터는 EditDetailsClient의 useEffect에서 API를 통해 로드됨
  return <EditDetailsClient id={params.id} />;
}
