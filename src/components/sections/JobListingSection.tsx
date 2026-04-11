"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "@/sanity/client";

type Job = {
  _id: string;
  title: string;
  slug: { current: string };
  employmentType?: string;
  location?: string;
  description?: string;
};

type JobListingSectionProps = {
  heading?: string;
  emptyStateText?: string;
};

const JOBS_QUERY = `*[_type == "jobPosting" && isActive == true && (!defined(publishAt) || publishAt <= now()) && (!defined(unpublishAt) || unpublishAt > now())] | order(publishedAt desc){
  _id,
  title,
  slug,
  employmentType,
  location,
  description
}`;

export default function JobListingSection({
  heading = "Ledige stillinger",
  emptyStateText = "Vi har ingen ledige stillinger lige nu.",
}: JobListingSectionProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch(JOBS_QUERY)
      .then((data) => setJobs(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-14 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-5 text-center">
            {heading}
          </h2>
        )}

        <div className="w-10 h-px bg-stone-300 mx-auto mb-12" />

        {loading ? (
          <p className="text-stone-400 text-center text-lg font-light">
            Indlæser...
          </p>
        ) : !jobs.length ? (
          <p className="text-stone-500 text-center text-lg font-light">
            {emptyStateText}
          </p>
        ) : (
          <div className="space-y-0 border-t border-[rgba(221,193,179,0.3)]">
            {jobs.map((job) => (
              <Link
                key={job._id}
                href={`/karriere/${job.slug?.current}`}
                className="block border-b border-[rgba(221,193,179,0.3)] py-8 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-light text-stone-900 group-hover:text-stone-600 transition-colors">
                      {job.title}
                    </h3>
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
                </div>
                {job.description && (
                  <p className="mt-3 text-stone-600 text-sm font-light leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
