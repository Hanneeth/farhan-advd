/**
 * Interactive pictures for the Milestone 2 lessons (U6–U9). Every number comes from src/physics.
 */
import { useState } from 'react';
import { CascodeFig, CommonGateFig, CsLoadFig, FollowerFig, ImpedanceFig, LogBars, MirrorFig, TelescopicFig, type BarItem } from '../circuits/figures2';
import { Plot } from '../circuits/Plot';
import { VoltageLadder } from '../circuits/schematic';
import {
  cascodeRoutApprox,
  cgGain,
  csActiveLoad,
  csCurrentSourceLoad,
  csDegenerated,
  csDiodeLoad,
  csResistive,
  EX_9_7,
  ex97,
  followerGain,
  followerRout,
  gmDegenerated,
  gmFromIdVov,
  idTriode,
  mirrorCurrent,
  parallel,
  rIntoDrain,
  rIntoSource,
  rO,
  SET_B,
  telescopicNodes,
  vovFromId,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';

const V = (x: number) => formatSI(x, 'V');
const A = (x: number) => formatSI(x, 'A');
const Ohm = (x: number) => (Number.isFinite(x) ? formatSI(x, 'Ω') : '∞');
const S = (x: number) => formatSI(x, 'S');
const g3 = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(3));

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

// ─── U6 ────────────────────────────────────────────────────────────────────

function ImpedanceMini() {
  const [terminal, setTerminal] = useState<'gate' | 'drain' | 'source'>('source');
  const [id, setId] = useState(100e-6);
  const [lambda, setLambda] = useState(0.1);
  const [rx, setRx] = useState(10e3);
  const vov = 0.2;
  const gm = gmFromIdVov(id, vov);
  const ro = rO(lambda, id);
  const rDrain = rIntoDrain({ gm, rO: ro, rs: rx });
  const rSource = rIntoSource({ gm, rO: ro, rd: rx });
  const r = terminal === 'gate' ? Infinity : terminal === 'drain' ? rDrain : rSource;
  const bars: BarItem[] = [
    { label: 'into gate', value: Infinity, tone: terminal === 'gate' ? 'signal' : 'muted' },
    { label: `into drain`, value: rDrain, tone: terminal === 'drain' ? 'signal' : 'muted' },
    { label: 'rO alone', value: ro, tone: 'muted' },
    { label: 'into source', value: rSource, tone: terminal === 'source' ? 'signal' : 'muted' },
    { label: '1/gm alone', value: 1 / gm, tone: 'muted' },
  ];
  return (
    <Panel
      figure={
        <div className="stack">
          <ImpedanceFig terminal={terminal} rs={terminal === 'drain' ? rx : 0} rd={terminal === 'source' ? rx : 0} r={r} />
          <LogBars items={bars} lo={100} hi={1e10} title="Gate, drain and source resistances compared on a log scale" />
        </div>
      }
    >
      <Seg
        label="Terminal"
        value={terminal}
        onChange={setTerminal}
        options={[
          { value: 'gate', label: 'Gate' },
          { value: 'drain', label: 'Drain' },
          { value: 'source', label: 'Source' },
        ]}
      />
      <Slider label="ID" value={id} min={20e-6} max={500e-6} step={10e-6} onChange={setId} format={A} />
      <Slider label="λ" value={lambda} min={0.02} max={0.3} step={0.01} onChange={setLambda} format={(v) => `${v.toFixed(2)} V⁻¹`} />
      {terminal !== 'gate' && <Slider label={terminal === 'drain' ? 'RS under the source' : 'RD on the drain'} value={rx} min={0} max={50e3} step={1e3} onChange={setRx} format={Ohm} />}
      <Readout label="gm (Vov = 0.2 V)" value={S(gm)} />
      <Readout label="rO = 1/(λID)" value={Ohm(ro)} />
      <Readout label={`R into ${terminal}`} value={Ohm(r)} tone="signal" />
      <p className="small muted">
        {terminal === 'gate'
          ? 'The gate is a capacitor plate: no DC current, infinite resistance.'
          : terminal === 'drain'
            ? 'RS is multiplied by about gm·rO: up multiplies.'
            : 'RD is divided by gm·rO, leaving about 1/gm: down divides.'}
      </p>
    </Panel>
  );
}

