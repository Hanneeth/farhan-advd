/**
 * Digital VLSI figures (L15–L38): inverters with every load, the VTC with VIL/VIH/VM and noise margins,
 * switching waveforms, static CMOS gates drawn from an expression (pull-down and dual pull-up), the RC
 * ladder, a logical-effort path, flip-flop timing, the dynamic gate, pass gates and the 6T SRAM cell.
 */
import { cmosVilVih, cmosVM, cmosVout, dual, parseExpr, sizeNetwork, type InvSpec, type Net } from '../physics';
import { formatSI } from '../practice/units';
import { Plot, type Series } from './Plot';
import { Canvas, Capacitor, Dot, Ground, Label, Nmos, Pmos, Rail, Resistor, Terminal, Wire } from './primitives';

const V = (x: number) => formatSI(x, 'V');

/* ─── Inverters ─── */

export type LoadKind = 'cmos' | 'resistive' | 'pseudo' | 'depletion';

/** One inverter: nMOS driver at the bottom, the chosen load on top, input on the left, CL on the right. */
export function InverterFig({ load = 'cmos', vin, vout, highlight }: { load?: LoadKind; vin?: number; vout?: number; highlight?: string[] }) {
  const x = 190, yP = 90, yN = 200, yOut = 145;
  return (
    <Canvas w={360} h={290} title={`${{ cmos: 'CMOS', resistive: 'Resistive-load', pseudo: 'Pseudo-nMOS', depletion: 'Depletion-load nMOS' }[load]} inverter`} highlight={highlight} maxWidth={420}>
      <Rail x1={x - 40} x2={x + 40} y={30} label="VDD" />
      <Wire points={[[x, 30], [x, yP - 30]]} />
      {load === 'cmos' && <Pmos x={x} y={yP} name="Mp" id="mp" />}
      {load === 'pseudo' && (
        <>
          <Pmos x={x} y={yP} name="Mp" id="mp" />
          <Wire points={[[x - 30, yP], [x - 44, yP], [x - 44, yP + 22]]} />
          <Ground x={x - 44} y={yP + 22} />
        </>
      )}
      {load === 'resistive' && <Resistor x={x} y1={yP - 30} y2={yP + 30} label="RL" id="rl" />}
      {load === 'depletion' && (
        <>
          <Nmos x={x} y={yP} name="ML (dep)" id="ml" />
          <Wire points={[[x - 30, yP], [x - 42, yP], [x - 42, yP + 42], [x, yP + 42]]} />
        </>
      )}
      <Wire points={[[x, yP + 30], [x, yN - 30]]} id="out" />
      <Dot x={x} y={yOut} id="out" />
      <Wire points={[[x, yOut], [300, yOut]]} id="out" />
      <Terminal x={300} y={yOut} />
      <Label x={300} y={yOut - 12} text={vout !== undefined ? `Vout ${V(vout)}` : 'Vout'} anchor="middle" size={12} weight={600} />
      <Dot x={260} y={yOut} />
      <Capacitor x={260} y1={yOut} y2={yOut + 60} label="CL" id="cl" />
      <Ground x={260} y={yOut + 60} />
      <Nmos x={x} y={yN} name="Mn" id="mn" />
      <Ground x={x} y={yN + 30} />
      {load === 'cmos' ? (
        <Wire points={[[x - 30, yP], [x - 60, yP], [x - 60, yN], [x - 30, yN]]} id="in" />
      ) : (
        <Wire points={[[x - 30, yN], [x - 60, yN]]} id="in" />
      )}
      <Wire points={[[x - 60, yN - (load === 'cmos' ? 55 : 0)], [x - 110, yN - (load === 'cmos' ? 55 : 0)]]} id="in" />
      <Terminal x={x - 114} y={yN - (load === 'cmos' ? 55 : 0)} />
      <Label x={x - 114} y={yN - (load === 'cmos' ? 55 : 0) - 12} text={vin !== undefined ? `Vin ${V(vin)}` : 'Vin'} anchor="middle" size={12} weight={600} />
    </Canvas>
  );
}

/**
 * Voltage transfer characteristic with VOH, VOL, VIL, VIH (slope −1 points) and VM, plus the
 * noise-margin bands. `curve` is sampled Vout(Vin); markers are optional.
 */
