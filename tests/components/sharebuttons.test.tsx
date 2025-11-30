import React from 'react';
import { describe, it, expect } from 'vitest';
import { ShareButtons } from '@/components/blogs/ShareButtons';

describe('ShareButtons', () => {
  it('renders share and copy buttons', async () => {
    const { render } = await import('@testing-library/react');
    const { getByText } = render(<ShareButtons url="https://example.com" title="Sample" />);
    expect(getByText('共有')).toBeInTheDocument();
    expect(getByText('Xでシェア')).toBeInTheDocument();
    expect(getByText('LinkedInでシェア')).toBeInTheDocument();
  });
});
