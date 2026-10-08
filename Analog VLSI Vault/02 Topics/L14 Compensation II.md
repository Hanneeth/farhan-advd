---
tags: ["topic", "unit/L14", "group/handout"]
aliases: ["Compensation II"]
---
# L14 · Compensation II

*CC, the RHP zero, Rz, slewing*

**Reference:** Handout L14 · 1st ed §10.5 · 2nd ed §10.5–10.6 · **Lectures:** [[Lec 17]]

**Needs first:** [[L13 Compensation I]]

## Compensating the two-stage op amp: GBW = Gm1/CC, choose CC for 60°

**Why:** Handout L14 and Lec 17’s circuit (5-T OTA + M6/M7): choose CC, then give GBW, the zero, Rz and the slew rate.

> [!question] Predict first: You double CC in a two-stage op amp. The unity-gain bandwidth…
> a) doubles
> b) halves
> c) does not change

> [!success]- Answer
> **halves**. GBW = Gm1/CC: the first stage’s current charges CC. Twice the capacitor, half the bandwidth (and half the slew rate), but more phase margin.

Above P1′ the gain is $G_{m1}/(\omega C_C)$ (the first stage charging CC), so the unity-gain frequency is $\omega_u = G_{m1}/C_C$, independent of the output stage.

For the phase margin (β = 1), the dominant pole gives −90°; the output pole $\omega_{p2} \approx G_{m2}/C_L$ may take only 90° − PM:
$\omega_{p2} = \omega_u\tan PM$, so $C_C = \dfrac{G_{m1}C_L\tan PM}{G_{m2}}$.
45° → $C_C = (G_{m1}/G_{m2})C_L$ (Razavi Ex 10.6); 60° → 1.73×.

Slewing: the tail current charges CC, so $SR = I_{SS}/C_C$, unless M7 cannot also feed CL: then $(I_7 - I_{SS})/C_L$. A two-stage op amp gets **less** stable with more CL (P2 moves down).

**The rule**

$$\omega_u = \dfrac{G_{m1}}{C_C},\quad \omega_{p2} \approx \dfrac{G_{m2}}{C_L}$$

$$C_C = \dfrac{G_{m1}C_L\tan PM}{G_{m2}}\;(\text{zero removed})$$

$$SR = \min\left(\dfrac{I_{SS}}{C_C},\,\dfrac{I_7 - I_{SS}}{C_L}\right)$$

> [!note]
> Allen’s check: RHP zero at ≥ 10·GBW and P2 ≥ 2.2·GBW give 60°, i.e. CC ≥ 0.22·CL when Gm2 = 10·Gm1. The tan formula with the zero kept gives the same 0.22.

> [!important] Lock it in
> GBW = Gm1/CC; P2 ≈ Gm2/CL; CC = Gm1CL·tan(PM)/Gm2 (45° → Gm1CL/Gm2). SR = ISS/CC (or (I7 − ISS)/CL). More CL hurts a two-stage op amp.
> **Hook:** “Gm1 charges CC: that is the bandwidth and the slew.”

## The right-half-plane zero and the nulling resistor

**Why:** The numerator in Lec 17, (1 − sCC/Gm2), is a right-half-plane zero; Razavi removes it with Rz = 1/Gm2 or uses it to cancel P2.

> [!question] Predict first: A right-half-plane zero affects the phase like…
> a) a zero: it adds phase (helps)
> b) a pole: it removes phase (hurts)
> c) nothing

> [!success]- Answer
> **a pole: it removes phase (hurts)**. The factor (1 − s/ωz) has phase −atan(ω/ωz): lag, like a pole. Yet its magnitude rises like a zero, so it also slows the gain’s fall. Double trouble (Razavi Ex 10.7).

CC is also a **shortcut**: the input of the second stage reaches the output directly through CC, with the opposite sign to the main path through M6. At $\omega_z = G_{m2}/C_C$ the two currents cancel ($G_{m2}v = sC_Cv$): a zero, in the **right** half plane.

A RHP zero lags the phase like a pole but lifts the gain like a zero: it costs $\tan^{-1}(G_{m1}/G_{m2})$ of margin whatever CC is.

Fix: a resistor $R_z$ in series with CC makes the shortcut weaker. The zero moves to $1/[C_C(1/G_{m2} - R_z)]$:
$R_z = 1/G_{m2}$ sends it to infinity; $R_z = (C_L + C_C)/(G_{m2}C_C)$ puts it in the left half plane, on top of P2.

> [!tip] Picture it
> A leak in a pipe that carries water backwards: at one frequency the leak exactly cancels the main flow. A valve (Rz) in the leak fixes it.

**The rule**

$$\omega_z = \dfrac{G_{m2}}{C_C}\;\text{(RHP)}$$

$$\omega_z = \dfrac{1}{C_C(1/G_{m2} - R_z)}$$

$$R_z = \dfrac{1}{G_{m2}}\;(\omega_z\to\infty),\quad R_z = \dfrac{C_L + C_C}{G_{m2}C_C}\;(\text{cancels } P_2)$$

> [!important] Lock it in
> CC feeds forward: RHP zero at Gm2/CC, which lags like a pole. Rz = 1/Gm2 removes it; Rz = (CL + CC)/(Gm2CC) cancels P2. Do not try CC = CL to cancel P2 with the RHP zero.
> **Hook:** “Close the backwards leak with a valve.”

## Questions you can solve after this topic

- [[Razavi Ex 10.6 – first estimate of CC for 45°]] · Razavi Example 10.6
- [[PS2 P4 – add a second stage to your exam OTA and compensate it]] · Problem Set 2 P4 (L13–L14, Lec 17)
- [[2025 mid-sem Q2 – design a Miller-compensated two-stage op amp]] · Mid-sem 2025-26 Q2 (14 marks)
- [[2024 mid-sem Q2 – analyse a Miller two-stage op amp]] · Mid-sem 2024-25 Q2 (15 marks)
- [[2023 mid-sem Q5 – peaking factor K at PM 50°; Cc vs CL for 45°]] · Mid-sem 2023-24 Q5 (5 marks)
- [[2024 Quiz 2 Q1 – GBW, PM and Cc from a Miller op amp’s Bode data]] · Quiz 2 2024-25 Q1 (6 marks)

## Flashcards

[[Flashcards – L14]]

## Symbols

[[nulling resistor (Rz)]]