export function VtcPlot({ curve, vdd, vil, vih, vm, vol, voh, extra, h = 280 }: { curve: Array<[number, number]>; vdd: number; vil?: number; vih?: number; vm?: number; vol?: number; voh?: number; extra?: Array<{ points: Array<[number, number]>; label: string; color: string }>; h?: number }) {
  const series: Series[] = [
    { points: [[0, 0], [vdd, vdd]], color: 'var(--muted)', width: 1.2, dashed: true },
    ...(extra ?? []).map((e) => ({ points: e.points, color: e.color, width: 2, label: e.label, labelAt: 'end' as const })),
    { points: curve, color: 'var(--ink)', width: 2.8 },
  ];
  const at = (v: number) => curve.reduce((best, p) => (Math.abs(p[0] - v) < Math.abs(best[0] - v) ? p : best), curve[0])[1];
  return (
    <Plot
      title="Voltage transfer characteristic"
      xRange={[0, vdd]}
      yRange={[0, vdd * 1.05]}
      xLabel="Vin (V)"
      yLabel="Vout (V)"
      h={h}
      xFmt={(v) => v.toFixed(1)}
      yFmt={(v) => v.toFixed(1)}
      series={series}
      shades={[
        ...(vil !== undefined && vol !== undefined ? [{ x0: 0, x1: vil, color: 'var(--nmos)', label: 'reads 0', labelAt: 'bottom' as const }] : []),
        ...(vih !== undefined ? [{ x0: vih, x1: vdd, color: 'var(--pmos)', label: 'reads 1', labelAt: 'bottom' as const }] : []),
      ]}
      markers={[
        ...(vil !== undefined ? [{ x: vil, y: at(vil), label: `VIL ${vil.toFixed(2)}`, labelPos: 'left' as const, color: 'var(--nmos)' }] : []),
        ...(vih !== undefined ? [{ x: vih, y: at(vih), label: `VIH ${vih.toFixed(2)}`, labelPos: 'right' as const, color: 'var(--pmos)' }] : []),
        ...(vm !== undefined ? [{ x: vm, y: vm, label: `VM ${vm.toFixed(2)} (Vin = Vout)`, labelPos: 'right' as const, color: 'var(--signal)' }] : []),
      ]}
      guides={[
        ...(voh !== undefined ? [{ axis: 'y' as const, at: voh, label: `VOH ${voh.toFixed(2)}`, color: 'var(--ok)' }] : []),
        ...(vol !== undefined && vol > 0.02 * vdd ? [{ axis: 'y' as const, at: vol, label: `VOL ${vol.toFixed(2)}`, color: 'var(--bad)' }] : []),
      ]}
    />
  );
}

/** The CMOS VTC from the square law, with every marker. */
export function CmosVtcFig({ spec, h }: { spec: InvSpec; h?: number }) {
  const curve: Array<[number, number]> = [];
  for (let k = 0; k <= 240; k++) {
    const vin = (spec.vdd * k) / 240;
    curve.push([vin, cmosVout(spec, vin)]);
  }
  const { vil, vih } = cmosVilVih(spec);
  return <VtcPlot curve={curve} vdd={spec.vdd} vil={vil} vih={vih} vm={cmosVM(spec)} vol={0} voh={spec.vdd} h={h} />;
}

