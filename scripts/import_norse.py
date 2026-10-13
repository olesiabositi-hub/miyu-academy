#!/usr/bin/env python3
"""
Imports Norse modules 2–9 (delivered as *_MASTER.md + PNGs) into the site format used by module 1:

  header · per chapter: heading, picture, text · quick check after chapter 4 · [interlude] · self-check
  · [course exam] · module completed · next

Chapter text is copied verbatim (checked paragraph by paragraph). Only structure is added.
Usage: python3 scripts/import_norse.py <work_dir_with_Module_0N_folders>
"""
import json, re, sys
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent
work = Path(sys.argv[1])
COURSE, PUBLIC = "norse-mythology", "norse"

DONE = {
    2: ("Боги осели в Асгарде. Порядка стало ровно столько, сколько удалось договориться.", "The gods have settled in Asgard. There is exactly as much order as they managed to negotiate."),
    3: ("Один получил знания и заплатил за них. Счёт, как обычно, пришёл не сразу.", "Odin has his knowledge and has paid for it. The bill, as usual, did not come at once."),
    4: ("Молот при Торе, великаны при деле. Все при своих проблемах.", "The hammer is with Thor and the giants are busy. Everyone has their own problems."),
    5: ("Локи пошутил. Асгард до сих пор не смеётся.", "Loki made a joke. Asgard is still not laughing."),
    6: ("Судьба выслушала ваши планы и вежливо оставила всё как есть.", "Fate listened to your plans and politely left everything as it was."),
    7: ("Чудовища растут. Боги делают вид, что у них всё под контролем.", "The monsters are growing up. The gods pretend everything is under control."),
    8: ("Смерть оказалась не концом. Просто другим адресом.", "Death turned out not to be the end. Just a different address."),
    9: ("Мир закончился и начался снова. Курс пройден.", "The world ended and began again. The course is complete."),
}

def sub(p, flags=0): return re.compile(p, flags)

def kebab(stem):
    s = re.sub(r"^(?:N\d+_|M\d+-)?\d{2}[-_]", "", stem, flags=re.I)
    s = re.sub(r"[-_]?final$", "", s, flags=re.I)
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:48]

def find_one(mod, pattern):
    return next(iter(sorted((work / f"Module_{mod:02d}").rglob(pattern))))

def parse_questions(text):
    parts = re.split(r"(?m)^\*\*(?:(?:Вопрос|Question) \d+|N\d+-EXAM-\d+)\.\s*(.+?)\*\*\s*$", text)
    out = []
    for i in range(1, len(parts), 2):
        q, body = parts[i].strip(), parts[i + 1]
        opts = re.findall(r"(?m)^([A-D])\. (.+?)\s*$", body)
        ans = re.search(r"\*\*(?:Правильный ответ|Correct answer):\s*([A-D])\*\*", body).group(1)
        fb = body.split(re.search(r"\*\*(?:Правильный ответ|Correct answer):\s*[A-D]\*\*", body).group(0), 1)[1]
        fb = re.sub(r"(?m)^---\s*$", "", fb).strip().strip("*").strip()
        assert len(opts) == 4 and fb, (q, opts, fb)
        out.append((q, opts, ans, fb))
    return out

def parse_master(path, ru):
    t = path.read_text(encoding="utf-8")
    lines = t.splitlines()
    hs = [l[2:].strip() for l in lines if l.startswith("# ")]
    title = [h for h in hs if not h.startswith("MIYU") and not h.startswith("MODULE")][0]
    first = next(i for i, l in enumerate(lines) if re.match(r"^#{2,3} (?:Глава|Chapter) 1\.", l))
    head = "\n".join(lines[:first])
    subs = [p.strip() for p in re.split(r"\n\s*\n", head) if p.strip().startswith("*")]
    # sections
    pat = sub(r"(?m)^#{2,3} (?P<h>(?:Глава|Chapter) \d+\..*|Quick Check.*|Final Check.*|Музыкальная остановка.*|Musical Interlude.*)$")
    ms = list(pat.finditer(t))
    secs = []
    for k, m in enumerate(ms):
        end = ms[k + 1].start() if k + 1 < len(ms) else len(t)
        body = t[m.end():end]
        body = re.sub(r"(?s)\n\s*---\s*$", "", body.rstrip() + "\n").strip()
        body = re.sub(r"(?m)^---\s*$", "", body).strip() if m.group("h").startswith(("Quick", "Final")) else body
        secs.append((m.group("h").strip(), body))
    return title, subs, secs

def norm(s): return re.sub(r"\s+", " ", s).strip()

def next_module(n, loc):
    f = root / "content" / COURSE / "landing" / f"landing.{loc}.md"
    t = f.read_text(encoding="utf-8")
    m = re.search(rf"(?m)^### {n + 1:02d}\.\s+(.+)$", t)
    if not m: return None
    rest = t[m.end():]
    end = re.search(r"(?m)^(###\s|---|##\s)", rest)
    block = rest[:end.start()] if end else rest
    paras = [p.strip() for p in block.split("\n\n") if p.strip() and not p.strip().startswith("*")]
    return m.group(1).strip(), " ".join(paras)

def images_for(n):
    base = work / f"Module_{n:02d}"
    pngs = sorted(p for p in base.rglob("*.png"))
    assert len(pngs) == 8, (n, len(pngs))
    out_dir = root / "public" / "visuals" / PUBLIC / f"m{n:02d}"
    out_dir.mkdir(parents=True, exist_ok=True)
    res = []
    for k, src in enumerate(pngs, 1):
        slug = f"{k:02d}-{kebab(src.stem)}"
        im = Image.open(src).convert("RGB")
        im.save(out_dir / f"{slug}-1448.webp", "WEBP", quality=82, method=6)
        im.resize((724, round(im.height * 724 / im.width)), Image.LANCZOS).save(out_dir / f"{slug}-724.webp", "WEBP", quality=80, method=6)
        res.append((slug, im.width, im.height))
    return res

