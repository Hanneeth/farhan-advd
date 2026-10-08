/**
 * Milestone 2 labs (CLAUDE.md §8.4, 8.5, 8.9): impedance explorer, CS amplifier lab, cascode lab.
 * Every number comes from src/physics; the CS lab shows two independent solves side by side
 * (the slope of the large-signal curve and −Gm·Rout by inspection).
 */
import { useEffect, useMemo, useState } from 'react';
import { CascodeFig, CS_LOAD_LABEL, CsLoadFig, ImpedanceFig, LogBars, TelescopicFig } from '../circuits/figures2';
import { Plot } from '../circuits/Plot';
import { mosState, VoltageLadder, type DevState } from '../circuits/schematic';
import {
  cascodeRoutApprox,
  csActiveLoad,
  csCurrentSourceLoad,
  csDegenerated,
  csDiodeLoad,
  csOperatingPoint,
  csResistive,
  csSlope,
  csTriodeLoad,
  EX_9_7,
  ex97,
  gmFromIdVov,
  parallel,
  rIntoDrain,
  rIntoSource,
  rO,
  SET_B,
  smallSignalAt,
  telescopic,
  telescopicNetlist,
  smallSignalGain,
  solveOp,
  vinForVout,
  vovFromId,
  type CsLoad,
  type CsParams,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';
import { Tex } from '../ui/Tex';
import { LabShell } from './LabShell';

const V = (x: number) => formatSI(x, 'V');
const A = (x: number) => formatSI(x, 'A');
const Ohm = (x: number) => (Number.isFinite(x) ? formatSI(x, 'Ω') : '∞');
const S = (x: number) => formatSI(x, 'S');
const T = (x: number) => `\\text{${Ohm(x)}}`;
const g3 = (x: number) => (Math.abs(x) >= 100 ? x.toFixed(0) : x.toPrecision(3));

// ─── Impedance explorer ────────────────────────────────────────────────────

export function ImpedanceLab() {
  const [terminal, setTerminal] = useState<'gate' | 'drain' | 'source'>('drain');
  const [id, setId] = useState(100e-6);
  const [vov, setVov] = useState(0.2);
  const [lambda, setLambda] = useState(0.1);
  const [rs, setRs] = useState(0);
  const [rd, setRd] = useState(0);
  const gm = gmFromIdVov(id, vov);
  const ro = rO(lambda, id);
  const rDrain = rIntoDrain({ gm, rO: ro, rs });
  const rSource = rIntoSource({ gm, rO: ro, rd });
  const r = terminal === 'gate' ? Infinity : terminal === 'drain' ? rDrain : rSource;
  const formula =
    terminal === 'gate'
      ? 'R = \\infty'
      : terminal === 'drain'
        ? `R = r_O + (1 + g_m r_O)R_S = ${T(ro)} + (1 + ${g3(gm * ro)})\\times ${T(rs)} = ${T(rDrain)}`
        : `R = \\frac{R_D + r_O}{1 + g_m r_O} = \\frac{${T(rd)} + ${T(ro)}}{1 + ${g3(gm * ro)}} = ${T(rSource)}`;
  const challenges = [
    { id: 'gate', text: 'Look into the gate. Why can no current get in?', done: terminal === 'gate' },
    { id: 'plain', text: 'Look into the drain with RS = 0: it should read exactly rO = 1/(λID).', done: terminal === 'drain' && rs === 0 },
    { id: 'mult', text: 'Put RS = 10 kΩ under the source and look into the drain. By roughly what factor did RS get multiplied?', done: terminal === 'drain' && rs >= 10e3 },
    { id: 'src', text: 'Look into the source with RD = 0 and compare with 1/gm.', done: terminal === 'source' && rd === 0 },
    { id: 'div', text: 'Add RD = 50 kΩ on the drain while looking into the source: it adds only about RD/(gm·rO).', done: terminal === 'source' && rd >= 50e3 },
  ];
  return (
    <LabShell
      title="Impedance explorer"
      intro="Click a terminal and add resistors above or below the transistor. The dots show how much current a test voltage can push in: small resistance, fast flow."
      figures={
        <>
          <ImpedanceFig terminal={terminal} rs={terminal === 'drain' ? rs : 0} rd={terminal === 'source' ? rd : 0} r={r} />
          <div className="formula-strip">
            <Tex tex={formula} />
          </div>
          <LogBars
            items={[
              { label: 'into gate', value: Infinity, tone: terminal === 'gate' ? 'signal' : 'muted' },
              { label: 'into drain', value: rDrain, tone: terminal === 'drain' ? 'signal' : 'muted' },
              { label: 'rO', value: ro, tone: 'n' },
              { label: 'into source', value: rSource, tone: terminal === 'source' ? 'signal' : 'muted' },
              { label: '1/gm', value: 1 / gm, tone: 'n' },
            ]}
            lo={100}
            hi={1e10}
          />
        </>
      }
      controls={
        <>
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
          <Slider label="ID" value={id} min={10e-6} max={1e-3} step={10e-6} onChange={setId} format={A} />
          <Slider label="Vov" value={vov} min={0.1} max={0.5} step={0.01} onChange={setVov} format={V} />
          <Slider label="λ" value={lambda} min={0.01} max={0.3} step={0.01} onChange={setLambda} format={(v) => `${v.toFixed(2)} V⁻¹`} />
          <Slider label="RS (under the source)" value={rs} min={0} max={50e3} step={1e3} onChange={setRs} format={Ohm} />
          <Slider label="RD (on the drain)" value={rd} min={0} max={200e3} step={5e3} onChange={setRd} format={Ohm} />
          <div className="readouts">
            <Readout label="gm = 2ID/Vov" value={S(gm)} />
            <Readout label="rO = 1/(λID)" value={Ohm(ro)} />
            <Readout label="gm·rO" value={g3(gm * ro)} />
            <Readout label={`R into ${terminal}`} value={Ohm(r)} tone="signal" />
          </div>
          <p className="small muted">Up multiplies, down divides, by gm·rO. RS only matters looking into the drain; RD only matters looking into the source.</p>
        </>
      }
      challenges={challenges}
    />
  );
}

// ─── CS amplifier lab ──────────────────────────────────────────────────────

const PROC = { ...SET_B, lambdan: 0.1, lambdap: 0.1 };

interface CsKnobs {
  rd: number;
  rs: number;
  wl2: number;
  vb: number;
  wl1: number;
}

const DEFAULTS: Record<CsLoad, Partial<CsKnobs>> = {
  resistor: { rd: 10e3 },
  diode: { wl2: 5 },
  current: { vb: 1.1, wl2: 20 },
  triode: { wl2: 1 },
  active: { wl2: 5 },
  degenerated: { rd: 10e3, rs: 2e3 },
};

function csParams(load: CsLoad, k: CsKnobs): CsParams {
  return { load, proc: PROC, wl1: k.wl1, wl2: k.wl2, rd: k.rd, rs: k.rs, vb: k.vb };
}

/** −Gm·Rout by inspection at the operating point, with gm and rO from the device equations. */
function inspection(p: CsParams, vin: number) {
  const q = csOperatingPoint(p, vin);
  const vdd = p.proc.vdd;
  const m1 = smallSignalAt(p.proc.kpn, p.wl1, vin - q.vs - p.proc.vthn, q.vout - q.vs, p.proc.lambdan);
  const vsd = vdd - q.vout;
  const vsgP = p.load === 'diode' ? vsd : p.load === 'current' ? vdd - p.vb : p.load === 'triode' ? vdd : p.load === 'active' ? vdd - vin : 0;
  const m2 = smallSignalAt(p.proc.kpp, p.wl2, vsgP - p.proc.vthp, vsd, p.proc.lambdap);
  switch (p.load) {
    case 'resistor':
      return { Gm: m1.gm, rout: parallel(p.rd, m1.rO), av: csResistive({ gm: m1.gm, rd: p.rd, rO: m1.rO }), m1, m2, q };
    case 'diode':
      return { Gm: m1.gm, rout: parallel(1 / m2.gm, m1.rO, m2.rO), av: csDiodeLoad({ gm1: m1.gm, gm2: m2.gm, rO1: m1.rO, rO2: m2.rO }), m1, m2, q };
    case 'current':
      return { Gm: m1.gm, rout: parallel(m1.rO, m2.rO), av: csCurrentSourceLoad({ gm1: m1.gm, rO1: m1.rO, rO2: m2.rO }), m1, m2, q };
    case 'triode':
      return { Gm: m1.gm, rout: parallel(m2.rO, m1.rO), av: csTriodeLoad({ gm1: m1.gm, ron2: m2.rO, rO1: m1.rO }), m1, m2, q };
    case 'active':
      return { Gm: m1.gm + m2.gm, rout: parallel(m1.rO, m2.rO), av: csActiveLoad({ gm1: m1.gm, gm2: m2.gm, rO1: m1.rO, rO2: m2.rO }), m1, m2, q };
    case 'degenerated': {
      const Gm = 1 / (1 / m1.gm + p.rs);
      return { Gm, rout: p.rd, av: csDegenerated({ gm: m1.gm, rd: p.rd, rs: p.rs }), m1, m2, q };
    }
  }
}

export function CsLab() {
  const [load, setLoad] = useState<CsLoad>('current');
  const [k, setK] = useState<CsKnobs>({ rd: 10e3, rs: 2e3, wl2: 20, vb: 1.1, wl1: 10 });
  const p = csParams(load, k);
  const [vin, setVin] = useState(() => vinForVout(p, 0.9));
  const set = (patch: Partial<CsKnobs>) => setK((o) => ({ ...o, ...patch }));
  const choose = (l: CsLoad) => {
    const nk = { ...k, ...DEFAULTS[l] };
    setK(nk);
    setLoad(l);
    setVin(vinForVout(csParams(l, nk), 0.9));
  };
  useEffect(() => {
    // keep the Q point inside the plot when the curve moves a lot
    if (vin > PROC.vdd) setVin(PROC.vdd);
  }, [vin]);
  const curve = useMemo(() => {
    const pts: Array<[number, number]> = [];
    for (let n = 0; n <= 180; n++) {
      const x = (n / 180) * PROC.vdd;
      pts.push([x, csOperatingPoint(p, x).vout]);
    }
    return pts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, k.rd, k.rs, k.wl1, k.wl2, k.vb]);
  const ins = inspection(p, vin);
  const q = ins.q;
  const slope = csSlope(p, vin);
  const vsgP = load === 'diode' ? PROC.vdd - q.vout : load === 'current' ? PROC.vdd - k.vb : load === 'triode' ? PROC.vdd : PROC.vdd - vin;
  const devs: Record<string, DevState> = {
    m1: mosState({ name: 'M1', kind: 'n', role: 'input (CS)', vg: vin, vs: q.vs, vd: q.vout, vth: PROC.vthn, id: q.id, gm: ins.m1.gm, rO: ins.m1.rO }),
  };
  if (load !== 'resistor' && load !== 'degenerated') {
    devs.m2 = mosState({
      name: 'M2',
      kind: 'p',
      role: load === 'diode' ? 'diode load' : load === 'current' ? 'current source' : load === 'triode' ? 'triode resistor' : 'active load (CS too)',
      vg: PROC.vdd - vsgP,
      vs: PROC.vdd,
      vd: q.vout,
      vth: PROC.vthp,
      id: q.id,
      gm: ins.m2.gm,
      rO: ins.m2.rO,
    });
  }
  const m1Sat = devs.m1.region === 'saturation';
  const d = 0.08;
  const tangent: Array<[number, number]> = [
    [vin - d, q.vout - slope * d],
    [vin + d, q.vout + slope * d],
  ];
  const edge: Array<[number, number]> = [
    [PROC.vthn, 0],
    [PROC.vdd, PROC.vdd - PROC.vthn],
  ];
  const series = [
    { points: edge, color: 'var(--nmos)', width: 1.4, dashed: true, label: 'M1 fence', labelAt: 'end' as const },
    { points: curve, color: 'var(--ink)', width: 2.6 },
    { points: tangent, color: 'var(--signal)', width: 2.6 },
  ];
  if (load === 'active')
    series.unshift({ points: [[0, PROC.vthp], [PROC.vdd - PROC.vthp, PROC.vdd]], color: 'var(--pmos)', width: 1.4, dashed: true, label: 'M2 fence', labelAt: 'end' as const });
  const guides = load === 'current' ? [{ axis: 'y' as const, at: k.vb + PROC.vthp, label: 'M2 fence: Vb + |Vth|', color: 'var(--pmos)' }] : [];
  const challenges = [
    { id: 'max', text: 'Drag Q to the steepest part of the curve. The tangent’s slope is the gain.', done: m1Sat && Math.abs(slope) > 0.9 * Math.abs(ins.av) && Math.abs(slope) > 5 },
    { id: 'triode', text: 'Push M1 into triode (Q past the dashed fence). What happens to the gain?', done: devs.m1.region === 'triode' },
    { id: 'diode', text: 'Switch to the diode load: the gain is small and almost the same everywhere. Why?', done: load === 'diode' },
    { id: 'active', text: 'Try the active load: about twice the current-source gain. Which two gm’s add?', done: load === 'active' && m1Sat },
    { id: 'degen', text: 'Degenerate with RS = 5 kΩ: the curve straightens and |Av| → RD/RS.', done: load === 'degenerated' && k.rs >= 5e3 },
  ];
  return (
    <LabShell
      title="CS amplifier lab"
      intro="One input transistor, six loads. Drag the Q point along the transfer curve (or use the slider). The tangent is the gain; the readouts compare it with −Gm·Rout by inspection."
      figures={
        <>
          <div>
            <CsLoadFig load={load} vdd={PROC.vdd} vin={vin} vout={q.vout} id={q.id} rd={k.rd} rs={k.rs} devs={devs} />
            <Plot
              title="Transfer curve Vout(Vin) with the tangent at Q"
              xRange={[0, PROC.vdd]}
              yRange={[0, PROC.vdd]}
              xLabel="Vin (V)"
              yLabel="Vout (V)"
              h={300}
              xFmt={(v) => v.toFixed(1)}
              yFmt={(v) => v.toFixed(1)}
              series={series}
              guides={guides}
              markers={[{ x: vin, y: q.vout, label: 'Q', labelPos: 'left' }]}
              onPick={(x) => setVin(Math.round(x * 1000) / 1000)}
            />
          </div>
        </>
      }
      controls={
        <>
          <Seg label="Load" value={load} onChange={choose} options={(Object.keys(CS_LOAD_LABEL) as CsLoad[]).map((l) => ({ value: l, label: CS_LOAD_LABEL[l] }))} />
          <Slider label="Vin (Q point)" value={vin} min={0} max={PROC.vdd} step={0.001} onChange={setVin} format={(v) => formatSI(v, 'V', 4)} />
          <Slider label="(W/L)1" value={k.wl1} min={2} max={40} step={1} onChange={(v) => set({ wl1: v })} />
          {(load === 'resistor' || load === 'degenerated') && <Slider label="RD" value={k.rd} min={2e3} max={40e3} step={500} onChange={(v) => set({ rd: v })} format={Ohm} />}
          {load === 'degenerated' && <Slider label="RS" value={k.rs} min={0} max={8e3} step={250} onChange={(v) => set({ rs: v })} format={Ohm} />}
          {load === 'current' && <Slider label="Vb (M2 gate)" value={k.vb} min={0.8} max={1.25} step={0.005} onChange={(v) => set({ vb: v })} format={V} />}
          {load !== 'resistor' && load !== 'degenerated' && <Slider label="(W/L)2" value={k.wl2} min={1} max={40} step={1} onChange={(v) => set({ wl2: v })} />}
          <div className="readouts">
            <Readout label="Vout at Q" value={V(q.vout)} />
            <Readout label="ID" value={A(q.id)} />
            <Readout label="slope of the curve" value={g3(slope)} tone="signal" />
            <Readout label="−Gm·Rout (inspection)" value={m1Sat ? g3(ins.av) : 'M1 not saturated'} tone={m1Sat ? 'ok' : 'bad'} />
            <Readout label="Gm" value={S(ins.Gm)} />
            <Readout label="Rout" value={Ohm(ins.rout)} />
          </div>
          <p className="small muted">Process: µnCox 200 µA/V², µpCox 100 µA/V², Vthn 0.4 V, |Vthp| 0.5 V, λ = 0.1 V⁻¹, VDD 1.8 V.</p>
        </>
      }
      challenges={challenges}
    />
  );
}

// ─── Cascode lab ───────────────────────────────────────────────────────────

export function CascodeLab() {
  const e = ex97();
  const [mode, setMode] = useState<'single' | 'telescopic'>('telescopic');
  const [vout, setVout] = useState(1.65);
  const [vinCm, setVinCm] = useState(e.vinCm);
  const [vb1, setVb1] = useState(e.vb1);
  const [vb2, setVb2] = useState(e.vb2);
  const [longP, setLongP] = useState(false);
  // single-stage cascode
  const [load, setLoad] = useState<'current' | 'cascode'>('current');
  const [svb1, setSvb1] = useState(1.0);
  const [svout, setSvout] = useState(1.1);

  const t = telescopic({ proc: EX_9_7, iss: 3e-3, wlN: e.wlN, wlP: e.wlP, viss: 0.5, lambdaP: longP ? EX_9_7.lambdap / 2 : undefined });
  const simpleLoadRout = parallel(t.rDown, t.p.rO);
  // Simulated: the whole op amp solved with an ideal CMFB holding the output CM at the slider value.
  // Tail bias trimmed once (book bias point) to carry exactly 3 mA, then held fixed while you move the sliders.
  const vbTail = useMemo(() => solveOp(telescopicNetlist({ proc: EX_9_7, wlN: e.wlN, wlP: e.wlP, wl9: e.wl9, vbTail: 1.2, vinCm: e.vinCm + 0.05, vb1: e.vb1 + 0.05, vb2: e.vb2, voutCm: 1.65, vd: 0, iss: 3e-3 })).v.vbt, []); // eslint-disable-line react-hooks/exhaustive-deps
  const teleArgs = { proc: EX_9_7, wlN: e.wlN, wlP: e.wlP, wl9: e.wl9, vbTail, vinCm, vb1, vb2, voutCm: vout, vd: 0, lambdaP: longP ? EX_9_7.lambdap / 2 : undefined };
  const tNet = telescopicNetlist(teleArgs);
  const tOp = solveOp(tNet);
  const tGain = smallSignalGain(tNet, tOp, 'o2', (_n, dv) => telescopicNetlist({ ...teleArgs, vd: dv })) - smallSignalGain(tNet, tOp, 'o1', (_n, dv) => telescopicNetlist({ ...teleArgs, vd: dv }));
  const n = { vP: tOp.v.p, vX: (tOp.v.x1 + tOp.v.x2) / 2, vY: (tOp.v.y1 + tOp.v.y2) / 2 };
  const bad = Object.values(tOp.mos).filter((m) => m.region !== 'saturation').map((m) => `${m.name} ${m.region}`);

  const proc = { ...SET_B, lambdan: 0.1, lambdap: 0.1 };
  const sid = 100e-6, swl = 20;
  const svov = vovFromId(sid, proc.kpn, swl);
  const sgm = gmFromIdVov(sid, svov);
  const sro = rO(0.1, sid);
  const sDown = cascodeRoutApprox(sgm, sro, sro);
  const sRout = parallel(sDown, load === 'cascode' ? sDown : sro);

  const challenges = [
    { id: 'floor', text: 'Telescopic: lower Vout until a transistor turns red. Which one goes first, and at what voltage?', done: mode === 'telescopic' && vout < e.voutMin && bad.length > 0 },
    { id: 'ceiling', text: 'Raise Vout past the ceiling. Which PMOS fails first?', done: mode === 'telescopic' && vout > e.voutMax && bad.length > 0 },
    { id: 'vb1', text: 'Lower Vb1 by 0.1 V: M1/M2 are squeezed into triode even though Vout is fine.', done: mode === 'telescopic' && vb1 <= e.vb1 - 0.1 && bad.some((b) => b === 'M1' || b === 'M2') },
    { id: 'long', text: 'Double W and L of M5–M8. What happens to the gain, and why does Vov stay the same?', done: mode === 'telescopic' && longP },
    { id: 'trap', text: 'Single cascode: compare the simple and cascoded loads. How big is the jump?', done: mode === 'single' && load === 'cascode' },
  ];

  return (
    <LabShell
      title="Cascode lab"
      intro="The telescopic op amp of Razavi Example 9.7, every node live. Move the bias voltages and the output level; the transistor that leaves saturation turns red, and the ladder shows where the headroom went."
      figures={
        mode === 'telescopic' ? (
          <>
            <div>
              <TelescopicFig proc={EX_9_7} iss={3e-3} wlN={e.wlN} wlP={e.wlP} wl9={e.wl9} vinCm={vinCm} vb1={vb1} vb2={vb2} vout={vout} sim={tOp} />
              <VoltageLadder
                vmax={3}
                h={400}
                title="Bias ladder: every node on one voltage axis"
                nodes={[
                  { label: 'VDD', v: 3 },
                  { label: 'Y', v: n.vY },
                  { label: 'Vb2', v: vb2 },
                  { label: 'Vout', v: vout, tone: 'signal' },
                  { label: 'Vb1', v: vb1 },
                  { label: 'Vin,CM', v: vinCm },
                  { label: 'X', v: n.vX },
                  { label: 'P', v: n.vP },
                ]}
                bands={[
                  { from: 3, to: n.vY, label: 'M7', kind: tOp.mos.M7.region === 'saturation' ? 'p' : 'bad' },
                  { from: n.vY, to: vout, label: 'M5', kind: tOp.mos.M5.region === 'saturation' ? 'p' : 'bad' },
                  { from: vout, to: n.vX, label: 'M3', kind: tOp.mos.M3.region === 'saturation' ? 'n' : 'bad' },
                  { from: n.vX, to: n.vP, label: 'M1', kind: tOp.mos.M1.region === 'saturation' ? 'n' : 'bad' },
                  { from: n.vP, to: 0, label: 'M9', kind: tOp.mos.M9.region === 'saturation' ? 'tail' : 'bad' },
                ]}
              />
            </div>
            <LogBars
              title="Output resistance: simple load versus cascoded load"
              lo={1e3}
              hi={1e8}
              items={[
                { label: 'rO (PMOS)', value: t.p.rO, tone: 'p' },
                { label: 'R down', value: t.rDown, tone: 'n' },
                { label: 'R up', value: t.rUp, tone: 'p' },
                { label: 'simple load', value: simpleLoadRout, tone: 'muted' },
                { label: 'telescopic', value: t.rout, tone: 'signal' },
              ]}
            />
          </>
        ) : (
          <>
            <CascodeFig load={load} proc={proc} id={sid} wl={swl} vb1={svb1} vout={svout} />
            <LogBars
              lo={1e3}
              hi={1e9}
              items={[
                { label: 'rO', value: sro, tone: 'muted' },
                { label: 'R down', value: sDown, tone: 'n' },
                { label: 'R up', value: load === 'cascode' ? sDown : sro, tone: 'p' },
                { label: 'Rout', value: sRout, tone: 'signal' },
              ]}
            />
          </>
        )
      }
      controls={
        <>
          <Seg
            label="Circuit"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'telescopic', label: 'Telescopic (Ex 9.7)' },
              { value: 'single', label: 'Single cascode' },
            ]}
          />
          {mode === 'telescopic' ? (
            <>
              <Slider label="Vout (CM level)" value={vout} min={0.5} max={2.9} step={0.01} onChange={setVout} format={V} />
              <Slider label="Vin,CM" value={vinCm} min={1.0} max={2.0} step={0.01} onChange={setVinCm} format={V} />
              <Slider label="Vb1 (NMOS cascodes)" value={vb1} min={1.2} max={2.4} step={0.01} onChange={setVb1} format={V} />
              <Slider label="Vb2 (PMOS cascodes)" value={vb2} min={1.2} max={2.3} step={0.01} onChange={setVb2} format={V} />
              <label className="small check">
                <input type="checkbox" checked={longP} onChange={(ev) => setLongP(ev.target.checked)} /> Double W and L of M5–M8 (λp halves)
              </label>
              <div className="readouts">
                <Readout label="saturated (simulated)" value={bad.length ? `${bad.join(', ')} ✗` : 'all 9 ✓'} tone={bad.length ? 'bad' : 'ok'} />
                <Readout label="|Av| simulated (CMFB holds the CM)" value={g3(tGain)} tone={bad.length ? 'bad' : 'signal'} />
                <Readout label="ID (each side, simulated)" value={formatSI(tOp.mos.M1.id, 'A')} />
                <Readout label="Rdown ≈ gm3·rO3·rO1" value={Ohm(t.rDown)} />
                <Readout label="Rup ≈ gm5·rO5·rO7" value={Ohm(t.rUp)} />
                <Readout label="|Av| = gm1·(Rdown ‖ Rup) by hand" value={g3(t.av)} tone="ok" />
                <Readout label="swing (each output)" value={`${V(t.voutMin)} to ${V(t.voutMax)}`} />
              </div>
              <p className="small muted">Book values: Vin,CM 1.4 V, Vb1 1.6 V, Vb2 1.7 V; gain ≈ 1.4×10³ (book 1416), ≈ 4000 after lengthening.</p>
            </>
          ) : (
            <>
              <Seg
                label="Load"
                value={load}
                onChange={setLoad}
                options={[
                  { value: 'current', label: 'Simple PMOS' },
                  { value: 'cascode', label: 'Cascode PMOS' },
                ]}
              />
              <Slider label="Vb1 (cascode gate)" value={svb1} min={0.6} max={1.5} step={0.01} onChange={setSvb1} format={V} />
              <Slider label="Vout" value={svout} min={0.3} max={1.7} step={0.01} onChange={setSvout} format={V} />
              <div className="readouts">
                <Readout label="gm·rO" value={g3(sgm * sro)} />
                <Readout label="Rout" value={Ohm(sRout)} />
                <Readout label="|Av| = gm·Rout" value={g3(sgm * sRout)} tone="signal" />
              </div>
            </>
          )}
        </>
      }
      challenges={challenges}
    />
  );
}
