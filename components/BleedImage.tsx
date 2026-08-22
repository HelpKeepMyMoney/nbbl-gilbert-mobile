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
  objectPosition = "center center",
  sizes = "100vw",
  className = "",
}: BleedImageProps) {
  return (
    <div className={`bleed-media ${className}`.trim()}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={priority ? 80 : 72}
        style={{ objectFit: "cover", objectPosition }}
      />
    </div>
  );
}
