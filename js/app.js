/* Harvard ASTRO1: a self-paced course app for ASTRON 1. No build step, no server: plain files. */
(function () {
  "use strict";
  const C = window.COURSE;
  const MAN = window.MANIFEST || {};
  const MEDIA = window.MEDIA;
  const MAT = window.MATERIALS || {};
  const LEC = window.LECTURES || {};
  const LAB = window.LAB || { tools: {}, flows: {}, constants: [] };
  const MASTERY = 0.8;
  // Visitor counter: one hit per browser, on first launch. Only a number is stored on the counter service.
  // Local test runs (localhost) count into a separate dev counter so they don't inflate the real number.
  const IS_DEV = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const COUNTER = { base: "https://abacus.jasoncameron.dev", ns: IS_DEV ? "astro1-course-f26-dev" : "astro1-course-f26", key: "explorers" };

  const main = document.getElementById("main");
  const sidebar = document.getElementById("sidebar");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").replace(/[‐-―-]/g, "-").replace(/\s+/g, "").toLowerCase();
  const chap = (id) => C.chapters.find((c) => c.id === id);
  const pct = (x) => Math.round(100 * x) + "%";
  const pad2 = (n) => String(n).padStart(2, "0");
  const lecNum = (id) => "L" + pad2(String(id).replace(/\D/g, ""));
  const fmtInt = (n) => (n == null ? "–" : Number(n).toLocaleString("en-US"));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };

  /* ---------------- the explorer's name ---------------- */
  const NAME_KEY = "astro1.name", COUNTED_KEY = "astro1.counted";
  let NAME = cleanName(store.get(NAME_KEY) || "");
  function cleanName(s) { return String(s || "").replace(/[<>{}\[\]\\/"`=;]/g, "").replace(/\s+/g, " ").trim().slice(0, 24); }
  const nm = () => esc(NAME || "explorer");
  function greeting() { const h = new Date().getHours(); return h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; }

  /* ---------------- visitor counter ---------------- */
  let explorers = null;
  const counted = () => { try { return JSON.parse(store.get(COUNTED_KEY) || "null"); } catch (e) { return null; } };
  async function counterGet() {
    try {
      const r = await fetch(`${COUNTER.base}/get/${COUNTER.ns}/${COUNTER.key}`, { cache: "no-store" });
      if (r.status === 404) return 0;
      const j = await r.json();
      return typeof j.value === "number" ? j.value : null;
    } catch (e) { return null; }
  }
  async function counterHit() {
    try {
      const r = await fetch(`${COUNTER.base}/hit/${COUNTER.ns}/${COUNTER.key}`, { cache: "no-store" });
      const j = await r.json();
      return typeof j.value === "number" ? j.value : null;
    } catch (e) { return null; }
  }
  async function countMeOnce() {
    if (counted()) return;
    const n = await counterHit();
    if (n == null) return; // offline: try again next visit
    store.set(COUNTED_KEY, JSON.stringify({ n, t: Date.now() }));
    explorers = n;
    paintCounters();
  }
  function explorersLine() {
    if (explorers == null) return "explorer count offline";
    return `<b>${fmtInt(explorers)}</b> ${explorers === 1 ? "explorer has" : "explorers have"} launched this course`;
  }
  function paintCounters() {
    $$("[data-explorers]").forEach((el) => { el.innerHTML = explorersLine(); });
    $$("[data-explorers-n]").forEach((el) => { el.textContent = fmtInt(explorers); });
  }

  /* ---------------- toast ---------------- */
  let toastT = 0;
  function toast(html) {
    const t = $("#toast");
    t.innerHTML = html; t.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3600);
  }

  /* ---------------- questions ---------------- */
  const QB = {}; // chapter id -> [{id, ch, s, q, o, a, e}]
  const QBYID = {};
  Object.entries(window.QUIZ || {}).forEach(([ch, list]) => {
    QB[ch] = list.map((q, i) => {
      const item = Object.assign({ id: ch + "." + (i + 1), ch }, q);
      QBYID[item.id] = item;
      return item;
    });
  });
  // Lecture questions live in the same id space ("L6.1"), so they can be answered, recorded and reviewed like the rest.
  const LQ = {};
  Object.entries(LEC).forEach(([lid, d]) => {
    LQ[lid] = (d.quiz || []).map((q, i) => { const item = Object.assign({ id: lid + "." + (i + 1), lec: lid }, q); QBYID[item.id] = item; return item; });
  });

  /* ---------------- progress (this browser only) ---------------- */
  const KEY = "astro1.progress.v1";
  const blank = () => ({ seen: {}, checks: {}, quiz: {}, exams: [], wrong: {}, videos: {}, lec: {}, hwcheck: {}, last: null, started: Date.now() });
  let P = blank();
  try { P = Object.assign(blank(), JSON.parse(store.get(KEY) || "{}")); } catch (e) { /* ignore */ }
  function save() { store.set(KEY, JSON.stringify(P)); }

  function recordAnswer(q, ok, where) {
    const prev = P.checks[q.id] || { n: 0, ok: 0 };
    P.checks[q.id] = { n: prev.n + 1, ok: prev.ok + (ok ? 1 : 0), last: ok, t: Date.now(), where };
    if (ok) delete P.wrong[q.id]; else P.wrong[q.id] = Date.now();
    save();
  }

  /* ---------------- course structure ---------------- */
  function pagesOf(id) {
    const secs = (MAN[id] && MAN[id].sections) || [];
    return [{ kind: "intro", key: "intro", title: "Overview" }].concat(secs, [{ kind: "quiz", key: "quiz", title: "Recap & chapter quiz" }]);
  }
  function pageLabel(p) {
    if (p.kind === "section") return p.key + " · " + p.title;
    if (p.kind === "practice") return "Practice: exam-style questions";
    if (p.kind === "further") return "Going further: homework & deeper physics";
    return p.title;
  }
  function pageIndex(id, arg) {
    const pages = pagesOf(id);
    if (arg === undefined || arg === "") return 0;
    if (/^\d+$/.test(arg)) return Math.min(+arg, pages.length - 1);
    const i = pages.findIndex((p) => norm(p.key) === norm(arg));
    return i < 0 ? 0 : i;
  }
  const seen = (id, i) => !!P.seen[id + "/" + i];
  function chapterProgress(id) {
    const pages = pagesOf(id);
    let done = 0;
    pages.forEach((p, i) => { if (seen(id, i)) done++; });
    const quiz = P.quiz[id];
    return { done, total: pages.length, frac: done / pages.length, best: quiz ? quiz.best : null, mastered: !!(quiz && quiz.best >= MASTERY) };
  }
  function courseProgress() {
    let done = 0, total = 0, mastered = 0;
    C.order.forEach((id) => { const p = chapterProgress(id); done += p.done; total += p.total; if (p.mastered) mastered++; });
    const answers = Object.values(P.checks);
    const tries = answers.reduce((a, x) => a + x.n, 0), oks = answers.reduce((a, x) => a + x.ok, 0);
    return { done, total, frac: total ? done / total : 0, mastered, accuracy: tries ? oks / tries : null, tries };
  }
  function nextStep() {
    for (const id of C.order) {
      const pages = pagesOf(id);
      for (let i = 0; i < pages.length; i++) if (!seen(id, i)) return { id, i, page: pages[i] };
    }
    return null;
  }
  const today = () => new Date().toISOString().slice(0, 10);
  function currentWeek() {
    const t = today();
    if (t < C.weeks[0].start) return C.weeks[0];
    for (const w of C.weeks) if (t >= w.start && t <= w.end) return w;
    return C.weeks[C.weeks.length - 1];
  }
  const weekOf = (n) => C.weeks.find((w) => w.n === n);
  const moduleOf = (n) => C.modules.find((m) => m.weeks.includes(n));
  const allLectures = () => C.weeks.flatMap((w) => w.lectures.map((l) => Object.assign({ week: w.n, dates: w.dates }, l)));
  const lectureById = (id) => allLectures().find((l) => l.id === id);
  const lecturesFor = (id) => allLectures().filter((l) => l.ch.includes(id));
  const hasDeck = (id) => !!(LEC[id] && LEC[id].deck);
  const wrongCount = () => Object.keys(P.wrong).filter((id) => QBYID[id]).length;
  const hwParts = () => Object.entries(C.homework).flatMap(([hid, h]) => (h.parts || []).map((p, k) => ({ hid, h, p, k })));

  /* ---------------- chapter content ---------------- */
  const cache = {};
  function fixPlaceholders(html) {
    return html
      .replace(/·\s*p\.\s*\{\{page:go(\d\d)\}\}/g, (m, n) => `· <a href="#/learn/ch${n}/further">see Going further</a>`)
      .replace(/(?:p\.\s*)?(?:<b>)?\{\{page:go(\d\d)\}\}(?:<\/b>)?/g, (m, n) => `<a href="#/learn/ch${n}/further">Going further</a>`)
      .replace(/\{\{page:ch(\d\d)\}\}/g, (m, n) => `<a href="#/learn/ch${n}">Lesson</a>`)
      .replace(/\{\{page:(formulas|numbers|hwmap)\}\}/g, (m, n) => `<a href="#/ref/${n}">open</a>`)
      .replace(/\{\{page:[^}]*\}\}/g, "");
  }
  async function loadChapter(id) {
    if (cache[id]) return cache[id];
    const res = await fetch("content/" + id + ".html");
    if (!res.ok) throw new Error("Could not load " + id);
    const doc = new DOMParser().parseFromString(fixPlaceholders(await res.text()), "text/html");
    const sec = doc.querySelector("section.chapter");
    const head = sec.querySelector(".ch-head"), ctx = sec.querySelector(".context"), recap = sec.querySelector(".recap");
    const chunks = [];
    let cur = null;
    Array.from(sec.children).forEach((node) => {
      if (node === head || node === ctx || node === recap) return;
      if (node.tagName === "H2") { cur = { head: node.outerHTML, html: "" }; chunks.push(cur); return; }
      if (cur) cur.html += node.outerHTML;
    });
    const data = { head: head ? head.outerHTML : "", context: ctx ? ctx.outerHTML : "", recap: recap ? recap.innerHTML : "", chunks };
    cache[id] = data;
    return data;
  }
  let appendixDoc = null;
  async function loadAppendix() {
    if (appendixDoc) return appendixDoc;
    const res = await fetch("content/appendix.html");
    appendixDoc = new DOMParser().parseFromString(fixPlaceholders(await res.text()), "text/html");
    return appendixDoc;
  }

  /* ---------------- rendering helpers ---------------- */
  function renderMath(el) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(el, {
        delimiters: [{ left: "$$", right: "$$", display: true }, { left: "\\(", right: "\\)", display: false }],
        macros: { "\\u": "\\,\\mathrm{#1}", "\\Msun": "M_\\odot", "\\Lsun": "L_\\odot", "\\Rsun": "R_\\odot" },
        throwOnError: false, strict: "ignore",
      });
    } catch (e) { console.warn(e); }
  }
  function enhance(el) {
    renderMath(el);
    $$("table", el).forEach((t) => {
      if (t.parentElement.classList.contains("tscroll")) return;
      const w = document.createElement("div"); w.className = "tscroll"; t.replaceWith(w); w.appendChild(t);
    });
    $$(".qitem", el).forEach((qi) => {
      const a = $(".a", qi);
      if (!a || $(".reveal", qi)) return;
      const b = document.createElement("button");
      b.className = "reveal"; b.type = "button"; b.textContent = "Show answer";
      b.addEventListener("click", () => { qi.classList.add("open"); b.remove(); });
      a.before(b);
    });
    $$("img", el).forEach((img) => { img.loading = "lazy"; img.decoding = "async"; if (!img.alt) img.alt = ""; });
    $$(".video [data-yt]", el).forEach((btn) => btn.addEventListener("click", () => playVideo(btn)));
    $$("[data-copy]", el).forEach((btn) => btn.addEventListener("click", () => {
      const pre = btn.closest("pre");
      const text = pre ? pre.querySelector("code").textContent : "";
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => { btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1500); }, () => {});
    }));
  }
  function playVideo(btn) {
    const id = btn.dataset.yt;
    const f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    f.title = btn.getAttribute("aria-label") || "Video";
    f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    btn.replaceWith(f);
    P.videos[id] = Date.now(); save();
  }
  function videoCard(v) {
    const watched = P.videos[v.id] ? '<span class="watched">✓ watched</span> · ' : "";
    return `<figure class="video">
      <button class="vthumb" type="button" data-yt="${esc(v.id)}" aria-label="Play video: ${esc(v.title)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"><span class="play" aria-hidden="true"></span><span class="dur">${esc(v.dur)}</span></button>
      <figcaption><b>${esc(v.title)}</b><span>${watched}${esc(v.source)} · <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">YouTube ↗</a></span></figcaption>
    </figure>`;
  }
  function linkRow(item) {
    const icon = item.kind === "read" ? "≡" : "▶";
    return `<li><a href="${esc(item.url)}" target="_blank" rel="noopener"><span class="li-ico" aria-hidden="true">${icon}</span><span>${esc(item.title)}</span><span class="ext">↗</span></a></li>`;
  }
  function extLink(t, u, d, ico) {
    const internal = String(u).startsWith("#");
    return `<li><a href="${esc(u)}"${internal ? "" : ' target="_blank" rel="noopener"'}><span class="li-ico" aria-hidden="true">${ico || "↗"}</span><span class="li-t">${esc(t)}${d ? `<small>${esc(d)}</small>` : ""}</span><span class="ext">${internal ? "→" : "↗"}</span></a></li>`;
  }
  function toolLinks(ids) {
    return (ids || []).map((id) => LAB.tools[id]).filter(Boolean).map((t) => `<a class="${t.internal ? "int" : ""}" href="${esc(t.u)}"${t.internal ? "" : ' target="_blank" rel="noopener"'}>${esc(t.t)}</a>`).join("");
  }
  function mediaPanel(items, heading) {
    if (!items.length) return "";
    const vids = items.filter((x) => x.kind === "video"), reads = items.filter((x) => x.kind === "read"), tries = items.filter((x) => x.kind === "try");
    return `<section class="panel media">
      <h3 class="panel-h">${heading || "Watch, read, try"}</h3>
      ${vids.length ? `<div class="videos">${vids.map(videoCard).join("")}</div>` : ""}
      ${reads.length ? `<div class="links"><h4>Read another explanation</h4><ul>${reads.map(linkRow).join("")}</ul></div>` : ""}
      ${tries.length ? `<div class="links"><h4>Try it yourself</h4><ul>${tries.map(linkRow).join("")}</ul></div>` : ""}
    </section>`;
  }
  function materialsList(ids, empty) {
    const rows = [];
    ids.forEach((id) => (MAT[id] || []).forEach((m) => rows.push(extLink(m.title, m.url, "", id.startsWith("S") ? "▤" : "▣"))));
    if (rows.length) return `<ul class="mat">${rows.join("")}</ul>`;
    return empty === false ? "" : `<p class="placeholder">${esc(empty || "No files added.")}</p>`;
  }
  function bar(frac, cls) { return `<span class="bar ${cls || ""}"><i style="width:${Math.round(100 * frac)}%"></i></span>`; }
  function chapterChip(id, extra) {
    const c = chap(id), p = chapterProgress(id);
    const state = p.mastered ? "mastered" : p.done ? "started" : "";
    return `<a class="chip ${state}" href="#/learn/${id}"><span class="chip-n">${pad2(c.n)}</span><span class="chip-t">${esc(c.title)}${extra ? `<small>${extra}</small>` : ""}</span>${bar(p.frac)}${p.mastered ? '<span class="star" title="Mastered">★</span>' : ""}</a>`;
  }
  function setTitle(t) { document.title = t ? t + " · Harvard ASTRO1" : "Harvard ASTRO1"; }
  function render(html, title) {
    main.innerHTML = html;
    setTitle(title);
    enhance(main);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    renderSidebar();
    renderTopbar();
    paintCounters();
  }
  const secH = (t) => `<h2 class="sec-h">${t}</h2>`;

  /* ---------------- questions UI ---------------- */
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function qHTML(q, n, opts = {}) {
    const order = q.fixed ? q.o.map((_, i) => i) : shuffle(q.o.map((_, i) => i));
    const name = "q" + Math.random().toString(36).slice(2);
    return `<div class="q" data-qid="${esc(q.id)}" data-mode="${opts.mode || "check"}">
      <div class="q-stem">${n ? `<span class="q-n">${pad2(n)}</span>` : ""}<div>${q.q}</div></div>
      <div class="opts" role="${opts.mode === "exam" ? "radiogroup" : "group"}">
        ${order.map((oi, k) => opts.mode === "exam"
          ? `<label class="opt"><input type="radio" name="${name}" value="${oi}"><span class="opt-l">${"ABCD"[k]}</span><span class="opt-t">${q.o[oi]}</span></label>`
          : `<button type="button" class="opt" data-i="${oi}"><span class="opt-l">${"ABCD"[k]}</span><span class="opt-t">${q.o[oi]}</span></button>`).join("")}
      </div>
      <div class="q-fb" hidden></div>
    </div>`;
  }
  function revealQ(el, q, chosen) {
    const ok = chosen === q.a;
    $$(".opt", el).forEach((b) => {
      const i = +(b.dataset.i ?? $("input", b)?.value);
      b.classList.add(i === q.a ? "right" : i === chosen ? "wrong" : "dim");
      if (b.tagName === "BUTTON") b.disabled = true;
      const inp = $("input", b); if (inp) inp.disabled = true;
    });
    const fb = $(".q-fb", el);
    const link = q.ch && q.s && pagesOf(q.ch).some((p) => norm(p.key) === norm(q.s)) ? ` <a class="fb-link" href="#/learn/${q.ch}/${encodeURIComponent(q.s)}">Review ${esc(q.s)} →</a>` : "";
    fb.innerHTML = `<b class="${ok ? "ok" : "no"}">${chosen == null ? "Not answered." : ok ? "Correct." : "Not quite."}</b> ${q.e || ""}${ok ? "" : link}`;
    fb.hidden = false;
    el.classList.add(ok ? "is-right" : "is-wrong");
    renderMath(fb);
    return ok;
  }
  function bindChecks(root, where, onAnswer) {
    $$('.q[data-mode="check"]', root).forEach((el) => {
      const q = QBYID[el.dataset.qid];
      $$(".opt", el).forEach((b) => b.addEventListener("click", () => {
        const ok = revealQ(el, q, +b.dataset.i);
        recordAnswer(q, ok, where);
        if (onAnswer) onAnswer(q, ok, el);
      }));
    });
  }

  /* ---------------- sidebar & top bar ---------------- */
  function renderTopbar() {
    const cp = courseProgress();
    $("#topProgress").innerHTML = `${bar(cp.frac, "thin")}<span>${pad2(Math.round(100 * cp.frac))}%</span>`;
    const pilot = $("#pilot");
    pilot.hidden = !NAME;
    $("span", pilot).textContent = NAME;
  }
  function renderSidebar() {
    const h = location.hash || "#/";
    const parts = [];
    let lastPart = "";
    C.order.slice().sort((a, b) => chap(a).n - chap(b).n).forEach((id) => {
      const c = chap(id), p = chapterProgress(id);
      if (c.part !== lastPart) { parts.push(`<div class="nav-part">${esc(c.part)}</div>`); lastPart = c.part; }
      const active = h.startsWith("#/learn/" + id) ? " active" : "";
      const mark = p.mastered ? '<span class="nav-mark m" title="Mastered">★</span>' : p.done === p.total ? '<span class="nav-mark d">✓</span>' : p.done ? `<span class="nav-mark p">${Math.round(100 * p.frac)}%</span>` : "";
      parts.push(`<a class="nav-ch${active}" href="#/learn/${id}"><span class="nav-n">${pad2(c.n)}</span><span class="nav-t">${esc(c.title)}</span>${mark}</a>`);
    });
    const wrong = wrongCount();
    const is = (href) => h === href || (href !== "#/" && (h === href || h.startsWith(href + "/")));
    const link = (href, label, ico, badge, extra) => `<a class="nav-link${is(href) || (extra && extra.some((x) => h.startsWith(x))) ? " active" : ""}" href="${href}"><span class="nav-ico" aria-hidden="true">${ico}</span>${label}${badge ? `<span class="badge">${badge}</span>` : ""}</a>`;
    sidebar.innerHTML = `
      <div class="nav-group"><div class="nav-h">Mission</div>
        ${link("#/", "Home", "⌂")}
        ${link("#/schedule", "Course map", "▦", "", ["#/week/"])}
        ${link("#/lectures", "Lecture recaps", "◫", "", ["#/lecture/"])}
      </div>
      <div class="nav-group"><div class="nav-h">Practice</div>
        ${link("#/homework", "Homework 1–10", "✎")}
        ${link("#/exams", "Practice exams", "◷", "", ["#/exam/"])}
        ${link("#/review", "Review my mistakes", "↻", wrong || "")}
      </div>
      <div class="nav-group"><div class="nav-h">Lab</div>
        ${link("#/lab", "Observatory & tools", "◎")}
        ${link("#/lab/explorer", "Exoplanet explorer", "⁘")}
        ${link("#/lab/orbits", "Orbit & wobble sim", "∿")}
      </div>
      <div class="nav-group"><div class="nav-h">Lessons</div>${parts.join("")}</div>
      <div class="nav-group"><div class="nav-h">Reference</div>
        ${link("#/ref/formulas", "Formula sheet", "∑")}
        ${link("#/ref/constants", "Constants (cgs)", "c")}
        ${link("#/ref/numbers", "Numbers & big ideas", "#")}
        ${link("#/ref/hwmap", "Homework & reading map", "⌖")}
        ${link("#/about", "Profile & progress", "◉")}
      </div>
      <p class="nav-foot">${esc(C.course)}<br>${esc(C.institution)} · ${esc(C.term)}</p>`;
  }

  /* ---------------- home ---------------- */
  function nextExam() {
    const t = today();
    return C.weeks.filter((w) => w.exam && w.end >= t).map((w) => w.exam)[0] || null;
  }
  function viewHome() {
    const cp = courseProgress();
    const nx = nextStep();
    const cw = currentWeek();
    const wrong = wrongCount();
    const ex = nextExam();
    const me = counted();
    const nxHTML = nx
      ? `<a class="btn primary big" href="#/learn/${nx.id}/${nx.i}">${cp.done ? "Continue" : "Start the course"} →<span>Ch ${pad2(chap(nx.id).n)} · ${esc(nx.i === 0 ? chap(nx.id).title : pageLabel(nx.page))}</span></a>`
      : `<a class="btn primary big" href="#/exams">All pages visited →<span>take a practice exam</span></a>`;
    const lecsNow = cw.lectures.map((l) => `<a href="#/lecture/${l.id}">${lecNum(l.id)}</a>`).join(" · ");
    const weeksHTML = C.modules.map((m) => `
      <section class="module">
        <h3 class="module-h"><span>Module ${pad2(m.n)}</span>${esc(m.title)}</h3>
        <div class="weeks">${m.weeks.map((n) => weekCard(weekOf(n), cw)).join("")}</div>
      </section>`).join("");
    render(`
      <section class="hero">
        <div class="hero-text">
          <p class="kicker">// ${esc(C.course)}</p>
          <h1>${greeting()},<br><span>${nm()}</span>.</h1>
          <p class="lede">${cw.final ? "It's exam period." : `Week ${cw.n} of 14${cw.lectures.length ? ": " + esc(cw.lectures.map((l) => l.title).join(" and ")) : ""}.`} ${cp.done ? `You've opened ${pct(cp.frac)} of the lesson pages${cp.mastered ? ` and mastered ${cp.mastered} chapter${cp.mastered > 1 ? "s" : ""}` : ""}. Pick up where you left off, or jump into this week.` : "Every chapter is a short run of pages: read, watch, check yourself, then pass the quiz. Start wherever the class is."}</p>
          <div class="hero-actions">${nxHTML}<a class="btn" href="#/week/${cw.n}">${cw.final ? "Exam period" : "This week · W" + pad2(cw.n)}</a><a class="btn" href="#/lectures">Lecture recaps</a></div>
        </div>
        <div class="hero-stats">
          <div class="ring" style="--p:${cp.frac}"><b>${Math.round(100 * cp.frac)}%</b><span>pages</span></div>
          <ul class="stat-list">
            <li><span>mastered</span><b>${cp.mastered}/19</b></li>
            <li><span>accuracy</span><b>${cp.accuracy == null ? "–" : pct(cp.accuracy)}</b></li>
            <li><a href="#/review">to review</a><b>${wrong}</b></li>
          </ul>
        </div>
      </section>
      <div class="telemetry">
        <div><span>Week</span><b>${cw.final ? "Finals" : pad2(cw.n)}<small>/14 · ${esc(cw.dates)}</small></b></div>
        <div><span>In class</span><b>${lecsNow || "–"}</b></div>
        <div><span>Next exam</span><b>${ex ? `<a href="#/exam/${ex.id}">${esc(ex.id === "final" ? "Final" : "Midterm")}</a>` : "–"}<small>${ex ? esc(ex.when.replace("Date set by the Registrar", "TBA")) : ""}</small></b></div>
        <div><span>Explorers</span><b><span data-explorers-n>${fmtInt(explorers)}</span><small>${me ? "you're #" + fmtInt(me.n) : ""}</small></b></div>
      </div>
      ${nowCard(cw)}
      <section class="howto">
        <h2 class="sec-h">How this course works</h2>
        <ol class="steps">
          <li><b>Follow the weeks.</b> The course map mirrors the Fall 2026 syllabus: lectures, reading, Friday section and homework for each week.</li>
          <li><b>Recap the lecture.</b> Every slide deck has a recap here: key ideas, equations, numbers, and the questions asked in class.</li>
          <li><b>Go page by page.</b> Each chapter: an overview, one page per textbook section with a video and check questions, worked practice, then the quiz.</li>
          <li><b>Do the lab.</b> Sky forecast, image analysis, transit photometry and the exoplanet archive: the tools used in class, explained.</li>
          <li><b>Prove it.</b> Pass each chapter quiz with ${MASTERY * 100}%, clear your <a href="#/review">mistakes</a>, then take the <a href="#/exams">practice exams</a>.</li>
        </ol>
      </section>
      <section class="roadmap-sec"><h2 class="sec-h">Your path, ${nm()}</h2>${weeksHTML}</section>
      ${footer()}
    `, "");
  }
  function nowCard(cw) {
    if (cw.final) return `<section class="now"><div><p class="kicker">// right now</p><h2>Exam period: final exam</h2><p class="muted">${esc(cw.exam.when)} · covers ${esc(cw.exam.covers)}.</p></div><a class="btn primary" href="#/exam/final">Final practice exam →</a></section>`;
    const chs = [...new Set(cw.read.map((r) => r.ch))];
    const hw = (cw.hw || []).map((id) => `<a class="tag hw" href="#/homework/${id}">${esc(C.homework[id].title)}</a>`).join("");
    return `<section class="now">
      <div><p class="kicker">// right now in class · week ${pad2(cw.n)} · ${esc(cw.dates)}</p>
        <h2>${cw.lectures.map((l) => esc(l.title)).join(" · ") || "No lectures"}</h2>
        ${cw.exam ? `<p class="exam-flag">▲ ${esc(cw.exam.title)}: ${esc(cw.exam.when)}</p>` : ""}
      </div>
      <div class="tags">${cw.lectures.map((l) => `<a class="tag lec" href="#/lecture/${l.id}">${lecNum(l.id)} recap${hasDeck(l.id) ? "" : " (no slides)"}</a>`).join("")}${cw.section ? `<span class="tag sec">Section: ${esc(cw.section.title)}</span>` : ""}${hw}</div>
      <div class="now-chips">${chs.map((id) => chapterChip(id)).join("")}</div>
      <a class="btn" href="#/week/${cw.n}">Open week ${cw.n} →</a>
    </section>`;
  }
  function weekCard(w, cw) {
    const now = w.n === cw.n ? " now" : "";
    const past = w.end < today() ? " past" : "";
    const chs = [...new Set(w.read.map((r) => r.ch))];
    const hw = (w.hw || []).map((id) => { const h = C.homework[id]; return `<a class="tag hw" href="#/homework/${id}">${esc(h.title)}</a>`; }).join("");
    const exam = w.exam ? `<a class="tag exam" href="#/exam/${w.exam.id}">${esc(w.exam.title)}</a>` : "";
    return `<article class="week${now}${past}">
      <a class="week-h" href="#/week/${w.n}"><span class="wk">${w.final ? "FINALS" : "WEEK " + pad2(w.n)}</span><span class="dt">${esc(w.dates)}</span>${now ? '<span class="here">now</span>' : ""}</a>
      ${w.lectures.length ? `<ul class="lec">${w.lectures.map((l) => `<li><a href="#/lecture/${l.id}"><span class="lid">${lecNum(l.id)}</span>${esc(l.title)}</a></li>`).join("")}</ul>` : ""}
      ${chs.length ? `<div class="chips">${chs.map((id) => chapterChip(id)).join("")}</div>` : ""}
      ${w.final ? `<div class="chips"><a class="chip" href="#/exam/final"><span class="chip-n">★</span><span class="chip-t">Final practice exam<small>all 19 chapters</small></span></a></div>` : ""}
      <div class="tags">${w.section ? `<span class="tag sec">Section: ${esc(w.section.title)}</span>` : ""}${hw}${exam}</div>
    </article>`;
  }
  function viewSchedule() {
    const cw = currentWeek();
    render(`
      <header class="page-h"><p class="kicker">// ${esc(C.course)} · ${esc(C.term)}</p><h1>Course map</h1>
      <p class="lede">Lectures are on Tuesdays and Thursdays, sections on Fridays. Reading responses are due Mondays at 11:59 pm; homework is due Thursdays at 10:30 am. Chapter 3 isn't on the reading list, but its ideas (Kepler's laws, the scientific method) come back all term, so it's included as background.</p></header>
      ${C.modules.map((m) => `<section class="module"><h3 class="module-h"><span>Module ${pad2(m.n)}</span>${esc(m.title)}</h3><div class="weeks">${m.weeks.map((n) => weekCard(weekOf(n), cw)).join("")}</div></section>`).join("")}
      ${footer()}`, "Course map");
  }
  function viewWeek(n) {
    const w = weekOf(+n);
    if (!w) return viewNotFound();
    const m = moduleOf(w.n);
    const lec = w.lectures.map((l) => { const d = LEC[l.id] || {}; return `
      <a class="card lec-card${d.deck ? "" : " off"}" href="#/lecture/${l.id}">
        <div class="lc-top"><span class="lc-id${d.deck ? "" : " off"}">${lecNum(l.id)}</span><span>${d.deck ? d.slides + " slides · recap" : "no slides yet"}</span></div>
        <h3>${esc(l.title)}</h3>
        ${d.q ? `<p>${esc(d.q)}</p>` : ""}
        <div class="lc-foot">${l.ch.map((id) => `<span class="tag">Ch ${pad2(chap(id).n)}</span>`).join("")}</div>
      </a>`; }).join("");
    const reads = w.read.map((r) => { const p = chapterProgress(r.ch); return `
      <div class="read-row">
        ${chapterChip(r.ch, r.due ? "Reading due " + esc(r.due) : esc(r.note || ""))}
        <a class="btn small" href="#/learn/${r.ch}/${p.done && p.done < p.total ? firstUnseen(r.ch) : 0}">${p.done === 0 ? "Start" : p.done < p.total ? "Continue" : "Revisit"}</a>
      </div>${r.note && r.due ? `<p class="note">${esc(r.note)}</p>` : ""}`; }).join("");
    const hw = (w.hw || []).map((id) => hwCard(id)).join("");
    const prev = weekOf(w.n - 1), next = weekOf(w.n + 1);
    render(`
      <header class="page-h"><p class="kicker">// module ${pad2(m.n)} · ${esc(m.title)}</p>
        <h1>${w.final ? "Exam period" : "Week " + pad2(w.n)} <small>${esc(w.dates)}</small></h1>
        <p class="hello">// ${nm()}, ${w.n === currentWeek().n ? "this is where the class is right now." : w.end < today() ? "a week the class has already covered." : "a week that's still ahead."}</p>
        ${w.note ? `<p class="note">${esc(w.note)}</p>` : ""}</header>
      ${w.exam ? `<div class="card exam-card"><h3>${esc(w.exam.title)}</h3><p class="muted">${esc(w.exam.when)} · covers ${esc(w.exam.covers)}</p><a class="btn primary" href="#/exam/${w.exam.id}">Take the ${w.exam.id === "midterm" ? "midterm" : "final"} practice exam</a></div>` : ""}
      ${lec ? secH("Lectures") + `<div class="lec-grid">${lec}</div>` : ""}
      ${reads ? secH("Read & learn") + `<div class="reads">${reads}</div>` : ""}
      ${w.section ? secH("Friday section") + `<div class="card"><h3>${esc(w.section.title)}</h3>${sectionExtras(w.section.id)}${materialsList([w.section.id], false)}</div>` : ""}
      ${hw ? secH("Homework") + `<div class="grid2">${hw}</div>` : ""}
      <nav class="pager">${prev ? `<a class="btn" href="#/week/${prev.n}">← ${prev.final ? "Finals" : "Week " + pad2(prev.n)}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/week/${next.n}">${next.final ? "Exam period" : "Week " + pad2(next.n)} →</a>` : ""}</nav>
      ${footer()}`, w.final ? "Exam period" : "Week " + w.n);
  }
  // Section-specific lab links (the week-6 transit section works on the TOI-2046 frames).
  function sectionExtras(sid) {
    const map = { S6: ["transit"], S4: [], S10: [], S11: [] };
    const flows = (map[sid] || []).map((f) => LAB.flows[f]).filter(Boolean);
    if (!flows.length) return "";
    return `<ul class="mat">${(map[sid]).map((f) => extLink(LAB.flows[f].t, "#/lab/" + f, LAB.flows[f].sub, "◎")).join("")}</ul>`;
  }
  function firstUnseen(id) { const pages = pagesOf(id); for (let i = 0; i < pages.length; i++) if (!seen(id, i)) return i; return 0; }

  /* ---------------- lessons ---------------- */
  async function viewLesson(id, arg) {
    const c = chap(id);
    if (!c || !MAN[id]) return viewNotFound();
    main.innerHTML = `<div class="loading">Loading chapter ${pad2(c.n)}</div>`;
    let data;
    try { data = await loadChapter(id); } catch (e) {
      return render(`<div class="card"><h2>Couldn't load this lesson</h2><p>${esc(e.message)}. If you opened index.html straight from disk, start a local server instead (see README).</p></div>`, c.title);
    }
    const pages = pagesOf(id);
    const i = pageIndex(id, arg);
    const page = pages[i];
    const pos = C.order.indexOf(id);
    const prevCh = C.order[pos - 1], nextCh = C.order[pos + 1];
    const prevHref = i > 0 ? `#/learn/${id}/${i - 1}` : prevCh ? `#/learn/${prevCh}/${pagesOf(prevCh).length - 1}` : null;
    const nextHref = i < pages.length - 1 ? `#/learn/${id}/${i + 1}` : nextCh ? `#/learn/${nextCh}/0` : null;
    const nextLabel = i < pages.length - 1 ? pageLabel(pages[i + 1]) : nextCh ? `Chapter ${chap(nextCh).n}: ${chap(nextCh).title}` : "";
    const steps = pages.map((p, k) => `<a class="step${k === i ? " cur" : ""}${seen(id, k) ? " done" : ""}" href="#/learn/${id}/${k}" title="${esc(pageLabel(p))}"><span>${k === 0 ? "◎" : p.kind === "section" ? esc(p.key) : p.kind === "practice" ? "✎" : p.kind === "further" ? "+" : "?"}</span></a>`).join("");
    let body = "";
    if (page.kind === "intro") body = introBody(id, data, pages);
    else if (page.kind === "quiz") body = quizShell(id, data);
    else body = sectionBody(id, page, data.chunks[i - 1]);
    const firstEver = !Object.keys(P.seen).length;
    P.last = location.hash;
    if (page.kind !== "quiz") P.seen[id + "/" + i] = Date.now();
    save();
    render(`
      <div class="lesson">
        <nav class="crumbs"><a href="#/week/${c.week}">W${pad2(c.week)}</a><span>/</span><a href="#/learn/${id}">CH ${pad2(c.n)} · ${esc(c.title)}</a><span>/</span><b>${pad2(i + 1)} of ${pad2(pages.length)}</b></nav>
        <div class="stepper" aria-label="Pages in this chapter">${steps}</div>
        ${body}
        <nav class="pager lesson-pager">
          ${prevHref ? `<a class="btn" href="${prevHref}">← Back</a>` : "<span></span>"}
          ${nextHref ? `<a class="btn primary" href="${nextHref}" id="nextBtn">Next: ${esc(nextLabel)} →</a>` : `<a class="btn primary" href="#/exams">Finish: practice exams →</a>`}
        </nav>
      </div>`, `Ch ${c.n} · ${page.kind === "intro" ? c.title : pageLabel(page)}`);
    if (page.kind === "quiz") startChapterQuiz(id, $("#quizHost"));
    bindChecks(main, id + "/" + i, () => renderTopbar());
    if (firstEver) toast(`First page done, <b>${nm()}</b>. Arrow keys flip pages.`);
  }
  function introBody(id, data, pages) {
    const c = chap(id), m = MAN[id];
    const lecs = lecturesFor(id);
    const w = weekOf(c.week);
    const read = w.read.find((r) => r.ch === id);
    const hwHere = hwParts().filter((x) => x.p.solution && x.p.solution.ch === id);
    const qn = (QB[id] || []).length;
    return `
      ${data.head}
      <p class="hello">// ready, <b>${nm()}</b>? ${pages.length} pages, ${qn} quiz questions. Pass the quiz with ${MASTERY * 100}% to master the chapter.</p>
      ${data.context}
      <div class="grid2 intro-grid">
        <section class="card">
          <h4 style="margin-top:0">In this chapter</h4>
          <ol class="toc">${pages.map((p, k) => `<li class="${seen(id, k) ? "done" : ""}"><a href="#/learn/${id}/${k}">${esc(k === 0 ? "Overview (this page)" : pageLabel(p))}</a></li>`).join("")}</ol>
        </section>
        <section class="card">
          <h4 style="margin-top:0">In class</h4>
          <ul class="plain">
            <li><b>Week ${c.week}</b> · ${esc(w.dates)}${c.background ? " · background reading" : ""}</li>
            ${lecs.map((l) => `<li><a href="#/lecture/${l.id}"><span class="lid">${lecNum(l.id)}</span>${esc(l.title)}</a>${hasDeck(l.id) ? "" : ' <span class="muted small">(no slides)</span>'}</li>`).join("")}
            <li>Textbook: <i>The Essential Cosmic Perspective</i>, ${m.bookPages ? "pp. " + esc(m.bookPages) : "Ch " + c.n}${read && read.due ? ` · reading due ${esc(read.due)}` : ""}</li>
            ${hwHere.map((x) => `<li class="hwli">Homework walkthrough: <a href="#/learn/${id}/further">${esc(x.h.title)} #${x.k + 1} “${esc(x.p.title)}”</a></li>`).join("")}
          </ul>
          ${materialsList(lecs.map((l) => l.id), false)}
        </section>
      </div>
      ${mediaPanel(MEDIA.intro(id), "Start with a video")}
      <section class="panel tip"><b>How to work this chapter.</b> Skim the textbook pages first if you have time. Then go page by page: read, watch the video if anything is unclear, and answer the check questions before moving on. The worked answers on the practice page are for <i>after</i> you've tried.</section>`;
  }
  function sectionBody(id, page, chunk) {
    const raw = chunk ? chunk.head + chunk.html : "<p>Missing content.</p>";
    let extra = "";
    if (page.kind === "section") {
      const qs = (QB[id] || []).filter((q) => norm(q.s) === norm(page.key)).slice(0, 4);
      extra += mediaPanel(MEDIA.section(id, page.key));
      if (qs.length) extra += `<section class="panel checks"><h3 class="panel-h">Check yourself, ${nm()}</h3><p class="muted small">Pick an answer to see why it's right or wrong. These come back in the chapter quiz.</p>${qs.map((q, k) => qHTML(q, k + 1)).join("")}</section>`;
    }
    const intro = page.kind === "practice"
      ? `<div class="panel tip"><b>Try first.</b> Answer each question on paper or in your head, then open the worked answer. These are paraphrased from the textbook's end-of-chapter questions.</div>`
      : page.kind === "further"
        ? `<div class="panel tip"><b>Going further.</b> Worked homework, the Hirshfeld activities behind it, derivations from Owocki's <i>Fundamentals of Astrophysics</i> and facts from Pasachoff &amp; Filippenko's <i>The Cosmos</i>. Optional for the exams, but this is where the homework lives.</div>`
        : "";
    return `${intro}<article class="chapter content">${raw}</article>${extra}`;
  }
  function quizShell(id, data) {
    const best = P.quiz[id] ? P.quiz[id].best : null;
    return `<article class="chapter content"><div class="recap"><div class="lbl">30-second<br>recap</div><div>${data.recap}</div></div></article>
      <section class="panel quiz">
        <h3 class="panel-h">Chapter ${pad2(chap(id).n)} quiz ${best != null ? `<span class="best">best ${pct(best)}</span>` : ""}</h3>
        <div id="quizHost"></div>
      </section>`;
  }

  /* chapter quiz: one question at a time, feedback after each */
  function startChapterQuiz(id, host, onlyIds) {
    let qs = (QB[id] || []).slice();
    if (onlyIds) qs = qs.filter((q) => onlyIds.includes(q.id));
    if (!qs.length) { host.innerHTML = `<p class="placeholder">Quiz questions for this chapter are coming soon.</p>`; return; }
    qs = shuffle(qs);
    let k = 0, right = 0;
    const missed = [];
    function step() {
      if (k >= qs.length) return finish();
      host.innerHTML = `<div class="qprog">${bar(k / qs.length)}<span>${pad2(k + 1)}/${pad2(qs.length)} · ${right} right</span></div>${qHTML(qs[k], k + 1)}<div class="qnav" hidden><button class="btn primary" type="button" id="qNext">${k + 1 < qs.length ? "Next question →" : "See my score"}</button></div>`;
      renderMath(host);
      const el = $(".q", host), q = qs[k];
      $$(".opt", el).forEach((b) => b.addEventListener("click", () => {
        const ok = revealQ(el, q, +b.dataset.i);
        recordAnswer(q, ok, "quiz:" + id);
        if (ok) right++; else missed.push(q);
        $(".qnav", host).hidden = false;
        $("#qNext").focus();
        $("#qNext").addEventListener("click", () => { k++; step(); });
      }));
    }
    function finish() {
      const score = right / qs.length;
      let newlyMastered = false;
      if (!onlyIds) {
        const prev = P.quiz[id] || { best: 0, attempts: 0 };
        newlyMastered = prev.best < MASTERY && score >= MASTERY;
        P.quiz[id] = { best: Math.max(prev.best, score), last: score, attempts: prev.attempts + 1, t: Date.now() };
        P.seen[id + "/" + (pagesOf(id).length - 1)] = Date.now();
        save();
      }
      const passed = score >= MASTERY;
      const pos = C.order.indexOf(id), nextCh = C.order[pos + 1];
      host.innerHTML = `
        <div class="result ${passed ? "pass" : "fail"}">
          <div class="score">${right}/${qs.length}<small>${pct(score)}</small></div>
          <div><h4>${passed ? (score === 1 ? `Perfect, ${nm()}. Chapter mastered.` : `Chapter mastered, ${nm()}.`) : `Not yet, ${nm()}.`}</h4>
          <p>${passed ? "You've got this chapter. Move on, and come back to any misses in Review." : `You need ${MASTERY * 100}% to master the chapter. Re-read the pages linked under each missed question, then retry.`}</p></div>
        </div>
        ${missed.length ? `<h4 class="missed-h">Questions you missed</h4><ol class="missed">${missed.map((q) => `<li><div>${q.q}</div><p><b>Answer:</b> ${q.o[q.a]}</p><p class="muted">${q.e || ""}</p>${q.s ? `<a href="#/learn/${q.ch}/${encodeURIComponent(q.s)}">Review ${esc(q.s)} →</a>` : ""}</li>`).join("")}</ol>` : ""}
        <div class="qnav">
          <button class="btn" type="button" id="qRetry">Retake the whole quiz</button>
          ${missed.length ? `<button class="btn" type="button" id="qMissed">Retry only the ${missed.length} missed</button>` : ""}
          ${nextCh ? `<a class="btn primary" href="#/learn/${nextCh}/0">Next chapter →</a>` : `<a class="btn primary" href="#/exam/final">Final practice exam →</a>`}
        </div>`;
      renderMath(host);
      $("#qRetry").addEventListener("click", () => startChapterQuiz(id, host));
      const qm = $("#qMissed", host); if (qm) qm.addEventListener("click", () => startChapterQuiz(id, host, missed.map((q) => q.id)));
      renderSidebar(); renderTopbar();
      if (newlyMastered) toast(`★ Chapter ${chap(id).n} mastered, <b>${nm()}</b>.`);
    }
    step();
  }

  /* ---------------- lectures ---------------- */
  function viewLectures() {
    const cw = currentWeek();
    const decks = Object.values(LEC).filter((d) => d.deck).length;
    const card = (l) => { const d = LEC[l.id] || {}; const read = P.lec[l.id]; return `
      <a class="card lec-card${d.deck ? "" : " off"}" href="#/lecture/${l.id}">
        <div class="lc-top"><span class="lc-id${d.deck ? "" : " off"}">${lecNum(l.id)}</span><span>W${pad2(l.week)} · ${esc(l.dates)}${read ? ' · <span style="color:var(--ok)">✓ read</span>' : ""}</span></div>
        <h3>${esc(l.title)}</h3>
        <p>${esc(d.q || (l.week <= cw.n ? "No slide deck for this lecture in the course folder yet." : "Coming up."))}</p>
        <div class="lc-foot">${d.deck ? `<span class="tag lec">${d.slides} slides</span>` : '<span class="tag">no slides</span>'}${l.ch.map((id) => `<span class="tag">Ch ${pad2(chap(id).n)}</span>`).join("")}${l.week === cw.n ? '<span class="tag hw">this week</span>' : ""}</div>
      </a>`; };
    render(`
      <header class="page-h"><p class="kicker">// lectures</p><h1>Lecture recaps</h1>
        <p class="lede">${decks} slide decks, each turned into a recap: the big question, the key ideas in the order the slides take them, equations, numbers worth remembering, the questions asked in class, and the links shown on the slides.</p>
        <p class="hello">// ${nm()}, read the recap right after class, while the slides are fresh.</p></header>
      ${C.modules.map((m) => { const ls = m.weeks.flatMap((n) => weekOf(n).lectures.map((l) => Object.assign({ week: n, dates: weekOf(n).dates }, l))); return ls.length ? `<section class="module"><h3 class="module-h"><span>Module ${pad2(m.n)}</span>${esc(m.title)}</h3><div class="lec-grid">${ls.map(card).join("")}</div></section>` : ""; }).join("")}
      ${footer()}`, "Lecture recaps");
  }
  function viewLecture(id) {
    const l = lectureById(id);
    if (!l) return viewNotFound();
    const d = LEC[id] || { deck: null };
    const all = allLectures(), pos = all.findIndex((x) => x.id === id);
    const prev = all[pos - 1], next = all[pos + 1];
    const hwHere = hwParts().filter((x) => x.p.lecture === id);
    const w = weekOf(l.week);
    if (d.deck) { P.lec[id] = Date.now(); save(); }
    const qs = LQ[id] || [];
    const body = d.deck ? `
      <p class="lede">${d.sum}</p>
      ${l.syllabus ? `<p class="syl-note">// the syllabus listed this slot as “${esc(l.syllabus)}”; the slide deck covers the topic above.</p>` : ""}
      ${d.sky ? `<div class="skynote"><span><b>Class telescope:</b> ${esc(d.sky)}</span></div>` : ""}
      ${secH("Key ideas")}<ol class="ideas">${d.ideas.map((x) => `<li>${x}</li>`).join("")}</ol>
      ${d.eq && d.eq.length ? secH("Equations") + `<div class="eqs">${d.eq.map(([t, f]) => `<div><span>${esc(t || " ")}</span>$$${f}$$</div>`).join("")}</div>` : ""}
      ${d.nums && d.nums.length ? secH("Numbers worth knowing") + `<div class="nums">${d.nums.map(([t, v]) => `<div><span>${esc(t)}</span><b>${esc(v)}</b></div>`).join("")}</div>` : ""}
      ${d.think && d.think.length ? secH("Think about it") + `<div class="qa">${d.think.map((t) => `<div class="qitem"><div class="q"><span class="tag">From class</span>${t.q}</div><div class="a">${t.a}</div></div>`).join("")}</div>` : ""}
      ${qs.length ? `<section class="panel checks"><h3 class="panel-h">Check yourself, ${nm()}</h3><p class="muted small">Questions built from this lecture's slides. Misses go to Review.</p>${qs.map((q, k) => qHTML(q, k + 1)).join("")}</section>` : ""}
      ${d.links && d.links.length ? secH("Shown on the slides") + `<div class="card"><ul class="mat">${d.links.map((x) => extLink(x.t, x.u, x.d)).join("")}</ul></div>` : ""}
      ${d.lab && d.lab.length ? secH("Do it yourself") + `<div class="card"><ul class="mat">${d.lab.map((f) => extLink(LAB.flows[f].t, "#/lab/" + f, LAB.flows[f].sub, "◎")).join("")}</ul></div>` : ""}
    ` : `
      <div class="card"><h3>No slides in the folder for this lecture${l.week > currentWeek().n ? " yet" : ""}.</h3>
        <p class="muted">${l.syllabus ? `Syllabus title: “${esc(l.syllabus)}”. ` : ""}Until a deck is added, the textbook chapters below cover the same ground. ${l.week > currentWeek().n ? "Reading them before class is the best preparation." : ""}</p>
        ${materialsList([id], false)}</div>`;
    render(`
      <nav class="crumbs"><a href="#/lectures">LECTURES</a><span>/</span><a href="#/week/${l.week}">W${pad2(l.week)} · ${esc(w.dates)}</a><span>/</span><b>${lecNum(id)}</b></nav>
      <header class="lec-hero">
        <div class="lh-id">${lecNum(id)}</div>
        <h1>${esc(l.title)}</h1>
        ${d.q ? `<p class="bigq">${esc(d.q)}</p>` : ""}
        <div class="ch-tags"><span class="hot">Week ${l.week}</span>${d.deck ? `<span>${esc(d.deck)} · ${d.slides} slides</span>` : "<span>no slide deck yet</span>"}${l.ch.map((c) => `<span><a href="#/learn/${c}">Ch ${chap(c).n} ${esc(chap(c).title)}</a></span>`).join("")}</div>
      </header>
      ${d.deck ? `<p class="hello">// ${nm()}, here's what ${lecNum(id)} covered, recapped from the ${d.slides} slides.</p>` : ""}
      ${body}
      ${secH("Go deeper")}
      <div class="chips">${l.ch.map((c) => chapterChip(c, "the lesson for this lecture")).join("")}</div>
      ${hwHere.length ? `<div class="grid2" style="margin-top:12px">${hwHere.map((x) => `<a class="card hw-card" href="#/homework/${x.hid}"><p class="kicker" style="color:var(--amber)">// ${esc(x.h.title)} · problem ${x.k + 1}</p><h3>${esc(x.p.title)}</h3><p class="muted small" style="margin:0">${esc(x.p.source)}</p></a>`).join("")}</div>` : ""}
      ${materialsList([id], false) ? secH("Files") + materialsList([id], false) : ""}
      <nav class="pager lecture-pager">${prev ? `<a class="btn" href="#/lecture/${prev.id}">← ${lecNum(prev.id)}</a>` : "<span></span>"}${next ? `<a class="btn primary" id="nextBtn" href="#/lecture/${next.id}">${lecNum(next.id)}: ${esc(next.title)} →</a>` : ""}</nav>
      ${footer()}`, `${lecNum(id)} · ${l.title}`);
    bindChecks(main, "lecture:" + id, () => renderTopbar());
  }

  /* ---------------- practice exams ---------------- */
  function pickExam(def) {
    const pool = def.chapters.flatMap((ch) => (QB[ch] || []).map((q) => ({ q, w: def === C.exams.final && +ch.slice(2) >= 11 ? 1.6 : 1 })));
    return pool.map((x) => ({ q: x.q, k: Math.pow(Math.random(), 1 / x.w) })).sort((a, b) => b.k - a.k).slice(0, def.count).map((x) => x.q)
      .sort((a, b) => a.ch.localeCompare(b.ch));
  }
  function examFormatHTML() {
    const f = LAB.examFormat;
    if (!f) return "";
    return `${secH("How the real exams work")}
      <p class="muted">From the Fall 2026 midterm instructions: ${f.points} points, and you choose which questions to answer.</p>
      <div class="fmt">${f.parts.map(([t, pick, pts, total]) => `<div><b>${total}</b><span>${esc(t)}</span><small>${esc(pick)} · ${esc(pts)}</small></div>`).join("")}</div>
      <ul class="approach">${f.rules.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <p class="muted small">The practice exams here are multiple choice only, so also practise the written side: the worked questions on each chapter's practice page, and the homework.</p>`;
  }
  function viewExams() {
    const hist = P.exams.slice(-8).reverse();
    render(`
      <header class="page-h"><p class="kicker">// practice</p><h1>Practice exams</h1><p class="lede">Exam mode: no feedback until you submit, then a full review with explanations and links back to the pages. Each attempt draws a fresh set of questions.</p></header>
      <div class="grid2">${Object.entries(C.exams).map(([id, e]) => `<div class="card"><p class="kicker">// ${e.count} questions</p><h3>${esc(e.title)}</h3><p class="muted">${esc(e.blurb)}</p><a class="btn primary" href="#/exam/${id}">Start</a></div>`).join("")}</div>
      ${examFormatHTML()}
      ${hist.length ? `${secH("Recent attempts")}<table class="t hist"><tr><th>Exam</th><th>When</th><th class="num">Score</th></tr>${hist.map((h) => `<tr><td>${esc(C.exams[h.id] ? C.exams[h.id].title : h.id)}</td><td>${new Date(h.t).toLocaleString()}</td><td class="num">${h.right}/${h.n} (${pct(h.right / h.n)})</td></tr>`).join("")}</table>` : ""}
      ${footer()}`, "Practice exams");
  }
  function viewExam(id) {
    const def = C.exams[id];
    if (!def) return viewNotFound();
    const qs = pickExam(def);
    const t0 = Date.now();
    render(`
      <header class="page-h"><p class="kicker">// practice exam</p><h1>${esc(def.title)}</h1><p class="lede">${esc(def.blurb)}</p>
        <p class="exam-meta">T+<span id="examTimer">0:00</span> · ${qs.length} questions · good luck, ${nm()}</p></header>
      <form id="examForm" class="exam">${qs.map((q, k) => `<div class="exam-q"><span class="exam-ch">CH ${pad2(chap(q.ch).n)}</span>${qHTML(q, k + 1, { mode: "exam" })}</div>`).join("")}
        <div class="qnav"><button class="btn primary big" type="submit">Submit and grade →<span>${qs.length} questions</span></button></div></form>`, def.title);
    const timer = setInterval(() => { const el = $("#examTimer"); if (!el) return clearInterval(timer); const s = Math.round((Date.now() - t0) / 1000); el.textContent = Math.floor(s / 60) + ":" + pad2(s % 60); }, 1000);
    $("#examForm").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const unanswered = $$(".q", main).filter((el) => !$("input:checked", el)).length;
      if (unanswered && !confirm(`${unanswered} question(s) unanswered. Grade anyway?`)) return;
      clearInterval(timer);
      let right = 0;
      const byCh = {};
      $$(".q", main).forEach((el) => {
        const q = QBYID[el.dataset.qid];
        const inp = $("input:checked", el);
        const chosen = inp ? +inp.value : null;
        const ok = revealQ(el, q, chosen);
        recordAnswer(q, ok, "exam:" + id);
        if (ok) right++;
        byCh[q.ch] = byCh[q.ch] || [0, 0]; byCh[q.ch][1]++; if (ok) byCh[q.ch][0]++;
      });
      P.exams.push({ id, right, n: qs.length, t: Date.now(), secs: Math.round((Date.now() - t0) / 1000) });
      save();
      const weak = Object.entries(byCh).filter(([, v]) => v[0] / v[1] < 0.7).map(([ch]) => ch);
      const res = document.createElement("section");
      res.className = "card exam-result";
      res.innerHTML = `<div class="result ${right / qs.length >= MASTERY ? "pass" : "fail"}"><div class="score">${right}/${qs.length}<small>${pct(right / qs.length)}</small></div>
        <div><h4>${nm()}, here's your result by chapter</h4><div class="bych">${Object.entries(byCh).map(([ch, v]) => `<a href="#/learn/${ch}" class="bych-i ${v[0] / v[1] < 0.7 ? "weak" : ""}">CH ${pad2(chap(ch).n)} ${v[0]}/${v[1]}</a>`).join("")}</div>
        ${weak.length ? `<p>Revisit: ${weak.map((ch) => `<a href="#/learn/${ch}">Ch ${chap(ch).n} ${esc(chap(ch).title)}</a>`).join(", ")}.</p>` : "<p>No weak chapters. Nice.</p>"}</div></div>
        <p class="muted small">Scroll down for every question with its explanation. Missed questions are now in <a href="#/review">Review</a>.</p>
        <div class="qnav"><a class="btn" href="#/exam/${id}" id="examAgain">New attempt</a><a class="btn" href="#/review">Review mistakes</a></div>`;
      $("#examForm").before(res);
      $(".qnav", $("#examForm")).remove();
      $("#examAgain").addEventListener("click", (e) => { e.preventDefault(); viewExam(id); });
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderSidebar(); renderTopbar();
    });
  }

  function viewReview() {
    const ids = Object.keys(P.wrong).filter((id) => QBYID[id]).sort((a, b) => P.wrong[a] - P.wrong[b]);
    const answeredCh = [...new Set(Object.keys(P.checks).map((id) => id.split(".")[0]))].filter((c) => QB[c]);
    const where = (q) => q.lec ? `<a href="#/lecture/${q.lec}">${lecNum(q.lec)}</a>` : `<a href="#/learn/${q.ch}">CH ${pad2(chap(q.ch).n)}</a>`;
    render(`
      <header class="page-h"><p class="kicker">// practice</p><h1>Review my mistakes</h1>
      <p class="lede">Every question you got wrong waits here until you answer it right, ${nm()}. Short, frequent review is what makes things stick for the exam.</p></header>
      <div class="card"><h3>${ids.length ? ids.length + " question" + (ids.length > 1 ? "s" : "") + " to review" : "Nothing to review"}</h3>
        ${ids.length ? `<p class="muted">Up to 15 at a time, oldest first.</p><button class="btn primary" id="startReview" type="button">Start review</button>` : `<p class="muted">${Object.keys(P.checks).length ? "You've cleared every mistake. " : ""}Answer questions in the lessons, lecture recaps and quizzes; anything you miss shows up here.</p>`}
        ${answeredCh.length ? `<button class="btn" id="mixed" type="button">Mixed practice: 10 random questions</button>` : ""}
      </div>
      <div id="reviewHost"></div>${footer()}`, "Review");
    const host = $("#reviewHost");
    const run = (list, label) => {
      host.innerHTML = `<section class="panel checks"><h3 class="panel-h">${label}</h3>${list.map((q, k) => `<div class="exam-q"><span class="exam-ch">${where(q)}</span>${qHTML(q, k + 1)}</div>`).join("")}<div class="qnav"><a class="btn" href="#/review" id="again">Done, refresh the list</a></div></section>`;
      renderMath(host);
      bindChecks(host, "review", () => renderSidebar());
      $("#again").addEventListener("click", (e) => { e.preventDefault(); viewReview(); });
      host.scrollIntoView({ behavior: "smooth" });
    };
    const sr = $("#startReview"); if (sr) sr.addEventListener("click", () => run(ids.slice(0, 15).map((id) => QBYID[id]), "Review"));
    const mx = $("#mixed"); if (mx) mx.addEventListener("click", () => run(shuffle(answeredCh.flatMap((ch) => QB[ch] || [])).slice(0, 10), "Mixed practice"));
  }

  /* ---------------- homework ---------------- */
  function hwCard(id) {
    const h = C.homework[id];
    const kinds = h.parts.map((p) => (p.solution ? "walkthrough" : p.approach ? "guided" : "")).filter(Boolean);
    return `<a class="card hw-card" href="#/homework/${id}"><p class="kicker" style="color:var(--amber)">// HW ${pad2(h.n)} · week ${pad2(h.week)}${h.released ? " · out " + esc(h.released) : ""}</p><h3>${esc(h.title)}</h3><ol>${h.parts.map((p) => `<li>${esc(p.title)}</li>`).join("")}</ol><span class="muted small mono">${[...new Set(kinds)].join(" + ")}</span></a>`;
  }
  function viewHomeworkList() {
    render(`<header class="page-h"><p class="kicker">// practice</p><h1>Homework 1–10</h1>
      <p class="lede">The fixed format: scientific notation, two significant digits, labeled diagrams, and show how you got every number. Each problem lists what to review first, then either a fully worked walkthrough (in a lesson's “Going further” page) or a step-by-step approach without the final numbers.</p>
      <p class="hello">// ${nm()}, try each one on paper before you open any help.</p></header>
      <div class="grid2">${Object.keys(C.homework).map(hwCard).join("")}</div>${footer()}`, "Homework");
  }
  function viewHomework(id) {
    const h = C.homework[id];
    if (!h || !h.parts) return viewNotFound();
    const pageName = (ch, key) => { const i = pageIndex(ch, key); return `Ch ${chap(ch).n} · ${esc(pageLabel(pagesOf(ch)[i]))}`; };
    const ids = Object.keys(C.homework), pos = ids.indexOf(id);
    const prev = ids[pos - 1], next = ids[pos + 1];
    render(`<header class="page-h"><p class="kicker">// week ${pad2(h.week)}${h.released ? " · released " + esc(h.released) : ""}</p><h1>${esc(h.title)}</h1>
      <p class="lede">Submit a PDF on Canvas (photos of handwritten work are fine). Scientific notation, two significant digits, labeled diagrams and axes, your reasoning shown. List the classmates you worked with.</p></header>
      ${h.parts.map((p, k) => { const ck = P.hwcheck[id + "." + k] || {}; return `<section class="card hw-part">
        <p class="kicker">// problem ${k + 1}</p><h2>${esc(p.title)}</h2><p class="muted small mono">${esc(p.source)}</p>
        <p>${esc(p.summary)}</p>
        <h4>Review first</h4><ul class="plain">${p.prep.map((x) => `<li><a href="#/learn/${x.ch}/${encodeURIComponent(x.page)}">${pageName(x.ch, x.page)}</a></li>`).join("")}${p.lecture ? `<li><a href="#/lecture/${p.lecture}"><span class="lid">${lecNum(p.lecture)}</span>${esc(lectureById(p.lecture).title)}</a> · lecture recap</li>` : ""}</ul>
        ${p.approach ? `<h4>How to approach it</h4><ol class="approach">${p.approach.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
        ${p.checklist ? `<h4>Submission checklist</h4><ul class="checklist">${p.checklist.map((c, j) => `<li><label><input type="checkbox" data-hw="${id}.${k}" data-j="${j}"${ck[j] ? " checked" : ""}> <span>${esc(c)}</span></label></li>`).join("")}</ul>` : ""}
        ${(p.tools && p.tools.length) || (p.links && p.links.length) ? `<h4>Tools & links</h4><div class="tl">${toolLinks(p.tools)}${(p.links || []).map((x) => `<a href="${esc(x.u)}" target="_blank" rel="noopener">${esc(x.t)}</a>`).join("")}</div>` : ""}
        ${p.solution ? `<h4>Worked solution</h4><p><a class="btn" href="#/learn/${p.solution.ch}/${p.solution.page}">Open the walkthrough · Ch ${chap(p.solution.ch).n} → Going further</a></p>` : ""}
      </section>`; }).join("")}
      <nav class="pager">${prev ? `<a class="btn" href="#/homework/${prev}">← ${esc(C.homework[prev].title)}</a>` : `<a class="btn" href="#/homework">← All homework</a>`}${next ? `<a class="btn" href="#/homework/${next}">${esc(C.homework[next].title)} →</a>` : `<a class="btn" href="#/week/${h.week}">Week ${h.week} →</a>`}</nav>${footer()}`, h.title);
    $$("[data-hw]", main).forEach((cb) => cb.addEventListener("change", () => {
      const key = cb.dataset.hw;
      P.hwcheck[key] = P.hwcheck[key] || {};
      P.hwcheck[key][cb.dataset.j] = cb.checked;
      save();
      const boxes = $$(`[data-hw="${key}"]`, main);
      if (cb.checked && boxes.every((b) => b.checked)) toast(`All boxes ticked, <b>${nm()}</b>. Ready to upload.`);
    }));
  }

  /* ---------------- reference ---------------- */
  const REFS = { formulas: "Formula sheet", constants: "Constants (cgs)", numbers: "Numbers & big ideas", hwmap: "Homework & reading map" };
  function refNav(which) { return `<div class="refnav">${Object.entries(REFS).map(([k, t]) => `<a class="btn small${k === which ? " primary" : ""}" href="#/ref/${k}">${t}</a>`).join("")}</div>`; }
  async function viewRef(which) {
    if (which === "constants") return viewConstants();
    main.innerHTML = `<div class="loading">Loading</div>`;
    const doc = await loadAppendix();
    const sec = doc.getElementById(which);
    if (!sec) return viewNotFound();
    render(`${refNav(which)}<article class="chapter content appx-wrap">${sec.outerHTML}</article>${footer()}`, sec.querySelector("h1") ? sec.querySelector("h1").textContent : "Reference");
  }
  function viewConstants() {
    render(`${refNav("constants")}
      <header class="page-h"><p class="kicker">// reference</p><h1>Constants & units (cgs)</h1>
      <p class="lede">The values from the course's constants sheet. The course works in cgs units: grams, centimeters, seconds, ergs.</p></header>
      ${LAB.constants.map((g) => `${secH(esc(g.g))}<table class="t const-t"><tr><th>Symbol</th><th>Value</th><th>What</th></tr>${g.rows.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join("")}</table>`).join("")}
      ${footer()}`, "Constants");
  }

  /* ---------------- lab ---------------- */
  function toolCard(id) {
    const t = LAB.tools[id];
    return `<a class="card tool" href="${esc(t.u)}"${t.internal ? "" : ' target="_blank" rel="noopener"'}><div class="tt"><h3>${esc(t.t)}</h3><span class="ext">${t.internal ? "→" : "↗"}</span></div><p>${esc(t.d)}</p><div style="margin-top:auto;padding-top:6px"><span class="ttag ${t.tag}">${t.tag}</span></div></a>`;
  }
  function viewLab() {
    const groups = [["observe", "Observe"], ["image", "Images & photometry"], ["data", "Data"], ["files", "Class data files"]];
    render(`
      <header class="page-h"><p class="kicker">// lab</p><h1>Observatory & data lab</h1>
        <p class="lede">The hands-on side of the course: when the sky is clear enough to observe, how to turn a telescope image into a magnitude, how to catch a planet transiting its star, and how to work with the catalog of every known exoplanet.</p>
        <p class="hello">// ${nm()}, everything here is free and runs in a browser or on a laptop.</p></header>
      ${secH("Tonight over Boston")}
      <a class="skychart" href="${esc(LAB.tools.sky.u)}" target="_blank" rel="noopener" title="Open the full Clear Sky Chart"><img src="https://test.cleardarksky.com/c/Boston/chart.gif" alt="Clear Sky Chart for Boston: hour-by-hour forecast of cloud cover, transparency, seeing and darkness" loading="lazy"></a>
      <div class="legend-grid">
        <div><b>Cloud cover</b>Dark blue = clear, lighter shades to white = cloudy.</div>
        <div><b>Transparency</b>How clear the air is above the clouds: dark blue is best for faint galaxies and nebulae.</div>
        <div><b>Seeing</b>Air steadiness: dark blue = sharp, steady stars; matters for planets and the Moon.</div>
        <div><b>Darkness</b>Black = dark sky; blue to white = twilight or moonlight. Cambridge is a Bortle 8–9 inner-city sky.</div>
      </div>
      <p class="muted small" style="margin-top:10px">Forecast image by the Clear Sky Chart project (CMC forecast models). Read it left to right in hours; each block is one hour.</p>
      ${secH("Hands-on workflows")}
      <div class="grid2">
        ${Object.entries(LAB.flows).map(([k, f]) => `<a class="card tool" href="#/lab/${k}"><p class="kicker" style="margin:0">// ${esc(f.sub)}</p><h3>${esc(f.t)}</h3><p>${esc(f.lead)}</p><span class="ext" style="margin-top:auto">${f.steps.length} steps →</span></a>`).join("")}
        <a class="card tool" href="#/lab/explorer"><p class="kicker" style="margin:0">// interactive</p><h3>Exoplanet explorer</h3><p>All ${fmtInt(6470)} confirmed planets from the NASA Exoplanet Archive: plot any two properties, color by discovery method, find any planet.</p><span class="ext" style="margin-top:auto">open →</span></a>
        <a class="card tool" href="#/lab/orbits"><p class="kicker" style="margin:0">// interactive · HW 4</p><h3>Orbit & wobble simulator</h3><p>A planet circles its star; watch the star's radial-velocity curve change as you change the planet's mass and period. Plus the orbit code from class, explained.</p><span class="ext" style="margin-top:auto">open →</span></a>
      </div>
      ${groups.map(([tag, label]) => `${secH(label)}<div class="grid3">${Object.keys(LAB.tools).filter((id) => LAB.tools[id].tag === tag).map(toolCard).join("")}</div>`).join("")}
      ${footer()}`, "Lab");
  }
  function codeBlock(code) {
    const html = esc(code).replace(/(#[^\n]*)/g, '<span class="c">$1</span>');
    return `<pre class="code"><button class="btn small copy" type="button" data-copy>Copy</button><code>${html}</code></pre>`;
  }
  function viewFlow(k) {
    const f = LAB.flows[k];
    if (!f) return viewNotFound();
    render(`
      <nav class="crumbs"><a href="#/lab">LAB</a><span>/</span><b>${esc(f.sub)}</b></nav>
      <header class="page-h"><p class="kicker">// workflow</p><h1>${esc(f.t)}</h1><p class="lede">${esc(f.lead)}</p></header>
      <ol class="flowx">${f.steps.map((s) => `<li><h4>${esc(s.h)}</h4><p>${esc(s.b)}</p>${s.tools ? `<div class="tl">${toolLinks(s.tools)}</div>` : ""}</li>`).join("")}</ol>
      ${f.code ? secH("The code") + codeBlock(f.code) : ""}
      <nav class="pager"><a class="btn" href="#/lab">← Lab</a><a class="btn" href="#/lab/explorer">Exoplanet explorer →</a></nav>
      ${footer()}`, f.t);
  }

  /* exoplanet explorer */
  let XP = null; // loaded data
  const XF = {
    pl_orbsmax: { l: "Orbit semi-major axis", u: "AU", log: true },
    pl_orbper: { l: "Orbital period", u: "days", log: true },
    pl_bmasse: { l: "Planet mass", u: "Earth masses", log: true },
    pl_rade: { l: "Planet radius", u: "Earth radii", log: true },
    pl_eqt: { l: "Equilibrium temperature", u: "K", log: false },
    pl_orbeccen: { l: "Eccentricity", u: "", log: false },
    st_teff: { l: "Star temperature", u: "K", log: false },
    st_mass: { l: "Star mass", u: "M☉", log: true },
    st_rad: { l: "Star radius", u: "R☉", log: true },
    sy_dist: { l: "Distance from us", u: "pc", log: true },
    disc_year: { l: "Discovery year", u: "", log: false },
  };
  const XPRESETS = [
    { t: "Mass vs orbit (the class notebook)", x: "pl_orbsmax", y: "pl_bmasse" },
    { t: "Radius vs period (transit view)", x: "pl_orbper", y: "pl_rade" },
    { t: "Hot or not: temperature vs orbit", x: "pl_orbsmax", y: "pl_eqt" },
    { t: "Discoveries over time", x: "disc_year", y: "sy_dist" },
  ];
  const XMETHODS = [["Transit", "#6fe3ff"], ["Radial Velocity", "#ffc86e"], ["Microlensing", "#a996ff"], ["Imaging", "#ff8ac2"], ["Other", "#8b96aa"]];
  // The Solar System for comparison: a (AU), P (d), M (M⊕), R (R⊕), Teq (K).
  const SOLAR = [["Mercury", 0.387, 88, 0.055, 0.383, 440], ["Venus", 0.723, 224.7, 0.815, 0.949, 230], ["Earth", 1, 365.25, 1, 1, 255], ["Mars", 1.524, 687, 0.107, 0.532, 210], ["Jupiter", 5.2, 4333, 317.8, 11.21, 110], ["Saturn", 9.58, 10759, 95.2, 9.45, 81], ["Uranus", 19.2, 30687, 14.5, 4.01, 58], ["Neptune", 30.1, 60190, 17.1, 3.88, 46]];
  const SOLKEY = { pl_orbsmax: 1, pl_orbper: 2, pl_bmasse: 3, pl_rade: 4, pl_eqt: 5 };
  async function viewExplorer() {
    render(`
      <nav class="crumbs"><a href="#/lab">LAB</a><span>/</span><b>EXOPLANET EXPLORER</b></nav>
      <header class="page-h"><p class="kicker">// interactive · NASA Exoplanet Archive</p><h1>Exoplanet explorer</h1>
        <p class="lede">Every confirmed planet in the archive's Planetary Systems table, one dot each. The same data the class Colab notebook pulls, with the Solar System's planets marked for comparison.</p>
        <p class="hello">// ${nm()}, try the presets, then hunt for the planets from class.</p></header>
      <div id="xpHost"><div class="loading">Loading planets</div></div>
      ${footer()}`, "Exoplanet explorer");
    try {
      if (!XP) {
        const r = await fetch("data/exoplanets.json");
        const j = await r.json();
        const ki = Object.fromEntries(j.keys.map((k, i) => [k, i]));
        XP = { meta: j, rows: j.rows.map((r) => { const o = {}; j.keys.forEach((k, i) => { o[k] = r[i]; }); o.methodName = j.methods[o.method]; o.facilityName = j.facilities[o.facility]; o.mg = ["Transit", "Radial Velocity", "Microlensing", "Imaging"].indexOf(o.methodName); if (o.mg < 0) o.mg = 4; return o; }), ki };
      }
    } catch (e) {
      const h = $("#xpHost"); if (h) h.innerHTML = `<div class="card"><p>Couldn't load the planet data (${esc(e.message)}).</p></div>`;
      return;
    }
    const host = $("#xpHost");
    if (!host) return;
    const opt = (sel) => Object.entries(XF).map(([k, f]) => `<option value="${k}"${k === sel ? " selected" : ""}>${esc(f.l)}${f.u ? " (" + esc(f.u) + ")" : ""}</option>`).join("");
    const counts = XMETHODS.map((m, i) => XP.rows.filter((r) => r.mg === i).length);
    host.innerHTML = `
      <div class="xp-presets">${XPRESETS.map((p, i) => `<button type="button" data-p="${i}"${i === 0 ? ' class="on"' : ""}>${esc(p.t)}</button>`).join("")}</div>
      <div class="xp-controls">
        <label>x axis<select id="xpX">${opt("pl_orbsmax")}</select></label>
        <label>y axis<select id="xpY">${opt("pl_bmasse")}</select></label>
        <label class="chk"><input type="checkbox" id="xpLX" checked> log x</label>
        <label class="chk"><input type="checkbox" id="xpLY" checked> log y</label>
        <label class="chk"><input type="checkbox" id="xpSol" checked> Solar System</label>
        <label>find a planet<input type="search" id="xpQ" placeholder="e.g. TRAPPIST-1 e" list="xpList"></label>
      </div>
      <datalist id="xpList"></datalist>
      <div class="xp-wrap"><canvas id="xpC" aria-label="Scatter plot of exoplanets"></canvas><div class="xp-tip" id="xpTip" hidden></div></div>
      <div class="xp-legend">${XMETHODS.map(([m, c], i) => `<button type="button" data-m="${i}"><i style="background:${c}"></i>${esc(m)} <small>${fmtInt(counts[i])}</small></button>`).join("")}</div>
      <div class="xp-quick"><span class="muted small mono" style="align-self:center">from class →</span>${[["51 Peg b", "HW 4 · L10"], ["TOI-2046 b", "transit section"], ["Kepler-16 b", "L1 poster"], ["TRAPPIST-1 e", "L1 poster"], ["Proxima Cen b", "nearest"]].map(([n, w]) => `<button class="btn small" type="button" data-find="${esc(n)}">${esc(n)} <span class="muted mono" style="font-size:11px">${esc(w)}</span></button>`).join("")}</div>
      <div id="xpInfo"></div>
      <p class="muted small" style="margin-top:14px">Snapshot of ${fmtInt(XP.rows.length)} planets (default parameter set), fetched ${esc(XP.meta.fetched)} from the <a href="${esc(LAB.tools.archive.u)}" target="_blank" rel="noopener">NASA Exoplanet Archive</a>, operated by Caltech under contract with NASA. Planets missing a value on either axis aren't drawn. Column meanings: <a href="${esc(LAB.tools.columns.u)}" target="_blank" rel="noopener">archive docs</a>.</p>`;
    const S = { x: "pl_orbsmax", y: "pl_bmasse", lx: true, ly: true, sol: true, off: new Set(), sel: null };
    const cv = $("#xpC"), tip = $("#xpTip");
    const ctx = cv.getContext("2d");
    let pts = [], frame = null;
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    function niceTicks(a, b, log) {
      if (log) { const t = []; for (let e = Math.floor(a); e <= Math.ceil(b); e++) if (e >= a - 1e-9 && e <= b + 1e-9) t.push(e); return t; }
      const span = b - a, raw = span / 6, mag = Math.pow(10, Math.floor(Math.log10(raw))), st = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= 7) || mag * 10;
      const t = []; for (let v = Math.ceil(a / st) * st; v <= b + 1e-9; v += st) t.push(+v.toFixed(10)); return t;
    }
    const fmtTick = (v, log) => { if (log) { const n = Math.pow(10, v); return n >= 1e4 || n < 1e-2 ? "1e" + v : String(+n.toPrecision(3)); } return Math.abs(v) >= 1e4 ? v.toExponential(0) : String(+v.toPrecision(4)); };
    function draw() {
      const dpr = window.devicePixelRatio || 1;
      const W = cv.clientWidth, H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const L = 62, R = 16, T = 16, B = 44;
      const val = (r, k, lg) => { const v = r[k]; if (v == null || !isFinite(v)) return null; if (lg) return v > 0 ? Math.log10(v) : null; return v; };
      const rows = XP.rows.filter((r) => !S.off.has(r.mg));
      const xs = [], ys = [];
      rows.forEach((r) => { const x = val(r, S.x, S.lx), y = val(r, S.y, S.ly); if (x != null && y != null) { xs.push(x); ys.push(y); } });
      const solarOK = S.sol && SOLKEY[S.x] && SOLKEY[S.y];
      if (solarOK) SOLAR.forEach((p) => { const x = S.lx ? Math.log10(p[SOLKEY[S.x]]) : p[SOLKEY[S.x]], y = S.ly ? Math.log10(p[SOLKEY[S.y]]) : p[SOLKEY[S.y]]; xs.push(x); ys.push(y); });
      if (!xs.length) { ctx.fillStyle = css("--muted"); ctx.font = "13px " + css("--sans"); ctx.fillText("No planets with both values.", L, T + 20); pts = []; return; }
      const q = (arr, p) => { const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.floor(p * (s.length - 1))))]; };
      let x0 = q(xs, 0), x1 = q(xs, 1), y0 = q(ys, 0), y1 = q(ys, 1);
      const px = (x1 - x0 || 1) * 0.04, py = (y1 - y0 || 1) * 0.05; x0 -= px; x1 += px; y0 -= py; y1 += py;
      const sx = (v) => L + (v - x0) / (x1 - x0) * (W - L - R), sy = (v) => H - B - (v - y0) / (y1 - y0) * (H - T - B);
      ctx.strokeStyle = css("--hair"); ctx.lineWidth = 1; ctx.fillStyle = css("--muted"); ctx.font = "11px " + css("--sans");
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      niceTicks(x0, x1, S.lx).forEach((t) => { const X = Math.round(sx(t)) + .5; ctx.beginPath(); ctx.moveTo(X, T); ctx.lineTo(X, H - B); ctx.stroke(); ctx.fillText(fmtTick(t, S.lx), X, H - B + 6); });
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      niceTicks(y0, y1, S.ly).forEach((t) => { const Y = Math.round(sy(t)) + .5; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(W - R, Y); ctx.stroke(); ctx.fillText(fmtTick(t, S.ly), L - 8, Y); });
      ctx.fillStyle = css("--ink-2"); ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText(`${XF[S.x].l}${XF[S.x].u ? " [" + XF[S.x].u + "]" : ""}`, L + (W - L - R) / 2, H - 4);
      ctx.save(); ctx.translate(13, T + (H - T - B) / 2); ctx.rotate(-Math.PI / 2); ctx.textBaseline = "middle"; ctx.fillText(`${XF[S.y].l}${XF[S.y].u ? " [" + XF[S.y].u + "]" : ""}`, 0, 0); ctx.restore();
      pts = [];
      ctx.globalAlpha = .72;
      rows.forEach((r) => {
        const x = val(r, S.x, S.lx), y = val(r, S.y, S.ly);
        if (x == null || y == null) return;
        const X = sx(x), Y = sy(y);
        pts.push([X, Y, r]);
        ctx.fillStyle = XMETHODS[r.mg][1];
        ctx.beginPath(); ctx.arc(X, Y, 2, 0, 6.2832); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (solarOK) {
        ctx.font = "11px " + css("--sans"); ctx.textAlign = "left"; ctx.textBaseline = "middle";
        const placed = [];
        SOLAR.forEach((p) => {
          const X = sx(S.lx ? Math.log10(p[SOLKEY[S.x]]) : p[SOLKEY[S.x]]), Y = sy(S.ly ? Math.log10(p[SOLKEY[S.y]]) : p[SOLKEY[S.y]]);
          ctx.strokeStyle = css("--heading"); ctx.fillStyle = css("--bg"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(X, Y, 4.5, 0, 6.2832); ctx.fill(); ctx.stroke();
          // nudge labels that would overlap an earlier one
          let ly = Y;
          while (placed.some(([px, py]) => Math.abs(px - X) < 64 && Math.abs(py - ly) < 12)) ly += 12;
          placed.push([X, ly]);
          ctx.fillStyle = css("--heading"); ctx.fillText(p[0], X + 8, ly);
        });
      }
      if (S.sel) {
        const hit = pts.find((p) => p[2] === S.sel);
        if (hit) {
          ctx.strokeStyle = css("--accent"); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(hit[0], hit[1], 9, 0, 6.2832); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(hit[0] - 16, hit[1]); ctx.lineTo(hit[0] - 11, hit[1]); ctx.moveTo(hit[0] + 11, hit[1]); ctx.lineTo(hit[0] + 16, hit[1]); ctx.stroke();
          ctx.fillStyle = css("--accent"); ctx.font = "600 12px " + css("--sans"); ctx.textAlign = hit[0] > W - 140 ? "right" : "left"; ctx.textBaseline = "bottom";
          ctx.fillText(S.sel.name, hit[0] + (hit[0] > W - 140 ? -12 : 12), hit[1] - 10);
        }
      }
    }
    const fmtv = (v, u) => (v == null ? "–" : (Math.abs(v) >= 1e4 ? Number(v).toExponential(2) : +Number(v).toPrecision(4)) + (u ? " " + u : ""));
    function info(r) {
      const el = $("#xpInfo");
      if (!el) return;
      if (!r) { el.innerHTML = ""; return; }
      const cells = [["Planet", r.name], ["Host star", r.host], ["Found by", r.methodName], ["Year · facility", `${r.disc_year} · ${r.facilityName}`], ["Period", fmtv(r.pl_orbper, "d")], ["Semi-major axis", fmtv(r.pl_orbsmax, "AU")], ["Mass", r.pl_bmasse == null ? "–" : `${fmtv(r.pl_bmasse, "M⊕")} · ${fmtv(r.pl_bmasse / 317.8, "M_J")}`], ["Radius", r.pl_rade == null ? "–" : `${fmtv(r.pl_rade, "R⊕")} · ${fmtv(r.pl_rade / 11.21, "R_J")}`], ["Equilibrium temp.", fmtv(r.pl_eqt, "K")], ["Star", `${fmtv(r.st_teff, "K")} · ${fmtv(r.st_mass, "M☉")}`], ["Distance", r.sy_dist == null ? "–" : `${fmtv(r.sy_dist, "pc")} · ${fmtv(r.sy_dist * 3.26, "ly")}`], ["Planets in system", fmtv(r.sy_pnum)]];
      el.innerHTML = `<div class="xp-info">${cells.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div><p class="small" style="margin-top:8px"><a href="https://exoplanetarchive.ipac.caltech.edu/overview/${encodeURIComponent(r.name)}" target="_blank" rel="noopener">Full archive page for ${esc(r.name)} ↗</a></p>`;
    }
    function select(r) { S.sel = r; info(r); draw(); }
    function find(qs) {
      const q = String(qs || "").trim().toLowerCase();
      if (!q) return;
      const r = XP.rows.find((x) => x.name.toLowerCase() === q) || XP.rows.find((x) => x.name.toLowerCase().startsWith(q)) || XP.rows.find((x) => x.name.toLowerCase().includes(q));
      if (!r) { toast(`No planet matching “${esc(qs)}”.`); return; }
      if (S.off.has(r.mg)) { S.off.delete(r.mg); paintLegend(); }
      select(r);
      const hit = pts.find((p) => p[2] === r);
      if (!hit) toast(`${esc(r.name)} has no value on one of these axes.`);
    }
    function paintLegend() { $$(".xp-legend button", host).forEach((b) => b.classList.toggle("off", S.off.has(+b.dataset.m))); }
    function setAxes(x, y) {
      S.x = x; S.y = y; S.lx = XF[x].log; S.ly = XF[y].log;
      $("#xpX").value = x; $("#xpY").value = y; $("#xpLX").checked = S.lx; $("#xpLY").checked = S.ly;
      draw();
    }
    $$(".xp-presets button", host).forEach((b) => b.addEventListener("click", () => { $$(".xp-presets button", host).forEach((o) => o.classList.toggle("on", o === b)); const p = XPRESETS[+b.dataset.p]; setAxes(p.x, p.y); }));
    $("#xpX").addEventListener("change", (e) => { $$(".xp-presets button", host).forEach((o) => o.classList.remove("on")); setAxes(e.target.value, S.y); });
    $("#xpY").addEventListener("change", (e) => { $$(".xp-presets button", host).forEach((o) => o.classList.remove("on")); setAxes(S.x, e.target.value); });
    $("#xpLX").addEventListener("change", (e) => { S.lx = e.target.checked; draw(); });
    $("#xpLY").addEventListener("change", (e) => { S.ly = e.target.checked; draw(); });
    $("#xpSol").addEventListener("change", (e) => { S.sol = e.target.checked; draw(); });
    $$(".xp-legend button", host).forEach((b) => b.addEventListener("click", () => { const m = +b.dataset.m; if (S.off.has(m)) S.off.delete(m); else S.off.add(m); paintLegend(); draw(); }));
    const qIn = $("#xpQ");
    qIn.addEventListener("input", () => {
      const q = qIn.value.trim().toLowerCase();
      $("#xpList").innerHTML = q.length < 2 ? "" : XP.rows.filter((r) => r.name.toLowerCase().includes(q)).slice(0, 12).map((r) => `<option value="${esc(r.name)}">`).join("");
      if (XP.rows.some((r) => r.name.toLowerCase() === q)) find(q);
    });
    qIn.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); find(qIn.value); } });
    $$("[data-find]", host).forEach((b) => b.addEventListener("click", () => { qIn.value = b.dataset.find; find(b.dataset.find); }));
    function nearest(ev) {
      const rc = cv.getBoundingClientRect();
      const mx = ev.clientX - rc.left, my = ev.clientY - rc.top;
      let best = null, bd = 100;
      for (const p of pts) { const d = (p[0] - mx) ** 2 + (p[1] - my) ** 2; if (d < bd) { bd = d; best = p; } }
      return { best, mx, my, rc };
    }
    cv.addEventListener("mousemove", (ev) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        const { best, mx, my, rc } = nearest(ev);
        if (!best) { tip.hidden = true; return; }
        const r = best[2];
        tip.innerHTML = `<b>${esc(r.name)}</b>${esc(r.methodName)} · ${r.disc_year}<br>${esc(XF[S.x].l)}: ${esc(fmtv(r[S.x], XF[S.x].u))}<br>${esc(XF[S.y].l)}: ${esc(fmtv(r[S.y], XF[S.y].u))}`;
        tip.hidden = false;
        const tw = tip.offsetWidth;
        tip.style.left = Math.min(mx + 14, rc.width - tw - 6) + "px";
        tip.style.top = Math.max(6, my - 70) + "px";
      });
    });
    cv.addEventListener("mouseleave", () => { tip.hidden = true; });
    cv.addEventListener("click", (ev) => { const { best } = nearest(ev); if (best) select(best[2]); });
    const ro = new ResizeObserver(() => { if (!document.body.contains(cv)) { ro.disconnect(); return; } draw(); });
    ro.observe(cv);
    draw();
  }

  /* orbit & wobble simulator */
  function viewOrbits() {
    render(`
      <nav class="crumbs"><a href="#/lab">LAB</a><span>/</span><b>ORBIT & WOBBLE</b></nav>
      <header class="page-h"><p class="kicker">// interactive · L10 · HW 4</p><h1>Orbit & wobble simulator</h1>
        <p class="lede">A planet and its star orbit their common center of mass. We can't see the planet, but the star's back-and-forth motion shifts its spectral lines. Change the planet and watch the star's radial-velocity curve respond: this is the Doppler method in one picture.</p></header>
      <div class="xp-presets" id="obPre">
        <button type="button" data-v="1,1,4333">Jupiter around the Sun</button>
        <button type="button" data-v="1,0.00315,365.25">Earth around the Sun</button>
        <button type="button" data-v="1,1,4">A hot Jupiter (P = 4 d)</button>
      </div>
      <div class="xp-controls">
        <label>Star mass <span class="mono" id="obMsV"></span><input type="range" id="obMs" min="0.2" max="3" step="0.05" value="1"></label>
        <label>Planet mass (Jupiters) <span class="mono" id="obMpV"></span><input type="range" id="obMp" min="-3" max="1.3" step="0.001" value="0"></label>
        <label>Period (days) <span class="mono" id="obPV"></span><input type="range" id="obP" min="0" max="5" step="0.001" value="3.637"></label>
      </div>
      <div class="xp-wrap"><canvas id="obC" style="height:340px" aria-label="Orbit and radial-velocity curve"></canvas></div>
      <div class="xp-info" id="obOut"></div>
      <p class="muted small" style="margin-top:10px">Circular, edge-on orbit. a from Kepler's third law (a³ = M P² in AU, years, solar masses); planet speed v = 2πa/P; star's wobble K = v × M_planet / M_star. The star is drawn with its wobble hugely exaggerated.</p>
      ${secH("The orbit code from class, explained")}
      <p>The class notebook doesn't use these formulas: it <i>integrates</i> the orbit. At every time step it computes gravity's pull toward the star, nudges the velocity by that acceleration, then moves the planet by that velocity. Repeat a few thousand times and an orbit appears. HW 4 #2 asks you to rebuild 51 Peg b this way, then plot −v<sub>x</sub> against time: that plot is the planet's radial-velocity curve, and scaling it by m<sub>planet</sub>/M<sub>star</sub> gives the star's.</p>
      ${codeBlock(LAB.orbitCode)}
      <ul class="approach">
        <li>Units are cgs throughout: G in cm³ g⁻¹ s⁻², masses in grams, distances in cm, times in seconds. Divide by 100 to turn cm/s into m/s.</li>
        <li>Step size matters: with too few steps per orbit the planet overshoots each curve, gains energy and spirals out. Aim for well over 100 steps per orbit.</li>
        <li>Updating the velocity before the position (as above) keeps orbits stable far better than the other order.</li>
      </ul>
      <div class="tl" style="margin-top:14px"><a class="int" href="#/homework/hw4">Homework 4</a><a class="int" href="#/lecture/L10">L10 recap</a>${toolLinks(["colab", "explorer"])}</div>
      ${footer()}`, "Orbit & wobble simulator");
    const cv = $("#obC"), ctx = cv.getContext("2d");
    const ms = $("#obMs"), mp = $("#obMp"), pp = $("#obP");
    const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    let st = {}, t0 = performance.now();
    function compute() {
      const M = +ms.value, Mj = Math.pow(10, +mp.value), Pd = Math.pow(10, +pp.value);
      const a = Math.cbrt(M * Math.pow(Pd / 365.25, 2));
      const v = 2 * Math.PI * a * 1.496e11 / (Pd * 86400);
      const K = v * (Mj / 1047.6) / M;
      st = { M, Mj, Pd, a, v, K };
      $("#obMsV").textContent = M.toFixed(2) + " M☉";
      $("#obMpV").textContent = (Mj < 0.01 ? (Mj * 317.8).toFixed(2) + " M⊕" : Mj.toPrecision(3) + " M_J");
      $("#obPV").textContent = Pd < 100 ? Pd.toFixed(2) + " d" : Math.round(Pd) + " d";
      const out = [["Orbit radius a", a.toPrecision(3) + " AU"], ["Planet's speed", (v / 1000).toPrecision(3) + " km/s"], ["Star's wobble K", K < 1 ? K.toPrecision(2) + " m/s" : K.toPrecision(3) + " m/s"], ["Detectable?", K > 1 ? "yes, with a good spectrograph" : K > 0.1 ? "only with the best (≲1 m/s)" : "not yet: below ~0.1 m/s"]];
      $("#obOut").innerHTML = out.map(([k, x]) => `<div><span>${esc(k)}</span><b>${esc(x)}</b></div>`).join("");
    }
    function frame(now) {
      if (!document.body.contains(cv)) return;
      const narrow = cv.clientWidth < 560;
      const wantH = narrow ? "470px" : "340px";
      if (cv.style.height !== wantH) cv.style.height = wantH;
      const dpr = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      // two orbits per 8-second loop; the RV marker sweeps the two-orbit curve
      const phase2 = ((now - t0) / 8000) % 1 * 4 * Math.PI, phase = phase2 % (2 * Math.PI);
      // layout: orbit box and RV box side by side, or stacked on narrow screens
      const ob = narrow ? { x: 0, y: 0, w: W, h: H * 0.56 } : { x: 0, y: 0, w: Math.min(W * 0.42, H), h: H };
      const rv = narrow ? { x: 0, y: H * 0.56, w: W, h: H * 0.44 } : { x: ob.w, y: 0, w: W - ob.w, h: H };
      const cx = ob.x + ob.w / 2, cy = ob.y + ob.h / 2 - 6, R = Math.min(ob.w, ob.h) * 0.36;
      ctx.strokeStyle = css("--hair-2"); ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]);
      const px = cx + R * Math.cos(phase), py = cy - R * Math.sin(phase);
      const wob = Math.min(18, 4 + 10 * Math.log10(1 + st.Mj * 10));
      const sxp = cx - wob * Math.cos(phase), syp = cy + wob * Math.sin(phase);
      ctx.fillStyle = "#ffc86e"; ctx.beginPath(); ctx.arc(sxp, syp, 10, 0, 6.2832); ctx.fill();
      ctx.fillStyle = css("--accent"); ctx.beginPath(); ctx.arc(px, py, 4 + Math.min(4, Math.log10(1 + st.Mj * 20)), 0, 6.2832); ctx.fill();
      ctx.fillStyle = css("--muted"); ctx.font = "11px " + css("--sans"); ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("observer ↓", cx, ob.y + ob.h - 6);
      // RV curve: the observer sits below the orbit; the star moves opposite to the planet, so its radial velocity is −K cos(phase) (positive = away).
      const L = rv.x + 54, Rr = rv.x + rv.w - 14, T = rv.y + 20, B = rv.y + rv.h - 30, mid = (T + B) / 2, amp = (B - T) / 2 - 8;
      const kTxt = st.K < 1 ? st.K.toPrecision(2) : st.K.toPrecision(3);
      ctx.strokeStyle = css("--hair"); ctx.beginPath(); ctx.moveTo(L, mid); ctx.lineTo(Rr, mid); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.stroke();
      ctx.fillStyle = css("--muted"); ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText("+" + kTxt, L - 6, mid - amp); ctx.fillText("0", L - 6, mid); ctx.fillText("−" + kTxt, L - 6, mid + amp);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("time → (two orbits) · star's radial velocity in m/s", (L + Rr) / 2, rv.y + rv.h - 8);
      ctx.strokeStyle = "#ffc86e"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (let i = 0; i <= 240; i++) { const f = i / 240 * 4 * Math.PI, X = L + (Rr - L) * i / 240, Y = mid + amp * Math.cos(f); if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y); }
      ctx.stroke(); ctx.lineWidth = 1;
      const fx = L + (Rr - L) * (phase2 / (4 * Math.PI)), fy = mid + amp * Math.cos(phase2);
      ctx.fillStyle = css("--heading"); ctx.beginPath(); ctx.arc(fx, fy, 4, 0, 6.2832); ctx.fill();
      ctx.fillStyle = css("--muted"); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("redshift (moving away)", L + 8, T - 14);
      ctx.textBaseline = "bottom"; ctx.fillText("blueshift (approaching)", L + 8, B + 14);
      requestAnimationFrame(frame);
    }
    [ms, mp, pp].forEach((el) => el.addEventListener("input", compute));
    $$("#obPre button").forEach((b) => b.addEventListener("click", () => { const [M, Mj, P] = b.dataset.v.split(",").map(Number); ms.value = M; mp.value = Math.log10(Mj); pp.value = Math.log10(P); compute(); }));
    compute();
    requestAnimationFrame(frame);
  }

  /* ---------------- profile ---------------- */
  function viewAbout() {
    const cp = courseProgress();
    const me = counted();
    render(`<header class="page-h"><p class="kicker">// profile</p><h1>${nm()}</h1>
        <p class="hello">// ${me ? `explorer #${fmtInt(me.n)}, launched ${new Date(me.t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "launched"} · <span data-explorers>${explorersLine()}</span></p></header>
      <div class="grid2">
        <section class="card"><h4 style="margin-top:0">Your name</h4>
          <form id="nameForm" class="xp-controls" style="margin:0"><label style="flex:1">first name<input type="search" id="nameIn" maxlength="24" value="${nm()}" style="width:100%"></label><button class="btn" type="submit">Save</button></form>
          <p class="muted small">Used only to greet you here. It stays in this browser and is never sent anywhere.</p></section>
        <section class="card"><h4 style="margin-top:0">Your progress</h4>
          <ul class="plain"><li>${cp.done}/${cp.total} lesson pages visited</li><li>${cp.mastered}/19 chapters mastered</li><li>${Object.keys(P.checks).length} questions answered · ${cp.accuracy == null ? "–" : pct(cp.accuracy)} correct</li><li>${Object.keys(P.lec).length} lecture recaps read</li></ul>
          <div class="qnav"><button class="btn small" id="exp" type="button">Export</button><label class="btn small">Import<input type="file" id="imp" accept="application/json" hidden></label><button class="btn small danger" id="rst" type="button">Reset</button></div>
          <p class="muted small">Progress lives in this browser only. Export it to move to another device.</p></section>
      </div>
      ${secH("About Harvard ASTRO1")}
      <div class="prose">
        <p>A personal, self-paced study companion for <b>${esc(C.course)}</b> (${esc(C.institution)}, ${esc(C.term)}). It is not an official course site and is not affiliated with Harvard.</p>
        <p><b>Where the content comes from.</b> The lesson text is the <i>ASTRON 1 Study & Recap Guide</i>, written for this course and paraphrasing ${esc(C.textbook)}, with worked homework, Hirshfeld's <i>Introduction to Stars and Planets</i> activities, Owocki's <i>Fundamentals of Astrophysics</i> and Pasachoff & Filippenko's <i>The Cosmos</i>. Lecture recaps were written from the course's slide decks; the slides themselves aren't reproduced. Figures were made for the guide from public datasets (Gaia, NASA Exoplanet Archive, SILSO). Videos are embedded from YouTube (mainly Crash Course Astronomy); second explanations link to OpenStax <i>Astronomy 2e</i>; simulations link to PhET and NAAP. The quiz questions were written for this app.</p>
        <p><b>The explorer counter</b> counts each browser once, the first time someone launches the course. It stores nothing but the number, on a free counter service (abacus). A private window or a second device counts again.</p>
        <p><b>Credits.</b> Planet data: NASA Exoplanet Archive (Caltech/NASA). Sky forecast: Clear Sky Chart. Font: Geist (SIL Open Font License). Math: KaTeX (MIT).</p>
      </div>${footer()}`, "Profile");
    $("#nameForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const v = cleanName($("#nameIn").value);
      if (!v) return;
      NAME = v; store.set(NAME_KEY, v); viewAbout(); toast(`Call sign updated: <b>${nm()}</b>.`);
    });
    $("#exp").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(P, null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "astro1-progress.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
    $("#imp").addEventListener("change", async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { P = Object.assign(blank(), JSON.parse(await f.text())); save(); viewAbout(); toast("Progress imported."); } catch (err) { alert("That file isn't a progress export."); }
    });
    $("#rst").addEventListener("click", () => { if (confirm(`Erase all progress in this browser, ${NAME || "explorer"}? Your name stays. This can't be undone.`)) { P = blank(); save(); viewAbout(); } });
  }
  function viewNotFound() { render(`<div class="card"><p class="kicker">// 404</p><h2>Lost in space, ${nm()}?</h2><p>This page doesn't exist. <a href="#/">Back to mission control</a></p></div>`, "Not found"); }
  function footer() {
    return `<footer class="foot"><p>HARVARD ASTRO1 · a personal study companion for ${esc(C.course)}, ${esc(C.institution)}. Not an official Harvard site. Videos © their creators, embedded from YouTube; OpenStax <i>Astronomy 2e</i> is CC BY 4.0; planet data from the NASA Exoplanet Archive.</p></footer>`;
  }

  /* ---------------- router ---------------- */
  function route() {
    closeMenu();
    if (!NAME) return showGate();
    const h = decodeURIComponent((location.hash || "#/").slice(1));
    const [, a, b, c] = h.split("/");
    switch (a || "") {
      case "": return viewHome();
      case "schedule": return viewSchedule();
      case "week": return viewWeek(b);
      case "learn": return viewLesson(b, c);
      case "lectures": case "materials": return viewLectures();
      case "lecture": return viewLecture(b);
      case "homework": return b ? viewHomework(b) : viewHomeworkList();
      case "exams": return viewExams();
      case "exam": return viewExam(b);
      case "review": return viewReview();
      case "ref": return viewRef(b || "formulas");
      case "lab": return !b ? viewLab() : b === "explorer" ? viewExplorer() : b === "orbits" ? viewOrbits() : viewFlow(b);
      case "about": return viewAbout();
      default: return viewNotFound();
    }
  }

  /* ---------------- name gate ---------------- */
  function showGate() {
    const gate = $("#gate");
    gate.hidden = false;
    document.body.style.overflow = "hidden";
    const input = $("#gateName");
    setTimeout(() => input.focus(), 50);
    const paint = () => { $("#gateCount").innerHTML = explorers == null ? "explorer count offline" : explorersLine(); };
    paint();
    if (explorers == null) counterGet().then((n) => { if (n != null) explorers = n; paint(); });
  }
  $("#gateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const v = cleanName($("#gateName").value);
    if (!v) { $("#gateErr").textContent = "Just a first name, any name."; return; }
    NAME = v; store.set(NAME_KEY, v);
    $("#gate").hidden = true;
    document.body.style.overflow = "";
    route();
    toast(`Welcome aboard, <b>${nm()}</b>.`);
    await countMeOnce();
    const me = counted();
    if (me) toast(`Welcome aboard, <b>${nm()}</b>. You're explorer #${fmtInt(me.n)}.`);
  });

  /* ---------------- chrome ---------------- */
  const menuBtn = $("#menuBtn"), scrim = $("#scrim");
  function closeMenu() { document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", () => { const open = !document.body.classList.contains("menu-open"); document.body.classList.toggle("menu-open", open); menuBtn.setAttribute("aria-expanded", String(open)); });
  scrim.addEventListener("click", closeMenu);
  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const light = root.dataset.theme === "light";
    if (light) delete root.dataset.theme; else root.dataset.theme = "light";
    store.set("astro1.theme", light ? "dark" : "light");
    if (location.hash.startsWith("#/lab/explorer")) window.dispatchEvent(new Event("resize"));
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!location.hash.startsWith("#/learn/") && !location.hash.startsWith("#/lecture/")) return;
    const pager = $(".lesson-pager, .lecture-pager");
    if (!pager) return;
    const links = $$("a.btn", pager);
    if (e.key === "ArrowRight" && $("#nextBtn")) location.hash = $("#nextBtn").getAttribute("href");
    if (e.key === "ArrowLeft" && links.length > 1) location.hash = links[0].getAttribute("href");
  });
  window.addEventListener("hashchange", route);

  // Boot: route first, then the counter in the background (count this browser once if it wasn't counted yet).
  route();
  if (NAME) {
    (counted() ? counterGet() : countMeOnce().then(() => explorers)).then((n) => { if (n != null) explorers = n; paintCounters(); });
  }
})();
