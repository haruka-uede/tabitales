import {
  getBookAffiliateLink,
  getHotelAffiliateLink,
  getTourAffiliateLink,
} from "@/lib/affiliate";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
    <div className="pt-6 mt-8 not-prose">
      <Separator className="mb-6" />
      <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Plan your trip
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Button key={link.href} variant="outline" render={<a href={link.href} target="_blank" rel="sponsored noopener" />}>
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
