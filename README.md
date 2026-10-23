# MIYU Academy

https://miyu.academy — open courses and illustrated stories about myths and cultures, in Russian and English.

- Courses: Greek Mythology, Norse Mythology, Ancient Egypt (more on the way).
- Stories: The Ossetian Silk Headscarf.
- No accounts: progress is kept in the visitor's browser.

**Working on the site: read [`CLAUDE.md`](CLAUDE.md) first.** It lists the workflow, who changes what, and the rules.

| Topic | Document |
| --- | --- |
| Look and feel: shared base and course themes | [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) |
| Adding a course | [`docs/NEW_COURSE.md`](docs/NEW_COURSE.md) |
| Stories | [`docs/STORIES.md`](docs/STORIES.md) |
| Progress in the browser | [`docs/PROGRESS.md`](docs/PROGRESS.md) |
| Security | [`docs/SECURITY.md`](docs/SECURITY.md) |
| Motion | [`docs/visual-motion-rule.md`](docs/visual-motion-rule.md) |

## Run locally

    npm install
    npm run dev          # http://localhost:3000/ru
    npm run qa           # content and design checks (also part of npm run build)
    npm run typecheck

Optional: `NEXT_PUBLIC_SITE_URL` (canonical address), `NEXT_PUBLIC_VISUAL_PLACEHOLDERS=1` (development only).
`MIYU_STYLEGUIDE=1` opens the style showcase at `/ru/styleguide` outside deploy previews.

## Publishing

Every pull request gets a Netlify deploy preview. Merging into `main` publishes the site.
