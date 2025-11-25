import type { Meta, StoryObj } from '@storybook/react';
import { NavLinks } from './NavLinks';
import { resolveNavItems } from './navItems';

const meta = {
  title: 'Site/NavLinks',
  component: NavLinks,
  args: {
    items: resolveNavItems('ja'),
    activePath: '/',
    localePrefix: '',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 p-4">
      <NavLinks {...args} />
    </div>
  ),
} satisfies Meta<typeof NavLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const MobileVertical: Story = {
  args: {
    orientation: 'vertical',
  },
};

export const BlogActive: Story = {
  args: {
    activePath: '/blogs/',
  },
};
