'use client';

import { useState } from 'react';
import wordpressService from '@/services/wordpress';

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export default function CommentForm({ 
  postId, 
  parentId = 0, 
  onSubmitSuccess,
  onCancel 
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await wordpressService.submitComment({
        postId,
        author_name: formData.author_name,
        author_email: formData.author_email,
        content: formData.content,
        parent: parentId,
      });

      if (success) {
        setFormData({ author_name: '', author_email: '', content: '' });
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
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="author_name" className="block mb-2 font-medium">
            Name *
          </label>
          <input
            type="text"
            id="author_name"
            value={formData.author_name}
            onChange={(e) => setFormData({...formData, author_name: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="author_email" className="block mb-2 font-medium">
            Email *
          </label>
          <input
            type="email"
            id="author_email"
            value={formData.author_email}
            onChange={(e) => setFormData({...formData, author_email: e.target.value})}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block mb-2 font-medium">
          Comment *
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          required
          rows={4}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}