/**
 * Figures for L8 (replica CMFB, Lec 12) and L10–L14 (noise/PSRR, stability, compensation; Lec 13–17):
 * loop-gain Bode plots with ωgx / ωpx / PM / GM, closed-loop step responses, the Barkhausen picture,
 * the Miller block diagram and the notes' two-stage op amp with CC (and Rz).
 */
import type { ReactNode } from 'react';
import { closedLoopStep, gainCrossover, loopMag, loopPhase, phaseCrossover, resistorNoise, type LoopSpec } from '../physics';
import { formatSI } from '../practice/units';
import { Plot, type Series } from './Plot';
import { Canvas, Dot, Ground, Label, Nmos, Pmos, Rail, ResistorH, Sym, Terminal, Wire, Capacitor, CurrentSource, Resistor } from './primitives';

const Hz = (f: number) => formatSI(f, 'Hz', 3);
const dB = (x: number) => 20 * Math.log10(x);

/** Frequency window (log10 Hz) that shows the poles, zeros and both crossovers. */
function window(s: LoopSpec): [number, number] {
  const fs = [...s.poles, ...(s.zerosRhp ?? []), ...(s.zerosLhp ?? [])];
  const gx = gainCrossover(s);
  const px = phaseCrossover(s);
  if (gx) fs.push(gx);
  if (px) fs.push(px);
  const lo = Math.floor(Math.log10(Math.min(...fs))) - 1;
  const hi = Math.ceil(Math.log10(Math.max(...fs))) + 1;
  return [lo, Math.max(hi, lo + 3)];
}

/** A vertical guide line with its label placed at the top or the bottom of the plot area. */
function VGuide({ x, y0, y1, label, color, top }: { x: number; y0: number; y1: number; label: string; color: string; top?: boolean }) {
  return (
    <g>
      <line x1={x} x2={x} y1={y0} y2={y1} stroke={color} strokeDasharray="4 4" strokeWidth={1.3} />
      <Label x={x + 4} y={top ? y0 + 12 : y1 - 6} text={label} size={11} color={color} weight={600} bg />
    </g>
  );
}

/**
 * Loop-gain Bode plots (magnitude over phase), as drawn in Lec 15–16: 20log|βA| with the 0 dB line,
 * ∠βA with the −180° line, ωgx and ωpx marked, and the phase margin / gain margin as brackets.
 * mode 'notes' (Lec 17) draws 20log|A| and the 20log(1/β) line instead: they cross at ωgx.
 */
