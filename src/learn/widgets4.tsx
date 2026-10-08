/**
 * Interactive pictures for the handout lectures L1–L4. Every number comes from src/physics.
 */
import { useState } from 'react';
import { LogBars } from '../circuits/figures2';
import { FoldedCascodeFig, MirrorTeleFig, NonInvertingFig } from '../circuits/figures4';
import { Plot } from '../circuits/Plot';
import { VoltageLadder } from '../circuits/schematic';
import { CmChoiceFig } from '../circuits/figures6';
import {
  closedLoopCmChoice,
  closedLoopGain,
  foldedCascodePmosInput,
  gainError,
  linearScale,
  mirrorTeleNodes,
  ps1P6,
  regionFromNodesPure,
  SET_A,
  telescopic,
  unityGainWindow,
  wlFromId,
} from '../physics';
import { formatSI } from '../practice/units';
import { Seg } from '../ui/Seg';
import { Readout, Slider } from '../ui/Slider';

const V = (x: number) => formatSI(x, 'V');
const Ohm = (x: number) => formatSI(x, 'Ω');
const S = (x: number) => formatSI(x, 'S');

function Panel({ figure, children }: { figure: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="widget">
      <div className="widget-figure">{figure}</div>
      <div className="widget-controls">{children}</div>
    </div>
  );
}

// ─── L1 ────────────────────────────────────────────────────────────────────

function GainErrorMini() {
  const [adb, setAdb] = useState(60);
  const [acl, setAcl] = useState(10);
  const a = 10 ** (adb / 20);
  const beta = 1 / acl;
  const pts: Array<[number, number]> = [];
  for (let k = 0; k <= 80; k++) {
    const d = 20 + k;
    pts.push([d, closedLoopGain(10 ** (d / 20), beta)]);
  }
  return (
    <Panel
      figure={
        <div className="stack">
          <NonInvertingFig r1={(acl - 1) * 1e3} r2={1e3} a={a} />
          <Plot
            title="Closed-loop gain versus open-loop gain"
            xRange={[20, 100]}
            yRange={[0, acl * 1.05]}
            xLabel="open-loop gain A (dB)"
            yLabel="Aclosed"
            h={200}
            xFmt={(v) => v.toFixed(0)}
            yFmt={(v) => v.toFixed(1)}
            series={[
              { points: pts, color: 'var(--signal)', width: 2.4 },
              { points: [[20, acl], [100, acl]], color: 'var(--muted)', width: 1.2, dashed: true, label: '1/β', labelAt: 'end' },
            ]}
            markers={[{ x: adb, y: closedLoopGain(a, beta), label: closedLoopGain(a, beta).toFixed(3), labelPos: 'below' }]}
          />
        </div>
      }
    >
      <Slider label="Open-loop gain A" value={adb} min={20} max={100} step={1} onChange={setAdb} format={(v) => `${v} dB = ${Number((10 ** (v / 20)).toPrecision(3))}`} />
      <Slider label="Target 1/β" value={acl} min={1} max={20} step={1} onChange={setAcl} />
      <Readout label="β = R2/(R1 + R2)" value={beta.toFixed(3)} />
      <Readout label="loop gain βA" value={(beta * a).toFixed(1)} />
      <Readout label="Aclosed = A/(1 + βA)" value={closedLoopGain(a, beta).toFixed(4)} tone="signal" />
      <Readout label="gain error ε = 1/(1 + βA)" value={`${(gainError(a, beta) * 100).toFixed(2)} %`} tone={gainError(a, beta) <= 0.01 ? 'ok' : 'bad'} />
      <p className="small muted">Filling a glass while watching the line: the bigger the loop gain, the closer you stop to the mark. Past about 40 dB of loop gain the curve is flat: the open-loop gain hardly matters.</p>
    </Panel>
  );
}

