import Link from "next/link";

export default function AffiliateDisclosureNote() {
  return (
    <p className="text-sm text-neutral-500 border-t border-neutral-200 pt-4 mt-8">
      Tabi Tales may earn a commission from hotel, tour, and book links on this page at no
      extra cost to you. See our{" "}
      <Link href="/disclosure" className="underline">
        affiliate disclosure
      </Link>{" "}
      for details.
    </p>
  );
}
