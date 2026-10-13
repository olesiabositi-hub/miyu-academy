#!/usr/bin/env python3
"""
Turns a delivered module package (Module-NN-RU.md / -EN.md, assessment files, asset-manifest.json, PNGs)
into the site format. Chapter text is copied verbatim; only structure is added:

  header chunk · chapter heading · chapter picture · chapter text · quick checks after chapter 4 ·
  self-check · "module completed" · "next".

Usage:
  python3 scripts/import_module.py --course norse-mythology --public norse --module 1 \
     --package /path/to/module-01 --minutes "15–20" \
     --done-ru "…" --done-en "…" [--anchor 2=12]

--anchor CH=K puts the chapter's second picture after its K-th text paragraph (0-based, heading excluded).
Pictures are taken from asset-manifest.json in order: `after_chapter` is the chapter a picture illustrates;
it opens that chapter. Any further picture of the same chapter goes to the anchor (default: 45 % of the chapter).
"""
import argparse, json, re, shutil, sys
from pathlib import Path
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("--course", required=True)
ap.add_argument("--public", required=True, help="folder under public/visuals")
ap.add_argument("--module", type=int, required=True)
ap.add_argument("--package", required=True)
ap.add_argument("--minutes", required=True)
ap.add_argument("--done-ru", required=True)
ap.add_argument("--done-en", required=True)
ap.add_argument("--anchor", action="append", default=[])
ap.add_argument("--quick-after", type=int, default=4)
a = ap.parse_args()

root = Path(__file__).resolve().parent.parent
pkg = Path(a.package)
mid = f"{a.module:02d}"
anchors = {int(x.split("=")[0]): int(x.split("=")[1]) for x in a.anchor}
manifest = json.loads((pkg / "asset-manifest.json").read_text(encoding="utf-8"))

# pictures → webp
out_img = root / "public" / "visuals" / a.public / f"m{mid}"
out_img.mkdir(parents=True, exist_ok=True)
by_chapter = {}
for e in manifest["assets"]:
    src = pkg / e["file"]
    slug = re.sub(r"\.png$", "", src.name, flags=re.I).lower()
    im = Image.open(src).convert("RGB")
    im.save(out_img / f"{slug}-1448.webp", "WEBP", quality=82, method=6)
    im.resize((724, round(im.height * 724 / im.width)), Image.LANCZOS).save(out_img / f"{slug}-724.webp", "WEBP", quality=80, method=6)
    by_chapter.setdefault(e["after_chapter"], []).append((slug, e["scene_ru"], e["scene_en"]))

def questions(path):
    t = path.read_text(encoding="utf-8")
    items = re.split(r"\n### (N\d+-[A-Z]+-\d+)\n", t)[1:]
    out = []
    for i in range(0, len(items), 2):
        body = re.split(r"\n## ", items[i + 1])[0].strip()
        q = re.search(r"\*\*(?:Вопрос|Question) \d+\.\s*(.+?)\*\*", body).group(1).strip()
        opts = re.findall(r"(?m)^([A-D])\. (.+?)\s*$", body)
        ans = re.search(r"\*\*(?:Правильный ответ|Correct answer):\s*([A-D])\*\*", body).group(1)
        fb = body.splitlines()[-1].strip()
        fb = re.sub(r"^\*\*(?:Обратная связь|Feedback):\*\*\s*", "", fb).strip("*").strip()
        kind = "quick" if "-QC-" in items[i] else "final"
        out.append((kind, q, opts, ans, fb))
    return out

def next_module(loc):
    """Title and description of module N+1 from the approved course page (first paragraph block only)."""
    f = root / "content" / a.course / "landing" / f"landing.{loc}.md"
    if not f.exists(): return None
    t = f.read_text(encoding="utf-8")
    m = re.search(rf"(?m)^### {a.module + 1:02d}\.\s+(.+)$", t)
    if not m: return None
    rest = t[m.end():]
    end = re.search(r"(?m)^(###\s|---|##\s)", rest)
    block = rest[:end.start()] if end else rest
    paras = [p.strip() for p in block.split("\n\n") if p.strip() and not p.strip().startswith("*")]
    return (m.group(1).strip(), " ".join(paras)) if paras else (m.group(1).strip(), "")

