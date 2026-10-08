/**
 * Milestone 2 figures (U6–U9): impedance rules, current mirror, CS with every load, follower, common gate,
 * cascode and the telescopic op amp. Multi-device figures use <Schematic>, so every transistor shows its
 * live region and can be inspected; node voltages come from src/physics/nodes.ts.
 *
 * Layout rules (no overlaps): device name/badge/current on the side away from the gate; resistor labels on
 * the gate side; node pills on the free wire side; outputs leave horizontally between devices.
 */
import type { ReactNode } from 'react';
import { cascodeNodes, telescopicNodes, type NodeDevice, type OpPoint, type Process } from '../physics';
import { formatSI } from '../practice/units';
import { flowStrength } from './figures';
import {
  Canvas,
  CurrentArrow,
  CurrentSource,
  Dot,
  FlowDots,
  Ground,
  Label,
  Nmos,
  Pill,
  Pmos,
  Rail,
  Resistor,
  Sym,
  Terminal,
  VoltageTag,
  Wire,
} from './primitives';
import { fromNode, Schematic, simNode, stackFlow, type DevState } from './schematic';

const V = (x: number) => formatSI(x, 'V');
const R = (x: number) => (Number.isFinite(x) ? formatSI(x, 'Ω') : '∞');
const I = (x: number) => formatSI(x, 'A');

function states(devs: Record<string, NodeDevice>, names: Record<string, [string, string?]>): Record<string, DevState> {
  const out: Record<string, DevState> = {};
  for (const [k, [name, role]] of Object.entries(names)) if (devs[k]) out[k] = fromNode(name, devs[k], role);
  return out;
}

// ─── U6: the three impedance rules ─────────────────────────────────────────

export type Terminal3 = 'gate' | 'drain' | 'source';

/**
 * Looking into one terminal of a transistor. Dots flow in from the test terminal: the smaller the
 * resistance, the more current a test voltage pushes in (so the faster the flow).
 */
export function ImpedanceFig({ terminal, rs = 0, rd = 0, r, highlight }: { terminal: Terminal3; rs?: number; rd?: number; r: number; highlight?: string[] }) {
  const x = 180, y = 132;
  const strength = terminal === 'gate' ? 0 : Math.max(0.12, Math.min(1, 0.9 - 0.18 * Math.log10(Math.max(r, 1) / 1e3)));
  const flowPath: Array<[number, number]> =
    terminal === 'drain'
      ? [[x, 58], ...stackFlow(x, 58, rs > 0 ? 244 : 186, [{ y }]).slice(1)]
      : terminal === 'source'
        ? [[x, 214], [x, y + 12], [x - 8, y + 12], [x - 8, y - 12], [x, y - 12], [x, rd > 0 ? 40 : 60]]
        : [];
  return (
    <Canvas w={380} h={270} title={`Looking into the ${terminal} of a transistor`} highlight={highlight}>
      {/* drain side */}
      {terminal === 'drain' ? (
        <>
          <Wire points={[[x, y - 30], [x, 58]]} id="term" />
          <Terminal x={x} y={58} />
          <Pill x={x + 14} y={50} text={`R into drain = ${R(r)}`} fill="var(--signal)" color="var(--signal-ink)" border="transparent" />
          <CurrentArrow x={x} y={80} dir="down" />
        </>
      ) : rd > 0 ? (
        <>
          <Rail x1={x - 30} x2={x + 30} y={30} label="VDD (AC ground)" />
          <Resistor x={x} y1={30} y2={y - 30} label={<Sym base="R" sub="D" />} value={R(rd)} labelSide="left" id="rd" />
        </>
      ) : (
        <>
          <Rail x1={x - 30} x2={x + 30} y={60} label="VDD (AC ground)" />
          <Wire points={[[x, 60], [x, y - 30]]} />
        </>
      )}
      <Nmos x={x} y={y} name="M1" id="m1" />
      {/* gate side */}
      {terminal === 'gate' ? (
        <>
          <Wire points={[[x - 30, y], [80, y]]} id="term" />
          <Terminal x={80} y={y} />
          <Pill x={72} y={y - 24} text="R into gate = ∞" anchor="start" fill="var(--signal)" color="var(--signal-ink)" border="transparent" />
          <Label x={80} y={y + 26} text="no current can enter" size={12} color="var(--ink-2)" />
        </>
      ) : (
        <>
          <Wire points={[[x - 30, y], [104, y], [104, y + 20]]} />
          <Ground x={104} y={y + 20} />
          <Label x={96} y={y - 8} text="gate fixed" anchor="end" size={12} color="var(--ink-2)" />
        </>
      )}
      {/* source side */}
      {terminal === 'source' ? (
        <>
          <Wire points={[[x, y + 30], [x, 214]]} id="term" />
          <Terminal x={x} y={214} />
          <Pill x={x + 14} y={222} text={`R into source = ${R(r)}`} fill="var(--signal)" color="var(--signal-ink)" border="transparent" />
          <CurrentArrow x={x} y={196} dir="up" />
        </>
      ) : rs > 0 ? (
        <>
          <Resistor x={x} y1={y + 30} y2={244} label={<Sym base="R" sub="S" />} value={R(rs)} labelSide="left" id="rs" />
          <Ground x={x} y={244} />
        </>
      ) : (
        <>
          <Wire points={[[x, y + 30], [x, 186]]} />
          <Ground x={x} y={186} />
        </>
      )}
      {flowPath.length > 0 && <FlowDots points={flowPath} strength={strength} spacing={18} />}
    </Canvas>
  );
}

