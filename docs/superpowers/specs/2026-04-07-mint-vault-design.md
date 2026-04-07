# MINT VAULT — Design Specification

## Overview

MINT VAULT is a multi-user collectible asset tracker for trading cards, comics, and retro video games. It provides portfolio management, market pricing via PriceCharting data, wishlist tracking with price alerts, and external marketplace aggregation.

## Architecture

Single monolith Next.js 15 application deployed on Vercel.

- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Database**: Neon Postgres via Drizzle ORM
- **Auth**: Clerk (Vercel Marketplace integration)
- **Styling**: Tailwind CSS v4 with custom dark theme tokens
- **Icons**: Material Symbols Outlined
- **Fonts**: Space Grotesk (headlines), Plus Jakarta Sans (body), Inter (labels)
- **Scraping**: Cheerio + node-fetch for PriceCharting data
- **Charts**: Recharts
- **Image storage**: Vercel Blob (for user-uploaded item images)
- **Deployment**: Vercel with Cron Jobs for scheduled scraping

## Data Model

### Collections

| Column      | Type      | Notes                          |
|-------------|-----------|--------------------------------|
| id          | uuid (PK) | Generated                      |
| userId      | text      | Clerk user ID                  |
| name        | text      | e.g., "Pokemon Cards"          |
| description | text      | Nullable                       |
| createdAt   | timestamp | Default now()                  |
| updatedAt   | timestamp | Auto-updated                   |

### Items

| Column           | Type      | Notes                                  |
|------------------|-----------|----------------------------------------|
| id               | uuid (PK) | Generated                             |
| collectionId     | uuid (FK) | References Collections                |
| userId           | text      | Clerk user ID (denormalized for queries) |
| pricechartingId  | int       | Nullable — linked PriceCharting product |
| name             | text      | Display name                          |
| variant          | text      | Nullable — "1st Edition Shadowless"   |
| grade            | text      | Nullable — "PSA 10", "CGC 9.8"       |
| gradingService   | text      | Nullable — "PSA", "CGC", "BGS", "WATA" |
| certNumber       | text      | Nullable — certification number       |
| purchasePrice    | decimal   | Nullable — what user paid             |
| purchaseDate     | date      | Nullable                              |
| notes            | text      | Nullable                              |
| imageUrl         | text      | Nullable                              |
| createdAt        | timestamp | Default now()                         |
| updatedAt        | timestamp | Auto-updated                          |

### WishlistItems

| Column           | Type      | Notes                          |
|------------------|-----------|--------------------------------|
| id               | uuid (PK) | Generated                     |
| userId           | text      | Clerk user ID                 |
| pricechartingId  | int       | Nullable                      |
| name             | text      | Display name                  |
| targetPrice      | decimal   | Nullable — alert threshold    |
| alertsEnabled    | boolean   | Default false                 |
| notes            | text      | Nullable                      |
| createdAt        | timestamp | Default now()                 |

### PricechartingProducts

| Column        | Type      | Notes                               |
|---------------|-----------|---------------------------------------|
| id            | serial PK | Internal ID                          |
| externalId    | text      | PriceCharting product identifier     |
| name          | text      | Product name                         |
| category      | text      | "tcg", "comics", "games"            |
| currentPrice  | decimal   | Latest known price                   |
| imageUrl      | text      | Nullable                             |
| metadata      | jsonb     | Set name, variant info, rarity, etc. |
| lastFetchedAt | timestamp | When price was last scraped          |
| createdAt     | timestamp | Default now()                        |

### PriceSnapshots

| Column     | Type      | Notes                            |
|------------|-----------|----------------------------------|
| id         | serial PK | Internal ID                     |
| productId  | int (FK)  | References PricechartingProducts |
| price      | decimal   | Price at time of recording      |
| source     | text      | "pricecharting", "ebay"         |
| recordedAt | timestamp | Default now()                   |

### ActivityLog

