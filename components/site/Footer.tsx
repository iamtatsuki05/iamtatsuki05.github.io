export function Footer() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
        <p>&copy; {new Date().getFullYear()} Tatsuki Okada - Personal Site</p>
        <p>
          <a href={`${base}/sitemap.xml`} className="mr-3">Sitemap</a>
          <a href={`${base}/rss.xml`} className="mr-3">RSS</a>
          <a href={`${base}/robots.txt`}>Robots</a>
        </p>
      </div>
    </footer>
  );
}
