"""Simplification strips (lecture order): full circuit ⇒ simpler pictures ⇒ the formula, with real fractions.
Run: python3 scripts/doubtstrips.py  (writes src/assets/doubts/s-*.svg). Part 2 (Lec 7–17) is doubtstrips2.py."""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from doubtfigs import BAD, INK, MUT, NM, OK, P, PM, SIG, strip  # noqa: E402

W, H = 240, 290
F = lambda n, d: ('f', n, d)  # noqa: E731
GREEN_BG, RED_BG, AMB_BG, NM_BG, PM_BG = '#e2f1e7', '#f9e3df', '#fbeadf', '#eeeaf8', '#e2f2f0'


def eqpanel(rows, y0=48, dy=40, size=15, width=None):
    """rows: list of (parts, colour, bold) or plain strings (muted notes)."""
    w = width or W
    p = P(0)
    for i, r in enumerate(rows):
        if isinstance(r, str):
            p.t(w / 2, y0 + i * dy, r, 13, MUT, 'middle')
        else:
            parts, col, bold = r
            p.eq(w / 2, y0 + i * dy, parts, size, col, bold)
    return p


def ladder(p, x, y_of, marks, title, w=None):
    p.t((w or W) / 2 + 8, 26, title, 13, INK, 'middle', True)
    lo = min(0, min(v for v, _, _ in marks))
    hi = max(1, max(v for v, _, _ in marks))
    p.w(x, y_of(lo), x, y_of(hi), col=MUT, wd=2)
    for v, txt, col in marks:
        y = y_of(v)
        p.w(x - 8, y, x + 8, y, col=col, wd=2)
        p.t(x + 14, y + 4, txt, 12, col)


def opamp(p, x, y, label=''):
    p.w(x, y - 35, x, y + 35, x + 60, y, x, y - 35, wd=1.8)
    p.t(x + 6, y - 13, '+', 14)
    p.t(x + 6, y + 23, '−', 14)
    if label:
        p.t(x + 22, y + 5, label, 11, MUT)


# ── Lec 01 ────────────────────────────────────────────────────────────────────
def lec01():
    a = P(0)
    x, y = 60, 110
    opamp(a, x, y)
    a.w(14, y - 17.5, x, y - 17.5)
    a.t(14, y - 24, 'V_in', 13)
    a.w(x + 60, y, 210, y)
    a.dot(170, y)
    a.t(210, y - 8, 'V_out', 13, anchor='end')
    a.res(170, y, y + 56, 'R_1')
    a.dot(170, y + 56)
    a.res(170, y + 56, y + 112, 'R_2')
    a.gnd(170, y + 112)
    a.w(170, y + 56, 40, y + 56, 40, y + 17.5, x, y + 17.5, col=SIG, wd=2)
    a.t(48, y + 74, 'V_f = βV_out', 12, SIG)
    a.eq(100, 268, ['β = ', F('R_2', 'R_1 + R_2')], 14, SIG, True)
    b = P(0)
    b.o.append(f'<circle cx="50" cy="110" r="14" fill="#fff" stroke="{INK}" stroke-width="1.6"/>')
    b.t(50, 115, 'Σ', 14, anchor='middle')
    b.arrow(8, 110, 34, 110, col=INK)
    b.t(8, 100, 'V_in', 12)
    b.box(84, 88, 60, 44, NM_BG, NM)
    b.t(114, 116, 'A', 18, NM, 'middle', True)
    b.arrow(64, 110, 82, 110, col=INK)
    b.arrow(144, 110, 228, 110, col=INK)
    b.t(226, 100, 'V_out', 12, anchor='end')
    b.box(84, 170, 60, 40, AMB_BG, SIG)
    b.t(114, 196, 'β', 18, SIG, 'middle', True)
    b.w(200, 110, 200, 190, 146, 190, col=SIG, wd=1.8)
    b.w(84, 190, 50, 190, col=SIG, wd=1.8)
    b.arrow(50, 190, 50, 126, col=SIG)
    b.t(56, 146, '−', 16, SIG)
    b.t(W / 2, 250, 'the op amp sees only the error', 12, MUT, 'middle')
    b.t(W / 2, 266, 'V_in − βV_out', 12, MUT, 'middle')
    c = eqpanel([(['V_out = A(V_in − βV_out)'], INK, False), (['A_closed = ', F('A', '1 + βA')], NM, True),
                 (['ideal = ', F('1', 'β'), ' = 1 + ', F('R_1', 'R_2')], INK, False), (['error ε = ', F('1', '1 + βA'), ' ≈ ', F('1', 'βA')], SIG, True),
                 'gain 10, ε = 1 %  →  A ≥ 1000'], y0=46, dy=52)
    strip('s-lec01-feedback', [a, b, c], ['The circuit: R₁ and R₂ send a fraction β of V_out back to the − input',
                                         'The same loop as blocks', 'One line of algebra'], W, H,
          'Feedback in three pictures', 'Resistors set the gain (1/β); A only decides how close you get (ε ≈ 1/βA)', cols=2)


