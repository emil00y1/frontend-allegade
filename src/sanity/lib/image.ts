import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";

const { projectId, dataset } = client.config();

const builder = createImageUrlBuilder({ projectId: projectId!, dataset: dataset! });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
