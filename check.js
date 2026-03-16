const { createClient } = require('next-sanity');

const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function run() {
  const POSTS_QUERY = `*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;
  const posts = await client.fetch(POSTS_QUERY);
  console.log("Posts on homepage:", posts.map(p => p.slug.current));
  
  if (posts.length > 0) {
    const slug = posts[0].slug.current;
    
    // Test the dynamic query
    const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;
    // notice: the original code does NOT await params properly in earlier Next.js, but since Next.js 15 params is a promise. Wait! In node script we just pass an object.
    const post = await client.fetch(POST_QUERY, { slug });
    console.log("Fetched post for slug:", slug, post ? "FOUND" : "NOT FOUND");
  }
}

run().catch(console.error);