# ── Lec 02 ────────────────────────────────────────────────────────────────────
def lec02_cmdm():
    a = P(0)
    a.axes(20, 250, 225, 40, 't', 'volts')
    a.w(20, 145, 196, 145, col=MUT, dash='5 4')
    a.t(200, 149, 'V_CM', 12, MUT, 'start', True)
    a.curve(lambda x: 145 - 50 * math.sin((x - 20) / 28), 20, 196, col=NM)
    a.curve(lambda x: 145 + 50 * math.sin((x - 20) / 28), 20, 196, col=PM)
    a.t(40, 80, 'V_in1', 13, NM, bold=True)
    a.t(40, 230, 'V_in2', 13, PM, bold=True)
    b = eqpanel([(['V_CM = ', F('V_in1 + V_in2', '2')], INK, True), 'the level both inputs share',
                 (['v_d = V_in1 − V_in2'], SIG, True), 'the signal: their difference',
                 (['V_in1 = V_CM + ', F('v_d', '2')], NM, False), (['V_in2 = V_CM − ', F('v_d', '2')], PM, False)], y0=46, dy=40, size=14)
    c = P(0)
    c.t(W / 2, 26, 'what each one does to the pair', 13, INK, 'middle', True)
    c.box(14, 44, 100, 170, '#fbfaf7', '#d8d2c4')
    c.box(126, 44, 100, 170, '#fbfaf7', '#d8d2c4')
    c.t(64, 64, 'move V_CM', 12, INK, 'middle', True)
    c.arrow(44, 122, 44, 92, NM)
    c.arrow(84, 122, 84, 92, PM)
    c.t(64, 142, 'both gates ↑', 11.5, MUT, 'middle')
    c.t(64, 162, 'currents stay', 11, MUT, 'middle')
    c.eq(64, 196, [F('I_SS', '2'), ' each'], 13, OK, True)
    c.t(176, 64, 'apply v_d', 12, INK, 'middle', True)
    c.arrow(156, 122, 156, 92, NM)
    c.arrow(196, 92, 196, 122, PM)
    c.t(176, 142, 'one ↑, one ↓', 11.5, MUT, 'middle')
    c.t(176, 162, 'current steered', 11, MUT, 'middle')
    c.eq(176, 196, ['± ', F('g_m v_d', '2')], 13, SIG, True)
    c.t(W / 2, 244, 'V_CM: sets the bias & the CM range', 12, INK, 'middle')
    c.t(W / 2, 264, 'v_d: the signal that is amplified', 12, SIG, 'middle', True)
    strip('s-lec02-cmdm', [a, b, c], ['Two inputs = a shared level (V_CM) + a difference (v_d)', 'The definitions', 'The tail fixes the sum, so only v_d steers current'], W, H,
          'What V_CM and v_d mean', 'Common mode = the average of the two inputs; differential = their difference', cols=2)


def lec02_pair():
    a = P(0)
    a.vdd(40, 200, 34)
    a.fet(60, 64, 'M3', 'V_b', p=True)
    a.fet(180, 64, 'M4', 'V_b', p=True, gate_right=True, namepos='l')
    a.w(60, 94, 60, 130)
    a.w(180, 94, 180, 130)
    a.dot(60, 112)
    a.dot(180, 112)
    a.t(52, 116, 'V_out1', 11, anchor='end')
    a.t(188, 116, 'V_out2', 11)
    a.fet(60, 160, 'M1', 'V_in1')
    a.fet(180, 160, 'M2', 'V_in2', gate_right=True, namepos='l')
    a.w(60, 190, 60, 205, 180, 205, 180, 190)
    a.dot(120, 205)
    a.t(126, 200, 'P', 12, BAD, bold=True)
    a.w(120, 205, 120, 222)
    a.isrc(120, 234, 'I_SS')
    a.gnd(120, 246)
    b = P(0)
    b.vdd(60, 160, 34)
    b.fet(110, 64, 'M3', 'V_b', p=True)
    b.w(110, 94, 110, 130)
    b.dot(110, 112)
    b.t(118, 116, 'v_out1', 12, SIG)
    b.fet(110, 160, 'M1', '+v_d/2')
    b.w(110, 190, 110, 205)
    b.gnd(110, 205)
    b.t(122, 214, 'P = AC ground', 12, BAD)
    b.t(W / 2, 262, 'one side +i, the other −i: P never moves', 11, MUT, 'middle')
    c = P(0)
    c.w(30, 70, 210, 70)
    c.dot(120, 70)
    c.t(120, 60, 'v_out1', 12, SIG, 'middle')
    c.gmsrc(50, 120, '')
    c.eq(50, 168, [F('g_m v_d', '2')], 12, SIG)
    c.w(50, 70, 50, 106)
    c.w(50, 134, 50, 142)
    c.w(50, 180, 50, 210)
    c.res(130, 70, 210, 'r_O1')
    c.res(185, 70, 210, 'r_O3')
    c.w(30, 210, 210, 210)
    c.gnd(120, 210)
    c.t(W / 2, 258, 'r_O down ∥ r_O up', 12, MUT, 'middle')
    d = eqpanel([(['A_v = g_m1(r_O1 ∥ r_O3)'], NM, True), 'g_m1,2 = g_m of M1 or M2 (equal)',
                 (['pole: ', F('1', '(r_O1 ∥ r_O3) C_L')], SIG, True), 'gain written as a size (no − sign)'], y0=58, dy=54, size=14)
    strip('s-lec02-pair', [a, b, c, d], ['Fully differential pair, PMOS current-source loads', 'Half circuit: P does not move, so ground it',
                                          'Small signal: a current into r_O ∥ r_O', 'Read the answer off the picture'], W, H,
          'Differential pair: full circuit ⇒ one line', 'Every gain: A_v = G_m × R_out (current made × resistance it meets)')


