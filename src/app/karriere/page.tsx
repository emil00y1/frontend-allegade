import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";

const JOBS_QUERY = `*[_type == "jobPosting" && isActive == true && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())] | order(publishedAt desc){
  _id,
  title,
  slug,
  employmentType,
  location,
  description,
  deadline
}`;

export const metadata: Metadata = {
  title: "Karriere | Allégade 10",
  description: "Se ledige stillinger hos Allégade 10.",
};

export default async function KarrierePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: jobs } = await sanityFetch<any>({ query: JOBS_QUERY });

  return (
    <main className="min-h-screen bg-white">
      <section className="py-14 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 lg:px-16">
          <h1 className="font-serif text-4xl md:text-5xl xl:text-6xl font-light leading-[1.1] text-stone-900 mb-5 text-center">
            Karriere
          </h1>
          <div className="w-10 h-px bg-stone-300 mx-auto mb-12" />

          {!jobs?.length ? (
            <p className="text-stone-500 text-center text-lg font-light">
              Vi har ingen ledige stillinger lige nu. Kig forbi igen snart.
            </p>
          ) : (
            <div className="space-y-0 border-t border-[rgba(221,193,179,0.3)]">
              {jobs.map((job: any) => {
                const deadlineStr = job.deadline
                  ? new Date(job.deadline).toLocaleDateString("da-DK", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : null;

                return (
                  <Link
                    key={job._id}
                    href={`/karriere/${job.slug?.current}`}
                    className="block border-b border-[rgba(221,193,179,0.3)] py-8 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <h2 className="font-serif text-xl md:text-2xl font-light text-stone-900 group-hover:text-stone-600 transition-colors">
                          {job.title}
                        </h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                          {job.employmentType && (
                            <span className="text-xs tracking-[0.15em] uppercase font-medium text-stone-500">
                              {job.employmentType === "fuldtid"
                                ? "Fuldtid"
                                : "Deltid"}
                            </span>
                          )}
                          {job.location && (
                            <span className="text-xs tracking-[0.15em] uppercase font-medium text-stone-400">
                              {job.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {deadlineStr && (
                        <span className="text-xs text-stone-400 shrink-0">
                          Frist: {deadlineStr}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="mt-3 text-stone-600 text-sm font-light leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
