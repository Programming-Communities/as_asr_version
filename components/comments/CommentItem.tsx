'use client';

import { useState } from 'react';
import type { WPComment } from '@/types/wordpress';

interface CommentItemProps {
  comment: WPComment;
  onReply?: (commentId: number) => void;
  isReply?: boolean;
}

export default function CommentItem({ comment, onReply, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = () => {
    if (onReply) {
      onReply(comment.id);
    }
  };

  return (
    <div className={`border-l-2 ${isReply ? 'border-gray-200 dark:border-gray-700' : 'border-blue-200 dark:border-blue-800'} pl-4 ${isReply ? 'ml-4' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-start mb-3">
          {comment.avatar && (
            <img
              src={comment.avatar}
              alt={comment.author_name}
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">{comment.author_name}</h4>
              <span className="text-sm text-gray-500">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <div
              className="mt-2 text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReply}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}