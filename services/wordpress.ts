import { GraphQLClient } from 'graphql-request';
import { wordpressConfig, graphqlQueries } from '@/config/wordpress';
import type { WPPost, WPComment } from '@/types/wordpress';

class WordPressService {
  private graphqlClient: GraphQLClient;
  private restBaseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor() {
    const { url, graphqlEndpoint, restEndpoint } = wordpressConfig;
    
    // Create GraphQL client with timeout
    this.graphqlClient = new GraphQLClient(`${url}${graphqlEndpoint}`, {
      timeout: wordpressConfig.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.restBaseUrl = `${url}${restEndpoint}`;
    this.cache = new Map();
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > wordpressConfig.cacheTime) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async fetchPosts(params: {
    first?: number;
    after?: string;
    category?: number;
  } = {}): Promise<{ posts: WPPost[]; hasNextPage: boolean; endCursor?: string }> {
    try {
      const variables: any = {
        first: params.first || 10,
      };

      if (params.after) {
        variables.after = params.after;
      }

      if (params.category) {
        variables.category = params.category;
      }

      const cacheKey = `posts_${JSON.stringify(variables)}`;
      const cached = this.getFromCache<{ posts: WPPost[]; hasNextPage: boolean; endCursor?: string }>(cacheKey);
      if (cached) return cached;

      const response: any = await this.graphqlClient.request(
        graphqlQueries.posts,
        variables
      );

      // Handle both nodes and edges format
      const postsData = response.posts?.nodes || 
                       response.posts?.edges?.map((edge: any) => edge.node) || [];
      
      const posts = postsData.map((node: any) => this.transformPost(node));
      const pageInfo = response.posts?.pageInfo || { hasNextPage: false };

      const result = {
        posts,
        hasNextPage: pageInfo.hasNextPage,
        endCursor: pageInfo.endCursor,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        posts: [],
        hasNextPage: false,
      };
    }
  }

  async fetchPost(slug: string): Promise<WPPost | null> {
    try {
      const cacheKey = `post_${slug}`;
      const cached = this.getFromCache<WPPost>(cacheKey);
      if (cached) return cached;

      const response: any = await this.graphqlClient.request(
        graphqlQueries.post,
        { slug }
      );

      if (!response.post) {
        return null;
      }

      const post = this.transformPost(response.post);
      this.setCache(cacheKey, post);
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  async fetchCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number; description?: string }>> {
    try {
      const cacheKey = 'categories';
      const cached = this.getFromCache<Array<{ id: number; name: string; slug: string; count: number; description?: string }>>(cacheKey);
      if (cached) return cached;

      const response: any = await this.graphqlClient.request(
        graphqlQueries.categories
      );

      // Handle both nodes and edges format
      const categoriesData = response.categories?.nodes || 
                            response.categories?.edges?.map((edge: any) => edge.node) || [];

      const categories = categoriesData.map((node: any) => ({
        id: parseInt(node.id),
        name: node.name,
        slug: node.slug,
        count: node.count || 0,
        description: node.description || '',
      }));

      this.setCache(cacheKey, categories);
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async fetchMenu(location: string = 'PRIMARY'): Promise<any[]> {
    try {
      const response: any = await this.graphqlClient.request(
        graphqlQueries.menu,
        { location }
      );

      // Handle both nodes and edges format
      return response.menu?.menuItems?.nodes || 
             response.menu?.menuItems?.edges?.map((edge: any) => edge.node) || [];
    } catch (error) {
      console.error('Error fetching menu:', error);
      return [];
    }
  }

  async submitComment(data: {
    postId: number;
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
    metadata?: any;
  }): Promise<boolean> {
    try {
      const response = await fetch(`${this.restBaseUrl}/wp/v2/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post: data.postId,
          author_name: data.author_name,
          author_email: data.author_email,
          content: data.content,
          parent: data.parent || 0,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting comment:', error);
      return false;
    }
  }

  async getComments(postId: number, page: number = 1): Promise<WPComment[]> {
    try {
      const response = await fetch(
        `${this.restBaseUrl}/wp/v2/comments?post=${postId}&page=${page}&per_page=50&order=asc`
      );

      if (!response.ok) {
        return [];
      }

      const comments: any[] = await response.json();
      return comments.map(comment => ({
        id: comment.id,
        author_name: comment.author_name,
        author_email: comment.author_email,
        content: comment.content.rendered,
        date: comment.date,
        parent: comment.parent,
        status: comment.status,
        avatar: comment.author_avatar_urls?.['96'],
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async submitReaction(postId: number, reaction: string, guestToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.restBaseUrl}/al-asr/v1/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          reaction,
          guest_token: guestToken,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error submitting reaction:', error);
      return false;
    }
  }

  async getReactions(postId: number): Promise<Record<string, number>> {
    try {
      const response = await fetch(
        `${this.restBaseUrl}/al-asr/v1/reactions/${postId}`
      );
      
      if (!response.ok) {
        return {};
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return {};
    }
  }

  // Helper method to transform WordPress post data
  private transformPost(postData: any): WPPost {
    // Get video URL from any of the possible fields
    const videoUrl = postData.featuredVideoSimple || 
                     postData.videoUrl || 
                     postData.postVideo || 
                     postData.testVideo;

    // Handle both edges/nodes format
    const categories = postData.categories?.nodes || 
                      postData.categories?.edges?.map((edge: any) => edge.node) || [];
    
    const tags = postData.tags?.nodes || 
                 postData.tags?.edges?.map((edge: any) => edge.node) || [];
    
    const author = postData.author?.node || postData.author;

    return {
      id: parseInt(postData.id) || parseInt(postData.databaseId),
      title: postData.title || '',
      content: postData.content || '',
      excerpt: postData.excerpt || '',
      slug: postData.slug || '',
      date: postData.date || '',
      modified: postData.modified || '',
      featuredImage: postData.featuredImage?.node?.sourceUrl || null,
      featuredImageAlt: postData.featuredImage?.node?.altText || '',
      categories: categories.map((cat: any) => ({
        id: parseInt(cat.id),
        name: cat.name,
        slug: cat.slug,
      })),
      tags: tags.map((tag: any) => ({
        id: parseInt(tag.id),
        name: tag.name,
        slug: tag.slug,
      })),
      author: {
        id: author?.id || '',
        name: author?.name || '',
        avatar: author?.avatar?.url || '',
        description: author?.description || '',
      },
      acf: videoUrl ? {
        video_url: videoUrl,
        featured_video: videoUrl,
      } : undefined,
    };
  }

  // Clear cache when needed
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache stats
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton instance
export const wordpressService = new WordPressService();
export default wordpressService;