import React from 'react';
// @testing-library/react は DOM 準備後に動的 import する
let rtl: typeof import('@testing-library/react');
let render: typeof import('@testing-library/react')['render'];
let screen: typeof import('@testing-library/react')['screen'];
let fireEvent: typeof import('@testing-library/react')['fireEvent'];

// bun test を前提に、テストAPIは bun:test を使用
import { describe, it, expect, beforeAll, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';

// --- minimal DOM / API setup for bun test ---
beforeAll(async () => {
  // jest-dom の matcher を bun の expect に拡張
  expect.extend(matchers);
  if (typeof (globalThis as any).window === 'undefined') {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://localhost/',
    });
    (globalThis as any).window = dom.window as unknown as Window & typeof globalThis;
    (globalThis as any).document = dom.window.document;
    (globalThis as any).navigator = dom.window.navigator;
    (globalThis as any).HTMLElement = dom.window.HTMLElement;
    (globalThis as any).Event = dom.window.Event;
    (globalThis as any).MouseEvent = dom.window.MouseEvent;
    (globalThis as any).getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
    // IntersectionObserver を簡易スタブ
    class IO {
      constructor(_cb: any) {}
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    (globalThis as any).IntersectionObserver = IO as any;
  }
  // DOM 準備後に @testing-library/react を読み込む
  rtl = await import('@testing-library/react');
  render = rtl.render;
  screen = rtl.screen;
  fireEvent = rtl.fireEvent;
});

afterEach(() => rtl.cleanup());

const sample = Array.from({ length: 12 }).map((_, i) => ({
  slug: `post-${i}`,
  title: `Sample ${i}`,
  date: `2025-01-${(i + 1).toString().padStart(2, '0')}`,
  tags: i % 2 === 0 ? ['a'] : ['b'],
  summary: 'hello',
}));

describe('BlogsClient', () => {
  it('renders headings and first items', () => {
    render(<BlogsClient posts={sample} locale="en" />);
    expect(screen.getByText('✨ Latest')).toBeInTheDocument();
    expect(screen.getByText('🗂 All Posts')).toBeInTheDocument();
    expect(screen.getAllByText('Sample 0').length).toBeGreaterThan(0);
  });
  it('filters by search query', async () => {
    render(<BlogsClient posts={sample} locale="en" />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'Sample 11' } });
    const results = await screen.findAllByText('Sample 11');
    expect(results.length).toBeGreaterThan(0);
  });
});
