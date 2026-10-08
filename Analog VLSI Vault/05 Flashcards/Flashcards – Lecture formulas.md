---
tags: ["flashcards"]
---
#flashcards/formulas

# Flashcards – Lecture formulas

One card per formula on your pages. Review with the Spaced Repetition plugin (see [[Obsidian guide]]).

Lec 01 · The task: gain 10, gain error under 1%::$A_v = -g_m R_D$
Lec 01 · Feedback factor β from the resistor divider::$V_f = \dfrac{R_2}{R_1 + R_2}V_{out}$ , $\beta = \dfrac{V_f}{V_{out}} = \dfrac{R_2}{R_1+R_2}$ , $A_{ideal} = \dfrac{1}{\beta} = \dfrac{R_1+R_2}{R_2} = 1 + \dfrac{R_1}{R_2} = 10$
Lec 01 · Closed-loop (actual) gain::$A_{closed} = A_{actual} = \dfrac{A}{1 + \beta A}$
Lec 01 · Gain error ε, derived::$\varepsilon = \dfrac{1}{1+\beta A} \approx \dfrac{1}{\beta A}$
Lec 01 · Minimum open-loop gain::$A_{min} = \dfrac{A_{closed}}{\varepsilon}$
Lec 02 · Bandwidth and GBW of a single-pole system::$\omega_u = A_0\,\omega_0 = \text{GBW}$
Lec 02 · The saturation fence (margin note)::$V_{DS} \ge V_{GS} - V_{th} \iff V_D \ge V_G - V_{th}$
Lec 02 · Fully differential pair with PMOS current-source loads (M1–M4, ISS, two CL)::$A_v = g_{m1,2}\,(r_{O1,2} \parallel r_{O3,4})$ , $V_{in,CM,min} = V_{ISS} + V_{GS1}$ , $V_{in,CM,max} = V_{DD} - |V_{ov3}| + V_{thn}$
Lec 02 · Its output swing (differential)::$V_{out1,max} = V_{DD} - |V_{ov3}|,\quad V_{out2,max} = V_{DD} - |V_{ov4}|$ , $V_{out1,min} = V_{ISS} + V_{ov1},\quad V_{out2,min} = V_{ISS} + V_{ov2}$ , $V_{out,max} = V_{out1,max} - V_{out2,min},\quad V_{out,min} = V_{out1,min} - V_{out2,max}$ , $\text{swing} = 2\,(V_{DD} - |V_{ov3}| - |V_{ov1}| - V_{ISS})$
Lec 02 · Its bandwidth::$BW = \omega_{p1} = \dfrac{1}{(r_{O2}\parallel r_{O4})\,C_L}$
Lec 02 · Five-transistor OTA (diode M3, mirror M4, single output)::$A_v = g_{m2}\,(r_{O2} \parallel r_{O4})$ , $V_{in,CM,min} = V_{ISS} + V_{GS1}$ , $V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{th1}$ , $V_{out,max} = V_{DD} - |V_{ov4}|,\quad V_{out,min} = V_{ISS} + V_{ov2}$ , $\text{swing} = V_{DD} - |V_{ov4}| - V_{ov2} - V_{ISS}$ , $BW = \omega_{p1} = \dfrac{1}{(r_{O2}\parallel r_{O4})\,C_L}$
Lec 03 · 5-T OTA as a unity-gain buffer (output tied to the − input)::$A_{closed} = \dfrac{A_{open}}{1 + \beta A_{open}},\quad \beta = 1 \Rightarrow A_{closed} = \dfrac{A_{open}}{1 + A_{open}} \approx 1$ , $A_{open} = g_{mN}(r_{ON}\parallel r_{OP}) \approx g_{mN}\dfrac{r_{ON}}{2}$
Lec 03 · What the load sees: a source behind Rout,closed::$R_{out,closed} \approx \dfrac{1}{g_{m2}}$
Lec 03 · The buffer’s bandwidth::$\omega_{p,open} = \dfrac{1}{(r_{O2}\parallel r_{O4})C_L}$ , $\omega_{out,closed} = \dfrac{1}{\frac{1}{g_{m2}}C_L} = \dfrac{g_{m2}}{C_L}$
Lec 03 · Telescopic cascode op amp, fully differential (M1–M8, ISS)::$A_{open} \approx \dfrac{(g_m r_O)^2}{2}$ , $\text{swing} = 2\left[V_{DD} - \{|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS}\}\right]$
Lec 03 · Mirror-loaded telescopic (single output, diode stack M5, M7)::$\text{swing} = V_{DD} - \{|V_{ov8}| + |V_{ov6}| + |V_{thp}| + V_{ov4} + V_{ov2} + V_{ISS}\}$
Lec 03 · Telescopic as a buffer: the output window::$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - V_{GS4} + V_{th2}$ , $\text{width} = V_{th} - V_{ov4}$
Lec 04 · The buffer window as a picture::$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - (V_{GS4} - V_{th2})$
Lec 04 · ③ W/L from the square law::$\dfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2}$
Lec 04 · ④⑤ Gain check: gm, rO, Rup, Rdown::$A_v = g_{m1,2}\,(R_{up}\parallel R_{down})$
Lec 04 · Fix the gain without changing the overdrives: lengthen M5–M8::$g_m r_O \propto \sqrt{\dfrac{WL}{I_D}},\quad \lambda \propto \dfrac{1}{L}$
Lec 05 · Fully differential op amp closed through C1–R1, R2 and C2–R3, R4 (Ex 9.6)::$V_{CM} = V_b - (V_{GS3,4} - V_{th1,2})$
Lec 05 · Folding a differential pair (ISS1, ISS2)::$I_{SS2} = I_{SS1} + \dfrac{I_{SS}}{2}$
Lec 05 · PMOS-input folded cascode (M1–M11) and its output resistance::$R_{up} = g_{m5}r_{O5}r_{O7}$ , $R_{down} = g_{m3}r_{O3}(r_{O1}\parallel r_{O9})$
Lec 05 · Gm of the folded cascode by current divider::$A_v = G_m(R_{up}\parallel R_{down}) \approx g_{m1}(R_{up}\parallel R_{down})$
Lec 06 · PMOS-input folded cascode: input CM range::$V_{ov9} - |V_{thp}| \le V_{in,CM} \le V_{DD} - |V_{ov11}| - |V_{GS1}|$
Lec 06 · NMOS-input folded cascode (M1, M2 NMOS, M11 tail; PMOS M9, M10 on top, M7, M8 PMOS cascodes, M5, M6 NMOS cascodes on M3, M4)::$A_v = g_{m1,2}\left[g_{m8}r_{O8}(r_{O10}\parallel r_{O2}) \parallel g_{m6}r_{O6}r_{O4}\right]$ , $V_{in,CM,min} = V_{ov11} + V_{GS1}$ , $V_{in,CM,max} = V_{DD} - |V_{ov10}| + V_{th1}$
Lec 06 · Folded cascode with the output shorted to an input (buffer)::$V_{out} \ge \max\left(V_{b2} - V_{th4},\; V_{b2} - V_{GS4} - |V_{th2}|\right)$
Lec 06 · Low-voltage cascode load: M7, M8 gates tied to X::$V_{b1} \ge V_{DD} - |V_{GS7}| - |V_{th5}|$ , $V_{P,max} = V_{DD} - |V_{ov7}| = V_{DD} - |V_{GS7}| + |V_{th7}|$ , $V_{b1} \le V_{DD} - |V_{ov7}| - |V_{GS5}|$
Lec 06 · Gain boosting begins::$A_v = G_m R_{out}$
Lec 07 · Two-stage op amp, simple first stage (M1–M4 + CS second stages M5–M8)::$A_1 = g_{m1,2}(r_{O1,2}\parallel r_{O3,4})$ , $A_2 = g_{m5,6}(r_{O5,6}\parallel r_{O7,8})$ , $A = A_1 \times A_2$
Lec 07 · Two-stage with a telescopic first stage (M1–M8 cascode, M9, M10 PMOS CS, M11, M12 current sources)::$A_1 = g_{m1}\left[g_{m5}r_{O5}r_{O7} \parallel g_{m3}r_{O3}r_{O1}\right]$ , $A_2 = g_{m9}(r_{O9}\parallel r_{O11})$
Lec 07 · Gain boosting: Av = Gm × Rout::$A_v = G_m \times R_{out}$
Lec 07 · Boosting Rout instead: the derivation with a test source::$R_{out} = R_S + r_O + (1 + A_1)\,g_m R_S r_O$
Lec 08 · Rout of the boosted device (repeat of Lec 7)::$R_{out} = R_S + r_O + (1 + A_1)\,g_m R_S r_O$
Lec 08 · Looking into the source of a boosted device::$R_{in,source} = \dfrac{R_D + r_O}{1 + g_mr_O}\ \text{(plain)}$ , $R_{in,source} = \dfrac{R_D + r_O}{1 + (1 + A_1)g_mr_O}\ \text{(boosted)}$
Lec 08 · Boosted cascode: Gm ≈ gm1 by current division::$I_{R_2} = I\,\dfrac{R_1}{R_1+R_2}$
Lec 08 · Rout and the gain of the boosted cascode::$R_{out} \approx (1+A_1)\,g_{m2}r_{O1}r_{O2}$ , $A_v \approx g_{m1}(1 + A_1)g_{m2}r_{O1}r_{O2} \approx (g_mr_O)^3$
Lec 08 · Implementation 1: a CS auxiliary (M3 with current source I2)::$A_v = g_{m1}(1 + g_{m3}r_{O3})g_{m2}r_{O2}r_{O1}$ , $V_{out,min} = V_{GS3} + V_{ov2}$
Lec 08 · Implementation 2: a PMOS auxiliary (M3 PMOS from VDD, I2 below)::$V_{GS2} \le |V_{th3}|$
Lec 08 · Implementation 3: a folded-cascode auxiliary (PMOS M3 folded into NMOS M4, I3 and I2)::$A_v = G_m R_{out} = g_{m1}(1+A_1)g_{m2}r_{O1}r_{O2}$ , $A_1 = g_{m3}\,g_{m4}r_{O4}r_{O3}$
Lec 09 · Folded auxiliary amplifier (M3 PMOS into M4 NMOS cascode, I3, I2)::$A_v = G_mR_{out},\quad G_m = g_{m1}$ , $R_{out} = (1 + A_{aux})\,g_{m2}r_{O2}r_{O1}$ , $A_{aux} = G_{m,aux}R_{out,aux} = g_{m3}\,g_{m4}r_{O4}r_{O3}$ , $A_v = g_{m1}\left[1 + g_{m3}g_{m4}r_{O4}r_{O3}\right]g_{m2}r_{O2}r_{O1}$
Lec 09 · Boosting a differential pair: two single aux amps, or one differential aux::$A_1 = A_2$
Lec 09 · Differential boosting with CS auxiliaries (M5, M6, ISS1)::$V_{out,min} = V_{ISS1} + V_{GS5} + V_{ov3}$
Lec 09 · Folded-cascode auxiliary (M5, M7, M9, M11, M13)::$R_{out} = (1 + A_{aux})\,g_{m3}r_{O3}r_{O1}$ , $A_{aux} = g_{m5}\left[g_{m11}r_{O11}r_{O13} \parallel g_{m7}r_{O7}(r_{O9}\parallel r_{O5})\right]$
Lec 09 · Common-mode feedback: why it is needed::$\Delta V_{out,CM} = (I_P - I_N)(R_P\parallel R_N)$
Lec 10 · Inputs as CM + DM::$V_{CM} = \dfrac{V_{in1}+V_{in2}}{2},\quad v_d = V_{in1} - V_{in2}$
Lec 10 · The mismatch current::$I_X = I_P - I_N$
Lec 10 · Resistive sensing (R1 = R2 between the outputs)::$A_v = g_{m1}(r_{O1}\parallel r_{O3})\ \text{(without)},\quad A_v = g_{m1}(r_{O1}\parallel r_{O3}\parallel R_1)\ \text{(with)}$
Lec 10 · Source-follower sensing (M5, M6 with I1, I2, then R1, R2)::$V_{sense} = \dfrac{V_{out1}+V_{out2}}{2} - V_{GS5,6}$
Lec 11 · Triode sensing: M10 and M11 gated by the two outputs::$R_{tot,P} = R_{on10}\parallel R_{on11} = \dfrac{1}{\mu_nC_{ox}(W/L)_{10,11}(V_{out1}+V_{out2}-2V_{th})}$
Lec 11 · Differential-pair sensing (M1–M4 with VREF, M5 as the controlled source)::$I_D \propto (V_{REF} - V_{out1})^2 + (V_{REF} - V_{out2})^2$
Lec 11 · Feedback mechanism and comparison::$\dfrac{A}{1+\beta A},\quad \varepsilon \approx \dfrac{1}{\beta A}$
Lec 12 · Replica CMFB (M14, M15 copy M11–M13)::$I_{D11} = I_{D14} = I_1$ , $(W/L)_{14} = (W/L)_{11}$ , $(W/L)_{15} = (W/L)_{12} + (W/L)_{13}$
Lec 12 · Removing the finite copy error (M16, M17, M18)::$(W/L)_{17} = (W/L)_1,\quad (W/L)_{18} = (W/L)_2$
Lec 13 · Feedback amplifier with Rout and CL (R1, R2 divider)::$V_{out}(t) = V_0\dfrac{A}{1 + A\frac{R_2}{R_1+R_2}}\left[1 - e^{-t/\tau}\right]$ , $\tau = \dfrac{C_LR_{out}}{1 + A\frac{R_2}{R_1+R_2}}$
Lec 13 · 5-T OTA, small step: linear::$V_{out}(s) = g_m\Delta V\dfrac{1}{sC_L}\ \text{(initially)},\quad A = g_{m1,2}(r_{O2}\parallel r_{O4})$
Lec 13 · 5-T OTA, large step: slewing::$SR = \dfrac{I_{SS}}{C_L}$
Lec 14 · Telescopic slewing (fully differential)::$\dfrac{dV_{out1}}{dt} = -\dfrac{I_{SS}}{2C_L},\quad \dfrac{dV_{out}}{dt}\Big|_{max} = \dfrac{dV_{out1}}{dt} - \dfrac{dV_{out2}}{dt} = -\dfrac{I_{SS}}{C_L}$
Lec 14 · Concept of stability: the feedback loop::$\dfrac{X_o}{X_s}(s) = \dfrac{A(s)}{1+\beta(s)A(s)}$ , $A(s) = \dfrac{A_M}{\left(1+\frac{s}{\omega_{p1}}\right)\left(1+\frac{s}{\omega_{p2}}\right)}$
Lec 14 · Barkhausen criteria::$|\beta A(j\omega_1)| = 1,\quad \angle\beta A(j\omega_1) = -180^\circ \Rightarrow A_f(j\omega_1) = \infty$
Lec 14 · Complex numbers you need::$a + jb = Me^{j\theta} = M(\cos\theta + j\sin\theta)$ , $M = \sqrt{a^2+b^2},\quad \theta = \tan^{-1}\dfrac{b}{a}$
Lec 15 · Bode asymptotes::$|A| = \dfrac{A_0}{\sqrt{1+(\omega/\omega_{p1})^2}\sqrt{1+(\omega/\omega_{p2})^2}},\quad \angle = -\tan^{-1}\dfrac{\omega}{\omega_{p1}} - \tan^{-1}\dfrac{\omega}{\omega_{p2}}$
Lec 15 · Gain and phase crossover, margins::$PM = 180^\circ + \angle\beta A(j\omega)\big|_{\omega=\omega_{GX}}$ , $GM = -20\log|\beta A(j\omega_{PX})|$
Lec 15 · Single-pole system: always stable::$PM = 180^\circ - 90^\circ = 90^\circ$ , $A_f = \dfrac{A_0}{(1+\beta A_0)\left(1+\frac{s}{\omega_{p1}(1+\beta A_0)}\right)}$
Lec 16 · Two-pole amplifier, β = 1::$PM = 180^\circ - |\angle\beta A(j\omega_{GX})|$
Lec 16 · Closed-loop gain at ωGX::$PM = 5^\circ: 11.5/\beta,\quad 45^\circ: 1.3/\beta,\quad 60^\circ: 1/\beta$
Lec 16 · Reading the loop gain off the plot::$20\log|A(j\omega)| - 20\log\tfrac{1}{\beta} = 20\log|\beta A(j\omega)|$
Lec 17 · Compensation idea on the Bode plot::$20\log A - 20\log\tfrac{1}{\beta} = 20\log A\beta$
Lec 17 · Miller effect::$C_{in} = C_C(1 + A_2),\quad C_{out} = C_C\left(1 + \tfrac{1}{A_2}\right)$
Lec 17 · Poles before and after compensation::$P_1 = \dfrac{1}{R_1C_1},\quad P_2 = \dfrac{1}{R_2C_2}\ \text{(without)}$ , $P_1' = \dfrac{1}{R_1\left[C_1 + (1+A_2)C_C\right]} \approx \dfrac{1}{R_1A_2C_C}$
Lec 17 · The two-stage op amp (M1–M7) uncompensated::$P_1 = \dfrac{1}{(r_{O2}\parallel r_{O4})C_1},\quad P_2 = \dfrac{1}{(r_{O6}\parallel r_{O7})C_2}$
Lec 17 · Transfer function with CC: the RHP zero and pole splitting::$\dfrac{V_{out}}{V_{in}}(s) = \dfrac{G_{m1}G_{m2}R_1R_2\left(1 - s\frac{C_C}{G_{m2}}\right)}{1 + s\left[\{C_1 + (1+G_{m2}R_2)C_C\}R_1 + R_2(C_2+C_C)\right] + s^2R_1R_2(C_1C_2 + C_2C_C + C_1C_C)}$ , $D = \left(1+\dfrac{s}{\omega_{p1}}\right)\left(1+\dfrac{s}{\omega_{p2}}\right) = 1 + \left(\dfrac{1}{\omega_{p1}} + \dfrac{1}{\omega_{p2}}\right)s + \dfrac{s^2}{\omega_{p1}\omega_{p2}}$

Back to [[Home]] · [[Formula sheet]]
