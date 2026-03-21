import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/client";

const { projectId, dataset } = client.config();

const builder = imageUrlBuilder({ projectId: projectId!, dataset: dataset! });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
