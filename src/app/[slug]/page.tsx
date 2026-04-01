import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { SectionRenderer } from "@/components/sections";
import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";

const PAGE_QUERY = `*[_type == "page" && slug.current == $slug && isPublished == true][0]{
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

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ backToPostsLabel, ctaBookTableUrl }`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await sanityFetch<any>({ query: PAGE_QUERY, params: { slug } });

  if (page) {
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

  const { data: post } = await sanityFetch<any>({ query: POST_QUERY, params: { slug } });
  if (post) {
    return {
      title: `${post.title} | Allégade 10`,
    };
  }

  return { title: "Allégade 10" };
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Try generic page first
  const { data: page } = await sanityFetch<any>({ query: PAGE_QUERY, params: { slug } });

  if (page) {
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

  // Fall back to post
  const { data: post } = await sanityFetch<any>({ query: POST_QUERY, params: { slug } });
  const { data: siteSettings } = await sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
    params: {},
  });

  if (!post) {
    notFound();
  }

  const postImageUrl = post.image
    ? urlFor(post.image).width(550).height(310).url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">
        {siteSettings?.backToPostsLabel ?? "← Tilbage til opslag"}
      </Link>
      {postImageUrl && (
        <Image
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose">
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