/** Noise margins drawn as two stacked bars (Kang Fig 5.x): driver output levels vs receiver input thresholds. */
export function NoiseMarginFig({ voh, vol, vil, vih, vdd }: { voh: number; vol: number; vil: number; vih: number; vdd: number }) {
  const y = (v: number) => 240 - (v / vdd) * 200;
  const nmh = voh - vih, nml = vil - vol;
  return (
    <Canvas w={380} h={270} title="Noise margins: the gap between what a driver guarantees and what a receiver needs" maxWidth={440}>
      <Label x={90} y={24} text="driver output" anchor="middle" size={12} weight={700} />
      <Label x={290} y={24} text="receiver input" anchor="middle" size={12} weight={700} />
      <rect x={60} y={y(vdd)} width={60} height={y(voh) - y(vdd)} fill="var(--ok)" opacity={0.3} />
      <rect x={60} y={y(vol)} width={60} height={y(0) - y(vol)} fill="var(--bad)" opacity={0.3} />
      <rect x={260} y={y(vdd)} width={60} height={y(vih) - y(vdd)} fill="var(--pmos)" opacity={0.25} />
      <rect x={260} y={y(vil)} width={60} height={y(0) - y(vil)} fill="var(--nmos)" opacity={0.25} />
      <rect x={260} y={y(vih)} width={60} height={y(vil) - y(vih)} fill="var(--line)" opacity={0.6} />
      <Label x={290} y={(y(vih) + y(vil)) / 2 + 4} text="undefined" anchor="middle" size={11} color="var(--ink-2)" />
      {[
        { v: voh, x: 56, t: `VOH ${voh.toFixed(2)}`, a: 'end' as const },
        { v: vol, x: 56, t: `VOL ${vol.toFixed(2)}`, a: 'end' as const },
        { v: vih, x: 324, t: `VIH ${vih.toFixed(2)}`, a: 'start' as const },
        { v: vil, x: 324, t: `VIL ${vil.toFixed(2)}`, a: 'start' as const },
      ].map((m) => (
        <g key={m.t}>
          <line x1={m.a === 'end' ? 60 : 260} x2={m.a === 'end' ? 120 : 320} y1={y(m.v)} y2={y(m.v)} stroke="var(--ink)" strokeWidth={2} />
          <Label x={m.x} y={y(m.v) + 4} text={m.t} anchor={m.a} size={11} mono weight={600} />
        </g>
      ))}
      <line x1={120} x2={260} y1={y(voh)} y2={y(voh)} stroke="var(--ok)" strokeDasharray="4 4" />
      <line x1={120} x2={260} y1={y(vol)} y2={y(vol)} stroke="var(--bad)" strokeDasharray="4 4" />
      <line x1={190} x2={190} y1={y(voh)} y2={y(vih)} stroke="var(--ok)" strokeWidth={4} />
      <Label x={196} y={(y(voh) + y(vih)) / 2 + 4} text={`NMH ${nmh.toFixed(2)} V`} size={12} weight={700} color="var(--ok)" bg />
      <line x1={190} x2={190} y1={y(vil)} y2={y(vol)} stroke="var(--bad)" strokeWidth={4} />
      <Label x={196} y={(y(vil) + y(vol)) / 2 + 4} text={`NML ${nml.toFixed(2)} V`} size={12} weight={700} color="var(--bad)" bg />
    </Canvas>
  );
}

/** Input step and output response with the 50% points: τPHL and τPLH. */
export function SwitchingFig({ tphl, tplh, tr, tf, vdd = 1 }: { tphl: number; tplh: number; tr?: number; tf?: number; vdd?: number }) {
  const T = Math.max(tphl, tplh) * 8;
  const t0 = T * 0.08, t1 = T * 0.5;
  // RC-like edges whose 50% crossings sit exactly at τPHL and τPLH after the input edges.
  const tauF = tphl / Math.LN2;
  void tr;
  void tf;
  const vin: Array<[number, number]> = [[0, 0], [t0, 0], [t0, vdd], [t1, vdd], [t1, 0], [T, 0]];
  const vout: Array<[number, number]> = [];
  const vlow = vdd * Math.exp(-(t1 - t0) / tauF);
  const tauR = tplh / Math.log((2 * (vdd - vlow)) / vdd);
  for (let k = 0; k <= 400; k++) {
    const t = (T * k) / 400;
    let v = vdd;
    if (t > t0 && t <= t1) v = vdd * Math.exp(-(t - t0) / tauF);
    if (t > t1) v = vdd - (vdd - vlow) * Math.exp(-(t - t1) / tauR);
    vout.push([t, v]);
  }
  const u = T < 1e-9 ? { k: 1e12, s: 'ps' } : { k: 1e9, s: 'ns' };
  const sc = (pts: Array<[number, number]>) => pts.map(([t, v]) => [t * u.k, v] as [number, number]);
  return (
    <Plot
      title="Switching: delays measured between the 50% points"
      xRange={[0, T * u.k]}
      yRange={[0, vdd * 1.1]}
      xLabel={`time (${u.s})`}
      yLabel="V"
      h={230}
      xFmt={(v) => String(Number(v.toPrecision(2)))}
      yFmt={(v) => v.toFixed(1)}
      series={[
        { points: [[0, vdd / 2], [T * u.k, vdd / 2]], color: 'var(--muted)', width: 1, dashed: true, label: '50%', labelAt: 'end' },
        { points: sc(vin), color: 'var(--ink-2)', width: 2, label: 'Vin', labelAt: 'start' },
        { points: sc(vout), color: 'var(--signal)', width: 2.6, label: 'Vout', labelAt: 'end' },
      ]}
      guides={[
        { axis: 'x', at: (t0 + tphl) * u.k, label: `τPHL ${formatSI(tphl, 's')}`, color: 'var(--nmos)' },
        { axis: 'x', at: (t1 + tplh) * u.k, label: `τPLH ${formatSI(tplh, 's')}`, color: 'var(--pmos)' },
      ]}
    />
  );
}

