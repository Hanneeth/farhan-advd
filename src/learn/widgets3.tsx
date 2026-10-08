/**
 * Interactive pictures for the Milestone 3 lessons (U10–U12). Every number comes from src/physics.
 */
import { useState } from 'react';
import { LogBars } from '../circuits/figures2';
import { BodePlot, DiffPairFig, FiveTOtaFig, HalfCircuitFig, StepPlot, SteeringPlot } from '../circuits/figures3';
import { VoltageLadder } from '../circuits/schematic';
import {
  cmGain,
  db,
  diffPairNodes,
  fiveTNodes,
  fiveTOtaQuiz,
  fiveTransistorOta,
  gmAtBalance,
  gmFromIdVov,
  QUIZ1_C,
  SET_B,
  settlingTime,
  splitInputs,
  steering,
  tauClosed,
  tut1Q1,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';

const V = (x: number) => formatSI(x, 'V');
const A = (x: number) => formatSI(x, 'A');
const Ohm = (x: number) => formatSI(x, 'Ω');
const S = (x: number) => formatSI(x, 'S');
const Hz = (x: number) => formatSI(x, 'Hz');

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

// ─── U10 ───────────────────────────────────────────────────────────────────

function PairSteer() {
  const [vin1, setVin1] = useState(1.0);
  const [vin2, setVin2] = useState(1.0);
  const kp = 200e-6, wl = 20, iss = 200e-6, rd = 5e3, vth = 0.4;
  const s = steering({ kp, wl, iss, dvin: vin1 - vin2 });
  const { vcm, vd } = splitInputs(vin1, vin2);
  const vov = Math.sqrt(iss / (kp * wl));
  return (
    <Panel
      figure={
        <div className="stack">
          <DiffPairFig vdd={1.8} iss={iss} kp={kp} wl={wl} vth={vth} vin1={vin1} vin2={vin2} rd={rd} inspector={false} />
          <SteeringPlot kp={kp} wl={wl} iss={iss} dvin={vd} />
        </div>
      }
    >
      <Slider label="Vin1" value={vin1} min={0.6} max={1.4} step={0.005} onChange={setVin1} format={V} />
      <Slider label="Vin2" value={vin2} min={0.6} max={1.4} step={0.005} onChange={setVin2} format={V} />
      <Readout label="VCM = (Vin1 + Vin2)/2" value={V(vcm)} />
      <Readout label="vd = Vin1 − Vin2" value={V(vd)} tone="signal" />
      <Readout label="ID1 / ID2" value={`${A(s.id1)} / ${A(s.id2)}`} />
      <Readout label="full steering at ±√2·Vov" value={`±${V(Math.SQRT2 * vov)}`} />
      <p className="small muted">Move both inputs together: nothing changes (common mode). Move them apart: the tail current tips from one side to the other (differential mode).</p>
    </Panel>
  );
}

function HalfCircuits() {
  const [mode, setMode] = useState<'dm' | 'cm'>('dm');
  const [rss, setRss] = useState(1e3);
  const id = 0.5e-3, vov = 0.632, rd = 3.2e3;
  const gm = gmFromIdVov(id, vov);
  const ad = gm * rd;
  const acm = cmGain({ gm, rd, rss });
  return (
    <Panel
      figure={
        <div className="stack">
          <HalfCircuitFig mode={mode} rd={rd} rss={rss} />
          <LogBars
            unit="V/V"
            lo={0.01}
            hi={100}
            title="Differential gain versus common-mode gain"
            items={[
              { label: 'Ad = gm·RD', value: ad, tone: 'ok' },
              { label: '|ACM|', value: Math.abs(acm), tone: 'bad' },
            ]}
          />
        </div>
      }
    >
      <Seg
        label="Half circuit"
        value={mode}
        onChange={setMode}
        options={[
          { value: 'dm', label: 'Differential (DM)' },
          { value: 'cm', label: 'Common mode (CM)' },
        ]}
      />
      <Slider label="RSS (tail resistor)" value={rss} min={0} max={20e3} step={250} onChange={setRss} format={Ohm} />
      <Readout label="gm (ID = 0.5 mA)" value={S(gm)} />
      <Readout label="Ad = gm·RD" value={ad.toFixed(2)} tone="ok" />
      <Readout label="ACM = −RD/(1/gm + 2RSS)" value={acm.toFixed(3)} tone="bad" />
      <Readout label="CMRR = 20 log|Ad/ACM|" value={`${db(ad / acm).toFixed(1)} dB`} tone="signal" />
      <p className="small muted">Tutorial 1 Q4 numbers. DM: the tail node P stands still, so it is ground. CM: both halves push current into RSS, so each half sees 2RSS.</p>
    </Panel>
  );
}

function CmRange() {
  const q = tut1Q1();
  const [vcm, setVcm] = useState(0);
  const n = diffPairNodes({ kp: 400e-6, wl: q.wl12, vth: 0.35, vdd: 0.9, vss: -0.9, iss: 0.2e-3, rd: q.rd, vin1: vcm, vin2: vcm, wlTail: q.wl3 });
  const tailOk = n.vP - -0.9 >= 0.15 - 1e-9;
  const inOk = n.vD1 >= vcm - 0.35 - 1e-9;
  return (
    <Panel
      figure={
        <div className="stack">
          <DiffPairFig vdd={0.9} vss={-0.9} iss={0.2e-3} kp={400e-6} wl={q.wl12} vth={0.35} vin1={vcm} vin2={vcm} rd={q.rd} tail="mirror" wlTail={q.wl3} r={q.r} names={['Q1', 'Q2', 'Q3', 'Q4']} />
          <VoltageLadder
            vmax={0.9}
            vmin={-0.9}
            h={300}
            title="The CM range on one voltage axis"
            nodes={[
              { label: 'VDD', v: 0.9 },
              { label: 'VD1,2', v: n.vD1 },
              { label: 'max = VD + Vth', v: q.cmirMax, tone: 'ok' },
              { label: 'VCM (gates)', v: vcm, tone: 'signal' },
              { label: 'min = VSS + Vov + VGS', v: q.cmirMin, tone: 'ok' },
              { label: 'P (tail node)', v: n.vP },
              { label: 'VSS', v: -0.9 },
            ]}
            bands={[
              { from: 0.9, to: n.vD1, label: 'RD drop', kind: 'free' },
              { from: q.cmirMax, to: q.cmirMin, label: 'allowed VCM', kind: 'swing' },
              { from: n.vP, to: -0.9, label: 'VDS3', kind: tailOk ? 'tail' : 'bad' },
            ]}
          />
        </div>
      }
    >
      <Slider label="VCM (both gates)" value={vcm} min={-0.5} max={0.6} step={0.005} onChange={setVcm} format={V} />
      <Readout label="tail node P = VCM − VGS" value={V(n.vP)} />
      <Readout label="Q3 (tail) fence: VDS3 ≥ Vov" value={tailOk ? 'saturated ✓' : 'TRIODE ✗'} tone={tailOk ? 'ok' : 'bad'} />
      <Readout label="Q1 fence: VD ≥ VCM − Vth" value={inOk ? 'saturated ✓' : 'TRIODE ✗'} tone={inOk ? 'ok' : 'bad'} />
      <Readout label="range" value={`${V(q.cmirMin)} to ${V(q.cmirMax)}`} tone="signal" />
      <p className="small muted">Tutorial 1 Q1. Too low and the tail source is squeezed; too high and Q1’s gate climbs past its drain + Vth.</p>
    </Panel>
  );
}

// ─── U11 ───────────────────────────────────────────────────────────────────

const EXAM = fiveTOtaQuiz(QUIZ1_C);

function OtaSignal() {
  const [vd, setVd] = useState(0);
  const iss = QUIZ1_C.iRef;
  const n = fiveTNodes({ proc: SET_B, iss, wl12: EXAM.design.wl12, wl34: EXAM.design.wl34, wlTail: QUIZ1_C.wlTail, vinCm: 1.1, vd });
  const s = steering({ kp: SET_B.kpn, wl: EXAM.design.wl12, iss, dvin: vd });
  const gm = gmAtBalance(SET_B.kpn, EXAM.design.wl12, iss);
  return (
    <Panel figure={<FiveTOtaFig proc={SET_B} iss={iss} wl12={EXAM.design.wl12} wl34={EXAM.design.wl34} wlTail={QUIZ1_C.wlTail} vinCm={1.1} vd={vd} signal cl={4e-12} />}>
      <Slider label="vd = Vin1 − Vin2" value={vd} min={-0.01} max={0.01} step={0.0002} onChange={setVd} format={(v) => formatSI(v, 'V')} />
      <Readout label="i = ID1 − ISS/2" value={A(s.id1 - iss / 2)} />
      <Readout label="≈ gm·vd/2" value={A((gm * vd) / 2)} />
      <Readout label="current into the output = 2i" value={A(2 * (s.id1 - iss / 2))} tone="signal" />
      <Readout label="Vout (open loop)" value={V(n.vOut)} />
      <Readout label="Gm = 2i/vd = gm" value={S(gm)} />
      <p className="small muted">M1’s extra current +i goes through diode M3; M4 copies it (+i). M2 loses i (−i). At the output the two add: 2i = gm·vd. The mirror recovers the half a resistor-loaded pair throws away.</p>
    </Panel>
  );
}

function OtaRange() {
  const [vcm, setVcm] = useState(1.1);
  const iss = QUIZ1_C.iRef;
  const n = fiveTNodes({ proc: SET_B, iss, wl12: EXAM.design.wl12, wl34: EXAM.design.wl34, wlTail: QUIZ1_C.wlTail, vinCm: vcm });
  const o = fiveTransistorOta({ proc: SET_B, iss, wl12: EXAM.design.wl12, wl34: EXAM.design.wl34, viss: EXAM.design.vov5, cl: 4e-12 });
  return (
    <Panel
      figure={
        <div className="stack">
          <FiveTOtaFig proc={SET_B} iss={iss} wl12={EXAM.design.wl12} wl34={EXAM.design.wl34} wlTail={QUIZ1_C.wlTail} vinCm={vcm} bias />
          <VoltageLadder
            vmax={1.8}
            h={320}
            title="Exam OTA: every node on one voltage axis"
            nodes={[
              { label: 'VDD', v: 1.8 },
              { label: 'Vout,max', v: o.voutMax, tone: 'ok' },
              { label: 'CM max', v: o.vinCmMax },
              { label: 'diode node', v: n.vD1 },
              { label: 'VCM', v: vcm, tone: 'signal' },
              { label: 'CM min', v: o.vinCmMin },
              { label: 'P', v: n.vP },
              { label: 'Vout,min', v: o.voutMin, tone: 'ok' },
            ]}
            bands={[
              { from: 1.8, to: n.vD1, label: '|VGS3|', kind: 'p' },
              { from: n.vD1, to: n.vP, label: 'VDS1', kind: n.vD1 >= vcm - 0.4 - 1e-9 ? 'n' : 'bad' },
              { from: n.vP, to: 0, label: 'VDS5', kind: n.vP >= EXAM.design.vov5 - 1e-9 ? 'tail' : 'bad' },
            ]}
          />
        </div>
      }
    >
      <Slider label="Vin,CM" value={vcm} min={0.6} max={1.6} step={0.005} onChange={setVcm} format={V} />
      <Readout label="CM range" value={`${V(o.vinCmMin)} to ${V(o.vinCmMax)}`} tone="signal" />
      <Readout label="output swing" value={`${V(o.voutMin)} to ${V(o.voutMax)}`} />
      <Readout label="Av = gm1(rO2 ‖ rO4)" value={o.av.toFixed(1)} />
      <Readout label="f−3dB (CL = 4 pF)" value={Hz(o.f3dB!)} />
      <p className="small muted">Your exam OTA (M1: W/L = {EXAM.design.wl12.toFixed(2)}, M3: {EXAM.design.wl34.toFixed(1)}). Slide VCM past 0.75 V or 1.45 V: M5 or M1 turns red.</p>
    </Panel>
  );
}

// ─── U12 ───────────────────────────────────────────────────────────────────

function BodeMini() {
  const [gmu, setGmu] = useState(1.2); // mS
  const [ro, setRo] = useState(74); // kΩ
  const [clp, setClp] = useState(4); // pF
  const gm = gmu * 1e-3, rout = ro * 1e3, cl = clp * 1e-12;
  const a0 = gm * rout;
  const f0 = 1 / (2 * Math.PI * rout * cl);
  return (
    <Panel figure={<BodePlot a0={a0} f0={f0} beta={1} />}>
      <Slider label="gm" value={gmu} min={0.2} max={4} step={0.05} onChange={setGmu} format={(v) => `${v.toFixed(2)} mS`} />
      <Slider label="Rout" value={ro} min={10} max={500} step={2} onChange={setRo} format={(v) => `${v} kΩ`} />
      <Slider label="CL" value={clp} min={0.5} max={10} step={0.5} onChange={setClp} format={(v) => `${v} pF`} />
      <Readout label="A0 = gm·Rout" value={`${a0.toFixed(1)} (${db(a0).toFixed(1)} dB)`} />
      <Readout label="f−3dB = 1/(2π·Rout·CL)" value={Hz(f0)} />
      <Readout label="GBW = gm/(2π·CL)" value={Hz(gm / (2 * Math.PI * cl))} tone="signal" />
      <p className="small muted">Drag Rout: the gain and the bandwidth trade exactly, and the unity-gain point does not move. Only gm and CL set the GBW. The orange curve is the unity-gain buffer: its bandwidth equals the GBW.</p>
    </Panel>
  );
}

function SettleMini() {
  const [acl, setAcl] = useState(2);
  const [fu, setFu] = useState(100); // MHz
  const [big, setBig] = useState(false);
  const [iss, setIss] = useState(100); // µA
  const beta = 1 / acl;
  const wu = 2 * Math.PI * fu * 1e6;
  const tau = tauClosed(beta, wu);
  const cl = 2e-12;
  const sr = (iss * 1e-6) / cl;
  const vstep = big ? 1 : 0.05;
  return (
    <Panel figure={<StepPlot vstep={vstep} tau={tau} eps={0.01} sr={sr} />}>
      <Slider label="closed-loop gain (1/β)" value={acl} min={1} max={10} step={1} onChange={setAcl} />
      <Slider label="fu (GBW)" value={fu} min={10} max={500} step={10} onChange={setFu} format={(v) => `${v} MHz`} />
      <Slider label="ISS (sets SR with CL = 2 pF)" value={iss} min={20} max={500} step={10} onChange={setIss} format={(v) => `${v} µA`} />
      <label className="small check">
        <input type="checkbox" checked={big} onChange={(e) => setBig(e.target.checked)} /> Big step (1 V instead of 50 mV)
      </label>
      <Readout label="τ = Aclosed/ωu" value={formatSI(tau, 's')} />
      <Readout label="1% settling = 4.6τ" value={formatSI(settlingTime(tau, 0.01), 's')} tone="signal" />
      <Readout label="SR = ISS/CL" value={`${(sr / 1e6).toFixed(0)} V/µs`} />
      <Readout label="linear slope needed at t = 0" value={`${(vstep / tau / 1e6).toFixed(0)} V/µs`} tone={vstep / tau > sr ? 'bad' : 'ok'} />
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS3: Record<string, (p: any) => React.ReactElement> = {
  pairSteer: PairSteer,
  halfCircuits: HalfCircuits,
  cmRange: CmRange,
  otaSignal: OtaSignal,
  otaRange: OtaRange,
  bodeMini: BodeMini,
  settleMini: SettleMini,
};
