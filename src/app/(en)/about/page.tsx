import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Why Tabi Tales exists, and what the site is (and isn't).",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 prose prose-neutral dark:prose-invert">
      <h1>About Tabi Tales</h1>
      <p>
        Tabi Tales connects Japanese novels to the real places behind them —
        for readers who want to visit Japan through the books they&rsquo;ve
        read.
      </p>

      <h2>Why this site exists</h2>
      <p>
        Tabi Tales is run by a solo, Japan-born writer with a simple itch:
        after finishing a novel set in a real town, temple, or train line,
        the urge to go see it in person — to stand where a character stood —
        never quite goes away. This site exists to make that possible for
        other readers, and to share the parts of Japan worth knowing beyond
        the standard tourist route.
      </p>

      <h2>What Tabi Tales isn&rsquo;t</h2>
      <p>
        Tabi Tales is an independent, unofficial project. It isn&rsquo;t
        affiliated with, endorsed by, or produced in partnership with any
        author, publisher, or rights holder mentioned on the site. Some
        links are affiliate links — see our{" "}
        <Link href="/disclosure">Affiliate Disclosure</Link> for details.
      </p>

      <h2>Get in touch</h2>
      <p>
        Spot something wrong, or want to suggest a book-to-place connection?{" "}
        <Link href="/contact">Contact us</Link>.
      </p>
    </div>
  );
}
