import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ThemeProvider } from 'next-themes';
import { assetPath, withBasePath, withVersion } from '@/lib/url';
import { absoluteUrl, buildPageMetadata, defaultLanguageAlternates, siteConfig } from '@/lib/seo';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const baseMetadata = buildPageMetadata({
  title: siteConfig.defaultTitle.ja,
  description: siteConfig.description.ja,
  locale: 'ja',
  path: '/',
  languageAlternates: defaultLanguageAlternates,
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
      { url: assetPath('/favicon-32x32.png')!, type: 'image/png', sizes: '32x32' },
      { url: assetPath('/favicon-16x16.png')!, type: 'image/png', sizes: '16x16' },
    ],
    shortcut: assetPath('/favicon-32x32.png'),
    apple: assetPath('/apple-touch-icon.png'),
  },
  category: 'technology',
  applicationName: siteConfig.siteName.ja,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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
      </head>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen flex flex-col`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
