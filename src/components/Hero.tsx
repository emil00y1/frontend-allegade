import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.sanity.io/files/b0bkhf04/production/bf5322023ca71a37f92e42f0607cfba31b760e04.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Overlay Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center mt-16">
        {/* Subtitle / Decorative text */}
        <span className="uppercase tracking-[0.2em] text-sm md:text-base font-medium mb-4 opacity-90">
          Kulturel Perle i Frederiksbergs Centrum
        </span>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-6 leading-tight drop-shadow-lg">
          Velkommen til <br />
          <span className="font-light italic text-white/90">Allégade 10</span>
        </h1>

        {/* Short Description */}
        <p className="text-lg md:text-xl font-light mb-10 max-w-2xl opacity-90 drop-shadow-md">
          Oplev en historisk atmosfære, udsøgt mad og mindeværdige ophold i hjertet af Frederiksberg. Siden 1780.
        </p>

        {/* Primary Hero CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <Link
            href="/book-bord"
            className="px-8 py-3.5 text-base font-medium text-gray-900 bg-white rounded-full hover:bg-gray-100 hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Find dit bord
          </Link>
          <Link
            href="/book-ophold"
            className="px-8 py-3.5 text-base font-medium text-white bg-transparent border border-white rounded-full hover:bg-white/10 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
          >
            Se Vores Værelser
          </Link>
        </div>
      </div>

      {/* Scroll indicator (Optional elegant touch) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10 opacity-70">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
