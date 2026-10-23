# Security notes

## In place
- No accounts, no sign-in, no database, no API routes: there is no learner data on the server to leak.
  Progress is kept in the visitor's own browser (`docs/PROGRESS.md`).
- Final Myth Decoder: the question page is sent without correct answers; answers and explanations are loaded only on the result page.
  Scoring is in the browser. The result is for the learner only and gives no certificate, so this is enough.
- Preview mode needs a `deploy-preview-N--miyu-academy.netlify.app` host and, when set, `CONTEXT=deploy-preview`.
- Headers: nosniff, frame denial (X-Frame-Options + CSP frame-ancestors), Referrer-Policy, Permissions-Policy, HSTS, COOP.
- Google Analytics loads only after explicit consent and is removed on withdrawal. No user identifiers are sent.

## History
Until 23 October 2026 the site used Supabase (auth + progress tables). The migrations and API code were removed;
they remain in git history. The Supabase project itself must be deleted separately in the Supabase dashboard,
and the `SUPABASE_*` / `NEXT_PUBLIC_SUPABASE_*` variables removed from Netlify.
