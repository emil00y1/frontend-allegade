import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";

import { type SanityImage } from "@/types/sanity";

interface MenuHeroProps {
  breadcrumbLabel?: string;
  headerHeading?: string;
  headerDescription?: string;
  headerImage?: SanityImage;
  headerServingTimes?: Array<{ label?: string; time?: string }>;
  bookTableLabel?: string;
  bookTableUrl?: string;
  breadcrumbHomeLabel?: string;
  globalBookTableUrl?: string;
}

export default function MenuHero({
  breadcrumbLabel,
  headerHeading,
  headerDescription,
  headerImage,
  headerServingTimes,
  bookTableLabel,
  bookTableUrl,
  breadcrumbHomeLabel,
  globalBookTableUrl,
}: MenuHeroProps) {
  const servingTimes = headerServingTimes || [];
  const finalBookingUrl = bookTableUrl || globalBookTableUrl || "https://dinnerbooking.com/dk/da-DK/eventbooking/event/4155/allegade-10";
  const headerImageUrl = headerImage?.asset
    ? urlFor(headerImage).width(900).height(600).auto("format").url()
    : null;

  return (
    <section className="grid lg:grid-cols-[3fr_2fr] min-h-[30vh] bg-warm-white border-b border-border-warm/30">
      <div className="flex flex-col justify-center px-10 lg:px-16 pt-32 pb-10 lg:pt-36 lg:pb-12">
        <Breadcrumb current={breadcrumbLabel ?? "Menukort"} className="mb-6" homeLabel={breadcrumbHomeLabel} />
        <h1 className="font-newsreader font-extralight text-[clamp(2rem,4vw,3.25rem)] text-dark-stone leading-none mb-4">
          {headerHeading ?? "Vores Menukort"}
        </h1>
        <p className="text-warm-brown font-light leading-6 max-w-lg mb-8 text-base">
          {headerDescription ?? "Fra klassisk dansk smørrebrød til aftenmenu..."}
        </p>

        {servingTimes.length > 0 && (
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {servingTimes.map((st, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-brand shrink-0" />
                <span className="text-[11px] font-light text-dark-stone">
                  <span className="font-light text-warm-brown/80 uppercase tracking-[0.5px] text-[10px] mr-1">
                    {st.label}:
                  </span>
                  {st.time}
                </span>
              </div>
            ))}
          </div>
        )}

        <Link href={finalBookingUrl} className={buttonVariants({ variant: "primary", size: "sm" })}>
          {bookTableLabel ?? "Book bord"}
        </Link>
      </div>

      <div className="relative hidden lg:block overflow-hidden bg-warm-gray">
        {headerImageUrl ? (
          <Image src={headerImageUrl} alt={headerHeading ?? "Menukort"} fill sizes="40vw" className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-warm-gray" />
        )}
      </div>
    </section>
  );
}
