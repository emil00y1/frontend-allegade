import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  stega: {
    // Required for visual editing overlays (click-to-edit) to know where to open fields.
    // NEXT_PUBLIC_ prefix makes this available in the browser as well as on the server.
    studioUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
});
