/* ============================================================
   HORNER REALTY KC — Listings data layer
   Seed data ships with the site; the admin panel saves edits
   to localStorage, which overrides the seed for this browser.
   ============================================================ */

const HR_STORE_KEY = "hr_listings_v1";

/* The four sold properties are Horner Realty's real closed
   transactions (photos included locally). The "for-sale" items
   are placeholder inventory — replace them via the admin panel. */
const HR_SEED_LISTINGS = [
  {
    id: "seed-active-1",
    status: "for-sale",
    address: "4812 W 71st Terrace",
    city: "Prairie Village",
    state: "KS",
    zip: "66208",
    price: 489000,
    beds: 4,
    baths: 3,
    sqft: 2540,
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=1200&q=80",
    description: "Sun-filled two-story on a quiet, tree-lined street. Renovated kitchen with quartz island, hardwoods throughout the main level, and a finished lower level made for movie nights.",
    featured: true
  },
  {
    id: "seed-active-2",
    status: "for-sale",
    address: "2207 NE Chesapeake Drive",
    city: "Lee's Summit",
    state: "MO",
    zip: "64086",
    price: 415000,
    beds: 3,
    baths: 2.5,
    sqft: 2210,
    image: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=1200&q=80",
    description: "Crisp, modern ranch with vaulted great room, covered deck overlooking greenspace, and a primary suite that feels like a retreat. Minutes to downtown Lee's Summit.",
    featured: true
  },
  {
    id: "seed-active-3",
    status: "pending",
    address: "10406 Hayes Street",
    city: "Overland Park",
    state: "KS",
    zip: "66212",
    price: 365000,
    beds: 3,
    baths: 2,
    sqft: 1860,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
    description: "Charming updated split-level near parks, shops, and an easy commute anywhere in the metro. Fresh paint, new flooring, and a fenced backyard ready for summer.",
    featured: true
  },
  {
    id: "seed-sold-1",
    status: "sold",
    address: "19979 139th Street",
    city: "Basehor",
    state: "KS",
    zip: "66007",
    price: null,
    beds: 4,
    baths: 3,
    sqft: 2296,
    image: "assets/img/listings/sold-1.jpg",
    description: "A private 12.67-acre retreat on a peaceful paved dead-end road, backing to Wolf Creek with its own pond — custom-built home with finished walkout basement and dedicated home office, minutes from The Legends.",
    featured: false
  },
  {
    id: "seed-sold-2",
    status: "sold",
    address: "17065 W 162nd Street",
    city: "Olathe",
    state: "KS",
    zip: "66062",
    price: null,
    beds: 5,
    baths: 4,
    sqft: 3498,
    image: "assets/img/listings/sold-2.jpg",
    description: "Gorgeous corner-lot home in coveted Arbor Landing — open chef's kitchen with island and hearth room, two fireplaces, formal dining, and over 3,400 sq ft made for entertaining.",
    featured: false
  },
  {
    id: "seed-sold-3",
    status: "sold",
    address: "7815 Benson Street",
    city: "Overland Park",
    state: "KS",
    zip: "66204",
    price: null,
    beds: 2,
    baths: 1,
    sqft: 788,
    image: "assets/img/listings/sold-3.jpg",
    description: "A quaint half-acre lot steps from old downtown Overland Park — a private backyard oasis with easy equity potential and a quick commute to the Plaza and downtown.",
    featured: false
  },
  {
    id: "seed-sold-4",
    status: "sold",
    address: "900 SW Sara Circle",
    city: "Lee's Summit",
    state: "MO",
    zip: "64081",
    price: null,
    beds: 3,
    baths: 3,
    sqft: 3284,
    image: "assets/img/listings/sold-4.jpg",
    description: "Meticulously maintained and bathed in natural light — renovated kitchen with new quartz counters and designer fixtures, new roof, and fresh exterior paint throughout.",
    featured: false
  }
];

const HRData = {
  getAll() {
    try {
      const raw = localStorage.getItem(HR_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* corrupted store — fall back to seed */ }
    return structuredClone(HR_SEED_LISTINGS);
  },

  saveAll(listings) {
    localStorage.setItem(HR_STORE_KEY, JSON.stringify(listings));
  },

  reset() {
    localStorage.removeItem(HR_STORE_KEY);
  },

  hasCustomData() {
    return localStorage.getItem(HR_STORE_KEY) !== null;
  },

  statusLabel(status) {
    return { "for-sale": "For Sale", "pending": "Pending", "sold": "Sold" }[status] || status;
  },

  formatPrice(listing) {
    if (listing.status === "sold") {
      return listing.price ? "Sold · " + HRData.money(listing.price) : "Sold";
    }
    return listing.price ? HRData.money(listing.price) : "Price on request";
  },

  money(n) {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0
    }).format(n);
  }
};
