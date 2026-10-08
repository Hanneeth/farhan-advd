/**
 * Parametric figures for Milestone 1 (U0–U5). Each takes physical values as props and draws them live.
 * Layout rule: device names and region badges sit on one side, resistor labels on the other, and node
 * voltage tags sit on the wire side away from both, so labels never collide.
 * Current is drawn as flowing dots whose speed follows the current (`flow`, 0..1).
 */
import { formatSI } from '../practice/units';
import { idSat, idTriode, region as regionOf, solveNmosRd, type Region } from '../physics';
import {
  Canvas,
  CurrentArrow,
  Dot,
  FlowDots,
  Ground,
  Label,
  Nmos,
  Pill,
  Pmos,
  Rail,
  Resistor,
  Sym,
  Terminal,
  VoltageSource,
  VoltageTag,
  Wire,
  stroke,
} from './primitives';
import { Plot } from './Plot';

const V = (x: number) => formatSI(x, 'V');
const R = (x: number) => formatSI(x, 'Ω');
const I = (x: number) => formatSI(x, 'A');

/** Map a current to a flow strength 0..1 (100 µA ≈ 0.5). */
export function flowStrength(i: number): number {
  if (!(i > 0)) return 0;
  return Math.min(1, 0.15 + Math.log10(1 + i / 20e-6) * 0.45);
}

// ─── U0 ────────────────────────────────────────────────────────────────────

