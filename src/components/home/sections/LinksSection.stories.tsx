import type { Meta, StoryObj } from '@storybook/react';
import { LinksSection } from './LinksSection';
import { sampleLinks } from '@/stories/fixtures/links';

const meta = {
  title: 'Home/LinksSection',
  component: LinksSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    links: sampleLinks,
    ctaLabel: 'もっと見る',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[260px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <LinksSection {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof LinksSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
