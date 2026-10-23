# MIYU Academy — Rendered Content QA
## Step 29/30 — QA COMPLETE, FIXES REQUIRED BEFORE FINAL BUILD

**Scope:** 16 immutable RU/EN module masters, Step 14 visual mapping, Final Myth Decoder JSON, and Step 28 vertical-slice assessment parity.

## Executive result

- **16/16** module masters load as UTF-8.
- Final Myth Decoder schema/content checks: **PASS**.
- Step 28 Final Decoder copy/options/answer-index parity vs canonical JSON: **PASS**.
- Step 14 asset manifest: **72 planned entries**, including the expected Module 3–8 Visual Stop counts.
- Findings: **2 blockers**, **1 interaction decision**, **3 warnings/low-priority cleanup items**.

**Recommendation:** do not start the production Final Build until B-01 and B-02 are resolved. B-02 is a parser-only fix. B-01 changes the frozen EN Module 3 master and therefore needs explicit editorial approval.

## Module matrix

| Module | RU VS | EN VS | Expected VS | Quick RU/EN | Self-check Q RU/EN | Main sections RU/EN | Status |
|---:|---:|---:|---:|---:|---:|---:|---|
| 1 | 0 | 0 | 0 | 2/2 | 6/6 | 13/13 | **PASS** |
| 2 | 0 | 0 | 0 | 5/5 | 7/7 | 22/22 | **PASS** |
| 3 | 13 | 0 | 13 | 4/4 | 7/7 | 20/20 | **BLOCKER** |
| 4 | 9 | 9 | 9 | 5/5 | 7/7 | 24/24 | **PASS** |
| 5 | 9 | 9 | 9 | 4/4 | 7/7 | 25/25 | **PASS** |
| 6 | 10 | 10 | 10 | 2/2 | 8/8 | 29/29 | **PASS** |
| 7 | 12 | 12 | 12 | 2/2 | 8/8 | 33/33 | **BLOCKER** |
| 8 | 11 | 11 | 11 | 1/1 | 8/8 | 29/29 | **PASS** |

## Findings

### 🔴 B-01 — BLOCKER: English Module 3 is missing all 13 Visual Stop markers/blocks

**Area:** content parity  
**Module:** module-03  
**Evidence:** RU parses Visual Stops 01–13; EN parses 0. Step 14 expects 13 for Module 3.  
**Impact:** Breaks Step 8 RU/EN structural fingerprint, language-independent visual-stop anchors, Step 14 asset mapping and same-block RU↔EN resume.  
**Resolution:** Requires explicit editorial approval to repair the EN master so its 13 Visual Stops structurally correspond to RU. Do not silently inject or rewrite the immutable EN master.

### 🔴 B-02 — BLOCKER: Decorative '# 10.' collides with real Section 10 under a naive numbered-heading parser

**Area:** parser  
**Module:** module-07  
**Evidence:** Both locales contain a standalone '# 10.' near the intro and later '# 10. Circe/Цирцея'.  
**Impact:** A parser that maps every '# N.' heading to section-NN can generate duplicate section-10 and break build/resume anchors.  
**Resolution:** Technical fix only: section recognizer must require a non-empty title after the period, e.g. '# N. <text>'. Keep standalone '# 10.' as rich-text emphasis. No master edit needed.

### 🟠 D-01 — DECISION: MYTH DECODER — LEVEL 1–5 sits outside Quick Check/Self-check semantics

**Area:** interaction semantics  
**Module:** module-08  
**Evidence:** Four explicit Answer lines are outside recognised check sections, and Level 5 resolves as prose. Level 1 is inside Visual Stop 10.  
**Impact:** Default rich-text rendering would expose answers immediately instead of providing a deliberate low-stakes challenge interaction.  
**Resolution:** Recommended: add a non-credential ModuleChallenge recognizer for Levels 1–5, preserving exact copy and source order. No scoring/gating.

### 🟡 W-01 — WARNING: Module 7 previews Module 8 under an old title in both locales

**Area:** content consistency  
**Module:** module-07 → module-08  
**Evidence:** RU: 'Модуль 8. Мифы в небе'; EN: 'Module 8. Myths in the Sky'. Actual Module 8 titles are 'Мифология вокруг нас' / 'Mythology Around Us'.  
**Impact:** Visible narrative copy disagrees with canonical metadata/navigation.  
**Resolution:** Platform Next CTA already uses canonical metadata. Editing the frozen Module 7 copy requires explicit editorial approval.

### 🟡 W-02 — WARNING: Visible 'Course completed' heading appears before the Final Myth Decoder

**Area:** completion semantics  
**Module:** module-08  
**Evidence:** Module 8 contains '# Курс завершён' / '# Course completed' immediately before introducing FINAL MYTH DECODER.  
**Impact:** Can conflict with the approved product rule that credential-level Course completed appears only after Final Decoder pass.  
**Resolution:** Backend must ignore this narrative heading. Recommended editorial change requires explicit approval; otherwise style it as narrative only and never map it to platform completion state.

### ⚪ W-03 — LOW: Editorial-only source links include chatgpt UTM query parameters

**Area:** editorial source hygiene  
**Module:** module-05.ru  
**Evidence:** 22 source URLs contain '?utm_source=chatgpt.com'.  
**Impact:** No learner leak if editorial sources remain excluded, but source archive is noisier than necessary.  
**Resolution:** Optional future master cleanup with editorial approval; not a launch UX blocker.

## Checks that passed

- All 16 expected master filenames are present.
- RU/EN main numbered-section parity passes when numbered headings require a non-empty title.
- Quick Check counts match RU↔EN in all modules.
- Self-check question counts match RU↔EN in all modules.
- All in-module recognised checks parse unambiguously as A/B/C or the approved True/False binary format.
- Visual Stop numbering is sequential wherever markers exist.
- Modules 1–2 correctly have no in-body Visual Stops, matching Step 14.
- Modules 4–8 Visual Stop counts match Step 14 in both locales.
- Every module has one editorial fact-check source boundary and it occurs at the end of learner content.
- Final Myth Decoder remains 15 questions, 5 Recognition + 5 Meaning + 5 Connection, pass 12/15 = 80%, with valid source answer indices.
- Step 28 assessment question text/options/answer identities match the canonical Final Myth Decoder JSON.

## Step 30 gate

Before FINAL BUILD:

1. **Fix B-02 in parser** — safe technical change; no content edit.
2. **Get explicit approval for B-01** — repair Module 3 EN Visual Stops to restore master parity.
3. Decide whether Module 8 `MYTH DECODER — LEVEL 1–5` becomes an interactive non-graded `ModuleChallenge` component.
4. Decide whether to make the two editorial copy corrections W-01/W-02 now or carry them as consciously accepted visible inconsistencies.

Immutable masters were **not modified** during Step 29.