export function LoopBodeFig({ spec, mode = 'loop', h = 230 }: { spec: LoopSpec; mode?: 'loop' | 'notes'; h?: number }) {
  const [lo, hi] = window(spec);
  const gx = gainCrossover(spec);
  const px = phaseCrossover(spec);
  const mag: Array<[number, number]> = [];
  const ph: Array<[number, number]> = [];
  const shift = mode === 'notes' ? -dB(spec.beta) : 0; // |A| = |βA|/β
  for (let k = 0; k <= 240; k++) {
    const lf = lo + ((hi - lo) * k) / 240;
    const f = 10 ** lf;
    mag.push([lf, dB(loopMag(spec, f)) + shift]);
    ph.push([lf, loopPhase(spec, f)]);
  }
  const top = Math.ceil((dB(spec.beta * spec.a0) + shift + 10) / 20) * 20;
  const bottom = Math.min(-40, Math.floor((Math.min(...mag.map((m) => m[1])) - 5) / 20) * 20);
  const yMin = Math.max(bottom, -80);
  const phMin = Math.min(-270, Math.floor(Math.min(...ph.map((p) => p[1])) / 90) * 90);
  const xt: number[] = [];
  for (let e = lo; e <= hi; e++) xt.push(e);
  const zeroLine = mode === 'notes' ? -dB(spec.beta) : 0;
  const magSeries: Series[] = [
    { points: [[lo, zeroLine], [hi, zeroLine]], color: mode === 'notes' ? 'var(--signal)' : 'var(--muted)', width: 1.4, dashed: mode !== 'notes', label: mode === 'notes' ? '20log(1/β)' : '0 dB', labelAt: 'end' },
    { points: mag, color: 'var(--ink)', width: 2.6, label: mode === 'notes' ? '20log|A|' : '20log|βA|', labelAt: 'start' },
  ];
  const lgx = gx ? Math.log10(gx) : undefined;
  const lpx = px ? Math.log10(px) : undefined;
  const close = lgx !== undefined && lpx !== undefined && Math.abs(lgx - lpx) < (hi - lo) * 0.14;
  const pmAt = gx ? loopPhase(spec, gx) : undefined;
  const gmAt = px ? dB(loopMag(spec, px)) + shift : undefined;
  return (
    <div className="stack tight">
      <Plot
        title={mode === 'notes' ? 'Open-loop gain and the 1/β line: they cross at ωgx' : 'Loop gain magnitude 20log|βA|'}
        xRange={[lo, hi]}
        yRange={[yMin, top]}
        xLabel="frequency (Hz, log scale)"
        yLabel="dB"
        h={h}
        xTicks={xt}
        xFmt={(v) => formatSI(10 ** v, 'Hz', 1)}
        yFmt={(v) => v.toFixed(0)}
        series={magSeries}
      >
        {(sx, sy) => (
          <g>
            {lgx !== undefined && <VGuide x={sx(lgx)} y0={14} y1={sy(yMin)} label="ωgx" color="var(--signal)" top />}
            {lpx !== undefined && <VGuide x={sx(lpx)} y0={14} y1={sy(yMin)} label="ωpx" color="var(--pmos)" top={!close} />}
            {lgx !== undefined && <circle cx={sx(lgx)} cy={sy(zeroLine)} r={5} fill="var(--signal)" stroke="var(--surface)" strokeWidth={2} />}
            {lpx !== undefined && gmAt !== undefined && gmAt < zeroLine && (
              <g>
                <line x1={sx(lpx)} x2={sx(lpx)} y1={sy(zeroLine)} y2={sy(gmAt)} stroke="var(--pmos)" strokeWidth={3} />
                <Label x={sx(lpx) + 6} y={(sy(zeroLine) + sy(gmAt)) / 2 + 4} text={`GM ${(zeroLine - gmAt).toFixed(1)} dB`} size={11} color="var(--pmos)" weight={700} bg />
              </g>
            )}
          </g>
        )}
      </Plot>
      <Plot
        title="Loop gain phase ∠βA: the danger line is −180°"
        xRange={[lo, hi]}
        yRange={[phMin, 0]}
        xLabel="frequency (Hz, log scale)"
        yLabel="phase (°)"
        h={h}
        xTicks={xt}
        yTicks={[0, -90, -180, -270].filter((v) => v >= phMin)}
        xFmt={(v) => formatSI(10 ** v, 'Hz', 1)}
        yFmt={(v) => v.toFixed(0)}
        series={[
          { points: [[lo, -180], [hi, -180]], color: 'var(--bad)', width: 1.4, dashed: true, label: '−180°', labelAt: 'start' },
          { points: ph, color: 'var(--ink)', width: 2.6 },
        ]}
      >
        {(sx, sy) => (
          <g>
            {lgx !== undefined && <VGuide x={sx(lgx)} y0={14} y1={sy(phMin)} label="ωgx" color="var(--signal)" />}
            {lpx !== undefined && <VGuide x={sx(lpx)} y0={14} y1={sy(phMin)} label="ωpx" color="var(--pmos)" top={close} />}
            {lgx !== undefined && pmAt !== undefined && (
              <g>
                <line x1={sx(lgx)} x2={sx(lgx)} y1={sy(-180)} y2={sy(pmAt)} stroke={pmAt > -180 ? 'var(--ok)' : 'var(--bad)'} strokeWidth={3.5} />
                <circle cx={sx(lgx)} cy={sy(pmAt)} r={5} fill="var(--signal)" stroke="var(--surface)" strokeWidth={2} />
                <Label x={sx(lgx) + (lgx > (lo + hi) / 2 ? -8 : 8)} y={(sy(-180) + sy(pmAt)) / 2 + 4} anchor={lgx > (lo + hi) / 2 ? 'end' : 'start'} text={`PM ${(180 + pmAt).toFixed(1)}°`} size={12} color={pmAt > -180 ? 'var(--ok)' : 'var(--bad)'} weight={700} bg />
              </g>
            )}
          </g>
        )}
      </Plot>
    </div>
  );
}

