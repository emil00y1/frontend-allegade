export default function SelskaberLoading() {
  return (
    <main className="bg-warm-white min-h-[calc(100vh-80px)]">
      {/* Split hero skeleton */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white animate-pulse">
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20 gap-4">
          <div className="h-3 w-32 bg-warm-gray rounded mb-2" />
          <div className="h-12 w-72 bg-warm-gray rounded" />
          <div className="h-12 w-64 bg-warm-gray rounded" />
          <div className="h-4 w-full max-w-md bg-warm-gray rounded mt-4" />
          <div className="h-4 w-5/6 max-w-md bg-warm-gray rounded" />
          <div className="h-4 w-3/4 max-w-md bg-warm-gray rounded" />
          <div className="flex gap-4 mt-6">
            <div className="h-12 w-44 bg-warm-gray rounded" />
            <div className="h-12 w-40 bg-warm-gray rounded" />
          </div>
        </div>
        <div className="hidden lg:block bg-warm-gray" />
      </div>

      {/* Occasions skeleton */}
      <div className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="flex gap-4 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-28 bg-warm-gray rounded-full" />
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-[4/3] bg-warm-gray rounded" />
            <div className="flex flex-col justify-center gap-4">
              <div className="h-8 w-56 bg-warm-gray rounded" />
              <div className="h-4 w-full bg-warm-gray rounded" />
              <div className="h-4 w-5/6 bg-warm-gray rounded" />
              <div className="h-4 w-4/6 bg-warm-gray rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Venues skeleton */}
      <div className="bg-warm-gray py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="h-3 w-20 bg-border-warm/40 rounded mb-4" />
          <div className="h-8 w-48 bg-border-warm/40 rounded mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[4/3] bg-border-warm/30 rounded" />
                <div className="h-5 w-3/4 bg-border-warm/30 rounded" />
                <div className="h-3 w-1/2 bg-border-warm/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
