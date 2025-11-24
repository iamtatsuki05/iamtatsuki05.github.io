import type { Meta, StoryObj } from '@storybook/react';
import { EmbedsClient } from './EmbedsClient';

const meta = {
  title: 'Site/EmbedsClient',
  component: EmbedsClient,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: { enabled: false }, // Storybookでは外部ロードを避けるためデフォルト無効
  render: (args) => (
    <div className="p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        EmbedsClientは .rse-embed[data-provider][data-url] に対して動的にSNS埋め込みを行います。
        Storybookでは外部ロードを避けるため enabled=false を既定にしています。
      </p>
      <div className="prose">
        <div className="rse-embed" data-provider="twitter" data-url="https://x.com/iam_tatsuki05/status/1824800993856647280?s=20" />
        <div className="rse-embed" data-provider="youtube" data-url="https://youtu.be/NvDkY-yabC4?si=ZN2wRfXLA6hd9qOx" />
      </div>
      <EmbedsClient {...args} />
    </div>
  ),
} satisfies Meta<typeof EmbedsClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Disabled: Story = {};

export const Enabled: Story = { args: { enabled: true } };
