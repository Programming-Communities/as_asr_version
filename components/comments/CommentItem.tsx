'use client';

import { useState } from 'react';
import { Reply, LogIn } from 'lucide-react';
import Link from 'next/link';
import CommentReplies from './CommentReplies';
import type { WPComment } from '@/types/wordpress';

interface CommentItemProps {
  comment: WPComment;
  postId: number;
  onReply: (commentId: number) => void;
  onReload: () => void;
  isAuthenticated: boolean;
}

export default function CommentItem({
  comment,
  postId,
  onReply,
  onReload,
  isAuthenticated
}: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<WPComment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      // Optionally show login prompt or redirect
      return;
    }
    onReply(comment.id);
  };

  const loadReplies = async () => {
    if (replies.length > 0) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      // You need to implement a function to fetch replies
      // const fetchedReplies = await wordpressService.getCommentReplies(comment.id);
      // setReplies(fetchedReplies);
      
      // For now, using a placeholder
      setReplies([]);
      setShowReplies(true);
    } catch (error) {
      console.error('Error loading replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  // Get content - handle both string and object formats
  const getCommentContent = () => {
    if (typeof comment.content === 'string') {
      return comment.content;
    }
    // @ts-ignore - WordPress REST API returns content as { rendered: string }
    return comment.content?.rendered || '';
  };

  // Get author name
  const getAuthorName = () => {
    return comment.author_name || 'Anonymous';
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 pb-6 last:border-0">
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold">
          {getAuthorName().charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {getAuthorName()}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-gray dark:prose-invert max-w-none mb-3"
            dangerouslySetInnerHTML={{ __html: getCommentContent() }}
          />

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleReplyClick}
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <Reply size={16} />
                <span>Reply</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
              >
                <LogIn size={14} />
                <span>Sign in to reply</span>
              </Link>
            )}

            {/* Show replies button - check if comment has parent ID to determine if it might have replies */}
            {comment.parent === 0 && (
              <button
                onClick={loadReplies}
                disabled={loadingReplies}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
              >
                {loadingReplies ? (
                  'Loading replies...'
                ) : showReplies ? (
                  'Hide replies'
                ) : (
                  'Show replies'
                )}
              </button>
            )}
          </div>

          {/* Replies */}
          {showReplies && (
            <div className="mt-4 pl-6 border-l-2 border-gray-200 dark:border-gray-800">
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    postId={postId}
                    onReply={onReply}
                    onReload={onReload}
                    isAuthenticated={isAuthenticated}
                  />
                ))
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                  No replies yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}