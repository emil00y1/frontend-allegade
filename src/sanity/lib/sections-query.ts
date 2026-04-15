/**
 * GROQ fragments for fetching all page-builder section types.
 *
 * The image asset projection includes `metadata.lqip` + `metadata.dimensions`
 * so <SanityImage> can feed `placeholder="blur"` and a correct aspect ratio
 * into next/image without an extra request per render.
 */

// Projection applied wherever we need full image asset details.
export const IMAGE_ASSET_PROJECTION = `{
  ...,
  asset->{
    ...,
    metadata { lqip, dimensions }
  }
}`;

// Extra projections shared across section types.
const COMMON_SECTION_PROJECTIONS = `
    image${IMAGE_ASSET_PROJECTION},
    backgroundImage${IMAGE_ASSET_PROJECTION},
    images[]${IMAGE_ASSET_PROJECTION},
    members[]{ ..., image${IMAGE_ASSET_PROJECTION} },
    testimonials[]{ ..., image${IMAGE_ASSET_PROJECTION} },
    offers[]{ ..., image${IMAGE_ASSET_PROJECTION} }
`;

export const SECTIONS_QUERY_FRAGMENT = `
  sections[]{
    _key,
    _type,
    ...,
    ${COMMON_SECTION_PROJECTIONS},
    _type == "reusableBlockReferenceSection" => {
      ...,
      block->{
        content[]{
          ...,
          ${COMMON_SECTION_PROJECTIONS}
        }
      }
    }
  }
`;
