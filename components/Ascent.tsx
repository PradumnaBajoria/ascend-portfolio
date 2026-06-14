"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";
import { SKY, WORLD_H, markers, hudCamps, trees, rocks } from "@/content/climb";

export default function Ascent() {
  useEffect(() => {
    const hx = (h: string): number[] => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];
    const mix = (a: number[], b: number[], t: number) =>
      a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const rgb = (a: number[]) => `rgb(${a[0]},${a[1]},${a[2]})`;
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const skyAt = (p: number) => {
      let i = 0;
      while (i < SKY.length - 1 && p > SKY[i + 1].at) i++;
      const a = SKY[i], b = SKY[Math.min(i + 1, SKY.length - 1)];
      const t = b.at === a.at ? 0 : (p - a.at) / (b.at - a.at);
      return `linear-gradient(${rgb(mix(hx(a.c[0]), hx(b.c[0]), t))},${rgb(mix(hx(a.c[1]), hx(b.c[1]), t))})`;
    };

    const $ = (id: string) => document.getElementById(id);
    const starsEl = $("stars")!;
    const decor = $("decor")!;
    const markersG = $("markers")!;
    const trail = $("trailDrawn") as unknown as SVGPathElement;
    const world = $("world")!;
    const far = $("far")!;
    const climberPos = $("climberPos")!;
    const altVal = $("altVal")!;
    const fill = $("fill")!;
    const sky = $("sky")!;
    const sun = $("sun")!;
    const cue = document.querySelector(".scrollcue") as HTMLElement;
    const cards = [...document.querySelectorAll<HTMLElement>(".card")];
    const hudBtns = [...document.querySelectorAll<HTMLButtonElement>("#hud button")];

    // clear (handles dev strict-mode double run) then build
    starsEl.innerHTML = ""; decor.innerHTML = ""; markersG.innerHTML = "";

    for (let i = 0; i < 120; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const sz = (Math.random() * 1.6 + 1).toFixed(1);
      s.style.width = s.style.height = sz + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 78 + "%";
      s.style.opacity = (Math.random() * 0.6 + 0.2).toFixed(2);
      if (Math.random() < 0.4)
        s.style.animation = `tw ${(2 + Math.random() * 3).toFixed(1)}s ease-in-out ${(Math.random() * 3).toFixed(1)}s infinite`;
      starsEl.appendChild(s);
    }

    const tree = (x: number, y: number, s: number) =>
      `<g transform="translate(${x},${y}) scale(${s})"><rect x="-3" y="-8" width="6" height="14" fill="#2c2014"/><polygon points="0,-54 -22,-6 22,-6" fill="#21402f"/><polygon points="0,-72 -18,-28 18,-28" fill="#2a4d39"/><polygon points="0,-88 -13,-50 13,-50" fill="#325a42"/></g>`;
    const rock = (x: number, y: number, s: number) =>
      `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="0" rx="26" ry="12" fill="#262d4c"/><ellipse cx="-9" cy="-6" rx="14" ry="9" fill="#323a60"/></g>`;
    trees.forEach((t) => decor.insertAdjacentHTML("beforeend", tree(...t)));
    rocks.forEach((r) => decor.insertAdjacentHTML("beforeend", rock(...r)));

    const L = trail.getTotalLength();
    trail.style.strokeDasharray = String(L);
    trail.style.strokeDashoffset = String(L);

    const icon = (t: string) => {
      if (t === "base") return `<polygon points="-20,0 0,-28 20,0" fill="#c65b4a"/><polygon points="-20,0 0,-28 -6,0" fill="#a8483a"/><polygon points="-6,0 0,-16 6,0" fill="#241820"/><circle cx="34" cy="-4" r="11" fill="rgba(255,150,70,.32)"/><circle cx="34" cy="-4" r="4.5" fill="#ffae5c"/>`;
      if (t === "tent") return `<polygon points="-18,0 0,-25 18,0" fill="#5aa9ff"/><polygon points="-18,0 0,-25 -5,0" fill="#3f86d6"/><polygon points="-5,0 0,-15 5,0" fill="#1d2a3a"/>`;
      if (t === "flag") return `<line x1="0" y1="3" x2="0" y2="-38" stroke="#dfe6f5" stroke-width="3.5"/><polygon points="0,-38 28,-30 0,-20" fill="#ff8a3c"/>`;
      if (t === "note") return `<circle cx="0" cy="-5" r="6" fill="#cdd6ee"/><circle cx="-5" cy="4" r="6" fill="#aab6da"/><circle cx="6" cy="4" r="6" fill="#aab6da"/>`;
      if (t === "post") return `<line x1="0" y1="2" x2="0" y2="-30" stroke="#cdd6ee" stroke-width="3"/><rect x="0" y="-30" width="26" height="13" rx="2" fill="#7d87b5"/>`;
      if (t === "summit") return `<ellipse cx="0" cy="1" rx="18" ry="6" fill="#2f2b45"/><line x1="0" y1="0" x2="0" y2="-44" stroke="#fff" stroke-width="3.5"/><polygon points="0,-44 32,-34 0,-23" fill="#ff5d5d"/>`;
      return "";
    };
    markers.forEach((c) => {
      const pt = trail.getPointAtLength(c.at * L);
      const minor = c.type === "note" || c.type === "post";
      markersG.insertAdjacentHTML(
        "beforeend",
        `<g transform="translate(${pt.x},${pt.y})">${icon(c.type)}<text x="0" y="${minor ? 22 : 30}" font-size="${minor ? 15 : 18}" text-anchor="middle" font-family="var(--font-mono), monospace" fill="#eaeef8" opacity="${minor ? 0.7 : 0.9}" paint-order="stroke" stroke="rgba(0,0,0,.55)" stroke-width="3.5">${c.label}</text></g>`
      );
    });

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = clamp(max ? window.scrollY / max : 0, 0, 1);
      sky.style.background = skyAt(p);
      sun.style.opacity = String(Math.max(0, (p - 0.5) * 2));
      starsEl.style.opacity = String(Math.max(0, 1 - p * 1.5));
      altVal.textContent = Math.round(p * 5000).toLocaleString();
      fill.style.width = p * 100 + "%";
      cue.style.opacity = p > 0.04 ? "0" : "0.7";

      const pt = trail.getPointAtLength(p * L);
      climberPos.setAttribute("transform", `translate(${pt.x},${pt.y})`);
      trail.style.strokeDashoffset = String(L * (1 - p));
      const ty = clamp(500 - pt.y, 1000 - WORLD_H, 0);
      world.setAttribute("transform", `translate(0,${ty})`);
      far.setAttribute("transform", `translate(0,${ty * 0.5})`);

      cards.forEach((c) =>
        c.classList.toggle("show", p >= +c.dataset.from! && p <= +c.dataset.to!)
      );
      let active = 0.05;
      for (const c of markers)
        if (c.type !== "note" && c.type !== "post" && p >= c.at - 0.05) active = c.at;
      hudBtns.forEach((b) =>
        b.classList.toggle("active", Math.abs(+b.dataset.at! - active) < 0.03)
      );
    };

    // throttle scroll work to one update per animation frame
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    const jump = (e: Event) => {
      const at = +(e.currentTarget as HTMLElement).dataset.at!;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: at * max, behavior: "smooth" });
    };
    hudBtns.forEach((b) => b.addEventListener("click", jump));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      hudBtns.forEach((b) => b.removeEventListener("click", jump));
    };
  }, []);

  return (
    <>
      <div id="sky" />
      <div id="stars" />
      <div id="sun" />

      <div id="scene">
        <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mtnBody" x1="0.15" y1="0" x2="0.6" y2="1">
              <stop offset="0" stopColor="#5d6694" /><stop offset="0.4" stopColor="#3a4170" /><stop offset="1" stopColor="#1b2146" />
            </linearGradient>
            <linearGradient id="snow2" x1="0" y1="0" x2="0.4" y2="1">
              <stop offset="0" stopColor="#f7fafe" /><stop offset="1" stopColor="#c4cfe8" />
            </linearGradient>
            <linearGradient id="far3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#454c78" /><stop offset="1" stopColor="#3c4369" /></linearGradient>
            <linearGradient id="far2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a4169" /><stop offset="1" stopColor="#2f365c" /></linearGradient>
            <linearGradient id="far1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2d3459" /><stop offset="1" stopColor="#242b4d" /></linearGradient>
            {/* soft haze via radial gradients (cheap) instead of feGaussianBlur (expensive on mobile) */}
            <radialGradient id="haze" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#cdd6ee" stopOpacity="0.18" /><stop offset="1" stopColor="#cdd6ee" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mistG" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#aab6da" stopOpacity="0.26" /><stop offset="1" stopColor="#aab6da" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g id="far">
            <ellipse cx="320" cy="520" rx="260" ry="82" fill="url(#haze)" />
            <ellipse cx="780" cy="600" rx="300" ry="94" fill="url(#haze)" />
            <polygon points="80,840 250,520 420,840" fill="url(#far3)" opacity="0.7" />
            <polygon points="250,520 214,592 250,572 286,592" fill="#cdd6ee" opacity="0.6" />
            <polygon points="620,860 800,500 980,860" fill="url(#far3)" opacity="0.7" />
            <polygon points="800,500 760,580 800,558 840,580" fill="#cdd6ee" opacity="0.6" />
            <path d="M-60,760 C 180,600 380,680 560,610 C 760,540 900,620 1060,580 L1060,1120 L-60,1120 Z" fill="url(#far2)" opacity="0.7" />
            <path d="M-60,900 C 150,780 360,850 560,780 C 760,710 920,790 1060,750 L1060,1260 L-60,1260 Z" fill="url(#far1)" opacity="0.9" />
          </g>

          <g id="world">
            <path d="M0,2800 L0,2560 C 90,2280 170,2080 300,1700 C 380,1470 430,1180 500,560 C 514,440 524,360 536,326 Q 544,302 552,334 C 566,430 600,620 660,900 C 740,1270 820,1560 900,1980 C 950,2240 980,2470 1000,2680 L1000,2800 Z" fill="url(#mtnBody)" />
            <path d="M0,2800 L0,2560 C 90,2280 170,2080 300,1700 C 380,1470 430,1180 500,560 C 514,440 524,360 536,326 Q 544,302 552,334 C 548,640 552,1200 540,1800 C 534,2250 540,2560 548,2800 Z" fill="#121734" opacity="0.5" />
            {/* compact snow cap hugging the apex + a subtle left-side shade */}
            <path d="M500,518 C 512,430 532,360 540,334 Q 546,316 556,338 C 570,404 584,462 598,518 C 566,506 532,540 500,518 Z" fill="url(#snow2)" />
            <path d="M500,518 C 508,438 524,380 538,340 C 530,416 524,466 526,512 C 516,518 508,522 500,518 Z" fill="#aeb9d8" opacity="0.4" />
            <ellipse cx="500" cy="2520" rx="780" ry="185" fill="url(#mistG)" />

            <g id="decor" />

            <path id="trailBase" d="M500,2640 C 350,2380 680,2120 500,1880 S 350,1480 560,1230 S 640,860 540,560 S 548,420 544,346" fill="none" stroke="#e9cfa0" strokeWidth="6" strokeOpacity="0.16" strokeDasharray="7 12" />
            <path id="trailDrawn" d="M500,2640 C 350,2380 680,2120 500,1880 S 350,1480 560,1230 S 640,860 540,560 S 548,420 544,346" fill="none" stroke="#ffe0a3" strokeWidth="6" strokeOpacity="0.7" strokeDasharray="7 12" />

            <g id="markers" />

            <g id="climberPos">
              <g id="climber">
                <circle r="20" fill="rgba(255,200,120,.16)" />
                <rect x="-7" y="-28" width="15" height="18" rx="4" fill="#e25b4a" />
                <circle cx="0" cy="-33" r="7" fill="#f0d2b0" />
                <line x1="0" y1="-11" x2="-8" y2="4" stroke="#1d1726" strokeWidth="4" strokeLinecap="round" />
                <line x1="0" y1="-11" x2="8" y2="3" stroke="#1d1726" strokeWidth="4" strokeLinecap="round" />
                <line x1="3" y1="-22" x2="18" y2="-8" stroke="#1d1726" strokeWidth="4" strokeLinecap="round" />
                <line x1="18" y1="-8" x2="21" y2="11" stroke="#cfd6ea" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <div id="info">
        <div className="card mid" data-from="0" data-to="0.06">
          <p className="label mono">⌖ TRAILHEAD · ELEV 0 m · OBJECTIVE: {profile.objective}</p>
          <h1>{profile.name}</h1>
          <p className="mono" style={{ opacity: 0.8, marginTop: 8 }}>FRONTEND ENGINEER</p>
          <p>{profile.heroHook}</p>
        </div>

        <div className="card left" data-from="0.08" data-to="0.22">
          <p className="label mono">BASE CAMP</p>
          <h2>Why I build</h2>
          <p>{profile.whyIBuild}</p>
          <div className="pack mono">{profile.pack.map((g) => <span key={g}>{g}</span>)}</div>
        </div>

        <div className="card right" data-from="0.25" data-to="0.42">
          <p className="label mono">CAMP I — CREST DATA · 2022–2024</p>
          <h2>Learning the ropes</h2>
          <h3>FENS — cloud security</h3><p>Owned the entire search module (React, TS, Redux, micro-frontend).</p>
          <h3>Netskope DLP</h3><p>Sole UI dev. End-to-end UI + Playwright tests + client demos.</p>
          <h3>Crest RMS</h3><p>Founding UI engineer — designed the UI and the stack.</p>
        </div>

        <div className="card chk right" data-from="0.45" data-to="0.55">
          <p className="label mono">🪨 FIELD NOTE</p>
          <h3>{profile.blog.title}</h3>
          <p>A deep dive into React internals · {profile.blog.reads}.</p>
          <p><a href={profile.links.blog} style={{ color: "#ffd9a0" }}>Read on Medium ↗</a></p>
        </div>

        <div className="card left" data-from="0.58" data-to="0.74">
          <p className="label mono">CAMP II — STATE STREET · THE CRUX</p>
          <h2>Leading the climb</h2>
          <p>Lead the React 16→18 + micro-frontend migration of 30+ screens, 2 senior devs reporting to me. Cut the timeline 40–50% with AI tooling, removed security vulnerabilities.</p>
          <p>Grids with 100+ columns and 100k+ rows; 22 records/view (up from 14) helping 5,000+ users hit SLAs faster.</p>
        </div>

        <div className="card chk left" data-from="0.77" data-to="0.87">
          <p className="label mono">⛏ CHECKPOINT — PROJECTS</p>
          <h3>More routes coming</h3>
          <p>Demo projects are in the works — they&apos;ll show up here as new checkpoints on the climb.</p>
        </div>

        <div className="card mid" data-from="0.92" data-to="1.01">
          <p className="label mono">SUMMIT REACHED</p>
          <h1>Higher ground.</h1>
          <p>If you&apos;re hiring, let&apos;s talk.</p>
          <a className="btn" href={`mailto:${profile.email}`}>Email me</a>
          <p className="links mono">
            <a href={profile.links.resume}>Résumé</a>
            <a href={profile.links.linkedin}>LinkedIn</a>
            <a href={profile.links.github}>GitHub</a>
          </p>
        </div>
      </div>

      <p className="scrollcue mono">↓ scroll to climb</p>

      <aside id="hud" className="mono" aria-label="Climb progress">
        <div className="alt">▲ <span id="altVal">0</span> m</div>
        <div id="bar"><div id="fill" /></div>
        <ul>
          {hudCamps.map((c) => (
            <li key={c.label}><button data-at={c.at}>{c.label}</button></li>
          ))}
        </ul>
      </aside>

      <div id="driver" />
    </>
  );
}
