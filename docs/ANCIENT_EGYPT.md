# «Древний Египет: боги, смерть и пирамиды» / Ancient Egypt

**Pages:** `/ru|en/courses/ancient-egypt` (course page), `/…/ancient-egypt/module-01` … `module-06`, `/…/ancient-egypt/dashboard`.
Course id in the database: `egyptian-mythology` (already allowed by migration 0008). Registry entry: `lib/courses.ts`.

## Where things live
- **Lesson texts:** `content/egyptian-mythology/master/module-NN.ru.md` / `.en.md` — generated from the delivered
  packages by `scripts/import_egypt.py` (every learner paragraph is copied verbatim; the script checks it).
  Re-import: unzip the packages into one folder, then `python3 scripts/import_egypt.py --src <folder>`.
  The script also says which picture opens which chapter (`MODULES`), the card teasers (`TEASERS`) and where the
  activities go (`ACTIVITIES`).
- **Course page text:** `content/egyptian-mythology/landing/landing.ru.md` / `.en.md` (approved copy, unchanged),
  laid out by `app/[locale]/courses/ancient-egypt/page.tsx`.
- **Module list** (titles, teasers, durations, module heroes): `lib/content/egypt.ts`.
- **Pictures:** `public/visuals/egypt/mNN/*-1448.webp` + `*-724.webp`; course page `public/visuals/egypt/home/`.
  Hero video: `hero-1920.mp4` (desktop) and `hero-1280.mp4` (phones), 5-second seamless loop, no sound;
  poster `hero-poster-1920.webp` / `-960.webp`.
- **Picture alt texts:** `content/egyptian-mythology/picture-alts.json`.
- **Styles:** `app/[locale]/egypt.css` (theme, course page, newspaper layout, activities).

## Newspaper layout (`layout: "newspaper"` in the registry)
`components/Newspaper.tsx`. Nothing in the text changes; the chapter is set on a grid:
- chapter head: label, title, big chapter number;
- chapter picture beside the first ~760 characters, whole and uncropped (sides alternate chapter by chapter);
- the rest in **two columns**, cut into blocks of ≤ ~2300 characters so a column never runs on for screens;
- `### subhead` starts a section; an all-bold paragraph is a pull quote across both columns;
  a paragraph that opens with `**Label:**` (e.g. «Если запомнить одну мысль») or a `>` quote is a note box;
- a picture placed right before a `### subhead` is set beside that section.
- Under 860 px: one column, picture first. No narrow strip in the middle of the page at any width.

## Activities (any course, any module)
Put a marker line in its own `---` chunk of a lesson: `[[activity:<id>]]`. Content: `lib/content/activities.ts`.
Four kinds, all voluntary, no points, no timers, nothing saved:
- `scales` — «Весы Маат»: true or myth; the scales balance or tip.
- `order` — «Ладья Ра»: put cards into the right order (tap two cards to swap, or ↑ ↓).
- `match` — «Кто есть кто»: pair names with roles.
- `cartouche` — «Картуш»: the visitor's name in single-consonant signs (font subset `public/fonts/hieroglyphs-uniliteral.woff2`,
  Noto Sans Egyptian Hieroglyphs, OFL). Needs no content; works in any module.

Placed now: M1 match + order · M2 match · M3 order · M4 match + scales · M5 order · M6 scales + cartouche.

## Checks
Quick checks and Final Checks come from the masters. Feedback lines in the lesson files:
`**Если верно:**` / `**If correct:**`, `**Если неверно:**` / `**If incorrect:**` (shown only for that outcome),
`**Вариант A:**` / `**Option A:**` (shown when that option is chosen). A short bold or italic line above the question is its title.

## Open points
- Module 4 came without English: the English text is a translation made here, waiting for approval.
- English of the course page and of modules 3, 5, 6 is marked "not approved yet" in the packages.
- Card teasers for modules 2–6 are sentences from the approved course-page copy and module texts.
- Copy of the activities (statements, pairs, steps) repeats the modules' own wording and needs a read-through.
