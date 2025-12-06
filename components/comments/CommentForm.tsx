'use client';

import { useState, useEffect } from 'react';
import wordpressService from '@/services/wordpress';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

export default function CommentForm({ 
  postId, 
  parentId = 0, 
  onSubmitSuccess,
  onCancel,
  currentUser 
}: CommentFormProps) {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData({
        author_name: currentUser.name,
        author_email: currentUser.email,
        content: '',
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If not authenticated, require name and email
    if (!isAuthenticated && (!formData.author_name || !formData.author_email)) {
      setError('Name and email are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use WordPress service to submit comment
      const success = await wordpressService.submitComment({
        postId,
        author_name: formData.author_name,
        author_email: formData.author_email,
        content: formData.content,
        parent: parentId,
      });

      if (success) {
        setFormData({ 
          author_name: currentUser?.name || '', 
          author_email: currentUser?.email || '', 
          content: '' 
        });
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        setError('Failed to submit comment. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
      {currentUser && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Commenting as <span className="font-semibold">{currentUser.name}</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Only show name/email fields if not logged in */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="author_name" className="block mb-2 font-medium text-gray-900 dark:text-white">
                Name *
              </label>
              <input
                type="text"
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData({...formData, author_name: e.target.value})}
                required={!isAuthenticated}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="author_email" className="block mb-2 font-medium text-gray-900 dark:text-white">
                Email *
              </label>
              <input
                type="email"
                id="author_email"
                value={formData.author_email}
                onChange={(e) => setFormData({...formData, author_email: e.target.value})}
                required={!isAuthenticated}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 font-medium text-gray-900 dark:text-white">
            Comment *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {loading ? 'Submitting...' : 'Post Comment'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}