/** Water analogy: VDD is a tank's water height, a resistor is a narrow pipe, ground is sea level. */
export function WaterAnalogy({ height = 1.8, highlight }: { height?: number; highlight?: string[] }) {
  const sea = 196;
  const top = 36;
  const level = sea - Math.min(1, height / 2) * 140;
  const wave = (y: number, x0: number, x1: number) => {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1; x += 16) d += ` q4 -4 8 0 q4 4 8 0`;
    return d;
  };
  return (
    <Canvas w={440} h={240} title="Water analogy: voltage is height, current is flow, a resistor is a narrow pipe" highlight={highlight} maxWidth={560}>
      {/* height ruler */}
      <line x1={18} y1={sea} x2={18} y2={level} stroke="var(--ink-2)" strokeWidth={1.5} />
      <line x1={12} y1={level} x2={24} y2={level} stroke="var(--ink-2)" strokeWidth={1.5} />
      <line x1={12} y1={sea} x2={24} y2={sea} stroke="var(--ink-2)" strokeWidth={1.5} />
      <Pill x={28} y={level - 14} text={`${height} V`} fill="var(--ink)" color="var(--paper)" border="var(--ink)" />
      {/* tank */}
      <rect x={40} y={level} width={90} height={sea - level} fill="var(--water)" opacity={0.55} />
      <path d={wave(level, 40, 130)} fill="none" stroke="var(--water)" strokeWidth={2} />
      <path d={`M40 ${top} V${sea} H130 V${top}`} fill="none" stroke="var(--ink)" strokeWidth={2.5} strokeLinejoin="round" />
      <Label x={85} y={sea + 20} text="tank = supply (VDD)" anchor="middle" size={12} weight={600} />
      {/* pipe with a narrow section */}
      <path d={`M130 ${sea - 22} H190 V${sea - 15} H240 V${sea - 22} H300`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d={`M130 ${sea - 2} H190 V${sea - 9} H240 V${sea - 2} H300`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={130} y={sea - 21} width={60} height={18} fill="var(--water)" opacity={0.4} />
      <rect x={190} y={sea - 14} width={50} height={4} fill="var(--water)" opacity={0.6} />
      <rect x={240} y={sea - 21} width={60} height={18} fill="var(--water)" opacity={0.4} />
      <FlowDots points={[[132, sea - 12], [300, sea - 12], [312, sea + 6]]} strength={0.5} spacing={16} r={2.6} />
      <Pill x={215} y={sea - 42} text="narrow pipe = resistor" anchor="middle" mono={false} size={12} />
      <Label x={215} y={sea + 20} text="flow = current" anchor="middle" size={12} color="var(--signal)" weight={600} />
      {/* sea */}
      <rect x={300} y={sea} width={130} height={30} fill="var(--water)" opacity={0.45} rx={4} />
      <path d={wave(sea, 300, 430)} fill="none" stroke="var(--water)" strokeWidth={2} />
      <Label x={365} y={sea - 10} text="sea level = ground" anchor="middle" size={12} weight={600} />
      <Label x={365} y={sea + 20} text="0 V" anchor="middle" size={12} mono />
    </Canvas>
  );
}

/** Two resistors in series from VDD to ground with the middle node A. */
export function ResStack({ vdd, r1, r2, showValues = true, highlight }: { vdd: number; r1: number; r2: number; showValues?: boolean; highlight?: string[] }) {
  const i = vdd / (r1 + r2);
  const va = vdd - i * r1;
  return (
    <Canvas w={300} h={200} title="Two resistors in series from VDD to ground" highlight={highlight}>
      <Rail x1={110} x2={170} y={24} label={`VDD = ${V(vdd)}`} />
      <Resistor x={140} y1={24} y2={96} label={<Sym base="R" sub="1" />} value={R(r1)} id="r1" />
      <Resistor x={140} y1={96} y2={168} label={<Sym base="R" sub="2" />} value={R(r2)} id="r2" />
      <FlowDots points={[[140, 26], [140, 168]]} strength={flowStrength(i)} />
      <Dot x={140} y={96} id="nodeA" />
      <Label x={128} y={92} text="A" anchor="end" weight={700} />
      {showValues && <VoltageTag x={126} y={110} v={`VA = ${V(va)}`} anchor="end" id="nodeA" />}
      <Ground x={140} y={168} />
      {showValues && <Pill x={126} y={46} text={`I = ${I(i)}`} anchor="end" fill="var(--surface)" color="var(--signal)" />}
    </Canvas>
  );
}

/** Current I into a node with RA and RB to ground. */
export function ParallelPair({ ra, rb, i, highlight }: { ra: number; rb: number; i: number; highlight?: string[] }) {
  const ia = (i * rb) / (ra + rb);
  const ib = i - ia;
  return (
    <Canvas w={300} h={180} title="A current splitting between two parallel resistors" highlight={highlight}>
      <Wire points={[[30, 40], [210, 40]]} />
      <Terminal x={30} y={40} />
      <CurrentArrow x={70} y={40} dir="right" label={`I = ${I(i)}`} />
      <Dot x={130} y={40} />
      <Dot x={210} y={40} />
      <Resistor x={130} y1={40} y2={140} label={<Sym base="R" sub="A" />} value={R(ra)} labelSide="left" id="ra" />
      <Resistor x={210} y1={40} y2={140} label={<Sym base="R" sub="B" />} value={R(rb)} id="rb" />
      <Wire points={[[130, 140], [210, 140]]} />
      <FlowDots points={[[130, 42], [130, 138]]} strength={flowStrength(ia)} spacing={30 - 18 * (ia / i)} />
      <FlowDots points={[[210, 42], [210, 138]]} strength={flowStrength(ib)} spacing={30 - 18 * (ib / i)} />
      <Ground x={170} y={140} />
    </Canvas>
  );
}

// ─── U2: the device ────────────────────────────────────────────────────────

/** An NMOS with a VGS source on its gate and a VDS source on its drain. */
export function MosBias({ vgs, vds, region, flow = 0.4, highlight }: { vgs: number; vds: number; region?: Region; flow?: number; highlight?: string[] }) {
  const on = region ? region !== 'off' : true;
  return (
    <Canvas w={380} h={180} title="NMOS biased by a gate-source source VGS and a drain-source source VDS" highlight={highlight}>
      <Nmos x={170} y={90} name="M1" id="m1" region={region} />
      <Wire points={[[140, 90], [80, 90]]} />
      <VoltageSource x={80} y1={90} y2={150} label={`VGS = ${V(vgs)}`} />
      <Wire points={[[170, 60], [170, 30], [250, 30]]} />
      <VoltageSource x={250} y1={30} y2={150} />
      <Label x={270} y={94} text={`VDS = ${V(vds)}`} weight={600} />
      <Wire points={[[170, 120], [170, 150]]} />
      <Wire points={[[80, 150], [250, 150]]} />
      {on && <FlowDots points={[[250, 30], [170, 30], [170, 78], [162, 78], [162, 102], [170, 102], [170, 150], [250, 150]]} strength={flow} spacing={22} />}
      <Ground x={170} y={150} />
    </Canvas>
  );
}

/**
 * Cross-section with the channel drawn to scale: thickness at position x ∝ local overdrive Vov − V(x),
 * from the gradual-channel solution. In saturation the channel pinches off before the drain and the
 * electrons fall across the gap: the waterfall.
 */
export function ChannelCrossSection({ vov, vds, maxVov = 1 }: { vov: number; vds: number; maxVov?: number }) {
  const W = 440;
  const x0 = 120; // source edge
  const x1 = 320; // drain edge
  const surf = 118; // silicon surface
  const L = x1 - x0;
  const on = vov > 0;
  const vdEff = Math.min(Math.max(vds, 0), Math.max(vov, 0));
  const sat = on && vds >= vov;
  // Pinch-off point creeps toward the source as VDS grows beyond Vov (channel-length modulation, exaggerated).
  const Leff = sat ? L * (1 - 0.12 * Math.min(1, (vds - vov) / 1.0)) : L;
  const maxT = 34;
  const scale = maxT / Math.max(maxVov, 0.05);
  const pts: Array<[number, number]> = [];
  const mid: Array<[number, number]> = [];
  if (on) {
    const k = vov * vdEff - (vdEff * vdEff) / 2;
    const N = 40;
    for (let n = 0; n <= N; n++) {
      const f = n / N;
      const q = Math.sqrt(Math.max(0, vov * vov - 2 * f * k)); // = Vov − V(x)
      pts.push([x0 + f * Leff, surf + q * scale]);
      if (n % 4 === 0) mid.push([x0 + f * Leff, surf + Math.max(2, (q * scale) / 2)]);
    }
  }
  const poly = on ? [[x0, surf] as [number, number], ...pts, [x0 + Leff, surf] as [number, number]] : [];
  const reg = regionOf(vov, vds);
  // Electron path: from the source well, along the channel, then (in saturation) falling across the gap.
  const ePath: Array<[number, number]> = on ? [[x0 - 26, surf + 16], [x0 - 4, surf + Math.max(2, vov * scale * 0.5)], ...mid.slice(1)] : [];
  if (on) {
    if (sat) ePath.push([x0 + Leff + 6, surf + 10], [x1 - 2, surf + 24], [x1 + 24, surf + 18]);
    else ePath.push([x1 + 24, surf + 12]);
  }
  const current = on ? (reg === 'triode' ? idTriode(1, 1, vov, vds) : idSat(1, 1, vov)) : 0;
  const strength = on ? Math.min(1, 0.25 + current * 4) : 0;
  return (
    <Canvas w={W} h={236} title={`MOSFET cross-section: channel ${reg === 'saturation' ? 'pinched off near the drain' : reg === 'triode' ? 'continuous from source to drain' : 'absent'}`} maxWidth={580}>
      {/* substrate */}
      <rect x={40} y={surf} width={360} height={92} rx={6} fill="color-mix(in srgb, var(--muted) 16%, var(--surface))" stroke="var(--line)" strokeWidth={1.5} />
      <Label x={50} y={surf + 62} text="p-type body" size={12} color="var(--ink-2)" />
      {/* n+ wells */}
      <path d={`M60 ${surf} H${x0 + 8} V${surf + 28} Q${x0 + 8} ${surf + 42} ${x0 - 6} ${surf + 42} H60 Z`} fill="var(--nmos-bg)" stroke="var(--nmos)" strokeWidth={1.5} />
      <path d={`M${x1 - 8} ${surf} H380 V${surf + 42} H${x1 + 6} Q${x1 - 8} ${surf + 42} ${x1 - 8} ${surf + 28} Z`} fill="var(--nmos-bg)" stroke="var(--nmos)" strokeWidth={1.5} />
      <Label x={78} y={surf + 26} text="n+" size={14} color="var(--nmos)" weight={700} />
      <Label x={344} y={surf + 26} text="n+" size={14} color="var(--nmos)" weight={700} />
      {/* channel */}
      {on && <polygon points={poly.map((p) => p.join(',')).join(' ')} fill="var(--signal)" opacity={0.28} />}
      {on && <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="var(--signal)" strokeWidth={1.5} />}
      {on && <FlowDots points={ePath} strength={strength} spacing={13} color="var(--nmos)" r={2.4} />}
      {sat && (
        <>
          <line x1={x0 + Leff} y1={surf - 1} x2={x0 + Leff} y2={surf + 34} stroke="var(--bad)" strokeDasharray="3 3" strokeWidth={1.5} />
          <Pill x={x0 + Leff - 6} y={surf + 44} text="pinch-off" anchor="end" size={11} fill="var(--bad-bg)" color="var(--bad)" border="transparent" mono={false} />
        </>
      )}
      {/* oxide and gate */}
      <rect x={x0} y={surf - 10} width={L} height={10} fill="color-mix(in srgb, #e3b94f 55%, var(--surface))" />
      <rect x={x0} y={surf - 32} width={L} height={22} rx={3} fill="var(--ink-2)" />
      <Label x={220} y={surf - 16} text="gate" anchor="middle" size={13} color="var(--paper)" weight={700} />
      <Label x={x0 + L + 4} y={surf - 1} text="oxide" size={10} color="var(--ink-2)" />
      {/* terminals */}
      <Wire points={[[90, surf], [90, 44]]} />
      <Label x={90} y={36} text="S" anchor="middle" weight={700} size={15} />
      <Wire points={[[220, surf - 32], [220, 44]]} />
      <Label x={220} y={36} text="G" anchor="middle" weight={700} size={15} />
      <Wire points={[[358, surf], [358, 44]]} />
      <Label x={358} y={36} text="D" anchor="middle" weight={700} size={15} />
      <Pill x={102} y={64} text={`Vov = ${V(vov)}`} size={13} />
      <Pill x={344} y={64} text={`VDS = ${V(vds)}`} anchor="end" size={13} />
      <Pill
        x={264}
        y={surf + 70}
        text={reg === 'off' ? 'no channel: OFF' : reg === 'triode' ? 'channel reaches the drain: TRIODE' : 'pinched off: SATURATION'}
        anchor="middle"
        mono={false}
        size={13}
        fill={reg === 'saturation' ? 'var(--ok-bg)' : 'var(--bad-bg)'}
        color={reg === 'saturation' ? 'var(--ok)' : 'var(--bad)'}
        border="transparent"
        weight={700}
      />
    </Canvas>
  );
}

/** ID–VDS family for several overdrives, with the pinch-off locus VDS = Vov and a live operating point. */
export function IdVdsFamily({ kp, wl, lambda = 0, vovs, op, vdsMax = 1.5 }: { kp: number; wl: number; lambda?: number; vovs: number[]; op?: { vov: number; vds: number }; vdsMax?: number }) {
  const N = 60;
  const isOp = (vov: number) => !!op && Math.abs(op.vov - vov) < 1e-9;
  const series = vovs.map((vov) => {
    const pts: Array<[number, number]> = [];
    for (let n = 0; n <= N; n++) {
      const vds = (n / N) * vdsMax;
      const id = vds < vov ? idTriode(kp, wl, vov, vds) : idSat(kp, wl, vov, lambda, vds);
      pts.push([vds, id * 1e6]);
    }
    return { points: pts, color: isOp(vov) ? 'var(--signal)' : 'var(--nmos)', width: isOp(vov) ? 3 : 1.6, label: `Vov ${vov.toFixed(2)}`, fill: isOp(vov), opacity: isOp(vov) ? 1 : 0.55 };
  });
  const vmax = Math.max(...vovs, op?.vov ?? 0);
  const idMax = idSat(kp, wl, vmax, lambda, vdsMax) * 1e6 * 1.12;
  const locus: Array<[number, number]> = [];
  for (let n = 0; n <= N; n++) {
    const v = (n / N) * Math.min(vdsMax, vmax * 1.05);
    locus.push([v, idSat(kp, wl, v, lambda, v) * 1e6]);
  }
  series.push({ points: locus, color: 'var(--bad)', width: 1.4, dashed: true, label: '' } as never);
  const markers = op
    ? [
        {
          x: op.vds,
          y: (op.vds < op.vov ? idTriode(kp, wl, op.vov, op.vds) : idSat(kp, wl, op.vov, lambda, op.vds)) * 1e6,
          label: 'Q',
          labelPos: 'above' as const,
        },
      ]
    : [];
  return (
    <Plot
      title="ID versus VDS for several overdrives"
      xRange={[0, vdsMax]}
      yRange={[0, idMax]}
      xLabel="VDS (V)"
      yLabel="ID (µA)"
      series={series}
      markers={markers}
      xFmt={(v) => v.toFixed(1)}
      yFmt={(v) => (v >= 100 ? v.toFixed(0) : v.toPrecision(2))}
    >
      {(sx, sy) => {
        const lx = Math.min(vdsMax, vmax * 1.05) * 0.55;
        return <Label x={sx(lx) - 6} y={sy(idSat(kp, wl, lx, lambda, lx) * 1e6) - 8} text="VDS = Vov" anchor="end" size={11} color="var(--bad)" bg weight={600} />;
      }}
    </Plot>
  );
}

// ─── U3 / U5: bias circuits ────────────────────────────────────────────────

export function NmosRd({
  vdd,
  vg,
  rd,
  vd,
  showVin,
  labelOnly,
  region,
  current,
  flow = 0.45,
  highlight,
}: {
  vdd: number;
  vg?: number;
  rd?: number;
  vd?: number;
  showVin?: boolean;
  labelOnly?: boolean;
  region?: Region;
  current?: string;
  flow?: number;
  highlight?: string[];
}) {
  const gateLabel = labelOnly || vg === undefined ? 'VG' : `VG = ${V(vg)}`;
  return (
    <Canvas w={330} h={196} title="NMOS common-source stage with drain resistor RD" highlight={highlight}>
      <Rail x1={140} x2={200} y={24} label={`VDD = ${V(vdd)}`} />
      <Resistor x={170} y1={24} y2={84} label={<Sym base="R" sub="D" />} value={labelOnly || rd === undefined ? undefined : R(rd)} id="rd" labelSide="left" />
      <Nmos x={170} y={114} name="M1" id="m1" region={region} current={current} />
      <Wire points={[[140, 114], [100, 114]]} id="gate" />
      <Terminal x={100} y={114} />
      <Label x={92} y={118} text={showVin ? `${gateLabel} + vin` : gateLabel} anchor="end" weight={600} />
      <Wire points={[[170, 144], [170, 152]]} />
      <Ground x={170} y={152} />
      <Wire points={[[170, 84], [256, 84]]} id="vd" />
      <Terminal x={256} y={84} />
      <Label x={264} y={88} text={showVin ? 'vout' : 'VD'} weight={600} />
      {region !== 'off' && <FlowDots points={[[170, 26], [170, 102], [162, 102], [162, 126], [170, 126], [170, 152]]} strength={flow} />}
      <Dot x={170} y={84} id="vd" />
      {vd !== undefined && <VoltageTag x={212} y={68} v={V(vd)} anchor="middle" id="vd" />}
    </Canvas>
  );
}

export function PmosRd({ vdd, vg, rd, vd, labelOnly, region, current, flow = 0.45, highlight }: { vdd: number; vg?: number; rd?: number; vd?: number; labelOnly?: boolean; region?: Region; current?: string; flow?: number; highlight?: string[] }) {
  const gateLabel = labelOnly || vg === undefined ? 'VG' : `VG = ${V(vg)}`;
  return (
    <Canvas w={330} h={196} title="PMOS with its source at VDD and RD from drain to ground" highlight={highlight}>
      <Rail x1={140} x2={200} y={24} label={`VDD = ${V(vdd)}`} />
      <Pmos x={170} y={54} name="M1" id="m1" region={region} current={current} />
      <Wire points={[[140, 54], [100, 54]]} />
      <Terminal x={100} y={54} />
      <Label x={92} y={58} text={gateLabel} anchor="end" weight={600} />
      <Wire points={[[170, 84], [256, 84]]} id="vd" />
      <Terminal x={256} y={84} />
      <Label x={264} y={88} text="VD" weight={600} />
      <Resistor x={170} y1={84} y2={152} label={<Sym base="R" sub="D" />} value={labelOnly || rd === undefined ? undefined : R(rd)} id="rd" labelSide="left" />
      {region !== 'off' && <FlowDots points={[[170, 26], [170, 42], [162, 42], [162, 66], [170, 66], [170, 152]]} strength={flow} />}
      <Dot x={170} y={84} id="vd" />
      {vd !== undefined && <VoltageTag x={214} y={102} v={V(vd)} anchor="middle" id="vd" />}
      <Ground x={170} y={152} />
    </Canvas>
  );
}

/** Dependent current source (diamond) between (x,y1) top and (x,y2) bottom, arrow down. */
function DependentSource({ x, y1, y2, label, id }: { x: number; y1: number; y2: number; label: string; id?: string }) {
  const mid = (y1 + y2) / 2;
  const r = 15;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - r} {...stroke(false)} />
      <polygon points={`${x},${mid - r} ${x + r},${mid} ${x},${mid + r} ${x - r},${mid}`} fill="var(--signal-bg)" stroke="var(--signal)" strokeWidth={2.2} strokeLinejoin="round" data-id={id} />
      <line x1={x} y1={mid - 7} x2={x} y2={mid + 5} stroke="var(--signal)" strokeWidth={2} />
      <polyline points={`${x - 4},${mid + 1} ${x},${mid + 7} ${x + 4},${mid + 1}`} fill="none" stroke="var(--signal)" strokeWidth={2} />
      <line x1={x} y1={mid + r} x2={x} y2={y2} {...stroke(false)} />
      <Label x={x - r - 6} y={mid + 4} text={label} anchor="end" mono size={12} color="var(--signal)" weight={700} />
    </g>
  );
}