| Column     | Type      | Notes                                      |
|------------|-----------|----------------------------------------------|
| id         | serial PK | Internal ID                                 |
| userId     | text      | Clerk user ID                               |
| type       | text      | "item_added", "item_removed", "item_sold", "grade_verified" |
| itemId     | uuid      | Nullable — references Items                 |
| metadata   | jsonb     | Extra context (item name, price, etc.)      |
| createdAt  | timestamp | Default now()                               |

### UserPreferences

| Column               | Type      | Notes                          |
|----------------------|-----------|--------------------------------|
| id                   | uuid (PK) | Generated                     |
| userId               | text      | Clerk user ID (unique)        |
| emailAlertsEnabled   | boolean   | Default false                 |
| defaultView          | text      | "grid" or "list", default "grid" |
| defaultCategory      | text      | Nullable — default filter     |
| createdAt            | timestamp | Default now()                 |
| updatedAt            | timestamp | Auto-updated                  |

## Pages

### 1. Dashboard (`/dashboard`)

The home screen after login. Shows:

- **Portfolio summary card**: Total portfolio value (sum of current market values for all user items), value change percentages (24h, 7d, 30d), total graded asset count.
- **Portfolio chart**: Line chart of portfolio value over time (built from price snapshots of owned items).
- **Premium Rarities**: Top 4 most valuable items displayed as hoverable cards with image, name, grade badge, value, and trend.
- **Vault History**: Recent activity feed showing item additions, removals, and grade verifications. Stored as a simple activity log.
- **Price Watch**: Compact list of watchlisted items showing name, current price, and 30d trend percentage. Links to wishlist.
- **Active Bid card** (if user has wishlist items near target): Shows the closest-to-target wishlist item with a mini bar chart and "Quick View Auction" link.

### 2. Collection (`/collection`)

Filterable grid of all owned items.

- **Filters**: Grade (PSA 10, PSA 9, BGS 10, CGC 9.8, etc.), Set/Series, Rarity, Category (TCG/Comics/Games). Implemented as select dropdowns.
- **Search**: Text search by item name.
- **View toggle**: Grid view (card-based, default) and list view.
- **Card layout**: Each card shows item image (3:4 aspect ratio), grade badge (rotated, positioned top-right), name, set/variant, current market value, 30d trend percentage.
- **Pagination**: Page-based with "Showing X of Y assets" indicator.
- Clicking a card navigates to the item detail page.

### 3. Item Detail (`/collection/[id]`)

Full detail view for a single owned item.

- **Image gallery**: Main image (3:4 aspect), thumbnail row below (front, back, holo detail, grade label).
- **Verified Asset badge**: Shown if item has a cert number linked to a grading service.
- **Title section**: Grade badge, set number, item name (large headline), set/year info.
- **Market stats bento grid**: Current market value with trend, PriceCharting rank (if available).
- **Price history chart**: Bar or line chart showing price over time (1Y/ALL toggle). Data sourced from PriceSnapshots.
- **CTA buttons**: "Acquire Asset" (links to external marketplace search), "Watchlist" (adds to wishlist).
- **Editorial description**: User-entered notes displayed as "The Grail Narrative" section.

### 4. Add Item (`/add-item`)

3-step wizard flow:

**Step 1 — Search**: Text input searching PriceCharting. Shows results as a bento grid: primary result (large image card with "Top Match" badge), market snapshot sidebar (PSA 10 value, growth, volume), detected variants list. User selects a match.

**Step 2 — Metadata**: Form to enter grade, grading service, cert number, purchase price, purchase date, notes, collection assignment (select or create new). Image upload optional (falls back to PriceCharting image).

**Step 3 — Valuation**: Confirmation screen showing the item with current market value pulled from PriceCharting, purchase price comparison, and "Add to Vault" button.

Navigation: "Cancel and Return" link, "Manual Entry" button (skips PriceCharting, enters all fields manually), "Confirm & Next" to advance steps.

### 5. Wishlist (`/wishlist`)

Target acquisition tracker.

