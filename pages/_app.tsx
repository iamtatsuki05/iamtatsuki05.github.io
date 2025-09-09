import type { AppProps } from 'next/app';
import '../app/globals.css';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto max-w-4xl px-4 py-8 flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

