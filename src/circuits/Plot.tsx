/**
 * Minimal SVG plotting: linear axes, ticks, polylines, markers and guide lines.
 * Used for ID–VDS families, transfer curves, Bode plots and step responses.
 */
import type { ReactNode } from 'react';
import { Label } from './primitives';

export interface Series {
  points: Array<[number, number]>;
  color?: string;
  width?: number;
  dashed?: boolean;
  /** Shade the area under the curve. */
  fill?: boolean;
  opacity?: number;
  label?: string;
  labelAt?: 'end' | 'start';
  id?: string;
}

export interface Marker {
  x: number;
  y: number;
  color?: string;
  label?: string;
  labelPos?: 'above' | 'below' | 'left' | 'right';
}

export interface Guide {
  axis: 'x' | 'y';
  at: number;
  label?: string;
  color?: string;
}

export interface Shade {
  x0: number;
  x1: number;
  color: string;
  label?: string;
  labelAt?: 'top' | 'bottom';
}

export interface PlotProps {
  title: string;
  w?: number;
  h?: number;
  xRange: [number, number];
  yRange: [number, number];
  xLabel: ReactNode;
  yLabel: ReactNode;
  xTicks?: number[];
  yTicks?: number[];
  xFmt?: (v: number) => string;
  yFmt?: (v: number) => string;
  series: Series[];
  markers?: Marker[];
  guides?: Guide[];
  shades?: Shade[];
  children?: (sx: (x: number) => number, sy: (y: number) => number) => ReactNode;
  /** Drag inside the plot to pick a point (data coordinates). A slider should offer the same control. */
  onPick?: (x: number, y: number) => void;
}

export function ticks(lo: number, hi: number, n = 5): number[] {
  const span = hi - lo;
  const raw = span / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? 10 * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-9; v += step) out.push(Number(v.toPrecision(10)));
  return out;
}

