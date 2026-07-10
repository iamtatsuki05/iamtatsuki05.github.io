import type { Locale } from '@/lib/i18n';

export const blogTranslationNotice: Record<Exclude<Locale, 'ja'>, {
  label: string;
  originalLinkLabel: string;
}> = {
  en: {
    label: 'This article was translated by AI.',
    originalLinkLabel: 'Read the Japanese original',
  },
  zh: {
    label: '本文由 AI 翻译。',
    originalLinkLabel: '阅读日语原文',
  },
  fr: {
    label: 'Cet article a été traduit par IA.',
    originalLinkLabel: 'Lire l’original japonais',
  },
};

export const blogRelatedPostsHeading: Record<Locale, string> = {
  ja: '関連記事',
  en: 'Related Posts',
  zh: '相关文章',
  fr: 'Articles liés',
};

export const blogAiWritingNotice: Record<Locale, string> = {
  ja: 'この記事は AI の補助を使って執筆しています。',
  en: 'This article was written with AI assistance.',
  zh: '本文在 AI 辅助下撰写。',
  fr: 'Cet article a été rédigé avec l’aide de l’IA.',
};
