#!/usr/bin/env python3
"""
Ancient Egypt: turns the delivered module packages (RU/EN masters + PNG illustrations) into the site format.

Every learner paragraph of the masters is copied verbatim (checked at the end). Only structure is added:
  header · chapter heading · chapter picture · chapter text · quick checks where the master puts them ·
  self-check (the master's Final Checks) · module completed · next module.
Editorial blocks (answer keys, historical notes, illustration maps) are not copied into the lesson;
answer keys are used for the checks only.

Usage:
  python3 scripts/import_egypt.py --src /path/with/unzipped/packages
The script knows where each module keeps its files (MODULES below) and which picture opens which chapter.
"""
import argparse, json, re, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT_MD = ROOT / "content" / "egyptian-mythology" / "master"
OUT_IMG = ROOT / "public" / "visuals" / "egypt"

# chapter keys: 0 = introduction, 1..6 = chapters, 7 = conclusion. A list = first opens the chapter,
# the next ones open the section whose ### subhead starts with the given text (RU / EN).
MODULES = {
    1: dict(dir="*Module_01_LOCKED/*", ru="texts/module-01-RU-LOCKED.md", en="texts/module-01-EN-LOCKED.md", img="images",
            pics={1: "01-NUN-AND-FIRST-MOUND", 2: "02-ATUM-SHU-TEFNUT", 3: "03-NUT-GEB-SHU", 4: "04-GREAT-ENNEAD",
                  5: "05-THREE-CREATION-TRADITIONS", 6: "06-KHNUM-AND-MAAT"}),
    2: dict(dir="*Module_02_COMPLETE/*", ru="module-02.ru.md", en="module-02.en.md", img="images",
            pics={1: "01-OSIRIS-KING-OF-THE-NILE", 2: "02-SET-BANQUET-AND-THE-CHEST", 3: "03-ISIS-SEARCH-IN-BYBLOS",
                  4: "04-ISIS-NEPHTHYS-ANUBIS-RESTORATION", 5: "05-HORUS-AND-SET-DIVINE-TRIBUNAL", 6: "06-OSIRIS-AFTERLIFE-JUDGMENT"}),
    3: dict(dir="*Module_03_FINAL/*", ru="texts/MIYU_Ancient_Egypt_Module_03_RU_APPROVED.md", en="texts/MIYU_Ancient_Egypt_Module_03_EN.md", img="illustrations",
            hero="01-INTRO-the-morning-that-might-not-come",
            pics={1: "02-CH01-khepri-ra-atum-solar-cycle", 2: "03-CH02-ra-daytime-solar-barque",
                  3: "04-CH03-night-journey-through-duat", 4: "05-CH04-set-confronts-apep", 5: "06-CH05-sekhmet-and-red-beer",
                  6: "07-CH06-maat-temple-ritual", 7: "08-ENDING-sunrise-renewed"}),
    4: dict(dir="*Module_04_APPROVED_PACKAGE/*", ru="texts/MIYU_Academy_Ancient_Egypt_Module_04_RU.md", en="texts/MIYU_Academy_Ancient_Egypt_Module_04_EN.md", img="images",
            hero="04-Journey-Through-the-Egyptian-Afterlife",
            pics={1: "02-Ancient-Egyptian-Embalming-Ritual", 2: "03-Ba-Soul-Above-the-Golden-Temple",
                  3: "05-Egyptian-Hall-of-Judgment", 4: ["01-Weighing-of-the-Heart", ("Познакомьтесь: Аммат", "Meet Ammit", "06-Ammit-in-the-Judgment-Hall")],
                  5: "07-Osiris-Throne-of-Judgment", 6: "08-Field-of-Reeds-at-Sunset"}),
    5: dict(dir="*Module_05_RU_EN_8_ILLUSTRATIONS", ru="texts/Module_05_RU.md", en="texts/Module_05_EN.md", img="illustrations",
            hero="01_Pyramid_Project_Architects",
            pics={1: "02_Construction_Overlook", 2: "05_Architects_at_Work", 3: "06_Construction_Planning",
                  4: "08_Workers_and_Overseer", 5: ["04_Quarry_and_Worksite", ("Самая упрямая часть проекта", "The most stubborn part of the project", "03_Limestone_Sled_Workers")],
                  6: "07_Pyramid_Workforce"}),
    6: dict(dir="*Module_06_RU_EN_8_ILLUSTRATIONS_1/*", ru="texts/MIYU_Academy_Ancient_Egypt_Module_06_RU.md", en="texts/MIYU_Academy_Ancient_Egypt_Module_06_EN.md", img="images",
            hero="03-Excavation-of-Tutankhamun",
            pics={1: "01-Tutankhamun-Tomb-Discovery", 2: "02-The-Golden-Burial-Chamber", 3: ["04-Builders-of-Giza", ("Первая улика", "First Clue", "05-Life-Beside-the-Pyramids")],
                  5: "06-Champollion-and-the-Rosetta-Stone", 6: "07-Modern-Egyptian-Excavation", 7: "08-Tomb-Conservation"}),
}

