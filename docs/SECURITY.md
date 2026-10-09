# Security notes (stage 6)

## In place
- Every API route authenticates with `auth.getUser()` and scopes data by `user.id`; module routes validate `moduleId` against the 8 real ids; request bodies are parsed defensively; database error text is not returned to the browser.
- Final Myth Decoder answers and feedback never reach the client; scoring runs in Supabase security-definer RPCs.
- Service-role key is used only in `app/api/account/delete/route.ts` (server only, Netlify env, no `NEXT_PUBLIC_` prefix).
- Auth callback only redirects to same-origin paths (no open redirect).
- Preview mode needs a `deploy-preview-N--miyu-academy.netlify.app` host and, when set, `CONTEXT=deploy-preview`.
- Headers: nosniff, frame denial (X-Frame-Options + CSP frame-ancestors), Referrer-Policy, Permissions-Policy, HSTS, COOP; API responses `no-store`.
- Google Analytics loads only after explicit consent and is removed on withdrawal.

## Recommended database hardening (needs a SQL migration, not yet applied)
1. `module_progress` allows a signed-in user to write their own rows directly through the Supabase API, including `status='completed'`. Move completion into a security-definer RPC (or restrict columns with a trigger) and make the final-test/certificate functions count only the 8 real module ids.
2. Add `length(p_student_name) <= 60` inside `issue_greek_mythology_certificate`.
3. Optional: cooldown or attempt cap for the Final Myth Decoder, and omit category scores on failed attempts.
Impact today: a learner can only cheat their own progress; no other user's data is exposed.
