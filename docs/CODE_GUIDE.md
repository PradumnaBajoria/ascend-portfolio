# Code Guide / KT — "The Ascent" Portfolio

A walkthrough of how this site is built and, most importantly, **how to add a new project, blog post, or camp later**. Read the first two sections for the mental model, then jump to "Adding content."

---

## 1. The big idea (mental model)

The page is **one fixed scene** (a mountain) plus a very tall invisible **scroll spacer**. You never actually scroll past content — instead, your scroll position (0 → 1) drives everything:

- The **camera pans up** the mountain (we move the artwork, not the page).
- A **climber walks up a trail** from base camp to summit.
- The **sky warms** from pre-dawn night to golden dawn.
- **Info cards fade in** at the right altitudes.
- An **altimeter** counts up.

Scroll progress is a single number `p` between `0` (bottom / base / night) and `1` (top / summit / dawn). Almost every visual is a function of `p`.

```
p = window.scrollY / (scrollHeight - innerHeight)   // 0 .. 1
```

---

## 2. File map

```
app/
  layout.tsx      Fonts (Space Grotesk + JetBrains Mono) + SEO metadata. Rarely touched.
  page.tsx        Renders <Ascent />. Trivial.
  globals.css     ALL the styling (scene layers, cards, HUD, summary, keyframes).
content/
  profile.ts      Your identity: name, role, email, links, pack, blog. EDIT for personal info.
  climb.ts        The climb data: sky palette, markers, HUD nav, trees, rocks. EDIT to add stops.
components/
  Ascent.tsx      The whole experience: the SVG scene (JSX) + the scroll engine (useEffect).
public/
  Pradumna-Bajoria-Resume.pdf   Served at /Pradumna-Bajoria-Resume.pdf (the résumé link).
```

There are only **two files you normally edit to change content**: `content/profile.ts` and `content/climb.ts`, plus the cards block inside `components/Ascent.tsx`.

---

## 3. How `Ascent.tsx` works

It has two halves.

### (a) The JSX — the static scene
This is the markup that renders on the server: the sky/stars/sun layers, the `<svg>` scene, the info `cards`, the HUD, the summary overlay, and the scroll `#driver`. The mountain art (paths, gradients, snow) is hand-authored SVG inside `<g id="world">`. Two groups matter:

- **`<g id="far">`** — distant ranges + clouds. Pans *slowly* (parallax = depth).
- **`<g id="world">`** — the mountain, decorations, trail, markers, and climber. Pans *with the climber*.

Empty placeholders that get filled by JS at runtime: `<g id="decor">` (trees/rocks), `<g id="markers">` (camp icons), and `<div id="stars">`.

### (b) The `useEffect` — the scroll engine
Runs once on mount. It:
1. **Builds stars** (random positions) into `#stars`.
2. **Builds trees & rocks** from `content/climb.ts` into `#decor`.
3. **Measures the trail** (`trail.getTotalLength()`), so any point on it can be found by fraction.
4. **Plants the markers** from `content/climb.ts` along the trail (`getPointAtLength(at * L)`).
5. **Registers a `scroll` handler** (`onScroll`) that, on every scroll:
   - recolors the sky (`skyAt(p)`), fades the sun in past the halfway point, fades stars out;
   - updates the altimeter text and the progress bar;
   - moves the climber to `getPointAtLength(p * L)` and reveals the trodden trail;
   - pans the camera: `world` by `ty = clamp(500 - climberY, 1000 - WORLD_H, 0)`, `far` by `ty * 0.5`;
   - toggles each card's `.show` class when `p` is inside its `[from, to]` window;
   - highlights the active HUD camp.

> **Why imperative (refs / getElementById) instead of React state?** Scroll fires dozens of times a second. Re-rendering React that often is wasteful, so we mutate styles/attributes directly. This is the standard pattern for scroll-driven animation. Only the "trail summary" overlay uses React state (`showSummary`).

### Coordinate system (important for editing art)
- The `<svg>` viewBox is `0 0 1000 1000` — that's the **camera window**.
- The world is drawn **taller than the window**: y runs from `~300` (summit) to `2800` (base). `WORLD_H = 2800`.
- The camera shows a 1000-tall slice; `translate(0, ty)` slides the world so the climber stays roughly centered, clamped so we frame the base at the start and the peak at the end.
- So: **small y = high on the mountain, large y = the base.**

---

## 4. The trail and `at` values (the key concept for adding stops)

The trail is a single SVG path (`#trailDrawn`). Every marker, the climber, and every card is positioned by a number **`at` between 0 and 1**:

- `at = 0.0` → base of the trail (bottom of the page / start of scroll)
- `at = 1.0` → summit (end of scroll)
- `at = 0.5` → halfway up

`at` is used two ways:
1. **Marker placement:** `getPointAtLength(at * L)` finds the (x, y) on the trail to plant the icon.
2. **Card timing:** each card has a `data-from`/`data-to` window (also 0–1). The card is visible while `from ≤ p ≤ to`. Center the window on the marker's `at` so the card appears when the climber reaches it.

Current layout:

| Stop | `at` | marker type | card window |
|------|------|-------------|-------------|
| Trailhead (hero) | — | (none) | 0.00–0.06 |
| Base Camp | 0.05 | base | 0.08–0.22 |
| Camp I · Crest Data | 0.30 | tent | 0.25–0.42 |
| Field Note (blog) | 0.47 | note | 0.45–0.55 |
| Camp II · State Street | 0.63 | flag | 0.58–0.74 |
| Projects (checkpoint) | 0.80 | post | 0.77–0.87 |
| Summit | 0.99 | summit | 0.92–1.01 |

---

## 5. Adding content (the part you'll come back for)

### A) Add a new PROJECT (or any new checkpoint)

**Step 1 — add a marker** in `content/climb.ts`, in the `markers` array. Pick an `at` that fits between existing stops (e.g. a project between Camp II at 0.63 and the existing Projects checkpoint at 0.80 → use 0.72). Choose a `type` (`post` = signpost for a project, `tent`/`flag` = a bigger "camp", `note` = a cairn for writing):

```ts
{ id: "project-acme", label: "PROJECT · ACME", at: 0.72, type: "post" },
```

**Step 2 — add the matching card** in `components/Ascent.tsx`, inside the `<div id="info">` block. Copy an existing `.card` and set `data-from`/`data-to` to a window centered on `0.72` (e.g. 0.68–0.78). Use `left` or `right` so it doesn't collide with neighbors:

```tsx
<div className="card chk right" data-from="0.68" data-to="0.78">
  <p className="label mono">⛏ PROJECT — ACME</p>
  <h3>Acme Dashboard</h3>
  <p>A real-time analytics dashboard in React + TypeScript. 10k MAU.</p>
  <p><a href="https://github.com/you/acme" style={{ color: "#ffd9a0" }}>Code ↗</a></p>
</div>
```

**Step 3 — (optional) add it to the HUD** quick-nav in `content/climb.ts` `hudCamps` if it's a major stop:

```ts
{ label: "Acme", at: 0.72 },
```

> ⚠️ **Spacing tip:** keep `at` values apart so markers and cards don't overlap. If you add many stops, gently re-space all the `at` values so the climb stays evenly paced. Card windows can overlap slightly, but two cards on the *same side* shouldn't be visible at once.

### B) Edit existing text
- Personal info (name, hook, "why I build", pack, links, blog) → `content/profile.ts`.
- The work-experience card copy (Camp I / Camp II details) → the `.card` blocks in `components/Ascent.tsx`.

### C) Add a brand-new marker shape
Marker icons are defined in the `icon(t)` function inside `Ascent.tsx` (a `switch` on type returning raw SVG). Add a new `if (t === "yourtype")` branch returning SVG, then use `type: "yourtype"` in a marker. Keep it anchored at `(0,0)` and drawn upward (negative y), like the others.

### D) Change the résumé
Replace `public/Pradumna-Bajoria-Resume.pdf` (keep the same filename, or update the path in `content/profile.ts → links.resume`).

---

## 6. Tuning the look (quick reference)

| Want to change… | Edit… |
|---|---|
| Sky colors (night→dawn) | `content/climb.ts → SKY` |
| Mountain shape / snow / gradients | the `<path>`/`<linearGradient>` SVG in `Ascent.tsx` |
| Trail route | the `d="..."` of **both** `#trailBase` and `#trailDrawn` (keep identical) |
| Trees / rocks placement | `content/climb.ts → trees / rocks` (`[x, y, scale]` in world coords) |
| Climber look | the `<g id="climber">` SVG in `Ascent.tsx` |
| Card position/size | `.card`, `.left/.right/.mid`, `.chk` in `globals.css` |
| Scroll length (climb pace) | `#driver { height: 800vh }` in `globals.css` (taller = slower climb) |
| Fonts | `app/layout.tsx` |

---

## 7. Running it

```bash
npm run dev      # local dev at http://localhost:3000 (hot reload)
npm run build    # production build (also type-checks)
npm run start    # serve the production build
npm run lint     # eslint
```
