# Miles Apart Prediction League

Private 2026 World Cup prediction app for a single friend group.

## Local development

This project currently uses SQLite for local development so you can keep working without a hosted database.

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. If you change the local SQLite schema:

```bash
npm run db:generate
npm run db:push
```

## Vercel deployment

Production should use Postgres, not SQLite.

### What to create first

- A GitHub repo for this project
- A hosted Postgres database
  - Neon, Supabase, or Vercel Postgres all work
- A Vercel project connected to the repo

### Environment variables in Vercel

Add these in the Vercel project settings:

- `DATABASE_URL`
- `AUTH_SECRET`
- `INVITE_CODE`

Use `.env.example` as the template for the values.

### Deployment flow

The project includes a dedicated Vercel build command that:

1. Generates Prisma Client from the Postgres schema
2. Applies production migrations
3. Builds the Next.js app

Vercel uses:

```bash
npm run vercel-build
```

### First production migration

This repo includes an initial Postgres migration in [`prisma/migrations`](/Users/solomonmekuria/Documents/Playground/prisma/migrations).

When Vercel deploys, it will run:

```bash
npm run db:deploy:prod
```

which applies pending migrations with Prisma Migrate.

### Seed the production match schedule

The production seed path only upserts match fixtures. It does not create demo users or wipe real accounts.

Run it from your machine against the production database:

```bash
DATABASE_URL="your-neon-connection-string" npm run db:seed:prod
```

If you already set `DATABASE_URL` in your shell, just run:

```bash
npm run db:seed:prod
```

### Recommended launch checklist

- Replace the placeholder `AUTH_SECRET`
- Replace the placeholder `INVITE_CODE`
- Create one admin account after the first deploy
- Run the seed script only if you want to populate the match schedule in production
- Keep result entry admin-only

## Useful scripts

- `npm run dev` - local development
- `npm run build` - local production build
- `npm run db:push` - update local SQLite schema
- `npm run db:migrate:prod` - create a new Postgres migration from the production schema
- `npm run db:deploy:prod` - apply Postgres migrations in production
- `npm run db:seed:prod` - upsert the production fixture schedule
- `npm run vercel-build` - Vercel build pipeline
- `npm run matches:sync` - sync fixture changes from the configured JSON feed
- `npm run matches:lock` - lock picks for matches that start within the configured lead time
- `npm run matches:maintain` - run both sync and lock in one pass

## Match maintenance cron

You do not need a separate scheduler per match. A single cron that runs every minute is simpler and reliably locks any game whose kickoff is close.

### What it does

- `matches:sync` checks a fixture feed and updates changed matchups, kickoff times, venues, or lock state in the database
- `matches:lock` locks any match whose kickoff is within `MATCH_LOCK_LEAD_MINUTES` minutes of now
- The app already uses dynamic rendering on the dashboard, so database changes show up on the next request without a rebuild

### Feed format

Set `MATCH_SYNC_URL` to a JSON endpoint that returns either:

- a raw array of matches, or
- an object with a `matches` array

Each fixture can include:

```json
{
  "id": 2,
  "homeTeam": "South Korea",
  "awayTeam": "Ukraine",
  "kickoff": "2026-06-11T22:00:00.000Z"
}
```

A full example lives at `docs/match-sync-feed.example.json`.

### Cron example

Run this every minute on the machine that has access to your production environment variables:

```cron
* * * * * cd /path/to/Playground && /opt/homebrew/bin/npm run matches:maintain >> /tmp/world-cup-picks-cron.log 2>&1
```

If you want to keep syncing less often, split it into two jobs:

```cron
*/15 * * * * cd /path/to/Playground && /opt/homebrew/bin/npm run matches:sync >> /tmp/world-cup-picks-sync.log 2>&1
* * * * * cd /path/to/Playground && /opt/homebrew/bin/npm run matches:lock >> /tmp/world-cup-picks-lock.log 2>&1
```