function MirrorMini() {
  const [iref, setIref] = useState(20e-6);
  const [ratio, setRatio] = useState(2);
  const [vout, setVout] = useState(0.9);
  const kp = 200e-6, vth = 0.4, wlRef = 10;
  const vov = vovFromId(iref, kp, wlRef);
  const wlOut = wlRef * ratio;
  const sat = vout >= vov;
  const iout = sat ? mirrorCurrent(iref, wlOut, wlRef) : idTriode(kp, wlOut, vov, Math.max(0, vout));
  return (
    <Panel figure={<MirrorFig iref={iref} wlRef={wlRef} wlOut={wlOut} iout={iout} vgs={vth + vov} />}>
      <Slider label="IREF" value={iref} min={5e-6} max={100e-6} step={5e-6} onChange={setIref} format={A} />
      <Slider label="(W/L)₂ ÷ (W/L)₁" value={ratio} min={0.5} max={4} step={0.5} onChange={setRatio} format={(v) => `${v}×`} />
      <Slider label="Vout (M2's drain)" value={vout} min={0} max={1.8} step={0.01} onChange={setVout} format={V} />
      <Readout label="VGS = Vth + Vov (the diode's cost)" value={V(vth + vov)} />
      <Readout label="Vout,min = Vov" value={V(vov)} />
      <Readout label="M2" value={sat ? 'SATURATED' : 'TRIODE'} tone={sat ? 'ok' : 'bad'} />
      <Readout label="Iout" value={A(iout)} tone="signal" />
      <p className="small muted">{sat ? 'Iout = IREF × size ratio, whatever Vout is (λ = 0).' : 'Below Vov the copy fails: M2 is a resistor now, and Iout collapses.'}</p>
    </Panel>
  );
}

// ─── U7 ────────────────────────────────────────────────────────────────────

type L4 = 'resistor' | 'current' | 'diode' | 'active';

function csNumbers(load: L4, id: number) {
  const vov1 = 0.2, vov2 = 0.25, ln = 0.1, lp = 0.1, rd = 10e3;
  const gm1 = gmFromIdVov(id, vov1), gm2 = gmFromIdVov(id, vov2), ro1 = rO(ln, id), ro2 = rO(lp, id);
  const av =
    load === 'resistor'
      ? csResistive({ gm: gm1, rd, rO: ro1 })
      : load === 'current'
        ? csCurrentSourceLoad({ gm1, rO1: ro1, rO2: ro2 })
        : load === 'diode'
          ? csDiodeLoad({ gm1, gm2, rO1: ro1, rO2: ro2 })
          : csActiveLoad({ gm1, gm2, rO1: ro1, rO2: ro2 });
  const Gm = load === 'active' ? gm1 + gm2 : gm1;
  return { gm1, gm2, ro1, ro2, rd, av, Gm, rout: -av / Gm };
}

function CsLoads() {
  const [load, setLoad] = useState<L4>('current');
  const id = 100e-6;
  const n = csNumbers(load, id);
  const loads: L4[] = ['diode', 'resistor', 'current', 'active'];
  const names: Record<L4, string> = { diode: 'Diode', resistor: 'Resistor', current: 'Current src', active: 'Active' };
  return (
    <Panel
      figure={
        <div className="stack">
          <CsLoadFig load={load} vin={undefined} id={id} rd={load === 'resistor' ? n.rd : undefined} />
          <LogBars items={loads.map((l) => ({ label: names[l], value: Math.abs(csNumbers(l, id).av), tone: l === load ? 'signal' : 'muted' }))} lo={1} hi={100} unit="V/V" title="|Av| for each load, log scale" />
        </div>
      }
    >
      <Seg
        label="Load"
        value={load}
        onChange={setLoad}
        options={loads.map((l) => ({ value: l, label: names[l] }))}
      />
      <Readout label="Gm" value={S(n.Gm)} />
      <Readout label="Rout" value={Ohm(n.rout)} />
      <Readout label="Av = −Gm·Rout" value={n.av.toFixed(1)} tone="signal" />
      <p className="small muted">ID = 100 µA, Vov1 = 0.2 V, |Vov2| = 0.25 V, λ = 0.1 V⁻¹, RD = 10 kΩ. Same input device every time: only Rout (and, for the active load, Gm) changes.</p>
    </Panel>
  );
}

