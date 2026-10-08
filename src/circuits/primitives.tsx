/**
 * SVG circuit primitives. Coordinates are SVG user units on a 12-unit grid.
 * Two drawing styles (DrawStyleContext): 'symbol' (proper transistor symbols, the default) and 'box'
 * (the simplified coloured boxes from the conversation: NMOS purple, PMOS teal, passives gray).
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Region } from '../physics';
import { formatSI } from '../practice/units';

export type DrawStyle = 'symbol' | 'box';
export const DrawStyleContext = createContext<DrawStyle>('symbol');
/** Ids of elements to emphasise (signal path, the device a step talks about). */
export const HighlightContext = createContext<ReadonlySet<string>>(new Set());

/** Live state of one transistor, shown by the schematic inspector (see schematic.tsx). */
export interface DevState {
  name: string;
  kind: 'n' | 'p';
  /** Step B role: "input (CS)", "cascode", "current source", "diode", "mirror copy", … */
  role?: string;
  region: Region;
  /** Drain current (magnitude), A. */
  id: number;
  vg?: number;
  vs?: number;
  vd?: number;
  vth?: number;
  gm?: number;
  rO?: number;
}

export interface InspectCtx {
  states: Record<string, DevState>;
  hover?: string;
  setHover: (id?: string) => void;
  /** 'full' = name + region + current; 'region' = name + region; 'name' = name only. */
  annotate: 'full' | 'region' | 'name';
}
/** Provided by <Schematic>: devices read their live state from here and report hover/focus. */
export const InspectContext = createContext<InspectCtx | null>(null);

const INK = 'var(--ink)';
const HL = 'var(--signal)';
const W = 2; // wire weight
const W_HL = 3.5;

function useHL(id?: string): boolean {
  const set = useContext(HighlightContext);
  return !!id && set.has(id);
}

export function stroke(hl: boolean, base = INK) {
  return { stroke: hl ? HL : base, strokeWidth: hl ? W_HL : W };
}

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduce(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return reduce;
}

// ─── Wires, nodes, rails ───────────────────────────────────────────────────

export function Wire({ points, id, dashed }: { points: Array<[number, number]>; id?: string; dashed?: boolean }) {
  const hl = useHL(id);
  return (
    <polyline
      points={points.map((p) => p.join(',')).join(' ')}
      fill="none"
      {...stroke(hl)}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={dashed ? '4 4' : undefined}
    />
  );
}

function polyLength(pts: Array<[number, number]>): number {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

function pointAt(pts: Array<[number, number]>, t: number): [number, number] {
  const L = polyLength(pts);
  let d = t * L;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= seg || i === pts.length - 1) {
      const f = seg === 0 ? 0 : Math.min(1, d / seg);
      return [pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])];
    }
    d -= seg;
  }
  return pts[pts.length - 1];
}

/**
 * Current made visible: dots flowing along a path. `strength` 0..1 sets speed (bigger current, faster flow);
 * `spacing` sets how dense the dots are. With reduced motion the dots are drawn standing still.
 */
export function FlowDots({
  points,
  strength = 0.5,
  spacing = 20,
  color = HL,
  r = 2.8,
}: {
  points: Array<[number, number]>;
  strength?: number;
  spacing?: number;
  color?: string;
  r?: number;
}) {
  const reduce = useReducedMotion();
  if (!(strength > 0) || points.length < 2) return null;
  const L = polyLength(points);
  const n = Math.max(2, Math.round(L / spacing));
  const speed = 18 + 90 * Math.min(1, strength); // px per second
  const dur = L / speed;
  const d = 'M' + points.map((p) => p.join(',')).join(' L');
  return (
    <g aria-hidden="true" className="flow">
      {Array.from({ length: n }, (_, i) => {
        if (reduce) {
          const [x, y] = pointAt(points, (i + 0.5) / n);
          return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={0.9} />;
        }
        return (
          <circle key={i} r={r} fill={color} opacity={0.9}>
            <animateMotion dur={`${dur.toFixed(2)}s`} repeatCount="indefinite" begin={`${(-(i / n) * dur).toFixed(2)}s`} path={d} />
          </circle>
        );
      })}
    </g>
  );
}

