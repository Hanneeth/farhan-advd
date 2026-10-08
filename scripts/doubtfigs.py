"""Simplification strips for the lecture steps: full circuit ⇒ simpler pictures ⇒ the formula.
Writes SVG files to src/assets/doubts/. Run: python3 scripts/doubtfigs.py
Drawn from scratch (no textbook figures). Colours: ink #222, signal #c9561c, NMOS #6b4fbb, PMOS #0e7d76."""
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'doubts'
INK, SIG, NM, PM, OK, BAD, MUT = '#222', '#c9561c', '#6b4fbb', '#0e7d76', '#2e7d4f', '#b8382a', '#6a7079'


def lab(t):
    """'g_m1 r_O2' → subscripts; '^2' → superscript."""
    t = t.replace('&', '&amp;').replace('<', '&lt;').replace(' ∥ ', ' || ').replace('∥', ' || ')
    t = re.sub(r'_\{([^}]*)\}', r'<tspan baseline-shift="sub" font-size="75%">\1</tspan>', t)
    t = re.sub(r'_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)', r'<tspan baseline-shift="sub" font-size="75%">\1</tspan>', t)
    t = re.sub(r'\^([0-9]+)', r'<tspan baseline-shift="super" font-size="70%">\1</tspan>', t)
    return t


class P:
    """One panel: its own coordinates, placed at (ox, oy) in the strip."""

    def __init__(s, ox, oy=0):
        s.ox, s.oy, s.o = ox, oy, []

    def w(s, *pts, col=INK, wd=1.6, dash=None):
        p = ' '.join(f'{pts[i]},{pts[i + 1]}' for i in range(0, len(pts), 2))
        s.o.append(f'<polyline points="{p}" fill="none" stroke="{col}" stroke-width="{wd}"' + (f' stroke-dasharray="{dash}"' if dash else '') + '/>')

    def t(s, x, y, txt, size=13, col=INK, anchor='start', bold=False, italic=False):
        s.o.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{col}" text-anchor="{anchor}"' + (' font-weight="600"' if bold else '') + (' font-style="italic"' if italic else '') + f'>{lab(txt)}</text>')

    def dot(s, x, y, r=3, col=INK):
        s.o.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{col}"/>')

    def arrow(s, x1, y1, x2, y2, col=SIG, wd=2):
        s.o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{wd}" marker-end="url(#ah{col[1:]})"/>')

    def box(s, x, y, w, h, fill='#f3efe6', stroke='#c9c2b2', r=6):
        s.o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}"/>')

    def fet(s, x, y, name='', gate='', p=False, col=None, glen=20, gate_right=False, namepos='r'):
        """Drain/source leads on the column x; top lead to y-30, bottom to y+30. NMOS: drain top. PMOS: source top."""
        c = col or (PM if p else NM)
        d = 1 if gate_right else -1
        cx = x + 12 * d
        s.w(cx, y - 18, cx, y + 18, col=c, wd=2.4)
        s.w(cx + 6 * d, y - 15, cx + 6 * d, y + 15, col=c, wd=2)
        s.w(cx, y - 12, x, y - 12, x, y - 30, col=c)
        s.w(cx, y + 12, x, y + 12, x, y + 30, col=c)
        s.w(cx + 6 * d, y, cx + (6 + glen) * d, y, col=c)
        if p:  # arrow into the channel at the source (top)
            tip, base = cx - d, cx - 9 * d
            s.o.append(f'<polygon points="{tip},{y - 12} {base},{y - 16} {base},{y - 8}" fill="{c}"/>')
        else:  # arrow out of the channel at the source (bottom)
            ax = x - 1 if d == -1 else x + 1
            bx = x - 9 if d == -1 else x + 9
            s.o.append(f'<polygon points="{ax},{y + 12} {bx},{y + 8} {bx},{y + 16}" fill="{c}"/>')
        if gate:
            gx = cx + (6 + glen + 3) * d
            s.t(gx, y + 4, gate, 12, c, 'end' if d == -1 else 'start')
        if name:
            nx = x + (8 if namepos == 'r' else -8)
            s.t(nx, y + 4, name, 13, c, 'start' if namepos == 'r' else 'end', bold=True)

    def vdd(s, x1, x2, y, label='VDD'):
        s.w(x1, y, x2, y, wd=2.2)
        s.t(x2 + 4, y + 4, label, 11, MUT)

    def gnd(s, x, y):
        s.w(x, y, x, y + 8)
        s.w(x - 10, y + 8, x + 10, y + 8, wd=1.8)
        s.w(x - 6, y + 12, x + 6, y + 12)
        s.w(x - 2, y + 16, x + 2, y + 16)

    def isrc(s, x, y, label='', down=True):
        s.o.append(f'<circle cx="{x}" cy="{y}" r="12" fill="#fff" stroke="{INK}" stroke-width="1.6"/>')
        s.arrow(x, y - 6 if down else y + 6, x, y + 7 if down else y - 7, col=INK, wd=1.5)
        if label:
            s.t(x + 16, y + 4, label, 12)

    def res(s, x, y1, y2, label='', col=INK):
        n, a, L = 6, 5, 8
        pts = [x, y1, x, y1 + L]
        st = (y2 - y1 - 2 * L) / n
        for i in range(n):
            pts += [x + (a if i % 2 == 0 else -a), y1 + L + st * (i + 0.5)]
        pts += [x, y2 - L, x, y2]
        s.w(*pts, col=col)
        if label:
            s.t(x + 10, (y1 + y2) / 2 + 4, label, 12, col)

    def resh(s, x1, x2, y, label='', col=INK):
        n, a, L = 6, 5, 8
        pts = [x1, y, x1 + L, y]
        st = (x2 - x1 - 2 * L) / n
        for i in range(n):
            pts += [x1 + L + st * (i + 0.5), y + (a if i % 2 == 0 else -a)]
        pts += [x2 - L, y, x2, y]
        s.w(*pts, col=col)
        if label:
            s.t((x1 + x2) / 2, y - 9, label, 12, col, 'middle')

    def cap(s, x, y, label='C_L'):
        s.w(x, y, x, y + 14)
        s.w(x - 11, y + 14, x + 11, y + 14, wd=2)
        s.w(x - 11, y + 20, x + 11, y + 20, wd=2)
        s.w(x, y + 20, x, y + 30)
        s.gnd(x, y + 30)
        if label:
            s.t(x + 14, y + 22, label, 12)

    def gmsrc(s, x, y, label='g_m v', col=SIG):
        """Dependent current source (diamond) pointing down."""
        s.o.append(f'<polygon points="{x},{y - 14} {x + 12},{y} {x},{y + 14} {x - 12},{y}" fill="#fff" stroke="{col}" stroke-width="1.6"/>')
        s.arrow(x, y - 7, x, y + 8, col=col, wd=1.4)
        if label:
            s.t(x + 16, y + 4, label, 12, col)

    def opamp(s, x, y, w=60, h=70):
        s.w(x, y - h / 2, x, y + h / 2, x + w, y, x, y - h / 2, wd=1.8)
        s.t(x + 6, y - h / 4 + 5, '−', 14)
        s.t(x + 6, y + h / 4 + 4, '+', 14)

    def svg(s):
        return f'<g transform="translate({s.ox},{s.oy})">' + ''.join(s.o) + '</g>'


