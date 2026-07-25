import Link from "next/link";

// Rendered unconditionally by the JA article template, immediately after
// <h1> and above the fold - unlike AffiliateDisclosureNoteJa (bottom of
// article, MDX-embedded), this is what does the legal work under Japan's
// stealth-marketing rules (ステマ規制, 景品表示法, since Oct 2023), which
// require an ad to be immediately recognizable, not just linked from a
// separate disclosure page. Wording/placement is a starting mechanism, not
// legal sign-off - verify against current 消費者庁 guidance before launch.
export default function AffiliateDisclosureBannerJa() {
  return (
    <div className="not-prose mb-6 rounded-md border border-border bg-muted px-4 py-2 text-sm font-medium">
      【PR】本記事には広告（アフィリエイトリンク）が含まれます。
      <Link href="/ja/disclosure" className="underline ml-1">
        詳細
      </Link>
    </div>
  );
}