/** Closed-loop unit step response (normalised to its final value) for one or more loops. */
export function ClosedStepFig({ specs, h = 240, title }: { specs: Array<{ spec: LoopSpec; label: string; color?: string }>; h?: number; title?: string }) {
  const gx = Math.min(...specs.map((s) => gainCrossover(s.spec) ?? 1e6));
  const tEnd = 12 / (2 * Math.PI * gx);
  const unit = tEnd < 1e-6 ? { k: 1e9, u: 'ns' } : tEnd < 1e-3 ? { k: 1e6, u: 'µs' } : { k: 1e3, u: 'ms' };
  const colors = ['var(--signal)', 'var(--nmos)', 'var(--pmos)', 'var(--ink-2)'];
  const series: Series[] = [{ points: [[0, 1], [tEnd * unit.k, 1]], color: 'var(--ok)', width: 1.2, dashed: true }];
  let peak = 1;
  specs.forEach((s, i) => {
    const r = closedLoopStep(s.spec, tEnd, 500);
    peak = Math.max(peak, ...r.map((p) => p.y));
    series.push({ points: r.map((p) => [p.t * unit.k, Math.max(-0.5, Math.min(2.5, p.y))]), color: s.color ?? colors[i % colors.length], width: 2.4 });
  });
  const yTop = Math.min(2.5, Math.max(1.3, Math.ceil((peak + 0.15) * 5) / 5));
  return (
    <div>
    <Plot
      title={title ?? 'Closed-loop step response (1 = the final value 1/β)'}
      xRange={[0, tEnd * unit.k]}
      yRange={[0, yTop]}
      xLabel={`time (${unit.u})`}
      yLabel="Vout / final"
      h={h}
      xFmt={(v) => String(Number(v.toPrecision(2)))}
      yFmt={(v) => v.toFixed(1)}
      series={series}
    />
      <div className="plot-legend">
        <span><i style={{ background: 'var(--ok)' }} />final value</span>
        {specs.map((s, i) => (
          <span key={s.label}><i style={{ background: s.color ?? colors[i % colors.length] }} />{s.label}</span>
        ))}
      </div>
    </div>
  );
}

/**
 * Barkhausen (Lec 14, Razavi §10.1): a small wiggle goes once round the loop. The loop returns it
 * multiplied by |βA| and shifted by 180° (the inversion) + the amplifier's lag. If the lag is 180° and
 * |βA| ≥ 1, what comes back lines up with what went in: the circuit feeds its own noise and oscillates.
 */
export function BarkhausenFig({ loopGain, lag }: { loopGain: number; lag: number }) {
  const pts = (amp: number, shiftDeg: number): Array<[number, number]> => {
    const out: Array<[number, number]> = [];
    for (let k = 0; k <= 200; k++) {
      const th = (k / 200) * 3 * 360;
      out.push([th / 360, amp * Math.sin(((th - shiftDeg) * Math.PI) / 180)]);
    }
    return out;
  };
  // Returned = −βA·x: total shift = 180° (the minus sign) + lag.
  const ret = pts(loopGain, 180 + lag);
  const top = Math.max(1.3, loopGain * 1.2);
  return (
    <Plot
      title="One trip round the loop: what goes in, what comes back"
      xRange={[0, 3]}
      yRange={[-top, top]}
      xLabel="time (cycles)"
      yLabel="signal"
      h={220}
      xTicks={[0, 1, 2, 3]}
      yFmt={(v) => v.toFixed(1)}
      series={[
        { points: ret, color: 'var(--signal)', width: 4, opacity: 0.8, label: 'comes back', labelAt: 'end' },
        { points: pts(1, 0), color: 'var(--ink)', width: 1.8, dashed: true, label: 'noise in', labelAt: 'start' },
      ]}
    />
  );
}

