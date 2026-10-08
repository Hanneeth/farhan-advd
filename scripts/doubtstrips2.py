"""Simplification strips, part 2: Lec 07–17."""
import math

from doubtfigs import BAD, INK, MUT, NM, OK, P, PM, SIG, strip
from doubtstrips import AMB_BG, GREEN_BG, H, NM_BG, PM_BG, RED_BG, W, F, eqpanel


# ── Lec 07: two stages ────────────────────────────────────────────────────────
def lec07_twostage():
    a = P(0)
    a.box(14, 80, 96, 64, NM_BG, NM)
    a.t(62, 104, 'stage 1', 13, NM, 'middle', True)
    a.t(62, 124, 'gain A_1', 12, NM, 'middle')
    a.box(132, 80, 96, 64, PM_BG, PM)
    a.t(180, 104, 'stage 2 (CS)', 13, PM, 'middle', True)
    a.t(180, 124, 'swing A_2', 12, PM, 'middle')
    a.arrow(110, 112, 130, 112, INK)
    a.eq(W / 2, 196, ['A = A_1 × A_2'], 16, SIG, True)
    a.t(W / 2, 236, 'cascode stage: lots of gain, little swing', 11.5, MUT, 'middle')
    a.t(W / 2, 254, 'CS stage: little gain, lots of swing', 11.5, MUT, 'middle')
    b = P(0)
    b.vdd(60, 200, 30)
    b.fet(140, 64, 'M9', '', p=True, glen=40)
    b.w(80, 64, 40, 64)
    b.dot(40, 64)
    b.t(36, 52, 'P (stage-1 out)', 11, NM, 'start', True)
    b.w(140, 94, 140, 150)
    b.dot(140, 122)
    b.t(132, 126, 'Q = V_out', 12, SIG, 'end', True)
    b.cap(196, 122, '')
    b.w(140, 122, 196, 122)
    b.t(206, 150, 'C_L', 12)
    b.fet(140, 180, 'M11', 'V_b')
    b.gnd(140, 210)
    b.eq(W / 2, 252, ['A_2 = g_m9(r_O9 ∥ r_O11)'], 13, PM, True)
    b.t(W / 2, 274, 'one device to each rail → big swing', 11.5, MUT, 'middle')
    c = P(0)
    c.axes(30, 220, 222, 40, 'ω', '|A|')
    c.w(30, 70, 80, 70, 140, 130, 210, 230, col=NM, wd=2.2)
    c.dot(80, 70, 4, NM)
    c.dot(140, 130, 4, NM)
    c.t(84, 62, 'pole at P', 11.5, NM)
    c.t(146, 124, 'pole at Q', 11.5, NM)
    c.t(W / 2, 252, 'two high-R nodes → two poles', 12, BAD, 'middle', True)
    c.t(W / 2, 270, '→ needs compensation (Lec 17)', 11.5, MUT, 'middle')
    strip('s-lec07-twostage', [a, b, c], ['Split the jobs: gain first, swing second', 'Stage 2 = one CS device + a current source', 'The price: a second pole'], W, H,
          'Two-stage op amp, simplified', 'Gains multiply; every high-resistance node adds a pole', cols=2)


