/**
 * A tiny DC circuit simulator for the labs: nodal analysis with the course's square-law MOSFET (cut-off,
 * triode, saturation, channel-length modulation λ; γ = 0), solved by Newton–Raphson with gmin stepping.
 *
 * Nothing is assumed about regions: a transistor that runs out of headroom really enters triode, its current
 * really changes, and the gain really collapses, exactly as the hand theory predicts at the fences.
 *
 * Model (the notes' square law):
 *   Vov = VGS − Vth;  triode (VDS < Vov): ID = µCox(W/L)[Vov·VDS − VDS²/2]
 *   saturation:      ID = ½µCox(W/L)Vov²·e^{λ(VDS − Vov)}  (so rO = 1/(λ·ID) exactly)
 * A 5 mV soft knee at Vov = 0 keeps Newton smooth; above ~30 mV of overdrive it is the plain square law.
 */

export type MosKind = 'n' | 'p';

export interface Mos {
  type: 'mos';
  name: string;
  kind: MosKind;
  d: string;
  g: string;
  s: string;
  kp: number;
  wl: number;
  vth: number;
  lambda: number;
}
export interface Res {
  type: 'r';
  name: string;
  a: string;
  b: string;
  r: number;
}
/** Ideal current source: current i flows from node a, through the source, into node b. */
export interface Isrc {
  type: 'i';
  name: string;
  a: string;
  b: string;
  i: number;
}
export type Element = Mos | Res | Isrc;

export interface Netlist {
  elements: Element[];
  /** Nodes held at a fixed voltage (supplies, inputs, bias voltages). 'gnd' is always 0. */
  fixed: Record<string, number>;
  /**
   * Extra equations that replace KCL at a node: the node becomes whatever makes `residual` zero
   * (e.g. an ideal CMFB loop that sets a bias so the output common mode equals a target).
   */
  constraints?: Array<{ node: string; residual: (v: Record<string, number>) => number }>;
}

export type SimRegion = 'off' | 'triode' | 'saturation';

export interface MosOp {
  name: string;
  kind: MosKind;
  vg: number;
  vs: number;
  vd: number;
  vth: number;
  id: number;
  vov: number;
  vds: number;
  region: SimRegion;
  gm: number;
  rO: number;
}

export interface OpPoint {
  v: Record<string, number>;
  mos: Record<string, MosOp>;
  converged: boolean;
  iterations: number;
}

const KNEE = 0.005;
/** The turn-on knee in use. The solver starts with a soft knee (every device conducts a little) and tightens it. */
let knee = KNEE;
const softVov = (x: number) => (x > 20 * knee ? x : knee * Math.log1p(Math.exp(x / knee)));

/** Drain current flowing from drain to source (NMOS) for the given terminal voltages; sign handles reversal. */
export function mosCurrent(m: Mos, vd: number, vg: number, vs: number): number {
  // Work in "NMOS-like" magnitudes: for PMOS flip every voltage.
  const sgn = m.kind === 'n' ? 1 : -1;
  let d = sgn * vd, s = sgn * vs;
  const g = sgn * vg;
  let dir = 1;
  if (d < s) {
    [d, s] = [s, d];
    dir = -1;
  }
  const vgs = g - s, vds = d - s;
  const vov = softVov(vgs - m.vth);
  const k = m.kp * m.wl;
  // Saturation: ½k·Vov²·e^{λ(VDS − Vov)}. It equals the plain square law at the edge (VDS = Vov), so the DC
  // bias matches the notes' λ = 0 analysis there, and its slope gives rO = 1/(λ·ID) EXACTLY — the course's
  // formula. (SPICE's (1 + λVDS) form makes rO = (1 + λVDS)/(λID), which disagrees with the notes by
  // 10–30% per device and squares that error in a cascode.)
  const id = vds < vov ? k * (vov * vds - (vds * vds) / 2) : 0.5 * k * vov * vov * Math.exp(m.lambda * (vds - vov));
  // Current leaves the drain node (NMOS) / enters the drain node (PMOS).
  return sgn * dir * id;
}