def lec02_swing():
    a = P(0)
    a.axes(20, 250, 225, 40, 't', '')
    a.w(20, 145, 222, 145, col=MUT, dash='5 4')
    a.t(200, 149, 'CM', 12, MUT)
    a.curve(lambda x: 145 - 45 * math.sin((x - 20) / 28), 20, 196, col=NM)
    a.curve(lambda x: 145 + 45 * math.sin((x - 20) / 28), 20, 196, col=PM)
    a.t(44, 86, 'V_out1: ± s', 12, NM, bold=True)
    a.t(44, 222, 'V_out2: ∓ s', 12, PM, bold=True)
    b = P(0)
    b.axes(20, 250, 225, 40, 't', '')
    b.w(20, 145, 222, 145, col=MUT, dash='5 4')
    b.t(222, 138, '0', 12, MUT, 'end')
    b.curve(lambda x: 145 - 90 * math.sin((x - 20) / 30), 20, 222, col=SIG)
    b.t(60, 44, 'V_out1 − V_out2: ± 2s', 12, SIG, bold=True)
    strip('s-lec02-swing', [a, b], ['The outputs move by the same amount, in opposite directions', 'Their difference moves twice as far'], W, 270,
          'Why the differential swing is doubled', 'Differential swing = 2 × one output’s range')


def lec02_ota():
    a = P(0)
    a.vdd(40, 200, 34)
    a.fet(60, 64, 'M3', '', p=True, gate_right=True, namepos='l', glen=12)
    a.fet(180, 64, 'M4', '', p=True, namepos='r', glen=12)
    a.w(90, 64, 150, 64, col=PM)
    a.w(104, 64, 104, 86, 60, 86, col=PM)
    a.dot(104, 64, col=PM)
    a.dot(60, 86, col=PM)
    a.w(60, 94, 60, 130)
    a.w(180, 94, 180, 130)
    a.dot(180, 112)
    a.w(180, 112, 222, 112)
    a.t(222, 104, 'V_out', 12, anchor='end')
    a.fet(60, 160, 'M1', 'V_in1')
    a.t(22, 182, '(+)', 12, NM, 'middle', True)
    a.fet(180, 160, 'M2', 'V_in2', gate_right=True, namepos='l')
    a.t(218, 182, '(−)', 12, NM, 'middle', True)
    a.w(60, 190, 60, 205, 180, 205, 180, 190)
    a.w(120, 205, 120, 222)
    a.isrc(120, 234, 'M5')
    a.gnd(120, 246)
    a.arrow(46, 100, 46, 128, SIG)
    a.t(42, 120, '+i', 12, SIG, 'end', True)
    a.arrow(166, 98, 166, 126, SIG)
    a.t(162, 120, '+i', 12, SIG, 'end', True)
    a.arrow(166, 196, 166, 178, SIG)
    a.t(162, 192, '−i', 12, SIG, 'end', True)
    b = P(0)
    b.w(40, 110, 200, 110)
    b.dot(120, 110)
    b.t(76, 132, 'V_out node', 12, anchor='middle')
    b.arrow(70, 50, 100, 104, SIG)
    b.t(46, 46, 'M4 copies M1: +i in', 12, SIG)
    b.arrow(140, 116, 172, 176, SIG)
    b.t(132, 196, 'M2 takes i less out', 12, SIG)
    b.t(132, 212, '= another +i in', 12, SIG)
    b.box(40, 230, 160, 36, GREEN_BG, OK)
    b.t(120, 253, 'into V_out: 2i = g_m v_d', 13, OK, 'middle', True)
    c = P(0)
    c.w(30, 80, 210, 80)
    c.dot(120, 80)
    c.t(120, 70, 'V_out', 12, SIG, 'middle')
    c.gmsrc(45, 140, 'g_m v_d')
    c.w(45, 80, 45, 126)
    c.w(45, 154, 45, 210)
    c.res(112, 80, 210, 'r_O2')
    c.res(160, 80, 210, 'r_O4')
    c.cap(205, 80, '')
    c.t(214, 102, 'C_L', 12)
    c.w(30, 210, 180, 210)
    c.gnd(112, 210)
    d = eqpanel([(['G_m = g_m'], OK, True), (['A_v = g_m(r_O2 ∥ r_O4)'], NM, True), (['pole: ', F('1', '(r_O2 ∥ r_O4) C_L')], SIG, True),
                 'V_in1 (diode side) = +,  V_in2 = −', '→ a buffer feeds V_out to M2'], y0=48, dy=46, size=14)
    strip('s-lec02-ota', [a, b, c, d], ['Follow a small v_d through the circuit', 'At the output both halves add',
                                         'Norton picture of the output node', 'Facts to keep'], W, H,
          'Five-transistor OTA: where the signal current goes', 'The mirror adds the two halves: A_v = g_m(r_O2 ∥ r_O4)')


