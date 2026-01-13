'use client';

import { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import { getComments, getCommentCount, updateComment, deleteComment } from '@/app/api/voteApi';
import type { VoteCommentResponse, PageResponse } from '@/types/vote';
import { useUser } from '@/app/context/UserContext';

interface CommentSectionProps {
  voteId: number;
}

export default function CommentSection({ voteId }: CommentSectionProps) {
  const { user } = useUser();
  const [comments, setComments] = useState<VoteCommentResponse[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // 댓글 목록 조회
  const fetchComments = async (pageNum: number = 0) => {
    try {
      setIsLoading(true);
      const response: PageResponse<VoteCommentResponse> = await getComments(voteId, pageNum, 20);

      if (pageNum === 0) {
        setComments(response.content);
      } else {
        setComments(prev => [...prev, ...response.content]);
      }

      setHasMore(!response.last);
      setPage(pageNum);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 수 조회
  const fetchCommentCount = async () => {
    try {
      const { count } = await getCommentCount(voteId);
      setCommentCount(count);
    } catch (error) {
      console.error('댓글 수 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCommentCount();
  }, [voteId]);

  // 댓글 작성 후 호출
  const handleCommentCreated = () => {
    fetchComments(0); // 첫 페이지 새로고침
    fetchCommentCount(); // 댓글 수 갱신
  };

  // 댓글 수정
  const handleUpdate = async (commentId: number, content: string) => {
    try {
      await updateComment(commentId, { content });
      fetchComments(0); // 목록 갱신
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
      throw error;
    }
  };

  // 댓글 삭제
  const handleDelete = async (commentId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      fetchCommentCount(); // 댓글 수 갱신
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 더보기 버튼 클릭
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchComments(page + 1);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">댓글 {commentCount}</h3>

      {/* 댓글 입력 */}
      <CommentInput voteId={voteId} onCommentCreated={handleCommentCreated} />

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {isLoading && page === 0 ? (
          <p className="text-gray-500 text-center py-8">로딩 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          <>
            {comments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id || null}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}
      </div>

      {/* 더보기 버튼 */}
      {hasMore && !isLoading && comments.length > 0 && (
        <button
          onClick={handleLoadMore}
          className="w-full py-3 text-[#3CDCBA] font-medium border border-[#3CDCBA] rounded-lg hover:bg-[#3CDCBA]/10 transition-colors"
        >
          댓글 더보기
        </button>
      )}

      {/* 로딩 인디케이터 (더보기 시) */}
      {isLoading && page > 0 && (
        <p className="text-gray-500 text-center py-4">로딩 중...</p>
      )}
    </div>
  );
}