# ── Lec 07–08: gain boosting ──────────────────────────────────────────────────
def lec08_boost():
    a = P(0)
    a.w(120, 30, 120, 50)
    a.dot(120, 40)
    a.t(128, 44, 'V_out', 12, SIG)
    a.fet(120, 80, 'M2', 'V_b')
    a.res(120, 110, 180, 'r_O1', NM)
    a.gnd(120, 180)
    a.t(120, 222, 'plain cascode:', 12, MUT, 'middle')
    a.eq(120, 246, ['R_out ≈ g_m2 r_O2 r_O1'], 14, NM, True)
    b = P(0)
    b.w(150, 30, 150, 50)
    b.dot(150, 40)
    b.t(158, 44, 'V_out', 12, SIG)
    b.fet(150, 80, 'M2', '', glen=14)
    b.res(150, 110, 180, 'r_O1', NM)
    b.gnd(150, 180)
    b.dot(150, 120)
    b.w(90, 150, 90, 110, 56, 130, 90, 150, col=SIG, wd=1.8)
    b.t(84, 134, '−A_1', 11, SIG, 'end')
    b.w(150, 120, 110, 120, 110, 130, 90, 130, col=SIG)
    b.w(56, 130, 44, 130, 44, 80, 118, 80, col=SIG)
    b.t(120, 222, 'amp watches M2’s source', 12, MUT, 'middle')
    b.t(120, 240, 'and drives its gate the other way', 12, MUT, 'middle')
    c = eqpanel(['source rises by Δ', 'gate falls by A_1Δ', (['V_GS changes by (1 + A_1)Δ'], SIG, True), 'M2 fights back (1 + A_1)× harder',
                 (['R_out ≈ (1 + A_1) g_m2 r_O2 r_O1'], NM, True)], y0=52, dy=46, size=14)
    d = eqpanel([(['plain cascode: (g_m r_O)^2'], INK, False), 'one-transistor booster: A_1 ≈ g_m r_O', (['gain ≈ (g_m r_O)^3'], SIG, True),
                 (['G_m stays ≈ g_m1'], OK, True), 'no extra device in the output stack'], y0=56, dy=48, size=14)
    strip('s-lec08-boost', [a, b, c, d], ['A plain cascode', 'Add an amplifier from M2’s source to its gate', 'Why R_out is multiplied', 'The payoff'], W, H,
          'Gain boosting, simplified', 'Boosting multiplies R_out by (1 + A_1) without stacking another device')


def lec08_source():
    a = eqpanel(['plain device, looking into its source:', (['R = ', F('R_D + r_O', '1 + g_m r_O'), ' ≈ ', F('1', 'g_m')], NM, True),
                 'boosted (fights back (1 + A_1)× harder):', (['R = ', F('R_D + r_O', '1 + (1 + A_1)g_m r_O')], SIG, True),
                 (['≈ ', F('1', '(1 + A_1) g_m'), '  (even smaller)'], SIG, False)], y0=50, dy=50, size=13, width=W + 40)
    b = P(0)
    b.w(40, 120, 220, 120)
    b.dot(130, 120)
    b.t(138, 112, 'M2’s source', 12, BAD, bold=True)
    b.arrow(40, 90, 122, 116, SIG)
    b.t(14, 82, 'M1’s current g_m1 v_in', 12, SIG)
    b.arrow(130, 116, 130, 60, PM)
    b.eq(170, 52, ['up: ', F('1', '(1 + A_1)g_m2')], 12, PM, True)
    b.res(130, 120, 190, 'down: r_O1', NM)
    b.gnd(130, 190)
    b.t(W / 2 + 20, 240, 'all of it goes up', 12.5, OK, 'middle', True)
    b.eq(W / 2 + 20, 266, ['G_m ≈ g_m1'], 14, OK, True)
    strip('s-lec08-source', [a, b], ['Up multiplies, down divides — now by (1 + A_1) g_m r_O', 'So boosting costs no G_m'], W + 40, 290,
          'Looking into a boosted source', 'A boosted source is even stiffer: the input current all reaches the output')


# ── Lec 09–12: CMFB ───────────────────────────────────────────────────────────
def lec09_cmfb():
    a = P(0)
    a.vdd(80, 160, 30)
    a.isrc(120, 70, 'I_P')
    a.w(120, 30, 120, 58)
    a.w(120, 82, 120, 160)
    a.dot(120, 120)
    a.t(128, 116, 'V_out', 12, SIG)
    a.isrc(120, 172, 'I_N')
    a.gnd(120, 184)
    a.arrow(150, 124, 196, 124, BAD)
    a.t(158, 142, 'I_P − I_N', 11, BAD)
    a.t(120, 236, 'any mismatch flows into a huge R', 11.5, MUT, 'middle')
    a.t(120, 254, '→ output CM runs to a rail', 12, BAD, 'middle', True)
    b = P(0)
    b.box(20, 60, 90, 44, NM_BG, NM)
    b.t(65, 80, 'sense', 12, NM, 'middle', True)
    b.t(65, 96, 'output CM', 10.5, NM, 'middle')
    b.box(140, 60, 90, 44, AMB_BG, SIG)
    b.t(185, 80, 'compare', 12, SIG, 'middle', True)
    b.t(185, 96, 'with V_REF', 10.5, SIG, 'middle')
    b.box(80, 160, 90, 44, PM_BG, PM)
    b.t(125, 180, 'correct', 12, PM, 'middle', True)
    b.t(125, 196, 'one current source', 10.5, PM, 'middle')
    b.arrow(110, 82, 138, 82, INK)
    b.arrow(185, 104, 160, 158, INK)
    b.arrow(90, 160, 65, 106, INK)
    b.t(120, 246, 'ordinary negative feedback', 12, MUT, 'middle')
    c = eqpanel([(['V_out,CM = ', F('V_out1 + V_out2', '2')], INK, True), 'what CMFB holds at V_REF', 'differential signals cancel in the sum',
                 (['error ≈ ', F('1', 'loop gain')], SIG, True)], y0=60, dy=50, size=14)
    strip('s-lec09-cmfb', [a, b, c], ['Two current sources in series set no voltage', 'What CMFB does', 'What it senses'], W, H,
          'Common-mode feedback', 'Sense the output CM, compare with V_REF, correct one current source', cols=2)