/** The saturated MOSFET's small-signal model: open gate, gm·vgs ‖ rO. */
export function SmallSignalModel({ highlight }: { highlight?: string[] }) {
  return (
    <Canvas w={330} h={176} title="Small-signal model: the gate draws no current; drain current gm·vgs in parallel with rO" highlight={highlight}>
      <Terminal x={40} y={50} />
      <Label x={40} y={38} text="G" anchor="middle" weight={700} />
      <Label x={36} y={72} text="+" size={14} weight={600} />
      <Label x={48} y={96} text="vgs" mono size={12} weight={600} />
      <Label x={36} y={120} text="−" size={14} weight={600} />
      <Wire points={[[40, 134], [270, 134]]} />
      <Terminal x={40} y={134} />
      <Label x={40} y={156} text="S" anchor="middle" weight={700} />
      <Pill x={62} y={50} text="open: no gate current" mono={false} size={11} />
      <Wire points={[[180, 30], [300, 30]]} />
      <Terminal x={300} y={30} />
      <Label x={300} y={18} text="D" anchor="middle" weight={700} />
      <DependentSource x={180} y1={30} y2={134} label="gm·vgs" id="gm" />
      <Resistor x={270} y1={30} y2={134} label={<Sym base="r" sub="O" />} id="ro" />
      <Dot x={180} y={134} />
      <Dot x={270} y={134} />
      <Dot x={270} y={30} />
    </Canvas>
  );
}