// ─── U6: current mirror ────────────────────────────────────────────────────

/** IREF into diode-connected M1; M2 copies it, scaled by the W/L ratio. */
export function MirrorFig({ iref, wlRef, wlOut, iout, vgs, highlight }: { iref: number; wlRef: number; wlOut: number; iout: number; vgs?: number; highlight?: string[] }) {
  const x1 = 110, x2 = 260, y = 160;
  return (
    <Canvas w={380} h={236} title="Current mirror: diode-connected M1 sets VGS, M2 copies the current" highlight={highlight}>
      <Rail x1={80} x2={140} y={30} label="VDD" labelSide="left" />
      <CurrentSource x={x1} y1={30} y2={y - 30} label={<Sym base="I" sub="REF" />} value={I(iref)} labelSide="left" id="iref" />
      <Nmos x={x1} y={y} name="M1" flip diode id="m1" />
      <Nmos x={x2} y={y} name="M2" id="m2" />
      <Wire points={[[x1 + 30, y], [x2 - 30, y]]} id="gate" />
      <Dot x={x1 + 30} y={y} />
      {vgs !== undefined && <VoltageTag x={(x1 + x2) / 2} y={y + 16} v={`VGS ${V(vgs)}`} anchor="middle" id="gate" />}
      <Wire points={[[x1, y + 30], [x1, 206], [x2, 206], [x2, y + 30]]} />
      <Ground x={(x1 + x2) / 2} y={206} />
      <Wire points={[[x2, y - 30], [x2, 60]]} id="out" />
      <Terminal x={x2} y={60} />
      <Pill x={x2 + 14} y={54} text={`Iout = ${I(iout)}`} fill="var(--signal)" color="var(--signal-ink)" border="transparent" />
      <Label x={x2 + 14} y={82} text={`(W/L)₂/(W/L)₁ = ${formatNum(wlOut / wlRef)}`} size={12} mono color="var(--ink-2)" />
      <FlowDots points={stackFlow(x1, 32, 206, [{ y, flip: true }])} strength={flowStrength(iref)} />
      <FlowDots points={stackFlow(x2, 62, 206, [{ y }])} strength={flowStrength(iout)} />
    </Canvas>
  );
}

function formatNum(x: number): string {
  return Number.isInteger(x) ? String(x) : x.toPrecision(3);
}

// ─── U7: common source with every load ─────────────────────────────────────

export type CsLoadKind = 'resistor' | 'diode' | 'current' | 'triode' | 'active' | 'degenerated';

export const CS_LOAD_LABEL: Record<CsLoadKind, string> = {
  resistor: 'Resistor RD',
  diode: 'Diode (PMOS)',
  current: 'Current source',
  triode: 'Triode PMOS',
  active: 'Active (CMOS)',
  degenerated: 'RD + degeneration RS',
};

/**
 * CS stage M1 with the chosen load. `devs` holds the live states (from the CS lab's solve); without it the
 * figure is drawn with names only.
 */