function DegenMini() {
  const [rs, setRs] = useState(1e3);
  const id = 200e-6, vov = 0.2, rd = 10e3;
  const gm = gmFromIdVov(id, vov);
  const av = csDegenerated({ gm, rd, rs });
  const pts: Array<[number, number]> = [];
  for (let k = 0; k <= 60; k++) {
    const r = (k / 60) * 10e3;
    pts.push([r / 1e3, Math.abs(csDegenerated({ gm, rd, rs: r }))]);
  }
  return (
    <Panel
      figure={
        <div className="stack">
          <CsLoadFig load="degenerated" id={id} rd={rd} rs={rs} />
          <Plot
            title="Gain magnitude versus RS"
            xRange={[0, 10]}
            yRange={[0, gm * rd * 1.05]}
            xLabel="RS (kΩ)"
            yLabel="|Av|"
            h={200}
            xFmt={(v) => v.toFixed(0)}
            yFmt={(v) => v.toFixed(0)}
            series={[
              { points: pts, color: 'var(--nmos)', width: 2.4 },
              { points: pts.map(([x]) => [x, rd / 1e3 / Math.max(x, 1e-9)] as [number, number]).filter(([, y]) => y < gm * rd), color: 'var(--muted)', width: 1.4, dashed: true },
            ]}
            markers={[{ x: rs / 1e3, y: Math.abs(av), label: `${Math.abs(av).toFixed(1)}`, labelPos: 'right' }]}
          />
        </div>
      }
    >
      <Slider label="RS" value={rs} min={0} max={10e3} step={250} onChange={setRs} format={Ohm} />
      <Readout label="1/gm" value={Ohm(1 / gm)} />
      <Readout label="Gm = 1/(1/gm + RS)" value={S(gmDegenerated(gm, rs))} />
      <Readout label="|Av| = RD/(1/gm + RS)" value={Math.abs(av).toFixed(2)} tone="signal" />
      <p className="small muted">Dashed: RD/RS. Once RS ≫ 1/gm the gain is just a resistor ratio: stable, but smaller.</p>
    </Panel>
  );
}

// ─── U8 ────────────────────────────────────────────────────────────────────

function FollowerMini() {
  const [vin, setVin] = useState(1.2);
  const [i, setI] = useState(100e-6);
  const kp = 200e-6, wl = 20, vth = 0.4, lambda = 0.1;
  const vov = vovFromId(i, kp, wl);
  const vgs = vth + vov;
  const vout = Math.max(0, vin - vgs);
  const gm = gmFromIdVov(i, vov);
  const ro = rO(lambda, i);
  const on = vin - vgs > 0;
  return (
    <Panel
      figure={
        <div className="stack">
          <FollowerFig vin={vin} vout={vout} i={i} />
          <Plot
            title="Output follows the input, one VGS lower"
            xRange={[0, 1.8]}
            yRange={[0, 1.8]}
            xLabel="Vin (V)"
            yLabel="Vout (V)"
            h={200}
            xFmt={(v) => v.toFixed(1)}
            yFmt={(v) => v.toFixed(1)}
            series={[
              { points: [[0, 0], [1.8, 1.8]], color: 'var(--muted)', width: 1.2, dashed: true },
              { points: [[0, 0], [vgs, 0], [1.8, 1.8 - vgs]], color: 'var(--nmos)', width: 2.4 },
            ]}
            markers={[{ x: vin, y: vout, label: `VGS = ${vgs.toFixed(2)} V below`, labelPos: 'right' }]}
          />
        </div>
      }
    >
      <Slider label="Vin" value={vin} min={0.4} max={1.8} step={0.01} onChange={setVin} format={V} />
      <Slider label="I" value={i} min={20e-6} max={300e-6} step={10e-6} onChange={setI} format={A} />
      <Readout label="VGS = Vth + Vov" value={V(vgs)} />
      <Readout label="Vout = Vin − VGS" value={on ? V(vout) : 'off'} tone="signal" />
      <Readout label="Av = rO/(1/gm + rO)" value={followerGain({ gm, rs: Infinity, rO: ro }).toFixed(3)} />
      <Readout label="Rout = 1/gm ‖ rO" value={Ohm(followerRout({ gm, rO: ro }))} />
    </Panel>
  );
}

