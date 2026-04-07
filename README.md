# MINT VAULT

Premium collectible asset tracker for trading cards, comics, and retro games.

## Tech Stack

- Next.js 16 (App Router)
- Neon Postgres + Drizzle ORM
- Clerk Authentication
- Tailwind CSS v4
- Recharts
- PriceCharting integration (scraping)
- Vercel deployment with Cron Jobs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Neon database at https://neon.tech

3. Create a Clerk application at https://clerk.com

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

## Deploy to Vercel

```bash
npx vercel deploy
```

The cron job for price updates runs every 6 hours automatically on Vercel.