export function Dot({ x, y, id }: { x: number; y: number; id?: string }) {
  const hl = useHL(id);
  return <circle cx={x} cy={y} r={hl ? 5 : 3.8} fill={hl ? HL : INK} stroke="var(--bench)" strokeWidth={1.5} />;
}

/** Open terminal (input/output pin). */
export function Terminal({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4.5} fill="var(--surface)" stroke={INK} strokeWidth={2} />;
}

/** Rough width of a text run, for sizing pills. */
function textWidth(t: string, size: number, mono: boolean): number {
  return t.length * size * (mono ? 0.6 : 0.56);
}

/** A rounded label pill. */
export function Pill({
  x,
  y,
  text,
  anchor = 'start',
  fill = 'var(--surface)',
  color = INK,
  border = 'var(--line)',
  size = 12,
  mono = true,
  weight = 600,
}: {
  x: number;
  y: number;
  text: string;
  anchor?: 'start' | 'middle' | 'end';
  fill?: string;
  color?: string;
  border?: string;
  size?: number;
  mono?: boolean;
  weight?: number;
}) {
  const w = textWidth(text, size, mono) + 12;
  const h = size + 8;
  const left = anchor === 'start' ? x : anchor === 'middle' ? x - w / 2 : x - w;
  return (
    <g>
      <rect x={left} y={y - h / 2} width={w} height={h} rx={h / 2} fill={fill} stroke={border} strokeWidth={1} />
      <Label x={left + w / 2} y={y + size * 0.36} text={text} anchor="middle" size={size} mono={mono} color={color} weight={weight} />
    </g>
  );
}

export function Rail({ x1, x2, y, label, labelSide = 'right' }: { x1: number; x2: number; y: number; label?: string; labelSide?: 'left' | 'right' }) {
  return (
    <g>
      <line x1={x1} x2={x2} y1={y} y2={y} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {label && <Pill x={labelSide === 'right' ? x2 + 8 : x1 - 8} y={y} text={label} anchor={labelSide === 'right' ? 'start' : 'end'} fill={INK} color="var(--paper)" border={INK} />}
    </g>
  );
}

export function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={INK} strokeWidth={2} strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + 6} />
      <line x1={x - 11} y1={y + 6} x2={x + 11} y2={y + 6} />
      <line x1={x - 7} y1={y + 10.5} x2={x + 7} y2={y + 10.5} />
      <line x1={x - 3} y1={y + 15} x2={x + 3} y2={y + 15} />
    </g>
  );
}

// ─── Labels ────────────────────────────────────────────────────────────────

export function Label({
  x,
  y,
  text,
  anchor = 'start',
  color = INK,
  size = 13,
  weight = 400,
  mono = false,
  bg = false,
}: {
  x: number;
  y: number;
  text: ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  color?: string;
  size?: number;
  weight?: number;
  mono?: boolean;
  bg?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={color}
      fontSize={size}
      fontWeight={weight}
      fontFamily={mono ? 'var(--font-mono)' : 'var(--font-sans)'}
      paintOrder={bg ? 'stroke' : undefined}
      stroke={bg ? 'var(--bench)' : undefined}
      strokeWidth={bg ? 4 : undefined}
      strokeLinejoin="round"
    >
      {text}
    </text>
  );
}

/** Subscripted symbol like V_{DD} as SVG tspans: sym("V","DD"). */
export function Sym({ base, sub }: { base: string; sub?: string }) {
  return (
    <>
      {base}
      {sub && (
        <tspan baselineShift="sub" fontSize="0.75em">
          {sub}
        </tspan>
      )}
    </>
  );
}

/** A live node voltage tag as a pill, e.g. "0.90 V". */
export function VoltageTag({ x, y, v, anchor = 'start', id }: { x: number; y: number; v: string; anchor?: 'start' | 'middle' | 'end'; id?: string }) {
  const hl = useHL(id);
  return <Pill x={x} y={y} text={v} anchor={anchor} fill={hl ? HL : 'var(--signal-bg)'} color={hl ? 'var(--signal-ink)' : 'var(--signal)'} border="transparent" />;
}

