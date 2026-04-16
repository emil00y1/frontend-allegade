"use client";

import Image, { type ImageProps } from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { dimensionsFromRef, lqipFromImage, urlFor } from "@/sanity/lib/image";

type AnySanitySource = SanityImageSource & {
  asset?: { _ref?: string; _id?: string; metadata?: { lqip?: string } } | null;
};

type BaseProps = {
  image: AnySanitySource | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

type FixedProps = BaseProps & {
  width: number;
  height?: number;
  fill?: false;
};

type FillProps = BaseProps & {
  fill: true;
  width?: never;
  height?: never;
};

type Props = FixedProps | FillProps;

function getRef(src: AnySanitySource | null | undefined): string | undefined {
  if (!src) return undefined;
  const asset = (src as { asset?: { _ref?: string; _id?: string } }).asset;
  return asset?._ref ?? asset?._id ?? undefined;
}

export function SanityImage(props: Props) {
  const { image, alt, className, sizes, priority, quality } = props;
  if (!image) return null;

  const dims = dimensionsFromRef(getRef(image));
  const lqip = lqipFromImage(image);

  const common: Partial<ImageProps> = {
    alt: alt ?? "",
    className,
    sizes: sizes ?? (props.fill ? "100vw" : undefined),
    priority,
    quality: quality ?? 80,
    ...(lqip ? { placeholder: "blur" as const, blurDataURL: lqip } : {}),
  };

  // Custom loader: lets next/image pick the width from the device's srcset and
  // hand it to us; we generate the exact Sanity URL for that width.
  const loader: ImageProps["loader"] = ({ width, quality: q }) =>
    urlFor(image).width(width).quality(q ?? 80).url();

  if (props.fill) {
    return <Image {...(common as ImageProps)} loader={loader} src={urlFor(image).url()} fill alt={common.alt ?? ""} />;
  }

  const width = props.width;
  const height =
    props.height ??
    (dims ? Math.round((width * dims.height) / dims.width) : Math.round(width * 0.75));

  return (
    <Image
      {...(common as ImageProps)}
      loader={loader}
      src={urlFor(image).width(width).url()}
      width={width}
      height={height}
      alt={common.alt ?? ""}
    />
  );
}
