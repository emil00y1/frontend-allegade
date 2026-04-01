/**
 * GROQ fragment for fetching all page-builder section types.
 * Include this inside a document projection to fetch the `sections` array.
 */
export const SECTIONS_QUERY_FRAGMENT = `
  sections[]{
    _key,
    _type,
    ...,
    image{ ..., asset-> },
    backgroundImage{ ..., asset-> },
    images[]{ ..., asset-> },
    members[]{ ..., image{ ..., asset-> } },
    testimonials[]{ ..., image{ ..., asset-> } },
    offers[]{ ..., image{ ..., asset-> } },
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
    }
  }
`;
