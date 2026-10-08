/**
 * Milestone 3 figures (U10–U12): differential pair (resistor, diode or current-source loads; ideal,
 * resistor or mirror tail), half circuits, the five-transistor OTA with signal currents and the
 * unity-gain buffer, Bode plot, step response with slewing, and the steering curve.
 * Node voltages come from src/physics/nodes.ts; every device is inspectable through <Schematic>.
 */
import { diffPairNodes, fiveTNodes, singlePoleMag, db, stepWithSlew, slewTime, steering, type OpPoint, type Process } from '../physics';
import { formatSI } from '../practice/units';
import { flowStrength } from './figures';
import { Plot, type Series } from './Plot';
import {
  Canvas,
  Capacitor,
  CurrentSource,
  Dot,
  FlowDots,
  Ground,
  Label,
  Nmos,
  Pmos,
  Rail,
  Resistor,
  Sym,
  Terminal,
  VoltageTag,
  Wire,
} from './primitives';
import { fromNode, mosState, Schematic, SignalTag, simNode, stackFlow, type DevState } from './schematic';

const V = (x: number) => formatSI(x, 'V');
const R = (x: number) => (Number.isFinite(x) ? formatSI(x, 'Ω') : '∞');
const I = (x: number) => formatSI(x, 'A');

// ─── U10: differential pair ────────────────────────────────────────────────

export type PairLoad = 'rd' | 'diode' | 'current';
export type PairTail = 'source' | 'rss' | 'mirror';

export interface DiffPairFigProps {
  vdd: number;
  vss?: number;
  iss: number;
  kp: number;
  wl: number;
  vth: number;
  vin1: number;
  vin2: number;
  load?: PairLoad;
  rd?: number;
  tail?: PairTail;
  rss?: number;
  /** Tail mirror (Tutorial 1 Q1): Q3 tail, Q4 diode fed through R. */
  wlTail?: number;
  r?: number;
  /** Device names, e.g. ['Q1','Q2','Q3','Q4'] for Tutorial 1. */
  names?: string[];
  vthp?: number;
  kpp?: number;
  wlp?: number;
  highlight?: string[];
  inspector?: boolean;
  /** Show the drain currents as bars under the drawing. */
  bars?: boolean;
  /** A simulated operating point (labs): nodes d1, d2, p and devices M1, M2 (+ M3, M4 loads, M5 tail). */
  sim?: OpPoint;
}

