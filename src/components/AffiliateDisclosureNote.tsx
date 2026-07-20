import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function AffiliateDisclosureNote() {
  return (
    <div className="pt-4 mt-8 not-prose">
      <Separator className="mb-4" />
      <p className="text-sm text-muted-foreground">
        Tabi Tales may earn a commission from hotel, tour, and book links on this page at no
        extra cost to you. See our{" "}
        <Link href="/disclosure" className="underline">
          affiliate disclosure
        </Link>{" "}
        for details.
      </p>
    </div>
  );
}
