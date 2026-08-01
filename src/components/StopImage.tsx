import Image from "next/image";

// Sourced from Wikimedia Commons (CC0/CC-BY/CC-BY-SA only - never an
// unlicensed or fair-use image) rather than a stock-photo API, so a real,
// specific photo of the named place exists rather than a generic travel
// stock shot - see the credit line's link back to the file's own Commons
// page, which is where the license and full attribution chain live.
export default function StopImage({
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
        Photo:{" "}
        <a href={creditUrl} target="_blank" rel="noopener noreferrer" className="underline">
          {credit}
        </a>{" "}
        / Wikimedia Commons
      </figcaption>
    </figure>
  );
}