function Amp({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <g>
      <polygon points={`${x - 26},${y - 26} ${x - 26},${y + 26} ${x + 26},${y}`} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      <Label x={x - 12} y={y + 5} text={text} size={12} weight={700} />
    </g>
  );
}

function CapH({ x, y, label, id }: { x: number; y: number; label?: ReactNode; id?: string }) {
  return (
    <g data-id={id}>
      <line x1={x - 4} y1={y - 12} x2={x - 4} y2={y + 12} stroke="var(--ink)" strokeWidth={3} />
      <line x1={x + 4} y1={y - 12} x2={x + 4} y2={y + 12} stroke="var(--ink)" strokeWidth={3} />
      {label && <Label x={x} y={y - 18} text={label} anchor="middle" size={12} weight={600} />}
    </g>
  );
}

/**
 * Lec 17 block diagram: A1 → node 1 (R1, C1) → A2 → output (R2, C2), with CC across A2.
 * equivalent = true shows the Miller split: CC(1 + A2) at node 1 and CC(1 + 1/A2) at the output.
 */
export function MillerBlockFig({ equivalent = false, a2, highlight }: { equivalent?: boolean; a2?: number; highlight?: string[] }) {
  const y = 110;
  const n1 = 200, out = 380;
  return (
    <Canvas w={470} h={250} title={equivalent ? 'Miller split: CC looks (1 + A2) times bigger at node 1' : 'Two-stage op amp as blocks, CC across the second stage'} highlight={highlight}>
      <Terminal x={24} y={y} />
      <Label x={24} y={y - 12} text="Vin" anchor="middle" weight={600} />
      <Wire points={[[24, y], [86, y]]} />
      <Amp x={112} y={y} text="A1" />
      <Wire points={[[138, y], [262, y]]} id="n1" />
      <Dot x={n1} y={y} id="n1" />
      <Amp x={288} y={y} text="A2" />
      <Wire points={[[314, y], [440, y]]} id="out" />
      <Dot x={out} y={y} id="out" />
      <Terminal x={440} y={y} />
      <Label x={440} y={y - 12} text="Vout" anchor="middle" weight={600} />
      {/* node 1: R1 ‖ C1 */}
      <Resistor x={n1 - 26} y1={y} y2={y + 80} label={<Sym base="R" sub="1" />} labelSide="left" id="r1" />
      <Wire points={[[n1, y], [n1 - 26, y]]} />
      <Ground x={n1 - 26} y={y + 80} />
      <Capacitor x={n1 + 16} y1={y} y2={y + 80} label={equivalent ? `C1 + CC(1+A2)` : <Sym base="C" sub="1" />} id={equivalent ? 'cm1' : 'c1'} />
      <Ground x={n1 + 16} y={y + 80} />
      {/* output: R2 ‖ C2 */}
      <Resistor x={out - 20} y1={y} y2={y + 80} label={<Sym base="R" sub="2" />} labelSide="left" id="r2" />
      <Wire points={[[out, y], [out - 20, y]]} />
      <Ground x={out - 20} y={y + 80} />
      <Capacitor x={out + 18} y1={y} y2={y + 80} label={equivalent ? 'C2 + CC' : <Sym base="C" sub="2" />} id={equivalent ? 'cm2' : 'c2'} />
      <Ground x={out + 18} y={y + 80} />
      {!equivalent && (
        <g>
          <Wire points={[[n1, y], [n1, 40], [285, 40]]} id="cc" />
          <CapH x={290} y={40} label={<Sym base="C" sub="C" />} id="cc" />
          <Wire points={[[295, 40], [out, 40], [out, y]]} id="cc" />
        </g>
      )}
      {equivalent && <Label x={288} y={44} text={a2 ? `A2 = ${a2.toPrecision(3)}: node 1 sees ${(1 + a2).toPrecision(3)}·CC` : 'CC removed; its effect split between the two nodes'} anchor="middle" size={12} color="var(--signal)" weight={600} />}
      <Label x={n1 - 4} y={y - 12} text="1" anchor="middle" size={12} weight={700} color="var(--ink-2)" />
    </Canvas>
  );
}

