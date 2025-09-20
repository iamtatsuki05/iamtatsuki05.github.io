import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { withBasePath, withVersion } from '@/lib/url';
import { absoluteUrl, buildPageMetadata, siteConfig } from '@/lib/seo';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

const inter = Inter({ subsets: ['latin'] });

const baseMetadata = buildPageMetadata({
  title: siteConfig.defaultTitle.ja,
  description: siteConfig.description.ja,
  locale: 'ja',
  path: '/',
  languageAlternates: {
    'ja-JP': '/ja/',
    'en-US': '/en/',
    'x-default': '/',
  },
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(absoluteUrl('/')),
  alternates: {
    ...baseMetadata.alternates,
    types: {
      'application/rss+xml': absoluteUrl('/rss.xml'),
    },
  },
  icons: {
    icon: [
      { url: withVersion(withBasePath('/favicon.ico'))!, type: 'image/x-icon' },
      { url: withVersion(withBasePath('/favicon-32x32.png'))!, type: 'image/png', sizes: '32x32' },
      { url: withVersion(withBasePath('/favicon-16x16.png'))!, type: 'image/png', sizes: '16x16' },
    ],
    shortcut: withVersion(withBasePath('/favicon-32x32.png')),
    apple: withVersion(withBasePath('/apple-touch-icon.png')),
  },
  category: 'technology',
  applicationName: siteConfig.siteName.ja,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* 主要外部オリジンの接続最適化 */}
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.simpleicons.org" />
        <link rel="dns-prefetch" href="https://platform.twitter.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {/* LCP想定画像の先読み（トップのアバター） */}
        <link
          rel="preload"
          as="image"
          href={withVersion(withBasePath('/favicon.ico'))}
          fetchPriority="high"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
