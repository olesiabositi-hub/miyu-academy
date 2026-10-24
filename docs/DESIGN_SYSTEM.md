# MIYU Academy design system

One base for every course, a different atmosphere for each.
The base decides how text is read; the course decides how the world around the text looks.
`scripts/check_design.py` runs on every build and stops it when a shared rule is broken.

## The rule in one line

A course may change **colours, background, pictures, decoration and games**.
It may not change **fonts, reading size, line height, text alignment or the signature elements**.

## What is shared (the base)

| What | Rule | Where |
| --- | --- | --- |
| Fonts | Cormorant Garamond for headings and accents, Inter for reading text and interface. Loaded once in `app/[locale]/layout.tsx`. Always `var(--font-serif)` / `var(--font-sans)`. | `layout.tsx`, tokens in `globals.css` |
| Reading text | `--read-size` (17.5–19 px), line height `--read-lh` 1.7, left-aligned, column up to `--read-measure` (740 px). Never centred, never justified. | `base.css` §1 |
| Chapter head | Label («Глава 3»), title, big faint number, gold underline. Written in Markdown as `## Глава 3. Title`. | `ChapterHead.tsx`, `.mxHead` |
| Drop cap | First paragraph of a chapter, when it is a real paragraph (140+ characters). Automatic. | `.mxDrop` |
| Sub-heading | `###` inside a chapter: diamond + short rule. | `.mxSub` |
| Pull quote | A paragraph that is only bold text, 40+ characters: `**Боги Севера никогда не были одной дружной семьёй.**` | `.mxPull`, `p.pullLine` |
| Key line | A short bold-only line (under 40 characters): `**Афина**` | `p.keyLine` |
| Accent line | A short `# line` inside the text: `# 10 лет.` | chapter text `h2` |
| Lead line | A paragraph that is only italic text. | `p.leadLine` |
| Note | `**Главная мысль модуля:** text` or a `>` quote: label on the left, text on the right. | `.mxNote` |
| Pictures | Framed panel (double keyline) + italic caption from the alt text. | `.mxFig`, `.lessonFigure` |
| Activities and games | One frame: eyebrow, title, short lead, optional icon, then the game. Light or dark. | `ActivityFrame.tsx`, `.mxActivity` |
| Quick checks, self-check, module outro, previous/next strip, support note | Same components in every course. | `Checks.tsx`, `ModuleOutro.tsx`, `ModuleNav.tsx`, `SupportNote.tsx` |
| Progress | Kept in the browser, the same store for every course. | `lib/progress.ts`, `docs/PROGRESS.md` |
| Motion | Opacity and translate only; everything off with reduced motion. | `docs/visual-motion-rule.md` |

## What a course makes its own (the theme)

