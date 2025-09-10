import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../app/globals.css';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { withBasePath, withVersion } from '@/lib/url';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <Head>
          {/* 共通アイコン設定（pages ルーター用） */}
          {/* SVG（対応ブラウザ） */}
          <link
            rel="icon"
            type="image/svg+xml"
            href={withVersion(withBasePath('/favicon.svg'))!}
          />
          {/* PNG フォールバック */}
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={withVersion(withBasePath('/favicon-32x32.png'))!}
          />
          {/* ICO も参照（レガシー互換・一部 UA の優先解決向け） */}
          <link
            rel="icon"
            type="image/x-icon"
            sizes="any"
            href={withVersion(withBasePath('/favicon.ico'))!}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={withVersion(withBasePath('/favicon-16x16.png'))!}
          />
          {/* Apple Touch Icon */}
          <link
            rel="apple-touch-icon"
            href={withVersion(withBasePath('/apple-touch-icon.png'))!}
          />
        </Head>
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