# ── Lec 03 ────────────────────────────────────────────────────────────────────
def lec03_buffer():
    a = P(0)
    x, y = 60, 110
    opamp(a, x, y, label='5-T')
    a.w(14, y - 17.5, x, y - 17.5)
    a.t(14, y - 24, 'V_in', 12)
    a.w(x + 60, y, 210, y)
    a.dot(170, y)
    a.t(210, y - 8, 'V_out', 12, anchor='end')
    a.w(170, y, 170, y + 70, 40, y + 70, 40, y + 17.5, x, y + 17.5, col=SIG, wd=2)
    a.t(105, y + 88, 'β = 1: V_out → M2’s gate (−)', 12, SIG, 'middle', True)
    a.eq(W / 2, 262, ['miss ≈ ', F('1', 'A'), ' = ', F('1', '25'), ' = 4 %'], 13, MUT)
    b = P(0)
    b.o.append(f'<circle cx="50" cy="150" r="16" fill="#fff" stroke="{INK}" stroke-width="1.6"/>')
    b.t(50, 146, '+', 11, anchor='middle')
    b.t(50, 162, '−', 11, anchor='middle')
    b.t(8, 194, '≈ V_in', 12)
    b.w(50, 134, 50, 100, 70, 100)
    b.resh(70, 150, 100, '', SIG)
    b.w(150, 100, 200, 100)
    b.dot(200, 100)
    b.t(200, 90, 'V_out', 12, anchor='middle')
    b.res(200, 100, 170, 'R_L')
    b.w(50, 166, 50, 210, 200, 210, 200, 170)
    b.gnd(125, 210)
    b.eq(W / 2, 50, ['R_out = ', F('r_O2 ∥ r_O4', '1 + A'), ' ≈ ', F('1', 'g_m2')], 14, SIG, True)
    c = P(0)
    c.axes(30, 220, 222, 40, 'ω', '|A|')
    c.w(30, 70, 80, 70, 200, 205, col=NM, wd=2)
    c.t(84, 64, 'open loop', 11.5, NM)
    c.w(30, 205, 182, 205, 200, 216, col=SIG, wd=2.4)
    c.t(150, 196, 'closed loop', 11.5, SIG, 'middle', True)
    c.eq(W / 2, 266, ['pole → ', F('g_m2', 'C_L'), ' = GBW'], 14, OK, True)
    strip('s-lec03-buffer', [a, b, c], ['The 5-T OTA as a buffer: feedback to the − input (M2)', 'What a load sees: V_in behind a tiny resistance',
                                         'Same C_L, R shrank by (1 + A): faster'], W, H,
          'Unity-gain buffer: why V_out = V_in, stiff and fast', 'Feedback divides R_out by (1 + βA) and multiplies the bandwidth by the same factor', cols=2)


def lec03_tele():
    a = P(0)
    a.vdd(70, 170, 20)
    a.fet(120, 50, 'M8', 'V_b3', p=True)
    a.fet(120, 110, 'M6', 'V_b2', p=True)
    a.dot(120, 140)
    a.t(128, 144, 'V_out', 12, SIG)
    a.fet(120, 170, 'M4', 'V_b1')
    a.dot(120, 200)
    a.t(128, 204, 'X', 12, BAD, bold=True)
    a.fet(120, 230, 'M2', 'v_in')
    a.gnd(120, 260)
    b = P(0)
    b.t(60, 22, 'look down', 12, NM, 'middle', True)
    b.fet(60, 80, 'M4', '')
    b.res(60, 110, 170, 'r_O2', NM)
    b.gnd(60, 170)
    b.arrow(60, 30, 60, 46, NM)
    b.t(60, 216, 'R_down =', 12, NM, 'middle')
    b.t(60, 232, 'g_m4 r_O4 r_O2', 12, NM, 'middle', True)
    b.t(180, 22, 'look up', 12, PM, 'middle', True)
    b.vdd(150, 210, 40)
    b.res(180, 40, 100, 'r_O8', PM)
    b.fet(180, 130, 'M6', '', p=True, gate_right=True, namepos='l')
    b.arrow(180, 190, 180, 166, PM)
    b.t(180, 216, 'R_up =', 12, PM, 'middle')
    b.t(180, 232, 'g_m6 r_O6 r_O8', 12, PM, 'middle', True)
    b.t(120, 266, 'r_O under a source looks g_m r_O bigger', 11, MUT, 'middle')
    c = P(0)
    c.w(30, 80, 210, 80)
    c.dot(120, 80)
    c.t(120, 70, 'V_out', 12, SIG, 'middle')
    c.gmsrc(45, 140, 'g_m2 v_in')
    c.w(45, 80, 45, 126)
    c.w(45, 154, 45, 210)
    c.res(120, 80, 210, 'R_down', NM)
    c.res(180, 80, 210, 'R_up', PM)
    c.w(30, 210, 200, 210)
    c.gnd(120, 210)
    d = eqpanel([(['A = g_m(R_down ∥ R_up)'], NM, True), (['R_down ≈ R_up ≈ g_m r_O^2'], INK, False), 'two equal resistors in ∥ = half',
                 (['A = ', F('(g_m r_O)^2', '2')], SIG, True), 'g_m r_O = 50  →  A ≈ 1250 (5-T: 25)'], y0=50, dy=48, size=14)
    strip('s-lec03-tele', [a, b, c, d], ['One half of the telescopic: five devices in one column', '“Up multiplies”: a cascode multiplies what is under it by g_m r_O',
                                          'Output node: g_m v_in into R_down ∥ R_up', 'Square the intrinsic gain, then halve'], W, H,
          'Telescopic cascode gain, simplified', 'Cascoding keeps G_m = g_m and multiplies R_out by g_m r_O on both sides')