/* ─── Static CMOS gates drawn from an expression ─── */

interface Box {
  w: number;
  h: number;
}
function measure(n: Net): Box {
  if (n.t === 'in') return { w: 56, h: 44 };
  const kids = n.parts.map(measure);
  if (n.t === 'ser') return { w: Math.max(...kids.map((k) => k.w)), h: kids.reduce((a, k) => a + k.h, 0) };
  return { w: kids.reduce((a, k) => a + k.w, 0), h: Math.max(...kids.map((k) => k.h)) };
}

/** Draws a series–parallel network between (x, top) and (x, top + h); returns SVG elements. */
function drawNet(n: Net, x: number, top: number, kind: 'n' | 'p', widths: Map<Net, number>, out: React.ReactNode[], key = 'k'): Box {
  const b = measure(n);
  if (n.t === 'in') {
    const cy = top + b.h / 2;
    const w = widths.get(n);
    out.push(
      <g key={key}>
        <line x1={x} x2={x} y1={top} y2={cy - 12} stroke="var(--ink)" strokeWidth={2} />
        <line x1={x} x2={x} y1={cy + 12} y2={top + b.h} stroke="var(--ink)" strokeWidth={2} />
        <rect x={x - 9} y={cy - 12} width={18} height={24} rx={4} fill={kind === 'n' ? 'var(--nmos-bg)' : 'var(--pmos-bg)'} stroke={kind === 'n' ? 'var(--nmos)' : 'var(--pmos)'} strokeWidth={2} />
        <Label x={x} y={cy + 4} text={n.name} anchor="middle" size={12} weight={700} color={kind === 'n' ? 'var(--nmos)' : 'var(--pmos)'} />
        {w !== undefined && <Label x={x + 12} y={cy - 6} text={String(Number(w.toPrecision(3)))} size={10} mono color="var(--ink-2)" />}
      </g>,
    );
    return b;
  }
  if (n.t === 'ser') {
    let y = top;
    n.parts.forEach((p, i) => {
      const kb = measure(p);
      drawNet(p, x, y, kind, widths, out, `${key}s${i}`);
      y += kb.h;
    });
    return b;
  }
  // parallel: side by side between two rails
  const kids = n.parts.map(measure);
  let left = x - b.w / 2;
  const xs: number[] = [];
  n.parts.forEach((p, i) => {
    const cx = left + kids[i].w / 2;
    xs.push(cx);
    const pad = (b.h - kids[i].h) / 2;
    if (pad > 0) {
      out.push(<line key={`${key}pa${i}`} x1={cx} x2={cx} y1={top} y2={top + pad} stroke="var(--ink)" strokeWidth={2} />);
      out.push(<line key={`${key}pb${i}`} x1={cx} x2={cx} y1={top + pad + kids[i].h} y2={top + b.h} stroke="var(--ink)" strokeWidth={2} />);
    }
    drawNet(p, cx, top + pad, kind, widths, out, `${key}p${i}`);
    left += kids[i].w;
  });
  out.push(<line key={`${key}rt`} x1={Math.min(...xs)} x2={Math.max(...xs)} y1={top} y2={top} stroke="var(--ink)" strokeWidth={2} />);
  out.push(<line key={`${key}rb`} x1={Math.min(...xs)} x2={Math.max(...xs)} y1={top + b.h} y2={top + b.h} stroke="var(--ink)" strokeWidth={2} />);
  return b;
}

function widthMap(n: Net, unit: number): Map<Net, number> {
  const sizes = sizeNetwork(n, unit);
  const leaves: Net[] = [];
  const walk = (x: Net) => (x.t === 'in' ? leaves.push(x) : x.parts.forEach(walk));
  walk(n);
  return new Map(leaves.map((l, i) => [l, sizes[i].w]));
}

/**
 * A static CMOS gate for F = NOT(expr): the pull-down network is expr (AND → series, OR → parallel),
 * the pull-up is its dual. With `sized`, each device shows its width for unit-inverter drive (µn = 2µp).
 */
