# Horner Realty KC — Website Redesign

An ultra-modern, boutique-style redesign of [hornerrealty.pro](https://hornerrealty.pro/) for **Horner Realty KC LLC** (Alicia Horner, Brian Horner & Tyler Logan — Mission, Kansas).

Zero build step, zero dependencies — pure HTML/CSS/JS. Open it, deploy it anywhere.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Main site — hero, buying/selling services, featured listings, sold showcase, team, community, contact |
| `listings.html` | Full portfolio with For sale / Pending / Sold filters and price sorting |
| `admin.html` | **Back office** — add, edit, feature, and delete listings; showcase sold homes |

## Running it

Any static server works:

```powershell
cd C:\Users\abhis\horner-realty
python -m http.server 8080
# open http://localhost:8080
```

(Opening `index.html` directly also works, but a server is recommended so the admin → site flow behaves like production.)

## Admin panel

- Open `admin.html` (also linked as "Admin login" in the site footer).
- **Demo passcode: `horner2026`** — change `PASSCODE` at the top of `js/admin.js`.
- Add/edit listings with photo URL or direct upload (≤ 800 KB), set status (For sale / Pending / Sold), and star listings to feature them on the homepage.
- Sold listings automatically appear in the homepage "Proof, not promises" showcase and under the Sold filter.
- Export/Import JSON for backups; "Reset demo data" restores the original seed.

### How storage works (important)

This is a **front-end demo**: listings live in `js/data.js` (seed) and admin edits persist to the browser's `localStorage`, updating the public pages instantly *in that browser*. The four **Sold** seed listings are Horner Realty's real closed properties (photos in `assets/img/listings/`); the **For sale / Pending** seed items are placeholders — replace them via the admin panel.

To make admin changes visible to *all* visitors in production, swap the storage layer for a real backend. The clean upgrade path:

1. Create a Supabase project with a `listings` table mirroring the fields in `js/data.js`.
2. Replace `HRData.getAll()` / `HRData.saveAll()` with Supabase client calls (anon key for public reads, authenticated role for admin writes).
3. Replace the passcode gate with Supabase Auth.

Everything else — rendering, filters, the admin UI — already works against the same data shape.

## Design system

- **Type:** Fraunces (display serif) + Inter (body) via Google Fonts
- **Palette:** warm ivory `#faf6ee`, deep green-black `#0f1611`, luxury green `#2e7a3f` / leaf `#84cf63` (anchored to the logo green `#68bd45` + navy `#180c44`); champagne gold `#c9b078` reserved for SOLD accents
- Design tokens live at the top of `css/style.css`; admin-only styles in `css/admin.css`
- Scroll-reveal animations respect `prefers-reduced-motion`; WCAG-minded contrast, focus states, 44px+ touch targets

## Content notes

- Business facts (team, phones, email, office, specializations, sold properties) carried over from the original site; marketing copy rewritten fresh for the redesign.
- Hero/section photography uses Unsplash placeholders — swap in the brokerage's own photography before launch.
- The contact form is a demo handler (no backend); wire it to a form service (Formspree, Netlify Forms, or an n8n webhook) for production.
- Privacy/Terms/DMCA links are placeholders pending the brokerage's legal pages.