A theme is one block of tokens, switched on by `<CourseTheme/>` (the course's `theme` in `lib/courses.ts`):

```css
body:has(.themeMark.theme-egypt){
  --navy:#152A4A;      /* headings, dark surfaces */
  --ivory:#F5ECDC;     /* page background */
  --paper:#FFFBF2;     /* cards, notes */
  --parchment:#EADBC0; /* soft panels */
  --ink:#241C13;       /* reading text colour */
  --muted:#6F6150;     /* captions, secondary text */
  --line:#D9C6A4;      /* hairlines, borders */
  --gold:#A87A2C;      /* accent: labels, drop cap, rules */
  --ochre:#7E5420;     /* small labels */
  --gold-soft:#D9B66E; /* accent on dark */
  --pull-ink:#1F4E8C;  /* optional: pull-quote colour */
  --frame:#6E8398;     /* optional: picture frame colour */
}
```

Optional hooks (defaults follow the tokens above): `--pull-ink`, `--rule`, `--rule-soft`, `--frame`, `--frame-gap`,
`--surface`, `--surface-2`, `--activity-dark`, `--activity-dark-ink`, `--activity-dark-accent`.

Besides the tokens, a course keeps its own:
- course page (landing) with its own art, video and decoration;
- background texture, ornaments, heading marks, progress bar style;
- lesson layout variant (Egypt sets text in two newspaper columns: `layout: "newspaper"`);
- games of its own.

Current themes: Greek — default tokens, module pictures in `lib/content/greekArt.ts`, dark visual-stop storyboards (modules 5–8); Norse — `theme-norse` in `norse.css` (fog and slate);
Ancient Egypt — `theme-egypt` in `egypt.css` (lapis and gold).

## Activities and games

- Every interactive sits in `<ActivityFrame>` (light by default, `tone="dark"` for night scenes).
- Voluntary: no points, no timer, no penalty. A wrong answer nudges back to the text.
- Every fact repeats what the lesson says; nothing new is claimed.
- Works with keyboard and on a 320 px screen; animation stops with reduced motion.
- Progress or rewards only through `lib/progress.ts`.
- Two ways to add one:
  1. **From the library** (any course): add an entry to `lib/content/activities.ts`
     (kinds: `scales` — true or myth, `order` — put in order, `match` — pairs, `cartouche`)
     and put `[[activity:<id>]]` in the lesson, in its own `---` chunk.
  2. **A game of its own**: a component in `components/`, registered in `components/GameBlock.tsx`,
     used in the lesson as `[[game:<name>]]`. It still uses `<ActivityFrame>`.
- The build fails if a lesson uses a marker that does not exist.

## Writing a lesson so the base does the design

```markdown
## Глава 2. Две семьи богов. Одна Вселенная.

---

![Две семьи богов. Одна Вселенная.](/visuals/norse/m02/02-two-families.webp)

---

Когда мы говорим о скандинавских богах…   ← gets the drop cap

### Асы                                     ← sub-heading

**Боги Севера никогда не были одной дружной семьёй.**   ← pull quote

**Главная мысль модуля:** …                 ← note
```

Pictures must exist in `public/` (checked on build).

Lessons written one sentence per line are joined into paragraphs of about 340–780 characters
(`lib/content/tidy.ts`; words and order never change). Headings, pictures, quotes, lists, bold/italic-only lines and
`**Label:**` notes always stay on their own. Greek lessons are not joined.

## Not allowed (checked on build)

- Any font other than the two brand fonts (the cartouche sign font is the one exception).
- Loading a Google font anywhere except `layout.tsx`.
- `text-align: justify`.
- `[[game:…]]` / `[[activity:…]]` that does not exist; a picture that does not exist.

Files that predate the base are listed in `LEGACY` in `scripts/check_design.py` and come off the list as their
course moves onto the base. New files are never added to it.

## Migration status

| Course | Base |
| --- | --- |
| Norse Mythology | lessons on the base |
| Ancient Egypt | lessons on the base (newspaper layout variant) |
| Greek Mythology | lessons on the base; its older Markdown habits are read by `lib/content/greekDialect.ts` (text unchanged) |
| Ossetian headscarf (story) | own fonts — after Greek |

## Files

| What | Where |
| --- | --- |
| Brand tokens, header, footer, home and Greek course page, checks, outro | `app/[locale]/globals.css` |
| The base: reading text, signature elements, activity frame | `app/[locale]/base.css` |
| Activity library styles | `app/[locale]/activities.css` |
| Norse theme, course page, runes, Yggdrasil game | `app/[locale]/norse.css` |
| Egypt theme, course page, newspaper layout | `app/[locale]/egypt.css` |
| A new course's theme | `app/[locale]/<theme>.css` (made by `npm run new-course`) |
| Style showcase: every element in every theme | `/<locale>/styleguide?theme=…` (deploy previews only), text in `content/styleguide/` |
| Chapter head / activity frame | `components/ChapterHead.tsx`, `components/ActivityFrame.tsx` |
| Course registry | `lib/courses.ts` |
| Interface strings RU / EN | `lib/i18n.ts` |
