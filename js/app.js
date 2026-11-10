/* Harvard ASTRO1: a self-paced course app for ASTRON 1. No build step, no server: plain files. */
(function () {
  "use strict";
  const C = window.COURSE;
  const MAN = window.MANIFEST || {};
  const MEDIA = window.MEDIA;
  const MAT = window.MATERIALS || {};
  const MASTERY = 0.8;

  const main = document.getElementById("main");
  const sidebar = document.getElementById("sidebar");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s || "").replace(/[‐-―-]/g, "-").replace(/\s+/g, "").toLowerCase();
  const chap = (id) => C.chapters.find((c) => c.id === id);
  const pct = (x) => Math.round(100 * x) + "%";

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

  /* ---------------- progress (this browser only) ---------------- */
  const KEY = "astro1.progress.v1";
  const blank = () => ({ seen: {}, checks: {}, quiz: {}, exams: [], wrong: {}, videos: {}, last: null, started: Date.now() });
  let P = blank();
  try { P = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* private mode */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* ignore */ } }

  function recordAnswer(q, ok, where) {
    const prev = P.checks[q.id] || { n: 0, ok: 0 };
    P.checks[q.id] = { n: prev.n + 1, ok: prev.ok + (ok ? 1 : 0), last: ok, t: Date.now(), where };
    if (ok) delete P.wrong[q.id]; else P.wrong[q.id] = Date.now();
    save();
  }

  /* ---------------- lesson structure ---------------- */
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
  function currentWeek() {
    const today = new Date().toISOString().slice(0, 10);
    if (today < C.weeks[0].start) return C.weeks[0];
    for (const w of C.weeks) if (today >= w.start && today <= w.end) return w;
    return C.weeks[C.weeks.length - 1];
  }
  const weekOf = (n) => C.weeks.find((w) => w.n === n);
  const lecturesFor = (id) => C.weeks.flatMap((w) => w.lectures.filter((l) => l.ch.includes(id)).map((l) => Object.assign({ week: w.n }, l)));

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
    const data = {
      head: head ? head.outerHTML : "",
      tags: head ? $$(".ch-tags span", head).map((s) => ({ cls: s.className, html: s.innerHTML })) : [],
      context: ctx ? ctx.outerHTML : "",
      recap: recap ? recap.innerHTML : "",
      chunks,
    };
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
    // scrollable tables on small screens
    $$("table", el).forEach((t) => {
      if (t.parentElement.classList.contains("tscroll")) return;
      const w = document.createElement("div"); w.className = "tscroll"; t.replaceWith(w); w.appendChild(t);
    });
    // worked answers: think first, then reveal
    $$(".qitem", el).forEach((qi) => {
      const a = $(".a", qi);
      if (!a || $(".reveal", qi)) return;
      const b = document.createElement("button");
      b.className = "reveal"; b.type = "button"; b.textContent = "Show worked answer";
      b.addEventListener("click", () => { qi.classList.add("open"); b.remove(); });
      a.before(b);
    });
    $$("img", el).forEach((img) => { img.loading = "lazy"; img.decoding = "async"; if (!img.alt) img.alt = ""; });
    // video facades
    $$(".video [data-yt]", el).forEach((btn) => btn.addEventListener("click", () => playVideo(btn)));
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
    const watched = P.videos[v.id] ? '<span class="watched">✓ watched</span>' : "";
    return `<figure class="video">
      <button class="vthumb" type="button" data-yt="${esc(v.id)}" aria-label="Play video: ${esc(v.title)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"><span class="play" aria-hidden="true"></span><span class="dur">${esc(v.dur)}</span></button>
      <figcaption><b>${esc(v.title)}</b><span>${esc(v.source)} ${watched} · <a href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener">YouTube ↗</a></span></figcaption>
    </figure>`;
  }
  function linkRow(item) {
    const icon = item.kind === "read" ? "📖" : "🧪";
    return `<li><a href="${esc(item.url)}" target="_blank" rel="noopener"><span class="li-ico" aria-hidden="true">${icon}</span><span>${esc(item.title)}</span><span class="ext">↗</span></a></li>`;
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
    ids.forEach((id) => (MAT[id] || []).forEach((m) => rows.push(`<li><a href="${esc(m.url)}" target="_blank" rel="noopener"><span class="li-ico" aria-hidden="true">${id.startsWith("S") ? "🗂️" : "🖥️"}</span><span>${esc(m.title)}</span><span class="ext">↗</span></a></li>`)));
    if (rows.length) return `<ul class="mat">${rows.join("")}</ul>`;
    return empty === false ? "" : `<p class="placeholder">${esc(empty || "Slides not added yet.")}</p>`;
  }
  function bar(frac, cls) { return `<span class="bar ${cls || ""}"><i style="width:${Math.round(100 * frac)}%"></i></span>`; }
  function chapterChip(id, extra) {
    const c = chap(id), p = chapterProgress(id);
    const state = p.mastered ? "mastered" : p.done ? "started" : "";
    return `<a class="chip ${state}" href="#/learn/${id}"><span class="chip-n">${c.n}</span><span class="chip-t">${esc(c.title)}${extra ? `<small>${extra}</small>` : ""}</span>${bar(p.frac)}${p.mastered ? '<span class="star" title="Mastered">★</span>' : ""}</a>`;
  }
  function setTitle(t) { document.title = t ? t + " · Harvard ASTRO1" : "Harvard ASTRO1"; }
  function render(html, title) {
    main.innerHTML = html;
    setTitle(title);
    enhance(main);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    renderSidebar();
    renderTopProgress();
  }

  /* ---------------- questions UI ---------------- */
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function qHTML(q, n, opts = {}) {
    const order = q.fixed ? q.o.map((_, i) => i) : shuffle(q.o.map((_, i) => i));
    const name = "q" + Math.random().toString(36).slice(2);
    return `<div class="q" data-qid="${esc(q.id)}" data-mode="${opts.mode || "check"}">
      <div class="q-stem">${n ? `<span class="q-n">${n}</span>` : ""}<div>${q.q}</div></div>
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
    const link = q.s && pagesOf(q.ch).some((p) => norm(p.key) === norm(q.s)) ? ` <a class="fb-link" href="#/learn/${q.ch}/${encodeURIComponent(q.s)}">Review ${esc(q.s)} →</a>` : "";
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
  function renderTopProgress() {
    const cp = courseProgress();
    $("#topProgress").innerHTML = `${bar(cp.frac, "thin")}<span>${pct(cp.frac)}</span>`;
  }
  function renderSidebar() {
    const h = location.hash || "#/";
    const parts = [];
    let lastPart = "";
    C.order.slice().sort((a, b) => chap(a).n - chap(b).n).forEach((id) => {
      const c = chap(id), p = chapterProgress(id);
      if (c.part !== lastPart) { parts.push(`<div class="nav-part">Part ${esc(c.part)}</div>`); lastPart = c.part; }
      const active = h.startsWith("#/learn/" + id) ? " active" : "";
      const mark = p.mastered ? '<span class="nav-mark m" title="Mastered">★</span>' : p.done === p.total ? '<span class="nav-mark d">✓</span>' : p.done ? `<span class="nav-mark p">${Math.round(100 * p.frac)}%</span>` : "";
      parts.push(`<a class="nav-ch${active}" href="#/learn/${id}"><span class="nav-n">${c.n}</span><span class="nav-t">${esc(c.title)}</span>${mark}</a>`);
    });
    const wrong = Object.keys(P.wrong).filter((id) => QBYID[id]).length;
    const link = (href, label, ico, badge) => `<a class="nav-link${h === href || (href !== "#/" && h.startsWith(href)) ? " active" : ""}" href="${href}"><span class="nav-ico" aria-hidden="true">${ico}</span>${label}${badge ? `<span class="badge">${badge}</span>` : ""}</a>`;
    sidebar.innerHTML = `
      <div class="nav-group">
        ${link("#/", "Home", "⌂")}
        ${link("#/schedule", "Course map, week by week", "🗓")}
      </div>
      <div class="nav-group"><div class="nav-h">Lessons</div>${parts.join("")}</div>
      <div class="nav-group"><div class="nav-h">Practice</div>
        ${link("#/homework", "Homework", "✎")}
        ${link("#/exams", "Practice exams", "⏱")}
        ${link("#/review", "Review my mistakes", "↻", wrong || "")}
      </div>
      <div class="nav-group"><div class="nav-h">Reference</div>
        ${link("#/ref/formulas", "Formula sheet", "∑")}
        ${link("#/ref/numbers", "Numbers worth knowing", "#")}
        ${link("#/ref/hwmap", "Homework & reading map", "⌖")}
        ${link("#/materials", "Slides & section materials", "🗂")}
        ${link("#/about", "About & my progress", "ⓘ")}
      </div>
      <p class="nav-foot">${esc(C.course)}<br>${esc(C.institution)} · ${esc(C.term)}</p>`;
  }

  /* ---------------- views ---------------- */
  function viewHome() {
    const cp = courseProgress();
    const nx = nextStep();
    const cw = currentWeek();
    const wrong = Object.keys(P.wrong).filter((id) => QBYID[id]).length;
    const nxHTML = nx
      ? `<a class="btn primary big" href="#/learn/${nx.id}/${nx.i}">${cp.done ? "Continue" : "Start the course"} <span>Ch ${chap(nx.id).n} · ${esc(nx.i === 0 ? chap(nx.id).title : pageLabel(nx.page))}</span></a>`
      : `<a class="btn primary big" href="#/exams">Everything visited · take a practice exam</a>`;
    const weeksHTML = C.modules.map((m) => `
      <section class="module">
        <h3 class="module-h"><span>Module ${m.n}</span>${esc(m.title)}</h3>
        <div class="weeks">${m.weeks.map((n) => weekCard(weekOf(n), cw)).join("")}</div>
      </section>`).join("");
    render(`
      <section class="hero">
        <div class="hero-text">
          <p class="kicker">${esc(C.course)} · ${esc(C.institution)} · ${esc(C.term)}</p>
          <h1>Harvard <span>ASTRO1</span></h1>
          <p class="lede">Your course from day one to the final exam. Every textbook chapter becomes a short run of pages: read, watch an explainer, check yourself with multiple-choice questions, then pass the chapter quiz.</p>
          <div class="hero-actions">${nxHTML}<a class="btn ghost" href="#/week/${cw.n}">This week in class: ${cw.final ? "Final exam" : "Week " + cw.n}</a></div>
        </div>
        <div class="hero-stats">
          <div class="ring" style="--p:${cp.frac}"><b>${pct(cp.frac)}</b><span>of lesson pages</span></div>
          <ul class="stat-list">
            <li><b>${cp.mastered}/19</b> chapters mastered <small>(quiz ≥ ${MASTERY * 100}%)</small></li>
            <li><b>${cp.accuracy == null ? "–" : pct(cp.accuracy)}</b> of ${cp.tries} answers correct</li>
            <li><a href="#/review"><b>${wrong}</b> questions to review</a></li>
          </ul>
        </div>
      </section>
      ${nowCard(cw)}
      <section class="howto">
        <h2>How this course works</h2>
        <ol class="steps">
          <li><b>Follow the weeks.</b> The course map mirrors the Fall 2026 syllabus: lectures, reading, Friday section and homework for each week.</li>
          <li><b>Go page by page.</b> Each chapter has an overview, one page per textbook section, worked practice, a "going further" page with homework walkthroughs, and a quiz.</li>
          <li><b>Watch and read around it.</b> Each page brings a short video (Crash Course Astronomy and others), the matching OpenStax section and a simulation where one helps.</li>
          <li><b>Check yourself.</b> Answer the questions on each page, then pass the chapter quiz with ${MASTERY * 100}% to master the chapter. Wrong answers land in <a href="#/review">Review</a>.</li>
          <li><b>Prove it.</b> Before the exams, take the <a href="#/exams">midterm and final practice exams</a>.</li>
        </ol>
      </section>
      <section class="roadmap-sec"><h2>Your path through the course</h2>${weeksHTML}</section>
      ${footer()}
    `, "");
  }
  function nowCard(cw) {
    if (cw.final) return `<section class="now"><div><p class="kicker">Right now in class</p><h2>Exam period: final exam</h2><p>${esc(cw.exam.when)} · covers ${esc(cw.exam.covers)}.</p></div><a class="btn" href="#/exam/final">Final practice exam →</a></section>`;
    const chs = [...new Set(cw.read.map((r) => r.ch))];
    return `<section class="now">
      <div><p class="kicker">Right now in class · Week ${cw.n} · ${esc(cw.dates)}</p>
        <h2>${cw.lectures.map((l) => esc(l.id + " " + l.title)).join(" · ") || "No lectures"}</h2>
        ${cw.exam ? `<p class="exam-flag">${esc(cw.exam.title)}: ${esc(cw.exam.when)}</p>` : ""}
      </div>
      <div class="now-chips">${chs.map((id) => chapterChip(id)).join("")}</div>
      <a class="btn" href="#/week/${cw.n}">Open week ${cw.n} →</a>
    </section>`;
  }
  function weekCard(w, cw) {
    const now = w.n === cw.n ? " now" : "";
    const past = w.end < new Date().toISOString().slice(0, 10) ? " past" : "";
    const chs = [...new Set(w.read.map((r) => r.ch))];
    const hw = (w.hw || []).map((id) => { const h = C.homework[id]; return `<a class="tag ${h.pending ? "pending" : "hw"}" href="#/homework/${id}">${esc(h.title)}${h.pending ? " (not added)" : ""}</a>`; }).join("");
    const exam = w.exam ? `<a class="tag exam" href="#/exam/${w.exam.id}">${esc(w.exam.title)}</a>` : "";
    return `<article class="week${now}${past}">
      <a class="week-h" href="#/week/${w.n}"><span class="wk">${w.final ? "Finals" : "Week " + w.n}</span><span class="dt">${esc(w.dates)}</span>${now ? '<span class="here">this week</span>' : ""}</a>
      ${w.lectures.length ? `<ul class="lec">${w.lectures.map((l) => `<li><span class="lid">${l.id}</span>${esc(l.title)}</li>`).join("")}</ul>` : ""}
      ${chs.length ? `<div class="chips">${chs.map((id) => chapterChip(id)).join("")}</div>` : ""}
      ${w.final ? `<div class="chips"><a class="chip" href="#/exam/final"><span class="chip-n">★</span><span class="chip-t">Final practice exam<small>all 19 chapters</small></span></a></div>` : ""}
      <div class="tags">${w.section ? `<span class="tag sec">Section: ${esc(w.section.title)}</span>` : ""}${hw}${exam}</div>
    </article>`;
  }
  function viewSchedule() {
    const cw = currentWeek();
    render(`
      <header class="page-h"><p class="kicker">${esc(C.course)} · ${esc(C.term)}</p><h1>Course map, week by week</h1>
      <p class="lede">Lectures are on Tuesdays and Thursdays, sections on Fridays. Reading responses are due Mondays at 11:59 pm; homework is due Thursdays at 10:30 am. Chapter 3 is not on the reading list, but its ideas (Kepler's laws, the scientific method) come back all term, so it's included as background.</p></header>
      ${C.modules.map((m) => `<section class="module"><h3 class="module-h"><span>Module ${m.n}</span>${esc(m.title)}</h3><div class="weeks">${m.weeks.map((n) => weekCard(weekOf(n), cw)).join("")}</div></section>`).join("")}
      ${footer()}`, "Course map");
  }
  function viewWeek(n) {
    const w = weekOf(+n);
    if (!w) return viewNotFound();
    const lec = w.lectures.map((l) => `
      <div class="card lec-card">
        <h3><span class="lid">${l.id}</span>${esc(l.title)}</h3>
        <p class="muted">Lessons: ${l.ch.map((id) => `<a href="#/learn/${id}">Ch ${chap(id).n} ${esc(chap(id).title)}</a>`).join(" · ")}</p>
        <h4>Slides</h4>${materialsList([l.id], "Slides not added yet. Add them in js/materials.js.")}
      </div>`).join("");
    const reads = w.read.map((r) => { const c = chap(r.ch), p = chapterProgress(r.ch); return `
      <div class="read-row">
        ${chapterChip(r.ch, r.due ? "Reading due " + r.due : r.note || "")}
        <a class="btn small" href="#/learn/${r.ch}/${p.done && p.done < p.total ? firstUnseen(r.ch) : 0}">${p.done === 0 ? "Start" : p.done < p.total ? "Continue" : "Revisit"}</a>
      </div>${r.note && r.due ? `<p class="note">${esc(r.note)}</p>` : ""}`; }).join("");
    const hw = (w.hw || []).map((id) => hwCard(id)).join("");
    const prev = weekOf(w.n - 1), next = weekOf(w.n + 1);
    render(`
      <header class="page-h"><p class="kicker">Module ${C.modules.find((m) => m.weeks.includes(w.n)).n} · ${esc(C.modules.find((m) => m.weeks.includes(w.n)).title)}</p>
        <h1>${w.final ? "Exam period" : "Week " + w.n} <small>${esc(w.dates)}</small></h1>${w.note ? `<p class="note">${esc(w.note)}</p>` : ""}</header>
      ${w.exam ? `<div class="card exam-card"><h3>${esc(w.exam.title)}</h3><p>${esc(w.exam.when)} · covers ${esc(w.exam.covers)}</p><a class="btn primary" href="#/exam/${w.exam.id}">Take the ${w.exam.id === "midterm" ? "midterm" : "final"} practice exam</a></div>` : ""}
      ${reads ? `<h2 class="sec-h">Read & learn</h2><div class="reads">${reads}</div>` : ""}
      ${lec ? `<h2 class="sec-h">Lectures</h2><div class="grid2">${lec}</div>` : ""}
      ${w.section ? `<h2 class="sec-h">Friday section</h2><div class="card"><h3>${esc(w.section.title)}</h3>${materialsList([w.section.id], "Section materials not added yet.")}</div>` : ""}
      ${hw ? `<h2 class="sec-h">Homework</h2><div class="grid2">${hw}</div>` : ""}
      <nav class="pager">${prev ? `<a class="btn" href="#/week/${prev.n}">← ${prev.final ? "Finals" : "Week " + prev.n}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/week/${next.n}">${next.final ? "Exam period" : "Week " + next.n} →</a>` : ""}</nav>
      ${footer()}`, w.final ? "Exam period" : "Week " + w.n);
  }
  function firstUnseen(id) { const pages = pagesOf(id); for (let i = 0; i < pages.length; i++) if (!seen(id, i)) return i; return 0; }

  async function viewLesson(id, arg) {
    const c = chap(id);
    if (!c || !MAN[id]) return viewNotFound();
    main.innerHTML = `<div class="loading">Loading Chapter ${c.n}…</div>`;
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
    else {
      body = sectionBody(id, page, data.chunks[i - 1]); // page 0 is the overview, so page i shows h2 chunk i-1
    }
    P.last = location.hash;
    if (page.kind !== "quiz") P.seen[id + "/" + i] = Date.now();
    save();
    render(`
      <div class="lesson">
        <nav class="crumbs"><a href="#/week/${c.week}">Week ${c.week}</a><span>›</span><a href="#/learn/${id}">Ch ${c.n} · ${esc(c.title)}</a><span>›</span><b>Page ${i + 1} of ${pages.length}</b></nav>
        <div class="stepper" aria-label="Pages in this chapter">${steps}</div>
        ${body}
        <nav class="pager lesson-pager">
          ${prevHref ? `<a class="btn" href="${prevHref}">← Back</a>` : "<span></span>"}
          ${nextHref ? `<a class="btn primary" href="${nextHref}" id="nextBtn">Next: ${esc(nextLabel)} →</a>` : `<a class="btn primary" href="#/exams">Finish: practice exams →</a>`}
        </nav>
      </div>`, `Ch ${c.n} · ${page.kind === "intro" ? c.title : pageLabel(page)}`);
    if (page.kind === "quiz") startChapterQuiz(id, $("#quizHost"));
    bindChecks(main, id + "/" + i, () => renderTopProgress());
  }
  function introBody(id, data, pages) {
    const c = chap(id), m = MAN[id];
    const lecs = lecturesFor(id);
    const w = weekOf(c.week);
    const read = w.read.find((r) => r.ch === id);
    const hwHere = Object.entries(C.homework).flatMap(([hid, h]) => (h.parts || []).map((p, k) => ({ hid, h, p, k })).filter((x) => x.p.solution.ch === id));
    const qn = (QB[id] || []).length;
    return `
      ${data.head}
      ${data.context}
      <div class="grid2 intro-grid">
        <section class="card">
          <h3>In this chapter</h3>
          <ol class="toc">${pages.map((p, k) => `<li class="${seen(id, k) ? "done" : ""}"><a href="#/learn/${id}/${k}">${esc(k === 0 ? "Overview (this page)" : pageLabel(p))}</a></li>`).join("")}</ol>
        </section>
        <section class="card">
          <h3>In class</h3>
          <ul class="plain">
            <li><b>Week ${c.week}</b> · ${esc(w.dates)}${c.background ? " · background reading" : ""}</li>
            ${lecs.map((l) => `<li><span class="lid">${l.id}</span>${esc(l.title)}</li>`).join("")}
            <li>Textbook: <i>The Essential Cosmic Perspective</i>, ${m.bookPages ? "pp. " + esc(m.bookPages) : "Ch " + c.n}${read && read.due ? ` · reading due ${esc(read.due)}` : ""}</li>
            ${hwHere.map((x) => `<li class="hwli">Homework walkthrough: <a href="#/learn/${id}/further">${esc(x.h.title)} #${x.k + 1} “${esc(x.p.title)}”</a></li>`).join("")}
          </ul>
          ${materialsList(lecs.map((l) => l.id), false)}
          <p class="muted small">${qn} quiz questions · pass the chapter quiz with ${MASTERY * 100}% to master it.</p>
        </section>
      </div>
      ${mediaPanel(MEDIA.intro(id), "Start with a video")}
      <section class="panel tip"><b>How to work this chapter.</b> Skim the textbook pages first if you have time. Then go page by page here: read the page, watch its video if anything is unclear, and answer the check questions before moving on. The worked answers on the practice page are for <i>after</i> you've tried.</section>`;
  }
  function sectionBody(id, page, chunk) {
    const raw = chunk ? chunk.head + chunk.html : "<p>Missing content.</p>";
    let extra = "";
    if (page.kind === "section") {
      const qs = (QB[id] || []).filter((q) => norm(q.s) === norm(page.key)).slice(0, 4);
      extra += mediaPanel(MEDIA.section(id, page.key));
      if (qs.length) extra += `<section class="panel checks"><h3 class="panel-h">Check yourself</h3><p class="muted small">Pick an answer to see why it is right or wrong. These also appear in the chapter quiz.</p>${qs.map((q, k) => qHTML(q, k + 1)).join("")}</section>`;
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
        <h3 class="panel-h">Chapter ${chap(id).n} quiz ${best != null ? `<span class="best">best so far ${pct(best)}</span>` : ""}</h3>
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
      host.innerHTML = `<div class="qprog">${bar(k / qs.length)}<span>Question ${k + 1} of ${qs.length} · ${right} right</span></div>${qHTML(qs[k], k + 1)}<div class="qnav" hidden><button class="btn primary" type="button" id="qNext">${k + 1 < qs.length ? "Next question →" : "See my score"}</button></div>`;
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
      if (!onlyIds) {
        const prev = P.quiz[id] || { best: 0, attempts: 0 };
        P.quiz[id] = { best: Math.max(prev.best, score), last: score, attempts: prev.attempts + 1, t: Date.now() };
        P.seen[id + "/" + (pagesOf(id).length - 1)] = Date.now();
        save();
      }
      const passed = score >= MASTERY;
      const pos = C.order.indexOf(id), nextCh = C.order[pos + 1];
      host.innerHTML = `
        <div class="result ${passed ? "pass" : "fail"}">
          <div class="score">${right}/${qs.length}<small>${pct(score)}</small></div>
          <div><h4>${passed ? (score === 1 ? "Perfect. Chapter mastered." : "Chapter mastered.") : "Not yet mastered."}</h4>
          <p>${passed ? "You've got this chapter. Move on, and come back to the missed ones in Review." : `You need ${MASTERY * 100}% to master the chapter. Re-read the pages linked under each missed question, then retry.`}</p></div>
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
      renderSidebar(); renderTopProgress();
    }
    step();
  }

  /* practice exams: everything on one page, graded at the end */
  function pickExam(def) {
    const pool = def.chapters.flatMap((ch) => (QB[ch] || []).map((q) => ({ q, w: def === C.exams.final && +ch.slice(2) >= 11 ? 1.6 : 1 })));
    return pool.map((x) => ({ q: x.q, k: Math.pow(Math.random(), 1 / x.w) })).sort((a, b) => b.k - a.k).slice(0, def.count).map((x) => x.q)
      .sort((a, b) => a.ch.localeCompare(b.ch));
  }
  function viewExams() {
    const hist = P.exams.slice(-8).reverse();
    render(`
      <header class="page-h"><p class="kicker">Practice</p><h1>Practice exams</h1><p class="lede">Exam mode: no feedback until you submit, then a full review with explanations and links back to the pages. Each attempt draws a fresh set of questions.</p></header>
      <div class="grid2">${Object.entries(C.exams).map(([id, e]) => `<div class="card"><h3>${esc(e.title)}</h3><p>${esc(e.blurb)}</p><a class="btn primary" href="#/exam/${id}">Start</a></div>`).join("")}</div>
      ${hist.length ? `<h2 class="sec-h">Recent attempts</h2><table class="t hist"><tr><th>Exam</th><th>When</th><th class="num">Score</th></tr>${hist.map((h) => `<tr><td>${esc(C.exams[h.id] ? C.exams[h.id].title : h.id)}</td><td>${new Date(h.t).toLocaleString()}</td><td class="num">${h.right}/${h.n} (${pct(h.right / h.n)})</td></tr>`).join("")}</table>` : ""}
      ${footer()}`, "Practice exams");
  }
  function viewExam(id) {
    const def = C.exams[id];
    if (!def) return viewNotFound();
    const qs = pickExam(def);
    const t0 = Date.now();
    render(`
      <header class="page-h"><p class="kicker">Practice exam</p><h1>${esc(def.title)}</h1><p class="lede">${esc(def.blurb)}</p>
        <p class="exam-meta"><span id="examTimer">0:00</span> elapsed · ${qs.length} questions</p></header>
      <form id="examForm" class="exam">${qs.map((q, k) => `<div class="exam-q"><span class="exam-ch">Ch ${chap(q.ch).n}</span>${qHTML(q, k + 1, { mode: "exam" })}</div>`).join("")}
        <div class="qnav"><button class="btn primary big" type="submit">Submit and grade</button></div></form>`, def.title);
    const timer = setInterval(() => { const el = $("#examTimer"); if (!el) return clearInterval(timer); const s = Math.round((Date.now() - t0) / 1000); el.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }, 1000);
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
        <div><h4>Your result by chapter</h4><div class="bych">${Object.entries(byCh).map(([ch, v]) => `<a href="#/learn/${ch}" class="bych-i ${v[0] / v[1] < 0.7 ? "weak" : ""}"><b>Ch ${chap(ch).n}</b> ${v[0]}/${v[1]}</a>`).join("")}</div>
        ${weak.length ? `<p>Revisit: ${weak.map((ch) => `<a href="#/learn/${ch}">Ch ${chap(ch).n} ${esc(chap(ch).title)}</a>`).join(", ")}.</p>` : "<p>No weak chapters. Nice.</p>"}</div></div>
        <p class="muted small">Scroll down for every question with its explanation. Missed questions are now in <a href="#/review">Review</a>.</p>
        <div class="qnav"><a class="btn" href="#/exam/${id}" id="examAgain">New attempt</a><a class="btn" href="#/review">Review mistakes</a></div>`;
      $("#examForm").before(res);
      $(".qnav", $("#examForm")).remove();
      $("#examAgain").addEventListener("click", (e) => { e.preventDefault(); viewExam(id); });
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderSidebar(); renderTopProgress();
    });
  }

  function viewReview() {
    const ids = Object.keys(P.wrong).filter((id) => QBYID[id]).sort((a, b) => P.wrong[a] - P.wrong[b]);
    const answeredCh = [...new Set(Object.keys(P.checks).map((id) => id.split(".")[0]))];
    render(`
      <header class="page-h"><p class="kicker">Practice</p><h1>Review my mistakes</h1>
      <p class="lede">Every question you got wrong waits here until you answer it right. Short, frequent review is what makes things stick for the exam.</p></header>
      <div class="card"><h3>${ids.length ? ids.length + " question" + (ids.length > 1 ? "s" : "") + " to review" : "Nothing to review"}</h3>
        ${ids.length ? `<p>Up to 15 at a time, oldest first.</p><button class="btn primary" id="startReview" type="button">Start review</button>` : `<p>${Object.keys(P.checks).length ? "You've cleared every mistake. " : ""}Answer questions in the lessons and quizzes; anything you miss shows up here.</p>`}
        ${answeredCh.length ? `<button class="btn" id="mixed" type="button">Mixed practice: 10 random questions from chapters you've started</button>` : ""}
      </div>
      <div id="reviewHost"></div>${footer()}`, "Review");
    const host = $("#reviewHost");
    const run = (list, label) => {
      host.innerHTML = `<section class="panel checks"><h3 class="panel-h">${label}</h3>${list.map((q, k) => `<div class="exam-q"><span class="exam-ch"><a href="#/learn/${q.ch}">Ch ${chap(q.ch).n}</a></span>${qHTML(q, k + 1)}</div>`).join("")}<div class="qnav"><a class="btn" href="#/review" id="again">Done, refresh the list</a></div></section>`;
      renderMath(host);
      bindChecks(host, "review", () => renderSidebar());
      $("#again").addEventListener("click", (e) => { e.preventDefault(); viewReview(); });
      host.scrollIntoView({ behavior: "smooth" });
    };
    const sr = $("#startReview"); if (sr) sr.addEventListener("click", () => run(ids.slice(0, 15).map((id) => QBYID[id]), "Review"));
    const mx = $("#mixed"); if (mx) mx.addEventListener("click", () => run(shuffle(answeredCh.flatMap((ch) => QB[ch] || [])).slice(0, 10), "Mixed practice"));
  }

  function hwCard(id) {
    const h = C.homework[id];
    if (h.pending) return `<div class="card pending"><h3>${esc(h.title)}</h3><p class="placeholder">Not added yet. When it's released, add it to the homework list in js/course.js.</p></div>`;
    return `<a class="card hw-card" href="#/homework/${id}"><h3>${esc(h.title)}</h3><ol>${h.parts.map((p) => `<li>${esc(p.title)}</li>`).join("")}</ol><span class="muted small">Released ${esc(h.released)} · walkthroughs inside</span></a>`;
  }
  function viewHomeworkList() {
    render(`<header class="page-h"><p class="kicker">Practice</p><h1>Homework</h1>
      <p class="lede">The homework follows a fixed format: scientific notation, two significant digits, and show how you got each number. Each assignment below lists what to review first and links to a fully worked solution. Try it yourself before you open the solution.</p></header>
      <div class="grid2">${Object.keys(C.homework).map(hwCard).join("")}</div>${footer()}`, "Homework");
  }
  function viewHomework(id) {
    const h = C.homework[id];
    if (!h) return viewNotFound();
    if (h.pending) return viewHomeworkList();
    const pageName = (ch, key) => { const i = pageIndex(ch, key); return `Ch ${chap(ch).n} · ${esc(pageLabel(pagesOf(ch)[i]))}`; };
    render(`<header class="page-h"><p class="kicker">Week ${h.week} · released ${esc(h.released)}</p><h1>${esc(h.title)}</h1>
      <p class="lede">Submit as a PDF on Canvas (photos of handwritten work are fine). Use scientific notation and two significant digits, label diagrams and axes, and show your reasoning. It counts as much as the result.</p></header>
      ${h.parts.map((p, k) => `<section class="card hw-part">
        <p class="kicker">Problem ${k + 1}</p><h2>${esc(p.title)}</h2><p class="muted">${esc(p.source)}</p>
        <p>${esc(p.summary)}</p>
        <h4>Review first</h4><ul class="plain">${p.prep.map((x) => `<li><a href="#/learn/${x.ch}/${encodeURIComponent(x.page)}">${pageName(x.ch, x.page)}</a></li>`).join("")}</ul>
        <h4>Worked solution</h4><p><a class="btn" href="#/learn/${p.solution.ch}/${p.solution.page}">Open the walkthrough in Ch ${chap(p.solution.ch).n} → Going further</a></p>
      </section>`).join("")}
      <nav class="pager"><a class="btn" href="#/homework">← All homework</a><a class="btn" href="#/week/${h.week}">Week ${h.week} →</a></nav>${footer()}`, h.title);
  }

  async function viewRef(which) {
    main.innerHTML = `<div class="loading">Loading…</div>`;
    const doc = await loadAppendix();
    const sec = doc.getElementById(which);
    if (!sec) return viewNotFound();
    render(`<div class="refnav">${["formulas", "numbers", "hwmap"].map((k) => `<a class="btn small${k === which ? " primary" : ""}" href="#/ref/${k}">${{ formulas: "Formula sheet", numbers: "Numbers & big ideas", hwmap: "Homework & reading map" }[k]}</a>`).join("")}</div>
      <article class="chapter content appx-wrap">${sec.outerHTML}</article>${footer()}`, sec.querySelector("h1") ? sec.querySelector("h1").textContent : "Reference");
  }

  function viewMaterials() {
    const lec = C.weeks.flatMap((w) => w.lectures.map((l) => ({ w, l })));
    const secs = C.weeks.filter((w) => w.section).map((w) => ({ w, s: w.section }));
    const count = Object.values(MAT).reduce((a, x) => a + x.length, 0);
    render(`<header class="page-h"><p class="kicker">Reference</p><h1>Slides & section materials</h1>
      <p class="lede">${count ? count + " item(s) so far." : "Nothing added yet."} Slides and section links are added in <code>js/materials.js</code> (files go in <code>materials/</code>). They also appear on each week's page and on the lessons tied to that lecture.</p></header>
      <h2 class="sec-h">Lectures</h2>
      <table class="t mats"><tr><th>Lecture</th><th>Week</th><th>Materials</th></tr>${lec.map(({ w, l }) => `<tr><td><span class="lid">${l.id}</span>${esc(l.title)}</td><td><a href="#/week/${w.n}">${w.n}</a></td><td>${materialsList([l.id], "–")}</td></tr>`).join("")}</table>
      <h2 class="sec-h">Friday sections</h2>
      <table class="t mats"><tr><th>Section</th><th>Week</th><th>Materials</th></tr>${secs.map(({ w, s }) => `<tr><td>${esc(s.title)}</td><td><a href="#/week/${w.n}">${w.n}</a></td><td>${materialsList([s.id], "–")}</td></tr>`).join("")}</table>
      ${footer()}`, "Slides & materials");
  }

  function viewAbout() {
    const cp = courseProgress();
    render(`<header class="page-h"><p class="kicker">About</p><h1>About Harvard ASTRO1</h1></header>
      <div class="card prose">
        <p>A personal, self-paced study companion for <b>${esc(C.course)}</b> (${esc(C.institution)}, ${esc(C.term)}). It is not an official course site and is not affiliated with Harvard.</p>
        <p><b>Where the content comes from.</b> The lesson text is the <i>ASTRON 1 Study & Recap Guide</i>, written for this course and paraphrasing ${esc(C.textbook)}, with worked homework, Hirshfeld's <i>Introduction to Stars and Planets</i> activities, Owocki's <i>Fundamentals of Astrophysics</i> and Pasachoff & Filippenko's <i>The Cosmos</i>. Figures were made for the guide from the books' data and public datasets (Gaia, NASA Exoplanet Archive, SILSO sunspots). Videos are embedded from YouTube (mainly Crash Course Astronomy); second explanations link to the free OpenStax <i>Astronomy 2e</i>; simulations link to PhET (University of Colorado) and NAAP (University of Nebraska–Lincoln). The quiz questions were written for this app.</p>
        <p><b>Your progress</b> is saved in this browser only. ${cp.done}/${cp.total} pages visited, ${cp.mastered} chapters mastered, ${Object.keys(P.checks).length} questions answered. Export it to move to another device.</p>
        <div class="qnav"><button class="btn" id="exp" type="button">Export progress</button><label class="btn">Import progress<input type="file" id="imp" accept="application/json" hidden></label><button class="btn danger" id="rst" type="button">Reset progress</button></div>
      </div>${footer()}`, "About");
    $("#exp").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(P, null, 1)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "astro1-progress.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    });
    $("#imp").addEventListener("change", async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { P = Object.assign(blank(), JSON.parse(await f.text())); save(); viewAbout(); } catch (err) { alert("That file isn't a progress export."); }
    });
    $("#rst").addEventListener("click", () => { if (confirm("Erase all progress in this browser? This can't be undone.")) { P = blank(); save(); viewAbout(); } });
  }
  function viewNotFound() { render(`<div class="card"><h2>Page not found</h2><p><a href="#/">Back to the start</a></p></div>`, "Not found"); }
  function footer() {
    return `<footer class="foot"><p>Harvard ASTRO1 · a personal study companion for ${esc(C.course)}, ${esc(C.institution)}. Not an official Harvard site. Videos © their creators, embedded from YouTube; OpenStax <i>Astronomy 2e</i> is CC BY 4.0.</p></footer>`;
  }

  /* ---------------- router ---------------- */
  function route() {
    closeMenu();
    const h = decodeURIComponent((location.hash || "#/").slice(1));
    const [, a, b, c] = h.split("/");
    switch (a || "") {
      case "": return viewHome();
      case "schedule": return viewSchedule();
      case "week": return viewWeek(b);
      case "learn": return viewLesson(b, c);
      case "homework": return b ? viewHomework(b) : viewHomeworkList();
      case "exams": return viewExams();
      case "exam": return viewExam(b);
      case "review": return viewReview();
      case "ref": return viewRef(b || "formulas");
      case "materials": return viewMaterials();
      case "about": return viewAbout();
      default: return viewNotFound();
    }
  }

  /* ---------------- chrome ---------------- */
  const menuBtn = $("#menuBtn"), scrim = $("#scrim");
  function closeMenu() { document.body.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", () => { const open = !document.body.classList.contains("menu-open"); document.body.classList.toggle("menu-open", open); menuBtn.setAttribute("aria-expanded", String(open)); });
  scrim.addEventListener("click", closeMenu);
  $("#themeBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("astro1.theme", root.dataset.theme); } catch (e) { /* ignore */ }
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select") || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!location.hash.startsWith("#/learn/")) return;
    const pager = $(".lesson-pager");
    if (!pager) return;
    const links = $$("a.btn", pager);
    if (e.key === "ArrowRight" && $("#nextBtn")) location.hash = $("#nextBtn").getAttribute("href");
    if (e.key === "ArrowLeft" && links.length > 1) location.hash = links[0].getAttribute("href");
  });
  window.addEventListener("hashchange", route);
  route();
})();
