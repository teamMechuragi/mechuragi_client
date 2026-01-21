'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import VoteTypeSelect from './components/VoteTypeSelect';
import VoteOptionInput from './components/VoteOptionInput';
import TimeSelector from './components/TimeSelector';
import { createVote, uploadVoteImage } from '@/app/api/voteApi';
import type { VoteOptionRequest } from '@/types/vote';

type VoteType = '사진' | '일반' | null;

export default function CommunityWritePage() {
  const router = useRouter();

  const [title, setTitle] = useState('투표 제목');
  const [content, setContent] = useState('');
  const [voteType, setVoteType] = useState<VoteType>(null);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [deadline, setDeadline] = useState('30분 후 종료');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeConfirm = (d: number, h: number, m: number) => {
    setDays(d);
    setHours(h);
    setMinutes(m);
    
    const parts = [];
    if (d > 0) parts.push(`${d}일`);
    if (h > 0) parts.push(`${h}시간`);
    if (m > 0) parts.push(`${m}분`);
    
    setDeadline(`${parts.join(' ')} 후 종료`);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!title.trim() || title === '투표 제목') {
      alert('제목을 입력해주세요');
      return;
    }
    if (!voteType) {
      alert('투표 타입을 선택해주세요');
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert('모든 투표 옵션을 입력해주세요');
      return;
    }
    if (voteType === '사진' && images.length !== options.length) {
      alert('모든 옵션에 사진을 추가해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      // 마감 시간 계산 (현재 시간 + 설정한 시간)
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + days);
      deadlineDate.setHours(deadlineDate.getHours() + hours);
      deadlineDate.setMinutes(deadlineDate.getMinutes() + minutes);

      // 투표 옵션 준비
      const voteOptions: VoteOptionRequest[] = [];

      if (voteType === '사진') {
        // 이미지가 있는 경우 이미지 업로드
        for (let i = 0; i < options.length; i++) {
          let imageUrl: string | undefined = undefined;

          if (images[i]) {
            try {
              const uploadResult = await uploadVoteImage(images[i]);
              imageUrl = uploadResult.imageUrl;
            } catch (error) {
              console.error(`이미지 업로드 실패 (옵션 ${i + 1}):`, error);
              alert(`이미지 업로드에 실패했습니다 (옵션 ${i + 1}). 다시 시도해주세요.`);
              setIsSubmitting(false);
              return;
            }
          }

          voteOptions.push({
            optionText: options[i],
            imageUrl,
          });
        }
      } else {
        // 일반 투표 (이미지 없음)
        for (const option of options) {
          voteOptions.push({
            optionText: option,
          });
        }
      }

      // 투표 생성 요청
      const newVote = await createVote({
        title: title.trim(),
        description: content.trim() || undefined,
        deadline: deadlineDate.toISOString(),
        allowMultipleChoice: isMultipleChoice,
        options: voteOptions,
      });

      console.log('투표 생성 성공:', newVote);

      // 생성된 투표 페이지로 이동
      router.push(`/community/detail?id=${newVote.id}`);
    } catch (error) {
      console.error('투표 생성 실패:', error);
      alert('투표 생성에 실패했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const isFormValid = title.trim() && title !== '투표 제목' && voteType && options.every(opt => opt.trim()) &&
    (voteType === '일반' || images.length === options.length);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isWrite={true}
        backLink="/community"
        title="투표 작성"
        onSubmit={handleSubmit}
        submitDisabled={!isFormValid || isSubmitting}
      />

      <div className="flex-1 px-6 pt-20 pb-6 overflow-y-auto">
        {/* 투표 제목 */}
        <div className="mb-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold text-gray-800 bg-white border-0 outline-none p-0 placeholder:text-gray-300"
            placeholder="투표 제목"
          />
        </div>

        {/* 투표 설명 */}
        <div className="mb-6">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="투표 내용을 작성해보세요"
            className="w-full text-sm text-gray-500 bg-white border-0 outline-none p-0 placeholder:text-gray-300"
          />
        </div>

        <VoteTypeSelect voteType={voteType} onSelect={setVoteType} />

        {voteType && (
          <VoteOptionInput
            voteType={voteType}
            options={options}
            setOptions={setOptions}
            images={images}
            setImages={setImages}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
          />
        )}

        {/* 투표 옵션 */}
        {voteType && (
          <div className="mb-6">
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="space-y-4">
                {/* 복수 선택 가능 */}
                <label 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMultipleChoice(!isMultipleChoice);
                  }}
                >
                  <span className="text-sm text-gray-700">복수 선택 가능</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isMultipleChoice ? 'border-[#3CDCBA]' : 'border-gray-300'
                  }`}>
                    {isMultipleChoice && (
                      <div className="w-3 h-3 rounded-full bg-[#3CDCBA]" />
                    )}
                  </div>
                </label>

                {/* 투표 종료 시 일정 받기 */}
                <label 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationEnabled(!isNotificationEnabled);
                  }}
                >
                  <span className="text-sm text-gray-700">투표 종료 시 일정 받기</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isNotificationEnabled ? 'border-[#3CDCBA]' : 'border-gray-300'
                  }`}>
                    {isNotificationEnabled && (
                      <div className="w-3 h-3 rounded-full bg-[#3CDCBA]" />
                    )}
                  </div>
                </label>

                {/* 투표 종료 시간 - 클릭하면 타이머 열기 */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowTimePicker(true)}
                >
                  <span className="text-sm text-gray-700">투표 종료 시간</span>
                  <span className="text-xs text-[#3CDCBA]">
                    {deadline}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTimePicker && (
        <TimeSelector
          initialDays={days}
          initialHours={hours}
          initialMinutes={minutes}
          onConfirm={handleTimeConfirm}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </div>
  );
}