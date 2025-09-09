import { z } from 'zod';

const dateString = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') return v;
  return undefined;
}, z.string());

export const BlogFrontmatter = z.object({
  title: z.string(),
  date: dateString,
  updated: dateString.optional(),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional().default(''),
  thumbnail: z.string().optional(),
  headerImage: z.string().optional(),
  headerAlt: z.string().optional(),
  draft: z.boolean().optional().default(false),
});
export type BlogFrontmatter = z.infer<typeof BlogFrontmatter>;

export const PublicationFrontmatter = z.object({
  title: z.string(),
  type: z.enum(['paper', 'article', 'talk', 'slide', 'media', 'app']),
  publishedAt: dateString.optional(),
  venue: z.string().optional(),
  publisher: z.string().optional(),
  authors: z.array(z.string()).default([]),
  links: z
    .array(
      z.object({
        kind: z.enum(['pdf', 'doi', 'post', 'slides', 'video', 'code', 'model', 'data', 'app']),
        url: z.string(),
      }),
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  abstract: z.string().optional(),
  headerImage: z.string().optional(),
  headerAlt: z.string().optional(),
});
export type PublicationFrontmatter = z.infer<typeof PublicationFrontmatter>;
