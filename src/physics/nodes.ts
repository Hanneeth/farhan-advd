/**
 * DC node voltages of every multi-transistor circuit the app draws (Step A of the master method, for
 * whole circuits). Each function returns the node voltages and the current in each device; the region of
 * every device then follows from its fence (NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|), so moving a bias
 * voltage in a lab shows exactly which transistor leaves saturation first.
 *
 * λ = 0 for the DC bias (as in the notes); rO is reported with the process λ for the small-signal step.
 */
import { gmFromIdVov, rO, vovFromId } from './device';
import { steering } from './diffpair';
import type { Process } from './process';

export interface NodeDevice {
  kind: 'n' | 'p';
  vg: number;
  vs: number;
  vd: number;
  vth: number;
  id: number;
  gm: number;
  rO: number;
}

function nDev(proc: Process, id: number, wl: number, vg: number, vs: number, vd: number, lambda = proc.lambdan): NodeDevice {
  const vov = vovFromId(id, proc.kpn, wl);
  return { kind: 'n', vg, vs, vd, vth: proc.vthn, id, gm: id > 0 ? gmFromIdVov(id, vov) : 0, rO: rO(lambda, id) };
}
function pDev(proc: Process, id: number, wl: number, vg: number, vs: number, vd: number, lambda = proc.lambdap): NodeDevice {
  const vov = vovFromId(id, proc.kpp, wl);
  return { kind: 'p', vg, vs, vd, vth: proc.vthp, id, gm: id > 0 ? gmFromIdVov(id, vov) : 0, rO: rO(lambda, id) };
}

/** VGS (magnitude) that carries `id` in a device of size `wl`. */
export function vgsFor(id: number, kp: number, wl: number, vth: number): number {
  return vth + vovFromId(id, kp, wl);
}

// ─── Telescopic cascode, fully differential (Razavi Fig. 9.8, Ex 9.7 numbering) ──

export interface TelescopicNodesInput {
  proc: Process;
  iss: number;
  wlN: number; // M1–M4
  wlP: number; // M5–M8
  wl9: number; // tail
  vinCm: number;
  vb1: number; // NMOS cascode gates
  vb2: number; // PMOS cascode gates
  /** Output CM, set in practice by CMFB. */
  vout: number;
  /** Differential input (small), splits the current by the steering law. */
  vd?: number;
}

export function telescopicNodes(p: TelescopicNodesInput) {
  const { proc } = p;
  const id = p.iss / 2;
  const vgsN = vgsFor(id, proc.kpn, p.wlN, proc.vthn);
  const vgsP = vgsFor(id, proc.kpp, p.wlP, proc.vthp);
  const vov9 = vovFromId(p.iss, proc.kpn, p.wl9);
  const vbTail = proc.vthn + vov9;
  const vP = p.vinCm - vgsN;
  const vX = p.vb1 - vgsN; // sources of M3, M4
  const vY = p.vb2 + vgsP; // sources of M5, M6 (PMOS: VS = VG + |VGS|)
  const vb3 = proc.vdd - vgsP; // gate of M7, M8 for current ID
  const st = steering({ kp: proc.kpn, wl: p.wlN, iss: p.iss, dvin: p.vd ?? 0 });
  const vo1 = p.vout, vo2 = p.vout;
  return {
    vP,
    vX,
    vY,
    vb3,
    vbTail,
    devices: {
      m1: nDev(proc, st.id1, p.wlN, p.vinCm + (p.vd ?? 0) / 2, vP, vX),
      m2: nDev(proc, st.id2, p.wlN, p.vinCm - (p.vd ?? 0) / 2, vP, vX),
      m3: nDev(proc, st.id1, p.wlN, p.vb1, vX, vo1),
      m4: nDev(proc, st.id2, p.wlN, p.vb1, vX, vo2),
      m5: pDev(proc, id, p.wlP, p.vb2, vY, vo1),
      m6: pDev(proc, id, p.wlP, p.vb2, vY, vo2),
      m7: pDev(proc, id, p.wlP, vb3, proc.vdd, vY),
      m8: pDev(proc, id, p.wlP, vb3, proc.vdd, vY),
      m9: nDev(proc, p.iss, p.wl9, vbTail, 0, vP),
    },
  };
}