/**
 * The notes' two-stage op amp (Lec 17): 5-T OTA (M1–M5, NMOS input, PMOS mirror) drives the PMOS CS
 * stage M6 with the NMOS current source M7. CC (optionally with Rz) bridges P and the output Q.
 */
export function TwoStageMillerFig({ rz = false, highlight }: { rz?: boolean; highlight?: string[] }) {
  const x1 = 130, x2 = 250, x5 = 190, x6 = 390;
  const yP = 80, yN = 185, yT = 262, yQ = 168, yP7 = 262;
  return (
    <Canvas w={520} h={330} title={rz ? 'Two-stage op amp with CC and the nulling resistor Rz' : 'Two-stage op amp with Miller capacitor CC (Lec 17)'} highlight={highlight} maxWidth={620}>
      <Rail x1={x1 - 20} x2={x6 + 20} y={30} label="VDD" />
      {/* first stage */}
      <Wire points={[[x1, 30], [x1, yP - 30]]} />
      <Wire points={[[x2, 30], [x2, yP - 30]]} />
      <Pmos x={x1} y={yP} name="M3" id="m3" flip diode />
      <Pmos x={x2} y={yP} name="M4" id="m4" />
      <Wire points={[[x1 + 30, yP], [x2 - 30, yP]]} />
      <Wire points={[[x1, yP + 30], [x1, yN - 30]]} />
      <Wire points={[[x2, yP + 30], [x2, yN - 30]]} id="p" />
      <Nmos x={x1} y={yN} name="M1" id="m1" />
      <Nmos x={x2} y={yN} name="M2" id="m2" />
      <Wire points={[[x1 - 30, yN], [x1 - 48, yN]]} />
      <Terminal x={x1 - 52} y={yN} />
      <Label x={x1 - 52} y={yN - 12} text="Vin1" anchor="middle" size={12} weight={600} />
      <Wire points={[[x2 - 30, yN], [x2 - 44, yN]]} />
      <Terminal x={x2 - 48} y={yN} />
      <Label x={x2 - 48} y={yN + 22} text="Vin2" anchor="middle" size={12} weight={600} />
      <Wire points={[[x1, yN + 30], [x1, 228], [x2, 228], [x2, yN + 30]]} />
      <Dot x={x5} y={228} />
      <Wire points={[[x5, 228], [x5, yT - 30]]} />
      <Nmos x={x5} y={yT} name="M5" id="m5" />
      <Wire points={[[x5 - 30, yT], [x5 - 44, yT]]} />
      <Label x={x5 - 48} y={yT + 4} text="Vb" anchor="end" size={12} />
      <Ground x={x5} y={yT + 30} />
      {/* node P */}
      <Dot x={x2} y={132} id="p" />
      <Label x={x2 - 8} y={128} text="P" anchor="end" size={13} weight={700} color="var(--signal)" />
      <Wire points={[[x2, 132], [340, 132], [340, yP], [x6 - 30, yP]]} id="p" />
      <Dot x={298} y={132} id="p" />
      <Capacitor x={298} y1={132} y2={170} label={<Sym base="C" sub="1" />} id="c1" />
      <Ground x={298} y={170} />
      {/* second stage */}
      <Wire points={[[x6, 30], [x6, yP - 30]]} />
      <Pmos x={x6} y={yP} name="M6" id="m6" />
      <Wire points={[[x6, yP + 30], [x6, yP7 - 30]]} id="q" />
      <Nmos x={x6} y={yP7} name="M7" id="m7" />
      <Wire points={[[x6 - 30, yP7], [x6 - 44, yP7]]} />
      <Label x={x6 - 48} y={yP7 + 4} text="Vb" anchor="end" size={12} />
      <Ground x={x6} y={yP7 + 30} />
      <Dot x={x6} y={yQ} id="q" />
      <Label x={x6 + 8} y={yQ - 8} text="Q" size={13} weight={700} color="var(--signal)" />
      <Wire points={[[x6, yQ], [480, yQ]]} id="q" />
      <Terminal x={484} y={yQ} />
      <Label x={484} y={yQ - 12} text="Vout" anchor="middle" weight={600} />
      <Dot x={450} y={yQ} id="q" />
      <Capacitor x={450} y1={yQ} y2={yQ + 60} label={<Sym base="C" sub="2" />} id="c2" />
      <Ground x={450} y={yQ + 60} />
      {/* CC (and Rz) from P to Q */}
      <Dot x={326} y={132} id="cc" />
      <Wire points={[[326, 132], [326, 214]]} id="cc" />
      {rz ? (
        <g>
          <ResistorH x1={326} x2={352} y={214} id="rz" />
          <Label x={339} y={236} text="Rz" anchor="middle" size={12} weight={600} />
          <Wire points={[[352, 214], [356, 214]]} id="cc" />
          <CapH x={360} y={214} id="cc" />
        </g>
      ) : (
        <g>
          <Wire points={[[326, 214], [356, 214]]} id="cc" />
          <CapH x={360} y={214} id="cc" />
        </g>
      )}
      <Label x={366} y={242} text="CC" anchor="middle" size={12} weight={700} />
      <Wire points={[[364, 214], [372, 214], [372, yQ], [x6, yQ]]} id="cc" />
    </Canvas>
  );
}