export function DiffPairFig(p: DiffPairFigProps) {
  const load = p.load ?? 'rd';
  const tail = p.tail ?? 'source';
  const names = p.names ?? ['M1', 'M2', 'M3', 'M4'];
  const vss = p.vss ?? 0;
  const n = diffPairNodes({ kp: p.kp, wl: p.wl, vth: p.vth, vdd: p.vdd, vss, iss: p.iss, rd: p.rd ?? 0, vin1: p.vin1, vin2: p.vin2, wlTail: tail === 'mirror' ? p.wlTail : undefined });
  // With transistor loads the drain voltages are set by the PMOS devices, not RD.
  let vD1 = n.vD1, vD2 = n.vD2;
  const devs: Record<string, DevState> = {
    m1: fromNode(names[0], n.devices.m1, 'input'),
    m2: fromNode(names[1], n.devices.m2, 'input'),
  };
  if (load !== 'rd' && p.kpp && p.wlp && p.vthp !== undefined) {
    const vgsP = (id: number) => p.vthp! + Math.sqrt((2 * id) / (p.kpp! * p.wlp!));
    if (load === 'diode') {
      vD1 = p.vdd - vgsP(n.id1);
      vD2 = p.vdd - vgsP(n.id2);
      devs.l1 = mosState({ name: names[2] ?? 'M3', kind: 'p', role: 'diode load', vg: vD1, vs: p.vdd, vd: vD1, vth: p.vthp, id: n.id1 });
      devs.l2 = mosState({ name: names[3] ?? 'M4', kind: 'p', role: 'diode load', vg: vD2, vs: p.vdd, vd: vD2, vth: p.vthp, id: n.id2 });
    } else {
      const vb = p.vdd - vgsP(p.iss / 2);
      vD1 = vD2 = (p.vdd + vss) / 2; // set by CMFB in practice
      devs.l1 = mosState({ name: names[2] ?? 'M3', kind: 'p', role: 'current source', vg: vb, vs: p.vdd, vd: vD1, vth: p.vthp, id: p.iss / 2 });
      devs.l2 = mosState({ name: names[3] ?? 'M4', kind: 'p', role: 'current source', vg: vb, vs: p.vdd, vd: vD2, vth: p.vthp, id: p.iss / 2 });
    }
    devs.m1 = mosState({ ...n.devices.m1, vd: vD1, name: names[0], role: 'input' });
    devs.m2 = mosState({ ...n.devices.m2, vd: vD2, name: names[1], role: 'input' });
  }
  if (tail === 'mirror' && n.devices.m3) {
    devs.m3 = fromNode(names[2] ?? 'Q3', n.devices.m3, 'tail source');
    devs.m4 = mosState({ name: names[3] ?? 'Q4', kind: 'n', role: 'diode (sets the tail)', vg: n.devices.m3.vg, vs: vss, vd: n.devices.m3.vg, vth: p.vth, id: p.iss / 2 });
  }
  let vP = n.vP, id1 = n.id1, id2 = n.id2;
  if (p.sim) {
    const m = p.sim.mos;
    vD1 = p.sim.v.d1;
    vD2 = p.sim.v.d2;
    vP = p.sim.v.p;
    id1 = m.M1.id;
    id2 = m.M2.id;
    devs.m1 = fromNode(names[0], simNode(m.M1), 'input');
    devs.m2 = fromNode(names[1], simNode(m.M2), 'input');
    if (m.M3) devs.l1 = fromNode(names[2] ?? 'M3', simNode(m.M3), load === 'diode' ? 'diode load' : 'current source');
    if (m.M4) devs.l2 = fromNode(names[3] ?? 'M4', simNode(m.M4), load === 'diode' ? 'diode load' : 'current source');
    if (m.M5) {
      devs.m3 = fromNode(names[2] ?? 'M5', simNode(m.M5), 'tail source');
      devs.m4 = mosState({ name: names[3] ?? 'M4', kind: 'n', role: 'diode (sets the tail)', vg: m.M5.vg, vs: vss, vd: m.M5.vg, vth: p.vth, id: p.iss });
    }
  }
  const xL = 170, xR = 350, xm = 260, yLoad = 70, yD = 118, y1 = 170, yP = 222, yT = 266;
  const bottom = tail === 'rss' ? 306 : yT + 30;
  const top = 30;
  const railLabel = `VDD = ${V(p.vdd)}`;
  const f1 = flowStrength(id1), f2 = flowStrength(id2);
  const title = `Differential pair with ${load === 'rd' ? 'resistor' : load === 'diode' ? 'diode-connected PMOS' : 'PMOS current-source'} loads`;
  return (
    <Schematic w={520} h={bottom + 36} title={title} states={devs} highlight={p.highlight} annotate="region" maxWidth={660} inspector={p.inspector ?? true}>
      <Rail x1={tail === 'mirror' ? 50 : xL - 20} x2={xR + 20} y={top} label={railLabel} />
      {load === 'rd' ? (
        <>
          <Resistor x={xL} y1={top} y2={yD} label={<Sym base="R" sub="D" />} value={p.rd !== undefined ? R(p.rd) : undefined} labelSide="left" id="rd1" />
          <Resistor x={xR} y1={top} y2={yD} label={<Sym base="R" sub="D" />} value={p.rd !== undefined ? R(p.rd) : undefined} id="rd2" />
        </>
      ) : (
        <>
          <Wire points={[[xL, top], [xL, yLoad - 30]]} />
          <Wire points={[[xR, top], [xR, yLoad - 30]]} />
          <Pmos x={xL} y={yLoad} id="l1" diode={load === 'diode'} />
          <Pmos x={xR} y={yLoad} id="l2" flip diode={load === 'diode'} />
          {load === 'current' && (
            <>
              <Wire points={[[xL - 30, yLoad], [110, yLoad]]} />
              <Label x={104} y={yLoad + 4} text="Vb" anchor="end" weight={600} />
              <Wire points={[[xR + 30, yLoad], [410, yLoad]]} />
              <Label x={416} y={yLoad + 4} text="Vb" weight={600} />
            </>
          )}
          <Wire points={[[xL, yLoad + 30], [xL, yD]]} />
          <Wire points={[[xR, yLoad + 30], [xR, yD]]} />
        </>
      )}
      <Wire points={[[xL, yD], [xL, y1 - 30]]} />
      <Wire points={[[xR, yD], [xR, y1 - 30]]} />
      <Dot x={xL} y={yD} id="vd1" />
      <Dot x={xR} y={yD} id="vd2" />
      <VoltageTag x={xL + 12} y={yD} v={V(vD1)} id="vd1" />
      <VoltageTag x={xR - 12} y={yD} v={V(vD2)} anchor="end" id="vd2" />
      <Nmos x={xL} y={y1} id="m1" />
      <Nmos x={xR} y={y1} id="m2" flip />
      <Wire points={[[xL - 30, y1], [90, y1]]} id="in1" />
      <Terminal x={90} y={y1} />
      <Label x={96} y={y1 - 12} text={`Vin1 ${V(p.vin1)}`} weight={600} size={12} />
      <Wire points={[[xR + 30, y1], [430, y1]]} id="in2" />
      <Terminal x={430} y={y1} />
      <Label x={424} y={y1 - 12} text={`Vin2 ${V(p.vin2)}`} anchor="end" weight={600} size={12} />
      <Wire points={[[xL, y1 + 30], [xL, yP], [xR, yP], [xR, y1 + 30]]} />
      <Dot x={xm} y={yP} id="p" />
      <VoltageTag x={xm} y={yP - 16} v={`P ${V(vP)}`} anchor="middle" id="p" />
      {tail === 'source' && (
        <>
          <CurrentSource x={xm} y1={yP} y2={yT + 30} label={<Sym base="I" sub="SS" />} value={I(p.iss)} labelSide="left" id="tail" />
          <Ground x={xm} y={yT + 30} />
        </>
      )}
      {tail === 'rss' && (
        <>
          <Resistor x={xm} y1={yP} y2={bottom} label={<Sym base="R" sub="SS" />} value={p.rss !== undefined ? R(p.rss) : undefined} labelSide="left" id="tail" />
          <Ground x={xm} y={bottom} />
        </>
      )}
      {tail === 'mirror' && (
        <>
          <Wire points={[[xm, yP], [xm, yT - 30]]} />
          <Nmos x={xm} y={yT} id="m3" />
          <Wire points={[[xm - 30, yT], [100, yT]]} />
          <Nmos x={70} y={yT} id="m4" flip diode />
          <Wire points={[[70, yT - 30], [70, 196]]} />
          <Resistor x={70} y1={top} y2={196} label="R" value={p.r !== undefined ? R(p.r) : undefined} labelSide="left" id="r" />
          <Wire points={[[70, yT + 30], [70, bottom], [xm, bottom], [xm, yT + 30]]} />
          <Label x={xm + 12} y={bottom + 16} text={vss < 0 ? `VSS = ${V(vss)}` : 'ground'} weight={600} size={12} />
        </>
      )}
      <FlowDots points={stackFlow(xL, top + 2, yP, load === 'rd' ? [{ y: y1 }] : [{ y: yLoad }, { y: y1 }])} strength={f1} />
      <FlowDots points={stackFlow(xR, top + 2, yP, load === 'rd' ? [{ y: y1, flip: true }] : [{ y: yLoad, flip: true }, { y: y1, flip: true }])} strength={f2} />
      {tail !== 'rss' && tail !== 'source' ? (
        <FlowDots points={stackFlow(xm, yP, bottom, [{ y: yT }])} strength={flowStrength(p.iss)} />
      ) : (
        <FlowDots points={[[xm, yP], [xm, bottom]]} strength={flowStrength(p.iss)} />
      )}
    </Schematic>
  );
}

