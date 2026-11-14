import { z } from 'zod';

const dateString = z.preprocess((v) => {
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'string') return v;
  return undefined;
}, z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date'));

export function parseFrontmatter<T extends z.ZodType>(schema: T, data: unknown, filePath: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid frontmatter in ${filePath}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const BlogFrontmatter = z.object({
  title: z.string(),
  date: dateString,
  updated: dateString.optional(),
  tags: z.array(z.string()).default([]),
  summary: z.string().optional().default(''),
  thumbnail: z.string().optional(),
  headerImage: z.string().optional(),
  headerAlt: z.string().optional(),
  aiAssisted: z.boolean().optional().default(false),
  draft: z.boolean().optional().default(false),
  legacyAnchors: z.record(z.string(), z.string()).nullish(),
});
export type BlogFrontmatter = z.infer<typeof BlogFrontmatter>;

export const PublicationLinkKind = z.enum([
  'paper',
  'doi',
  'post',
  'slides',
  'video',
  'code',
  'model',
  'data',
  'app',
  'project',
  'pypi',
]);
export type PublicationLinkKind = z.infer<typeof PublicationLinkKind>;

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
        kind: PublicationLinkKind,
        url: z.string(),
      }),
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  abstract: z.string().optional(),
  headerImage: z.string().optional(),
  headerAlt: z.string().optional(),
  venueType: z.enum(['conference', 'journal']).optional(),
  region: z.enum(['international', 'domestic']).optional(),
  refereed: z.boolean().optional(),
  acceptance: z
    .object({ accepted: z.number().int().positive(), submitted: z.number().int().positive(), source: z.string().url() })
    .refine((a) => a.accepted <= a.submitted, { message: 'acceptance.accepted cannot exceed acceptance.submitted' })
    .optional(),
  award: z.string().min(1).optional(),
  venueFull: z.string().min(1).optional(),
  pages: z.string().regex(/^\d+(?:-\d+)?$/, 'pages must look like 66 or 66-73').optional(),
  location: z.string().min(1).optional(),
  bibtex: z.string().trim().regex(/^@\w+\{[^\s,{}]+,/, 'bibtex must start with @type{key,').optional(),
}).superRefine((fm, ctx) => {
  if (fm.type !== 'paper') return;
  for (const key of ['venueType', 'region', 'refereed'] as const) {
    if (fm[key] === undefined) {
      ctx.addIssue({ code: 'custom', path: [key], message: `A paper needs ${key} so the CV can list it under the right heading` });
    }
  }
});
export type PublicationFrontmatter = z.infer<typeof PublicationFrontmatter>;
