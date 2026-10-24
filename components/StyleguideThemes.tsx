"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/** Theme switcher of the style showcase: reads ?theme= in the browser and marks the page with that course theme. */
export function StyleguideThemes({ themes }: { themes: readonly string[] }) {
  const [theme, setTheme] = useState(themes[0]);
  useEffect(() => {
    const read = () => { const t = new URLSearchParams(window.location.search).get("theme"); setTheme(t && themes.includes(t) ? t : themes[0]); };
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [themes]);
  return <>
    {theme !== themes[0] && <span className={`themeMark theme-${theme}`} hidden aria-hidden="true" />}
    <nav className="sgThemes" aria-label="Theme">
      {themes.map((x) => <Link key={x} href={`?theme=${x}`} onClick={() => setTheme(x)} aria-current={x === theme ? "page" : undefined}>{x}</Link>)}
    </nav>
  </>;
}
