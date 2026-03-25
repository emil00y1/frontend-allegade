import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import NewsletterSection from "@/components/NewsletterSection";
import { sanityFetch } from "@/sanity/lib/live";

const FOOTER_QUERY = `*[_type == "siteSettings"][0]{
  address, phone, email, footerDescription, socialLinks,
  restaurantHours, kitchenHours,
  newsletterLabel, newsletterSubtext, newsletterButtonLabel,
  newsletterFirstNameLabel, newsletterLastNameLabel, newsletterEmailLabel,
  newsletterSuccessMessage, newsletterErrorMessage,
  footerRestaurantHoursLabel, footerKitchenHoursLabel, footerContactLabel,
  footerLinks[]{ label, url }
}`;

interface HourEntry {
  days?: string;
  label?: string;
  hours: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterLink {
  label: string;
  url: string;
}

interface SiteSettings {
  address?: string;
  phone?: string;
  email?: string;
  footerDescription?: string;
  restaurantHours?: HourEntry[];
  kitchenHours?: HourEntry[];
  socialLinks?: SocialLink[];
  newsletterLabel?: string;
  newsletterSubtext?: string;
  newsletterButtonLabel?: string;
  newsletterFirstNameLabel?: string;
  newsletterLastNameLabel?: string;
  newsletterEmailLabel?: string;
  newsletterSuccessMessage?: string;
  newsletterErrorMessage?: string;
  footerRestaurantHoursLabel?: string;
  footerKitchenHoursLabel?: string;
  footerContactLabel?: string;
  footerLinks?: FooterLink[];
}

const defaultRestaurantHours: HourEntry[] = [
  { days: "Mandag - Torsdag", hours: "11:30 - 23:00" },
  { days: "Fredag - Lørdag", hours: "11:30 - 00:00" },
  { days: "Søndag", hours: "11:30 - 22:00" },
];

const defaultKitchenHours: HourEntry[] = [
  { label: "Frokost", hours: "11:30 - 16:00" },
  { label: "Aften", hours: "17:00 - 21:30" },
  { label: "Brunch (Lør-Søn)", hours: "10:00 - 13:00" },
];

export default async function Footer() {
  const { data: siteSettings } = (await sanityFetch({
    query: FOOTER_QUERY,
  })) as { data: SiteSettings | null };

  const restaurantHours = siteSettings?.restaurantHours?.length
    ? siteSettings.restaurantHours
    : defaultRestaurantHours;

  const kitchenHours = siteSettings?.kitchenHours?.length
    ? siteSettings.kitchenHours
    : defaultKitchenHours;

  const instagramUrl =
    siteSettings?.socialLinks?.find(
      (l) => l.platform?.toLowerCase() === "instagram",
    )?.url || "#";

  const facebookUrl =
    siteSettings?.socialLinks?.find(
      (l) => l.platform?.toLowerCase() === "facebook",
    )?.url || "#";

  return (
    <>
      <NewsletterSection
        label={siteSettings?.newsletterLabel ?? undefined}
        subtext={siteSettings?.newsletterSubtext ?? undefined}
        buttonLabel={siteSettings?.newsletterButtonLabel ?? undefined}
        firstNameLabel={siteSettings?.newsletterFirstNameLabel ?? undefined}
        lastNameLabel={siteSettings?.newsletterLastNameLabel ?? undefined}
        emailLabel={siteSettings?.newsletterEmailLabel ?? undefined}
        successMessage={siteSettings?.newsletterSuccessMessage ?? undefined}
        errorMessage={siteSettings?.newsletterErrorMessage ?? undefined}
      />
      <footer className="bg-warm-gray border-t border-[rgba(231,229,228,0.1)]">
        <div className="max-w-[1280px] mx-auto px-12 pt-20 pb-10">
          {/* 4-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
            {/* Col 1 – Brand */}
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-baseline">
                <span className="text-xl text-[#292524] font-newsreader font-extralight">
                  Allégade
                </span>
                <span className="text-xl ml-1 text-[#292524] font-cormorant font-light italic">
                  10
                </span>
              </Link>

              <p className="text-[#78716c] text-sm font-light leading-[22px] tracking-[0.35px]">
                {siteSettings?.footerDescription ||
                  "Heritage & Hospitality since 1797. En Frederiksberg institution dedikeret til kvalitet og tradition."}
              </p>

              {/* Social icons */}
              <div className="flex gap-4">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 border border-[#d6d3d1] rounded-full flex items-center justify-center text-[#78716c] hover:border-brand hover:text-brand transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 border border-[#d6d3d1] rounded-full flex items-center justify-center text-[#78716c] hover:border-brand hover:text-brand transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </div>
            </div>

            {/* Col 2 – Restaurant hours */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[#292524] text-[12px] tracking-[1.2px] uppercase font-light">
                {siteSettings?.footerRestaurantHoursLabel ?? "Restaurant Timer"}
              </h4>
              <ul className="flex flex-col gap-4">
                {restaurantHours.map((entry, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[#78716c] text-sm font-light">
                      {entry.days || entry.label}
                    </span>
                    <span className="text-[#78716c] text-sm font-light shrink-0">
                      {entry.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 – Kitchen hours */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[#292524] text-[12px] tracking-[1.2px] uppercase font-light">
                {siteSettings?.footerKitchenHoursLabel ?? "Køkken Timer"}
              </h4>
              <ul className="flex flex-col gap-4">
                {kitchenHours.map((entry, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-[#78716c] text-sm font-light">
                      {entry.label || entry.days}
                    </span>
                    <span className="text-[#78716c] text-sm font-light shrink-0">
                      {entry.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 – Contact */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[#292524] text-[12px] tracking-[1.2px] uppercase font-light">
                {siteSettings?.footerContactLabel ?? "Kontakt"}
              </h4>
              <div className="flex flex-col gap-4 text-[#78716c] text-sm font-light">
                {siteSettings?.address ? (
                  <p className="leading-5 whitespace-pre-line">
                    {siteSettings.address}
                  </p>
                ) : (
                  <p className="leading-5">
                    Allégade 10
                    <br />
                    2000 Frederiksberg
                  </p>
                )}
                {siteSettings?.phone ? (
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="hover:text-brand transition-colors"
                  >
                    Tlf: {siteSettings.phone}
                  </a>
                ) : (
                  <span>Tlf: +45 33 31 17 97</span>
                )}
                {siteSettings?.email ? (
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="hover:text-brand transition-colors"
                  >
                    Email: {siteSettings.email}
                  </a>
                ) : (
                  <span>Email: info@allegade10.dk</span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[rgba(214,211,209,0.2)] pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-[#a8a29e] text-[10px] tracking-[1px] uppercase font-light">
              © Allégade 10
            </p>
            <div className="flex gap-8">
              {(siteSettings?.footerLinks && siteSettings.footerLinks.length > 0
                ? siteSettings.footerLinks
                : [
                    { label: "Kontakt", url: "/kontakt" },
                    { label: "Privatlivspolitik", url: "/privatlivspolitik" },
                  ]
              ).map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-[#a8a29e] text-[10px] tracking-[1px] uppercase font-light hover:text-brand transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

