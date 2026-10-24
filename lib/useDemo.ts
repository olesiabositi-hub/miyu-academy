"use client";
import { useEffect, useState } from "react";

/**
 * `?demo=…` from the address bar (sample data on deploy previews). Read in the browser, so the page itself
 * can be built in advance. `undefined` until it has been read, then the value or `null`.
 */
export function useDemo(): string | null | undefined {
  const [demo, setDemo] = useState<string | null | undefined>(undefined);
  useEffect(() => { setDemo(new URLSearchParams(window.location.search).get("demo")); }, []);
  return demo;
}
