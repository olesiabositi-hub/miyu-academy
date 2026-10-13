/** Thin decorative divider: a line fading out on both sides with three angular, rune-like marks. Purely visual. */
export function RuneDivider() {
  return <div className="runeDivider" aria-hidden="true">
    <svg viewBox="0 0 160 28" width="160" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
      <path d="M22 4v20M22 9l9 6M22 15l9 6" />
      <path d="M80 3v22M71 9l9 8 9-8" />
      <path d="M138 4v20M138 4l9 6-9 6" />
    </svg>
  </div>;
}
