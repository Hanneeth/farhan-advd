/**
 * Schematic engine for multi-transistor circuits (research notes: content/research.md).
 *
 * A <Schematic> wraps a Canvas and gives every transistor inside it its live state (DevState): region
 * badge, current, and a hover/tap inspector with VGS, Vov, the fence check, ID, gm and rO. Below the
 * drawing a one-line verdict says whether every device is saturated, and a chip per device lets you
 * inspect it from the keyboard. Branch currents are drawn with stackFlow() + FlowDots.
 *
 * mosState() turns node voltages into a DevState, so a figure only has to compute its node voltages
 * (with src/physics) and the region follows from the fence: NMOS VD ≥ VG − Vth, PMOS VD ≤ VG + |Vth|.
 */
import { useMemo, useState, type ReactNode } from 'react';
import { regionFromNodesPure, type NodeDevice, type Region } from '../physics';
import { formatSI } from '../practice/units';
import { Canvas, InspectContext, Label, Pill, type DevState, type DrawStyle, type InspectCtx } from './primitives';

export type { DevState };

/** Region from node voltages, using magnitudes for PMOS (the fence, from src/physics). */
export function regionFromNodes(kind: 'n' | 'p', vg: number, vs: number, vd: number, vth: number): Region {
  return regionFromNodesPure({ kind, vg, vs, vd, vth });
}

/** DevState for a device solved by src/physics/nodes.ts. */
/** A simulated device (src/physics/spice.ts) as the NodeDevice the figures draw. */
export function simNode(m: { kind: 'n' | 'p'; vg: number; vs: number; vd: number; vth: number; id: number; gm: number; rO: number }): NodeDevice {
  return { kind: m.kind, vg: m.vg, vs: m.vs, vd: m.vd, vth: m.vth, id: m.id, gm: m.gm, rO: m.rO };
}

export function fromNode(name: string, d: NodeDevice, role?: string): DevState {
  return mosState({ name, role, ...d });
}

export function mosState(o: {
  name: string;
  kind: 'n' | 'p';
  vg: number;
  vs: number;
  vd: number;
  vth: number;
  id: number;
  gm?: number;
  rO?: number;
  role?: string;
}): DevState {
  return { ...o, region: regionFromNodes(o.kind, o.vg, o.vs, o.vd, o.vth) };
}

/** Flow path down a vertical stack at x from yTop to yBot, jogging through each device's channel. */
export function stackFlow(x: number, yTop: number, yBot: number, devices: Array<{ y: number; flip?: boolean }>): Array<[number, number]> {
  const pts: Array<[number, number]> = [[x, yTop]];
  for (const d of [...devices].sort((a, b) => a.y - b.y)) {
    const cx = d.flip ? x + 8 : x - 8;
    pts.push([x, d.y - 12], [cx, d.y - 12], [cx, d.y + 12], [x, d.y + 12]);
  }
  pts.push([x, yBot]);
  return pts;
}

const V = (x: number) => formatSI(x, 'V');
const REGION_LONG: Record<Region, string> = { off: 'OFF', triode: 'TRIODE', saturation: 'SATURATED' };

function fenceText(s: DevState): string | undefined {
  if (s.vg === undefined || s.vs === undefined || s.vd === undefined || s.vth === undefined) return undefined;
  if (s.kind === 'n') {
    const lim = s.vg - s.vth;
    return `VD = ${V(s.vd)} ${s.vd >= lim - 1e-9 ? '≥' : '<'} VG − Vth = ${V(lim)}`;
  }
  const lim = s.vg + s.vth;
  return `VD = ${V(s.vd)} ${s.vd <= lim + 1e-9 ? '≤' : '>'} VG + |Vth| = ${V(lim)}`;
}

