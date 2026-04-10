export default function HomeLoading() {
  return (
    <main>
      {/* Full-screen hero skeleton */}
      <div className="relative w-full h-screen min-h-[640px] flex items-center justify-center bg-dark-stone animate-pulse">
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <div className="h-3 w-48 bg-white/10 rounded mb-8" />
          <div className="h-14 w-80 bg-white/10 rounded mb-3" />
          <div className="h-14 w-72 bg-white/10 rounded mb-16" />
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-white/10 rounded" />
            <div className="h-12 w-40 bg-white/8 rounded" />
          </div>
        </div>
      </div>

      {/* Welcome section skeleton */}
      <div className="bg-warm-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 grid lg:grid-cols-2 gap-16 animate-pulse">
          <div className="flex flex-col justify-center gap-4">
            <div className="h-3 w-24 bg-warm-gray rounded" />
            <div className="h-8 w-64 bg-warm-gray rounded" />
            <div className="h-4 w-full bg-warm-gray rounded mt-4" />
            <div className="h-4 w-5/6 bg-warm-gray rounded" />
            <div className="h-4 w-4/6 bg-warm-gray rounded" />
          </div>
          <div className="aspect-[4/3] bg-warm-gray rounded" />
        </div>
      </div>

      {/* Events section skeleton */}
      <div className="bg-warm-gray py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="h-3 w-20 bg-border-warm/40 rounded mb-4" />
          <div className="h-8 w-56 bg-border-warm/40 rounded mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-border-warm/30 rounded" />
                <div className="h-4 w-3/4 bg-border-warm/30 rounded" />
                <div className="h-3 w-1/2 bg-border-warm/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
