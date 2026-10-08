/**
 * Milestone 3 labs (CLAUDE.md §8.3, 8.6, 8.7, 8.8): differential pair, five-transistor OTA,
 * feedback/Bode/settling, and the headroom stack. Every number from src/physics.
 */
import { useMemo, useState } from 'react';
import { Plot } from '../circuits/Plot';
import { LogBars } from '../circuits/figures2';
import { BodePlot, DiffPairFig, FiveTOtaFig, HalfCircuitFig, StepPlot, SteeringPlot } from '../circuits/figures3';
import { VoltageLadder, type LadderBand, type LadderNode } from '../circuits/schematic';
import {
  closedLoopGain,
  cmGain,
  db,
  ex97,
  fiveTOtaQuiz,
  fiveTransistorOta,
  gainError,
  gmAtBalance,
  otaNetlist,
  pairNetlist,
  smallSignalGain,
  solveOp,
  sweep,
  QUIZ1_C,
  SET_B,
  settlingTime,
  slewTime,
  splitInputs,
  steering,
  tauClosed,
  wlFromId,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';
import { LabShell } from './LabShell';

const V = (x: number) => formatSI(x, 'V');
const A = (x: number) => formatSI(x, 'A');
const Ohm = (x: number) => formatSI(x, 'Ω');
const Hz = (x: number) => formatSI(x, 'Hz');

// ─── Differential pair lab ─────────────────────────────────────────────────

const PAIR = { kp: 200e-6, wl: 20, vth: 0.4, lambda: 0.1, vdd: 1.8, iss: 200e-6, kpp: 100e-6, wlp: 20, vthp: 0.5, lambdap: 0.1 };

export function DiffPairLab() {
  const [vin1, setVin1] = useState(1.0);
  const [vin2, setVin2] = useState(1.0);
  const [load, setLoad] = useState<'rd' | 'diode' | 'current'>('rd');
  const [tail, setTail] = useState<'mirror' | 'rss'>('mirror');
  const [rd, setRd] = useState(5e3);
  const [rss, setRss] = useState(3e3);
  const [half, setHalf] = useState(false);
  const { kp, wl, vth, vdd, iss } = PAIR;
  const wlTail = wlFromId(iss, kp, 0.2);
  const vbp = vdd - (PAIR.vthp + Math.sqrt(iss / (PAIR.kpp * PAIR.wlp))); // PMOS sources nominally carry ISS/2
  const mk = (a: number, b: number) =>
    pairNetlist({ ...PAIR, vin1: a, vin2: b, load, rd, vbp, tail: tail === 'mirror' ? 'mos' : 'rss', rss, wlTail, vbTail: vth + 0.2 });
  const net = mk(vin1, vin2);
  const op = solveOp(net);
  const { vcm, vd } = splitInputs(vin1, vin2);
  // Simulated small-signal gains around this operating point
  const adSim = smallSignalGain(net, op, 'd2', (_n, dv) => mk(vin1 + dv / 2, vin2 - dv / 2)) - smallSignalGain(net, op, 'd1', (_n, dv) => mk(vin1 + dv / 2, vin2 - dv / 2));
  const acmSim = smallSignalGain(net, op, 'd1', (_n, dv) => mk(vin1 + dv, vin2 + dv));
  // Hand formulas
  const gm = gmAtBalance(kp, wl, iss);
  const ro = 1 / (PAIR.lambda * (iss / 2));
  const loadR = load === 'rd' ? rd : load === 'diode' ? 1 / gmAtBalance(PAIR.kpp, PAIR.wlp, iss) : 1 / (PAIR.lambdap * (iss / 2));
  const ad = gm * (1 / (1 / loadR + 1 / ro));
  const rtail = tail === 'rss' ? rss : 1 / (PAIR.lambda * iss);
  const acm = cmGain({ gm, rd: loadR, rss: rtail });
  const vov = Math.sqrt(iss / (kp * wl));
  const bad = Object.values(op.mos).filter((m) => m.region !== 'saturation').map((m) => `${m.name} ${m.region}`);
  const railed = load === 'current' && (op.v.d1 > vdd - 0.05 || op.v.d1 < 0.3);
  // Both drains against vd at this CM (continuation sweep)
  const vtc = useMemo(() => {
    const xs = Array.from({ length: 81 }, (_, i) => -0.5 + i / 80);
    const ops = sweep((x) => mk(vcm + x / 2, vcm - x / 2), xs);
    return { d1: xs.map((x, i) => [x, ops[i].v.d1] as [number, number]), d2: xs.map((x, i) => [x, ops[i].v.d2] as [number, number]) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vcm, load, tail, rd, rss]);
  const challenges = [
    { id: 'cm', text: 'Move both inputs up together by 0.2 V. Do the drain currents change? (They hardly do: ACM is tiny.)', done: Math.abs(vd) < 0.002 && Math.abs(vcm - 1.0) >= 0.2 && op.mos.M1.region === 'saturation' },
    { id: 'steer', text: 'Steer ALL the tail current into M1. How big must vd be? Compare with √2·Vov.', done: op.mos.M2.id < iss * 0.01 },
    { id: 'low', text: 'With the transistor tail, lower the input CM until the tail leaves saturation: the currents start to fall.', done: tail === 'mirror' && op.mos.M5?.region === 'triode' },
    { id: 'high', text: 'Raise the input CM until M1 leaves saturation (its gate passes its drain + Vth). Watch the gain drop.', done: op.mos.M1.region === 'triode' && Math.abs(vd) < 0.05 },
    { id: 'cmfb', text: 'Choose PMOS current-source loads: the outputs run to a rail. Why does this circuit need CMFB?', done: load === 'current' },
  ];
  return (
    <LabShell
      title="Differential pair lab"
      intro="Two matched NMOS share a tail current. Everything is simulated from the square law with λ: move the inputs together (common mode) or apart (differential) and watch the real currents, the fences and the gains, next to your hand formulas."
      figures={
        <>
          <DiffPairFig vdd={vdd} iss={iss} kp={kp} wl={wl} vth={vth} vin1={vin1} vin2={vin2} rd={rd} load={load} kpp={PAIR.kpp} wlp={PAIR.wlp} vthp={PAIR.vthp} tail={tail === 'mirror' ? 'mirror' : 'rss'} rss={rss} wlTail={wlTail} r={(vdd - (vth + 0.2)) / iss} sim={op} />
          {railed && (
            <p className="callout bad small">
              <strong>The outputs have run to a rail.</strong> Each drain sits between a PMOS current source and an NMOS that carries half of ISS. Any mismatch between the two currents has nowhere to go but into rO ‖ rO, so the output common mode is not defined. This is exactly why a fully differential amplifier needs common-mode feedback (L7, Lec 09–10).
            </p>
          )}
          <div className="lab-figures-row">
            <Plot
              title="Both drains against vd (simulated)"
              xRange={[-0.5, 0.5]}
              yRange={[0, vdd]}
              xLabel="vd = Vin1 − Vin2 (V)"
              yLabel="VD1, VD2 (V)"
              h={260}
              xFmt={(v) => v.toFixed(1)}
              yFmt={(v) => v.toFixed(1)}
              series={[
                { points: vtc.d1, color: 'var(--nmos)', width: 2.2, label: 'VD1', labelAt: 'end' },
                { points: vtc.d2, color: 'var(--signal)', width: 2.2, label: 'VD2', labelAt: 'end' },
              ]}
              guides={[
                { axis: 'x', at: -Math.SQRT2 * vov, label: '−√2·Vov', color: 'var(--muted)' },
                { axis: 'x', at: Math.SQRT2 * vov, label: '+√2·Vov', color: 'var(--muted)' },
              ]}
              markers={[{ x: vd, y: op.v.d1 }, { x: vd, y: op.v.d2 }]}
            />
            <SteeringPlot kp={kp} wl={wl} iss={iss} dvin={vd} />
          </div>
          {half && (
            <div className="lab-figures-row">
              <HalfCircuitFig mode="dm" rd={loadR} />
              <HalfCircuitFig mode="cm" rd={loadR} rss={rtail} />
            </div>
          )}
        </>
      }
      controls={
        <>
          <Seg label="Load" value={load} onChange={setLoad} options={[{ value: 'rd', label: 'Resistors RD' }, { value: 'diode', label: 'PMOS diodes' }, { value: 'current', label: 'PMOS sources' }]} />
          <Seg label="Tail" value={tail} onChange={setTail} options={[{ value: 'mirror', label: 'Transistor tail' }, { value: 'rss', label: 'Resistor RSS' }]} />
          <Slider label="Vin1" value={vin1} min={0.3} max={1.8} step={0.005} onChange={setVin1} format={V} />
          <Slider label="Vin2" value={vin2} min={0.3} max={1.8} step={0.005} onChange={setVin2} format={V} />
          {load === 'rd' && <Slider label="RD" value={rd} min={1e3} max={10e3} step={100} onChange={setRd} format={Ohm} />}
          {tail === 'rss' && <Slider label="RSS" value={rss} min={0.5e3} max={20e3} step={250} onChange={setRss} format={Ohm} />}
          <label className="small check">
            <input type="checkbox" checked={half} onChange={(e) => setHalf(e.target.checked)} /> Show the DM and CM half circuits
          </label>
          <div className="readouts">
            <Readout label="VCM / vd" value={`${V(vcm)} / ${V(vd)}`} />
            <Readout label="saturated (simulated)" value={bad.length ? `${bad.join(', ')} ✗` : 'all ✓'} tone={bad.length ? 'bad' : 'ok'} />
            <Readout label="ID1 / ID2 (simulated)" value={`${A(op.mos.M1.id)} / ${A(op.mos.M2.id)}`} tone="signal" />
            <Readout label="full steering at" value={`±${V(Math.SQRT2 * vov)}`} />
            <Readout label="Ad: simulated / gm(load ‖ rO)" value={`${adSim.toFixed(2)} / ${ad.toFixed(2)}`} tone="signal" />
            <Readout label="|ACM|: simulated / R/(1/gm + 2Rtail)" value={`${Math.abs(acmSim).toFixed(4)} / ${Math.abs(acm).toFixed(4)}`} />
            <Readout label="CMRR (hand)" value={`${db(ad / acm).toFixed(1)} dB`} tone="ok" />
          </div>
          <p className="small muted">µnCox 200 µA/V², W/L 20, Vth 0.4 V, ISS 200 µA, VDD 1.8 V, λ = 0.1 V⁻¹. The transistor tail acts as a {Ohm(rtail)} tail resistance (its rO).</p>
        </>
      }
      challenges={challenges}
    />
  );
}

// ─── Five-transistor OTA lab ───────────────────────────────────────────────

const EXAM = fiveTOtaQuiz(QUIZ1_C);
const OTA_PROC = SET_B;

function otaSim(iss: number, vin1: number, vin2: number, buffer: boolean, guess?: Record<string, number>) {
  const net = otaNetlist({ proc: OTA_PROC, i1: iss, wl12: EXAM.design.wl12, wl34: EXAM.design.wl34, wl5: QUIZ1_C.wlTail, vin1, vin2, buffer });
  return { net, op: solveOp(net, guess) };
}

export function OtaLab() {
  const [vcm, setVcm] = useState(1.1);
  const [vdm, setVdm] = useState(0); // mV
  const [issu, setIssu] = useState(120);
  const [clp, setClp] = useState(4);
  const [buffer, setBuffer] = useState(false);
  const [signal, setSignal] = useState(true);
  const iss = issu * 1e-6, cl = clp * 1e-12;
  const vd = buffer ? 0 : vdm / 1000;
  const hand = fiveTransistorOta({ proc: OTA_PROC, iss, wl12: EXAM.design.wl12, wl34: EXAM.design.wl34, viss: Math.sqrt((2 * iss) / (OTA_PROC.kpn * QUIZ1_C.wlTail)), cl });
  const { net, op } = otaSim(iss, vcm + vd / 2, vcm - vd / 2, buffer);
  // Small-signal gain of the circuit as it is biased now (a simulator's .TF)
  const simGain = buffer
    ? smallSignalGain(net, op, 'out', (n, dv) => ({ ...n, fixed: { ...n.fixed, in1: vcm + dv } }))
    : smallSignalGain(net, op, 'out', (n, dv) => ({ ...n, fixed: { ...n.fixed, in1: vcm + (vd + dv) / 2, in2: vcm - (vd + dv) / 2 } }));
  const bad = Object.values(op.mos).filter((m) => m.name !== 'M6' && m.region !== 'saturation').map((m) => `${m.name} ${m.region}`);
  // Transfer curve: Vout against vd at this CM (continuation sweep)
  const vtc = useMemo(() => {
    const xs = Array.from({ length: 81 }, (_, i) => -0.08 + (0.16 * i) / 80);
    const ops = sweep((x) => otaSim(iss, vcm + x / 2, vcm - x / 2, false).net, xs);
    return xs.map((x, i) => [x * 1000, ops[i].v.out] as [number, number]);
  }, [iss, vcm]);
  // Gain against the input CM: flat inside the CM range, collapsing outside it
  const gainCm = useMemo(() => {
    const xs = Array.from({ length: 57 }, (_, i) => 0.3 + (1.5 * i) / 56);
    let g: Record<string, number> = {};
    return xs.map((x) => {
      const s0 = otaSim(iss, x, x, false, g);
      g = s0.op.v;
      // With the input pair cut off there is no amplifier (and no defined operating point): gain 0.
      if (!s0.op.converged || s0.op.mos.M1.region === 'off' || s0.op.mos.M2.region === 'off') return [x, 0] as [number, number];
      const a = smallSignalGain(s0.net, s0.op, 'out', (n, dv) => ({ ...n, fixed: { ...n.fixed, in1: x + dv / 2, in2: x - dv / 2 } }));
      return [x, Math.max(0, a)] as [number, number];
    });
  }, [iss]);
  const s = steering({ kp: OTA_PROC.kpn, wl: EXAM.design.wl12, iss, dvin: vd });
  const challenges = [
    { id: 'edges', text: 'Slide the input CM until the gain collapses at each end. Which transistor fails, and is it where the formulas put the CM range?', done: bad.length > 0 },
    { id: 'signal', text: 'Push vd to +2 mV and follow the currents: +i, copied +i, −i, 2i into the output. How far does Vout move?', done: !buffer && vdm >= 2 },
    { id: 'rail', text: 'Push vd to ±50 mV: the output hits a rail. Which device leaves saturation there?', done: !buffer && Math.abs(vdm) >= 40 },
    { id: 'buffer', text: 'Close the unity-gain loop. Vout now follows Vin, and Rout and the bandwidth jump by the loop gain.', done: buffer },
    { id: 'iss', text: 'Double ISS. What happens to the gain (∝ 1/√ISS), GBW (∝ √ISS) and slew rate (∝ ISS)?', done: issu >= 240 },
  ];
  const cmLo = hand.vinCmMin, cmHi = hand.vinCmMax;
  return (
    <LabShell
      title="Five-transistor OTA lab"
      intro="Your exam OTA (Quiz 1 Part C sizes), simulated: every node voltage and current is solved from the square law with λ, so a transistor that runs out of room really leaves saturation and the gain really collapses. Compare the simulated numbers with your hand formulas."
      figures={
        <>
          <FiveTOtaFig proc={OTA_PROC} iss={iss} wl12={EXAM.design.wl12} wl34={EXAM.design.wl34} wlTail={QUIZ1_C.wlTail} vinCm={vcm} vd={vd} bias signal={signal && !buffer} buffer={buffer} cl={cl} sim={op} />
          <div className="lab-figures-row">
            <Plot
              title="Transfer curve: Vout against vd (simulated)"
              xRange={[-80, 80]}
              yRange={[0, OTA_PROC.vdd]}
              xLabel="vd = Vin1 − Vin2 (mV)"
              yLabel="Vout (V)"
              h={260}
              xFmt={(v) => v.toFixed(0)}
              yFmt={(v) => v.toFixed(1)}
              series={[{ points: vtc, color: 'var(--signal)', width: 2.4 }]}
              guides={[
                { axis: 'y', at: OTA_PROC.vdd - hand.vov3, label: 'ceiling VDD − |Vov4|', color: 'var(--pmos)' },
                { axis: 'y', at: hand.voutMin, label: 'floor Vov5 + Vov2', color: 'var(--nmos)' },
              ]}
              markers={buffer ? [] : [{ x: vdm, y: op.v.out, label: 'now' }]}
              onPick={buffer ? undefined : (x) => setVdm(Math.round(x * 10) / 10)}
            />
            <Plot
              title="Gain against input CM (simulated)"
              xRange={[0.3, 1.8]}
              yRange={[0, hand.av * 1.35]}
              xLabel="Vin,CM (V)"
              yLabel="|Av|"
              h={260}
              xFmt={(v) => v.toFixed(1)}
              yFmt={(v) => v.toFixed(0)}
              series={[{ points: gainCm.map(([x, y]) => [x, Math.min(y, hand.av * 1.3)] as [number, number]), color: 'var(--ink)', width: 2.4 }]}
              guides={[{ axis: 'y', at: hand.av, label: 'gm1(rO2 ‖ rO4)', color: 'var(--ok)' }]}
              shades={[{ x0: cmLo, x1: cmHi, color: 'var(--ok-bg)', label: 'hand CM range', labelAt: 'top' }]}
              markers={[{ x: vcm, y: gainCm.reduce((b, g) => (Math.abs(g[0] - vcm) < Math.abs(b[0] - vcm) ? g : b))[1], label: 'now' }]}
              onPick={(x) => setVcm(Math.round(x * 200) / 200)}
            />
          </div>
          <p className="small muted lab-note">
            <strong>Reading the gain plot:</strong> inside the shaded range (the hand CM range) the gain sits on gm1(rO2 ‖ rO4). Above it M1 enters triode and the gain collapses. Just below it the tail M5 leaves saturation, the current falls, and since |Av| = gm·rO/2 ∝ 1/√ID the gain briefly <em>rises</em> before the pair turns off — the same formula, read at a smaller current.
          </p>
          <BodePlot a0={hand.av} f0={hand.f3dB!} beta={buffer ? 1 : undefined} />
        </>
      }
      controls={
        <>
          <Slider label={buffer ? 'Vin (to M1)' : 'Vin,CM'} value={vcm} min={0.3} max={1.8} step={0.005} onChange={setVcm} format={V} />
          {!buffer && <Slider label="vd = Vin1 − Vin2" value={vdm} min={-80} max={80} step={0.1} onChange={setVdm} format={(v) => `${v.toFixed(1)} mV`} />}
          <Slider label="ISS (= I1)" value={issu} min={40} max={400} step={10} onChange={setIssu} format={(v) => `${v} µA`} />
          <Slider label="CL" value={clp} min={0.5} max={10} step={0.5} onChange={setClp} format={(v) => `${v} pF`} />
          <label className="small check">
            <input type="checkbox" checked={buffer} onChange={(e) => setBuffer(e.target.checked)} /> Unity-gain buffer (Vout tied to Vin2)
          </label>
          <label className="small check">
            <input type="checkbox" checked={signal} onChange={(e) => setSignal(e.target.checked)} /> Show signal currents
          </label>
          <div className="readouts">
            <Readout label="saturated (simulated)" value={bad.length ? `${bad.join(', ')} ✗` : 'all ✓'} tone={bad.length ? 'bad' : 'ok'} />
            <Readout label="Vout (simulated)" value={V(op.v.out)} tone="signal" />
            <Readout label="ID1 / ID2" value={`${A(op.mos.M1.id)} / ${A(op.mos.M2.id)}`} />
            <Readout label={buffer ? 'closed-loop gain (sim) ≈ A/(1+A)' : 'gain: simulated slope'} value={buffer ? simGain.toFixed(4) : simGain.toFixed(1)} tone="signal" />
            <Readout label="gain: gm1(rO2 ‖ rO4) by hand" value={buffer ? (hand.av / (1 + hand.av)).toFixed(4) : hand.av.toFixed(1)} tone="ok" />
            <Readout label="CM range by hand" value={`${V(cmLo)} to ${V(cmHi)}`} />
            <Readout label="swing by hand" value={`${V(hand.voutMin)} to ${V(hand.voutMax)}`} />
            <Readout label="i = gm·vd/2 (hand)" value={A(s.id1 - iss / 2)} />
            <Readout label={buffer ? 'Rout (buffer) ≈ 1/gm' : 'Rout = rO2 ‖ rO4'} value={Ohm(buffer ? hand.bufferRout : hand.rout)} />
            <Readout label={buffer ? 'bandwidth ≈ gm/(2πCL)' : 'f−3dB = 1/(2πRout·CL)'} value={Hz(buffer ? hand.bufferF3dB! : hand.f3dB!)} tone="signal" />
            <Readout label="SR = ISS/CL" value={`${(hand.slewRate! / 1e6).toFixed(1)} V/µs`} />
          </div>
          <p className="small muted">Simulator: square law with λn = 0.05, λp = 0.1 V⁻¹ (rO = 1/(λID) exactly), Newton solve of all six transistors. Click either plot to move the operating point.</p>
        </>
      }
      challenges={challenges}
    />
  );
}

// ─── Feedback, Bode and settling lab ───────────────────────────────────────

export function FeedbackLab() {
  const [a0db, setA0db] = useState(60);
  const [f0, setF0] = useState(100e3);
  const [acl, setAcl] = useState(10);
  const [eps, setEps] = useState(0.01);
  const [big, setBig] = useState(false);
  const [issu, setIssu] = useState(100);
  const a0 = 10 ** (a0db / 20);
  const beta = 1 / acl;
  const fu = a0 * f0;
  const wu = 2 * Math.PI * fu;
  const tau = tauClosed(beta, wu);
  const cl = 2e-12;
  const sr = (issu * 1e-6) / cl;
  const vstep = big ? 1 : 0.02;
  const err = gainError(a0, beta);
  const challenges = [
    { id: 'ex91', text: 'Razavi Ex 9.1: closed-loop gain 10 with under 1% gain error. Find the smallest A0 that works.', done: acl === 10 && err <= 0.01 && a0db <= 61 },
    { id: 'desens', text: 'Change A0 by 20 dB at Aclosed = 2. How much does the closed-loop gain change?', done: acl === 2 && a0db >= 70 },
    { id: 'gbw', text: 'Double the closed-loop gain. What happens to the closed-loop bandwidth?', done: acl >= 20 },
    { id: 'slew', text: 'Take a big step with a small ISS: see the ramp (slewing) before the curve.', done: big && slewTime(vstep, tau, sr) > 0 },
    { id: 'tight', text: 'Tighten the band from 1% to 0.1%. How many extra τ does it cost?', done: eps <= 0.001 },
  ];
  return (
    <LabShell
      title="Feedback, Bode and settling"
      intro="A one-pole op amp in a closed loop. The Bode plot shows the open-loop gain, the 1/β line and the closed-loop response; the step response shows the ε band, the 4.6τ/6.9τ settling and slewing."
      figures={
        <>
          <BodePlot a0={a0} f0={f0} beta={beta} />
          <StepPlot vstep={vstep} tau={tau} eps={eps} sr={sr} />
        </>
      }
      controls={
        <>
          <Slider label="A0 (open-loop DC gain)" value={a0db} min={20} max={100} step={1} onChange={setA0db} format={(v) => `${v} dB (${(10 ** (v / 20)).toFixed(0)})`} />
          <Slider label="f0 (open-loop pole)" value={f0} min={1e3} max={10e6} step={1e3} onChange={setF0} format={Hz} />
          <Slider label="Aclosed = 1/β" value={acl} min={1} max={50} step={1} onChange={setAcl} />
          <Seg label="Settling band" value={String(eps)} onChange={(v) => setEps(Number(v))} options={[{ value: '0.01', label: '1%' }, { value: '0.001', label: '0.1%' }]} />
          <Slider label="ISS (CL = 2 pF)" value={issu} min={10} max={500} step={10} onChange={setIssu} format={(v) => `${v} µA`} />
          <label className="small check">
            <input type="checkbox" checked={big} onChange={(e) => setBig(e.target.checked)} /> Big step (1 V)
          </label>
          <div className="readouts">
            <Readout label="exact Aclosed = A0/(1 + βA0)" value={closedLoopGain(a0, beta).toFixed(4)} tone="signal" />
            <Readout label="gain error ε = 1/(1 + βA0)" value={`${(err * 100).toFixed(3)} %`} tone={err <= 0.01 ? 'ok' : 'bad'} />
            <Readout label="loop gain βA0" value={(beta * a0).toFixed(1)} />
            <Readout label="GBW fu = A0·f0" value={Hz(fu)} />
            <Readout label="closed-loop bandwidth ≈ β·fu" value={Hz(beta * fu)} />
            <Readout label="τ = Aclosed/ωu" value={formatSI(tau, 's')} />
            <Readout label={`settling to ${eps * 100}%`} value={formatSI(slewTime(vstep, tau, sr) + settlingTime(tau, eps), 's')} tone="signal" />
            <Readout label="SR = ISS/CL" value={`${(sr / 1e6).toFixed(0)} V/µs`} />
          </div>
        </>
      }
      challenges={challenges}
    />
  );
}

// ─── Headroom stack ────────────────────────────────────────────────────────

type Preset = 'fiveT' | 'telescopic' | 'mirrorTele' | 'folded' | 'ex97';

interface Stack {
  vdd: number;
  /** From ground up to the output: [label, cost, kind] */
  below: Array<[string, number, LadderBand['kind']]>;
  /** From VDD down to the output. */
  above: Array<[string, number, LadderBand['kind']]>;
  note: string;
}

function stackFor(p: Preset, vovN: number, vovP: number, viss: number, vdd: number, vthp: number): Stack {
  switch (p) {
    case 'fiveT':
      return { vdd, below: [['VISS (M5)', viss, 'tail'], ['Vov2', vovN, 'n']], above: [['|Vov4|', vovP, 'p']], note: 'Exam OTA: floor Vov5 + Vov2 (input CM at its minimum), ceiling VDD − |Vov4|.' };
    case 'telescopic':
    case 'ex97':
      return { vdd, below: [['VISS (M9)', viss, 'tail'], ['Vov1', vovN, 'n'], ['Vov3', vovN, 'n']], above: [['|Vov7|', vovP, 'p'], ['|Vov5|', vovP, 'p']], note: 'Every stacked device costs its overdrive. Differential swing = 2 × (ceiling − floor).' };
    case 'mirrorTele':
      return { vdd, below: [['VISS', viss, 'tail'], ['Vov1', vovN, 'n'], ['Vov3', vovN, 'n']], above: [['|Vov8|', vovP, 'p'], ['|Vthp| (diode)', vthp, 'bad'], ['|Vov6|', vovP, 'p']], note: 'Fig 9.9: the diode-biased PMOS cascode costs an extra threshold at the top.' };
    case 'folded':
      return { vdd, below: [['Vov5', vovN, 'n'], ['Vov3', vovN, 'n']], above: [['|Vov9|', vovP, 'p'], ['|Vov7|', vovP, 'p']], note: 'Folded cascode: the input pair is not in the output stack, so only four overdrives. The tail no longer counts.' };
  }
}

const PRESET_VALUES: Record<Preset, { vovN: number; vovP: number; viss: number; vdd: number }> = {
  fiveT: { vovN: EXAM.design.vov1, vovP: EXAM.design.vov3, viss: EXAM.design.vov5, vdd: 1.8 },
  telescopic: { vovN: 0.2, vovP: 0.25, viss: 0.3, vdd: 1.8 },
  mirrorTele: { vovN: 0.2, vovP: 0.25, viss: 0.3, vdd: 3 },
  folded: { vovN: 0.2, vovP: 0.25, viss: 0.3, vdd: 1.8 },
  ex97: { vovN: 0.2, vovP: 0.3, viss: 0.5, vdd: 3 },
};

export function HeadroomLab() {
  const [preset, setPreset] = useState<Preset>('ex97');
  const [vals, setVals] = useState(PRESET_VALUES.ex97);
  const [vout, setVout] = useState(1.65);
  const choose = (p: Preset) => {
    setPreset(p);
    setVals(PRESET_VALUES[p]);
    const st = stackFor(p, PRESET_VALUES[p].vovN, PRESET_VALUES[p].vovP, PRESET_VALUES[p].viss, PRESET_VALUES[p].vdd, 0.5);
    const fl = st.below.reduce((a, b) => a + b[1], 0);
    const ce = st.vdd - st.above.reduce((a, b) => a + b[1], 0);
    setVout((fl + ce) / 2);
  };
  const st = stackFor(preset, vals.vovN, vals.vovP, vals.viss, vals.vdd, 0.5);
  const floor = st.below.reduce((a, b) => a + b[1], 0);
  const ceiling = st.vdd - st.above.reduce((a, b) => a + b[1], 0);
  const swing = ceiling - floor;
  // Bands: stack from the bottom; the device nearest the output is squeezed first.
  const bands: LadderBand[] = [];
  let y = 0;
  st.below.forEach(([label, cost, kind], i) => {
    const last = i === st.below.length - 1;
    const top = last ? Math.max(y, Math.min(vout, st.vdd)) : y + cost;
    bands.push({ from: y, to: top, label, kind: last && vout < floor - 1e-9 ? 'bad' : kind });
    y = top;
  });
  let t = st.vdd;
  st.above.forEach(([label, cost, kind], i) => {
    const last = i === st.above.length - 1;
    const bot = last ? Math.min(t, Math.max(vout, 0)) : t - cost;
    bands.push({ from: t, to: bot, label, kind: last && vout > ceiling + 1e-9 ? 'bad' : kind });
    t = bot;
  });
  const nodes: LadderNode[] = [
    { label: 'VDD', v: st.vdd },
    { label: 'ceiling', v: ceiling, tone: 'ok' },
    { label: 'Vout', v: vout, tone: vout < floor || vout > ceiling ? 'bad' : 'signal' },
    { label: 'floor', v: floor, tone: 'ok' },
  ];
  const e = ex97();
  const challenges = [
    { id: 'ex97', text: 'Ex 9.7 preset: confirm the book’s 0.9 V to 2.4 V output range (3 V differential).', done: preset === 'ex97' && Math.abs(floor - e.voutMin) < 1e-9 && Math.abs(ceiling - e.voutMax) < 1e-9 },
    { id: 'squeeze', text: 'Push Vout below the floor. Which device is squeezed first?', done: vout < floor },
    { id: 'diode', text: 'Mirror-loaded telescopic: how much swing does the diode’s threshold cost?', done: preset === 'mirrorTele' },
    { id: 'folded', text: 'Folded cascode: why does the tail no longer appear in the output stack?', done: preset === 'folded' },
    { id: 'vov', text: 'Halve the NMOS overdrive. How much swing do you win, and what does it cost (hint: W/L)?', done: vals.vovN <= PRESET_VALUES[preset].vovN / 2 + 1e-9 },
  ];
  return (
    <LabShell
      title="Headroom stack"
      intro="A room with a floor and a ceiling. Each stacked transistor needs its overdrive of breathing room, a diode costs a whole |VGS|, the tail costs VISS. What is left is the output swing."
      figures={
        <>
          <VoltageLadder vmax={st.vdd} nodes={nodes} bands={bands} h={420} title="Headroom stack: the swing left between floor and ceiling" />
          <LogBars
            title="Swing"
            unit="V/V"
            lo={0.1}
            hi={10}
            items={[
              { label: 'single-ended', value: Math.max(swing, 0.1001), tone: swing > 0 ? 'ok' : 'bad' },
              { label: 'differential', value: Math.max(2 * swing, 0.1001), tone: 'signal' },
            ]}
          />
        </>
      }
      controls={
        <>
          <Seg
            label="Circuit"
            value={preset}
            onChange={choose}
            options={[
              { value: 'fiveT', label: '5-T OTA (exam)' },
              { value: 'telescopic', label: 'Telescopic' },
              { value: 'ex97', label: 'Ex 9.7' },
              { value: 'mirrorTele', label: 'Mirror-loaded tele.' },
              { value: 'folded', label: 'Folded cascode' },
            ]}
          />
          <Slider label="VDD" value={vals.vdd} min={1.2} max={3.3} step={0.05} onChange={(v) => setVals({ ...vals, vdd: v })} format={V} />
          <Slider label="NMOS Vov" value={vals.vovN} min={0.05} max={0.5} step={0.01} onChange={(v) => setVals({ ...vals, vovN: v })} format={V} />
          <Slider label="PMOS |Vov|" value={vals.vovP} min={0.05} max={0.5} step={0.01} onChange={(v) => setVals({ ...vals, vovP: v })} format={V} />
          {preset !== 'folded' && <Slider label="VISS (tail)" value={vals.viss} min={0.1} max={0.6} step={0.01} onChange={(v) => setVals({ ...vals, viss: v })} format={V} />}
          <Slider label="Vout" value={vout} min={0} max={vals.vdd} step={0.01} onChange={setVout} format={V} />
          <div className="readouts">
            <Readout label="floor" value={V(floor)} />
            <Readout label="ceiling" value={V(ceiling)} />
            <Readout label="single-ended swing" value={V(swing)} tone={swing > 0 ? 'ok' : 'bad'} />
            <Readout label="differential p-p" value={V(2 * swing)} tone="signal" />
          </div>
          <p className="small muted">{st.note}</p>
        </>
      }
      challenges={challenges}
    />
  );
}
