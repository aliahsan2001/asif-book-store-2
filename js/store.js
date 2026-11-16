/* Asif Books & Uniform — storefront behaviour */
(() => {
  "use strict";
  document.documentElement.classList.add("js"); /* photos fade in only when this script is running */

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK");
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(location.search);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const page = document.body.dataset.page;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  let lenis = null; /* smooth scrolling, desktop only */
  const sizeLabel = (o) => (o === "To confirm" ? "Size confirmed by phone" : /^For /.test(o) ? o : `Size ${o}`);
  const qtyOf = (list) => list.reduce((s, i) => s + i.qty, 0);
  const optNote = (o) => (/^For /.test(o) ? o : sizeLabel(o).toLowerCase());

  /* seeded random so shelves look the same on every visit */
  const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  /* ------------------------------------------------------------------ store */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };

  /* ------------------------------------------------------------------ icons */
  const I = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cart: '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    truck: '<path d="M3 6h11v10H3zM14 9h4l3 3.5V16h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    store: '<path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3M10 20v-5h4v5"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
    ruler: '<path d="m3 17 14-14 4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c.3 2.5 2.5 4.7 5 5l1.2-1.4-1.9-.9-.8.8a4 4 0 0 1-2.1-2.1l.8-.8-.9-1.9z" fill="currentColor" stroke="none"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    bag: '<path d="M6 8h12l-1 13H7zM9 8V6a3 3 0 0 1 6 0v2"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    open: '<path d="M2 5c3-1 6-1 10 1 4-2 7-2 10-1v14c-3-1-6-1-10 1-4-2-7-2-10-1zM12 6v14"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    rotate: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"/>',
    print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    child: '<circle cx="12" cy="6" r="3"/><path d="M8 21v-6l-2-4h12l-2 4v6M10 21v-4h4v4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  };
  const icon = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

  /* photos fade in once loaded */
  const img = (key, w, alt = "", eager = false) => `<img class="img-fade" src="${PHOTO(IMAGES[key], w)}" alt="${esc(alt)}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>`;
  /* menu photos wait until the menu is first opened */
  const deferredImg = (key, w) => `<img class="img-fade" data-src="${PHOTO(IMAGES[key], w)}" alt="" decoding="async">`;
  function wireImages(root = document) {
    $$("img.img-fade:not(.is-loaded)", root).forEach((el) => {
      const done = () => el.classList.add("is-loaded");
      if (el.complete && el.naturalWidth) done(); else { el.addEventListener("load", done, { once: true }); el.addEventListener("error", done, { once: true }); }
    });
  }

  /* ------------------------------------------------------- colour helpers */
  const INK = "#0f1e36";
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(v + amt * (amt < 0 ? v : 255 - v)))));
    return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
  };
  const isLight = (hex) => { const n = parseInt(hex.slice(1), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) > 200; };

  function tintOf(p) {
    if (!p) return "#f5f7fb";
    if (p.type === "book") return shade(SUBJECTS[p.subj].c[0], 0.86);
    if (p.type === "uniform") return shade(p.crestColor, 0.88);
    const t = p.tint || "#3798ff";
    return isLight(t) ? "#eef3fa" : shade(t, 0.85);
  }

  /* ------------------------------------------------------- book mockups */
  const MOTIFS = {
    eng: '<text x="50" y="74" text-anchor="middle" font-family="Georgia,serif" font-size="78" font-weight="600" fill="currentColor" opacity=".9">Aa</text>',
    gram: '<path d="M22 30h24v22c0 12-8 20-20 22M58 30h24v22c0 12-8 20-20 22" fill="none" stroke="currentColor" stroke-width="7"/>',
    urdu: '<path d="M80 30c-10 30-40 46-62 30M70 58c4 14-6 26-22 26M30 40a4 4 0 1 0 0 1" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
    sindhi: '<path d="M18 62c20 10 50 10 66-14M40 36a4 4 0 1 0 0 1M58 30a4 4 0 1 0 0 1" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
    math: '<path d="M10 30h80M10 50h80M10 70h80M30 10v80M50 10v80M70 10v80" stroke="currentColor" stroke-width="1.6" opacity=".55"/><path d="M24 50h16M32 42v16M60 42l12 12M72 42 60 54" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    sci: '<g fill="none" stroke="currentColor" stroke-width="3.5"><ellipse cx="50" cy="50" rx="40" ry="14"/><ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(120 50 50)"/></g><circle cx="50" cy="50" r="7" fill="currentColor"/>',
    sst: '<g fill="none" stroke="currentColor" stroke-width="3.5"><circle cx="50" cy="50" r="38"/><ellipse cx="50" cy="50" rx="16" ry="38"/><path d="M12 50h76M18 30h64M18 70h64"/></g>',
    isl: '<g fill="none" stroke="currentColor" stroke-width="4"><rect x="22" y="22" width="56" height="56"/><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="12"/></g>',
    comp: '<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M14 30h30v40h42M44 50h30M60 20v30"/></g><g fill="currentColor"><circle cx="14" cy="30" r="6"/><circle cx="86" cy="70" r="6"/><circle cx="74" cy="50" r="6"/><circle cx="60" cy="20" r="6"/></g>',
    art: '<g fill="currentColor"><circle cx="30" cy="34" r="10"/><circle cx="56" cy="24" r="10" opacity=".7"/><circle cx="76" cy="46" r="10" opacity=".55"/><circle cx="62" cy="72" r="10" opacity=".8"/></g>',
    phy: '<path d="M6 50c8-30 16-30 24 0s16 30 24 0 16-30 24 0 10 22 16 10" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    chem: '<g fill="none" stroke="currentColor" stroke-width="4"><path d="M50 14 81 32v36L50 86 19 68V32z"/><circle cx="50" cy="50" r="16"/></g>',
    bio: '<path d="M20 80C20 40 50 18 84 16c-2 34-24 64-64 64zM20 80 62 38" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
    pak: '<path d="M64 22a30 30 0 1 0 14 50 24 24 0 1 1-14-50z" fill="currentColor"/><path d="m72 34 3 9h9l-7 5 3 9-8-6-8 6 3-9-7-5h9z" fill="currentColor"/>',
  };

  function cover(p, cls = "", plain = false) {
    if (!plain && BOOK_COVERS[p.id]) return `<div class="cover cover--photo ${cls}"><img src="${esc(BOOK_COVERS[p.id])}" alt="" loading="lazy"></div>`;
    if (!plain && photoOf(p)) return `<div class="cover cover--photo cover--titled ${cls}"><img src="${photoOf(p)}" alt="" loading="lazy"><span class="cover__title">${esc(p.title || SUBJECTS[p.subj].title)}</span><span class="cover__lvl">${esc(getClass(p.classId).n)}</span></div>`;
    const s = SUBJECTS[p.subj], cl = getClass(p.classId);
    const [a, b, c] = s.c;
    return `<div class="cover${s.dark ? " cover--dark" : ""}${plain ? " cover--plain" : ""} ${cls}" style="--c:${a};--c2:${b};--c3:${c}">
      <span class="cover__band">${plain ? "School textbook" : esc(s.name)}</span>
      <svg class="cover__motif" viewBox="0 0 100 100" aria-hidden="true">${MOTIFS[p.subj] || ""}</svg>
      <span class="cover__title">${esc(plain ? s.title : p.title || s.title)}</span>
      ${plain ? `<span class="cover__rule"></span><span class="cover__ed">Student's<br>book</span>` : `<span class="cover__lvl">${esc(cl.n)}</span><span class="cover__ed">2026–27<br>edition</span>`}
    </div>`;
  }

  function book3d(p, style = "", plain = false) {
    const s = SUBJECTS[p.subj], cl = getClass(p.classId);
    return `<div class="book3d${s.dark ? " book3d--light" : ""}${plain ? " book3d--plain" : ""}" style="--c:${s.c[0]};--c3:${s.c[2]};${style}"><div class="book3d__inner">
      ${cover(p, "book3d__face book3d__front", plain)}
      <div class="book3d__face book3d__back"><img src="assets/mark-yellow.png" alt="" width="40" height="38"><span>Asif Books &amp; Uniform</span>${plain ? "" : `<i>${rs(p.price)}</i>`}<b></b></div>
      <div class="book3d__face book3d__spine"><span>${esc(plain ? s.title : p.title || s.title)}</span>${plain ? "" : `<b>${esc(cl.n)}</b>`}</div>
      <div class="book3d__face book3d__pages"></div>
      <div class="book3d__face book3d__top"></div>
    </div></div>`;
  }

  let uid = 0;
  function svgArt(p) {
    const id = "g" + (++uid);
    const t = p.tint || "#3798ff";
    const d = shade(t, -0.22);
    const l = shade(t, 0.35);
    const F = `url(#${id})`;
    const st = isLight(t) ? `stroke="${shade(t, -0.3)}" stroke-width="1.6"` : "";
    const acc = p.accent || "#f5c400";
    const stitch = `stroke="${isLight(t) ? shade(t, -0.25) : shade(t, 0.3)}" stroke-width="1.2" stroke-dasharray="3 3" fill="none" opacity=".7"`;
    const crestAt = (x, y) => p.crest ? `<circle cx="${x}" cy="${y}" r="11" fill="${p.crestColor}" stroke="${acc}" stroke-width="2"/><text x="${x}" y="${y + 3.2}" text-anchor="middle" font-size="7.5" font-weight="800" fill="#fff" font-family="Figtree,sans-serif">${p.crest.slice(0, 3)}</text>` : "";
    const defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(t, 0.18)}"/><stop offset=".55" stop-color="${t}"/><stop offset="1" stop-color="${shade(t, -0.18)}"/></linearGradient></defs>`;
    const shadow = `<ellipse cx="100" cy="187" rx="64" ry="6" fill="${INK}" opacity=".13"/>`;
    const A = {
      shirt: `<path d="M60 40 85 28q15 14 30 0l25 12 34 30-17 22-13-10v95H56V82l-13 10-17-22z" fill="${F}" ${st}/>
        <path d="M60 40 43 92M140 40l17 52" ${stitch}/><path d="M56 82v95M144 82v95" ${stitch}/>
        <path d="m85 28 15 22 15-22" fill="none" stroke="${d}" stroke-width="2.5"/><path d="M85 28 76 52l16-6zM115 28l9 24-16-6z" fill="${l}" ${st}/>
        <path d="M100 50v125" stroke="${d}" stroke-width="1.6"/>${[70, 95, 120, 145].map((y) => `<circle cx="100" cy="${y}" r="2.6" fill="${d}"/>`).join("")}
        <path d="M70 110q30 10 60 0" stroke="${d}" stroke-width="1" fill="none" opacity=".35"/>${crestAt(124, 78)}`,
      trouser: `<path d="M60 26h80l10 152h-38l-12-104-12 104H50z" fill="${F}"/><rect x="60" y="26" width="80" height="14" fill="${d}"/>
        <path d="M100 40v34M76 40l-4 18M124 40l4 18" stroke="${d}" stroke-width="2" fill="none"/><path d="M78 60l-6 116M122 60l6 116" ${stitch}/>
        <rect x="70" y="30" width="6" height="10" fill="${l}"/><rect x="124" y="30" width="6" height="10" fill="${l}"/>`,
      novel: (() => {
        const lines = []; let cur = "";
        (p.title || "").split(" ").forEach((w) => { if (cur && (cur + " " + w).length > 12) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
        if (cur) lines.push(cur);
        const y0 = 82 - (lines.length - 1) * 7.5;
        return `<rect x="58" y="24" width="96" height="150" rx="3" fill="#efe6d2"/><path d="M150 26v146" stroke="#d8cdb4" stroke-width="1"/><rect x="50" y="20" width="98" height="152" rx="4" fill="${F}"/><rect x="50" y="20" width="11" height="152" rx="3" fill="${d}"/>
          <rect x="68" y="32" width="72" height="128" fill="none" stroke="#e7c873" stroke-width="1.4"/><rect x="72" y="36" width="64" height="120" fill="none" stroke="#e7c873" stroke-width=".6"/>
          ${lines.map((t, i) => `<text x="104" y="${y0 + i * 15}" text-anchor="middle" font-family="Georgia,serif" font-size="${lines.length > 3 ? 9.5 : 10.5}" font-weight="700" fill="#f6e9c6">${esc(t)}</text>`).join("")}
          <path d="M90 ${y0 + lines.length * 15 - 4}h28" stroke="#e7c873" stroke-width="1"/>
          <text x="104" y="148" text-anchor="middle" font-family="Georgia,serif" font-size="6.5" letter-spacing="1.2" fill="#f6e9c6">${esc((p.author || "").split(" ").pop().toUpperCase())}</text>`;
      })(),
      skirt: `<path d="M66 38h68l4 14H62z" fill="${d}"/><path d="M62 52h76l26 128H36z" fill="${F}" ${st}/>
        ${[58, 76, 94, 112, 130, 148].map((x, i) => `<path d="M${76 + i * 9.6} 52 ${x} 180" stroke="${d}" stroke-width="1.4" opacity=".55"/>`).join("")}<path d="M44 168h112" ${stitch}/>`,
      kameez: `<path d="M70 30 88 24q12 14 24 0l18 6 36 30-16 19-12-10 8 109H54l8-109-12 10-16-19z" fill="${F}" ${st}/>
        <path d="M88 24q12 26 24 0" fill="none" stroke="${acc}" stroke-width="4"/><path d="M100 46v40" stroke="${acc}" stroke-width="3"/>
        <path d="M56 160h88" stroke="${acc}" stroke-width="4"/><path d="M62 70l-6 100M138 70l6 100" ${stitch}/>${crestAt(126, 84)}`,
      sweater: `<path d="M58 36 84 26l16 38 16-38 26 10 36 112-18 8-15-56v72H55v-72l-15 56-18-8z" fill="${F}"/>
        <path d="m84 26 16 38 16-38" fill="none" stroke="${acc}" stroke-width="5"/><path d="M55 158h90" stroke="${acc}" stroke-width="5"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${60 + i * 11} 162v10" stroke="${d}" stroke-width="2"/>`).join("")}
        <path d="M30 150l14 5M170 150l-14 5" stroke="${d}" stroke-width="3"/>${crestAt(124, 78)}`,
      tie: `<path d="M86 26h28l-6 20 16 104-24 28-24-28 16-104z" fill="${F}"/><path d="M86 26h28l-6 20H92z" fill="${d}"/>
        ${[70, 98, 126].map((y) => `<path d="M80 ${y + 14} 122 ${y - 8}" stroke="${acc}" stroke-width="6"/>`).join("")}`,
      pe: `<path d="M62 44 86 34q14 12 28 0l24 10 30 26-15 20-12-8v58H59V82l-12 8-15-20z" fill="#fff" stroke="${shade(t, -0.1)}" stroke-width="1.6"/>
        <path d="m138 44 30 26-15 20-12-8zM62 44 32 70l15 20 12-8z" fill="${F}"/>
        <path d="M86 34q14 14 28 0" fill="none" stroke="${t}" stroke-width="4"/>
        <path d="M68 140h64l4 40h-30l-6-18-6 18H64z" fill="${F}"/>${crestAt(120, 70)}`,
      notebook: `<g transform="rotate(-6 100 100)"><rect x="54" y="32" width="100" height="142" rx="6" fill="#efe9db"/><rect x="48" y="28" width="104" height="142" rx="6" fill="${F}"/><rect x="48" y="28" width="16" height="142" rx="4" fill="${d}"/>
        <rect x="80" y="56" width="56" height="30" rx="3" fill="#fff"/><path d="M86 66h44M86 76h30" stroke="${d}" stroke-width="2.5"/>
        ${[46, 70, 94, 118, 142].map((y) => `<circle cx="56" cy="${y}" r="3" fill="#fff"/>`).join("")}</g>`,
      sketch: `<rect x="34" y="40" width="132" height="120" rx="4" fill="#fff" stroke="${INK}" stroke-opacity=".12" stroke-width="2"/><rect x="34" y="40" width="132" height="18" rx="3" fill="${F}"/>
        ${[48, 66, 84, 102, 120, 138, 156].map((x) => `<circle cx="${x}" cy="40" r="4" fill="none" stroke="${INK}" stroke-width="2.5"/>`).join("")}
        <path d="M58 130c14-30 30-40 44-18s28 0 40-28" fill="none" stroke="#1d5bd6" stroke-width="4" stroke-linecap="round"/><circle cx="130" cy="84" r="10" fill="#f5c400"/>`,
      pencils: [0, 1, 2, 3, 4].map((i) => `<g transform="rotate(${-20 + i * 10} 100 175)"><rect x="93" y="40" width="14" height="118" fill="${F}"/><rect x="93" y="40" width="5" height="118" fill="${l}"/><rect x="93" y="30" width="14" height="10" fill="#f2a0a8"/><rect x="93" y="38" width="14" height="5" fill="#b9c2cf"/><path d="M93 158h14l-7 22z" fill="#f3d2a2"/><path d="m98 172 2 8 2-8z" fill="${INK}"/></g>`).join(""),
      pens: [0, 1, 2].map((i) => `<g transform="rotate(${-14 + i * 14} 100 170)"><rect x="92" y="30" width="16" height="120" rx="7" fill="${i === 1 ? INK : F}"/><rect x="104" y="40" width="4" height="46" rx="2" fill="#c9d4e4"/><path d="M93 150h14l-4 18h-6z" fill="#dfe6ef"/><path d="M98 168h4l-2 8z" fill="${INK}"/></g>`).join(""),
      eraser: `<g transform="rotate(-10 80 110)"><rect x="34" y="82" width="86" height="46" rx="8" fill="#fff" stroke="${INK}" stroke-opacity=".15" stroke-width="2"/><rect x="34" y="82" width="46" height="46" rx="8" fill="${F}"/><rect x="72" y="82" width="8" height="46" fill="${t}"/></g>
        <path d="M124 92h40l-6 52h-28z" fill="#1d5bd6"/><rect x="130" y="104" width="28" height="12" rx="3" fill="#cfe3ff"/><circle cx="144" cy="130" r="6" fill="${INK}" opacity=".5"/>`,
      geometry: `<rect x="30" y="58" width="140" height="96" rx="10" fill="${F}"/><rect x="30" y="58" width="140" height="22" rx="8" fill="${l}" opacity=".3"/>
        <path d="M62 140a38 38 0 0 1 76 0z" fill="#f5c400"/><path d="M100 140V108" stroke="${INK}" stroke-width="2"/>${[-60, -30, 0, 30, 60].map((a) => `<path d="M100 140l${(Math.sin(a * Math.PI / 180) * 34).toFixed(1)} ${(-Math.cos(a * Math.PI / 180) * 34).toFixed(1)}" stroke="${INK}" stroke-width="1.4" opacity=".4"/>`).join("")}
        <rect x="44" y="46" width="112" height="12" rx="2" fill="#fff" transform="rotate(-8 100 52)"/><path d="M52 47v6M64 45v8M76 44v6M88 42v8M100 40v6M112 39v8M124 37v6M136 36v8" stroke="${INK}" stroke-width="1.5" transform="rotate(-8 100 52)"/>`,
      calculator: `<rect x="52" y="22" width="96" height="156" rx="14" fill="${F}"/><rect x="64" y="36" width="72" height="30" rx="4" fill="#cfe9d8"/><text x="130" y="58" text-anchor="end" font-family="Figtree" font-weight="800" font-size="16" fill="${INK}">2026</text>
        ${[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${64 + c * 19}" y="${78 + r * 23}" width="14" height="16" rx="3" fill="${r === 3 && c === 3 ? "#f5c400" : c === 3 ? "#3798ff" : "#5b6474"}"/>`).join("")).join("")}`,
      colors: ["#d2452f", "#f08a24", "#f5c400", "#17845a", "#3798ff", "#5b3cc4", "#b0306a"].map((c, i) => `<g transform="rotate(${-27 + i * 9} 100 178)"><rect x="95" y="34" width="10" height="122" fill="${c}"/><rect x="95" y="34" width="3" height="122" fill="#fff" opacity=".25"/><path d="M95 156h10l-5 18z" fill="#f3d2a2"/><path d="m98 168 2 6 2-6z" fill="${c}"/></g>`).join("") + `<rect x="54" y="126" width="92" height="58" rx="6" fill="${F}"/><text x="100" y="162" text-anchor="middle" font-family="Georgia,serif" font-weight="600" font-size="22" fill="#fff">24</text>`,
      crayons: ["#d2452f", "#f5c400", "#3798ff", "#17845a", "#f08a24"].map((c, i) => `<g transform="translate(${36 + i * 26} ${i % 2 ? 14 : 0})"><path d="M0 70 8 46h8l8 24v100H0z" fill="${c}"/><rect x="0" y="96" width="24" height="44" fill="#fff" opacity=".85"/><rect x="0" y="104" width="24" height="4" fill="${c}"/></g>`).join(""),
      scissors: `<rect x="112" y="40" width="34" height="120" rx="8" fill="${F}"/><rect x="112" y="40" width="34" height="26" rx="8" fill="${d}"/><rect x="120" y="120" width="18" height="40" fill="#fff" opacity=".5"/>
        <g transform="rotate(-25 70 110)"><path d="M66 30 74 110M80 30 72 110" stroke="#b9c2cf" stroke-width="9" stroke-linecap="round"/><circle cx="60" cy="130" r="16" fill="none" stroke="#f08a24" stroke-width="8"/><circle cx="88" cy="130" r="16" fill="none" stroke="#f08a24" stroke-width="8"/></g>`,
      roll: `<rect x="40" y="62" width="120" height="76" fill="${F}" opacity=".8"/><ellipse cx="40" cy="100" rx="14" ry="38" fill="${d}"/><ellipse cx="40" cy="100" rx="5" ry="12" fill="#fff"/><ellipse cx="160" cy="100" rx="14" ry="38" fill="${l}"/>
        <path d="M64 70l22 60M96 70l22 60M128 70l22 60" stroke="#fff" stroke-width="4" opacity=".6"/>`,
      labels: `<rect x="44" y="26" width="112" height="152" rx="6" fill="#fff" stroke="${INK}" stroke-opacity=".12" stroke-width="2"/>
        ${[0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${54 + c * 50}" y="${38 + r * 35}" width="42" height="26" rx="6" fill="${[t, "#f5c400", "#17845a", "#d2452f"][(r + c) % 4]}"/><path d="M${60 + c * 50} ${52 + r * 35}h24" stroke="#fff" stroke-width="3"/>`).join("")).join("")}`,
      pouch: `<path d="M30 80q0-14 14-14h112q14 0 14 14v70q0 14-14 14H44q-14 0-14-14z" fill="${F}"/><path d="M30 92h140" stroke="${d}" stroke-width="6"/><path d="M30 92h140" stroke="#fff" stroke-width="2" stroke-dasharray="3 4"/><rect x="146" y="88" width="10" height="26" rx="4" fill="#f5c400"/>`,
      bag: `<path d="M74 40q0-22 26-22t26 22" fill="none" stroke="${d}" stroke-width="8"/><rect x="46" y="38" width="108" height="140" rx="30" fill="${F}"/>
        <rect x="64" y="104" width="72" height="56" rx="14" fill="${d}"/><path d="M64 122h72" stroke="#f5c400" stroke-width="3"/><rect x="94" y="116" width="12" height="12" rx="3" fill="#f5c400"/>
        <path d="M54 60v100M146 60v100" ${stitch}/><path d="M70 58h60" stroke="${l}" stroke-width="4" stroke-linecap="round" opacity=".5"/>`,
      trolley: `<path d="M84 36V14h32v22" fill="none" stroke="#5b6474" stroke-width="6"/><rect x="48" y="36" width="104" height="132" rx="26" fill="${F}"/><rect x="66" y="96" width="68" height="52" rx="12" fill="${d}"/><path d="M66 114h68" stroke="#f5c400" stroke-width="3"/>
        <circle cx="70" cy="176" r="10" fill="${INK}"/><circle cx="130" cy="176" r="10" fill="${INK}"/>`,
      bottle: `<rect x="82" y="20" width="36" height="22" rx="6" fill="${INK}"/><path d="M76 50q0-8 8-8h32q8 0 8 8v4q16 8 16 26v86q0 14-14 14H74q-14 0-14-14V80q0-18 16-26z" fill="${F}"/>
        <rect x="60" y="96" width="80" height="34" fill="${l}" opacity=".5"/><path d="M74 70v90" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>`,
      lunch: `<rect x="28" y="66" width="144" height="98" rx="18" fill="${F}"/><rect x="28" y="66" width="144" height="30" rx="14" fill="${d}"/><rect x="84" y="56" width="32" height="18" rx="6" fill="${INK}"/>
        <path d="M100 100v56" stroke="${d}" stroke-width="4"/><circle cx="64" cy="128" r="12" fill="#fff" opacity=".7"/><rect x="118" y="118" width="34" height="20" rx="8" fill="#fff" opacity=".7"/>`,
    };
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}">${defs}${shadow}${A[p.art] || A.notebook}</svg>`;
  }

  /* close-up of a uniform's crest and fabric for the product gallery */
  function crestDetail(p) {
    const id = "w" + (++uid);
    return `<svg viewBox="0 0 200 200" aria-label="Crest detail"><defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${p.tint}"/><path d="M0 3h6M3 0v6" stroke="${isLight(p.tint) ? "#00000012" : "#ffffff18"}" stroke-width="1"/></pattern></defs>
      <rect width="200" height="200" fill="url(#${id})"/><circle cx="100" cy="100" r="54" fill="${p.crestColor}" stroke="${p.accent}" stroke-width="6"/><circle cx="100" cy="100" r="44" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="2 3"/>
      <text x="100" y="110" text-anchor="middle" font-family="Figtree,sans-serif" font-weight="800" font-size="28" fill="#fff">${esc(p.crest)}</text></svg>`;
  }

  const photoTag = (p) => (p.type === "book" ? getClass(p.classId).name : p.type === "uniform" ? getSchool(p.school).short : "");
  const art = (p, mode = "flat") => {
    const ph = photoOf(p, mode === "lg" ? 1000 : 480);
    if (ph) return `<div class="art art--photo${p.type === "novel" ? " art--cover" : ""}"><img src="${ph}" alt="" loading="lazy" decoding="async">${photoTag(p) ? `<span class="art__tag">${esc(photoTag(p))}</span>` : ""}</div>`;
    return p.type === "book" ? (mode === "3d" ? book3d(p) : cover(p)) : `<div class="art${p.type === "novel" ? " art--novel" : ""}">${svgArt(p)}</div>`;
  };

  /* ---------------------------------------------------- bookcase pieces */
  function spine(p, o = {}) {
    const s = SUBJECTS[p.subj], cl = getClass(p.classId);
    return `<button class="spine${o.lean ? " spine--lean" : ""}${s.dark ? " spine--light" : ""}" data-qv="${p.id}" style="--c:${s.c[0]};--c3:${s.c[2]};--h:${o.h || 88}%;--w:${o.w || 34}px" aria-label="${esc(p.name)}, ${rs(p.price)}. Look inside">
      <span class="spine__title">${esc(p.title || s.title)}</span><span class="spine__lvl">${esc(cl.n)}</span>
      <span class="tip">${esc(p.name)}<b>${rs(p.price)}</b></span></button>`;
  }

  function bay(cl, seed, { plate = true, link = true } = {}) {
    const r = rng(seed);
    const books = PRODUCTS.filter((p) => p.type === "book" && p.classId === cl.id);
    const items = books.map((b) => spine(b, { w: Math.round(32 + r() * 12), h: Math.round(76 + r() * 22), lean: r() < 0.07 }));
    if (r() < 0.6) items.push('<span class="bookend" aria-hidden="true"></span>');
    return `<div class="bay"><div class="bay__books">${items.join("")}</div>
      <div class="shelf">${plate ? `<span class="plate">${esc(cl.name)}</span>` : ""}${link ? `<a class="shelf__link" href="shop.html?cat=books&class=${cl.id}">Shop ${esc(cl.name)}</a>` : ""}</div></div>`;
  }

  /* ------------------------------------------------------------------ cart */
  const Cart = {
    items: store.get("asif_cart_v1", []),
    later: store.get("asif_later_v1", []),
    promo: store.get("asif_promo_v1", ""),
    bundle: store.get("asif_bundle_v1", null),
    save() { store.set("asif_cart_v1", this.items); store.set("asif_later_v1", this.later); store.set("asif_promo_v1", this.promo); store.set("asif_bundle_v1", this.bundle); renderCartUI(); },
    key: (id, opt) => id + "|" + (opt || ""),
    add(id, qty = 1, opt = "", silent = false, grp = "") {
      const k = this.key(id, opt);
      const ex = this.items.find((i) => i.k === k);
      if (ex) { ex.qty += qty; if (!ex.grp && grp) ex.grp = grp; } else this.items.push({ k, id, qty, opt, ...(grp ? { grp } : {}) });
      this.save(); bump();
      if (!silent) toast(`${getProduct(id).name} added to your cart`);
    },
    set(k, qty) { const it = this.items.find((i) => i.k === k); if (!it) return; it.qty = Math.max(1, Math.min(99, qty)); this.save(); },
    remove(k) { this.items = this.items.filter((i) => i.k !== k); this.save(); },
    removeGroup(g) { this.items = this.items.filter((i) => (i.grp || "") !== g); this.save(); },
    toLater(k) { const it = this.items.find((i) => i.k === k); if (!it) return; this.items = this.items.filter((i) => i.k !== k); this.later = this.later.filter((i) => i.k !== k).concat(it); this.save(); toast("Moved to saved for later", false); },
    fromLater(k) { const it = this.later.find((i) => i.k === k); if (!it) return; this.later = this.later.filter((i) => i.k !== k); const ex = this.items.find((i) => i.k === k); if (ex) ex.qty += it.qty; else this.items.push(it); this.save(); },
    clear() { this.items = []; this.promo = ""; this.bundle = null; this.save(); },
    count() { return this.items.reduce((s, i) => s + i.qty, 0); },
    subtotal() { return this.items.reduce((s, i) => s + priceOf(getProduct(i.id), i.opt) * i.qty, 0); },
  };

  function discountFor(sub, code = Cart.promo) {
    const p = PROMOS[code];
    if (!p || sub < p.min) return 0;
    return p.type === "pct" ? Math.round(sub * p.value / 100) : p.value;
  }
  /* bundle saving applies while every bundled item is still in the cart */
  function bundleDisc() {
    const b = Cart.bundle;
    if (!b || !b.ids?.length || !b.ids.every((id) => Cart.items.some((i) => i.id === id))) return 0;
    return Math.round(b.ids.reduce((s, id) => s + (getProduct(id)?.price || 0), 0) * b.pct / 100);
  }
  function totals(method = "delivery") {
    const sub = Cart.subtotal();
    const disc = discountFor(sub);
    const bdisc = bundleDisc();
    const ship = method === "pickup" || sub >= STORE.freeDeliveryOver || sub === 0 ? 0 : STORE.deliveryFee;
    return { sub, disc, bdisc, ship, total: Math.max(0, sub - disc - bdisc + ship) };
  }
  const discRows = (t) => (t.disc ? `<div class="summary__row summary__row--disc"><span>Promo ${esc(Cart.promo)}</span><span>&minus;${rs(t.disc)}</span></div>` : "")
    + (t.bdisc ? `<div class="summary__row summary__row--disc"><span>Bundle saving (${Cart.bundle.pct}%)</span><span>&minus;${rs(t.bdisc)}</span></div>` : "");

  const Saved = {
    ids: new Set(store.get("asif_saved_v1", [])),
    has(id) { return this.ids.has(id); },
    toggle(id) { this.has(id) ? this.ids.delete(id) : this.ids.add(id); store.set("asif_saved_v1", [...this.ids]); renderSavedUI(); return this.has(id); },
  };
  const Recent = {
    push(id) { const r = store.get("asif_recent_v1", []).filter((x) => x !== id); r.unshift(id); store.set("asif_recent_v1", r.slice(0, 12)); },
    list(except) { return store.get("asif_recent_v1", []).filter((x) => x !== except && getProduct(x)); },
  };
  const Orders = {
    all() { return store.get("asif_orders_v1", []); },
    add(o) { store.set("asif_orders_v1", [o, ...this.all()]); },
    find(no) { return this.all().find((o) => o.no.toLowerCase() === String(no).trim().toLowerCase()); },
  };

  /* add a kit, list, uniform or bundle in one go; asks first when some items are already in the cart */
  function addSet(items, grp, done) {
    const put = (list) => { list.forEach((i) => Cart.add(i.id, i.qty, i.opt || "", true, grp)); done?.(list); };
    const has = items.filter((i) => Cart.items.some((c) => c.k === Cart.key(i.id, i.opt)));
    if (!has.length) { put(items); return; }
    const fresh = items.filter((i) => !has.includes(i));
    const names = has.slice(0, 5).map((i) => `<li>${esc(getProduct(i.id).name)}</li>`).join("") + (has.length > 5 ? `<li>and ${has.length - 5} more</li>` : "");
    openModal(`<div class="dup"><h3>Some of these are already in your cart</h3>
      <p>${has.length} of the ${items.length} items in <strong>${esc(grp)}</strong> are in your cart already, so adding everything would give you two of each.</p><ul>${names}</ul>
      <div class="dup__actions">${fresh.length ? `<button class="btn btn--primary" data-dup="new">Add only the ${fresh.length} new ${fresh.length === 1 ? "item" : "items"}</button>` : ""}
        <button class="btn btn--ghost" data-dup="all">Add all of them again</button><button class="btn btn--ghost" data-dup="no">${fresh.length ? "Cancel" : "Keep my cart as it is"}</button></div></div>`);
    $("[data-modal-box]").addEventListener("click", (e) => {
      const b = e.target.closest("[data-dup]"); if (!b) return;
      closeModal();
      if (b.dataset.dup === "new") put(fresh); else if (b.dataset.dup === "all") put(items);
    });
  }

  /* delivery dates: Monday to Saturday are working days */
  const DAY = (d) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const addWorkDays = (from, n) => { const d = new Date(from); while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) n--; } return d; };
  function deliveryWindow(areaName, from = new Date()) {
    const a = DELIVERY_AREAS.find((x) => x.name === areaName); if (!a) return null;
    const sunday = from.getDay() === 0;
    let first, last;
    if (/same day/i.test(a.days)) { first = last = !sunday && from.getHours() < 14 ? new Date(from) : addWorkDays(from, 1); }
    else if (/1 to 2/.test(a.days)) { first = addWorkDays(from, 1); last = addWorkDays(from, 2); }
    else if (/^2 /.test(a.days)) { first = last = addWorkDays(from, 2); }
    else { first = last = addWorkDays(from, 1); }
    const today = first.toDateString() === from.toDateString();
    const label = today ? `today, ${DAY(first)}` : first.toDateString() === last.toDateString() ? DAY(first) : `${DAY(first)} to ${DAY(last)}`;
    return { first, last, today, label };
  }

  /* --------------------------------------------------------- motion bits */
  function flyToCart(src) {
    if (reduced || !src) return;
    const target = $(".header [data-open-cart]");
    if (!target) return;
    const a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width) return;
    const c = src.cloneNode(true);
    c.classList.add("flyer");
    Object.assign(c.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.appendChild(c);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.5 - 60}px) scale(.5)`, opacity: 0.95, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0 },
    ], { duration: 720, easing: "cubic-bezier(.5,0,.2,1)" }).onfinish = () => c.remove();
  }

  /* a product image arcs into another element (bundle tray) */
  function flyTo(src, target) {
    if (reduced || !src || !target) return;
    const a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width || b.bottom < 0 || b.top > innerHeight) return;
    const c = src.cloneNode(true); c.classList.add("flyer");
    Object.assign(c.style, { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px" });
    document.body.appendChild(c);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    c.animate([
      { transform: "translate(0,0) scale(1) rotate(0)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 90}px) scale(.6) rotate(-8deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.15) rotate(6deg)`, opacity: 0 },
    ], { duration: 680, easing: "cubic-bezier(.5,0,.2,1)" }).onfinish = () => { c.remove(); target.animate([{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" }); };
  }

  /* sliding pill under tab groups */
  function tabPill(tabs) {
    let pill = $(".tabs__pill", tabs);
    if (!pill) { pill = document.createElement("span"); pill.className = "tabs__pill"; tabs.prepend(pill); }
    const on = $('[aria-selected="true"]', tabs);
    if (!on) return;
    pill.style.left = on.offsetLeft + "px"; pill.style.width = on.offsetWidth + "px";
  }
  function wireTabs(tabs, onSelect) {
    tabPill(tabs);
    tabs.addEventListener("click", (e) => {
      const t = e.target.closest('[role="tab"]'); if (!t || t.getAttribute("aria-selected") === "true") return;
      $$('[role="tab"]', tabs).forEach((x) => x.setAttribute("aria-selected", x === t));
      tabPill(tabs); onSelect(t);
    });
    addEventListener("resize", () => tabPill(tabs));
    document.fonts?.ready.then(() => tabPill(tabs));
  }
  /* crossfade a container's content */
  function swap(el, html, after) {
    const put = () => { el.innerHTML = html; after && after(); wireImages(el); };
    if (reduced || !el.innerHTML.trim()) { put(); return; }
    el.classList.add("is-swapping");
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in", fill: "forwards" }).onfinish = () => {
      put(); el.classList.remove("is-swapping");
      el.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" });
    };
  }

  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }) : null;
  /* anything already on screen is shown straight away, so a page title never waits on the observer */
  const reveal = (root = document) => {
    const els = $$(".reveal:not(.in), .wsplit:not(.in)", root);
    if (!io || reduced) { els.forEach((el) => el.classList.add("in")); return; }
    const now = [];
    els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && r.top < innerHeight && r.bottom > 0) now.push(el); io.observe(el); });
    if (now.length) setTimeout(() => now.forEach((el) => el.classList.add("in")), 40);
  };

  /* ------------------------------------------------------------- chrome */
  const NAV = [
    ["school-lists.html", "School book lists"],
    ["shop.html?cat=books", "Books", "", "books"],
    ["uniforms.html", "Uniforms", "", "uniforms"],
    ["shop.html?cat=stationery", "Stationery"],
    ["shop.html?cat=novels", "Novels"],
    ["shop.html?cat=bags", "Bags & bottles"],
    ["shop.html?sale=1", "Offers", "nav__offer"],
    ["about.html", "About us", "", "", true],
    ["contact.html", "Visit the store"],
  ];

  function currentNav() {
    const file = location.pathname.split("/").pop() || "index.html";
    const full = file + location.search;
    const exact = NAV.find(([h]) => h === full);
    if (exact) return exact[0];
    const byFile = NAV.find(([h]) => h.split("?")[0] === file && !h.includes("?"));
    return byFile ? byFile[0] : null;
  }

  function mega(kind) {
    let n = 0; /* running index staggers the links in */
    if (kind === "books") {
      const stages = [["early", "Early years"], ["primary", "Primary"], ["middle", "Middle school"], ["matric", "Matric"]];
      const titles = (c) => PRODUCTS.filter((p) => p.type === "book" && p.id.endsWith("-" + c.id)).length;
      return `<div class="mega mega--books"><div class="mega__cols">
        ${stages.map(([st, label], si) => `<div class="mega__col" style="--mi:${si}"><h4><span class="mega__dot"></span>${label}</h4><ul>${CLASSES.filter((c) => c.stage === st).map((c) => `<li style="--mi:${n++}"><a href="shop.html?cat=books&class=${c.id}"><span>${c.name} books</span><small>${titles(c)} titles</small>${icon("arrow")}</a></li>`).join("")}</ul></div>`).join("")}
        </div><a class="mega__feature" href="school-lists.html">${deferredImg("curved", 600)}<span class="mega__chip">2026–27 lists</span><strong>Order the whole list</strong><small>Pick a school and class and every title loads at once.</small><span class="mega__go">Start a list${icon("arrow")}</span></a></div>`;
    }
    return `<div class="mega mega--schools"><div><h4><span class="mega__dot"></span>Shop uniforms by school</h4><div class="mega__schools">
      ${SCHOOLS.map((s) => `<a href="uniforms.html?school=${s.id}" style="--mi:${n++};--sc:${s.color}"><span class="crest" style="background:${s.color}">${s.short}</span><span><strong>${esc(s.name)}</strong><small>${esc(s.campus)}</small></span>${icon("arrow")}</a>`).join("")}
      </div></div><a class="mega__feature" href="uniforms.html">${deferredImg("shirts", 600)}<span class="mega__chip">Sizes 22 to 38</span><strong>Uniforms to school spec</strong><small>Embroidered crests and free hem alterations.</small><span class="mega__go">See all uniforms${icon("arrow")}</span></a></div>`;
  }

  function header() {
    const cur = currentNav();
    const q = esc(params.get("q") || "");
    const searchForm = (id) => `<form class="search" action="shop.html" role="search">
        <label class="sr-only" for="${id}">Search the store</label>
        <input id="${id}" name="q" type="search" placeholder="Search by title, subject, class or school" value="${q}" autocomplete="off" data-suggest>
        <button type="submit" aria-label="Search">${icon("search")}</button>
        <div class="suggest" data-suggest-box hidden></div></form>`;
    return `
    <div class="utility"><div class="wrap">
      <span class="utility__msg">${icon("truck")}Free delivery across Karachi on orders over ${rs(STORE.freeDeliveryOver)}</span>
      <button class="lang-btn" type="button" data-lang data-no-tr></button>
      <span class="utility__links"><a href="track.html">Track an order</a><a href="contact.html#faq">Help</a><a href="tel:${STORE.phone.replace(/\s/g, "")}">${esc(STORE.phone)}</a></span>
    </div></div>
    <header class="header" data-header>
      <div class="wrap header__main">
        <button class="hbtn menu-toggle" aria-label="Open menu" aria-expanded="false" data-menu>${icon("menu")}</button>
        <a class="brand" href="index.html" aria-label="${esc(STORE.name)} home">
          <span class="brand__tile"><img src="assets/mark-yellow.png" alt="" width="34" height="33"></span>
          <span class="brand__name">Asif Books<br>&amp; Uniform<small>${esc(STORE.area)}</small></span>
        </a>
        ${searchForm("q-desk")}
        <div class="header__actions">
          <a class="hbtn hbtn--lists" href="school-lists.html">${icon("list")}<span class="hbtn__label">Book lists</span></a>
          <a class="hbtn" href="account.html" aria-label="Your account">${icon("user")}<span class="hbtn__label">Account</span></a>
          <a class="hbtn" href="wishlist.html" aria-label="Saved items">${icon("heart")}<span class="badge" data-saved-count>0</span><span class="hbtn__label">Saved</span></a>
          <button class="hbtn" data-open-cart aria-label="Open cart">${icon("cart")}<span class="badge" data-count>0</span><span class="hbtn__label">Cart</span></button>
        </div>
      </div>
      <nav class="nav" aria-label="Main" data-nav><div class="wrap">
        <div class="mobile-search">${searchForm("q-mob")}</div>
        <ul>${NAV.map(([h, l, c, m, right]) => `<li class="${[m ? "has-mega" : "", right ? "nav__right" : ""].join(" ").trim()}"><a href="${h}"${c ? ` class="${c}"` : ""}${cur === h ? ' aria-current="page"' : ""}>${l}${m ? icon("chev", "chev") : ""}</a>${m ? mega(m) : ""}</li>`).join("")}</ul>
      </div></nav>
    </header>`;
  }

  function footer() {
    return `<footer class="footer"><div class="wrap">
      <div class="footer__cta">
        <span class="footer__cta-ic">${icon("wa")}</span>
        <div><strong>Stuck on the school list?</strong><span>Send us a photo on WhatsApp and we'll price the whole list for you.</span></div>
        <a class="btn btn--primary" href="https://wa.me/${STORE.whatsapp}" target="_blank" rel="noopener">Send the list${icon("arrow")}</a>
      </div>
      <div class="footer__top">
        <div class="footer__brand">
          <img src="assets/mark-yellow.png" alt="Asif Books & Uniform" width="64" height="61">
          <p class="footer__motto">${esc(STORE.motto)}</p>
          <p>School books, uniforms and stationery for families in Gulshan-e-Iqbal and across Karachi.</p>
        </div>
        <div><h4>Shop</h4><ul>
          <li><a href="school-lists.html">School book lists</a></li><li><a href="shop.html?cat=books">Textbooks</a></li>
          <li><a href="uniforms.html">Uniforms</a></li><li><a href="shop.html?cat=stationery">Stationery</a></li><li><a href="shop.html?cat=novels">Novels</a></li><li><a href="shop.html?sale=1">Offers</a></li></ul></div>
        <div><h4>Your orders</h4><ul>
          <li><a href="account.html">Your account</a></li><li><a href="track.html">Track an order</a></li>
          <li><a href="wishlist.html">Saved items</a></li><li><a href="cart.html">Cart</a></li></ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="policies.html#delivery">Delivery and pickup</a></li><li><a href="policies.html#returns">Returns and exchanges</a></li>
          <li><a href="policies.html#privacy">Privacy</a></li><li><a href="policies.html#terms">Terms of sale</a></li><li><a href="contact.html#faq">FAQs</a></li></ul></div>
        <div><h4>Visit us</h4><ul>
          <li>${esc(STORE.address)}</li><li><a href="tel:${STORE.phone.replace(/\s/g, "")}">${esc(STORE.phone)}</a></li>
          <li><a href="mailto:${STORE.email}">${esc(STORE.email)}</a></li><li><a href="about.html">About the shop</a></li></ul></div>
      </div>
      <div class="footer__bottom">
        <span>&copy; ${new Date().getFullYear()} ${esc(STORE.name)}. All rights reserved.</span>
        <span class="pay-chips"><span>Cash on delivery</span><span>JazzCash</span><span>Easypaisa</span><span>Bank transfer</span></span>
        <span class="footer__credit">Photography from Unsplash</span>
        <button class="footer__top-btn" type="button" data-to-top>${icon("arrow")}Back to top</button>
      </div>
      <div class="footer__mark" aria-hidden="true">Asif Books</div>
    </div></footer>
    <a class="wa-float" href="https://wa.me/${STORE.whatsapp}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("wa")}</a>
    <span class="scroll-bar" aria-hidden="true"><i data-scroll-bar></i></span>
    <nav class="tabbar" aria-label="Quick links">
      ${[["index.html", "store", "Home", "home"], ["school-lists.html", "list", "Lists", "lists"], ["shop.html", "bag", "Shop", "shop"], ["wishlist.html", "heart", "Saved", "wishlist"]].map(([h, ic, l, pg]) => `<a href="${h}"${page === pg ? ' aria-current="page"' : ""}>${icon(ic)}<span>${l}</span></a>`).join("")}
      <button type="button" data-open-cart aria-label="Open cart">${icon("cart")}<span>Cart</span><b class="badge" data-count>0</b></button>
    </nav>`;
  }

  function overlays() {
    return `<div class="scrim" data-scrim></div>
    <aside class="drawer" aria-label="Cart" aria-hidden="true" data-drawer>
      <div class="drawer__head"><h3>Your cart</h3><button class="icon-btn" data-close-cart aria-label="Close cart">${icon("x")}</button></div>
      <div class="drawer__body" data-drawer-body></div>
      <div class="drawer__foot" data-drawer-foot></div>
    </aside>
    <div class="toast" role="status" aria-live="polite" data-toast>${icon("check")}<span data-toast-msg></span><button data-open-cart>View cart</button></div>
    <div class="modal" data-modal role="dialog" aria-modal="true"><div class="scrim" data-close-modal></div><div class="modal__box" data-modal-box></div></div>`;
  }

  /* ------------------------------------------------------ shared widgets */
  function card(p, i = 0) {
    const meta = p.type === "book" ? `${p.subject}, ${getClass(p.classId).name}` : p.type === "uniform" ? getSchool(p.school).name : p.sub || (p.type === "bag" ? "Bags & bottles" : "Stationery");
    const flag = p.was ? `<span class="card__flag card__flag--sale">Save ${rs(p.was - p.price)}</span>` : NEW_IN.includes(p.id) ? '<span class="card__flag">New</span>' : "";
    const needsOpt = p.sizes && p.sizes.length > 1;
    const off = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    const info = p.type === "book" ? "2026\u201327 edition" : p.author ? `By ${p.author}` : needsOpt ? `${p.sizes.length} sizes, ${p.sizes[0]} to ${p.sizes[p.sizes.length - 1]}` : "";
    const inCart = needsOpt ? 0 : (Cart.items.find((x) => x.k === Cart.key(p.id, "")) || {}).qty || 0;
    return `<article class="card reveal${inCart ? " in-cart" : ""}"${needsOpt ? "" : ` data-pid="${p.id}"`} style="--tint:${tintOf(p)};--i:${i % 8}">
      <div class="card__media">${flag}
        <div class="card__art" aria-hidden="true">${art(p, "3d")}</div>
        <span class="card__in">${icon("check")}In cart</span>
        <div class="card__tools">
          <button class="tool" data-save="${p.id}" aria-pressed="${Saved.has(p.id)}" aria-label="Save ${esc(p.name)}">${icon("heart")}</button>
          <button class="tool" data-qv="${p.id}" aria-label="Quick view ${esc(p.name)}">${icon(p.type === "book" ? "open" : "eye")}</button>
        </div>
      </div>
      <div class="card__body">
        <span class="card__meta">${esc(meta)}</span>
        <h3 class="card__title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        ${info ? `<span class="card__info">${esc(info)}</span>` : ""}
        <div class="card__foot">
          <span class="price">${p.step ? '<small class="price__from">From</small>' : ""}${rs(p.price)}${p.was ? `<s>${rs(p.was)}</s><em class="price__off">${off}% off</em>` : ""}</span>
          ${needsOpt
            ? `<button class="add-btn" data-qv="${p.id}" aria-label="Choose size for ${esc(p.name)}">${icon("ruler")}<span>Size</span></button>`
            : `<button class="add-btn" data-add="${p.id}" aria-label="Add ${esc(p.name)} to cart"${inCart ? " hidden" : ""}>${icon("plus")}<span>Add</span></button>
          <div class="cqty"${inCart ? "" : " hidden"}><button type="button" data-cdec="${p.id}" aria-label="One less ${esc(p.name)}">&minus;</button><b aria-live="polite">${inCart}</b><button type="button" data-cinc="${p.id}" aria-label="One more ${esc(p.name)}">+</button></div>`}
        </div>
      </div></article>`;
  }

  function lineItem(i, later = false) {
    const p = getProduct(i.id);
    if (!p) return "";
    const unit = priceOf(p, i.opt);
    let warn = "";
    if (!later && p.type === "book" && i.qty > 1) warn = `<div class="ci__warn">${i.qty} copies of this book in your cart. <button type="button" data-setq="${esc(i.k)}" data-n="1">Keep 1</button></div>`;
    if (!later && p.id === "sv-cover") {
      const n = qtyOf(Cart.items.filter((x) => getProduct(x.id)?.type === "book"));
      if (n && n !== i.qty) warn = `<div class="ci__warn">Covering ${i.qty} books, but you have ${n} in your cart. <button type="button" data-setq="${esc(i.k)}" data-n="${n}">Cover all ${n}</button></div>`;
    }
    return `<div class="ci" data-ci="${esc(i.k)}">
      <a class="ci__thumb" href="product.html?id=${p.id}" style="--tint:${tintOf(p)}" tabindex="-1" aria-hidden="true">${art(p)}</a>
      <div>
        <div class="ci__name">${esc(p.name)}</div>
        <div class="ci__opt">${i.opt ? `${esc(sizeLabel(i.opt))} · ` : ""}${rs(unit)} each</div>
        <div class="ci__row">
          ${later
            ? `<button class="btn btn--ghost btn--sm" data-from-later="${esc(i.k)}">Move to cart</button>`
            : `<div class="qty qty--sm"><button data-dec="${esc(i.k)}" aria-label="Decrease quantity">&minus;</button><input value="${i.qty}" inputmode="numeric" aria-label="Quantity" data-qty="${esc(i.k)}"><button data-inc="${esc(i.k)}" aria-label="Increase quantity">+</button></div>
               <button class="ci__link" data-later="${esc(i.k)}">Save for later</button>`}
          <button class="ci__link ci__link--rm" data-rm="${esc(i.k)}"${later ? " data-later-list" : ""}>Remove</button>
        </div>
        ${warn}
      </div>
      <div class="ci__price">${rs(unit * i.qty)}</div></div>`;
  }

  /* cart lines grouped by kit, list or uniform set */
  function groupedLines(items) {
    const groups = [];
    items.forEach((i) => { const g = i.grp || ""; let G = groups.find((x) => x.g === g); if (!G) groups.push((G = { g, items: [] })); G.items.push(i); });
    if (groups.length === 1 && !groups[0].g) return items.map((i) => lineItem(i)).join("");
    groups.sort((a, b) => (a.g ? 0 : 1) - (b.g ? 0 : 1));
    return groups.map((G) => `<div class="ci-group"><div class="ci-group__head"><div><strong>${esc(G.g || "Other items")}</strong><small>${qtyOf(G.items)} ${qtyOf(G.items) === 1 ? "item" : "items"} · ${rs(G.items.reduce((s, i) => s + priceOf(getProduct(i.id), i.opt) * i.qty, 0))}</small></div>${G.g ? `<button type="button" class="ci__link ci__link--rm" data-rm-grp="${esc(G.g)}">Remove all</button>` : ""}</div>${G.items.map((i) => lineItem(i)).join("")}</div>`).join("");
  }

  function shipMeter(sub) {
    const left = STORE.freeDeliveryOver - sub;
    const pct = Math.min(100, (sub / STORE.freeDeliveryOver) * 100);
    return `<div class="ship-meter${left <= 0 ? " ship-meter--done" : ""}">${left > 0 ? `Add <strong>${rs(left)}</strong> more for free delivery in Karachi.` : "Your order qualifies for free delivery."}<div class="ship-meter__bar"><i style="width:${pct}%"></i></div></div>`;
  }

  /* cards show a quantity stepper once their product is in the cart */
  function syncCards() {
    $$(".card[data-pid]").forEach((c) => {
      const it = Cart.items.find((x) => x.k === Cart.key(c.dataset.pid, "")), n = it ? it.qty : 0;
      c.classList.toggle("in-cart", n > 0);
      const q = $(".cqty", c), a = $(".add-btn", c);
      if (!q || !a) return;
      q.hidden = !n; a.hidden = !!n; $("b", q).textContent = n;
    });
  }

  function renderCartUI() {
    syncCards();
    $$("[data-count]").forEach((el) => { el.textContent = Cart.count(); el.style.display = Cart.count() ? "" : "none"; });
    const body = $("[data-drawer-body]"), foot = $("[data-drawer-foot]");
    if (body) {
      if (!Cart.items.length) {
        body.innerHTML = `<div class="drawer-empty"><div class="empty__ic">${icon("bag")}</div><h3>Your cart is empty</h3><p>Start with your child's school list and every title is added for you.</p><a class="btn btn--primary" href="school-lists.html">Find my school list</a></div>`;
        foot.innerHTML = "";
      } else {
        const t = totals();
        body.innerHTML = groupedLines(Cart.items);
        foot.innerHTML = `${shipMeter(t.sub)}${discRows(t)}<div class="summary__total"><span>Subtotal</span><span class="price">${rs(t.sub - t.disc - t.bdisc)}</span></div>
          <a class="btn btn--primary btn--block" href="checkout.html">${icon("lock")}Checkout</a><a class="btn btn--ghost btn--block" href="cart.html">View cart</a>`;
      }
    }
    if (page === "cart") renderCartPage();
    if (page === "checkout") renderCheckoutSummary();
  }

  function renderSavedUI() {
    $$("[data-saved-count]").forEach((el) => { el.textContent = Saved.ids.size; el.style.display = Saved.ids.size ? "" : "none"; });
    $$("[data-save]").forEach((b) => b.setAttribute("aria-pressed", Saved.has(b.dataset.save)));
  }

  function bump() { $$("[data-count]").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }); }

  let toastT;
  function toast(msg, withCart = true) {
    const t = $("[data-toast]"); if (!t) return;
    $("[data-toast-msg]").textContent = msg;
    $("button", t).hidden = !withCart;
    t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3200);
  }

  let lastFocus;
  function openDrawer() {
    lastFocus = document.activeElement;
    closeModal();
    $("[data-drawer]").classList.add("open"); $("[data-drawer]").setAttribute("aria-hidden", "false");
    $("[data-scrim]").classList.add("show"); $("[data-toast]").classList.remove("show");
    document.body.style.overflow = "hidden"; lenis?.stop();
    setTimeout(() => $("[data-close-cart]").focus(), 60);
  }
  function closeDrawer() {
    if (!$("[data-drawer]")?.classList.contains("open")) return;
    $("[data-drawer]").classList.remove("open"); $("[data-drawer]").setAttribute("aria-hidden", "true");
    $("[data-scrim]").classList.remove("show"); document.body.style.overflow = ""; lenis?.start();
    lastFocus?.focus?.();
  }
  function openModal(html, variant = "") {
    lastFocus = document.activeElement;
    const box = $("[data-modal-box]");
    box.className = "modal__box" + (variant ? " modal__box--" + variant : "");
    box.innerHTML = `<button class="icon-btn modal__close" data-close-modal aria-label="Close">${icon("x")}</button>` + html;
    wireImages(box);
    requestAnimationFrame(() => $("[data-modal]").classList.add("open"));
    document.body.style.overflow = "hidden"; lenis?.stop();
    setTimeout(() => $(".modal__close", box).focus(), 60);
  }
  function closeModal() {
    if (!$("[data-modal]")?.classList.contains("open")) return;
    $("[data-modal]").classList.remove("open"); document.body.style.overflow = ""; lenis?.start();
    lastFocus?.focus?.();
  }

  const SIZE_ROWS = [["22", "3–4", "22 in", "16 in"], ["24", "4–5", "24 in", "17 in"], ["26", "6–7", "26 in", "19 in"], ["28", "8–9", "28 in", "21 in"], ["30", "9–10", "30 in", "22 in"], ["32", "11–12", "32 in", "24 in"], ["34", "12–13", "34 in", "25 in"], ["36", "14–15", "36 in", "27 in"], ["38", "15+", "38 in", "28 in"]];
  function sizeChart() {
    openModal(`<h3>Uniform size guide</h3>${sizeFinderHTML()}<p class="note" style="margin-top:6px">Tops are sized by chest width in inches, bottoms by waist. Between sizes, take the larger one; hems are altered free within 7 days.</p>
      <table><thead><tr><th>Size</th><th>Age (approx.)</th><th>Chest</th><th>Length</th></tr></thead><tbody>
      ${SIZE_ROWS.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
    wireSizeFinders($("[data-modal-box]"));
  }

  /* -------------------------------------------- flip-open "look inside" */
  function openBook(p) {
    const s = SUBJECTS[p.subj], cl = getClass(p.classId);
    const ch = CHAPTERS[p.subj] || CHAPTERS.eng;
    const rtl = p.subj === "urdu" || p.subj === "sindhi";
    return `<div class="ob" data-ob style="--c:${s.c[0]};--c3:${s.c[2]}">
      <div class="ob__right">
        <p class="ob__kicker">Contents</p>
        <ol class="ob__toc"${rtl ? ' dir="rtl"' : ""}>${ch.map((c, i) => `<li style="--i:${i}"><span>${esc(c)}</span><i>${i * 14 + 3}</i></li>`).join("")}</ol>
        <p class="ob__note">Sample contents. Your copy follows the school's prescribed edition.</p>
      </div>
      <div class="ob__cover">
        ${cover(p, "ob__front")}
        <div class="ob__inside">
          <img src="assets/mark-navy.png" alt="" width="54" height="52">
          <p>This book belongs to</p><span class="ob__line"></span>
          <p>${esc(cl.name)}, section</p><span class="ob__line"></span>
          <small>${esc(STORE.name)}, ${esc(STORE.area.split(",")[0])}</small>
        </div>
      </div>
    </div>`;
  }

  function quickView(id, inside = false) {
    const p = getProduct(id);
    if (!p) return;
    let size = p.sizes && p.sizes.length === 1 ? p.sizes[0] : "";
    const meta = p.type === "book" ? `${p.subject}, ${getClass(p.classId).name}` : p.type === "uniform" ? getSchool(p.school).name : p.sub || "Bags & bottles";
    const stage = photoOf(p) && !inside
      ? `<div class="qv__stage qv__stage--photo" style="--tint:${tintOf(p)}">${art(p, "lg")}</div>`
      : p.type === "book"
      ? `<div class="qv__stage" style="--tint:${tintOf(p)}">${openBook(p)}<button class="btn btn--ghost btn--sm qv__flip" data-ob-toggle>${icon("open")}Close the book</button></div>`
      : `<div class="qv__stage" style="--tint:${tintOf(p)}"><div class="qv__art">${svgArt(p)}</div></div>`;
    openModal(`<div class="qv">${stage}
      <div class="qv__info">
        <p class="pdp__meta">${esc(meta)}</p>
        <h3 class="qv__title">${esc(p.name)}</h3>
        <div class="pdp__price"><span class="price">${rs(p.price)}</span>${p.was ? `<s class="note">${rs(p.was)}</s>` : ""}<span class="stock">In stock</span></div>
        <p class="qv__desc">${esc(p.desc)}</p>
        ${p.sizes ? `<div class="opt-group"><div class="opt-group__head"><span data-qv-size-label>Size${size ? `: ${size}` : ""}</span>${p.type === "uniform" ? '<button type="button" data-sizechart>Size guide</button>' : ""}</div>
          <div class="sizes">${p.sizes.map((s) => `<button class="size" data-qv-size="${s}" aria-pressed="${s === size}">${s}</button>`).join("")}</div>
          <p class="field__err" data-qv-err style="margin-top:8px">Choose a size to add this to your cart.</p></div>` : ""}
        <div class="buy-row">
          <button class="btn btn--primary" data-qv-add>${icon("cart")}Add to cart</button>
          <button class="btn btn--ghost tool-wide" data-save="${p.id}" aria-pressed="${Saved.has(p.id)}" aria-label="Save">${icon("heart")}</button>
        </div>
        <a class="text-link qv__more" href="product.html?id=${p.id}">See full details${icon("arrow")}</a>
      </div></div>`, "wide");
    const box = $("[data-modal-box]");
    const ob = $("[data-ob]", box);
    if (ob) setTimeout(() => ob.classList.add("open"), reduced ? 0 : 450);
    $("[data-ob-toggle]", box)?.addEventListener("click", (e) => { const open = ob.classList.toggle("open"); e.currentTarget.innerHTML = icon("open") + (open ? "Close the book" : "Look inside"); });
    $("[data-sizechart]", box)?.addEventListener("click", sizeChart);
    $$("[data-qv-size]", box).forEach((b) => b.addEventListener("click", () => {
      size = b.dataset.qvSize; $$("[data-qv-size]", box).forEach((x) => x.setAttribute("aria-pressed", x === b));
      $("[data-qv-size-label]", box).textContent = `Size: ${size}`; $("[data-qv-err]", box).style.display = "none";
    }));
    $("[data-qv-add]", box).addEventListener("click", (e) => {
      if (p.sizes && !size) { const er = $("[data-qv-err]", box); er.style.display = "block"; er.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], 300); return; }
      flyToCart($(".qv__stage .ob__front, .qv__art, .qv__stage .art", box));
      Cart.add(p.id, 1, p.sizes ? size : "");
      const b = e.currentTarget; b.classList.add("is-done"); b.innerHTML = icon("check") + "Added";
      setTimeout(closeModal, 700);
    });
  }

  /* ------------------------------------------------------------ search */
  const SYN = [["math", "maths", "mathematics"], ["bag", "bags", "backpack", "backpacks", "trolley"], ["register", "registers", "copy", "copies", "notebook", "notebooks"],
    ["book", "books", "textbook", "textbooks"], ["sci", "science"], ["eng", "english"], ["uniform", "uniforms"], ["sst", "social"], ["isl", "islamiat", "islamiyat", "islamic"],
    ["comp", "computer", "computers"], ["pak", "pakistan"], ["pencil", "pencils"], ["pen", "pens"], ["colour", "colours", "color", "colors"], ["bottle", "bottles"], ["tie", "ties"], ["sweater", "sweaters", "jersey"]];
  const CLASS_WORDS = { playgroup: "pg", pg: "pg", nursery: "n", kg: "kg", kindergarten: "kg", prep: "kg" };
  const hayCache = new Map();
  function hay(p) {
    if (hayCache.has(p.id)) return hayCache.get(p.id);
    const sc = p.school ? getSchool(p.school) : null, cl = p.classId ? getClass(p.classId) : null;
    const h = [p.name, p.subject, p.title, p.sub, p.author, p.cat, p.type, p.type === "novel" ? "story fiction reading" : "", sc?.name, sc?.short, cl?.name, BOOK_PUBLISHERS[p.subj]].filter(Boolean).join(" ").toLowerCase();
    hayCache.set(p.id, h); return h;
  }
  function searchProducts(q) {
    const words = q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    let cls = "", nextIsClass = false; const terms = [];
    words.forEach((w) => {
      if (w === "class" || w === "grade") { nextIsClass = true; return; }
      if (CLASS_WORDS[w]) { cls = CLASS_WORDS[w]; nextIsClass = false; return; }
      if (/^\d{1,2}$/.test(w) && Number(w) <= 10 && (nextIsClass || words.length > 1)) { cls = w; nextIsClass = false; return; }
      nextIsClass = false; terms.push(w);
    });
    const alts = terms.map((t) => SYN.find((g) => g.includes(t)) || (t.length > 3 && t.endsWith("s") ? [t, t.slice(0, -1)] : [t]));
    return PRODUCTS.filter((p) => p.cat !== "service"
      && (!cls || (p.type === "book" && p.classId === cls))
      && alts.every((g) => g.some((t) => hay(p).includes(t))))
      .sort((a, b) => (terms.length && cls === "" ? 0 : (b.type === "book") - (a.type === "book")));
  }

  /* -------------------------------------------------- search suggestions */
  function wireSuggest() {
    $$("[data-suggest]").forEach((inp) => {
      const box = inp.parentElement.querySelector("[data-suggest-box]");
      inp.addEventListener("input", () => {
        const q = inp.value.trim().toLowerCase();
        if (q.length < 2) { box.hidden = true; return; }
        const hits = searchProducts(q).slice(0, 6);
        box.innerHTML = hits.length
          ? hits.map((p) => `<a href="product.html?id=${p.id}"><span class="suggest__thumb" style="--tint:${tintOf(p)}">${art(p)}</span><span>${esc(p.name)}<small>${rs(p.price)}</small></span></a>`).join("") + `<a class="suggest__all" href="shop.html?q=${encodeURIComponent(inp.value.trim())}">See all results for "${esc(inp.value.trim())}"</a>`
          : `<p class="suggest__none">No matches. Try a subject, class or school name.</p>`;
        box.hidden = false;
      });
      inp.addEventListener("blur", () => setTimeout(() => (box.hidden = true), 160));
      inp.addEventListener("focus", () => { if (inp.value.trim().length >= 2) inp.dispatchEvent(new Event("input")); });
    });
  }

  /* ---------------------------------------------- shared: numbers & words */
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  function tween(el, from, to, fmt = rs, dur = 650) {
    if (reduced || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (now) => { const k = Math.min(1, (now - t0) / dur); el.textContent = fmt(from + (to - from) * easeOut(k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  /* headings rise in word by word the first time they're seen */
  function splitWords(root = document) {
    $$(".wsplit:not([data-split])", root).forEach((el) => {
      const text = el.textContent.trim().replace(/\s+/g, " ");
      el.dataset.split = "1"; el.setAttribute("aria-label", text);
      el.innerHTML = text.split(" ").map((w, i) => `<span class="w" aria-hidden="true"><span style="--wi:${i}">${esc(w)}</span></span>`).join(" ");
    });
  }
  /* count-up figures */
  function wireCounts(root = document) {
    const run = (el) => tween(el, 0, Number(el.dataset.countup), (v) => Math.round(v).toLocaleString("en-PK"), 1200);
    const els = $$("[data-countup]", root);
    if (!io || reduced) { els.forEach((el) => (el.textContent = Number(el.dataset.countup).toLocaleString("en-PK"))); return; }
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); o.unobserve(e.target); } }), { threshold: 0.6 });
    els.forEach((el) => o.observe(el));
  }
  /* scroll work batched into one frame */
  const onScrollFrame = (fn) => { let tick = false; const go = () => { tick = false; fn(); }; addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(go); } }, { passive: true }); addEventListener("resize", fn); fn(); };

  /* ------------------------------------------------------- size finder */
  function sizeFinderHTML(age = 8) {
    return `<div class="sizefind" data-sizefind>
      <div class="sizefind__head"><strong>Find their size</strong><span><b data-sf-age>${age}</b> years old</span></div>
      <input type="range" min="3" max="16" value="${age}" data-sf-range aria-label="Child's age">
      <div class="sizefind__out"><div><small>Size</small><b data-sf-size>28</b></div><div><small>Chest</small><b data-sf-chest>28 in</b></div><div><small>Length</small><b data-sf-len>21 in</b></div></div>
      <p class="note">Between sizes? Take the larger one. Hems are altered free within 7 days.</p></div>`;
  }
  function wireSizeFinders(root = document) {
    $$("[data-sizefind]:not([data-wired])", root).forEach((box) => {
      box.dataset.wired = "1";
      const range = $("[data-sf-range]", box);
      const out = { size: $("[data-sf-size]", box), chest: $("[data-sf-chest]", box), len: $("[data-sf-len]", box) };
      let last = "";
      const update = () => {
        const age = Number(range.value);
        $("[data-sf-age]", box).textContent = age;
        const row = [...SIZE_ROWS].reverse().find((r) => parseInt(r[1]) <= age) || SIZE_ROWS[0];
        range.style.setProperty("--p", ((age - 3) / 13) * 100 + "%");
        if (row[0] === last) return; last = row[0];
        out.size.textContent = row[0]; out.chest.textContent = row[2]; out.len.textContent = row[3];
        if (!reduced) Object.values(out).forEach((el) => el.animate([{ transform: "translateY(6px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 280, easing: "cubic-bezier(.22,1,.36,1)" }));
      };
      range.addEventListener("input", update); update();
    });
  }

  /* --------------------------------------------------------- page: home */
  function fillSelect(sel, items, ph) {
    sel.innerHTML = `<option value="">${ph}</option>` + items.map((i) => `<option value="${i.id}">${esc(i.name)}</option>`).join("");
  }

  function roomHTML(stage) {
    const bays = CLASSES.filter((c) => c.stage === stage).map((cl, i) => bay(cl, stage.length * 31 + i));
    if (bays.length % 2) bays.push(`<div class="bay bay--note"><div class="bay__books"><a class="room-note" href="school-lists.html"><strong>Have your school's list?</strong><span>Load every title for the class in one step.</span>${icon("arrow")}</a></div><div class="shelf"></div></div>`);
    return bays.join("");
  }

  /* hero kit finder: school + class chips build a priced kit */
  function kitLines(sid, cid) {
    const L = buildList(sid, cid), cl = getClass(cid);
    const bagId = cl.stage === "early" || cl.stage === "primary" ? "bg-junior" : "bg-senior";
    const lines = [
      { k: "books", label: "Textbooks", sub: `${L.books.length} titles, 2026–27 edition`, items: L.books, on: true },
      { k: "copies", label: "Registers and copies", sub: `${L.notebooks.reduce((s, n) => s + n.qty, 0)} items`, items: L.notebooks, on: true },
      { k: "stat", label: "Stationery essentials", sub: `${L.stationery.length} items`, items: L.stationery, on: true },
      { k: "uni", label: "Uniform set", sub: "Shirt and trousers, size confirmed by phone", items: [{ id: `un-${sid}-shirt`, qty: 1, opt: "To confirm" }, { id: `un-${sid}-trouser`, qty: 1, opt: "To confirm" }], on: false },
      { k: "bag", label: "School bag", sub: getProduct(bagId).name, items: [{ id: bagId, qty: 1 }], on: false },
    ];
    lines.forEach((l) => (l.price = l.items.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0)));
    return lines;
  }
  function wireKit() {
    const box = $("#kit"); if (!box) return;
    const child = store.get("asif_children", [])[0], last = store.get("asif_last_list", null);
    let sid = last?.school || child?.school || "ggs", cid = last?.cls || child?.cls || "5", lines = [], shown = 0;
    const kidIn = $("#kit-kid"); if (kidIn) kidIn.value = last?.name || "";
    const remember = () => { store.set("asif_last_list", { school: sid, cls: cid, name: kidIn?.value.trim() || "" }); document.dispatchEvent(new CustomEvent("kit:change", { detail: { sid, cid } })); };
    const off = new Set(["uni", "bag"]);
    const total = () => lines.filter((l) => !off.has(l.k)).reduce((s, l) => s + l.price, 0);
    function chips() {
      $("#kit-schools").innerHTML = SCHOOLS.map((s) => `<button class="kchip" data-ks="${s.id}" aria-pressed="${s.id === sid}"><span class="crest crest--xs" style="background:${s.color}">${s.short}</span>${esc(s.name)}</button>`).join("");
      $("#kit-classes").innerHTML = CLASSES.map((c) => `<button class="kdot" data-kc="${c.id}" aria-pressed="${c.id === cid}" aria-label="${esc(c.name)}">${c.n}</button>`).join("");
    }
    function body(animate) {
      const sc = getSchool(sid), cl = getClass(cid);
      lines = kitLines(sid, cid);
      const count = lines.slice(0, 3).reduce((s, l) => s + l.items.reduce((a, i) => a + i.qty, 0), 0);
      const html = `<div class="kit__who"><span class="crest" style="background:${sc.color}">${sc.short}</span><div><strong>${esc(cl.name)} kit</strong><small>${esc(sc.name)} · ${count} items</small></div>
          <div class="kit__books">${buildList(sid, cid).books.slice(0, 3).map((b) => `<span class="kit__ph">${art(getProduct(b.id))}</span>`).join("")}</div></div>
        <ul class="kit__lines">${lines.map((l) => `<li><label class="kit__line"><input type="checkbox" data-kl="${l.k}" ${off.has(l.k) ? "" : "checked"}><span><strong>${l.label}</strong><small>${esc(l.sub)}</small></span><b>${rs(l.price)}</b></label></li>`).join("")}</ul>
        <div class="kit__total"><span>Kit total</span><strong class="price" data-kit-total>${rs(shown)}</strong></div>
        <div class="kit__actions"><button class="btn btn--primary btn--block" data-kit-add>${icon("cart")}Add kit to cart</button><a class="text-link" href="school-lists.html?school=${sid}&class=${cid}">Review every title${icon("arrow")}</a></div>`;
      const target = $("#kit-body");
      const done = () => { const t = total(); tween($("[data-kit-total]", target), shown, t); shown = t; };
      if (animate) swap(target, html, done); else { target.innerHTML = html; done(); }
    }
    box.addEventListener("click", (e) => {
      const s = e.target.closest("[data-ks]"), c = e.target.closest("[data-kc]");
      if (s && s.dataset.ks !== sid) { sid = s.dataset.ks; chips(); body(true); remember(); }
      if (c && c.dataset.kc !== cid) { cid = c.dataset.kc; chips(); body(true); remember(); }
      if (e.target.closest("[data-kit-add]")) {
        const items = lines.filter((l) => !off.has(l.k)).flatMap((l) => l.items.map((i) => ({ id: i.id, qty: i.qty, opt: i.opt || "" })));
        const kid = kidIn?.value.trim() || "";
        remember();
        addSet(items, `${kid ? kid + " · " : ""}${getSchool(sid).short} ${getClass(cid).name} kit`, (added) => {
          flyToCart($(".kit__books", box));
          toast(`${qtyOf(added)} items from the ${getClass(cid).name} kit added`);
          setTimeout(openDrawer, reduced ? 0 : 650);
        });
      }
    });
    kidIn?.addEventListener("change", remember);
    box.addEventListener("change", (e) => {
      const k = e.target.dataset.kl; if (!k) return;
      e.target.checked ? off.delete(k) : off.add(k);
      const t = total(); tween($("[data-kit-total]", box), shown, t); shown = t;
    });
    chips(); body(false);
  }

  /* the four counters as tabs: the photo deck shuffles and the panel swaps */
  function wireExplore() {
    const sec = $("#counters"); if (!sec) return;
    const figs = $$(".xfig", sec), panels = $$(".xpanel", sec), tabs = $("#x-tabs");
    let cur = 0;
    const set = (i) => {
      if (i === cur) return;
      const back = i < cur; cur = i;
      figs.forEach((f, k) => { const d = (k - i + figs.length) % figs.length; f.style.setProperty("--d", d); f.classList.toggle("is-on", d === 0); f.classList.toggle("is-past", false); });
      panels.forEach((p, k) => {
        const on = k === i; p.hidden = !on;
        if (on && !reduced) p.animate([{ opacity: 0, transform: `translate3d(${back ? -18 : 18}px,0,0)` }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
      });
      sec.dataset.tone = panels[i].dataset.tone;
    };
    figs.forEach((f, k) => f.style.setProperty("--d", k));
    wireTabs(tabs, (t) => set(Number(t.dataset.x)));
    /* arrow keys move between counters, as tabs should */
    tabs.addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key)) return;
      const all = $$('[role="tab"]', tabs), at = all.indexOf(document.activeElement);
      const next = all[(at + (e.key === "ArrowRight" ? 1 : -1) + all.length) % all.length];
      next.focus(); next.click();
    });
    /* swipe the photo on phones */
    let sx = null; const deck = $(".xdeck", sec);
    deck.addEventListener("pointerdown", (e) => (sx = e.clientX));
    deck.addEventListener("pointerup", (e) => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 40) $$('[role="tab"]', tabs)[(cur + (dx < 0 ? 1 : -1) + 4) % 4].click(); });
  }

  /* best sellers or the full shelves; the bookcase is only built when first opened */
  function wireBrowse() {
    const seg = $("#browse-seg"); if (!seg) return;
    let roomReady = false;
    const openShelves = () => {
      if (roomReady) return; roomReady = true;
      const room = $("#room-case");
      room.innerHTML = roomHTML("primary"); wireImages(room);
      wireTabs($("#room-tabs"), (t) => swap(room, roomHTML(t.dataset.stage)));
    };
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("[data-browse]"); if (!b || b.getAttribute("aria-selected") === "true") return;
      $$("[data-browse]", seg).forEach((x) => x.setAttribute("aria-selected", x === b));
      $$(".bpanel").forEach((pn) => { const on = pn.id === "bp-" + b.dataset.browse; pn.hidden = !on; if (on && !reduced) pn.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" }); });
      if (b.dataset.browse === "shelves") openShelves(); else tabPill($("#best-tabs"));
    });
  }

  /* school names drift with the scroll, rows in opposite directions */
  function wireNames() {
    const band = $("#names"); if (!band) return;
    band.querySelectorAll(".names__row").forEach((row, i) => {
      const names = (i ? SCHOOLS.slice(3) : SCHOOLS.slice(0, 3)).concat(i ? SCHOOLS.slice(0, 2) : SCHOOLS.slice(3, 5));
      const one = names.map((s, k) => `<span class="${k % 2 ? "is-outline" : ""}">${esc(s.name)}</span><img src="assets/mark-yellow.png" alt="" width="40" height="38">`).join("");
      row.innerHTML = one + one;
    });
    if (reduced) return;
    const rows = $$(".names__row", band);
    onScrollFrame(() => {
      const r = band.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const p = (innerHeight - r.top) / (innerHeight + r.height);
      rows.forEach((row, i) => (row.style.transform = `translate3d(${i % 2 ? -32 + p * 22 : -10 - p * 22}%, 0, 0)`));
    });
  }

  /* bundle builder: one item per counter, the saving climbs as you add */
  function wireBundle() {
    const box = $("#builder"); if (!box) return;
    let pick = {};
    const last = store.get("asif_last_list", null) || {};
    let bsid = last.school || "ggs", bcid = last.cls || "5";
    const cats = () => BUNDLE_CATS.map((c) => c.k === "books" ? { ...c, ids: buildList(bsid, bcid).books.slice(0, 4).map((b) => b.id) }
      : c.k === "uniforms" ? { ...c, ids: ["shirt", "trouser", "sweater", "tie"].map((k) => `un-${bsid}-${k}`) } : c);
    const drawSteps = () => { $("#builder-steps").innerHTML = cats().map((c, ci) => `<div class="bstep reveal" style="--i:${ci}" data-acc="${ci}"><div class="bstep__head"><span class="bstep__n">${ci + 1}</span><h3>${esc(c.title)}</h3><span class="bstep__state" data-bstate="${c.k}">Pick one</span></div>
      <div class="bstep__opts">${c.ids.map((id) => { const p = getProduct(id); return `<button class="bopt" data-bopt="${id}" data-cat="${c.k}" aria-pressed="false"><span class="bopt__art" style="--tint:${tintOf(p)}">${art(p)}</span><span class="bopt__name">${esc(p.name)}</span><span class="bopt__price">${p.step ? "From " : ""}${rs(p.price)}</span><span class="bopt__tick">${icon("check")}</span></button>`; }).join("")}</div></div>`).join("");
      $("#builder-for").innerHTML = `Showing books and uniform for <strong>${esc(getSchool(bsid).name)}, ${esc(getClass(bcid).name)}</strong>. <a class="text-link" href="#kit-start">Change</a>`;
      $$(".bstep", box).forEach((el) => el.classList.add("in"));
    };
    drawSteps();
    document.addEventListener("kit:change", (e) => { bsid = e.detail.sid; bcid = e.detail.cid; pick = {}; drawSteps(); summary(); });
    const tiers = BUNDLE_TIERS.slice(1);
    $("#builder-tiers").innerHTML = tiers.map((t, i) => `<li data-tier="${i + 1}"><b>${t}%</b><small>${i + 1} ${i ? "items" : "item"}</small></li>`).join("");
    let shownTotal = 0, lastCount = 0;
    const ring = $("#builder-ring"), RING = 2 * Math.PI * 52;
    function summary() {
      const ids = Object.values(pick);
      const count = ids.length, pct = BUNDLE_TIERS[count] || 0;
      const sub = ids.reduce((s, id) => s + getProduct(id).price, 0);
      const save = Math.round(sub * pct / 100);
      $("#builder-fill").style.transform = `scaleX(${count / 4})`;
      if (ring) ring.style.strokeDashoffset = (RING * (1 - pct / 10)).toFixed(1) + "px";
      BUNDLE_CATS.forEach((c) => { const el = $(`[data-bstate="${c.k}"]`, box); el.textContent = pick[c.k] ? "Added" : "Pick one"; el.classList.toggle("is-on", !!pick[c.k]); });
      const big = $("#builder-big"); if (big) { big.textContent = `${pct}%`; if (count > lastCount && pct && !reduced) big.animate([{ transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 500, easing: "cubic-bezier(.34,1.56,.64,1)" }); }
      box.classList.toggle("is-max", count >= 4); lastCount = count;
      $$("#builder-tiers li").forEach((li) => li.classList.toggle("is-on", Number(li.dataset.tier) <= count));
      $("#builder-list").innerHTML = ids.length ? ids.map((id) => { const p = getProduct(id); return `<li><span class="bsum__thumb" style="--tint:${tintOf(p)}">${art(p)}</span><span>${esc(p.name)}</span><b>${rs(p.price)}</b></li>`; }).join("") : `<li class="bsum__empty">Pick one item from each counter to unlock the bundle saving.</li>`;
      $("#builder-count").textContent = `${count} of 4 counters`;
      $("#builder-sub").textContent = rs(sub);
      $("#builder-save").textContent = save ? `−${rs(save)}` : rs(0);
      $("#builder-pct").textContent = `${pct}%`;
      const next = BUNDLE_TIERS[count + 1];
      $("#builder-hint").textContent = count >= 4 ? "Top saving unlocked." : count && next > pct ? `Add one more counter to save ${next}%.` : count ? "Add another counter to start saving." : "";
      const tot = sub - save; tween($("#builder-total"), shownTotal, tot); shownTotal = tot;
      $("#builder-add").disabled = !count;
    }
    box.addEventListener("click", (e) => {
      const b = e.target.closest("[data-bopt]");
      if (b) {
        const cat = b.dataset.cat, id = b.dataset.bopt;
        pick[cat] = pick[cat] === id ? undefined : id;
        if (!pick[cat]) delete pick[cat];
        $$(`[data-cat="${cat}"]`, box).forEach((x) => x.setAttribute("aria-pressed", x.dataset.bopt === pick[cat]));
        if (pick[cat]) flyTo($(".bopt__art", b), $(".bsum__orb", box));
        summary(); return;
      }
      if (e.target.closest("#builder-add")) {
        const ids = Object.values(pick); if (!ids.length) return;
        const items = ids.map((id) => { const p = getProduct(id); return { id, qty: 1, opt: p.sizes ? (p.sizes.length === 1 ? p.sizes[0] : "To confirm") : "" }; });
        addSet(items, "Back-to-school bundle", () => {
          Cart.bundle = { ids, pct: BUNDLE_TIERS[ids.length] || 0 }; Cart.save();
          flyToCart($("#builder-list"));
          toast(`Bundle of ${ids.length} added${Cart.bundle.pct ? `, saving ${Cart.bundle.pct}%` : ""}`);
          setTimeout(openDrawer, reduced ? 0 : 650);
        });
      }
    });
    summary();
  }

  /* hero: four real photographs (books, uniforms, stationery, novels), each with a slow
     film-style camera move. The photo is shown nearly whole; a blurred copy of it fills
     the space behind the text. Swipe, drag, arrows or the dots change scene. */
  function wireHero() {
    const sec = $("#hero"), box = $("#cine-slides"); if (!sec || !box) return;
    const src = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72&w=${w}`;
    const r = rng(11);
    const dust = Array.from({ length: 10 }, () => `<i style="left:${(r() * 100).toFixed(1)}%;top:${(15 + r() * 65).toFixed(1)}%;--s:${(2 + r() * 3).toFixed(1)}px;--t:${(10 + r() * 9).toFixed(1)}s;--dl:${(-r() * 10).toFixed(1)}s"></i>`).join("");
    /* visitors who asked for less motion or less data get the still photographs */
    const still = reduced || !!(navigator.connection && navigator.connection.saveData);
    /* phones and tablets (iPhone and iPad above all) keep a single clip loaded at a time: several decoders at once can crash the tab */
    const lean = !finePointer;
    box.innerHTML = HERO_SLIDES.map((sl, i) => `<article class="cslide${i === 0 ? " is-on" : ""}${sl.video && !still ? " cslide--video" : ""}" data-k="${sl.k}" id="cs-${i}" role="tabpanel" aria-roledescription="slide" aria-label="${i + 1} of ${HERO_SLIDES.length}: ${esc(sl.title)}"${i ? " inert" : ""}>
        <div class="cslide__film">${sl.video && !still
          ? `${sl.poster ? `<img class="film__bg" src="${esc(sl.poster)}" alt="" decoding="async">` : ""}<video class="film__main" muted loop playsinline disablepictureinpicture aria-hidden="true" tabindex="-1" webkit-playsinline preload="${i === 0 && !lean ? "auto" : "none"}"${sl.poster ? ` poster="${esc(sl.poster)}"` : ""} ${lean ? "data-src" : "src"}="${esc(sl.video)}" data-still="${esc(sl.still || "")}" style="--pos:${sl.vpos || "60% 50%"};--mpos:${sl.mpos || "60% 50%"}"></video>`
          : `<img class="film__bg" src="${src(sl.photo, 300)}" alt="" ${i === 0 ? "" : 'loading="lazy"'} decoding="async"><img class="film__main" src="${src(sl.photo, 1600)}" srcset="${src(sl.photo, 800)} 800w, ${src(sl.photo, 1600)} 1600w, ${src(sl.photo, 2400)} 2400w" sizes="(max-width: 860px) 100vw, 70vw" alt="" style="object-position:${sl.pos || "50% 50%"}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`}</div>
        <div class="cslide__light" aria-hidden="true"></div><div class="cslide__dust" aria-hidden="true">${dust}</div>
        <div class="wrap cslide__grid">
          <div class="ccard"><p class="ccard__kicker">${esc(sl.kicker)}</p><h2 class="ccard__title">${esc(sl.title)}</h2><p class="ccard__line">${esc(sl.line)}</p>
            <div class="ccard__ctas"><a class="btn btn--primary" href="${sl.cta[1]}">${esc(sl.cta[0])}</a><a class="btn btn--glass" href="${sl.alt[1]}">${esc(sl.alt[0])}</a></div></div>
        </div>
      </article>`).join("");
    const dots = $("#cine-dots");
    dots.innerHTML = HERO_SLIDES.map((sl, i) => `<button type="button" role="tab" aria-controls="cs-${i}" aria-selected="${i === 0}" data-cine-go="${i}"${sl.video && !still && sl.dur ? ` style="--dur:${sl.dur}s"` : ""}><span>${esc(sl.title)}</span><i></i></button>`).join("");
    const slides = $$(".cslide", box), dotBtns = $$("button", dots), n = slides.length;
    let cur = 0, lock = false;
    /* only the scene on screen plays; each clip starts from its first frame, and the next one is fetched ahead */
    const vids = slides.map((sl) => $("video", sl));
    const canPlay = () => !sec.classList.contains("is-stopped") && !sec.classList.contains("is-off") && !document.hidden;
    vids.forEach((v) => { if (!v) return; v.muted = true; v.defaultMuted = true; v.playsInline = true; v.setAttribute("muted", ""); });
    let blocked = false;
    const release = (v) => { if (lean && v.getAttribute("src")) { v.removeAttribute("src"); v.load(); } };
    const playVideo = (i, restart = true) => vids.forEach((v, k) => {
      if (!v) return;
      if (k !== i) { v.pause(); if (lean) setTimeout(() => { if (cur !== k) release(v); }, 1400); return; }
      if (!canPlay()) { v.pause(); return; }
      if (!v.getAttribute("src")) v.src = v.dataset.src;
      else if (restart) { try { v.currentTime = 0; } catch (e) { /* not loaded yet */ } }
      const pr = v.play();
      /* autoplay refused (Low Power Mode, data saver): show a finished frame instead of the dark opening one */
      if (pr && pr.catch) pr.catch((err) => { if (err && err.name === "NotAllowedError") { blocked = true; if (v.dataset.still) v.poster = v.dataset.still; } });
    });
    /* the first touch is allowed to start playback where autoplay was refused */
    document.addEventListener("touchend", () => { if (blocked) { blocked = false; playVideo(cur, false); } }, { passive: true });
    const warm = (i) => { if (lean) return; const v = vids[(i + 1) % n]; if (v && v.preload === "none") v.preload = "auto"; };
    if (vids[0]) { let w = false; const first = () => { if (!w) { w = true; warm(0); } }; vids[0].addEventListener("canplaythrough", first, { once: true }); setTimeout(first, 4000); }
    function go(i, dir) {
      i = (i + n) % n; if (i === cur || lock) return;
      lock = true; setTimeout(() => (lock = false), 650);
      const from = slides[cur], to = slides[i];
      sec.style.setProperty("--dir", dir);
      from.classList.remove("is-on"); from.classList.add("is-out"); from.setAttribute("inert", "");
      to.classList.remove("is-out"); to.removeAttribute("inert");
      void to.offsetWidth; to.classList.add("is-on");
      setTimeout(() => from.classList.remove("is-out"), 1300);
      dotBtns.forEach((b, k) => b.setAttribute("aria-selected", k === i));
      cur = i; playVideo(i); warm(i);
    }
    const step = (d) => go(cur + d, d);
    playVideo(0);
    sec.addEventListener("click", (e) => {
      const a = e.target.closest("[data-cine]"); if (a) { step(Number(a.dataset.cine)); return; }
      const d = e.target.closest("[data-cine-go]"); if (d) { const i = Number(d.dataset.cineGo); go(i, i > cur ? 1 : -1); return; }
      const p = e.target.closest("[data-cine-pause]"); if (p) { const on = p.getAttribute("aria-pressed") !== "true"; p.setAttribute("aria-pressed", on); p.setAttribute("aria-label", on ? "Play the scenes" : "Pause the scenes"); sec.classList.toggle("is-stopped", on); playVideo(cur, false); }
    });
    /* the active dot fills up; when it's full the next scene comes in. Pausing the CSS pauses the timer too. */
    dots.addEventListener("animationend", (e) => { if (e.animationName === "cprog") step(1); });
    sec.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(1); else if (e.key === "ArrowLeft") step(-1); });
    /* swipe with a finger, or drag with the mouse */
    let sx = 0, sy = 0, dx = 0, drag = false, down = false;
    sec.addEventListener("pointerdown", (e) => { if (e.target.closest("a, button, input")) return; down = true; drag = false; sx = e.clientX; sy = e.clientY; dx = 0; });
    sec.addEventListener("pointermove", (e) => {
      if (!down) return;
      dx = e.clientX - sx;
      if (!drag && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(e.clientY - sy)) { drag = true; sec.classList.add("is-dragging"); }
      if (drag) slides[cur].style.setProperty("--drag", (dx * 0.35).toFixed(0) + "px");
    });
    const end = () => {
      if (!down) return; down = false;
      slides[cur].style.setProperty("--drag", "0px"); sec.classList.remove("is-dragging");
      if (drag && Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
    };
    sec.addEventListener("pointerup", end); sec.addEventListener("pointercancel", end); sec.addEventListener("pointerleave", end);
    sec.addEventListener("dragstart", (e) => e.preventDefault());
    /* rest while off screen, while the tab is hidden, and while the pointer or keyboard focus is on the text card */
    if (io) new IntersectionObserver(([e]) => { sec.classList.toggle("is-off", !e.isIntersecting); document.body.classList.toggle("hero-on", e.isIntersecting); playVideo(cur, false); }, { threshold: 0.15 }).observe(sec);
    document.addEventListener("visibilitychange", () => { sec.classList.toggle("is-hidden", document.hidden); playVideo(cur, false); });
    sec.addEventListener("focusin", () => sec.classList.add("is-held")); sec.addEventListener("focusout", () => sec.classList.remove("is-held"));
  }

  function pageHome() {
    wireHero();
    wireKit();
    wireNames();
    wireExplore();
    wireBundle();
    wireBrowse();

    /* department tiles lean toward the pointer */
    const onSale = PRODUCTS.filter((p) => p.was && p.cat !== "service");
    const saleBox = $("[data-offer-sale]");
    if (saleBox && onSale.length) saleBox.textContent = `${onSale.length} items reduced right now, save up to ${rs(Math.max(...onSale.map((p) => p.was - p.price)))}.`;
    $$("[data-offer-art]").forEach((el) => (el.innerHTML = art(getProduct(el.dataset.offerArt), "lg")));
    $$("[data-offer-books]").forEach((el) => (el.innerHTML = ["bk-eng-4", "bk-math-5", "bk-sci-7"].map((id) => book3d(getProduct(id))).join("")));
    $$("[data-su-books]").forEach((el) => (el.innerHTML = ["bk-phy-9", "bk-urdu-3", "bk-eng-kg"].map((id) => `<span>${art(getProduct(id))}</span>`).join("")));

    if (finePointer && !reduced) $$(".dept, .offer").forEach((t) => {
      t.addEventListener("pointermove", (e) => { const r = t.getBoundingClientRect(); t.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2) + "deg"); t.style.setProperty("--rx", ((0.5 - (e.clientY - r.top) / r.height) * 8).toFixed(2) + "deg"); });
      t.addEventListener("pointerleave", () => { t.style.setProperty("--ry", "0deg"); t.style.setProperty("--rx", "0deg"); });
    });
    const deptCount = { books: "book", uniforms: "uniform", stationery: "stationery", bags: "bag" };
    $$("[data-dept-count]").forEach((el) => { const n = PRODUCTS.filter((p) => p.type === deptCount[el.dataset.deptCount]).length; el.textContent = el.closest(".tab") ? n : `${n} products`; });
    if ($("#x-tabs")) tabPill($("#x-tabs"));

    /* the how-it-works line draws itself as you scroll */
    const flow = $(".flow");
    const flowBar = flow && $(".flow__line i", flow);
    if (flowBar) onScrollFrame(() => {
      const r = flow.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return; /* nothing to do while it's far off screen */
      flowBar.style.transform = `scaleX(${Math.min(1, Math.max(0, (innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3))).toFixed(3)})`;
    });

    const sets = {
      all: FEATURED,
      books: ["bk-eng-4", "bk-math-5", "bk-sci-7", "bk-urdu-3", "bk-phy-9", "bk-comp-6", "bk-eng-kg", "bk-isl-2"],
      uniforms: ["un-ggs-shirt", "un-cms-sweater", "un-nhs-tie", "un-ana-trouser", "un-bfs-pe", "un-kps-shirt", "un-ggs-skirt", "un-cms-shirt"],
      stationery: ["st-geo", "st-colors-24", "st-calc", "st-pencil-12", "nb-single-80", "st-pouch", "bg-bottle", "bg-junior"],
    };
    const grid = $("#best");
    const draw = (k) => sets[k].map((id, i) => card(getProduct(id), i)).join("");
    grid.innerHTML = draw("all");
    wireTabs($("#best-tabs"), (t) => swap(grid, draw(t.dataset.set), () => $$(".reveal", grid).forEach((c) => c.classList.add("in"))));

    // honest figures straight from the catalogue
    const figs = { books: PRODUCTS.filter((p) => p.type === "book").length, schools: SCHOOLS.length, classes: CLASSES.length, areas: DELIVERY_AREAS.length - 1 };
    $$("[data-fig]").forEach((el) => (el.dataset.countup = figs[el.dataset.fig]));
    wireCounts();

    $("#home-size").innerHTML = sizeFinderHTML();
    wireSizeFinders($("#home-size"));

    $("#signup")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inp = $("input", e.target);
      if (!/^\S+@\S+\.\S+$/.test(inp.value.trim())) { inp.classList.add("invalid"); inp.focus(); return; }
      store.set("asif_signup", inp.value.trim());
      e.target.outerHTML = `<p style="font-weight:700;display:flex;gap:8px;align-items:center;position:relative;z-index:1">${icon("check")}You're on the list. We'll email you when new session lists arrive.</p>`;
    });
  }

  /* --------------------------------------------------------- page: shop */
  function pageShop() {
    const PAGE = 24;
    const MAXP = Math.ceil(Math.max(...PRODUCTS.filter((p) => p.cat !== "service").map((p) => p.price)) / 500) * 500;
    const state = {
      cat: params.get("cat") || "", q: (params.get("q") || "").trim(), school: params.get("school") || "", cls: params.get("class") || "",
      sale: params.get("sale") === "1", max: Number(params.get("max")) || MAXP, sort: params.get("sort") || "popular", shown: PAGE,
    };
    const CATS = [["", "Everything"], ["books", "Textbooks"], ["uniforms", "Uniforms"], ["stationery", "Stationery"], ["novels", "Novels"], ["bags", "Bags & bottles"]];
    const titles = { "": "Shop everything", books: "Textbooks", uniforms: "School uniforms", stationery: "Stationery", novels: "Novels and story books", bags: "Bags & bottles" };
    const fCat = $("#f-cat"), fSchool = $("#fl-school"), fClass = $("#fl-class"), fMax = $("#f-max");
    fMax.max = MAXP; fMax.value = state.max;
    let qHits = null, qFor = null;
    const matchBase = (p) => { if (p.cat === "service") return false; if (!state.q) return true; if (qFor !== state.q) { qHits = new Set(searchProducts(state.q).map((x) => x.id)); qFor = state.q; } return qHits.has(p.id); };
    const maxLabel = () => (state.max >= MAXP ? "Any price" : `Up to ${rs(state.max)}`);

    /* departments as photo pills, and a grid or list switch */
    const bar = $(".shop__bar");
    const catPic = (v) => { const p = v && PRODUCTS.find((x) => x.cat === v && photoOf(x, 160)); return p ? `<img src="${photoOf(p, 160)}" alt="" loading="lazy" decoding="async">` : icon(v === "bags" ? "bag" : v === "novels" ? "open" : "store"); };
    bar.insertAdjacentHTML("beforebegin", `<div class="cat-strip" id="cat-strip" role="group" aria-label="Departments">${CATS.map(([v, l]) => `<button type="button" class="catpill" data-cat="${v}"><span class="catpill__pic">${catPic(v)}</span><span class="catpill__txt">${l}<small></small></span></button>`).join("")}</div>`);
    const GRID = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>';
    const ROWS = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4.5" width="5" height="5" rx="1.2"/><rect x="4" y="14.5" width="5" height="5" rx="1.2"/><path d="M13 6h7M13 9h4M13 16h7M13 19h4"/></svg>';
    let view = store.get("asif_view", "grid") === "list" ? "list" : "grid";
    $("#sort").closest("label").insertAdjacentHTML("beforebegin", `<div class="vtoggle" role="group" aria-label="Layout"><button type="button" data-vmode="grid" aria-label="Grid view">${GRID}</button><button type="button" data-vmode="list" aria-label="List view">${ROWS}</button></div>`);
    const syncView = () => $$("[data-vmode]", bar).forEach((b) => b.setAttribute("aria-pressed", b.dataset.vmode === view));
    syncView();
    bar.addEventListener("click", (e) => { const b = e.target.closest("[data-vmode]"); if (!b || b.dataset.vmode === view) return; view = b.dataset.vmode; store.set("asif_view", view); syncView(); draw(); });
    $("#cat-strip").addEventListener("click", (e) => { const b = e.target.closest("[data-cat]"); if (!b) return; state.cat = b.dataset.cat; if (state.cat !== "books" && state.cat !== "") state.cls = ""; if (state.cat !== "uniforms" && state.cat !== "") state.school = ""; state.shown = PAGE; draw(); });

    function drawFilters() {
      $$("#cat-strip [data-cat]").forEach((b) => { const v = b.dataset.cat; b.setAttribute("aria-pressed", state.cat === v); $("small", b).textContent = PRODUCTS.filter((p) => (!v || p.cat === v) && matchBase(p)).length; });
      fCat.innerHTML = CATS.map(([v, l]) => `<label class="opt"><span><input type="radio" name="cat" value="${v}" ${state.cat === v ? "checked" : ""}>${l}</span><small>${PRODUCTS.filter((p) => (!v || p.cat === v) && matchBase(p)).length}</small></label>`).join("");
      fSchool.innerHTML = `<button class="chip" aria-pressed="${!state.school}" data-school="">All</button>` + SCHOOLS.map((s) => `<button class="chip" data-school="${s.id}" aria-pressed="${state.school === s.id}" title="${esc(s.name)}">${s.short}</button>`).join("");
      fClass.innerHTML = `<button class="chip" aria-pressed="${!state.cls}" data-cls="">All</button>` + CLASSES.map((c) => `<button class="chip" data-cls="${c.id}" aria-pressed="${state.cls === c.id}">${c.n}</button>`).join("");
      $("#fl-school-wrap").hidden = !(state.cat === "uniforms" || state.cat === "");
      $("#fl-class-wrap").hidden = !(state.cat === "books" || state.cat === "");
      $("#f-sale").checked = state.sale;
      $("#f-max-val").textContent = maxLabel();
    }
    function results() {
      let r = PRODUCTS.filter((p) => matchBase(p) && (!state.cat || p.cat === state.cat) && p.price <= state.max);
      /* school only narrows uniforms and class only narrows books, so a mixed choice never empties the page */
      if (state.school && state.cat !== "books") r = r.filter((p) => p.cat === "uniforms" && p.school === state.school);
      if (state.cls && state.cat !== "uniforms") r = r.filter((p) => p.type === "book" && p.classId === state.cls);
      if (state.sale) r = r.filter((p) => p.was);
      const pop = (p) => (FEATURED.includes(p.id) ? 0 : NEW_IN.includes(p.id) ? 1 : 2);
      const sorters = { popular: (a, b) => pop(a) - pop(b), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name) };
      return r.sort(sorters[state.sort] || sorters.popular);
    }
    function syncUrl() {
      const u = new URLSearchParams();
      if (state.cat) u.set("cat", state.cat); if (state.q) u.set("q", state.q); if (state.school) u.set("school", state.school);
      if (state.cls) u.set("class", state.cls); if (state.sale) u.set("sale", "1"); if (state.max < MAXP) u.set("max", state.max); if (state.sort !== "popular") u.set("sort", state.sort);
      history.replaceState(null, "", "shop.html" + (u.toString() ? "?" + u : ""));
    }
    function draw(animate = true) {
      const r = results();
      const titleEl = $("#shop-title"), title = state.q ? `Results for "${state.q}"` : state.sale ? "Offers this week" : titles[state.cat];
      if (titleEl.getAttribute("aria-label") !== title) { titleEl.textContent = title; titleEl.removeAttribute("aria-label"); }
      $("#shop-count").textContent = `${r.length} ${r.length === 1 ? "product" : "products"}`;
      const chips = [];
      if (state.q) chips.push(["q", `Search: ${state.q}`]);
      if (state.school) chips.push(["school", getSchool(state.school).name]);
      if (state.cls) chips.push(["cls", getClass(state.cls).name]);
      if (state.sale) chips.push(["sale", "On offer"]);
      if (state.max < MAXP) chips.push(["max", maxLabel()]);
      $("#active").innerHTML = chips.map(([k, l]) => `<button data-clear="${k}">${esc(l)}${icon("x")}</button>`).join("");
      const box = $("#results");
      const listLink = (state.cat === "books" || state.cls) ? `<a class="shop-hint" href="school-lists.html${state.school || state.cls ? `?${state.school ? `school=${state.school}` : ""}${state.school && state.cls ? "&" : ""}${state.cls ? `class=${state.cls}` : ""}` : ""}">${icon("list")}<span><strong>Buying for a class?</strong> Load your school's full ${state.cls ? getClass(state.cls).name + " " : ""}list in one step, with registers and stationery.</span>${icon("arrow")}</a>` : "";
      const pops = ["Mathematics", "English", "Class 5", "Geometry box", "School bag", "Sweater"];
      box.innerHTML = listLink + (r.length
        ? `<div class="grid grid--3${view === "list" ? " is-list" : ""}">${r.slice(0, state.shown).map(card).join("")}</div>` + (r.length > state.shown ? `<div class="load-more"><button class="btn btn--ghost" data-more>Show more products (${r.length - state.shown} left)</button></div>` : "")
        : `<div class="empty"><div class="empty__ic">${icon("search")}</div><h3>${state.q ? `Nothing found for "${esc(state.q)}"` : "No products match these filters"}</h3><p>Try a subject, a class like "class 5", or a school name. Popular searches:</p><div class="pop-search">${pops.map((t) => `<a class="chip" href="shop.html?q=${encodeURIComponent(t)}">${t}</a>`).join("")}</div><button class="btn btn--dark" data-reset>Clear all filters</button><p class="note" style="margin-top:14px">Can't find a title? <a class="text-link" href="https://wa.me/${STORE.whatsapp}" target="_blank" rel="noopener">Ask us on WhatsApp</a>.</p></div>`);
      if (animate && !reduced) { box.classList.remove("is-updating"); void box.offsetWidth; box.classList.add("is-updating"); }
      $$(".reveal", box).forEach((c, i) => (i < 9 && animate ? c.classList.add("in") : null));
      reveal(box);
      drawFilters(); syncUrl();
    }
    fCat.addEventListener("change", (e) => { state.cat = e.target.value; if (state.cat !== "books" && state.cat !== "") state.cls = ""; if (state.cat !== "uniforms" && state.cat !== "") state.school = ""; state.shown = PAGE; draw(); });
    fSchool.addEventListener("click", (e) => { const b = e.target.closest("[data-school]"); if (!b) return; state.school = b.dataset.school; if (state.school) { state.cls = ""; state.cat = "uniforms"; } state.shown = PAGE; draw(); });
    fClass.addEventListener("click", (e) => { const b = e.target.closest("[data-cls]"); if (!b) return; state.cls = b.dataset.cls; if (state.cls) { state.school = ""; state.cat = "books"; } state.shown = PAGE; draw(); });
    $("#f-sale").addEventListener("change", (e) => { state.sale = e.target.checked; draw(); });
    let mt; fMax.addEventListener("input", () => { state.max = Number(fMax.value); $("#f-max-val").textContent = maxLabel(); clearTimeout(mt); mt = setTimeout(() => draw(), 200); });
    $("#sort").value = state.sort;
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; draw(); });
    $("#active").addEventListener("click", (e) => { const b = e.target.closest("[data-clear]"); if (!b) return; const k = b.dataset.clear; if (k === "sale") state.sale = false; else if (k === "max") { state.max = MAXP; fMax.value = MAXP; } else state[k] = ""; if (k === "q") $$(".search input").forEach((i) => (i.value = "")); draw(); });
    $("#results").addEventListener("click", (e) => {
      if (e.target.closest("[data-more]")) { state.shown += PAGE; draw(false); }
      if (e.target.closest("[data-reset]")) { Object.assign(state, { cat: "", q: "", school: "", cls: "", sale: false, max: MAXP, shown: PAGE }); fMax.value = MAXP; $$(".search input").forEach((i) => (i.value = "")); draw(); }
    });
    const filters = $("#filters");
    $("#filter-toggle").addEventListener("click", () => { filters.classList.add("open"); $("[data-scrim]").classList.add("show"); });
    $("#filter-close").addEventListener("click", () => { filters.classList.remove("open"); $("[data-scrim]").classList.remove("show"); });
    draw(false);
  }

  /* ------------------------------------------------------ page: product */
  function pageProduct() {
    const p = getProduct(params.get("id")) || getProduct("bk-math-5");
    Recent.push(p.id);
    document.title = `${p.name} | ${STORE.name}`;
    const school = p.school && getSchool(p.school);
    const crumbCat = { books: "Textbooks", uniforms: "Uniforms", stationery: "Stationery", novels: "Novels", bags: "Bags & bottles", service: "Services" }[p.cat];
    const meta = p.type === "book" ? `${p.subject}, ${getClass(p.classId).name}` : school ? school.name : p.type === "novel" ? `By ${p.author}` : crumbCat;
    let size = p.sizes && p.sizes.length === 1 ? p.sizes[0] : "";
    if (p.type === "book" && BOOK_PUBLISHERS[p.subj]) p.specs = { Publisher: BOOK_PUBLISHERS[p.subj], ...p.specs };
    const touch = !matchMedia("(hover: hover)").matches;
    $("#crumbs").innerHTML = `<a href="index.html">Home</a><a href="${p.cat === "uniforms" ? "uniforms.html" : "shop.html?cat=" + p.cat}">${crumbCat}</a><span>${esc(p.name)}</span>`;

    const hasPhoto = !!photoOf(p);
    const views = hasPhoto
      ? (p.type === "book" ? [["front", "Photo"], ["inside", "Inside"]] : [["front", "Photo"]])
      : p.type === "book"
      ? [["front", "Front", 28], ["spine", "Spine", 72], ["back", "Back", 180], ["inside", "Inside", null]]
      : p.type === "uniform" ? [["front", "Front"], ["crest", "Crest"]] : [["front", "Front"]];
    const thumbs = views.map(([k, l], i) => `<button class="gallery__thumb" data-view="${k}" aria-pressed="${i === 0}" aria-label="${l} view" style="--tint:${tintOf(p)}">${k === "front" ? art(p) : k === "crest" ? `<div class="art">${crestDetail(p)}</div>` : `<span>${l}</span>`}</button>`).join("");
    const stage = hasPhoto
      ? `<div class="gallery__stage gallery__stage--photo" data-zoom style="--tint:${tintOf(p)}">${art(p, "lg")}<div class="gallery__bar">${p.type === "book" ? `<button class="btn btn--dark btn--sm" data-look>${icon("open")}Look inside</button>` : ""}</div></div>`
      : p.type === "book"
      ? `<div class="gallery__stage" data-drag style="--tint:${tintOf(p)}">${book3d(p)}<div class="gallery__bar"><button class="btn btn--dark btn--sm" data-look>${icon("open")}Look inside</button></div></div>`
      : `<div class="gallery__stage" data-zoom style="--tint:${tintOf(p)}">${art(p)}<div class="gallery__bar"><span class="gallery__hint">${icon("search")}${touch ? "Tap the views to switch" : "Hover to zoom"}</span></div></div>`;
    const tabs = [
      ["desc", "Description", `<p>${esc(p.desc)}</p>`],
      ["details", "Details", `<dl>${Object.entries(p.specs || {}).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>`],
      ["delivery", "Delivery & returns", `<p>Delivery across Karachi in 1 to 2 working days, free on orders over ${rs(STORE.freeDeliveryOver)}. Store pickup from Gulshan-e-Iqbal is free and usually ready in 4 to 6 hours.</p><p style="margin-top:10px">${p.type === "uniform" ? "Exchange any size within 7 days with tags on. Hems and sleeves are altered free in the same window." : p.type === "book" ? "If a title doesn't match your school's prescribed edition, we replace it free." : "Faulty items are replaced free within 7 days."} <a class="text-link" href="policies.html#returns">Full returns policy</a></p>`],
    ];
    const fbt = (p.type === "book" ? ["sv-cover", "nb-single-80", "st-labels-40"] : p.type === "uniform" ? [`un-${p.school}-tie`, `un-${p.school}-sweater`] : p.type === "novel" ? NOVELS.map((x) => x.id).filter((x) => x !== p.id).slice(0, 2) : ["st-pouch", "st-eraser-sharp"]).filter((x) => x !== p.id && getProduct(x));

    $("#pdp").innerHTML = `
      <div class="gallery"><div class="gallery__thumbs">${thumbs}</div>${stage}</div>
      <div>
        <p class="pdp__meta">${esc(meta)}</p>
        <h1>${esc(p.name)}</h1>
        <div class="pdp__price"><span class="price" id="pprice">${p.step && !size ? `<small class="price__from">From</small>` : ""}${rs(priceOf(p, size))}</span>${p.was ? `<s class="note">${rs(p.was)}</s>` : ""}<span class="stock">In stock at the Gulshan store</span></div>
        ${p.type === "book" ? `<p class="pdp__pub">${BOOK_PUBLISHERS[p.subj] ? `Publisher: <strong>${esc(BOOK_PUBLISHERS[p.subj])}</strong> · ` : ""}Edition: <strong>2026–27 session</strong></p>` : ""}
        ${p.step ? `<p class="note">Larger sizes cost a little more. The price updates when you pick a size.</p>` : ""}
        <p class="pdp__desc">${esc(p.desc)}</p>
        ${p.sizes ? `<div class="opt-group"><div class="opt-group__head"><span id="size-label">Size${size ? `: ${size}` : ""}</span>${p.type === "uniform" ? '<button type="button" data-sizechart>Size guide</button>' : ""}</div>
          <div class="sizes" role="group" aria-labelledby="size-label">${p.sizes.map((s) => `<button class="size" data-size="${s}" aria-pressed="${s === size}">${s}</button>`).join("")}</div>
          <p class="field__err" id="size-err" style="margin-top:8px">Choose a size to add this to your cart.</p></div>` : ""}
        <div class="buy-row">
          <div class="qty"><button data-q="-1" aria-label="Decrease quantity">&minus;</button><input id="pqty" value="1" inputmode="numeric" aria-label="Quantity"><button data-q="1" aria-label="Increase quantity">+</button></div>
          <button class="btn btn--primary" id="padd">${icon("cart")}Add to cart</button>
          <button class="btn btn--ghost tool-wide" data-save="${p.id}" aria-pressed="${Saved.has(p.id)}" aria-label="Save for later">${icon("heart")}</button>
        </div>
        <a class="btn btn--wa btn--block pdp__wa" id="pwa" target="_blank" rel="noopener" href="#">${icon("wa")}Ask about this on WhatsApp</a>
        <div class="eta">${icon("truck")}<span>Deliver to</span><select class="select" id="eta-area" aria-label="Delivery area">${DELIVERY_AREAS.map((a) => `<option>${esc(a.name)}</option>`).join("")}</select><strong id="eta-val"></strong></div>
        <div class="assure">
          <div>${icon("store")}<span>Free pickup from Gulshan-e-Iqbal. ${esc(STORE.pickupNote)}.</span></div>
          <div>${icon("swap")}<span>${p.type === "uniform" ? "Exchange any size within 7 days, tags on." : p.type === "book" ? "Wrong edition? We replace it free before school starts." : p.type === "novel" ? "Misprinted or damaged copy? We replace it free within 7 days." : "Faulty items replaced free within 7 days."}</span></div>
          <div>${icon("shield")}<span>Pay cash on delivery, or by JazzCash, Easypaisa or bank transfer.</span></div>
        </div>
        <div class="ptabs"><div class="ptabs__list" role="tablist">${tabs.map(([k, l], i) => `<button role="tab" data-ptab="${k}" aria-selected="${i === 0}">${l}</button>`).join("")}<span class="ptabs__ink"></span></div>
          ${tabs.map(([k, , h], i) => `<div class="ptabs__panel" role="tabpanel" data-ppanel="${k}"${i ? " hidden" : ""}>${h}</div>`).join("")}</div>
        ${fbt.length ? `<div class="fbt"><h3>Often bought together</h3><div class="fbt__items">
          ${[p.id, ...fbt].map((id, i) => { const x = getProduct(id); const pick = i > 0 && x.sizes && x.sizes.length > 1; return `<div class="fbt__item check"><input type="checkbox" id="fbt-${id}" data-fbt="${id}" checked ${i === 0 ? "disabled" : ""}><span class="fbt__thumb" style="--tint:${tintOf(x)}">${art(x)}</span><label for="fbt-${id}">${i === 0 ? "This item: " : ""}${esc(x.name)}${i === 0 && p.sizes ? `<small data-fbt-main>${size ? `Size ${esc(size)}` : "Pick a size above"}</small>` : ""}</label>${pick ? `<select class="select select--sm" data-fbt-size="${id}" aria-label="Size for ${esc(x.name)}"><option value="">Size</option>${x.sizes.map((z) => `<option>${z}</option>`).join("")}</select>` : ""}<strong data-fbt-price="${id}">${rs(priceOf(x, i === 0 ? size : ""))}</strong></div>`; }).join("")}
          </div><div class="fbt__foot"><span>Total <strong id="fbt-total"></strong></span><button class="btn btn--dark btn--sm" id="fbt-add">Add selected to cart</button></div><p class="field__err" id="fbt-err"></p></div>` : ""}
      </div>`;

    const wa = () => { $("#pwa").href = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to order: ${p.name}${size ? " (size " + size + ")" : ""}, qty ${$("#pqty").value}.`)}`; };
    wa();
    $$("[data-size]").forEach((b) => b.addEventListener("click", () => {
      size = b.dataset.size; $$("[data-size]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      $("#size-label").textContent = `Size: ${size}`; $("#size-err").style.display = "none"; wa();
      $("#pprice").textContent = rs(priceOf(p, size));
      const m = $("[data-fbt-main]"); if (m) m.textContent = `Size ${size}`;
      const fp = $(`[data-fbt-price="${p.id}"]`); if (fp) fp.textContent = rs(priceOf(p, size));
      fbtTotal(); if ($("#fbt-err")) $("#fbt-err").style.display = "none";
    }));
    $("[data-sizechart]")?.addEventListener("click", sizeChart);
    $$("[data-q]").forEach((b) => b.addEventListener("click", () => { const q = $("#pqty"); q.value = Math.max(1, Math.min(99, (parseInt(q.value) || 1) + Number(b.dataset.q))); wa(); }));
    $("#pqty").addEventListener("change", (e) => { e.target.value = Math.max(1, Math.min(99, parseInt(e.target.value) || 1)); wa(); });
    const needSize = () => { if (p.sizes && !size) { $("#size-err").style.display = "block"; $("#size-err").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); return true; } return false; };
    const add = () => {
      if (needSize()) return;
      flyToCart($(".gallery__stage .book3d__front, .gallery__stage .art"));
      Cart.add(p.id, parseInt($("#pqty").value) || 1, p.sizes ? size : "");
      const b = $("#padd"); b.classList.add("is-done"); b.innerHTML = icon("check") + "Added to cart";
      setTimeout(() => { b.classList.remove("is-done"); b.innerHTML = icon("cart") + "Add to cart"; }, 1600);
    };
    $("#padd").addEventListener("click", add);

    const area = $("#eta-area"), etaVal = $("#eta-val");
    area.value = store.get("asif_profile", {}).area || DELIVERY_AREAS[0].name;
    const eta = () => { const w = deliveryWindow(area.value); etaVal.textContent = w ? `Arrives ${w.label}` : ""; };
    area.addEventListener("change", eta); eta();

    const list = $(".ptabs__list"), ink = $(".ptabs__ink");
    const moveInk = () => { const on = $('[aria-selected="true"]', list); ink.style.left = on.offsetLeft + "px"; ink.style.width = on.offsetWidth + "px"; };
    list.addEventListener("click", (e) => {
      const t = e.target.closest("[data-ptab]"); if (!t) return;
      $$("[data-ptab]", list).forEach((x) => x.setAttribute("aria-selected", x === t));
      $$("[data-ppanel]").forEach((pn) => (pn.hidden = pn.dataset.ppanel !== t.dataset.ptab));
      moveInk();
    });
    moveInk(); document.fonts?.ready.then(moveInk); addEventListener("resize", moveInk);

    const fbtIds = () => $$("[data-fbt]").filter((c) => c.checked).map((c) => c.dataset.fbt);
    const fbtOpt = (id) => { const x = getProduct(id); if (id === p.id) return p.sizes ? size : ""; if (!x.sizes) return ""; return x.sizes.length === 1 ? x.sizes[0] : $(`[data-fbt-size="${id}"]`)?.value || ""; };
    function fbtTotal() { const t = $("#fbt-total"); if (t) t.textContent = rs(fbtIds().reduce((s, id) => s + priceOf(getProduct(id), fbtOpt(id)), 0)); }
    $$("[data-fbt]").forEach((c) => c.addEventListener("change", fbtTotal));
    $$("[data-fbt-size]").forEach((sel) => sel.addEventListener("change", () => { $(`[data-fbt-price="${sel.dataset.fbtSize}"]`).textContent = rs(priceOf(getProduct(sel.dataset.fbtSize), sel.value)); sel.classList.remove("invalid"); fbtTotal(); }));
    fbtTotal();
    $("#fbt-add")?.addEventListener("click", () => {
      const err = $("#fbt-err");
      const ids = fbtIds();
      const missing = ids.filter((id) => getProduct(id).sizes && !fbtOpt(id));
      if (missing.length) {
        const names = missing.map((id) => (id === p.id ? "this item (above)" : getProduct(id).name.replace(/^\w+ /, "").toLowerCase()));
        err.textContent = `Choose a size for ${names.length > 1 ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1] : names[0]}.`;
        err.style.display = "block";
        missing.forEach((id) => $(`[data-fbt-size="${id}"]`)?.classList.add("invalid"));
        if (missing.includes(p.id)) needSize();
        return;
      }
      err.style.display = "none";
      ids.forEach((id) => Cart.add(id, 1, fbtOpt(id), true));
      toast(`${ids.length} items added to your cart`);
    });

    const st = $("[data-drag]");
    if (st) {
      const inner = $(".book3d__inner", st);
      let ry = 28, rx = 4, sx = 0, sy = 0, down = false;
      const apply = () => (inner.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`);
      st.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; down = true; sx = e.clientX; sy = e.clientY; st.setPointerCapture(e.pointerId); st.classList.add("dragging"); });
      st.addEventListener("pointermove", (e) => { if (!down) return; ry += (e.clientX - sx) * 0.55; rx = Math.max(-22, Math.min(22, rx - (e.clientY - sy) * 0.25)); sx = e.clientX; sy = e.clientY; apply(); });
      const end = () => { down = false; st.classList.remove("dragging"); };
      st.addEventListener("pointerup", end); st.addEventListener("pointercancel", end);
      $("[data-look]").addEventListener("click", () => quickView(p.id, true));
      $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.view === "inside") { quickView(p.id, true); return; }
        $$("[data-view]").forEach((x) => x.setAttribute("aria-pressed", x === b));
        ry = views.find(([k]) => k === b.dataset.view)[2]; rx = 4; apply();
      }));
    }
    const zm = $("[data-zoom]");
    if (zm) {
      if (!reduced && matchMedia("(hover: hover)").matches) {
        zm.addEventListener("pointermove", (e) => { const r = zm.getBoundingClientRect(); zm.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%"); zm.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%"); zm.classList.add("zooming"); });
        zm.addEventListener("pointerleave", () => zm.classList.remove("zooming"));
      }
      $("[data-look]", zm)?.addEventListener("click", () => quickView(p.id, true));
      $$("[data-view]").forEach((b) => b.addEventListener("click", () => {
        if (b.dataset.view === "inside") { quickView(p.id, true); return; }
        if (hasPhoto) return;
        $$("[data-view]").forEach((x) => x.setAttribute("aria-pressed", x === b));
        const a = $(".art", zm);
        a.innerHTML = b.dataset.view === "crest" ? `<div class="gallery__detail">${crestDetail(p)}</div>` : svgArt(p);
        if (!reduced) a.animate([{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" });
      }));
    }

    const bar = $("#sticky-buy");
    if (bar && io) {
      bar.innerHTML = `<div><strong>${esc(p.name)}</strong><span class="price">${p.step ? "From " : ""}${rs(p.price)}</span></div><button class="btn btn--primary">${icon("cart")}Add to cart</button>`;
      $("button", bar).addEventListener("click", add);
      new IntersectionObserver(([e]) => { const off = !e.isIntersecting && e.boundingClientRect.top < 0; bar.classList.toggle("show", off); document.body.classList.toggle("has-sticky-buy", off); }).observe($("#padd"));
    }

    const related = PRODUCTS.filter((x) => x.id !== p.id && x.cat !== "service" && (p.type === "book" ? x.type === "book" && x.classId === p.classId : p.type === "uniform" ? x.school === p.school : x.cat === p.cat)).slice(0, 4);
    $("#related-title").textContent = p.type === "book" ? `More for ${getClass(p.classId).name}` : p.type === "uniform" ? `More from the ${school.short} uniform` : "You may also need";
    $("#related").innerHTML = related.map(card).join("");
    const recent = Recent.list(p.id).slice(0, 4);
    if (recent.length) { $("#recent-wrap").hidden = false; $("#recent").innerHTML = recent.map((id) => card(getProduct(id))).join(""); }
  }

  /* ------------------------------------------------- page: school lists */
  function pageLists() {
    const fs = $("#l-school"), fc = $("#l-class");
    fillSelect(fs, SCHOOLS, "Select school"); fillSelect(fc, CLASSES, "Select class");
    const child = store.get("asif_children", [])[0], last = store.get("asif_last_list", null);
    fs.value = params.get("school") || last?.school || child?.school || ""; fc.value = params.get("class") || last?.cls || child?.cls || "";
    let kid = last?.name || "";
    let list = null; const off = new Set(); const qty = {};
    const groups = [["books", "Textbooks"], ["notebooks", "Registers & copies"], ["stationery", "Stationery"]];

    function draw(first) {
      const out = $("#list-out");
      if (!fs.value || !fc.value) {
        out.innerHTML = `<div class="empty"><div class="empty__ic">${icon("list")}</div><h3>Choose a school and class</h3><p>We'll show the full prescribed list for the 2026–27 session. Untick anything you already have.</p></div>`;
        $("#summary").innerHTML = `<h3>Order summary</h3><p class="note">Your list total appears here once you choose a school and class.</p>`;
        return;
      }
      const sc = getSchool(fs.value), cl = getClass(fc.value);
      const heroHTML = first || !$(".list-hero") ? `<div class="list-hero" style="--sc:${sc.color};--sc2:${shade(sc.color, -0.45)}">
          <div class="list-hero__top"><span class="crest">${sc.short}</span><div><h2>${esc(cl.name)} book list</h2><p>${esc(sc.name)}, ${esc(sc.campus)}. Session 2026–27.</p></div></div>
          <div class="bookcase"><div class="bookcase__inner" style="grid-template-columns:1fr">${bay(cl, 7, { plate: false, link: false })}</div></div>
        </div>` : $(".list-hero").outerHTML;
      out.innerHTML = heroHTML + groups.map(([g, label]) => `<section class="list-group"><div class="list-group__head"><span>${label}</span><button data-toggle-group="${g}">${list[g].every((i) => !off.has(i.id)) ? "Untick all" : "Tick all"}</button></div>
        ${list[g].map((i) => { const p = getProduct(i.id); const q = qty[i.id] ?? i.qty; return `<label class="li${off.has(i.id) ? " off" : ""}">
          <input type="checkbox" data-item="${i.id}" ${off.has(i.id) ? "" : "checked"}>
          <span class="li__thumb" style="--tint:${tintOf(p)}">${art(p)}</span>
          <span class="li__name">${esc(p.name)}<small>${rs(p.price)} each</small></span>
          <span class="qty qty--sm"><button type="button" data-lq="${i.id}" data-d="-1" aria-label="Fewer">&minus;</button><input value="${q}" readonly aria-label="Quantity"><button type="button" data-lq="${i.id}" data-d="1" aria-label="More">+</button></span>
          <span class="li__price">${rs(p.price * q)}</span></label>`; }).join("")}</section>`).join("");
      if (!first) $(".list-hero", out).style.animation = "none";
      drawSummary();
    }
    function chosen() { return groups.flatMap(([g]) => list[g]).filter((i) => !off.has(i.id)).map((i) => ({ id: i.id, qty: qty[i.id] ?? i.qty })); }
    function drawSummary() {
      const items = chosen();
      const bookCount = items.filter((i) => getProduct(i.id).type === "book").length;
      const sub = items.reduce((s, i) => s + getProduct(i.id).price * i.qty, 0);
      const coverOn = $("#ad-cover")?.checked ?? false, label = $("#ad-label")?.checked ?? false, section = $("#ad-section")?.value || "";
      const addons = (coverOn ? bookCount * 40 : 0) + (label ? 200 : 0);
      const n = qtyOf(items);
      $("#summary").innerHTML = `<h3>Order summary</h3>
        <label class="field"><span>Child's name (optional)</span><input class="input" id="ad-kid" value="${esc(kid)}" placeholder="So you can tell lists apart in the cart" autocomplete="off"></label>
        <div class="summary__row"><span>${n} items selected</span><span>${rs(sub)}</span></div>
        <label class="addon"><input type="checkbox" id="ad-cover" ${coverOn ? "checked" : ""}><span><strong>Cover every book, Rs 40 each</strong><small>Clear plastic covering done in-store before packing.</small></span></label>
        <label class="addon"><input type="checkbox" id="ad-label" ${label ? "checked" : ""}><span><strong>Name labels, Rs 200</strong><small>Printed with your child's name, class and section.</small></span></label>
        ${label ? `<div class="label-fields"><label class="field"><span>Name on the labels</span><input class="input" id="ad-lname" value="${esc(kid)}" autocomplete="off"><em class="field__err">Enter the name to print.</em></label><label class="field"><span>Section</span><input class="input" id="ad-section" value="${esc(section)}" placeholder="e.g. B" autocomplete="off"></label></div>` : ""}
        ${addons ? `<div class="summary__row"><span>Add-ons</span><span>${rs(addons)}</span></div>` : ""}
        <div class="summary__total"><span>List total</span><span class="price">${rs(sub + addons)}</span></div>
        <button class="btn btn--primary btn--block" id="list-add" ${items.length ? "" : "disabled"}>${icon("cart")}Add ${n} items to cart</button>
        <button class="btn btn--ghost btn--block" id="list-save">${icon("child")}Save this list to my account</button>
        <p class="note">Sold-out titles are sourced within 48 hours. We'll message you on WhatsApp if anything is delayed.</p>`;
      $("#ad-cover").addEventListener("change", drawSummary); $("#ad-label").addEventListener("change", drawSummary);
      $("#ad-kid").addEventListener("input", (e) => { kid = e.target.value.trim(); const ln = $("#ad-lname"); if (ln && !ln.dataset.touched) ln.value = kid; });
      $("#ad-lname")?.addEventListener("input", (e) => (e.target.dataset.touched = "1"));
      $("#list-add").addEventListener("click", () => {
        const sc = getSchool(fs.value), cl = getClass(fc.value);
        const set = items.map((i) => ({ ...i }));
        if ($("#ad-cover").checked && bookCount) set.push({ id: "sv-cover", qty: bookCount });
        if ($("#ad-label").checked) {
          const ln = $("#ad-lname").value.trim();
          if (!ln) { $("#ad-lname").closest(".field").classList.add("has-error"); $("#ad-lname").focus(); return; }
          set.push({ id: "st-labels-40", qty: 1, opt: `For ${ln}, ${cl.name}${$("#ad-section").value.trim() ? ", section " + $("#ad-section").value.trim() : ""}` });
        }
        store.set("asif_last_list", { school: fs.value, cls: fc.value, name: kid });
        const grp = `${kid ? kid + " · " : ""}${sc.short} ${cl.name} list`;
        addSet(set, grp, (added) => {
          flyToCart($(".list-hero .bay__books"));
          toast(`${qtyOf(added)} items from the ${cl.name} list added`);
          setTimeout(openDrawer, reduced ? 0 : 650);
        });
      });
      $("#list-save").addEventListener("click", () => {
        const kids = store.get("asif_children", []);
        if (!kids.some((k) => k.school === fs.value && k.cls === fc.value)) kids.push({ name: "", school: fs.value, cls: fc.value });
        store.set("asif_children", kids);
        toast("List saved to your account", false);
      });
    }
    function load() {
      off.clear(); Object.keys(qty).forEach((k) => delete qty[k]);
      list = fs.value && fc.value ? buildList(fs.value, fc.value) : null;
      if (list) { history.replaceState(null, "", `school-lists.html?school=${fs.value}&class=${fc.value}`); store.set("asif_last_list", { school: fs.value, cls: fc.value, name: kid }); }
      draw(true);
    }
    $("#list-form").addEventListener("submit", (e) => { e.preventDefault(); load(); });
    [fs, fc].forEach((s) => s.addEventListener("change", () => { if (fs.value && fc.value) load(); }));
    $("#list-out").addEventListener("change", (e) => { const id = e.target.dataset.item; if (!id) return; e.target.checked ? off.delete(id) : off.add(id); draw(false); });
    $("#list-out").addEventListener("click", (e) => {
      const q = e.target.closest("[data-lq]");
      if (q) { e.preventDefault(); const id = q.dataset.lq; const base = groups.flatMap(([g]) => list[g]).find((i) => i.id === id).qty; qty[id] = Math.max(1, Math.min(30, (qty[id] ?? base) + Number(q.dataset.d))); draw(false); return; }
      const t = e.target.closest("[data-toggle-group]");
      if (t) { const g = list[t.dataset.toggleGroup]; const allOn = g.every((i) => !off.has(i.id)); g.forEach((i) => (allOn ? off.add(i.id) : off.delete(i.id))); draw(false); }
    });
    load();
  }

  /* ----------------------------------------------------- page: uniforms */
  function pageUniforms() {
    let sel = params.get("school") || store.get("asif_last_list", null)?.school || SCHOOLS[0].id, who = "all";
    const wrap = $("#schools");
    const pieces = () => PRODUCTS.filter((p) => p.school === sel && (who === "all" || p.for === "all" || p.for === who));
    function builder() {
      const sc = getSchool(sel);
      $("#u-build").innerHTML = `<div class="ubuild__head"><div><h3>Build the full ${esc(sc.short)} uniform</h3><p>Tick the pieces you need and pick a size for each. Not sure? <button type="button" class="text-link" data-u-guide>Find the size by age</button></p></div>
        <div class="seg" role="group" aria-label="Show uniform for">${[["all", "Everyone"], ["boys", "Boys"], ["girls", "Girls"]].map(([k, l]) => `<button type="button" data-who="${k}" aria-pressed="${who === k}">${l}</button>`).join("")}</div></div>
        <div class="ubuild__rows">${pieces().map((p) => `<div class="urow"><input type="checkbox" id="ub-${p.id}" data-ub="${p.id}" ${["shirt", "tie", ...(who === "boys" ? ["trouser"] : who === "girls" ? ["skirt"] : [])].some((k) => p.id.endsWith("-" + k)) ? "checked" : ""}><span class="urow__art" style="--tint:${tintOf(p)}">${art(p)}</span><label for="ub-${p.id}">${esc(p.name.replace(sc.short + " ", ""))}<small>${p.for === "all" ? "Boys and girls" : p.for === "boys" ? "Boys" : "Girls"}</small></label>
          <select class="select select--sm" data-ub-size="${p.id}" aria-label="Size for ${esc(p.name)}"><option value="">Size</option>${p.sizes.map((z) => `<option>${z}</option>`).join("")}</select><strong data-ub-price="${p.id}">${rs(p.price)}</strong></div>`).join("")}</div>
        <div class="ubuild__foot"><div><small>Uniform total</small><strong id="ub-total"></strong></div><p class="field__err" id="ub-err"></p><button type="button" class="btn btn--primary" id="ub-add">${icon("cart")}Add uniform to cart</button></div>`;
      ubTotal();
    }
    const ubPicked = () => $$("[data-ub]").filter((c) => c.checked).map((c) => ({ id: c.dataset.ub, opt: $(`[data-ub-size="${c.dataset.ub}"]`).value }));
    function ubTotal() { $("#ub-total").textContent = rs(ubPicked().reduce((s, i) => s + priceOf(getProduct(i.id), i.opt), 0)); }
    function draw(scroll) {
      wrap.innerHTML = SCHOOLS.map((s) => `<button class="school-card" data-sc="${s.id}" aria-pressed="${s.id === sel}" style="--sc:${s.color}"><span class="crest" style="background:${s.color}">${s.short}</span><span><strong>${esc(s.name)}</strong><small>${esc(s.campus)} campus</small></span></button>`).join("");
      const sc = getSchool(sel);
      $("#u-title").textContent = `${sc.name} uniform`;
      $("#u-band").style.setProperty("--sc", sc.color); $("#u-band").style.setProperty("--acc", sc.accent);
      $("#u-band-art").innerHTML = ["shirt", "sweater", "tie"].map((k) => `<span>${art(getProduct(`un-${sel}-${k}`))}</span>`).join("");
      const g = $("#u-grid");
      builder();
      swap(g, pieces().map(card).join(""), () => $$(".reveal", g).forEach((c) => c.classList.add("in")));
      history.replaceState(null, "", `uniforms.html?school=${sel}`);
      if (scroll) $("#u-band").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    wrap.addEventListener("click", (e) => { const b = e.target.closest("[data-sc]"); if (!b) return; sel = b.dataset.sc; draw(true); });
    $("#u-size").addEventListener("click", sizeChart);
    const ub = $("#u-build");
    ub.addEventListener("click", (e) => {
      const w = e.target.closest("[data-who]"); if (w) { who = w.dataset.who; draw(false); return; }
      if (e.target.closest("[data-u-guide]")) { sizeChart(); return; }
      if (e.target.closest("#ub-add")) {
        const picked = ubPicked(), err = $("#ub-err");
        if (!picked.length) { err.textContent = "Tick at least one piece."; err.style.display = "block"; return; }
        const missing = picked.filter((i) => !i.opt);
        if (missing.length) { err.textContent = `Choose a size for: ${missing.map((i) => getProduct(i.id).name.replace(getSchool(sel).short + " ", "")).join(", ")}.`; err.style.display = "block"; missing.forEach((i) => $(`[data-ub-size="${i.id}"]`).classList.add("invalid")); return; }
        err.style.display = "none";
        addSet(picked.map((i) => ({ ...i, qty: 1 })), `${getSchool(sel).short} uniform`, (added) => { flyToCart($(".urow__art", ub)); toast(`${added.length} uniform pieces added`); setTimeout(openDrawer, reduced ? 0 : 650); });
      }
    });
    ub.addEventListener("change", (e) => {
      const s2 = e.target.closest("[data-ub-size]"); if (s2) { s2.classList.remove("invalid"); $(`[data-ub-price="${s2.dataset.ubSize}"]`).textContent = rs(priceOf(getProduct(s2.dataset.ubSize), s2.value)); const c = $(`[data-ub="${s2.dataset.ubSize}"]`); if (s2.value) c.checked = true; }
      ubTotal();
    });
    draw();
  }

  /* --------------------------------------------------------- page: cart */
  function promoBlock() {
    const t = totals();
    const pr = PROMOS[Cart.promo];
    return `<div><form class="promo" data-promo><label class="sr-only" for="promo">Promo code</label><input class="input" id="promo" placeholder="Promo code" value="${esc(Cart.promo)}" autocomplete="off"><button class="btn btn--ghost btn--sm" type="submit">Apply</button></form>
      <p class="promo-msg ${pr ? (t.disc ? "ok" : "err") : ""}" data-promo-msg style="margin-top:6px">${pr ? (t.disc ? `${esc(pr.label)} applied.` : `Spend ${rs(pr.min)} to use ${esc(Cart.promo)}.`) : ""}</p></div>`;
  }
  function renderCartPage() {
    const el = $("#cart-page");
    if (!Cart.items.length && !Cart.later.length) {
      el.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="empty__ic">${icon("bag")}</div><h3>Your cart is empty</h3><p>Pick your school and class and the full book list is added for you.</p><a class="btn btn--primary" href="school-lists.html">Find my school list</a></div>`;
      return;
    }
    const t = totals();
    el.innerHTML = `<div>
        ${Cart.items.length ? `<div class="cart-table">${groupedLines(Cart.items)}</div><div class="cart-tools"><button type="button" class="ci__link ci__link--rm" data-empty-cart>Empty cart</button></div>` : `<div class="empty"><h3>No items in your cart</h3><p>Move something back from saved for later, or keep shopping.</p></div>`}
        ${Cart.later.length ? `<div class="saved-later"><h3>Saved for later (${Cart.later.length})</h3><div class="cart-table">${Cart.later.map((i) => lineItem(i, true)).join("")}</div></div>` : ""}
      </div>
      <aside class="summary"><h3>Order summary</h3>
        <div class="summary__row"><span>Subtotal (${Cart.count()} items)</span><span>${rs(t.sub)}</span></div>
        ${discRows(t)}
        <div class="summary__row"><span>Delivery in Karachi</span><span>${t.ship ? rs(t.ship) : "Free"}</span></div>
        ${shipMeter(t.sub)}
        ${promoBlock()}
        <div class="summary__total"><span>Total</span><span class="price">${rs(t.total)}</span></div>
        ${Cart.items.length ? `<a class="btn btn--primary btn--block" href="checkout.html">${icon("lock")}Checkout</a>` : `<button class="btn btn--primary btn--block" disabled>${icon("lock")}Checkout</button>`}
        <a class="btn btn--ghost btn--block" href="shop.html">Continue shopping</a>
        <p class="note">Store pickup is free. Choose it at checkout.</p></aside>`;
  }

  /* ----------------------------------------------------- page: checkout */
  function renderCheckoutSummary() {
    const el = $("#co-summary"); if (!el) return;
    const needLabel = Cart.items.some((i) => i.id === "st-labels-40" && !i.opt);
    const lf = $("#label-fields"); if (lf) lf.hidden = !needLabel;
    if (!Cart.items.length && !$("#co-form").dataset.done) { location.href = "cart.html"; return; }
    const method = $("input[name=method]:checked")?.value || "delivery";
    const t = totals(method);
    $("#ship-price").textContent = t.sub >= STORE.freeDeliveryOver ? "Free" : rs(STORE.deliveryFee);
    el.innerHTML = `<h3>Your order</h3>
      <div class="mini-items">${Cart.items.map((i) => { const p = getProduct(i.id); return `<div class="mini"><span class="mini__thumb" style="--tint:${tintOf(p)}">${art(p)}<b>${i.qty}</b></span><span>${esc(p.name)}${i.opt ? `<small>${esc(sizeLabel(i.opt))}</small>` : ""}</span><strong>${rs(priceOf(p, i.opt) * i.qty)}</strong></div>`; }).join("")}</div>
      <div class="summary__row"><span>Subtotal</span><span>${rs(t.sub)}</span></div>
      ${discRows(t)}
      <div class="summary__row"><span>${method === "pickup" ? "Store pickup" : "Delivery"}</span><span>${t.ship ? rs(t.ship) : "Free"}</span></div>
      ${promoBlock()}
      <div class="summary__total"><span>Total</span><span class="price">${rs(t.total)}</span></div>
      <button class="btn btn--primary btn--block" type="submit" form="co-form" data-place>${icon("lock")}Place order</button>
      <p class="note">You won't be charged online. ${STORE.orderEndpoint ? "Your order goes straight to the shop, and we confirm it by phone or WhatsApp before dispatch." : "After you place the order, you'll send it to the shop on WhatsApp in one tap, and we confirm it before dispatch."}</p>`;
  }

  const phoneOk = (v) => /^(\+92|0092|0)3\d{9}$/.test(v.replace(/[\s-]/g, ""));
  function pageCheckout() {
    const form = $("#co-form");
    const prof = store.get("asif_profile", {});
    $("#area-sel").innerHTML = `<option value="">Choose area</option>` + DELIVERY_AREAS.map((a) => `<option>${esc(a.name)}</option>`).join("");
    ["name", "phone", "email", "address", "area"].forEach((k) => { if (prof[k] && form.elements[k]) form.elements[k].value = prof[k]; });
    /* label details are asked for only when name labels are in the cart without them */
    form.elements.notes.closest(".field").insertAdjacentHTML("beforebegin", `<div class="label-fields label-fields--co" id="label-fields" hidden><p class="label-fields__title">${icon("child")}Name labels: what should we print?</p>
      <label class="field"><span>Child's name</span><input class="input" name="lname" autocomplete="off"><em class="field__err"></em></label>
      <label class="field"><span>Class and section</span><input class="input" name="lclass" placeholder="e.g. Class 3, section B" autocomplete="off"></label></div>`);
    const slotStart = (s) => { const m = s.match(/^(\d+) (am|pm)/); return m ? (Number(m[1]) % 12) + (m[2] === "pm" ? 12 : 0) : 0; };
    function drawSlots() {
      const w = deliveryWindow(form.elements.area.value);
      const prev = $("input[name=slot]:checked")?.value;
      const late = (s) => w && w.today && new Date().getHours() >= slotStart(s) - 1;
      $("#slots").innerHTML = DELIVERY_SLOTS.map((s) => `<label class="rcard rcard--slot${late(s) ? " is-off" : ""}"><input type="radio" name="slot" value="${s}" ${late(s) ? "disabled" : ""}>${s}</label>`).join("");
      const pick = $$("input[name=slot]").find((r) => !r.disabled && (r.value === prev || !prev)) || $$("input[name=slot]").find((r) => !r.disabled);
      if (pick) pick.checked = true;
      $("#slot-day").textContent = w ? ` on ${w.first.toDateString() === w.last.toDateString() ? (w.today ? "today, " : "") + DAY(w.first) : DAY(w.first) + " or " + DAY(w.last)}` : "";
    }
    $("#slots").previousElementSibling.innerHTML = `Delivery time<span id="slot-day"></span>`;
    const addr = $("#addr-fields");
    $$("input[name=method]").forEach((r) => r.addEventListener("change", () => { addr.classList.toggle("is-closed", $("input[name=method]:checked").value === "pickup"); renderCheckoutSummary(); progress(); }));
    $$("input[name=pay]").forEach((r) => r.addEventListener("change", () => $$(".pay-detail").forEach((d) => d.closest(".collapse").classList.toggle("is-closed", d.dataset.for !== $("input[name=pay]:checked").value))));
    const area = form.elements.area, etaEl = $("#co-eta");
    const eta = () => { const w = deliveryWindow(area.value); etaEl.textContent = w ? `Arrives ${w.label}.` : "Choose your area to see the delivery day."; drawSlots(); };
    area.addEventListener("change", eta); eta();

    const steps = $$(".stepper li");
    function progress() {
      const contact = form.elements.name.value.trim().length >= 3 && phoneOk(form.elements.phone.value);
      const pickup = $("input[name=method]:checked").value === "pickup";
      const delivery = pickup || (form.elements.address.value.trim().length >= 8 && !!area.value);
      const state = [contact, contact && delivery, false];
      steps.forEach((li, i) => {
        li.classList.toggle("is-done", state[i]);
        li.classList.toggle("is-on", !state[i] && (i === 0 || state[i - 1]));
      });
    }
    form.addEventListener("input", progress); form.addEventListener("change", progress); progress();
    renderCheckoutSummary();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const method = $("input[name=method]:checked").value;
      const rules = { name: (v) => v.length >= 3 || "Enter the full name for this order.", phone: (v) => phoneOk(v) || "Enter a mobile number like 0300 1234567." };
      if (method === "delivery") { rules.address = (v) => v.length >= 8 || "Enter house number, street and block."; rules.area = (v) => !!v || "Choose your area."; }
      if (!$("#label-fields").hidden) rules.lname = (v) => v.length >= 2 || "Enter the name to print on the labels.";
      let firstBad = null;
      Object.entries(rules).forEach(([n, fn]) => {
        const inp = form.elements[n]; const f = inp.closest(".field"); const ok = fn(inp.value.trim());
        f.classList.toggle("has-error", ok !== true); if (ok !== true) { $(".field__err", f).textContent = ok; firstBad = firstBad || inp; }
      });
      if (firstBad) { firstBad.focus({ preventScroll: true }); firstBad.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" }); return; }
      const t = totals(method);
      const v = (k) => form.elements[k]?.value.trim() || "";
      if ($("#save-details").checked) store.set("asif_profile", { ...prof, name: v("name"), phone: v("phone"), email: v("email"), address: v("address"), area: v("area") });
      const win = method === "pickup" ? null : deliveryWindow(v("area"));
      const labelFor = !$("#label-fields").hidden ? `For ${v("lname")}${v("lclass") ? ", " + v("lclass") : ""}` : "";
      const order = {
        no: "AB-" + String(Date.now()).slice(-6), date: new Date().toISOString(), name: v("name"), phone: v("phone"), email: v("email"),
        method, address: method === "pickup" ? "Store pickup, Gulshan-e-Iqbal" : `${v("address")}, ${v("area")}${v("landmark") ? ` (near ${v("landmark")})` : ""}`, slot: method === "pickup" ? "" : $("input[name=slot]:checked")?.value || "",
        eta: win ? win.label : "", pay: $("input[name=pay]:checked").value, notes: v("notes"), promo: t.disc ? Cart.promo : "", sub: t.sub, disc: t.disc, bdisc: t.bdisc, bpct: t.bdisc ? Cart.bundle.pct : 0, ship: t.ship, total: t.total,
        items: Cart.items.map((i) => ({ ...i, opt: i.id === "st-labels-40" && !i.opt ? labelFor : i.opt, name: getProduct(i.id).name, price: priceOf(getProduct(i.id), i.opt) })),
        sent: false,
      };
      const finish = () => { Orders.add(order); form.dataset.done = "1"; Cart.clear(); location.href = `order.html?no=${order.no}`; };
      if (!STORE.orderEndpoint) { finish(); return; }
      /* send the order to the shop; carry on after 6 seconds even if the network is slow */
      $$("[data-place]").forEach((b) => { b.disabled = true; b.innerHTML = `${icon("lock")}Sending your order…`; });
      Promise.race([
        fetch(STORE.orderEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(order) }).then((r) => r.ok),
        new Promise((r) => setTimeout(() => r(false), 6000)),
      ]).catch(() => false).then((ok) => { order.sent = !!ok; finish(); });
    });
  }

  /* -------------------------------------------- page: order confirmation */
  const PAY = { cod: "Cash on delivery", jazz: "JazzCash", easy: "Easypaisa", bank: "Bank transfer" };
  const when = (iso, opts = { dateStyle: "medium", timeStyle: "short" }) => new Date(iso).toLocaleString("en-PK", opts);
  const orderMsg = (o) => `Hi, I placed order ${o.no} on the website.\n` + o.items.map((i) => `${i.qty} x ${i.name}${i.opt ? " (" + optNote(i.opt) + ")" : ""}`).join("\n")
    + `\nTotal: ${rs(o.total)}, ${PAY[o.pay]}.\n${o.method === "pickup" ? "Store pickup." : `Deliver to: ${o.address}${o.eta ? `, ${o.eta}` : ""}${o.slot ? `, ${o.slot}` : ""}.`}\nName: ${o.name}, ${o.phone}${o.notes ? `\nNotes: ${o.notes}` : ""}`;
  const waOrder = (o) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(orderMsg(o))}`;
  function invoice(o) {
    return `<div class="invoice">
      <div class="invoice__head"><div><small>Order number</small><strong>${esc(o.no)}</strong></div><div><small>Placed</small><strong>${when(o.date)}</strong></div><div><small>Payment</small><strong>${PAY[o.pay]}</strong></div><div><small>${o.method === "pickup" ? "Pickup" : "Deliver to"}</small><strong>${esc(o.address)}</strong>${o.eta || o.slot ? `<small>${esc([o.eta ? o.eta.replace(/^today/, "Today") : "", o.slot].filter(Boolean).join(", "))}</small>` : ""}</div></div>
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead><tbody>
      ${o.items.map((i) => `<tr><td>${esc(i.name)}${i.opt ? ` <span class="note">(${esc(optNote(i.opt))})</span>` : ""}</td><td>${i.qty}</td><td>${rs(i.price * i.qty)}</td></tr>`).join("")}</tbody></table>
      <div class="invoice__totals">
        <div class="summary__row"><span>Subtotal</span><span>${rs(o.sub)}</span></div>
        ${o.disc ? `<div class="summary__row summary__row--disc"><span>Promo ${esc(o.promo)}</span><span>&minus;${rs(o.disc)}</span></div>` : ""}
        ${o.bdisc ? `<div class="summary__row summary__row--disc"><span>Bundle saving (${o.bpct}%)</span><span>&minus;${rs(o.bdisc)}</span></div>` : ""}
        <div class="summary__row"><span>${o.method === "pickup" ? "Store pickup" : "Delivery"}</span><span>${o.ship ? rs(o.ship) : "Free"}</span></div>
        <div class="summary__total"><span>Total</span><span class="price">${rs(o.total)}</span></div>
      </div></div>`;
  }
  function pageOrder() {
    const o = Orders.find(params.get("no") || "") || Orders.all()[0];
    const el = $("#order");
    if (!o) { el.innerHTML = `<div class="empty"><div class="empty__ic">${icon("box")}</div><h3>We couldn't find that order</h3><p>Check the order number, or look it up from the tracking page.</p><a class="btn btn--dark" href="track.html">Track an order</a></div>`; return; }
    const first = esc(o.name.split(" ")[0]);
    const when2 = o.method === "pickup" ? "Your order will be ready at our Gulshan-e-Iqbal store 4 to 6 hours after we confirm it." : o.eta ? `Expected delivery: ${esc(o.eta)}${o.slot ? `, ${esc(o.slot)}` : ""}, once confirmed.` : "";
    const payInfo = o.pay !== "cod" ? `<div class="pay-box">${icon("shield")}<div><strong>Paying by ${PAY[o.pay]}</strong><p>${STORE.payments?.[o.pay] ? `Send ${rs(o.total)} to <b>${esc(STORE.payments[o.pay])}</b> with your order number <b>${esc(o.no)}</b> as the reference, then share the screenshot on WhatsApp.` : `We'll send the account details on WhatsApp when we confirm your order. Please don't pay before then.`}</p></div></div>` : "";
    el.innerHTML = o.sent
      ? `<div class="confirm__head"><div class="confirm__tick">${icon("check")}</div><h1>Thank you, ${first}</h1>
        <p>Your order has reached the shop. We'll call or WhatsApp you at ${esc(o.phone)} to confirm it. ${when2}</p></div>`
      : `<div class="confirm__head"><div class="confirm__tick confirm__tick--wait">${icon("wa")}</div><h1>Almost done, ${first}</h1>
        <p>Your order is saved. <strong>Send it to the shop on WhatsApp</strong> so we can start packing; the message is written for you, just press send. We'll confirm on ${esc(o.phone)}. ${when2}</p>
        <a class="btn btn--wa btn--lg confirm__send" target="_blank" rel="noopener" href="${waOrder(o)}" data-sent-wa>${icon("wa")}Send my order to the shop</a></div>`;
    el.insertAdjacentHTML("beforeend", `${payInfo}${invoice(o)}
      <div class="confirm__actions">${o.sent ? `<a class="btn btn--wa" target="_blank" rel="noopener" href="${waOrder(o)}">${icon("wa")}Message the shop</a>` : ""}
        <a class="btn btn--ghost" href="track.html?no=${o.no}">${icon("truck")}Track this order</a><button class="btn btn--ghost" data-print>${icon("print")}Print receipt</button></div>`);
    $("[data-print]", el).addEventListener("click", () => print());
    /* remember that the customer opened WhatsApp with the order */
    $("[data-sent-wa]", el)?.addEventListener("click", () => { const all = Orders.all(); const x = all.find((y) => y.no === o.no); if (x) { x.waOpened = true; store.set("asif_orders_v1", all); } });
  }

  /* ---------------------------------------------------- page: tracking */
  function pageTrack() {
    const form = $("#track-form"), out = $("#track-out");
    const show = (o) => {
      if (!o) { out.innerHTML = `<div class="empty" style="margin-top:24px"><div class="empty__ic">${icon("search")}</div><h3>No order found</h3><p>Check the number on your confirmation, for example AB-123456. Orders placed on another device can be tracked by calling the shop.</p></div>`; return; }
      /* only steps the shop has confirmed are shown as done; o.stage is set by the shop's order system once connected */
      const stage = Math.max(1, o.stage || 1);
      const waiting = stage === 1;
      out.innerHTML = `<div class="acc-card" style="margin-top:24px"><div class="order-row" style="border:0;padding-top:0"><div><strong>${esc(o.no)}</strong><small>${when(o.date)}, ${qtyOf(o.items)} items</small></div><span class="pill">${waiting ? "Waiting for the shop to confirm" : ORDER_STAGES[stage]}</span><strong>${rs(o.total)}</strong></div>
        <ol class="timeline">${ORDER_STAGES.map((s, i) => `<li class="${i < stage ? "done" : i === stage ? "now" : ""}"><strong>${o.method === "pickup" && i === 3 ? "Ready for pickup" : s}</strong><small>${i < stage ? "Done" : i === stage ? (waiting ? "The shop will call or WhatsApp you" : "In progress") : "Next"}</small></li>`).join("")}</ol>
        ${!o.sent && !o.waOpened ? `<div class="pay-box">${icon("wa")}<div><strong>Have you sent this order to the shop?</strong><p>The shop starts once it receives your order on WhatsApp.</p><a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="${waOrder(o)}">Send it now</a></div></div>` : ""}
        <p class="note">For an update any time, call or WhatsApp the shop on ${esc(STORE.phone)} with your order number.</p></div>`;
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); const v = $("#track-no").value; history.replaceState(null, "", `track.html?no=${encodeURIComponent(v.trim())}`); show(Orders.find(v)); });
    if (params.get("no")) { $("#track-no").value = params.get("no"); show(Orders.find(params.get("no"))); }
    const recent = Orders.all().slice(0, 3);
    if (recent.length) $("#track-recent").innerHTML = `Your recent orders: ${recent.map((o) => `<a class="text-link" href="track.html?no=${o.no}">${o.no}</a>`).join(", ")}`;
  }

  /* ----------------------------------------------------- page: account */
  function pageAccount() {
    const nav = $("#acc-nav"), out = $("#acc-out");
    const sections = {
      orders() {
        const os = Orders.all();
        return `<div class="acc-card"><h3>Your orders</h3>${os.length ? os.map((o) => `<div class="order-row"><div><strong>${esc(o.no)}</strong><small>${when(o.date, { dateStyle: "medium" })}, ${o.items.reduce((s, i) => s + i.qty, 0)} items, ${PAY[o.pay]}</small></div><strong>${rs(o.total)}</strong><span style="display:flex;gap:8px;flex-wrap:wrap"><a class="btn btn--ghost btn--sm" href="order.html?no=${o.no}">Receipt</a><button class="btn btn--dark btn--sm" data-reorder="${o.no}">Order again</button></span></div>`).join("") : `<p class="note">No orders yet. Your receipts will appear here after checkout.</p>`}</div>`;
      },
      children() {
        const kids = store.get("asif_children", []);
        return `<div class="acc-card"><h3>Children and school lists</h3><p class="note" style="margin-bottom:16px">Save each child's school and class to reload their book list in one tap next session.</p>
          ${kids.map((k, i) => { const sc = getSchool(k.school), cl = getClass(k.cls); return sc && cl ? `<div class="child"><span class="crest" style="background:${sc.color};width:44px;height:44px">${sc.short}</span><div><strong>${esc(k.name || "Child " + (i + 1))}</strong><small class="note" style="display:block">${esc(sc.name)}, ${esc(cl.name)}</small></div><span style="display:flex;gap:8px;align-items:center"><a class="btn btn--primary btn--sm" href="school-lists.html?school=${k.school}&class=${k.cls}">Open list</a><button class="icon-btn" data-kid-rm="${i}" aria-label="Remove">${icon("trash")}</button></span></div>` : ""; }).join("")}
          <form class="form-grid" id="kid-form" style="margin-top:16px"><label class="field"><span>Child's name</span><input class="input" name="kidname"></label>
            <label class="field"><span>School</span><select class="select" name="school">${SCHOOLS.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></label>
            <label class="field"><span>Class</span><select class="select" name="cls">${CLASSES.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></label>
            <div class="field" style="justify-content:flex-end"><button class="btn btn--dark" type="submit">${icon("plus")}Add child</button></div></form></div>`;
      },
      details() {
        const p = store.get("asif_profile", {});
        return `<div class="acc-card"><h3>Your details</h3><form class="form-grid" id="prof-form">
          <label class="field"><span>Full name</span><input class="input" name="fullname" value="${esc(p.name)}" autocomplete="name"></label>
          <label class="field"><span>Mobile number</span><input class="input" name="phone" value="${esc(p.phone)}" autocomplete="tel"></label>
          <label class="field full"><span>Email</span><input class="input" name="email" value="${esc(p.email)}" autocomplete="email"></label>
          <label class="field full"><span>Delivery address</span><input class="input" name="address" value="${esc(p.address)}" autocomplete="street-address"></label>
          <label class="field"><span>Area</span><select class="select" name="area"><option value="">Choose area</option>${DELIVERY_AREAS.map((a) => `<option${a.name === p.area ? " selected" : ""}>${esc(a.name)}</option>`).join("")}</select></label>
          <div class="field" style="justify-content:flex-end"><button class="btn btn--dark" type="submit">Save details</button></div></form>
          <p class="note" style="margin-top:14px">These details fill checkout for you. They're kept on this device until the shop's account system is connected.</p></div>`;
      },
      saved() {
        const ids = [...Saved.ids].filter(getProduct);
        return `<div class="acc-card"><h3>Saved items</h3>${ids.length ? `<div class="grid grid--3">${ids.map((id) => card(getProduct(id))).join("")}</div>` : `<p class="note">Tap the heart on any product to save it here.</p>`}</div>`;
      },
    };
    const go = (k) => {
      $$("[data-acc]", nav).forEach((b) => b.setAttribute("aria-selected", b.dataset.acc === k));
      out.innerHTML = sections[k](); $$(".reveal", out).forEach((c) => c.classList.add("in"));
      history.replaceState(null, "", `account.html#${k}`);
      wire(k);
    };
    function wire(k) {
      if (k === "children") {
        $("#kid-form").addEventListener("submit", (e) => { e.preventDefault(); const f = e.target; const kids = store.get("asif_children", []); kids.push({ name: f.kidname.value.trim(), school: f.school.value, cls: f.cls.value }); store.set("asif_children", kids); toast("Child added", false); go("children"); });
        $$("[data-kid-rm]").forEach((b) => b.addEventListener("click", () => { const kids = store.get("asif_children", []); kids.splice(Number(b.dataset.kidRm), 1); store.set("asif_children", kids); go("children"); }));
      }
      if (k === "details") $("#prof-form").addEventListener("submit", (e) => { e.preventDefault(); const f = e.target; store.set("asif_profile", { name: f.fullname.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), address: f.address.value.trim(), area: f.area.value }); toast("Details saved", false); greet(); });
      if (k === "orders") $$("[data-reorder]").forEach((b) => b.addEventListener("click", () => { const o = Orders.find(b.dataset.reorder); o.items.forEach((i) => getProduct(i.id) && Cart.add(i.id, i.qty, i.opt, true)); toast(`${o.items.length} items added to your cart`); openDrawer(); }));
    }
    const greet = () => { const p = store.get("asif_profile", {}); $("#acc-hello").textContent = p.name ? `Hello, ${p.name.split(" ")[0]}` : "Your account"; };
    nav.addEventListener("click", (e) => { const b = e.target.closest("[data-acc]"); if (b) go(b.dataset.acc); });
    document.addEventListener("saved:change", () => { if ($('[data-acc="saved"]').getAttribute("aria-selected") === "true") go("saved"); });
    greet();
    go(sections[location.hash.slice(1)] ? location.hash.slice(1) : "orders");
  }

  /* ---------------------------------------------------- page: wishlist */
  function pageWishlist() {
    const draw = () => {
      const ids = [...Saved.ids].filter(getProduct);
      $("#wish").innerHTML = ids.length ? `<div class="grid">${ids.map((id, i) => card(getProduct(id), i)).join("")}</div>` : `<div class="empty"><div class="empty__ic">${icon("heart")}</div><h3>Nothing saved yet</h3><p>Tap the heart on any product and it will wait for you here.</p><a class="btn btn--dark" href="shop.html">Browse the shop</a></div>`;
      $$(".reveal", $("#wish")).forEach((c) => c.classList.add("in"));
    };
    document.addEventListener("saved:change", draw);
    draw();
  }

  function pagePolicies() {
    const links = $$(".policy__nav a");
    if (!io) return;
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("is-on", a.hash === "#" + e.target.id)); }), { rootMargin: "-30% 0px -60% 0px" });
    $$(".policy section").forEach((s) => obs.observe(s));
  }

  function pageNotFound() {
    $("#nf-case").innerHTML = `<div class="bookcase"><div class="bookcase__inner">${bay(getClass("5"), 404, { plate: false, link: false })}</div></div>`;
  }

  /* glass buttons and tabs: a soft highlight follows the pointer */
  function wireGlass() {
    if (reduced || !finePointer) return;
    let raf = 0, ev = null;
    document.addEventListener("pointermove", (e) => {
      ev = e; if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const b = ev.target.closest?.(".btn, .tab, .seg button, .chip, .kdot, .kchip, .add-btn"); if (!b) return;
        const r = b.getBoundingClientRect();
        b.style.setProperty("--gx", ((ev.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        b.style.setProperty("--gy", ((ev.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      });
    }, { passive: true });
  }

  /* product images lean toward the pointer with a soft glare */
  function wireTilt() {
    if (reduced || !finePointer) return;
    let el = null, ev = null, raf = 0;
    const reset = (n) => { n.style.setProperty("--rx", "0deg"); n.style.setProperty("--ry", "0deg"); n.classList.remove("is-tilting"); };
    document.addEventListener("pointermove", (e) => {
      const m = e.target.closest ? e.target.closest(".card__media, .gallery__stage[data-zoom], .bopt") : null;
      if (el && el !== m) reset(el);
      el = m; ev = e;
      if (!m || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0; if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        el.style.setProperty("--ry", ((px - 0.5) * 14).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - py) * 12).toFixed(2) + "deg");
        el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        el.classList.add("is-tilting");
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => { if (el) reset(el); el = null; });
  }

  /* buttery wheel scrolling on desktop; touch keeps native scrolling */
  function wireSmoothScroll() {
    $$(".drawer__body, .modal__box, .filters, .mini-items, .suggest").forEach((el) => el.setAttribute("data-lenis-prevent", ""));
    if (!window.Lenis || reduced || !finePointer) return;
    lenis = new window.Lenis({ duration: 0.85, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
      const t = document.querySelector(a.getAttribute("href")); if (!t) return;
      e.preventDefault(); lenis.scrollTo(t, { offset: -78 });
    });
  }

  /* ------------------------------------------------- Urdu for the main buttons and checkout */
  const UR = {
    "School book lists": "اسکول کی بک لسٹ", "Books": "کتابیں", "Uniforms": "یونیفارم", "Stationery": "اسٹیشنری", "Novels": "ناول", "Home": "ہوم", "Lists": "لسٹیں", "Shop": "دکان", "In cart": "کارٹ میں", "Bags & bottles": "بستے اور بوتلیں", "Offers": "آفرز",
    "About us": "ہمارے بارے میں", "Visit the store": "دکان کا پتہ", "Book lists": "بک لسٹ", "Account": "اکاؤنٹ", "Saved": "پسندیدہ", "Cart": "کارٹ",
    "Track an order": "آرڈر ٹریک کریں", "Help": "مدد", "Build my school kit": "اسکول کِٹ بنائیں", "Browse the shop": "دکان دیکھیں",
    "Your school": "آپ کا اسکول", "Their class": "بچے کی کلاس", "Kit total": "کِٹ کی کل قیمت", "Add kit to cart": "کِٹ کارٹ میں شامل کریں", "Review every title": "تمام کتابیں دیکھیں",
    "Textbooks": "درسی کتابیں", "Registers and copies": "رجسٹر اور کاپیاں", "Stationery essentials": "ضروری اسٹیشنری", "Uniform set": "یونیفارم سیٹ", "School bag": "اسکول بیگ",
    "Add": "شامل کریں", "Size": "سائز", "Add to cart": "کارٹ میں شامل کریں", "Shop everything": "تمام اشیاء دیکھیں", "Add uniform to cart": "یونیفارم کارٹ میں شامل کریں",
    "Your cart": "آپ کا کارٹ", "Checkout": "چیک آؤٹ", "View cart": "کارٹ دیکھیں", "Remove": "ہٹائیں", "Remove all": "سب ہٹائیں", "Save for later": "بعد کے لیے رکھیں",
    "Subtotal": "ذیلی کل", "Total": "کل", "Continue shopping": "خریداری جاری رکھیں", "Order summary": "آرڈر کا خلاصہ", "Empty cart": "کارٹ خالی کریں",
    "Your cart is empty": "آپ کا کارٹ خالی ہے", "Find my school list": "میری اسکول لسٹ", "Contact details": "رابطے کی تفصیل", "Full name": "پورا نام", "Mobile number": "موبائل نمبر",
    "Email (optional, for your receipt)": "ای میل (اختیاری، رسید کے لیے)", "Delivery or pickup": "ڈیلیوری یا دکان سے وصولی", "Home delivery": "گھر پر ڈیلیوری",
    "Anywhere in Karachi": "کراچی میں کہیں بھی", "Store pickup": "دکان سے وصولی", "Address": "پتہ", "Area": "علاقہ", "Nearest landmark (optional)": "قریبی نشانی (اختیاری)",
    "Delivery time": "ڈیلیوری کا وقت", "Payment": "ادائیگی", "Cash on delivery or at pickup": "ڈیلیوری یا وصولی پر نقد ادائیگی", "Pay when you receive the order": "آرڈر ملنے پر ادائیگی کریں",
    "Order notes (optional)": "آرڈر کے بارے میں ہدایات (اختیاری)", "Save my details on this device for next time": "اگلی بار کے لیے میری تفصیل اس ڈیوائس پر محفوظ کریں",
    "Your order": "آپ کا آرڈر", "Delivery": "ڈیلیوری", "Place order": "آرڈر دیں", "Contact": "رابطہ", "Free": "مفت", "Apply": "لاگو کریں", "Child's name": "بچے کا نام",
    "Send my order to the shop": "آرڈر دکان کو بھیجیں", "Track this order": "آرڈر ٹریک کریں", "Print receipt": "رسید پرنٹ کریں",
    "Shop": "خریداری", "Your orders": "آپ کے آرڈر", "Visit us": "ہم سے ملیں", "Back to top": "اوپر جائیں", "Send the list": "لسٹ بھیجیں",
    "Stuck on the school list?": "اسکول کی لسٹ میں مشکل؟", "Send us a photo on WhatsApp and we'll price the whole list for you.": "لسٹ کی تصویر واٹس ایپ پر بھیجیں، ہم پوری لسٹ کی قیمت بتا دیں گے۔",
    "Search by title, subject, class or school": "کتاب، مضمون، کلاس یا اسکول تلاش کریں",
  };
  UR[`Free delivery across Karachi on orders over ${rs(STORE.freeDeliveryOver)}`] = `${rs(STORE.freeDeliveryOver)} سے زائد کے آرڈر پر کراچی بھر میں مفت ڈیلیوری`;
  const original = new WeakMap();
  let urdu = store.get("asif_lang", "en") === "ur", trTimer;
  function translate(root = document.body) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement?.closest("script,style,svg,.cover,.book3d,[data-no-tr]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach((n) => {
      const orig = original.get(n) ?? n.nodeValue, key = orig.trim();
      if (urdu && UR[key]) { if (!original.has(n)) original.set(n, orig); const v = orig.replace(key, UR[key]); if (n.nodeValue !== v) n.nodeValue = v; }
      else if (!urdu && original.has(n)) { n.nodeValue = orig; original.delete(n); }
    });
    $$("input[placeholder]", root).forEach((i) => { const o = i.dataset.ph ?? i.placeholder; if (urdu && UR[o]) { i.dataset.ph = o; i.placeholder = UR[o]; } else if (!urdu && i.dataset.ph) { i.placeholder = i.dataset.ph; delete i.dataset.ph; } });
  }
  function setLang(ur) {
    urdu = ur; store.set("asif_lang", ur ? "ur" : "en");
    document.documentElement.lang = ur ? "ur" : "en"; document.documentElement.classList.toggle("is-ur", ur);
    if (ur && !$("#ur-font")) document.head.insertAdjacentHTML("beforeend", '<link id="ur-font" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@500;700&display=swap">');
    $$("[data-lang]").forEach((b) => { b.textContent = ur ? "English" : "اردو"; b.lang = ur ? "en" : "ur"; b.setAttribute("aria-label", ur ? "Switch to English" : "اردو میں دیکھیں"); });
    translate();
  }
  function wireLang() {
    setLang(urdu);
    document.addEventListener("click", (e) => { if (e.target.closest("[data-lang]")) setLang(!urdu); });
    /* content drawn later (cart, kit, checkout) is translated as it appears */
    new MutationObserver(() => { if (!urdu) return; clearTimeout(trTimer); trTimer = setTimeout(() => translate(), 60); }).observe(document.body, { childList: true, subtree: true });
  }

  /* opening sequence on the home page, once per visit: four photo panels rise, the name sets, the panels part */
  function wireIntro() {
    const root = document.documentElement;
    if (!root.classList.contains("intro-on")) return;
    try { sessionStorage.setItem("asif_intro", "1"); } catch (e) { /* private mode */ }
    const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=560&h=960`;
    const el = document.createElement("div");
    el.className = "intro";
    el.innerHTML = `<div class="intro__panels" aria-hidden="true">${HERO_SLIDES.map((sl, i) => `<div class="intro__p" style="--i:${i}"><img src="${u(sl.photo)}" alt="" decoding="async"><span>${esc(sl.title)}</span></div>`).join("")}</div>
      <div class="intro__lock">
        <span class="intro__tile"><img src="assets/mark-yellow.png" alt="" width="48" height="47"></span>
        <p class="intro__name" aria-label="${esc(STORE.name)}">${["Asif", "Books", "&amp;", "Uniform"].map((w, i) => `<span aria-hidden="true"><i style="--w:${i}">${w}</i></span>`).join(" ")}</p>
        <p class="intro__sub">${esc(STORE.area)}</p>
        <span class="intro__bar" aria-hidden="true"><i></i></span>
      </div>
      <button class="intro__skip" type="button">Skip intro</button>`;
    document.body.appendChild(el);
    let done = false, t1, t2;
    const out = () => {
      if (done) return; done = true; clearTimeout(t1); clearTimeout(t2);
      el.classList.add("is-out"); root.classList.remove("intro-on");
      document.removeEventListener("keydown", key);
      setTimeout(() => el.remove(), 1050);
    };
    const key = (e) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); out(); } };
    el.addEventListener("click", out);
    document.addEventListener("keydown", key);
    const imgs = $$("img", $(".intro__panels", el));
    const go = () => { if (done || el.classList.contains("is-go")) return; el.classList.add("is-go"); t2 = setTimeout(out, 2300); };
    Promise.all(imgs.map((im) => (im.complete ? 1 : new Promise((r) => { im.onload = im.onerror = r; })))).then(() => setTimeout(go, 350));
    t1 = setTimeout(go, 1500);
  }

  /* ---------------------------------------------------------- boot */
  function boot() {
    wireIntro();
    const h = $("#site-header"), f = $("#site-footer");
    if (h) h.outerHTML = header();
    if (f) f.outerHTML = footer();
    document.body.insertAdjacentHTML("beforeend", overlays());
    $$("[data-store]").forEach((el) => (el.textContent = STORE[el.dataset.store]));
    $$("[data-photo]").forEach((el) => (el.outerHTML = img(el.dataset.photo, Number(el.dataset.w) || 1600, el.dataset.alt || "", el.hasAttribute("data-eager"))));

    document.addEventListener("click", (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        flyToCart(add.closest(".card")?.querySelector(".card__art > *"));
        const inCard = add.closest(".card[data-pid]");
        Cart.add(add.dataset.add);
        if (inCard) { const q = $(".cqty", inCard); q.classList.remove("pop"); void q.offsetWidth; q.classList.add("pop"); $("[data-cinc]", q).focus({ preventScroll: true }); return; }
        add.classList.add("is-done"); add.innerHTML = icon("check") + "<span>Added</span>";
        setTimeout(() => { add.classList.remove("is-done"); add.innerHTML = icon("plus") + "<span>Add</span>"; }, 1400);
        return;
      }
      const cstep = e.target.closest("[data-cinc], [data-cdec]");
      if (cstep) {
        const up = cstep.hasAttribute("data-cinc"), k = Cart.key(up ? cstep.dataset.cinc : cstep.dataset.cdec, ""), it = Cart.items.find((x) => x.k === k);
        if (!it) return;
        if (up) Cart.set(k, it.qty + 1);
        else if (it.qty <= 1) { const c = cstep.closest(".card"); Cart.remove(k); c && $(".add-btn", c).focus({ preventScroll: true }); }
        else Cart.set(k, it.qty - 1);
        return;
      }
      const sv = e.target.closest("[data-save]");
      if (sv) {
        const on = Saved.toggle(sv.dataset.save);
        sv.classList.remove("pop"); void sv.offsetWidth; if (on) sv.classList.add("pop");
        toast(on ? `${getProduct(sv.dataset.save).name} saved` : "Removed from saved items", false);
        document.dispatchEvent(new Event("saved:change"));
        return;
      }
      const qv = e.target.closest("[data-qv]");
      if (qv) { e.preventDefault(); quickView(qv.dataset.qv); return; }
      if (e.target.closest("[data-open-cart]")) { e.preventDefault(); openDrawer(); return; }
      if (e.target.closest("[data-close-cart]") || e.target.matches("[data-scrim]")) { closeDrawer(); $("#filters")?.classList.remove("open"); $("[data-scrim]").classList.remove("show"); return; }
      if (e.target.closest("[data-close-modal]")) { closeModal(); return; }
      const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-rm]");
      if (inc) { const it = Cart.items.find((i) => i.k === inc.dataset.inc); Cart.set(it.k, it.qty + 1); }
      if (dec) { const it = Cart.items.find((i) => i.k === dec.dataset.dec); it.qty <= 1 ? leave(it.k, () => Cart.remove(it.k)) : Cart.set(it.k, it.qty - 1); }
      if (rm) { const k = rm.dataset.rm; leave(k, () => { if (rm.hasAttribute("data-later-list")) { Cart.later = Cart.later.filter((i) => i.k !== k); Cart.save(); } else Cart.remove(k); }); }
      const lt = e.target.closest("[data-later]"); if (lt) leave(lt.dataset.later, () => Cart.toLater(lt.dataset.later));
      const fl = e.target.closest("[data-from-later]"); if (fl) Cart.fromLater(fl.dataset.fromLater);
      const sq = e.target.closest("[data-setq]"); if (sq) { Cart.set(sq.dataset.setq, Number(sq.dataset.n)); return; }
      const rg = e.target.closest("[data-rm-grp]"); if (rg) { const g = rg.dataset.rmGrp; Cart.removeGroup(g); toast(`${g} removed`, false); return; }
      if (e.target.closest("[data-empty-cart]")) {
        openModal(`<div class="dup"><h3>Empty your cart?</h3><p>This removes all ${Cart.count()} items. Saved-for-later items stay.</p><div class="dup__actions"><button class="btn btn--primary" data-empty-yes>Empty cart</button><button class="btn btn--ghost" data-close-modal>Keep my items</button></div></div>`);
        $("[data-empty-yes]").addEventListener("click", () => { Cart.clear(); closeModal(); toast("Your cart is empty", false); });
        return;
      }
      const m = e.target.closest("[data-menu]");
      if (m) { const n = $("[data-nav]"); const open = n.classList.toggle("open"); m.setAttribute("aria-expanded", open); m.innerHTML = icon(open ? "x" : "menu"); }
    });
    /* removed rows slide out before the list re-renders */
    function leave(k, then) {
      const rows = $$(`[data-ci="${CSS.escape(k)}"]`);
      if (reduced || !rows.length) { then(); return; }
      rows.forEach((r) => r.classList.add("is-leaving"));
      setTimeout(then, 280);
    }
    document.addEventListener("submit", (e) => {
      if (!e.target.matches("[data-promo]")) return;
      e.preventDefault();
      const inp = $("input", e.target);
      const code = inp.value.trim().toUpperCase();
      const msg = e.target.parentElement.querySelector("[data-promo-msg]");
      if (!code) { Cart.promo = ""; Cart.save(); return; }
      if (!PROMOS[code]) { msg.className = "promo-msg err"; msg.textContent = "That code isn't valid. Check the spelling and try again."; inp.animate([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], 300); return; }
      Cart.promo = code; Cart.save();
      toast(discountFor(Cart.subtotal()) ? `${code} applied` : `${code} saved. Spend ${rs(PROMOS[code].min)} to use it`, false);
    });
    document.addEventListener("change", (e) => { const q = e.target.closest("[data-qty]"); if (q) Cart.set(q.dataset.qty, parseInt(q.value) || 1); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-to-top]")) { lenis ? lenis.scrollTo(0) : scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); } });
    const hdr = $("[data-header]");
    let scrolled = null, ticking = false, lastY = scrollY, travel = 0, hidden = false;
    const setHidden = (h) => { if (h === hidden || !hdr) return; hidden = h; hdr.classList.toggle("is-hidden", h); document.documentElement.classList.toggle("hdr-hidden", h); };
    const scrollBar = $("[data-scroll-bar]");
    /* a soft ripple spreads from where a button, tab or chip is pressed */
    if (!reduced) document.addEventListener("pointerdown", (e) => {
      const b = e.target.closest?.(".btn, .add-btn, .tab, .chip, .seg button, .kdot, .kchip, .tabbar a, .tabbar button"); if (!b || b.disabled) return;
      const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2, s = document.createElement("span");
      s.className = "ripple"; s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(s); setTimeout(() => s.remove(), 650);
    }, { passive: true });
    const busy = () => hdr && (hdr.matches(":focus-within") || $(".has-mega.is-open", hdr) || $('[data-menu][aria-expanded="true"]', hdr) || document.body.style.overflow === "hidden");
    addEventListener("scroll", () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY, s = y > 8;
        if (s !== scrolled) { scrolled = s; hdr?.classList.toggle("is-scrolled", s); }
        if (scrollBar) scrollBar.style.transform = `scaleX(${Math.min(1, y / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4)})`;
        const dy = y - lastY; lastY = y;
        travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy; /* distance moved in one direction */
        if (y < 160) setHidden(false);
        else if (travel > 24 && !busy()) setHidden(true);
        else if (travel < -10) setHidden(false);
        ticking = false;
      });
    }, { passive: true });
    hdr?.addEventListener("focusin", () => setHidden(false));
    const navUl = $(".nav > .wrap > ul");
    if (navUl && finePointer && !reduced) {
      const glow = document.createElement("span"); glow.className = "nav__glow"; glow.setAttribute("aria-hidden", "true"); navUl.prepend(glow);
      navUl.addEventListener("pointerover", (e) => {
        const a = e.target.closest(".nav > .wrap > ul > li > a"); if (!a) return;
        const r = a.getBoundingClientRect(), u = navUl.parentElement.getBoundingClientRect();
        glow.style.width = r.width + "px"; glow.style.transform = `translate3d(${r.left - u.left}px,0,0)`; glow.classList.add("on");
      });
      navUl.addEventListener("pointerleave", () => glow.classList.remove("on"));
    }
    $$(".has-mega").forEach((li) => {
      const load = () => { $$("img[data-src]", li).forEach((i) => { i.src = i.dataset.src; i.removeAttribute("data-src"); }); wireImages(li); };
      li.addEventListener("pointerenter", load, { once: true });
      li.addEventListener("focusin", load, { once: true });
      /* the panel opens only when the pointer rests on the menu word, so crossing the bar on the way to the page never opens it */
      const link = li.firstElementChild; let t;
      link.addEventListener("pointerenter", (e) => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(t);
        t = setTimeout(() => { $$(".has-mega.is-open").forEach((x) => x !== li && x.classList.remove("is-open")); li.classList.add("is-open"); }, 170);
      });
      link.addEventListener("pointerleave", () => { if (!li.classList.contains("is-open")) clearTimeout(t); });
      li.addEventListener("pointerenter", () => { if (li.classList.contains("is-open")) clearTimeout(t); });
      li.addEventListener("pointerleave", () => { clearTimeout(t); t = setTimeout(() => li.classList.remove("is-open"), 140); });
      li.addEventListener("keydown", (e) => { if (e.key === "Escape") { li.classList.remove("is-open"); document.activeElement?.blur(); } });
    });
    /* returning via back/forward, or changes made in another tab, refresh the counts */
    const resync = () => {
      Cart.items = store.get("asif_cart_v1", []); Cart.later = store.get("asif_later_v1", []); Cart.promo = store.get("asif_promo_v1", ""); Cart.bundle = store.get("asif_bundle_v1", null);
      Saved.ids = new Set(store.get("asif_saved_v1", []));
      renderCartUI(); renderSavedUI();
    };
    addEventListener("pageshow", (e) => { if (e.persisted) resync(); });
    addEventListener("storage", (e) => { if (e.key && e.key.startsWith("asif_")) resync(); });

    ({ home: pageHome, shop: pageShop, product: pageProduct, lists: pageLists, uniforms: pageUniforms, checkout: pageCheckout, order: pageOrder, track: pageTrack, account: pageAccount, wishlist: pageWishlist, policies: pagePolicies, notfound: pageNotFound }[page] || (() => {}))();
    wireLang();
    wireGlass();
    /* looping animations rest while their section is off screen */
    if (io) { const o = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)), { rootMargin: "100px" }); $$(".offers, .signup, .names, .kit-section").forEach((el) => o.observe(el)); }
    wireSuggest();
    wireImages();
    splitWords();
    reveal();
    wireTilt();
    wireSmoothScroll();
    renderCartUI();
    renderSavedUI();
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
