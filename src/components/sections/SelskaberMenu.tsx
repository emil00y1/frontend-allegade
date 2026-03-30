import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";

interface SelskaberMenuProps {
  menuEyebrow?: string;
  menuHeading?: string;
  menuDescription?: string;
  menuPdfUrl?: string;
  menuPdfFallbackLabel?: string;
  menuCardFallbackLabel?: string;
}

export default function SelskaberMenu({
  menuEyebrow,
  menuHeading,
  menuDescription,
  menuPdfUrl,
  menuPdfFallbackLabel,
  menuCardFallbackLabel,
}: SelskaberMenuProps) {
  return (
    <section className="bg-[#eae7e7] py-14 md:py-24 lg:py-32 px-10 lg:px-16">
      <div className="max-w-2xl mx-auto text-center">
        {menuEyebrow && <p className="font-cormorant font-light italic text-brand text-2xl mb-4">{menuEyebrow}</p>}
        {menuHeading && <h2 className="font-newsreader font-extralight text-[clamp(1.75rem,3vw,2.5rem)] text-dark-stone leading-tight mb-6">{menuHeading}</h2>}
        {menuDescription && <p className="text-warm-brown font-light leading-7 text-base mb-10 max-w-xl mx-auto">{menuDescription}</p>}
        {menuPdfUrl ? (
          <a href={menuPdfUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "dark", size: "lg" })}>
            {menuPdfFallbackLabel ?? "Se selskabsmenuer (PDF)"}
          </a>
        ) : (
          <Link href="/menukort" className={buttonVariants({ variant: "dark", size: "lg" })}>
            {menuCardFallbackLabel ?? "Se vores menukort"}
          </Link>
        )}
      </div>
    </section>
  );
}