/** The detail card for one device. */
export function DeviceCard({ s }: { s: DevState }) {
  const vgs = s.vg !== undefined && s.vs !== undefined ? (s.kind === 'n' ? s.vg - s.vs : s.vs - s.vg) : undefined;
  const vds = s.vd !== undefined && s.vs !== undefined ? (s.kind === 'n' ? s.vd - s.vs : s.vs - s.vd) : undefined;
  const vov = vgs !== undefined && s.vth !== undefined ? vgs - s.vth : undefined;
  const bar = s.kind === 'n' ? '' : '|';
  const fence = fenceText(s);
  return (
    <div className={`device-card ${s.kind === 'n' ? 'nmos' : 'pmos'}`}>
      <div className="device-card-head">
        <strong>{s.name}</strong>
        <span className="muted small">{s.kind === 'n' ? 'NMOS' : 'PMOS'}{s.role ? ` · ${s.role}` : ''}</span>
        <span className={`badge ${s.region === 'saturation' ? 'ok' : 'bad'}`}>{REGION_LONG[s.region]}</span>
      </div>
      <dl className="device-card-grid mono small">
        {vgs !== undefined && (
          <>
            <dt>{bar}VGS{bar}</dt>
            <dd>{V(vgs)}</dd>
          </>
        )}
        {vov !== undefined && (
          <>
            <dt>{bar}Vov{bar}</dt>
            <dd>{V(vov)}</dd>
          </>
        )}
        {vds !== undefined && (
          <>
            <dt>{bar}VDS{bar}</dt>
            <dd>{V(vds)}</dd>
          </>
        )}
        <dt>ID</dt>
        <dd>{formatSI(s.id, 'A')}</dd>
        {s.gm !== undefined && (
          <>
            <dt>gm</dt>
            <dd>{formatSI(s.gm, 'S')}</dd>
          </>
        )}
        {s.rO !== undefined && (
          <>
            <dt>rO</dt>
            <dd>{Number.isFinite(s.rO) ? formatSI(s.rO, 'Ω') : '∞ (λ = 0)'}</dd>
          </>
        )}
      </dl>
      {fence && <p className={`small device-card-fence ${s.region === 'saturation' ? 'ok' : 'bad'}`}>Fence: {fence}</p>}
    </div>
  );
}

export function Schematic({
  w,
  h,
  title,
  states,
  children,
  highlight,
  maxWidth,
  style,
  annotate = 'full',
  inspector = true,
}: {
  w: number;
  h: number;
  title: string;
  states: Record<string, DevState>;
  children: ReactNode;
  highlight?: string[];
  maxWidth?: number;
  style?: DrawStyle;
  annotate?: InspectCtx['annotate'];
  inspector?: boolean;
}) {
  const [hover, setHover] = useState<string | undefined>();
  const ctx = useMemo<InspectCtx>(() => ({ states, hover, setHover, annotate }), [states, hover, annotate]);
  const ids = Object.keys(states);
  const bad = ids.filter((k) => states[k].region !== 'saturation');
  const shown = hover && states[hover] ? hover : undefined;
  return (
    <InspectContext.Provider value={ctx}>
      <div className="schematic" onMouseLeave={() => setHover(undefined)}>
        <Canvas w={w} h={h} title={title} highlight={[...(highlight ?? []), ...(shown ? [shown] : [])]} maxWidth={maxWidth} style={style}>
          {children}
        </Canvas>
        {inspector && ids.length > 0 && (
          <div className="schematic-inspector">
            <div className={`schematic-verdict small ${bad.length ? 'bad' : 'ok'}`} role="status">
              {bad.length === 0
                ? `All ${ids.length} transistor${ids.length > 1 ? 's' : ''} saturated ✓`
                : `${bad.map((k) => states[k].name).join(', ')} ${bad.length > 1 ? 'are' : 'is'} not saturated ✗`}
            </div>
            <div className="device-chips" aria-label="Inspect a transistor">
              {ids.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`device-chip ${states[k].kind === 'n' ? 'nmos' : 'pmos'} ${states[k].region} ${shown === k ? 'on' : ''}`}
                  onMouseEnter={() => setHover(k)}
                  onFocus={() => setHover(k)}
                  onClick={() => setHover(shown === k ? undefined : k)}
                  aria-pressed={shown === k}
                >
                  {states[k].name}
                </button>
              ))}
            </div>
            {shown ? <DeviceCard s={states[shown]} /> : <p className="small muted device-hint">Hover or tap a transistor to see its VGS, Vov, fence check, ID, gm and rO.</p>}
          </div>
        )}
      </div>
    </InspectContext.Provider>
  );
}

// ─── Voltage ladder: every node on one vertical axis (Razavi Ex 9.7 style) ──

export interface LadderNode {
  label: string;
  v: number;
  tone?: 'signal' | 'ink' | 'ok' | 'bad';
}

export interface LadderBand {
  from: number;
  to: number;
  label: string;
  kind: 'n' | 'p' | 'tail' | 'swing' | 'free' | 'bad';
}

