'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import VoteTypeSelect from './components/VoteTypeSelect';
import VoteOptionInput from './components/VoteOptionInput';
import TimeSelector from './components/TimeSelector';
import { createVote, updateVote, getVote, uploadVoteImage } from '@/app/api/voteApi';
import { ApiError } from '@/app/api/apiClient';
import type { VoteOptionRequest } from '@/types/vote';

type VoteType = '사진' | '일반' | null;

function CommunityWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [voteType, setVoteType] = useState<VoteType>(null);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [deadline, setDeadline] = useState('30분 후 종료');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editId) {
      const loadVote = async () => {
        try {
          const vote = await getVote(Number(editId));
          setTitle(vote.title);
          setContent(vote.description || '');
          setIsMultipleChoice(vote.allowMultipleChoice);
          setOptions(vote.options.map(opt => opt.optionText));

          const hasImages = vote.options.some(opt => opt.imageUrl);
          setVoteType(hasImages ? '사진' : '일반');

          if (hasImages) {
            const urls = vote.options.map(opt => opt.imageUrl || '');
            setExistingImageUrls(urls);
            setImagePreviews(urls);
          }
        } catch (error) {
          console.error('투표 불러오기 실패:', error);
          alert('투표를 불러오는데 실패했습니다.');
        }
      };
      loadVote();
    }
  }, [editId]);

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
    if (!title.trim()) {
      alert('제목을 입력해주세요');
      return;
    }
    if (title.trim().length > 30) {
      alert('제목은 30자 이하로 작성해주세요');
      return;
    }
    if (content.trim().length > 100) {
      alert('내용은 100자 이하로 작성해주세요');
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
    if (voteType === '사진' && !editId && images.length !== options.length) {
      alert('모든 옵션에 사진을 추가해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + days);
      deadlineDate.setHours(deadlineDate.getHours() + hours);
      deadlineDate.setMinutes(deadlineDate.getMinutes() + minutes);

      const voteOptions: VoteOptionRequest[] = [];

      if (voteType === '사진') {
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
          } else if (existingImageUrls[i]) {
            imageUrl = existingImageUrls[i];
          }

          voteOptions.push({
            optionText: options[i],
            imageUrl,
          });
        }
      } else {
        for (const option of options) {
          voteOptions.push({
            optionText: option,
          });
        }
      }

      if (editId) {
        const updatedVote = await updateVote(Number(editId), {
          title: title.trim(),
          description: content.trim() || undefined,
          deadline: deadlineDate.toISOString(),
        });
        router.push(`/community/detail?id=${updatedVote.id}`);
      } else {
        const newVote = await createVote({
          title: title.trim(),
          description: content.trim() || undefined,
          deadline: deadlineDate.toISOString(),
          allowMultipleChoice: isMultipleChoice,
          options: voteOptions,
        });
        router.push(`/community/detail?id=${newVote.id}`);
      }
    } catch (error) {
      console.error('투표 생성 실패:', error);
      if (error instanceof ApiError) {
        alert(error.message);
      } else {
        alert('투표 생성에 실패했습니다. 다시 시도해주세요.');
      }
      setIsSubmitting(false);
    }
  };

  const hasAllImages = editId
    ? options.every((_, i) => images[i] || existingImageUrls[i])
    : images.length === options.length;

  const isFormValid = title.trim() && voteType && options.every(opt => opt.trim()) &&
    (voteType === '일반' || hasAllImages);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isWrite={true}
        backLink="/community"
        title={editId ? "투표 수정" : "투표 작성"}
        onSubmit={handleSubmit}
        submitDisabled={!isFormValid || isSubmitting}
        submitText={editId ? "수정" : "등록"}
      />

      <div className="flex-1 px-6 pt-20 pb-6 overflow-y-auto">
        {/* 투표 제목 섹션 - 입력란 스타일 적용 */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={30}
            className="w-full text-2xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-400"
            placeholder="투표 제목을 입력하세요"
          />
        </div>

        {/* 투표 설명 */}
        <div className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
            maxLength={100}
            rows={1}
            placeholder="투표 내용을 작성해보세요"
            className="w-full text-sm text-gray-500 bg-white border-0 outline-none p-0 placeholder:text-gray-300 resize-none overflow-hidden"
          />
          <p className={`text-xs text-right mt-1 ${content.length >= 100 ? 'text-red-400' : 'text-gray-400'}`}>
            {content.length}/100
          </p>
        </div>

        <VoteTypeSelect voteType={voteType} onSelect={setVoteType} disabled={!!editId} />

        {voteType && (
          <VoteOptionInput
            voteType={voteType}
            options={options}
            setOptions={setOptions}
            images={images}
            setImages={setImages}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            disabled={!!editId}
          />
        )}

        {/* 투표 옵션 */}
        {voteType && (
          <div className="mb-6">
            <div className="border border-gray-200 rounded-2xl p-4 bg-white">
              <div className="space-y-4">
                {/* 복수 선택 가능 */}
                <label
                  className={`flex items-center justify-between ${editId ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!editId) {
                      setIsMultipleChoice(!isMultipleChoice);
                    }
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

export default function CommunityWritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-400">불러오는 중...</div>}>
      <CommunityWriteContent />
    </Suspense>
  );
}