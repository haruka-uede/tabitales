import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";

// See MapRouteLink.tsx - always bound via a collection page.tsx closure, never
// authored directly in .mdx source, so a plain string[] prop is safe here.
export default function MapRouteLinkJa({ stops }: { stops: string[] }) {
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
      全ルートをGoogleマップで見る
    </Button>
  );
}