// ─── Five-transistor OTA (M1,2 NMOS input, M3,4 PMOS mirror, M5 tail, M6 tail bias diode) ──

export interface FiveTNodesInput {
  proc: Process;
  iss: number;
  wl12: number;
  wl34: number;
  wlTail: number;
  vinCm: number;
  /** Differential input vd = Vin1 − Vin2 (Vin1 on M1's gate, the side with the diode). */
  vd?: number;
}

export function fiveTNodes(p: FiveTNodesInput) {
  const { proc } = p;
  const vov5 = vovFromId(p.iss, proc.kpn, p.wlTail);
  const vbTail = proc.vthn + vov5;
  const st = steering({ kp: proc.kpn, wl: p.wl12, iss: p.iss, dvin: p.vd ?? 0 });
  const vin1 = p.vinCm + (p.vd ?? 0) / 2;
  // M1 sets the tail node: VP = Vin1 − VGS1(id1)
  const vP = st.id1 > 0 ? vin1 - vgsFor(st.id1, proc.kpn, p.wl12, proc.vthn) : p.vinCm - (p.vd ?? 0) / 2 - vgsFor(st.id2, proc.kpn, p.wl12, proc.vthn);
  const vgs3 = vgsFor(Math.max(st.id1, 1e-15), proc.kpp, p.wl34, proc.vthp);
  const vD1 = proc.vdd - vgs3; // diode node
  // Output: with vd = 0 (balanced) it equals the diode node. Otherwise it is set by the gain: clamp to the rails' fences.
  const id = p.iss / 2;
  const nBal = nDev(proc, id, p.wl12, p.vinCm, vP, vD1);
  const pBal = pDev(proc, id, p.wl34, vD1, proc.vdd, vD1);
  const av = nBal.gm * (1 / (1 / nBal.rO + 1 / pBal.rO));
  const lo = vP + 0; // cannot fall below the tail node
  const hi = proc.vdd;
  const vOut = Math.min(hi, Math.max(lo, vD1 + (Number.isFinite(av) ? av : 1e6) * (p.vd ?? 0)));
  return {
    vP,
    vD1,
    vOut,
    vbTail,
    vov5,
    av,
    devices: {
      m1: nDev(proc, st.id1, p.wl12, vin1, vP, vD1),
      m2: nDev(proc, st.id2, p.wl12, p.vinCm - (p.vd ?? 0) / 2, vP, vOut),
      m3: pDev(proc, st.id1, p.wl34, vD1, proc.vdd, vD1),
      m4: pDev(proc, st.id1, p.wl34, vD1, proc.vdd, vOut),
      m5: nDev(proc, p.iss, p.wlTail, vbTail, 0, vP),
      m6: nDev(proc, p.iss, p.wlTail, vbTail, 0, vbTail),
    },
  };
}

// ─── Resistively loaded differential pair (Tutorial 1 style) ────────────────

export interface DiffPairNodesInput {
  kp: number;
  wl: number;
  vth: number;
  lambda?: number;
  vdd: number;
  iss: number;
  rd: number;
  vin1: number;
  vin2: number;
  /** Bottom of the tail source (VSS for a split supply). */
  vss?: number;
  /** Tail device size; when given the tail is an NMOS (M3) whose fence is checked too. */
  wlTail?: number;
}

