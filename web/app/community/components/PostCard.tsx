'use client';

import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  category: string;
  author: string;
  time: string;
  type: string;
  content: string;
  comments: number;
  image?: string | null;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/community/${post.id}`)}
      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <h3 className="font-bold text-base mb-2">{post.category}</h3>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.time}</span>
        <span>·</span>
        <span>{post.type}</span>
      </div>

      <div className="flex gap-3">
        <p className="flex-1 text-sm text-gray-700 line-clamp-2">
          {post.content}
        </p>
        
        {post.image && (
          <img 
            src={post.image} 
            alt="게시글 이미지"
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
        )}
      </div>

      {post.comments > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          💬 {post.comments}
        </div>
      )}
    </div>
  );
}
