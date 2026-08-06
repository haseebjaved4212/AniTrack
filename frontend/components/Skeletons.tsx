export function AnimeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-3">
          <div className="aspect-[3/4] w-full animate-pulse rounded-lg bg-neutral-800"></div>
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-800"></div>
          <div className="flex justify-between">
            <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-800"></div>
            <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListEntrySkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 sm:flex-row">
      <div className="h-48 w-full bg-neutral-800 sm:w-32 sm:h-auto"></div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 h-6 w-3/4 rounded bg-neutral-800"></div>
        <div className="mb-4 h-4 w-1/4 rounded bg-neutral-800"></div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded bg-neutral-800"></div>
            <div className="h-8 w-24 rounded bg-neutral-800"></div>
          </div>
          <div className="h-8 w-8 rounded bg-neutral-800"></div>
        </div>
      </div>
    </div>
  );
}
