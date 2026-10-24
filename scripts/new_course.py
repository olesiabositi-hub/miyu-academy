#!/usr/bin/env python3
"""
Create everything a new course needs, in one go:

    npm run new-course -- kalevala --ru "Калевала: финский эпос" --en "The Kalevala: the Finnish Epic" --modules 9

What it makes (nothing is published: the course stays "soon" until you flip it to "live"):
  content/<id>/master/_TEMPLATE.ru.md, _TEMPLATE.en.md   — how a module file is written (copy to module-01.ru.md …)
  lib/content/<id>.ts                                    — module list, every module `soon: true`
  app/[locale]/<theme>.css                               — theme block with the brand colours to change
  lib/courses.ts                                         — registry entry (or fills in an existing "soon" entry)
  app/[locale]/layout.tsx                                — imports the theme stylesheet

Options: --slug (default = id), --theme (default = id), --prefix (asset prefix, default = first letters of id).
Then: write the modules, add pictures, change the colours, open modules one by one (remove `soon`), set status "live".
See docs/NEW_COURSE.md and docs/DESIGN_SYSTEM.md.
"""
import argparse, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parents[1]

ap = argparse.ArgumentParser(description="Scaffold a new MIYU Academy course")
ap.add_argument("id", help="course id, also the content folder: lowercase-with-dashes")
ap.add_argument("--ru", required=True, help="course title in Russian")
ap.add_argument("--en", required=True, help="course title in English")
ap.add_argument("--modules", type=int, required=True, help="number of modules")
ap.add_argument("--slug", help="address: /ru/courses/<slug> (default: id)")
ap.add_argument("--theme", help="theme name (default: id)")
ap.add_argument("--prefix", help="asset id prefix (default: initials of the id)")
a = ap.parse_args()

cid = a.id
if not re.fullmatch(r"[a-z][a-z0-9-]{1,40}", cid):
    sys.exit("id must be lowercase letters, digits and dashes")
slug = a.slug or cid
theme = a.theme or cid
prefix = a.prefix or "".join(w[0] for w in cid.split("-"))[:3]
ident = re.sub(r"[^A-Za-z0-9]", "_", cid).upper() + "_MODULES"
camel = "".join(w.capitalize() for w in cid.split("-"))
n = a.modules
if not 1 <= n <= 12:
    sys.exit("--modules must be between 1 and 12")

made = []

def write(rel: str, text: str):
    p = root / rel
    if p.exists():
        print(f"  keep   {rel} (already exists)")
        return
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")
    made.append(rel)
    print(f"  create {rel}")

def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')

# 1. Lesson templates
for loc, mod, time, quick, ans, selfc, done, nxt in (
    ("ru", "Модуль", "Время", "Быстрая проверка", "Ответ", "Самопроверка", "Модуль завершён", "Дальше"),
    ("en", "Module", "Time", "Quick check", "Answer", "Self-check", "Module completed", "Next"),
):
    ch = "Глава" if loc == "ru" else "Chapter"
    write(f"content/{cid}/master/_TEMPLATE.{loc}.md", f"""# {mod} 1
# {'Название модуля' if loc == 'ru' else 'Module title'}

**{time}:** {'около 15–20 минут' if loc == 'ru' else 'about 15–20 minutes'}

{'Вступление: пара абзацев до первой главы.' if loc == 'ru' else 'Introduction: a couple of paragraphs before the first chapter.'}

---

## {ch} 1. {'Название главы' if loc == 'ru' else 'Chapter title'}

---

![{'Подпись к картинке' if loc == 'ru' else 'Picture caption'}](/visuals/{cid}/m01/01-picture-1448.webp)

---

{'Первый абзац главы. Если он длиннее 140 знаков, у него будет буквица.' if loc == 'ru' else 'First paragraph of the chapter. If it is longer than 140 characters, it gets a drop cap.'}

### {'Подзаголовок' if loc == 'ru' else 'Sub-heading'}

**{'Длинная жирная строка (40+ знаков) становится цитатой-выноской.' if loc == 'ru' else 'A long bold-only line (40+ characters) becomes a pull quote.'}**

**{'Короткая' if loc == 'ru' else 'Short line'}**

**{'Главная мысль' if loc == 'ru' else 'Key idea'}:** {'так пишется заметка.' if loc == 'ru' else 'this is how a note is written.'}

---

[[activity:{prefix}-m01-example]]

---

## {quick}

{'Вопрос по главе?' if loc == 'ru' else 'A question about the chapter?'}

A. …  
B. …  
C. …  
D. …  

**{ans}:** B.

{'Короткое объяснение после ответа.' if loc == 'ru' else 'A short explanation shown after the answer.'}

---

# {selfc}

---

## 1. {'Первый вопрос?' if loc == 'ru' else 'First question?'}

A. …  
B. …  
C. …  
D. …  

**{ans}:** A.

{'Объяснение.' if loc == 'ru' else 'Explanation.'}

---

# {done}

{'Одна-две фразы итога.' if loc == 'ru' else 'One or two closing sentences.'}

---

# {nxt}

## {mod} 2. {'Название следующего модуля' if loc == 'ru' else 'Next module title'}

{'Тизер следующего модуля.' if loc == 'ru' else 'Teaser of the next module.'}
""")

