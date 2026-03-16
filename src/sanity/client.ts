import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "b0bkhf04",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
