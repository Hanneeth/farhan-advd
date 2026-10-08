/**
 * Milestone 4 figures (L1–L5): the folded cascode (PMOS input, fully differential), the single-ended
 * telescopic with a cascode PMOS mirror (Fig 9.9 / 9.21b, optional unity-gain buffer), the two-stage op
 * amp (Fig 9.23) and the non-inverting feedback amplifier. All transistors are live via <Schematic>.
 */
import type { ReactNode } from 'react';
import { foldedNodes, mirrorTeleNodes, twoStageNodes, type NodeDevice, type OpPoint, type Process } from '../physics';
import { formatSI } from '../practice/units';
import { flowStrength } from './figures';
import { Canvas, Capacitor, CurrentSource, Dot, FlowDots, Ground, Label, Nmos, OpAmp, Pmos, Rail, Resistor, Sym, Terminal, VoltageTag, Wire } from './primitives';
import { fromNode, mosState, Schematic, simNode, stackFlow, type DevState } from './schematic';

const V = (x: number) => formatSI(x, 'V');
const R = (x: number) => formatSI(x, 'Ω');

function live(devs: Record<string, NodeDevice>, names: Record<string, string>): Record<string, DevState> {
  const out: Record<string, DevState> = {};
  for (const [k, role] of Object.entries(names)) if (devs[k]) out[k] = fromNode(k.toUpperCase(), devs[k], role);
  return out;
}

function GateL({ x, y, text, to = 36, id }: { x: number; y: number; text: string; to?: number; id?: string }) {
  return (
    <>
      <Wire points={[[x - 30, y], [to + 6, y]]} id={id} />
      <Label x={to} y={y + 4} text={text} anchor="end" weight={600} size={12} />
    </>
  );
}
function GateR({ x, y, text, to, id }: { x: number; y: number; text: string; to: number; id?: string }) {
  return (
    <>
      <Wire points={[[x + 30, y], [to - 6, y]]} id={id} />
      <Label x={to} y={y + 4} text={text} weight={600} size={12} />
    </>
  );
}

// ─── Folded cascode (PMOS input) ───────────────────────────────────────────

export interface FoldedFigProps {
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
  vbn?: number;
  vbp?: number;
  highlight?: string[];
  inspector?: boolean;
  /** Simulated operating point (Folded lab). */
  sim?: OpPoint;
}

