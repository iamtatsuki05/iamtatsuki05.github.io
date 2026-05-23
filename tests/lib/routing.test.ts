import { describe, expect, it } from 'vitest';
import { extractLocaleFromPath, isTranslatablePath, localizedPath } from '@/lib/routing';

describe('localizedPath', () => {
  it('generates a localized hobbies path', () => {
    expect(localizedPath('/hobbies/', 'en')).toBe('/en-US/hobbies/');
  });

  it('generates Chinese and French blog detail paths', () => {
    expect(localizedPath('/blogs/example-post/', 'zh')).toBe('/zh-CN/blogs/example-post/');
    expect(localizedPath('/blogs/example-post/', 'fr')).toBe('/fr-FR/blogs/example-post/');
  });
});

describe('isTranslatablePath', () => {
  it('treats hobbies as a translatable top-level page', () => {
    expect(isTranslatablePath('/ja-JP/hobbies/')).toBe(true);
    expect(isTranslatablePath('/hobbies/')).toBe(true);
  });

  it('treats blog detail pages as translatable', () => {
    expect(isTranslatablePath('/blogs/example-post/')).toBe(true);
    expect(isTranslatablePath('/fr-FR/blogs/example-post/')).toBe(true);
  });
});

describe('extractLocaleFromPath', () => {
  it('resolves route locale aliases for all supported locales', () => {
    expect(extractLocaleFromPath('/ja-JP/')).toBe('ja');
    expect(extractLocaleFromPath('/en-US/')).toBe('en');
    expect(extractLocaleFromPath('/zh-CN/')).toBe('zh');
    expect(extractLocaleFromPath('/fr-FR/')).toBe('fr');
  });
});