def lec10_sense():
    a = P(0)
    a.w(14, 100, 40, 100)
    a.t(14, 90, 'V_out1', 12, NM, bold=True)
    a.resh(40, 110, 100, 'R')
    a.dot(120, 100)
    a.resh(130, 200, 100, 'R')
    a.w(110, 100, 130, 100)
    a.w(200, 100, 226, 100)
    a.t(226, 90, 'V_out2', 12, PM, 'end', True)
    a.w(120, 100, 120, 140)
    a.arrow(120, 140, 120, 160, SIG)
    a.eq(120, 196, ['V_sense = ', F('V_out1 + V_out2', '2')], 14, SIG, True)
    a.t(120, 236, 'equal resistors average the outputs', 11.5, MUT, 'middle')
    b = eqpanel(['the resistors hang on the outputs:', (['A_v = g_m1(r_O1 ∥ r_O3 ∥ R)'], BAD, True), 'small R → gain drops',
                 'fix: buffer the outputs first', (['V_sense = average − V_GS'], NM, True), '(source followers M5, M6)'], y0=48, dy=40, size=13.5)
    strip('s-lec10-sense', [a, b], ['Resistive sensing: the midpoint is the average', 'Its cost, and the follower fix'], W, 270,
          'Sensing the output CM', 'Average with two equal resistors; buffer with followers so they do not load the outputs')


def lec11_triode():
    a = P(0)
    a.axes(30, 230, 225, 40, 'V_DS', 'I_D')
    for k, vov in enumerate((1.0, 0.75, 0.5)):
        sat = 30 + 110 * vov
        top = 230 - 170 * vov * vov
        a.curve(lambda x, vov=vov: 230 - 170 * (vov * vov - max(0, vov - (x - 30) / 110) ** 2), 30, 222, col=[NM, PM, SIG][k], wd=1.8)
    a.w(30, 230, 70, 140, col=BAD, wd=3)
    a.t(74, 150, 'deep triode:', 11.5, BAD, bold=True)
    a.t(74, 164, 'straight line = resistor', 11.5, BAD)
    a.t(150, 54, 'saturation: flat = current source', 11, MUT, 'middle')
    b = eqpanel(['small V_DS: the V_DS^2 term drops out', (['R_on = ', F('1', 'µ_nC_ox(W/L)(V_GS − V_th)')], NM, True), 'the gate sets the resistance'], y0=70, dy=60, size=14)
    c = eqpanel(['M10 ∥ M11, gates = V_out1, V_out2:', (['', F('1', 'R_tot'), ' = µ_nC_ox(W/L)(V_out1 + V_out2 − 2V_th)'], NM, True),
                 'a differential signal raises one and lowers', 'the other: the sum is unchanged', (['→ R_tot senses only the CM'], OK, True)], y0=58, dy=44, size=12.5, width=W + 40)
    strip('s-lec11-triode', [a, b, c], ['Deep triode: I_D ∝ V_DS near the origin', 'A gate-controlled resistor', 'Two in parallel sense the CM'], W + 40, 290,
          'Triode sensing for CMFB', 'Deep triode = resistor; in parallel only V_out1 + V_out2 matters', cols=2)


