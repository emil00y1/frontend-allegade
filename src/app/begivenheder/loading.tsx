export default function BegivenhederLoading() {
  return (
    <main>
      {/* Split hero skeleton */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white animate-pulse">
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20 gap-4">
          <div className="h-3 w-36 bg-warm-gray rounded mb-2" />
          <div className="h-12 w-64 bg-warm-gray rounded" />
          <div className="h-12 w-56 bg-warm-gray rounded" />
          <div className="h-4 w-full max-w-md bg-warm-gray rounded mt-4" />
          <div className="h-4 w-5/6 max-w-md bg-warm-gray rounded" />
          <div className="h-12 w-44 bg-warm-gray rounded mt-6" />
        </div>
        <div className="hidden lg:block bg-warm-gray" />
      </div>

      {/* Events list skeleton */}
      <div className="bg-warm-white py-20 lg:py-28" id="begivenheder">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="h-8 w-56 bg-warm-gray rounded mb-12" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-warm-gray rounded" />
                <div className="h-3 w-24 bg-warm-gray/60 rounded" />
                <div className="h-5 w-3/4 bg-warm-gray rounded" />
                <div className="h-3 w-1/3 bg-warm-gray/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
