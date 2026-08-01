import Image from "next/image";

// See StopImage.tsx - same Wikimedia Commons sourcing rationale.
export default function StopImageJa({
  src,
  alt,
  credit,
  creditUrl,
}: {
  src: string;
  alt: string;
  credit: string;
  creditUrl: string;
}) {
  return (
    <figure className="not-prose my-4">
      <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg bg-muted">
        <Image src={src} alt={alt} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
      </div>
      <figcaption className="text-xs text-muted-foreground mt-1.5">
        写真:{" "}
        <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {credit}
        </a>{" "}
        / Wikimedia Commons
      </figcaption>
    </figure>
  );
}
