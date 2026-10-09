# MIYU Academy design system (stage 1)

Single source of truth for how the site looks and moves. Lesson text, Final Myth Decoder
questions and the certificate master are content and are never changed from here.

## Where things live

| What | Where |
| --- | --- |
| Colour, type, spacing, radius, shadow, motion tokens | `:root` blocks at the top and in the "STAGE 1" section of `app/[locale]/globals.css` |
| Course registry (which courses exist, paths, module ids) | `lib/courses.ts` |
| Interface strings RU / EN | `lib/i18n.ts` (`t(locale, key)`) |
| Hero art for modules 5–8 with focal points and alt text | `lib/visuals.ts`, files in `public/visuals/module-0X/` |
| Header (desktop + mobile menu), Footer | `components/Header.tsx`, `components/Footer.tsx` |
| Shared module hero and previous / next strip | `components/ModuleHero.tsx`, `components/ModuleNav.tsx` |
| Scroll-in animation | `components/Reveal.tsx` + `[data-reveal]` rules |

## Tokens

Brand: navy `#0D1D35`, ivory `#F7F1E7`, parchment `#F1E8D9`, gold `#B18B52`, ochre `#71542B`,
paper `#FFFDF9`, ink `#20242B`, muted `#736C63`, line `#D8CCBC`, success `#2F5B4E`, error `#8B3E32`.
Fonts: Cormorant Garamond (display), Inter (body).
Scale: `--space-1…9`, `--radius-sm/md/lg/pill`, `--shadow-sm/md/lg`, `--container` 1180px, `--reading` 740px.

## Motion rules

- Only opacity and translate are animated. Durations: `--dur-fast` .16s, `--dur-base` .28s, `--dur-reveal` .6s; easing `--ease-out`.
- Animation explains something (arrival, state change, progress). No carousels, no looping effects, nothing inside lesson text.
- `prefers-reduced-motion: reduce` switches everything off (global rule plus `[data-reveal]`).
- Content is always visible without JavaScript. `Reveal` only hides blocks that start below the fold, after hydration.

## Adding things

- New course: add an entry to `COURSES` in `lib/courses.ts`, content under `content/<id>/`, pages under `app/[locale]/courses/<slug>/`.
- New interface string: add the key to `ru` in `lib/i18n.ts` first; TypeScript then requires the `en` value.
- New module hero image: export 836 px and 1672 px WebP into `public/visuals/module-0X/`, add an entry in `lib/visuals.ts` with a focal point (`pos`) and RU/EN alt text.
