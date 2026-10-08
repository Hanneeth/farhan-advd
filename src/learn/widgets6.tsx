/**
 * Interactive pictures for L8 (replica CMFB) and L10–L14 (PSRR/noise, stability, compensation).
 * Razavi’s intuition first: noise “going round the loop”, the gain running out before the phase does,
 * a capacitor that looks (1 + A2) times bigger, and a feed-forward path that fights the main one.
 */
import { useState } from 'react';
import { FiveTOtaFig } from '../circuits/figures3';
import { BarkhausenFig, ClosedStepFig, KtcSpectrumFig, LoopBodeFig, MillerBlockFig, NoiseShareFig, ReplicaCmfbFig, TwoStageMillerFig } from '../circuits/figures5';
import {
  a0ForPhaseMargin,
  ccForPhaseMargin,
  clForPhaseMargin,
  closedLoopStep,
  dominantPoleHand,
  gainCrossover,
  gainMarginDb,
  inputNoiseFolded,
  inputNoisePair,
  ktcNoiseRms,
  oneStageLoop,
  rcNoiseRms,
  resistorNoise,
  millerLoop,
  millerTwoStage,
  nvPerRtHz,
  overshoot,
  peakingFactor,
  phaseCrossover,
  phaseMargin,
  psrr5T,
  psrrDb,
  replicaCmfbOutputCm,
  rzCancel,
  rzNull,
  SET_B,
  twoStageSlewRate,
  type LoopSpec,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';

const Hz = (f: number) => formatSI(f, 'Hz');
const degs = (d: number) => `${d.toFixed(1)}°`;
const lin = (lf: number) => 10 ** lf;

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

/* ─── L8: replica CMFB (Lec 12) ─── */

function ReplicaMini() {
  const [vref, setVref] = useState(1.2);
  const [k, setK] = useState(2);
  const vth = 0.5, w = 10;
  const vcm = replicaCmfbOutputCm({ vref, vth, wl12: w, wl13: w, wl15: k * w });
  return (
    <Panel figure={<ReplicaCmfbFig vref={vref} vcm={vcm} />}>
      <Slider label="VREF" value={vref} min={0.8} max={1.6} step={0.01} onChange={setVref} format={(v) => `${v.toFixed(2)} V`} />
      <Slider label="(W/L)15 ÷ (W/L)12" value={k} min={1} max={3} step={0.05} onChange={setK} format={(v) => `${v.toFixed(2)}×`} />
      <Readout label="output CM" value={`${vcm.toFixed(3)} V`} tone={Math.abs(vcm - vref) < 1e-3 ? 'ok' : 'bad'} />
      <Readout label="error vs VREF" value={`${((vcm - vref) * 1e3).toFixed(0)} mV`} />
      <p className="small muted">M11 and M14 are twins: same gate, same current, so the same VGS. The loop therefore forces the resistance under M11 (M12 ‖ M13) to equal the one under M14 (M15). Make M15 as wide as M12 and M13 together and the outputs must average to VREF. (W/L)12 = (W/L)13 = 10, Vth = 0.5 V.</p>
    </Panel>
  );
}

/* ─── L10: PSRR ─── */

function PsrrMini() {
  const [ripple, setRipple] = useState(10e-3);
  const [lp, setLp] = useState(0.1);
  const gm = 0.8e-3, id = 60e-6;
  const p = psrr5T({ gmN: gm, roP: 1 / (lp * id), roN: 1 / (0.05 * id) });
  return (
    <Panel figure={<FiveTOtaFig proc={SET_B} iss={120e-6} wl12={26.67} wl34={19.2} wlTail={30} vinCm={1.1} inspector={false} />}>
      <Slider label="ripple on VDD" value={ripple} min={1e-3} max={50e-3} step={1e-3} onChange={setRipple} format={(v) => `${(v * 1e3).toFixed(0)} mV`} />
      <Slider label="λp (PMOS)" value={lp} min={0.05} max={0.3} step={0.01} onChange={setLp} format={(v) => `${v.toFixed(2)} V⁻¹`} />
      <Readout label="supply → output gain" value="≈ 1" />
      <Readout label="signal gain gm(rO2‖rO4)" value={p.signalGain.toFixed(1)} />
      <Readout label="PSRR" value={`${p.psrr.toFixed(1)} = ${psrrDb(p.psrr).toFixed(1)} dB`} tone="signal" />
      <Readout label="ripple at the output" value={`${(ripple * 1e3).toFixed(0)} mV`} tone="bad" />
      <Readout label="same as an input of" value={`${((ripple / p.psrr) * 1e6).toFixed(0)} µV`} />
      <p className="small muted">Your exam OTA (gm1 = 0.8 mS, 60 µA per side). The diode M3 keeps its |VGS| fixed, so node X, and with it the output, simply rides up and down with VDD. Drawing on a bumpy bus: the bumps land on the page almost 1:1.</p>
    </Panel>
  );
}

/* ─── L10: noise ─── */

function NoiseMini() {
  const [topo, setTopo] = useState<'pair' | 'folded'>('pair');
  const [vov1, setVov1] = useState(0.15);
  const [vovL, setVovL] = useState(0.3);
  const iss = 200e-6;
  const gm1 = iss / vov1;
  const gmL = iss / vovL;
  const v2 = topo === 'pair' ? inputNoisePair(gm1, gmL) : inputNoiseFolded(gm1, gmL, gmL);
  const items =
    topo === 'pair'
      ? [
          { label: 'M1, M2 (input)', value: 1 / gm1, tone: 'n' as const },
          { label: 'M3, M4 (loads)', value: gmL / gm1 ** 2, tone: 'p' as const },
          { label: 'tail, cascodes', value: 0, tone: 'muted' as const },
        ]
      : [
          { label: 'M1, M2 (input)', value: 1 / gm1, tone: 'p' as const },
          { label: 'M7, M8 (top)', value: gmL / gm1 ** 2, tone: 'p' as const },
          { label: 'M9, M10 (bottom)', value: gmL / gm1 ** 2, tone: 'n' as const },
          { label: 'tail, cascodes', value: 0, tone: 'muted' as const },
        ];
  return (
    <Panel figure={<NoiseShareFig items={items} />}>
      <Seg label="Topology" value={topo} onChange={setTopo} options={[{ value: 'pair', label: '5-T / telescopic' }, { value: 'folded', label: 'Folded cascode' }]} />
      <Slider label="input overdrive Vov1" value={vov1} min={0.08} max={0.4} step={0.01} onChange={setVov1} format={(v) => `${v.toFixed(2)} V`} />
      <Slider label="current-source overdrive" value={vovL} min={0.1} max={0.6} step={0.01} onChange={setVovL} format={(v) => `${v.toFixed(2)} V`} />
      <Readout label="gm1 / gm(load)" value={`${(gm1 * 1e3).toFixed(2)} / ${(gmL * 1e3).toFixed(2)} mS`} />
      <Readout label="input noise" value={`${nvPerRtHz(v2).toFixed(1)} nV/√Hz`} tone="signal" />
      <p className="small muted">ISS = 200 µA, γ = 2/3. Razavi’s rule: wiggle each gate a little; if the output moves, that device’s noise counts. The tail and the cascodes barely move the output, so they barely count. Loads count as gm_load/gm1²: give them a big overdrive (small gm) and they go quiet, but that costs swing.</p>
    </Panel>
  );
}

/* ─── L10: what noise is (Razavi HO #10): power per hertz, and kT/C ─── */

function KtcMini() {
  const [lr, setLr] = useState(3);
  const [cP, setCP] = useState(1);
  const r = 10 ** lr, c = cP * 1e-12;
  const f3 = 1 / (2 * Math.PI * r * c);
  const other = lr >= 4.5 ? r / 100 : r * 100;
  const vt = rcNoiseRms(r, c);
  return (
    <Panel
      figure={<KtcSpectrumFig r={r} c={c} other={other} />}
    >
      <Slider label="R" value={lr} min={2} max={6} step={0.1} onChange={setLr} format={(v) => formatSI(10 ** v, 'Ω')} />
      <Slider label="C" value={cP} min={0.1} max={10} step={0.1} onChange={setCP} format={(v) => `${v.toFixed(1)} pF`} />
      <Readout label="height: √(4kTR)" value={`${Math.sqrt(resistorNoise(r) * 1e18).toFixed(2)} nV/√Hz`} />
      <Readout label="width: f−3dB = 1/(2πRC)" value={Hz(f3)} />
      <Readout label="total on C (area)" value={`${(vt * 1e6).toFixed(1)} µV rms`} tone="signal" />
      <Readout label="√(kT/C)" value={`${(ktcNoiseRms(c) * 1e6).toFixed(1)} µV rms`} tone="ok" />
      <p className="small muted">Razavi’s picture of noise: pass it through a 1 Hz-wide window and measure the power that gets through; do that at every frequency and you get the spectrum. Here a bigger R makes the curve taller (more noise per hertz) but the RC filter narrower (fewer hertz). The two cancel exactly: the total depends only on C. Move R and watch the last two readouts stay equal.</p>
    </Panel>
  );
}

/* ─── L13: the load capacitor helps a one-stage op amp and hurts a two-stage one (Razavi HO #12) ─── */

function LoadCapMini() {
  const [clP, setClP] = useState(8);
  const one = (cl: number) => oneStageLoop({ gm: 1e-3, rout: 2e6, cl: cl * 1e-12, fnd: 300e6, beta: 1 });
  const two = (cl: number) => millerLoop({ gm1: 0.5e-3, r1: 400e3, c1: 0.2e-12, gm2: 2.5e-3, r2: 40e3, c2: cl * 1e-12, cc: 1.5e-12, rz: 400 }, 1);
  const ref = 2;
  const pm1 = phaseMargin(one(clP)), pm2 = phaseMargin(two(clP));
  const need = clForPhaseMargin({ gm: 1e-3, fnd: 300e6, pm: 60, beta: 1 });
  return (
    <Panel
      figure={
        <div className="stack">
          <ClosedStepFig title="One-stage op amp (CL is the dominant pole)" specs={[{ spec: one(ref), label: `CL = ${ref} pF`, color: 'var(--muted)' }, { spec: one(clP), label: `CL = ${clP} pF` }]} h={180} />
          <ClosedStepFig title="Two-stage op amp (CL sets the second pole)" specs={[{ spec: two(ref), label: `CL = ${ref} pF`, color: 'var(--muted)' }, { spec: two(clP), label: `CL = ${clP} pF` }]} h={180} />
        </div>
      }
    >
      <Slider label="CL" value={clP} min={0.3} max={20} step={0.1} onChange={setClP} format={(v) => `${v.toFixed(1)} pF`} />
      <Readout label="one-stage: PM" value={degs(pm1)} tone={pm1 < 45 ? 'bad' : pm1 < 58 ? undefined : 'ok'} />
      <Readout label="one-stage: GBW = gm/(2πCL)" value={Hz(1e-3 / (2 * Math.PI * clP * 1e-12))} />
      <Readout label="two-stage: PM" value={degs(pm2)} tone={pm2 < 45 ? 'bad' : pm2 < 58 ? undefined : 'ok'} />
      <Readout label="two-stage: P2 ≈ Gm2/(2πCL)" value={Hz(2.5e-3 / (2 * Math.PI * clP * 1e-12))} />
      <Readout label="one-stage: smallest CL for 60°" value={formatSI(need, 'F')} />
      <p className="small muted">One-stage: gm = 1 mS, Rout = 2 MΩ, mirror pole 300 MHz. Two-stage: Gm1 = 0.5 mS, Gm2 = 2.5 mS, CC = 1.5 pF, Rz = 1/Gm2. Grey is CL = 2 pF. Raise CL: the one-stage op amp gets slower but calmer; the two-stage op amp keeps its speed (Gm1/CC) but starts to ring.</p>
    </Panel>
  );
}

/* ─── L11: Barkhausen ─── */

function BarkhausenMini() {
  const [g, setG] = useState(1);
  const [lag, setLag] = useState(180);
  const total = 180 + lag;
  const inPhase = Math.abs(((total % 360) + 360) % 360) < 8 || Math.abs((((total % 360) + 360) % 360) - 360) < 8;
  const verdict = inPhase ? (g > 1.02 ? 'grows every trip: oscillation builds up' : g > 0.98 ? 'comes back the same: sustained oscillation' : 'in phase but smaller: dies away') : 'comes back out of step: partly cancels';
  return (
    <Panel figure={<BarkhausenFig loopGain={g} lag={lag} />}>
      <Slider label="loop gain |βA| at this frequency" value={g} min={0.3} max={2} step={0.01} onChange={setG} format={(v) => v.toFixed(2)} />
      <Slider label="amplifier’s phase lag" value={lag} min={0} max={270} step={1} onChange={setLag} format={(v) => `${v.toFixed(0)}°`} />
      <Readout label="total shift round the loop" value={`180° + ${lag}° = ${total}°`} />
      <Readout label="the wiggle…" value={verdict} tone={inPhase && g >= 0.98 ? 'bad' : 'ok'} />
      {inPhase && g > 1.02 && <Readout label="after 5 trips" value={`× ${(g ** 5).toFixed(1)}`} tone="bad" />}
      <p className="small muted">Negative feedback already flips the signal once (180°). If the amplifier delays it by another 180° and the loop gain is still ≥ 1, the flipped-twice noise comes back lined up with itself: the circuit amplifies its own noise. That is Barkhausen: |βA| = 1 and ∠βA = −180°.</p>
    </Panel>
  );
}

/* ─── L11: multipole loop ─── */

function MultiPoleMini() {
  const [n, setN] = useState<'1' | '2' | '3'>('2');
  const [lb, setLb] = useState(0); // log10 β
  const [lp2, setLp2] = useState(7);
  const a0 = 1e4, fp1 = 1e3;
  const poles = n === '1' ? [fp1] : n === '2' ? [fp1, lin(lp2)] : [fp1, lin(lp2), lin(lp2) * 3];
  const spec: LoopSpec = { a0, poles, beta: lin(lb) };
  const pm = phaseMargin(spec);
  const gm = gainMarginDb(spec);
  return (
    <Panel
      figure={
        <div className="stack">
          <LoopBodeFig spec={spec} h={200} />
          <ClosedStepFig specs={[{ spec, label: `PM ${pm.toFixed(0)}°` }]} h={200} />
        </div>
      }
    >
      <Seg label="Poles" value={n} onChange={setN} options={[{ value: '1', label: '1 pole' }, { value: '2', label: '2 poles' }, { value: '3', label: '3 poles' }]} />
      <Slider label="β (weaker feedback ←)" value={lb} min={-3} max={0} step={0.05} onChange={setLb} format={(v) => lin(v).toPrecision(2)} />
      {n !== '1' && <Slider label="second pole fp2" value={lp2} min={5} max={8} step={0.05} onChange={setLp2} format={(v) => Hz(lin(v))} />}
      <Readout label="ωgx (gain crossover)" value={Hz(gainCrossover(spec) ?? 0)} />
      <Readout label="ωpx (phase crossover)" value={phaseCrossover(spec) ? Hz(phaseCrossover(spec)!) : 'never reaches −180°'} />
      <Readout label="phase margin" value={degs(pm)} tone={pm < 0 ? 'bad' : pm < 45 ? undefined : 'ok'} />
      <Readout label="gain margin" value={Number.isFinite(gm) ? `${gm.toFixed(1)} dB` : '∞'} tone={gm < 0 ? 'bad' : 'ok'} />
      <p className="small muted">A0 = 10⁴, first pole 1 kHz. One pole: never more than −90°, so never unstable. Two poles: −180° only at infinity. Three poles: the phase crosses −180° at a finite ωpx, and if the gain is still above 1 there, it rings, then oscillates. Lower β drops the gain curve: ωgx moves left, the phase curve stays put, PM grows.</p>
    </Panel>
  );
}

/* ─── L12: phase margin → ringing ─── */

function PmMini() {
  const [pmT, setPmT] = useState(60);
  const fp1 = 1e5, fp2 = 1e8;
  const { a0 } = a0ForPhaseMargin({ poles: [fp1, fp2], pm: pmT, beta: 1 });
  const spec: LoopSpec = { a0, poles: [fp1, fp2], beta: 1 };
  const ref: LoopSpec = { a0: a0ForPhaseMargin({ poles: [fp1, fp2], pm: 85, beta: 1 }).a0, poles: [fp1, fp2], beta: 1 };
  const os = overshoot(closedLoopStep(spec, 12 / (2 * Math.PI * (gainCrossover(spec) ?? 1e6)), 500));
  return (
    <Panel
      figure={
        <div className="stack">
          <LoopBodeFig spec={spec} h={190} />
          <ClosedStepFig specs={[{ spec, label: `PM ${pmT}°` }, { spec: ref, label: 'PM 85° (reference)', color: 'var(--muted)' }]} h={200} />
        </div>
      }
    >
      <Slider label="phase margin" value={pmT} min={5} max={89} step={1} onChange={setPmT} format={(v) => `${v}°`} />
      <Readout label="A0 that gives it (poles 100 kHz, 100 MHz, β = 1)" value={a0.toFixed(0)} />
      <Readout label="closed-loop peak at ωgx" value={`${peakingFactor(pmT).toFixed(2)} × 1/β`} tone={peakingFactor(pmT) > 1.05 ? 'bad' : 'ok'} />
      <Readout label="step overshoot" value={`${(os * 100).toFixed(1)} %`} />
      <p className="small muted">Lec 16 numbers: PM 5° → the closed loop peaks 11.5× at ωgx (almost an oscillator). 45° → 1.3× (30% peak, ringing). 60° → exactly 1/β: no peak, a little overshoot, fast settling. 90° → no overshoot but slow. That is why designers aim for about 60°.</p>
    </Panel>
  );
}

/* ─── L13: dominant-pole compensation ─── */

function DominantMini() {
  const [pmT, setPmT] = useState(45);
  const [lb, setLb] = useState(-1);
  const a0 = 1e5, fp1 = 1e3, fp2 = 1e6, fp3 = 1e7;
  const beta = lin(lb);
  const before: LoopSpec = { a0, poles: [fp1, fp2, fp3], beta };
  const hand = dominantPoleHand({ a0, nondominant: [fp2, fp3], pm: pmT, beta });
  const after: LoopSpec = { a0, poles: [hand.fd, fp2, fp3], beta };
  return (
    <Panel
      figure={
        <div className="stack">
          <LoopBodeFig spec={before} mode="notes" h={180} />
          <LoopBodeFig spec={after} mode="notes" h={180} />
        </div>
      }
    >
      <Slider label="closed-loop gain 1/β" value={lb} min={-3} max={0} step={0.05} onChange={setLb} format={(v) => `${(1 / lin(v)).toPrecision(3)} (β = ${lin(v).toPrecision(2)})`} />
      <Slider label="target phase margin" value={pmT} min={30} max={75} step={1} onChange={setPmT} format={(v) => `${v}°`} />
      <Readout label="before: PM" value={degs(phaseMargin(before))} tone={phaseMargin(before) < 0 ? 'bad' : undefined} />
      <Readout label="new dominant pole" value={Hz(hand.fd)} tone="signal" />
      <Readout label="capacitance × " value={(fp1 / hand.fd).toPrecision(3)} />
      <Readout label="after: PM (exact)" value={degs(phaseMargin(after))} tone="ok" />
      <p className="small muted">Lec 17’s picture: A0 = 100 dB, poles 1 kHz, 1 MHz, 10 MHz. Top: as built. Bottom: first pole slid down so |A| meets the 20log(1/β) line where the other poles have used only 90° − PM of phase. Higher closed-loop gain (smaller β) needs less compensation: the red line sits higher.</p>
    </Panel>
  );
}

/* ─── L13: Miller effect and pole splitting ─── */

function MillerMini() {
  const [ccP, setCcP] = useState(1);
  const [a2, setA2] = useState(50);
  const gm2 = 2e-3;
  const m = { gm1: 1e-3, r1: 200e3, c1: 0.2e-12, gm2, r2: a2 / gm2, c2: 5e-12 };
  const before = millerTwoStage({ ...m, cc: 0 });
  const after = millerTwoStage({ ...m, cc: ccP * 1e-12 });
  const hz = (w: number) => Hz(w / (2 * Math.PI));
  return (
    <Panel
      figure={
        <div className="stack">
          <MillerBlockFig />
          <MillerBlockFig equivalent a2={a2} />
        </div>
      }
    >
      <Slider label="CC" value={ccP} min={0.1} max={5} step={0.1} onChange={setCcP} format={(v) => `${v.toFixed(1)} pF`} />
      <Slider label="second-stage gain A2 = Gm2·R2" value={a2} min={5} max={200} step={1} onChange={setA2} format={(v) => v.toFixed(0)} />
      <Readout label="node 1 sees CC(1 + A2)" value={formatSI(ccP * 1e-12 * (1 + a2), 'F')} tone="signal" />
      <Readout label="P1: before → after" value={`${hz(before.p1Approx)} → ${hz(after.p1)}`} />
      <Readout label="P2: before → after" value={`${hz(before.p2Approx)} → ${hz(after.p2)}`} />
      <Readout label="split ratio P2/P1" value={`${(before.p2Approx / before.p1Approx).toFixed(1)} → ${(after.p2 / after.p1).toExponential(1)}`} tone="ok" />
      <p className="small muted">A capacitor across a gain stage feels both ends move: the input moves by v, the output by −A2·v, so it carries (1 + A2) times the current: node 1 sees a huge capacitor and its pole drops. At high frequency CC shorts M6’s gate to its drain, turning it into a diode (≈ 1/Gm2): the output pole jumps up to ≈ Gm2/C2. The poles split apart.</p>
    </Panel>
  );
}

/* ─── L14: compensating the two-stage op amp ─── */

function TwoStageCompMini() {
  const [ccP, setCcP] = useState(1.5);
  const [ratio, setRatio] = useState(5);
  const [rzMode, setRzMode] = useState<'none' | 'null' | 'cancel'>('none');
  const gm1 = 0.5e-3, cl = 5e-12;
  const gm2 = gm1 * ratio;
  const base = { gm1, r1: 400e3, c1: 0.2e-12, gm2, r2: 40e3, c2: cl, cc: ccP * 1e-12 };
  const rz = rzMode === 'none' ? 0 : rzMode === 'null' ? rzNull(gm2) : rzCancel({ gm2, cc: base.cc, cl, c1: base.c1 });
  const m = { ...base, rz };
  const spec = millerLoop(m, 1);
  const r = millerTwoStage(m);
  const pm = phaseMargin(spec);
  const need = ccForPhaseMargin({ gm1, gm2, cl, pm: 60, zeroNulled: rzMode !== 'none' });
  const sr = twoStageSlewRate({ iss: 100e-6, cc: base.cc, i7: 0.5e-3, cl });
  return (
    <Panel
      figure={
        <div className="stack">
          <TwoStageMillerFig rz={rzMode !== 'none'} />
          <LoopBodeFig spec={spec} h={180} />
          <ClosedStepFig specs={[{ spec, label: `PM ${pm.toFixed(0)}°` }]} h={180} />
        </div>
      }
    >
      <Slider label="CC" value={ccP} min={0.2} max={5} step={0.05} onChange={setCcP} format={(v) => `${v.toFixed(2)} pF`} />
      <Slider label="Gm2 / Gm1" value={ratio} min={1} max={20} step={0.5} onChange={setRatio} format={(v) => `${v.toFixed(1)}×`} />
      <Seg label="Rz" value={rzMode} onChange={setRzMode} options={[{ value: 'none', label: 'no Rz' }, { value: 'null', label: 'Rz = 1/Gm2' }, { value: 'cancel', label: 'Rz cancels P2' }]} />
      <Readout label="GBW = Gm1/(2πCC)" value={Hz(r.gbw / (2 * Math.PI))} />
      <Readout label="P2 ≈ Gm2/(2πCL)" value={Hz(r.p2 / (2 * Math.PI))} />
      <Readout label="zero" value={!Number.isFinite(r.z) ? 'at ∞' : `${Hz(Math.abs(r.z) / (2 * Math.PI))} ${r.z > 0 ? '(RHP: lags!)' : '(LHP)'}`} tone={r.z > 0 ? 'bad' : 'ok'} />
      <Readout label="phase margin (β = 1)" value={degs(pm)} tone={pm < 45 ? 'bad' : pm < 58 ? undefined : 'ok'} />
      <Readout label="CC for 60° (hand rule)" value={formatSI(need, 'F')} />
      <Readout label="slew rate (ISS 100 µA)" value={`${(sr.sr / 1e6).toFixed(1)} V/µs (${sr.limit === 'CC' ? 'ISS/CC' : '(I7 − ISS)/CL'})`} />
      <p className="small muted">Gm1 = 0.5 mS, CL = 5 pF. Bigger CC: more phase margin, less bandwidth, slower slewing. The RHP zero Gm2/CC comes from CC feeding the input straight to the output with the wrong sign; it lags the phase like a pole. Rz = 1/Gm2 kills it; a bit more Rz puts a helpful LHP zero right on top of P2.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS6: Record<string, (p: any) => React.ReactElement> = {
  replicaMini: ReplicaMini,
  psrrMini: PsrrMini,
  noiseMini: NoiseMini,
  barkhausenMini: BarkhausenMini,
  multiPoleMini: MultiPoleMini,
  pmMini: PmMini,
  dominantMini: DominantMini,
  millerMini: MillerMini,
  twoStageCompMini: TwoStageCompMini,
  ktcMini: KtcMini,
  loadCapMini: LoadCapMini,
};
