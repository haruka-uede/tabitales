"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { hasAnalyticsConsent } from "@/lib/consent";

// Affiliate links are one of the three things covered by the cookie
// notice's consent toggle (see CookieNotice.tsx), so without consent this
// renders nothing - BookCard still shows the plain Google Books info
// (title/author/description/thumbnail) around it either way.
export default function BuyBookButton({ href, label }: { href: string; label: string }) {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const checkConsent = () => setConsented(hasAnalyticsConsent());
    checkConsent();
    window.addEventListener("consent-changed", checkConsent);
    return () => window.removeEventListener("consent-changed", checkConsent);
  }, []);

  if (!consented) return null;

  return (
    <Button
      size="sm"
      className="w-fit"
      nativeButton={false}
      render={<a href={href} target="_blank" rel="sponsored noopener" />}
    >
      {label}
    </Button>
  );
}
