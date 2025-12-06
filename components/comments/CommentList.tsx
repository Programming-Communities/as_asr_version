'use client';

import CommentItem from './CommentItem';
import type { WPComment } from '@/types/wordpress';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface CommentListProps {
  postId: number;
  comments: WPComment[];
  loading: boolean;
  onReply: (commentId: number) => void;
  onReload: () => void;
  isAuthenticated: boolean;
}

export default function CommentList({
  postId,
  comments,
  loading,
  onReply,
  onReload,
  isAuthenticated
}: CommentListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonLoader type="text" count={3} />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to comment!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          onReply={onReply}
          onReload={onReload}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
}