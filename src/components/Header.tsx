import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Link href="/" className="group flex items-center gap-2">
            {/* Minimalist text logo. Can be replaced with actual SVG */}
            <span className="font-serif text-2xl font-medium tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
              Allégade<span className="font-light italic ml-1">10</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { name: "Forside", href: "/" },
            { name: "Hotel", href: "/hotel" },
            { name: "Menukort", href: "/menukort" },
            { name: "Selskaber", href: "/selskaber" },
            { name: "Events", href: "/events" },
            { name: "Om os", href: "/om-os" },
            { name: "Kontakt", href: "/kontakt" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-gray-900 hover:after:w-full after:transition-all after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right: CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/book-bord"
            className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-transparent border border-gray-300 rounded-full hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
          >
            Book bord
          </Link>
          <Link
            href="/book-ophold"
            className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-full hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Ophold
          </Link>
        </div>

        {/* Mobile menu button (placeholder for further dev) */}
        <div className="md:hidden flex items-center">
          <button className="text-gray-900 hover:text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
