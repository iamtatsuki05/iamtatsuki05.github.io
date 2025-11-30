import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from 'next-themes';

const meta = {
  title: 'Site/ThemeToggle',
  component: ThemeToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  render: () => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  ),
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
