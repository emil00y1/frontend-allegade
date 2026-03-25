import Link from "next/link";

interface BreadcrumbProps {
  current: string;
  className?: string;
  homeLabel?: string;
}

export default function Breadcrumb({ current, className = "mb-8", homeLabel = "Forside" }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-2 text-[10px] tracking-[1px] uppercase text-warm-brown/60 ${className}`}
    >
      <Link href="/" className="hover:text-brand transition-colors">
        {homeLabel}
      </Link>
      <span className="text-warm-brown/40">›</span>
      <span className="text-brand">{current}</span>
    </nav>
  );
}
