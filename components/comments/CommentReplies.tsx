'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Reply } from 'lucide-react';
import CommentForm from './CommentForm';
import type { WPComment } from '@/types/wordpress';

interface CommentRepliesProps {
  comment: WPComment & { children?: WPComment[] };
  onReply: (commentId: number) => void;
}

export default function CommentReplies({ comment, onReply }: CommentRepliesProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyClick = () => {
    onReply(comment.id);
  };

  if (!comment.children || comment.children.length === 0) {
    return (
      <div className="ml-8 md:ml-12 mt-3">
        <button
          onClick={handleReplyClick}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <Reply size={14} className="mr-1" />
          Reply
        </button>
      </div>
    );
  }

  return (
    <div className="ml-8 md:ml-12">
      <div className="flex items-center space-x-4 mb-3">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
        >
          {showReplies ? (
            <ChevronUp size={16} className="mr-1" />
          ) : (
            <ChevronDown size={16} className="mr-1" />
          )}
          {showReplies ? 'Hide' : 'Show'} {comment.children.length} repl{comment.children.length === 1 ? 'y' : 'ies'}
        </button>
        
        <button
          onClick={handleReplyClick}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          <Reply size={14} className="mr-1" />
          Reply
        </button>
      </div>
      
      {showReplies && (
        <div className="space-y-4 mt-2">
          {comment.children.map(child => (
            <div key={child.id} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{child.author_name}</h5>
                      <span className="text-xs text-gray-500">
                        {new Date(child.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400"
                      dangerouslySetInnerHTML={{ __html: child.content }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}