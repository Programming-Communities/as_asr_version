'use client';

import { useState, useCallback } from 'react';
import wordpressService from '@/services/wordpress';
import type { WPPost } from '@/types/wordpress';

interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

export function useWordPressData() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (params?: {
    page?: number;
    perPage?: number;
    category?: number;
    search?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await wordpressService.fetchPosts({
        first: params?.perPage || 10,
        after: params?.page && params.page > 1 ? undefined : undefined,
        category: params?.category,
      });
      
      setPosts(result.posts);
      return result;
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await wordpressService.fetchCategories();
      setCategories(result);
      return result;
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPost = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await wordpressService.fetchPost(slug);
      return result;
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    posts,
    categories,
    isLoading,
    error,
    fetchPosts,
    fetchCategories,
    fetchPost,
  };
}