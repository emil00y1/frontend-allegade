import Link from "next/link";
import StructuredData from "@/components/StructuredData";

interface BreadcrumbProps {
  current: string;
  className?: string;
  homeLabel?: string;
  currentUrl?: string;
}

export default function Breadcrumb({ current, className = "mb-8", homeLabel, currentUrl }: BreadcrumbProps) {
  const displayHomeLabel = homeLabel || "Forside";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: displayHomeLabel,
        item: "https://allegade10.dk",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: current,
        ...(currentUrl && { item: `https://allegade10.dk${currentUrl}` }),
      },
    ],
  };

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav
        className={`flex items-center gap-2 text-[10px] tracking-[1px] uppercase text-warm-brown/60 ${className}`}
      >
        <Link href="/" className="hover:text-brand transition-colors">
          {displayHomeLabel}
        </Link>
        <span className="text-warm-brown/40">›</span>
        <span className="text-brand">{current}</span>
      </nav>
    </>
  );
}
