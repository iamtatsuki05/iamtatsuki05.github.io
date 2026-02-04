import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ModalDefault from '@/app/@modal/default';

describe('app/@modal/default', () => {
  it('モーダル未指定時は何も描画しない', () => {
    const { container } = render(<ModalDefault />);
    expect(container).toBeEmptyDOMElement();
  });
});
