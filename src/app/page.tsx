import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import Hero from "@/components/Hero";
import { sanityFetch } from "@/sanity/lib/live";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export default async function IndexPage() {
  const { data: posts } = await sanityFetch<SanityDocument[]>({ query: POSTS_QUERY });

  return (
    <main className="min-h-screen">
      <Hero />
      
      <section className="container mx-auto max-w-4xl px-6 py-20">
        <h2 className="text-3xl font-serif font-medium mb-12 text-center text-gray-900">Seneste Nyheder og Indlæg</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <li className="group block h-full" key={post._id}>
              <Link href={`/${post.slug.current}`} className="block h-full border border-gray-100 p-6 rounded-2xl hover:shadow-xl hover:border-transparent transition-all duration-300 bg-white">
                <h3 className="text-xl font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-500 font-light">{new Date(post.publishedAt).toLocaleDateString()}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Læs mere 
                  <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
