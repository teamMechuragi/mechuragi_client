'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HotPostsCarousel() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const hotPosts = [
    {
      id: 1,
      category: '점심메뉴 골라주세요!',
      author: 'ABCD****',
      time: '2분 전',
      type: '일상 일기',
      votes: '10표 투표중',
      images: [
        { name: '토마토 파스타', url: '/images/pasta.jpg' },
        { name: '소고기', url: '/images/beef.jpg' }
      ]
    },
    {
      id: 2,
      category: '저녁메뉴 추천해주세요!',
      author: 'USER****',
      time: '5분 전',
      type: '일상 일기',
      votes: '15표 투표중',
      images: [
        { name: '치킨', url: '/images/chicken.jpg' },
        { name: '피자', url: '/images/pizza.jpg' }
      ]
    }
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? hotPosts.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === hotPosts.length - 1 ? 0 : prev + 1));
  };

  const currentPost = hotPosts[currentSlide];

  return (
    <div className="px-6">
      <div 
        onClick={() => router.push(`/community/${currentPost.id}`)}
        className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="p-4">
          <h3 className="font-bold text-base mb-2">{currentPost.category}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <span>{currentPost.author}</span>
            <span>·</span>
            <span>{currentPost.time}</span>
            <span>·</span>
            <span>{currentPost.type}</span>
            <span className="text-[#3CDCBA] ml-auto">{currentPost.votes}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {currentPost.images.map((img, imgIdx) => (
              <div key={imgIdx} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm py-2 text-center">
                  {img.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-1.5 py-3">
          {hotPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 막기
                setCurrentSlide(idx);
              }}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentSlide 
                  ? 'w-6 bg-[#3CDCBA]' 
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

        
    </div>
  );
}