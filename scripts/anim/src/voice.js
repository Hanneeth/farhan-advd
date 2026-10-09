/* Voice: natural-sounding narration (best installed voice, sentence-by-sentence with breaths, symbols read the way a
   teacher says them), study pacing, and the "say it back" drill at the end of a scene. */
'use strict';

const Voice = (() => {
  const NOVELTY = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Wobble|Whisper|Zarvox|Trinoids|Organ|Jester|Superstar|Ralph|Fred|Junior|Kathy|Grandpa|Grandma|Eddy|Flo|Reed|Rocko|Sandy|Shelley|Good News|Hysterical|Deranged|Pipe/i;
  const GOOD = /Ava|Zoe|Samantha|Daniel|Serena|Karen|Moira|Tessa|Rishi|Veena|Allison|Susan|Tom|Evan|Nathan|Joelle|Noelle|Aria|Jenny|Guy|Sonia|Libby|Ryan|Neerja|Prabhat|Natasha|William/;
  const score = (v) => (/Premium/i.test(v.name) ? 120 : 0) + (/Enhanced|Neural|Natural|Online/i.test(v.name) ? 90 : 0) + (/Google/.test(v.name) ? 60 : 0)
    + (GOOD.test(v.name) ? 40 : 0) + (/en[-_](GB|US|IN|AU|IE)/i.test(v.lang) ? 10 : 0) + (v.localService ? 0 : 5) - (NOVELTY.test(v.name) ? 500 : 0);
  let chosen = null, gen = 0, talking = false, keep = [], audio = null, lastEnd = 0, alive = null;
  /* pre-recorded natural voice (neural TTS rendered at build time), keyed by a hash of the spoken text */
  const AUD = typeof AUDIO !== 'undefined' ? AUDIO : {};
  const STUDIO = { name: 'Studio voice (natural, recorded)', lang: 'en-US', studio: true };
  const hasStudio = Object.keys(AUD).length > 0;
  function key(text) { let h = 0x811c9dc5; for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
  const synth = () => window.speechSynthesis;
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (_) { return null; } return null; };

  function list() {
    const s = synth();
    const sys = s ? s.getVoices().filter((v) => /^en/i.test(v.lang)).sort((a, b) => score(b) - score(a)) : [];
    return hasStudio ? [STUDIO, ...sys] : sys;
  }
  function pick() {
    const vs = list(); if (!vs.length) return null;
    const saved = store('alab.voice');
    chosen = vs.find((v) => v.name === saved) || vs[0];
    return chosen;
  }
  function choose(name) { chosen = list().find((v) => v.name === name) || chosen; store('alab.voice', name); }

  /* ── how a teacher reads the symbols ── */
  const SUB = { th: 'threshold', thp: 'threshold P', thn: 'threshold N', ov: 'overdrive', in: 'in', out: 'out', min: 'min', max: 'max', up: 'up', down: 'down',
    casc: 'cascode', bottom: 'bottom', src: 'source', ox: 'ox', eff: 'effective', tot: 'total', id: 'I D', b: 'B', BIAS: 'bias', bias: 'bias', OUT: 'out', IN: 'in', REF: 'ref', ref: 'ref',
    DD: 'D D', SS: 'S S', CM: 'C M', DM: 'D M' };
  const letters = (s) => s.toUpperCase().split('').join(' ');
  /* the letter A as a symbol: written "A." so every voice says "ay" (never "uh", and never "eye" as "Ay" was) */
  const LETTER_A = 'A.';
  function subWord(tok) {
    const parts = tok.split(/,\s*/);
    return parts.map((part) => part.replace(/([A-Za-z]+)|(\d+)/g, (_m, w, d) => {
      if (d) return ' ' + (d === '0' ? 'zero' : d) + ' ';
      if (SUB[w] !== undefined) return ' ' + SUB[w] + ' ';
      if (w.length <= 3 && /^[A-Z]+$/.test(w)) return ' ' + (w === 'A' ? LETTER_A : letters(w)) + ' ';
      if (w.length === 1) return ' ' + (w === 'a' || w === 'A' ? LETTER_A : w.toUpperCase()) + ' ';
      return ' ' + w + ' ';
    })).join(parts.every((x) => /^\d+$/.test(x)) ? ' and ' : ', ');
  }
  const varSpeak = (base, sub) => ` ${base === 'A' || base === 'a' ? LETTER_A : base.length === 1 ? base.toUpperCase() : letters(base)} ${subWord(sub)} `;
  const GREEK = { α: 'alpha', β: 'beta', γ: 'gamma', δ: 'delta', ε: 'epsilon', θ: 'theta', λ: 'lambda', τ: 'tau', φ: 'phi', ω: 'omega', Δ: 'delta', π: 'pi', ρ: 'rho', σ: 'sigma' };
  const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBS = '₀₁₂₃₄₅₆₇₈₉';
  /* words a voice gets wrong if left alone: GB is not gigabytes, PM is not the afternoon, VOL is not a volume */
  const LEX = [
    [/\bGBW\b/g, 'G B W'], [/\bGBP\b/g, 'G B P'], [/\bGB\b/g, 'G B'], [/\bUGB\b/g, 'unity-gain bandwidth'], [/\bPM\b/g, 'phase margin'],
    [/\bdB\b/g, 'decibels'], [/\bCMRR\b/g, 'C M R R'], [/\bPSRR\b/g, 'P S R R'], [/\bRHP\b/g, 'right-half-plane'], [/\bLHP\b/g, 'left-half-plane'],
    [/\bICMR\b/g, 'I C M R'], [/\bVTC\b/g, 'V T C'], [/\bDC\b/g, 'D C'], [/\bCMOS\b/g, 'C mos'], [/\b[nN]MOS\b/g, 'N mos'], [/\b[pP]MOS\b/g, 'P mos'], [/\bMOS\b/g, 'mos'],
    [/\b(VDD|VSS|VOL|VOH|VIL|VIH|NML|NMH|VCM|ISS|VISS|ACM|SR|KCL|KVL|CMFB|OTA|DM|CM)\b/g, (w) => (w === 'SR' ? 'slew rate' : letters(w))],
    [/\bV(DS|GS|SB|DSAT|ds|gs)(\d*)\b/g, (_m, s, d) => `V ${letters(s)} ${d}`], [/\bVth(\d*)\b/g, 'V threshold $1'], [/\bVov(\d*)\b/g, 'V overdrive $1'], [/\bVin\b/g, 'V in'], [/\bVout\b/g, 'V out'],
    [/\b([gr])([mO])(\d+)\b/g, (_m, a, b, d) => `${a.toUpperCase()} ${b.toUpperCase()} ${d}`], [/\bgm\b/g, 'G M'], [/\brO\b/g, 'R O'],
    [/\b([ICRV])(\d+)\b/g, '$1 $2'], [/\bCc\b/g, 'C C'], [/\bCL\b/g, 'C L'], [/\bRL\b/g, 'R L'], [/\bRz\b/g, 'R Z'], [/\bk([nRpP])\b/g, 'k $1'], [/\bRout\b/g, 'R out'],
    [/\bA([vd])\b/g, `${LETTER_A} $1`], [/\bA(\d)\b/g, (_m, d) => `${LETTER_A} ${d === '0' ? 'zero' : d}`], [/\bpF\b/g, 'picofarads'], [/\bAv(\d)\b/g, `${LETTER_A} V $1`],
  ];

  function texSpeak(x) {
    let s = x;
    // a ≤ b ≤ c reads as "b lies between a and c"
    const chain = (op) => { const p = s.split(op); if (p.length === 3 && !/\\[lg]e/.test(p.join(''))) s = `${p[1]} lies between ${op === '\\le' ? p[0] : p[2]} and ${op === '\\le' ? p[2] : p[0]}`; };
    chain('\\le'); chain('\\ge');
    for (let i = 0; i < 3; i++) {
      s = s.replace(/\\(?:text|mathrm|mathbf|operatorname)\{([^{}]*)\}/g, ' $1 ')
        .replace(/\\underbrace\{((?:[^{}]|\{[^{}]*\})*)\}_\{(?:[^{}]|\{[^{}]*\})*\}/g, ' $1 ')
        .replace(/\\[td]?frac12/g, ' half ').replace(/\\[td]?frac\{([^{}]*)\}\{([^{}]*)\}/g, ' $1 over $2 ').replace(/\\[td]?frac\s*([A-Za-z0-9])([A-Za-z0-9])/g, ' $1 over $2 ');
    }
    s = s.replace(/(\d)\s*(?:\\[,;])?\s*\\mu\s*(A|W|s|m|V)\b/g, (_m, n, u) => `${n} micro${{ A: 'amps', W: 'watts', s: 'seconds', m: 'metres', V: 'volts' }[u]}`)
      .replace(/\\left|\\right/g, '').replace(/\^\{?\\circ\}?/g, ' degrees ').replace(/([A-Za-z])(?:'|\^\{?\\prime\}?)_\{?([A-Za-z0-9]+)\}?/g, (_m, b, sub) => varSpeak(b, sub) + ' prime ').replace(/\^\{?\\prime\}?|'|\\prime/g, ' prime ').replace(/\\ne(q)?\b/g, ' is not ').replace(/\\lt\b|</g, ' is less than ').replace(/\\gt\b|>/g, ' is greater than ').replace(/\\tan\^\{-1\}/g, ' arc tan of ').replace(/\\Delta\s*/g, ' delta ').replace(/\\log_\{?10\}?/g, ' log ').replace(/\\log/g, ' log ').replace(/\\ln/g, ' natural log of ').replace(/\\sqrt\{([^{}]*)\}/g, ' root $1 ').replace(/\\sqrt\s*(\d)/g, ' root $1 ').replace(/\\pi/g, ' pi ').replace(/\\gg/g, ' much greater than ').replace(/\\ll/g, ' much less than ').replace(/\\angle/g, ' the angle of ').replace(/\\circ/g, ' degrees ').replace(/\\max/g, ' the larger of ').replace(/\\min/g, ' the smaller of ')
      .replace(/\\parallel/g, ' in parallel with ').replace(/\\times|\\cdot/g, ' times ').replace(/\\approx/g, ' is about ').replace(/\\ge(q)?/g, ' is at least ').replace(/\\le(q)?/g, ' is at most ')
      .replace(/\\Rightarrow|\\implies/g, ', so ').replace(/\\to/g, ' to ').replace(/\\in\b/g, ' in ').replace(/\\propto/g, ' grows like ').replace(/\\infty/g, ' infinity ').replace(/\\pm/g, ' plus or minus ')
      .replace(/\\(mu|lambda|beta|omega|tau|alpha|gamma|phi|theta|rho|sigma|delta|epsilon)/g, ' $1 ').replace(/\\varepsilon/g, ' epsilon ').replace(/\\Delta/g, ' delta ')
      .replace(/\\qquad|\\quad/g, ', ').replace(/\\[,;!: ]/g, ' ')
      .replace(/\(g_m ?r_O\)\^2/g, ' g M r O, squared ')
      .replace(/([A-Za-z])_\{([^{}]*)\}/g, (_m, b, sub) => varSpeak(b, sub)).replace(/([A-Za-z])_([A-Za-z0-9])/g, (_m, b, sub) => varSpeak(b, sub))
      .replace(/\^2(?!\d)/g, ' squared ').replace(/\^3(?!\d)/g, ' cubed ').replace(/\^(-?)(\d+)/g, (_m, m, d) => ` to the ${m ? 'minus ' : ''}${d} `).replace(/\^\{-([^{}]*)\}/g, ' to the minus $1 ').replace(/\^\{([^{}]*)\}/g, ' to the $1 ')
      .replace(/\\[a-zA-Z]+/g, ' ').replace(/[{}_\\]/g, ' ').replace(/\|/g, ' ')
      .replace(/(\d)\s*-\s*(\d)/g, '$1 minus $2').replace(/\s-\s/g, ' minus ').replace(/(^|[\s(=])-(\d)/g, '$1minus $2')
      .replace(/\+/g, ' plus ').replace(/=/g, ' equals ').replace(/[[\]]/g, ' ').replace(/\//g, ' over ').replace(/\^/g, ' ')
      .replace(/(^|[\s(])A(?=[\s),]|$)/g, `$1${LETTER_A}`); // a lone A in maths is the gain, the letter
    return s;
  }
  const UNIT = { V: ['volt', 'volts'], mV: ['millivolt', 'millivolts'], 'µA': ['microamp', 'microamps'], uA: ['microamp', 'microamps'], mA: ['milliamp', 'milliamps'],
    'kΩ': ['kilo-ohm', 'kilo-ohms'], 'MΩ': ['mega-ohm', 'mega-ohms'], 'Ω': ['ohm', 'ohms'], mW: ['milliwatt', 'milliwatts'], W: ['watt', 'watts'], pF: ['picofarad', 'picofarads'],
    fF: ['femtofarad', 'femtofarads'], MHz: ['megahertz', 'megahertz'], GHz: ['gigahertz', 'gigahertz'], kHz: ['kilohertz', 'kilohertz'], ns: ['nanosecond', 'nanoseconds'], ps: ['picosecond', 'picoseconds'], Hz: ['hertz', 'hertz'],
    'µs': ['microsecond', 'microseconds'], us: ['microsecond', 'microseconds'], ms: ['millisecond', 'milliseconds'], dB: ['decibel', 'decibels'], 'µW': ['microwatt', 'microwatts'], uW: ['microwatt', 'microwatts'], nW: ['nanowatt', 'nanowatts'],
    nA: ['nanoamp', 'nanoamps'], pA: ['picoamp', 'picoamps'], A: ['amp', 'amps'], 'µV': ['microvolt', 'microvolts'], kV: ['kilovolt', 'kilovolts'], 'µm': ['micrometre', 'micrometres'], nm: ['nanometre', 'nanometres'],
    nF: ['nanofarad', 'nanofarads'], 'µF': ['microfarad', 'microfarads'] };
  const UNITS_RE = 'mV|µA|uA|mA|nA|pA|kΩ|MΩ|Ω|mW|µW|uW|nW|W|pF|fF|nF|µF|MHz|GHz|kHz|ns|ps|µs|us|ms|dB|Hz|µV|kV|V|µm|nm'; // not bare A: "10 A" is usually a gain
  function units(s) {
    return s.replace(/(\d)\s*(?:\\[,;])?\s*\\(?:mathrm|text)\{([^{}]+)\}/g, '$1 $2')
      .replace(/(\d+(?:\.\d+)?)\s*(G|M|k)rad\/s/g, (_m, n, p) => `${n} ${{ G: 'giga', M: 'mega', k: 'kilo' }[p]}radians per second`)
      .replace(/(\d+(?:\.\d+)?)\s*(m|µ|u)S\b/g, (_m, n, p) => `${n} ${p === 'm' ? 'milli' : 'micro'}siemens`)
      .replace(/(µ|m|)A\s*\/\s*V(?:\^2|²|\^\{2\})/g, (_m, p) => `${{ µ: 'micro', m: 'milli', '': '' }[p]}amps per volt squared`)
      .replace(/(\d)\s*V(?:\^\{-1\}|⁻¹)/g, '$1 per volt').replace(/\bin\s+V(?:\^\{-1\}|⁻¹)/g, 'in inverse volts').replace(/\bV(?:\^\{-1\}|⁻¹)/g, 'per volt')
      .replace(/rad\/s\b/g, 'radians per second').replace(/V\/µs\b/g, 'volts per microsecond').replace(/µA\/pF/g, 'microamps per picofarad').replace(/(\d)\s*–\s*(\d)/g, '$1 to $2')
      .replace(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(${UNITS_RE})(?![A-Za-z0-9_{⁻²])`, 'g'), (_m, n, u) => `${n} ${UNIT[u][+n === 1 ? 0 : 1]}`);
  }
  function plainSpeak(s) {
    s = s.replace(/([A-Za-z])([₀-₉]+)/g, (_m, b, d) => varSpeak(b, [...d].map((c) => SUBS.indexOf(c)).join(''))).replace(/[₀-₉]+/g, (c) => ' ' + [...c].map((d) => SUBS.indexOf(d)).join('') + ' ')
      .replace(/(\d)\s*([⁻]?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_m, d, e) => e === '²' ? `${d} squared` : `${d} to the ${e.replace('⁻', 'minus ').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => SUPS.indexOf(c))}`)
      .replace(/⁻¹/g, ' inverse').replace(/²/g, ' squared').replace(/³/g, ' cubed')
      .replace(/([αβγδεθλτφωρσ])_\{?([A-Za-z0-9,]+)\}?/g, (_m, g, sub) => ` ${GREEK[g]} ${subWord(sub)} `)
      .replace(/µ\s*([np])\s*C_?\{?ox\}?/g, 'mu $1 C ox').replace(/µ\s*C_?\{?ox\}?/g, 'mu C ox').replace(/µS\b/g, 'microsiemens').replace(/µ(A|W|s|m|V)\b/g, (_m, u) => 'micro' + { A: 'amps', W: 'watts', s: 'seconds', m: 'metres', V: 'volts' }[u])
      .replace(/([αβγδεθλτφωρσ])/g, (g) => ' ' + GREEK[g] + ' ').replace(/([A-Za-z])′_\{?([A-Za-z0-9]+)\}?/g, (_m, b, sub) => varSpeak(b, sub) + ' prime ').replace(/\bbeta\s+A\b(?!\.)/g, `beta ${LETTER_A}`).replace(/′/g, ' prime ').replace(/≠/g, ' is not ')
      .replace(/\|/g, ' ').replace(/</g, ' is less than ').replace(/>/g, ' is greater than ')
      .replace(/\s·\s*(?=\d+(?:\.\d+)? marks)/g, ', ').replace(/\s+·\s+(?=[A-Z(])/g, ', ')
      .replace(/\b(20\d\d)-(\d\d)\b/g, '$1 $2').replace(/(\d)\s*\+\s*(\d)/g, '$1 plus $2').replace(/\)(\d+),(\d+)\b/g, ') $1 and $2').replace(/\)(\d+)\b/g, ') $1')
      .replace(/\bV\/s\b/g, 'volts per second').replace(/\bf\s*[−-]\s*3\s*dB\b/g, 'f minus 3 decibels').replace(/\(=\s*/g, '(equals ').replace(/(\d)[\u2009\u202f\u00a0](\d{3})(?!\d)/g, '$1$2').replace(/\bj(\d)/g, 'j $1')
      .replace(/([A-Za-z])_\{([^{}]*)\}/g, (_m, b, sub) => varSpeak(b, sub)).replace(/\b([A-Za-z]{1,3})_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)/g, (_m, b, sub) => varSpeak(b, sub))
      .replace(/\bA(?=\s*(?:=|≈))/g, LETTER_A);
    LEX.forEach(([re, to]) => { s = s.replace(re, to); });
    return s
      .replace(/−\s*(\d)/g, 'minus $1').replace(/\s[−-]\s/g, ' minus ').replace(/−/g, ' minus ')
      .replace(/\bLecs?\b\.?/g, 'Lecture').replace(/\bEx\b\.?/g, 'Example').replace(/\bmid-sem\b/gi, 'mid sem').replace(/\bvs\.?\b/g, 'versus').replace(/\bi\.e\.,?/g, 'that is,').replace(/\be\.g\.,?/g, 'for example,')
      .replace(/\b(CM|KCL|KVL|CMFB|PMOS|NMOS|OTA|SR)\b/g, (w) => ({ CM: 'C M', KCL: 'K C L', KVL: 'K V L', CMFB: 'C M F B', PMOS: 'P mos', NMOS: 'N mos', OTA: 'O T A', SR: 'slew rate' }[w]))
      .replace(/\bM(\d+)\b/g, 'M $1').replace(/\bQ(\d+)\(([a-z])\)/g, 'Q $1 $2').replace(/\bP(\d+)\b/g, 'P $1').replace(/\bQ(\d+)\b/g, 'Q $1')
      .replace(/(\d+)\^(\d+)/g, '$1 to the $2').replace(/\)\^(\d)/g, ') to the $1').replace(/√\s*2/g, 'root 2').replace(/√/g, ' root ').replace(/π/g, ' pi ').replace(/≫/g, ' much greater than ').replace(/≪/g, ' much less than ').replace(/∠/g, ' angle ').replace(/°/g, ' degrees').replace(/✕/g, ' cross ')
      .replace(/\bmu A\b/g, 'microamps').replace(/\bHz\b/g, 'hertz').replace(/Δ\s*/g, 'delta ').replace(/·/g, ' times ').replace(/\bDM\b/g, 'D M').replace(/\bis is\b/g, 'is')
      .replace(/(\d)\s*%/g, '$1 percent').replace(/(\d+(?:\.\d+)?)×/g, '$1 times ')
      .replace(/\s*\/\s*/g, ' over ').replace(/\s=\s/g, ' equals ').replace(/↔/g, ' and ')
      .replace(/→/g, ', then ').replace(/↑/g, ' goes up ').replace(/↓/g, ' goes down ').replace(/≈/g, ' about ').replace(/≥/g, ' at least ').replace(/≤/g, ' at most ')
      .replace(/×/g, ' times ').replace(/∥/g, ' in parallel with ').replace(/÷/g, ' divided by ').replace(/Ω/g, ' ohms ').replace(/µ/g, ' micro ')
      .replace(/[“”"]/g, '').replace(/…/g, ', ').replace(/\s*[—–]\s*/g, ', ').replace(/[①②③④⑤]/g, (c) => ' ' + ('①②③④⑤'.indexOf(c) + 1) + ', ').replace(/[✓✗▶↺★💡]/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1').replace(/,\s*,/g, ',').replace(/\s+/g, ' ').replace(/^[\s,;:]+/, '').replace(/\bA\.\./g, 'A.').trim();
  }
  function toSpeech(html) {
    const s = html.replace(/\\mu\$\s*(A|W|s|m|V|F|S)\b/g, '$µ$1').replace(/(\d)\$\s*((?:G|M|k)?rad\/s|mV|µA|uA|mA|kΩ|MΩ|Ω|mW|W|pF|fF|MHz|GHz|kHz|ns|µs|us|ms|dB|mS|µS|V)(?![A-Za-z0-9_{])/g, '$1 $2$$').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, ' and ').replace(/&lt;/g, ' is less than ').replace(/&gt;/g, ' is greater than ').replace(/&[a-z]+;/g, ' ').replace(/\*\*/g, '')
      .split('$').map((seg, i) => (i % 2 ? ' ' + texSpeak(units(seg.replace(/\\mu\s*(?=(?:A|W|s|m|V|F|S)\b)/g, 'µ'))) + ' ' : units(seg))).join('');
    return plainSpeak(s);
  }
  /* split into breath-sized pieces: sentences, and long sentences at ';' or ':' */
  function pieces(text) {
    const out = [];
    text.split(/(?<=[.!?])(?<!\bA\.)\s+(?=[A-Z0-9(])/).forEach((sen) => {
      if (sen.length > 160) sen.split(/(?<=[;:])\s+/).forEach((p) => p && out.push(p)); else if (sen) out.push(sen);
    });
    // some engines (Chrome's online voices) stop mid-utterance after ~15 s: keep each piece short, breaking at commas
    return out.flatMap((p) => {
      if (p.length <= 200) return [p];
      const r = []; let cur = '';
      p.split(/(?<=,)\s+/).forEach((c) => { if (cur && (cur + ' ' + c).length > 180) { r.push(cur); cur = c; } else cur = cur ? cur + ' ' + c : c; });
      if (cur) r.push(cur);
      return r;
    });
  }
  const words = (html) => toSpeech(html).split(/\s+/).filter(Boolean).length;

  let rate = 0.95;
  /* speak html; resolves when finished (or cancelled). gap = breath between sentences in ms */
  function speak(html, o = {}) {
    cancel();
    const my = ++gen;
    if (!chosen) pick();
    if (chosen?.studio && typeof html === 'string') {
      const src = AUD[key(toSpeech(html))];
      if (src) return playAudio(src, o, my);
    }
    const s = synth(); if (!s) return Promise.resolve(false);
    const back = chosen?.studio ? list().find((v) => !v.studio) || null : chosen; // a line with no recording: best system voice
    const parts = typeof html === 'string' ? pieces(toSpeech(html)) : html;
    talking = true;
    return new Promise((res) => {
      let i = 0;
      const next = () => {
        if (my !== gen) return res(false);
        if (i >= parts.length) { talking = false; lastEnd = performance.now(); clearInterval(alive); alive = null; return res(true); }
        const u = new SpeechSynthesisUtterance(parts[i++]);
        u.rate = clamp(rate * (o.speed || 1), 0.6, 1.7); u.pitch = 1; u.lang = back?.lang || 'en-GB';
        if (back) u.voice = back;
        let done = false;
        const fin = () => { if (done) return; done = true; keep = keep.filter((k) => k !== u); setTimeout(next, i < parts.length ? (o.gap ?? 260) : 0); };
        u.onend = fin; u.onerror = fin;
        keep.push(u); // Chrome drops callbacks of garbage-collected utterances
        s.speak(u);
        if (back && !back.localService && !alive) alive = setInterval(() => { if (s.speaking && !s.paused) { s.pause(); s.resume(); } }, 9000); // online voices time out otherwise
        // safety net: some engines never fire onend
        setTimeout(() => { if (!done && !s.speaking && my === gen) fin(); }, 1500 + 160 * u.text.split(' ').length * 1.6);
      };
      next();
    });
  }
  function playAudio(src, o, my) {
    talking = true;
    return new Promise((res) => {
      const a = new Audio(src); audio = a;
      a.preservesPitch = true; a.playbackRate = clamp(o.speed || 1, 0.5, 2);
      const end = (ok) => { if (audio === a) audio = null; if (my === gen) { talking = false; lastEnd = performance.now(); } res(ok && my === gen); };
      a.onended = () => end(true); a.onerror = () => end(false); a.onpause = () => { if (!a.ended) end(false); };
      a.play().catch(() => end(false));
    });
  }
  function cancel() { gen++; talking = false; keep = []; clearInterval(alive); alive = null; if (audio) { const a = audio; audio = null; a.pause(); } synth()?.cancel(); }
  const PROMPTS = ['Say it back. Listen first.', 'Next line.', 'Now from memory.'];
  return { speak, cancel, toSpeech, words, list, pick, choose, key, PROMPTS, hasStudio, current: () => chosen, canSay: (html) => !chosen?.studio || !!AUD[key(toSpeech(html))], talking: () => talking, idleFor: () => (talking ? 0 : performance.now() - lastEnd), setRate: (r) => { rate = r; }, store };
})();

/* ── study pacing: extra time after each subtitle, in ms ── */
const Pace = (() => {
  const LEVELS = [
    { name: 'Video pace', base: 0, wps: 99, voiceBase: 250 },
    { name: 'Study pace', base: 1300, wps: 2.6, voiceBase: 1300 },
    { name: 'Memorise (long pauses)', base: 2600, wps: 2.0, voiceBase: 2800 },
  ];
  let lv = +(Voice.store('alab.pace') ?? 1); if (!LEVELS[lv]) lv = 1;
  return {
    LEVELS, level: () => lv, set(v) { lv = v; Voice.store('alab.pace', String(v)); },
    /* html = subtitle just shown, shownFor = seconds it was on screen, voiced = it was read aloud */
    hold(html, shownFor, voiced) {
      const L = LEVELS[lv]; if (!html) return 0;
      const n = Voice.words(html);
      if (voiced) return L.voiceBase + (lv ? 25 * n : 0);
      return L.base + Math.max(0, n / L.wps - shownFor) * 1000;
    },
  };
})();

/* ── say it back: hear it, say it with the voice, say it from memory, check ── */
const Drill = (() => {
  let open = false, box, run = 0, onDone = null;
  const sleep = (ms, my) => new Promise((r) => setTimeout(() => r(my === run), ms));
  function close(resume) {
    open = false; run++; Voice.cancel();
    box?.classList.remove('on', 'drill');
    const f = onDone; onDone = null; if (resume && f) f();
  }
  function openFor(sc, voiced, done) {
    open = true; onDone = done; const my = ++run;
    box = document.querySelector('.try'); box.classList.add('on', 'drill');
    const b = box.querySelector('.box');
    const items = sc.recall;
    let i = 0;
    const draw = () => {
      b.innerHTML = `<div class="tag">Say it back · ${i + 1} of ${items.length}</div>
        <div class="step"></div><div class="line">${rt(items[i])}</div><div class="cd"><i></i></div>
        <div class="row"><button class="again">↺ Again</button><button class="go next">${i + 1 < items.length ? 'Next line ▶' : 'Continue ▶'}</button><button class="skip">Skip drill</button></div>
        ${voiced ? '' : '<div class="tip">Turn on 🔈 Voice and it will read each line with you.</div>'}`;
      b.querySelector('.again').onclick = () => { run++; play(run); };
      b.querySelector('.next').onclick = () => { run++; if (++i < items.length) { draw(); play(run); } else close(true); };
      b.querySelector('.skip').onclick = () => close(true);
    };
    const step = (t) => { b.querySelector('.step').innerHTML = t; };
    const line = () => b.querySelector('.line');
    const bar = (ms) => {
      const el = b.querySelector('.cd i'); el.style.transition = 'none'; el.style.width = '100%';
      requestAnimationFrame(() => { el.style.transition = `width ${ms}ms linear`; el.style.width = '0%'; });
    };
    async function play(my) {
      const txt = items[i]; const n = Voice.words(txt);
      line().classList.remove('hid');
      step('<b>1 · Listen and read.</b>');
      if (voiced) { if (!(await Voice.speak(Voice.PROMPTS[i === 0 ? 0 : 1], { gap: 120 })) || !(await Voice.speak(txt, { gap: 380 }))) return; }
      else if (!(await sleep(1500 + n * 380, my))) return;
      if (!(await sleep(600, my))) return;
      step('<b>2 · Now say it out loud with me.</b>');
      if (voiced) { if (!(await Voice.speak(txt, { gap: 420, speed: 0.88 }))) return; }
      else if (!(await sleep(1200 + n * 420, my))) return;
      if (!(await sleep(500, my))) return;
      const ms = 2500 + n * 520;
      step('<b>3 · From memory.</b> Say the whole line before the bar runs out. <span class="peek">(tap the line to peek)</span>');
      line().classList.add('hid'); line().onclick = () => line().classList.remove('hid');
      if (voiced) await Voice.speak(Voice.PROMPTS[2], { gap: 0 });
      if (my !== run) return;
      bar(ms);
      if (!(await sleep(ms, my))) return;
      line().classList.remove('hid');
      step('<b>4 · Check.</b> Did you get every symbol? If not, press ↺ Again.');
      if (voiced) { if (!(await Voice.speak(txt, { gap: 300 }))) return; }
      if (!(await sleep(voiced ? 2200 : 3200 + n * 200, my))) return;
      b.querySelector('.next').click();
    }
    draw(); play(my);
  }
  return { open: openFor, close, isOpen: () => open };
})();

/* attach say-it-back lines to scenes by title */
function setRecall(list) {
  list.forEach(([title, lines]) => {
    const s = SCENES.find((x) => x.title === title);
    if (s) s.recall = lines; // a shared list may name scenes another lesson has
  });
}