export function CsLoadFig({
  load,
  vdd = 1.8,
  vin,
  vout,
  id,
  rd,
  rs,
  devs,
  highlight,
  inspector = true,
}: {
  load: CsLoadKind;
  vdd?: number;
  vin?: number;
  vout?: number;
  id?: number;
  rd?: number;
  rs?: number;
  devs?: Record<string, DevState>;
  highlight?: string[];
  inspector?: boolean;
}) {
  const x = 190, yOut = 128, y1 = 178, yP = 72;
  const hasP = load !== 'resistor' && load !== 'degenerated';
  const yBot = load === 'degenerated' ? 262 : y1 + 30;
  const flow = id !== undefined ? flowStrength(id) : 0.45;
  const body: ReactNode = (
    <>
      <Rail x1={x - 30} x2={x + 30} y={30} label={`VDD${vdd ? ` = ${V(vdd)}` : ''}`} />
      {hasP ? (
        <>
          <Wire points={[[x, 30], [x, yP - 30]]} />
          <Pmos x={x} y={yP} name="M2" id="m2" diode={load === 'diode'} />
          <Wire points={[[x, yP + 30], [x, y1 - 30]]} id="out" />
          {load === 'current' && (
            <>
              <Wire points={[[x - 30, yP], [110, yP]]} />
              <Terminal x={110} y={yP} />
              <Label x={102} y={yP + 4} text="Vb" anchor="end" weight={600} />
            </>
          )}
          {load === 'triode' && (
            <>
              <Wire points={[[x - 30, yP], [120, yP], [120, yP + 16]]} />
              <Ground x={120} y={yP + 16} />
              <Label x={112} y={yP - 6} text="gate at 0 V" anchor="end" size={12} color="var(--ink-2)" />
            </>
          )}
          {load === 'active' && (
            <>
              <Wire points={[[x - 30, yP], [110, yP], [110, y1]]} id="gate" />
              <Dot x={110} y={y1} />
            </>
          )}
        </>
      ) : (
        <>
          <Resistor x={x} y1={30} y2={yOut} label={<Sym base="R" sub="D" />} value={rd !== undefined ? R(rd) : undefined} labelSide="left" id="rd" />
          <Wire points={[[x, yOut], [x, y1 - 30]]} />
        </>
      )}
      <Nmos x={x} y={y1} name="M1" id="m1" />
      <Wire points={[[x - 30, y1], [70, y1]]} id="gate" />
      <Terminal x={70} y={y1} />
      <Label x={70} y={y1 - 14} text={vin !== undefined ? `Vin ${V(vin)}` : 'Vin'} anchor="middle" weight={600} />
      {load === 'degenerated' ? (
        <>
          <Resistor x={x} y1={y1 + 30} y2={yBot} label={<Sym base="R" sub="S" />} value={rs !== undefined ? R(rs) : undefined} labelSide="left" id="rs" />
          <Ground x={x} y={yBot} />
        </>
      ) : (
        <Ground x={x} y={yBot} />
      )}
      <Dot x={x} y={yOut} id="out" />
      <Wire points={[[x, yOut], [320, yOut]]} id="out" />
      <Terminal x={320} y={yOut} />
      <Label x={328} y={yOut + 4} text="Vout" weight={600} />
      {vout !== undefined && <VoltageTag x={262} y={yOut - 16} v={V(vout)} anchor="middle" id="out" />}
      <FlowDots points={hasP ? stackFlow(x, 32, yBot, [{ y: yP }, { y: y1 }]) : stackFlow(x, 32, yBot, [{ y: y1 }])} strength={flow} />
    </>
  );
  const h = load === 'degenerated' ? 290 : 240;
  const title = `Common-source stage with ${CS_LOAD_LABEL[load]} load`;
  if (devs) {
    return (
      <Schematic w={380} h={h} title={title} states={devs} highlight={highlight} inspector={inspector}>
        {body}
      </Schematic>
    );
  }
  return (
    <Canvas w={380} h={h} title={title} highlight={highlight}>
      {body}
    </Canvas>
  );
}

// ─── U8: source follower and common gate ───────────────────────────────────