function OffsetMini() {
  const [vos, setVos] = useState(5);
  const [acl, setAcl] = useState(10);
  const aOpen = 1000;
  return (
    <Panel
      figure={
        <LogBars
          unit="V/V"
          lo={0.001}
          hi={10}
          title="How big an input offset looks at the output"
          items={[
            { label: 'input offset', value: vos / 1000, tone: 'muted', note: 'V' },
            { label: 'closed loop', value: (acl * vos) / 1000, tone: 'ok' },
            { label: 'open loop', value: Math.min(9.9, (aOpen * vos) / 1000), tone: 'bad' },
          ]}
        />
      }
    >
      <Slider label="input offset Vos" value={vos} min={0.5} max={20} step={0.5} onChange={setVos} format={(v) => `${v} mV`} />
      <Slider label="closed-loop gain 1/β" value={acl} min={1} max={50} step={1} onChange={setAcl} />
      <Readout label="output error, closed loop = Vos/β" value={`${((acl * vos) / 1000).toFixed(3)} V`} tone="ok" />
      <Readout label="open loop (A = 1000): A·Vos" value={aOpen * vos > 1800 ? 'saturates at a rail' : `${((aOpen * vos) / 1000).toFixed(2)} V`} tone="bad" />
      <p className="small muted">Offset is a bathroom scale that reads 0.5 kg with nobody on it: a small error at the input, multiplied by whatever gain follows. Supply noise works the same way (drawing on a bumpy bus): PSRR says how much of a supply wobble reaches the output.</p>
    </Panel>
  );
}

// ─── L2 ────────────────────────────────────────────────────────────────────

function BufferWindow() {
  const [vb1, setVb1] = useState(1.6);
  const [vout, setVout] = useState(1.2);
  const wlP = 420; // wide enough that M3 stays saturated (see PS1 P5 flag)
  const n = mirrorTeleNodes({ proc: SET_A, iss: 1e-3, wlN: 200, wlP, vinCm: vout, vb1, vout, bias: 'diodes', buffer: true });
  const t = telescopic({ proc: SET_A, iss: 1e-3, wlN: 200, wlP, viss: 0.3 });
  const w = unityGainWindow({ vb1, vgs4: t.n.vgs, vth4: SET_A.vthn, vth2: SET_A.vthn });
  const r2 = regionFromNodesPure(n.devices.m2), r4 = regionFromNodesPure(n.devices.m4);
  return (
    <Panel
      figure={
        <div className="stack">
          <MirrorTeleFig proc={SET_A} iss={1e-3} wlN={200} wlP={wlP} vinCm={vout} vb1={vb1} vout={vout} bias="diodes" buffer inspector={false} />
          <VoltageLadder
            vmax={w.upper + 0.35}
            vmin={w.lower - 0.35}
            h={220}
            title="The buffer window"
            nodes={[
              { label: 'top: Vb1 − VGS4 + Vth', v: w.upper, tone: 'ok' },
              { label: 'Vout = Vin', v: vout, tone: 'signal' },
              { label: 'floor: Vb1 − Vth', v: w.lower, tone: 'ok' },
            ]}
            bands={[{ from: w.upper, to: w.lower, label: `window ${w.width.toFixed(3)} V`, kind: 'swing' }]}
          />
        </div>
      }
    >
      <Slider label="Vout (= Vin in a buffer)" value={vout} min={0.6} max={1.9} step={0.005} onChange={setVout} format={V} />
      <Slider label="Vb1" value={vb1} min={1.3} max={2.0} step={0.01} onChange={setVb1} format={V} />
      <Readout label="M4 (floor)" value={r4 === 'saturation' ? 'saturated ✓' : 'TRIODE ✗'} tone={r4 === 'saturation' ? 'ok' : 'bad'} />
      <Readout label="M2 (ceiling)" value={r2 === 'saturation' ? 'saturated ✓' : 'TRIODE ✗'} tone={r2 === 'saturation' ? 'ok' : 'bad'} />
      <Readout label="window = Vth − Vov4" value={V(w.width)} tone="signal" />
      <p className="small muted">In a buffer the output is also a gate voltage, so M2’s fence moves with it. Moving Vb1 slides the window but never widens it.</p>
    </Panel>
  );
}

