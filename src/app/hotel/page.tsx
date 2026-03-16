import Link from "next/link";
import Image from "next/image";

export default function HotelPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Page Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image - Using a placeholder until real image is available */}
        <div className="absolute inset-0 w-full h-full bg-gray-200">
          <Image
            src="https://cdn.sanity.io/images/b0bkhf04/production/1540f43217509341036104e9caa20c9be524ef22-2048x1365.jpg"
            alt="Allégade 10 Hotel Room"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40 z-0"></div>

        {/* Overlay Content */}
        <div className="relative z-10 text-center text-white px-4 flex flex-col items-center mt-12 w-full max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-12 drop-shadow-lg">
            Hotel
          </h1>

          {/* Call to Action */}
          <Link
            href="/book-ophold"
            className="px-8 py-3 text-sm tracking-wider uppercase font-medium text-white bg-transparent border border-white rounded hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 backdrop-blur-sm flex items-center gap-3"
          >
            <span>Book Ophold</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* 2. "Vores Værelser" Content Section */}
      <section className="w-full bg-[#f4efe9] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-12">
            Vores værelser
          </h2>

          <div className="flex flex-col gap-8 text-base md:text-lg text-gray-800 font-light leading-relaxed max-w-3xl">
            <p className="font-serif italic selection:bg-gray-200">
              I hjertet af Frederiksberg Allégade, ligger vores lille hotel i et
              stemningsfuldt hus fra 1780'erne. Her mærker man historiens
              vingesus i de skæve gulve, de fine detaljer og den særlige ro, som
              kun tiden kan skabe. Atmosfæren er varm og hjemlig fra det
              øjeblik, du træder indenfor.
            </p>

            <p className="selection:bg-gray-200">
              Vores værelser forener klassisk charme og danner basen, uanset om
              du er på romantisk shoppingtur i København, på weekendtur,
              forretningsrejse eller blot trænger til en pause fra hverdagen.
              Som i den gamle tidsånd deler husets 12 værelser fem badeværelser.
              Alle værelser ligger tæt på et af disse. På den måde bevarer
              værelserne deres størrelse og personlighed.
            </p>

            <p className="selection:bg-gray-200">
              Gæster har adgang til et tekøkken, hvor der kan brygges en kop
              kaffe eller te. I stueetagen finder du vores hyggelige restaurant
              – faktisk den første på Frederiksberg, hvor historien...
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
