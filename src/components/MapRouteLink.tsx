import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";

// Always bound via the `components` map in a collection page.tsx (with `stops`
// closed over from a regex scan of the raw MDX for <MapLink q="..."> tags),
// never authored directly in .mdx source - so a plain string[] prop is safe
// here even though next-mdx-remote/rsc would otherwise drop it (see
// src/lib/affiliate.ts's sibling gotcha note for why that rule exists).
export default function MapRouteLink({ stops }: { stops: string[] }) {
  if (stops.length < 2) return null;

  const origin = stops[0];
  const destination = stops[stops.length - 1];
  const waypoints = stops.slice(1, -1);

  const href =
    `https://www.google.com/maps/dir/?api=1` +
    `&origin=${encodeURIComponent(origin)}` +
    `&destination=${encodeURIComponent(destination)}` +
    (waypoints.length > 0
      ? `&waypoints=${waypoints.map((w) => encodeURIComponent(w)).join("|")}`
      : "");

  return (
    <Button
      variant="outline"
      size="sm"
      className="not-prose my-4"
      nativeButton={false}
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      <Route />
      See the full route on Google Maps
    </Button>
  );
}
