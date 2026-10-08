// Builds the Obsidian vault "Analog VLSI Vault/" from the app's content (notes, lessons, question bank, glossary).
// Run: node scripts/vault/build.mjs   (re-run any time; it rewrites the generated folders and never touches "My notes").
// Large files (PDFs, animated lessons) are copied on the Mac by "Set up Obsidian vault.command".
import { createServer } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync, chmodSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const VAULT = join(root, 'Analog VLSI Vault');
const GEN = ['00 Home', '01 Lectures', '02 Topics', '03 Questions', '04 Formulas', '05 Flashcards', '06 Symbols', '07 Papers and lessons', 'Attachments/Notes', 'Attachments/Papers', 'Attachments/Figures'];
for (const d of GEN) { rmSync(join(VAULT, d), { recursive: true, force: true }); mkdirSync(join(VAULT, d), { recursive: true }); }
mkdirSync(join(VAULT, 'My notes'), { recursive: true });

const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const C = await vite.ssrLoadModule('/src/content/index.ts');
const { NOTES } = await vite.ssrLoadModule('/src/content/notesAll.ts');
const { WOVEN } = await vite.ssrLoadModule('/src/content/walkWoven.ts');
const { GLOSSARY } = await vite.ssrLoadModule('/src/content/glossary.ts');
await vite.close();

/* ── names ── */
const safe = (s) => s.replace(/[\\/:*?"<>|#^[\]]/g, ' ').replace(/[`$]/g, '').replace(/\s+/g, ' ').trim();
const lecName = (n) => `Lec ${String(n).padStart(2, '0')}`;
const ANALOG_UNITS = C.UNITS.filter((u) => u.group !== 'digital');
const unitName = (u) => safe(`${u.id} ${u.title}`);
const UNIT_BY = Object.fromEntries(ANALOG_UNITS.map((u) => [u.id, u]));
const symName = (k) => safe(`${GLOSSARY[k].name} (${k})`);
const BANK = C.BANK.filter((p) => p.tags.some((t) => UNIT_BY[t]));
const qName = {}; const used = new Set();
for (const p of BANK) { let n = safe(p.title.replace(/:\s*/, ' – ')); while (used.has(n.toLowerCase())) n += ' (2)'; used.add(n.toLowerCase()); qName[p.id] = n; }

/* lectures each unit covers (from the curriculum's "Your notes: Lec …" line); foundations sit under Lec 01–02 */
const lecsOf = (u) => {
  const out = new Set(); const s = u.notes || '';
  for (const m of s.matchAll(/Lec (\d+)(?:[–-](\d+))?/g)) { const a = +m[1], b = m[2] ? +m[2] : a; for (let i = a; i <= b; i++) out.add(i); }
  if (!out.size && u.group === 'foundations') { out.add(1); out.add(2); }
  return [...out].filter((n) => n >= 1 && n <= 17);
};
const UNIT_LECS = Object.fromEntries(ANALOG_UNITS.map((u) => [u.id, lecsOf(u)]));
const LEC_UNITS = {}; for (const [u, ls] of Object.entries(UNIT_LECS)) for (const l of ls) (LEC_UNITS[l] ||= []).push(u);
const qLecs = (p) => [...new Set(p.tags.filter((t) => UNIT_BY[t]).flatMap((t) => UNIT_LECS[t]))].sort((a, b) => a - b);

/* ── text conversion ── */
const usedSyms = new Set();
function md(s, syms) {
  if (!s) return '';
  return String(s)
    .replace(/\{\{(\w+)\}\}/g, (_m, k) => { if (!GLOSSARY[k]) return k; syms?.add(k); usedSyms.add(k); return `$${GLOSSARY[k].tex}$`; })
    .replace(/\[\[fig:([\w-]+)\]\]/g, (_m, k) => `![[${k}.svg]]`);
}
const disp = (tex) => `$$${tex}$$`;
const PFX = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'µ'], [1e-9, 'n'], [1e-12, 'p'], [1e-15, 'f']];
function val(v, unit = '') {
  if (typeof v !== 'number' || !isFinite(v)) return String(v);
  const r = (x) => (+x.toPrecision(4)).toString();
  if (!unit || ['', '°', '%', 'dB', '×'].includes(unit) || unit.includes('/') && !['V/s'].includes(unit)) return `${r(v)} ${unit}`.trim();
  if (unit === 'V/s') return `${r(v / 1e6)} V/µs`;
  const a = Math.abs(v); const [m, p] = PFX.find(([m]) => a >= m * 0.9999) || PFX[PFX.length - 1];
  return `${r(v / m)} ${p}${unit}`;
}
const fm = (o) => `---\n${Object.entries(o).map(([k, v]) => `${k}: ${Array.isArray(v) ? `[${v.map((x) => JSON.stringify(x)).join(', ')}]` : JSON.stringify(v)}`).join('\n')}\n---\n`;
const W = (dir, name, body) => writeFileSync(join(VAULT, dir, `${name}.md`), body);
const links = (arr) => arr.map((x) => `[[${x}]]`).join(' · ');

