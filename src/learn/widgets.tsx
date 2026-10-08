/**
 * Interactive pictures for the "picture" step of each lesson. Every number shown comes from src/physics.
 */
import { useState } from 'react';
import {
  ChannelCrossSection,
  flowStrength,
  IdVdsFamily,
  NmosRd,
  ParallelPair,
  PmosRd,
  ResStack,
  SmallSignalModel,
  TransferCurve,
} from '../circuits/figures';
import { Plot } from '../circuits/Plot';
import { WIDGETS2 } from './widgets2';
import { WIDGETS3 } from './widgets3';
import { WIDGETS4 } from './widgets4';
import { WIDGETS5 } from './widgets5';
import { WIDGETS6 } from './widgets6';
import { WIDGETS_D } from './widgetsD';
import {
  currentDivider,
  drainCurrent,
  gmFromIdVov,
  gmFromVov,
  idSat,
  intrinsicGain,
  overdrive,
  parallel,
  region,
  rO,
  type Region,
} from '../physics';
import { formatSI } from '../practice/units';
import { Readout, Slider } from '../ui/Slider';
import { Tex } from '../ui/Tex';

const V = (x: number) => formatSI(x, 'V');
const A = (x: number) => formatSI(x, 'A');
const Ohm = (x: number) => formatSI(x, 'Ω');
const S = (x: number) => formatSI(x, 'S');
const REG: Record<Region, string> = { off: 'OFF', triode: 'TRIODE', saturation: 'SATURATION' };
const tone = (r: Region) => (r === 'saturation' ? 'ok' : 'bad');

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

function NodeWalk(p: { vdd: number; r1: number; r2: number }) {
  const [vdd, setVdd] = useState(p.vdd);
  const [r1, setR1] = useState(p.r1);
  const [r2, setR2] = useState(p.r2);
  const i = vdd / (r1 + r2);
  return (
    <Panel figure={<ResStack vdd={vdd} r1={r1} r2={r2} />}>
      <Slider label="VDD" value={vdd} min={0.5} max={5} step={0.1} onChange={setVdd} format={V} />
      <Slider label="R1" value={r1} min={1e3} max={50e3} step={1e3} onChange={setR1} format={Ohm} />
      <Slider label="R2" value={r2} min={1e3} max={50e3} step={1e3} onChange={setR2} format={Ohm} />
      <Readout label="I = VDD/(R1+R2)" value={A(i)} tone="signal" />
      <Readout label="drop across R1" value={V(i * r1)} />
      <Readout label="VA = VDD − I·R1" value={V(vdd - i * r1)} />
      <Readout label="drop across R2 (= VA)" value={V(i * r2)} />
    </Panel>
  );
}

function ParallelSplit(p: { ra: number; rb: number; i: number }) {
  const [ra, setRa] = useState(p.ra);
  const [rb, setRb] = useState(p.rb);
  const ia = currentDivider(p.i, ra, rb);
  const share = ia / p.i;
  return (
    <Panel figure={<ParallelPair ra={ra} rb={rb} i={p.i} />}>
      <Slider label="RA" value={ra} min={1e3} max={100e3} step={1e3} onChange={setRa} format={Ohm} />
      <Slider label="RB" value={rb} min={1e3} max={100e3} step={1e3} onChange={setRb} format={Ohm} />
      <Readout label="RA ‖ RB" value={Ohm(parallel(ra, rb))} tone="signal" />
      <div className="splitbar" aria-label={`Current split: ${(share * 100).toFixed(0)}% through RA`}>
        <div className="splitbar-a" style={{ width: `${share * 100}%` }}>
          {share > 0.18 && `IA ${A(ia)}`}
        </div>
        <div className="splitbar-b">{1 - share > 0.18 && `IB ${A(p.i - ia)}`}</div>
      </div>
      <p className="small muted">The smaller resistor takes the bigger share.</p>
    </Panel>
  );
}

