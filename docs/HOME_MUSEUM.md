# Academy home — "The Living Museum" (October 2026)

Dark editorial home: ink ground, edge-to-edge pictures, light Cormorant Garamond, copper accent `#C49166`.

## Where things live

| What | Where |
| --- | --- |
| Page | `app/[locale]/page.tsx` |
| Styles (scoped to `.mu`), dark header/footer on the home, support note | `app/[locale]/home.css` |
| All home copy RU/EN, picture choices, exhibits, interactives, routes, steps, FAQ | `lib/content/museum.ts` |
| Ko-fi link | `lib/links.ts` (`SUPPORT_URL`) |
| Four worlds on the first screen (hover widens a panel) | `components/home/HeroPanels.tsx` |
| Lesson fragment, a random one per visit | `components/home/Exhibit.tsx` |
| "Welcome back" strip for signed-in learners (reads own `module_progress` rows) | `components/home/ContinueBand.tsx` — preview it with `?demo=continue` |
| Support card at the end of courses and the story | `components/SupportNote.tsx` |

Course titles and blurbs come from `lib/courses.ts`, the story from `lib/stories.ts`, the author block from `lib/content/home.ts` (`AUTHOR`). The Greek course page still uses `FAQ` and `STEPS` from `lib/content/home.ts`; the home has its own `HOME_FAQ` and `STEPS3`.

## Rules for the copy

- Exhibit fragments are quoted word for word from approved lessons. Add one by copying the exact lines from `content/…/module-NN.ru.md` and `.en.md`.
- Route texts compare what the lessons say. If a lesson changes, check the route.
- Course time on the cards is the sum of module durations in `lib/content/*.ts` (Greek ≈ 3.5 h, Norse 3.5–4.5 h, Egypt 2.5–3.5 h).
- No invented numbers, testimonials or names of people (story rule).

## Support link

`SupportNote` appears after the last module of every course (`ModuleOutro`, also after the rune reveal), on the Final Myth Decoder result page and at the end of the Ossetian story. The header and footer link to Ko-fi on every page. The site takes no payments itself.
