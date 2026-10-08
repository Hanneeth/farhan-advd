/**
 * Interactive pictures for the digital half (L15–L38): the inverter VTC and noise margins, loads,
 * switching delay, gates from an expression, RC/Elmore, logical effort, power, dynamic and pass logic,
 * flip-flop timing, adders, Booth recoding and the SRAM cell.
 */
import { useState } from 'react';
import { CmosVtcFig, DynamicGateFig, EffortPathFig, FlopTimingFig, InverterFig, NoiseMarginFig, PassGateFig, RcLadderFig, SramCellFig, StaticGateFig, SwitchingFig, VtcPlot, vtcCurve } from '../circuits/figuresD';
import {
  boothRadix4,
  carrySkipDelay,
  chargeSharing,
  cmosVilVih,
  cmosVM,
  cmosVout,
  commonEulerPath,
  complexGateEffort,
  depletionLoadVol,
  dynamicPower,
  elmoreLadder,
  ffTiming,
  idSquare,
  LE,
  nandVM,
  norVM,
  parseExpr,
  passChainDelay,
  pathEffort,
  pseudoNmosVol,
  resistiveInverter,
  rippleDelay,
  sramReadBump,
  sramWriteLevel,
  tauPHL,
  tauPLH,
  type InvSpec,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';

const V = (x: number) => formatSI(x, 'V');

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

/* ─── L15 / L17: CMOS VTC and noise margins ─── */

function VtcMini() {
  const [ratio, setRatio] = useState(1);
  const [vdd, setVdd] = useState(5);
  const [vt, setVt] = useState(1);
  const spec: InvSpec = { vdd, vtn: vt, vtp: vt, kn: 100e-6 * ratio, kp: 100e-6 };
  const { vil, vih } = cmosVilVih(spec);
  const vm = cmosVM(spec);
  return (
    <Panel
      figure={
        <div className="stack">
          <CmosVtcFig spec={spec} />
          <NoiseMarginFig voh={vdd} vol={0} vil={vil} vih={vih} vdd={vdd} />
        </div>
      }
    >
      <Slider label="kR = kn/kp" value={ratio} min={0.25} max={4} step={0.05} onChange={setRatio} format={(v) => v.toFixed(2)} />
      <Slider label="VDD" value={vdd} min={1.2} max={5} step={0.1} onChange={setVdd} format={V} />
      <Slider label="Vthn = |Vthp|" value={vt} min={0.2} max={Math.min(1.5, vdd / 2 - 0.1)} step={0.05} onChange={setVt} format={V} />
      <Readout label="VM (switching threshold)" value={V(vm)} tone="signal" />
      <Readout label="VIL / VIH (slope −1)" value={`${V(vil)} / ${V(vih)}`} />
      <Readout label="NML = VIL − VOL" value={V(vil)} />
      <Readout label="NMH = VOH − VIH" value={V(vdd - vih)} />
      <p className="small muted">kR = 1 with equal thresholds is the symmetric inverter: VM = VDD/2 and equal noise margins. A stronger nMOS (kR &gt; 1) pulls VM down; a stronger pMOS pushes it up. The steep middle is where the inverter is an amplifier with huge gain.</p>
    </Panel>
  );
}

/* ─── L16: every load ─── */

function LoadsMini() {
  const [load, setLoad] = useState<'resistive' | 'depletion' | 'pseudo' | 'cmos'>('resistive');
  const [strength, setStrength] = useState(4);
  const vdd = 5, vt = 1, kn = 100e-6;
  const kl = kn / strength;
  let curve: Array<[number, number]>;
  let vol = 0;
  let pstat = 0;
  if (load === 'resistive') {
    const rl = strength / (kn * 2.5);
    const r = resistiveInverter({ vdd, vt, kn, rl });
    vol = r.vol;
    pstat = r.pstatic;
    curve = vtcCurve((vin) => {
      let lo = 0, hi = vdd;
      for (let i = 0; i < 60; i++) {
        const m = (lo + hi) / 2;
        if ((vdd - m) / rl > idSquare(kn, vin, m, vt)) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    }, vdd, 160);
  } else if (load === 'depletion') {
    const vtd = 3;
    const r = depletionLoadVol({ vdd, vtn: vt, vtd, kn, kd: kl });
    vol = r.vol;
    pstat = r.istatic * vdd;
    curve = vtcCurve((vin) => {
      let lo = 0, hi = vdd;
      for (let i = 0; i < 60; i++) {
        const m = (lo + hi) / 2;
        if (idSquare(kl, vtd, vdd - m, 0) > idSquare(kn, vin, m, vt)) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    }, vdd, 160);
  } else if (load === 'pseudo') {
    const r = pseudoNmosVol({ vdd, vtn: vt, vtp: vt, kn, kp: kl });
    vol = r.vol;
    pstat = r.pstatic;
    curve = vtcCurve((vin) => {
      let lo = 0, hi = vdd;
      for (let i = 0; i < 60; i++) {
        const m = (lo + hi) / 2;
        if (idSquare(kl, vdd, vdd - m, vt) > idSquare(kn, vin, m, vt)) lo = m;
        else hi = m;
      }
      return (lo + hi) / 2;
    }, vdd, 160);
  } else {
    curve = vtcCurve((vin) => cmosVout({ vdd, vtn: vt, vtp: vt, kn, kp: kn }, vin), vdd, 160);
  }
  return (
    <Panel
      figure={
        <div className="stack">
          <InverterFig load={load} />
          <VtcPlot curve={curve} vdd={vdd} vol={vol} voh={vdd} h={230} />
        </div>
      }
    >
      <Seg label="Load" value={load} onChange={setLoad} options={[{ value: 'resistive', label: 'Resistor' }, { value: 'depletion', label: 'Depletion nMOS' }, { value: 'pseudo', label: 'Pseudo-nMOS' }, { value: 'cmos', label: 'CMOS' }]} />
      {load !== 'cmos' && <Slider label="driver ÷ load strength (kR)" value={strength} min={1} max={12} step={0.5} onChange={setStrength} format={(v) => v.toFixed(1)} />}
      <Readout label="VOL" value={V(vol)} tone={vol < 0.5 ? 'ok' : 'bad'} />
      <Readout label="static power with output low" value={formatSI(pstat, 'W')} tone={pstat > 0 ? 'bad' : 'ok'} />
      <p className="small muted">VDD = 5 V, Vth = 1 V. Every ratioed load (resistor, depletion, pseudo-nMOS) fights the driver when the output is low: VOL is never 0 and current flows all the time. Make the driver stronger (bigger kR) for a lower VOL. CMOS has no fight: VOL = 0 and no static current.</p>
    </Panel>
  );
}

/* ─── L18 / L19: switching delay ─── */

function SwitchMini() {
  const [cl, setCl] = useState(100);
  const [wn, setWn] = useState(1);
  const [wp, setWp] = useState(1);
  const vdd = 1.8, vt = 0.45, kpn = 200e-6, kpp = 80e-6, base = 2;
  const kn = kpn * base * wn, kp = kpp * base * wp;
  const phl = tauPHL({ cl: cl * 1e-15, kn, vtn: vt, voh: vdd, vol: 0 });
  const plh = tauPLH({ cl: cl * 1e-15, kp, vtp: vt, voh: vdd, vol: 0 });
  return (
    <Panel
      figure={
        <div className="stack">
          <InverterFig load="cmos" />
          <SwitchingFig tphl={phl} tplh={plh} vdd={vdd} />
        </div>
      }
    >
      <Slider label="load CL" value={cl} min={10} max={500} step={5} onChange={setCl} format={(v) => `${v} fF`} />
      <Slider label="nMOS width ×" value={wn} min={0.5} max={4} step={0.1} onChange={setWn} format={(v) => `${v.toFixed(1)}`} />
      <Slider label="pMOS width ×" value={wp} min={0.5} max={6} step={0.1} onChange={setWp} format={(v) => `${v.toFixed(1)}`} />
      <Readout label="τPHL (nMOS discharges)" value={formatSI(phl, 's')} />
      <Readout label="τPLH (pMOS charges)" value={formatSI(plh, 's')} />
      <Readout label="τP = (τPHL + τPLH)/2" value={formatSI((phl + plh) / 2, 's')} tone="signal" />
      <p className="small muted">VDD 1.8 V, µnCox = 200, µpCox = 80 µA/V², W/L = 2 × the widths. Delay ∝ CL/k: double the load and both delays double; widen a device and its edge speeds up. Make the pMOS µn/µp = 2.5× wider for equal rise and fall.</p>
    </Panel>
  );
}

/* ─── L20–L22, L27: gates from an expression ─── */

function GateMini() {
  const [expr, setExpr] = useState('AB+C');
  let ok = true;
  let info: ReturnType<typeof complexGateEffort> = [];
  let euler: string[] | undefined;
  try {
    parseExpr(expr);
    info = complexGateEffort(expr);
    euler = commonEulerPath(expr);
  } catch {
    ok = false;
  }
  return (
    <Panel figure={<StaticGateFig expr={expr} />}>
      <label className="field">
        <span>F = NOT( … )</span>
        <input value={expr} onChange={(e) => setExpr(e.target.value.toUpperCase().replace(/[^A-Z+()·*]/g, ''))} className="mono" aria-label="Pull-down expression" />
      </label>
      <div className="row wrap">
        {['AB', 'A+B', 'ABC', 'AB+C', 'A(B+C)', 'A(B+C)+D', 'AB+CD'].map((e) => (
          <button key={e} type="button" className="btn small" onClick={() => setExpr(e)}>
            {e}
          </button>
        ))}
      </div>
      {ok && (
        <>
          <Readout label="transistors" value={`${2 * info.length} (= 2 × inputs)`} />
          {info.map((x) => (
            <Readout key={x.name} label={`input ${x.name}: Wn / Wp → g`} value={`${x.wn} / ${x.wp} → ${x.g.toFixed(2)}`} />
          ))}
          <Readout label="common Euler path" value={euler ? euler.join(' → ') : 'none (needs split diffusion)'} tone={euler ? 'ok' : 'bad'} />
        </>
      )}
      <p className="small muted">Pull-down: AND = series, OR = parallel. Pull-up: the dual (swap series and parallel). Widths size every path to one unit transistor (nMOS 1, pMOS 2). Logical effort g = (Wn + Wp)/3: how much worse than an inverter each input is at driving.</p>
    </Panel>
  );
}

function NandNorMini() {
  const [n, setN] = useState(2);
  const spec: InvSpec = { vdd: 5, vtn: 1, vtp: 1, kn: 100e-6, kp: 100e-6 };
  return (
    <Panel figure={<StaticGateFig expr={'ABCD'.slice(0, n).split('').join('')} sized={false} />}>
      <Slider label="number of inputs" value={n} min={2} max={4} step={1} onChange={setN} />
      <Readout label="inverter VM (kn = kp)" value={V(cmosVM(spec))} />
      <Readout label={`NAND${n} VM (all inputs together)`} value={V(nandVM(spec, n))} tone="signal" />
      <Readout label={`NOR${n} VM (all inputs together)`} value={V(norVM(spec, n))} tone="signal" />
      <Readout label={`nMOS width for NAND${n} (series)`} value={`${n}× unit`} />
      <Readout label={`pMOS width for NOR${n} (series)`} value={`${n}× (×2 for mobility)`} />
      <p className="small muted">Series devices act like one device with k/n; parallel ones (all on) like n·k. A NAND’s series nMOS stack is weak, so its VM rises; a NOR’s series pMOS stack is weak, so its VM falls. Widen the series devices n times to restore the drive.</p>
    </Panel>
  );
}

/* ─── L23: RC and Elmore ─── */

function ElmoreMini() {
  const [n, setN] = useState(3);
  const r = 1e3, c = 10e-15;
  const stages = Array.from({ length: n }, () => ({ r, c }));
  const t = elmoreLadder(stages);
  return (
    <Panel figure={<RcLadderFig stages={stages} />}>
      <Slider label="number of RC sections" value={n} min={1} max={5} step={1} onChange={setN} />
      <Readout label="Elmore delay Σ R_upstream·C" value={`${(t / (r * c)).toFixed(0)} RC = ${formatSI(t, 's')}`} tone="signal" />
      <Readout label="grows like" value="n(n + 1)/2 · RC" />
      <p className="small muted">Weste §4.3: treat each ON transistor as a resistor and each node as a capacitor to ground. The Elmore delay adds, for every capacitor, the total resistance between it and the driver. Long series chains (and long wires) get slow quadratically.</p>
    </Panel>
  );
}

/* ─── L24–L25: logical effort ─── */

const GATES: Record<string, { g: number; p: number }> = {
  INV: LE.inv,
  NAND2: LE.nand(2),
  NAND3: LE.nand(3),
  NOR2: LE.nor(2),
  NOR3: LE.nor(3),
};

function EffortMini() {
  const [names, setNames] = useState<string[]>(['NAND2', 'NAND3', 'NOR2']);
  const [h, setH] = useState(45 / 8);
  const [b1, setB1] = useState(2);
  const [b2, setB2] = useState(3);
  const stages = names.map((nm, i) => ({ ...GATES[nm], b: i === 0 ? b1 : i === 1 ? b2 : 1 }));
  const r = pathEffort(stages, 8, 8 * h);
  const delays = stages.map((s, i) => s.g * (i < stages.length - 1 ? (r.caps[i + 1] * (s.b ?? 1)) / r.caps[i] : (8 * h) / r.caps[i]) + s.p);
  const setStage = (i: number, v: string) => setNames((xs) => xs.map((x, k) => (k === i ? v : x)));
  return (
    <Panel figure={<EffortPathFig stages={names.map((nm, i) => ({ name: nm, b: stages[i].b }))} caps={r.caps} cout={8 * h} delays={delays} />}>
      {names.map((nm, i) => (
        <Seg key={i} label={`Stage ${i + 1}`} value={nm} onChange={(v) => setStage(i, v)} options={Object.keys(GATES).map((k) => ({ value: k, label: k }))} />
      ))}
      <Slider label="electrical effort H = Cout/Cin" value={h} min={1} max={50} step={0.125} onChange={setH} format={(v) => v.toFixed(2)} />
      <Slider label="branching after stage 1" value={b1} min={1} max={4} step={1} onChange={setB1} />
      <Slider label="branching after stage 2" value={b2} min={1} max={4} step={1} onChange={setB2} />
      <Readout label="G · B · H = F" value={`${r.G.toFixed(2)} · ${r.B} · ${r.H.toFixed(2)} = ${r.F.toFixed(1)}`} />
      <Readout label="best stage effort f̂ = F^(1/N)" value={r.f.toFixed(2)} tone="signal" />
      <Readout label="D = N·f̂ + P" value={`${r.D.toFixed(1)} τ`} tone="signal" />
      <Readout label="best number of stages log₄F" value={r.nBest.toFixed(2)} />
      <p className="small muted">Weste’s example: NAND2 → NAND3 → NOR2, branching 2 and 3, H = 45/8 gives F = 125, f̂ = 5, D = 22τ, and both internal gates get input capacitance 15. Every stage ends up with the same effort g·h = f̂.</p>
    </Panel>
  );
}

/* ─── L26: power ─── */

function PowerMini() {
  const [alpha, setAlpha] = useState(0.1);
  const [c, setC] = useState(100);
  const [vdd, setVdd] = useState(1);
  const [f, setF] = useState(1);
  const [leak, setLeak] = useState(10);
  const pd = dynamicPower({ alpha, c: c * 1e-12, vdd, f: f * 1e9 });
  const ps = leak * 1e-6 * vdd;
  return (
    <Panel figure={<InverterFig load="cmos" />}>
      <Slider label="activity factor α" value={alpha} min={0.01} max={1} step={0.01} onChange={setAlpha} format={(v) => v.toFixed(2)} />
      <Slider label="switched capacitance C" value={c} min={10} max={1000} step={10} onChange={setC} format={(v) => `${v} pF`} />
      <Slider label="VDD" value={vdd} min={0.5} max={1.8} step={0.05} onChange={setVdd} format={V} />
      <Slider label="clock f" value={f} min={0.1} max={4} step={0.1} onChange={setF} format={(v) => `${v.toFixed(1)} GHz`} />
      <Slider label="leakage current" value={leak} min={0} max={500} step={5} onChange={setLeak} format={(v) => `${v} µA`} />
      <Readout label="dynamic α·C·VDD²·f" value={formatSI(pd, 'W')} tone="signal" />
      <Readout label="static Ileak·VDD" value={formatSI(ps, 'W')} />
      <Readout label="energy per 0→1 transition (1 pF)" value={formatSI(1e-12 * vdd * vdd, 'J')} />
      <p className="small muted">Each 0→1 edge draws C·VDD² from the supply: half is stored on C, half burnt in the pMOS; the stored half is burnt in the nMOS on the way down. So VDD is the strongest knob (squared); α and f scale linearly. Leakage burns even when nothing switches.</p>
    </Panel>
  );
}

/* ─── L29: dynamic logic ─── */

function DynamicMini() {
  const [cx, setCx] = useState(10);
  const cout = 30;
  const v = chargeSharing({ vdd: 1, cout, cx });
  return (
    <Panel figure={<DynamicGateFig cx />}>
      <Slider label="internal node Cx" value={cx} min={0} max={60} step={1} onChange={setCx} format={(x) => `${x} fF (Cout 30 fF)`} />
      <Readout label="Y after charge sharing (VDD = 1 V)" value={V(v)} tone={v > 0.8 ? 'ok' : 'bad'} />
      <Readout label="drop" value={`${((1 - v) * 100).toFixed(0)} %`} />
      <p className="small muted">clk = 0: precharge Y to VDD. clk = 1: evaluate: Y falls only if the pull-down conducts, and it can never come back up in that cycle (so domino outputs may only rise: monotonic). If the top input turns on but not the bottom, the charge on Cout spreads onto Cx: Y = VDD·Cout/(Cout + Cx). A keeper or precharged internal nodes fix it.</p>
    </Panel>
  );
}

/* ─── L30: pass transistors ─── */

function PassMini() {
  const [n, setN] = useState(4);
  const t = passChainDelay({ r: 1, c: 1, n });
  return (
    <Panel figure={<PassGateFig vdd={1.8} vtn={0.45} vtp={0.45} />}>
      <Slider label="pass gates in series" value={n} min={1} max={10} step={1} onChange={setN} />
      <Readout label="Elmore delay" value={`${t} RC (∝ n²)`} tone={n > 4 ? 'bad' : 'ok'} />
      <p className="small muted">An nMOS turns off when its source reaches VG − Vthn, so it passes only VDD − Vthn (a weak 1); a pMOS passes only |Vthp| as its 0. A transmission gate (both in parallel) passes both rails. Chains of pass gates are an RC ladder: delay grows as n², so buffer every few stages.</p>
    </Panel>
  );
}

/* ─── L31–L33: sequencing ─── */

function TimingMini() {
  const [tpd, setTpd] = useState(700);
  const [skew, setSkew] = useState(0);
  const [tcd, setTcd] = useState(40);
  const tc = 1000, tpcq = 80, tccq = 50, tsetup = 60, thold = 70;
  const t = ffTiming({ tpcq: tpcq * 1e-12, tccq: tccq * 1e-12, tsetup: tsetup * 1e-12, thold: thold * 1e-12, tpd: tpd * 1e-12, tcd: tcd * 1e-12, tskew: skew * 1e-12 });
  return (
    <Panel figure={<FlopTimingFig tc={tc * 1e-12} tpcq={tpcq * 1e-12} tpd={tpd * 1e-12} tsetup={tsetup * 1e-12} tskew={skew * 1e-12} />}>
      <Slider label="logic delay tpd (longest path)" value={tpd} min={200} max={1000} step={10} onChange={setTpd} format={(v) => `${v} ps`} />
      <Slider label="contamination delay tcd (shortest path)" value={tcd} min={0} max={200} step={5} onChange={setTcd} format={(v) => `${v} ps`} />
      <Slider label="clock skew" value={skew} min={0} max={150} step={5} onChange={setSkew} format={(v) => `${v} ps`} />
      <Readout label="minimum Tc" value={formatSI(t.tcMin, 's')} tone={t.tcMin <= 1e-9 ? 'ok' : 'bad'} />
      <Readout label="max clock" value={formatSI(t.fMax, 'Hz')} />
      <Readout label="hold slack" value={formatSI(t.holdSlack, 's')} tone={t.holdOk ? 'ok' : 'bad'} />
      <p className="small muted">Tc = 1 ns, tpcq 80 ps, tccq 50 ps, setup 60 ps, hold 70 ps. Setup (max-delay) failures are fixed by slowing the clock; hold (min-delay) failures are not: the fastest path races through before the capturing flop has finished sampling. Skew eats into both.</p>
    </Panel>
  );
}

/* ─── L35–L36: adders ─── */

function AdderMini() {
  const [a, setA] = useState(0b10110110);
  const [b, setB] = useState(0b01001011);
  const [n, setN] = useState(16);
  const bits = 8;
  const carries: number[] = [0];
  for (let i = 0; i < bits; i++) {
    const x = (a >> i) & 1, y = (b >> i) & 1;
    carries.push((x & y) | ((x ^ y) & carries[i]));
  }
  // longest run of propagates = how far a carry actually ripples
  let run = 0, best = 0;
  for (let i = 0; i < bits; i++) {
    if ((((a >> i) & 1) ^ ((b >> i) & 1)) === 1) best = Math.max(best, ++run);
    else run = 0;
  }
  const units = { tpg: 1, tao: 2, txor: 1, tmux: 2 };
  const grp = n <= 16 ? 4 : 8;
  const k = n / grp;
  return (
    <Panel
      figure={
        <div className="bitgrid" role="img" aria-label="8-bit addition with carries">
          {[['A', a], ['B', b]].map(([lbl, v]) => (
            <div key={lbl as string} className="bitrow">
              <span className="mono">{lbl}</span>
              {Array.from({ length: bits }, (_, i) => bits - 1 - i).map((i) => (
                <button key={i} type="button" className={`bit ${((v as number) >> i) & 1 ? 'on' : ''}`} onClick={() => (lbl === 'A' ? setA((x) => x ^ (1 << i)) : setB((x) => x ^ (1 << i)))}>
                  {((v as number) >> i) & 1}
                </button>
              ))}
            </div>
          ))}
          <div className="bitrow">
            <span className="mono">C</span>
            {Array.from({ length: bits }, (_, i) => bits - 1 - i).map((i) => (
              <span key={i} className={`bit carry ${carries[i] ? 'on' : ''}`}>{carries[i]}</span>
            ))}
          </div>
          <div className="bitrow">
            <span className="mono">S</span>
            {Array.from({ length: bits }, (_, i) => bits - 1 - i).map((i) => (
              <span key={i} className="bit sum">{((a >> i) & 1) ^ ((b >> i) & 1) ^ carries[i]}</span>
            ))}
            <span className="mono small"> carry out {carries[bits]} → {a + b}</span>
          </div>
        </div>
      }
    >
      <Readout label="A + B" value={`${a} + ${b} = ${a + b}`} />
      <Readout label="longest propagate run (carry ripples this far)" value={`${best} bits`} />
      <Slider label="adder width N (for the delay estimate)" value={n} min={8} max={64} step={8} onChange={setN} />
      <Readout label="ripple: tpg + (N − 1)tAO + txor" value={`${rippleDelay({ n, ...units })} units`} />
      <Readout label={`carry-skip (${k} groups of ${grp})`} value={`${carrySkipDelay({ n: grp, k, ...units })} units`} tone="signal" />
      <p className="small muted">Click bits to flip them. Each column generates a carry (G = AB) or propagates one (P = A⊕B). A ripple adder waits for the carry to crawl through every propagate; a carry-skip adder lets a group whose bits all propagate pass the carry straight on. Unit delays: tpg = txor = 1, tAO = tmux = 2.</p>
    </Panel>
  );
}

/* ─── L37: Booth ─── */

function BoothMini() {
  const [y, setY] = useState(-77);
  const d = boothRadix4(y, 8);
  return (
    <Panel
      figure={
        <div className="booth">
          <p className="mono small">y = {y} = {((y + 256) % 256).toString(2).padStart(8, '0')}₂</p>
          <table className="booth-table">
            <thead>
              <tr>
                <th>group i</th>
                <th>bits y(2i+1) y(2i) y(2i−1)</th>
                <th>digit</th>
                <th>partial product</th>
              </tr>
            </thead>
            <tbody>
              {d.map((x, i) => {
                const bit = (k: number) => (k < 0 ? 0 : ((((y % 256) + 256) % 256) >> k) & 1);
                return (
                  <tr key={i}>
                    <td>{i}</td>
                    <td className="mono">
                      {bit(2 * i + 1)} {bit(2 * i)} {bit(2 * i - 1)}
                    </td>
                    <td className="mono">{x > 0 ? `+${x}` : x}</td>
                    <td className="mono">{x === 0 ? '0' : `${x > 0 ? '+' : '−'}${Math.abs(x) === 2 ? '2x' : 'x'} · 4^${i}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mono small">Σ digit·4^i = {d.reduce((a, x, i) => a + x * 4 ** i, 0)}</p>
        </div>
      }
    >
      <Slider label="multiplier y (8-bit signed)" value={y} min={-128} max={127} step={1} onChange={setY} />
      <Readout label="partial products: plain array" value="8" />
      <Readout label="partial products: radix-4 Booth" value={String(d.length)} tone="signal" />
      <p className="small muted">Booth looks at overlapping groups of three bits and turns them into one digit in {'{−2, −1, 0, +1, +2}'}: digit = −2·y(2i+1) + y(2i) + y(2i−1). Each digit selects 0, ±x or ±2x (a shift), so an 8-bit multiplier needs only 4 partial products instead of 8.</p>
    </Panel>
  );
}

/* ─── L38: SRAM ─── */

function SramMini() {
  const [cr, setCr] = useState(2);
  const [pr, setPr] = useState(0.5);
  const vdd = 1, vtn = 0.3, vtp = 0.3, ka = 100e-6;
  const bump = sramReadBump({ vdd, vtn, kAccess: ka, kPulldown: ka * cr });
  const w = sramWriteLevel({ vdd, vtn, vtp, kAccess: ka, kPullup: ka * pr });
  const vm = cmosVM({ vdd, vtn, vtp, kn: ka * cr, kp: ka * pr });
  return (
    <Panel figure={<SramCellFig q={0} reading bump={bump} />}>
      <Slider label="cell ratio (pull-down ÷ access)" value={cr} min={0.8} max={4} step={0.05} onChange={setCr} format={(v) => v.toFixed(2)} />
      <Slider label="pull-up ratio (pull-up ÷ access)" value={pr} min={0.2} max={2} step={0.05} onChange={setPr} format={(v) => v.toFixed(2)} />
      <Readout label="read: the 0 node rises to" value={V(bump)} tone={bump < vm ? 'ok' : 'bad'} />
      <Readout label="other inverter flips at VM" value={V(vm)} />
      <Readout label="write: the 1 node is pulled to" value={Number.isFinite(w) ? V(w) : 'cannot pull it down'} tone={Number.isFinite(w) && w < vm ? 'ok' : 'bad'} />
      <p className="small muted">VDD 1 V, Vth 0.3 V. Reading: the precharged bitline pushes charge through the access transistor into the node holding 0; a strong pull-down (cell ratio ≳ 1.5–2) keeps that bump below the other inverter’s VM. Writing: the access transistor must overpower the pull-up, so the pull-up is the weakest device.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS_D: Record<string, (p: any) => React.ReactElement> = {
  vtcMini: VtcMini,
  loadsMini: LoadsMini,
  switchMini: SwitchMini,
  gateMini: GateMini,
  nandNorMini: NandNorMini,
  elmoreMini: ElmoreMini,
  effortMini: EffortMini,
  powerMini: PowerMini,
  dynamicMini: DynamicMini,
  passMini: PassMini,
  timingMini: TimingMini,
  adderMini: AdderMini,
  boothMini: BoothMini,
  sramMini: SramMini,
};
