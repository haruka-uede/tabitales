import {
  getBookAffiliateLink,
  getHotelAffiliateLink,
  getTourAffiliateLink,
} from "@/lib/affiliate";

export default function PlanYourTrip({
  work,
  authors,
  destinations,
}: {
  work: string;
  authors: string[];
  destinations: string[];
}) {
  const links = [
    { href: getBookAffiliateLink(work, authors), label: `Get the book: ${work}` },
    { href: getHotelAffiliateLink(destinations), label: "Search hotels" },
    { href: getTourAffiliateLink(destinations), label: "Find tours & experiences" },
  ].filter((link): link is { href: string; label: string } => !!link.href);

  if (links.length === 0) return null;

  return (
    <div className="border-t border-neutral-200 pt-6 mt-8 not-prose">
      <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500 mb-3">
        Plan your trip
      </p>
      <ul className="space-y-1 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="sponsored noopener" className="underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
