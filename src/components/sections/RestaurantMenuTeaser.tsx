import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { urlFor } from "@/sanity/lib/image";
import { buttonVariants } from "@/lib/button-variants";
import { type MenuServiceItem } from "@/types/sanity";

interface RestaurantMenuTeaserProps {
  menuTeaserEyebrow?: string;
  menuTeaserHeading?: string;
  menuTeaserDescription?: string;
  menuServices?: MenuServiceItem[];
  menuCtaLabel?: string;
  menuCtaUrl?: string;
}

export default function RestaurantMenuTeaser({
  menuTeaserEyebrow,
  menuTeaserHeading,
  menuTeaserDescription,
  menuServices,
  menuCtaLabel,
  menuCtaUrl,
}: RestaurantMenuTeaserProps) {
  const list = menuServices || [];
  return (
    <section className="bg-warm-gray py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-10 lg:px-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <SectionHeading eyebrow={menuTeaserEyebrow ?? "Menukort"} heading={menuTeaserHeading ?? "Noget for enhver lejlighed"} />
          <p className="text-warm-brown font-light text-sm leading-6 max-w-sm lg:text-right">
            {menuTeaserDescription ?? "Vi serverer hele dagen — fra weekend brunch til klassisk frokost..."}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-warm/20">
          {list.map((service, i) => {
            const imgUrl = service.image?.asset ? urlFor(service.image).width(700).height(500).auto("format").url() : null;
            return (
              <div key={service._key || i} className="bg-warm-gray flex flex-col p-8 pb-10">
                <div className="relative aspect-[4/3] overflow-hidden bg-warm-gray mb-8">
                  {imgUrl ? <Image src={imgUrl} alt={service.title ?? ""} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /> : <div className="absolute inset-0 bg-warm-gray" />}
                </div>
                <div className="flex flex-col gap-4 flex-1">
                  {service.timeLabel && <span className="text-[10px] tracking-[1.5px] uppercase text-brand font-light">{service.timeLabel}</span>}
                  <h3 className="font-newsreader font-extralight text-2xl text-dark-stone leading-tight">{service.title}</h3>
                  <p className="text-warm-brown font-light text-sm leading-6 flex-1">{service.description}</p>
                  {service.priceFrom != null && (
                    <p className="font-newsreader font-extralight text-lg text-dark-stone mt-auto pt-4 border-t border-border-warm/20">
                      Fra {service.priceFrom},- {service.priceLabel && <span className="text-warm-brown/70 text-sm font-light ml-1">{service.priceLabel}</span>}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href={menuCtaUrl ?? "/menukort"} className={buttonVariants({ variant: "ghost", size: "lg" })}>
            {menuCtaLabel ?? "Se det fulde menukort"}
          </Link>
        </div>
      </div>
    </section>
  );
}