/* ── attachments: note scans, paper crops, explanation figures ── */
for (const f of readdirSync(join(root, 'src/assets/notes'))) copyFileSync(join(root, 'src/assets/notes', f), join(VAULT, 'Attachments/Notes', f));
for (const f of readdirSync(join(root, 'src/assets/papers')).filter((f) => f.endsWith('.webp'))) copyFileSync(join(root, 'src/assets/papers', f), join(VAULT, 'Attachments/Papers', f));
for (const f of readdirSync(join(root, 'src/assets/doubts')).filter((f) => f.endsWith('.svg'))) copyFileSync(join(root, 'src/assets/doubts', f), join(VAULT, 'Attachments/Figures', f));
const haveImg = new Set([...readdirSync(join(VAULT, 'Attachments/Notes')), ...readdirSync(join(VAULT, 'Attachments/Papers')), ...readdirSync(join(VAULT, 'Attachments/Figures'))]);

/* large files, copied on the Mac: [source path in repo, name in the vault] */
const BIG = [];
const addBig = (dir, prefix, filter = (f) => f.endsWith('.pdf')) => { const p = join(root, dir); if (!existsSync(p)) return; for (const f of readdirSync(p).filter(filter).sort()) BIG.push([`${dir}/${f}`, safe(`${prefix}${f.replace(/\.pdf$/, '')}`) + (f.endsWith('.pdf') ? '.pdf' : '')]); };
addBig('source/notes', 'Notes – ');
addBig('source/tutorials', 'Tutorial (this year) – ');
addBig('source/quizzes', 'Quiz key (this year) – ');
addBig('source/labs', 'Lab sheet – ');
addBig('pyqs/evalsA/Evals', 'Past paper 2024-25 – ');
addBig('pyqs/evalsB/Evals', 'Past paper set B – ');
addBig('pyqs/y2324/2023-24', 'Past paper 2023-24 – ');
addBig('pyqs/tutA/Tutorials', 'Past tutorial set A – ');
addBig('pyqs/tutB/Tutorials', 'Past tutorial set B – ');
addBig('pdf', 'Revision – ');
BIG.push(['source/razavi.pdf', 'Razavi – Design of Analog CMOS Integrated Circuits.pdf'], ['source/handout.pdf', 'Course handout.pdf']);
addBig('study-package/Analog-Gym-Complete-Package/03_Textbook_and_References/Razavi_UCLA_EE215A_Fall2014_handouts', 'Razavi UCLA handout – ');
addBig('study-package/Analog-Gym-Complete-Package/03_Textbook_and_References/Allen_CMOS_Analog_Lectures', 'Allen lecture – ');
const LESSONS_HTML = readdirSync(join(root, 'lessons')).filter((f) => f.endsWith('.html')).sort();
for (const f of LESSONS_HTML) BIG.push([`lessons/${f}`, f]);
const bigName = (path) => BIG.find(([p]) => p === path)?.[1];

