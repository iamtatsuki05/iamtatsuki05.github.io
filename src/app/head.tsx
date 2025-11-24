import { buildPersonJsonLd, buildWebsiteJsonLd } from '@/lib/seo';

export default function Head() {
  const structuredData = JSON.stringify([buildPersonJsonLd(), buildWebsiteJsonLd()]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    </>
  );
}