function TopologyCompare() {
  const [vdd, setVdd] = useState(1.8);
  const vov = 0.2, viss = 0.2;
  const ota = vdd - viss - vov - vov;
  const fd = 2 * (vdd - viss - vov - vov);
  const tele = 2 * (vdd - viss - 4 * vov);
  const fold = 2 * (vdd - 4 * vov);
  return (
    <Panel
      figure={
        <LogBars
          unit="V/V"
          lo={0.1}
          hi={10}
          title="Output swing (peak-to-peak) of each one-stage topology"
          items={[
            { label: '5-T OTA', value: Math.max(0.1001, ota), tone: 'muted' },
            { label: 'fully diff.', value: Math.max(0.1001, fd), tone: 'n' },
            { label: 'telescopic', value: Math.max(0.1001, tele), tone: 'bad' },
            { label: 'folded', value: Math.max(0.1001, fold), tone: 'ok' },
          ]}
        />
      }
    >
      <Slider label="VDD" value={vdd} min={1.0} max={3.3} step={0.05} onChange={setVdd} format={V} />
      <Readout label="5-T OTA (single-ended)" value={V(ota)} />
      <Readout label="fully differential, simple loads" value={V(fd)} />
      <Readout label="telescopic cascode (diff.)" value={V(tele)} tone="bad" />
      <Readout label="folded cascode (diff.)" value={V(fold)} tone="ok" />
      <p className="small muted">Every Vov = 0.2 V, VISS = 0.2 V. Cascoding squares the gain but doubles the headroom bill; folding removes the input pair and the tail from the output stack.</p>
    </Panel>
  );
}

// ─── L3 ────────────────────────────────────────────────────────────────────

function DesignWizard() {
  const [power, setPower] = useState(10);
  const [swing, setSwing] = useState(3);
  const [vov9, setVov9] = useState(0.5);
  const [vovP, setVovP] = useState(0.3);
  const vdd = 3;
  const proc = { name: 'Ex 9.7', kpn: 60e-6, kpp: 30e-6, vthn: 0.7, vthp: 0.7, lambdan: 0.1, lambdap: 0.2, vdd };
  const iss = 0.9 * (power / 1000 / vdd); // keep ~10% of the power for the bias circuits (Razavi: 10 mW → 3 mA)
  const left = vdd - swing / 2 - vov9 - 2 * vovP;
  const vovN = left / 2;
  const ok = vovN > 0.05;
  const wlN = ok ? wlFromId(iss / 2, proc.kpn, vovN) : NaN;
  const wlP = wlFromId(iss / 2, proc.kpp, vovP);
  const t = ok ? telescopic({ proc, iss, wlN, wlP, viss: vov9 }) : undefined;
  return (
    <Panel
      figure={
        <VoltageLadder
          vmax={vdd}
          h={320}
          title="Design by budget: power, then swing, then overdrives"
          nodes={[
            { label: 'VDD', v: vdd },
            { label: 'Vout,max', v: vdd - 2 * vovP, tone: 'ok' },
            { label: 'Vout,min', v: vov9 + 2 * Math.max(vovN, 0), tone: 'ok' },
          ]}
          bands={[
            { from: vdd, to: vdd - 2 * vovP, label: '2|Vov,P|', kind: 'p' },
            { from: vdd - 2 * vovP, to: vov9 + 2 * Math.max(vovN, 0), label: `swing ${(swing / 2).toFixed(2)} V`, kind: 'swing' },
            { from: vov9 + 2 * Math.max(vovN, 0), to: vov9, label: '2Vov,N', kind: ok ? 'n' : 'bad' },
            { from: vov9, to: 0, label: 'Vov9', kind: 'tail' },
          ]}
        />
      }
    >
      <Slider label="1. Power budget" value={power} min={2} max={20} step={0.5} onChange={setPower} format={(v) => `${v} mW → ISS ${(0.9 * (v / vdd)).toFixed(2)} mA`} />
      <Slider label="2. Differential swing" value={swing} min={1} max={4} step={0.1} onChange={setSwing} format={(v) => `${v.toFixed(1)} Vpp`} />
      <Slider label="3a. Tail overdrive Vov9" value={vov9} min={0.2} max={0.8} step={0.05} onChange={setVov9} format={V} />
      <Slider label="3b. PMOS |Vov|" value={vovP} min={0.1} max={0.5} step={0.05} onChange={setVovP} format={V} />
      <Readout label="3c. NMOS Vov (what is left ÷ 2)" value={ok ? V(vovN) : 'no room ✗'} tone={ok ? 'signal' : 'bad'} />
      <Readout label="4. (W/L)1–4 / (W/L)5–8" value={ok ? `${wlN.toFixed(0)} / ${wlP.toFixed(0)}` : '—'} />
      <Readout label="5. gain gm1(Rdown ‖ Rup)" value={t ? t.av.toFixed(0) : '—'} tone={t && t.av >= 2000 ? 'ok' : 'bad'} />
      <p className="small muted">Razavi Ex 9.7: 10 mW, 3 Vpp, target gain 2000. The gain falls short (≈ 1.4k), so step 6 lengthens the PMOS devices: gm·rO ∝ √(WL/ID).</p>
    </Panel>
  );
}

