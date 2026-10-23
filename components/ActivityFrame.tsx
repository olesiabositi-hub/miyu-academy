import type { ReactNode } from "react";

/**
 * The one frame every activity and game sits in: eyebrow, title, short lead, then the game.
 * `tone="dark"` is for games that are set at night / in a dark scene (the course theme sets the colours).
 * Rules for a new game: docs/DESIGN_SYSTEM.md → "Activities and games".
 */
export function ActivityFrame({ eyebrow, title, lead, icon, tone = "light", kind, children }: {
  eyebrow: string;
  title: string;
  lead?: string;
  icon?: ReactNode;
  tone?: "light" | "dark";
  /** Extra class for the kind of game (e.g. "ac-match"), for game-specific styles. */
  kind?: string;
  children: ReactNode;
}) {
  return <section className={"mxActivity" + (tone === "dark" ? " is-dark" : "") + (kind ? " " + kind : "")} aria-label={title}>
    <div className="mxActHead">
      {icon && <span className="mxActIcon" aria-hidden="true">{icon}</span>}
      <div>
        <div className="mxActEyebrow">{eyebrow}</div>
        <h3 className="mxActTitle">{title}</h3>
        {lead && <p className="mxActLead">{lead}</p>}
      </div>
    </div>
    <div className="mxActBody">{children}</div>
  </section>;
}