/**
 * Lec 12 replica CMFB: M11 (tail of the input pair) stands on the triode pair M12, M13 whose gates are the
 * outputs; M14 carries the same current I1 with the same gate and stands on M15 whose gate is VREF.
 */
export function ReplicaCmfbFig({ vref, vcm, highlight }: { vref?: number; vcm?: number; highlight?: string[] }) {
  const xL = 110, xR = 330, yTop = 30;
  return (
    <Canvas w={480} h={320} title="Replica CMFB: M14–M15 copy M11–M12–M13, with VREF in place of the outputs" highlight={highlight}>
      <Rail x1={xL - 30} x2={xL + 30} y={yTop} label="VDD" labelSide="left" />
      <CurrentSource x={xL} y1={yTop} y2={96} label={<Sym base="I" sub="1" />} labelSide="left" id="i1" />
      <Wire points={[[xL, 96], [xL, 120]]} />
      <Nmos x={xL} y={150} name="M14" id="m14" diode />
      <Wire points={[[xL, 180], [xL, 210]]} />
      <Nmos x={xL} y={240} name="M15" id="m15" />
      <Wire points={[[xL - 30, 240], [xL - 50, 240]]} id="vref" />
      <Label x={xL - 54} y={244} text={vref !== undefined ? `VREF ${vref.toFixed(2)} V` : 'VREF'} anchor="end" size={12} weight={600} color="var(--signal)" />
      <Ground x={xL} y={270} />
      {/* shared gate M14 → M11 */}
      <Wire points={[[xL - 30, 150], [xL - 30, 118], [xL + 60, 118], [xL + 60, 150], [xR - 30, 150]]} id="g" />
      <Label x={xR - 150} y={110} text="same gate, same current I1" size={11} color="var(--ink-2)" />
      <Wire points={[[xR, 60], [xR, 120]]} />
      <Label x={xR} y={52} text="from the input pair’s sources" anchor="middle" size={11} color="var(--ink-2)" />
      <Nmos x={xR} y={150} name="M11" id="m11" />
      <Wire points={[[xR, 180], [xR, 200], [xR - 40, 200], [xR - 40, 210]]} />
      <Wire points={[[xR, 200], [xR + 40, 200], [xR + 40, 210]]} />
      <Nmos x={xR - 40} y={240} name="M12" id="m12" flip />
      <Nmos x={xR + 40} y={240} name="M13" id="m13" />
      <Wire points={[[xR - 70, 240], [xR - 86, 240]]} id="out" />
      <Label x={xR - 90} y={244} text="Vout1" anchor="end" size={12} weight={600} />
      <Wire points={[[xR + 70, 240], [xR + 86, 240]]} id="out" />
      <Label x={xR + 90} y={244} text="Vout2" size={12} weight={600} />
      <Wire points={[[xR - 40, 270], [xR + 40, 270]]} />
      <Ground x={xR} y={270} />
      {vcm !== undefined && <Label x={xR} y={306} text={`output CM forced to ${vcm.toFixed(3)} V`} anchor="middle" size={12} weight={700} color="var(--signal)" />}
    </Canvas>
  );
}

