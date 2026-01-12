'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import Image from 'next/image';
import type { VoteResponse } from '@/types/vote';
import { getVote, participateVote, getMyParticipation, cancelParticipation } from '@/lib/api/voteApi';
import LikeButton from '../components/LikeButton';
import CommentSection from '../components/CommentSection';
import { getRelativeTime } from '@/lib/utils/dateFormat';

export default function CommunityDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const [vote, setVote] = useState<VoteResponse | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const voteId = Number(id);

  // 투표 데이터 로드
  useEffect(() => {
    const fetchVoteData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 투표 정보 가져오기
        const voteData = await getVote(voteId);
        setVote(voteData);

        // 내 투표 참여 여부 확인 (로그인한 경우)
        try {
          const participation = await getMyParticipation(voteId);
          if (participation && participation.participatedOptions.length > 0) {
            const optionIds = participation.participatedOptions.map(opt => opt.optionId);
            setSelectedOptions(optionIds);
            setHasVoted(true);
          }
        } catch (err) {
          // 로그인하지 않았거나 투표하지 않은 경우 - 무시
          console.log('투표 참여 내역 없음');
        }
      } catch (err) {
        console.error('투표 로딩 실패:', err);
        setError('투표를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoteData();
  }, [voteId]);

  // 옵션 선택/해제 핸들러
  const handleOptionClick = (optionId: number) => {
    if (hasVoted) return;

    if (vote?.allowMultipleChoice) {
      // 다중 선택 허용
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      // 단일 선택
      setSelectedOptions([optionId]);
    }
  };

  // 투표 제출 핸들러
  const handleVote = async () => {
    if (selectedOptions.length === 0 || !vote) return;

    try {
      await participateVote({
        voteId: vote.id,
        optionIds: selectedOptions,
      });

      // 투표 후 최신 데이터 다시 가져오기
      const updatedVote = await getVote(voteId);
      setVote(updatedVote);
      setHasVoted(true);
    } catch (err) {
      console.error('투표 참여 실패:', err);
      alert('투표에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 재투표 핸들러
  const handleRevote = async () => {
    try {
      await cancelParticipation(voteId);
      setHasVoted(false);
      setSelectedOptions([]);

      // 최신 데이터 다시 가져오기
      const updatedVote = await getVote(voteId);
      setVote(updatedVote);
    } catch (err) {
      console.error('투표 취소 실패:', err);
      alert('투표 취소에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header backLink="/community" title="투표" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !vote) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header backLink="/community" title="투표" />
        <div className="flex-1 flex items-center justify-center px-6">
          <p className="text-red-500">{error || '투표를 찾을 수 없습니다.'}</p>
        </div>
      </div>
    );
  }

  // 이미지가 있는 옵션이 하나라도 있는지 확인
  const hasImages = vote.options.some(opt => opt.imageUrl);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/community" title="투표" />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{vote.title}</h2>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span>{vote.authorName}</span>
          <span>·</span>
          <span>{getRelativeTime(vote.createdAt)}</span>
          <span>·</span>
          <span>{vote.status === 'ACTIVE' ? '투표중' : '종료'}</span>
          <span className="text-[#3CDCBA] ml-auto">{vote.totalParticipants}표 투표중</span>
        </div>

        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {vote.description || '투표에 참여해주세요!'}
        </p>

        {/* 좋아요 버튼 */}
        <div className="mb-8">
          <LikeButton voteId={vote.id} initialCount={vote.totalLikes} />
        </div>

        {/* 사진 없는 투표 */}
        {!hasImages && (
          <div className="space-y-3">
            {vote.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={hasVoted}
                  className="w-full rounded-2xl text-left transition-all relative overflow-hidden"
                >
                  {!hasVoted && (
                    <div className={`p-5 rounded-2xl ${
                      isSelected
                        ? 'bg-[#3CDCBA] text-white'
                        : 'bg-gray-100 text-black'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-base">{option.optionText}</p>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4 text-[#3CDCBA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {hasVoted && (
                    <div className="relative bg-gray-200 rounded-2xl">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-2xl transition-all duration-500 ${
                          isSelected ? 'bg-[#3CDCBA]' : 'bg-gray-300'
                        }`}
                        style={{ width: `${option.votePercentage}%` }}
                      />

                      <div className={`relative p-5 flex items-center justify-between ${
                        isSelected ? 'text-white' : 'text-gray-800'
                      }`}>
                        <div>
                          <p className="font-bold text-base mb-1">{option.optionText}</p>
                          <p className={`text-sm ${
                            isSelected ? 'text-white' : 'text-gray-600'
                          }`}>
                            {option.voteCount}표 · {option.votePercentage}%
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 사진 있는 투표 */}
        {hasImages && (
          <div className="space-y-3">
            {vote.options.map((option) => {
              const isSelected = selectedOptions.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  disabled={hasVoted}
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
                >
                  {option.imageUrl ? (
                    <Image
                      src={option.imageUrl}
                      alt={option.optionText}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}

                  <div className="absolute inset-0 bg-black/30" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold text-white drop-shadow-lg">
                      {option.optionText}
                    </p>
                  </div>

                  {!hasVoted && isSelected && (
                    <>
                      <div className="absolute inset-0 bg-[#3CDCBA]/30" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#3CDCBA] flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </>
                  )}

                  {hasVoted && (
                    <>
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 bg-[#3CDCBA]/40" />
                          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/30 backdrop-blur-sm rounded-full h-8 overflow-hidden">
                          <div
                            className="bg-[#3CDCBA] h-full flex items-center justify-center transition-all duration-500"
                            style={{ width: `${option.votePercentage}%` }}
                          >
                            <span className="text-sm font-bold text-white px-2">
                              {option.voteCount}표 · {option.votePercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 댓글 섹션 */}
        <div className="mt-12">
          <CommentSection voteId={vote.id} />
        </div>
      </div>

      <Footer
        type="button"
        buttonText={hasVoted ? '다시 투표하기' : '투표하기'}
        onButtonClick={hasVoted ? handleRevote : handleVote}
        disabled={!hasVoted && selectedOptions.length === 0}
      />
    </div>
  );
}
