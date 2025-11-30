import type { Meta, StoryObj } from '@storybook/react';
import { ShareButtons } from './ShareButtons';

const meta = {
  title: 'Blogs/ShareButtons',
  component: ShareButtons,
  parameters: {
    layout: 'padded',
  },
  args: {
    url: 'https://example.com/blogs/sample',
    title: 'Sample Blog Post',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ShareButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
