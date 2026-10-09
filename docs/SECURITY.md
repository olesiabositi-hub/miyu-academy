# Security notes (stage 6)

## In place
- Every API route authenticates with `auth.getUser()` and scopes data by `user.id`; module routes validate `moduleId` against the 8 real ids; request bodies are parsed defensively; database error text is not returned to the browser.
- Final Myth Decoder answers and feedback never reach the client; scoring runs in Supabase security-definer RPCs.
- Service-role key is used only in `app/api/account/delete/route.ts` (server only, Netlify env, no `NEXT_PUBLIC_` prefix).
- Auth callback only redirects to same-origin paths (no open redirect).
- Preview mode needs a `deploy-preview-N--miyu-academy.netlify.app` host and, when set, `CONTEXT=deploy-preview`.
- Headers: nosniff, frame denial (X-Frame-Options + CSP frame-ancestors), Referrer-Policy, Permissions-Policy, HSTS, COOP; API responses `no-store`.
- Google Analytics loads only after explicit consent and is removed on withdrawal.

## Database hardening: `supabase/migrations/0005_module_completion_hardening.sql`
Run it once in the Supabase SQL editor (idempotent). It: removes rows with unknown module ids; adds a trigger so `status='completed'` / `completed_at` can only be set by the new `complete_greek_mythology_module()` RPC (used by `/api/module/complete`); caps certificate names at 60 characters.
Deploy order: run the SQL first, then merge (the old API code keeps working only until completion is blocked, so do both in the same session).

## Still optional
Cooldown or attempt cap for the Final Myth Decoder; omit category scores on failed attempts.
