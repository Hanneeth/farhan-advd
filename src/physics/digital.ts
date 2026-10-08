/**
 * Digital VLSI (handout L15–L38): MOS inverters (Kang & Leblebici Ch 5–7), delay and logical effort,
 * power, circuit families, sequencing, adders, multipliers and SRAM (Weste & Harris Ch 4, 5, 9–12).
 *
 * Conventions: kn = µnCox(W/L)n and kp = µpCox(W/L)p (A/V²); thresholds as magnitudes vtn, vtp (Kang’s
 * VT0,n and |VT0,p|); λ = 0 and no body effect unless stated. VM is the inverter switching threshold
 * (Kang writes Vth for it; here Vth stays the transistor threshold, as in the analog half).
 */

/* ─── Square-law currents (Kang’s form, λ = 0) ─── */

/** Drain current of a MOSFET given k = µCox(W/L), |VGS|, |VDS|, |Vt|. */
export function idSquare(k: number, vgs: number, vds: number, vt: number): number {
  const vov = vgs - vt;
  if (vov <= 0) return 0;
  if (vds >= vov) return (k / 2) * vov * vov;
  return (k / 2) * (2 * vov * vds - vds * vds);
}

export interface InvSpec {
  vdd: number;
  vtn: number;
  /** |Vthp| */
  vtp: number;
  kn: number;
  kp: number;
}

