'use client';

import { useState, useCallback } from 'react';
import wordpressService from '@/services/wordpress';

interface Comment {
  id: number;
  author_name: string;
  author_email: string;
  content: string;
  date: string;
  parent: number;
  children?: Comment[];
}

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mockComments: Comment[] = [
        {
          id: 1,
          author_name: 'John Doe',
          author_email: 'john@example.com',
          content: 'Great article! Very insightful.',
          date: new Date().toISOString(),
          parent: 0,
        },
        {
          id: 2,
          author_name: 'Jane Smith',
          author_email: 'jane@example.com',
          content: 'Thanks for sharing this knowledge.',
          date: new Date().toISOString(),
          parent: 0,
        },
      ];
      
      const commentMap = new Map<number, Comment>();
      const rootComments: Comment[] = [];

      mockComments.forEach(comment => {
        commentMap.set(comment.id, { ...comment, children: [] });
      });

      mockComments.forEach(comment => {
        if (comment.parent === 0) {
          rootComments.push(commentMap.get(comment.id)!);
        } else {
          const parent = commentMap.get(comment.parent);
          if (parent && parent.children) {
            parent.children.push(commentMap.get(comment.id)!);
          }
        }
      });

      setComments(rootComments);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const submitComment = useCallback(async (data: {
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // FIXED: Call submitComment with single object parameter
      const success = await wordpressService.submitComment({
        postId: postId,
        author_name: data.author_name,
        author_email: data.author_email,
        content: data.content,
        parent: data.parent || 0,
      });
      
      if (success) {
        await loadComments();
        return true;
      } else {
        setError('Failed to submit comment');
        return false;
      }
    } catch (err) {
      setError('Failed to submit comment');
      console.error('Error submitting comment:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [postId, loadComments]);

  return {
    comments,
    isLoading,
    error,
    loadComments,
    submitComment,
  };
}