import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/lib/image";
import StructuredData from "@/components/StructuredData";

const JOB_QUERY = `*[_type == "jobPosting" && slug.current == $slug && isActive == true && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())][0]{
  _id,
  title,
  slug,
  seo,
  employmentType,
  location,
  description,
  body,
  applicationEmail,
  applicationUrl,
  deadline,
  publishedAt,
  isActive
}`;

const ALL_JOBS_QUERY = `*[_type == "jobPosting" && defined(slug.current)]{ "slug": slug.current }`;

export async function generateStaticParams() {
  const jobs = await client.fetch(ALL_JOBS_QUERY);
  return (jobs || []).map((job: any) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: job } = await sanityFetch<any>({ query: JOB_QUERY, params: { slug } });

  if (!job) return { title: "Karriere | Allégade 10" };

  const seo = job.seo;
  const title = seo?.metaTitle || job.title || "Jobopslag";
  const description = seo?.metaDescription || job.description || undefined;
  const ogImage = seo?.shareImage
    ? urlFor(seo.shareImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${title} | Allégade 10`,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function JobPostingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: job } = await sanityFetch<any>({ query: JOB_QUERY, params: { slug } });

  if (!job) {
    notFound();
  }

  const deadlineStr = job.deadline
    ? new Date(job.deadline).toLocaleDateString("da-DK", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const applyUrl = job.applicationUrl || (job.applicationEmail ? `mailto:${job.applicationEmail}` : null);

  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    ...(job.description && { description: job.description }),
    ...(job.publishedAt && { datePosted: job.publishedAt }),
    ...(job.deadline && { validThrough: job.deadline }),
    employmentType: job.employmentType === "fuldtid" ? "FULL_TIME" : "PART_TIME",
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Allégade 10",
        addressLocality: job.location || "Frederiksberg",
        postalCode: "2000",
        addressCountry: "DK",
      },
    },
    hiringOrganization: {
      "@type": "Organization",
      name: "Allégade 10",
      sameAs: "https://allegade10.dk",
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <StructuredData data={jobPostingSchema} />
      <section className="py-14 md:py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-16">
          <Link
            href="/karriere"
            className="text-xs tracking-[0.2em] uppercase font-medium text-stone-500 hover:text-stone-900 transition-colors mb-10 inline-block"
          >
            &larr; Alle stillinger
          </Link>

          <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-6">
            {job.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8">
            {job.employmentType && (
              <span className="bg-[#f5f0e8] text-stone-700 text-xs tracking-[0.15em] uppercase font-medium px-4 py-2">
                {job.employmentType === "fuldtid" ? "Fuldtid" : "Deltid"}
              </span>
            )}
            {job.location && (
              <span className="bg-[#f5f0e8] text-stone-700 text-xs tracking-[0.15em] uppercase font-medium px-4 py-2">
                {job.location}
              </span>
            )}
            {deadlineStr && (
              <span className="bg-[#f5f0e8] text-stone-700 text-xs tracking-[0.15em] uppercase font-medium px-4 py-2">
                Frist: {deadlineStr}
              </span>
            )}
          </div>

          <div className="w-10 h-px bg-stone-300 mb-10" />

          {Array.isArray(job.body) && job.body.length > 0 && (
            <div className="prose prose-base prose-stone max-w-none font-light leading-relaxed prose-p:text-stone-600 prose-headings:font-serif prose-headings:font-light mb-14">
              <PortableText value={job.body} />
            </div>
          )}

          {applyUrl && (
            <a
              href={applyUrl}
              className="inline-flex items-center gap-3 border border-stone-900 text-stone-900 px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-stone-900 hover:text-white group"
            >
              Ansøg nu
              <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                &rarr;
              </span>
            </a>
          )}
        </div>
      </section>
    </main>
  );
}