export function diffPairNodes(p: DiffPairNodesInput) {
  const st = steering({ kp: p.kp, wl: p.wl, iss: p.iss, dvin: p.vin1 - p.vin2 });
  const vss = p.vss ?? 0;
  const on1 = st.id1 >= st.id2;
  const vP = on1 ? p.vin1 - (p.vth + vovFromId(st.id1, p.kp, p.wl)) : p.vin2 - (p.vth + vovFromId(st.id2, p.kp, p.wl));
  const vD1 = p.vdd - st.id1 * p.rd;
  const vD2 = p.vdd - st.id2 * p.rd;
  const lam = p.lambda ?? 0;
  const mk = (id: number, vg: number, vd: number): NodeDevice => ({ kind: 'n', vg, vs: vP, vd, vth: p.vth, id, gm: id > 0 ? Math.sqrt(2 * p.kp * p.wl * id) : 0, rO: rO(lam, id) });
  const devices: Record<string, NodeDevice> = { m1: mk(st.id1, p.vin1, vD1), m2: mk(st.id2, p.vin2, vD2) };
  if (p.wlTail) {
    const vov3 = vovFromId(p.iss, p.kp, p.wlTail);
    devices.m3 = { kind: 'n', vg: vss + p.vth + vov3, vs: vss, vd: vP, vth: p.vth, id: p.iss, gm: gmFromIdVov(p.iss, vov3), rO: rO(lam, p.iss) };
  }
  return { ...st, vP, vD1, vD2, vout: vD1 - vD2, devices };
}

// ─── Cascode amplifier (M1 input, M2 cascode, optional PMOS cascode load M3/M4) ──

export interface CascodeNodesInput {
  proc: Process;
  id: number;
  wl1: number;
  wl2: number;
  vb1: number; // gate of M2
  vout: number;
  /** PMOS load: 'current' = M3 source only; 'cascode' = M3 cascode + M4 source; 'resistor' = RD. */
  load: 'resistor' | 'current' | 'cascode';
  wlP?: number;
  vb2?: number; // gate of the PMOS cascode (M3 when load = cascode)
}

export function cascodeNodes(p: CascodeNodesInput) {
  const { proc } = p;
  const vgs1 = vgsFor(p.id, proc.kpn, p.wl1, proc.vthn);
  const vgs2 = vgsFor(p.id, proc.kpn, p.wl2, proc.vthn);
  const vX = p.vb1 - vgs2;
  const devices: Record<string, NodeDevice> = {
    m1: nDev(proc, p.id, p.wl1, vgs1, 0, vX),
    m2: nDev(proc, p.id, p.wl2, p.vb1, vX, p.vout),
  };
  let vY: number | undefined;
  if (p.load !== 'resistor') {
    const wlP = p.wlP ?? p.wl2;
    const vgsP = vgsFor(p.id, proc.kpp, wlP, proc.vthp);
    if (p.load === 'current') {
      devices.m3 = pDev(proc, p.id, wlP, proc.vdd - vgsP, proc.vdd, p.vout);
    } else {
      const vb2 = p.vb2 ?? proc.vdd - (vgsP - proc.vthp) - vgsP; // M4 at its edge: VY = VDD − |Vov4|
      vY = vb2 + vgsP;
      devices.m3 = pDev(proc, p.id, wlP, vb2, vY, p.vout);
      devices.m4 = pDev(proc, p.id, wlP, proc.vdd - vgsP, proc.vdd, vY);
    }
  }
  return { vgs1, vX, vY, devices };
}

// ─── Folded cascode, PMOS input, fully differential (Razavi Fig. 9.15 numbering) ──
// M1,2 PMOS input (tail M11 from VDD), M3,4 NMOS cascodes, M5,6 NMOS sources (ISS/2 + I),
// M7,8 PMOS cascodes, M9,10 PMOS sources (I).

export interface FoldedNodesInput {
  proc: Process;
  iss: number;
  i: number;
  wl1: number;
  wl3: number;
  wl5: number;
  wl7: number;
  wl9: number;
  wl11: number;
  vinCm: number;
  vout: number;
  /** NMOS cascode gate; default puts M5 exactly at its edge (VX = Vov5). */
  vbn?: number;
  /** PMOS cascode gate; default puts M9 exactly at its edge. */
  vbp?: number;
}