export function FoldedCascodeFig(p: FoldedFigProps) {
  const hand = foldedNodes(p);
  const sim = p.sim;
  const n = sim
    ? {
        ...hand,
        vX: (sim.v.x1 + sim.v.x2) / 2,
        vT: (sim.v.t1 + sim.v.t2) / 2,
        vP: sim.v.p,
        devices: Object.fromEntries(['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11'].map((k) => [k, simNode(sim.mos[k.toUpperCase()])])) as typeof hand.devices,
      }
    : hand;
  const devs = live(n.devices, {
    m1: 'PMOS input',
    m2: 'PMOS input',
    m3: 'NMOS cascode (CG)',
    m4: 'NMOS cascode (CG)',
    m5: 'NMOS source (ISS/2 + I)',
    m6: 'NMOS source (ISS/2 + I)',
    m7: 'PMOS cascode',
    m8: 'PMOS cascode',
    m9: 'PMOS source (I)',
    m10: 'PMOS source (I)',
    m11: 'tail (ISS)',
  });
  const xL = 130, xR = 490, x1 = 250, x2 = 370, xm = 310;
  const y9 = 72, y7 = 136, yO = 180, y3 = 224, yX = 262, y5 = 300, bot = 330;
  const y11 = 72, yP = 112, y1 = 152;
  const fI = flowStrength(p.i), fIn = flowStrength(p.iss / 2);
  return (
    <Schematic w={640} h={bot + 30} title="Folded-cascode op amp, PMOS input, fully differential (M1–M11)" states={devs} highlight={p.highlight} annotate="region" maxWidth={800} inspector={p.inspector ?? true}>
      <Rail x1={xL - 20} x2={xR + 20} y={30} label={`VDD ${V(p.proc.vdd)}`} />
      {[xL, xR, xm].map((x) => (
        <Wire key={x} points={[[x, 30], [x, 42]]} />
      ))}
      {/* output columns */}
      <Pmos x={xL} y={y9} id="m9" />
      <Pmos x={xR} y={y9} id="m10" flip />
      <GateL x={xL} y={y9} text="Vb3" />
      <GateR x={xR} y={y9} text="Vb3" to={600} />
      <Pmos x={xL} y={y7} id="m7" />
      <Pmos x={xR} y={y7} id="m8" flip />
      <GateL x={xL} y={y7} text={`Vb2 ${V(n.vbp)}`} />
      <GateR x={xR} y={y7} text="Vb2" to={600} />
      {[xL, xR].map((x) => (
        <Wire key={`o${x}`} points={[[x, y7 + 30], [x, y3 - 30]]} id="out" />
      ))}
      <Dot x={xL} y={yO} id="out" />
      <Dot x={xR} y={yO} id="out" />
      <Wire points={[[xL, yO], [30, yO]]} id="out" />
      <Terminal x={30} y={yO} />
      <Label x={30} y={yO - 12} text="Vout1" anchor="middle" weight={600} size={12} />
      <Wire points={[[xR, yO], [610, yO]]} id="out" />
      <Terminal x={610} y={yO} />
      <Label x={610} y={yO - 12} text="Vout2" anchor="middle" weight={600} size={12} />
      <VoltageTag x={xL + 12} y={yO} v={V(p.vout)} id="out" />
      <Nmos x={xL} y={y3} id="m3" />
      <Nmos x={xR} y={y3} id="m4" flip />
      <GateL x={xL} y={y3} text={`Vb1 ${V(n.vbn)}`} />
      <GateR x={xR} y={y3} text="Vb1" to={600} />
      <Dot x={xL} y={yX} id="x" />
      <Dot x={xR} y={yX} id="x" />
      <Label x={xL - 10} y={yX + 4} text="X" anchor="end" weight={700} />
      <Label x={xR + 10} y={yX + 4} text="Y" weight={700} />
      <VoltageTag x={xL - 12} y={yX + 18} v={V(n.vX)} anchor="end" id="x" />
      <Nmos x={xL} y={y5} id="m5" />
      <Nmos x={xR} y={y5} id="m6" flip />
      <GateL x={xL} y={y5} text="Vb4" />
      <GateR x={xR} y={y5} text="Vb4" to={600} />
      <Wire points={[[xL, y5 + 30], [xL, bot], [xR, bot], [xR, y5 + 30]]} />
      <Ground x={xm} y={bot} />
      {/* input pair, folded into X and Y */}
      <Pmos x={xm} y={y11} id="m11" />
      <Wire points={[[xm - 30, y11], [xm - 60, y11]]} />
      <Label x={xm - 64} y={y11 + 4} text="Vb" anchor="end" weight={600} size={12} />
      <Wire points={[[xm, y11 + 30], [xm, yP]]} />
      <Wire points={[[x1, yP], [x2, yP]]} />
      <Dot x={xm} y={yP} id="p" />
      <VoltageTag x={xm + 10} y={yP - 12} v={`P ${V(n.vP)}`} id="p" />
      <Wire points={[[x1, yP], [x1, y1 - 30]]} />
      <Wire points={[[x2, yP], [x2, y1 - 30]]} />
      <Pmos x={x1} y={y1} id="m1" flip />
      <Pmos x={x2} y={y1} id="m2" />
      <Wire points={[[x1 + 30, y1], [xm - 14, y1], [xm - 14, 206]]} id="in1" />
      <Terminal x={xm - 14} y={206} />
      <Label x={xm - 18} y={224} text="Vin1" anchor="end" weight={600} size={12} />
      <Wire points={[[x2 - 30, y1], [xm + 14, y1], [xm + 14, 206]]} id="in2" />
      <Terminal x={xm + 14} y={206} />
      <Label x={xm + 18} y={224} text="Vin2" weight={600} size={12} />
      <Wire points={[[x1, y1 + 30], [x1, yX], [xL, yX]]} id="x" />
      <Wire points={[[x2, y1 + 30], [x2, yX], [xR, yX]]} id="x" />
      <FlowDots points={stackFlow(xL, 32, bot, [{ y: y9 }, { y: y7 }, { y: y3 }, { y: y5 }])} strength={fI} />
      <FlowDots points={stackFlow(xR, 32, bot, [{ y: y9, flip: true }, { y: y7, flip: true }, { y: y3, flip: true }, { y: y5, flip: true }])} strength={fI} />
      <FlowDots points={[...stackFlow(xm, 32, yP, [{ y: y11 }]), [x1, yP], ...stackFlow(x1, yP, yX, [{ y: y1, flip: true }]).slice(1), [xL + 2, yX]]} strength={fIn} />
      <FlowDots points={[...stackFlow(xm, 32, yP, [{ y: y11 }]), [x2, yP], ...stackFlow(x2, yP, yX, [{ y: y1 }]).slice(1), [xR - 2, yX]]} strength={fIn} />
    </Schematic>
  );
}

