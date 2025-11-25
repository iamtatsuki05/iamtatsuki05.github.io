import type { Meta, StoryObj } from '@storybook/react';
import { MobileMenu } from './MobileMenu';
import { resolveNavItems } from './navItems';

const meta = {
  title: 'Site/MobileMenu',
  component: MobileMenu,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    open: true,
    items: resolveNavItems('ja'),
    activePath: '/',
    localePrefix: '',
    onClose: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="min-h-[400px] bg-gray-50 dark:bg-gray-900 relative">
      <MobileMenu {...args} />
    </div>
  ),
};