/** DM or CM half circuit: one transistor with RD; the source is AC ground (DM) or sees 2RSS (CM). */
export function HalfCircuitFig({ mode, rd, rss, highlight }: { mode: 'dm' | 'cm'; rd?: number; rss?: number; highlight?: string[] }) {
  const x = 170, y = 132;
  return (
    <Canvas w={360} h={260} title={mode === 'dm' ? 'Differential-mode half circuit: the tail node is AC ground' : 'Common-mode half circuit: each half sees 2RSS'} highlight={highlight}>
      <Rail x1={x - 30} x2={x + 30} y={30} label="VDD (AC gnd)" />
      <Resistor x={x} y1={30} y2={92} label={<Sym base="R" sub="D" />} value={rd !== undefined ? R(rd) : undefined} labelSide="left" id="rd" />
      <Wire points={[[x, 92], [x, y - 30]]} />
      <Dot x={x} y={92} id="out" />
      <Wire points={[[x, 92], [290, 92]]} id="out" />
      <Terminal x={290} y={92} />
      <Label x={290} y={80} text={mode === 'dm' ? 'vout = vd1' : 'Δvd1'} anchor="middle" weight={600} size={12} />
      <Nmos x={x} y={y} name="M1" id="m1" />
      <Wire points={[[x - 30, y], [80, y]]} id="in" />
      <Terminal x={80} y={y} />
      <Label x={80} y={y - 14} text={mode === 'dm' ? '+vd/2' : 'ΔVCM'} anchor="middle" weight={600} size={12} />
      {mode === 'dm' ? (
        <>
          <Wire points={[[x, y + 30], [x, 190]]} id="p" />
          <Ground x={x} y={190} />
          <Label x={x + 16} y={186} text="P = AC ground" size={12} color="var(--signal)" weight={600} />
        </>
      ) : (
        <>
          <Resistor x={x} y1={y + 30} y2={232} label={<tspan>2R<tspan baselineShift="sub" fontSize="0.75em">SS</tspan></tspan>} value={rss !== undefined ? R(2 * rss) : undefined} labelSide="left" id="rss" />
          <Ground x={x} y={232} />
        </>
      )}
    </Canvas>
  );
}

