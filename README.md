# Harvard ASTRO1

A self-paced course app for **ASTRON 1 · The Big Questions in Astronomy** (Harvard College (FAS), Fall 2026), from week 1 to the final exam. A personal study companion, not an official course site.

Every textbook chapter (Bennett et al., *The Essential Cosmic Perspective*, 8th ed.) is a run of pages:

1. **Overview**: the chapter's big question, where it sits in the syllabus (week, lectures, reading due), and a first video.
2. **One page per textbook section**: the lesson text and figures, a video, a second explanation from the free OpenStax *Astronomy 2e*, a simulation where useful, and 2–4 *Check yourself* questions.
3. **Practice**: exam-style questions with worked answers (try first, then reveal).
4. **Going further**: worked homework (HW 1–3), the Hirshfeld activities behind it, Owocki derivations, Pasachoff & Filippenko facts.
5. **Recap & chapter quiz**: 12–14 multiple-choice questions; 80% masters the chapter.

Plus a week-by-week course map, homework pages, practice exams (midterm, final, two module checkpoints), a review queue of every question you missed, and the formula sheet / numbers / reading map from the study guide.

Progress is stored in the browser (`localStorage`); export/import it on the About page.

## Run it locally

No build step. Any static server works:

```bash
python -m http.server 5173
```

Then open http://localhost:5173. (Opening `index.html` straight from disk won't load the lessons, because browsers block `fetch` on `file://`.)

## Where things live

| Path | What |
|---|---|
| `index.html`, `css/app.css`, `js/app.js` | The app shell, styles, router, lessons, quizzes, progress |
| `js/course.js` | Syllabus: modules, weeks, lectures, readings, sections, homework, practice exams |
| `js/materials.js` | **Lecture slides and section materials** (add them here) |
| `js/media.js` | Videos, OpenStax readings and simulations per lesson section |
| `js/questions/chNN.js` | The question bank, one file per chapter |
| `content/`, `figs/`, `js/manifest.js` | Lesson text and figures, copied from the study guide by `scripts/sync_content.py` |
| `materials/slides/`, `materials/sections/` | Put slide PDFs and section files here |

## Adding slides and section links

1. Drop the file into `materials/slides/` (or `materials/sections/`), or use a web link.
2. Add an entry in `js/materials.js` under the lecture id (`L1` … `L23`) or section id (`S2` … `S12`):

   ```js
   L5: [{ title: "Lecture 5 slides: Light", url: "materials/slides/L05-light.pdf" }],
   S6: [{ title: "Transit worksheet", url: "https://example.org/worksheet" }],
   ```

3. Commit and push. GitHub Pages republishes the site within a minute or two.

New homework: replace the `pending: true` placeholder for `hw4` … `hw10` in `js/course.js` with its parts (same shape as `hw1`).

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

Lesson text paraphrases the course textbook and was written for the study guide; figures were made for it from the books' data and public datasets (Gaia DR3, NASA Exoplanet Archive, SILSO). Videos are embedded from YouTube (mainly Crash Course Astronomy) and remain their creators'. OpenStax *Astronomy 2e* is CC BY 4.0. Simulations link to PhET (University of Colorado Boulder) and NAAP (University of Nebraska–Lincoln). KaTeX is MIT-licensed. The quiz questions were written for this app.
