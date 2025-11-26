/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/image-loader.ts',
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ['next-image-export-optimizer'],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",
    nextImageExportOptimizer_generateAndUseAvif: "true",
  },
  reactStrictMode: true,
  // NOTE:
  // GitHub Pages の公式 Action (actions/configure-pages@v5 with static_site_generator: next)
  // が basePath と画像最適化を自動注入します。ここで basePath/assetPrefix を設定すると
  // 二重適用でアセットパスが壊れる可能性があるため、明示設定は行いません。
};

export default nextConfig;