function Tap(p: { vth: number }) {
  const [vgs, setVgs] = useState(0.2);
  const vov = overdrive(vgs, p.vth);
  return (
    <Panel figure={<ChannelCrossSection vov={vov} vds={0.02} maxVov={0.8} />}>
      <Slider label="VGS" value={vgs} min={0} max={1.2} step={0.01} onChange={setVgs} format={V} />
      <Readout label="Vth" value={V(p.vth)} />
      <Readout label="Vov = VGS − Vth" value={V(vov)} tone={vov > 0 ? 'ok' : 'bad'} />
      <Readout label="state" value={vov > 0 ? 'ON: channel formed' : 'OFF: no channel'} tone={vov > 0 ? 'ok' : 'bad'} />
    </Panel>
  );
}

function Channel(p: { vov: number }) {
  const [vds, setVds] = useState(0.1);
  const r = region(p.vov, vds);
  return (
    <Panel figure={<ChannelCrossSection vov={p.vov} vds={vds} maxVov={0.5} />}>
      <Slider label="VDS" value={vds} min={0} max={1} step={0.01} onChange={setVds} format={V} />
      <Readout label="Vov (fixed)" value={V(p.vov)} />
      <Readout label="Vov − VDS (drain end)" value={V(Math.max(0, p.vov - vds))} />
      <Readout label="region" value={REG[r]} tone={tone(r)} />
      <p className="small muted">
        Fence: <Tex tex="V_{DS} \ge V_{ov}" /> ⟺ <Tex tex="V_D \ge V_G - V_{th}" />
      </p>
    </Panel>
  );
}

function Family(p: { kp: number; wl: number; lambda: number }) {
  const vth = 0.4;
  const [vgs, setVgs] = useState(0.7);
  const [vds, setVds] = useState(0.6);
  const vov = overdrive(vgs, vth);
  const id = drainCurrent(p.kp, p.wl, vov, vds, p.lambda);
  const r = region(vov, vds);
  const vovs = [0.1, 0.2, 0.3, 0.4].filter((v) => Math.abs(v - vov) > 0.02);
  return (
    <Panel figure={<IdVdsFamily kp={p.kp} wl={p.wl} lambda={p.lambda} vovs={vov > 0 ? [...vovs, vov].sort() : vovs} op={vov > 0 ? { vov, vds } : undefined} />}>
      <Slider label="VGS" value={vgs} min={0.3} max={0.85} step={0.01} onChange={setVgs} format={V} />
      <Slider label="VDS" value={vds} min={0} max={1.5} step={0.01} onChange={setVds} format={V} />
      <Readout label="Vov" value={V(vov)} />
      <Readout label="ID" value={A(id)} tone="signal" />
      <Readout label="region" value={REG[r]} tone={tone(r)} />
      <p className="small muted">µnCox = {Math.round(p.kp * 1e6)} µA/V², W/L = {p.wl}, λ = {p.lambda} V⁻¹, Vth = {vth} V</p>
    </Panel>
  );
}

function RecipeMini(p: { vdd: number; vth: number; kp: number; wl: number; rd: number }) {
  const [vg, setVg] = useState(0.7);
  const vov = overdrive(vg, p.vth);
  const idS = idSat(p.kp, p.wl, Math.max(0, vov));
  const vdS = p.vdd - idS * p.rd;
  const sat = vov > 0 && vdS >= vg - p.vth;
  const r: Region = vov <= 0 ? 'off' : sat ? 'saturation' : 'triode';
  return (
    <Panel figure={<NmosRd vdd={p.vdd} vg={vg} rd={p.rd} vd={vdS} region={r} current={vov > 0 ? A(idS) : undefined} flow={flowStrength(idS)} />}>
      <Slider label="VG" value={vg} min={0.3} max={1.0} step={0.01} onChange={setVg} format={V} />
      <ol className="recipe">
        <li>
          <b>Assume</b> saturation.
        </li>
        <li>
          <b>Solve</b>: Vov = {V(vov)}, ID = ½µCox(W/L)Vov² = {A(idS)}
        </li>
        <li>
          <b>Walk</b>: VD = VDD − ID·RD = {V(vdS)}
        </li>
        <li className={sat ? 'ok' : 'bad'}>
          <b>Check</b>: VD = {V(vdS)} {sat ? '≥' : '<'} VG − Vth = {V(vg - p.vth)} → {sat ? 'saturated ✓' : vov <= 0 ? 'OFF' : 'TRIODE ✗: the square law is wrong here'}
        </li>
      </ol>
    </Panel>
  );
}