def lec03_headroom():
    sc = 62
    cols = [
        ('5-T OTA', [(0.3, 'M5 tail', NM_BG, NM), (0.3, 'M2', NM_BG, NM), (2.1, 'room 2.1 V', GREEN_BG, OK), (0.3, 'M4', PM_BG, PM)]),
        ('telescopic', [(0.3, 'tail', NM_BG, NM), (0.3, 'M2', NM_BG, NM), (0.3, 'M4', NM_BG, NM), (1.5, 'room 1.5 V', GREEN_BG, OK), (0.3, 'M6', PM_BG, PM), (0.3, 'M8', PM_BG, PM)]),
        ('+ diode mirror', [(0.3, 'tail', NM_BG, NM), (0.3, 'M2', NM_BG, NM), (0.3, 'M4', NM_BG, NM), (0.8, 'room 0.8 V', GREEN_BG, OK), (0.3, 'M6', PM_BG, PM), (0.7, 'tax |V_thp|', RED_BG, BAD), (0.3, 'M8', PM_BG, PM)]),
    ]
    p = P(0)
    base = 250
    p.w(20, base - 3 * sc, 500, base - 3 * sc, col=INK, dash='5 4')
    p.t(504, base - 3 * sc + 4, 'V_DD 3 V', 12, MUT)
    p.w(20, base, 500, base, col=INK)
    p.t(504, base + 4, '0', 12, MUT)
    for i, (name, segs) in enumerate(cols):
        x = 40 + i * 160
        p.bars(x, base, 120, segs, sc)
        p.t(x + 60, 40, name, 13, INK, 'middle', True)
    strip('s-lec03-headroom', [p], ['Each device keeps one V_ov (0.3 V here); the output lives in what is left. V_DD = 3 V, V_th = 0.7 V.'], 540, 270,
          'Gain costs headroom', 'Taller stack → more gain, less room. A diode stack wastes one extra |V_thp|', cols=1)


