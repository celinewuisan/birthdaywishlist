# the wishlist 🎁

A birthday gift-wishlist site: friends browse gifts tagged by "happiness level,"
filter by budget/group size, and claim something — solo or as a "patungan"
group — without revealing who claimed what to each other. You (the owner) get
a passcode-locked dashboard to see every claim, edit the gift list, and tweak
the site's copy without redeploying.

Built with **Next.js 14 (App Router) + TypeScript + Prisma + Tailwind CSS**,
one full-stack codebase, no separate backend to host.

---

## 1. Design system

**Palette** (light / dark both supported via Tailwind `dark:` classes):
- `cream` #FAF8F5 — light background
- `plum-950` #14121C — dark background
- `indigo` #5B4FE8 — primary actions, links
- `citrus` #FFB800 — "slightly above budget" / secondary accent
- `mint` #2FBF71 — "Happy!" badge, "perfect match" badge
- `coral` #FF6B5E — "you changed my life" badge, errors

**Type:** Space Grotesk (display/headlines — a little quirky, not a generic
geometric sans), Inter (body), IBM Plex Mono (prices — gives price tags a
"price sticker" feel instead of blending into body text).

**Signature element:** the happiness-level badges and the rotated "match"
tag (Perfect Match / Slightly Above Budget / Stretch Goal) on each gift card —
styled like a little price/gift tag stuck on at an angle, rather than a
generic progress bar or star rating. This is the one place the design "has
fun"; everything else (cards, spacing, buttons) stays quiet and disciplined
on purpose. No countdowns, balloons, confetti, or gradients — soft rounded
corners + a bit of hover lift instead.

**Motion:** subtle only — card hover lift + image zoom, modal pop-in, no
scroll-jacking or auto-playing animation.

## 2. User flow

1. Friend opens the homepage → reads your intro message.
2. (Optional) Uses the **Gift Finder** — solo or patungan, budget slider
   (Rp50.000–Rp4.000.000), per-person vs overall budget if patungan, and an
   optional "how happy do you want me to be" filter.
3. Gifts matching the budget get tagged **Perfect Match / Slightly Above
   Budget / Stretch Goal** and float to the top of the grid.
4. Friend searches/filters by name, category, happiness level, or
   "only available."
5. Friend clicks **Claim This Gift** (solo) or **Claim as a Group** (on
   gifts with 2+ slots) → small modal asks for their name + a contact method
   of their choice (phone/Instagram/email) + group size & budget type if
   applicable.
6. On submit, the slot is locked (race-condition-safe via a DB transaction)
   and they land on a cute **confirmation page** designed to be
   screenshotted and sent to the group chat.
7. The gift card now shows "claimed" / fewer slots left to everyone —
   but never *who* claimed it.
8. You log into **/admin** with your passcode → see every claim (with
   names + contact info), manage gifts, edit site copy, export CSV.

## 3. Component hierarchy

```
app/layout.tsx                     (fonts, dark-mode no-flash script)
app/page.tsx                       (server: loads SiteContent, renders below)
 └─ components/WishlistApp.tsx     (client: fetches /api/gifts, owns filter+finder state)
     ├─ components/GiftFinder.tsx  (budget dial)
     ├─ components/FilterBar.tsx   (search/category/happiness/availability)
     ├─ components/GiftCard.tsx    (× N)
     │   ├─ components/HappinessBadge.tsx
     │   └─ components/MatchBadge.tsx
     └─ components/ClaimModal.tsx  (opened on claim click)
 └─ components/Faq.tsx
app/claimed/[id]/page.tsx          (server: confirmation page)
app/admin/page.tsx                 (passcode login)
app/admin/dashboard/page.tsx       (client: tab shell)
 ├─ components/admin/AdminClaimsTab.tsx
 ├─ components/admin/AdminGiftsTab.tsx
 │   └─ components/admin/GiftFormModal.tsx (add/edit)
 └─ components/admin/AdminContentTab.tsx
```

## 4. Database schema (`prisma/schema.prisma`)

- **Gift** — name, description, imageUrl, price (IDR int), purchaseLink,
  happinessLevel (enum), category, quantityAvailable (1–5 slots), archived
  (soft-delete so claim history survives a gift being removed).
- **Claim** — gift relation, claimType (SOLO/GROUP), claimantName,
  contactMethod (PHONE/INSTAGRAM/EMAIL) + contactValue, groupSize,
  budgetType (PER_PERSON/TOTAL), budgetAmount, happinessGoal, createdAt.
  Remaining slots = `gift.quantityAvailable - count(claims for that gift)`.
- **SiteContent** — simple key/value table (`homepage_title`,
  `homepage_subtitle`, `intro_message`, `faq` as a JSON string) so you can
  edit copy from `/admin` without a redeploy.

