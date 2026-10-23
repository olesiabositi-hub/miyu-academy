"use client";
import { useEffect, useState } from "react";
import { RUNE_IDS } from "@/lib/runes";
import type { RuneName } from "@/components/Rune";

/**
 * Learner progress, kept only in this browser (localStorage). There are no accounts and no server:
 * nothing here is ever sent anywhere. Every course uses the same store, keyed by course id.
 *
 * All reads and writes are wrapped in try/catch: in a private window or with storage blocked the site
 * still works, it just does not remember anything.
 */

export type ModuleStatus = "in_progress" | "completed";
export type ModuleState = { status: ModuleStatus; startedAt: string; lastActiveAt: string; scroll?: number; checks?: Record<string, number> };
export type RuneDraw = { rune: RuneName; source: string; drawn_at: string };
export type FinalAttempt = { id: string; current_question_index: number; selected_answers: Record<string, number>; option_order: number[][] };
export type FinalState = { attempt?: FinalAttempt | null; submitted?: Record<string, number>; latestScore?: number | null; passed?: boolean };
export type CourseState = { modules: Record<string, ModuleState>; runes?: RuneDraw[]; final?: FinalState };
export type Store = { v: 1; courses: Record<string, CourseState> };

/** Row shape used by dashboards and the "continue" strip. */
export type ModRow = { course_id: string; module_id: string; status: ModuleStatus; last_active_at: string | null };

const KEY = "miyu.progress.v1";
const EVENT = "miyu-progress";
const empty = (): Store => ({ v: 1, courses: {} });

export function readStore(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const s = JSON.parse(raw);
    return s && s.v === 1 && typeof s.courses === "object" ? (s as Store) : empty();
  } catch { return empty(); }
}

function writeStore(s: Store) {
  try { window.localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: progress is not kept */ }
  try { window.dispatchEvent(new Event(EVENT)); } catch { /* ignore */ }
}

function update(courseId: string, fn: (c: CourseState) => void) {
  const s = readStore();
  const c = s.courses[courseId] ?? (s.courses[courseId] = { modules: {} });
  if (!c.modules) c.modules = {};
  fn(c);
  writeStore(s);
}

const now = () => new Date().toISOString();

// ---- Modules

export function startModule(courseId: string, moduleId: string) {
  update(courseId, (c) => {
    const m = c.modules[moduleId];
    if (m?.status === "completed") { m.lastActiveAt = now(); return; }
    c.modules[moduleId] = { ...m, status: "in_progress", startedAt: m?.startedAt ?? now(), lastActiveAt: now() };
  });
}

export function saveCheck(courseId: string, moduleId: string, checkId: string, sourceIndex: number) {
  update(courseId, (c) => {
    const m = c.modules[moduleId] ?? { status: "in_progress", startedAt: now(), lastActiveAt: now() };
    m.checks = { ...m.checks, [checkId]: sourceIndex };
    m.lastActiveAt = now();
    c.modules[moduleId] = m;
  });
}

export function saveScroll(courseId: string, moduleId: string, ratio: number) {
  const r = Math.min(1, Math.max(0, Math.round(ratio * 1000) / 1000));
  update(courseId, (c) => {
    const m = c.modules[moduleId];
    if (!m) return;
    m.scroll = r;
    m.lastActiveAt = now();
  });
}

export function completeModule(courseId: string, moduleId: string) {
  update(courseId, (c) => {
    const m = c.modules[moduleId];
    c.modules[moduleId] = { ...m, status: "completed", startedAt: m?.startedAt ?? now(), lastActiveAt: now(), scroll: undefined };
  });
}

/** Where to resume reading: only for a module that is still being read. */
export function resumeRatio(courseId: string, moduleId: string): number | null {
  const m = readStore().courses[courseId]?.modules?.[moduleId];
  return m?.status === "in_progress" && typeof m.scroll === "number" ? m.scroll : null;
}

export function moduleRows(store: Store, courseId?: string): ModRow[] {
  const out: ModRow[] = [];
  for (const [cid, c] of Object.entries(store.courses)) {
    if (courseId && cid !== courseId) continue;
    for (const [mid, m] of Object.entries(c.modules ?? {})) out.push({ course_id: cid, module_id: mid, status: m.status, last_active_at: m.lastActiveAt ?? null });
  }
  return out;
}

// ---- Runes (Norse course): random, never the same rune twice; one rune per source.

export function drawRuneLocal(courseId: string, source: string): RuneName | null {
  let result: RuneName | null = null;
  update(courseId, (c) => {
    const draws = c.runes ?? (c.runes = []);
    const had = draws.find((d) => d.source === source);
    if (had) { result = had.rune; return; }
    const owned = new Set(draws.map((d) => d.rune));
    const left = RUNE_IDS.filter((r) => !owned.has(r));
    if (left.length === 0) return;
    const rune = left[Math.floor(Math.random() * left.length)];
    draws.push({ rune, source, drawn_at: now() });
    result = rune;
  });
  return result;
}

// ---- Final Myth Decoder (Greek course)

export function saveFinal(courseId: string, patch: Partial<FinalState>) {
  update(courseId, (c) => { c.final = { ...c.final, ...patch }; });
}

// ---- Reset

export function clearAllProgress() {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
  try { window.dispatchEvent(new Event(EVENT)); } catch { /* ignore */ }
}

/**
 * The current store, re-read whenever progress changes in this tab or another one.
 * `null` until the page has mounted, so server HTML and the first client render match.
 */
export function useProgress(): Store | null {
  const [store, setStore] = useState<Store | null>(null);
  useEffect(() => {
    const read = () => setStore(readStore());
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === null || e.key === KEY) read(); };
    window.addEventListener(EVENT, read);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(EVENT, read); window.removeEventListener("storage", onStorage); };
  }, []);
  return store;
}
