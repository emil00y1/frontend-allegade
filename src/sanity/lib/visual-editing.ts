import { createDataAttribute } from "next-sanity";

const VISUAL_EDITING_CONFIG = {
  projectId: "b0bkhf04",
  dataset: "production",
  baseUrl: process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
} as const;

/**
 * Returns a data-sanity attribute string for the given document and path.
 * Returns undefined if documentId or documentType are not provided,
 * which causes React to omit the attribute entirely.
 */
export function dataAttr(
  documentId: string | undefined,
  documentType: string | undefined,
  path: string,
): string | undefined {
  if (!documentId || !documentType) return undefined;
  return createDataAttribute({
    ...VISUAL_EDITING_CONFIG,
    id: documentId,
    type: documentType,
    path,
  }).toString();
}
