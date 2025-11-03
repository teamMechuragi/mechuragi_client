import Header from '../common/Header';
import Footer from '../common/Footer';
import HotPostsCarousel from './components/HotPostsCarousel';
import PostCard from './components/PostCard';
import FloatingWriteButton from './components/FloatingWriteButton';

export default function CommunityPage() {
  const posts = [
    {
      id: 1,
      category: '점심메뉴 골라주세요!',
      author: 'ABCD****',
      time: '2분 전',
      type: '일상 일기',
      content: '점심메뉴 골라주세요 오른쪽 사진 점심메뉴 골라주세요 오른 내용 점심메뉴 골라주세요 왼쪽 내용 점심메뉴 골라주세요 왼쪽 내용',
      comments: 10,
      image: '/images/food1.jpg'
    },
    {
      id: 2,
      category: '점심메뉴 골라주세요!',
      author: 'ABCD****',
      time: '5분 전',
      type: '일상 일기',
      content: '점심메뉴 골라주세요 오른쪽 사진 점심메뉴 골라주세요 오른 내용 점심메뉴 골라주세요 왼쪽 내용',
      comments: 5,
      image: '/images/food2.jpg'
    },
    {
      id: 3,
      category: '점심메뉴 골라주세요!',
      author: 'ABCD****',
      time: '5분 전',
      type: '일상 일기',
      content: '점심메뉴 골라주세요 오른쪽 사진 점심메뉴 골라주세요 오른 내용 점심메뉴 골라주세요 왼쪽 내용',
      comments: 0,
      image: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="커뮤니티" />
      
      {/* 핫한 투표 섹션 */}
      <div className="bg-white pb-6">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold">핫한 투표</h2>
        </div>
        <HotPostsCarousel />
      </div>

      {/* 최근 투표 섹션 */}
      <div className="mt-2 bg-white">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-bold">최근 투표</h2>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
        <div className="divide-y divide-gray-100">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <FloatingWriteButton />
      <Footer type="nav" />
    </div>
  );
}