export function Plot(p: PlotProps) {
  const w = p.w ?? 420;
  const h = p.h ?? 260;
  const m = { l: 52, r: 16, t: 14, b: 42 };
  const iw = w - m.l - m.r;
  const ih = h - m.t - m.b;
  const [x0, x1] = p.xRange;
  const [y0, y1] = p.yRange;
  const sx = (x: number) => m.l + ((x - x0) / (x1 - x0)) * iw;
  const sy = (y: number) => m.t + ih - ((y - y0) / (y1 - y0)) * ih;
  const clampY = (y: number) => Math.max(y0 - (y1 - y0) * 0.02, Math.min(y1 + (y1 - y0) * 0.02, y));
  const xt = p.xTicks ?? ticks(x0, x1);
  const yt = p.yTicks ?? ticks(y0, y1);
  const xf = p.xFmt ?? ((v: number) => String(v));
  const yf = p.yFmt ?? ((v: number) => String(v));
  const pick = (e: React.PointerEvent<SVGRectElement>) => {
    if (!p.onPick) return;
    const svg = e.currentTarget.ownerSVGElement;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    const x = x0 + ((pt.x - m.l) / iw) * (x1 - x0);
    const y = y0 + ((m.t + ih - pt.y) / ih) * (y1 - y0);
    p.onPick(Math.max(x0, Math.min(x1, x)), Math.max(y0, Math.min(y1, y)));
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={p.title} style={{ width: '100%', maxWidth: w * 1.3, height: 'auto', display: 'block' }}>
      <title>{p.title}</title>
      <defs>
        <clipPath id={`clip-${p.title.replace(/\W/g, '')}`}>
          <rect x={m.l} y={m.t - 2} width={iw} height={ih + 4} />
        </clipPath>
      </defs>
      {p.shades?.map((s, i) => (
        <g key={`s${i}`}>
          <rect x={sx(s.x0)} y={m.t} width={Math.max(0, sx(s.x1) - sx(s.x0))} height={ih} fill={s.color} opacity={0.12} />
          {s.label && <Label x={(sx(s.x0) + sx(s.x1)) / 2} y={s.labelAt === 'bottom' ? m.t + ih - 8 : m.t + 14} text={s.label} anchor="middle" size={11} color={s.color} weight={600} />}
        </g>
      ))}
      {yt.map((v) => (
        <line key={`gy${v}`} x1={m.l} x2={m.l + iw} y1={sy(v)} y2={sy(v)} stroke="var(--line)" strokeWidth={1} strokeDasharray="2 4" />
      ))}
      <line x1={m.l} y1={m.t + ih} x2={m.l + iw} y2={m.t + ih} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
      <line x1={m.l} y1={m.t} x2={m.l} y2={m.t + ih} stroke="var(--ink)" strokeWidth={2} strokeLinecap="round" />
      {xt.map((v) => (
        <g key={`xt${v}`}>
          <line x1={sx(v)} x2={sx(v)} y1={m.t + ih} y2={m.t + ih + 4} stroke="var(--ink)" />
          <Label x={sx(v)} y={m.t + ih + 16} text={xf(v)} anchor="middle" size={11} mono color="var(--ink-2)" />
        </g>
      ))}
      {yt.map((v) => (
        <g key={`yt${v}`}>
          <line x1={m.l - 4} x2={m.l} y1={sy(v)} y2={sy(v)} stroke="var(--ink)" />
          {!(v === y0 && xt.some((t) => Math.abs(sx(t) - m.l) < 24)) && <Label x={m.l - 6} y={sy(v) + 4} text={yf(v)} anchor="end" size={11} mono color="var(--ink-2)" />}
        </g>
      ))}
      <Label x={m.l + iw / 2} y={h - 6} text={p.xLabel} anchor="middle" size={12} weight={600} color="var(--ink-2)" />
      <g transform={`translate(12, ${m.t + ih / 2}) rotate(-90)`}>
        <Label x={0} y={0} text={p.yLabel} anchor="middle" size={12} weight={600} color="var(--ink-2)" />
      </g>
      {p.guides?.map((g, i) =>
        g.axis === 'x' ? (
          <g key={`g${i}`}>
            <line x1={sx(g.at)} x2={sx(g.at)} y1={m.t} y2={m.t + ih} stroke={g.color ?? 'var(--muted)'} strokeDasharray="4 4" strokeWidth={1.2} />
            {g.label && <Label x={sx(g.at) + 4} y={m.t + ih - 6} text={g.label} size={11} color={g.color ?? 'var(--muted)'} bg />}
          </g>
        ) : (
          <g key={`g${i}`}>
            <line x1={m.l} x2={m.l + iw} y1={sy(g.at)} y2={sy(g.at)} stroke={g.color ?? 'var(--muted)'} strokeDasharray="4 4" strokeWidth={1.2} />
            {g.label && <Label x={m.l + iw - 4} y={sy(g.at) - 5} text={g.label} anchor="end" size={11} color={g.color ?? 'var(--muted)'} bg />}
          </g>
        ),
      )}
      <g clipPath={`url(#clip-${p.title.replace(/\W/g, '')})`}>
        {p.series.map((s, i) =>
          s.fill && s.points.length > 1 ? (
            <polygon
              key={`f${i}`}
              points={[`${sx(s.points[0][0])},${sy(y0)}`, ...s.points.map(([x, y]) => `${sx(x)},${sy(clampY(y))}`), `${sx(s.points[s.points.length - 1][0])},${sy(y0)}`].join(' ')}
              fill={s.color ?? 'var(--ink)'}
              opacity={0.12}
            />
          ) : null,
        )}
        {p.series.map((s, i) => (
          <polyline
            key={`l${i}`}
            points={s.points.map(([x, y]) => `${sx(x)},${sy(clampY(y))}`).join(' ')}
            fill="none"
            stroke={s.color ?? 'var(--ink)'}
            strokeWidth={s.width ?? 2}
            strokeDasharray={s.dashed ? '5 4' : undefined}
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={s.opacity ?? 1}
          />
        ))}
      </g>
      {p.series.map((s, i) => {
        if (!s.label || s.points.length === 0) return null;
        const [lx, ly] = s.labelAt === 'start' ? s.points[0] : s.points[s.points.length - 1];
        if (ly > y1 || ly < y0) return null;
        const atStart = s.labelAt === 'start';
        return <Label key={`sl${i}`} x={sx(lx) + (atStart ? 6 : -4)} y={sy(ly) - 6} text={s.label} anchor={atStart ? 'start' : 'end'} size={11} mono color={s.color ?? 'var(--ink)'} bg weight={600} />;
      })}
      {p.markers?.map((mk, i) => {
        const cx = sx(mk.x);
        const cy = sy(mk.y);
        const pos = mk.labelPos ?? 'above';
        const lx = pos === 'left' ? cx - 8 : pos === 'right' ? cx + 8 : cx;
        const ly = pos === 'above' ? cy - 10 : pos === 'below' ? cy + 18 : cy + 4;
        return (
          <g key={`m${i}`}>
            <circle cx={cx} cy={cy} r={11} fill={mk.color ?? 'var(--signal)'} opacity={0.18} />
            <circle cx={cx} cy={cy} r={5.5} fill={mk.color ?? 'var(--signal)'} stroke="var(--surface)" strokeWidth={2} />
            {mk.label && <Label x={lx} y={ly} text={mk.label} anchor={pos === 'left' ? 'end' : pos === 'right' ? 'start' : 'middle'} size={11} mono color={mk.color ?? 'var(--signal)'} bg weight={600} />}
          </g>
        );
      })}
      {p.children?.(sx, sy)}
      {p.onPick && (
        <rect
          x={m.l}
          y={m.t}
          width={iw}
          height={ih}
          fill="transparent"
          style={{ cursor: 'ew-resize', touchAction: 'none' }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            pick(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons) pick(e);
          }}
        />
      )}
    </svg>
  );
}