def strip(name, panels, caps, w, h, title='', foot='', step_arrow=True, cols=2):
    """panels: list of P; caps: captions under each panel; w, h: panel size. Laid out `cols` panels per row
    so the strip stays readable in a narrow column."""
    n = len(panels)
    cols = min(cols, n)
    rows = (n + cols - 1) // cols
    gap = 34
    cell_h = h + 62
    W = cols * w + (cols - 1) * gap + 20
    top = 34 if title else 10
    H = top + rows * cell_h + (34 if foot else 0)
    defs = '<defs>' + ''.join(
        f'<marker id="ah{c[1:]}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L9 5L1 9z" fill="{c}"/></marker>'
        for c in (INK, SIG, NM, PM, OK, BAD, MUT)) + '</defs>'
    body = [f'<rect width="{W}" height="{H}" fill="#fff"/>']
    if title:
        body.append(f'<text x="10" y="22" font-size="15" font-weight="700" fill="{INK}">{lab(title)}</text>')
    for i, p in enumerate(panels):
        r, c = divmod(i, cols)
        x0 = 10 + c * (w + gap)
        y0 = top + r * cell_h
        p.ox, p.oy = x0, y0
        body.append(f'<rect x="{x0 - 4}" y="{y0 - 4}" width="{w + 8}" height="{h + 8}" rx="8" fill="#fbfaf7" stroke="#e2ddd1"/>')
        body.append(p.svg())
        body.append(f'<circle cx="{x0 + 10}" cy="{y0 + 10}" r="10" fill="{SIG}"/><text x="{x0 + 10}" y="{y0 + 14.5}" font-size="12" font-weight="700" fill="#fff" text-anchor="middle">{i + 1}</text>')
        if step_arrow and i < n - 1 and c < cols - 1:
            ax = x0 + w + 6
            body.append(f'<text x="{ax + gap / 2 - 2}" y="{y0 + h / 2 + 8}" font-size="26" fill="{SIG}" text-anchor="middle">⇒</text>')
        words, lines, cur = caps[i].split(), [], ''
        for wd in words:
            if len(cur + ' ' + wd) * 6.1 > w + 6 and cur:
                lines.append(cur)
                cur = wd
            else:
                cur = (cur + ' ' + wd).strip()
        lines.append(cur)
        for k, ln in enumerate(lines[:3]):
            body.append(f'<text x="{x0 + w / 2}" y="{y0 + h + 20 + 15 * k}" font-size="12.5" fill="{INK}" text-anchor="middle">{lab(ln)}</text>')
    if foot:
        body.append(f'<rect x="10" y="{H - 32}" width="{W - 20}" height="26" rx="6" fill="#e2f1e7" stroke="#b7dcc4"/>')
        body.append(f'<text x="{W / 2}" y="{H - 14}" font-size="13" font-weight="600" fill="{OK}" text-anchor="middle">{lab(foot)}</text>')
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" font-family="IBM Plex Sans, Helvetica, Arial, sans-serif">' + defs + ''.join(body) + '</svg>'
    (OUT / f'{name}.svg').write_text(svg)
    return name