// ─── U11: five-transistor OTA ──────────────────────────────────────────────

export interface FiveTFigProps {
  proc: Process;
  iss: number;
  wl12: number;
  wl34: number;
  wlTail: number;
  vinCm: number;
  vd?: number;
  /** Draw M6 and the reference current (exam figure). */
  bias?: boolean;
  /** Show the small-signal currents +i, −i, 2i. */
  signal?: boolean;
  /** Unity-gain buffer: Vout tied to Vin2. */
  buffer?: boolean;
  cl?: number;
  highlight?: string[];
  inspector?: boolean;
  /** A simulated operating point (labs): every node and current from the circuit solver. */
  sim?: OpPoint;
}

export function FiveTOtaFig(p: FiveTFigProps) {
  const hand = fiveTNodes({ proc: p.proc, iss: p.iss, wl12: p.wl12, wl34: p.wl34, wlTail: p.wlTail, vinCm: p.vinCm, vd: p.vd });
  const n = p.sim
    ? {
        ...hand,
        vP: p.sim.v.p,
        vD1: p.sim.v.x,
        vOut: p.sim.v.out,
        vbTail: p.sim.v.nb,
        devices: { m1: simNode(p.sim.mos.M1), m2: simNode(p.sim.mos.M2), m3: simNode(p.sim.mos.M3), m4: simNode(p.sim.mos.M4), m5: simNode(p.sim.mos.M5), m6: simNode(p.sim.mos.M6) },
      }
    : hand;
  const devs: Record<string, DevState> = {
    m1: fromNode('M1', n.devices.m1, 'input (gate→drain)'),
    m2: fromNode('M2', n.devices.m2, 'input (gate→drain)'),
    m3: fromNode('M3', n.devices.m3, 'diode (1/gm)'),
    m4: fromNode('M4', n.devices.m4, 'mirror copy (rO)'),
    m5: fromNode('M5', n.devices.m5, 'tail source'),
  };
  if (p.bias) devs.m6 = fromNode('M6', n.devices.m6, 'diode (sets the tail)');
  const x6 = 70, xL = 200, xR = 380, xm = 290, yP3 = 80, yD = 124, y1 = 180, yP = 232, y5 = 276;
  const bottom = y5 + 30;
  const f = flowStrength(p.iss / 2);
  const f1 = p.sim ? flowStrength(p.sim.mos.M1.id) : f, f2 = p.sim ? flowStrength(p.sim.mos.M2.id) : f;
  return (
    <Schematic w={560} h={bottom + 30} title={`Five-transistor OTA${p.buffer ? ' in unity-gain feedback' : ''}`} states={devs} highlight={p.highlight} annotate="region" maxWidth={700} inspector={p.inspector ?? true}>
      <Rail x1={p.bias ? x6 - 20 : xL - 20} x2={xR + 20} y={30} label={`VDD ${V(p.proc.vdd)}`} />
      <Wire points={[[xL, 30], [xL, yP3 - 30]]} />
      <Wire points={[[xR, 30], [xR, yP3 - 30]]} />
      <Pmos x={xL} y={yP3} id="m3" flip diode />
      <Pmos x={xR} y={yP3} id="m4" />
      <Wire points={[[xL + 30, yP3], [xR - 30, yP3]]} id="mirror" />
      <Dot x={xL + 30} y={yP3} />
      <Wire points={[[xL, yP3 + 30], [xL, y1 - 30]]} id="d1" />
      <Dot x={xL} y={yD} id="d1" />
      <VoltageTag x={xL - 12} y={yD} v={V(n.vD1)} anchor="end" id="d1" />
      <Wire points={[[xR, yP3 + 30], [xR, y1 - 30]]} id="out" />
      <Dot x={xR} y={yD} id="out" />
      <Wire points={[[xR, yD], [500, yD]]} id="out" />
      <Terminal x={500} y={yD} />
      <Label x={500} y={yD - 14} text="Vout" anchor="middle" weight={600} />
      <VoltageTag x={xR + 14} y={yD + 18} v={V(n.vOut)} id="out" />
      {p.cl !== undefined && (
        <>
          <Capacitor x={530} y1={yD} y2={yD + 60} label={<Sym base="C" sub="L" />} id="cl" />
          <Wire points={[[500, yD], [530, yD]]} />
          <Ground x={530} y={yD + 60} />
        </>
      )}
      <Nmos x={xL} y={y1} id="m1" />
      <Nmos x={xR} y={y1} id="m2" flip />
      <Wire points={[[xL - 30, y1], [140, y1]]} id="in1" />
      <Terminal x={140} y={y1} />
      <Label x={140} y={y1 + 26} text={`Vin1 ${V(p.sim ? p.sim.v.in1 : p.vinCm + (p.vd ?? 0) / 2)}`} anchor="middle" weight={600} size={12} />
      {p.buffer ? (
        <Wire points={[[xR + 30, y1], [470, y1], [470, yD]]} id="fb" />
      ) : (
        <>
          <Wire points={[[xR + 30, y1], [440, y1]]} id="in2" />
          <Terminal x={440} y={y1} />
          <Label x={440} y={y1 - 14} text="Vin2" anchor="middle" weight={600} size={12} />
        </>
      )}
      {p.buffer && <Label x={478} y={(yD + y1) / 2 + 4} text="feedback" size={11} color="var(--signal)" weight={600} />}
      <Wire points={[[xL, y1 + 30], [xL, yP], [xR, yP], [xR, y1 + 30]]} />
      <Dot x={xm} y={yP} id="p" />
      <VoltageTag x={xm} y={yP - 16} v={`P ${V(n.vP)}`} anchor="middle" id="p" />
      <Wire points={[[xm, yP], [xm, y5 - 30]]} />
      <Nmos x={xm} y={y5} id="m5" />
      <Ground x={xm} y={bottom} />
      {p.bias ? (
        <>
          <Wire points={[[xm - 30, y5], [x6 + 30, y5]]} id="vb" />
          <Nmos x={x6} y={y5} id="m6" flip diode />
          <Wire points={[[x6, 30], [x6, 110]]} />
          <CurrentSource x={x6} y1={110} y2={200} label={<Sym base="I" sub="1" />} value={I(p.iss)} id="i1" />
          <Wire points={[[x6, 200], [x6, y5 - 30]]} />
          <Wire points={[[x6, y5 + 30], [x6, bottom], [xm, bottom]]} />
          <FlowDots points={stackFlow(x6, 32, bottom, [{ y: y5, flip: true }])} strength={flowStrength(p.iss)} />
        </>
      ) : (
        <>
          <Wire points={[[xm - 30, y5], [236, y5]]} id="vb" />
          <Label x={230} y={y5 + 4} text={`Vb ${V(n.vbTail)}`} anchor="end" weight={600} size={12} />
        </>
      )}
      <FlowDots points={stackFlow(xL, 32, yP, [{ y: yP3, flip: true }, { y: y1 }])} strength={f1} />
      <FlowDots points={stackFlow(xR, 32, yP, [{ y: yP3 }, { y: y1, flip: true }])} strength={f2} />
      <FlowDots points={stackFlow(xm, yP, bottom, [{ y: y5 }])} strength={flowStrength(p.iss)} />
      {p.signal && (
        <>
          <SignalTag x={xL + 12} y={y1 + 40} text="+i" />
          <SignalTag x={xL + 12} y={yD + 6} text="+i" />
          <SignalTag x={xR + 12} y={yP3 + 30} text="+i (copy)" />
          <SignalTag x={xR + 12} y={y1 + 30} text="−i" />
          <SignalTag x={492} y={yD + 18} text="2i → CL" anchor="middle" />
        </>
      )}
    </Schematic>
  );
}

