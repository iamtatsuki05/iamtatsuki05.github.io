import type { Meta, StoryObj } from '@storybook/react';
import { CodeCopyClient } from './CodeCopyClient';

const meta = {
  title: 'Site/CodeCopyClient',
  component: CodeCopyClient,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: { enabled: true },
  render: (args) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <article className="prose">
        <pre>
{`console.log('hello');`}
        </pre>
      </article>
      <CodeCopyClient {...args} />
    </div>
  ),
} satisfies Meta<typeof CodeCopyClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
