import { describe, expect, it } from 'vitest';
import { normalizeSearchText, tokenizeSearchQuery } from '@/lib/search/queryTokens';

describe('normalizeSearchText', () => {
  it('normalizes width and separator variations', () => {
    expect(normalizeSearchText(' Ｅｎｃｏｄｅｒ－Ｄｅｃｏｄｅｒ／LLM ')).toBe('encoder decoder llm');
  });
});

describe('tokenizeSearchQuery', () => {
  it('splits normalized text into search tokens', () => {
    expect(tokenizeSearchQuery('Sample-11')).toEqual(['sample', '11']);
    expect(tokenizeSearchQuery('Ｃｏｎｆ')).toEqual(['conf']);
  });
});