export function FollowerFig({ vin, vout, i, highlight }: { vin?: number; vout?: number; i?: number; highlight?: string[] }) {
  const x = 190, y = 100;
  return (
    <Canvas w={380} h={250} title="Source follower: input on the gate, output on the source" highlight={highlight}>
      <Rail x1={x - 30} x2={x + 30} y={30} label="VDD" />
      <Wire points={[[x, 30], [x, y - 30]]} />
      <Nmos x={x} y={y} name="M1" id="m1" />
      <Wire points={[[x - 30, y], [80, y]]} id="gate" />
      <Terminal x={80} y={y} />
      <Label x={80} y={y - 14} text={vin !== undefined ? `Vin ${V(vin)}` : 'Vin'} anchor="middle" weight={600} />
      <Wire points={[[x, y + 30], [x, 150]]} id="out" />
      <Dot x={x} y={150} id="out" />
      <Wire points={[[x, 150], [320, 150]]} id="out" />
      <Terminal x={320} y={150} />
      <Label x={328} y={154} text="Vout" weight={600} />
      {vout !== undefined && <VoltageTag x={262} y={134} v={V(vout)} anchor="middle" id="out" />}
      <CurrentSource x={x} y1={150} y2={220} label="I" value={i !== undefined ? I(i) : undefined} labelSide="left" id="isrc" />
      <Ground x={x} y={220} />
      <FlowDots points={stackFlow(x, 32, 220, [{ y }])} strength={i ? flowStrength(i) : 0.45} />
    </Canvas>
  );
}

export function CommonGateFig({ vb, vout, vs, i, rd, highlight }: { vb?: number; vout?: number; vs?: number; i?: number; rd?: number; highlight?: string[] }) {
  const x = 190, y = 132;
  return (
    <Canvas w={380} h={262} title="Common gate: input on the source, output on the drain, gate fixed" highlight={highlight}>
      <Rail x1={x - 30} x2={x + 30} y={30} label="VDD" />
      <Resistor x={x} y1={30} y2={92} label={<Sym base="R" sub="D" />} value={rd !== undefined ? R(rd) : undefined} labelSide="left" id="rd" />
      <Wire points={[[x, 92], [x, y - 30]]} />
      <Dot x={x} y={92} id="out" />
      <Wire points={[[x, 92], [320, 92]]} id="out" />
      <Terminal x={320} y={92} />
      <Label x={328} y={96} text="Vout" weight={600} />
      {vout !== undefined && <VoltageTag x={262} y={76} v={V(vout)} anchor="middle" id="out" />}
      <Nmos x={x} y={y} name="M1" id="m1" />
      <Wire points={[[x - 30, y], [100, y]]} />
      <Terminal x={100} y={y} />
      <Label x={92} y={y + 4} text={vb !== undefined ? `Vb ${V(vb)}` : 'Vb'} anchor="end" weight={600} />
      <Wire points={[[x, y + 30], [x, 184]]} id="in" />
      <Dot x={x} y={184} id="in" />
      <Wire points={[[x, 184], [320, 184]]} id="in" />
      <Terminal x={320} y={184} />
      <Label x={328} y={188} text="Vin" weight={600} />
      {vs !== undefined && <VoltageTag x={262} y={200} v={V(vs)} anchor="middle" id="in" />}
      <CurrentSource x={x} y1={184} y2={240} label="I" value={i !== undefined ? I(i) : undefined} labelSide="left" id="isrc" />
      <Ground x={x} y={240} />
      <FlowDots points={stackFlow(x, 32, 240, [{ y }])} strength={i ? flowStrength(i) : 0.45} />
    </Canvas>
  );
}

// ─── U9: cascode ───────────────────────────────────────────────────────────

export type CascodeLoad = 'resistor' | 'current' | 'cascode';

