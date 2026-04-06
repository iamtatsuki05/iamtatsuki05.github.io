import { describe, expect, it } from 'vitest';
import { isTranslatablePath, localizedPath } from '@/lib/routing';

describe('localizedPath', () => {
  it('generates a localized hobbies path', () => {
    expect(localizedPath('/hobbies/', 'en')).toBe('/en-US/hobbies/');
  });
});

describe('isTranslatablePath', () => {
  it('treats hobbies as a translatable top-level page', () => {
    expect(isTranslatablePath('/ja-JP/hobbies/')).toBe(true);
    expect(isTranslatablePath('/hobbies/')).toBe(true);
  });
});