// ─── Passives ──────────────────────────────────────────────────────────────

/** Vertical resistor between (x,y1) and (x,y2); zigzag in the middle. */
export function Resistor({ x, y1, y2, label, value, id, labelSide = 'right' }: { x: number; y1: number; y2: number; label?: ReactNode; value?: string; id?: string; labelSide?: 'left' | 'right' }) {
  const style = useContext(DrawStyleContext);
  const hl = useHL(id);
  const mid = (y1 + y2) / 2;
  const h = Math.min(36, Math.abs(y2 - y1) - 8);
  const top = mid - h / 2;
  const bottom = mid + h / 2;
  const tx = labelSide === 'right' ? x + 14 : x - 14;
  const anchor = labelSide === 'right' ? 'start' : 'end';
  let body: ReactNode;
  if (style === 'box') {
    body = <rect x={x - 7} y={top} width={14} height={h} rx={3} fill="color-mix(in srgb, var(--muted) 18%, var(--surface))" {...stroke(hl, 'var(--muted)')} />;
  } else {
    const n = 6;
    const seg = h / n;
    const pts: Array<[number, number]> = [[x, top]];
    for (let i = 0; i < n; i++) pts.push([x + (i % 2 === 0 ? 7.5 : -7.5), top + seg * (i + 0.5)]);
    pts.push([x, bottom]);
    body = <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" {...stroke(hl)} strokeLinejoin="round" strokeLinecap="round" />;
  }
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={top} {...stroke(hl)} />
      {body}
      <line x1={x} y1={bottom} x2={x} y2={y2} {...stroke(hl)} />
      {label && <Label x={tx} y={mid - (value ? 7 : -4)} text={label} anchor={anchor} weight={600} />}
      {value && <Label x={tx} y={mid + 15} text={value} anchor={anchor} mono size={12} color="var(--ink-2)" />}
    </g>
  );
}

/** Horizontal resistor between (x1,y) and (x2,y). */
export function ResistorH({ x1, x2, y, label, id }: { x1: number; x2: number; y: number; label?: ReactNode; id?: string }) {
  const hl = useHL(id);
  const mid = (x1 + x2) / 2;
  const w = Math.min(36, Math.abs(x2 - x1) - 8);
  const l = mid - w / 2;
  const n = 6;
  const pts: Array<[number, number]> = [[l, y]];
  for (let i = 0; i < n; i++) pts.push([l + (w / n) * (i + 0.5), y + (i % 2 === 0 ? -7 : 7)]);
  pts.push([l + w, y]);
  return (
    <g>
      <line x1={x1} y1={y} x2={l} y2={y} {...stroke(hl)} />
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" {...stroke(hl)} />
      <line x1={l + w} y1={y} x2={x2} y2={y} {...stroke(hl)} />
      {label && <Label x={mid} y={y - 12} text={label} anchor="middle" />}
    </g>
  );
}

export function Capacitor({ x, y1, y2, label, id }: { x: number; y1: number; y2: number; label?: ReactNode; id?: string }) {
  const hl = useHL(id);
  const mid = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - 4} {...stroke(hl)} />
      <line x1={x - 12} y1={mid - 4} x2={x + 12} y2={mid - 4} stroke={hl ? HL : INK} strokeWidth={3} />
      <line x1={x - 12} y1={mid + 4} x2={x + 12} y2={mid + 4} stroke={hl ? HL : INK} strokeWidth={3} />
      <line x1={x} y1={mid + 4} x2={x} y2={y2} {...stroke(hl)} />
      {label && <Label x={x + 16} y={mid + 4} text={label} />}
    </g>
  );
}

