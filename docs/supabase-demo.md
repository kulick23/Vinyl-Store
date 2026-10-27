# Supabase demo mode

The frontend can use either the original ASP.NET API or a read-only Supabase
catalog. The API remains the default, so existing deployments do not change
until `VITE_DATA_PROVIDER` is explicitly set to `supabase`.

## Current scope

Supabase mode currently supports:

- genres and artists;
- catalog search and filters;
- release details;
- available listings and seller information.

Authentication, wishlist, cart, orders, admin writes, Discogs imports, and
Stripe are intentionally left on the legacy API for now. Secret-bearing work
must move to authenticated Supabase Edge Functions before those features can be
enabled without the ASP.NET server.

## Create the demo database

1. Create a Supabase project.
2. Run `supabase/migrations/202610270001_catalog_demo.sql` in the SQL Editor.
3. Run `supabase/seed.sql` in the SQL Editor.
4. Copy `FrontEnd/.env.example` to `FrontEnd/.env.local`.
5. Set these public browser variables:

   ```dotenv
   VITE_DATA_PROVIDER=supabase
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```

6. From `FrontEnd`, run `npm install` and `npm run dev`.

For Vercel, add the same three values in Project Settings > Environment
Variables and redeploy.

## Security boundary

The migration enables Row Level Security and grants the browser read-only
catalog access. Never put a Supabase secret/service-role key, Stripe secret, or
Discogs token in a `VITE_` variable. Vite embeds every `VITE_` value into the
browser bundle.

The next migration should introduce Supabase Auth profiles and per-user RLS for
wishlist and cart. Stripe checkout and webhooks should be implemented as Edge
Functions with secrets stored in the Supabase project, not in Git or Vercel's
frontend environment.
