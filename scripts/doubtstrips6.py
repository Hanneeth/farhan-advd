"""Lec 06 simplification strips: written so a reader who starts at Lec 6 has every tool on the page.
Run through scripts/doubtstrips.py (writes src/assets/doubts/s-lec06-*.svg). Device names follow the Lec 06 page."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from doubtfigs import BAD, INK, MUT, NM, OK, P, PM, SIG, strip  # noqa: E402
from doubtstrips import GREEN_BG, RED_BG, F, ladder  # noqa: E402
from towers import LINK, gate_link, tower  # noqa: E402

F = F


def rows(p, w, y0, items, dy=30):
    """items: plain str (muted note), ('h', text) heading, or (parts, colour, bold) equation."""
    y = y0
    for it in items:
        if isinstance(it, str):
            p.t(w / 2, y, it, 12, MUT, 'middle')
        elif it[0] == 'h':
            p.t(w / 2, y, it[1], 13, INK, 'middle', True)
        else:
            parts, col, bold = it
            p.eq(w / 2, y, parts, 13.5, col, bold)
        y += dy
    return p


# 1 ── the tools Lec 6 assumes ─────────────────────────────────────────────────
def start():
    w, h = 260, 250
    a = P(0)
    a.t(w / 2 + 8, 26, 'NMOS fence', 13, NM, 'middle', True)
    a.fet(70, 130, '', 'G', glen=14)
    a.t(78, 108, 'D', 12, NM, bold=True)
    a.t(78, 160, 'S', 12, NM, bold=True)
    a.box(150, 56, 14, 104, GREEN_BG, OK, 2)
    a.box(150, 160, 14, 50, RED_BG, BAD, 2)
    a.w(144, 96, 170, 96, col=INK, wd=1.6)
    a.t(174, 100, 'V_G', 12)
    a.w(144, 160, 170, 160, col=SIG, wd=2)
    a.t(174, 164, 'V_G − V_th', 12, SIG)
    a.t(174, 76, 'drain OK', 11.5, OK, bold=True)
    a.t(174, 196, 'triode', 11.5, BAD, bold=True)
    a.eq(w / 2, 236, ['V_D ≥ V_G − V_th'], 14, NM, True)

    b = P(0)
    b.t(w / 2 + 8, 26, 'PMOS fence (mirror image)', 13, PM, 'middle', True)
    b.fet(70, 130, '', 'G', p=True, glen=14)
    b.t(78, 108, 'S', 12, PM, bold=True)
    b.t(78, 160, 'D', 12, PM, bold=True)
    b.box(150, 56, 14, 44, RED_BG, BAD, 2)
    b.box(150, 100, 14, 110, GREEN_BG, OK, 2)
    b.w(144, 100, 170, 100, col=SIG, wd=2)
    b.t(174, 104, 'V_G + |V_th|', 12, SIG)
    b.w(144, 156, 170, 156, col=INK, wd=1.6)
    b.t(174, 160, 'V_G', 12)
    b.t(174, 76, 'triode', 11.5, BAD, bold=True)
    b.t(174, 196, 'drain OK', 11.5, OK, bold=True)
    b.eq(w / 2, 236, ['V_D ≤ V_G + |V_th|'], 14, PM, True)

    c = P(0)
    c.t(w / 2 + 8, 24, 'Check vs link (one PMOS)', 13, INK, 'middle', True)
    c.vdd(60, 140, 50, 'source')
    c.fet(100, 110, 'M', '', p=True, glen=14)
    c.t(108, 152, 'drain', 11.5, MUT)
    c.w(150, 54, 150, 136, col=BAD, wd=1.8)
    c.w(145, 54, 155, 54, col=BAD)
    c.w(145, 136, 155, 136, col=BAD)
    c.t(160, 88, 'CHECK', 12, BAD, bold=True)
    c.t(160, 104, 'source→drain', 11, BAD)
    c.t(160, 120, '≥ |V_ov| (0.2)', 11, BAD)
    c.w(100, 56, 54, 56, 54, 104, col=LINK, wd=1.6, dash='4 3')
    c.o.append(f'<polygon points="54,110 50,102 58,102" fill="{LINK}"/>')
    c.t(10, 140, 'LINK', 12, LINK, bold=True)
    c.t(10, 156, 'source→gate', 11, LINK)
    c.t(10, 172, '= |V_GS| (0.7)', 11, LINK)
    c.t(w / 2, 206, 'a check can fail (triode)', 11.5, BAD, 'middle', True)
    c.t(w / 2, 224, 'a link is fixed: it moves the gate', 11.5, LINK, 'middle', True)
    c.t(w / 2, 242, 'with its source, always 0.7 apart', 11.5, LINK, 'middle')

    d = rows(P(0), w, 30, [
        ('h', 'Gain by “two looks”'),
        (['A_v = G_m (R_up ∥ R_down)'], SIG, True),
        'G_m ≈ g_m of the input device',
        ('h', 'a cascode multiplies what is under it'),
        (['R = g_m r_O × (R under it)'], NM, True),
        'into a source you see only ≈ 1/g_m (small),',
        'so signal current goes into the source',
    ], 31)
    strip('s-lec06-start', [a, b, c, d], ['A gate can sit up to V_th above an NMOS drain', 'A gate can sit up to |V_th| below a PMOS drain',
                                          'Checks give where a node may go; the link reaches the gate', 'Every gain in Lec 1–8 is read off this way'], w, h,
          'Starting at Lec 6? The four tools every step uses', 'Every CM limit and swing = a walk from one rail, using these fences', step_arrow=False)


# 2 ── PMOS-input folded cascode, CM range ────────────────────────────────────
def pfold_circuit(p):
    p.vdd(20, 230, 20)
    p.fet(80, 50, 'M11', 'V_b5', p=True, glen=12)
    p.w(80, 20, 80, 20)
    p.fet(80, 120, 'M1', 'V_in1', p=True, glen=12)
    p.w(80, 80, 80, 90)
    p.w(80, 150, 80, 200, 180, 200, col=SIG, wd=2)
    p.fet(180, 50, 'M7', 'V_b4', p=True, gate_right=True, namepos='l')
    p.fet(180, 110, 'M5', 'V_b3', p=True, gate_right=True, namepos='l')
    p.dot(180, 140)
    p.t(172, 144, 'V_out', 12, SIG, 'end', True)
    p.fet(180, 170, 'M3', 'V_b2', gate_right=True, namepos='l')
    p.dot(180, 200)
    p.fet(180, 230, 'M9', 'V_b1', gate_right=True, namepos='l')
    p.gnd(180, 260)
    p.t(128, 216, 'fold ≈ V_ov9', 11.5, BAD, 'middle', True)


def nfold():
    w, h = 270, 290
    a = P(0)
    a.vdd(20, 230, 20)
    a.fet(180, 50, 'M10', 'V_b4', p=True, gate_right=True, namepos='l')
    a.dot(180, 80)
    a.fet(180, 110, 'M8', 'V_b3', p=True, gate_right=True, namepos='l')
    a.dot(180, 140)
    a.t(172, 144, 'V_out', 12, SIG, 'end', True)
    a.fet(180, 170, 'M6', 'V_b2', gate_right=True, namepos='l')
    a.fet(180, 230, 'M4', 'V_b1', gate_right=True, namepos='l')
    a.gnd(180, 260)
    a.w(180, 80, 80, 80, 80, 100, col=SIG, wd=2)
    a.t(130, 72, 'fold node', 11.5, BAD, 'middle', True)
    a.fet(80, 130, 'M2', 'V_in2', glen=12)
    a.w(80, 160, 80, 180)
    a.fet(80, 210, 'M11', 'V_b5', glen=12)
    a.gnd(80, 240)

    b = rows(P(0), w, 34, [
        ('h', 'look up: the fold node is on top now'),
        (['R_up = g_m8 r_O8 (r_O10 ∥ r_O2)'], PM, True),
        'two r_O hang on the fold node, as before',
        ('h', 'look down: a plain NMOS cascode'),
        (['R_down = g_m6 r_O6 r_O4'], NM, True),
        ('h', 'gain'),
        (['A_v = g_m1,2 (R_up ∥ R_down)'], SIG, True),
    ], 33)

    c = P(0)
    c.t(w / 2 + 8, 22, 'Ceiling: V_in up → S up → M2 squeezed', 13, INK, 'middle', True)
    sc = 95
    ys = tower(c, 140, 245, [(1.4, 'tail', 'ok', '1.4 plenty'), (0.2, 'M2', 'sq', '0.2 squeezed'), (0.2, 'M10', 'min', '0.2')], sc, w=50,
               nodes=['0', 'S 1.4', '', '1.8'])
    c.t(135, 245 - 1.6 * sc + 2, 'fold 1.6', 10.5, INK, 'end')
    gate_link(c, 140, ys[1], 245 - 2.1 * sc, 'V_in 2.1 (above V_DD!)', lx=8)
    c.t(w / 2, 268, 'V_in = S + 0.7 = 1.4 + 0.7 = 2.1 V', 11.5, LINK, 'middle', True)
    c.t(w / 2, 288, 'floor: tail squeezed, S = 0.2 → V_in = 0.9 V', 11.5, BAD, 'middle', True)

    d = rows(P(0), w, 40, [
        ('h', 'One rule for both versions'),
        'the input pair’s drain sits near',
        'the OPPOSITE rail (the fold node)',
        (['PMOS input → floor below 0 V'], PM, True),
        (['NMOS input → ceiling above V_DD'], NM, True),
        'the other limit is the usual',
        'tail + V_GS walk',
    ], 30)
    strip('s-lec06-nfold', [a, b, c, d], ['NMOS-input folded cascode, right half (names as on your page)', 'Gain by the same two looks',
                                          'Ceiling 1.6 − 0.2 + 0.7 = 2.1 V; floor 0.2 + 0.7 = 0.9 V', 'Which rail each version can pass'], w, h,
          'NMOS-input folded cascode: the mirror image', 'Swap NMOS ↔ PMOS and every limit flips to the other rail')


# 4 ── rail-to-rail input ─────────────────────────────────────────────────────
def r2r():
    w, h = 270, 250
    a = P(0)
    a.vdd(10, 240, 22)
    a.w(10, 236, 250, 236, wd=2.2)
    a.t(254, 240, '0', 11, MUT)
    a.box(10, 46, 112, 54, '#eeeaf8', NM)
    a.t(66, 68, 'NMOS pair', 12.5, NM, 'middle', True)
    a.t(66, 86, 'M1, M2', 12, NM, 'middle')
    a.box(10, 162, 112, 54, '#e2f2f0', PM)
    a.t(66, 184, 'PMOS pair', 12.5, PM, 'middle', True)
    a.t(66, 202, 'M3, M4', 12, PM, 'middle')
    a.box(160, 52, 92, 156, '#f3efe6', '#c9c2b2')
    a.t(206, 116, 'cascode', 12.5, INK, 'middle', True)
    a.t(206, 132, 'branches', 12.5, INK, 'middle', True)
    a.t(206, 150, 'M5–M12', 12, MUT, 'middle')
    a.arrow(122, 72, 158, 72, NM)
    a.arrow(122, 190, 158, 190, PM)
    a.t(140, 64, 'fold', 10.5, NM, 'middle')
    a.t(140, 182, 'fold', 10.5, PM, 'middle')
    a.t(66, 136, 'same V_in1, V_in2', 12, SIG, 'middle', True)
    a.arrow(66, 124, 66, 102, SIG, 1.5)
    a.arrow(66, 142, 66, 160, SIG, 1.5)

    b = P(0)
    b.t(w / 2 + 8, 26, 'Which pair is on?', 13, INK, 'middle', True)
    b.box(22, 66, 150, 22, '#e2f2f0', PM, 4)
    b.t(30, 81, 'PMOS pair works', 12, PM, bold=True)
    b.box(100, 112, 150, 22, '#eeeaf8', NM, 4)
    b.t(242, 127, 'NMOS pair works', 12, NM, 'end', True)
    b.axes(30, 170, 252, 170)
    b.t(30, 188, '0', 11, MUT, 'middle')
    b.t(240, 188, 'V_DD', 11, MUT, 'middle')
    b.t(135, 188, 'input CM →', 11, MUT, 'middle')
    for x0, x1, txt in ((30, 100, 'PMOS only'), (100, 172, 'both'), (172, 250, 'NMOS only')):
        b.w(x0 + 3, 205, x1 - 3, 205, col=MUT, wd=1.2)
        b.t((x0 + x1) / 2, 222, txt, 11.5, INK, 'middle')
    b.w(100, 60, 100, 170, col=MUT, wd=1, dash='3 3')
    b.w(172, 60, 172, 170, col=MUT, wd=1, dash='3 3')

    c = P(0)
    c.t(w / 2 + 8, 26, 'G_m (and gain) vs input CM', 13, INK, 'middle', True)
    c.axes(40, 200, 252, 50, 'V_in,CM', 'G_m')
    c.w(40, 150, 100, 150, 100, 90, 172, 90, 172, 150, 250, 150, col=SIG, wd=2.4)
    c.t(34, 154, 'g_m', 12, SIG, 'end')
    c.t(34, 94, '2g_m', 12, SIG, 'end')
    c.t(136, 82, 'both on', 11.5, MUT, 'middle')
    c.t(w / 2, 232, 'the gain is NOT constant over the range', 12, BAD, 'middle', True)
    d = rows(P(0), w, 40, [
        ('h', 'Each pair’s own range (Lec 6)'),
        (['PMOS: below 0 V → V_DD − |V_ov| − |V_GS|'], PM, True),
        'its floor passes ground',
        (['NMOS: V_ov + V_GS → above V_DD'], NM, True),
        'its ceiling passes V_DD',
        ('h', 'together: 0 V → V_DD'),
        'any input CM works',
    ], 30)
    strip('s-lec06-r2r', [a, b, c, d], ['Both pairs fold into the same cascodes', 'Near 0 V the PMOS pair, near V_DD the NMOS pair',
                                        'Where both work, G_m doubles', 'Why the two ranges cover everything'], w, h,
          'Rail-to-rail input = an NMOS pair + a PMOS pair', 'Each pair covers the rail the other cannot reach', step_arrow=False)


# 5 ── folded cascode as a buffer ─────────────────────────────────────────────
def fbuf():
    w, h = 260, 260
    a = P(0)
    a.w(120, 22, 120, 60)
    a.dot(120, 46)
    a.t(112, 50, 'V_out', 12.5, SIG, 'end', True)
    a.fet(120, 90, 'M4', 'V_b2', glen=12)
    a.dot(120, 120)
    a.w(120, 120, 120, 130)
    a.fet(120, 160, 'M10', 'V_b1', glen=12)
    a.gnd(120, 190)
    a.fet(200, 100, 'M2', '', p=True, gate_right=True, namepos='l')
    a.w(200, 130, 200, 140, 120, 140, 120, 120, col=SIG, wd=1.8)
    a.w(200, 70, 200, 56)
    a.t(206, 62, 'tail', 11, MUT)
    a.w(238, 100, 248, 100, 248, 46, 120, 46, col=SIG, wd=1.8)
    a.t(186, 40, 'gate = V_out', 11.5, SIG, 'middle', True)
    a.t(136, 226, 'fold = V_b2 − V_GS4', 12, BAD, 'middle', True)
    a.arrow(136, 212, 124, 146, BAD, 1.4)

    b = rows(P(0), w, 40, [
        ('h', 'M4 (NMOS) saturated'),
        'drain ≥ gate − V_th',
        (['V_out ≥ V_b2 − V_th4'], NM, True),
        'page: 0.8 − 0.4 = 0.4 V',
        ('h', 'M2 (PMOS) saturated'),
        'drain ≤ gate + |V_th|',
        (['V_b2 − V_GS4 ≤ V_out + |V_th2|'], PM, True),
    ], 30)
    b.eq(w / 2, 250, ['⇒ V_out ≥ V_b2 − V_GS4 − |V_th2|'], 13, PM, True)

    def yv(v):
        return 215 - 150 * (v + 0.3) / 1.1
    c = P(0)
    ladder(c, 40, yv, [(0.8, 'V_b2 = 0.8 V', INK), (0.4, 'M4 floor = 0.4 V  ← binds', OK), (0, '0 V', MUT),
                       (-0.3, 'M2 floor = −0.3 V', MUT)], 'Both are floors: keep the higher', w)
    c.box(46, yv(0.8) - 2, 8, yv(0.4) - yv(0.8) + 2, GREEN_BG, OK, 2)
    c.t(w / 2 + 30, 240, 'V_out must stay above 0.4 V', 12, OK, 'middle', True)

    d = rows(P(0), w, 40, [
        ('h', 'Telescopic buffer (Lec 3–4)'),
        'M4 gives a floor, M2 gives a CEILING',
        (['window = V_th − V_ov  (tiny)'], BAD, True),
        ('h', 'Folded buffer (Lec 6)'),
        'M2’s drain is the fold node, pinned',
        'by V_b2 in another column',
        (['both are floors → wide range'], OK, True),
    ], 30)
    strip('s-lec06-fbuf', [a, b, c, d], ['Output tied to M2’s gate (the “−” input)', 'Write each device’s fence with V_out as M2’s gate',
                                         'Put both floors on one ladder', 'Why this is far better than the telescopic'], w, h,
          'Folded cascode as a unity-gain buffer', 'Two fences, both floors: the higher one is the real limit')


# 6 ── the low-voltage cascode load (M7, M8 gates tied to X) ─────────────────
def lvc():
    w, h = 270, 270
    a = P(0)
    a.vdd(20, 240, 20)
    a.fet(70, 50, 'M7', '', p=True, gate_right=True, namepos='l')
    a.dot(70, 80)
    a.t(78, 86, 'P', 12.5, BAD, bold=True)
    a.fet(70, 110, 'M5', 'V_b1', p=True, glen=12)
    a.dot(70, 140)
    a.t(62, 158, 'X', 12.5, BAD, 'end', True)
    a.w(70, 140, 70, 176)
    a.t(70, 192, 'to M3, M1', 11, MUT, 'middle')
    a.fet(200, 50, 'M8', '', p=True)
    a.fet(200, 110, 'M6', 'V_b1', p=True, glen=8)
    a.dot(200, 140)
    a.t(208, 144, 'V_out', 12, SIG, bold=True)
    a.w(200, 140, 200, 176)
    a.t(200, 192, 'to M4, M2', 11, MUT, 'middle')
    a.w(108, 50, 162, 50, col=SIG, wd=1.8)
    a.dot(135, 50, col=SIG)
    a.w(135, 50, 135, 140, 70, 140, col=SIG, wd=1.8)
    a.t(135, 226, 'gates of M7, M8 tied to X', 12, SIG, 'middle', True)
    a.t(135, 244, '(not a diode on M7)', 11.5, MUT, 'middle')

    def yv(v):
        return 236 - 190 * v
    b = P(0)
    ladder(b, 40, yv, [(1, 'V_DD', INK), (0.86, 'P max = V_DD − |V_ov7|', PM), (0.58, 'X = V_DD − |V_GS7|', BAD),
                       (0.3, 'V_b1 min = X − |V_th5|', SIG), (0, '0 V', MUT)], 'The voltages, top down', w)
    b.arrow(52, yv(0.58) + 2, 52, yv(0.3) - 2, SIG, 1.4)

    c = rows(P(0), w, 36, [
        ('h', 'M5 saturated (PMOS fence)'),
        'drain X ≤ gate V_b1 + |V_th5|',
        (['V_b1 ≥ V_DD − |V_GS7| − |V_th5|'], SIG, True),
        ('h', 'M7 saturated'),
        'its drain P keeps |V_ov7| from V_DD',
        (['P ≤ V_DD − |V_ov7|'], PM, True),
        (['= V_DD − |V_GS7| + |V_th7|'], PM, False),
    ], 30)

    d = rows(P(0), w, 40, [
        ('h', 'Lec 3: diode-stack cascode mirror'),
        (['V_out,max = V_DD − |V_ov8| − |V_ov6| − |V_thp|'], BAD, False),
        'one |V_thp| of swing lost (the diode tax)',
        ('h', 'This load, V_b1 near its top'),
        (['V_out,max = V_DD − |V_ov8| − |V_ov6|'], OK, True),
        'the |V_thp| tax is gone',
    ], 34)
    strip('s-lec06-lvc', [a, b, c, d], ['The top of your telescopic: M7, M8 gates go to X', 'X is set by M7; V_b1 sits one |V_th| below X',
                                        'Two fences give V_b1 its range', 'Why bother: full swing at the top'], w, h,
          'The low-voltage cascode load (last circuit on your Lec 6 page)', 'V_b1 between its two fences = cascode load without the diode tax')


# 7 ── gain = Gm × Rout ───────────────────────────────────────────────────────
def gmrout():
    w, h = 260, 230
    a = P(0)
    a.t(w / 2 + 8, 26, 'Any amplifier, seen from the output', 13, INK, 'middle', True)
    a.w(80, 70, 180, 70)
    a.dot(180, 70)
    a.t(188, 66, 'v_out', 12.5, SIG, bold=True)
    a.w(80, 70, 80, 106)
    a.gmsrc(80, 120, 'G_m v_in')
    a.w(80, 134, 80, 180, 180, 180)
    a.res(180, 70, 180, 'R_out', NM)
    a.gnd(130, 180)
    a.eq(w / 2, 216, ['A_v = ', F('v_out', 'v_in'), ' = G_m R_out'], 14, SIG, True)

    b = rows(P(0), w, 36, [
        ('h', 'Which factor can grow?'),
        (['G_m ≈ g_m = ', F('2I_D', 'V_ov')], MUT, False),
        'more G_m costs current (power)',
        (['R_out: each cascode × g_m r_O'], NM, True),
        'but each one costs a V_ov of swing',
        ('h', 'Lec 7: add a 2nd stage'),
        ('h', 'Lec 7–8: boost R_out by (1 + A_1)'),
    ], 28)
    strip('s-lec06-gmrout', [a, b], ['A current G_m v_in pushed into R_out', 'R_out is the factor to raise'], w, h,
          'Gain boosting starts here: A_v = G_m R_out', 'More gain = bigger R_out without stacking more devices')


def main():
    for f in (start, nfold, r2r, fbuf, lvc, gmrout):
        f()


if __name__ == '__main__':
    main()
    print('ok')