def lec03_vth():
    sc = 90
    a = P(0)
    a.t(W / 2, 24, 'one PMOS: what |V_th| does', 13, INK, 'middle', True)
    ys = lambda v: 260 - (v - 1.5) * sc  # noqa: E731
    a.w(60, ys(3.0), 60, ys(1.6), col=MUT, wd=2)
    for v, txt, col in ((3.0, 'source 3.0 V', INK), (2.64, 'highest drain', OK), (1.84, 'gate 1.84 V', PM)):
        a.w(52, ys(v), 68, ys(v), col=col, wd=2)
        a.t(74, ys(v) + 4, txt, 12, col, bold=True)
    a.o.append(f'<rect x="30" y="{ys(3.0)}" width="16" height="{(3.0 - 2.64) * sc}" fill="{AMB_BG}" stroke="{SIG}"/>')
    a.t(26, ys(2.82) + 4, '|V_ov|', 11, SIG, 'end')
    a.o.append(f'<rect x="30" y="{ys(2.64)}" width="16" height="{(2.64 - 1.84) * sc}" fill="{RED_BG}" stroke="{BAD}"/>')
    a.t(26, ys(2.24) + 4, '|V_th|', 11, BAD, 'end')
    a.t(74, ys(2.24) + 4, 'drain may sit here:', 11, MUT)
    a.t(74, ys(2.24) + 18, 'up to |V_th| above gate', 11, MUT)

    def stack(p, title, segs, gate_v, outmax):
        p.t(W / 2, 24, title, 13, INK, 'middle', True)
        ys2 = lambda v: 255 - v * 70  # noqa: E731
        y = ys2(3.0)
        for hgt, txt, fill, stroke in segs:
            p.o.append(f'<rect x="30" y="{y}" width="64" height="{hgt * 70}" fill="{fill}" stroke="{stroke}"/>')
            p.t(62, y + hgt * 35 + 4, txt, 11, stroke, 'middle', True)
            y += hgt * 70
        p.t(20, ys2(3.0) + 4, '3 V', 10.5, MUT, 'end')
        p.w(30, ys2(gate_v), 220, ys2(gate_v), col=PM, dash='4 3')
        p.t(222, ys2(gate_v) + 14, f'M6 gate {gate_v:.2f} V', 11, PM, 'end')
        p.arrow(140, ys2(gate_v), 140, ys2(outmax) + 2, OK, 2)
        p.t(146, (ys2(gate_v) + ys2(outmax)) / 2 + 4, '+|V_th|', 11, OK, bold=True)
        p.w(130, ys2(outmax), 222, ys2(outmax), col=OK, wd=2)
        p.t(222, ys2(outmax) - 5, f'V_out,max {outmax:.2f} V', 11, OK, 'end', True)
    b = P(0)
    stack(b, 'fully differential (V_b2 chosen)', [(0.36, 'M8 V_ov', PM_BG, PM), (0.36, 'V_ov', PM_BG, PM), (0.8, 'V_th', RED_BG, BAD)], 1.48, 2.28)
    b.t(W / 2, 280, '1 taken, 1 given back → 0 lost', 12, OK, 'middle', True)
    c = P(0)
    stack(c, 'diode stack M7, M5', [(0.36, 'V_ov', PM_BG, PM), (0.8, 'V_th', RED_BG, BAD), (0.36, 'V_ov', PM_BG, PM), (0.8, 'V_th', RED_BG, BAD)], 0.68, 1.48)
    c.t(W / 2, 280, '2 taken, 1 given back → 1 lost', 12, BAD, 'middle', True)
    strip('s-lec03-vth', [a, b, c], ['The gate pays |V_th|; the drain only needs |V_ov|', 'Walk down to M6’s gate, then back up to its drain',
                                     'Two diodes: one |V_th| never comes back = the diode tax'], W, 290,
          'The diode tax: count the V_th’s', 'Each V_GS on the way down costs a V_th; the drain gives one back. Leftover = the tax', cols=2)


def lec03_window():
    a = P(0)
    a.vdd(70, 170, 20)
    a.fet(120, 50, 'M8', 'V_b3', p=True)
    a.fet(120, 110, 'M6', 'V_b2', p=True)
    a.dot(120, 140)
    a.t(112, 136, 'V_out', 12, SIG, 'end', True)
    a.fet(120, 170, 'M4', 'V_b1')
    a.dot(120, 200)
    a.t(128, 204, 'X (pinned)', 12, BAD, bold=True)
    a.fet(120, 230, 'M2', '')
    a.gnd(120, 260)
    a.w(120, 140, 200, 140, 200, 276, 70, 276, 70, 230, 102, 230, col=OK, wd=2.2)
    a.t(206, 210, 'V_out', 11, OK)
    a.t(206, 224, '→ M2 gate', 11, OK)

    def yv(v):
        return 262 - 100 * v
    b = P(0)
    b.t(W / 2, 24, 'where V_out may sit', 13, INK, 'middle', True)
    b.o.append(f'<rect x="40" y="{yv(2.2)}" width="24" height="{yv(1.8) - yv(2.2)}" fill="{RED_BG}" stroke="{BAD}"/>')
    b.o.append(f'<rect x="40" y="{yv(1.8)}" width="24" height="{yv(1.3) - yv(1.8)}" fill="{GREEN_BG}" stroke="{OK}"/>')
    b.o.append(f'<rect x="40" y="{yv(1.3)}" width="24" height="{yv(0.9) - yv(1.3)}" fill="{RED_BG}" stroke="{BAD}"/>')
    for v, t, col in ((2.0, 'V_b1', INK), (1.8, 'ceiling = X + V_th2', SIG), (1.3, 'floor = V_b1 − V_th4', NM), (1.1, 'X = V_b1 − V_GS4', BAD)):
        b.w(64, yv(v), 74, yv(v), col=col, wd=2)
        b.t(78, yv(v) + 4, t, 12, col, bold=(col != INK))
    b.t(36, yv(2.05), 'M2', 10, BAD, 'end')
    b.t(36, yv(1.0), 'M4', 10, BAD, 'end')
    b.t(W / 2, 282, 'red = a device falls into triode', 11, MUT, 'middle')
    c = eqpanel([(['width = ceiling − floor'], INK, False), (['= (V_b1 − V_GS4 + V_th2) − (V_b1 − V_th4)'], INK, False),
                 (['= V_th − V_ov4 ≈ 0.5 V'], SIG, True), 'V_b1 cancels: it only slides the window', 'fix → fold the cascode (Lec 5)'], y0=60, dy=46, size=12.5)
    strip('s-lec03-window', [a, b, c], ['The telescopic as a buffer: V_out is also M2’s gate', 'Two fences squeeze the output',
                                         'The width of the window'], W, 296, 'Telescopic as a buffer: a half-volt window',
          'M4 wants V_out high, M2 wants it low: only V_th − V_ov is left', cols=2)


