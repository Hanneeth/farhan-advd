/**
 * Lab 2 — DC recipe stepper (CLAUDE.md §8.2): walk Step A one click at a time, writing each node voltage
 * onto the diagram and showing the fence check in green or red. If the fence fails, the stepper redoes the
 * solve with the triode equation, which is exactly what you should do on paper.
 */
import { useMemo, useState } from 'react';
import { NmosRd, PmosRd } from '../circuits/figures';
import { idSat, overdrive, solveNmosRd, type Region } from '../physics';
import { makeRng, newSeed, nice, pick } from '../practice/rng';
import { texNum, texSI } from '../practice/tex';
import { formatSI } from '../practice/units';
import { Tex } from '../ui/Tex';

interface Circuit {
  kind: 'nmos' | 'pmos';
  vdd: number;
  vg: number;
  vth: number;
  kp: number;
  wl: number;
  rd: number;
  label: string;
}

const PRESETS: Circuit[] = [
  { kind: 'nmos', vdd: 1.8, vg: 0.7, vth: 0.4, kp: 200e-6, wl: 10, rd: 10e3, label: 'WE1 (NMOS, saturated)' },
  { kind: 'pmos', vdd: 1.8, vg: 0.9, vth: 0.5, kp: 100e-6, wl: 20, rd: 5e3, label: 'WE3 (PMOS)' },
  { kind: 'nmos', vdd: 1.8, vg: 0.9, vth: 0.4, kp: 200e-6, wl: 10, rd: 20e3, label: 'Trap: NMOS that lands in triode' },
];

interface Step {
  title: string;
  tex: string;
  reveal: { vd?: number; region?: Region; current?: string; id?: number };
  highlight: string[];
  fence?: 'ok' | 'bad';
}

function solve(c: Circuit): Step[] {
  const steps: Step[] = [];
  if (c.kind === 'nmos') {
    const vov = overdrive(c.vg, c.vth);
    steps.push({ title: '1 · Assume saturation (λ = 0 for DC)', tex: '\\text{assume } V_D \\ge V_G - V_{th}', reveal: {}, highlight: ['m1'] });
    steps.push({ title: '2 · Overdrive from the gate', tex: `V_{ov} = V_G - V_{th} = ${texNum(c.vg)} - ${texNum(c.vth)} = ${texSI(vov, 'V')}`, reveal: {}, highlight: ['m1', 'gate'] });
    const id = idSat(c.kp, c.wl, vov);
    steps.push({ title: '3 · Square law', tex: `I_D = \\tfrac12 (${texSI(c.kp, 'A/V²')})(${c.wl})(${texNum(vov)})^2 = ${texSI(id, 'A')}`, reveal: { current: formatSI(id, 'A') }, highlight: ['m1'] });
    const vd = c.vdd - id * c.rd;
    steps.push({ title: '4 · Walk the node: VD = VDD − ID·RD', tex: `V_D = ${texNum(c.vdd)} - (${texSI(id, 'A')})(${texSI(c.rd, 'Ω')}) = ${texSI(vd, 'V')}`, reveal: { vd, current: formatSI(id, 'A') }, highlight: ['rd', 'vd'] });
    const ok = vd >= c.vg - c.vth;
    steps.push({
      title: '5 · CHECK the fence: VD ≥ VG − Vth?',
      tex: `${texSI(vd, 'V')} ${ok ? '\\ge' : '<'} ${texSI(c.vg - c.vth, 'V')} \\Rightarrow ${ok ? '\\text{saturated } \\checkmark' : '\\text{assumption FAILED: triode}'}`,
      reveal: { vd, region: ok ? 'saturation' : 'triode', current: formatSI(id, 'A') },
      highlight: ['m1', 'vd'],
      fence: ok ? 'ok' : 'bad',
    });
    if (!ok) {
      const t = solveNmosRd({ vdd: c.vdd, vg: c.vg, vth: c.vth, kp: c.kp, wl: c.wl, rd: c.rd });
      const vdT = t.vd;
      const idT = t.id;
      steps.push({
        title: '6 · Redo with the triode equation',
        tex: `V_D = V_{DD} - R_D\\,\\mu C_{ox}\\tfrac{W}{L}\\left[V_{ov}V_D - \\tfrac{V_D^2}{2}\\right] \\Rightarrow V_D = ${texSI(vdT, 'V')},\\ I_D = ${texSI(idT, 'A')}`,
        reveal: { vd: vdT, region: 'triode', current: formatSI(idT, 'A') },
        highlight: ['m1', 'vd'],
        fence: 'bad',
      });
      steps.push({ title: '7 · Check triode is consistent: VDS < Vov', tex: `${texSI(vdT, 'V')} < ${texSI(vov, 'V')}\\;\\checkmark`, reveal: { vd: vdT, region: 'triode', current: formatSI(idT, 'A') }, highlight: ['m1'] });
    }
  } else {
    const vsg = c.vdd - c.vg;
    const vov = overdrive(vsg, c.vth);
    steps.push({ title: '1 · Assume saturation; use magnitudes', tex: `|V_{GS}| = V_S - V_G = ${texSI(vsg, 'V')}`, reveal: {}, highlight: ['m1'] });
    steps.push({ title: '2 · Overdrive magnitude', tex: `|V_{ov}| = |V_{GS}| - |V_{th}| = ${texSI(vov, 'V')}`, reveal: {}, highlight: ['m1'] });
    const id = idSat(c.kp, c.wl, vov);
    steps.push({ title: '3 · Square law', tex: `I_D = \\tfrac12 (${texSI(c.kp, 'A/V²')})(${c.wl})(${texNum(vov)})^2 = ${texSI(id, 'A')}`, reveal: { current: formatSI(id, 'A') }, highlight: ['m1'] });
    const vd = id * c.rd;
    steps.push({ title: '4 · Walk up from ground: VD = ID·RD', tex: `V_D = (${texSI(id, 'A')})(${texSI(c.rd, 'Ω')}) = ${texSI(vd, 'V')}`, reveal: { vd, current: formatSI(id, 'A') }, highlight: ['rd', 'vd'] });
    const ok = vd <= c.vg + c.vth;
    steps.push({
      title: '5 · CHECK the PMOS fence: VD ≤ VG + |Vth|?',
      tex: `${texSI(vd, 'V')} ${ok ? '\\le' : '>'} ${texSI(c.vg + c.vth, 'V')} \\Rightarrow ${ok ? '\\text{saturated } \\checkmark' : '\\text{assumption FAILED: triode}'}`,
      reveal: { vd, region: ok ? 'saturation' : 'triode', current: formatSI(id, 'A') },
      highlight: ['m1', 'vd'],
      fence: ok ? 'ok' : 'bad',
    });
  }
  return steps;
}