/** M1 input + M2 cascode, with a resistor, a PMOS current source, or a PMOS cascode load. */
export function CascodeFig({
  load,
  proc,
  id,
  wl,
  vb1,
  vout,
  rd,
  highlight,
  inspector = true,
}: {
  load: CascodeLoad;
  proc: Process;
  id: number;
  wl: number;
  vb1: number;
  vout: number;
  rd?: number;
  highlight?: string[];
  inspector?: boolean;
}) {
  const n = cascodeNodes({ proc, id, wl1: wl, wl2: wl, vb1, vout, load, wlP: wl * (proc.kpn / proc.kpp) });
  const devs = states(n.devices, { m1: ['M1', 'input (CS)'], m2: ['M2', 'cascode (CG)'], m3: ['M3', load === 'cascode' ? 'load cascode' : 'current source'], m4: ['M4', 'current source'] });
  const x = 190;
  const yM4 = 64, yM3 = 124, yOut = 168, yM2 = 212, yX = 250, yM1 = 290, yBot = 320;
  const devY = [{ y: yM2 }, { y: yM1 }, ...(load === 'current' ? [{ y: yM3 }] : load === 'cascode' ? [{ y: yM3 }, { y: yM4 }] : [])];
  return (
    <Schematic w={380} h={344} title={`Cascode amplifier with ${load === 'resistor' ? 'resistor' : load === 'current' ? 'current-source' : 'cascode'} load`} states={devs} highlight={highlight} inspector={inspector}>
      <Rail x1={x - 30} x2={x + 30} y={30} label={`VDD = ${V(proc.vdd)}`} />
      {load === 'resistor' && <Resistor x={x} y1={30} y2={yOut} label={<Sym base="R" sub="D" />} value={rd !== undefined ? R(rd) : undefined} labelSide="left" id="rd" />}
      {load === 'current' && (
        <>
          <Wire points={[[x, 30], [x, yM3 - 30]]} />
          <Pmos x={x} y={yM3} id="m3" />
          <Wire points={[[x - 30, yM3], [120, yM3]]} />
          <Label x={112} y={yM3 + 4} text="Vb3" anchor="end" weight={600} />
          <Wire points={[[x, yM3 + 30], [x, yOut]]} />
        </>
      )}
      {load === 'cascode' && (
        <>
          <Wire points={[[x, 30], [x, yM4 - 30]]} />
          <Pmos x={x} y={yM4} id="m4" />
          <Wire points={[[x - 30, yM4], [120, yM4]]} />
          <Label x={112} y={yM4 + 4} text="Vb3" anchor="end" weight={600} />
          <Pmos x={x} y={yM3} id="m3" />
          <Wire points={[[x - 30, yM3], [120, yM3]]} />
          <Label x={112} y={yM3 + 4} text="Vb2" anchor="end" weight={600} />
          <Wire points={[[x, yM3 + 30], [x, yOut]]} />
          {n.vY !== undefined && <VoltageTag x={x + 70} y={(yM4 + yM3) / 2} v={V(n.vY)} anchor="middle" />}
        </>
      )}
      <Dot x={x} y={yOut} id="out" />
      <Wire points={[[x, yOut], [320, yOut]]} id="out" />
      <Terminal x={320} y={yOut} />
      <Label x={328} y={yOut + 4} text="Vout" weight={600} />
      <VoltageTag x={270} y={yOut - 16} v={V(vout)} anchor="middle" id="out" />
      <Wire points={[[x, yOut], [x, yM2 - 30]]} />
      <Nmos x={x} y={yM2} id="m2" />
      <Wire points={[[x - 30, yM2], [110, yM2]]} />
      <Terminal x={110} y={yM2} />
      <Label x={102} y={yM2 + 4} text={`Vb1 ${V(vb1)}`} anchor="end" weight={600} />
      <Dot x={x} y={yX} id="x" />
      <Label x={x - 10} y={yX + 4} text="X" anchor="end" weight={700} />
      <VoltageTag x={x + 70} y={yX} v={V(n.vX)} anchor="middle" id="x" />
      <Nmos x={x} y={yM1} id="m1" />
      <Wire points={[[x - 30, yM1], [100, yM1]]} id="gate" />
      <Terminal x={100} y={yM1} />
      <Label x={92} y={yM1 + 4} text="Vin" anchor="end" weight={600} />
      <Ground x={x} y={yBot} />
      <FlowDots points={stackFlow(x, 32, yBot, devY)} strength={flowStrength(id)} />
    </Schematic>
  );
}

// ─── U9 / L2: telescopic op amp (Razavi Fig. 9.8, Ex 9.7 numbering) ─────────

