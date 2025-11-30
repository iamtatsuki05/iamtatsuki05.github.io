import type { Meta, StoryObj } from '@storybook/react';
import { ExternalIcon } from '@/components/ui/ExternalIcon';

const meta = {
  title: 'UI/ExternalIcon',
  component: ExternalIcon,
  tags: ['autodocs'],
  args: {
    src: 'https://cdn.simpleicons.org/github',
    alt: 'GitHub icon',
    size: 48,
  },
  argTypes: {
    size: { control: { type: 'number', min: 16, max: 96, step: 4 } },
    src: { control: 'text' },
    alt: { control: 'text' },
  },
} satisfies Meta<typeof ExternalIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFallbackIcon: Story = {
  args: {
    src: 'https://placehold.co/64x64/png',
    alt: 'Custom icon source',
    size: 56,
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