export function foldedNodes(p: FoldedNodesInput) {
  const { proc } = p;
  const id1 = p.iss / 2, id5 = p.iss / 2 + p.i;
  const vgs1 = vgsFor(id1, proc.kpp, p.wl1, proc.vthp);
  const vgs3 = vgsFor(p.i, proc.kpn, p.wl3, proc.vthn);
  const vgs5 = vgsFor(id5, proc.kpn, p.wl5, proc.vthn);
  const vgs7 = vgsFor(p.i, proc.kpp, p.wl7, proc.vthp);
  const vgs9 = vgsFor(p.i, proc.kpp, p.wl9, proc.vthp);
  const vgs11 = vgsFor(p.iss, proc.kpp, p.wl11, proc.vthp);
  const vov5 = vgs5 - proc.vthn, vov9 = vgs9 - proc.vthp;
  const vbn = p.vbn ?? vov5 + vgs3;
  const vbp = p.vbp ?? proc.vdd - vov9 - vgs7;
  const vX = vbn - vgs3;
  const vT = vbp + vgs7; // drain of M9 = source of M7
  const vP = p.vinCm + vgs1;
  return {
    vX,
    vT,
    vP,
    vbn,
    vbp,
    vb5: vgs5,
    vb9: proc.vdd - vgs9,
    vb11: proc.vdd - vgs11,
    devices: {
      m1: pDev(proc, id1, p.wl1, p.vinCm, vP, vX),
      m2: pDev(proc, id1, p.wl1, p.vinCm, vP, vX),
      m3: nDev(proc, p.i, p.wl3, vbn, vX, p.vout),
      m4: nDev(proc, p.i, p.wl3, vbn, vX, p.vout),
      m5: nDev(proc, id5, p.wl5, vgs5, 0, vX),
      m6: nDev(proc, id5, p.wl5, vgs5, 0, vX),
      m7: pDev(proc, p.i, p.wl7, vbp, vT, p.vout),
      m8: pDev(proc, p.i, p.wl7, vbp, vT, p.vout),
      m9: pDev(proc, p.i, p.wl9, proc.vdd - vgs9, proc.vdd, vT),
      m10: pDev(proc, p.i, p.wl9, proc.vdd - vgs9, proc.vdd, vT),
      m11: pDev(proc, p.iss, p.wl11, proc.vdd - vgs11, proc.vdd, vP),
    },
  };
}

// ─── Single-ended telescopic with a cascode PMOS mirror (Razavi Fig. 9.9 / 9.21b) ──
// M1,2 input; M3,4 NMOS cascodes (Vb1); M5,6 PMOS cascodes; M7,8 PMOS sources.
// bias 'diodes' (Fig 9.9): M7 and M5 diode-connected on the left.
// bias 'vb2' (Fig 9.21b): M5,6 gates at Vb2; M7,8 gates tied to the left output node D3.

export interface MirrorTeleInput {
  proc: Process;
  iss: number;
  wlN: number;
  wlP: number;
  vinCm: number;
  vb1: number;
  vout: number;
  bias: 'diodes' | 'vb2';
  vb2?: number;
  /** Unity-gain buffer: M2's gate is Vout. */
  buffer?: boolean;
  /** Tail device size (default: sized for a 0.2 V overdrive). */
  wl9?: number;
}

