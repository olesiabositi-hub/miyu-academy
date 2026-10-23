#!/usr/bin/env python3
"""
Academy design guard. Runs on every build (package.json "prebuild") next to validate_content.py.
It stops the build when a change breaks a shared rule from docs/DESIGN_SYSTEM.md:

  1. Fonts come only from the two brand tokens (var(--font-serif), var(--font-sans)).
     Exception: the "MIYU Hieroglyphs" sign font used by the cartouche game.
  2. No justified text anywhere.
  3. Google fonts are loaded only in app/[locale]/layout.tsx.
  4. Every [[game:…]] / [[activity:…]] marker in a lesson exists.
  5. Every picture a lesson links to (/visuals/…) exists in public/.

LEGACY lists files that predate the base and are migrated step by step. Remove a file from it when its course
moves onto the base; never add a new one.
"""
import re, sys, pathlib

root = pathlib.Path(__file__).resolve().parents[1]
errors: list[str] = []

LEGACY = {
    # Ossetian headscarf story: own fonts (Forum, Literata, Manrope) until it moves onto the base (step 4).
    "app/[locale]/stories/ossetian-headscarf/story.css",
    "app/[locale]/stories/ossetian-headscarf/page.tsx",
}

def rel(p: pathlib.Path) -> str:
    return p.relative_to(root).as_posix()

def css_files():
    for base in ("app", "components"):
        yield from (root / base).rglob("*.css")

# 1 + 2: fonts and alignment in stylesheets
FONT_DECL = re.compile(r"(?<![-\w])font(?:-family)?\s*:\s*([^;}]+)")
for f in css_files():
    r = rel(f)
    text = f.read_text(encoding="utf-8")
    if re.search(r"text-align\s*:\s*justify", text):
        errors.append(f"{r}: text-align:justify is not allowed (text is always left-aligned)")
    if r in LEGACY:
        continue
    for m in FONT_DECL.finditer(text):
        value = m.group(1).strip()
        if value in ("inherit", "initial", "unset") or "var(--font-" in value:
            continue
        if "MIYU Hieroglyphs" in value:
            continue
        line = text.count("\n", 0, m.start()) + 1
        errors.append(f"{r}:{line}: font '{value[:60]}' — use var(--font-serif) or var(--font-sans)")

# 3: font loading
for f in list((root / "app").rglob("*.tsx")) + list((root / "components").rglob("*.tsx")):
    r = rel(f)
    if r == "app/[locale]/layout.tsx" or r in LEGACY:
        continue
    if "next/font/google" in f.read_text(encoding="utf-8"):
        errors.append(f"{r}: loads its own Google font — fonts are loaded once, in app/[locale]/layout.tsx")

# 4: games and activities used in lessons must exist
games = set(re.findall(r'game === "([\w-]+)"', (root / "components/GameBlock.tsx").read_text(encoding="utf-8")))
activities = set(re.findall(r'^\s*"([\w-]+)":\s*\{', (root / "lib/content/activities.ts").read_text(encoding="utf-8"), re.M))
lessons = sorted((root / "content").glob("*/master/*.md"))
for md in lessons:
    text = md.read_text(encoding="utf-8")
    for kind, name in re.findall(r"\[\[(game|activity):([^\]\s]+)\]\]", text):
        known = games if kind == "game" else activities
        if name not in known:
            errors.append(f"{rel(md)}: unknown [[{kind}:{name}]] (add it to {'components/GameBlock.tsx' if kind == 'game' else 'lib/content/activities.ts'})")

# 5: pictures linked from lessons must exist
for md in lessons:
    for src in re.findall(r"!\[[^\]]*\]\((/[^)\s]+)\)", md.read_text(encoding="utf-8")):
        if not (root / "public" / src.lstrip("/")).exists():
            errors.append(f"{rel(md)}: picture {src} not found in public/")

if errors:
    print("MIYU design check: FAIL")
    print("\n".join(errors))
    sys.exit(1)
print("MIYU design check: PASS")