function PmosFlip(p: { vdd: number; vth: number; kp: number; wl: number; rd: number }) {
  const [vg, setVg] = useState(0.9);
  const vov = overdrive(p.vdd - vg, p.vth);
  const id = idSat(p.kp, p.wl, Math.max(0, vov));
  const vd = id * p.rd;
  const sat = vov > 0 && vd <= vg + p.vth;
  const r: Region = vov <= 0 ? 'off' : sat ? 'saturation' : 'triode';
  return (
    <Panel figure={<PmosRd vdd={p.vdd} vg={vg} rd={p.rd} vd={vd} region={r} current={vov > 0 ? A(id) : undefined} flow={flowStrength(id)} />}>
      <Slider label="VG" value={vg} min={0.4} max={1.8} step={0.01} onChange={setVg} format={V} />
      <Readout label="|VGS| = VS − VG" value={V(p.vdd - vg)} />
      <Readout label="|Vov| = |VGS| − |Vth|" value={V(vov)} />
      <Readout label="ID" value={A(id)} tone="signal" />
      <Readout label="VD = ID·RD" value={V(vd)} />
      <Readout label="fence VD ≤ VG + |Vth|" value={sat ? `${V(vd)} ≤ ${V(vg + p.vth)} ✓` : vov <= 0 ? 'OFF' : 'TRIODE'} tone={tone(r)} />
    </Panel>
  );
}

function Tangent(p: { kp: number; wl: number; vth: number }) {
  const [vgs, setVgs] = useState(0.7);
  const vov = overdrive(vgs, p.vth);
  const id = idSat(p.kp, p.wl, vov);
  const gm = gmFromVov(p.kp, p.wl, vov);
  const pts: Array<[number, number]> = [];
  for (let n = 0; n <= 80; n++) {
    const v = (n / 80) * 1.0;
    pts.push([v, idSat(p.kp, p.wl, Math.max(0, v - p.vth)) * 1e6]);
  }
  const d = 0.12;
  const tan: Array<[number, number]> = [
    [vgs - d, (id - gm * d) * 1e6],
    [vgs + d, (id + gm * d) * 1e6],
  ];
  return (
    <Panel
      figure={
        <Plot
          title="ID versus VGS with the tangent at the bias point"
          xRange={[0, 1]}
          yRange={[0, idSat(p.kp, p.wl, 1 - p.vth) * 1e6 * 1.05]}
          xLabel="VGS (V)"
          yLabel="ID (µA)"
          xFmt={(v) => v.toFixed(1)}
          yFmt={(v) => v.toFixed(0)}
          series={[
            { points: pts, color: 'var(--ink)', width: 2.2 },
            { points: tan, color: 'var(--signal)', width: 2.2, dashed: true },
          ]}
          guides={[{ axis: 'x', at: p.vth, label: 'Vth' }]}
          markers={[{ x: vgs, y: id * 1e6, label: 'Q', labelPos: 'left' }]}
        />
      }
    >
      <Slider label="bias VGS (Q)" value={vgs} min={p.vth + 0.05} max={0.95} step={0.01} onChange={setVgs} format={V} />
      <Readout label="Vov" value={V(vov)} />
      <Readout label="ID at Q" value={A(id)} />
      <Readout label="slope = gm = µCox(W/L)Vov" value={S(gm)} tone="signal" />
      <Readout label="check: 2ID/Vov" value={S(gmFromIdVov(id, vov))} />
    </Panel>
  );
}

