export default function RestaurantLoading() {
  return (
    <main>
      {/* Split hero skeleton */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)] bg-warm-white animate-pulse">
        <div className="flex flex-col justify-center px-10 lg:px-16 py-20 gap-4">
          <div className="h-3 w-32 bg-warm-gray rounded mb-2" />
          <div className="h-12 w-72 bg-warm-gray rounded" />
          <div className="h-12 w-56 bg-warm-gray rounded" />
          <div className="h-4 w-full max-w-md bg-warm-gray rounded mt-4" />
          <div className="h-4 w-5/6 max-w-md bg-warm-gray rounded" />
          <div className="h-4 w-3/4 max-w-md bg-warm-gray rounded" />
          <div className="flex gap-4 mt-6">
            <div className="h-12 w-32 bg-warm-gray rounded" />
            <div className="h-12 w-36 bg-warm-gray rounded" />
          </div>
        </div>
        <div className="hidden lg:block bg-warm-gray" />
      </div>

      {/* Story section skeleton */}
      <div className="bg-warm-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 grid lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-[3/4] bg-warm-gray rounded" />
          <div className="flex flex-col justify-center gap-4">
            <div className="h-3 w-20 bg-warm-gray rounded" />
            <div className="h-8 w-56 bg-warm-gray rounded" />
            <div className="h-4 w-full bg-warm-gray rounded mt-4" />
            <div className="h-4 w-5/6 bg-warm-gray rounded" />
            <div className="h-4 w-4/6 bg-warm-gray rounded" />
            <div className="grid grid-cols-3 gap-6 mt-8 border-t border-border-warm/20 pt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="h-6 w-12 bg-warm-gray rounded" />
                  <div className="h-3 w-16 bg-warm-gray rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu teaser skeleton */}
      <div className="bg-warm-gray py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="text-center mb-16">
            <div className="h-3 w-20 bg-border-warm/40 rounded mx-auto mb-4" />
            <div className="h-8 w-48 bg-border-warm/40 rounded mx-auto mb-4" />
            <div className="h-4 w-72 bg-border-warm/30 rounded mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
