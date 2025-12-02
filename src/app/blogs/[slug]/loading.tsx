export default function Loading() {
  return (
    <article className="prose dark:prose-invert max-w-4xl mx-auto animate-pulse">
      <div className="space-y-4 mb-8">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      </div>
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </article>
  );
}
