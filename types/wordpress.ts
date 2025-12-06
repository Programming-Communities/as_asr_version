export interface WPPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage: string | null;
  featuredImageAlt: string;
  categories: WPCategory[]; // Updated to use WPCategory
  tags: WPTag[];
  author: WPAuthor;
  acf?: {
    featured_video?: string;
    video_url?: string;
    custom_field?: string;
  };
}

export interface WPAuthor {
  id: string;
  name: string;
  avatar: string;
  description?: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number; // Required field
  description?: string;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export interface WPComment {
  id: number;
  author_name: string;
  author_email: string;
  content: string;
  date: string;
  parent: number;
  status: string;
  avatar?: string;
}

export interface WPPageInfo {
  hasNextPage: boolean;
  endCursor?: string;
}

