"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { SearchEntry } from "@/lib/search";

const TYPE_LABELS: Record<SearchEntry["type"], string> = {
  work: "Works",
  author: "Authors",
  destination: "Destinations",
};

const TYPE_ORDER: SearchEntry["type"][] = ["work", "author", "destination"];

export default function SearchBox({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fuse = useMemo(
    () => new Fuse(index, { keys: ["label", "subtitle"], threshold: 0.4 }),
    [index]
  );

  const results = query.trim() ? fuse.search(query.trim()).slice(0, 8).map((r) => r.item) : [];
  const grouped = TYPE_ORDER.map((type) => ({
    type,
    entries: results.filter((entry) => entry.type === type),
  })).filter((group) => group.entries.length > 0);

  return (
    <div className="relative">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder="Search authors, works, destinations…"
        className="w-40 sm:w-64 text-sm border border-neutral-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-400"
      />
      {open && query.trim() && (
        <div className="absolute right-0 mt-1 w-72 bg-white border border-neutral-200 rounded-md shadow-lg z-10 max-h-96 overflow-auto">
          {grouped.length === 0 ? (
            <p className="px-3 py-3 text-sm text-neutral-500">No matches</p>
          ) : (
            grouped.map(({ type, entries }) => (
              <div key={type} className="py-2">
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {TYPE_LABELS[type]}
                </p>
                {entries.map((entry) => (
                  <Link
                    key={`${entry.type}-${entry.href}-${entry.label}`}
                    href={entry.href}
                    className="block px-3 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    {entry.label}
                    {entry.subtitle && (
                      <span className="text-neutral-400"> — {entry.subtitle}</span>
                    )}
                  </Link>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