function RoSlope(p: { kp: number; wl: number; vov: number }) {
  const [lambda, setLambda] = useState(0.1);
  const id0 = idSat(p.kp, p.wl, p.vov);
  const pts: Array<[number, number]> = [];
  for (let n = 0; n <= 60; n++) {
    const vds = (n / 60) * 1.5;
    pts.push([vds, drainCurrent(p.kp, p.wl, p.vov, vds, lambda) * 1e6]);
  }
  const ro = rO(lambda, id0);
  return (
    <Panel
      figure={
        <div className="stack">
          <Plot
            title="One ID–VDS curve: the slope of the saturated part is 1/rO"
            xRange={[0, 1.5]}
            yRange={[0, id0 * 1e6 * 1.5]}
            xLabel="VDS (V)"
            yLabel="ID (µA)"
            h={200}
            xFmt={(v) => v.toFixed(1)}
            yFmt={(v) => v.toFixed(0)}
            series={[{ points: pts, color: 'var(--nmos)', width: 2.2 }]}
            guides={[{ axis: 'x', at: p.vov, label: 'VDS = Vov' }]}
          />
          <SmallSignalModel />
        </div>
      }
    >
      <Slider label="λ" value={lambda} min={0} max={0.3} step={0.01} onChange={setLambda} format={(v) => `${v.toFixed(2)} V⁻¹`} />
      <Readout label="ID (at VDS = 0)" value={A(id0)} />
      <Readout label="rO = 1/(λID)" value={Ohm(ro)} tone="signal" />
      <Readout label="gm·rO = 2/(λVov)" value={lambda === 0 ? '∞' : intrinsicGain(lambda, p.vov).toFixed(1)} />
    </Panel>
  );
}

function CsTransfer(p: { vdd: number; vth: number; kp: number; wl: number; rd: number }) {
  const [vin, setVin] = useState(0.7);
  const vov = overdrive(vin, p.vth);
  const id = idSat(p.kp, p.wl, Math.max(0, vov));
  const vd = p.vdd - id * p.rd;
  const sat = vov > 0 && vd >= vin - p.vth;
  const r: Region = vov <= 0 ? 'off' : sat ? 'saturation' : 'triode';
  const gm = vov > 0 ? gmFromVov(p.kp, p.wl, vov) : 0;
  return (
    <Panel figure={<TransferCurve vdd={p.vdd} vth={p.vth} kp={p.kp} wl={p.wl} rd={p.rd} vinQ={vin} />}>
      <Slider label="bias Vin" value={vin} min={0.2} max={1.4} step={0.01} onChange={setVin} format={V} />
      <Readout label="region" value={REG[r]} tone={tone(r)} />
      <Readout label="VD (= Vout at Q)" value={sat || vov <= 0 ? V(vov <= 0 ? p.vdd : vd) : 'triode: square law invalid'} />
      <Readout label="gm" value={S(gm)} />
      <Readout label="Av = −gm·RD (λ = 0)" value={sat ? (-gm * p.rd).toFixed(2) : '—'} tone="signal" />
      <p className="small muted">The dashed tangent’s slope equals −gm·RD while saturated.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS: Record<string, (p: any) => React.ReactElement> = {
  nodeWalk: NodeWalk,
  parallelSplit: ParallelSplit,
  tap: Tap,
  channel: Channel,
  family: Family,
  recipeMini: RecipeMini,
  pmosFlip: PmosFlip,
  tangent: Tangent,
  roSlope: RoSlope,
  csTransfer: CsTransfer,
  ...WIDGETS2,
  ...WIDGETS3,
  ...WIDGETS4,
  ...WIDGETS5,
  ...WIDGETS6,
  ...WIDGETS_D,
};
