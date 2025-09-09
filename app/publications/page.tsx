import { getAllPublications } from '@/lib/content/publication';
import { PublicationsClient } from './sections/PublicationsClient';

export default async function PublicationsPage() {
  const items = await getAllPublications();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📚 Publications</div>
      <h1 className="text-3xl font-bold">📚 Publications</h1>
      <PublicationsClient items={items} locale="en" />
    </div>
  );
}