/** Output of a static CMOS inverter for a given input (solve In = Ip by bisection on Vout). */
export function cmosVout(p: InvSpec, vin: number): number {
  const f = (vout: number) => idSquare(p.kn, vin, vout, p.vtn) - idSquare(p.kp, p.vdd - vin, p.vdd - vout, p.vtp);
  let lo = 0;
  let hi = p.vdd;
  if (f(hi) <= 0) return p.vdd;
  if (f(lo) >= 0) return 0;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

/** Switching threshold VM (Vin = Vout, both saturated): (Vtn + r(VDD − |Vtp|))/(1 + r), r = √(kp/kn). */
export function cmosVM(p: InvSpec): number {
  const r = Math.sqrt(p.kp / p.kn);
  return (p.vtn + r * (p.vdd - p.vtp)) / (1 + r);
}

/** kR = kn/kp needed for a target VM (Kang Eq. 5.x): ((VDD − |Vtp| − VM)/(VM − Vtn))². */
export function kRForVM(p: { vdd: number; vtn: number; vtp: number; vm: number }): number {
  return ((p.vdd - p.vtp - p.vm) / (p.vm - p.vtn)) ** 2;
}

/**
 * VIL and VIH: the two input voltages where the VTC slope is −1 (Kang’s definition).
 * Found numerically from the exact square-law VTC.
 */
export function cmosVilVih(p: InvSpec): { vil: number; vih: number } {
  const h = 1e-6;
  const slope = (v: number) => (cmosVout(p, v + h) - cmosVout(p, v - h)) / (2 * h);
  const vm = cmosVM(p);
  const find = (a: number, b: number, rising: boolean) => {
    // slope goes 0 → −∞ between a and VM (rising = false: find where slope + 1 changes sign)
    let lo = a;
    let hi = b;
    for (let i = 0; i < 80; i++) {
      const m = (lo + hi) / 2;
      const s = slope(m) + 1; // > 0 when shallower than −1
      if (rising ? s > 0 : s < 0) hi = m;
      else lo = m;
    }
    return (lo + hi) / 2;
  };
  const vil = find(p.vtn + 1e-4, vm - 1e-4, false);
  const vih = find(vm + 1e-4, p.vdd - p.vtp - 1e-4, true);
  return { vil, vih };
}

/** Noise margins: NML = VIL − VOL, NMH = VOH − VIH. */
export function noiseMargins(v: { voh: number; vol: number; vil: number; vih: number }): { nml: number; nmh: number } {
  return { nml: v.vil - v.vol, nmh: v.voh - v.vih };
}

/** Symmetric CMOS inverter (kR = 1, Vtn = |Vtp| = VT): VIL = (3VDD + 2VT)/8, VIH = (5VDD − 2VT)/8 (Kang). */
export function symmetricVilVih(vdd: number, vt: number): { vil: number; vih: number } {
  return { vil: (3 * vdd + 2 * vt) / 8, vih: (5 * vdd - 2 * vt) / 8 };
}

/* ─── Inverters with other loads (Kang §5.3, Weste §9.2.2) ─── */

/** Resistive-load nMOS inverter (Kang §5.3): VOH = VDD and closed forms for VOL, VIL, VIH, VM. */
export function resistiveInverter(p: { vdd: number; vt: number; kn: number; rl: number }) {
  const a = 1 / (p.kn * p.rl);
  const vol = p.vdd - p.vt + a - Math.sqrt((p.vdd - p.vt + a) ** 2 - 2 * p.vdd * a);
  const vil = p.vt + a;
  const vih = p.vt + Math.sqrt((8 * p.vdd * a) / 3) - a;
  // VM: driver saturated, VDD − VM = RL·(kn/2)(VM − VT)²
  const b = (p.kn * p.rl) / 2;
  const x = (-1 + Math.sqrt(1 + 4 * b * (p.vdd - p.vt))) / (2 * b); // x = VM − VT
  const vm = p.vt + x;
  const istatic = (p.vdd - vol) / p.rl;
  return { voh: p.vdd, vol, vil, vih, vm, istatic, pstatic: istatic * p.vdd };
}

/** Pseudo-nMOS inverter (PMOS load, gate grounded): VOL where the saturated load equals the linear driver. */
export function pseudoNmosVol(p: { vdd: number; vtn: number; vtp: number; kn: number; kp: number }): { vol: number; istatic: number; pstatic: number } {
  const a = p.vdd - p.vtn;
  const iload = (p.kp / 2) * (p.vdd - p.vtp) ** 2;
  const vol = a - Math.sqrt(a * a - (2 * iload) / p.kn);
  return { vol, istatic: iload, pstatic: iload * p.vdd };
}

/** Depletion-load nMOS inverter (γ = 0): load VGS = 0, saturated when the output is low. vtd = |VT,load|. */
export function depletionLoadVol(p: { vdd: number; vtn: number; vtd: number; kn: number; kd: number }): { vol: number; istatic: number } {
  const a = p.vdd - p.vtn;
  const iload = (p.kd / 2) * p.vtd * p.vtd;
  return { vol: a - Math.sqrt(a * a - (2 * iload) / p.kn), istatic: iload };
}

/* ─── Switching (Kang §6.3) ─── */

/**
 * Propagation delay high→low by integrating the capacitor discharge (Kang Eq. 6.x):
 * τPHL = CL/(kn(VOH − Vtn)) · [2Vtn/(VOH − Vtn) + ln(4(VOH − Vtn)/(VOH + VOL) − 1)].
 */
export function tauPHL(p: { cl: number; kn: number; vtn: number; voh: number; vol: number }): number {
  const a = p.voh - p.vtn;
  return (p.cl / (p.kn * a)) * ((2 * p.vtn) / a + Math.log((4 * a) / (p.voh + p.vol) - 1));
}

/** τPLH (CMOS, VOH = VDD): CL/(kp(VOH − VOL − |Vtp|)) · [2|Vtp|/(…) + ln(4(…)/(VOH − VOL) − 1)]. */
export function tauPLH(p: { cl: number; kp: number; vtp: number; voh: number; vol: number }): number {
  const a = p.voh - p.vol - p.vtp;
  return (p.cl / (p.kp * a)) * ((2 * p.vtp) / a + Math.log((4 * a) / (p.voh - p.vol) - 1));
}

/** Average-current method (Kang): τPHL = CL·(VOH − V50)/Iavg, Iavg = ½[I(Vout = VOH) + I(Vout = V50)] at Vin = VOH. */
export function tauPHLavg(p: { cl: number; kn: number; vtn: number; voh: number; vol: number }): number {
  const v50 = (p.voh + p.vol) / 2;
  const iavg = 0.5 * (idSquare(p.kn, p.voh, p.voh, p.vtn) + idSquare(p.kn, p.voh, v50, p.vtn));
  return (p.cl * (p.voh - v50)) / iavg;
}

/** Numerical check of τPHL: integrate CL dV/dt = −ID from VOH down to V50. */
export function tauPHLnumeric(p: { cl: number; kn: number; vtn: number; voh: number; vol: number }, steps = 200000): number {
  const v50 = (p.voh + p.vol) / 2;
  const dv = (p.voh - v50) / steps;
  let t = 0;
  for (let i = 0; i < steps; i++) {
    const v = p.voh - (i + 0.5) * dv;
    t += (p.cl * dv) / idSquare(p.kn, p.voh, v, p.vtn);
  }
  return t;
}

/* ─── Power (Weste §5.2–5.3; Kang §6.x) ─── */

/** Dynamic power α·C·VDD²·f (α = activity factor: chance of a 0→1 transition per cycle). */
export function dynamicPower(p: { alpha: number; c: number; vdd: number; f: number }): number {
  return p.alpha * p.c * p.vdd * p.vdd * p.f;
}

/** Energy drawn from VDD per 0→1 output transition: C·VDD² (half stored, half burnt in the pMOS). */
export function energyPerTransition(c: number, vdd: number): number {
  return c * vdd * vdd;
}

/* ─── Gates (Kang §7.3, Weste §4) ─── */

/** Equivalent k of n equal transistors in series (all on): k/n; in parallel (all on): n·k. */
export function seriesK(k: number, n: number): number {
  return k / n;
}
export function parallelK(k: number, n: number): number {
  return k * n;
}

/** VM of an n-input NAND with all inputs switching together: nMOS stack kn/n, pMOS parallel n·kp. */
export function nandVM(p: InvSpec, n: number): number {
  return cmosVM({ ...p, kn: seriesK(p.kn, n), kp: parallelK(p.kp, n) });
}
export function norVM(p: InvSpec, n: number): number {
  return cmosVM({ ...p, kn: parallelK(p.kn, n), kp: seriesK(p.kp, n) });
}

/* ─── Series–parallel networks, complex gates, Euler paths (Kang §7.4) ─── */

export type Net = { t: 'in'; name: string } | { t: 'ser'; parts: Net[] } | { t: 'par'; parts: Net[] };

/** Parse a sum-of-products-like expression: letters, '+' (OR), juxtaposition or '·' (AND), parentheses. */
export function parseExpr(src: string): Net {
  const s = src.replace(/\s|·|\*/g, '');
  let i = 0;
  function sum(): Net {
    const parts = [prod()];
    while (s[i] === '+') {
      i++;
      parts.push(prod());
    }
    return parts.length === 1 ? parts[0] : { t: 'par', parts };
  }
  function prod(): Net {
    const parts = [atom()];
    while (i < s.length && (s[i] === '(' || /[A-Za-z]/.test(s[i]))) parts.push(atom());
    return parts.length === 1 ? parts[0] : { t: 'ser', parts };
  }
  function atom(): Net {
    if (s[i] === '(') {
      i++;
      const n = sum();
      if (s[i] !== ')') throw new Error('missing )');
      i++;
      return n;
    }
    if (/[A-Za-z]/.test(s[i])) return { t: 'in', name: s[i++] };
    throw new Error(`unexpected "${s[i] ?? 'end'}"`);
  }
  const out = sum();
  if (i !== s.length) throw new Error(`unexpected "${s[i]}"`);
  return out;
}

/** The dual network (series ↔ parallel): the pull-up of a static CMOS gate. */
export function dual(n: Net): Net {
  if (n.t === 'in') return n;
  return { t: n.t === 'ser' ? 'par' : 'ser', parts: n.parts.map(dual) };
}

/** Number of transistors in a network. */
export function netSize(n: Net): number {
  return n.t === 'in' ? 1 : n.parts.reduce((a, p) => a + netSize(p), 0);
}

/** Longest series stack (worst-case number of transistors in series in any conducting path). */
export function stackDepth(n: Net): number {
  if (n.t === 'in') return 1;
  if (n.t === 'ser') return n.parts.reduce((a, p) => a + stackDepth(p), 0);
  return Math.max(...n.parts.map(stackDepth));
}

/**
 * Size a network so its worst path equals one unit transistor (unit width `unit`):
 * each transistor gets width unit × (the series depth of the path through it). Returns widths by input
 * occurrence, in order.
 */
export function sizeNetwork(n: Net, unit: number): Array<{ name: string; w: number }> {
  // A device's width = unit × (length of the longest series path through it). `extra` carries the number
  // of series devices on the path outside the current sub-network.
  const out: Array<{ name: string; w: number }> = [];
  function widths(x: Net, extra: number) {
    if (x.t === 'in') {
      out.push({ name: x.name, w: unit * (1 + extra) });
      return;
    }
    if (x.t === 'par') {
      for (const p of x.parts) widths(p, extra);
      return;
    }
    const depths = x.parts.map(stackDepth);
    const sum = depths.reduce((a, b) => a + b, 0);
    x.parts.forEach((p, k) => widths(p, extra + sum - depths[k]));
  }
  widths(n, 0);
  return out;
}

/** Logical effort of each input of a static CMOS gate sized for unit-inverter drive (µn = 2µp): g = (Wn + Wp)/3. */
export function complexGateEffort(expr: string): Array<{ name: string; wn: number; wp: number; g: number }> {
  const pdn = parseExpr(expr);
  const pun = dual(pdn);
  const n = sizeNetwork(pdn, 1);
  const p = sizeNetwork(pun, 2);
  const names = Array.from(new Set(n.map((x) => x.name)));
  return names.map((name) => {
    const wn = n.filter((x) => x.name === name).reduce((a, x) => a + x.w, 0);
    const wp = p.filter((x) => x.name === name).reduce((a, x) => a + x.w, 0);
    return { name, wn, wp, g: (wn + wp) / 3 };
  });
}

/** Graph of a series–parallel network between two terminals: edges labelled by input name. */
function netGraph(n: Net): { edges: Array<{ a: number; b: number; name: string }>; nodes: number } {
  let next = 2;
  const edges: Array<{ a: number; b: number; name: string }> = [];
  function build(x: Net, a: number, b: number) {
    if (x.t === 'in') edges.push({ a, b, name: x.name });
    else if (x.t === 'par') for (const p of x.parts) build(p, a, b);
    else {
      let from = a;
      x.parts.forEach((p, k) => {
        const to = k === x.parts.length - 1 ? b : next++;
        build(p, from, to);
        from = to;
      });
    }
  }
  build(n, 0, 1);
  return { edges, nodes: next };
}

/** Is `order` (a list of input names, each once) an Euler trail of the network’s graph? */
function isEulerTrail(g: ReturnType<typeof netGraph>, order: string[]): boolean {
  const byName = new Map(g.edges.map((e) => [e.name, e]));
  if (byName.size !== g.edges.length || order.length !== g.edges.length) return false;
  function go(k: number, at: number): boolean {
    if (k === order.length) return true;
    const e = byName.get(order[k])!;
    if (e.a === at) return go(k + 1, e.b);
    if (e.b === at) return go(k + 1, e.a);
    return false;
  }
  for (let s = 0; s < g.nodes; s++) if (go(0, s)) return true;
  return false;
}

/**
 * A common Euler path through the pull-down and pull-up graphs (Kang §7.4): an input order that lets
 * both networks be laid out as one unbroken diffusion strip each. Undefined if none exists
 * (inputs must each appear once).
 */
export function commonEulerPath(expr: string): string[] | undefined {
  const pdn = parseExpr(expr);
  const gn = netGraph(pdn);
  const gp = netGraph(dual(pdn));
  const names = gn.edges.map((e) => e.name);
  if (new Set(names).size !== names.length) return undefined;
  const perms = (xs: string[]): string[][] => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map((r) => [x, ...r])));
  return perms(names).find((o) => isEulerTrail(gn, o) && isEulerTrail(gp, o));
}

