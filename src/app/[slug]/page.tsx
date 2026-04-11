import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug && isPublished == true && (!defined(publishAt) || publishAt <= now())][0]{
  _id,
  _type,
  title,
  seo,
  sections[]{
    ...,
    _type == "textImageSection" => {
      ...,
      image{ ..., asset-> }
    },
    _type == "bannerSection" => {
      ...,
      backgroundImage{ ..., asset-> }
    },
    _type == "gallerySection" => {
      ...,
      images[]{ ..., asset-> }
    },
    _type == "reusableBlockReferenceSection" => {
      ...,
      block->{
        content[]{
          ...,
          image{ ..., asset-> },
          backgroundImage{ ..., asset-> },
          images[]{ ..., asset-> },
          members[]{ ..., image{ ..., asset-> } },
          testimonials[]{ ..., image{ ..., asset-> } },
          offers[]{ ..., image{ ..., asset-> } }
        }
      }
    },
    image{ ..., asset-> },
    backgroundImage{ ..., asset-> },
    images[]{ ..., asset-> },
    members[]{ ..., image{ ..., asset-> } },
    testimonials[]{ ..., image{ ..., asset-> } },
    offers[]{ ..., image{ ..., asset-> } }
  }
}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await sanityFetch<any>({ query: PAGE_QUERY, params: { slug } });

  if (!page) return { title: "Allégade 10" };

  const seo = page.seo;
  const title = seo?.metaTitle || page.title || "Side";
  const description = seo?.metaDescription || undefined;
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

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: page } = await sanityFetch<any>({ query: PAGE_QUERY, params: { slug } });

  if (!page) notFound();

  return (
    <main>
      <SectionRenderer
        documentId={page._id}
        documentType={page._type}
        sections={page.sections}
      />
    </main>
  );
}
