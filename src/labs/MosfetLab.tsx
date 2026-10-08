/**
 * Lab 1 — MOSFET lab (CLAUDE.md §8.1): sliders VGS, VDS, W/L, µCox, λ; channel cross-section, ID–VDS family
 * with the live operating point, region badge, gm, rO, gm·rO; and a "what to discover" checklist.
 */
import { useEffect, useState } from 'react';
import { ChannelCrossSection, IdVdsFamily } from '../circuits/figures';
import { drainCurrent, gmFromVov, gmTriode, intrinsicGain, overdrive, region, rO, rOTriode } from '../physics';
import { formatSI } from '../practice/units';
import { Readout, Slider } from '../ui/Slider';
import { Tex } from '../ui/Tex';

const VTH = 0.4;

export function MosfetLab() {
  const [vgs, setVgs] = useState(0.7);
  const [vds, setVds] = useState(0.8);
  const [wl, setWl] = useState(10);
  const [kpu, setKpu] = useState(200); // µA/V²
  const [lambda, setLambda] = useState(0.2);
  const [seen, setSeen] = useState<Record<string, boolean>>({});
  const kp = kpu * 1e-6;
  const vov = overdrive(vgs, VTH);
  const reg = region(vov, vds);
  const id = drainCurrent(kp, wl, vov, vds, lambda);
  const gm = reg === 'saturation' ? gmFromVov(kp, wl, vov) * (1 + lambda * vds) : reg === 'triode' ? gmTriode(kp, wl, vds) : 0;
  const ro = reg === 'saturation' ? rO(lambda, id) : reg === 'triode' ? rOTriode(kp, wl, vov, vds) : Infinity;
  const gmro = reg === 'saturation' && lambda > 0 ? intrinsicGain(lambda, vov) : gm * ro;

  const challenges = [
    { id: 'off', text: 'Turn the transistor OFF. What is ID?', done: reg === 'off' },
    { id: 'triode', text: 'Put it in TRIODE without touching VGS.', done: reg === 'triode' },
    { id: 'edge', text: 'Find the edge of saturation: VDS within 10 mV of Vov.', done: vov > 0 && Math.abs(vds - vov) <= 0.01 },
    { id: 'gain', text: 'Make the intrinsic gain gm·rO bigger than 60 while saturated. Which knobs work?', done: reg === 'saturation' && gmro > 60 },
    { id: 'wl', text: 'Double W/L at fixed VGS. What happens to ID? To gm·rO?', done: wl >= 20 && reg === 'saturation' },
  ];
  const doneKey = challenges.filter((c) => c.done).map((c) => c.id).join(',');
  useEffect(() => {
    if (!doneKey) return;
    setSeen((s) => {
      const next = { ...s };
      for (const k of doneKey.split(',')) next[k] = true;
      return next;
    });
  }, [doneKey]);

  const vovList = [0.1, 0.2, 0.3, 0.4, 0.5].filter((v) => Math.abs(v - vov) > 0.02);
  return (
    <div className="page lab">
      <nav className="crumbs small">
        <a href="#/labs">Labs</a> › MOSFET lab
      </nav>
      <h1>MOSFET lab</h1>
      <p className="muted lab-intro">Drag the sliders and watch electrons stream through the channel, then pile up at pinch-off. Everything comes from the square law; Vth = {VTH} V.</p>
      <div className="lab-grid">
        <div className="lab-figures">
          <ChannelCrossSection vov={vov} vds={vds} maxVov={0.7} />
          <IdVdsFamily kp={kp} wl={wl} lambda={lambda} vovs={vov > 0 ? [...vovList, vov].sort((a, b) => a - b) : vovList} op={vov > 0 ? { vov, vds } : undefined} vdsMax={1.5} />
        </div>
        <div className="lab-controls">
          <Slider label="VGS" value={vgs} min={0} max={1.0} step={0.01} onChange={setVgs} format={(v) => formatSI(v, 'V')} />
          <Slider label="VDS" value={vds} min={0} max={1.5} step={0.01} onChange={setVds} format={(v) => formatSI(v, 'V')} />
          <Slider label="W/L" value={wl} min={1} max={50} step={1} onChange={setWl} />
          <Slider label="µnCox" value={kpu} min={50} max={400} step={10} onChange={setKpu} format={(v) => `${v} µA/V²`} />
          <Slider label="λ" value={lambda} min={0} max={0.3} step={0.01} onChange={setLambda} format={(v) => `${v.toFixed(2)} V⁻¹`} />
          <div className="readouts">
            <Readout label="region" value={reg.toUpperCase()} tone={reg === 'saturation' ? 'ok' : 'bad'} />
            <Readout label="Vov = VGS − Vth" value={formatSI(vov, 'V')} />
            <Readout label="ID" value={formatSI(id, 'A')} tone="signal" />
            <Readout label="gm" value={formatSI(gm, 'S')} />
            <Readout label="rO" value={formatSI(ro, 'Ω')} />
            <Readout label="gm·rO" value={Number.isFinite(gmro) ? gmro.toFixed(1) : '∞'} />
          </div>
          <p className="small muted">
            {reg === 'saturation' ? (
              <>
                Saturation: <Tex tex="I_D = \tfrac12\mu C_{ox}\tfrac{W}{L}V_{ov}^2(1+\lambda V_{DS})" />
              </>
            ) : reg === 'triode' ? (
              <>
                Triode: <Tex tex="I_D = \mu C_{ox}\tfrac{W}{L}[V_{ov}V_{DS} - V_{DS}^2/2]" />, gm and rO use the triode forms.
              </>
            ) : (
              'Off: no channel, no current.'
            )}
          </p>
        </div>
      </div>
      <section className="discover">
        <h2>What to discover</h2>
        <ul className="checklist">
          {challenges.map((c) => (
            <li key={c.id} className={seen[c.id] ? 'done' : ''}>
              <span aria-hidden="true">{seen[c.id] ? '✓' : '○'}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
