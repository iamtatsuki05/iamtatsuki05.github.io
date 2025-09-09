/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // NOTE:
  // GitHub Pages の公式 Action (actions/configure-pages@v5 with static_site_generator: next)
  // が basePath と画像最適化を自動注入します。ここで basePath/assetPrefix を設定すると
  // 二重適用でアセットパスが壊れる可能性があるため、明示設定は行いません。
};

export default nextConfig;