export function TelescopicFig({
  proc,
  iss,
  wlN,
  wlP,
  wl9,
  vinCm,
  vb1,
  vb2,
  vout,
  highlight,
  inspector = true,
  sim,
}: {
  proc: Process;
  iss: number;
  wlN: number;
  wlP: number;
  wl9: number;
  vinCm: number;
  vb1: number;
  vb2: number;
  vout: number;
  highlight?: string[];
  inspector?: boolean;
  /** Simulated operating point (Cascode lab): nodes p, x1, x2, y1, y2, o1, o2, vb3, vbt and M1–M9. */
  sim?: OpPoint;
}) {
  const hand = telescopicNodes({ proc, iss, wlN, wlP, wl9, vinCm, vb1, vb2, vout });
  const n = sim
    ? {
        ...hand,
        vP: sim.v.p,
        vX: (sim.v.x1 + sim.v.x2) / 2,
        vY: (sim.v.y1 + sim.v.y2) / 2,
        vb3: sim.v.vb3,
        vbTail: sim.v.vbt,
        devices: Object.fromEntries(['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'].map((k) => [k, simNode(sim.mos[k.toUpperCase()])])) as typeof hand.devices,
      }
    : hand;
  const devs = states(n.devices, {
    m1: ['M1', 'input'],
    m2: ['M2', 'input'],
    m3: ['M3', 'NMOS cascode'],
    m4: ['M4', 'NMOS cascode'],
    m5: ['M5', 'PMOS cascode'],
    m6: ['M6', 'PMOS cascode'],
    m7: ['M7', 'current source'],
    m8: ['M8', 'current source'],
    m9: ['M9', 'tail source'],
  });
  const xL = 140, xR = 360, xm = 250;
  const y7 = 72, y5 = 138, yO = 184, y3 = 228, yX = 262, y1 = 296, yP = 346, y9 = 388;
  const gateL = (y: number, text: string, id?: string) => (
    <>
      <Wire points={[[xL - 30, y], [84, y]]} id={id} />
      <Label x={78} y={y + 4} text={text} anchor="end" weight={600} size={12} />
    </>
  );
  const gateR = (y: number, text: string, id?: string) => (
    <>
      <Wire points={[[xR + 30, y], [416, y]]} id={id} />
      <Label x={422} y={y + 4} text={text} weight={600} size={12} />
    </>
  );
  const f = flowStrength(iss / 2);
  const col = (x: number, flip: boolean) => stackFlow(x, 32, yP, [y7, y5, y3, y1].map((y) => ({ y, flip })));
  return (
    <Schematic w={500} h={430} title="Telescopic cascode op amp, fully differential (M1–M9)" states={devs} highlight={highlight} annotate="region" maxWidth={640} inspector={inspector}>
      <Rail x1={xL - 20} x2={xR + 20} y={30} label={`VDD ${V(proc.vdd)}`} />
      {[xL, xR].map((x) => (
        <Wire key={x} points={[[x, 30], [x, y7 - 30]]} />
      ))}
      <Pmos x={xL} y={y7} id="m7" />
      <Pmos x={xR} y={y7} id="m8" flip />
      {gateL(y7, `Vb3 ${V(n.vb3)}`)}
      {gateR(y7, 'Vb3')}
      <Pmos x={xL} y={y5} id="m5" />
      <Pmos x={xR} y={y5} id="m6" flip />
      {gateL(y5, `Vb2 ${V(vb2)}`)}
      {gateR(y5, 'Vb2')}
      <VoltageTag x={xm} y={(y7 + y5) / 2} v={V(n.vY)} anchor="middle" />
      {[xL, xR].map((x) => (
        <Wire key={`o${x}`} points={[[x, y5 + 30], [x, y3 - 30]]} id="out" />
      ))}
      <Dot x={xL} y={yO} id="out" />
      <Dot x={xR} y={yO} id="out" />
      <Wire points={[[xL, yO], [70, yO]]} id="out" />
      <Terminal x={70} y={yO} />
      <Label x={60} y={yO + 4} text="Vout1" anchor="end" weight={600} size={12} />
      <Wire points={[[xR, yO], [430, yO]]} id="out" />
      <Terminal x={430} y={yO} />
      <Label x={440} y={yO + 4} text="Vout2" weight={600} size={12} />
      <VoltageTag x={xm} y={yO} v={sim ? `${V(sim.v.o1)} / ${V(sim.v.o2)}` : V(vout)} anchor="middle" id="out" />
      <Nmos x={xL} y={y3} id="m3" />
      <Nmos x={xR} y={y3} id="m4" flip />
      {gateL(y3, `Vb1 ${V(vb1)}`)}
      {gateR(y3, 'Vb1')}
      <VoltageTag x={xm} y={yX} v={`X ${V(n.vX)}`} anchor="middle" id="x" />
      <Nmos x={xL} y={y1} id="m1" />
      <Nmos x={xR} y={y1} id="m2" flip />
      {gateL(y1, `Vin ${V(vinCm)}`, 'gate')}
      {gateR(y1, 'Vin', 'gate')}
      <Wire points={[[xL, y1 + 30], [xL, yP], [xR, yP], [xR, y1 + 30]]} />
      <Dot x={xm} y={yP} id="p" />
      <Wire points={[[xm, yP], [xm, y9 - 30]]} />
      <VoltageTag x={xm - 12} y={yP + 18} v={`P ${V(n.vP)}`} anchor="end" id="p" />
      <Nmos x={xm} y={y9} id="m9" />
      <Wire points={[[xm - 30, y9], [196, y9]]} />
      <Label x={190} y={y9 + 4} text={`Vb ${V(n.vbTail)}`} anchor="end" weight={600} size={12} />
      <Ground x={xm} y={y9 + 30} />
      <FlowDots points={col(xL, false)} strength={f} />
      <FlowDots points={col(xR, true)} strength={f} />
      <FlowDots points={stackFlow(xm, yP, y9 + 30, [{ y: y9 }])} strength={flowStrength(iss)} />
    </Schematic>
  );
}

