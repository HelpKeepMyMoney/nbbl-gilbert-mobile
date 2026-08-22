import type { CSSProperties } from "react";
import Image from "next/image";

type BleedImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  objectPosition?: string;
  sizes?: string;
  className?: string;
};

export default function BleedImage({
  src,
  alt,
  priority = false,
  objectPosition,
  sizes = "100vw",
  className = "",
}: BleedImageProps) {
  return (
    <div
      className={`bleed-media ${className}`.trim()}
      style={
        objectPosition
          ? ({ "--object-position": objectPosition } as CSSProperties)
          : undefined
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={priority ? 82 : 72}
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
