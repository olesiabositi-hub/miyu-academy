#!/usr/bin/env python3
from pathlib import Path
import re, json, hashlib, sys

root=Path(__file__).resolve().parent.parent
masters=root/"content"/"greek-mythology"/"master"
expected={1:0,2:0,3:13,4:9,5:9,6:10,7:12,8:11}
errors=[]

def validate_choice_block(block,label):
    opts=re.findall(r"(?m)^([A-C])\.\s+(.+?)\s*$",block)
    ans=re.search(r"(?mi)^\*\*(?:Answer|Ответ):\*\*\s*([A-C])\b",block)
    if len(opts)>=2 and ans:
        return
    heading=block.splitlines()[0] if block.splitlines() else ""
    if re.search(r"(?:True or false\?|Правда или нет\?)",heading,re.I):
        bold=re.findall(r"(?m)^\*\*(.+?)\*\*\s*$",block)
        if len(bold)>=2 and re.sub(r"[.!?]+$","",bold[1].strip()).lower() in ("true","false","да","нет","верно","неверно"):
            return
    errors.append(f"Ambiguous check block: {label}")


files=sorted(masters.glob("module-*.md"))
if len(files)!=16: errors.append(f"Expected 16 module masters, found {len(files)}")

for m in range(1,9):
    strict_by_locale={}
    for loc in ("ru","en"):
        p=masters/f"module-{m:02d}.{loc}.md"
        if not p.exists():
            errors.append(f"Missing {p.name}");continue
        txt=p.read_text(encoding="utf-8")
        label="ВИЗУАЛЬНАЯ ОСТАНОВКА" if loc=="ru" else "VISUAL STOP"
        vs=[int(x) for x in re.findall(rf"(?m)^## \[{label}\s+(\d+)\]\s*$",txt,re.I)]
        target=list(range(1,expected[m]+1))
        if vs!=target: errors.append(f"{p.name}: Visual Stops {vs} != {target}")

        strict=[];decorative=[]
        for line in txt.splitlines():
            sm=re.match(r"^#\s+(\d+)\.[ \t]*(.*)$",line)
            if sm:
                if sm.group(2).strip(): strict.append(int(sm.group(1)))
                else: decorative.append(int(sm.group(1)))
        if len(strict)!=len(set(strict)): errors.append(f"{p.name}: duplicate strict numbered section IDs")
        strict_by_locale[loc]=strict

        source_count=len(re.findall(r"(?mi)^#{1,6}\s+.*(?:Источники для фактчекинга|Sources for fact-checking).*$",txt))
        if source_count!=1: errors.append(f"{p.name}: editorial source boundary count {source_count}")

        # Quick Check parseability.
        for qi,qm in enumerate(re.finditer(r"(?mi)^##\s+(?:Quick check|Быстрая проверка)\s*$",txt),1):
            rest=txt[qm.start():]
            end=re.search(r"(?m)^---\s*$",rest)
            block=rest[:end.start()] if end else rest
            validate_choice_block(block,f"{p.name} quick {qi}")

        # Self-check parseability, including deterministic True/False questions.
        sm=re.search(r"(?mi)^#\s+(?:Self-check|Самопроверка)\s*$",txt)
        if sm:
            after=txt[sm.end():]
            stop=re.search(r"(?mi)^#\s+(?:If you remember|Если запомнить|Module completed|Модуль завершён)",after)
            section=after[:stop.start()] if stop else after
            for qm in re.finditer(r"(?m)^##\s+(\d+)\.\s+(.+)$",section):
                rest=section[qm.start():]
                end=re.search(r"(?m)^---\s*$",rest)
                block=rest[:end.start()] if end else rest
                validate_choice_block(block,f"{p.name} self {qm.group(1)}")

    if strict_by_locale.get("ru")!=strict_by_locale.get("en"):
        errors.append(f"module-{m:02d}: RU/EN numbered-section parity mismatch")

# Approved Step 29 source fixes
m7ru=(masters/"module-07.ru.md").read_text(encoding="utf-8")
m7en=(masters/"module-07.en.md").read_text(encoding="utf-8")
m8ru=(masters/"module-08.ru.md").read_text(encoding="utf-8")
m8en=(masters/"module-08.en.md").read_text(encoding="utf-8")
if "Модуль 8. Мифы в небе" in m7ru or "Module 8. Myths in the Sky" in m7en: errors.append("Old Module 8 preview title remains")
if "# Курс завершён" in m8ru or "# Course completed" in m8en: errors.append("Premature Course completed heading remains")
for loc,txt in (("ru",m8ru),("en",m8en)):
    levels=sorted(int(x) for x in re.findall(r"(?mi)^#{1,3}\s+(?:\d+\.\s+)?MYTH DECODER — LEVEL\s+([1-5])\s*$",txt))
    if levels!=[1,2,3,4,5]: errors.append(f"Module 8 {loc}: challenge levels {levels}")

fmd=json.loads((root/"content"/"greek-mythology"/"final-myth-decoder.ru-en.json").read_text(encoding="utf-8"))
if len(fmd.get("questions",[]))!=15: errors.append("Final Decoder must have 15 questions")
if fmd.get("pass_score")!=12 or fmd.get("pass_percent")!=80: errors.append("Final Decoder pass rule mismatch")
cats={}
for q in fmd["questions"]:
    cats[q["category"]]=cats.get(q["category"],0)+1
    for loc in ("ru","en"):
        if not (0<=q[loc]["answer"]<len(q[loc]["options"])): errors.append(f"{q['id']} invalid {loc} answer")
    if q["ru"]["answer"]!=q["en"]["answer"]: errors.append(f"{q['id']} RU/EN answer identity mismatch")
if cats!={"recognition":5,"meaning":5,"connection":5}: errors.append(f"Final Decoder categories {cats}")

assets=json.loads((root/"content"/"greek-mythology"/"visual-assets.json").read_text(encoding="utf-8"))
if len(assets.get("entries",[]))!=72: errors.append(f"Expected 72 visual plan entries, got {len(assets.get('entries',[]))}")
ids={x["id"] for x in assets["entries"]}
for m in range(3,9):
    for n in range(1,expected[m]+1):
        aid=f"gm-m{m:02d}-vs{n:02d}"
        if aid not in ids: errors.append(f"Missing visual mapping {aid}")

cert=root/"public"/"certificate-master.webp"
if not cert.exists(): errors.append("Missing locked certificate master")

report={
 "status":"PASS" if not errors else "FAIL",
 "content_version":"gm-v2",
 "errors":errors,
 "master_hashes":{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in files},
 "certificate_sha256":hashlib.sha256(cert.read_bytes()).hexdigest() if cert.exists() else None
}
(root/"qa"/"final-build-content-qa.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
if errors:
    print("\n".join(errors));sys.exit(1)
print("MIYU final content QA: PASS")
