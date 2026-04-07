# MINT VAULT Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack multi-user collectible asset tracker with PriceCharting integration, deployed on Vercel.

**Architecture:** Single Next.js 15 monolith (App Router, Server Components, Server Actions) with Neon Postgres via Drizzle ORM, Clerk auth, and Cheerio-based scraping for PriceCharting/eBay data. Dark theme UI matching provided HTML mockups.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Drizzle ORM, Neon Postgres, Clerk, Recharts, Cheerio, Vercel Blob, Vercel Cron

**Design Spec:** `docs/superpowers/specs/2026-04-07-mint-vault-design.md`

**HTML Mockups Reference:** The user provided 8 HTML mockup files showing the exact visual design for each page. These serve as the pixel-reference for all UI work. Key design tokens are extracted in the spec's Design System section.

---

## Phase 1: Project Foundation

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
cd "/c/Users/costa/Downloads/Dev Environment/Collectible Tracker"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Select defaults when prompted. This creates the base project with App Router and Tailwind.

- [ ] **Step 2: Install core dependencies**

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
npm install @clerk/nextjs
npm install recharts cheerio
npm install @vercel/blob
npm install clsx tailwind-merge
```

- [ ] **Step 3: Verify the dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000 with default Next.js page.

- [ ] **Step 4: Commit**

```bash
git init
echo "node_modules/\n.next/\n.env.local\n.env\n.superpowers/" > .gitignore
git add -A
git commit -m "chore: scaffold Next.js 15 project with dependencies"
```

---

### Task 2: Configure Tailwind Design System

**Files:**
- Modify: `tailwind.config.ts` (or `src/app/globals.css` for Tailwind v4)
- Create: `src/lib/utils/cn.ts`

- [ ] **Step 1: Configure Tailwind theme with MINT VAULT design tokens**

Check which Tailwind version was installed. If v4, theme config goes in CSS. If v3, it goes in `tailwind.config.ts`. For v4 (CSS-based config), update `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-background: #131313;
  --color-surface: #131313;
  --color-surface-dim: #131313;
  --color-surface-bright: #393939;
  --color-surface-container-lowest: #0e0e0e;
  --color-surface-container-low: #1b1c1c;
  --color-surface-container: #1f2020;
  --color-surface-container-high: #2a2a2a;
  --color-surface-container-highest: #353535;
  --color-surface-variant: #353535;
  --color-on-surface: #e4e2e1;
  --color-on-surface-variant: #c2c6d4;
  --color-on-background: #e4e2e1;
  --color-primary: #a9c7ff;
  --color-primary-container: #1e6bc7;
  --color-primary-fixed: #d6e3ff;
  --color-primary-fixed-dim: #a9c7ff;
  --color-on-primary: #003063;
  --color-on-primary-container: #e8eeff;
  --color-on-primary-fixed: #001b3d;
  --color-on-primary-fixed-variant: #00468c;
  --color-inverse-primary: #005db7;
  --color-secondary: #edb1ff;
  --color-secondary-container: #6e208c;
  --color-secondary-fixed: #f9d8ff;
  --color-secondary-fixed-dim: #edb1ff;
  --color-on-secondary: #520070;
  --color-on-secondary-container: #e498ff;
  --color-on-secondary-fixed: #320046;
  --color-on-secondary-fixed-variant: #6e208c;
  --color-tertiary: #fabd00;
  --color-tertiary-container: #896600;
  --color-tertiary-fixed: #ffdf9e;
  --color-tertiary-fixed-dim: #fabd00;
  --color-on-tertiary: #3f2e00;
  --color-on-tertiary-container: #ffebc9;
  --color-on-tertiary-fixed: #261a00;
  --color-on-tertiary-fixed-variant: #5b4300;
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --color-on-error: #690005;
  --color-on-error-container: #ffdad6;
  --color-outline: #8c919e;
  --color-outline-variant: #424752;
  --color-inverse-surface: #e4e2e1;
  --color-inverse-on-surface: #303030;
  --color-surface-tint: #a9c7ff;

  /* Typography */
  --font-headline: "Space Grotesk", sans-serif;
  --font-body: "Plus Jakarta Sans", sans-serif;
  --font-label: "Inter", sans-serif;

  /* Border Radius */
  --radius-DEFAULT: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}

body {
  background-color: var(--color-background);
  color: var(--color-on-surface);
  font-family: var(--font-body);
}

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
}

