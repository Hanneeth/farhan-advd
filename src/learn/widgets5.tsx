/**
 * Interactive pictures for lectures L5–L9: two-stage op amp, gain boosting, CMFB.
 */
import { useState } from 'react';
import { LogBars } from '../circuits/figures2';
import { CmfbTriodeFig, GainBoostFig, TwoStageFig } from '../circuits/figures4';
import { boostedRout, gmFromIdVov, rO, SET_A, triodeSenseOutputSum, tut3Q2, tut4Q1, twoStageNodes, regionFromNodesPure } from '../physics';
import { formatSI } from '../practice/units';
import { Readout, Slider } from '../ui/Slider';

const V = (x: number) => formatSI(x, 'V');
const Ohm = (x: number) => formatSI(x, 'Ω');

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

function TwoStageMini() {
  const q = tut3Q2();
  const [vinCm, setVinCm] = useState(1.5);
  const [vout, setVout] = useState(1.5);
  const n = twoStageNodes({ proc: SET_A, iss: 1e-3, id2: 1e-3, wl: 200, vinCm, vout });
  const bad = Object.entries(n.devices).filter(([, d]) => regionFromNodesPure(d) !== 'saturation').map(([k]) => k.toUpperCase());
  return (
    <Panel figure={<TwoStageFig proc={SET_A} iss={1e-3} id2={1e-3} wl={200} vinCm={vinCm} vout={vout} />}>
      <Slider label="Vin,CM" value={vinCm} min={1.2} max={2.6} step={0.01} onChange={setVinCm} format={V} />
      <Slider label="Vout (CM)" value={vout} min={0.1} max={2.9} step={0.01} onChange={setVout} format={V} />
      <Readout label="saturated" value={bad.length ? `${bad.join(', ')} out ✗` : 'all ✓'} tone={bad.length ? 'bad' : 'ok'} />
      <Readout label="X, Y (set by M5’s current)" value={V(q.vxy)} />
      <Readout label="A1 × A2" value={`${q.a1.toFixed(1)} × ${q.a2.toFixed(1)} = ${q.av.toFixed(0)}`} tone="signal" />
      <Readout label="differential swing" value={V(q.diffSwing)} />
      <p className="small muted">Tutorial 3 Q2. The first stage gives gain; the second stage gives swing (one device at each rail). The output can go almost rail to rail.</p>
    </Panel>
  );
}

function GainBoostMini() {
  const t = tut4Q1();
  const [a1, setA1] = useState(Math.round(t.a3));
  const id = 0.5e-3, vov = 0.1703, lambda = 0.1;
  const gm = gmFromIdVov(id, vov);
  const ro = rO(lambda, id);
  const r0 = boostedRout({ gm2: gm, rO2: ro, rO1: ro, a1: 0 });
  const rb = boostedRout({ gm2: gm, rO2: ro, rO1: ro, a1 });
  return (
    <Panel
      figure={
        <div className="stack">
          <GainBoostFig vx={t.vx} vg2={t.vg2} vout={1.8} i1={100e-6} i2={0.5e-3} inspector={false} />
          <LogBars
            lo={1e4}
            hi={1e10}
            title="Output resistance: one device, cascode, boosted cascode"
            items={[
              { label: 'rO', value: ro, tone: 'muted' },
              { label: 'cascode', value: r0, tone: 'n' },
              { label: 'boosted', value: rb, tone: 'signal' },
              { label: 'PMOS load rO', value: rO(0.2, id), tone: 'p' },
            ]}
          />
        </div>
      }
    >
      <Slider label="auxiliary gain A1" value={a1} min={0} max={300} step={1} onChange={setA1} />
      <Readout label="cascode Rout" value={Ohm(r0)} />
      <Readout label="boosted Rout = rO1 + rO2 + (1 + A1)gm rO²" value={Ohm(rb)} tone="signal" />
      <Readout label="gain (ideal load)" value={(gm * rb).toExponential(2)} />
      <p className="small muted">Tutorial 4 Q1 numbers (A1 = gm3·rO3 ≈ {t.a3.toFixed(0)}). The auxiliary amplifier holds X still, so M2 fights back (1 + A1) times harder. The bars also show the trap: a simple PMOS load (bottom bar) would throw it all away.</p>
    </Panel>
  );
}

function CmfbMini() {
  const [vinCm, setVinCm] = useState(1.2);
  const kpn = 135e-6, vth = 0.7, id = 0.5e-3, wl = 46.3;
  // The NMOS input pair's sources sit at P = Vb1 − VGS (their gate CM is fixed): the triode pair must carry 2ID at that VP.
  const vgs = vth + Math.sqrt((2 * id) / (kpn * 46.3));
  const vp = Math.max(0.01, vinCm - vgs);
  const sum = triodeSenseOutputSum({ id, kpn, wl, vp, vthn: vth });
  return (
    <Panel figure={<CmfbTriodeFig vout1={sum / 2} vout2={sum / 2} vp={vp} wl={wl} />}>
      <Slider label="input CM (sets P = Vin,CM − VGS)" value={vinCm} min={1.12} max={1.6} step={0.005} onChange={setVinCm} format={V} />
      <Readout label="VP" value={V(vp)} />
      <Readout label="Vout1 + Vout2 forced by the loop" value={V(sum)} />
      <Readout label="output CM" value={V(sum / 2)} tone="signal" />
      <p className="small muted">The two triode devices must carry the whole tail current at VP. If the outputs rise, their gates rise, their resistance falls, P falls… the loop pulls the output CM back to where 2ID·Rtot = VP. Tutorial 5 Q1 sizes them for 1.5 V.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS5: Record<string, (p: any) => React.ReactElement> = {
  twoStageMini: TwoStageMini,
  gainBoostMini: GainBoostMini,
  cmfbMini: CmfbMini,
};