function ScalingMini() {
  const [alpha, setAlpha] = useState(1);
  const p6 = ps1P6();
  const s = linearScale({ alpha, power: p6.power, wl: p6.m1.wl, gm: p6.m1.gm, rO: p6.m1.rO });
  return (
    <Panel
      figure={
        <LogBars
          unit="V/V"
          lo={0.1}
          hi={100}
          title="What scales with α and what does not"
          items={[
            { label: 'gm ×', value: s.gm / p6.m1.gm, tone: 'signal' },
            { label: 'power ×', value: s.power / p6.power, tone: 'bad' },
            { label: 'rO ×', value: s.rO / p6.m1.rO, tone: 'muted' },
            { label: 'gain ×', value: (s.gm * s.rO) / (p6.m1.gm * p6.m1.rO), tone: 'ok' },
            { label: 'Vov ×', value: 1.0001, tone: 'ok' },
          ]}
        />
      }
    >
      <Slider label="scale factor α (widths and currents)" value={alpha} min={0.5} max={8} step={0.5} onChange={setAlpha} format={(v) => `${v}×`} />
      <Readout label="power" value={`${(s.power * 1e3).toFixed(2)} mW`} tone="bad" />
      <Readout label="(W/L)1,2" value={s.wl.toFixed(0)} />
      <Readout label="gm1" value={S(s.gm)} tone="signal" />
      <Readout label="rO1" value={Ohm(s.rO)} />
      <Readout label="CL it can drive at the same ωu" value={`${(2 * alpha).toFixed(1)} pF`} />
      <p className="small muted">Problem Set 1 P6 design. Linear scaling only buys speed (bigger CL at the same ωu) and silence: overdrives, gain and swing do not move.</p>
    </Panel>
  );
}

// ─── L4 ────────────────────────────────────────────────────────────────────

const P6 = ps1P6();
const WL11 = (2 * 0.75e-3) / (SET_A.kpp * 0.4 * 0.4);