// ─── U10: the steering curve ───────────────────────────────────────────────

export function SteeringPlot({ kp, wl, iss, dvin }: { kp: number; wl: number; iss: number; dvin: number }) {
  const vov = Math.sqrt(iss / (kp * wl));
  const lim = Math.SQRT2 * vov;
  const span = Math.max(lim * 1.6, Math.abs(dvin) * 1.1, 0.1);
  const pts1: Array<[number, number]> = [];
  const pts2: Array<[number, number]> = [];
  for (let k = 0; k <= 160; k++) {
    const x = -span + (2 * span * k) / 160;
    const s = steering({ kp, wl, iss, dvin: x });
    pts1.push([x, s.id1 * 1e6]);
    pts2.push([x, s.id2 * 1e6]);
  }
  const s = steering({ kp, wl, iss, dvin });
  return (
    <Plot
      title="Current steering: ID1 and ID2 versus the differential input"
      xRange={[-span, span]}
      yRange={[0, iss * 1e6 * 1.08]}
      xLabel="vd = Vin1 − Vin2 (V)"
      yLabel="ID (µA)"
      xFmt={(v) => v.toFixed(2)}
      yFmt={(v) => v.toFixed(0)}
      shades={[
        { x0: -span, x1: -lim, color: 'var(--muted)' },
        { x0: lim, x1: span, color: 'var(--muted)' },
      ]}
      guides={[
        { axis: 'x', at: -lim, label: '−√2·Vov' },
        { axis: 'x', at: lim, label: '+√2·Vov' },
      ]}
      series={[
        { points: pts1, color: 'var(--nmos)', width: 2.6, label: 'ID1', labelAt: 'end' },
        { points: pts2, color: 'var(--pmos)', width: 2.6, label: 'ID2', labelAt: 'start' },
      ]}
      markers={[
        { x: dvin, y: s.id1 * 1e6, color: 'var(--nmos)' },
        { x: dvin, y: s.id2 * 1e6, color: 'var(--pmos)' },
      ]}
    />
  );
}