function CgMini() {
  const [vb, setVb] = useState(1.0);
  const [rd, setRd] = useState(5e3);
  const i = 100e-6, kp = 200e-6, wl = 20, vth = 0.4, vdd = 1.8;
  const vov = vovFromId(i, kp, wl);
  const vs = vb - vth - vov;
  const vd = vdd - i * rd;
  const sat = vd >= vb - vth;
  const gm = gmFromIdVov(i, vov);
  return (
    <Panel figure={<CommonGateFig vb={vb} vout={vd} vs={vs} i={i} rd={rd} />}>
      <Slider label="Vb (gate)" value={vb} min={0.7} max={1.6} step={0.01} onChange={setVb} format={V} />
      <Slider label="RD" value={rd} min={1e3} max={16e3} step={500} onChange={setRd} format={Ohm} />
      <Readout label="VS = Vb − VGS" value={V(vs)} />
      <Readout label="VD = VDD − I·RD" value={V(vd)} />
      <Readout label="fence VD ≥ Vb − Vth" value={sat ? 'saturated ✓' : 'TRIODE ✗'} tone={sat ? 'ok' : 'bad'} />
      <Readout label="Av = +gm·RD" value={sat ? cgGain({ gm, rd }).toFixed(2) : '—'} tone="signal" />
      <Readout label="Rin = 1/gm" value={Ohm(1 / gm)} />
      <p className="small muted">Bigger RD → more gain, but the drain drops. Too far and M1 falls off the fence.</p>
    </Panel>
  );
}

// ─── U9 ────────────────────────────────────────────────────────────────────

function CascodeMini() {
  const [load, setLoad] = useState<'current' | 'cascode'>('current');
  const [vb1, setVb1] = useState(1.0);
  const [vout, setVout] = useState(1.1);
  const proc = { ...SET_B, lambdan: 0.1, lambdap: 0.1 };
  const id = 100e-6, wl = 20;
  const vov = vovFromId(id, proc.kpn, wl);
  const gm = gmFromIdVov(id, vov);
  const ro = rO(0.1, id);
  const rDown = cascodeRoutApprox(gm, ro, ro);
  const rUp = load === 'cascode' ? rDown : ro;
  const rout = parallel(rDown, rUp);
  return (
    <Panel
      figure={
        <div className="stack">
          <CascodeFig load={load} proc={proc} id={id} wl={wl} vb1={vb1} vout={vout} />
          <LogBars
            items={[
              { label: 'rO', value: ro, tone: 'muted' },
              { label: 'R down', value: rDown, tone: 'n' },
              { label: 'R up', value: rUp, tone: 'p' },
              { label: 'Rout', value: rout, tone: 'signal' },
            ]}
            lo={1e3}
            hi={1e9}
            title="Looking down, looking up, and the output resistance"
          />
        </div>
      }
    >
      <Seg
        label="Load"
        value={load}
        onChange={setLoad}
        options={[
          { value: 'current', label: 'Simple PMOS load' },
          { value: 'cascode', label: 'Cascode PMOS load' },
        ]}
      />
      <Slider label="Vb1 (cascode gate)" value={vb1} min={0.6} max={1.5} step={0.01} onChange={setVb1} format={V} />
      <Slider label="Vout" value={vout} min={0.3} max={1.7} step={0.01} onChange={setVout} format={V} />
      <Readout label="gm·rO" value={g3(gm * ro)} />
      <Readout label="Rout = Rdown ‖ Rup" value={Ohm(rout)} />
      <Readout label="|Av| = gm·Rout" value={g3(gm * rout)} tone="signal" />
      <p className="small muted">{load === 'current' ? 'The load trap: rO in parallel with a huge Rdown — the smallest wins, so the gain barely beats a plain CS stage.' : 'Both sides huge: the gain jumps by about gm·rO.'}</p>
    </Panel>
  );
}

