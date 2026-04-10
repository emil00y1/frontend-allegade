export default function PageLoading() {
  return (
    <main>
      {/* Generic page skeleton — covers text/image sections */}
      <div className="bg-warm-white py-20 lg:py-28 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-10 lg:px-16 animate-pulse">
          <div className="h-10 w-64 bg-warm-gray rounded mb-4" />
          <div className="h-px w-10 bg-warm-gray rounded mb-10" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-warm-gray rounded" />
            <div className="h-4 w-5/6 bg-warm-gray rounded" />
            <div className="h-4 w-4/6 bg-warm-gray rounded" />
            <div className="h-4 w-full bg-warm-gray rounded" />
            <div className="h-4 w-3/4 bg-warm-gray rounded" />
          </div>
          <div className="aspect-[16/9] bg-warm-gray rounded mt-12" />
        </div>
      </div>
    </main>
  );
}