# Teasers for the module cards and the "Next" block: sentences from the approved landing copy and module texts.
TEASERS = {
    1: None,  # module 1 has its own subtitle
    2: {"ru": "Осирис становится правителем царства мёртвых после крайне неудачного семейного конфликта.",
        "en": "Osiris becomes ruler of the realm of the dead after a spectacularly disastrous family conflict."},
    3: {"ru": "Ра каждое утро спасает мир от тьмы. В этом модуле мы проживём один полный солнечный цикл.",
        "en": "Every morning, Ra saves the world from darkness. Over the course of this module, we'll live through one complete solar cycle."},
    4: {"ru": "Впереди путешествие через загробный мир, встреча с Анубисом и главное испытание — взвешивание собственного сердца.",
        "en": "Ahead lies a journey through the afterlife, a meeting with Anubis, and the ultimate test: the weighing of your own heart."},
    5: {"ru": "Мы узнаем, как египтяне научились строить невозможное, зачем фараонам понадобились пирамиды и почему настоящие инженерные достижения впечатляют сильнее любых фантастических теорий.",
        "en": "We'll discover how the Egyptians learned to build what seemed impossible, why pharaohs needed pyramids, and why real engineering achievements are more impressive than any fantastical theory."},
    6: {"ru": "Проклятия фараонов, тайные комнаты, инопланетяне и загадочные письмена. Египет породил столько легенд, что порой настоящая история теряется за ними.",
        "en": "Pharaohs' curses, hidden chambers, aliens, and mysterious writings. Egypt has inspired so many legends that the real history sometimes gets lost behind them."},
}

# Activities (lib/content/activities.ts) placed after a chapter: {module: {chapter: [activity ids]}}.
ACTIVITIES = {
    1: {3: ["m01-elements"], 4: ["m01-ennead"]},
    2: {5: ["m02-family"]},
    3: {4: ["m03-sun"]},
    4: {4: ["m04-hall"], 6: ["m04-scales"]},
    5: {4: ["m05-pyramids"]},
    6: {4: ["m06-scales"], 5: ["m06-cartouche"]},
}

EDITORIAL = re.compile(r"^#{1,3}\s+.*(Служебный блок|РЕДАКТОРСК|Редакторск|Internal Section|EDITORIAL|Editorial)", re.I)
CHAPTER = re.compile(r"^##\s+(Вступление|Introduction|Глава|Chapter|Завершение|Conclusion)\b(.*)$")
CHECK = re.compile(r"^#{2,3}\s+(QUICK CHECK|Quick Check|FINAL CHECK|Final Check)\s+0?(\d+)\b\s*[.—–-]?\s*(.*)$", re.I)
FINAL_GROUP = re.compile(r"^#{1,2}\s+(Финальная проверка|Final Checks?)\s*(?:[.—–-].*)?$", re.I)
M01_DONE = re.compile(r"^#\s+(Завершение модуля|Module Completion)\s*$")


def clean_q(s: str) -> str:
    s = s.strip()
    s = re.sub(r"^\*\*(?:Вопрос|Question):\*\*\s*", "", s)
    s = re.sub(r"^\*\*(.+)\*\*$", r"\1", s)
    return s.strip()


def unquote(s: str) -> str:
    s = s.strip()
    m = re.fullmatch(r"[«“\"](.+?)[»”\"]\s*([.!?]?)", s, re.S)
    if m:
        inner = m.group(1).strip()
        return inner if re.search(r"[.!?…]$", inner) else inner + (m.group(2) or ".")
    return s


