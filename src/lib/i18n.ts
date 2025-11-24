import ja from '@/locales/ja/common.json';
import en from '@/locales/en/common.json';

export type Locale = 'ja' | 'en';

export const dictionaries: Record<Locale, typeof ja> = {
  ja,
  en,
};

