export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
}

/**
 * Authentic blog posts store.
 * Kept intentionally empty to avoid AI slop/invented articles until real stories are provided.
 */
export const blogPosts: BlogPost[] = [];