def parse_check(lines, title):
    """Question, options, answer and feedback from one check block (inline formats)."""
    body = "\n".join(lines)
    opts = []
    for l in lines:
        m = re.match(r"^(?:-\s+)?(?:\*\*)?([A-D])\.(?:\*\*)?\s+(.+?)\s*$", l)
        if m: opts.append((m.group(1), m.group(2).strip()))
    q = None
    for l in lines:
        if re.match(r"^\*\*(?:Вопрос|Question):\*\*", l): q = clean_q(l); break
    if q is None:
        for l in lines:
            if re.match(r"^\*\*[^*].*\*\*$", l.strip()): q = clean_q(l); break
    ans = re.search(r"(?:Правильный ответ|Correct answer):?\**\s*\**\s*([A-D])", body)
    ok = re.search(r"^\*\*(?:Обратная связь — верно|Feedback — correct):\*\*\s*(.+)$", body, re.M)
    bad = re.search(r"^\*\*(?:Обратная связь — неверно|Feedback — incorrect):\*\*\s*(.+)$", body, re.M)
    per = {m.group(1): (m.group(2).strip() + " " + m.group(3).strip()).strip() for m in re.finditer(r"^-\s+\*\*([A-D]) — (.+?)\*\*\s*(.*)$", body, re.M)}
    return dict(title=title, question=q, options=opts, answer=ans.group(1) if ans else None,
                ok=ok.group(1).strip() if ok else None, bad=bad.group(1).strip() if bad else None, per=per or None, common=None)


def parse_keys(lines):
    """Answer keys from an editorial block (modules 1 and 2)."""
    keys, cur = {}, None
    buf = []
    def flush():
        if cur is None: return
        body = "\n".join(buf)
        ans = re.search(r"(?:Правильный ответ|Correct answer):?\**\s*\**\s*([A-D])", body)
        ok = re.search(r"\*\*(?:Если верно|If correct):\*\*\s*(.+)$", body, re.M)
        bad = re.search(r"\*\*(?:Если неверно|Если ответ неверный|If incorrect|If the answer is incorrect):\*\*\s*(.+)$", body, re.M)
        common = None
        if not ok:
            paras = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
            paras = [p for p in paras if not re.match(r"^\*\*(Правильный ответ|Correct answer)", p) and not re.match(r"^\*\*(Если|If)", p)]
            common = paras[0] if paras else None
        keys[cur] = dict(answer=ans.group(1), ok=unquote(ok.group(1)) if ok else None, bad=unquote(bad.group(1)) if bad else None, common=common)
    for l in lines:
        m = re.match(r"^#{2,3}\s+(QUICK CHECK|Quick Check|FINAL CHECK|Final Check)\s+0?(\d+)\s*$", l, re.I)
        if m:
            flush(); cur = (m.group(1).lower().split()[0], int(m.group(2))); buf = []; continue
        if re.match(r"^#{1,3}\s", l) and cur is not None:
            flush(); cur = None; buf = []; continue
        if cur is not None: buf.append(l)
    flush()
    return keys


def parse(path: Path, loc: str):
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)  # yaml front matter (module 3)
    lines = text.split("\n")
    cut = next((i for i, l in enumerate(lines) if EDITORIAL.match(l)), len(lines))
    learner, editorial = lines[:cut], lines[cut:]
    keys = parse_keys(editorial)
    # title: first heading that carries "Модуль NN." / "Module NN." or the second "# " line (module 1)
    title = None
    for l in learner[:6]:
        m = re.match(r"^#{1,2}\s+(?:Модуль|Module)\s+0?\d+\.\s+(.+)$", l)
        if m: title = m.group(1).strip().strip("«»“”\""); break
    if title is None:
        title = [l for l in learner if l.startswith("# ")][1][2:].strip()
    subtitle = next((l.strip() for l in learner[:8] if re.match(r"^\*[^*].*\*$", l.strip())), None)

    units, cur = [], None
    def push(u):
        nonlocal cur
        if cur: units.append(cur)
        cur = u
    for l in learner:
        if (m := CHAPTER.match(l)):
            push(dict(kind="chapter", head=l[3:].strip(), lines=[])); continue
        if (m := CHECK.match(l)):
            kind = "quick" if m.group(1).lower().startswith("quick") else "final"
            push(dict(kind=kind, n=int(m.group(2)), title=m.group(3).strip(), lines=[])); continue
        if FINAL_GROUP.match(l):
            push(dict(kind="final-intro", lines=[])); continue
        if M01_DONE.match(l):
            push(dict(kind="m01-done", lines=[])); continue
        if cur is None: continue
        if cur["kind"] == "m01-done" and l.startswith("## "):
            cur = dict(kind="chapter", head=("Завершение. " if loc == "ru" else "Conclusion. ") + l[3:].strip(), lines=[], synthetic=True); continue
        cur["lines"].append(l)
    if cur: units.append(cur)

    for u in units:
        while u["lines"] and u["lines"][-1].strip() in ("", "---"): u["lines"].pop()
        while u["lines"] and u["lines"][0].strip() in ("", "---"): u["lines"].pop(0)
        if u["kind"] in ("quick", "final"):
            c = parse_check(u["lines"], u["title"])
            k = keys.get(("quick" if u["kind"] == "quick" else "final", u["n"]))
            if k:
                for f in ("answer", "ok", "bad", "common"):
                    if not c.get(f) and k.get(f): c[f] = k[f]
            assert c["question"] and len(c["options"]) >= 2 and c["answer"], (path.name, u["kind"], u["n"], c)
            u["check"] = c
    return dict(title=title, subtitle=subtitle, units=units, raw="\n".join(learner))