.glass-effect {
  background: rgba(30, 107, 199, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.holographic-gradient {
  background: linear-gradient(135deg, #a9c7ff 0%, #1e6bc7 100%);
}

.ghost-border {
  border: 1px solid rgba(66, 71, 82, 0.15);
}
```

- [ ] **Step 2: Create cn utility**

Create `src/lib/utils/cn.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Update root layout with fonts and Material Symbols**

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MINT VAULT",
  description: "Premium collectible asset tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${inter.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body">{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Verify styles load correctly**

```bash
npm run dev
```

Open localhost:3000. Page should show dark background (#131313) with light text.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: configure Tailwind design system with MINT VAULT theme tokens"
```

---

### Task 3: Database Schema with Drizzle

**Files:**
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: Create Drizzle config**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: Create database schema**

Create `src/lib/db/schema.ts`:

```typescript
import {
  pgTable,
  uuid,
  text,
  timestamp,
  decimal,
  date,
  boolean,
  serial,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pricechartingProducts = pgTable("pricecharting_products", {
  id: serial("id").primaryKey(),
  externalId: text("external_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "tcg", "comics", "games"
  currentPrice: decimal("current_price", { precision: 12, scale: 2 }),
  imageUrl: text("image_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  lastFetchedAt: timestamp("last_fetched_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: uuid("id").defaultRandom().primaryKey(),
  collectionId: uuid("collection_id")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  pricechartingId: integer("pricecharting_id").references(
    () => pricechartingProducts.id
  ),
  name: text("name").notNull(),
  variant: text("variant"),
  grade: text("grade"),
  gradingService: text("grading_service"),
  certNumber: text("cert_number"),
  purchasePrice: decimal("purchase_price", { precision: 12, scale: 2 }),
  purchaseDate: date("purchase_date"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  pricechartingId: integer("pricecharting_id").references(
    () => pricechartingProducts.id
  ),
  name: text("name").notNull(),
  targetPrice: decimal("target_price", { precision: 12, scale: 2 }),
  alertsEnabled: boolean("alerts_enabled").default(false).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const priceSnapshots = pgTable("price_snapshots", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => pricechartingProducts.id, { onDelete: "cascade" }),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  source: text("source").notNull(), // "pricecharting", "ebay"
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // "item_added", "item_removed", "item_sold", "grade_verified"
  itemId: uuid("item_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique(),
  emailAlertsEnabled: boolean("email_alerts_enabled").default(false).notNull(),
  defaultView: text("default_view").default("grid").notNull(),
  defaultCategory: text("default_category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
```

- [ ] **Step 3: Create database client**

Create `src/lib/db/index.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 4: Create .env.local template**

Create `.env.local`:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CRON_SECRET=your-cron-secret-here
```

Note: Replace with actual values. The user will need to create a Neon database and Clerk app.

- [ ] **Step 5: Generate and run initial migration**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

Expected: Migration files created in `drizzle/migrations/`. Tables created in Neon.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Drizzle ORM schema with all tables"
```

---

### Task 4: Clerk Authentication Setup

**Files:**
- Create: `src/middleware.ts`
- Create: `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- Create: `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- Create: `src/app/(auth)/layout.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Wrap root layout with ClerkProvider**

Update `src/app/layout.tsx` — add `import { ClerkProvider } from "@clerk/nextjs";` and wrap `{children}` with `<ClerkProvider>`:

```typescript
import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MINT VAULT",
  description: "Premium collectible asset tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html
        lang="en"
        className={`dark ${spaceGrotesk.variable} ${plusJakartaSans.variable} ${inter.variable}`}
      >
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="bg-background text-on-surface font-body">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

- [ ] **Step 2: Create Clerk middleware**

Create `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/cron(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

- [ ] **Step 3: Create auth layout**

Create `src/app/(auth)/layout.tsx`:

```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create sign-in page**

Create `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`:

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <SignIn />;
}
```

- [ ] **Step 5: Create sign-up page**

Create `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`:

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return <SignUp />;
}
```

- [ ] **Step 6: Verify auth flow works**

```bash
npm run dev
```

Navigate to localhost:3000. Should redirect to `/sign-in`. After signing in, should redirect back to `/`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Clerk authentication with sign-in/sign-up pages"
```

---

### Task 5: App Shell Layout (Sidebar, Header, Bottom Nav)

**Files:**
- Create: `src/app/(app)/layout.tsx`
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/top-header.tsx`
- Create: `src/components/layout/bottom-nav.tsx`
- Create: `src/app/(app)/dashboard/page.tsx` (placeholder)

- [ ] **Step 1: Create sidebar component**

Create `src/components/layout/sidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/collection", icon: "style", label: "Collection" },
  { href: "/wishlist", icon: "auto_awesome", label: "Wishlist" },
  { href: "/marketplace", icon: "storefront", label: "Marketplace" },
  { href: "/market-insight", icon: "monitoring", label: "Market Insight" },
  { href: "/settings", icon: "settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r border-outline-variant/15 bg-surface-container-low py-8 px-4 z-40 shadow-[24px_0_40px_rgba(30,107,199,0.04)]">
      <div className="mb-10 px-4">
        <span className="text-xl font-black text-primary font-headline tracking-tighter italic">
          MINT VAULT
        </span>
      </div>

      <div className="mb-8 px-4 flex items-center gap-3">
        <UserButton
          appearance={{
            elements: { avatarBox: "w-10 h-10" },
          }}
        />
        <div>
          <p className="text-xs font-bold text-on-surface">Collector</p>
          <p className="text-[10px] text-primary font-medium">Premium Tier</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 py-3 px-4 font-headline text-sm font-semibold uppercase tracking-widest transition-all duration-300",
                isActive
                  ? "text-primary bg-primary-container/10 rounded-lg border-l-4 border-tertiary"
                  : "text-gray-500 hover:bg-surface-container-highest/50 hover:text-secondary rounded-lg"
              )}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/add-item"
        className="mt-auto holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">add_circle</span>
        <span>Add New Asset</span>
      </Link>
    </aside>
  );
}
```

- [ ] **Step 2: Create top header component**

Create `src/components/layout/top-header.tsx`:

```typescript
"use client";

import { UserButton } from "@clerk/nextjs";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background px-6 py-4 flex justify-between items-center md:pl-72">
      <div className="flex items-center gap-6">
        <span className="md:hidden text-2xl font-bold italic tracking-tighter text-primary font-headline">
          MINT VAULT
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input
            className="bg-surface-container border-none rounded-full py-2 px-6 text-sm focus:ring-1 focus:ring-primary w-64 text-on-surface placeholder:text-outline/50"
            placeholder="Search Vault..."
            type="text"
          />
          <span className="material-symbols-outlined absolute right-3 top-2 text-gray-500 text-sm">
            search
          </span>
        </div>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-surface-container-highest transition-colors active:scale-95">
            <span className="material-symbols-outlined text-primary">
              notifications
            </span>
          </button>
          <div className="md:hidden">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create bottom nav component**

Create `src/components/layout/bottom-nav.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/collection", icon: "style", label: "Collection" },
  { href: "/add-item", icon: "add", label: "Add", isCenter: true },
  { href: "/wishlist", icon: "favorite", label: "Wishlist" },
  { href: "/marketplace", icon: "shopping_cart", label: "Market" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-background/80 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 transition-all",
              item.isCenter && isActive
                ? "bg-gradient-to-br from-primary-container to-background text-white rounded-xl scale-110 shadow-[0_0_15px_rgba(30,107,199,0.4)]"
                : item.isCenter
                  ? "bg-gradient-to-br from-primary-container to-background text-white rounded-xl scale-110 shadow-[0_0_15px_rgba(30,107,199,0.4)]"
                  : isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-primary"
            )}
          >
            <span
              className="material-symbols-outlined"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="font-label text-[10px] font-bold uppercase tracking-tighter mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4: Create authenticated app layout**

Create `src/app/(app)/layout.tsx`:

```typescript
import { Sidebar } from "@/components/layout/sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopHeader />
      <main className="md:pl-64 pb-24 md:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 5: Create placeholder dashboard page**

Create `src/app/(app)/dashboard/page.tsx`:

```typescript
export default function DashboardPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-headline font-bold tracking-tighter">
        Dashboard
      </h1>
      <p className="text-on-surface-variant mt-2">
        Portfolio overview coming soon.
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Update root page to redirect to dashboard**

Update `src/app/page.tsx`:

```typescript
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
```

- [ ] **Step 7: Verify layout renders correctly**

```bash
npm run dev
```

After sign-in, should see sidebar on desktop, bottom nav on mobile, header with search bar, and "Dashboard" placeholder content.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add app shell layout with sidebar, header, and bottom nav"
```

---

## Phase 2: Collection Core

### Task 6: Database Query Functions

**Files:**
- Create: `src/lib/db/queries/collections.ts`
- Create: `src/lib/db/queries/items.ts`
- Create: `src/lib/db/queries/products.ts`
- Create: `src/lib/db/queries/wishlist.ts`
- Create: `src/lib/db/queries/snapshots.ts`
- Create: `src/lib/db/queries/activity.ts`
- Create: `src/lib/db/queries/preferences.ts`

- [ ] **Step 1: Create collections queries**

Create `src/lib/db/queries/collections.ts`:

```typescript
import { db } from "@/lib/db";
import { collections } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function getCollectionsByUser(userId: string) {
  return db
    .select()
    .from(collections)
    .where(eq(collections.userId, userId))
    .orderBy(collections.name);
}

export async function getCollectionById(id: string, userId: string) {
  const result = await db
    .select()
    .from(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function createCollection(
  userId: string,
  data: { name: string; description?: string }
) {
  const result = await db
    .insert(collections)
    .values({ userId, ...data })
    .returning();
  return result[0];
}

export async function deleteCollection(id: string, userId: string) {
  return db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)));
}
```

- [ ] **Step 2: Create items queries**

Create `src/lib/db/queries/items.ts`:

```typescript
import { db } from "@/lib/db";
import { items, pricechartingProducts } from "@/lib/db/schema";
import { eq, and, ilike, sql, desc } from "drizzle-orm";

export type ItemWithProduct = Awaited<ReturnType<typeof getItemsByUser>>[number];

export async function getItemsByUser(
  userId: string,
  options?: {
    search?: string;
    grade?: string;
    category?: string;
    page?: number;
    pageSize?: number;
  }
) {
  const page = options?.page ?? 1;
  const pageSize = options?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  let query = db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(items.userId, userId))
    .$dynamic();

  if (options?.search) {
    query = query.where(
      and(eq(items.userId, userId), ilike(items.name, `%${options.search}%`))
    );
  }

  if (options?.grade) {
    query = query.where(
      and(eq(items.userId, userId), eq(items.grade, options.grade))
    );
  }

  return query.orderBy(desc(items.createdAt)).limit(pageSize).offset(offset);
}

export async function getItemCountByUser(userId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(items)
    .where(eq(items.userId, userId));
  return Number(result[0].count);
}

export async function getItemById(id: string, userId: string) {
  const result = await db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .limit(1);
  return result[0] ?? null;
}

export async function getTopItemsByValue(userId: string, limit = 4) {
  return db
    .select({
      item: items,
      product: pricechartingProducts,
    })
    .from(items)
    .leftJoin(
      pricechartingProducts,
      eq(items.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(items.userId, userId))
    .orderBy(desc(pricechartingProducts.currentPrice))
    .limit(limit);
}

export async function createItem(
  data: typeof items.$inferInsert
) {
  const result = await db.insert(items).values(data).returning();
  return result[0];
}

export async function deleteItem(id: string, userId: string) {
  return db
    .delete(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)));
}
```

- [ ] **Step 3: Create products queries**

Create `src/lib/db/queries/products.ts`:

```typescript
import { db } from "@/lib/db";
import { pricechartingProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function upsertProduct(data: {
  externalId: string;
  name: string;
  category: string;
  currentPrice?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const existing = await db
    .select()
    .from(pricechartingProducts)
    .where(eq(pricechartingProducts.externalId, data.externalId))
    .limit(1);

  if (existing[0]) {
    const updated = await db
      .update(pricechartingProducts)
      .set({
        currentPrice: data.currentPrice,
        imageUrl: data.imageUrl,
        metadata: data.metadata,
        lastFetchedAt: new Date(),
      })
      .where(eq(pricechartingProducts.id, existing[0].id))
      .returning();
    return updated[0];
  }

  const inserted = await db
    .insert(pricechartingProducts)
    .values({ ...data, lastFetchedAt: new Date() })
    .returning();
  return inserted[0];
}

export async function getProductById(id: number) {
  const result = await db
    .select()
    .from(pricechartingProducts)
    .where(eq(pricechartingProducts.id, id))
    .limit(1);
  return result[0] ?? null;
}
```

- [ ] **Step 4: Create activity log queries**

Create `src/lib/db/queries/activity.ts`:

```typescript
import { db } from "@/lib/db";
import { activityLog } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function logActivity(data: {
  userId: string;
  type: string;
  itemId?: string;
  metadata?: Record<string, unknown>;
}) {
  return db.insert(activityLog).values(data);
}

export async function getRecentActivity(userId: string, limit = 10) {
  return db
    .select()
    .from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.createdAt))
    .limit(limit);
}
```

- [ ] **Step 5: Create snapshots queries**

Create `src/lib/db/queries/snapshots.ts`:

```typescript
import { db } from "@/lib/db";
import { priceSnapshots } from "@/lib/db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export async function addSnapshot(data: {
  productId: number;
  price: string;
  source: string;
}) {
  return db.insert(priceSnapshots).values(data);
}

export async function getSnapshotsByProduct(
  productId: number,
  since?: Date
) {
  let query = db
    .select()
    .from(priceSnapshots)
    .where(eq(priceSnapshots.productId, productId))
    .$dynamic();

  if (since) {
    query = query.where(
      and(
        eq(priceSnapshots.productId, productId),
        gte(priceSnapshots.recordedAt, since)
      )
    );
  }

  return query.orderBy(desc(priceSnapshots.recordedAt));
}
```

- [ ] **Step 6: Create wishlist queries**

Create `src/lib/db/queries/wishlist.ts`:

```typescript
import { db } from "@/lib/db";
import { wishlistItems, pricechartingProducts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getWishlistByUser(userId: string) {
  return db
    .select({
      wishlistItem: wishlistItems,
      product: pricechartingProducts,
    })
    .from(wishlistItems)
    .leftJoin(
      pricechartingProducts,
      eq(wishlistItems.pricechartingId, pricechartingProducts.id)
    )
    .where(eq(wishlistItems.userId, userId))
    .orderBy(desc(wishlistItems.createdAt));
}

export async function createWishlistItem(
  data: typeof wishlistItems.$inferInsert
) {
  const result = await db.insert(wishlistItems).values(data).returning();
  return result[0];
}

export async function deleteWishlistItem(id: string, userId: string) {
  return db
    .delete(wishlistItems)
    .where(
      and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId))
    );
}

export async function updateWishlistAlerts(
  id: string,
  userId: string,
  enabled: boolean
) {
  return db
    .update(wishlistItems)
    .set({ alertsEnabled: enabled })
    .where(
      and(eq(wishlistItems.id, id), eq(wishlistItems.userId, userId))
    );
}
```

- [ ] **Step 7: Create preferences queries**

Create `src/lib/db/queries/preferences.ts`:

```typescript
import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getPreferences(userId: string) {
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function upsertPreferences(
  userId: string,
  data: Partial<{
    emailAlertsEnabled: boolean;
    defaultView: string;
    defaultCategory: string;
  }>
) {
  const existing = await getPreferences(userId);
  if (existing) {
    return db
      .update(userPreferences)
      .set(data)
      .where(eq(userPreferences.userId, userId))
      .returning();
  }
  return db
    .insert(userPreferences)
    .values({ userId, ...data })
    .returning();
}
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add database query functions for all tables"
```

---

### Task 7: Server Actions

**Files:**
- Create: `src/lib/actions/items.ts`
- Create: `src/lib/actions/collections.ts`
- Create: `src/lib/actions/wishlist.ts`
- Create: `src/lib/actions/preferences.ts`

- [ ] **Step 1: Create collections server actions**

Create `src/lib/actions/collections.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getCollectionsByUser,
  createCollection,
  deleteCollection,
} from "@/lib/db/queries/collections";
import { revalidatePath } from "next/cache";

export async function getCollectionsAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getCollectionsByUser(userId);
}

export async function createCollectionAction(data: {
  name: string;
  description?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const collection = await createCollection(userId, data);
  revalidatePath("/collection");
  return collection;
}

export async function deleteCollectionAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await deleteCollection(id, userId);
  revalidatePath("/collection");
}
```

- [ ] **Step 2: Create items server actions**

Create `src/lib/actions/items.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import {
  createItem,
  deleteItem,
  getItemById,
  getItemsByUser,
  getItemCountByUser,
  getTopItemsByValue,
} from "@/lib/db/queries/items";
import { logActivity } from "@/lib/db/queries/activity";
import { revalidatePath } from "next/cache";

export async function getItemsAction(options?: {
  search?: string;
  grade?: string;
  category?: string;
  page?: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemsByUser(userId, options);
}

export async function getItemCountAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemCountByUser(userId);
}

export async function getItemDetailAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getItemById(id, userId);
}

export async function getTopItemsAction(limit?: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getTopItemsByValue(userId, limit);
}

export async function createItemAction(data: {
  collectionId: string;
  pricechartingId?: number;
  name: string;
  variant?: string;
  grade?: string;
  gradingService?: string;
  certNumber?: string;
  purchasePrice?: string;
  purchaseDate?: string;
  notes?: string;
  imageUrl?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const item = await createItem({ ...data, userId });

  await logActivity({
    userId,
    type: "item_added",
    itemId: item.id,
    metadata: { name: data.name, grade: data.grade },
  });

  revalidatePath("/collection");
  revalidatePath("/dashboard");
  return item;
}

export async function deleteItemAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const item = await getItemById(id, userId);
  if (item) {
    await logActivity({
      userId,
      type: "item_removed",
      itemId: id,
      metadata: { name: item.item.name },
    });
  }

  await deleteItem(id, userId);
  revalidatePath("/collection");
  revalidatePath("/dashboard");
}
```

- [ ] **Step 3: Create wishlist server actions**

Create `src/lib/actions/wishlist.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getWishlistByUser,
  createWishlistItem,
  deleteWishlistItem,
  updateWishlistAlerts,
} from "@/lib/db/queries/wishlist";
import { revalidatePath } from "next/cache";

export async function getWishlistAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getWishlistByUser(userId);
}

export async function createWishlistItemAction(data: {
  pricechartingId?: number;
  name: string;
  targetPrice?: string;
  notes?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const item = await createWishlistItem({ ...data, userId });
  revalidatePath("/wishlist");
  revalidatePath("/dashboard");
  return item;
}

export async function deleteWishlistItemAction(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await deleteWishlistItem(id, userId);
  revalidatePath("/wishlist");
}

export async function toggleWishlistAlertsAction(
  id: string,
  enabled: boolean
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await updateWishlistAlerts(id, userId, enabled);
  revalidatePath("/wishlist");
}
```

- [ ] **Step 4: Create preferences server actions**

Create `src/lib/actions/preferences.ts`:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getPreferences,
  upsertPreferences,
} from "@/lib/db/queries/preferences";
import { revalidatePath } from "next/cache";

export async function getPreferencesAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return getPreferences(userId);
}

export async function updatePreferencesAction(data: {
  emailAlertsEnabled?: boolean;
  defaultView?: string;
  defaultCategory?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  await upsertPreferences(userId, data);
  revalidatePath("/settings");
}
```

- [ ] **Step 5: Create format utilities**

Create `src/lib/utils/format.ts`:

```typescript
export function formatCurrency(
  value: string | number | null | undefined
): string {
  if (value == null) return "$0.00";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatCompactCurrency(
  value: string | number | null | undefined
): string {
  if (value == null) return "$0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "$0";
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
  return formatCurrency(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add server actions and format utilities"
```

---

### Task 8: Collection Page

**Files:**
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/collection/item-card.tsx`
- Create: `src/components/collection/filter-bar.tsx`
- Modify: `src/app/(app)/collection/page.tsx`

- [ ] **Step 1: Create grade badge component**

Create `src/components/ui/badge.tsx`:

```typescript
import { cn } from "@/lib/utils/cn";

const gradeColors: Record<string, string> = {
  PSA: "bg-tertiary text-on-tertiary",
  CGC: "bg-secondary text-on-secondary",
  BGS: "bg-tertiary text-on-tertiary",
  WATA: "bg-primary text-on-primary",
};

export function GradeBadge({
  grade,
  gradingService,
  className,
}: {
  grade?: string | null;
  gradingService?: string | null;
  className?: string;
}) {
  if (!grade) return null;
  const colorClass =
    gradeColors[gradingService ?? ""] ?? "bg-tertiary text-on-tertiary";

  return (
    <div
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-black font-label shadow-lg",
        colorClass,
        className
      )}
    >
      {grade}
    </div>
  );
}
```

- [ ] **Step 2: Create item card component**

Create `src/components/collection/item-card.tsx`:

```typescript
import Link from "next/link";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { ItemWithProduct } from "@/lib/db/queries/items";

