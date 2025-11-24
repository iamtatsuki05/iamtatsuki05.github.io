import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from '@/components/site/Footer';

const meta = {
  title: 'Site/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
  render: () => (
    <div className="min-h-[220px] flex flex-col justify-end bg-gradient-to-b from-gray-50 via-white to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      <Footer />
    </div>
  ),
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