function TelescopicMini() {
  const e = ex97();
  const [vout, setVout] = useState(1.65);
  const [vinCm, setVinCm] = useState(e.vinCm);
  const [vb1, setVb1] = useState(e.vb1);
  const n = telescopicNodes({ proc: EX_9_7, iss: 3e-3, wlN: e.wlN, wlP: e.wlP, wl9: e.wl9, vinCm, vb1, vb2: e.vb2, vout });
  return (
    <Panel
      figure={
        <div className="stack">
          <TelescopicFig proc={EX_9_7} iss={3e-3} wlN={e.wlN} wlP={e.wlP} wl9={e.wl9} vinCm={vinCm} vb1={vb1} vb2={e.vb2} vout={vout} />
          <VoltageLadder
            vmax={3}
            h={380}
            title="Every node on one voltage axis"
            nodes={[
              { label: 'VDD', v: 3 },
              { label: 'Y (M5 source)', v: n.vY },
              { label: 'Vout', v: vout, tone: 'signal' },
              { label: 'Vb1', v: vb1 },
              { label: 'Vin,CM', v: vinCm },
              { label: 'X (M3 source)', v: n.vX },
              { label: 'P (tail)', v: n.vP },
            ]}
            bands={[
              { from: 3, to: n.vY, label: '|VDS7|', kind: 'p' },
              { from: n.vY, to: vout, label: '|VDS5|', kind: vout <= e.vb2 + EX_9_7.vthp ? 'p' : 'bad' },
              { from: vout, to: n.vX, label: 'VDS3', kind: vout - n.vX >= 0.2 - 1e-9 ? 'n' : 'bad' },
              { from: n.vX, to: n.vP, label: 'VDS1', kind: n.vX - n.vP >= 0.2 - 1e-9 ? 'n' : 'bad' },
              { from: n.vP, to: 0, label: 'VDS9', kind: n.vP >= 0.5 - 1e-9 ? 'tail' : 'bad' },
            ]}
          />
        </div>
      }
    >
      <Slider label="Vout (output CM)" value={vout} min={0.6} max={2.8} step={0.01} onChange={setVout} format={V} />
      <Slider label="Vin,CM" value={vinCm} min={1.1} max={1.8} step={0.01} onChange={setVinCm} format={V} />
      <Slider label="Vb1" value={vb1} min={1.3} max={2.2} step={0.01} onChange={setVb1} format={V} />
      <Readout label="allowed Vout (book)" value={`${V(e.voutMin)} to ${V(e.voutMax)}`} />
      <p className="small muted">Razavi Ex 9.7 sizes. Slide Vout below 0.9 V or above 2.4 V, or move Vb1: watch which transistor turns red first.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS2: Record<string, (p: any) => React.ReactElement> = {
  impedanceMini: ImpedanceMini,
  mirrorMini: MirrorMini,
  csLoads: CsLoads,
  degenMini: DegenMini,
  followerMini: FollowerMini,
  cgMini: CgMini,
  cascodeMini: CascodeMini,
  telescopicMini: TelescopicMini,
};

