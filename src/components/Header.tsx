"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Forside", href: "/" },
  { name: "Hotel", href: "/hotel" },
  { name: "Menukort", href: "/menukort" },
  { name: "Selskaber", href: "/selskaber" },
  { name: "Events", href: "/events" },
  { name: "Om os", href: "/om-os" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-2xl font-medium tracking-tight text-white drop-shadow-md group-hover:opacity-80 transition-opacity">
                Allégade<span className="font-light italic ml-1">10</span>
              </span>
            </Link>
          </div>

          {/* Menu button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-white hover:opacity-80 focus:outline-none transition-opacity drop-shadow-md"
            aria-label="Åbn menu"
          >
            <Menu />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-8 h-24">
          <span className="font-serif text-xl font-medium tracking-tight text-gray-900">
            Allégade<span className="font-light italic ml-1">10</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full focus:outline-none transition-all duration-300"
            aria-label="Luk menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-4 py-2 gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="group relative flex items-center justify-between px-4 py-3.5 rounded-2xl hover:bg-gray-50 text-base font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <span>{link.name}</span>
              <svg 
                className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gray-300" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="px-8 flex flex-col gap-3 mt-auto pb-10 pt-6">
          <Link
            href="/book-bord"
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-sm font-medium text-gray-900 border border-gray-300 rounded-full hover:border-gray-900 transition-all duration-300"
          >
            Book bord
          </Link>
          <Link
            href="/book-ophold"
            onClick={() => setDrawerOpen(false)}
            className="px-5 py-3 text-center text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-black transition-all duration-300"
          >
            Book Ophold
          </Link>
        </div>
      </div>
    </>
  );
}
