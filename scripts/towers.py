"""Tower figures: each transistor drawn as a block whose height is the voltage across it, next to the real column.
How to read one (taught in s-lec03-tower): one block = one transistor; height = top node − bottom node; the blocks
stack up to VDD; a block may never be shorter than its V_ov; when an input or output moves, one boundary slides,
one block grows and its neighbour shrinks; the limit is the moment a block hits its minimum (drawn red).
Blue dashed = the gate link (a gate always sits one V_GS from its source). Run through scripts/doubtstrips.py."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from doubtfigs import BAD, INK, MUT, NM, OK, P, PM, SIG, strip  # noqa: E402

F = lambda n, d: ('f', n, d)  # noqa: E731
LINK = '#2b6cb0'
STY = {'sq': ('#f6d5d0', BAD), 'ok': ('#dcefe2', OK), 'min': ('#ececec', MUT), 'diode': ('#fbe7cf', SIG), 'room': ('#ffffff', OK)}


def tower(p, x, yb, blocks, sc, w=60, nodes=None, size=11.5):
    """blocks bottom→top: (volts, name, state, note). nodes: labels for each boundary bottom→top (len = blocks+1)."""
    y = yb
    ys = [yb]
    for v, name, state, note in blocks:
        hh = v * sc
        fill, stroke = STY[state]
        dash = ' stroke-dasharray="4 3"' if state == 'room' else ''
        p.o.append(f'<rect x="{x}" y="{y - hh}" width="{w}" height="{hh}" fill="{fill}" stroke="{stroke}" stroke-width="1.4"{dash}/>')
        if name:
            p.t(x + w / 2, y - hh / 2 + 4, name, 12 if hh >= 16 else 10, stroke, 'middle', True)
        if note:
            p.t(x + w + 7, y - hh / 2 + 4, note, size, stroke, bold=state == 'sq')
        y -= hh
        ys.append(y)
    if nodes:
        for lab_, yy in zip(nodes, ys):
            if lab_:
                p.t(x - 5, yy + 4, lab_, size, INK, 'end')
    return ys


def link(p, x1, y1, x2, y2, label='', lx=None, ly=None, anchor='end'):
    p.w(x1, y1, x2, y1, x2, y2 - 6, col=LINK, wd=1.6, dash='5 3')
    p.o.append(f'<polygon points="{x2},{y2} {x2 - 4},{y2 - 8} {x2 + 4},{y2 - 8}" fill="{LINK}"/>')
    if label:
        p.t(lx if lx is not None else x2 - 6, ly if ly is not None else (y1 + y2) / 2, label, 11.5, LINK, anchor)


def gate_link(p, xt, y_node, y_vin, label, lx=8):
    """Blue: from a node (label on the tower's left) to the input level, with the input drawn as a dashed line."""
    xl = 58
    p.w(xl + 18, y_node, xl, y_node, xl, y_vin + (6 if y_vin < y_node else -6), col=LINK, wd=1.6, dash='4 3')
    tip = y_vin
    d = 8 if y_vin < y_node else -8
    p.o.append(f'<polygon points="{xl},{tip} {xl - 4},{tip + d} {xl + 4},{tip + d}" fill="{LINK}"/>')
    p.w(lx, y_vin, xt - 2, y_vin, col=LINK, wd=1.6, dash='4 3')
    p.t(lx, y_vin - 5, label, 12, LINK, bold=True)


def vin_mark(p, x0, x1, y, label):
    p.w(x0, y, x1, y, col=LINK, wd=1.6, dash='4 3')
    p.t(x0 - 4, y + 4, label, 12, LINK, 'end', True)


def rows(p, w, y0, items, dy=28, size=13):
    y = y0
    for it in items:
        if isinstance(it, str):
            p.t(w / 2, y, it, 12, MUT, 'middle')
        elif it[0] == 'h':
            p.t(w / 2, y, it[1], 13, INK, 'middle', True)
        elif it[0] == 'l':  # left-aligned rule line
            p.t(14, y, it[1], 12.2, it[2] if len(it) > 2 else INK)
        else:
            parts, col, bold = it
            p.eq(w / 2, y, parts, size, col, bold)
        y += dy
    return p


def column(p, x, devs, top=20, gap=60, vdd=True, gnd=True, right_nodes=None):
    """Draw a single column of fets top→bottom. devs: (name, gate, pmos). Returns node y list (top→bottom)."""
    if vdd:
        p.vdd(x - 70, x + 70, top)
    ys = [top]
    y = top + 30
    for name, gate, pm in devs:
        p.fet(x, y, name, gate, p=pm, glen=12)
        ys.append(y + 30)
        y += gap
    if gnd:
        p.gnd(x, ys[-1])
    if right_nodes:
        for lab_, yy in zip(right_nodes, ys):
            if lab_:
                p.dot(x, yy)
                p.t(x + 8, yy - 6, lab_, 11.5, BAD, bold=True)
    return ys


# ── Lec 03: how to read a tower ──────────────────────────────────────────────
def lec03_tower():
    w, h = 280, 330
    a = P(0)
    ys = column(a, 110, [('M8', 'V_b4', True), ('M6', 'V_b3', True), ('M4', 'V_b2', False), ('M2', 'V_in', False), ('M9', 'V_b1', False)], top=22, gap=56)
    for k, lab_ in ((2, 'V_out'), (4, 'P')):
        a.dot(110, ys[k])
        a.t(118, ys[k] + 4, lab_, 12, SIG if lab_ == 'V_out' else BAD, bold=True)

    b = P(0)
    b.t(w / 2 + 8, 22, 'The same column as a tower', 13, INK, 'middle', True)
    sc = 88
    tower(b, 70, 322, [(0.5, 'M9', 'min', 'tail ≥ 0.5'), (0.2, 'M2', 'min', 'M2 ≥ 0.2'), (0.95, 'M4', 'ok', 'M4 ≥ 0.2'),
                       (1.05, 'M6', 'ok', 'M6 ≥ 0.3'), (0.3, 'M8', 'min', 'M8 ≥ 0.3')], sc,
          nodes=['0', 'P', '', 'V_out', '', '3 V'])
    b.t(w / 2 + 8, 38, 'height = voltage across that device', 11.5, MUT, 'middle')

    c = P(0)
    c.t(w / 2 + 8, 22, 'Slide V_out until a block hits its minimum', 13, INK, 'middle', True)
    sc2 = 84
    tower(c, 46, 312, [(0.5, 'M9', 'min', ''), (0.2, 'M2', 'min', ''), (1.7, 'M4', 'ok', ''), (0.3, 'M6', 'sq', ''), (0.3, 'M8', 'min', '')], sc2,
          w=52, nodes=['0', '', '', 'top 2.4', '', ''])
    tower(c, 188, 312, [(0.5, 'M9', 'min', ''), (0.2, 'M2', 'min', ''), (0.2, 'M4', 'sq', ''), (1.8, 'M6', 'ok', ''), (0.3, 'M8', 'min', '')], sc2,
          w=52, nodes=['', '', '', 'bottom 0.9', '', ''])
    c.t(72, 44, 'V_out at its top', 11.5, BAD, 'middle', True)
    c.t(214, 44, 'V_out at its bottom', 11.5, BAD, 'middle', True)

    d = rows(P(0), w, 40, [
        ('h', 'Reading rules (every tower)'),
        ('l', '1  one block = one transistor'),
        ('l', '2  height = top node − bottom node'),
        ('l', '3  the blocks always add up to V_DD'),
        ('l', '4  no block may be shorter than its V_ov'),
        ('l', '5  move V_out: the block above shrinks,'),
        ('l', '    the block below grows (or vice versa)'),
        ('l', '6  a red block = squeezed to its minimum', BAD),
        ('l', '    = that device is the limit', BAD),
        ('h', 'swing = V_DD − all minimum blocks'),
        (['= 3 − (0.3+0.3+0.2+0.2+0.5) = 1.5 V'], OK, True),
    ], 26)
    strip('s-lec03-tower', [a, b, c, d], ['The real column: five devices from V_DD to ground', 'Each device becomes a block; the blocks stack to 3 V',
                                          'Top: M6 squeezed. Bottom: M4 squeezed', 'Six rules that read every tower in this course'], w, h,
          'How to read a tower (Ex 9.7 numbers: V_DD = 3 V)', 'A limit is always: which block gets squeezed first?')


# ── Lec 02: 5-T OTA CM range and swing ───────────────────────────────────────
def lec02_cm():
    w, h = 280, 300
    sc = 130
    a = P(0)
    a.t(w / 2 + 8, 22, 'Ceiling: V_in up, P up, M1 squeezed', 13, INK, 'middle', True)
    ys = tower(a, 120, 280, [(0.9, 'tail', 'ok', '0.9 plenty'), (0.2, 'M1', 'sq', '0.2 squeezed'), (0.7, 'M3', 'diode', 'diode: always 0.7')], sc,
               nodes=['0', 'P 0.9', 'X 1.1', 'V_DD 1.8'])
    gate_link(a, 120, ys[1], 280 - 1.6 * sc, 'V_in 1.6')
    a.t(w / 2, 292, 'V_in = P + 0.7 (link)', 11.5, LINK, 'middle', True)

    b = P(0)
    b.t(w / 2 + 8, 22, 'Floor: V_in down, P down, tail squeezed', 13, INK, 'middle', True)
    ys = tower(b, 120, 280, [(0.2, 'tail', 'sq', '0.2 squeezed'), (0.9, 'M1', 'ok', '0.9 plenty'), (0.7, 'M3', 'diode', 'diode: always 0.7')], sc,
               nodes=['0', 'P 0.2', 'X 1.1', 'V_DD 1.8'])
    gate_link(b, 120, ys[1], 280 - 0.9 * sc, 'V_in 0.9')
    b.t(w / 2, 292, 'V_in = P + 0.7 (link)', 11.5, LINK, 'middle', True)

    c = P(0)
    c.t(w / 2 + 8, 22, 'Output swing (column M4, M2, tail)', 13, INK, 'middle', True)
    tower(c, 60, 280, [(0.2, 'tail', 'min', ''), (1.4, 'M2', 'ok', ''), (0.2, 'M4', 'sq', '')], 118, w=50,
          nodes=['0', 'P', 'top 1.6', ''])
    tower(c, 196, 280, [(0.2, 'tail', 'min', ''), (0.2, 'M2', 'sq', ''), (1.4, 'M4', 'ok', '')], 118, w=50,
          nodes=['', '', 'bottom 0.4', ''])
    c.t(85, 46, 'V_out at top', 11.5, BAD, 'middle', True)
    c.t(221, 46, 'V_out at bottom', 11.5, BAD, 'middle', True)
    c.t(w / 2, 292, 'swing = 1.8 − 0.2 − 0.2 − 0.2 = 1.2 V', 11.5, OK, 'middle', True)

    d = rows(P(0), w, 36, [
        ('h', 'The three results'),
        (['V_in,CM,max = V_DD − |V_GS3| + V_th1'], SIG, True),
        '= 1.8 − 0.7 + 0.5 = 1.6 V',
        (['V_in,CM,min = V_ISS + V_GS1'], SIG, True),
        '= 0.2 + 0.7 = 0.9 V',
        (['swing = V_DD − |V_ov4| − V_ov2 − V_ISS'], OK, True),
        ('h', 'why +V_th1 in the ceiling?'),
        'X − 0.2 (M1’s minimum) + 0.7 (link)',
        '= X + 0.5 = X + V_th1',
    ], 28)
    strip('s-lec02-cm', [a, b, c, d], ['M3 is a diode, so its block is stuck at 0.7 V', 'The tail block shrinks to its 0.2 V',
                                       'Output at the top: M4 squeezed; at the bottom: M2 squeezed', 'Numbers: V_DD 1.8, V_th 0.5, V_ov 0.2, V_GS 0.7'], w, h,
          '5-T OTA: CM range and swing as towers', 'Move the input or output, find the block that hits its minimum')


# ── Lec 05: Ex 9.6, both CMs marked, why the swing is squeezed ──────────────
def lec05_ex96():
    w, h = 280, 290
    a = P(0)
    a.t(w / 2 + 8, 22, 'One side: follow the DC into M1’s gate', 13, INK, 'middle', True)
    a.w(20, 120, 40, 120)
    a.w(40, 108, 40, 132, wd=2.2)
    a.w(48, 108, 48, 132, wd=2.2)
    a.t(44, 100, 'C_1', 11.5, MUT, 'middle')
    a.t(18, 112, 'V_in1', 11.5, MUT)
    a.resh(48, 108, 120, 'R_1')
    a.w(108, 120, 140, 120)
    a.dot(140, 120)
    a.w(140, 120, 140, 70)
    a.resh(140, 220, 70, 'R_2', BAD)
    a.w(220, 70, 240, 70, 240, 100)
    a.dot(240, 100)
    a.t(246, 104, 'V_out1', 12, SIG, bold=True)
    a.w(140, 120, 140, 190, 190, 190)
    a.fet(220, 190, 'M1', '', glen=18)
    a.w(220, 160, 220, 130, 240, 130, 240, 100, col=MUT, dash='3 3')
    a.t(228, 150, 'X', 11.5, BAD, bold=True)
    a.gnd(220, 220)
    a.t(w / 2, 254, 'no DC current through R_2 →', 12, BAD, 'middle', True)
    a.t(w / 2, 270, 'M1’s gate DC = V_out1’s DC', 12, BAD, 'middle', True)

    b = P(0)
    b.t(w / 2 + 8, 22, 'Two CMs, marked', 13, INK, 'middle', True)
    for x0, s in ((60, '1'), (200, '2')):
        b.dot(x0, 70)
        b.t(x0, 60, f'V_out{s}', 12, SIG, 'middle', True)
        b.dot(x0, 170)
        b.t(x0, 194, f'V_G{s}', 12, NM, 'middle', True)
    b.w(60, 70, 200, 70, col=SIG, dash='3 3')
    b.w(60, 170, 200, 170, col=NM, dash='3 3')
    b.dot(130, 70, col=SIG)
    b.dot(130, 170, col=NM)
    b.eq(130, 100, ['V_out,CM = ', F('V_out1 + V_out2', '2')], 13, SIG, True)
    b.eq(130, 148, ['V_in,CM = ', F('V_G1 + V_G2', '2')], 13, NM, True)
    b.t(w / 2, 234, 'CM = the average of a pair', 12.5, INK, 'middle', True)
    b.t(w / 2, 252, 'R_2, R_4 carry no DC → the two are equal', 11.5, MUT, 'middle')

    c = P(0)
    c.t(w / 2 + 8, 22, 'The seesaw: the average stays put', 13, INK, 'middle', True)
    c.axes(30, 230, 260, 50, 't')
    import math
    c.curve(lambda xx: 140 - 50 * math.sin((xx - 30) / 32), 30, 255, col=SIG)
    c.curve(lambda xx: 140 + 50 * math.sin((xx - 30) / 32), 30, 255, col=PM)
    c.w(30, 140, 258, 140, col=INK, wd=1.4, dash='5 3')
    c.t(256, 134, 'V_out,CM', 11.5, INK, 'end', True)
    c.t(40, 76, 'V_out1', 11.5, SIG, bold=True)
    c.t(40, 214, 'V_out2', 11.5, PM, bold=True)
    c.t(w / 2, 258, 'one goes up as the other goes down', 11.5, MUT, 'middle')

    d = P(0)
    d.t(w / 2 + 8, 22, 'Why each output can drop only 0.3 V', 13, INK, 'middle', True)
    sc = 150
    ys = tower(d, 120, 262, [(0.2, 'tail', 'min', ''), (0.2, 'M1', 'sq', 'M1 squeezed'), (0.2, 'M3', 'sq', 'M3 squeezed')], sc,
               nodes=['0', 'P 0.2', 'X 0.4', 'out,min 0.6'])
    gate_link(d, 120, ys[1], 262 - 0.9 * sc, 'gate 0.9')
    d.t(w / 2, 50, 'gate = V_out,CM = 0.9 (example)', 11.5, NM, 'middle')
    d.t(w / 2, 66, 'P = gate − 0.7 (link)', 11.5, LINK, 'middle')
    d.eq(w / 2, 284, ['drop = 0.9 − 0.6 = V_th − V_ov = 0.3 V'], 12.5, BAD, True)
    strip('s-lec05-ex96', [a, b, c, d], ['C₁ blocks DC; a gate takes none; so R₂ drops nothing', 'Output CM = average of the outputs; input CM = average of the gates',
                                         'The outputs swing like a seesaw round V_out,CM', 'The gate is stuck at the output CM, so M1 and M3 squeeze fast'], w, h,
          'Ex 9.6: what V_CM means, and why the swing is squeezed', 'Input CM = output CM. Each output can fall only V_th − V_ov below it')


# ── Lec 06: PMOS-input folded cascode CM range (the chat's figure, kept) ─────
def lec06_cm():
    w, h = 280, 300
    a = P(0)
    a.vdd(30, 170, 22)
    a.fet(100, 52, 'M11', 'V_b5', p=True, glen=12)
    a.dot(100, 82)
    a.t(108, 96, 'P', 12.5, BAD, bold=True)
    a.fet(100, 112, 'M1', 'V_in', p=True, glen=12)
    a.dot(100, 142)
    a.t(108, 158, 'X', 12.5, BAD, bold=True)
    a.fet(100, 172, 'M9', 'V_b1', glen=12)
    a.gnd(100, 202)
    for y1, y2, txt in ((24, 80, 'M11: V_DD − P ≥ 0.2'), (84, 140, 'M1: P − X ≥ 0.2'), (144, 200, 'M9: X ≥ 0.2')):
        a.w(160, y1 + 2, 160, y2 - 2, col=BAD, wd=1.6)
        a.w(155, y1 + 2, 165, y1 + 2, col=BAD)
        a.w(155, y2 - 2, 165, y2 - 2, col=BAD)
        a.t(170, (y1 + y2) / 2 + 4, txt, 11, BAD)
    a.w(100, 82, 74, 82, 74, 100, col=LINK, wd=1.6, dash='4 3')
    a.o.append(f'<polygon points="74,106 70,98 78,98" fill="{LINK}"/>')
    a.t(w / 2, 236, 'red = checks: each channel ≥ its V_ov', 11.5, BAD, 'middle', True)
    a.t(w / 2, 254, 'blue = the link: P = V_in + 0.7 (M1’s V_GS)', 11.5, LINK, 'middle', True)
    a.t(w / 2, 276, 'the column is M11, M1, M9: only P moves', 11.5, MUT, 'middle')

    sc = 108

    def two(p, vin, blocks, nodes, title, note):
        p.t(w / 2 + 8, 22, title, 13, INK, 'middle', True)
        ys = tower(p, 130, 240, blocks, sc, nodes=nodes)
        gate_link(p, 130, ys[2], 240 - vin * sc, f'V_in {vin:g}')
        p.t(w / 2, 292, note, 11.5, LINK, 'middle', True)
    b = P(0)
    two(b, 0.9, [(0.2, 'M9', 'min', '0.2'), (1.4, 'M1', 'ok', '1.4 plenty'), (0.2, 'M11', 'sq', '0.2 squeezed')], ['0', 'X 0.2', 'P 1.6', '1.8'],
        'Ceiling: V_in up → P up → M11 squeezed', 'V_in = P − 0.7 = 1.6 − 0.7 = 0.9 V')
    c = P(0)
    two(c, -0.3, [(0.2, 'M9', 'min', '0.2'), (0.2, 'M1', 'sq', '0.2 squeezed'), (1.4, 'M11', 'ok', '1.4 plenty')], ['0', 'X 0.2', 'P 0.4', '1.8'],
        'Floor: V_in down → P down → M1 squeezed', 'V_in = P − 0.7 = 0.4 − 0.7 = −0.3 V')
    d = rows(P(0), w, 34, [
        ('h', 'Same two steps for both limits'),
        ('l', '1  CHECK: which channel is squeezed?'),
        ('l', '    gives the limit on P'),
        ('l', '2  LINK: V_in = P − |V_GS1|', LINK),
        (['V_in,max = V_DD − |V_ov11| − |V_GS1|'], SIG, True),
        (['V_in,min = V_ov9 + |V_ov1| − |V_GS1|'], SIG, True),
        (['= V_ov9 − |V_thp|'], SIG, False),
        'since |V_GS1| = |V_ov1| + |V_thp|',
        ('h', 'below ground: −0.3 V!'),
    ], 28)
    strip('s-lec06-cm', [a, b, c, d], ['Red checks (one per channel) and the blue gate link', 'Push V_in up: M11’s block is the one that shrinks',
                                       'Pull V_in down: M1’s block is the one that shrinks', 'Check, then link: the method for every CM limit'], w, h,
          'PMOS-input folded cascode: the input CM range (V_DD = 1.8 V)', 'Folding puts X near ground, so V_in can go below ground')


# ── Lec 08: what the CS booster costs ────────────────────────────────────────
def lec08_impl():
    w, h = 280, 290
    a = P(0)
    a.vdd(30, 250, 20)
    a.isrc(70, 52, 'I_2')
    a.w(70, 20, 70, 40)
    a.w(70, 64, 70, 100, 150, 100)
    a.dot(70, 100)
    a.fet(190, 100, 'M2', '', glen=28)
    a.w(190, 70, 190, 40)
    a.dot(190, 50)
    a.t(198, 46, 'V_out', 12, SIG, bold=True)
    a.dot(190, 130)
    a.t(198, 140, 'X', 12.5, BAD, bold=True)
    a.fet(190, 160, 'M1', 'V_in', gate_right=True, namepos='l')
    a.gnd(190, 190)
    a.fet(70, 160, '', '', gate_right=True)
    a.t(60, 164, 'M3', 13, NM, 'end', True)
    a.w(70, 100, 70, 130)
    a.w(108, 160, 130, 160, 130, 130, 190, 130, col=SIG, wd=1.8)
    a.gnd(70, 190)
    a.t(w / 2, 236, 'M3’s gate sits on X, its drain drives M2’s gate', 11.5, MUT, 'middle')
    a.eq(w / 2, 262, ['A_1 = g_m3 r_O3'], 13.5, SIG, True)

    sc = 150

    def col(p, title, blocks, nodes, note, notecol):
        p.t(w / 2 + 8, 22, title, 13, INK, 'middle', True)
        tower(p, 120, 250, blocks, sc, nodes=nodes)
        p.t(w / 2, 280, note, 12, notecol, 'middle', True)
    b = P(0)
    col(b, 'Plain cascode: X needs only V_ov1', [(0.2, 'M1', 'min', 'M1 ≥ 0.2'), (0.2, 'M2', 'sq', 'M2 ≥ 0.2')], ['0', 'X 0.2', 'V_out,min 0.4'],
        'V_out,min = V_ov1 + V_ov2 = 0.4 V', OK)
    c = P(0)
    col(c, 'CS booster: X must hold M3’s gate up', [(0.7, 'M1', 'ok', 'X = V_GS3 = 0.7'), (0.2, 'M2', 'sq', 'M2 ≥ 0.2')], ['0', 'X 0.7', 'V_out,min 0.9'],
        'V_out,min = V_GS3 + V_ov2 = 0.9 V', BAD)
    c.t(w / 2, 46, 'X is M3’s gate: a link, X = V_GS3', 11.5, LINK, 'middle', True)
    d = rows(P(0), w, 40, [
        ('h', 'The three boosters'),
        (['1. CS: A_1 = g_m3 r_O3'], NM, True),
        'works, but costs V_th of swing',
        (['2. PMOS: needs V_GS2 ≤ |V_th3|'], BAD, True),
        'M2 would barely be on ✗',
        (['3. folded: A_1 = g_m3 g_m4 r_O3 r_O4'], OK, True),
        'no swing cost, bigger boost ✓',
    ], 32)
    strip('s-lec08-impl', [a, b, c, d], ['Implementation 1: a CS booster (M3 + I₂)', 'Without a booster X can sit just 0.2 V up',
                                         'With it, X is M3’s gate: a whole 0.7 V', 'Pick the folded booster when swing matters'], w, h,
          'Building the booster, and what it costs', 'The CS booster’s M1 block is stuck at V_GS3: half a volt of swing gone')


# ── Lec 05/06 refreshers: the cascode, and what folding changes ─────────────
def lec05_cascode():
    w, h = 280, 300
    a = P(0)
    a.vdd(60, 200, 20)
    a.isrc(110, 50, 'load I_1')
    a.w(110, 38, 110, 20)
    a.w(110, 62, 110, 90)
    a.dot(110, 80)
    a.t(118, 84, 'V_out', 12, SIG, bold=True)
    a.fet(110, 120, 'M2', 'V_b', glen=12)
    a.dot(110, 150)
    a.t(118, 154, 'X', 12.5, BAD, bold=True)
    a.fet(110, 180, 'M1', 'V_in', glen=12)
    a.gnd(110, 210)
    a.t(150, 116, 'SHIELD', 12, PM, bold=True)
    a.t(150, 130, 'gate fixed → X still', 11, PM)
    a.t(150, 176, 'PUMP', 12, NM, bold=True)
    a.t(150, 190, 'v_in → g_m1 v_in', 11, NM)
    a.t(w / 2, 252, 'M1 makes the current,', 11.5, MUT, 'middle')
    a.t(w / 2, 268, 'M2 carries it up and guards M1', 11.5, MUT, 'middle')

    b = rows(P(0), w, 34, [
        ('h', 'The four look-in resistances'),
        ('l', 'into a drain, source grounded:', MUT),
        (['r_O'], INK, True),
        ('l', 'into a drain with R_S under it (UP ×):', MUT),
        (['≈ g_m r_O R_S'], NM, True),
        ('l', 'into a source, R_D on the drain (DOWN ÷):', MUT),
        ([F('R_D + r_O', '1 + g_m r_O'), ' ≈ ', F('1', 'g_m')], PM, True),
        ('l', 'into a gate:', MUT),
        (['∞ (no current)'], INK, True),
    ], 28)

    c = rows(P(0), w, 40, [
        ('h', 'So the cascode gives'),
        (['G_m ≈ g_m1'], SIG, True),
        'M1’s current goes up into 1/g_m2',
        (['R_down = g_m2 r_O2 r_O1'], NM, True),
        'M2 multiplies r_O1 by g_m2 r_O2',
        (['A_v = G_m R_out ≈ (g_m r_O)^2'], OK, True),
        'with an ideal load; ÷2 with a cascode load',
    ], 32)

    d = P(0)
    d.t(w / 2 + 8, 22, 'The price: one more V_ov', 13, INK, 'middle', True)
    tower(d, 70, 250, [(0.2, 'M1', 'min', ''), (0.2, 'M2', 'sq', '')], 150, w=50, nodes=['0', 'X 0.2', '0.4'])
    tower(d, 190, 250, [(0.2, 'M1', 'sq', '')], 150, w=50, nodes=['', '0.2'])
    d.t(95, 272, 'cascode: V_out ≥ 0.4', 11.5, NM, 'middle', True)
    d.t(215, 272, 'plain CS: V_out ≥ 0.2', 11.5, MUT, 'middle', True)
    d.t(w / 2, 292, 'gain × g_m r_O; swing − V_ov', 11.5, OK, 'middle', True)
    strip('s-lec05-cascode', [a, b, c, d], ['Two jobs in one column: pump and shield', '“Up multiplies, down divides”',
                                            'Every cascode result in one place', 'Stacking costs headroom'], w, h,
          'Cascode refresher (everything Lec 5–8 builds on)', 'Gain = G_m × R_out: the cascode keeps G_m and multiplies R_out')


def lec05_compare():
    w, h = 580, 300
    a = P(0)
    cols = (12, 196, 392)
    rows_ = [('', 'normal cascode', 'folded cascode'),
             ('G_m', '≈ g_m1', '≈ g_m1  (same)'),
             ('sign', 'inverting', 'inverting  (same)'),
             ('R_down', 'g_m2 r_O2 r_O1', 'g_m2 r_O2 (r_O1 ∥ r_O,I2)  (a bit lower)'),
             ('X', 'V_b − V_GS2', 'V_b − V_GS2  (same)'),
             ('input range', 'V_GS1 to X + V_th1 (tight)', 'wide; reaches a rail'),
             ('output column', 'load, M2, M1', 'load, M2, I_2  (input left it)'),
             ('current', 'I_1', 'I_1 + I_D1 ≈ double  (costs power)'),
             ('extra', '—', 'pole at X, more noise'),
             ('as a buffer', 'tiny window', 'works')]
    for i, (k, n, f) in enumerate(rows_):
        y = 30 + i * 30
        if i == 0:
            a.box(4, y - 20, w - 8, 28, '#f3efe6', '#c9c2b2', 4)
        elif i % 2 == 0:
            a.box(4, y - 20, w - 8, 28, '#fbfaf7', '#fbfaf7', 0)
        a.t(cols[0], y, k, 12.5, INK, bold=True)
        changed = '(same)' not in f and i > 0
        a.t(cols[1], y, n, 12.5, INK if i else MUT, bold=i == 0)
        a.t(cols[2], y, f, 12.5, (BAD if changed else OK) if i else MUT, bold=i == 0 or changed)
    strip('s-lec05-compare', [a], ['Green = unchanged, red = what folding changes'], w, h,
          'What folding changes, and what it does not', 'M2 does not care where its current comes from: same G_m and same formula', cols=1)


def table(p, w, rows_, cols, ok_word='(same)'):
    for i, (k, n, f) in enumerate(rows_):
        y = 30 + i * 30
        if i == 0:
            p.box(4, y - 20, w - 8, 28, '#f3efe6', '#c9c2b2', 4)
        elif i % 2 == 0:
            p.box(4, y - 20, w - 8, 28, '#fbfaf7', '#fbfaf7', 0)
        p.t(cols[0], y, k, 12.5, INK, bold=True)
        changed = ok_word not in f and i > 0
        p.t(cols[1], y, n, 12.5, INK if i else MUT, bold=i == 0)
        p.t(cols[2], y, f, 12.5, (BAD if changed else OK) if i else MUT, bold=i == 0 or changed)


# ── Lec 07: why the second stage swings, and what sets the level between stages ─
def lec07_swing():
    w, h = 280, 300
    sc = 120
    a = P(0)
    a.t(w / 2 + 8, 22, 'Telescopic output column', 13, INK, 'middle', True)
    tower(a, 110, 262, [(0.2, 'tail', 'min', ''), (0.2, 'M2', 'min', ''), (0.2, 'M4', 'min', ''), (0.8, 'room', 'room', '0.8 V for V_out'),
                        (0.2, 'M6', 'min', ''), (0.2, 'M8', 'min', '')], sc, nodes=['0', '', '', '0.6', '1.4', '', '1.8'])
    a.t(w / 2, 290, 'five blocks of 0.2 V: swing 0.8 V per side', 11.5, BAD, 'middle', True)
    b = P(0)
    b.t(w / 2 + 8, 22, 'Stage 2: a CS stage (two devices)', 13, INK, 'middle', True)
    tower(b, 110, 262, [(0.2, 'M11', 'min', 'current source'), (1.4, 'room', 'room', '1.4 V for V_out'), (0.2, 'M9', 'min', 'CS device')], sc,
          nodes=['0', '0.2', '1.6', '1.8'])
    b.t(w / 2, 290, 'two blocks: swing 1.4 V, rail to rail minus V_ov', 11.5, OK, 'middle', True)
    c = P(0)
    c.t(w / 2 + 8, 22, 'The level between the stages', 13, INK, 'middle', True)
    c.vdd(80, 240, 50)
    c.fet(180, 80, 'M9', '', p=True, glen=40)
    c.dot(180, 110)
    c.t(188, 114, 'V_out', 12, SIG, bold=True)
    c.fet(180, 140, 'M11', 'V_b', glen=14)
    c.gnd(180, 170)
    c.w(128, 80, 80, 80)
    c.dot(80, 80)
    c.t(72, 84, 'X', 13, BAD, 'end', True)
    c.t(76, 118, '(stage-1 output)', 10.5, MUT, 'middle')
    c.w(180, 52, 60, 52, 60, 72, col=LINK, wd=1.6, dash='4 3')
    c.o.append(f'<polygon points="60,78 56,70 64,70" fill="{LINK}"/>')
    c.t(w / 2, 214, 'X is M9’s gate: a link from V_DD', 11.5, LINK, 'middle', True)
    c.eq(w / 2, 240, ['X = V_DD − |V_GS9| = 1.8 − 0.7 = 1.1 V'], 12.5, LINK, True)
    c.t(w / 2, 266, 'stage 1’s output CM is fixed by stage 2', 11.5, MUT, 'middle')
    d = rows(P(0), w, 36, [
        ('h', 'One stage vs two stages'),
        (['A = A_1 × A_2'], SIG, True),
        'telescopic + CS: ≈ (g_m r_O)^2/2 × g_m r_O/2',
        (['swing: from 5 blocks to 2'], OK, True),
        'the output column is just M9 and M11',
        (['price: two poles'], BAD, True),
        'X and V_out are both high-R nodes',
        '→ compensation (Lec 17)',
    ], 30)
    strip('s-lec07-swing', [a, b, c, d], ['All five stacked devices share 1.8 V with the output', 'Stage 2 has only two blocks in its column',
                                          'Stage 2’s V_GS9 pins the DC level at X (a link)', 'What the second stage changes'], w, h,
          'Why two stages: towers at V_DD = 1.8 V (V_ov = 0.2 V each)', 'Stage 1 gives the gain, stage 2 gives the swing')


def lec08_compare():
    w, h = 580, 270
    a = P(0)
    table(a, w, [('', 'plain cascode', 'gain-boosted cascode'),
                 ('G_m', '≈ g_m1', '≈ g_m1  (same)'),
                 ('R_out', 'g_m2 r_O2 r_O1', '(1 + A_1) g_m2 r_O2 r_O1'),
                 ('gain', '(g_m r_O)^2', '(g_m r_O)^3 when A_1 = g_m r_O'),
                 ('output column', 'M2 on M1', 'M2 on M1, nothing stacked  (same)'),
                 ('lowest V_out', 'V_ov1 + V_ov2', 'CS booster: V_GS3 + V_ov2; folded: no loss'),
                 ('extra cost', '—', 'booster current and one more node'),
                 ('booster wiring', '—', 'senses M2’s source X, drives M2’s gate')], (12, 170, 330))
    strip('s-lec08-compare', [a], ['Green = unchanged, red = what boosting changes'], w, h,
          'What gain boosting changes, and what it does not', 'Same G_m and R_out × (1 + A_1), with no extra device in the output column', cols=1)


def main():
    for f in (lec03_tower, lec02_cm, lec05_ex96, lec06_cm, lec08_impl, lec05_cascode, lec05_compare, lec07_swing, lec08_compare):
        f()


if __name__ == '__main__':
    main()
    print('ok')