/* ─── RC delay and logical effort (Weste §4.3–4.5) ─── */

/** Elmore delay of an RC ladder: Σ over nodes of C_i × (sum of resistances from the driver to node i). */
export function elmoreLadder(stages: Array<{ r: number; c: number }>): number {
  let rsum = 0;
  let t = 0;
  for (const s of stages) {
    rsum += s.r;
    t += rsum * s.c;
  }
  return t;
}

/** Weste’s logical efforts and parasitic delays (in units of τ), µn = 2µp. */
export const LE = {
  inv: { g: 1, p: 1 },
  nand: (n: number) => ({ g: (n + 2) / 3, p: n }),
  nor: (n: number) => ({ g: (2 * n + 1) / 3, p: n }),
};

/** Delay of one stage: d = g·h + p (in τ). */
export function stageDelay(g: number, h: number, p: number): number {
  return g * h + p;
}

export interface PathStage {
  g: number;
  p: number;
  /** Branching at this stage’s output: (on-path + off-path load)/(on-path load). */
  b?: number;
}

/**
 * Path logical effort (Weste §4.5): G = Πg, B = Πb, H = Cout/Cin, F = GBH, P = Σp, f̂ = F^(1/N),
 * D = N·f̂ + P; best stage count N̂ = log4 F. Stage input capacitances, working back from Cout:
 * Cin,i = g_i·(b_i·Cin,i+1 … ) / f̂.
 */
