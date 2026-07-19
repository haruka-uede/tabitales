// Set these once, when each affiliate program is approved. Nothing else
// needs to change per-article - PlanYourTrip.tsx reads these plus each
// article's own frontmatter (work/authors/destinations) automatically.
const AMAZON_TAG = "";
const BOOKING_AID = "";
const VIATOR_CAMPAIGN_ID = "";

type DestinationLinkIds = {
  bookingDestId?: string;
  viatorDestId?: string;
};

// Verified deep-link IDs for specific destinations, from each program's own
// link-builder tool. Add an entry here once per *destination* (not per
// article) to upgrade that destination's links from generic search pages
// to a pre-filtered city page. Missing entries fall back to a generic link.
const DESTINATION_LINK_IDS: Record<string, DestinationLinkIds> = {};

export function getBookAffiliateLink(work: string, authors: string[]): string | null {
  if (!AMAZON_TAG) return null;
  const query = encodeURIComponent([work, ...authors].join(" "));
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export function getHotelAffiliateLink(destinations: string[]): string | null {
  if (!BOOKING_AID) return null;
  const destId = findDestinationLinkId(destinations, "bookingDestId");
  if (destId) {
    return `https://www.booking.com/searchresults.html?aid=${BOOKING_AID}&dest_type=city&dest_id=${destId}`;
  }
  return `https://www.booking.com/index.html?aid=${BOOKING_AID}`;
}

// Viator's affiliate links are generated through their own partner tooling
// (currently via impact.com) rather than a plain, guessable URL format.
// Leave this returning null until we're approved and can confirm the real
// link structure from their dashboard - a guessed URL risks not tracking
// at all, which is worse than showing no tour link yet.
export function getTourAffiliateLink(_destinations: string[]): string | null {
  if (!VIATOR_CAMPAIGN_ID) return null;
  return null;
}

function findDestinationLinkId(
  destinations: string[],
  key: keyof DestinationLinkIds
): string | undefined {
  for (let i = destinations.length - 1; i >= 0; i--) {
    const ids = DESTINATION_LINK_IDS[destinations[i]];
    if (ids?.[key]) return ids[key];
  }
  return undefined;
}
