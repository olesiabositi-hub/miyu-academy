import type { Locale } from "@/lib/course";

export const MODULES = [
  {id:"module-01",order:1,duration:[15,18],ru:"Как вообще устроен мир древнегреческой мифологии",en:"How the World of Greek Mythology Is Actually Structured"},
  {id:"module-02",order:2,duration:[20,25],ru:"Кто есть кто среди богов",en:"Who Is Who Among the Gods"},
  {id:"module-03",order:3,duration:[20,25],ru:"Монстры, чудовища и те, кого лучше не встречать",en:"Monsters, Creatures and Things You Really Do Not Want to Meet"},
  {id:"module-04",order:4,duration:[30,30],ru:"Герои: люди, которые решили, что справятся",en:"Heroes: People Who Decided They Could Handle It"},
  {id:"module-05",order:5,duration:[25,30],ru:"Истории, которые мы до сих пор цитируем",en:"Stories We Still Quote Today"},
  {id:"module-06",order:6,duration:[30,30],ru:"Троя: война, яблоко и самый известный конь в истории",en:"Troy: A War, an Apple and the Most Famous Horse in History"},
  {id:"module-07",order:7,duration:[30,35],ru:"Одиссея: человек, которому просто надо было доехать домой",en:"The Odyssey: the Man Who Just Needed to Get Home"},
  {id:"module-08",order:8,duration:[30,30],ru:"Мифология вокруг нас",en:"Mythology Around Us"},
] as const;

export function moduleTitle(moduleId:string, locale:Locale){
  const m=MODULES.find(x=>x.id===moduleId);
  if(!m) throw new Error(`Unknown module ${moduleId}`);
  return m[locale];
}
