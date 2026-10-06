import type { Locale } from "@/lib/course";

export type Choice = { sourceIndex:number; text:string };
export type ChoiceQuestion = {
  id:string;
  question:string;
  options:Choice[];
  answerSourceIndex:number;
  feedback:string;
};

export type LessonBlock =
  | { type:"prose"; id:string; markdown:string }
  | { type:"visual-stop"; id:string; number:number; markdown:string; asset:{id:string;title:string;alt:string;production:string;priority:string} }
  | { type:"quick-check"; id:string; markdown:string; question:ChoiceQuestion }
  | { type:"self-check"; id:"self-check"; markdown:string; questions:ChoiceQuestion[] }
  | { type:"module-challenge"; id:string; level:number; markdown:string; question?:ChoiceQuestion; revealOnly?:boolean }
  | { type:"module-complete"; id:"module-complete"; markdown:string }
  | { type:"next-module"; id:"next-module"; markdown:string };

export type LessonModel = {
  courseId:"greek-mythology";
  moduleId:string;
  moduleNumber:number;
  locale:Locale;
  title:string;
  durationLabel:string;
  contentVersion:"gm-v2";
  blocks:LessonBlock[];
};