/* ── lectures ── */
const lecPdf = {}; for (const [p, n] of BIG) { const m = p.match(/source\/notes\/lecture-(\d+)-/); if (m) lecPdf[+m[1]] = n; }
const LESSON_FOR = (n) => (n <= 5 ? ['Analog Lab Revision Lec 1-10 (animated).html'] : n === 6 ? ['Analog Lab Lec 6 (animated).html', 'Analog Lab Revision Lec 1-10 (animated).html']
  : n <= 10 ? ['Analog Lab Lec 7-12 (animated).html', 'Analog Lab Revision Lec 1-10 (animated).html'] : n <= 12 ? ['Analog Lab Lec 7-12 (animated).html', 'Analog Lab Lec 11-14 (animated).html']
    : n <= 14 ? ['Analog Lab Lec 11-14 (animated).html'] : ['Analog Lab Lec 15-17 (animated).html']).filter((f) => LESSONS_HTML.includes(f));
const lecQs = {}; for (const p of BANK) for (const l of qLecs(p)) (lecQs[l] ||= []).push(p);
const lecNotes = NOTES.filter((n) => n.lec >= 1 && n.lec <= 17);
const formulaRows = []; const lecCards = [];
for (const n of lecNotes) {
  const name = lecName(n.lec), syms = new Set();
  let b = fm({ tags: ['lecture', `lec/${String(n.lec).padStart(2, '0')}`], aliases: [n.title], date: n.date });
  b += `# ${name} · ${n.title}\n\n**Date:** ${n.date} · **Handout:** ${n.handout || '—'} · **Topics:** ${links((LEC_UNITS[n.lec] || []).map((u) => unitName(UNIT_BY[u])))}\n\n`;
  b += `> [!abstract] In one paragraph\n> ${md(n.summary, syms)}\n\n`;
  b += `**Before:** ${n.lec > 1 ? `[[${lecName(n.lec - 1)}]]` : '[[Home]]'} · **Next:** ${n.lec < 17 ? `[[${lecName(n.lec + 1)}]]` : '[[Home]]'} · **All formulas:** [[Formula sheet]]\n\n`;
  b += `## Your handwritten page\n\n${haveImg.has(`${n.img}.webp`) ? `![[${n.img}.webp]]\n\n` : ''}${lecPdf[n.lec] ? `Original PDF: [[${lecPdf[n.lec]}]]\n\n` : ''}`;
  b += `## The page, item by item\n\n`;
  (n.items || []).forEach((it) => {
    b += `### ${md(it.title, syms)}\n\n${md(it.explain, syms)}\n\n`;
    (it.steps || []).forEach((s) => { b += `- ${s.note ? md(s.note, syms) + ': ' : ''}$${s.tex}$\n`; });
    if (it.steps?.length) b += '\n';
    (it.tex || []).forEach((t) => { b += `${disp(t)}\n\n`; formulaRows.push([n.lec, it.title, t]); });
    if (it.tex?.length) lecCards.push([n.lec, it.title, it.tex]);
    if (it.asked) b += `> [!question] Asked in exams\n> ${md(it.asked, syms)}\n\n`;
  });
  const wv = WOVEN[n.id];
  if (wv) { b += `## Explained step by step\n\n`; Object.keys(wv).sort((a, c) => a - c).forEach((k) => { b += `${md(wv[k], syms)}\n\n`; }); }
  const qs = lecQs[n.lec] || [];
  if (qs.length) b += `## Questions that use this lecture\n\n${qs.map((p) => `- [[${qName[p.id]}]] · ${p.source}`).join('\n')}\n\n`;
  const ls = LESSON_FOR(n.lec);
  if (ls.length) b += `## Animated lessons\n\n${ls.map((f) => `- [[${f}]]`).join('\n')}\n\n`;
  b += `## Flashcards\n\n[[Flashcards – Lecture formulas]] · ${links((LEC_UNITS[n.lec] || []).map((u) => `Flashcards – ${u}`))}\n\n`;
  if (syms.size) b += `## Symbols on this page\n\n${links([...syms].map(symName))}\n`;
  W('01 Lectures', name, b);
}