// ─── Single-ended telescopic with a cascode PMOS mirror (Fig 9.9 / 9.21b) ──

export interface MirrorTeleFigProps {
  proc: Process;
  iss: number;
  wlN: number;
  wlP: number;
  vinCm: number;
  vb1: number;
  vout: number;
  bias: 'diodes' | 'vb2';
  vb2?: number;
  buffer?: boolean;
  highlight?: string[];
  inspector?: boolean;
}

export function MirrorTeleFig(p: MirrorTeleFigProps) {
  const n = mirrorTeleNodes(p);
  const devs = live(n.devices, {
    m1: 'input',
    m2: 'input',
    m3: 'NMOS cascode',
    m4: 'NMOS cascode',
    m5: p.bias === 'diodes' ? 'PMOS cascode (diode)' : 'PMOS cascode (Vb2)',
    m6: 'PMOS cascode',
    m7: p.bias === 'diodes' ? 'PMOS source (diode)' : 'PMOS source (gate on D3)',
    m8: 'PMOS source (copy)',
    m9: 'tail',
  });
  const xL = 170, xR = 370, xm = 270;
  const y7 = 72, y5 = 140, yD = 186, y3 = 228, yX = 264, y1 = 300, yP = 348, y9 = 390;
  const f = flowStrength(p.iss / 2);
  const gates: ReactNode =
    p.bias === 'diodes' ? (
      <>
        {/* M7 diode on the left, M8 shares its gate; M5 diode, M6 shares its gate */}
        <Wire points={[[xL + 30, y7], [xR - 30, y7]]} />
        <Wire points={[[xL + 30, y7], [xL + 30, y7 + 24], [xL, y7 + 24]]} />
        <Dot x={xL} y={y7 + 24} />
        <Wire points={[[xL + 30, y5], [xR - 30, y5]]} />
        <Wire points={[[xL + 30, y5], [xL + 30, y5 + 24], [xL, y5 + 24]]} />
        <Dot x={xL} y={y5 + 24} />
      </>
    ) : (
      <>
        <Wire points={[[xL + 30, y7], [xR - 30, y7]]} />
        <Wire points={[[xm, y7], [xm, yD], [xL, yD]]} />
        <Dot x={xm} y={y7} />
        <Wire points={[[xL + 30, y5], [xR - 30, y5]]} />
        <Wire points={[[xm + 30, y5], [xm + 30, y5 - 18]]} />
        <Label x={xm + 34} y={y5 - 22} text={`Vb2 ${V(p.vb2 ?? n.vg56)}`} weight={600} size={12} />
      </>
    );
  return (
    <Schematic w={540} h={y9 + 60} title={`Telescopic op amp with a cascode PMOS mirror${p.buffer ? ', in unity-gain feedback' : ''}`} states={devs} highlight={p.highlight} annotate="region" maxWidth={680} inspector={p.inspector ?? true}>
      <Rail x1={xL - 20} x2={xR + 20} y={30} label={`VDD ${V(p.proc.vdd)}`} />
      <Wire points={[[xL, 30], [xL, y7 - 30]]} />
      <Wire points={[[xR, 30], [xR, y7 - 30]]} />
      <Pmos x={xL} y={y7} id="m7" flip />
      <Pmos x={xR} y={y7} id="m8" />
      <Pmos x={xL} y={y5} id="m5" flip />
      <Pmos x={xR} y={y5} id="m6" />
      {gates}
      <VoltageTag x={xL - 12} y={(y7 + y5) / 2 + 6} v={V(n.vA)} anchor="end" />
      <Wire points={[[xL, y5 + 30], [xL, y3 - 30]]} id="d3" />
      <Dot x={xL} y={yD} id="d3" />
      <VoltageTag x={xL - 12} y={yD} v={`D3 ${V(n.vD3)}`} anchor="end" id="d3" />
      <Wire points={[[xR, y5 + 30], [xR, y3 - 30]]} id="out" />
      <Dot x={xR} y={yD} id="out" />
      <Wire points={[[xR, yD], [500, yD]]} id="out" />
      <Terminal x={500} y={yD} />
      <Label x={500} y={yD - 12} text="Vout" anchor="middle" weight={600} />
      <VoltageTag x={xR + 12} y={yD + 16} v={V(p.vout)} id="out" />
      <Nmos x={xL} y={y3} id="m3" />
      <Nmos x={xR} y={y3} id="m4" flip />
      <Wire points={[[xL - 30, y3], [70, y3]]} />
      <Label x={64} y={y3 + 4} text={`Vb1 ${V(p.vb1)}`} anchor="end" weight={600} size={12} />
      <Wire points={[[xR + 30, y3], [440, y3]]} />
      <Label x={446} y={y3 + 4} text="Vb1" weight={600} size={12} />
      <Dot x={xL} y={yX} id="x" />
      <VoltageTag x={xL - 12} y={yX} v={`X ${V(n.vX)}`} anchor="end" id="x" />
      <Nmos x={xL} y={y1} id="m1" />
      <Nmos x={xR} y={y1} id="m2" flip />
      <Wire points={[[xL - 30, y1], [70, y1]]} id="in1" />
      <Terminal x={70} y={y1} />
      <Label x={70} y={y1 - 12} text={`Vin ${V(p.buffer ? p.vout : p.vinCm)}`} anchor="middle" weight={600} size={12} />
      {p.buffer ? (
        <Wire points={[[xR + 30, y1], [480, y1], [480, yD]]} id="fb" />
      ) : (
        <>
          <Wire points={[[xR + 30, y1], [440, y1]]} id="in2" />
          <Terminal x={440} y={y1} />
          <Label x={440} y={y1 - 12} text="Vin2" anchor="middle" weight={600} size={12} />
        </>
      )}
      {p.buffer && <Label x={488} y={(yD + y1) / 2} text="feedback" size={11} color="var(--signal)" weight={600} />}
      <Wire points={[[xL, y1 + 30], [xL, yP], [xR, yP], [xR, y1 + 30]]} />
      <Dot x={xm} y={yP} id="p" />
      <VoltageTag x={xm} y={yP - 14} v={`P ${V(n.vP)}`} anchor="middle" id="p" />
      <Wire points={[[xm, yP], [xm, y9 - 30]]} />
      <Nmos x={xm} y={y9} id="m9" />
      <Wire points={[[xm - 30, y9], [210, y9]]} />
      <Label x={204} y={y9 + 4} text="Vb" anchor="end" weight={600} size={12} />
      <Ground x={xm} y={y9 + 30} />
      <FlowDots points={stackFlow(xL, 32, yP, [{ y: y7, flip: true }, { y: y5, flip: true }, { y: y3 }, { y: y1 }])} strength={f} />
      <FlowDots points={stackFlow(xR, 32, yP, [{ y: y7 }, { y: y5 }, { y: y3, flip: true }, { y: y1, flip: true }])} strength={f} />
      <FlowDots points={stackFlow(xm, yP, y9 + 30, [{ y: y9 }])} strength={flowStrength(p.iss)} />
    </Schematic>
  );
}