def build(loc):
    ru = loc == "ru"
    src = (pkg / "content" / ("Module-%s-RU-LOCKED.md" % mid if ru else "Module-%s-EN.md" % mid)).read_text(encoding="utf-8")
    parts = re.split(r"(?m)^(?=## (?:Глава|Chapter) \d+\.)", src)
    head, chapters = parts[0], parts[1:]
    hl = head.splitlines()
    title = hl[1].lstrip("# ").strip()
    sub = next(l for l in hl if l.startswith("*"))
    qs = questions(pkg / "assessment" / ("Module-%s-Questions-%s.md" % (mid, "RU" if ru else "EN")))
    out = [f"# {'Модуль' if ru else 'Module'} {a.module}", "", f"# {title}", "", sub, "",
           f"**{'Время' if ru else 'Time'}:** {'около' if ru else 'about'} {a.minutes} {'минут' if ru else 'minutes'}"]
    def qblock(q, heading=None):
        _, text, opts, ans, fb = q
        s = ([heading, ""] if heading else []) + [text, ""] + [f"{x}. {y}  " for x, y in opts] + ["", f"**{'Ответ' if ru else 'Answer'}:** {ans}.", "", fb]
        return "\n".join(s)
    for n, ch in enumerate(chapters, 1):
        lines = ch.strip().split("\n")
        heading, body = lines[0], "\n".join(lines[1:]).strip()
        paras = [p for p in re.split(r"\n\s*\n", body) if p.strip()]
        out += ["", "---", "", heading]
        pics = by_chapter.get(n, [])
        def pic(p): return f"![{p[1] if ru else p[2]}](/visuals/{a.public}/m{mid}/{p[0]}-1448.webp)"
        if pics: out += ["", "---", "", pic(pics[0])]
        extra = pics[1:]
        cut = anchors.get(n, int(len(paras) * 0.45) - 1)
        if extra:
            out += ["", "---", "", "\n\n".join(paras[:cut + 1])]
            for p in extra: out += ["", "---", "", pic(p)]
            out += ["", "---", "", "\n\n".join(paras[cut + 1:])]
        else:
            out += ["", "---", "", "\n\n".join(paras)]
        if n == a.quick_after:
            for q in [x for x in qs if x[0] == "quick"]:
                out += ["", "---", "", qblock(q, "## " + ("Быстрая проверка" if ru else "Quick check"))]
    out += ["", "---", "", "# " + ("Самопроверка" if ru else "Self-check")]
    for k, q in enumerate([x for x in qs if x[0] == "final"], 1):
        _, text, opts, ans, fb = q
        out += ["", "---", "", f"## {k}. {text}", "", *[f"{x}. {y}  " for x, y in opts], "", f"**{'Ответ' if ru else 'Answer'}:** {ans}.", "", fb]
    done = a.done_ru if ru else a.done_en
    out += ["", "---", "", "# " + ("Модуль завершён" if ru else "Module completed"), "", done]
    nxt = next_module(loc)
    if nxt:
        out += ["", "---", "", "# " + ("Дальше" if ru else "Next"), "", f"## {'Модуль' if ru else 'Module'} {a.module + 1}. {nxt[0]}", "", nxt[1]]
    # verbatim check of chapter text
    new = "\n".join(out)
    flat = re.sub(r"\s+", " ", new)
    for ch in chapters:
        for p in [p for p in re.split(r"\n\s*\n", ch.strip()) if p.strip()]:
            assert re.sub(r"\s+", " ", p.strip()) in flat, f"text changed: {p[:60]}"
    dest = root / "content" / a.course / "master" / f"module-{mid}.{loc}.md"
    dest.write_text(new + "\n", encoding="utf-8")
    print("wrote", dest.relative_to(root))

build("ru"); build("en")
