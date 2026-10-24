# Visual stories

Standalone illustrated pages (no modules, tests or progress), listed on the academy home next to the courses.
Registry: `lib/stories.ts` (title, blurb, facts and card picture for the home page; the sitemap reads it too).

## «Осетинский шёлковый платок / Цыллæ хыз» — `/ru|en/stories/ossetian-headscarf`

- **Text:** `content/ossetian-headscarf/story.ru.md` and `story.en.md` — the approved essay, rendered verbatim.
  Each `## ` heading is a chapter (`Глава 01. Название` → label + title). The first `## ` is the prologue, the last the
  epilogue (shown as the finale; its all-bold line becomes the closing line, the italic note is shown below it).
- **Interactive blocks and pictures** are placed by marker lines in the text — move the line to move the block:
  `[[light]]` `[[path]]` `[[weave]]` `[[touch]]` `[[year]]` `[[motifs]]` `[[gallery]]` `[[craft]]` `[[scene:<picture>]]`.
  A marker right after a chapter heading is shown above that heading.
- **Magazine layout inside chapters:** a `### Subhead` line starts a section; the page lays sections out on a grid.
  `[[fact: 250–300 | what the figure means]]` sets a figure large (in the side rail); `[[pic:<picture>]]` puts a picture beside
  the section's text, whole and uncropped; a paragraph that is entirely `**bold**` is a quote across the break.
  Section with a picture → picture + text side by side; with a fact → rail with subhead and figures + text; otherwise two columns.
  Rails alternate left/right. Phones get one column.
- **Copy inside the blocks** (RU/EN): `lib/content/ossetianHeadscarf.ts` (`PATH`, `WEAVE`, `TOUCH`, `YEAR`, `MOTIFS`, `CRAFT`, `UI`).
  Pictures and their alt texts: `PICS`; gallery order: `GALLERY`.
- **Media:** `public/visuals/ossetian-headscarf/` — `<name>-1448.webp` (or `-1600`) + `<name>-800.webp`, `hero.mp4`, `hero-poster-*.webp`.
- **Look:** on the Academy base — Cormorant Garamond + Inter, the shared reading size and left alignment (tokens from
  `app/[locale]/base.css`); the story's own colours, scenes and panels live in `story.css`. Built in advance like every page.
- **Motion:** respects the system reduced-motion setting; the hero has a button to switch animation off (remembered per browser).
