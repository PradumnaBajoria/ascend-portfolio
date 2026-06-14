# Next Steps — from here to a live, polished portfolio

Ordered, detailed checklist. Roughly: **finish polish → ship to Vercel → harden → grow.** Steps marked **(you)** need your accounts/auth; the rest I can do.

---

## Phase 0 — Where we are now ✅
- Next.js 16 + React 19 + Tailwind v4 app at `/pradumna-portfolio`.
- The full camera-travel climb is ported and working (`npm run dev` → http://localhost:3000).
- `npm run build` passes (TypeScript clean).
- Résumé served from `public/`. Content is data-driven (see `docs/CODE_GUIDE.md`).
- Git repo initialized by the scaffold; **the port is not committed yet.**

---

## Phase 1 — Finish the design polish (before shipping)
1. **Summit pass** — confirm the snow cap / peak read clean at full zoom. Nudge if needed.
2. **Mobile pass** — open dev tools device view (or your phone on the LAN). Check: cards don't cover the climber, HUD is unobtrusive, text is readable, the climb still feels good on a tall narrow screen.
3. **Card collision pass** — scroll slowly top to bottom; make sure no two cards overlap awkwardly and each appears near its marker.
4. **Confirm the numbers** — "5,000+ users" and "40–50%" are estimates; lock them in `components/Ascent.tsx` (and they already match the résumé). Edit if you confirm real figures.
5. **Real contact** — the "Email me" button uses `mailto:`. If you later want call-booking, see Phase 5.

## Phase 2 — Accessibility & resilience
6. **Reduced motion** — add a `prefers-reduced-motion` path: skip the auto-animations (climber bob, star twinkle) and, ideally, show the **Trail Summary** (the static one-pager) as the default for those users. The summary already exists; we just need to default to it when reduced motion is set. *(I can do this.)*
7. **Keyboard / no-JS** — the Trail Summary is the accessible fallback. Make sure it's reachable and that core text is in the DOM (it is). Verify the summary button is focusable.
8. **SEO/meta** — confirm `app/layout.tsx` title/description; add an Open Graph image (Phase 4 #14).

## Phase 3 — Ship it (Vercel)
9. **Commit the work.** *(I can do this on your say-so.)*
   ```bash
   cd /pradumna-portfolio
   git add -A && git commit -m "feat: the ascent portfolio"
   ```
10. **(you) Create the GitHub repo and push.**
    ```bash
    gh auth login            # one-time, in your terminal (use the `!` prefix in this session)
    gh repo create pradumna-portfolio --public --source=. --push
    ```
    (or make the repo in the GitHub UI, then `git remote add origin <url> && git push -u origin main`)
11. **(you) Deploy on Vercel.**
    - Go to vercel.com → "Add New Project" → import `pradumna-portfolio`.
    - Framework auto-detects **Next.js**. No env vars needed. Click **Deploy**.
    - You get a live URL like `pradumna-portfolio.vercel.app` in ~1–2 min.
    - (CLI alternative: `npx vercel` then `npx vercel --prod`.)
12. **Verify production** — open the live URL, do the full climb, test the résumé download, the email button, the Trail Summary, and check it on your phone.

## Phase 4 — Harden & sharpen
13. **(you) Custom domain (optional but worth it).** Buy something like `pradumnabajoria.dev` (~$12/yr). In Vercel → Project → Settings → Domains → add it and follow the DNS steps. Update the résumé/LinkedIn to point at it.
14. **Open Graph image.** Add a nice preview image (a still of the summit) so links unfurl well on LinkedIn/WhatsApp. Either a static `public/og.png` referenced in `layout.tsx`, or a generated `app/opengraph-image.tsx`. *(I can do this.)*
15. **Analytics (optional).** Add Vercel Analytics (`npm i @vercel/analytics`, drop `<Analytics/>` in `layout.tsx`) to see if recruiters actually visit. *(I can do this.)*
16. **Performance check.** Run Lighthouse on the deployed URL. The scene is light (SVG + transforms), but confirm LCP and that fonts/CSS aren't blocking.
17. **Put the link everywhere.** LinkedIn Featured + headline, résumé header, email signature, GitHub profile README.

## Phase 5 — Grow it over time
18. **Add demo projects.** Build 1–2 small, impressive React demos, then add each as a checkpoint (exact steps in `docs/CODE_GUIDE.md → Adding content`). This is the single biggest upgrade for a frontend portfolio.
19. **Call booking (optional).** If you want recruiters to book a slot directly, make a free Cal.com account and replace/augment the "Email me" CTA with an embed at the Summit.
20. **Richer art (optional).** Swap the vector mountain for a more illustrated scene later — it's isolated in the SVG, so it's a contained change. (Claude Design can generate SVG layers; an image model can do painterly raster if you go that route.)
21. **Tests (optional, nice for the résumé).** Add Vitest + React Testing Library and test the pure bits: the `at → point` logic and that the Trail Summary renders every role/link. Demonstrates testing discipline.

---

## Quick command reference
```bash
npm run dev      # local dev (hot reload)
npm run build    # production build + type-check
npm run start    # serve production build locally
npm run lint     # eslint
```

## What needs YOU vs. what I can do
- **You:** GitHub auth + repo push (#10), Vercel deploy (#11), buying a domain (#13), building the actual demo projects (#18), Cal.com account (#19).
- **I can do:** commit (#9), reduced-motion fallback (#6), OG image (#14), analytics wiring (#15), adding project checkpoints once you give me the details (#18), tests (#21), and any design tuning.

> Suggested immediate path: **#1–#5 polish → #6 reduced motion → #9 commit → #10/#11 deploy → #12 verify.** Everything else is incremental.
