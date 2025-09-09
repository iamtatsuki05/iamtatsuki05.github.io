import { getAllPublications } from '@/lib/content/publication';
import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';

export default async function PublicationsJa() {
  const items = await getAllPublications();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📚 公開物</div>
      <h1 className="text-3xl font-bold">📚 公開物</h1>
      <PublicationsClient items={items} locale="ja" />
    </div>
  );
}