/* ── topics (one per unit, with every lesson in it) ── */
const lessonsOf = (u) => C.LESSONS.filter((l) => l.unit === u.id);
for (const u of ANALOG_UNITS) {
  const syms = new Set(), name = unitName(u);
  let b = fm({ tags: ['topic', `unit/${u.id}`, `group/${u.group}`], aliases: [u.title] });
  b += `# ${u.id} · ${u.title}\n\n*${md(u.short, syms)}*\n\n**Reference:** ${u.ref || '—'} · **Lectures:** ${links(UNIT_LECS[u.id].map(lecName))}\n\n`;
  const pre = (u.prereqs || []).filter((x) => UNIT_BY[x]);
  b += `**Needs first:** ${pre.length ? links(pre.map((x) => unitName(UNIT_BY[x]))) : '[[Home]]'}\n\n`;
  for (const l of lessonsOf(u)) {
    b += `## ${md(l.title, syms)}\n\n**Why:** ${md(l.why, syms)}\n\n`;
    if (l.predict) b += `> [!question] Predict first: ${md(l.predict.prompt, syms)}\n${l.predict.choices.map((c, i) => `> ${String.fromCharCode(97 + i)}) ${md(c, syms)}`).join('\n')}\n\n> [!success]- Answer\n> **${md(l.predict.choices[l.predict.answer], syms)}**. ${md(l.predict.explain, syms)}\n\n`;
    b += `${md(l.idea, syms)}\n\n`;
    if (l.analogy) b += `> [!tip] Picture it\n> ${md(l.analogy, syms)}\n\n`;
    if (l.rule?.tex?.length) b += `**The rule**\n\n${l.rule.tex.map(disp).join('\n\n')}\n\n${l.rule.note ? `> [!note]\n> ${md(l.rule.note, syms)}\n\n` : ''}`;
    if (l.lockIn) b += `> [!important] Lock it in\n> ${md(l.lockIn.summary, syms)}\n> **Hook:** ${md(l.lockIn.hook, syms)}\n\n`;
  }
  const { now, later } = C.sheetProblems(u.id);
  const an = (arr) => arr.filter((p) => qName[p.id]);
  if (an(now).length) b += `## Questions you can solve after this topic\n\n${an(now).map((p) => `- [[${qName[p.id]}]] · ${p.source}`).join('\n')}\n\n`;
  if (an(later).length) b += `## Questions that also use it\n\n${an(later).map((p) => `- [[${qName[p.id]}]]`).join('\n')}\n\n`;
  b += `## Flashcards\n\n[[Flashcards – ${u.id}]]\n\n`;
  if (syms.size) b += `## Symbols\n\n${links([...syms].map(symName))}\n`;
  W('02 Topics', name, b);
}

