# Adding a course to MIYU Academy

The academy home page, header, sitemap, progress API and course pages all read from one registry:
`lib/courses.ts`. A new course needs content, one module list and one flag flip. No page code.

## 1. Content (same format as Greek Mythology)
Put the lessons in `content/<course-id>/master/`:

    module-01.ru.md   module-01.en.md
    module-02.ru.md   module-02.en.md   …

Every file follows the Greek format: a `**Время:** …` / `**Time:** …` line, `---` between chunks,
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

## 4. Database (once)
Run `supabase/migrations/0008_multi_course.sql` in Supabase → SQL Editor. It adds
`complete_course_module(course, module)` and lets the guard trigger accept the new course ids
(up to 12 modules per course; raise the limit in `miyu_course_module_ok` if you need more).

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
