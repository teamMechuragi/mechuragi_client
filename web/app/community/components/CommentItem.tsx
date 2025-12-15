'use client';

import { useState } from 'react';
import type { VoteCommentResponse } from '@/types/vote';
import { getRelativeTime } from '@/lib/utils/dateFormat';

interface CommentItemProps {
  comment: VoteCommentResponse;
  currentUserId: number | null;
  onUpdate: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export default function CommentItem({ comment, currentUserId, onUpdate, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUserId === comment.authorId;

  const handleUpdate = async () => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdate(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      // 에러는 부모에서 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(comment.id);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content); // 원래 내용으로 복원
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.authorName}</span>
          <span className="text-xs text-gray-500">
            {getRelativeTime(comment.createdAt)}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && ' (수정됨)'}
          </span>
        </div>

        {isOwner && !isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#3CDCBA]"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{editContent.length}/500</span>
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={isSubmitting || !editContent.trim()}
                className="px-3 py-1 text-sm bg-[#3CDCBA] text-white rounded disabled:bg-gray-300"
              >
                {isSubmitting ? '수정 중...' : '수정'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
}