// ─── U12 / L1: Bode plot and step response ─────────────────────────────────

/** Open-loop single pole, the 1/β line and the closed-loop response on log–log axes (f in Hz, gain in dB). */
export function BodePlot({ a0, f0, beta, h = 280 }: { a0: number; f0: number; beta?: number; h?: number }) {
  const w0 = 2 * Math.PI * f0;
  const fu = a0 * f0;
  const lo = Math.floor(Math.log10(f0)) - 1;
  const hi = Math.ceil(Math.log10(fu)) + 1;
  const open: Array<[number, number]> = [];
  const closed: Array<[number, number]> = [];
  for (let k = 0; k <= 200; k++) {
    const lf = lo + ((hi - lo) * k) / 200;
    const w = 2 * Math.PI * 10 ** lf;
    const a = singlePoleMag(a0, w0, w);
    open.push([lf, db(a)]);
    if (beta) {
      const cl = a0 / (1 + beta * a0);
      const wc = (1 + beta * a0) * w0;
      closed.push([lf, db(singlePoleMag(cl, wc, w))]);
    }
  }
  const top = Math.ceil((db(a0) + 10) / 20) * 20;
  const ticksX: number[] = [];
  for (let e = lo; e <= hi; e++) ticksX.push(e);
  const series: Series[] = [{ points: open, color: 'var(--ink)', width: 2.6, label: '|A| open loop', labelAt: 'start' }];
  if (beta) {
    series.push({ points: [[lo, db(1 / beta)], [hi, db(1 / beta)]], color: 'var(--muted)', width: 1.4, label: '1/β', labelAt: 'end' as const });
    series.push({ points: closed, color: 'var(--signal)', width: 2.6, label: 'closed loop', labelAt: 'end' as const });
  }
  const markers = [{ x: Math.log10(fu), y: 0, label: `fu = ${formatSI(fu, 'Hz')}`, labelPos: 'above' as const }];
  if (beta) {
    const fc = (1 + beta * a0) * f0;
    // When the two points nearly coincide (β ≈ 1), one label names both so they cannot overlap.
    const close = Math.abs(Math.log10(fc / fu)) < 0.4;
    if (close) markers[0].label = '';
    markers.push({ x: Math.log10(fc), y: db(a0 / (1 + beta * a0)) - 3, label: close ? `β·fu ≈ fu = ${formatSI(fu, 'Hz')}` : `β·fu ≈ ${formatSI(fc, 'Hz')}`, labelPos: 'above' as const });
  }
  return (
    <Plot
      title="Bode magnitude: open loop, 1/β line and closed loop"
      xRange={[lo, hi]}
      yRange={[-20, top]}
      xLabel="frequency (Hz, log scale)"
      yLabel="gain (dB)"
      h={h}
      xTicks={ticksX}
      xFmt={(v) => formatSI(10 ** v, 'Hz', 1)}
      yFmt={(v) => v.toFixed(0)}
      series={series}
      guides={[{ axis: 'x', at: Math.log10(f0), label: 'f0' }]}
      markers={markers}
    />
  );
}

