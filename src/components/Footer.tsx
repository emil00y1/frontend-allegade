import Link from "next/link";
import {
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Twitter,
  Mail,
  type LucideIcon,
} from "lucide-react";
import NewsletterSection from "@/components/NewsletterSection";
import { sanityFetch } from "@/sanity/lib/live";

const FOOTER_QUERY = `*[_type == "siteSettings"][0]{
  address, phone, email, cvr, footerDescription, socialLinks,
  restaurantHours, kitchenClosingNote,
  newsletterLabel, newsletterSubtext, newsletterButtonLabel,
  newsletterFirstNameLabel, newsletterLastNameLabel, newsletterEmailLabel,
  newsletterSuccessMessage, newsletterErrorMessage,
  footerRestaurantHoursLabel, footerContactLabel,
  footerLinks[]{ label, url },
  logoText,
  "logoImageUrl": logoImage.asset->url
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
  kitchenClosingNote?: string;
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
  footerContactLabel?: string;
  cvr?: string;
  footerLinks?: FooterLink[];
  logoText?: string;
  logoImageUrl?: string;
}

const defaultRestaurantHours: HourEntry[] = [
  { days: "Mandag til Fredag", hours: "11.00 - 22.00" },
  { days: "Lørdag", hours: "10.00 - 22.00" },
  { days: "Søndag", hours: "10.00 - 21.00" },
];

const platformIcons: Record<string, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
  x: Twitter,
  mail: Mail,
};

export default async function Footer() {
  const { data: siteSettings } = (await sanityFetch({
    query: FOOTER_QUERY,
  })) as { data: SiteSettings | null };

  const restaurantHours = siteSettings?.restaurantHours?.length
    ? siteSettings.restaurantHours
    : defaultRestaurantHours;

  const socialLinks = siteSettings?.socialLinks || [];

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
        <div className="max-w-7xl mx-auto px-12 pt-16 pb-6">
          {/* 4-col grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-12">
            {/* Col 1 – Brand */}
            <div className="flex flex-col gap-6">
              <Link href="/" className="flex items-center gap-3">
                {siteSettings?.logoImageUrl && (
                  <img
                    src={siteSettings.logoImageUrl}
                    alt={siteSettings.logoText || "Allégade 10"}
                    className="h-8 w-auto object-contain"
                  />
                )}
                {(!siteSettings?.logoImageUrl || siteSettings?.logoText) && (
                  <div className="flex items-baseline">
                    {siteSettings?.logoText ? (
                      <span className="text-xl text-[#292524] font-newsreader font-extralight">
                        {siteSettings.logoText}
                      </span>
                    ) : (
                      <>
                        <span className="text-xl text-[#292524] font-newsreader font-extralight">
                          Allégade
                        </span>
                        <span className="text-xl ml-1 text-[#292524] font-cormorant font-light italic">
                          10
                        </span>
                      </>
                    )}
                  </div>
                )}
              </Link>

              <p className="text-[#78716c] text-sm font-normal leading-[22px] tracking-[0.35px]">
                {siteSettings?.footerDescription ||
                  "Heritage & Hospitality since 1797. En Frederiksberg institution dedikeret til kvalitet og tradition."}
              </p>

              {/* Social icons */}
              <div className="flex gap-4">
                {socialLinks.map((link, i) => {
                  const Icon =
                    platformIcons[link.platform?.toLowerCase()] || Instagram;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="w-8 h-8 border border-[#d6d3d1] rounded-full flex items-center justify-center text-[#78716c] hover:border-brand hover:text-brand transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Col 2 – Restaurant hours */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[#292524] text-[12px] tracking-[1.2px] uppercase font-light">
                {siteSettings?.footerRestaurantHoursLabel ?? "Restaurant"}
              </h4>
              <div className="flex flex-col gap-4">
                <ul className="flex flex-col gap-4">
                  {restaurantHours.map((entry, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-[#78716c] text-sm font-normal">
                        {entry.days || entry.label}
                      </span>
                      <span className="text-[#78716c] text-sm font-normal shrink-0">
                        {entry.hours}
                      </span>
                    </li>
                  ))}
                </ul>
                {(siteSettings?.kitchenClosingNote ||
                  "Køkkenet lukker 20:30") && (
                  <p className="text-[#a8a29e] text-xs font-light">
                    {siteSettings?.kitchenClosingNote ??
                      "Køkkenet lukker 20:30"}
                  </p>
                )}
              </div>
            </div>

            {/* Col 3 – Contact */}
            <div className="flex flex-col gap-8">
              <h4 className="text-[#292524] text-[12px] tracking-[1.2px] uppercase font-light">
                {siteSettings?.footerContactLabel ?? "Kontakt"}
              </h4>
              <div className="flex flex-col gap-4 text-[#78716c] text-sm font-normal">
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
              © Allégade 10{siteSettings?.cvr ? ` · CVR: ${siteSettings.cvr}` : ''}
            </p>
            <div className="flex gap-8">
              {(siteSettings?.footerLinks && siteSettings.footerLinks.length > 0
                ? siteSettings.footerLinks
                : [
                    { label: "Kontakt", url: "/kontakt" },
                    { label: "Privatlivspolitik", url: "/privatlivspolitik" },
                    { label: "Cookiepolitik", url: "/cookiepolitik" },
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
