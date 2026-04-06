export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
