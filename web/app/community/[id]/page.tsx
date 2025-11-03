'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/app/common/Header';
import Footer from '@/app/common/Footer';
import Image from 'next/image';

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const post = {
    id: params.id,
    title: '투표 제목',
    author: 'ABCD****',
    time: '2분 전',
    type: '일상 일기',
    votes: '10표 투표중',
    content: '투표 내용을 작성해보세요 투표 내용을 작성해보세요투표 내용을 작성해보세요투표 내용을 작성해보세요 투표 내용을 작성해보세요 투표 내용을 작성해보세요투표 내용을 작성해보세요 투표 내용을 작성해보세요',
    hasImages: false,
    options: [
      { id: 0, label: '메뉴이름1', votes: 22, percentage: 55 },
      { id: 1, label: '메뉴이름2', votes: 15, percentage: 37.5 },
      { id: 2, label: '메뉴이름3', votes: 3, percentage: 7.5 }
    ],
    images: [
      { id: 0, name: '토마토 파스타', url: '/images/pasta.jpg', votes: 22, percentage: 55 },
      { id: 1, name: '소고기', url: '/images/beef.jpg', votes: 18, percentage: 45 }
    ]
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      setHasVoted(true);
      console.log('투표 완료:', selectedOption);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/community" title="투표" />

      <div className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
        
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.time}</span>
          <span>·</span>
          <span>{post.type}</span>
          <span className="text-[#3CDCBA] ml-auto">{post.votes}</span>
        </div>

        <p className="text-sm text-gray-700 mb-8 leading-relaxed">
          {post.content}
        </p>

        {/* 사진 없는 투표 */}
        {!post.hasImages && (
          <div className="space-y-3">
            {post.options.map((option) => (
              <button
                key={option.id}
                onClick={() => !hasVoted && setSelectedOption(option.id)}
                disabled={hasVoted}
                className="w-full rounded-2xl text-left transition-all relative overflow-hidden"
              >
                {!hasVoted && (
                  <div className={`p-5 rounded-2xl ${
                    selectedOption === option.id
                      ? 'bg-[#3CDCBA] text-white'
                      : 'bg-gray-100 text-black'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-base">{option.label}</p>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedOption === option.id
                          ? 'border-white bg-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption === option.id && (
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
                        selectedOption === option.id ? 'bg-[#3CDCBA]' : 'bg-gray-300'
                      }`}
                      style={{ width: `${option.percentage}%` }}
                    />

                    <div className={`relative p-5 flex items-center justify-between ${
                      selectedOption === option.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      <div>
                        <p className="font-bold text-base mb-1">{option.label}</p>
                        <p className={`text-sm ${
                          selectedOption === option.id ? 'text-white' : 'text-gray-600'
                        }`}>
                          {option.votes}표 · {option.percentage}%
                        </p>
                      </div>
                      
                      {selectedOption === option.id && (
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
            ))}
          </div>
        )}

        {/* 사진 있는 투표 */}
        {post.hasImages && post.images && (
          <div className="space-y-3">
            {post.images.map((image) => (
              <button
                key={image.id}
                onClick={() => !hasVoted && setSelectedOption(image.id)}
                disabled={hasVoted}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden"
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
                
                <div className="absolute inset-0 bg-black/30" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-2xl font-bold text-white drop-shadow-lg">
                    {image.name}
                  </p>
                </div>
                
                {!hasVoted && selectedOption === image.id && (
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
                    {selectedOption === image.id && (
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
                          style={{ width: `${image.percentage}%` }}
                        >
                          <span className="text-sm font-bold text-white px-2">
                            {image.votes}표 · {image.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <Footer 
        type="button"
        buttonText={hasVoted ? '다시 투표하기' : '투표하기'}
        onButtonClick={hasVoted ? () => { setHasVoted(false); setSelectedOption(null); } : handleVote}
        disabled={!hasVoted && selectedOption === null}
      />
    </div>
  );
}