/** Current source (circle with arrow) between (x,y1) top and (x,y2) bottom; arrow points down by default. */
export function CurrentSource({ x, y1, y2, label, value, id, up = false, labelSide = 'right' }: { x: number; y1: number; y2: number; label?: ReactNode; value?: string; id?: string; up?: boolean; labelSide?: 'left' | 'right' }) {
  const hl = useHL(id);
  const mid = (y1 + y2) / 2;
  const r = 13;
  const tx = labelSide === 'right' ? x + r + 6 : x - r - 6;
  const anchor = labelSide === 'right' ? 'start' : 'end';
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - r} {...stroke(hl)} />
      <circle cx={x} cy={mid} r={r} fill="var(--surface)" {...stroke(hl)} />
      <line x1={x} y1={mid + (up ? 7 : -7)} x2={x} y2={mid + (up ? -7 : 7)} {...stroke(hl)} />
      <polyline points={up ? `${x - 4},${mid - 3} ${x},${mid - 8} ${x + 4},${mid - 3}` : `${x - 4},${mid + 3} ${x},${mid + 8} ${x + 4},${mid + 3}`} fill="none" {...stroke(hl)} />
      <line x1={x} y1={mid + r} x2={x} y2={y2} {...stroke(hl)} />
      {label && <Label x={tx} y={mid - (value ? 6 : -4)} text={label} anchor={anchor} />}
      {value && <Label x={tx} y={mid + 16} text={value} anchor={anchor} mono size={12} color="var(--ink-2)" />}
    </g>
  );
}

/** Voltage source (circle with + and −) between (x,y1) top (+) and (x,y2) bottom (−). */
export function VoltageSource({ x, y1, y2, label }: { x: number; y1: number; y2: number; label?: ReactNode }) {
  const mid = (y1 + y2) / 2;
  const r = 13;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={mid - r} stroke={INK} strokeWidth={W} />
      <circle cx={x} cy={mid} r={r} fill="var(--surface)" stroke={INK} strokeWidth={W} />
      <Label x={x} y={mid - 3} text="+" anchor="middle" size={10} weight={600} />
      <Label x={x} y={mid + 11} text="−" anchor="middle" size={10} weight={600} />
      <line x1={x} y1={mid + r} x2={x} y2={y2} stroke={INK} strokeWidth={W} />
      {label && <Label x={x - r - 6} y={mid + 4} text={label} anchor="end" />}
    </g>
  );
}

/** Arrow showing a current along a vertical or horizontal wire, with an optional label. */
export function CurrentArrow({ x, y, dir = 'down', label, color = HL }: { x: number; y: number; dir?: 'down' | 'up' | 'left' | 'right'; label?: ReactNode; color?: string }) {
  const rot = { down: 0, up: 180, left: 90, right: -90 }[dir];
  return (
    <g>
      <g transform={`translate(${x},${y}) rotate(${rot})`}>
        <polygon points="-6,-5 6,-5 0,6" fill={color} />
      </g>
      {label && (
        <Label x={dir === 'left' || dir === 'right' ? x : x + 10} y={dir === 'left' || dir === 'right' ? y - 11 : y + 4} text={label} anchor={dir === 'left' || dir === 'right' ? 'middle' : 'start'} color={color} size={12} mono weight={600} />
      )}
    </g>
  );
}

// ─── Transistors ───────────────────────────────────────────────────────────

export interface MosProps {
  /** Centre of the device. Gate lead ends at (x−30, y); drain/source leads end at (x, y∓30). */
  x: number;
  y: number;
  name?: string;
  id?: string;
  /** Gate on the right instead of the left. */
  flip?: boolean;
  region?: Region;
  current?: string;
  /** Diode connection: draw the gate tied to the drain. */
  diode?: boolean;
}

export const REGION_TEXT: Record<Region, string> = { off: 'OFF', triode: 'TRI', saturation: 'SAT' };

export function RegionBadge({ x, y, region, anchor = 'start' }: { x: number; y: number; region: Region; anchor?: 'start' | 'end' }) {
  const ok = region === 'saturation';
  return (
    <Pill
      x={x}
      y={y - 3}
      text={REGION_TEXT[region]}
      anchor={anchor}
      size={10}
      fill={ok ? 'var(--ok-bg)' : 'var(--bad-bg)'}
      color={ok ? 'var(--ok)' : 'var(--bad)'}
      border="transparent"
      weight={700}
    />
  );
}