/** Small-signal equivalent of the CS stage: gm·vin into RD ‖ rO. */
export function CsSmallSignal({ highlight }: { highlight?: string[] }) {
  return (
    <Canvas w={350} h={176} title="Small-signal CS stage: gm·vin flows into RD in parallel with rO" highlight={highlight}>
      <Terminal x={30} y={60} />
      <Label x={30} y={46} text="vin" anchor="middle" mono weight={600} />
      <Wire points={[[30, 60], [60, 60]]} />
      <Label x={66} y={64} text="(gate: open)" size={11} color="var(--ink-2)" />
      <Wire points={[[160, 30], [310, 30]]} id="vout" />
      <Terminal x={310} y={30} />
      <Label x={310} y={16} text="vout" anchor="middle" mono weight={600} />
      <DependentSource x={160} y1={30} y2={130} label="gm·vin" id="gm" />
      <Resistor x={225} y1={30} y2={130} label={<Sym base="r" sub="O" />} id="ro" />
      <Resistor x={290} y1={30} y2={130} label={<Sym base="R" sub="D" />} id="rd" />
      <Wire points={[[160, 130], [290, 130]]} />
      <Ground x={225} y={130} />
      <Dot x={225} y={30} />
      <Dot x={225} y={130} />
      <Label x={235} y={166} text="VDD and ground are both AC ground" anchor="middle" size={11} color="var(--ink-2)" />
    </Canvas>
  );
}