// ─── Comparison bars on a log scale (impedance rules, the load trap) ───────

export interface BarItem {
  label: string;
  value: number;
  tone?: 'n' | 'p' | 'signal' | 'muted' | 'ok' | 'bad';
  note?: string;
}

const BAR_COLOR: Record<NonNullable<BarItem['tone']>, string> = {
  n: 'var(--nmos)',
  p: 'var(--pmos)',
  signal: 'var(--signal)',
  muted: 'var(--muted)',
  ok: 'var(--ok)',
  bad: 'var(--bad)',
};

/** Horizontal bars on a log axis from `lo` to `hi` (Ω by default); ∞ is drawn as an arrow off the end. */
export function LogBars({ items, lo = 100, hi = 1e9, unit = 'Ω', title = 'Resistances on a log scale' }: { items: BarItem[]; lo?: number; hi?: number; unit?: 'Ω' | 'V/V'; title?: string }) {
  const x0 = 130, x1 = 340, rowH = 34, top = 18;
  const sx = (v: number) => x0 + ((Math.log10(Math.max(lo, Math.min(hi, v))) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * (x1 - x0);
  const h = top + items.length * rowH + 26;
  const decades: number[] = [];
  for (let e = Math.ceil(Math.log10(lo)); e <= Math.floor(Math.log10(hi)); e++) decades.push(10 ** e);
  const every = decades.length > 6 ? 2 : 1;
  const fmt = (v: number) => (unit === 'Ω' ? (Number.isFinite(v) ? formatSI(v, 'Ω') : '∞') : Number.isFinite(v) ? Math.abs(v).toPrecision(3) : '∞');
  return (
    <Canvas w={420} h={h} title={title} maxWidth={520}>
      {decades.map((d) => (
        <g key={d}>
          <line x1={sx(d)} x2={sx(d)} y1={top - 6} y2={h - 22} stroke="var(--line)" strokeWidth={1} />
          {decades.indexOf(d) % every === 0 && <Label x={sx(d)} y={h - 8} text={unit === 'Ω' ? formatSI(d, 'Ω', 1) : String(d)} anchor="middle" size={10} mono color="var(--muted)" />}
        </g>
      ))}
      {items.map((it, i) => {
        const y = top + i * rowH + 8;
        const inf = !Number.isFinite(it.value);
        const w = inf ? x1 - x0 + 14 : Math.max(2, sx(it.value) - x0);
        const c = BAR_COLOR[it.tone ?? 'n'];
        return (
          <g key={it.label}>
            <Label x={x0 - 8} y={y + 12} text={it.label} anchor="end" size={12} weight={600} />
            <rect x={x0} y={y} width={w} height={16} rx={4} fill={c} opacity={0.85} />
            {inf && <polygon points={`${x0 + w},${y - 3} ${x0 + w + 10},${y + 8} ${x0 + w},${y + 19}`} fill={c} />}
            <Label x={Math.min(x1 + 30, x0 + w + (inf ? 14 : 6))} y={y + 12} text={fmt(it.value)} size={11} mono weight={600} color={c} />
          </g>
        );
      })}
    </Canvas>
  );
}