- **Header**: Total wishlist value, savings opportunity (sum of deltas where current < target).
- **List view**: Each item shows image, name/variant, grade badge, target price, current value, price delta, alert toggle, delete button.
- **Opportunity highlight**: Items where current price is below target get a gold right-border glow and a "BUY NOW" button linking to external search.
- **Live Marketplace Matches**: Grid of 3 eBay listing cards matching wishlist item names. Each shows image, source badge (eBay/FB Marketplace), title, price, time remaining/posted date, and "View Deal" link.

### 6. Marketplace (`/marketplace`)

External listing aggregator. Not an internal buy/sell platform.

- **Search**: Text search that scrapes eBay search results for collectibles (using Cheerio, same approach as PriceCharting). No eBay API key required.
- **Results grid**: Cards showing listing image, source badge, title, price, auction time remaining or "Buy It Now", and external link.
- **Filters**: Category, price range, listing type (auction/fixed).
- **Caching**: Search results cached for 15 minutes to reduce scraping frequency.
- Links out to the external listing for all transactions.

### 7. Market Insight (`/market-insight`)

Analytics and trend tracking.

- **Category trend cards**: Large cards for TCG, Comics, Games showing hero image, volume stats, trend description. Similar to the dashboard's bento category cards.
- **PriceCharting Trends ticker**: List of notable price movements (item name, price change).
- **Asset Intelligence view** (drill-down for a specific product): Large image, grade/set metadata, estimated market value, price history chart (5yr SVG line), recent sales table (date, source, sale type, price).
- **External tool links**: PriceCharting Search, PSA Grading Status, eBay Completed Items.

### 8. Settings (`/settings`)