def paragraphs(lines):
    """Lesson paragraphs of a chapter: blank-line separated blocks; stray "---" rules and per-check
    system lines are dropped."""
    out, buf = [], []
    for l in lines + [""]:
        if l.strip() == "" or l.strip() == "---":
            if buf: out.append("\n".join(buf)); buf = []
            continue
        buf.append(l.rstrip())
    return [p for p in out if not re.match(r"^\*(Системные ответы|System answers|Выберите один|Choose one|Select one)", p)]


def minutes(model, loc):
    m = re.search(r"(?:Ориентировочное время прохождения|Estimated completion time|Estimated time)[^0-9]*(\d+)\s*[–-]\s*(\d+)", model["raw"])
    if m: return f"{m.group(1)}–{m.group(2)}"
    words = sum(len(" ".join(u["lines"]).split()) for u in model["units"] if u["kind"] == "chapter")
    wpm = 150 if loc == "ru" else 190
    lo = max(10, round(words / wpm / 5) * 5)
    return f"{lo}–{lo + 5}"


def build(n, cfg, src: Path, loc: str, next_info, durations):
    ru = loc == "ru"
    pkg = next(src.glob(cfg["dir"]))
    model = parse(pkg / cfg[loc], loc)
    mid = f"{n:02d}"
    def fig(name):
        slug = name.lower().replace("_", "-")
        return f"![{alts[f'm{mid}/{slug}'][loc]}](/visuals/egypt/m{mid}/{slug}-1448.webp)"
    alts = json.loads((ROOT / "content" / "egyptian-mythology" / "picture-alts.json").read_text(encoding="utf-8"))
    mins = durations.setdefault(n, minutes(model, "ru")) if ru else durations[n]
    out = [f"# {'Модуль' if ru else 'Module'} {n}", "", f"# {model['title']}", ""]
    if model["subtitle"]: out += [model["subtitle"], ""]
    out += [f"**{'Время' if ru else 'Time'}:** {'около' if ru else 'about'} {mins} {'минут' if ru else 'minutes'}"]
    ch_no = 0
    quick = 0
    finals, final_intro = [], None
    copied = []
    copied_skip = set()
    for u in model["units"]:
        if u["kind"] == "chapter":
            head = u["head"]
            if re.match(r"^(Вступление|Introduction)\b", head): key = 0
            elif re.match(r"^(Завершение|Conclusion)\b", head): key = 7
            else: ch_no += 1; key = ch_no
            # "Глава 01. X" / "Chapter 1. X" → one form for the page: "Глава 1. X"
            head = re.sub(r"^(Глава|Chapter)\s+0?(\d+)\s*[.:]\s*", lambda m: f"{m.group(1)} {int(m.group(2))}. ", head)
            out += ["", "---", "", "## " + head]
            entry = cfg["pics"].get(key)
            lead, extra = (entry[0], entry[1:]) if isinstance(entry, list) else (entry, [])
            if lead: out += ["", "---", "", fig(lead)]
            paras = paragraphs(u["lines"])
            for a_ru, a_en, name in extra:
                anchor = a_ru if ru else a_en
                k = next(i for i, p in enumerate(paras) if p.startswith("### ") and anchor.lower() in p.lower())
                paras = paras[:k] + [fig(name)] + paras[k:]
                copied_skip.add(fig(name))
            # module 4–6 end the conclusion with "**Модуль завершён.**  \n**Что остаётся…**" — keep it as text
            out += ["", "---", "", "\n\n".join(paras)]
            copied += [p for p in paras if p not in copied_skip]
            for act in ACTIVITIES.get(n, {}).get(key, []):
                out += ["", "---", "", f"[[activity:{act}]]"]
        elif u["kind"] == "quick":
            quick += 1
            out += ["", "---", "", check_md(u["check"], ru, heading="## " + ("Быстрая проверка" if ru else "Quick check"))]
        elif u["kind"] == "final-intro":
            final_intro = "\n\n".join(p for p in paragraphs(u["lines"]))
        elif u["kind"] == "final":
            finals.append(u["check"])
    out += ["", "---", "", "# " + ("Самопроверка" if ru else "Self-check")]
    if final_intro: out += ["", final_intro]
    for k, c in enumerate(finals, 1):
        out += ["", "---", "", check_md(c, ru, heading=f"## {k}. {c['question']}", question_in_heading=True)]
    out += ["", "---", "", "# " + ("Модуль завершён" if ru else "Module completed")]
    if next_info:
        out += ["", "---", "", "# " + ("Дальше" if ru else "Next"), "", f"## {'Модуль' if ru else 'Module'} {n + 1}. {next_info['title']}"]
        if next_info.get("subtitle"): out += ["", next_info["subtitle"].strip("*")]
    new = "\n".join(out) + "\n"
    flat = re.sub(r"\s+", " ", new)
    for p in copied:
        assert re.sub(r"\s+", " ", p.strip()) in flat, f"text changed: {p[:60]}"
    OUT_MD.mkdir(parents=True, exist_ok=True)
    (OUT_MD / f"module-{mid}.{loc}.md").write_text(new, encoding="utf-8")
    return model, len(finals), quick