function randomCircuit(seed: number): Circuit {
  const rng = makeRng(seed);
  const kind = pick(rng, ['nmos', 'nmos', 'pmos'] as const);
  const vdd = pick(rng, [1.8, 3]);
  const vth = pick(rng, [0.4, 0.5]);
  const kp = kind === 'nmos' ? pick(rng, [100e-6, 200e-6, 300e-6]) : pick(rng, [50e-6, 100e-6]);
  const wl = pick(rng, [5, 10, 20]);
  const rd = nice(rng, 2e3, 30e3, 1e3);
  const vg = kind === 'nmos' ? nice(rng, vth + 0.1, vth + 0.6, 0.05) : vdd - nice(rng, vth + 0.1, vth + 0.6, 0.05);
  return { kind, vdd, vth, kp, wl, rd, vg, label: 'Random circuit (might not be saturated!)' };
}

export function DcStepper() {
  const [circuit, setCircuit] = useState<Circuit>(PRESETS[0]);
  const [shown, setShown] = useState(0);
  const steps = useMemo(() => solve(circuit), [circuit]);
  const cur = shown > 0 ? steps[shown - 1] : undefined;
  const r = cur?.reveal ?? {};
  const choose = (c: Circuit) => {
    setCircuit(c);
    setShown(0);
  };
  const fig =
    circuit.kind === 'nmos' ? (
      <NmosRd vdd={circuit.vdd} vg={circuit.vg} rd={circuit.rd} vd={r.vd} region={r.region} current={r.current} highlight={cur?.highlight} flow={r.current ? 0.45 : 0} />
    ) : (
      <PmosRd vdd={circuit.vdd} vg={circuit.vg} rd={circuit.rd} vd={r.vd} region={r.region} current={r.current} highlight={cur?.highlight} flow={r.current ? 0.45 : 0} />
    );
  return (
    <div className="page lab">
      <nav className="crumbs small">
        <a href="#/labs">Labs</a> › DC recipe stepper
      </nav>
      <h1>DC recipe stepper</h1>
      <p className="muted">Step A of the master method, one click at a time: assume → square law → walk the nodes → CHECK.</p>
      <div className="row">
        {PRESETS.map((c) => (
          <button key={c.label} type="button" className={`btn small ${c === circuit ? 'primary' : ''}`} onClick={() => choose(c)}>
            {c.label}
          </button>
        ))}
        <button type="button" className="btn small" onClick={() => choose(randomCircuit(newSeed()))}>
          🎲 Random circuit
        </button>
      </div>
      <div className="lab-grid">
        <div className="lab-figures">
          {fig}
          <p className="small muted mono">
            {circuit.kind.toUpperCase()} · VDD {formatSI(circuit.vdd, 'V')} · VG {formatSI(circuit.vg, 'V')} · |Vth| {formatSI(circuit.vth, 'V')} · µCox {Math.round(circuit.kp * 1e6)} µA/V² · W/L {circuit.wl} · RD {formatSI(circuit.rd, 'Ω')}
          </p>
        </div>
        <div className="lab-controls">
          <ol className="trace">
            {steps.slice(0, shown).map((s, i) => (
              <li key={i} className={`trace-step ${s.fence ? `fence-${s.fence}` : ''} ${i === shown - 1 ? 'current' : ''}`}>
                <div className="trace-title">{s.title}</div>
                <div className="trace-tex">
                  <Tex tex={s.tex} />
                </div>
              </li>
            ))}
          </ol>
          <div className="row">
            <button type="button" className="btn primary" disabled={shown >= steps.length} onClick={() => setShown((n) => n + 1)}>
              {shown === 0 ? 'Start' : shown >= steps.length ? 'Done' : 'Next step'}
            </button>
            <button type="button" className="btn" disabled={shown === 0} onClick={() => setShown((n) => n - 1)}>
              Back
            </button>
            <button type="button" className="btn ghost" onClick={() => setShown(steps.length)}>
              Show all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
