'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/context/UserContext';
import { createComment } from '@/app/api/voteApi';

interface CommentInputProps {
  voteId: number;
  onCommentCreated: () => void;
}

export default function CommentInput({ voteId, onCommentCreated }: CommentInputProps) {
  const { user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createComment({ voteId, content: content.trim() });
      setContent(''); // 입력창 초기화
      onCommentCreated(); // 부모에게 알림
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={user ? '댓글을 입력하세요...' : '로그인 후 댓글을 작성할 수 있습니다'}
        disabled={!user || isSubmitting}
        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#3CDCBA] disabled:bg-gray-100"
        rows={3}
        maxLength={500}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{content.length}/500</span>
        <button
          onClick={handleSubmit}
          disabled={!user || !content.trim() || isSubmitting}
          className="px-6 py-2 bg-[#3CDCBA] text-white font-medium rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#2DBDA0] transition-colors"
        >
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </button>
      </div>
    </div>
  );
}