# 2. Module list
mods = "\n".join(
    f'  {{ id: "module-{i:02d}", order: {i}, duration: NOT_YET, soon: true,\n'
    f'    title: {{ ru: "Модуль {i}", en: "Module {i}" }}, teaser: {{ ru: "", en: "" }} }},'
    for i in range(1, n + 1)
)
write(f"lib/content/{cid}.ts", f"""import type {{ CourseModuleDef }} from "@/lib/courses";

/**
 * {a.en}: {n} modules. Every module starts as `soon: true` (shown as "Coming soon", not clickable).
 * To open a module: add content/{cid}/master/module-NN.ru.md and .en.md, set `duration`, write the title and teaser,
 * remove `soon`. Optional: `image` (tile art, portrait 4:5) and `hero` (top of the lesson), see lib/content/norse.ts.
 */
const NOT_YET = [0, 0] as const;

export const {ident}: readonly CourseModuleDef[] = [
{mods}
];
""")

# 3. Theme
write(f"app/[locale]/{theme}.css", f"""/* =====================================================================
   {a.en}: theme. Switched on by <CourseTheme/> (the course's `theme: "{theme}"` in lib/courses.ts).
   Change only colours, background and decoration here — never fonts, text sizes or alignment
   (docs/DESIGN_SYSTEM.md). The values below are the brand defaults: replace them with the course palette.
   ===================================================================== */

body:has(.themeMark.theme-{theme}){{
 --navy:#0D1D35;      /* headings, dark surfaces */
 --ivory:#F7F1E7;     /* page background */
 --paper:#FFFDF9;     /* cards, notes */
 --parchment:#F1E8D9; /* soft panels */
 --ink:#20242B;       /* reading text */
 --muted:#736C63;     /* captions */
 --line:#D8CCBC;      /* hairlines */
 --gold:#B18B52;      /* accent: labels, drop cap, rules */
 --ochre:#71542B;     /* small labels */
 --gold-soft:#D9BE8C; /* accent on dark */
 /* optional: --pull-ink, --frame, --rule, --surface, --activity-dark, --activity-dark-accent */
 background:var(--ivory);
}}
""")

# 4. Layout import
layout = root / "app/[locale]/layout.tsx"
lt = layout.read_text(encoding="utf-8")
imp = f'import "./{theme}.css";'
if imp not in lt:
    lt = lt.replace('import "./home.css";', f'{imp}\nimport "./home.css";')
    layout.write_text(lt, encoding="utf-8")
    print(f"  update app/[locale]/layout.tsx (imports {theme}.css)")

# 5. Registry
reg = root / "lib/courses.ts"
rt = reg.read_text(encoding="utf-8")
imp_line = f'import {{ {ident} }} from "@/lib/content/{cid}";'
if imp_line not in rt:
    rt = rt.replace('import type { ModuleHeroArt } from "@/lib/visuals";', f'{imp_line}\nimport type {{ ModuleHeroArt }} from "@/lib/visuals";')
m = re.search(r'def\(\{\n    id: "' + re.escape(cid) + r'",.*?\n  \}\),', rt, re.S)
if m:
    entry = m.group(0)
    new = entry.replace("modules: [],", f"modules: {ident},")
    if "theme:" not in new:
        new = new.replace("strictVisuals: false,", f'strictVisuals: false,\n    theme: "{theme}",')
    rt = rt.replace(entry, new)
    print("  update lib/courses.ts (existing entry: modules + theme)")
else:
    entry = f'''  def({{
    id: "{cid}",
    slug: "{slug}",
    status: "soon",
    title: {{ ru: "{esc(a.ru)}", en: "{esc(a.en)}" }},
    blurb: null,
    card: null,
    hero: null,
    modules: {ident},
    hasFinal: false,
    contentDir: "{cid}",
    assetPrefix: "{prefix}",
    contentVersion: "{prefix}-v1",
    strictVisuals: false,
    theme: "{theme}",
  }}),
'''
    rt = rt.replace("\n];\n\nexport const LIVE_COURSES", "\n" + entry + "];\n\nexport const LIVE_COURSES", 1)
    print("  update lib/courses.ts (new entry, status \"soon\")")
reg.write_text(rt, encoding="utf-8")

print(f"""
Done. Next:
  1. Write content/{cid}/master/module-01.ru.md and .en.md (copy _TEMPLATE.*.md).
  2. In lib/content/{cid}.ts: title, teaser, duration for module 1; remove `soon`.
  3. Change the colours in app/[locale]/{theme}.css.
  4. Open a PR: the deploy preview shows the course before it is announced.
  5. When ready: status "live" in lib/courses.ts (plus blurb, card and hero pictures).
""")
