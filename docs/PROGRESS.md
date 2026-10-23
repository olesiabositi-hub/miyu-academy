# Progress without accounts

Since 23 October 2026 MIYU Academy has no accounts, no sign-in and no database.
Learner progress lives only in the visitor's browser, the same way the Ossetian headscarf story already worked.

## Where it lives
- One store for every course: `lib/progress.ts`, localStorage key `miyu.progress.v1`.
- Shape: `{ v: 1, courses: { <course-id>: { modules, runes?, final? } } }`.
  - `modules[<module-id>]`: `status` (`in_progress` / `completed`), `startedAt`, `lastActiveAt`, `scroll` (0–1, where reading stopped), `checks` (answers to in-lesson checks).
  - `runes`: Norse runes, one per source (`module-NN` or `game-yggdrasil`), never the same rune twice.
  - `final`: Greek Final Myth Decoder: the attempt in progress, the last submitted answers, `latestScore`, `passed`.
- Every read and write is wrapped in try/catch. In a private window or with storage blocked the site works, it just does not remember.

## How to use it in a new course or game
- Lesson start, checks, completion: `startModule`, `saveCheck`, `completeModule` (already wired in the lesson components and `ModuleOutro`).
- Reading position: `ResumeTracker` (already on every module page).
- Anything that shows progress: `useProgress()` returns the store and re-renders when it changes (also across tabs). It is `null` on the server and on the first render.
- Never add an API route or a database for progress. If a course needs new progress data, add a field to its `CourseState` in `lib/progress.ts`.

## Erasing progress
Privacy settings (`/<locale>/privacy-settings`) show how much progress is stored and have an "Erase progress" button.

## Deploy previews
Previews use the real browser store too. Sample data for design review: `?demo=sample` on a dashboard,
`?demo=prophecy` on the Norse dashboard, `?demo=pass` / `?demo=fail` on the decoder result, `?demo=continue` on the home page.

## Old addresses
`/<locale>/account`, `/<locale>/sign-in` and `/auth/*` redirect to the home page (`next.config.mjs`).
