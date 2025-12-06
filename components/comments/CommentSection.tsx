'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import wordpressService from '@/services/wordpress';
import type { WPComment } from '@/types/wordpress';
import { useAuth } from '@/hooks/useAuth';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await wordpressService.getComments(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSuccess = () => {
    setShowForm(false);
    setReplyTo(null);
    loadComments();
  };

  const handleReply = (commentId: number) => {
    if (!isAuthenticated) {
      // Redirect to login or show login prompt
      return;
    }
    setReplyTo(commentId);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setReplyTo(null);
  };

  const handleAddCommentClick = () => {
    if (!isAuthenticated) {
      return; // Will show login prompt
    }
    setShowForm(!showForm);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
        
        {isAuthenticated ? (
          <button
            onClick={handleAddCommentClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Add Comment'}
          </button>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
          >
            <LogIn size={18} />
            Sign in to Comment
          </Link>
        )}
      </div>

      {/* Comment Form - Only show if authenticated */}
      {showForm && isAuthenticated && (
        <CommentForm
          postId={postId}
          parentId={replyTo || 0}
          onSubmitSuccess={handleCommentSuccess}
          onCancel={handleCancel}
          currentUser={user}
        />
      )}

      {/* Show login prompt if trying to comment while not authenticated */}
      {!isAuthenticated && (showForm || replyTo) && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-800 rounded-xl text-center bg-gray-50 dark:bg-gray-900">
          <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <LogIn className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            Sign in to comment
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Please sign in to post comments and reply to other comments.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <CommentList
        postId={postId}
        comments={comments}
        loading={loading}
        onReply={handleReply}
        onReload={loadComments}
        isAuthenticated={isAuthenticated}
      />

      {/* Login prompt at the bottom if no comments */}
      {!authLoading && !isAuthenticated && comments.length === 0 && (
        <div className="mt-6 p-6 border border-gray-200 dark:border-gray-800 rounded-xl text-center">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            No comments yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Be the first to comment. Sign in to share your thoughts.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Sign In to Comment
          </Link>
        </div>
      )}
    </div>
  );
}