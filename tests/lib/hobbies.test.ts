import { describe, expect, it } from 'vitest';
import { buildBlogsFilterPath, resolveHobbies } from '@/lib/data/hobbies';

describe('buildBlogsFilterPath', () => {
  it('builds a localized blogs path with serialized filters', () => {
    expect(buildBlogsFilterPath('en', { q: 'LLM', tags: ['nlp', 'llm'] })).toBe('/en-US/blogs/?q=LLM&tags=nlp%2Cllm');
  });
});

describe('resolveHobbies', () => {
  it('resolves localized hobby cards and counts matching posts', () => {
    const hobbies = resolveHobbies('ja', [
      {
        slug: 'hello-llm',
        title: 'LLM ではじめるホームページ開発',
        date: '2025-09-09',
        tags: ['intro', 'nextjs'],
        summary: 'LLM と一緒にサイトを作った記録',
      },
      {
        slug: 'chai-notes',
        title: 'チャイの話',
        date: '2025-10-01',
        tags: ['chai'],
        summary: '家で作るチャイのメモ',
      },
    ]);

    const nlp = hobbies.find((hobby) => hobby.id === 'nlp');
    const chai = hobbies.find((hobby) => hobby.id === 'chai');
    const camera = hobbies.find((hobby) => hobby.id === 'camera');
    const bowling = hobbies.find((hobby) => hobby.id === 'bowling');

    expect(camera?.title).toBe('カメラ');
    expect(camera?.href).toBe('/ja-JP/blogs/?tags=camera');
    expect(bowling?.title).toBe('ボウリング');
    expect(bowling?.href).toBe('/ja-JP/blogs/?tags=bowling');
    expect(nlp?.title).toBe('NLP');
    expect(nlp?.href).toBe('/ja-JP/blogs/?q=LLM');
    expect(nlp?.relatedCount).toBe(1);
    expect(chai?.href).toBe('/ja-JP/blogs/?tags=chai');
    expect(chai?.relatedCount).toBe(1);
  });

  it('returns hobbies in the configured display order', () => {
    const hobbies = resolveHobbies('ja');

    expect(hobbies.map((hobby) => hobby.id)).toEqual([
      'nlp',
      'gadgets',
      'camera',
      'visual-works',
      'tomoo',
      'cute-characters',
      'piano',
      'chai',
      'bowling',
      'legal-cases',
    ]);
  });
});