export function StaticGateFig({ expr, sized = true }: { expr: string; sized?: boolean }) {
  let pdn: Net;
  try {
    pdn = parseExpr(expr);
  } catch {
    return <p className="callout bad small">Cannot read “{expr}”. Use letters, + for OR, juxtaposition for AND, and brackets.</p>;
  }
  const pun = dual(pdn);
  const bn = measure(pdn);
  const bp = measure(pun);
  const w = Math.max(bn.w, bp.w, 120) + 140;
  const cx = w / 2;
  const yTop = 40;
  const yOut = yTop + bp.h + 20;
  const h = yOut + 20 + bn.h + 40;
  const els: React.ReactNode[] = [];
  drawNet(pun, cx, yTop, 'p', sized ? widthMap(pun, 2) : new Map(), els, 'pu');
  drawNet(pdn, cx, yOut + 20, 'n', sized ? widthMap(pdn, 1) : new Map(), els, 'pd');
  return (
    <Canvas w={w} h={h} title={`Static CMOS gate: F = NOT(${expr})`} maxWidth={Math.min(560, w * 1.3)}>
      <Rail x1={cx - 40} x2={cx + 40} y={yTop - 14} label="VDD" />
      <Wire points={[[cx, yTop - 14], [cx, yTop]]} />
      {els}
      <Wire points={[[cx, yTop + bp.h], [cx, yOut + 20]]} id="out" />
      <Dot x={cx} y={yOut} id="out" />
      <Wire points={[[cx, yOut], [w - 30, yOut]]} id="out" />
      <Terminal x={w - 26} y={yOut} />
      <Label x={w - 26} y={yOut - 12} text="F" anchor="middle" weight={700} />
      <Label x={24} y={yTop + bp.h / 2} text="pull-up (dual)" size={11} color="var(--pmos)" weight={600} />
      <Label x={24} y={yOut + 20 + bn.h / 2} text="pull-down" size={11} color="var(--nmos)" weight={600} />
      <Wire points={[[cx, yOut + 20 + bn.h], [cx, yOut + 32 + bn.h]]} />
      <Ground x={cx} y={yOut + 32 + bn.h} />
    </Canvas>
  );
}

/* ─── RC ladder, logical-effort path ─── */

export function RcLadderFig({ stages, labels }: { stages: Array<{ r: number; c: number }>; labels?: { r: string; c: string } }) {
  const n = stages.length;
  const w = 90 + n * 110;
  return (
    <Canvas w={w} h={170} title="RC ladder: Elmore delay = Σ (resistance from the driver) × (capacitance at each node)" maxWidth={Math.min(640, w * 1.3)}>
      <Terminal x={30} y={60} />
      <Label x={30} y={46} text="driver" anchor="middle" size={11} />
      {stages.map((s, i) => {
        const x0 = 34 + i * 110;
        const xn = x0 + 100;
        return (
          <g key={i}>
            <Wire points={[[x0, 60], [x0 + 20, 60]]} />
            <rect x={x0 + 20} y={52} width={60} height={16} rx={3} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
            <Label x={x0 + 50} y={46} text={labels ? `${labels.r}${i + 1}` : formatSI(s.r, 'Ω')} anchor="middle" size={11} mono />
            <Wire points={[[x0 + 80, 60], [xn, 60]]} />
            <Dot x={xn} y={60} />
            <Capacitor x={xn} y1={60} y2={120} label={labels ? `${labels.c}${i + 1}` : formatSI(s.c, 'F')} />
            <Ground x={xn} y={120} />
          </g>
        );
      })}
    </Canvas>
  );
}