function MosBody({ x, y, kind, hl, flip }: { x: number; y: number; kind: 'n' | 'p'; hl: boolean; flip?: boolean }) {
  const style = useContext(DrawStyleContext);
  const color = kind === 'n' ? 'var(--nmos)' : 'var(--pmos)';
  const tint = kind === 'n' ? 'var(--nmos-bg)' : 'var(--pmos-bg)';
  const s = flip ? -1 : 1;
  const X = (dx: number) => x + s * dx;
  if (style === 'box') {
    return (
      <g>
        <line x1={X(-30)} y1={y} x2={X(-14)} y2={y} {...stroke(hl)} />
        <rect x={Math.min(X(-14), X(4))} y={y - 18} width={18} height={36} rx={4} fill={tint} stroke={hl ? HL : color} strokeWidth={hl ? 3 : 2} />
        <Label x={X(-5)} y={y + 4} text={kind === 'n' ? 'N' : 'P'} anchor="middle" size={12} weight={700} color={color} />
        <line x1={X(0)} y1={y - 18} x2={X(0)} y2={y - 30} {...stroke(hl)} />
        <line x1={X(0)} y1={y + 18} x2={X(0)} y2={y + 30} {...stroke(hl)} />
      </g>
    );
  }
  const ch = { stroke: hl ? HL : color, strokeWidth: hl ? 4.5 : 4, strokeLinecap: 'round' as const };
  // Arrow on the source leg: NMOS points out of the channel (source at bottom), PMOS points in (source at top).
  const srcY = kind === 'n' ? y + 12 : y - 12;
  const arrow = kind === 'n' ? `${X(-1)},${srcY - 4.5} ${X(-1)},${srcY + 4.5} ${X(5)},${srcY}` : `${X(-1)},${srcY - 4.5} ${X(-1)},${srcY + 4.5} ${X(-7)},${srcY}`;
  return (
    <g>
      {/* tinted plate so the device reads at a glance */}
      <rect x={Math.min(X(-18), X(6))} y={y - 22} width={24} height={44} rx={7} fill={tint} opacity={0.9} />
      <line x1={X(-30)} y1={y} x2={X(-14)} y2={y} {...stroke(hl)} />
      <line x1={X(-14)} y1={y - 12} x2={X(-14)} y2={y + 12} {...stroke(hl)} strokeWidth={hl ? 3.5 : 2.6} strokeLinecap="round" />
      <line x1={X(-8)} y1={y - 17} x2={X(-8)} y2={y + 17} {...ch} />
      <polyline points={`${X(-8)},${y - 12} ${X(0)},${y - 12} ${X(0)},${y - 30}`} fill="none" {...stroke(hl)} strokeLinejoin="round" />
      <polyline points={`${X(-8)},${y + 12} ${X(0)},${y + 12} ${X(0)},${y + 30}`} fill="none" {...stroke(hl)} strokeLinejoin="round" />
      <polygon points={arrow} fill={hl ? HL : color} />
    </g>
  );
}

function MosAnnotations({ x, y, name, flip, region, current, kind }: MosProps & { kind: 'n' | 'p' }) {
  const color = kind === 'n' ? 'var(--nmos)' : 'var(--pmos)';
  const s = flip ? -1 : 1;
  const tx = x + s * 12;
  const anchor = flip ? 'end' : 'start';
  return (
    <g>
      {name && <Label x={tx} y={y - 4} text={name} anchor={anchor} color={color} weight={700} size={14} bg />}
      {region && <RegionBadge x={tx} y={y + 17} region={region} anchor={anchor} />}
      {current && <Label x={region ? tx + s * 40 : tx} y={y + 18} text={current} anchor={anchor} mono size={11} color="var(--ink-2)" bg weight={600} />}
    </g>
  );
}

/** Fill region/current from the schematic's live state and make the device hoverable/focusable. */
function useInspect(p: MosProps): { props: MosProps; handlers: React.SVGProps<SVGGElement> } {
  const ctx = useContext(InspectContext);
  const st = ctx && p.id ? ctx.states[p.id] : undefined;
  if (!ctx || !st || !p.id) return { props: p, handlers: {} };
  const id = p.id;
  const region = ctx.annotate === 'name' ? undefined : (p.region ?? st.region);
  const current = ctx.annotate === 'full' ? (p.current ?? (st.id > 0 ? formatSI(st.id, 'A') : undefined)) : undefined;
  return {
    props: { ...p, name: p.name ?? st.name, region, current },
    handlers: {
      tabIndex: 0,
      role: 'button',
      'aria-label': `${st.name}: ${REGION_WORD[st.region]}, ${formatSI(st.id, 'A')}. Show details`,
      onMouseEnter: () => ctx.setHover(id),
      onFocus: () => ctx.setHover(id),
      onClick: () => ctx.setHover(id),
      style: { cursor: 'pointer', outline: 'none' },
      className: 'mos-hit',
    },
  };
}