# ── Lec 04 ────────────────────────────────────────────────────────────────────
def lec04_design():
    a = P(0)
    steps = [('① power', '→ currents I_D', NM_BG, NM), ('② swing', '→ overdrives V_ov', PM_BG, PM), ('③ square law', '→ W/L', AMB_BG, SIG), ('④⑤ g_m, r_O', '→ check the gain', GREEN_BG, OK)]
    for i, (h, t, fill, st) in enumerate(steps):
        y = 40 + i * 60
        a.box(30, y, 180, 44, fill, st)
        a.t(120, y + 19, h, 13, st, 'middle', True)
        a.t(120, y + 36, t, 12, st, 'middle')
        if i < 3:
            a.arrow(120, y + 44, 120, y + 58, INK)
    b = P(0)
    sc = 70
    segs = [(0.5, 'tail M9 0.5', NM_BG, NM), (0.2, 'M2 0.2', NM_BG, NM), (0.2, 'M4 0.2', NM_BG, NM), (1.5, 'output room 1.5 V', GREEN_BG, OK), (0.3, 'M6 0.3', PM_BG, PM), (0.3, 'M8 0.3', PM_BG, PM)]
    b.bars(70, 262, 100, segs, sc)
    b.t(W / 2, 26, 'one column, V_DD = 3 V', 13, INK, 'middle', True)
    c = eqpanel([(['g_m = ', F('2I_D', 'V_ov'), ',   r_O = ', F('1', 'λI_D')], INK, False), (['R_up 111 k ∥ R_down 666 k'], INK, False),
                 'smaller one wins → A ≈ 1428 (too low)', (['double L of PMOS: λ halves'], PM, True), (['R_up = 444 k → A ≈ 4000'], OK, True)], y0=48, dy=50, size=13)
    strip('s-lec04-design', [a, b, c], ['Razavi’s fixed order of work', 'Swing budget: the overdrives share 1.5 V', 'Check, then fix the weak side'], W, 290,
          'Designing a telescopic (Ex 9.7)', 'Power → currents; swing → overdrives; square law → W/L; then check the gain', cols=2)


# ── Lec 05 ────────────────────────────────────────────────────────────────────
def lec05_fold():
    a = P(0)
    a.vdd(80, 160, 26)
    a.isrc(120, 56, 'load')
    a.w(120, 44, 120, 26)
    a.w(120, 68, 120, 100)
    a.dot(120, 90)
    a.t(128, 94, 'V_out', 12, SIG)
    a.fet(120, 130, 'M2', 'V_b')
    a.dot(120, 160)
    a.t(128, 164, 'X', 12, BAD, bold=True)
    a.fet(120, 190, 'M1', 'V_in')
    a.gnd(120, 220)
    a.t(120, 268, 'input and cascode in one column', 11.5, MUT, 'middle')
    b = P(0)
    b.vdd(20, 220, 26)
    b.isrc(60, 56, 'I_SS')
    b.w(60, 44, 60, 26)
    b.w(60, 68, 60, 90)
    b.fet(60, 120, 'M1', 'V_in', p=True, namepos='r')
    b.w(60, 150, 60, 170, 160, 170)
    b.dot(160, 170)
    b.t(166, 186, 'X', 12, BAD, bold=True)
    b.isrc(160, 214, 'I_1')
    b.w(160, 170, 160, 202)
    b.gnd(160, 226)
    b.fet(160, 140, 'M2', 'V_b', gate_right=True, namepos='l')
    b.w(160, 110, 160, 90)
    b.dot(160, 96)
    b.t(168, 92, 'V_out', 12, SIG)
    b.isrc(160, 64, '')
    b.w(160, 52, 160, 26)
    b.t(120, 272, 'M1 flipped, fed in from the side', 11, MUT, 'middle')
    c = P(0)
    c.w(40, 130, 200, 130)
    c.dot(120, 130)
    c.t(126, 148, 'X', 13, BAD, bold=True)
    c.arrow(40, 70, 112, 124, SIG)
    c.t(10, 52, 'M1 pushes +i into X', 12, SIG)
    c.arrow(130, 124, 170, 80, SIG)
    c.t(150, 52, 'M2 carries i less', 12, SIG)
    c.t(150, 68, '→ V_out moves by i', 12, SIG)
    c.arrow(120, 136, 120, 196, INK)
    c.t(126, 186, 'I_1 = I_D1 + I_D2', 12)
    c.t(120, 240, 'keep I_1 ≥ I_SS (M2 never starves)', 12, BAD, 'middle', True)
    d = P(0)
    d.vdd(20, 220, 26)
    d.isrc(160, 56, 'I_2')
    d.w(160, 44, 160, 26)
    d.w(160, 68, 160, 100)
    d.dot(160, 92)
    d.t(166, 108, 'X', 12, BAD, bold=True)
    d.fet(160, 130, 'M2', 'V_b', p=True, gate_right=True, namepos='l')
    d.dot(160, 170)
    d.t(168, 174, 'V_out', 12, SIG)
    d.w(160, 160, 160, 190)
    d.isrc(160, 202, 'I_1')
    d.gnd(160, 214)
    d.w(160, 92, 70, 92, 70, 130)
    d.fet(70, 160, 'M1', 'V_in', glen=14)
    d.gnd(70, 190)
    d.t(120, 268, 'mirror image: NMOS M1 pulls from X', 11, MUT, 'middle')
    strip('s-lec05-fold', [a, b, c, d], ['Before: a cascode, input M1 under M2', 'Fold: flip M1, feed X from the side; I₁ carries both',
                                         'The same signal i still reaches the output', 'Your second drawing: PMOS cascode, NMOS input; I_D2 = I_2 − I_D1'], W, H,
          'Folding: the input device leaves the output column', 'Same G_m ≈ g_m1 — but the output column no longer holds the input pair', cols=2)


