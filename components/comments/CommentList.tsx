'use client';

import { MessageSquare } from 'lucide-react';
import CommentItem from './CommentItem';
import type { WPComment } from '@/types/wordpress';

interface CommentListProps {
  postId: number;
  comments: WPComment[];
  loading: boolean;
  onReply?: (commentId: number) => void;
  onReload: () => void;
}

export default function CommentList({ 
  postId, 
  comments, 
  loading, 
  onReply,
  onReload 
}: CommentListProps) {

  if (loading && comments.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="text-gray-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Loading comments...
          </h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="mx-auto text-gray-400 mb-3" size={32} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No comments yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <MessageSquare className="text-gray-400" size={20} />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      <div className="space-y-6">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
}