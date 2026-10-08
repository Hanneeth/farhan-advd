// Builds the Lec 1–8 revision sheet: one self-contained HTML file (KaTeX pre-rendered, fonts and figures inlined)
// and a PDF printed by headless Brave. Run: node scripts/revision/build.mjs
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import katex from 'katex';
import { SECTIONS, SUB, TITLE } from './content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const kdir = join(root, 'node_modules', 'katex', 'dist');
const figDir = join(root, 'src', 'assets', 'doubts');
const outDir = join(root, 'pdf');
mkdirSync(outDir, { recursive: true });

const caps = Object.fromEntries(
  [...readFileSync(join(root, 'src', 'content', 'doubts.ts'), 'utf8').matchAll(/'(s-[a-z0-9-]+)': '((?:[^'\\]|\\.)*)'/g)].map((m) => [m[1], m[2]]),
);

const tex = (t, display = false) => katex.renderToString(t, { throwOnError: true, displayMode: display, strict: false });
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function inline(s) {
  // Protect $TeX$ first so **bold** may contain math.
  const maths = [];
  const t = esc(s.replace(/\$([^$]+)\$/g, (_m, x) => `\u0000${maths.push(x) - 1}\u0000`));
  return t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\u0000(\d+)\u0000/g, (_m, i) => tex(maths[Number(i)]));
}
const subs = (s) => esc(s).replace(/\b([A-Za-z])_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)/g, '$1<sub>$2</sub>');

let figN = 0;
function fig(key) {
  const svg = readFileSync(join(figDir, key + '.svg'), 'utf8');
  figN += 1;
  return `<figure><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}" alt=""><figcaption><b>Fig ${figN}.</b> ${subs(caps[key] ?? '')}</figcaption></figure>`;
}

function block(b) {
  switch (b.type) {
    case 'p':
      return `<p>${inline(b.text)}</p>`;
    case 'list':
      return `<ul class="tools">${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
    case 'fig':
      return fig(b.key);
    case 'formulas':
      return `<div class="formulas">${b.items.map(([l, t]) => `<div class="f"><span class="fl">${esc(l)}</span>${tex(t, true)}</div>`).join('')}</div>`;
    case 'traps':
      return `<div class="traps"><b>Watch out</b><ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul></div>`;
    case 'asked':
      return `<p class="asked"><b>Asked in:</b> ${esc(b.text)}</p>`;
    case 'method':
      return `<div class="method"><b>${esc(b.title)}</b><ol>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol></div>`;
    default:
      throw new Error('unknown block ' + b.type);
  }
}

// KaTeX CSS with its woff2 fonts inlined (other formats dropped), so the page works offline.
let kcss = readFileSync(join(kdir, 'katex.min.css'), 'utf8');
kcss = kcss.replace(/src:url\(fonts\/([^)]+\.woff2)\) format\("woff2"\)(,url\([^)]+\) format\("[a-z]+"\))*/g, (_m, f) => {
  const b64 = readFileSync(join(kdir, 'fonts', f)).toString('base64');
  return `src:url(data:font/woff2;base64,${b64}) format("woff2")`;
});

const css = `
:root{--ink:#1d2228;--mut:#5c6570;--acc:#c9561c;--ok:#2e7d4f;--bad:#b8382a;--line:#e3ded3;--card:#fbfaf7}
*{box-sizing:border-box}
body{margin:0;background:#fff;color:var(--ink);font:14px/1.55 "IBM Plex Sans",Helvetica,Arial,sans-serif}
main{max-width:860px;margin:0 auto;padding:28px 22px 60px}
h1{font-size:26px;margin:0 0 4px}
.sub{color:var(--mut);margin:0 0 14px}
nav{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 18px}
nav a{font-size:12.5px;padding:3px 9px;border:1px solid var(--line);border-radius:12px;color:var(--ink);text-decoration:none}
section{margin:0 0 26px}
h2{font-size:19px;margin:22px 0 10px;padding:6px 10px;background:#fbeadf;border-left:5px solid var(--acc);border-radius:4px}
p{margin:8px 0}
ul.tools{padding-left:18px}ul.tools li{margin:5px 0}
figure{margin:12px 0;text-align:center;break-inside:avoid}
figure img{max-width:100%;width:620px;height:auto}
figcaption{font-size:12px;color:var(--mut);margin-top:3px}
.formulas{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}
.f{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:6px 10px;break-inside:avoid}
.fl{display:block;font-size:11.5px;color:var(--mut)}
.f .katex-display{margin:4px 0}
.traps{background:#f9e3df;border:1px solid #efc3bb;border-radius:8px;padding:8px 12px;margin:12px 0;break-inside:avoid}
.traps b{color:var(--bad)}.traps ul{margin:4px 0 0;padding-left:18px}
.method{background:#e2f1e7;border:1px solid #b7dcc4;border-radius:8px;padding:8px 12px;margin:12px 0}
.method b{color:var(--ok)}.method ol{margin:4px 0 0;padding-left:20px}
.asked{font-size:12.5px;color:var(--mut)}
.index{columns:2;column-gap:18px}.index h2{column-span:all}.ix{break-inside:avoid-column}.ix h3{font-size:13px;margin:10px 0 4px;color:var(--acc)}.ixf{font-size:12px;margin:0 0 5px;break-inside:avoid}.ixf .fl{font-size:10.5px}
@media (max-width:640px){.index{columns:1}}
@media (max-width:640px){.formulas{grid-template-columns:1fr}main{padding:18px 16px}}
@media print{@page{size:A4;margin:10mm}body{font-size:12.5px}main{max-width:none;padding:0}nav{display:none}h2{break-after:avoid;margin-top:12px}figure{margin:6px 0}figure img{width:500px}.formulas{gap:5px}}
`;

const index = `<section id="index" class="index"><h2>Formula index: every formula above, in lecture order</h2>${SECTIONS.filter((s) => s.blocks.some((b) => b.type === 'formulas'))
  .map((s) => `<div class="ix"><h3>${esc(s.title.split(' · ')[0])}</h3>${s.blocks.filter((b) => b.type === 'formulas').flatMap((b) => b.items).map(([l, t]) => `<div class="ixf"><span class="fl">${esc(l)}</span>${tex(t)}</div>`).join('')}</div>`)
  .join('')}</section>`;
const body = SECTIONS.map((s) => `<section id="${s.id}"><h2>${esc(s.title)}</h2>${s.blocks.map(block).join('\n')}</section>`).join('\n');
const nav = SECTIONS.map((s) => `<a href="#${s.id}">${esc(s.title.split(' · ')[0])}</a>`).join('') + '<a href="#index">Formula index</a>';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analog Revision Sheet</title><style>${kcss}</style><style>${css}</style></head>
<body><main><h1>${esc(TITLE)}</h1><p class="sub">${esc(SUB)}</p><nav>${nav}</nav>${body}${index}</main></body></html>`;

const htmlPath = join(outDir, 'Analog Revision Sheet Lec 1-8.html');
writeFileSync(htmlPath, html);
const pdfPath = join(outDir, 'Analog Revision Sheet Lec 1-8.pdf');
execFileSync('/Applications/Brave Browser.app/Contents/MacOS/Brave Browser', [
  '--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, 'file://' + htmlPath,
], { stdio: 'ignore' });
console.log('figures', figN, 'html', (html.length / 1e6).toFixed(2), 'MB');