// ─── Two-stage op amp (Fig 9.23) ───────────────────────────────────────────

export function TwoStageFig({ proc, iss, id2, wl, vinCm, vout, highlight, inspector = true }: { proc: Process; iss: number; id2: number; wl: number; vinCm: number; vout: number; highlight?: string[]; inspector?: boolean }) {
  const n = twoStageNodes({ proc, iss, id2, wl, vinCm, vout });
  const devs = live(n.devices, {
    m1: 'input (stage 1)',
    m2: 'input (stage 1)',
    m3: 'PMOS load (stage 1)',
    m4: 'PMOS load (stage 1)',
    m5: 'CS device (stage 2)',
    m6: 'CS device (stage 2)',
    m7: 'NMOS load (stage 2)',
    m8: 'NMOS load (stage 2)',
    m9: 'tail',
  });
  const x5 = 80, xL = 200, xR = 360, x6 = 480, xm = 280;
  const y3 = 72, yXY = 120, y1 = 170, yP = 222, y9 = 262, y5 = 72, yO = 150, y7 = 230;
  const f1 = flowStrength(iss / 2), f2 = flowStrength(id2);
  return (
    <Schematic w={560} h={y9 + 60} title="Two-stage op amp: differential first stage, CS second stages" states={devs} highlight={highlight} annotate="region" maxWidth={700} inspector={inspector}>
      <Rail x1={x5 - 20} x2={x6 + 20} y={30} label={`VDD ${V(proc.vdd)}`} />
      {[x5, xL, xR, x6].map((x) => (
        <Wire key={x} points={[[x, 30], [x, 42]]} />
      ))}
      {/* stage 1 */}
      <Pmos x={xL} y={y3} id="m3" flip />
      <Pmos x={xR} y={y3} id="m4" />
      <Wire points={[[xL + 30, y3], [xR - 30, y3]]} />
      <Wire points={[[xm, y3], [xm, y3 - 20]]} />
      <Label x={xm + 4} y={y3 - 24} text={`Vb1 ${V(n.vb1)}`} weight={600} size={12} />
      <Wire points={[[xL, y3 + 30], [xL, y1 - 30]]} id="x" />
      <Wire points={[[xR, y3 + 30], [xR, y1 - 30]]} id="x" />
      <Dot x={xL} y={yXY} id="x" />
      <Dot x={xR} y={yXY} id="x" />
      <VoltageTag x={xL + 12} y={yXY} v={`X ${V(n.vXY)}`} id="x" />
      <Nmos x={xL} y={y1} id="m1" />
      <Nmos x={xR} y={y1} id="m2" flip />
      <Wire points={[[xL - 30, y1], [xL - 50, y1], [xL - 50, 196]]} id="in1" />
      <Terminal x={xL - 50} y={196} />
      <Label x={xL - 50} y={214} text={`Vin ${V(vinCm)}`} anchor="middle" weight={600} size={12} />
      <Wire points={[[xR + 30, y1], [xR + 50, y1], [xR + 50, 196]]} id="in2" />
      <Terminal x={xR + 50} y={196} />
      <Wire points={[[xL, y1 + 30], [xL, yP], [xR, yP], [xR, y1 + 30]]} />
      <Dot x={xm} y={yP} id="p" />
      <VoltageTag x={xm} y={yP - 14} v={`P ${V(n.vP)}`} anchor="middle" id="p" />
      <Wire points={[[xm, yP], [xm, y9 - 30]]} />
      <Nmos x={xm} y={y9} id="m9" />
      <Ground x={xm} y={y9 + 30} />
      {/* stage 2 */}
      <Pmos x={x5} y={y5} id="m5" flip />
      <Pmos x={x6} y={y5} id="m6" />
      <Wire points={[[x5 + 30, y5], [x5 + 30, 100], [xL - 16, 100], [xL - 16, yXY], [xL, yXY]]} id="x" />
      <Wire points={[[x6 - 30, y5], [x6 - 30, 100], [xR + 16, 100], [xR + 16, yXY], [xR, yXY]]} id="x" />
      <Wire points={[[x5, y5 + 30], [x5, y7 - 30]]} id="out" />
      <Wire points={[[x6, y5 + 30], [x6, y7 - 30]]} id="out" />
      <Dot x={x5} y={yO} id="out" />
      <Dot x={x6} y={yO} id="out" />
      <Wire points={[[x5, yO], [30, yO]]} id="out" />
      <Terminal x={30} y={yO} />
      <Label x={30} y={yO - 12} text="Vout1" anchor="middle" weight={600} size={12} />
      <Wire points={[[x6, yO], [530, yO]]} id="out" />
      <Terminal x={530} y={yO} />
      <Label x={530} y={yO - 12} text="Vout2" anchor="middle" weight={600} size={12} />
      <VoltageTag x={x6 + 12} y={yO + 16} v={V(vout)} id="out" />
      <Nmos x={x5} y={y7} id="m7" flip />
      <Nmos x={x6} y={y7} id="m8" />
      <Label x={x5 + 36} y={y7 + 4} text="Vb2" weight={600} size={12} />
      <Wire points={[[x5 + 30, y7], [x5 + 34, y7]]} />
      <Label x={x6 - 36} y={y7 + 4} text="Vb2" anchor="end" weight={600} size={12} />
      <Wire points={[[x6 - 30, y7], [x6 - 34, y7]]} />
      <Ground x={x5} y={y7 + 30} />
      <Ground x={x6} y={y7 + 30} />
      <FlowDots points={stackFlow(xL, 32, yP, [{ y: y3, flip: true }, { y: y1 }])} strength={f1} />
      <FlowDots points={stackFlow(xR, 32, yP, [{ y: y3 }, { y: y1, flip: true }])} strength={f1} />
      <FlowDots points={stackFlow(x5, 32, y7 + 30, [{ y: y5, flip: true }, { y: y7, flip: true }])} strength={f2} />
      <FlowDots points={stackFlow(x6, 32, y7 + 30, [{ y: y5 }, { y: y7 }])} strength={f2} />
    </Schematic>
  );
}