const BAND_FILL: Record<LadderBand['kind'], string> = {
  n: 'var(--nmos-bg)',
  p: 'var(--pmos-bg)',
  tail: 'color-mix(in srgb, var(--muted) 22%, var(--surface))',
  swing: 'var(--ok-bg)',
  free: 'var(--surface-2)',
  bad: 'var(--bad-bg)',
};
const BAND_INK: Record<LadderBand['kind'], string> = {
  n: 'var(--nmos)',
  p: 'var(--pmos)',
  tail: 'var(--ink-2)',
  swing: 'var(--ok)',
  free: 'var(--muted)',
  bad: 'var(--bad)',
};

/** Spread label positions so no two are closer than `gap`, keeping them inside [lo, hi]. */
export function spreadLabels(ys: number[], gap: number, lo: number, hi: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  const out = order.map((o) => o.y);
  for (let k = 1; k < out.length; k++) out[k] = Math.max(out[k], out[k - 1] + gap);
  if (out.length && out[out.length - 1] > hi) {
    out[out.length - 1] = hi;
    for (let k = out.length - 2; k >= 0; k--) out[k] = Math.min(out[k], out[k + 1] - gap);
  }
  if (out.length && out[0] < lo) {
    out[0] = lo;
    for (let k = 1; k < out.length; k++) out[k] = Math.max(out[k], out[k - 1] + gap);
  }
  const res = new Array<number>(ys.length);
  order.forEach((o, k) => (res[o.i] = out[k]));
  return res;
}

/**
 * Vertical voltage axis with the nodes as ticks (labels on the right) and bands on the left for what
 * each device costs (|Vov|, VGS of a diode, VISS) or the swing that is left.
 */
export function VoltageLadder({ vmax, vmin = 0, nodes, bands = [], title = 'Voltage ladder', h = 340 }: { vmax: number; vmin?: number; nodes: LadderNode[]; bands?: LadderBand[]; title?: string; h?: number }) {
  const top = 22;
  const bot = h - 22;
  const sy = (v: number) => bot - ((v - vmin) / (vmax - vmin)) * (bot - top);
  const axisX = 150;
  const bandX = 22;
  const bandW = 118;
  const ly = spreadLabels(nodes.map((n) => sy(n.v)), 20, top, bot);
  const tone = (t?: LadderNode['tone']) => (t === 'signal' ? 'var(--signal)' : t === 'ok' ? 'var(--ok)' : t === 'bad' ? 'var(--bad)' : 'var(--ink)');
  return (
    <Canvas w={380} h={h} title={title} maxWidth={440}>
      {bands.map((b, i) => {
        const y1 = sy(Math.max(b.from, b.to));
        const y2 = sy(Math.min(b.from, b.to));
        const hh = Math.max(0, y2 - y1);
        return (
          <g key={i}>
            <rect x={bandX} y={y1} width={bandW} height={hh} rx={4} fill={BAND_FILL[b.kind]} stroke={BAND_INK[b.kind]} strokeWidth={1.2} />
            {hh >= 14 && <Label x={bandX + bandW / 2} y={(y1 + y2) / 2 + 4} text={b.label} anchor="middle" size={11} mono weight={600} color={BAND_INK[b.kind]} />}
          </g>
        );
      })}
      <line x1={axisX} y1={top - 6} x2={axisX} y2={bot + 6} stroke="var(--ink)" strokeWidth={2} />
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={axisX - 6} x2={axisX + 6} y1={sy(n.v)} y2={sy(n.v)} stroke={tone(n.tone)} strokeWidth={2} />
          <polyline points={`${axisX + 6},${sy(n.v)} ${axisX + 18},${ly[i]} ${axisX + 24},${ly[i]}`} fill="none" stroke="var(--line)" strokeWidth={1} />
          <Label x={axisX + 28} y={ly[i] + 4} text={n.label} size={12} weight={600} color={tone(n.tone)} />
          <Label x={372} y={ly[i] + 4} text={V(n.v)} anchor="end" size={12} mono color={tone(n.tone)} />
        </g>
      ))}
    </Canvas>
  );
}

/** A small caption pill anchored in a schematic (e.g. "+i", "2i → CL"). */
export function SignalTag({ x, y, text, anchor = 'start' }: { x: number; y: number; text: string; anchor?: 'start' | 'middle' | 'end' }) {
  return <Pill x={x} y={y} text={text} anchor={anchor} fill="var(--signal)" color="var(--signal-ink)" border="transparent" size={11} />;
}
