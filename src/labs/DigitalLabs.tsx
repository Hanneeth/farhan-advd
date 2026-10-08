/**
 * Digital labs: the CMOS inverter (VTC, noise margins, delay) and logical effort (size a path).
 */
import { useState } from 'react';
import { CmosVtcFig, EffortPathFig, NoiseMarginFig, SwitchingFig } from '../circuits/figuresD';
import { cmosVilVih, cmosVM, LE, pathEffort, tauPHL, tauPLH } from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';
import { LabShell } from './LabShell';

const V = (x: number) => formatSI(x, 'V');

export function InverterLab() {
  const [vdd, setVdd] = useState(1.8);
  const [vtn, setVtn] = useState(0.45);
  const [vtp, setVtp] = useState(0.45);
  const [wn, setWn] = useState(1);
  const [wp, setWp] = useState(1);
  const [cl, setCl] = useState(50);
  const kn = 200e-6 * 2 * wn, kp = 80e-6 * 2 * wp;
  const spec = { vdd, vtn, vtp, kn, kp };
  const vm = cmosVM(spec);
  const { vil, vih } = cmosVilVih(spec);
  const phl = tauPHL({ cl: cl * 1e-15, kn, vtn, voh: vdd, vol: 0 });
  const plh = tauPLH({ cl: cl * 1e-15, kp, vtp, voh: vdd, vol: 0 });
  const challenges = [
    { id: 'mid', text: 'Centre VM at VDD/2 (within 10 mV). What width ratio did it take?', done: Math.abs(vm - vdd / 2) < 0.01 },
    { id: 'equal', text: 'Make τPHL and τPLH equal (within 5%).', done: Math.abs(phl - plh) / phl < 0.05 },
    { id: 'margin', text: 'Get both noise margins above 0.7 V.', done: vil > 0.7 && vdd - vih > 0.7 },
    { id: 'lowvdd', text: 'Lower VDD toward 2·Vth: what happens to the delay?', done: vdd < 2 * Math.max(vtn, vtp) + 0.15 },
  ];
  return (
    <LabShell
      title="Inverter lab"
      intro="A CMOS inverter from the square law (µnCox 200, µpCox 80 µA/V², W/L = 2 × the widths). Shape its VTC with the sizes and thresholds, read off VM, VIL, VIH and the noise margins, and watch the delays."
      figures={
        <>
          <CmosVtcFig spec={spec} />
          <NoiseMarginFig voh={vdd} vol={0} vil={vil} vih={vih} vdd={vdd} />
          <SwitchingFig tphl={phl} tplh={plh} vdd={vdd} />
        </>
      }
      controls={
        <>
          <Slider label="VDD" value={vdd} min={0.9} max={3.3} step={0.05} onChange={setVdd} format={V} />
          <Slider label="Vthn" value={vtn} min={0.2} max={0.8} step={0.01} onChange={setVtn} format={V} />
          <Slider label="|Vthp|" value={vtp} min={0.2} max={0.8} step={0.01} onChange={setVtp} format={V} />
          <Slider label="nMOS width ×" value={wn} min={0.5} max={4} step={0.05} onChange={setWn} format={(v) => v.toFixed(2)} />
          <Slider label="pMOS width ×" value={wp} min={0.5} max={8} step={0.05} onChange={setWp} format={(v) => v.toFixed(2)} />
          <Slider label="CL" value={cl} min={5} max={500} step={5} onChange={setCl} format={(v) => `${v} fF`} />
          <div className="readouts">
            <Readout label="kR = kn/kp" value={(kn / kp).toFixed(2)} />
            <Readout label="VM" value={V(vm)} tone="signal" />
            <Readout label="VIL / VIH" value={`${V(vil)} / ${V(vih)}`} />
            <Readout label="NML / NMH" value={`${V(vil)} / ${V(vdd - vih)}`} />
            <Readout label="τPHL / τPLH" value={`${formatSI(phl, 's')} / ${formatSI(plh, 's')}`} />
            <Readout label="τP" value={formatSI((phl + plh) / 2, 's')} tone="signal" />
          </div>
        </>
      }
      challenges={challenges}
    />
  );
}

const G: Record<string, { g: number; p: number }> = { INV: LE.inv, NAND2: LE.nand(2), NAND3: LE.nand(3), NOR2: LE.nor(2), NOR3: LE.nor(3) };

export function EffortLab() {
  const [names, setNames] = useState<string[]>(['INV', 'INV', 'INV']);
  const [h, setH] = useState(64);
  const [n, setN] = useState(3);
  const list = [...names, 'INV', 'INV', 'INV'].slice(0, n);
  const stages = list.map((nm) => G[nm]);
  const r = pathEffort(stages, 1, h);
  const delays = stages.map((s, i) => s.g * ((i < n - 1 ? r.caps[i + 1] : h) / r.caps[i]) + s.p);
  const challenges = [
    { id: 'fo4', text: 'Drive H = 64 with inverters only. Which stage count gives the least delay?', done: list.every((x) => x === 'INV') && Math.abs(h - 64) < 1 && n === 3 },
    { id: 'four', text: 'Find a setting where the best stage effort f̂ is close to 4 (±0.3).', done: Math.abs(r.f - 4) < 0.3 },
    { id: 'nor', text: 'Swap a NAND2 for a NOR2: how much delay does it cost?', done: list.includes('NOR2') },
    { id: 'big', text: 'Push H to 1000. What is log₄F now, and do you have enough stages?', done: h >= 1000 },
  ];
  return (
    <LabShell
      title="Logical effort lab"
      intro="Weste’s method on a path from Cin = 1 to Cout = H: choose the gates and the number of stages; the sizes that share the effort equally, the stage delays and the total D appear live."
      figures={<EffortPathFig stages={list.map((nm) => ({ name: nm }))} caps={r.caps} cout={h} delays={delays} />}
      controls={
        <>
          <Slider label="number of stages N" value={n} min={1} max={6} step={1} onChange={setN} />
          {list.slice(0, 3).map((nm, i) => (
            <Seg key={i} label={`Stage ${i + 1}`} value={nm} onChange={(v) => setNames((xs) => xs.map((x, k) => (k === i ? v : x)))} options={Object.keys(G).map((k) => ({ value: k, label: k }))} />
          ))}
          <Slider label="H = Cout/Cin" value={h} min={1} max={2000} step={1} onChange={setH} format={(v) => String(v)} />
          <div className="readouts">
            <Readout label="G, F" value={`${r.G.toFixed(2)}, ${r.F.toFixed(1)}`} />
            <Readout label="f̂ = F^(1/N)" value={r.f.toFixed(2)} tone="signal" />
            <Readout label="D = N·f̂ + P" value={`${r.D.toFixed(2)} τ`} tone="signal" />
            <Readout label="best N ≈ log₄F" value={r.nBest.toFixed(2)} />
          </div>
        </>
      }
      challenges={challenges}
    />
  );
}
