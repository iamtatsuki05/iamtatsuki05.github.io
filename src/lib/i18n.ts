import ja from '@/locales/ja/common.json';
import en from '@/locales/en/common.json';

export type Locale = 'ja' | 'en';

export const dictionaries: Record<Locale, typeof ja> = {
  ja,
  en,
};

export const SUPPORTED_LOCALES: Locale[] = ['ja', 'en'];

export function resolveLocale(raw: string): Locale {
  return raw === 'en' ? 'en' : 'ja';
}