export function mirrorTeleNodes(p: MirrorTeleInput) {
  const { proc } = p;
  const id = p.iss / 2;
  const vgsN = vgsFor(id, proc.kpn, p.wlN, proc.vthn);
  const vgsP = vgsFor(id, proc.kpp, p.wlP, proc.vthp);
  const wl9 = p.wl9 ?? (2 * p.iss) / (proc.kpn * 0.2 * 0.2);
  const vgs9 = vgsFor(p.iss, proc.kpn, wl9, proc.vthn);
  const vin2 = p.buffer ? p.vout : p.vinCm;
  const vinC = p.buffer ? p.vout : p.vinCm;
  const vP = vinC - vgsN;
  const vX = p.vb1 - vgsN; // sources of M3, M4
  let vD3: number, vA: number, vg56: number, vg78: number;
  if (p.bias === 'diodes') {
    vA = proc.vdd - vgsP; // M7 diode: drain = gate
    vD3 = vA - vgsP; // M5 diode
    vg56 = vD3;
    vg78 = vA;
  } else {
    vD3 = proc.vdd - vgsP; // M7,8 gates on D3 carry ID
    vg78 = vD3;
    vg56 = p.vb2 ?? proc.vdd - (vgsP - proc.vthp) - vgsP;
    vA = vg56 + vgsP; // sources of M5, M6
  }
  return {
    vP,
    vX,
    vD3,
    vA,
    vg56,
    vg78,
    vb9: vgs9,
    devices: {
      m1: nDev(proc, id, p.wlN, vinC, vP, vX),
      m2: nDev(proc, id, p.wlN, vin2, vP, vX),
      m3: nDev(proc, id, p.wlN, p.vb1, vX, vD3),
      m4: nDev(proc, id, p.wlN, p.vb1, vX, p.vout),
      m5: pDev(proc, id, p.wlP, vg56, vA, vD3),
      m6: pDev(proc, id, p.wlP, vg56, vA, p.vout),
      m7: pDev(proc, id, p.wlP, vg78, proc.vdd, vA),
      m8: pDev(proc, id, p.wlP, vg78, proc.vdd, vA),
      m9: nDev(proc, p.iss, wl9, vgs9, 0, vP),
    },
  };
}

// ─── Two-stage op amp (Razavi Fig. 9.23 numbering) ─────────────────────────
// Stage 1: M1,2 input, M3,4 PMOS loads (gate Vb1), tail ISS. Stage 2: M5,6 PMOS CS devices driven by
// X, Y, loaded by NMOS current sources M7,8 (gate Vb2).

export interface TwoStageInput {
  proc: Process;
  iss: number;
  id2: number;
  wl: number;
  vinCm: number;
  vout: number;
  wl9?: number;
}

export function twoStageNodes(p: TwoStageInput) {
  const { proc } = p;
  const id1 = p.iss / 2;
  const vgs5 = vgsFor(p.id2, proc.kpp, p.wl, proc.vthp);
  const vXY = proc.vdd - vgs5; // X, Y must sit here for M5,6 to carry id2
  const vgs1 = vgsFor(id1, proc.kpn, p.wl, proc.vthn);
  const vgs3 = vgsFor(id1, proc.kpp, p.wl, proc.vthp);
  const vgs7 = vgsFor(p.id2, proc.kpn, p.wl, proc.vthn);
  const wl9 = p.wl9 ?? (2 * p.iss) / (proc.kpn * 0.2 * 0.2);
  const vgs9 = vgsFor(p.iss, proc.kpn, wl9, proc.vthn);
  const vP = p.vinCm - vgs1;
  return {
    vXY,
    vP,
    vb1: proc.vdd - vgs3,
    vb2: vgs7,
    devices: {
      m1: nDev(proc, id1, p.wl, p.vinCm, vP, vXY),
      m2: nDev(proc, id1, p.wl, p.vinCm, vP, vXY),
      m3: pDev(proc, id1, p.wl, proc.vdd - vgs3, proc.vdd, vXY),
      m4: pDev(proc, id1, p.wl, proc.vdd - vgs3, proc.vdd, vXY),
      m5: pDev(proc, p.id2, p.wl, vXY, proc.vdd, p.vout),
      m6: pDev(proc, p.id2, p.wl, vXY, proc.vdd, p.vout),
      m7: nDev(proc, p.id2, p.wl, vgs7, 0, p.vout),
      m8: nDev(proc, p.id2, p.wl, vgs7, 0, p.vout),
      m9: nDev(proc, p.iss, wl9, vgs9, 0, vP),
    },
  };
}
