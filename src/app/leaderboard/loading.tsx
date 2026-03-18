export default function Loading() {
  return (
    <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-accent-green font-mono text-[32px] font-bold">
            &gt;
          </span>
          <div className="h-9 w-56 bg-text-tertiary/20 animate-pulse rounded" />
        </div>
        <div className="h-5 w-64 bg-text-tertiary/20 animate-pulse rounded" />
        <div className="h-4 w-40 bg-text-tertiary/20 animate-pulse rounded" />
      </div>

      <div className="flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border border-border-primary rounded-md overflow-hidden"
          >
            <div className="h-12 px-5 flex items-center justify-between border-b border-border-primary bg-bg-surface">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 bg-text-tertiary/20 animate-pulse rounded" />
                  <div className="h-4 w-8 bg-text-tertiary/20 animate-pulse rounded" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-10 bg-text-tertiary/20 animate-pulse rounded" />
                  <div className="h-4 w-10 bg-text-tertiary/20 animate-pulse rounded" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-4 w-16 bg-text-tertiary/20 animate-pulse rounded" />
                <div className="h-4 w-14 bg-text-tertiary/20 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}