function opOf(m: Mos, v: Record<string, number>): MosOp {
  const vd = v[m.d], vg = v[m.g], vs = v[m.s];
  const sgn = m.kind === 'n' ? 1 : -1;
  const vgs = sgn * (vg - vs), vds = sgn * (vd - vs);
  const vov = vgs - m.vth;
  const id = Math.abs(mosCurrent(m, vd, vg, vs));
  const region: SimRegion = vov <= 0.002 ? 'off' : vds < vov - 1e-6 ? 'triode' : 'saturation';
  // Small-signal parameters by finite differences of the same model (what a simulator reports).
  const h = 1e-6;
  const gm = Math.abs(mosCurrent(m, vd, vg + sgn * h, vs) - mosCurrent(m, vd, vg, vs)) / h;
  const gds = Math.abs(mosCurrent(m, vd + sgn * h, vg, vs) - mosCurrent(m, vd, vg, vs)) / h;
  return { name: m.name, kind: m.kind, vg, vs, vd, vth: m.vth, id, vov, vds, region, gm, rO: gds > 0 ? 1 / gds : Infinity };
}

function solveLinear(a: number[][], b: number[]): number[] | null {
  const n = b.length;
  const m = a.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
    if (Math.abs(m[piv][c]) < 1e-30) return null;
    [m[c], m[piv]] = [m[piv], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      if (f === 0) continue;
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

/**
 * Solve the DC operating point. `guess` (node → V) speeds up sweeps: pass the previous solution.
 */
export function solveOp(net: Netlist, guess: Record<string, number> = {}): OpPoint {
  const fixed: Record<string, number> = { gnd: 0, ...net.fixed };
  const nodes = new Set<string>();
  for (const e of net.elements) {
    if (e.type === 'mos') [e.d, e.g, e.s].forEach((x) => nodes.add(x));
    else [e.a, e.b].forEach((x) => nodes.add(x));
  }
  for (const c of net.constraints ?? []) nodes.add(c.node);
  const free = [...nodes].filter((x) => !(x in fixed));
  const idx: Record<string, number> = Object.fromEntries(free.map((x, i) => [x, i]));
  const cons: Record<string, (v: Record<string, number>) => number> = Object.fromEntries((net.constraints ?? []).map((c) => [c.node, c.residual]));
  const vmax = Math.max(1, ...Object.values(fixed).map(Math.abs));
  const v: Record<string, number> = { ...fixed };
  for (const x of free) v[x] = guess[x] ?? vmax / 2;

  const residual = (vv: Record<string, number>, gmin: number): number[] => {
    const f = free.map((x) => (cons[x] ? 0 : gmin * (vv[x] - vmax / 2)));
    const leave = (node: string, i: number) => {
      const k = idx[node];
      if (k !== undefined && !cons[node]) f[k] += i;
    };
    for (const e of net.elements) {
      if (e.type === 'mos') {
        const i = mosCurrent(e, vv[e.d], vv[e.g], vv[e.s]); // drain → source
        leave(e.d, i);
        leave(e.s, -i);
      } else if (e.type === 'r') {
        const i = (vv[e.a] - vv[e.b]) / e.r;
        leave(e.a, i);
        leave(e.b, -i);
      } else {
        leave(e.a, e.i);
        leave(e.b, -e.i);
      }
    }
    // Constraint residuals are in volts; scale them like a 1 mS conductance so they sit with the KCL rows.
    for (const x of free) if (cons[x]) f[idx[x]] = 1e-3 * cons[x](vv);
    return f;
  };

  let total = 0;
  let ok = false;
  const newton = (gmin: number, maxIt: number): boolean => {
    for (let it = 0; it < maxIt; it++) {
      total++;
      const f0 = residual(v, gmin);
      const norm = Math.max(...f0.map(Math.abs), 0);
      if (norm < 1e-13 && it > 0) return true;
      const jac: number[][] = free.map(() => new Array(free.length).fill(0));
      for (let j = 0; j < free.length; j++) {
        const x = free[j];
        const h = 1e-7 * Math.max(1, Math.abs(v[x]));
        const keep = v[x];
        v[x] = keep + h;
        const f1 = residual(v, gmin);
        v[x] = keep;
        for (let i = 0; i < free.length; i++) jac[i][j] = (f1[i] - f0[i]) / h;
      }
      let dx = solveLinear(jac, f0.map((y) => -y));
      if (!dx) {
        // A row with zero slope (e.g. a branch still cut off): add a tiny diagonal and try again.
        for (let i = 0; i < free.length; i++) jac[i][i] += 1e-9;
        dx = solveLinear(jac, f0.map((y) => -y));
      }
      if (!dx) return false;
      const big = Math.max(...dx.map(Math.abs), 0);
      const scale = big > 0.2 ? 0.2 / big : 1; // limit each Newton step to 0.2 V
      for (let j = 0; j < free.length; j++) v[free[j]] += scale * dx[j];
      if (big * scale < 1e-10) return true;
    }
    return false;
  };
  const start = { ...v };
  knee = KNEE;
  // 1) Straight Newton from the guess (fast path for sweeps, where the guess is the previous point).
  ok = Object.keys(guess).length > 0 && newton(1e-12, 60);
  if (!ok) {
    // 2) Homotopy: soft knee + large gmin first, then tighten both, re-using each solution.
    Object.assign(v, start);
    for (const [k, gmin] of [
      [0.3, 1e-4],
      [0.1, 1e-6],
      [0.03, 1e-8],
      [0.01, 1e-10],
      [KNEE, 1e-12],
    ] as const) {
      knee = k;
      ok = newton(gmin, 150);
    }
  }
  knee = KNEE;
  const mos: Record<string, MosOp> = {};
  for (const e of net.elements) if (e.type === 'mos') mos[e.name] = opOf(e, v);
  return { v, mos, converged: ok, iterations: total };
}

/**
 * Small-signal gain d(out)/d(in) by re-solving with the input nudged by ±h (what a simulator's
 * .TF does). `nudge` returns a copy of the netlist with the input moved.
 */
export function smallSignalGain(net: Netlist, op: OpPoint, out: string, nudge: (n: Netlist, dv: number) => Netlist, h = 1e-4): number {
  const up = solveOp(nudge(net, h), op.v);
  const dn = solveOp(nudge(net, -h), op.v);
  return (up.v[out] - dn.v[out]) / (2 * h);
}

/**
 * A bias that a real design would trim: solve for the gate voltage that makes `m` carry `target`
 * (residual in "volts" = mA of error, which the solver scales back to amps).
 */
function biasFor(m: Mos, target: number): (v: Record<string, number>) => number {
  return (v) => (Math.abs(mosCurrent(m, v[m.d], v[m.g], v[m.s])) - target) * 1e3;
}

const N = (name: string, d: string, g: string, s: string, kp: number, wl: number, vth: number, lambda: number): Mos => ({ type: 'mos', name, kind: 'n', d, g, s, kp, wl, vth, lambda });
const P = (name: string, d: string, g: string, s: string, kp: number, wl: number, vth: number, lambda: number): Mos => ({ type: 'mos', name, kind: 'p', d, g, s, kp, wl, vth, lambda });

// ─── Circuits used by the labs ─────────────────────────────────────────────

export interface ProcLike {
  kpn: number;
  kpp: number;
  vthn: number;
  vthp: number;
  lambdan: number;
  lambdap: number;
  vdd: number;
}

/** Five-transistor OTA with a tail mirror (M6 diode fed by I1); optional unity-gain feedback (Vout → M2 gate). */
export function otaNetlist(p: { proc: ProcLike; i1: number; wl12: number; wl34: number; wl5: number; wl6?: number; vin1: number; vin2: number; buffer?: boolean }): Netlist {
  const { proc } = p;
  const g2 = p.buffer ? 'out' : 'in2';
  return {
    elements: [
      { type: 'i', name: 'I1', a: 'vdd', b: 'nb', i: p.i1 },
      N('M6', 'nb', 'nb', 'gnd', proc.kpn, p.wl6 ?? p.wl5, proc.vthn, proc.lambdan),
      N('M5', 'p', 'nb', 'gnd', proc.kpn, p.wl5, proc.vthn, proc.lambdan),
      N('M1', 'x', 'in1', 'p', proc.kpn, p.wl12, proc.vthn, proc.lambdan),
      N('M2', 'out', g2, 'p', proc.kpn, p.wl12, proc.vthn, proc.lambdan),
      P('M3', 'x', 'x', 'vdd', proc.kpp, p.wl34, proc.vthp, proc.lambdap),
      P('M4', 'out', 'x', 'vdd', proc.kpp, p.wl34, proc.vthp, proc.lambdap),
    ],
    fixed: p.buffer ? { vdd: proc.vdd, in1: p.vin1 } : { vdd: proc.vdd, in1: p.vin1, in2: p.vin2 },
  };
}

/** NMOS differential pair with RD / PMOS-diode / PMOS-current-source loads and a tail (ideal, RSS, or NMOS at gate vbTail). */
export function pairNetlist(p: {
  kp: number;
  wl: number;
  vth: number;
  lambda: number;
  vdd: number;
  vin1: number;
  vin2: number;
  load: 'rd' | 'diode' | 'current';
  rd: number;
  kpp: number;
  wlp: number;
  vthp: number;
  lambdap: number;
  vbp?: number;
  tail: 'ideal' | 'rss' | 'mos';
  iss: number;
  rss?: number;
  wlTail?: number;
  vbTail?: number;
}): Netlist {
  const els: Element[] = [N('M1', 'd1', 'in1', 'p', p.kp, p.wl, p.vth, p.lambda), N('M2', 'd2', 'in2', 'p', p.kp, p.wl, p.vth, p.lambda)];
  if (p.load === 'rd') els.push({ type: 'r', name: 'RD1', a: 'vdd', b: 'd1', r: p.rd }, { type: 'r', name: 'RD2', a: 'vdd', b: 'd2', r: p.rd });
  else if (p.load === 'diode') els.push(P('M3', 'd1', 'd1', 'vdd', p.kpp, p.wlp, p.vthp, p.lambdap), P('M4', 'd2', 'd2', 'vdd', p.kpp, p.wlp, p.vthp, p.lambdap));
  else els.push(P('M3', 'd1', 'vbp', 'vdd', p.kpp, p.wlp, p.vthp, p.lambdap), P('M4', 'd2', 'vbp', 'vdd', p.kpp, p.wlp, p.vthp, p.lambdap));
  if (p.tail === 'ideal') els.push({ type: 'i', name: 'ISS', a: 'p', b: 'gnd', i: p.iss });
  else if (p.tail === 'rss') els.push({ type: 'r', name: 'RSS', a: 'p', b: 'gnd', r: p.rss! });
  else els.push(N('M5', 'p', 'vbt', 'gnd', p.kp, p.wlTail!, p.vth, p.lambda));
  const fixed: Record<string, number> = { vdd: p.vdd, in1: p.vin1, in2: p.vin2 };
  if (p.load === 'current') fixed.vbp = p.vbp!;
  if (p.tail === 'mos') fixed.vbt = p.vbTail!;
  return { elements: els, fixed };
}

/**
 * Fully differential telescopic cascode (Razavi Fig 9.8 numbering: M1, M2 input; M3, M4 NMOS cascodes;
 * M5, M6 PMOS cascodes; M7, M8 PMOS sources; M9 tail) with an ideal CMFB that adjusts the gate of M7, M8
 * until the output common mode equals `voutCm`.
 */
export function telescopicNetlist(p: { proc: ProcLike; wlN: number; wlP: number; wl9: number; vbTail: number; vinCm: number; vd: number; vb1: number; vb2: number; voutCm: number; lambdaP?: number; iss?: number }): Netlist {
  const { proc } = p;
  const lp = p.lambdaP ?? proc.lambdap;
  const m9 = N('M9', 'p', 'vbt', 'gnd', proc.kpn, p.wl9, proc.vthn, proc.lambdan);
  const net: Netlist = {
    elements: [
      m9,
      N('M1', 'x1', 'in1', 'p', proc.kpn, p.wlN, proc.vthn, proc.lambdan),
      N('M2', 'x2', 'in2', 'p', proc.kpn, p.wlN, proc.vthn, proc.lambdan),
      N('M3', 'o1', 'vb1', 'x1', proc.kpn, p.wlN, proc.vthn, proc.lambdan),
      N('M4', 'o2', 'vb1', 'x2', proc.kpn, p.wlN, proc.vthn, proc.lambdan),
      P('M5', 'o1', 'vb2', 'y1', proc.kpp, p.wlP, proc.vthp, lp),
      P('M6', 'o2', 'vb2', 'y2', proc.kpp, p.wlP, proc.vthp, lp),
      P('M7', 'y1', 'vb3', 'vdd', proc.kpp, p.wlP, proc.vthp, lp),
      P('M8', 'y2', 'vb3', 'vdd', proc.kpp, p.wlP, proc.vthp, lp),
    ],
    fixed: { vdd: proc.vdd, vbt: p.vbTail, in1: p.vinCm + p.vd / 2, in2: p.vinCm - p.vd / 2, vb1: p.vb1, vb2: p.vb2 },
    constraints: [{ node: 'vb3', residual: (v) => (v.o1 + v.o2) / 2 - p.voutCm }],
  };
  // With a design tail current given, the tail gate is trimmed so M9 carries exactly ISS (as a bias generator would).
  if (p.iss) {
    delete net.fixed.vbt;
    net.constraints!.push({ node: 'vbt', residual: biasFor(m9, p.iss) });
  }
  return net;
}

/** Sweep helper: solve for each x, re-using the previous solution (continuation). */
export function sweep(make: (x: number) => Netlist, xs: number[], start: Record<string, number> = {}): OpPoint[] {
  const out: OpPoint[] = [];
  let g = start;
  for (const x of xs) {
    const op = solveOp(make(x), g);
    out.push(op);
    g = op.v;
  }
  return out;
}

/**
 * Fully differential PMOS-input folded cascode (Razavi Fig 9.18 numbering: M1, M2 input; M11 tail; M5, M6 NMOS
 * sources; M3, M4 NMOS cascodes; M7, M8 PMOS cascodes; M9, M10 PMOS sources) with an ideal CMFB on the gates of
 * M9, M10 holding the output common mode at `voutCm`.
 */
export function foldedNetlist(p: { proc: ProcLike; wl1: number; wl3: number; wl5: number; wl7: number; wl9: number; wl11: number; vb11: number; vb5: number; vbn: number; vbp: number; vinCm: number; vd: number; voutCm: number; iss?: number; i?: number }): Netlist {
  const { proc } = p;
  const m11 = P('M11', 'p', 'vb11', 'vdd', proc.kpp, p.wl11, proc.vthp, proc.lambdap);
  const m5 = N('M5', 'x1', 'vb5', 'gnd', proc.kpn, p.wl5, proc.vthn, proc.lambdan);
  const net: Netlist = {
    elements: [
      m11,
      P('M1', 'x1', 'in1', 'p', proc.kpp, p.wl1, proc.vthp, proc.lambdap),
      P('M2', 'x2', 'in2', 'p', proc.kpp, p.wl1, proc.vthp, proc.lambdap),
      m5,
      N('M6', 'x2', 'vb5', 'gnd', proc.kpn, p.wl5, proc.vthn, proc.lambdan),
      N('M3', 'o1', 'vbn', 'x1', proc.kpn, p.wl3, proc.vthn, proc.lambdan),
      N('M4', 'o2', 'vbn', 'x2', proc.kpn, p.wl3, proc.vthn, proc.lambdan),
      P('M7', 'o1', 'vbp', 't1', proc.kpp, p.wl7, proc.vthp, proc.lambdap),
      P('M8', 'o2', 'vbp', 't2', proc.kpp, p.wl7, proc.vthp, proc.lambdap),
      P('M9', 't1', 'vb9', 'vdd', proc.kpp, p.wl9, proc.vthp, proc.lambdap),
      P('M10', 't2', 'vb9', 'vdd', proc.kpp, p.wl9, proc.vthp, proc.lambdap),
    ],
    fixed: { vdd: proc.vdd, vb11: p.vb11, vb5: p.vb5, vbn: p.vbn, vbp: p.vbp, in1: p.vinCm + p.vd / 2, in2: p.vinCm - p.vd / 2 },
    constraints: [{ node: 'vb9', residual: (v) => (v.o1 + v.o2) / 2 - p.voutCm }],
  };
  // Design currents given: trim the tail and the bottom sources to carry exactly ISS and ISS/2 + I.
  if (p.iss && p.i) {
    delete net.fixed.vb11;
    delete net.fixed.vb5;
    net.constraints!.push({ node: 'vb11', residual: biasFor(m11, p.iss) }, { node: 'vb5', residual: biasFor(m5, p.iss / 2 + p.i) });
  }
  return net;
}
