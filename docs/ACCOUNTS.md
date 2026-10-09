# Accounts (stage 4)

## Sign-in
- Google (Supabase provider must be enabled) and email link. Both require the 16+ confirmation checkbox.
- Callback: `/auth/callback` on the canonical domain (`NEXT_PUBLIC_SITE_URL`). The same URL must be in
  Supabase → Authentication → URL Configuration → Redirect URLs (it already is for email sign-in).
- Google Cloud OAuth client: Authorized redirect URI = `https://<project>.supabase.co/auth/v1/callback`.

## Resume
- `ResumeTracker` stores the scroll position in `module_progress.scroll_ratio` (existing column) via `/api/module/progress`.
- Only modules with status `in_progress` resume; completed modules start from the top.

## Account deletion
- `POST /api/account/delete` with `{confirm:"DELETE"}`. Uses `SUPABASE_SERVICE_ROLE_KEY` (server only, set in Netlify env, never in the repo or the browser).
- It calls `auth.admin.deleteUser`. Progress, Final Myth Decoder attempts, the certificate and the profile are removed by `on delete cascade`.
- No SQL migration is needed for this stage.

## Deploy previews
- On `deploy-preview-N--miyu-academy.netlify.app` lessons, cabinet, account and certificate show demo data without sign-in. Nothing is read from or written to the database.