def lec05_folded():
    a = P(0)
    a.vdd(40, 220, 20)
    a.fet(150, 50, 'M7', 'V_b', p=True, gate_right=True, namepos='l')
    a.fet(150, 110, 'M5', 'V_b', p=True, gate_right=True, namepos='l')
    a.dot(150, 140)
    a.t(140, 144, 'V_out', 12, SIG, 'end', True)
    a.fet(150, 170, 'M3', 'V_b', gate_right=True, namepos='l')
    a.dot(150, 200)
    a.t(158, 214, 'fold', 11, BAD, bold=True)
    a.fet(150, 230, 'M9', 'V_b', gate_right=True, namepos='l')
    a.gnd(150, 260)
    a.isrc(50, 46, 'M11')
    a.w(50, 34, 50, 20)
    a.w(50, 58, 50, 90)
    a.fet(50, 120, 'M1', 'V_in', p=True)
    a.w(50, 150, 50, 200, 150, 200, col=SIG, wd=2)
    b = P(0)
    b.t(W / 2 + 10, 24, 'look up and look down', 13, INK, 'middle', True)
    b.eq(W / 2 + 10, 70, ['R_up = g_m5 r_O5 r_O7'], 14, PM, True)
    b.t(W / 2 + 10, 92, 'an ordinary PMOS cascode', 11.5, MUT, 'middle')
    b.eq(W / 2 + 10, 140, ['R_down = g_m3 r_O3 (r_O1 ∥ r_O9)'], 14, NM, True)
    b.t(W / 2 + 10, 162, 'two r_O hang on the fold node', 11.5, MUT, 'middle')
    b.eq(W / 2 + 10, 214, ['A_v = g_m1(R_up ∥ R_down)'], 14, SIG, True)
    b.t(W / 2 + 10, 236, 'a bit below a telescopic', 11.5, MUT, 'middle')
    strip('s-lec05-folded', [a, b], ['PMOS-input folded cascode (one half; names as on your page)', 'Gain by the two looks'], W + 20, 290,
          'PMOS-input folded cascode, R_up and R_down', 'The fold node carries r_O1 ∥ r_O9 — that is the only new thing')


def lec05_gm():
    a = P(0)
    a.w(40, 150, 200, 150)
    a.dot(120, 150)
    a.t(130, 168, 'fold node', 12, BAD, bold=True)
    a.arrow(30, 128, 110, 148, SIG)
    a.t(8, 118, 'g_m1 v_in arrives', 12, SIG)
    a.res(120, 150, 215, 'r_O1 ∥ r_O9 (big)', NM)
    a.gnd(120, 215)
    a.fet(120, 100, 'M3', 'V_b')
    a.t(140, 36, 'into M3’s source:', 11, PM)
    a.eq(180, 60, ['≈ ', F('1', 'g_m3'), ' (tiny)'], 12, PM, True)
    b = eqpanel([(['i_up = g_m1 v_in · ', F('r_O1 ∥ r_O9', '(r_O1 ∥ r_O9) + 1/g_m3')], NM, False), (['≈ g_m1 v_in'], SIG, True),
                 'the easy path wins', (['G_m ≈ g_m1'], OK, True)], y0=70, dy=54, size=13, width=W + 30)
    strip('s-lec05-gm', [a, b], ['M1’s current has two exits at the fold node', 'Current divider: the small resistance takes nearly all'], W + 30, 270,
          'Folded cascode G_m by inspection', 'Current takes the easy path: into a source (1/g_m), not into r_O')


# ── Lec 06 ── (in doubtstrips6.py)


def main():
    for f in (lec01, lec02_cmdm, lec02_pair, lec02_swing, lec02_ota, lec03_buffer, lec03_tele, lec03_headroom, lec03_vth, lec03_window,
              lec04_design, lec05_fold, lec05_folded, lec05_gm):
        f()
    import doubtstrips6
    doubtstrips6.main()


if __name__ == '__main__':
    main()
    import doubtstrips2
    doubtstrips2.main()
    import towers
    towers.main()
    print('ok')
