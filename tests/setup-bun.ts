// Bun のテスト実行時に最低限の DOM と matcher を用意する
import { expect as bunExpect, afterEach } from 'bun:test';
import { JSDOM } from 'jsdom';
import * as matchers from '@testing-library/jest-dom/matchers';

// jest-dom の matcher を Bun の expect に拡張
bunExpect.extend(matchers);
// Bun では expect はグローバルではないため、テストで参照できるように公開
// @ts-ignore
globalThis.expect = bunExpect;

// 既に DOM があればスキップ
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
  // React の input 変更検出が jsdom で IE 用ポリフィル（attachEvent）に入らないように、
  // `isEventSupported('input')` の判定を真にする
  // https://github.com/jsdom/jsdom では document.oninput が未定義のため補う
  // @ts-ignore
  if (!('oninput' in (globalThis as any).document)) {
    (globalThis as any).document.oninput = null;
  }
  // React の古い IE ポリフィルが参照する attachEvent を no-op で用意
  // @ts-ignore
  if (!(dom.window as any).HTMLElement.prototype.attachEvent) {
    (dom.window as any).HTMLElement.prototype.attachEvent = () => {};
  }
}

// IntersectionObserver の簡易スタブ（BlogsClient が使用）
class IO {
  constructor(_cb: any) {}
  observe() {}
  disconnect() {}
  unobserve() {}
}
// @ts-ignore
globalThis.IntersectionObserver = (globalThis as any).IntersectionObserver || (IO as any);

// 各テスト後に DOM をクリア
import { cleanup } from '@testing-library/react';
afterEach(() => cleanup());
