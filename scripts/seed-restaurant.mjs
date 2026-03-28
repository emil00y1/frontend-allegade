/**
 * Seed script — populates restaurantPage + siteSettings.restaurantHours
 * Run: node scripts/seed-restaurant.mjs
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skwGsVmHb4PIRpvTyJFm0jW5TkYwsvBe1nX2bzLjNr6ygDKweiLAMkrHwGLpLsqPdlv0QmG6vA2k9xT47gI4hbYfw2RdIfAvvN7mEpLM192FxQaMkVVA0MD9zHBdo7FNh4KzM6Md2o1mYbfkmZ3wVrjNWwmX2cuIkTcS7A6KzGvRDCEMiWQI",
  useCdn: false,
});

// ─── Restaurant page ───────────────────────────────────────────────────────────

const restaurantPage = {
  _id: "restaurantPage",
  _type: "restaurantPage",

  // Hero
  heroBadge: "Klassisk Dansk Gastronomi",
  heroHeading: "Mad, atmosfære og",
  heroHeadingItalic: "gode øjeblikke",
  heroDescription:
    "I de historiske stuer på Allégade 10 serverer vi klassisk dansk køkken med respekt for råvarerne og sæsonen. Kom til brunch, frokost eller middag og oplev atmosfæren siden 1780.",
  heroBookCtaLabel: "Book bord",
  heroMenuCtaLabel: "Se menukort",
  heroMenuCtaUrl: "/menukort",

  // Story
  storyEyebrow: "Vores Restaurant",
  storyHeading: "Et sted hvor maden og stemningen taler for sig selv",
  storyBody:
    "Vi laver mad med respekt for den klassiske danske madtradition. Fra det gennemtænkte smørrebrød til aftenens omhyggeligt sammensatte menu — vi arbejder med sæsonens råvarer og lader dem tale for sig selv.\n\nSiden 1780 har Allégade 10 været samlingspunkt for Frederiksbergs borgere. Det er en arv vi tager alvorligt — og en atmosfære du mærker, så snart du træder ind ad døren.",
  storyStats: [
    { _key: "s1", value: "Siden 1780", label: "Del af Frederiksbergs historie" },
    { _key: "s2", value: "Op til 120", label: "Gæster i vores sale" },
    { _key: "s3", value: "Dagligt", label: "Åbent til brunch, frokost & aften" },
  ],

  // Menu teaser
  menuTeaserEyebrow: "Menukort",
  menuTeaserHeading: "Noget for enhver lejlighed",
  menuTeaserDescription:
    "Vi serverer hele dagen — fra weekend brunch til klassisk frokost og aftenens lidt mere festlige menu.",
  menuServices: [
    {
      _key: "brunch",
      title: "Brunch",
      timeLabel: "Lørdag & Søndag 10:00–13:00",
      description:
        "Start weekenden med vores hjemmelavede brunch — fra æg og bacon til friske, sprøde brød og årstidens frugt.",
      priceFrom: 199,
      priceLabel: "pr. person",
    },
    {
      _key: "frokost",
      title: "Frokost",
      timeLabel: "Mandag–Søndag 11:30–16:00",
      description:
        "Klassisk dansk frokost med smørrebrød i top — fra sild og stjerneskud til hjemmelavet leverpostej og roastbeef.",
      priceFrom: 89,
      priceLabel: "pr. stk. smørrebrød",
    },
    {
      _key: "aften",
      title: "Aftenmenu",
      timeLabel: "Dagligt fra 17:00",
      description:
        "Aftenens menu veksler med sæsonen og byder på to- og treretter med fokus på lokale råvarer og klassiske tilberedninger.",
      priceFrom: 285,
      priceLabel: "pr. person (2 retter)",
    },
  ],
  menuCtaLabel: "Se det fulde menukort",
  menuCtaUrl: "/menukort",

  // Philosophy
  philosophyQuote: "Vi laver ikke mad for at imponere. Vi laver mad for at glæde.",
  philosophyAttribution: "Køkkenchef, Allégade 10",

  // Gallery
  galleryHeading: "Stemningen på Allégade 10",
};

// ─── Site settings patch (restaurant hours) ───────────────────────────────────

const restaurantHours = [
  { _key: "h1", days: "Mandag – Torsdag", hours: "11:30 – 23:00" },
  { _key: "h2", days: "Fredag – Lørdag", hours: "11:30 – 00:00" },
  { _key: "h3", days: "Søndag", hours: "11:30 – 22:00" },
];

async function seed() {
  console.log("Seeding restaurantPage…");
  await client.createOrReplace(restaurantPage);
  console.log("✓ restaurantPage seeded");

  console.log("Patching siteSettings.restaurantHours…");
  await client
    .patch("siteSettings")
    .setIfMissing({ restaurantHours: [] })
    .set({ restaurantHours })
    .commit();
  console.log("✓ siteSettings.restaurantHours seeded");

  console.log("\nDone! Reload the Visual Editor to see changes.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