def lec12_replica():
    a = P(0)
    a.t(30, 30, 'sensing (real):', 12, NM, bold=True)
    a.w(70, 50, 170, 50)
    a.fet(70, 80, '', 'V_out1', glen=14)
    a.t(78, 84, 'M12', 12, NM, bold=True)
    a.fet(170, 80, '', 'V_out2', gate_right=True, glen=14)
    a.t(162, 84, 'M13', 12, NM, 'end', True)
    a.w(70, 110, 70, 122, 170, 122, 170, 110)
    a.gnd(120, 122)
    a.t(30, 168, 'replica:', 12, PM, bold=True)
    a.w(120, 172, 120, 180)
    a.fet(120, 210, 'M15', 'V_REF', col=PM, glen=14)
    a.gnd(120, 240)
    a.t(W / 2 + 10, 272, '(W/L)₁₅ = (W/L)₁₂ + (W/L)₁₃, same current', 11.5, INK, 'middle', True)
    b = eqpanel(['balanced only when', (['', F('V_out1 + V_out2', '2'), ' = V_REF'], OK, True), 'M17, M18 copy M1, M2', 'so V_DS matches too (no copy error)'], y0=60, dy=52, size=14, width=W + 20)
    strip('s-lec12-replica', [a, b], ['A twin of the sensing devices, with V_REF on its gate', 'The loop settles where the twins match'], W + 20, 286,
          'Replica CMFB', 'Build a twin with V_REF on its gate: the outputs must average to V_REF')


# ── Lec 13: settling and slewing ──────────────────────────────────────────────
def lec13_rc():
    a = P(0)
    a.t(14, 92, 'step V_0', 12)
    a.w(14, 100, 50, 100)
    a.resh(50, 130, 100, 'R')
    a.w(130, 100, 180, 100)
    a.dot(170, 100)
    a.t(180, 92, 'V_out', 12, SIG)
    a.cap(170, 100, 'C')
    a.eq(W / 2, 200, ['τ = RC'], 16, NM, True)
    a.t(W / 2, 228, 'one pole = one time constant', 11.5, MUT, 'middle')
    b = P(0)
    b.axes(30, 230, 225, 40, 't', 'V_out')
    tau = 36
    b.curve(lambda x: 230 - 160 * (1 - math.exp(-(x - 30) / tau)), 30, 222, col=NM)
    b.w(30, 70, 222, 70, col=MUT, dash='4 4')
    b.t(222, 64, 'V_0', 11, MUT, 'end')
    for k, (lbl, frac) in enumerate((('τ: 63 %', 1 - math.exp(-1)), ('4.6τ: 99 %', 0.99))):
        x = 30 + tau * (1 if k == 0 else 4.6)
        y = 230 - 160 * frac
        b.dot(x, y, 4, SIG)
        b.w(x, y, x, 230, col=SIG, dash='3 3')
        b.t(x + 4, y + (18 if k == 0 else -8), lbl, 11, SIG, 'start' if k == 0 else 'end', True)
    b.w(30, 230, 70, 230 - 160 * 40 / tau, col=OK, dash='2 3')
    b.eq(110, 270, ['slope at 0 = ', F('V_0', 'τ')], 12.5, OK, True)
    c = eqpanel([(['t_s = τ · ln', F('1', 'ε')], NM, True), '1 %: ln 100 = 4.6', '0.1 %: ln 1000 = 6.9',
                 (['in feedback: τ = ', F('1', 'βω_u')], SIG, True), 'the loop divides τ by (1 + βA)'], y0=56, dy=44, size=14)
    strip('s-lec13-rc', [a, b, c], ['One pole: an RC', 'The step response', 'Settling time'], W, H,
          'Settling: one pole, one exponential', 'Settle to ε in τ·ln(1/ε); feedback makes τ = 1/(βω_u)', cols=2)


