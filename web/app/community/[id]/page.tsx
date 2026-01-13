"use client";

import CommunityDetailClient from './CommunityDetailClient';
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  console.log("[CommunityDetailPage - Client] Rendering with id:", id);

  // 클라이언트 컴포넌트에 ID만 전달합니다.
  // 실제 데이터는 CommunityDetailClient 내부의 useEffect가 브라우저에서 가져옵니다.
  return <CommunityDetailClient id={id} />;
}