/* ── questions ── */
const kind = (s) => (/mid-?sem/i.test(s) ? 'mid-sem' : /quiz/i.test(s) ? 'quiz' : /compre/i.test(s) ? 'compre' : /tutorial/i.test(s) ? 'tutorial' : /problem set/i.test(s) ? 'problem set' : /lab/i.test(s) ? 'lab' : /razavi/i.test(s) ? 'Razavi' : 'worked example');
for (const p of BANK) {
  const syms = new Set(), k = kind(p.source), marks = +(p.source.match(/(\d+) marks/) || [])[1] || 0;
  const per = k === 'quiz' ? 2 : 1.5, budget = marks ? `${Math.round(marks * per)} min (${marks} marks × ${per} min)` : '';
  let b = fm({ tags: ['question', `source/${k.replace(/\s/g, '-')}`, ...p.tags.filter((t) => UNIT_BY[t]).map((t) => `unit/${t}`)], aliases: [p.source] });
  b += `# ${md(p.title, syms)}\n\n**Source:** ${p.source}${budget ? ` · **Exam time:** ${budget}` : ''}\n\n`;
  b += `**Topics:** ${links(p.tags.filter((t) => UNIT_BY[t]).map((t) => unitName(UNIT_BY[t])))} · **Lectures:** ${links(qLecs(p).map(lecName))}\n\n`;
  for (const pr of p.printed || []) if (haveImg.has(`${pr.img}.webp`)) b += `> [!quote] ${pr.caption}\n> ![[${pr.img}.webp]]\n\n`;
  b += `## Question\n\n${md(p.statement, syms)}\n\n`;
  if (p.givens?.length) b += `| Given | Value |\n|---|---|\n${p.givens.map((g) => `| $${g.sym}$ | ${val(g.value, g.unit)} |`).join('\n')}\n\n`;
  if (p.unknowns?.length) b += `**Find:** ${p.unknowns.map((u) => md(u.label, syms)).join(' · ')}\n\n`;
  b += `## Your attempt\n\n- \n\n`;
  if (p.hints?.length) b += `> [!tip]- Hints (open one at a time)\n${p.hints.map((h, i) => `> ${i + 1}. ${md(h, syms)}`).join('\n')}\n\n`;
  if (p.inShort) b += `> [!info]- Concept and formulas\n> ${md(p.inShort.concept, syms)}\n${(p.inShort.formulas || []).map((f) => `> $$${f}$$`).join('\n')}\n\n`;
  const ans = (p.unknowns || []).map((u) => `> - ${md(u.label, syms)}: **${val(p.answers?.[u.key], u.unit)}**`).join('\n');
  if (ans) b += `> [!success]- Answers\n${ans}\n\n`;
  if (p.steps?.length) b += `> [!example]- Full solution\n${p.steps.map((s, i) => `> ${i + 1}. ${md(s.title, syms)}${s.tex ? `\n>    $$${s.tex}$$` : ''}`).join('\n')}\n\n`;
  for (const kk of p.key || []) if (haveImg.has(`${kk.img}.webp`)) b += `> [!note]- ${kk.caption}\n> ![[${kk.img}.webp]]\n\n`;
  if (p.calc?.length) b += `> [!abstract]- Calculator keys (fx-991CW)\n${p.calc.map((c) => `> - **${c.what}:** \`${c.keys}\``).join('\n')}\n\n`;
  if (syms.size) b += `**Symbols:** ${links([...syms].map(symName))}\n`;
  W('03 Questions', qName[p.id], b);
}

/* ── symbols ── */
const symKeys = Object.keys(GLOSSARY).filter((k) => usedSyms.has(k));
for (const k of symKeys) {
  const g = GLOSSARY[k];
  W('06 Symbols', symName(k), `${fm({ tags: ['symbol'], aliases: [k] })}# $${g.tex}$ · ${g.name}\n\n${g.def}${g.unit ? `\n\n**Unit:** ${g.unit}` : ''}\n\nBack to [[Symbols]]\n`);
}
W('00 Home', 'Symbols', `${fm({ tags: ['index'] })}# Symbols\n\nEvery symbol used in your notes, in your notation.\n\n| Symbol | Meaning |\n|---|---|\n${symKeys.map((k) => `| $${GLOSSARY[k].tex}$ | [[${symName(k)}]] |`).join('\n')}\n`);

/* ── formula sheet ── */
let fs = `${fm({ tags: ['formulas'] })}# Formula sheet\n\nEvery formula on your handwritten pages, lecture by lecture. Cover the right side and say each one aloud.\n\n`;
for (let l = 1; l <= 17; l++) {
  const rows = formulaRows.filter((r) => r[0] === l); if (!rows.length) continue;
  fs += `## [[${lecName(l)}]]\n\n`;
  rows.forEach(([, t, tex]) => { fs += `**${md(t)}**\n${disp(tex)}\n\n`; });
}
W('04 Formulas', 'Formula sheet', fs);

/* ── flashcards (Spaced Repetition plugin: one card per line, front::back) ── */
const one = (s) => md(s).replace(/\n+/g, ' ').replace(/::/g, ':').trim();
let fc = `${fm({ tags: ['flashcards'] })}#flashcards/formulas\n\n# Flashcards – Lecture formulas\n\nOne card per formula on your pages. Review with the Spaced Repetition plugin (see [[Obsidian guide]]).\n\n`;
for (const [l, t, texs] of lecCards) fc += `${lecName(l)} · ${one(t)}::${texs.map((x) => `$${x}$`).join(' , ')}\n`;
fc += `\nBack to [[Home]] · [[Formula sheet]]\n`;
W('05 Flashcards', 'Flashcards – Lecture formulas', fc);
for (const u of ANALOG_UNITS) {
  const cards = C.CARDS.filter((c) => c.unit === u.id);
  let b = `${fm({ tags: ['flashcards'] })}#flashcards/${u.id}\n\n# Flashcards – ${u.id}\n\nTopic: [[${unitName(u)}]]\n\n`;
  b += cards.length ? cards.map((c) => `${one(c.front)}::${one(c.back)}`).join('\n') + '\n' : 'No cards for this topic yet: use the topic note’s Lock it in box.\n';
  W('05 Flashcards', `Flashcards – ${u.id}`, b);
}