export function pathEffort(stages: PathStage[], cin: number, cout: number) {
  const G = stages.reduce((a, s) => a * s.g, 1);
  const B = stages.reduce((a, s) => a * (s.b ?? 1), 1);
  const H = cout / cin;
  const F = G * B * H;
  const P = stages.reduce((a, s) => a + s.p, 0);
  const N = stages.length;
  const f = F ** (1 / N);
  const D = N * f + P;
  const caps: number[] = new Array(N);
  let load = cout;
  for (let i = N - 1; i >= 0; i--) {
    caps[i] = (stages[i].g * load) / f;
    load = caps[i] * (i > 0 ? stages[i - 1].b ?? 1 : 1);
  }
  return { G, B, H, F, P, N, f, D, nBest: Math.log(F) / Math.log(4), caps };
}

/* ─── Dynamic logic and pass transistors (Weste §9.2.4–9.2.5) ─── */

/** Charge sharing: a precharged output (Cout at VDD) shares with an internal node Cx at 0: VDD·Cout/(Cout + Cx). */
export function chargeSharing(p: { vdd: number; cout: number; cx: number }): number {
  return (p.vdd * p.cout) / (p.cout + p.cx);
}

/** An nMOS pass transistor passes a weak 1 (VDD − Vtn) and a strong 0; a pMOS the opposite; a TG both. */
export function passLevels(p: { vdd: number; vtn: number; vtp: number }) {
  return { nHigh: p.vdd - p.vtn, nLow: 0, pHigh: p.vdd, pLow: p.vtp, tgHigh: p.vdd, tgLow: 0 };
}

