# MIYU Academy — Visual Motion Rule

Status: **APPROVED / FIXED**

This rule applies to MIYU Academy premium editorial artwork, including course landing pages and selected visual hero moments, unless explicitly changed later.

## Principle

Imagery should feel **alive, not animated**.

The visual effect must remain premium, editorial, calm and cinematic. Motion should suggest light, air, depth and atmosphere — never turn MIYU into a game, video background or decorative animation demo.

## Approved motion language

- Very slow image breathing / Ken Burns effect: approximately **1–3% scale change over 16–24 seconds**.
- Subtle scroll parallax: approximately **6–12 px** total movement.
- Very small pointer-depth response on desktop: approximately **4–8 px**.
- Slow atmospheric overlay motion for mist, light and gold geometry.
- Core figures remain visually stable; perceived movement should mainly come from **light, clouds, depth and fine gold linework**.
- Use only transform and opacity for continuous motion wherever possible.

## Not allowed

- Fast loops.
- Bouncy or playful motion.
- Large zooms.
- Constant rotation.
- Autoplay video as a substitute for editorial artwork.
- Motion that competes with reading.
- Animated UI that makes MIYU feel like a gamified LMS.

## Accessibility

`prefers-reduced-motion: reduce` must disable all decorative motion. The static composition must remain complete and visually intentional.

## Performance

- Raster artwork remains a static optimized image.
- Motion is created in the browser with lightweight layers.
- Scroll updates must be requestAnimationFrame-throttled.
- Avoid layout-triggering animation properties.

## Current use

The Greek Mythology course landing hero uses this motion language:
- slow breathing image motion;
- subtle scroll parallax;
- restrained pointer depth;
- drifting mist/light/gold overlays;
- a fully static reduced-motion fallback.

The general MIYU Academy catalogue homepage is intentionally deferred until the course experience is complete. The Academy homepage must not be visually defined around Greek Mythology alone.