/** Step response with the ε band and 4.6τ / 6.9τ markers; with `sr`, slewing first. */
export function StepPlot({ vstep, tau, eps, sr, h = 260 }: { vstep: number; tau: number; eps: number; sr?: number; h?: number }) {
  const ts = sr ? slewTime(vstep, tau, sr) : 0;
  const tEnd = ts + 8 * tau;
  const pts: Array<[number, number]> = [];
  const lin: Array<[number, number]> = [];
  for (let k = 0; k <= 240; k++) {
    const t = (tEnd * k) / 240;
    pts.push([t * 1e9, sr ? stepWithSlew(vstep, tau, sr, t) : vstep * (1 - Math.exp(-t / tau))]);
    if (sr && ts > 0) lin.push([t * 1e9, vstep * (1 - Math.exp(-t / tau))]);
  }
  const tSettle = ts + tau * Math.log(1 / eps);
  const series = [
    { points: [[0, vstep * (1 + eps)], [tEnd * 1e9, vstep * (1 + eps)]] as Array<[number, number]>, color: 'var(--ok)', width: 1.2, dashed: true },
    { points: [[0, vstep * (1 - eps)], [tEnd * 1e9, vstep * (1 - eps)]] as Array<[number, number]>, color: 'var(--ok)', width: 1.2, dashed: true, label: `±${(eps * 100).toFixed(eps < 0.01 ? 1 : 0)}% band`, labelAt: 'start' as const },
    ...(lin.length ? [{ points: lin, color: 'var(--muted)', width: 1.4, dashed: true, label: 'no slewing', labelAt: 'end' as const }] : []),
    { points: pts, color: 'var(--signal)', width: 2.6 },
  ];
  return (
    <Plot
      title="Step response: exponential settling (and slewing first for a big step)"
      xRange={[0, tEnd * 1e9]}
      yRange={[0, vstep * 1.15]}
      xLabel="time (ns)"
      yLabel="Vout (V)"
      h={h}
      xFmt={(v) => v.toFixed(v < 10 ? 1 : 0)}
      yFmt={(v) => String(Number(v.toPrecision(3)))}
      series={series}
      guides={[
        ...(ts > 0 ? [{ axis: 'x' as const, at: ts * 1e9, label: 'slewing ends', color: 'var(--pmos)' }] : []),
        { axis: 'x', at: tSettle * 1e9, label: `settled: ${formatSI(tSettle, 's')}`, color: 'var(--ok)' },
      ]}
    />
  );
}