/** Elmore delay of n pass gates (R each, C at each node) in series: R·C·n(n + 1)/2 — grows as n². */
export function passChainDelay(p: { r: number; c: number; n: number }): number {
  return (p.r * p.c * p.n * (p.n + 1)) / 2;
}

/* ─── Sequencing (Weste §10.2) ─── */

/** Flip-flops: setup Tc ≥ tpcq + tpd + tsetup + tskew; hold tcd ≥ thold − tccq + tskew. */
export function ffTiming(p: { tpcq: number; tccq: number; tsetup: number; thold: number; tpd: number; tcd: number; tskew?: number }) {
  const sk = p.tskew ?? 0;
  const tcMin = p.tpcq + p.tpd + p.tsetup + sk;
  const holdSlack = p.tcd - (p.thold - p.tccq + sk);
  return { tcMin, fMax: 1 / tcMin, holdSlack, holdOk: holdSlack >= 0 };
}

/** Two-phase transparent latches (50% duty, no skew): logic per cycle tpd ≤ Tc − 2tpdq; hold per phase tcd ≥ thold − tccq − tnonoverlap. */
export function latchTiming(p: { tpdq: number; tccq: number; thold: number; tnonoverlap: number; tc: number }) {
  return { maxLogic: p.tc - 2 * p.tpdq, minCdPerPhase: p.thold - p.tccq - p.tnonoverlap };
}

/** Time borrowing through a transparent latch (two-phase, 50%): up to Tc/2 − (tsetup + tnonoverlap). */
export function maxBorrow(p: { tc: number; tsetup: number; tnonoverlap: number }): number {
  return p.tc / 2 - (p.tsetup + p.tnonoverlap);
}

