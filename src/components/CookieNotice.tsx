"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function choose(value: "accepted" | "declined") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 inset-x-0 border-t border-neutral-200 bg-white z-20">
      <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
        <p className="flex-1">
          This site uses cookies for analytics and affiliate link tracking. See our{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => choose("declined")}
            className="text-neutral-500 hover:underline"
          >
            Decline
          </button>
          <button
            onClick={() => choose("accepted")}
            className="bg-neutral-900 text-white px-4 py-1.5 rounded-md hover:bg-neutral-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
