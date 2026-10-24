# Adding a course to MIYU Academy

Look and feel: read `docs/DESIGN_SYSTEM.md` first. A new course gets the shared reading text, chapter heads,
drop caps, pull quotes, notes, picture frames and activity frame automatically; it only adds a theme block
(colours) and, if it wants, its own course page and games.

The academy home page, header, sitemap, progress and course pages all read from one registry:
`lib/courses.ts`. A new course needs content, one module list and one flag flip. No page code.

## 0. Start with one command

    npm run new-course -- kalevala --ru "Калевала: финский эпос" --en "The Kalevala: the Finnish Epic" --modules 9

It creates the module templates (`content/<id>/master/_TEMPLATE.*.md`), the module list (`lib/content/<id>.ts`,
every module "soon"), the theme stylesheet (`app/[locale]/<id>.css`) and the registry entry (status "soon"),
or fills in an existing "soon" entry. Then follow the steps below. Pick the theme colours on the style showcase:
`/<locale>/styleguide?theme=<id>` on a deploy preview (add the theme name to `THEMES` in
`app/[locale]/styleguide/page.tsx`).

## 1. Content (same format as Greek Mythology)
Put the lessons in `content/<course-id>/master/`:

    module-01.ru.md   module-01.en.md
    module-02.ru.md   module-02.en.md   …

Every file follows the template `_TEMPLATE.ru.md` / `_TEMPLATE.en.md` (made by `new-course`): a `**Время:** …` / `**Time:** …` line, `---` between chunks,
`## Quick check` blocks (A/B/C + `**Ответ:** X`), `# Самопроверка` / `# Self-check`,
`# Модуль завершён` / `# Module completed`, `# Дальше` / `# Next`.
Tests are optional for learners; there is no final test and no certificate.

Optional pictures: `content/<course-id>/visual-assets.json` (entries with ids `<prefix>-mNN-vsNN`).
A visual stop without an entry is shown as text only.

## 2. Module list
Fill `lib/content/<course>.ts` (see `norse.ts`): id, order, duration, title and teaser in RU/EN,
and optionally tile art (`/public/visuals/<course>/mNN.webp` + `mNN-360.webp`, portrait 4:5).
Without art, tiles show a gradient.

## 3. Registry entry
In `lib/courses.ts`: set `modules`, `blurb` (RU/EN, shown on the home card), `card` and `hero` images,
then change `status: "soon"` to `status: "live"`.
A live course appears in "Choose a course" on the home page, in the sitemap, and gets
`/<locale>/courses/<slug>`, `/dashboard` and `/module-NN` pages automatically.

## 4. Progress
Nothing to do: progress is kept in the browser for every course automatically (see `docs/PROGRESS.md`).

## 5. Preview before launch
While a course is `soon` but has modules, its pages open on Netlify deploy previews only,
so it can be reviewed before it is announced. In production they return 404 until `live`.

## 6. Checks
`python3 scripts/validate_content.py` (runs on every Netlify build) verifies ru/en pairs and duration lines.

## Courses with their own course page (Norse Mythology)
Put the approved page text in `content/<course>/landing/landing.ru.md` and `landing.en.md`
and add a page file `app/[locale]/courses/<slug>/page.tsx` (see `norse-mythology`), which lays the
text out with the course illustrations (`public/visuals/<course>/home/`). Without such a file the course
uses the generic page (`app/[locale]/courses/[course]/page.tsx`).

## Publishing a course module by module
Mark modules that are announced but not written yet with `soon: true` in `lib/content/<course>.ts`.
They are shown as "Coming soon" and are never linked. To open a module: add `module-NN.ru.md` and
`module-NN.en.md`, set `duration`, remove `soon`. Lesson illustrations are plain Markdown images
(`![caption](/visuals/<course>/mNN/….webp)`) in their own `---` chunk.

## Importing a delivered module (recommended)
`scripts/import_module.py` turns a module package (RU/EN text, questions, `asset-manifest.json`, PNGs) into the
site format and checks that every paragraph of the chapters is copied verbatim. See the header of the script
for the options. Example (Norse, module 1):

    python3 scripts/import_module.py --course norse-mythology --public norse --module 1 \
      --package /path/to/module-01 --minutes "15–20" \
      --done-ru "…" --done-en "…" --anchor 2=12

Layout rules the site applies to every non-Greek lesson (nothing in the text is changed):
- chapter heading on its own, then the chapter picture (wide), then the text;
- runs of short one-sentence paragraphs are set as one paragraph (`lib/content/tidy.ts`);
  headings, pictures, quotes, lists, dialogue lines and all-bold / all-italic lines stay separate;
- text is left-aligned; all-bold lines become pull lines, an italic opening line becomes the lead.

## Newspaper layout and drop-in activities
Set `layout: "newspaper"` on a course to set its lessons in columns beside the pictures (see `docs/ANCIENT_EGYPT.md`).
Any lesson can carry an activity: a line `[[activity:<id>]]` in its own `---` chunk; the activities are in
`lib/content/activities.ts` (kinds: scales, order, match, cartouche).