def qblock(heading, q, opts, ans, fb, ru):
    s = ([heading, ""] if heading else []) + [q, ""] + [f"{x}. {y}  " for x, y in opts] + ["", f"**{'Ответ' if ru else 'Answer'}:** {ans}.", "", fb]
    return "\n".join(s)

def build(n, loc, pics, exam):
    ru = loc == "ru"
    src = find_one(n, f"Module_{n:02d}_{loc.upper()}_MASTER.md")
    title, subs, secs = parse_master(src, ru)
    out = [f"# {'Модуль' if ru else 'Module'} {n}", "", f"# {title}", ""] + sum([[s, ""] for s in subs], [])
    words = 0
    chapters = []
    qc, fc, inter = [], [], None
    ch_i = 0
    for h, body in secs:
        if re.match(r"(?:Глава|Chapter) \d+\.", h):
            ch_i += 1
            chapters.append((h, body))
            words += len(body.split())
        elif h.startswith("Quick"): qc = parse_questions(body)
        elif h.startswith("Final"): fc = parse_questions(body)
        else: inter = (h, body)
    assert len(chapters) == 8 and len(qc) == 2 and len(fc) == 3, (n, loc, len(chapters), len(qc), len(fc))
    out_tail = []
    for k, (h, body) in enumerate(chapters, 1):
        out += ["---", "", "## " + h, "", "---", ""]
        slug, w, hgt = pics[k - 1]
        alt = re.sub(r"^(?:Глава|Chapter) \d+\.\s*", "", h).replace("[", "").replace("]", "")
        out += [f"![{alt}](/visuals/{PUBLIC}/m{n:02d}/{slug}-1448.webp)", "", "---", "", body.strip(), ""]
        if k == 4:
            for q, opts, ans, fb in qc:
                out += ["---", "", qblock("## " + ("Быстрая проверка" if ru else "Quick check"), q, opts, ans, fb, ru), ""]
    if inter:
        out += ["---", "", "## " + inter[0], "", "---", "", inter[1].strip(), ""]
    out += ["---", "", "# " + ("Самопроверка" if ru else "Self-check"), ""]
    for k, (q, opts, ans, fb) in enumerate(fc, 1):
        out += ["---", "", f"## {k}. {q}", "", *[f"{x}. {y}  " for x, y in opts], "", f"**{'Ответ' if ru else 'Answer'}:** {ans}.", "", fb, ""]
    if exam:
        intro = ("Девять модулей позади. Осталась последняя проверка: что из всего этого вы действительно запомнили? Восемнадцать вопросов, по два на модуль. Ответ и объяснение открываются после каждого вопроса."
                 if ru else "Nine modules are behind you. One last check: what did you actually remember? Eighteen questions, two per module. The answer and explanation open after each question.")
        out += ["---", "", "# " + ("Итоговый тест курса" if ru else "Course final exam"), "", intro, ""]
        for k, (q, opts, ans, fb) in enumerate(exam[loc], 1):
            out += ["---", "", f"## {k}. {q}", "", *[f"{x}. {y}  " for x, y in opts], "", f"**{'Ответ' if ru else 'Answer'}:** {ans}.", "", fb, ""]
    done = DONE[n][0 if ru else 1]
    out += ["---", "", "# " + ("Модуль завершён" if ru else "Module completed"), "", done, ""]
    nxt = next_module(n, loc)
    if nxt:
        out += ["---", "", "# " + ("Дальше" if ru else "Next"), "", f"## {'Модуль' if ru else 'Module'} {n + 1}. {nxt[0]}", "", nxt[1], ""]
    lo, hi = round(words / 165), round(words / 130)
    out[out.index("")+0:0] = []  # no-op, keeps indices stable
    tl = f"**{'Время' if ru else 'Time'}:** {'около' if ru else 'about'} {lo}–{hi} {'минут' if ru else 'minutes'}"
    first_rule = out.index("---")
    out[first_rule:first_rule] = [tl, ""]
    new = "\n".join(out).rstrip() + "\n"
    flat = norm(new)
    for h, body in chapters + ([inter] if inter else []):
        for p in [p for p in re.split(r"\n\s*\n", body) if p.strip()]:
            assert norm(p) in flat, f"text changed in {n}/{loc}: {p[:70]}"
    dest = root / "content" / COURSE / "master" / f"module-{n:02d}.{loc}.md"
    dest.write_text(new, encoding="utf-8")
    return words, dest

def exam_questions():
    res = {}
    for loc in ("ru", "en"):
        f = next((work / "Module_09").rglob(f"COURSE_FINAL_ASSESSMENT_{loc.upper()}.md"))
        t = f.read_text(encoding="utf-8")
        t = t.split("## Русская версия")[-1] if loc == "ru" else t.split("## English version")[-1]
        qs = parse_questions(t)
        assert len(qs) == 18, (loc, len(qs))
        res[loc] = qs
    return res

if __name__ == "__main__":
    mods = [int(x) for x in sys.argv[2:]] or list(range(2, 10))
    exam = exam_questions()
    for n in mods:
        pics = images_for(n)
        for loc in ("ru", "en"):
            words, dest = build(n, loc, pics, exam if n == 9 else None)
            print(n, loc, "words", words, "→", dest.relative_to(root))