def lec13_slew():
    a = P(0)
    a.axes(30, 230, 225, 40, 't', '')
    a.curve(lambda x: 230 - 150 * (1 - math.exp(-(x - 30) / 35)), 30, 222, col=NM)
    a.t(120, 60, 'small step: exponential', 12, NM, 'middle', True)
    a.t(120, 262, 'both input devices stay on', 11.5, MUT, 'middle')
    b = P(0)
    b.axes(30, 230, 225, 40, 't', '')
    pts = [30, 230, 120, 100]
    for k in range(1, 30):
        t = k / 29 * 100
        pts += [120 + t, 100 - 30 * (1 - math.exp(-t / 20))]
    b.w(*pts, col=SIG, wd=2.2)
    b.t(70, 150, 'ramp', 12, SIG, 'end', True)
    b.t(120, 60, 'big step: slews, then settles', 12, SIG, 'middle', True)
    b.eq(120, 270, ['SR = ', F('I_SS', 'C_L')], 14, SIG, True)
    strip('s-lec13-slew', [a, b], ['Small step: the pair stays linear', 'Big step: the whole tail current charges C_L'], W + 20, 290,
          'Settling vs slewing', 'A step slews if its linear slope would beat SR = I_SS/C_L')


# ── Lec 14–16: stability ──────────────────────────────────────────────────────
def lec14_bark():
    a = P(0)
    a.o.append(f'<circle cx="50" cy="100" r="14" fill="#fff" stroke="{INK}" stroke-width="1.6"/>')
    a.t(50, 105, 'Σ', 14, anchor='middle')
    a.box(90, 78, 60, 44, NM_BG, NM)
    a.t(120, 106, 'A', 18, NM, 'middle', True)
    a.arrow(64, 100, 88, 100, INK)
    a.arrow(150, 100, 222, 100, INK)
    a.box(90, 160, 60, 40, AMB_BG, SIG)
    a.t(120, 186, 'β', 18, SIG, 'middle', True)
    a.w(200, 100, 200, 180, 152, 180, col=SIG, wd=1.8)
    a.w(90, 180, 50, 180, col=SIG, wd=1.8)
    a.arrow(50, 180, 50, 116, col=SIG)
    a.t(58, 140, '−', 16, SIG)
    a.t(W / 2, 230, 'round the loop: |βA| = 1, phase −180°', 12, BAD, 'middle', True)
    a.t(W / 2, 250, 'plus the − at Σ: another 180°', 11.5, MUT, 'middle')
    a.t(W / 2, 268, '→ the signal returns in phase', 11.5, BAD, 'middle')
    b = eqpanel([(['|βA| = 1  and  ∠βA = −180°'], BAD, True), (['⇒ βA = −1 ⇒ 1 + βA = 0'], INK, False),
                 (['A_closed = ', F('A', '1 + βA'), ' → ∞'], BAD, True), 'it oscillates by itself', 'one pole reaches only −90°: always safe'], y0=50, dy=48, size=14)
    strip('s-lec14-bark', [a, b], ['Follow a signal once round the loop', 'Barkhausen: the oscillation condition'], W, 290,
          'When feedback turns into oscillation', 'Gain 1 at −180° = an oscillator')


def lec15_bode():
    a = P(0)
    a.t(W / 2, 22, 'one pole', 13, INK, 'middle', True)
    a.axes(30, 120, 225, 34, 'ω', '|A| dB')
    a.w(30, 50, 110, 50, 210, 115, col=NM, wd=2.2)
    a.dot(110, 50, 4, NM)
    a.t(112, 44, 'ω_p (−3 dB)', 11, NM)
    a.t(170, 76, '−20 dB/dec', 11, NM)
    a.axes(30, 270, 225, 150, 'ω', 'phase')
    a.w(30, 165, 75, 165, 145, 255, 222, 255, col=SIG, wd=2.2)
    a.dot(110, 210, 4, SIG)
    a.t(114, 204, '−45° at ω_p', 11, SIG)
    a.t(60, 182, '0.1ω_p', 10, MUT, 'middle')
    a.t(150, 268, '10ω_p: −90°', 10, MUT)
    b = P(0)
    b.t(W / 2, 22, 'loop gain, two poles', 13, INK, 'middle', True)
    b.axes(30, 120, 225, 34, 'ω', '|βA|')
    b.w(30, 46, 70, 46, 130, 90, 200, 150, col=NM, wd=2.2)
    b.w(30, 100, 222, 100, col=MUT, dash='4 3')
    b.t(222, 96, '0 dB', 10, MUT, 'end')
    b.dot(143, 100, 4, BAD)
    b.t(146, 114, 'ω_GX', 11, BAD, bold=True)
    b.axes(30, 270, 225, 150, 'ω', '∠βA')
    b.curve(lambda x: 165 + 95 * (math.atan((x - 30) / 30) + math.atan(max(0, x - 30) / 110)) / math.pi, 30, 222, col=SIG)
    b.w(30, 260, 222, 260, col=BAD, dash='4 3')
    b.t(222, 256, '−180°', 10, BAD, 'end')
    yg = 165 + 95 * (math.atan(113 / 30) + math.atan(113 / 110)) / math.pi
    b.w(143, yg, 143, 260, col=OK, wd=2.4)
    b.t(148, (yg + 260) / 2 + 4, 'PM', 12, OK, bold=True)
    c = eqpanel([(['PM = 180° + ∠βA(ω_GX)'], OK, True), 'find ω_GX first (|βA| = 1),', 'then add the pole angles there',
                 (['each pole: −tan⁻¹', F('ω', 'ω_p')], SIG, False), 'smaller β → lower curve → safer', 'β = 1 (buffer) is the worst case'], y0=50, dy=40, size=13.5)
    strip('s-lec15-bode', [a, b, c], ['Each pole: −20 dB/dec and up to −90°', 'Phase margin = distance from −180° at ω_GX', 'The recipe'], W, 290,
          'Bode plots and phase margin', 'PM = 180° + phase of βA where |βA| = 1', cols=2)


