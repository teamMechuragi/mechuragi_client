'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/common/Header';
import VoteTypeSelect from './components/VoteTypeSelect';
import VoteOptionInput from './components/VoteOptionInput';
import TimeSelector from './components/TimeSelector';

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
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false); // 👈 추가
  const [deadline, setDeadline] = useState('30분 후 종료');
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);

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

  const handleSubmit = () => {
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

    console.log({
      title,
      content,
      voteType,
      options,
      images,
      isMultipleChoice,
      isNotificationEnabled,
      deadline: { days, hours, minutes }
    });

    router.push('/community');
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
        submitDisabled={!isFormValid}
      />

      <div className="flex-1 px-6 pt-6 pb-6 overflow-y-auto">
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