'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import wordpressService from '@/services/wordpress';
import type { WPComment } from '@/types/wordpress';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [replyTo, setReplyTo] = useState<number | null>(null);

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
    setReplyTo(commentId);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setReplyTo(null);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          {showForm ? 'Cancel' : 'Add Comment'}
        </button>
      </div>

      {showForm && (
        <CommentForm
          postId={postId}
          parentId={replyTo || 0}
          onSubmitSuccess={handleCommentSuccess}
          onCancel={handleCancel}
        />
      )}

      <CommentList
        postId={postId}
        comments={comments}
        loading={loading}
        onReply={handleReply}
        onReload={loadComments}
      />
    </div>
  );
}