/* ── papers and lessons ── */
const grp = (pre) => BIG.filter(([, n]) => n.startsWith(pre));
let pp = `${fm({ tags: ['index'] })}# Papers and lessons\n\nThe original PDFs and the animated lessons. They appear here after you run **Set up Obsidian vault.command** once (see [[Obsidian guide]]).\n\n`;
const sec = (title, pre) => { const g = grp(pre); if (g.length) pp += `## ${title}\n\n${g.map(([, n]) => `- [[${n}]]`).join('\n')}\n\n`; };
pp += `## Animated lessons (open in Chrome or Brave)\n\n${LESSONS_HTML.map((f) => `- [[${f}]]`).join('\n')}\n\n`;
sec('Your lecture notes (handwritten)', 'Notes – '); sec('This year’s tutorials', 'Tutorial (this year) – '); sec('This year’s quiz keys', 'Quiz key (this year) – ');
sec('Past papers 2024-25', 'Past paper 2024-25 – '); sec('Past papers 2023-24', 'Past paper 2023-24 – '); sec('Past papers, set B', 'Past paper set B – ');
sec('Past tutorials, set A', 'Past tutorial set A – '); sec('Past tutorials, set B', 'Past tutorial set B – '); sec('Lab sheets', 'Lab sheet – '); sec('Revision sheets', 'Revision – ');
pp += `## Books and references\n\n${BIG.filter(([, n]) => /^(Razavi|Course handout|Allen)/.test(n)).map(([, n]) => `- [[${n}]]`).join('\n')}\n`;
W('07 Papers and lessons', 'Papers and lessons', pp);

const byKind = {}; for (const p of BANK) (byKind[kind(p.source)] ||= []).push(p);
let qi = `${fm({ tags: ['index'] })}# All questions\n\n${BANK.length} questions, every one with hints, answers and a full solution folded away so you can try first.\n\n`;
for (const k of ['mid-sem', 'quiz', 'compre', 'tutorial', 'problem set', 'Razavi', 'lab', 'worked example']) if (byKind[k]) qi += `## ${k[0].toUpperCase() + k.slice(1)} (${byKind[k].length})\n\n${byKind[k].map((p) => `- [[${qName[p.id]}]] · ${p.source}`).join('\n')}\n\n`;
W('00 Home', 'All questions', qi);

/* ── home and the guide ── */
let home = `${fm({ tags: ['index'], aliases: ['Start here'] })}# Analog VLSI · EEE/INSTR F313\n\nEverything you have studied, linked. Start with [[Obsidian guide]] if Obsidian is new to you.\n\n`;
home += `## Lectures\n\n${lecNotes.map((n) => `- [[${lecName(n.lec)}]] · ${md(n.title)}`).join('\n')}\n\n`;
home += `## Topics\n\n${ANALOG_UNITS.map((u) => `- [[${unitName(u)}]]`).join('\n')}\n\n`;
home += `## Practise and memorise\n\n- [[All questions]] (${BANK.length})\n- [[Formula sheet]]\n- [[Flashcards – Lecture formulas]]\n- [[Symbols]]\n- [[Papers and lessons]]\n\n`;
home += `## Your own notes\n\nWrite anything in the **My notes** folder. Rebuilding the vault never touches it.\n`;
W('00 Home', 'Home', home);
W('00 Home', 'Obsidian guide', readFileSync(join(root, 'scripts/vault/guide.md'), 'utf8'));

/* ── the Mac setup script for large files ── */
const q = (s) => `"${s.replace(/"/g, '\\"')}"`;
let sh = `#!/bin/bash\n# Copies the PDFs and animated lessons into the Obsidian vault (run once after each git pull).\ncd "$(dirname "$0")" || exit 1\nV="Analog VLSI Vault/Attachments/Large"\nmkdir -p "$V"\nn=0\n`;
for (const [src, name] of BIG) sh += `[ -f ${q(src)} ] && cp ${q(src)} "$V/"${q(name)} && n=$((n+1))\n`;
sh += `echo "Copied $n files into $V. Open the vault in Obsidian."\n`;
writeFileSync(join(root, 'Set up Obsidian vault.command'), sh); chmodSync(join(root, 'Set up Obsidian vault.command'), 0o755);