// ─── Non-inverting feedback amplifier (L1, Ex 9.1, Tut 6 Q1) ────────────────

export function NonInvertingFig({ r1, r2, a, cl, highlight }: { r1?: number; r2?: number; a?: number; cl?: number; highlight?: string[] }) {
  const beta = r1 !== undefined && r2 !== undefined ? r2 / (r1 + r2) : undefined;
  return (
    <Canvas w={440} h={250} title="Non-inverting amplifier: the divider R1–R2 feeds back β = R2/(R1 + R2)" highlight={highlight}>
      <Terminal x={40} y={78} />
      <Label x={40} y={64} text="Vin" anchor="middle" weight={600} />
      <Wire points={[[40, 78], [174, 78]]} id="in" />
      <OpAmp x={210} y={90} id="amp" />
      <Label x={210} y={50} text={a !== undefined ? `A = ${Number(a.toPrecision(3))}` : 'open-loop gain A'} anchor="middle" size={12} weight={700} />
      <Wire points={[[246, 90], [330, 90]]} id="out" />
      <Dot x={300} y={90} id="out" />
      <Terminal x={400} y={90} />
      <Wire points={[[330, 90], [400, 90]]} id="out" />
      <Label x={400} y={76} text="Vout" anchor="middle" weight={600} />
      <Resistor x={300} y1={90} y2={170} label={<Sym base="R" sub="1" />} value={r1 !== undefined ? R(r1) : undefined} id="r1" />
      <Dot x={300} y={170} id="fb" />
      <Resistor x={300} y1={170} y2={230} label={<Sym base="R" sub="2" />} value={r2 !== undefined ? R(r2) : undefined} id="r2" />
      <Ground x={300} y={230} />
      <Wire points={[[300, 170], [150, 170], [150, 102], [174, 102]]} id="fb" />
      <Label x={146} y={160} text={beta !== undefined ? `β = ${beta.toPrecision(3)}` : 'β = R2/(R1+R2)'} anchor="end" size={12} color="var(--signal)" weight={600} />
      {cl !== undefined && (
        <>
          <Capacitor x={370} y1={90} y2={160} label={<Sym base="C" sub="L" />} id="cl" />
          <Ground x={370} y={160} />
        </>
      )}
    </Canvas>
  );
}

