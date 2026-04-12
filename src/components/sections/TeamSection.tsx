import { SanityImage } from "@/components/SanityImage";
import { dataAttr } from "@/sanity/lib/visual-editing";

type TeamMember = {
  _key: string;
  name?: string;
  role?: string;
  bio?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
};

type TeamSectionProps = {
  _key?: string;
  documentId?: string;
  documentType?: string;
  heading?: string;
  description?: string;
  members?: TeamMember[];
};

export default function TeamSection({
  _key,
  documentId,
  documentType,
  heading,
  description,
  members,
}: TeamSectionProps) {
  if (!members?.length) return null;

  return (
    <section className="bg-white py-14 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-16">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl xl:text-5xl font-light leading-[1.1] text-stone-900 mb-5 text-center">
            {heading}
          </h2>
        )}

        {description && (
          <p className="text-stone-600 text-base md:text-lg font-light leading-relaxed text-center max-w-2xl mx-auto mb-14">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {members.map((member) => (
            <div key={member._key} className="text-center">
              {member.image?.asset && (
                <div
                  className="aspect-square relative mb-5 overflow-hidden"
                  data-sanity={dataAttr(documentId, documentType, `sections[_key=="${_key}"].members[_key=="${member._key}"].image`)}
                >
                  <SanityImage
                    image={member.image}
                    alt={member.name || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              )}

              {member.name && (
                <h3 className="font-serif text-xl font-light text-stone-900 mb-1">
                  {member.name}
                </h3>
              )}

              {member.role && (
                <p className="text-xs tracking-[0.2em] uppercase font-medium text-stone-500 mb-3">
                  {member.role}
                </p>
              )}

              {member.bio && (
                <p className="text-sm text-stone-600 font-light leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