const REGION_WORD: Record<Region, string> = { off: 'off', triode: 'triode', saturation: 'saturated' };

export function Nmos(raw: MosProps) {
  const { props: p, handlers } = useInspect(raw);
  const hl = useHL(p.id);
  const s = p.flip ? -1 : 1;
  return (
    <g data-id={p.id} {...handlers}>
      {handlers.tabIndex !== undefined && <rect x={p.x - 34} y={p.y - 30} width={68} height={60} fill="transparent" />}
      <MosBody x={p.x} y={p.y} kind="n" hl={hl} flip={p.flip} />
      {p.diode && <polyline points={`${p.x - s * 30},${p.y} ${p.x - s * 30},${p.y - 24} ${p.x},${p.y - 24}`} fill="none" {...stroke(hl)} />}
      {p.diode && <Dot x={p.x} y={p.y - 24} />}
      <MosAnnotations {...p} kind="n" />
    </g>
  );
}

export function Pmos(raw: MosProps) {
  const { props: p, handlers } = useInspect(raw);
  const hl = useHL(p.id);
  const s = p.flip ? -1 : 1;
  return (
    <g data-id={p.id} {...handlers}>
      {handlers.tabIndex !== undefined && <rect x={p.x - 34} y={p.y - 30} width={68} height={60} fill="transparent" />}
      <MosBody x={p.x} y={p.y} kind="p" hl={hl} flip={p.flip} />
      {p.diode && <polyline points={`${p.x - s * 30},${p.y} ${p.x - s * 30},${p.y + 24} ${p.x},${p.y + 24}`} fill="none" {...stroke(hl)} />}
      {p.diode && <Dot x={p.x} y={p.y + 24} />}
      <MosAnnotations {...p} kind="p" />
    </g>
  );
}

/** Simple op-amp triangle; inputs at (x−36, y∓12), output at (x+36, y). */
export function OpAmp({ x, y, id }: { x: number; y: number; id?: string }) {
  const hl = useHL(id);
  return (
    <g>
      <polygon points={`${x - 30},${y - 30} ${x - 30},${y + 30} ${x + 30},${y}`} fill="var(--surface)" {...stroke(hl)} strokeLinejoin="round" />
      <Label x={x - 24} y={y - 8} text="+" size={13} />
      <Label x={x - 24} y={y + 17} text="−" size={13} />
      <line x1={x - 36} y1={y - 12} x2={x - 30} y2={y - 12} stroke={INK} strokeWidth={W} />
      <line x1={x - 36} y1={y + 12} x2={x - 30} y2={y + 12} stroke={INK} strokeWidth={W} />
      <line x1={x + 30} y1={y} x2={x + 36} y2={y} stroke={INK} strokeWidth={W} />
    </g>
  );
}

// ─── Frame ─────────────────────────────────────────────────────────────────

/** Responsive SVG canvas: scales to its container but never beyond maxWidth. */
export function Canvas({ w, h, children, title, maxWidth, highlight, style }: { w: number; h: number; children: ReactNode; title: string; maxWidth?: number; highlight?: string[]; style?: DrawStyle }) {
  const outerStyle = useContext(DrawStyleContext);
  const svg = (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={title}
      style={{ width: '100%', maxWidth: maxWidth ?? w * 1.35, height: 'auto', display: 'block', overflow: 'visible', margin: '0 auto' }}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
  return (
    <DrawStyleContext.Provider value={style ?? outerStyle}>
      <HighlightContext.Provider value={new Set(highlight ?? [])}>{svg}</HighlightContext.Provider>
    </DrawStyleContext.Provider>
  );
}
