import type { Meta, StoryObj } from '@storybook/react';
import { LinkGrid } from './LinkGrid';
import { sampleLinks } from '@/stories/fixtures/links';

const meta = {
  title: 'Links/LinkGrid',
  component: LinkGrid,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    items: sampleLinks,
    showDescription: true,
  },
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[260px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <LinkGrid {...args} />
      </div>
    </div>
  ),
  tags: ['autodocs'],
} satisfies Meta<typeof LinkGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDescriptions: Story = {
  args: {
    showDescription: false,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
