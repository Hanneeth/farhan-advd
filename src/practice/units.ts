/**
 * SI-prefix parsing and formatting for answer entry and display.
 * Accepts: "90u", "90 µA", "90e-6", "0.09 mA", "9k", "9 kΩ", "1.2M", "-5.5", "358 kHz", "0.6 mA/V", "30 V/µs".
 */

export type Unit = 'V' | 'A' | 'Ω' | 'S' | 'F' | 'Hz' | 'rad/s' | 's' | 'V/V' | 'V/s' | 'A/V²' | '°' | 'dB' | 'nV/√Hz' | 'W' | 'J' | '';

const PREFIX: Record<string, number> = {
  p: 1e-12,
  n: 1e-9,
  u: 1e-6,
  µ: 1e-6,
  μ: 1e-6,
  m: 1e-3,
  k: 1e3,
  K: 1e3,
  M: 1e6,
  G: 1e9,
};

/** Case-sensitive where it matters: S = siemens, s = seconds (forgiven if the expected unit says otherwise). */
function unitOf(str: string, expected: Unit): Unit | undefined {
  if (str === 'S' || /^(siemens?|mho|a\/v)$/i.test(str)) return expected === 's' ? 's' : 'S';
  if (str === 's' || /^(sec|secs|seconds?)$/i.test(str)) return expected === 'S' ? 'S' : 's';
  if (/^hz$/i.test(str)) return 'Hz';
  if (/^(°|deg|degrees?)$/i.test(str)) return '°';
  if (/^db$/i.test(str)) return 'dB';
  if (str === 'W' || /^watts?$/i.test(str)) return 'W';
  if (str === 'J' || /^joules?$/i.test(str)) return 'J';
  if (/^nv\/(√|sqrt|rt)\(?hz\)?$/i.test(str)) return 'nV/√Hz';
  if (/^rad\/s$/i.test(str)) return 'rad/s';
  if (/^v\/v$/i.test(str)) return 'V/V';
  if (/^v\/s$/i.test(str)) return 'V/s';
  if (/^v$/i.test(str)) return 'V';
  if (/^a$/i.test(str)) return 'A';
  if (str === 'F') return 'F';
  if (/^(Ω|ω|ohms?)$/i.test(str)) return 'Ω';
  return undefined;
}

export interface Parsed {
  ok: boolean;
  value?: number;
  unit?: Unit;
  error?: string;
}

export function parseSI(input: string, expected: Unit = ''): Parsed {
  const s = input
    .trim()
    .replace(/\s+/g, '')
    .replace(/,/g, '')
    .replace(/[−–]/g, '-')
    .replace(/[×x]10\^?/g, 'e');
  if (!s) return { ok: false, error: 'Type a number.' };
  const m = s.match(/^([+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?)(.*)$/i);
  if (!m) return { ok: false, error: 'Start with a number, e.g. 90u or 90 µA.' };
  const num = parseFloat(m[1]);
  const rest = m[2];
  if (rest === '') return { ok: true, value: num, unit: expected };

  // Slew rates are usually typed per microsecond.
  const perMicro = rest.match(/^([pnuµμmkKMG]?)v\/[µuμ]s$/i);
  if (perMicro) return { ok: true, value: num * (perMicro[1] ? PREFIX[perMicro[1]] : 1) * 1e6, unit: 'V/s' };

  const candidates: Array<{ prefix: number; unit: Unit }> = [];
  const whole = unitOf(rest, expected);
  if (whole) candidates.push({ prefix: 1, unit: whole });
  if (rest[0] in PREFIX) {
    const after = rest.slice(1);
    if (after === '') candidates.push({ prefix: PREFIX[rest[0]], unit: expected });
    else {
      const u = unitOf(after, expected);
      if (u) candidates.push({ prefix: PREFIX[rest[0]], unit: u });
    }
  }
  if (candidates.length === 0) return { ok: false, error: `I don't recognise "${rest}". Try e.g. 90u, 9k, 0.6 mA/V.` };
  const best = candidates.find((c) => c.unit === expected) ?? candidates[0];
  const compatible = !expected || best.unit === expected || (expected === 'V/V' && best.unit === '');
  if (!compatible) return { ok: false, error: `That is in ${best.unit}, but this answer is in ${expected}.` };
  return { ok: true, value: num * best.prefix, unit: best.unit };
}

const FORMAT_PREFIXES: Array<[number, string]> = [
  [1e9, 'G'],
  [1e6, 'M'],
  [1e3, 'k'],
  [1, ''],
  [1e-3, 'm'],
  [1e-6, 'µ'],
  [1e-9, 'n'],
  [1e-12, 'p'],
];

/** Units that take SI prefixes on display. Gains and ratios are shown plainly. */
const PREFIXED: Unit[] = ['V', 'A', 'Ω', 'S', 'F', 'Hz', 'rad/s', 's', 'W', 'J'];

function sigfig(x: number, sig: number): string {
  return Number(x.toPrecision(sig)).toString().replace('-', '−');
}

/** Plain number with `sig` significant figures (exponent form for extremes). */
export function formatNumber(x: number, sig = 3): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : '−∞';
  if (x === 0) return '0';
  const abs = Math.abs(x);
  if (abs >= 1e6 || abs < 1e-3) return x.toExponential(sig - 1).replace('-', '−');
  // Four- and five-digit values (W/L 1111, gain 1429) read better whole than as 1110 / 1430.
  if (abs >= 1000) return String(Math.round(x)).replace('-', '−');
  return sigfig(x, sig);
}

/** formatSI(90e-6, 'A') → "90 µA"; formatSI(0.9, 'V') → "0.9 V"; formatSI(30e6,'V/s') → "30 V/µs". */
export function formatSI(x: number, unit: Unit, sig = 3): string {
  if (!Number.isFinite(x)) return `∞${unit ? ' ' + unit : ''}`;
  if (unit === 'V/s') return `${sigfig(x / 1e6, sig)} V/µs`;
  if (!PREFIXED.includes(unit) || x === 0) return `${formatNumber(x, sig)}${unit ? ' ' + unit : ''}`;
  const abs = Math.abs(x);
  if (unit === 'V' && abs >= 0.01 && abs < 1000) return `${sigfig(x, sig)} V`;
  // The course writes gm in mS (0.6 mS, 0.8 mA/V), so keep milli down to 0.1 mS.
  if (unit === 'S' && abs >= 1e-4 && abs < 1) return `${sigfig(x / 1e-3, sig)} mS`;
  for (const [f, p] of FORMAT_PREFIXES) {
    if (abs >= f * 0.99995) return `${sigfig(x / f, sig)} ${p}${unit}`;
  }
  return `${sigfig(x / 1e-12, sig)} p${unit}`;
}