/** A bar per device: its share of the input-referred noise power (for the "wiggle each gate" rule). */
export function NoiseShareFig({ items }: { items: Array<{ label: string; value: number; tone?: 'n' | 'p' | 'muted' | 'signal' }> }) {
  const total = items.reduce((a, b) => a + b.value, 0);
  const rowH = 30, top = 14, x0 = 130, x1 = 380;
  const h = top + items.length * rowH + 14;
  const color = { n: 'var(--nmos)', p: 'var(--pmos)', muted: 'var(--muted)', signal: 'var(--signal)' };
  return (
    <Canvas w={440} h={h} title="Who makes the noise: each device’s share of the input-referred noise power" maxWidth={520}>
      {items.map((it, i) => {
        const y = top + i * rowH;
        const frac = total > 0 ? it.value / total : 0;
        return (
          <g key={it.label}>
            <Label x={x0 - 8} y={y + 13} text={it.label} anchor="end" size={12} weight={600} />
            <rect x={x0} y={y + 1} width={x1 - x0} height={16} rx={4} fill="var(--line)" opacity={0.5} />
            <rect x={x0} y={y + 1} width={Math.max(2, (x1 - x0) * frac)} height={16} rx={4} fill={color[it.tone ?? 'n']} />
            <Label x={x1 + 6} y={y + 13} text={`${(frac * 100).toFixed(0)}%`} size={11} mono weight={600} />
          </g>
        );
      })}
    </Canvas>
  );
}

export { Hz };

/**
 * Razavi HO #10: the noise of R seen on C. Height √(4kTR) (flat, “white”), cut by the RC filter at 1/(2πRC).
 * A second, dashed curve (another R, same C) shows the trade: taller but narrower, the same total √(kT/C).
 */
export function KtcSpectrumFig({ r, c, other }: { r: number; c: number; other?: number }) {
  const yMin = -2, yMax = 2.5;
  const curve = (rr: number): Array<[number, number]> => {
    const ff = 1 / (2 * Math.PI * rr * c);
    const out: Array<[number, number]> = [];
    for (let k = 0; k <= 200; k++) {
      const lf = 2 + (9 * k) / 200;
      const d = Math.sqrt(resistorNoise(rr) / (1 + (10 ** lf / ff) ** 2)) * 1e9;
      out.push([lf, Math.max(yMin, Math.log10(d))]);
    }
    return out;
  };
  const series: Series[] = [];
  if (other) series.push({ points: curve(other), color: 'var(--muted)', width: 1.6, dashed: true });
  series.push({ points: curve(r), color: 'var(--signal)', width: 2.6 });
  return (
    <div>
      <Plot
        title="Noise density on C: √(4kTR), flat, then cut by the RC filter"
        xRange={[2, 11]}
        yRange={[yMin, yMax]}
        xLabel="frequency (Hz, log scale)"
        yLabel="nV/√Hz (log)"
        xTicks={[2, 4, 6, 8, 10]}
        yTicks={[-2, -1, 0, 1, 2]}
        xFmt={(v) => formatSI(10 ** v, 'Hz', 1)}
        yFmt={(v) => String(Number((10 ** v).toPrecision(1)))}
        series={series}
      />
      <div className="plot-legend">
        <span><i style={{ background: 'var(--signal)' }} />R = {formatSI(r, 'Ω')}</span>
        {other && <span><i style={{ background: 'var(--muted)' }} />R = {formatSI(other, 'Ω')} (same C)</span>}
      </div>
    </div>
  );
}
