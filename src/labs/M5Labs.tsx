/**
 * Stability and compensation lab (L11–L14): build a loop from poles (and a RHP zero), or from the Lec 17
 * two-stage op amp with CC and Rz; see ωgx, ωpx, PM and GM on the Bode plots and the ringing in the step.
 */
import { useState } from 'react';
import { ClosedStepFig, LoopBodeFig, TwoStageMillerFig } from '../circuits/figures5';
import { ccForPhaseMargin, gainCrossover, gainMarginDb, millerLoop, millerTwoStage, peakingFactor, phaseCrossover, phaseMargin, rzCancel, rzNull, twoStageSlewRate, type LoopSpec } from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';
import { LabShell } from './LabShell';

const Hz = (f: number) => formatSI(f, 'Hz');
const lin = (x: number) => 10 ** x;

export function StabilityLab() {
  const [mode, setMode] = useState<'poles' | 'miller'>('poles');
  // Poles mode
  const [la0, setLa0] = useState(4);
  const [lp1, setLp1] = useState(3);
  const [lp2, setLp2] = useState(6);
  const [lp3, setLp3] = useState(7.5);
  const [three, setThree] = useState(true);
  const [lz, setLz] = useState(9);
  const [zero, setZero] = useState(false);
  const [lb, setLb] = useState(0);
  // Miller mode
  const [ccP, setCcP] = useState(1);
  const [ratio, setRatio] = useState(5);
  const [clP, setClP] = useState(5);
  const [rzMode, setRzMode] = useState<'none' | 'null' | 'cancel'>('none');

  const gm1 = 0.5e-3;
  const gm2 = gm1 * ratio;
  const mm = { gm1, r1: 400e3, c1: 0.2e-12, gm2, r2: 40e3, c2: clP * 1e-12, cc: ccP * 1e-12 };
  const rz = rzMode === 'none' ? 0 : rzMode === 'null' ? rzNull(gm2) : rzCancel({ gm2, cc: mm.cc, cl: mm.c2, c1: mm.c1 });
  const spec: LoopSpec =
    mode === 'poles'
      ? { a0: lin(la0), poles: three ? [lin(lp1), lin(lp2), lin(lp3)] : [lin(lp1), lin(lp2)], zerosRhp: zero ? [lin(lz)] : [], beta: lin(lb) }
      : millerLoop({ ...mm, rz }, lin(lb));
  const pm = phaseMargin(spec);
  const gmDb = gainMarginDb(spec);
  const gx = gainCrossover(spec);
  const px = phaseCrossover(spec);
  const r = millerTwoStage({ ...mm, rz });
  const sr = twoStageSlewRate({ iss: 100e-6, cc: mm.cc, i7: 0.5e-3, cl: mm.c2 });

  const challenges = [
    { id: 'unstable', text: 'Make the loop oscillate (negative phase margin). What did you change?', done: pm < 0 },
    { id: 'sixty', text: 'Get a phase margin between 58° and 62°. How does the step look?', done: pm > 58 && pm < 62 },
    { id: 'beta', text: 'With three poles, fix an unstable loop using ONLY β. What closed-loop gain did you need?', done: mode === 'poles' && three && pm > 45 && lb < -0.5 },
    { id: 'rhp', text: 'Two-stage: switch Rz off → on. How many degrees did the RHP zero cost?', done: mode === 'miller' && rzMode !== 'none' },
    { id: 'cl', text: 'Two-stage: raise CL and watch PM fall. Why does a bigger load hurt a two-stage op amp but help a one-stage one?', done: mode === 'miller' && clP >= 15 },
  ];

  return (
    <LabShell
      title="Stability & compensation lab"
      intro="Build a loop from poles, or use the Lec 17 two-stage op amp with CC and Rz. The Bode plots mark ωgx, ωpx, the phase margin and the gain margin; the step response shows what the margin means."
      figures={
        <>
          {mode === 'miller' && <TwoStageMillerFig rz={rzMode !== 'none'} />}
          <LoopBodeFig spec={spec} />
          <ClosedStepFig specs={[{ spec, label: `PM ${pm.toFixed(0)}°` }]} />
        </>
      }
      controls={
        <>
          <Seg label="Mode" value={mode} onChange={setMode} options={[{ value: 'poles', label: 'Poles & zero' }, { value: 'miller', label: 'Two-stage + CC' }]} />
          {mode === 'poles' ? (
            <>
              <Slider label="A0" value={la0} min={1} max={6} step={0.05} onChange={setLa0} format={(v) => `${lin(v).toPrecision(3)} (${(20 * v).toFixed(0)} dB)`} />
              <Slider label="fp1" value={lp1} min={1} max={6} step={0.05} onChange={setLp1} format={(v) => Hz(lin(v))} />
              <Slider label="fp2" value={lp2} min={3} max={9} step={0.05} onChange={setLp2} format={(v) => Hz(lin(v))} />
              <label className="check">
                <input type="checkbox" checked={three} onChange={(e) => setThree(e.target.checked)} /> third pole
              </label>
              {three && <Slider label="fp3" value={lp3} min={4} max={10} step={0.05} onChange={setLp3} format={(v) => Hz(lin(v))} />}
              <label className="check">
                <input type="checkbox" checked={zero} onChange={(e) => setZero(e.target.checked)} /> right-half-plane zero
              </label>
              {zero && <Slider label="fz (RHP)" value={lz} min={4} max={10} step={0.05} onChange={setLz} format={(v) => Hz(lin(v))} />}
            </>
          ) : (
            <>
              <Slider label="CC" value={ccP} min={0.1} max={6} step={0.05} onChange={setCcP} format={(v) => `${v.toFixed(2)} pF`} />
              <Slider label="Gm2 / Gm1 (Gm1 = 0.5 mS)" value={ratio} min={1} max={20} step={0.5} onChange={setRatio} format={(v) => `${v.toFixed(1)}×`} />
              <Slider label="CL" value={clP} min={1} max={30} step={0.5} onChange={setClP} format={(v) => `${v.toFixed(1)} pF`} />
              <Seg label="Rz" value={rzMode} onChange={setRzMode} options={[{ value: 'none', label: 'no Rz' }, { value: 'null', label: 'Rz = 1/Gm2' }, { value: 'cancel', label: 'Rz cancels P2' }]} />
            </>
          )}
          <Slider label="β (feedback factor)" value={lb} min={-3} max={0} step={0.05} onChange={setLb} format={(v) => `${lin(v).toPrecision(2)} (gain ${(1 / lin(v)).toPrecision(3)})`} />
          <div className="readouts">
            <Readout label="ωgx" value={gx ? Hz(gx) : '—'} />
            <Readout label="ωpx" value={px ? Hz(px) : 'never −180°'} />
            <Readout label="phase margin" value={`${pm.toFixed(1)}°`} tone={pm < 0 ? 'bad' : pm >= 55 ? 'ok' : undefined} />
            <Readout label="gain margin" value={Number.isFinite(gmDb) ? `${gmDb.toFixed(1)} dB` : '∞'} tone={gmDb < 0 ? 'bad' : 'ok'} />
            <Readout label="closed-loop peak at ωgx" value={pm > 0 ? `${peakingFactor(pm).toFixed(2)} × 1/β` : 'oscillates'} />
            {mode === 'miller' && (
              <>
                <Readout label="GBW = Gm1/(2πCC)" value={Hz(r.gbw / (2 * Math.PI))} />
                <Readout label="P1′ / P2′" value={`${Hz(r.p1 / (2 * Math.PI))} / ${Hz(r.p2 / (2 * Math.PI))}`} />
                <Readout label="zero" value={!Number.isFinite(r.z) ? '∞' : `${Hz(Math.abs(r.z) / (2 * Math.PI))} ${r.z > 0 ? 'RHP' : 'LHP'}`} tone={r.z > 0 ? 'bad' : 'ok'} />
                <Readout label="CC for 60° (hand rule)" value={formatSI(ccForPhaseMargin({ gm1, gm2, cl: mm.c2, pm: 60, zeroNulled: rzMode !== 'none' }), 'F')} />
                <Readout label="slew rate (ISS 100 µA, I7 0.5 mA)" value={`${(sr.sr / 1e6).toFixed(1)} V/µs`} />
              </>
            )}
          </div>
        </>
      }
      challenges={challenges}
    />
  );
}
