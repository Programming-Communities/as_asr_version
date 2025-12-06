import type { WPPost, WPComment, WPCategory } from './wordpress';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PostCardProps {
  post: WPPost;
  variant?: DeviceType;
  priority?: boolean;
  showExcerpt?: boolean;
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
}

export interface AdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  device?: DeviceType;
  className?: string;
}

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  isDark: boolean;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
  timestamp: number;
}

export interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export interface CommentItemProps {
  comment: WPComment;
  onReply?: (commentId: number) => void;
  isReply?: boolean;
}

export interface SearchResult {
  id: number;
  title: string;
  type: 'post' | 'category' | 'author';
  slug: string;
  excerpt?: string;
}