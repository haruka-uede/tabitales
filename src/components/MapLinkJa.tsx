import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MapLinkJa({ q }: { q: string }) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  return (
    <Button
      variant="outline"
      size="sm"
      className="not-prose my-2"
      nativeButton={false}
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      <MapPin />
      Googleマップで見る
    </Button>
  );
}
