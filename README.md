# MIYU Academy — Greek Mythology
## Step 30/30 — FINAL BUILD SOURCE / RELEASE CANDIDATE

Course: **Greek Mythology: Decode the World Around You**  
RU: **Греческая мифология: расшифруй мир вокруг себя**  
Content version: **gm-v2**

This repository is the production-source implementation of the 30-step MIYU Academy architecture.

### Implemented in source

- Next.js App Router with `/en` and `/ru` locale architecture.
- Public Academy Home and Course Overview.
- Passwordless Supabase Auth flow.
- Authenticated Dashboard with 8-module progress.
- Modules 1–8 loaded from Markdown masters — no lesson copy duplicated in JSX.
- AST-validated semantic parser with:
  - stable section IDs;
  - Visual Stop mapping;
  - Quick Checks;
  - Self-check;
  - Module 8 non-graded `MYTH DECODER — LEVEL 1–5` challenges;
  - explicit Module completed block;
  - editorial source removal.
- Step 29 parser guard: standalone `# 10.` is not a numbered section unless it has a non-empty title.
- Final Myth Decoder:
  - 15 canonical questions;
  - source-index answer identity;
  - server-created attempts;
  - stable per-attempt option shuffle;
  - autosaved answers;
  - review before submit;
  - canonical server scoring;
  - 12/15 = 80%;
  - unlimited attempts;
  - pass-once permanence.
- Certificate:
  - server-side eligibility;
  - one credential per learner/course;
  - permanent Certificate ID;
  - high-entropy verification token;
  - unlisted public verification;
  - locked approved certificate composition as master;
  - dynamic name/date/ID/QR overlay;
  - accessible HTML credential data;
  - browser Print/Save-as-PDF path.
- Supabase schema, RLS and trusted credential functions.
- Public verification route.
- SEO/noindex split, canonical/hreflang foundations, sitemap and robots.
- WCAG-oriented semantic controls, keyboard/focus/reduced-motion foundations.
- Privacy/Terms/Accessibility/Credits/Privacy Settings routes.
- Step 25 analytics contract preserved in `/docs`, but no optional analytics vendor is loaded by default.

### Approved content repairs applied in gm-v2

1. `module-03.en.md`: restored missing Visual Stops 01–13 without rewriting existing English prose.
2. Module 7 RU/EN: changed the Module 8 preview heading to the canonical title.
3. Module 8 RU/EN: changed premature `Course completed` to `Module completed`.

All other master copy remains unchanged.

### Local development

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill Supabase keys and site URL.
4. Apply:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls_functions.sql`
5. For development only keep:
   `NEXT_PUBLIC_VISUAL_PLACEHOLDERS=1`
6. Run:
   `npm install`
   `npm run qa`
   `npm run dev`

### Production visual gate

The Step 14 plan has 72 visual entries.

The source package deliberately **does not show Visual Stop production instructions as learner prose**. Until approved visual assets/components are wired, production mode throws for unresolved Visual Stops.

Current readiness is recorded in `RELEASE_READINESS.json` and `content/greek-mythology/asset-licenses.json`.

This is intentional: the approved architecture requires real/open-access photography and museum artifacts in certain slots and forbids silently replacing them with invented AI documentary images.

### Public-launch blockers

These are not code-architecture gaps; they require real deployment/business facts:

- production Supabase project + environment values;
- approved production visual assets and external-asset rights records;
- actual controller/legal identity and final EN/RU Privacy/Terms;
- processor/DPA/region/international-transfer review;
- accessibility contact/review date;
- optional direct server-generated tagged-PDF renderer if “one-click PDF file download” is required instead of browser Print/Save as PDF.

Do not deploy publicly until `RELEASE_READINESS.json` blockers are resolved.

### QA

Run:
`npm run qa`

The validator checks:

- all 16 master files;
- RU/EN structural parity;
- all 64 Module 3–8 Visual Stop IDs;
- the approved Module 7/8 content repairs;
- Module 8 Challenge Levels 1–5;
- Final Myth Decoder invariants;
- all 72 Step 14 visual mappings;
- locked certificate master presence/hash.

`qa/final-build-content-qa.json` is generated from this check.

### Certificate note

The approved certificate master remains untouched in `public/certificate-master.webp`.

The dynamic web/print renderer uses that locked image as the visual base and overlays only the approved dynamic fields and QR. The adjacent credential details remain accessible HTML, so the certificate image is not the only information source.

### Repository status

**Architecture/content/backend source: complete.**  
**Content QA: PASS.**  
**Public release: blocked only by deployment-specific visual/legal/infrastructure items listed above.**