/* ─── Adders and multipliers (Weste §11.2, §11.9) ─── */

export function fullAdder(a: number, b: number, c: number): { s: number; cout: number; g: number; p: number } {
  return { s: a ^ b ^ c, cout: (a & b) | (a & c) | (b & c), g: a & b, p: a ^ b };
}

/** Ripple-carry delay: t = tpg + (N − 1)·tAO + txor (Weste §11.2.2). */
export function rippleDelay(p: { n: number; tpg: number; tao: number; txor: number }): number {
  return p.tpg + (p.n - 1) * p.tao + p.txor;
}

/** Carry-skip (N = n·k: k groups of n bits): t = tpg + 2(n − 1)·tAO + (k − 1)·tmux + txor. */
export function carrySkipDelay(p: { n: number; k: number; tpg: number; tao: number; tmux: number; txor: number }): number {
  return p.tpg + 2 * (p.n - 1) * p.tao + (p.k - 1) * p.tmux + p.txor;
}

/** Carry lookahead of one group: every carry from the group inputs in two levels: C(i+1) = G_i + P_i·C_i expanded. */
export function lookaheadCarries(a: number[], b: number[], c0: number): number[] {
  const c = [c0];
  for (let i = 0; i < a.length; i++) c.push((a[i] & b[i]) | ((a[i] ^ b[i]) & c[i]));
  return c;
}

/** Radix-4 Booth recoding of an N-bit two’s-complement multiplier y: digits d_i ∈ {−2,…,2}, Σ d_i·4^i = y. */
export function boothRadix4(y: number, bits: number): number[] {
  const bit = (k: number) => (k < 0 ? 0 : k >= bits ? (y < 0 ? 1 : 0) : (((y % 2 ** bits) + 2 ** bits) % 2 ** bits >> k) & 1);
  const digits: number[] = [];
  for (let i = 0; i < bits; i += 2) digits.push(-2 * bit(i + 1) + bit(i) + bit(i - 1));
  return digits;
}

/** Array multiplier (M-bit × N-bit, unsigned): M·N partial-product bits in N rows; product has M + N bits. */
export function arrayMultiplier(m: number, n: number): { ppBits: number; rows: number; productBits: number; boothRows: number } {
  return { ppBits: m * n, rows: n, productBits: m + n, boothRows: Math.floor(n / 2) + 1 };
}

/* ─── SRAM (Weste §12.2) ─── */

/**
 * Read stability of a 6T cell: the node storing 0 rises to V where the saturated access transistor
 * (bitline at VDD) equals the linear pull-down: (ka/2)(VDD − V − Vtn)² = kd[(VDD − Vtn)V − V²/2].
 */
export function sramReadBump(p: { vdd: number; vtn: number; kAccess: number; kPulldown: number }): number {
  const f = (v: number) => (p.kAccess / 2) * Math.max(0, p.vdd - v - p.vtn) ** 2 - p.kPulldown * ((p.vdd - p.vtn) * v - (v * v) / 2);
  let lo = 0;
  let hi = p.vdd - p.vtn;
  for (let i = 0; i < 100; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

/**
 * Writability: the node storing 1 is pulled toward 0 by the access transistor (bitline at 0, linear)
 * against the saturated pull-up pMOS: (kp/2)(VDD − |Vtp|)² = ka[(VDD − Vtn)V − V²/2]. The write works if
 * V ends below the other inverter’s switching threshold.
 */
export function sramWriteLevel(p: { vdd: number; vtn: number; vtp: number; kAccess: number; kPullup: number }): number {
  const a = p.vdd - p.vtn;
  const ipu = (p.kPullup / 2) * (p.vdd - p.vtp) ** 2;
  const disc = a * a - (2 * ipu) / p.kAccess;
  return disc < 0 ? NaN : a - Math.sqrt(disc);
}

/** Bitline swing time: t = Cbl·ΔV/Icell. */
export function bitlineTime(p: { cbl: number; dv: number; icell: number }): number {
  return (p.cbl * p.dv) / p.icell;
}
