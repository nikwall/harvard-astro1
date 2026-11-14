# Harvard ASTRO1

A self-paced course app for **ASTRON 1 · The Big Questions in Astronomy** (Harvard College (FAS), Fall 2026), from week 1 to the final exam. A personal study companion, not an official course site.

On first visit everyone enters a first name (a made-up one is fine); the app greets them by it throughout. A small counter shows how many people have launched the course (see *Explorer counter* below).

What's inside:

- **Lessons.** Every textbook chapter (Bennett et al., *The Essential Cosmic Perspective*, 8th ed.) is a run of pages: overview, one page per textbook section (lesson text, figures, a video, an OpenStax reading, a simulation, *Check yourself* questions), worked practice, *Going further* (worked homework, Hirshfeld activities, Owocki derivations), and a 12–14 question chapter quiz (80% masters it).
- **Lecture recaps.** One page per lecture (`#/lecture/L6`), written from the slide decks in the course folder: the big question, key ideas in slide order, equations, numbers worth knowing, the discussion questions from class, multiple-choice checks, and the links shown on the slides. The slides themselves are not published.
- **Homework 1–10.** Each problem lists what to review first, then a worked walkthrough (in a lesson's *Going further* page) or a step-by-step approach without final numbers, plus the tools and links it needs.
- **Lab.** The Boston Clear Sky Chart, the L7 image pipeline (FITS stack → astrometry.net → AstroImageJ → magnitudes), the TOI-2046 transit workflow, the Exoplanet Archive in Python (class Colab), an in-app **exoplanet explorer** (all ~6,500 planets, plotted live) and an **orbit & wobble simulator** for HW 4.
- **Practice.** A week-by-week course map, practice exams (midterm, final, two module checkpoints) with the real exam format, a review queue of every missed question, and the formula sheet, constants (cgs), numbers and reading map.

Progress is stored in the browser (`localStorage`); export/import it on the profile page.

## Run it locally

No build step. Any static server works:

```bash
python -m http.server 5173
```

Then open http://localhost:5173. (Opening `index.html` straight from disk won't load the lessons, because browsers block `fetch` on `file://`.)

## Where things live

| Path | What |
|---|---|
| `index.html`, `css/app.css`, `js/app.js` | The app shell, name gate, styles, router, all views, quizzes, progress, explorer and simulator |
| `js/course.js` | Syllabus: modules, weeks, lectures, readings, sections, homework 1–10, practice exams |
| `js/lectures.js` | **Lecture recaps** written from the slide decks (key ideas, equations, numbers, class questions, quiz, links) |
| `js/lab.js` | Lab tools and links, the three workflows, the constants sheet, the exam format, the orbit-code skeleton |
| `js/materials.js` | Optional files or links per lecture/section (shown on the lecture and week pages) |
| `js/media.js` | Videos, OpenStax readings and simulations per lesson section |
| `js/questions/chNN.js` | The question bank, one file per chapter |
| `data/exoplanets.json` | Snapshot of the NASA Exoplanet Archive (Planetary Systems table, `default_flag=1`, 2026-11-13) for the explorer |
| `content/`, `figs/`, `js/manifest.js` | Lesson text and figures, copied from the study guide by `scripts/sync_content.py` |
| `vendor/` | KaTeX, and the Geist font (SIL Open Font License, `vendor/fonts/OFL.txt`), the only typeface the app uses |

## Adding slides and section links

1. Drop the file into `materials/slides/` (or `materials/sections/`), or use a web link.
2. Add an entry in `js/materials.js` under the lecture id (`L1` … `L23`) or section id (`S2` … `S12`):

   ```js
   L5: [{ title: "Lecture 5 slides: Light", url: "materials/slides/L05-light.pdf" }],
   S6: [{ title: "Transit worksheet", url: "https://example.org/worksheet" }],
   ```

3. Commit and push. GitHub Pages republishes the site within a minute or two.

Homework lives in `js/course.js` under `homework`. A part has a `summary`, `prep` links, and either a `solution` (a walkthrough page in a lesson) or `approach` steps; optional `tools` (ids from `js/lab.js`), `links`, `lecture` and `checklist`.

## Lecture recaps

`js/lectures.js` has one entry per lecture id. When a new slide deck arrives, read it and add `deck`, `slides`, `q`, `sum`, `ideas`, `eq`, `nums`, `think`, `quiz` and `links` (same shape as the others). Lecture quiz questions get ids like `L6.1` and land in Review when missed; append new ones at the end so saved progress stays valid. Lectures without a deck show the syllabus title and the matching chapters.

## Explorer counter

The name gate asks for a first name and stores it in the browser only. The first time a browser launches the course, the app adds one to a counter on [abacus](https://jasoncameron.dev/abacus/) (a free, keyless counter API: namespace `astro1-course-f26`, key `explorers`) and remembers that it did (`astro1.counted` in `localStorage`), so reloads, revisits and name changes don't count twice. Only the number is stored there. A private window, another browser or another device counts again. Runs on `localhost` use a separate `astro1-course-f26-dev` counter. Abacus drops a counter after about six months without hits.

## Refreshing the exoplanet snapshot

```bash
curl -o ps.csv "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+pl_name,hostname,discoverymethod,disc_year,disc_facility,pl_orbper,pl_orbsmax,pl_rade,pl_bmasse,pl_eqt,pl_orbeccen,st_teff,st_rad,st_mass,sy_dist,sy_pnum+from+ps+where+default_flag=1&format=csv"
```

Then convert it to the compact `keys` / `rows` JSON in `data/exoplanets.json` (same keys as now) and update `fetched`. The archive doesn't allow browser requests from other sites (no CORS), which is why the app ships a snapshot.

## Writing questions

Questions live in `js/questions/chNN.js`: `s` is the lesson section the question belongs to, `o` the four options, `a` the index of the right one, `e` the explanation shown after answering. The app shuffles the options every time, so the order in the file doesn't matter. Append new questions at the end of a chapter's list (saved progress is keyed by position).

Keep the four options similar in length and form. If the right answer is usually the longest, the quiz can be passed without knowing anything. Check with:

```bash
node scripts/check_questions.js
```

It validates the structure and reports how often the right answer is the longest option (chance is 25%).

## Updating the lesson text

The lessons come from the *ASTRON 1 Study & Recap Guide* source (`../course work/study_guide_src`). Edit it there, then run:

```bash
python scripts/sync_content.py
```

It copies the chapter HTML, figures and KaTeX, and regenerates `js/manifest.js` (the page list of each lesson). Quiz questions are tagged with a section number (`s: "4.4"`), so keep section numbers stable.

## Hosting

GitHub Pages serves the site straight from this repository's `main` branch (static, no build; `.nojekyll` switches off Jekyll): https://nikwall.github.io/harvard-astro1/

The repository and the site are both public (GitHub's free plan offers Pages only for public repositories). A `noindex` robots tag in `index.html` and in every lesson file keeps the site out of search engines. To take the site offline, switch Pages off under the repository's Settings → Pages; to hide the source again, set the repository back to private there too (that also switches Pages off on the free plan).

## Sources and credits

Lesson text paraphrases the course textbook and was written for the study guide; lecture recaps were written from the course's slide decks; figures were made for it from the books' data and public datasets (Gaia DR3, NASA Exoplanet Archive, SILSO). Videos are embedded from YouTube (mainly Crash Course Astronomy) and remain their creators'. OpenStax *Astronomy 2e* is CC BY 4.0. Simulations link to PhET (University of Colorado Boulder) and NAAP (University of Nebraska–Lincoln). KaTeX is MIT-licensed; Geist is under the SIL Open Font License. Planet data: NASA Exoplanet Archive (Caltech/NASA). Sky forecast image: Clear Sky Chart. The quiz questions were written for this app.