/* ── Obsidian settings: attachments folder, colour-coded graph, flashcard plugin ── */
const O = join(VAULT, '.obsidian'); mkdirSync(O, { recursive: true });
writeFileSync(join(O, 'app.json'), JSON.stringify({ attachmentFolderPath: 'Attachments', newFileFolderPath: 'My notes', newFileLocation: 'folder', showFrontmatter: false, alwaysUpdateLinks: true, readableLineLength: true, livePreview: true, defaultViewMode: 'preview' }, null, 2));
writeFileSync(join(O, 'appearance.json'), JSON.stringify({ theme: 'obsidian', baseFontSize: 17 }, null, 2));
const rgb = (h) => ({ a: 1, rgb: parseInt(h.slice(1), 16) });
writeFileSync(join(O, 'graph.json'), JSON.stringify({
  'collapse-filter': false, search: '-path:"06 Symbols"', showTags: false, showAttachments: false, hideUnresolved: true, showOrphans: false,
  'collapse-color-groups': false,
  colorGroups: [
    { query: 'path:"00 Home"', color: rgb('#f8fafc') }, { query: 'path:"01 Lectures"', color: rgb('#fb923c') }, { query: 'path:"02 Topics"', color: rgb('#a78bfa') },
    { query: 'tag:#source/mid-sem OR tag:#source/quiz OR tag:#source/compre', color: rgb('#f87171') }, { query: 'path:"03 Questions"', color: rgb('#38bdf8') },
    { query: 'path:"04 Formulas" OR path:"05 Flashcards"', color: rgb('#fbbf24') }, { query: 'path:"06 Symbols"', color: rgb('#34d399') }, { query: 'path:"My notes"', color: rgb('#f472b6') },
  ],
  'collapse-display': false, showArrow: false, textFadeMultiplier: -0.6, nodeSizeMultiplier: 1.15, lineSizeMultiplier: 0.8,
  'collapse-forces': false, centerStrength: 0.45, repelStrength: 14, linkStrength: 0.9, linkDistance: 220, scale: 0.55, close: false,
}, null, 2));
writeFileSync(join(O, 'core-plugins.json'), JSON.stringify(['file-explorer', 'global-search', 'switcher', 'graph', 'backlink', 'outgoing-link', 'tag-pane', 'page-preview', 'outline', 'bookmarks', 'command-palette', 'editor-status', 'word-count', 'file-recovery'], null, 2));
writeFileSync(join(O, 'bookmarks.json'), JSON.stringify({ items: ['00 Home/Home.md', '00 Home/Obsidian guide.md', '04 Formulas/Formula sheet.md', '00 Home/All questions.md'].map((path) => ({ type: 'file', ctime: 1, path })) }, null, 2));
writeFileSync(join(O, 'community-plugins.json'), JSON.stringify(['obsidian-spaced-repetition'], null, 2));
const sr = join(O, 'plugins/obsidian-spaced-repetition'); mkdirSync(sr, { recursive: true });
const SRC = process.env.SR_PLUGIN_DIR; if (SRC) for (const f of ['main.js', 'manifest.json', 'styles.css']) copyFileSync(join(SRC, f), join(sr, f));

/* ── link check: every [[link]] must resolve (planned large files count) ── */
const files = new Set(); const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith('.')) continue; const p = join(d, e.name); if (e.isDirectory()) walk(p); else files.add(e.name.endsWith('.md') ? e.name.slice(0, -3) : e.name); } };
walk(VAULT); for (const [, n] of BIG) files.add(n);
let nlinks = 0; const broken = [];
const scan = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith('.')) continue; const p = join(d, e.name); if (e.isDirectory()) scan(p); else if (e.name.endsWith('.md')) { for (const m of readFileSync(p, 'utf8').matchAll(/!?\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) { nlinks++; if (!files.has(m[1].trim())) broken.push(`${e.name} → ${m[1]}`); } } } };
scan(VAULT);
console.log(`vault: ${lecNotes.length} lectures, ${ANALOG_UNITS.length} topics, ${BANK.length} questions, ${symKeys.length} symbols, ${BIG.length} large files; ${nlinks} links, ${broken.length} broken`);
if (broken.length) { console.log(broken.slice(0, 30).join('\n')); process.exitCode = 1; }