// ─── L6: gain-boosted (regulated) cascode, Tutorial 4 Q1 form ───────────────


/** M1 input, M2 cascode, M3 an NMOS CS auxiliary amplifier sensing X and driving M2’s gate. */
export function GainBoostFig({ vx, vg2, vout, i1, i2, vth = 0.7, highlight, inspector = true }: { vx: number; vg2: number; vout: number; i1: number; i2: number; vth?: number; highlight?: string[]; inspector?: boolean }) {
  const devs: Record<string, DevState> = {
    m1: mosState({ name: 'M1', kind: 'n', role: 'input (CS)', vg: vg2 - vx, vs: 0, vd: vx, vth, id: i2 }),
    m2: mosState({ name: 'M2', kind: 'n', role: 'cascode, gate driven by M3', vg: vg2, vs: vx, vd: vout, vth, id: i2 }),
    m3: mosState({ name: 'M3', kind: 'n', role: 'auxiliary CS amplifier (A1 = gm3·rO3)', vg: vx, vs: 0, vd: vg2, vth, id: i1 }),
  };
  const x2 = 300, x3 = 170, y2 = 150, yX = 196, y1 = 240, y3 = 196;
  return (
    <Schematic w={440} h={300} title="Gain-boosted cascode: M3 watches X and drives M2’s gate" states={devs} highlight={highlight} maxWidth={560} inspector={inspector}>
      <Rail x1={x3 - 30} x2={x2 + 30} y={30} label="VDD" />
      <CurrentSource x={x2} y1={30} y2={100} label={<Sym base="I" sub="2" />} value={formatSI(i2, 'A')} id="i2" />
      <Wire points={[[x2, 100], [x2, y2 - 30]]} id="out" />
      <Dot x={x2} y={108} id="out" />
      <Wire points={[[x2, 108], [410, 108]]} id="out" />
      <Terminal x={410} y={108} />
      <Label x={410} y={96} text="Vout" anchor="middle" weight={600} />
      <Nmos x={x2} y={y2} id="m2" />
      <CurrentSource x={x3} y1={30} y2={100} label={<Sym base="I" sub="1" />} value={formatSI(i1, 'A')} labelSide="left" id="i1" />
      <Wire points={[[x3, 100], [x3, y3 - 30]]} />
      <Dot x={x3} y={y2} id="g2" />
      <Wire points={[[x3, y2], [x2 - 30, y2]]} id="g2" />
      <VoltageTag x={x3 - 12} y={y2 - 16} v={`VG2 ${V(vg2)}`} anchor="end" id="g2" />
      <Nmos x={x3} y={y3} id="m3" flip />
      <Ground x={x3} y={y3 + 30} />
      <Wire points={[[x2, y2 + 30], [x2, y1 - 30]]} id="x" />
      <Dot x={x2} y={yX} id="x" />
      <Wire points={[[x3 + 30, y3], [x2, y3]]} id="x" />
      <VoltageTag x={x2 + 12} y={yX + 2} v={`X ${V(vx)}`} id="x" />
      <Nmos x={x2} y={y1} id="m1" />
      <Wire points={[[x2 - 30, y1], [250, y1]]} id="in" />
      <Terminal x={250} y={y1} />
      <Label x={244} y={y1 + 4} text="Vin" anchor="end" weight={600} />
      <Ground x={x2} y={y1 + 30} />
      <FlowDots points={stackFlow(x2, 32, y1 + 30, [{ y: y2 }, { y: y1 }])} strength={flowStrength(i2)} />
      <FlowDots points={stackFlow(x3, 32, y3 + 30, [{ y: y3, flip: true }])} strength={flowStrength(i1)} />
    </Schematic>
  );
}