export function ItemCard({ data }: { data: ItemWithProduct }) {
  const { item, product } = data;
  const currentValue = product?.currentPrice;

  return (
    <Link href={`/collection/${item.id}`} className="group">
      <div className="relative bg-surface-container rounded-xl overflow-visible transition-all duration-300 hover:scale-[1.02] hover:bg-surface-container-high shadow-[0_24px_40px_rgba(30,107,199,0.04)]">
        <div className="absolute -top-4 -right-2 z-10 rotate-[8deg]">
          <GradeBadge grade={item.grade} gradingService={item.gradingService} />
        </div>
        <div className="p-4 pt-0">
          <div className="relative -mt-6 mb-4 rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-[1.02]">
            {item.imageUrl || product?.imageUrl ? (
              <img
                src={item.imageUrl ?? product?.imageUrl ?? ""}
                alt={item.name}
                className="w-full aspect-[3/4] object-cover"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-outline">
                  image
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2 px-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">
                  {item.name}
                </h3>
                <p className="font-body text-xs text-on-surface-variant">
                  {item.variant}
                </p>
              </div>
              {currentValue && (
                <span className="bg-primary-container/20 text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/10 font-label">
                  {formatCurrency(currentValue)}
                </span>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between border-t border-outline-variant/10">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-gray-500 font-label">
                  Market Trend
                </span>
                <span className="text-tertiary text-xs font-bold">—</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Create filter bar component**

Create `src/components/collection/filter-bar.tsx`:

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/collection?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <section className="mb-8 bg-surface-container-low rounded-2xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <label className="font-label text-[10px] uppercase text-gray-500 px-1">
          Grade
        </label>
        <select
          className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 pl-3 pr-10 focus:ring-1 focus:ring-primary text-on-surface"
          value={searchParams.get("grade") ?? "all"}
          onChange={(e) => updateParam("grade", e.target.value)}
        >
          <option value="all">All Grades</option>
          <option value="PSA 10">PSA 10 (Gem Mint)</option>
          <option value="PSA 9">PSA 9 (Mint)</option>
          <option value="BGS 10">BGS 10 (Pristine)</option>
          <option value="CGC 9.8">CGC 9.8</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-label text-[10px] uppercase text-gray-500 px-1">
          Search
        </label>
        <input
          className="bg-surface-container-high border-none text-sm font-body rounded-lg py-2 px-3 focus:ring-1 focus:ring-primary text-on-surface w-48 placeholder:text-outline/50"
          placeholder="Search items..."
          defaultValue={searchParams.get("search") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParam("search", (e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
      <div className="ml-auto self-end flex gap-2">
        <button className="p-2 bg-surface-container-highest rounded-lg text-primary">
          <span className="material-symbols-outlined">grid_view</span>
        </button>
        <button className="p-2 hover:bg-surface-container-highest rounded-lg text-gray-500">
          <span className="material-symbols-outlined">list</span>
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create collection page**

Create `src/app/(app)/collection/page.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { getItemsByUser, getItemCountByUser } from "@/lib/db/queries/items";
import { ItemCard } from "@/components/collection/item-card";
import { FilterBar } from "@/components/collection/filter-bar";
import Link from "next/link";

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const params = await searchParams;
  const page = parseInt(params.page ?? "1");
  const items = await getItemsByUser(userId, {
    search: params.search,
    grade: params.grade,
    page,
    pageSize: 20,
  });
  const totalCount = await getItemCountByUser(userId);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <header className="mb-12 relative">
        <div className="max-w-4xl">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface tracking-tighter mb-4">
            MINT <span className="text-primary italic">STATE</span>
          </h1>
          <p className="font-body text-lg text-on-surface-variant max-w-xl">
            Your high-end digital gallery of graded assets, legendary comics,
            and secret rare gaming cards.
          </p>
        </div>
      </header>

      <FilterBar />

      {items.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">
            style
          </span>
          <h3 className="font-headline text-xl font-bold mb-2">
            No items yet
          </h3>
          <p className="text-on-surface-variant mb-6">
            Start building your collection by adding your first asset.
          </p>
          <Link
            href="/add-item"
            className="inline-flex items-center gap-2 holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-6 rounded-lg"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add First Asset
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((data) => (
              <ItemCard key={data.item.id} data={data} />
            ))}
          </div>
          <div className="mt-16 flex items-center justify-between bg-surface-container-low rounded-2xl p-6">
            <div className="flex items-center gap-4">
              {page > 1 && (
                <Link
                  href={`/collection?page=${page - 1}`}
                  className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </Link>
              )}
              <span className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                {page}
              </span>
              {items.length === 20 && (
                <Link
                  href={`/collection?page=${page + 1}`}
                  className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center text-gray-500"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </Link>
              )}
            </div>
            <p className="font-label text-xs text-gray-500 uppercase tracking-widest">
              Showing {items.length} of {totalCount} assets
            </p>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify collection page renders**

```bash
npm run dev
```

Navigate to `/collection`. Should show empty state with "Add First Asset" button.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add collection page with item cards, filters, and pagination"
```

---

### Task 9: Item Detail Page

**Files:**
- Create: `src/app/(app)/collection/[id]/page.tsx`
- Create: `src/components/charts/price-history-chart.tsx`

- [ ] **Step 1: Create price history chart component**

Create `src/components/charts/price-history-chart.tsx`:

```typescript
"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils/format";

type SnapshotData = {
  date: string;
  price: number;
};

export function PriceHistoryChart({ data }: { data: SnapshotData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-outline">
        No price history available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fabd00" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#fabd00" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: "#8c919e", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8c919e", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            background: "#1f2020",
            border: "1px solid #424752",
            borderRadius: "8px",
            color: "#e4e2e1",
          }}
          formatter={(value: number) => [formatCurrency(value), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke="#fabd00"
          strokeWidth={3}
          fill="url(#priceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

- [ ] **Step 2: Create item detail page**

Create `src/app/(app)/collection/[id]/page.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/db/queries/items";
import { getSnapshotsByProduct } from "@/lib/db/queries/snapshots";
import { GradeBadge } from "@/components/ui/badge";
import { PriceHistoryChart } from "@/components/charts/price-history-chart";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Link from "next/link";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const { id } = await params;
  const data = await getItemById(id, userId);
  if (!data) notFound();

  const { item, product } = data;

  let snapshots: { date: string; price: number }[] = [];
  if (product) {
    const raw = await getSnapshotsByProduct(product.id);
    snapshots = raw.map((s) => ({
      date: formatDate(s.recordedAt),
      price: parseFloat(s.price),
    }));
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <Link
        href="/collection"
        className="inline-flex items-center gap-2 text-outline hover:text-primary transition-colors mb-8"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="font-headline text-xs uppercase tracking-widest">
          Back to Collection
        </span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Image Section */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden bg-surface-container-low p-4 aspect-[3/4] flex items-center justify-center">
            {item.imageUrl || product?.imageUrl ? (
              <img
                src={item.imageUrl ?? product?.imageUrl ?? ""}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="material-symbols-outlined text-8xl text-outline">
                image
              </span>
            )}
            {item.certNumber && item.gradingService && (
              <div className="absolute top-8 right-8 glass-effect px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-tertiary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
                <span className="font-label text-xs font-bold tracking-widest uppercase text-on-primary-container">
                  Verified Asset
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-6 flex flex-col space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <GradeBadge
                grade={item.grade}
                gradingService={item.gradingService}
              />
              {item.certNumber && (
                <span className="font-label text-sm text-outline-variant">
                  #{item.certNumber}
                </span>
              )}
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-on-surface">
              {item.name}
            </h1>
            {item.variant && (
              <p className="text-xl font-headline text-primary font-medium">
                {item.variant}
              </p>
            )}
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-surface-container-low flex flex-col justify-between h-32">
              <span className="font-label text-xs uppercase tracking-widest text-outline">
                Current Market Value
              </span>
              <span className="text-3xl font-headline font-bold text-on-surface">
                {product?.currentPrice
                  ? formatCurrency(product.currentPrice)
                  : "—"}
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-surface-container-low flex flex-col justify-between h-32">
              <span className="font-label text-xs uppercase tracking-widest text-outline">
                Purchase Price
              </span>
              <span className="text-3xl font-headline font-bold text-on-surface">
                {item.purchasePrice
                  ? formatCurrency(item.purchasePrice)
                  : "—"}
              </span>
            </div>
          </div>

          {/* Price History Chart */}
          <div className="p-8 rounded-3xl bg-surface-container border border-outline-variant/15">
            <h3 className="font-headline font-bold text-xl mb-6">
              Market Performance
            </h3>
            <PriceHistoryChart data={snapshots} />
          </div>

          {/* Description */}
          {item.notes && (
            <div className="pt-8 border-t border-outline-variant/15 space-y-4">
              <h4 className="font-headline font-bold text-lg uppercase tracking-widest text-primary">
                The Grail Narrative
              </h4>
              <p className="text-on-surface-variant leading-relaxed font-body">
                {item.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3">
            {item.gradingService && (
              <div className="flex justify-between py-2 border-b border-outline-variant/10">
                <span className="text-gray-500 text-sm">Grading Service</span>
                <span className="text-on-surface font-semibold text-sm">
                  {item.gradingService}
                </span>
              </div>
            )}
            {item.purchaseDate && (
              <div className="flex justify-between py-2 border-b border-outline-variant/10">
                <span className="text-gray-500 text-sm">Purchase Date</span>
                <span className="text-on-surface font-semibold text-sm">
                  {formatDate(item.purchaseDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify item detail page**

```bash
npm run dev
```

Navigate to `/collection/some-id`. Should show 404 (no items yet). After adding items in later tasks, this page will render the full detail view.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add item detail page with price history chart"
```

---

## Phase 3: PriceCharting Integration

### Task 10: PriceCharting Scraper

**Files:**
- Create: `src/lib/scraper/pricecharting.ts`
- Create: `src/lib/scraper/cache.ts`
- Create: `src/lib/actions/search.ts`

- [ ] **Step 1: Create scraper cache utility**

Create `src/lib/scraper/cache.ts`:

```typescript
const cache = new Map<string, { data: unknown; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}
```

- [ ] **Step 2: Create PriceCharting scraper**

Create `src/lib/scraper/pricecharting.ts`:

```typescript
import * as cheerio from "cheerio";
import { getCached, setCache } from "./cache";

const BASE_URL = "https://www.pricecharting.com";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export type PricechartingSearchResult = {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
  url: string;
};

export type PricechartingDetail = {
  externalId: string;
  name: string;
  category: string;
  price: string | null;
  imageUrl: string | null;
  variants: { name: string; url: string }[];
  metadata: Record<string, unknown>;
};

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

export async function searchProducts(
  query: string
): Promise<PricechartingSearchResult[]> {
  const cacheKey = `pc-search:${query}`;
  const cached = getCached<PricechartingSearchResult[]>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/search-products?q=${encodeURIComponent(query)}&type=prices`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const results: PricechartingSearchResult[] = [];

  $("table#games_table tbody tr").each((_, row) => {
    const $row = $(row);
    const titleLink = $row.find("td.title a");
    const name = titleLink.text().trim();
    const href = titleLink.attr("href") ?? "";
    const externalId = href.split("/").pop() ?? "";
    const imageUrl = $row.find("td.title img").attr("src") ?? null;
    const priceText = $row.find("td.price span.js-price").first().text().trim();
    const price = priceText.replace("$", "").replace(",", "") || null;
    const consoleName = $row.find("td.console-name").text().trim().toLowerCase();

    let category = "games";
    if (
      consoleName.includes("pokemon") ||
      consoleName.includes("magic") ||
      consoleName.includes("yugioh") ||
      consoleName.includes("trading card")
    ) {
      category = "tcg";
    } else if (consoleName.includes("comic")) {
      category = "comics";
    }

    if (name) {
      results.push({
        externalId,
        name,
        category,
        price,
        imageUrl,
        url: `${BASE_URL}${href}`,
      });
    }
  });

  setCache(cacheKey, results, CACHE_TTL);
  return results;
}

export async function getProductDetail(
  slug: string
): Promise<PricechartingDetail | null> {
  const cacheKey = `pc-detail:${slug}`;
  const cached = getCached<PricechartingDetail>(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/game/${slug}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const name = $("h1#product_name").text().trim();
  if (!name) return null;

  const imageUrl =
    $("div#product_image img").attr("src") ??
    $("meta[property='og:image']").attr("content") ??
    null;

  const priceText = $("td#used_price span.js-price").first().text().trim();
  const price = priceText.replace("$", "").replace(",", "") || null;

  const category = "games"; // Default, refined by search context

  const variants: { name: string; url: string }[] = [];
  $("table#attribute_table tbody tr").each((_, row) => {
    const $row = $(row);
    const variantName = $row.find("td a").first().text().trim();
    const variantHref = $row.find("td a").first().attr("href") ?? "";
    if (variantName) {
      variants.push({ name: variantName, url: `${BASE_URL}${variantHref}` });
    }
  });

  const detail: PricechartingDetail = {
    externalId: slug,
    name,
    category,
    price,
    imageUrl,
    variants,
    metadata: {},
  };

  setCache(cacheKey, detail, CACHE_TTL);
  return detail;
}
```

- [ ] **Step 3: Create search server action**

Create `src/lib/actions/search.ts`:

```typescript
"use server";

import { searchProducts } from "@/lib/scraper/pricecharting";
import { upsertProduct } from "@/lib/db/queries/products";

export async function searchPricechartingAction(query: string) {
  if (!query || query.length < 2) return [];

  const results = await searchProducts(query);

  // Upsert top results into our database for caching
  for (const result of results.slice(0, 10)) {
    await upsertProduct({
      externalId: result.externalId,
      name: result.name,
      category: result.category,
      currentPrice: result.price ?? undefined,
      imageUrl: result.imageUrl ?? undefined,
    });
  }

  return results;
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add PriceCharting scraper with search and detail functions"
```

---

### Task 11: Add Item Wizard

**Files:**
- Create: `src/app/(app)/add-item/page.tsx`
- Create: `src/components/add-item/search-step.tsx`
- Create: `src/components/add-item/metadata-step.tsx`
- Create: `src/components/add-item/valuation-step.tsx`

- [ ] **Step 1: Create search step component**

Create `src/components/add-item/search-step.tsx`:

```typescript
"use client";

import { useState, useTransition } from "react";
import { searchPricechartingAction } from "@/lib/actions/search";
import type { PricechartingSearchResult } from "@/lib/scraper/pricecharting";
import { formatCurrency } from "@/lib/utils/format";

type Props = {
  onSelect: (result: PricechartingSearchResult) => void;
  onManualEntry: () => void;
};

export function SearchStep({ onSelect, onManualEntry }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PricechartingSearchResult[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSearch() {
    if (!query.trim()) return;
    startTransition(async () => {
      const data = await searchPricechartingAction(query);
      setResults(data);
    });
  }

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8 bg-surface-container-highest/30 self-start px-4 py-2 rounded-full w-fit border border-outline-variant/10">
          <span className="material-symbols-outlined text-tertiary">bolt</span>
          <span className="text-[11px] font-label font-black uppercase tracking-[0.2em] text-tertiary">
            PriceCharting Integrated
          </span>
        </div>

        <div className="relative group mb-12">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary text-3xl">
            search
          </span>
          <input
            className="w-full bg-surface-container border-none py-6 pl-20 pr-8 rounded-2xl text-xl font-headline focus:ring-2 focus:ring-primary/40 placeholder:text-outline/50"
            placeholder="Search Card Name, Comic Issue, or Retro Game..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {isPending && (
          <div className="text-center py-12 text-outline">Searching...</div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div
              className="md:col-span-7 group cursor-pointer"
              onClick={() => onSelect(results[0])}
            >
              <div className="relative rounded-2xl overflow-hidden bg-surface-container h-[400px] flex items-center justify-center hover:ring-2 ring-tertiary transition-all duration-300">
                {results[0].imageUrl ? (
                  <img
                    src={results[0].imageUrl}
                    alt={results[0].name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <span className="material-symbols-outlined text-8xl text-outline">
                    image
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-tertiary text-on-tertiary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded mb-3 inline-block">
                    Top Match
                  </span>
                  <h3 className="text-2xl font-headline font-bold text-white mb-1">
                    {results[0].name}
                  </h3>
                  <p className="text-on-surface-variant font-label text-sm">
                    {results[0].category.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col gap-6">
              <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/5">
                <h4 className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-4">
                  Market Snapshot
                </h4>
                <p className="text-xs text-on-surface-variant mb-1">Value</p>
                <p className="text-2xl font-headline font-bold text-primary">
                  {results[0].price
                    ? formatCurrency(results[0].price)
                    : "N/A"}
                </p>
              </div>

              <div className="flex-1 bg-surface-container rounded-2xl p-6 border border-outline-variant/5 overflow-y-auto max-h-64">
                <h4 className="text-[10px] font-label font-bold uppercase tracking-widest text-outline mb-4">
                  Other Results
                </h4>
                <div className="space-y-3">
                  {results.slice(1, 8).map((result) => (
                    <div
                      key={result.externalId}
                      className="flex items-center gap-4 p-2 rounded-lg hover:bg-surface-container-highest cursor-pointer transition-colors border-l-2 border-transparent hover:border-primary"
                      onClick={() => onSelect(result)}
                    >
                      <div>
                        <p className="text-xs font-bold font-headline text-on-surface">
                          {result.name}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-label">
                          {result.price
                            ? formatCurrency(result.price)
                            : "N/A"}
                        </p>
                      </div>
                      <span className="material-symbols-outlined ml-auto text-on-surface-variant">
                        chevron_right
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {!isPending && results.length === 0 && query && (
          <div className="text-center py-12 text-outline">
            No results found. Try a different search or use manual entry.
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create metadata step component**

Create `src/components/add-item/metadata-step.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import { getCollectionsAction } from "@/lib/actions/collections";

type Collection = { id: string; name: string };

type Props = {
  selectedProduct: { name: string; imageUrl: string | null } | null;
  onSubmit: (data: {
    collectionId: string;
    grade?: string;
    gradingService?: string;
    certNumber?: string;
    purchasePrice?: string;
    purchaseDate?: string;
    notes?: string;
  }) => void;
  onBack: () => void;
};

export function MetadataStep({ selectedProduct, onSubmit, onBack }: Props) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [grade, setGrade] = useState("");
  const [gradingService, setGradingService] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getCollectionsAction().then((c) => {
      setCollections(c);
      if (c.length > 0) setCollectionId(c[0].id);
    });
  }, []);

  function handleSubmit() {
    onSubmit({
      collectionId: collectionId || "new:" + newCollectionName,
      grade: grade || undefined,
      gradingService: gradingService || undefined,
      certNumber: certNumber || undefined,
      purchasePrice: purchasePrice || undefined,
      purchaseDate: purchaseDate || undefined,
      notes: notes || undefined,
    });
  }

  return (
    <div className="bg-surface-container-low rounded-3xl p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-6">
        {selectedProduct?.imageUrl && (
          <img
            src={selectedProduct.imageUrl}
            alt={selectedProduct.name}
            className="w-24 h-32 object-cover rounded-xl"
          />
        )}
        <div>
          <h3 className="font-headline text-2xl font-bold">
            {selectedProduct?.name ?? "Manual Entry"}
          </h3>
          <p className="text-on-surface-variant text-sm">
            Add grading and purchase details
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Collection
          </label>
          {collections.length > 0 ? (
            <select
              className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="">+ New Collection</option>
            </select>
          ) : (
            <input
              className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
              placeholder="Collection name (e.g., Pokemon Cards)"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          )}
          {collectionId === "" && collections.length > 0 && (
            <input
              className="w-full mt-2 bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
              placeholder="New collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          )}
        </div>

        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Grading Service
          </label>
          <select
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary"
            value={gradingService}
            onChange={(e) => setGradingService(e.target.value)}
          >
            <option value="">None / Ungraded</option>
            <option value="PSA">PSA</option>
            <option value="CGC">CGC</option>
            <option value="BGS">BGS (Beckett)</option>
            <option value="WATA">WATA</option>
          </select>
        </div>

        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Grade
          </label>
          <input
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
            placeholder="e.g., PSA 10, CGC 9.8"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Cert Number
          </label>
          <input
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
            placeholder="Certificate number"
            value={certNumber}
            onChange={(e) => setCertNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Purchase Price
          </label>
          <input
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50"
            placeholder="$0.00"
            type="number"
            step="0.01"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </div>

        <div>
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Purchase Date
          </label>
          <input
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-label text-[10px] uppercase text-gray-500 block mb-2">
            Notes
          </label>
          <textarea
            className="w-full bg-surface-container border-none rounded-xl py-3 px-4 text-on-surface focus:ring-1 focus:ring-primary placeholder:text-outline/50 h-24 resize-none"
            placeholder="Any notes about this item..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-white font-headline uppercase tracking-widest text-xs font-bold flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="holographic-gradient text-white font-headline py-4 px-12 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 active:scale-95 transition-all"
        >
          Confirm & Next
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create valuation step component**

Create `src/components/add-item/valuation-step.tsx`:

```typescript
"use client";

import { formatCurrency } from "@/lib/utils/format";

type Props = {
  itemName: string;
  imageUrl: string | null;
  marketValue: string | null;
  purchasePrice: string | undefined;
  onConfirm: () => void;
  onBack: () => void;
  isPending: boolean;
};

export function ValuationStep({
  itemName,
  imageUrl,
  marketValue,
  purchasePrice,
  onConfirm,
  onBack,
  isPending,
}: Props) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-6 md:p-10 space-y-8">
      <div className="text-center">
        <h3 className="font-headline text-3xl font-bold mb-2">
          Confirm Your Asset
        </h3>
        <p className="text-on-surface-variant">
          Review the details before adding to your vault.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={itemName}
            className="w-48 h-64 object-cover rounded-2xl shadow-2xl"
          />
        )}
        <h4 className="font-headline text-2xl font-bold">{itemName}</h4>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        <div className="bg-surface-container p-6 rounded-2xl text-center">
          <p className="text-[10px] font-label text-outline uppercase mb-2">
            Market Value
          </p>
          <p className="text-2xl font-headline font-bold text-primary">
            {marketValue ? formatCurrency(marketValue) : "N/A"}
          </p>
        </div>
        <div className="bg-surface-container p-6 rounded-2xl text-center">
          <p className="text-[10px] font-label text-outline uppercase mb-2">
            Your Cost
          </p>
          <p className="text-2xl font-headline font-bold text-tertiary">
            {purchasePrice ? formatCurrency(purchasePrice) : "N/A"}
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="text-on-surface-variant hover:text-white font-headline uppercase tracking-widest text-xs font-bold flex items-center gap-2"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="holographic-gradient text-white font-headline py-4 px-12 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add to Vault"}
          <span className="material-symbols-outlined">check_circle</span>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create add item page (orchestrator)**

Create `src/app/(app)/add-item/page.tsx`:

```typescript
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchStep } from "@/components/add-item/search-step";
import { MetadataStep } from "@/components/add-item/metadata-step";
import { ValuationStep } from "@/components/add-item/valuation-step";
import { createItemAction } from "@/lib/actions/items";
import { createCollectionAction } from "@/lib/actions/collections";
import type { PricechartingSearchResult } from "@/lib/scraper/pricecharting";

type Step = "search" | "metadata" | "valuation";

export default function AddItemPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("search");
  const [selectedProduct, setSelectedProduct] =
    useState<PricechartingSearchResult | null>(null);
  const [metadataValues, setMetadataValues] = useState<Record<string, string>>(
    {}
  );
  const [isPending, startTransition] = useTransition();

  const steps: { key: Step; icon: string; label: string }[] = [
    { key: "search", icon: "search", label: "Search" },
    { key: "metadata", icon: "edit_note", label: "Metadata" },
    { key: "valuation", icon: "payments", label: "Valuation" },
  ];

  function handleProductSelect(result: PricechartingSearchResult) {
    setSelectedProduct(result);
    setStep("metadata");
  }

  function handleMetadataSubmit(data: Record<string, string | undefined>) {
    setMetadataValues(data as Record<string, string>);
    setStep("valuation");
  }

  function handleConfirm() {
    startTransition(async () => {
      let collectionId = metadataValues.collectionId;

      // Create new collection if needed
      if (collectionId.startsWith("new:")) {
        const name = collectionId.replace("new:", "");
        const collection = await createCollectionAction({ name });
        collectionId = collection.id;
      }

      await createItemAction({
        collectionId,
        name: selectedProduct?.name ?? metadataValues.name ?? "Unknown Item",
        pricechartingId: selectedProduct
          ? parseInt(selectedProduct.externalId) || undefined
          : undefined,
        variant: metadataValues.variant,
        grade: metadataValues.grade,
        gradingService: metadataValues.gradingService,
        certNumber: metadataValues.certNumber,
        purchasePrice: metadataValues.purchasePrice,
        purchaseDate: metadataValues.purchaseDate,
        notes: metadataValues.notes,
        imageUrl: selectedProduct?.imageUrl ?? undefined,
      });

      router.push("/collection");
    });
  }

  return (
    <div className="px-4 md:px-12 py-10 max-w-6xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step === s.key
                    ? "holographic-gradient text-on-primary-fixed ring-4 ring-primary/20"
                    : steps.indexOf(steps.find((x) => x.key === step)!) > i
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-container-highest text-on-surface-variant opacity-40"
                }`}
              >
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <span
                className={`text-[10px] font-label font-bold uppercase tracking-widest ${step === s.key ? "text-primary" : "opacity-40"}`}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-[2px] flex-1 bg-surface-container-highest mx-4 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-on-surface tracking-tighter mb-4">
          Identify Your <span className="text-primary italic">Treasure</span>
        </h1>
        <p className="text-on-surface-variant max-w-xl text-lg">
          Connect to PriceCharting to pull market data and variants for your
          asset.
        </p>
      </div>

      {/* Steps */}
      {step === "search" && (
        <SearchStep
          onSelect={handleProductSelect}
          onManualEntry={() => setStep("metadata")}
        />
      )}
      {step === "metadata" && (
        <MetadataStep
          selectedProduct={
            selectedProduct
              ? { name: selectedProduct.name, imageUrl: selectedProduct.imageUrl }
              : null
          }
          onSubmit={handleMetadataSubmit}
          onBack={() => setStep("search")}
        />
      )}
      {step === "valuation" && (
        <ValuationStep
          itemName={selectedProduct?.name ?? "Custom Item"}
          imageUrl={selectedProduct?.imageUrl ?? null}
          marketValue={selectedProduct?.price ?? null}
          purchasePrice={metadataValues.purchasePrice}
          onConfirm={handleConfirm}
          onBack={() => setStep("metadata")}
          isPending={isPending}
        />
      )}

      {/* Bottom Actions */}
      {step === "search" && (
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <button
            onClick={() => router.push("/collection")}
            className="flex items-center gap-2 text-on-surface-variant hover:text-white font-headline uppercase tracking-widest text-xs font-bold"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Cancel and Return
          </button>
          <button
            onClick={() => setStep("metadata")}
            className="border-2 border-outline-variant/20 hover:border-primary/50 text-on-surface font-headline py-4 px-10 rounded-xl font-bold uppercase tracking-widest text-xs transition-all active:scale-95"
          >
            Manual Entry
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Verify add item flow**

```bash
npm run dev
```

Navigate to `/add-item`. Search for "Charizard". Results should appear (if PriceCharting is accessible). Select one, fill metadata, confirm, and verify redirect to `/collection`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add 3-step Add Item wizard with PriceCharting search"
```

---

## Phase 4: Dashboard

### Task 12: Dashboard Page

**Files:**
- Create: `src/components/dashboard/portfolio-summary.tsx`
- Create: `src/components/dashboard/premium-rarities.tsx`
- Create: `src/components/dashboard/vault-history.tsx`
- Create: `src/components/dashboard/price-watch.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`

- [ ] **Step 1: Create portfolio summary component**

Create `src/components/dashboard/portfolio-summary.tsx`:

```typescript
import { formatCurrency } from "@/lib/utils/format";

type Props = {
  totalValue: number;
  itemCount: number;
};

export function PortfolioSummary({ totalValue, itemCount }: Props) {
  return (
    <div className="md:col-span-2 relative overflow-hidden rounded-xl bg-surface-container-low p-8 flex flex-col justify-between min-h-[300px]">
      <div className="absolute -right-12 -top-12 opacity-20 pointer-events-none">
        <span
          className="material-symbols-outlined text-[240px] text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          shield_with_heart
        </span>
      </div>
      <div>
        <span className="text-tertiary font-headline font-bold uppercase tracking-widest text-xs">
          Portfolio Performance
        </span>
        <h2 className="text-5xl font-headline font-black text-white mt-2 tracking-tight">
          {formatCurrency(totalValue)}
        </h2>
      </div>
      <div className="flex gap-4 mt-8">
        <div className="bg-surface-container p-4 rounded-lg flex-1 ghost-border">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
            Graded Assets
          </p>
          <p className="text-2xl font-headline font-bold">{itemCount}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create premium rarities component**

Create `src/components/dashboard/premium-rarities.tsx`:

```typescript
import Link from "next/link";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { ItemWithProduct } from "@/lib/db/queries/items";

export function PremiumRarities({ items }: { items: ItemWithProduct[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-xl font-headline font-bold mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-tertiary">
          auto_awesome
        </span>
        Premium Rarities
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ item, product }) => (
          <Link
            key={item.id}
            href={`/collection/${item.id}`}
            className="group bg-surface-container rounded-xl overflow-visible relative p-4 transition-all hover:bg-surface-container-high shadow-[0_24px_40px_rgba(30,107,199,0.04)]"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-44 rounded-lg overflow-hidden shadow-2xl transition-transform group-hover:scale-105 group-hover:-translate-y-2 z-10">
              {(item.imageUrl || product?.imageUrl) ? (
                <img
                  src={item.imageUrl ?? product?.imageUrl ?? ""}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-outline">
                    image
                  </span>
                </div>
              )}
            </div>
            <div className="mt-40 text-center">
              <GradeBadge
                grade={item.grade}
                gradingService={item.gradingService}
                className="text-[10px] inline-block mb-1"
              />
              <h4 className="font-headline font-bold text-lg mt-1">
                {item.name}
              </h4>
              <p className="text-sm text-gray-500 mb-4">{item.variant}</p>
              <div className="flex justify-between items-center pt-4 border-t border-outline-variant/15">
                <span className="font-label font-bold text-sm">
                  {product?.currentPrice
                    ? formatCurrency(product.currentPrice)
                    : "—"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create vault history component**

Create `src/components/dashboard/vault-history.tsx`:

```typescript
import { formatRelativeTime } from "@/lib/utils/format";

type Activity = {
  id: number;
  type: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

const typeConfig: Record<string, { icon: string; color: string; label: string }> = {
  item_added: { icon: "shopping_bag", color: "text-tertiary", label: "Asset Added" },
  item_removed: { icon: "delete", color: "text-error", label: "Asset Removed" },
  item_sold: { icon: "sell", color: "text-secondary", label: "Asset Sold" },
  grade_verified: { icon: "verified", color: "text-primary", label: "Grade Verified" },
};

export function VaultHistory({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-outline">
        No recent activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const config = typeConfig[activity.type] ?? {
          icon: "info",
          color: "text-outline",
          label: activity.type,
        };
        const name = (activity.metadata?.name as string) ?? "Unknown item";

        return (
          <div
            key={activity.id}
            className="bg-surface-container-low p-4 rounded-xl flex items-center justify-between ghost-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center">
                <span className={`material-symbols-outlined ${config.color}`}>
                  {config.icon}
                </span>
              </div>
              <div>
                <p className="font-bold text-sm">{config.label}</p>
                <p className="text-xs text-gray-500">{name}</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500">
              {formatRelativeTime(activity.createdAt)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Create price watch component**

Create `src/components/dashboard/price-watch.tsx`:

```typescript
import { formatCurrency } from "@/lib/utils/format";

type WishlistWithProduct = {
  wishlistItem: { id: string; name: string };
  product: { currentPrice: string | null } | null;
};

export function PriceWatch({ items }: { items: WishlistWithProduct[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-outline text-sm">
        Add items to your wishlist to track prices.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.slice(0, 5).map(({ wishlistItem, product }) => (
        <div key={wishlistItem.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-tertiary rounded-full" />
            <div>
              <p className="text-sm font-bold">{wishlistItem.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">
              {product?.currentPrice
                ? formatCurrency(product.currentPrice)
                : "—"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Build dashboard page**

Replace `src/app/(app)/dashboard/page.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { getItemCountByUser, getTopItemsByValue } from "@/lib/db/queries/items";
import { getRecentActivity } from "@/lib/db/queries/activity";
import { getWishlistByUser } from "@/lib/db/queries/wishlist";
import { PortfolioSummary } from "@/components/dashboard/portfolio-summary";
import { PremiumRarities } from "@/components/dashboard/premium-rarities";
import { VaultHistory } from "@/components/dashboard/vault-history";
import { PriceWatch } from "@/components/dashboard/price-watch";
import { db } from "@/lib/db";
import { items, pricechartingProducts } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const [itemCount, topItems, activities, wishlist, totalValueResult] =
    await Promise.all([
      getItemCountByUser(userId),
      getTopItemsByValue(userId, 4),
      getRecentActivity(userId, 5),
      getWishlistByUser(userId),
      db
        .select({
          total: sql<string>`COALESCE(SUM(CAST(${pricechartingProducts.currentPrice} AS NUMERIC)), 0)`,
        })
        .from(items)
        .leftJoin(
          pricechartingProducts,
          eq(items.pricechartingId, pricechartingProducts.id)
        )
        .where(eq(items.userId, userId)),
    ]);

  const totalValue = parseFloat(totalValueResult[0]?.total ?? "0");

  return (
    <div className="px-6 pt-8 max-w-7xl mx-auto space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PortfolioSummary totalValue={totalValue} itemCount={itemCount} />
      </section>

      <PremiumRarities items={topItems} />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-headline font-bold mb-6">
            Vault History
          </h3>
          <VaultHistory activities={activities} />
        </div>
        <div className="bg-surface-container-low rounded-xl p-6 ghost-border">
          <h3 className="text-lg font-headline font-bold mb-6">Price Watch</h3>
          <PriceWatch items={wishlist} />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 6: Verify dashboard**

```bash
npm run dev
```

Navigate to `/dashboard`. Should show portfolio summary (0 items, $0), empty vault history, empty price watch.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add dashboard with portfolio summary, premium rarities, vault history, and price watch"
```

---

## Phase 5: Remaining Pages

### Task 13: Wishlist Page

**Files:**
- Create: `src/app/(app)/wishlist/page.tsx`
- Create: `src/components/wishlist/wishlist-item.tsx`

- [ ] **Step 1: Create wishlist item component**

Create `src/components/wishlist/wishlist-item.tsx`:

```typescript
"use client";

import { useTransition } from "react";
import { GradeBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import {
  deleteWishlistItemAction,
  toggleWishlistAlertsAction,
} from "@/lib/actions/wishlist";

type Props = {
  item: {
    id: string;
    name: string;
    targetPrice: string | null;
    alertsEnabled: boolean;
  };
  product: {
    currentPrice: string | null;
    imageUrl: string | null;
  } | null;
};

export function WishlistItemRow({ item, product }: Props) {
  const [isPending, startTransition] = useTransition();
  const currentPrice = product?.currentPrice
    ? parseFloat(product.currentPrice)
    : null;
  const targetPrice = item.targetPrice ? parseFloat(item.targetPrice) : null;
  const delta =
    currentPrice != null && targetPrice != null
      ? currentPrice - targetPrice
      : null;
  const isOpportunity = delta != null && delta < 0;

  return (
    <div
      className={`group bg-surface-container hover:bg-surface-container-high transition-all duration-300 rounded-xl p-6 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden ${isPending ? "opacity-50" : ""}`}
    >
      {isOpportunity && (
        <div className="absolute right-0 top-0 h-full w-1 bg-tertiary shadow-[0_0_20px_#fabd00]" />
      )}
      <div className="relative shrink-0">
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={item.name}
            className="w-24 lg:w-32 h-32 lg:h-44 object-cover rounded-lg shadow-2xl"
          />
        ) : (
          <div className="w-24 lg:w-32 h-32 lg:h-44 bg-surface-container-highest rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-outline">
              image
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow space-y-4 w-full">
        <div className="flex justify-between items-start">
          <h3 className="font-headline text-2xl font-bold text-on-surface">
            {item.name}
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                startTransition(() =>
                  toggleWishlistAlertsAction(item.id, !item.alertsEnabled)
                )
              }
              className={`w-10 h-5 rounded-full relative cursor-pointer ${item.alertsEnabled ? "bg-primary/20" : "bg-surface-variant"}`}
            >
              <div
                className={`absolute top-1 w-3 h-3 rounded-full transition-all ${item.alertsEnabled ? "right-1 bg-primary" : "left-1 bg-outline"}`}
              />
            </button>
            <button
              onClick={() =>
                startTransition(() => deleteWishlistItemAction(item.id))
              }
              className="material-symbols-outlined text-outline hover:text-error transition-colors"
            >
              delete
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-surface-dim/50 p-3 rounded-lg">
            <span className="text-[10px] font-label text-outline uppercase block mb-1">
              Target Price
            </span>
            <span className="text-xl font-bold font-headline">
              {targetPrice ? formatCurrency(targetPrice) : "—"}
            </span>
          </div>
          <div className="bg-surface-dim/50 p-3 rounded-lg">
            <span className="text-[10px] font-label text-outline uppercase block mb-1">
              Current Value
            </span>
            <span className="text-xl font-bold font-headline">
              {currentPrice ? formatCurrency(currentPrice) : "—"}
            </span>
          </div>
          {delta != null && (
            <div className="bg-surface-dim/50 p-3 rounded-lg">
              <span className="text-[10px] font-label text-outline uppercase block mb-1">
                Price Delta
              </span>
              <span
                className={`text-lg font-bold font-headline flex items-center gap-1 ${delta > 0 ? "text-error" : "text-tertiary"}`}
              >
                <span className="material-symbols-outlined text-base">
                  {delta > 0 ? "trending_up" : "trending_down"}
                </span>
                {delta > 0 ? "+" : ""}
                {formatCurrency(delta)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create wishlist page**

Create `src/app/(app)/wishlist/page.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { getWishlistByUser } from "@/lib/db/queries/wishlist";
import { WishlistItemRow } from "@/components/wishlist/wishlist-item";
import Link from "next/link";

export default async function WishlistPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const wishlist = await getWishlistByUser(userId);

  return (
    <div className="px-6 pt-8 max-w-7xl mx-auto">
      <header className="relative mb-12 overflow-hidden rounded-2xl bg-surface-container-low p-8">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-headline text-5xl font-extrabold text-on-surface mb-4 tracking-tight">
            THE HUNT IS ON.
          </h1>
          <p className="text-on-surface-variant text-lg mb-6">
            Track your most-wanted grails, monitor market dips, and strike when
            the price is right.
          </p>
        </div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      </header>

      <h2 className="font-headline text-3xl font-bold mb-6">
        Target Watchlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">
            auto_awesome
          </span>
          <h3 className="font-headline text-xl font-bold mb-2">
            Watchlist is empty
          </h3>
          <p className="text-on-surface-variant mb-6">
            Add items to your wishlist from the collection or marketplace.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 holographic-gradient text-on-primary-fixed font-headline font-bold py-3 px-6 rounded-lg"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {wishlist.map(({ wishlistItem, product }) => (
            <WishlistItemRow
              key={wishlistItem.id}
              item={wishlistItem}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add wishlist page with price tracking and alert toggles"
```

---

### Task 14: Marketplace, Market Insight, and Settings Pages

**Files:**
- Create: `src/app/(app)/marketplace/page.tsx`
- Create: `src/app/(app)/market-insight/page.tsx`
- Create: `src/app/(app)/settings/page.tsx`

- [ ] **Step 1: Create marketplace page**

Create `src/app/(app)/marketplace/page.tsx`:

```typescript
"use client";

import { useState } from "react";

export default function MarketplacePage() {
  const [query, setQuery] = useState("");

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-headline font-bold tracking-tighter mb-4">
        Marketplace
      </h1>
      <p className="text-on-surface-variant text-lg mb-8">
        Search external marketplaces for collectibles. Results link to eBay and
        other platforms.
      </p>

      <div className="relative mb-8 max-w-2xl">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          search
        </span>
        <input
          className="w-full bg-surface-container border-none py-4 pl-14 pr-6 rounded-2xl text-lg font-headline focus:ring-2 focus:ring-primary/40 placeholder:text-outline/50"
          placeholder="Search eBay for collectibles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="text-center py-20 text-outline">
        <span className="material-symbols-outlined text-6xl mb-4">
          storefront
        </span>
        <p className="font-headline text-lg">
          Search above to find listings on external marketplaces.
        </p>
        <p className="text-sm mt-2">
          eBay integration coming soon. Results will link directly to external
          listings.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create market insight page**

Create `src/app/(app)/market-insight/page.tsx`:

```typescript
export default function MarketInsightPage() {
  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <h1 className="text-5xl font-headline font-bold tracking-tighter mb-4">
        Market <span className="text-primary italic">Insight</span>
      </h1>
      <p className="text-on-surface-variant text-lg mb-12">
        Analytics and trend tracking powered by PriceCharting data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-surface-container-high p-6 rounded-3xl">
          <span className="material-symbols-outlined text-tertiary text-3xl mb-4">
            monitoring
          </span>
          <h4 className="font-headline text-xl font-bold mb-2">
            Trading Card Games
          </h4>
          <p className="text-sm text-on-surface-variant">
            Track Pokemon, Magic: The Gathering, and Yu-Gi-Oh market trends.
          </p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-3xl">
          <span className="material-symbols-outlined text-secondary text-3xl mb-4">
            auto_stories
          </span>
          <h4 className="font-headline text-xl font-bold mb-2">Comics</h4>
          <p className="text-sm text-on-surface-variant">
            Silver Age, Golden Age, and modern key issue price movements.
          </p>
        </div>
        <div className="bg-surface-container-high p-6 rounded-3xl">
          <span className="material-symbols-outlined text-primary text-3xl mb-4">
            sports_esports
          </span>
          <h4 className="font-headline text-xl font-bold mb-2">
            Retro Games
          </h4>
          <p className="text-sm text-on-surface-variant">
            NES, SNES, N64, and other classic console game values.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-3xl p-8">
        <h3 className="font-headline font-bold text-xl mb-6">
          External Tools
        </h3>
        <div className="space-y-3">
          <a
            href="https://www.pricecharting.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <span className="text-sm font-medium">PriceCharting Search</span>
            <span className="material-symbols-outlined text-sm">
              open_in_new
            </span>
          </a>
          <a
            href="https://www.psacard.com/cert"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <span className="text-sm font-medium">PSA Cert Verification</span>
            <span className="material-symbols-outlined text-sm">grading</span>
          </a>
          <a
            href="https://www.ebay.com/sch/i.html?_nkw=collectibles&LH_Complete=1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <span className="text-sm font-medium">eBay Completed Sales</span>
            <span className="material-symbols-outlined text-sm">
              receipt_long
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create settings page**

Create `src/app/(app)/settings/page.tsx`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";
import { getPreferences } from "@/lib/db/queries/preferences";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const preferences = await getPreferences(userId);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-12">
      <h1 className="text-5xl font-headline font-bold tracking-tighter">
        Settings
      </h1>

      <section>
        <h2 className="text-xl font-headline font-bold mb-6">Profile</h2>
        <UserProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              cardBox: "shadow-none bg-surface-container rounded-2xl",
            },
          }}
        />
      </section>

      <section>
        <h2 className="text-xl font-headline font-bold mb-6">Preferences</h2>
        <div className="bg-surface-container rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Email Price Alerts</p>
              <p className="text-xs text-on-surface-variant">
                Get notified when wishlist items drop below target price.
              </p>
            </div>
            <div
              className={`w-12 h-6 rounded-full relative cursor-pointer ${preferences?.emailAlertsEnabled ? "bg-primary/20" : "bg-surface-variant"}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all ${preferences?.emailAlertsEnabled ? "right-1 bg-primary" : "left-1 bg-outline"}`}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Default Collection View</p>
              <p className="text-xs text-on-surface-variant">
                How items appear in your collection.
              </p>
            </div>
            <span className="text-sm text-primary font-medium">
              {preferences?.defaultView ?? "Grid"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add marketplace, market insight, and settings pages"
```

---

## Phase 6: Cron Job & Deployment Config

### Task 15: Price Update Cron Job

**Files:**
- Create: `src/app/api/cron/update-prices/route.ts`
- Create: `vercel.json`

- [ ] **Step 1: Create cron API route**

Create `src/app/api/cron/update-prices/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { items, wishlistItems, pricechartingProducts, priceSnapshots } from "@/lib/db/schema";
import { eq, isNotNull, sql } from "drizzle-orm";
import { getProductDetail } from "@/lib/scraper/pricecharting";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all distinct pricecharting product IDs referenced by items or wishlist
  const itemProductIds = await db
    .selectDistinct({ id: items.pricechartingId })
    .from(items)
    .where(isNotNull(items.pricechartingId));

  const wishlistProductIds = await db
    .selectDistinct({ id: wishlistItems.pricechartingId })
    .from(wishlistItems)
    .where(isNotNull(wishlistItems.pricechartingId));

  const allIds = new Set([
    ...itemProductIds.map((r) => r.id).filter(Boolean),
    ...wishlistProductIds.map((r) => r.id).filter(Boolean),
  ]);

  let updated = 0;
  let errors = 0;

  for (const productId of allIds) {
    try {
      const product = await db
        .select()
        .from(pricechartingProducts)
        .where(eq(pricechartingProducts.id, productId!))
        .limit(1);

      if (!product[0]) continue;

      const detail = await getProductDetail(product[0].externalId);
      if (!detail || !detail.price) continue;

      await db
        .update(pricechartingProducts)
        .set({
          currentPrice: detail.price,
          lastFetchedAt: new Date(),
        })
        .where(eq(pricechartingProducts.id, productId!));

      await db.insert(priceSnapshots).values({
        productId: productId!,
        price: detail.price,
        source: "pricecharting",
      });

      updated++;

      // Rate limit: 1 request per second
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
      errors++;
    }
  }

  return NextResponse.json({
    updated,
    errors,
    total: allIds.size,
  });
}
```

- [ ] **Step 2: Create vercel.json**

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/update-prices",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add price update cron job running every 6 hours"
```

---

### Task 16: Final Setup & Deployment Prep

**Files:**
- Create: `.env.local` (template, not committed)
- Modify: `.gitignore`

- [ ] **Step 1: Update .gitignore**

Ensure `.gitignore` includes:

```
node_modules/
.next/
.env.local
.env
.superpowers/
drizzle/migrations/*.sql
```

- [ ] **Step 2: Create a README with setup instructions**

Create `README.md`:

```markdown
# MINT VAULT

Premium collectible asset tracker for trading cards, comics, and retro games.

## Setup

1. Clone and install dependencies:
   ```bash
   npm install
   ```

2. Create a Neon database at https://neon.tech and copy the connection string.

3. Create a Clerk application at https://clerk.com and copy the keys.

4. Create `.env.local`:
   ```
   DATABASE_URL=postgresql://...
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   CRON_SECRET=your-random-secret
   ```

5. Push database schema:
   ```bash
   npx drizzle-kit push
   ```

6. Run dev server:
   ```bash
   npm run dev
   ```

## Deploy

```bash
npx vercel deploy
```
```

- [ ] **Step 3: Verify full app builds**

```bash
npm run build
```

Expected: Build completes without errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: add README with setup instructions and deployment prep"
```

---

## Summary

**16 tasks across 6 phases:**

| Phase | Tasks | What's built |
|-------|-------|-------------|
| 1: Foundation | 1-5 | Next.js scaffold, Tailwind theme, DB schema, Clerk auth, app shell |
| 2: Collection Core | 6-9 | DB queries, server actions, collection page, item detail |
| 3: PriceCharting | 10-11 | Scraper, add item wizard |
| 4: Dashboard | 12 | Full dashboard with portfolio stats |
| 5: Remaining Pages | 13-14 | Wishlist, marketplace, market insight, settings |
| 6: Deployment | 15-16 | Cron job, vercel.json, README |

Each phase produces a working, deployable application with incrementally more features.
