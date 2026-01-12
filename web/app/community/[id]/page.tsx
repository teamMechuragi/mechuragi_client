import CommunityDetailClient from './CommunityDetailClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://mechuragi.kro.kr/api';

export async function generateStaticParams() {
  try {
    // 모든 투표 ID를 수집
    const allVoteIds = new Set<number>();

    // 활성화된 투표 가져오기
    try {
      const activeResponse = await fetch(`${API_BASE_URL}/votes/active?page=0&size=1000`);
      if (activeResponse.ok) {
        const activeData = await activeResponse.json();
        activeData.content?.forEach((vote: any) => allVoteIds.add(vote.id));
      }
    } catch (err) {
      console.warn('Failed to fetch active votes:', err);
    }

    // 인기 투표 가져오기
    try {
      const hotResponse = await fetch(`${API_BASE_URL}/votes/hot?size=100`);
      if (hotResponse.ok) {
        const hotData = await hotResponse.json();
        hotData?.forEach((vote: any) => allVoteIds.add(vote.id));
      }
    } catch (err) {
      console.warn('Failed to fetch hot votes:', err);
    }

    // 종료된 투표 가져오기
    try {
      const completedResponse = await fetch(`${API_BASE_URL}/votes/completed?page=0&size=1000`);
      if (completedResponse.ok) {
        const completedData = await completedResponse.json();
        completedData.content?.forEach((vote: any) => allVoteIds.add(vote.id));
      }
    } catch (err) {
      console.warn('Failed to fetch completed votes:', err);
    }

    // ID를 문자열 배열로 변환
    const params = Array.from(allVoteIds).map(id => ({ id: String(id) }));

    console.log(`Generated ${params.length} static vote pages`);

    // 최소한 하나의 더미 페이지라도 생성
    return params.length > 0 ? params : [{ id: '1' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    // 에러 발생시 최소한 더미 페이지 생성
    return [{ id: '1' }];
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <CommunityDetailClient id={params.id} />;
}
