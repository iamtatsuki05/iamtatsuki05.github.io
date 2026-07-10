export type PageMetadata = {
  title?: string;
  description?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
    types?: Record<string, string>;
  };
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: 'website' | 'article';
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
};
