import { formatNumber, formatSI, type Unit } from './units';

/** A quantity as TeX: texSI(90e-6,'A') → "90\,\mathrm{\mu A}". */
export function texSI(x: number, unit: Unit, sig = 3): string {
  if (unit === '°') return `${texNum(x, sig)}^\\circ`;
  if (unit === 'nV/√Hz') return `${texNum(x, sig)}\\,\\mathrm{nV/\\sqrt{Hz}}`;
  if (unit === 'A/V²') return `${Number((x * 1e6).toPrecision(sig + 2))}\\,\\mathrm{\\mu A/V^2}`;
  const s = formatSI(x, unit, sig);
  const sp = s.indexOf(' ');
  const num = (sp < 0 ? s : s.slice(0, sp)).replace('−', '-');
  const u = sp < 0 ? '' : s.slice(sp + 1);
  if (!u) return num;
  const texUnit = u.replace('µ', '\\mu ').replace('Ω', '\\Omega').replace('V/V', 'V/V');
  return `${num}\\,\\mathrm{${texUnit}}`;
}

/** A plain number as TeX. */
export function texNum(x: number, sig = 3): string {
  return formatNumber(x, sig).replace('−', '-').replace(/e([+-]?\d+)/, (_, e) => `\\times 10^{${Number(e)}}`);
}
