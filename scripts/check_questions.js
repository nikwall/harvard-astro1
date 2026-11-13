/* Check the question bank. Run from the repo root:  node scripts/check_questions.js

   1. Structure: every question has four different options, an explanation, and a section tag that
      exists in the lesson (js/manifest.js).
   2. Fairness: how often is the right answer the longest option? If that happens much more often than
      chance (25%), the quiz can be passed by picking the longest answer. Keep it near 25-35%, and keep
      "clearly longer" at 0. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
global.window = {};
for (const f of fs.readdirSync(path.join(root, "js", "questions")).sort()) eval(fs.readFileSync(path.join(root, "js", "questions", f), "utf8"));
eval(fs.readFileSync(path.join(root, "js", "manifest.js"), "utf8"));

const norm = (s) => String(s || "").replace(/[‐-―-]/g, "-").replace(/\s+/g, "").toLowerCase();
const strip = (s) => String(s).replace(/<[^>]+>/g, "");
let total = 0, problems = 0, clearlyLonger = 0;
const rank = [0, 0, 0, 0]; // rank[0] = right answer is the longest option … rank[3] = it is the shortest

for (const [ch, list] of Object.entries(window.QUIZ)) {
  const sections = ((window.MANIFEST[ch] || {}).sections || []).filter((s) => s.kind === "section").map((s) => norm(s.key));
  list.forEach((q, i) => {
    total++;
    const id = `${ch}.${i + 1}`;
    const fail = (msg) => { problems++; console.log(`${id}: ${msg}`); };
    if (!q.q || !q.e) fail("question or explanation missing");
    if (!Array.isArray(q.o) || q.o.length !== 4) return fail("needs exactly four options");
    if (new Set(q.o.map(strip)).size !== 4) fail("two options are identical");
    if (!(q.a >= 0 && q.a <= 3)) return fail("index of the right option (a) must be 0-3");
    if (!sections.includes(norm(q.s))) fail(`section "${q.s}" is not a section of ${ch}`);
    const len = q.o.map((o) => strip(o).length), right = len[q.a], others = len.filter((_, k) => k !== q.a);
    rank[others.filter((l) => l > right).length]++;
    const longestOther = Math.max(...others);
    if (right > 1.25 * longestOther && right - longestOther > 8) { clearlyLonger++; console.log(`${id}: right answer is clearly the longest (${right} vs ${longestOther} characters)`); }
  });
}
console.log(`\n${total} questions, ${problems} structural problem(s).`);
console.log(`Right answer is the longest option in ${Math.round((100 * rank[0]) / total)}% (chance: 25%); clearly longer in ${clearlyLonger}.`);
console.log(`Length rank of the right answer (longest → shortest): ${rank.join(" / ")}`);
process.exit(problems ? 1 : 0);