function FoldedMini() {
  const [vinCm, setVinCm] = useState(0.6);
  const [vout, setVout] = useState(1.5);
  return (
    <Panel figure={<FoldedCascodeFig proc={SET_A} iss={0.75e-3} i={0.375e-3} wl1={P6.m1.wl} wl3={P6.m3.wl} wl5={P6.m5.wl} wl7={P6.m7.wl} wl9={P6.m9.wl} wl11={WL11} vinCm={vinCm} vout={vout} />}>
      <Slider label="Vin,CM" value={vinCm} min={-0.6} max={1.8} step={0.01} onChange={setVinCm} format={V} />
      <Slider label="Vout" value={vout} min={0.6} max={2.4} step={0.01} onChange={setVout} format={V} />
      <Readout label="input CM range" value={`${V(P6.vinCmMin)} to ${V(P6.vinCmMax!)}`} tone="signal" />
      <Readout label="output range" value={`${V(P6.voutMin)} to ${V(P6.voutMax)}`} />
      <Readout label="M5,6 current = ISS/2 + I" value={formatSI(P6.idSrc, 'A')} />
      <p className="small muted">Problem Set 1 P6. The input can go below ground (PMOS input), and input CM = output CM = 1.5 V works: impossible in a telescopic.</p>
    </Panel>
  );
}

function FoldedGain() {
  const [i, setI] = useState(0.375);
  const iss = 0.75e-3;
  const vov = 0.5;
  const fc = foldedCascodePmosInput({ proc: SET_A, iss, i: i * 1e-3, vov1: 0.3, vovNcas: vov, vovNsrc: vov, vovPcas: vov, vovPsrc: vov });
  return (
    <Panel
      figure={
        <div className="stack">
          <div className="splitbar" aria-label={`${(fc.fraction * 100).toFixed(1)}% of M1’s signal current reaches the output`}>
            <div className="splitbar-a" style={{ width: `${fc.fraction * 100}%` }}>
              to the output {(fc.fraction * 100).toFixed(1)}%
            </div>
            <div className="splitbar-b">{fc.fraction < 0.9 ? 'lost' : ''}</div>
          </div>
          <LogBars
            lo={1e3}
            hi={1e8}
            title="Folded cascode: Rup, Rdown and Rout"
            items={[
              { label: '1/gm3 (easy path)', value: 1 / fc.m3.gm, tone: 'n' },
              { label: 'rO1 ‖ rO5', value: 1 / (1 / fc.m1.rO + 1 / fc.m5.rO), tone: 'muted' },
              { label: 'R down', value: fc.rDown, tone: 'n' },
              { label: 'R up', value: fc.rUp, tone: 'p' },
              { label: 'Rout', value: fc.rout, tone: 'signal' },
            ]}
          />
        </div>
      }
    >
      <Slider label="cascode branch current I" value={i} min={0.1} max={1.0} step={0.025} onChange={setI} format={(v) => `${v.toFixed(3)} mA`} />
      <Readout label="M5 carries ISS/2 + I" value={formatSI(fc.idSrc, 'A')} />
      <Readout label="fraction reaching the output" value={`${(fc.fraction * 100).toFixed(1)} %`} tone="signal" />
      <Readout label="Av with Gm = gm1" value={fc.av.toFixed(0)} />
      <Readout label="Av with the exact divider" value={fc.avExact.toFixed(0)} tone="ok" />
      <p className="small muted">The cascode source is the easy path (≈ 1/gm3), so most of M1’s signal current turns up at the output. More I makes M5 carry more current, which lowers rO5 and loses a little more.</p>
    </Panel>
  );
}