/** CS transfer curve Vout(Vin) with off / saturation / triode regions, a Q point and its tangent. */
export function TransferCurve({ vdd, vth, kp, wl, rd, vinQ }: { vdd: number; vth: number; kp: number; wl: number; rd: number; vinQ: number }) {
  const vout = (vin: number) => solveNmosRd({ vdd, vg: vin, vth, kp, wl, rd }).vd;
  const vinMax = Math.min(vdd, vth + 1.2);
  const N = 120;
  const pts: Array<[number, number]> = [];
  for (let n = 0; n <= N; n++) {
    const vin = (n / N) * vinMax;
    pts.push([vin, vout(vin)]);
  }
  // Edge of triode: first vin where Vout = Vin − Vth.
  let vinEdge = vinMax;
  for (let n = 0; n <= 2000; n++) {
    const vin = vth + (n / 2000) * (vinMax - vth);
    if (vout(vin) <= vin - vth + 1e-6) {
      vinEdge = vin;
      break;
    }
  }
  const vq = vout(vinQ);
  const h = 1e-4;
  const slope = (vout(vinQ + h) - vout(vinQ - h)) / (2 * h);
  const tangent: Array<[number, number]> = [
    [vinQ - 0.12, vq - 0.12 * slope],
    [vinQ + 0.12, vq + 0.12 * slope],
  ];
  const inSat = vinQ > vth && vinQ < vinEdge;
  return (
    <Plot
      title="Common-source transfer curve"
      xRange={[0, vinMax]}
      yRange={[0, vdd * 1.05]}
      xLabel="Vin (V)"
      yLabel="Vout (V)"
      xFmt={(v) => v.toFixed(1)}
      yFmt={(v) => v.toFixed(1)}
      shades={[
        { x0: 0, x1: vth, color: 'var(--muted)', label: 'OFF', labelAt: 'bottom' },
        { x0: vth, x1: vinEdge, color: 'var(--ok)', label: 'SAT', labelAt: 'bottom' },
        { x0: vinEdge, x1: vinMax, color: 'var(--bad)', label: 'TRI', labelAt: 'top' },
      ]}
      series={[
        { points: pts, color: 'var(--ink)', width: 2.6 },
        { points: tangent, color: 'var(--signal)', width: 2.4, dashed: true },
      ]}
      markers={[{ x: vinQ, y: vq, label: inSat ? `slope = ${slope.toFixed(1)}` : 'Q', labelPos: 'right' }]}
    />
  );
}