- Profile display (managed by Clerk's `<UserProfile />` component).
- Notification preferences: toggle email alerts for wishlist price drops.
- Display preferences: default view (grid/list), default category filter.

## Layout

### Authenticated Layout (`(app)/layout.tsx`)

- **Desktop**: Fixed left sidebar (w-64) + top header bar + main content area.
- **Mobile**: Top header bar with hamburger menu + main content + fixed bottom navigation bar.

### Sidebar (Desktop)

- App logo "MINT VAULT" at top.
- User profile card (avatar, name, tier badge) below logo.
- Nav links: Dashboard, Collection, Wishlist, Marketplace, Market Insight, Settings. Active link has left gold border + blue background tint.
- "Add New Asset" CTA button at bottom.

### Top Header

- Desktop: Search bar, notification bell, account icon.
- Mobile: "MINT VAULT" logo, notification bell, account icon.

### Bottom Nav (Mobile)

- 5 items: Dashboard, Collection, Add (center, highlighted), Wishlist, Market.
- Glass-morphism background with blur.
- Active item gets gradient background and scale-up.

## Design System

### Colors (Dark Theme)

```
background:              #131313
surface-container-lowest: #0E0E0E
surface-container-low:   #1B1C1C
surface-container:       #1F2020
surface-container-high:  #2A2A2A
surface-container-highest: #353535
on-surface:              #E4E2E1
primary:                 #A9C7FF
primary-container:       #1E6BC7
tertiary (gold):         #FABD00
secondary (purple):      #EDB1FF
error:                   #FFB4AB
outline:                 #8C919E
outline-variant:         #424752
```

### Typography

- **Headlines**: Space Grotesk, bold/black, tight tracking
- **Body**: Plus Jakarta Sans, regular/medium
- **Labels**: Inter, bold, uppercase, wide tracking

### Border Radius

- Default: 0.25rem
- Large: 0.5rem
- XL: 0.75rem
- Cards/panels: 0.75rem–1.5rem (rounded-xl to rounded-3xl)
- Badges: 9999px (full)

### Effects

- Glass panels: `backdrop-filter: blur(12px)` with low-opacity background
- Holographic gradients: `linear-gradient(135deg, primary 0%, primary-container 100%)`
- Card hover: `scale(1.02)` with shadow increase
- Grade badges: Rotated (6-12deg), positioned absolutely on cards

## PriceCharting Scraping

### Scheduled Scraping (Vercel Cron)

- Runs every 6 hours via `vercel.json` cron configuration.
- API route: `/api/cron/update-prices`
- Logic:
  1. Query all distinct `pricechartingId` values from Items and WishlistItems tables.
  2. For each product, fetch current price from PriceCharting.
  3. Update `PricechartingProducts.currentPrice` and `lastFetchedAt`.
  4. Insert a new `PriceSnapshot` row.
- Rate limiting: 1 request per second with exponential backoff on failures.
- Cron secured with `CRON_SECRET` env var.

### On-Demand Search

- When user searches in the Add Item flow, a Server Action calls PriceCharting search.
- Results are parsed and returned as structured data (name, image, price, variants).
- Matched products are upserted into `PricechartingProducts` for caching.

### Scraping Implementation

- Use Cheerio to parse PriceCharting HTML pages.
- Target URLs: `pricecharting.com/search-products?q={query}` for search, `pricecharting.com/game/{slug}` for detail.
- Extract: product name, current price, image URL, category, variant list.
- Cache responses for 1 hour to reduce scraping frequency.

## Project Structure

```
src/
  app/
    (auth)/
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
      layout.tsx
    (app)/
      layout.tsx                    # Authenticated shell with sidebar
      dashboard/page.tsx
      collection/page.tsx
      collection/[id]/page.tsx      # Item detail
      add-item/page.tsx
      wishlist/page.tsx
      marketplace/page.tsx
      market-insight/page.tsx
      market-insight/[productId]/page.tsx  # Asset intelligence
      settings/page.tsx
    api/
      cron/
        update-prices/route.ts      # Scheduled price scraping
  components/
    ui/
      card.tsx                      # Base card component
      badge.tsx                     # Grade badges
      button.tsx
      input.tsx
      select.tsx
      skeleton.tsx                  # Loading states
    layout/
      sidebar.tsx
      top-header.tsx
      bottom-nav.tsx
      app-shell.tsx
    charts/
      portfolio-chart.tsx
      price-history-chart.tsx
      mini-bar-chart.tsx
    collection/
      item-card.tsx
      item-grid.tsx
      filter-bar.tsx
    dashboard/
      portfolio-summary.tsx
      premium-rarities.tsx
      vault-history.tsx
      price-watch.tsx
    wishlist/
      wishlist-item.tsx
      marketplace-match.tsx
    add-item/
      search-step.tsx
      metadata-step.tsx
      valuation-step.tsx
  lib/
    db/
      schema.ts                     # Drizzle schema definitions
      index.ts                      # DB client
      queries/
        items.ts
        collections.ts
        wishlist.ts
        products.ts
        snapshots.ts
    scraper/
      pricecharting.ts              # Search + detail scraping
      ebay.ts                       # eBay listing search scraping
      cache.ts                      # Response caching
    actions/
      items.ts                      # CRUD Server Actions for items
      collections.ts
      wishlist.ts
      preferences.ts
      search.ts                     # PriceCharting search action
      marketplace.ts                # eBay search action
    utils/
      format.ts                     # Price formatting, date formatting
      cn.ts                         # Tailwind class merge utility

drizzle/
  migrations/                       # Generated migration files

public/
  fonts/                            # Self-hosted if needed

.env.local                          # Clerk keys, Neon connection string, cron secret
vercel.json                         # Cron job configuration
drizzle.config.ts
tailwind.config.ts                  # Custom theme tokens
next.config.ts
```

## Error Handling

- **Scraping failures**: Log error, skip product, continue with remaining. Never crash the cron job.
- **DB errors**: Server Actions return typed error responses. UI shows toast notifications.
- **Auth**: Clerk middleware protects all `(app)` routes. Unauthenticated users redirect to sign-in.
- **Empty states**: Each page has an empty state with illustration and CTA (e.g., "Add your first item" on Collection).
- **Loading states**: Skeleton components matching the card/list layouts for Suspense boundaries.

## Testing Strategy

- **Unit tests**: Scraping parsers, price formatting utilities, data transformation functions.
- **Integration tests**: Server Actions with test database.
- **E2E**: Key flows — sign up, add item, view collection, add to wishlist.