function SeriesCompare() {
  const [mode, setMode] = useState<'tele' | 'fold'>('tele');
  // Razavi Ex 9.7 budget: VDD 3 V, |Vov,P| 0.3 V, Vov,N 0.2 V, tail 0.5 V; the folded version drops M1 and the tail.
  const vdd = 3, vp = 0.3, vn = 0.2, viss = 0.5;
  const top = vdd - 2 * vp;
  const floorT = viss + 2 * vn;
  const floorF = 2 * vn;
  return (
    <Panel
      figure={
        <VoltageLadder
          vmax={vdd}
          h={300}
          title={mode === 'tele' ? 'Telescopic: input pair and tail inside the output stack' : 'Folded: the input pair hangs off the side'}
          nodes={[
            { label: 'VDD', v: vdd },
            { label: 'ceiling', v: top, tone: 'ok' },
            { label: 'floor', v: mode === 'tele' ? floorT : floorF, tone: 'ok' },
          ]}
          bands={
            mode === 'tele'
              ? [
                  { from: vdd, to: top, label: 'M7, M5', kind: 'p' },
                  { from: top, to: floorT, label: `swing ${(top - floorT).toFixed(1)} V`, kind: 'swing' },
                  { from: floorT, to: viss + vn, label: 'M3', kind: 'n' },
                  { from: viss + vn, to: viss, label: 'M1', kind: 'n' },
                  { from: viss, to: 0, label: 'tail', kind: 'tail' },
                ]
              : [
                  { from: vdd, to: top, label: 'M9, M7', kind: 'p' },
                  { from: top, to: floorF, label: `swing ${(top - floorF).toFixed(1)} V`, kind: 'swing' },
                  { from: floorF, to: 0, label: 'M3, M5', kind: 'n' },
                ]
          }
        />
      }
    >
      <Seg label="Topology" value={mode} onChange={setMode} options={[{ value: 'tele', label: 'Telescopic' }, { value: 'fold', label: 'Folded' }]} />
      <Readout label="single-ended swing" value={V(top - (mode === 'tele' ? floorT : floorF))} tone="signal" />
      <p className="small muted">Same overdrives as Ex 9.7. Don’t stack, fold: the folded cascode pays for the extra swing with extra current (two more branches), a little less gain and a pole at the folding node.</p>
    </Panel>
  );
}

/* ─── L2, Razavi Ex 9.6 (Lec 5): where to put the CM level of a telescopic in closed loop ─── */

function CmChoiceMini() {
  const [vcm, setVcm] = useState(0.95);
  const [amp, setAmp] = useState(0.3);
  const vb = 1.6, vth = 0.7, vov = 0.2;
  const r = closedLoopCmChoice({ vb, vgs34: vth + vov, vth34: vth, vth12: vth });
  const m12Ok = vcm <= r.vcm + 1e-9;
  const m34Ok = vcm - amp >= r.floor - 1e-9;
  const room = Math.max(0, vcm - r.floor);
  return (
    <Panel figure={<CmChoiceFig vb={vb} vth={vth} vov={vov} vcm={vcm} amp={amp} />}>
      <Slider label="output CM level VCM" value={vcm} min={0.9} max={1.5} step={0.01} onChange={setVcm} format={V} />
      <Slider label="signal amplitude at X" value={amp} min={0.05} max={0.6} step={0.01} onChange={setAmp} format={V} />
      <Readout label="M1, M2 at DC (need VCM ≤ Vb − Vov)" value={m12Ok ? 'saturated' : 'triode'} tone={m12Ok ? 'ok' : 'bad'} />
      <Readout label="M3, M4 at the bottom of the swing" value={m34Ok ? 'saturated' : 'triode'} tone={m34Ok ? 'ok' : 'bad'} />
      <Readout label="room to fall = VCM − (Vb − Vth)" value={V(room)} tone="signal" />
      <Readout label="best VCM (top edge)" value={`${V(r.vcm)}: ±${V(r.peak)}`} />
      <p className="small muted">Vb = 1.6 V, Vth = 0.7 V, Vov3,4 = 0.2 V. Because the loop forces Vin,CM = Vout,CM, the drains X, Y sit at the input CM. Put it at the top edge (M1, M2 just saturated): X can then fall a full Vth − Vov before M3, M4 leave saturation, and rising is limited only by the PMOS loads.</p>
    </Panel>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const WIDGETS4: Record<string, (p: any) => React.ReactElement> = {
  gainErrorMini: GainErrorMini,
  offsetMini: OffsetMini,
  bufferWindow: BufferWindow,
  cmChoiceMini: CmChoiceMini,
  topologyCompare: TopologyCompare,
  designWizard: DesignWizard,
  scalingMini: ScalingMini,
  foldedMini: FoldedMini,
  foldedGain: FoldedGain,
  seriesCompare: SeriesCompare,
};