/** A chain of gates for logical effort, with each stage’s g, its input capacitance and its delay. */
export function EffortPathFig({ stages, caps, cout, delays }: { stages: Array<{ name: string; b?: number }>; caps?: number[]; cout: number; delays?: number[] }) {
  const n = stages.length;
  const w = 80 + n * 120 + 60;
  return (
    <Canvas w={w} h={170} title="A path of gates: equal effort per stage gives the least delay" maxWidth={Math.min(680, w * 1.3)}>
      <Terminal x={24} y={70} />
      <Label x={24} y={56} text={caps ? `Cin ${Number(caps[0].toPrecision(3))}` : 'Cin'} anchor="middle" size={11} mono />
      {stages.map((s, i) => {
        const x = 70 + i * 120;
        return (
          <g key={i}>
            <Wire points={[[i === 0 ? 28 : x - 40, 70], [x, 70]]} />
            <polygon points={`${x},${46} ${x},${94} ${x + 46},${70}`} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
            <Label x={x + 16} y={74} text={s.name} anchor="middle" size={10} weight={700} />
            {caps && i > 0 && <Label x={x - 20} y={112} text={`C ${Number(caps[i].toPrecision(3))}`} anchor="middle" size={10} mono color="var(--ink-2)" />}
            {delays && <Label x={x + 18} y={36} text={`d ${delays[i].toFixed(1)}`} anchor="middle" size={10} mono color="var(--signal)" weight={700} />}
            <Wire points={[[x + 46, 70], [x + 80, 70]]} />
            {(s.b ?? 1) > 1 && (
              <g>
                <Wire points={[[x + 64, 70], [x + 64, 130]]} />
                <Label x={x + 68} y={140} text={`×${Number((s.b! - 1).toPrecision(3))} off-path`} size={10} color="var(--muted)" />
              </g>
            )}
          </g>
        );
      })}
      <Wire points={[[70 + n * 120 - 40, 70], [70 + n * 120 - 10, 70]]} />
      <Dot x={70 + n * 120 - 10} y={70} />
      <Label x={70 + n * 120 - 6} y={56} text={`Cout ${Number(cout.toPrecision(3))}`} size={11} mono />
    </Canvas>
  );
}

/* ─── Sequencing ─── */

