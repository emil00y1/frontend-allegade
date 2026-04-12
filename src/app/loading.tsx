export default function HomeLoading() {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-warm-white">
      <div className="relative h-px w-56 overflow-hidden bg-black/5">
        <div className="absolute inset-y-0 left-0 w-0 bg-black/40 animate-[loadingFill_3s_ease-out_forwards]" />
      </div>
      <style>{`
        @keyframes loadingFill {
          0%   { width: 0%; }
          60%  { width: 70%; }
          100% { width: 90%; }
        }
      `}</style>
    </main>
  );
}