def lec16_pm():
    out = []
    for pm in (30, 60):
        p = P(0)
        ox, oy, L = 60, 90, 90
        p.arrow(ox, oy, ox + L, oy, INK, 2.2)
        p.t(ox + L / 2, oy - 8, '1', 13, INK, 'middle')
        ang = math.radians(180 - pm)
        ex, ey = ox + L + L * math.cos(-ang), oy - L * math.sin(-ang)
        p.arrow(ox + L, oy, ex, ey, NM, 2.2)
        p.t((ox + L + ex) / 2 + 10, (oy + ey) / 2, 'βA', 13, NM)
        p.arrow(ox, oy, ex, ey, SIG, 2.6)
        p.t((ox + ex) / 2 - 8, (oy + ey) / 2 + 4, '1 + βA', 12, SIG, 'end')
        p.t(120, 30, f'PM = {pm}°', 14, INK, 'middle', True)
        p.eq(120, 250, ['|1 + βA| = 2 sin(', F('PM', '2'), f') = {2 * math.sin(math.radians(pm / 2)):.2f}'], 13, SIG, True)
        out.append(p)
    c = eqpanel([(['at ω_GX:  |A_closed| = ', F('1/β', '2 sin(PM/2)')], NM, True), 'PM 30° → 1.93/β (big peak)', 'PM 45° → 1.3/β', 'PM 60° → 1.0/β (no peak)'],
                y0=60, dy=50, size=13.5)
    strip('s-lec16-pm', out + [c], ['Small PM: the arrows nearly cancel → big peak', '60°: |1 + βA| = 1 → no peak', 'Numbers to remember'], W + 20, 290,
          'Why small phase margin means peaking', 'K = 1/(2 sin(PM/2)): 45° → 1.3, 60° → 1.0', step_arrow=False, cols=2)


def lec16_steps():
    p = P(0)
    p.axes(30, 250, 500, 40, 't', 'V_out')
    p.w(30, 110, 500, 110, col=MUT, dash='4 4')
    p.t(500, 104, 'final', 11, MUT, 'end')
    for zeta, col, lbl in ((0.25, BAD, 'PM ≈ 30°: rings'), (0.6, OK, 'PM ≈ 60°: fast, tiny overshoot'), (1.0, NM, 'PM 90°: slow, no overshoot')):
        def resp(x, z=zeta):
            t = (x - 30) / 40
            if z < 1:
                wd = math.sqrt(1 - z * z)
                v = 1 - math.exp(-z * t) * (math.cos(wd * t) + z / wd * math.sin(wd * t))
            else:
                v = 1 - math.exp(-t) * (1 + t)
            return 250 - 140 * v
        p.curve(resp, 30, 500, 160, col=col, wd=2.2)
    p.t(300, 60, 'PM ≈ 30°: rings', 12, BAD, bold=True)
    p.t(300, 200, 'PM ≈ 60°: fast, small overshoot', 12, OK, bold=True)
    p.t(300, 230, 'PM 90°: slow, none', 12, NM, bold=True)
    strip('s-lec16-steps', [p], ['Peaking in frequency = ringing in time. 60° is the sweet spot.'], 520, 270,
          'Step responses for different phase margins', 'Aim for PM ≈ 60°', cols=1)


