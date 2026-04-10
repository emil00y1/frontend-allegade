export default function MenukortLoading() {
  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      {/* Menu hero skeleton */}
      <div className="grid lg:grid-cols-[3fr_2fr] min-h-[30vh] bg-warm-white border-b border-border-warm/30 animate-pulse">
        <div className="flex flex-col justify-center px-10 lg:px-16 pt-32 pb-10 lg:pt-36 lg:pb-12 gap-4">
          <div className="h-3 w-32 bg-warm-gray rounded mb-2" />
          <div className="h-10 w-64 bg-warm-gray rounded" />
          <div className="h-4 w-full max-w-lg bg-warm-gray rounded mt-2" />
          <div className="h-4 w-4/5 max-w-lg bg-warm-gray rounded" />
          <div className="flex gap-6 mt-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-warm-gray" />
                <div className="h-3 w-28 bg-warm-gray rounded" />
              </div>
            ))}
          </div>
          <div className="h-10 w-28 bg-warm-gray rounded" />
        </div>
        <div className="hidden lg:block bg-warm-gray" />
      </div>

      {/* Tabs skeleton */}
      <div className="max-w-5xl mx-auto px-10 lg:px-16 py-12 animate-pulse">
        <div className="flex gap-6 border-b border-border-warm/30 pb-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-20 bg-warm-gray rounded" />
          ))}
        </div>
        {/* Menu cards skeleton */}
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border-warm/20 p-6 rounded">
              <div className="h-6 w-48 bg-warm-gray rounded mb-4" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="h-4 w-40 bg-warm-gray rounded" />
                      <div className="h-3 w-64 bg-warm-gray/60 rounded" />
                    </div>
                    <div className="h-4 w-12 bg-warm-gray rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
