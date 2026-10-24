# MIYU Academy — rules for every chat

Site: https://miyu.academy — open courses and illustrated stories in Russian and English.
Next.js 15 on Netlify. No accounts, no database, no API: progress lives in the visitor's browser.
The owner writes in Russian; answer in Russian, keep code, commits and docs in English.

## How work reaches the site
1. New branch from `main` → changes → `npm run typecheck` and `npm run qa`.
2. Pull request. Netlify builds a deploy preview (`deploy-preview-N--miyu-academy.netlify.app`); the owner looks at it there.
3. The owner merges; Netlify publishes `main` in about two minutes.
Never push to `main` directly. Never merge without the owner's "yes". One task = one PR.

## Who touches what
- **A course chat** changes only its course: `content/<course>/`, `lib/content/<course>.ts`, its theme stylesheet
  (`app/[locale]/<theme>.css`), its course page `app/[locale]/courses/<slug>/`, its pictures `public/visuals/<course>/`,
  its own games, and its entry in `lib/courses.ts`.
- **A story chat** changes only its story: `content/<story>/`, `lib/content/<story>*.ts`, `app/[locale]/stories/<slug>/`,
  its component, `public/visuals/<story>/`, its entry in `lib/stories.ts`.
- **The base chat** changes shared things: `app/[locale]/base.css`, `globals.css`, `activities.css`, shared components
  (`LessonClient`, `ChapterHead`, `ActivityFrame`, `Markdown`, `Checks`, `ModuleOutro`, `Header`, `Footer`…), `lib/progress.ts`,
  the parser, the scripts. A course chat that needs a base change describes it to the owner instead of making it.

## Rules that are checked on every build (`scripts/check_design.py`, `scripts/validate_content.py`)
- Fonts: only `var(--font-serif)` (Cormorant Garamond) and `var(--font-sans)` (Inter), loaded once in `app/[locale]/layout.tsx`.
- No justified text. Lesson text is left-aligned.
- Every `[[game:…]]` / `[[activity:…]]` and every lesson picture must exist.
- Pages are built in advance (static files, nothing rendered per visit): no `headers()`, `cookies()`, `searchParams`
  or `force-dynamic` in pages. Address switches like `?demo=` are read in the browser (`lib/useDemo.ts`); "is this a deploy
  preview" is decided at build time (`lib/preview.ts`). A new dynamic route lists its pages in `lib/static-params.ts`.
- Every lesson file has its RU/EN pair and a duration line.

## Rules that are not checked by a script, but are just as strict
- A course changes its look only through its theme (colours, background, decoration, its pictures, its games).
  Fonts, text sizes, line height, alignment and the signature elements come from the base. See `docs/DESIGN_SYSTEM.md`.
- Lesson text is the author's: never reword, shorten or "fix" it without the owner asking. Design is made by Markdown
  conventions (see the design doc), not by editing the text.
- Progress only through `lib/progress.ts` (browser storage). Never add sign-in, a database or an API route.
- Every game: voluntary, no points, no timer, works with a keyboard and on a 320 px screen, stops animating with reduced motion,
  sits in `<ActivityFrame>`.
- Motion follows `docs/visual-motion-rule.md`: calm, opacity and translate only, off with reduced motion.
- Every user-facing string exists in Russian and English.

## Where things are
| What | Where |
| --- | --- |
| Look and feel rulebook | `docs/DESIGN_SYSTEM.md` |
| Adding a course | `npm run new-course -- <id> --ru "…" --en "…" --modules N`, then `docs/NEW_COURSE.md` |
| Importing a delivered module | `scripts/import_module.py` (see `docs/NEW_COURSE.md`) |
| Stories | `docs/STORIES.md` |
| Progress in the browser | `docs/PROGRESS.md` |
| Course registry | `lib/courses.ts` |
| Interface strings RU/EN | `lib/i18n.ts` |
| Style showcase (preview only) | `/<locale>/styleguide?theme=greek|norse|egypt` |
| Old notes from the first build | `docs/archive/` — history only, do not follow |

## Checking your work
- `npm run typecheck`, `npm run qa` (content + design checks; also run by `npm run build`).
- Look at the result in a browser at desktop and phone width (390 px) before opening the PR; for a base change,
  open the style showcase in every theme and one lesson of every course.
- In a sandbox without access to Google Fonts, `next build` fails on `next/font`; build with
  `NEXT_FONT_GOOGLE_MOCKED_RESPONSES` pointing to a local mock, or rely on the Netlify preview.
