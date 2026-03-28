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