Local dev uses **SQLite** (zero setup, file-based). Production should use
**Postgres** (see Deployment below) — just change the `datasource` provider
in `schema.prisma`.

## 5. API routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/gifts` | GET | public | List + filter gifts (search, category, happiness, availability, budget → match label) |
| `/api/gifts` | POST | admin | Create a gift |
| `/api/gifts/[id]` | PATCH | admin | Edit a gift |
| `/api/gifts/[id]` | DELETE | admin | Archive (soft-delete) a gift |
| `/api/claims` | POST | public | Claim a gift (transaction-safe slot check) |
| `/api/claims` | GET | admin | List all claims |
| `/api/claims/[id]` | GET | public | Fetch one claim (confirmation page) |
| `/api/claims/export` | GET | admin | CSV export |
| `/api/content` | GET | public | Editable site copy |
| `/api/content` | PATCH | admin | Update one piece of copy |
| `/api/admin/login` | POST | — | Check passcode, set signed httpOnly cookie |
| `/api/admin/logout` | POST | — | Clear cookie |
| `/api/admin/me` | GET | — | Is the current visitor an admin? |

Admin auth is a signed cookie (`HMAC-SHA256` over an expiry timestamp using
`SESSION_SECRET`) — no session table needed, no third-party auth service.

## 6. Backend architecture

Everything runs as Next.js **Route Handlers** (`src/app/api/**/route.ts`) —
no separate Express server. Prisma is the only DB layer. `src/lib/` holds
framework-agnostic logic:
- `prisma.ts` — singleton client
- `auth.ts` — passcode check + signed cookie helpers
- `recommend.ts` — budget → match-label logic, solo/group budget resolution
- `format.ts` — IDR formatting, happiness-level display metadata

## 7. Folder structure

```
birthday-wishlist/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx, globals.css, page.tsx
│   │   ├── claimed/[id]/page.tsx
│   │   ├── admin/page.tsx, admin/dashboard/page.tsx
│   │   └── api/
│   │       ├── gifts/route.ts, gifts/[id]/route.ts
│   │       ├── claims/route.ts, claims/[id]/route.ts, claims/export/route.ts
│   │       ├── content/route.ts
│   │       └── admin/login|logout|me/route.ts
│   ├── components/ (+ admin/)
│   └── lib/
├── .env.example
├── package.json / tailwind.config.ts / next.config.js / tsconfig.json
└── README.md
```

## 8. Responsive layouts

Mobile-first throughout: single-column gift grid on phones → 2 columns
(sm) → 3 columns (lg). The claim modal is a bottom sheet on mobile and a
centered dialog from `sm:` up. Admin tables scroll horizontally on narrow
screens instead of squashing.

## 9. Running it locally

```bash
npm install
npx prisma migrate dev --name init   # creates dev.db + tables
npm run seed                          # loads placeholder gifts + default copy
npm run dev
```

Visit `http://localhost:3000`. Admin passcode is whatever's in your `.env`
(`ADMIN_PASSCODE`) — it's currently set to the one you gave me, change it any
time by editing `.env` (local) or your host's environment variables (prod).

## 10. Deployment (Vercel + Neon Postgres — the easy path)

1. **Push this folder to a GitHub repo.**
2. **Create a free Postgres DB** at [neon.tech](https://neon.tech) (or
   Vercel's own Postgres add-on) and copy the connection string.
3. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. **Import the repo into Vercel** (vercel.com → New Project). Set these
   Environment Variables in the Vercel dashboard:
   - `DATABASE_URL` — your Neon connection string
   - `ADMIN_PASSCODE` — your chosen passcode
   - `SESSION_SECRET` — a random string (`openssl rand -hex 32`)
5. Vercel runs `npm install` → `postinstall` (`prisma generate`) →
   `npm run build` automatically. After the first deploy, run the migration
   once against the prod DB from your machine:
   ```bash
   DATABASE_URL="<your neon url>" npx prisma migrate deploy
   DATABASE_URL="<your neon url>" npm run seed   # optional, or add real gifts via /admin
   ```
6. Visit your `*.vercel.app` URL, go to `/admin`, log in, and start adding
   your real gifts (photos, links, prices) — the placeholder ones can be
   removed from the Gifts tab.

That's it — no server to manage, and editing homepage text/FAQ/gifts never
needs a redeploy again.

## 11. Notes / things you might want to tweak later

- Search is case-sensitive on SQLite locally; Postgres in production handles
  it better, or swap `contains` for a case-insensitive query if needed.
- The admin check is cookie-based and fine for a single-owner personal site;
  it isn't hardened for multi-admin or brute-force protection beyond a
  constant-time passcode compare.
- Gift images are just URLs (paste an image link when adding a gift) —
  there's no upload/storage pipeline, to keep this simple to deploy.
