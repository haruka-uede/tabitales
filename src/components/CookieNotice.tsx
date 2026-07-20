"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";
import { Button } from "@/components/ui/button";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so consent must be read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "declined") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background z-20">
      <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <p className="flex-1">
          This site uses cookies for analytics and affiliate link tracking. See our{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <Button variant="ghost" onClick={() => choose("declined")}>
            Decline
          </Button>
          <Button onClick={() => choose("accepted")}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
