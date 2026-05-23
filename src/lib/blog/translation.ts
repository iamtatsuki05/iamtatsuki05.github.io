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