def check_md(c, ru, heading, question_in_heading=False):
    s = [heading, ""]
    if c.get("title") and not question_in_heading and not re.fullmatch(r"\d+", c["title"]):
        s += [f"**{c['title'].rstrip('.')}**", ""]
    if not question_in_heading:
        s += [c["question"], ""]
    elif c.get("title"):
        # Final checks keep their approved title as a lead-in line above the options.
        s += [f"*{c['title'].rstrip('.')}*", ""]
    s += [f"{x}. {y}  " for x, y in c["options"]]
    s += ["", f"**{'Ответ' if ru else 'Answer'}:** {c['answer']}."]
    if c.get("common"): s += ["", c["common"]]
    if c.get("ok"): s += ["", f"**{'Если верно' if ru else 'If correct'}:** {c['ok']}"]
    if c.get("bad"): s += ["", f"**{'Если неверно' if ru else 'If incorrect'}:** {c['bad']}"]
    if c.get("per"):
        for x, t in c["per"].items(): s += ["", f"**{'Вариант' if ru else 'Option'} {x}:** {t}"]
    return "\n".join(s)


def images(n, cfg, src: Path):
    pkg = next(src.glob(cfg["dir"]))
    dest = OUT_IMG / f"m{n:02d}"
    dest.mkdir(parents=True, exist_ok=True)
    names = [cfg["hero"]] if cfg.get("hero") else []
    for v in cfg["pics"].values():
        names += [v[0]] + [x[2] for x in v[1:]] if isinstance(v, list) else [v]
    for name in names:
        slug = name.lower().replace("_", "-")
        if (dest / f"{slug}-1448.webp").exists(): continue
        im = Image.open(pkg / cfg["img"] / f"{name}.png").convert("RGB")
        im.save(dest / f"{slug}-1448.webp", "WEBP", quality=84, method=6)
        im.resize((724, round(im.height * 724 / im.width)), Image.LANCZOS).save(dest / f"{slug}-724.webp", "WEBP", quality=82, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--only", type=int, action="append")
    a = ap.parse_args()
    src = Path(a.src)
    durations = {}
    summary = {}
    for loc in ("ru", "en"):
        models = {n: parse(next(src.glob(cfg["dir"])) / cfg[loc], loc) for n, cfg in MODULES.items()}
        for n, cfg in MODULES.items():
            if a.only and n not in a.only: continue
            nxt = models.get(n + 1)
            info = None
            if nxt:
                t = TEASERS.get(n + 1)
                info = dict(title=nxt["title"], subtitle=t[loc] if t else nxt["subtitle"])
            model, nf, nq = build(n, cfg, src, loc, info, durations)
            if loc == "ru": images(n, cfg, src)
            summary[f"{n}-{loc}"] = dict(title=model["title"], subtitle=model["subtitle"], quick=nq, finals=nf, minutes=durations[n])
    print(json.dumps(summary, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