/** L7–L8: triode-device CMFB in the tail (Tutorial 5 Q1 / Razavi 9.11): M7, M8 gates on the outputs. */
export function CmfbTriodeFig({ vout1, vout2, vp, wl, highlight, tail = ['M7', 'M8'], upper = 'PMOS cascode', upper2 = 'loads (M9–M12)', lower = ['M3, M5', 'M4, M6'] }: { vout1: number; vout2: number; vp?: number; wl?: number; highlight?: string[]; tail?: [string, string]; upper?: string; upper2?: string; lower?: [string, string] }) {
  const xL = 150, xR = 330;
  return (
    <Canvas w={480} h={330} title="Triode CMFB: M7 and M8 sit in deep triode; their gates sense the two outputs" highlight={highlight}>
      <Rail x1={xL - 30} x2={xR + 30} y={30} label="VDD" />
      <Label x={240} y={78} text={upper} anchor="middle" size={11} color="var(--ink-2)" />
      <Label x={240} y={93} text={upper2} anchor="middle" size={11} color="var(--ink-2)" />
      <Wire points={[[xL, 30], [xL, 190]]} />
      <Wire points={[[xR, 30], [xR, 190]]} />
      <rect x={xL - 18} y={44} width={36} height={80} rx={8} fill="var(--pmos-bg)" stroke="var(--pmos)" />
      <rect x={xR - 18} y={44} width={36} height={80} rx={8} fill="var(--pmos-bg)" stroke="var(--pmos)" />
      <Dot x={xL} y={140} id="out" />
      <Dot x={xR} y={140} id="out" />
      <VoltageTag x={102} y={140} v={`Vout1 ${V(vout1)}`} anchor="end" id="out" />
      <VoltageTag x={378} y={140} v={`Vout2 ${V(vout2)}`} id="out" />
      <rect x={xL - 18} y={160} width={36} height={60} rx={8} fill="var(--nmos-bg)" stroke="var(--nmos)" />
      <rect x={xR - 18} y={160} width={36} height={60} rx={8} fill="var(--nmos-bg)" stroke="var(--nmos)" />
      <Label x={xL + 24} y={194} text={lower[0]} size={11} color="var(--nmos)" weight={600} />
      <Label x={xR - 24} y={194} text={lower[1]} anchor="end" size={11} color="var(--nmos)" weight={600} />
      <Wire points={[[xL, 220], [xL, 236], [xR, 236], [xR, 220]]} />
      <Dot x={240} y={236} id="p" />
      <VoltageTag x={240} y={222} v={vp !== undefined ? `P ${V(vp)}` : 'P'} anchor="middle" id="p" />
      <Wire points={[[196, 236], [196, 256]]} />
      <Wire points={[[284, 236], [284, 256]]} />
      <Nmos x={196} y={286} name={tail[0]} id="m7" />
      <Nmos x={284} y={286} name={tail[1]} id="m8" flip />
      <Wire points={[[196, 316], [284, 316]]} />
      <Ground x={240} y={316} />
      <Wire points={[[166, 286], [110, 286], [110, 140], [xL, 140]]} id="sense" />
      <Wire points={[[314, 286], [370, 286], [370, 140], [xR, 140]]} id="sense" />
      <Label x={60} y={300} text={wl !== undefined ? `(W/L)7,8 = ${wl.toFixed(1)}` : 'triode sense'} size={11} weight={600} color="var(--signal)" />
    </Canvas>
  );
}