# ── Lec 17: compensation, Miller ──────────────────────────────────────────────
def lec17_comp():
    p = P(0)
    p.axes(30, 230, 500, 30, 'f (log)', '|βA| dB')
    p.w(30, 175, 500, 175, col=MUT, dash='4 3')
    p.t(500, 170, '0 dB', 11, MUT, 'end')
    p.w(30, 50, 200, 50, 300, 110, 380, 190, 440, 260, col=BAD, wd=2.2)
    p.t(204, 44, 'before: 3 poles', 12, BAD, bold=True)
    p.t(370, 165, 'crosses 0 dB too late', 11, BAD)
    p.w(30, 50, 60, 50, 300, 175, 340, 205, col=OK, wd=2.4)
    p.dot(60, 50, 4, OK)
    p.t(40, 112, 'f_D: dominant pole', 12, OK, bold=True)
    p.t(40, 128, 'pushed down', 12, OK, bold=True)
    p.dot(300, 175, 4, OK)
    p.t(296, 196, 'now 0 dB at the 2nd pole', 11.5, OK, 'end')
    strip('s-lec17-comp', [p], ['Compensation: lower the first pole until the loop gain reaches 1 before the phase gets dangerous'], 520, 270,
          'Dominant-pole compensation', 'Trade bandwidth for stability: f_D = f_gx / (βA_0)', cols=1)


def lec17_miller():
    a = P(0)
    a.w(70, 150, 70, 110, 140, 130, 70, 150, wd=1.8)
    a.t(96, 135, '−A_2', 12, INK, 'middle')
    a.w(30, 130, 70, 130)
    a.dot(40, 130)
    a.w(140, 130, 210, 130)
    a.dot(200, 130)
    a.w(40, 130, 40, 70, 112, 70)
    a.w(128, 70, 200, 70, 200, 130)
    a.w(112, 58, 112, 82, wd=2.2)
    a.w(128, 58, 128, 82, wd=2.2)
    a.t(120, 50, 'C_c', 13, SIG, 'middle', True)
    a.t(40, 150, 'v', 12, NM, 'middle')
    a.t(200, 150, '−A_2 v', 12, NM, 'middle')
    a.t(120, 220, 'voltage across C_c:', 12, MUT, 'middle')
    a.t(120, 240, '(1 + A_2) v', 13, SIG, 'middle', True)
    b = P(0)
    b.w(70, 150, 70, 110, 140, 130, 70, 150, wd=1.8)
    b.t(96, 135, '−A_2', 12, INK, 'middle')
    b.w(30, 130, 70, 130)
    b.w(140, 130, 210, 130)
    b.dot(45, 130)
    b.cap(45, 130, '')
    b.t(60, 182, 'C_c(1 + A_2)', 12, SIG, bold=True)
    b.dot(185, 130)
    b.cap(185, 130, '')
    b.t(172, 202, '≈ C_c', 12, MUT, 'end')
    c = eqpanel([(['p_1 ≈ ', F('1', 'R_1 A_2 C_c'), '  ↓'], NM, True), 'big C at stage 1’s output', (['p_2 ≈ ', F('g_m2', 'C_L'), '  ↑'], SIG, True),
                 '“pole splitting”', (['RHP zero at ', F('g_m2', 'C_c')], BAD, False)], y0=52, dy=46, size=14)
    strip('s-lec17-miller', [a, b, c], ['A capacitor across an inverting gain', 'Seen from each side', 'What it does to the poles'], W, H,
          'Miller effect and pole splitting', 'A capacitor across a gain −A looks (1 + A) times bigger at the input', cols=2)


def main():
    for f in (lec07_twostage, lec08_boost, lec08_source, lec09_cmfb, lec10_sense, lec11_triode, lec12_replica, lec13_rc, lec13_slew,
              lec14_bark, lec15_bode, lec16_pm, lec16_steps, lec17_comp, lec17_miller):
        f()