# ── v2 helpers: stacked fractions, equations, bars, waves, axes ───────────────
def _plain_len(s):
    """Approximate rendered width (in em) of a label string with _sub markers."""
    n = 0.0
    for m in re.finditer(r'_\{([^}]*)\}|_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)|\^([0-9]+)|(.)', s):
        if m.group(1) is not None or m.group(2) is not None:
            n += 0.46 * len(m.group(1) or m.group(2))
        elif m.group(3) is not None:
            n += 0.42 * len(m.group(3))
        else:
            ch = m.group(4)
            n += 0.3 if ch in ' ilI1.,:;|()[]' else (0.8 if ch in 'mwMW' else 0.6)
    return n


def eq(p, x, y, parts, size=15, col=INK, bold=False, anchor='middle'):
    """Equation with real stacked fractions. parts: list of str or ('f', numerator, denominator)."""
    fs = size * 0.86
    widths = []
    for q in parts:
        if isinstance(q, tuple):
            widths.append(max(_plain_len(q[1]), _plain_len(q[2])) * fs + 12)
        else:
            widths.append(_plain_len(q) * size)
    total = sum(widths)
    cx = x - total / 2 if anchor == 'middle' else (x - total if anchor == 'end' else x)
    wt = ' font-weight="600"' if bold else ''
    for q, wdt in zip(parts, widths):
        if isinstance(q, tuple):
            mid = cx + wdt / 2
            ly = y - size * 0.32
            up = 7 if '_' in q[1] else 4
            p.o.append(f'<text x="{mid}" y="{ly - up}" font-size="{fs}" fill="{col}" text-anchor="middle"{wt}>{lab(q[1])}</text>')
            p.o.append(f'<line x1="{cx + 2}" y1="{ly}" x2="{cx + wdt - 2}" y2="{ly}" stroke="{col}" stroke-width="1.3"/>')
            p.o.append(f'<text x="{mid}" y="{ly + fs + 2}" font-size="{fs}" fill="{col}" text-anchor="middle"{wt}>{lab(q[2])}</text>')
        else:
            p.o.append(f'<text x="{cx}" y="{y}" font-size="{size}" fill="{col}"{wt} xml:space="preserve">{lab(q)}</text>')
        cx += wdt


def P_eq(s, *a, **k):
    eq(s, *a, **k)


P.eq = P_eq


def bars(p, x, y_bottom, w, segs, scale, label_side='r'):
    """Stacked vertical bar from y_bottom upward. segs: [(height_units, text, fill, stroke)]."""
    y = y_bottom
    for hgt, txt, fill, stroke in segs:
        hh = hgt * scale
        p.o.append(f'<rect x="{x}" y="{y - hh}" width="{w}" height="{hh}" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>')
        if txt:
            p.t(x + w / 2, y - hh / 2 + 4, txt, 11.5 if hh > 14 else 10, stroke, 'middle', True)
        y -= hh
    return y


P.bars = bars


def axes(p, x0, y0, x1, y1, xl='', yl=''):
    p.w(x0, y0, x1, y0, col=MUT, wd=1.4)
    p.w(x0, y0, x0, y1, col=MUT, wd=1.4)
    if xl:
        p.t(x1, y0 + 16, xl, 12, MUT, 'end')
    if yl:
        p.t(x0 + 4, y1 + 2, yl, 12, MUT)


P.axes = axes


def curve(p, f, x0, x1, n=80, col=NM, wd=2.2, dash=None):
    pts = []
    for k in range(n + 1):
        x = x0 + (x1 - x0) * k / n
        pts += [round(x, 1), round(f(x), 1)]
    p.w(*pts, col=col, wd=wd, dash=dash)


P.curve = curve
