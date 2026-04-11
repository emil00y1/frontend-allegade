import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookiepolitik | Allégade 10",
  description: "Læs om hvordan Allégade 10 bruger cookies på vores hjemmeside.",
};

export default function CookiepolitikPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <section className="py-14 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-16">
          <h1 className="font-newsreader font-extralight text-4xl md:text-5xl text-dark-stone leading-[1.1] mb-5">
            Cookiepolitik
          </h1>
          <div className="w-10 h-px bg-border-warm mb-12" />

          <div className="prose prose-base max-w-none font-light leading-relaxed text-warm-brown prose-headings:font-newsreader prose-headings:font-extralight prose-headings:text-dark-stone prose-a:text-brand prose-strong:text-dark-stone">
            <p>
              Denne cookiepolitik forklarer, hvad cookies er, hvordan vi bruger
              dem på <strong>allegade10.dk</strong>, og hvilke valgmuligheder du
              har.
            </p>

            <h2>Hvad er cookies?</h2>
            <p>
              Cookies er små tekstfiler, der gemmes på din enhed (computer,
              tablet eller mobiltelefon), når du besøger en hjemmeside. De
              bruges til at huske dine præferencer og til at forstå, hvordan
              besøgende bruger hjemmesiden.
            </p>

            <h2>Hvilke cookies bruger vi?</h2>

            <h3>Nødvendige cookies</h3>
            <p>
              Disse cookies er nødvendige for, at hjemmesiden kan fungere
              korrekt. De kan ikke fravælges. Eksempler inkluderer cookies, der
              husker dit cookiesamtykke.
            </p>

            <table>
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>Formål</th>
                  <th>Varighed</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>cookie-consent</td>
                  <td>Gemmer dit valg om cookies</td>
                  <td>Ubegrænset</td>
                </tr>
              </tbody>
            </table>

            <h3>Statistiske cookies</h3>
            <p>
              Vi bruger statistiske cookies til at indsamle anonyme oplysninger
              om, hvordan besøgende bruger hjemmesiden. Disse data hjælper os med
              at forbedre hjemmesidens indhold og funktionalitet. Statistiske
              cookies sættes kun, hvis du giver samtykke.
            </p>

            <h2>Dit samtykke</h2>
            <p>
              Første gang du besøger vores hjemmeside, bliver du bedt om at
              acceptere eller afvise brugen af cookies. Du kan til enhver tid
              ændre dit valg ved at slette cookies i din browser og genindlæse
              siden.
            </p>

            <h2>Sådan sletter eller blokerer du cookies</h2>
            <p>
              Du kan slette eller blokere cookies via din browsers indstillinger.
              Bemærk, at dette kan påvirke din oplevelse af hjemmesiden. Du
              finder vejledning til de mest brugte browsere her:
            </p>
            <ul>
              <li>
                <strong>Chrome:</strong> Indstillinger → Privatliv og sikkerhed →
                Cookies
              </li>
              <li>
                <strong>Safari:</strong> Indstillinger → Privatliv
              </li>
              <li>
                <strong>Firefox:</strong> Indstillinger → Privatliv og sikkerhed
              </li>
              <li>
                <strong>Edge:</strong> Indstillinger → Cookies og
                webstedstilladelser
              </li>
            </ul>

            <h2>Kontakt</h2>
            <p>
              Har du spørgsmål til vores brug af cookies, er du velkommen til at{" "}
              <Link href="/kontakt">kontakte os</Link>.
            </p>

            <h2>Ændringer</h2>
            <p>
              Vi forbeholder os retten til at opdatere denne cookiepolitik. Ved
              væsentlige ændringer vil du igen blive bedt om samtykke.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
