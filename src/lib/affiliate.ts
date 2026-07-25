// Set these once, when each affiliate program is approved. Nothing else
// needs to change per-article - PlanYourTrip.tsx reads these plus each
// article's own frontmatter (work/authors/destinations/homeBase) automatically.
const AMAZON_TAG = "";
const BOOKING_AID = "";

type DestinationLinkIds = {
  bookingDestId?: string;
};

// Verified deep-link IDs for specific destinations, from Booking's own
// link-builder tool. Add an entry here once per *region* (not per article)
// to upgrade that region's links from generic search pages to a
// pre-filtered city page. This is the coarse fallback tier - see
// HOME_BASE_LINK_IDS below for the more precise tier. Missing entries fall
// back to a generic link.
const DESTINATION_LINK_IDS: Record<string, DestinationLinkIds> = {};

// Same idea as DESTINATION_LINK_IDS, but keyed by an article's specific
// practical base city (frontmatter `homeBase`, e.g. "Naha") rather than its
// broad region (frontmatter `destinations`, e.g. "Okinawa"). This is the
// precise tier: it's what lets the hotel link point at the city a reader
// would actually book in, instead of an entire region. Populate once per
// city, same manual process as DESTINATION_LINK_IDS.
const HOME_BASE_LINK_IDS: Record<string, DestinationLinkIds> = {};

export function getBookAffiliateLink(work: string, authors: string[]): string | null {
  if (!AMAZON_TAG) return null;
  const query = encodeURIComponent([work, ...authors].join(" "));
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_TAG}`;
}

export function getHotelAffiliateLink(destinations: string[], homeBase?: string): string | null {
  if (!BOOKING_AID) return null;
  const destId =
    (homeBase && HOME_BASE_LINK_IDS[homeBase]?.bookingDestId) ??
    findDestinationLinkId(destinations, "bookingDestId");
  if (destId) {
    return `https://www.booking.com/searchresults.html?aid=${BOOKING_AID}&dest_type=city&dest_id=${destId}`;
  }
  return `https://www.booking.com/index.html?aid=${BOOKING_AID}`;
}

// Booking.com also pays commission on "Attractions" (tours/tickets/experiences),
// so this replaces what used to be a separate Viator integration - one
// program instead of two, same BOOKING_AID once approved. The real
// Attractions search URL/param format hasn't been confirmed yet against
// Booking's own Partner Hub Link Creator, so this intentionally returns null
// rather than guessing - an unverified URL risks not tracking at all, which
// is worse than showing no attractions link.
export function getAttractionsAffiliateLink(
  _destinations: string[],
  _homeBase?: string
): string | null {
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
