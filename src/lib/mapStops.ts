// Each stop's <MapLink q="..." /> tag in an MDX body is the single source of
// truth for that stop's location - this scans the raw content for them (in
// document order) so page.tsx can build one combined route link without the
// author ever having to retype the list separately. Runs on the raw string,
// before MDXRemote parses it, so it isn't subject to next-mdx-remote/rsc
// silently dropping array-valued JSX props (see src/lib/affiliate.ts's
// sibling gotcha note) - there's no array in the .mdx source at all.
// Shared by both content/articles and content/collections pages.
export function extractMapStops(content: string): string[] {
  return [...content.matchAll(/<MapLink\s+q="([^"]*)"\s*\/>/g)].map((match) => match[1]);
}