/** Launch FF → logic → capture FF on one clock, with tpcq, tpd, tsetup (and skew) along the cycle. */
export function FlopTimingFig({ tc, tpcq, tpd, tsetup, tskew = 0 }: { tc: number; tpcq: number; tpd: number; tsetup: number; tskew?: number }) {
  const W = 480, x0 = 40, x1 = 440;
  const sx = (t: number) => x0 + (t / (tc * 1.15)) * (x1 - x0);
  const need = tpcq + tpd + tsetup + tskew;
  const ok = need <= tc;
  const seg = (a: number, b: number, y: number, color: string, text: string) => (
    <g>
      <rect x={sx(a)} y={y - 9} width={Math.max(1, sx(b) - sx(a))} height={18} rx={4} fill={color} opacity={0.8} />
      {sx(b) - sx(a) > text.length * 6 + 8 ? (
        <Label x={(sx(a) + sx(b)) / 2} y={y + 4} text={text} anchor="middle" size={10} weight={700} color="var(--paper)" />
      ) : (
        <Label x={sx(a) - 4} y={y + 4} text={text} anchor="end" size={10} weight={700} color={color} />
      )}
    </g>
  );
  return (
    <Canvas w={W} h={210} title="One clock cycle: the data must arrive a setup time before the next edge" maxWidth={600}>
      <Label x={x0} y={24} text="clk" size={12} weight={700} />
      <polyline points={`${x0},60 ${x0},36 ${sx(tc / 2)},36 ${sx(tc / 2)},60 ${sx(tc)},60 ${sx(tc)},36 ${x1},36`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <Label x={x0 + 4} y={76} text="launch edge" size={10} color="var(--muted)" />
      <Label x={sx(tc) - 4} y={76} text="capture edge" anchor="end" size={10} color="var(--muted)" />
      {seg(0, tpcq, 100, 'var(--nmos)', 'tpcq')}
      {seg(tpcq, tpcq + tpd, 100, 'var(--signal)', 'tpd (logic)')}
      {seg(tc - tsetup, tc, 140, 'var(--pmos)', 'tsetup')}
      {tskew > 0 && seg(tc - tsetup - tskew, tc - tsetup, 172, 'var(--ink-2)', 'skew')}
      <line x1={sx(tc)} x2={sx(tc)} y1={30} y2={190} stroke="var(--muted)" strokeDasharray="4 4" />
      <Label x={sx(tc) + 4} y={200} text={`Tc ${formatSI(tc, 's')}`} size={11} mono />
      <line x1={sx(tpcq + tpd)} x2={sx(tpcq + tpd)} y1={86} y2={150} stroke={ok ? 'var(--ok)' : 'var(--bad)'} strokeWidth={2} />
      <Label x={sx(tpcq + tpd) - 4} y={165} text={ok ? `slack ${formatSI(tc - need, 's')}` : `late by ${formatSI(need - tc, 's')}`} anchor="end" size={11} weight={700} color={ok ? 'var(--ok)' : 'var(--bad)'} />
    </Canvas>
  );
}

/* ─── Circuit families ─── */

/** Footed dynamic gate: precharge pMOS, pull-down network, foot nMOS; with an optional keeper. */
export function DynamicGateFig({ keeper = false, cx }: { keeper?: boolean; cx?: boolean }) {
  const x = 170;
  return (
    <Canvas w={380} h={330} title="Dynamic (footed) gate: precharge when clk = 0, evaluate when clk = 1" maxWidth={440}>
      <Rail x1={x - 40} x2={x + 40} y={30} label="VDD" />
      <Wire points={[[x, 30], [x, 50]]} />
      <Pmos x={x} y={80} name="Mpre" id="mpre" />
      <Wire points={[[x - 30, 80], [x - 60, 80]]} />
      <Label x={x - 64} y={84} text="clk" anchor="end" size={12} weight={600} />
      <Wire points={[[x, 110], [x, 150]]} id="out" />
      <Dot x={x} y={130} id="out" />
      <Wire points={[[x, 130], [300, 130]]} id="out" />
      <Terminal x={304} y={130} />
      <Label x={304} y={118} text="Y (precharged)" anchor="middle" size={11} weight={600} />
      <rect x={x - 40} y={150} width={80} height={60} rx={8} fill="var(--nmos-bg)" stroke="var(--nmos)" strokeWidth={2} />
      <Label x={x} y={176} text="pull-down" anchor="middle" size={11} weight={700} color="var(--nmos)" />
      <Label x={x} y={192} text="network" anchor="middle" size={11} weight={700} color="var(--nmos)" />
      <Label x={x - 48} y={184} text="inputs" anchor="end" size={11} />
      {cx && (
        <g>
          <Dot x={x + 40} y={196} />
          <Capacitor x={x + 70} y1={196} y2={236} label="Cx" />
          <Wire points={[[x + 40, 196], [x + 70, 196]]} />
          <Ground x={x + 70} y={236} />
        </g>
      )}
      <Wire points={[[x, 210], [x, 240]]} />
      <Nmos x={x} y={270} name="Mfoot" id="mfoot" />
      <Wire points={[[x - 30, 270], [x - 60, 270]]} />
      <Label x={x - 64} y={274} text="clk" anchor="end" size={12} weight={600} />
      <Ground x={x} y={300} />
      <Capacitor x={260} y1={130} y2={180} label="Cout" />
      <Ground x={260} y={180} />
      {keeper && (
        <g>
          <Wire points={[[x + 40, 30], [x + 40, 60]]} />
          <Label x={x + 50} y={64} text="keeper (weak pMOS fed back from Y)" size={10} color="var(--pmos)" />
          <Wire points={[[x + 40, 60], [x + 40, 130]]} />
        </g>
      )}
    </Canvas>
  );
}

/** nMOS pass transistor, pMOS pass transistor and a transmission gate, each passing a 1. */
export function PassGateFig({ vdd, vtn, vtp }: { vdd: number; vtn: number; vtp: number }) {
  const row = (y: number, label: string, out: string, color: string) => (
    <g>
      <Terminal x={40} y={y} />
      <Label x={40} y={y - 12} text={`${vdd} V`} anchor="middle" size={11} mono />
      <Wire points={[[44, y], [150, y]]} />
      <rect x={150} y={y - 14} width={60} height={28} rx={6} fill="var(--surface)" stroke={color} strokeWidth={2} />
      <Label x={180} y={y + 4} text={label} anchor="middle" size={11} weight={700} color={color} />
      <Wire points={[[210, y], [300, y]]} />
      <Dot x={300} y={y} />
      <Label x={308} y={y + 4} text={out} size={12} mono weight={700} color={color} />
    </g>
  );
  return (
    <Canvas w={420} h={200} title="Passing a 1: an nMOS stops a threshold short; a pMOS or a transmission gate passes the full VDD" maxWidth={520}>
      {row(40, 'nMOS', `${(vdd - vtn).toFixed(2)} V (weak 1)`, 'var(--nmos)')}
      {row(100, 'pMOS', `${vdd.toFixed(2)} V (strong 1)`, 'var(--pmos)')}
      {row(160, 'TG', `${vdd.toFixed(2)} V (full swing)`, 'var(--signal)')}
      <Label x={180} y={196} text={`(a pMOS passes a weak 0: ${vtp.toFixed(2)} V)`} anchor="middle" size={10} color="var(--muted)" />
    </Canvas>
  );
}

/* ─── SRAM ─── */

/** The 6T SRAM cell: two cross-coupled inverters (pull-up P, pull-down D) and two access transistors A. */
export function SramCellFig({ q = 0, reading = false, bump }: { q?: 0 | 1; reading?: boolean; bump?: number }) {
  const xl = 170, xr = 290, yP = 80, yD = 210, yQ = 130, yQb = 160;
  const busL = xl + 30, busR = xr - 30;
  return (
    <Canvas w={460} h={320} title="6T SRAM cell: cross-coupled inverters plus two access transistors on the word line" maxWidth={560}>
      <Rail x1={xl - 20} x2={xr + 20} y={30} label="VDD" />
      <Wire points={[[xl, 30], [xl, yP - 30]]} />
      <Wire points={[[xr, 30], [xr, yP - 30]]} />
      <Pmos x={xl} y={yP} name="P1" id="p1" flip />
      <Pmos x={xr} y={yP} name="P2" id="p2" />
      <Wire points={[[xl, yP + 30], [xl, yD - 30]]} id="q" />
      <Wire points={[[xr, yP + 30], [xr, yD - 30]]} id="qb" />
      <Nmos x={xl} y={yD} name="D1" id="d1" flip />
      <Nmos x={xr} y={yD} name="D2" id="d2" />
      <Ground x={xl} y={yD + 30} />
      <Ground x={xr} y={yD + 30} />
      {/* gate buses: left inverter gates on busL, right inverter gates on busR */}
      <Wire points={[[busL, yP], [busL, yD]]} />
      <Wire points={[[busR, yP], [busR, yD]]} />
      {/* cross-coupling: Q drives the right gates, Q̄ drives the left gates (the wires cross without joining) */}
      <Dot x={xl} y={yQ} id="q" />
      <Wire points={[[xl, yQ], [busR, yQ]]} id="q" />
      <Dot x={busR} y={yQ} />
      <Dot x={xr} y={yQb} id="qb" />
      <Wire points={[[xr, yQb], [busL, yQb]]} id="qb" />
      <Dot x={busL} y={yQb} />
      <Label x={140} y={yQ - 16} text={`Q = ${q}`} anchor="middle" size={12} weight={700} color="var(--signal)" />
      <Label x={318} y={yQb - 16} text={`Q̄ = ${1 - q}`} anchor="middle" size={12} weight={700} color="var(--signal)" />
      {/* access transistors to the bitlines */}
      <Wire points={[[xl, yQ], [124, yQ]]} id="q" />
      <rect x={96} y={yQ - 12} width={28} height={24} rx={4} fill="var(--nmos-bg)" stroke="var(--nmos)" strokeWidth={2} />
      <Label x={110} y={yQ + 4} text="A1" anchor="middle" size={10} weight={700} color="var(--nmos)" />
      <Wire points={[[96, yQ], [60, yQ]]} />
      <Wire points={[[xr, yQb], [336, yQb]]} id="qb" />
      <rect x={336} y={yQb - 12} width={28} height={24} rx={4} fill="var(--nmos-bg)" stroke="var(--nmos)" strokeWidth={2} />
      <Label x={350} y={yQb + 4} text="A2" anchor="middle" size={10} weight={700} color="var(--nmos)" />
      <Wire points={[[364, yQb], [400, yQb]]} />
      <Wire points={[[60, 40], [60, 280]]} id="bl" />
      <Wire points={[[400, 40], [400, 280]]} id="blb" />
      <Label x={60} y={296} text="BL" anchor="middle" size={12} weight={700} />
      <Label x={400} y={296} text="BLB" anchor="middle" size={12} weight={700} />
      <Wire points={[[80, 268], [380, 268]]} id="wl" />
      <Wire points={[[110, 268], [110, yQ + 12]]} id="wl" />
      <Wire points={[[350, 268], [350, yQb + 12]]} id="wl" />
      <Label x={230} y={286} text="WL (word line)" anchor="middle" size={11} weight={600} />
      {reading && bump !== undefined && <Label x={230} y={312} text={`reading: the 0-node rises to ${bump.toFixed(2)} V`} anchor="middle" size={11} weight={700} color={bump < 0.3 ? 'var(--ok)' : 'var(--bad)'} />}
    </Canvas>
  );
}

export function vtcCurve(fn: (vin: number) => number, vdd: number, n = 240): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let k = 0; k <= n; k++) {
    const v = (vdd * k) / n;
    out.push([v, fn(v)]);
  }
  return out;
}
