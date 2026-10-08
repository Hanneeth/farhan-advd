---
tags: ["question", "source/mid-sem", "unit/L5", "unit/L14"]
aliases: ["Mid-sem 2025-26 Q2 (14 marks)"]
---
# 2025 mid-sem Q2: design a Miller-compensated two-stage op amp

**Source:** Mid-sem 2025-26 Q2 (14 marks) · **Exam time:** 21 min (14 marks × 1.5 min)

**Topics:** [[L5 Two-stage op amp]] · [[L14 Compensation II]] · **Lectures:** [[Lec 07]] · [[Lec 17]]

> [!quote] 2025-26 mid-sem, Question 2 (as printed)
> ![[m25q2.webp]]

## Question

Design the two-stage op amp (find every W/L, I and Cc): DC gain 60 dB, GBW = 50 MHz, PM ≥ 60°, SR = 50 V/µs, ICMR(+) = 1.6 V, ICMR(−) = 0.9 V, CL = 5 pF. Use the minimum Cc for 60°. The mirror M3–M4 is perfect when sizing M7; M5 and M6 are the same size. µnCox = 300 µA/V², Vth1(max) = 0.59 V, Vth1(min) = 0.47 V, µpCox = 60 µA/V², |Vth3(max)| = 0.51 V, VDD = 1.8 V.

| Given | Value |
|---|---|
| $C_L$ | 5 pF |
| $SR$ | 50 V/µs |
| $GBW$ | 50 MHz |

**Find:** Compensation capacitor · Bias current I (= I5) · Input pair · Mirror load · Tail and reference · Second-stage PMOS · Second-stage current source

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Go in the fixed order: Cc, I5, gm1, (W/L)1, (W/L)3, (W/L)5, (W/L)7, (W/L)8.
> 2. Cc ≥ 0.22CL is the 60° rule when the RHP zero sits at 10·GB.
> 3. ICMR(+) uses the smallest Vth1 and the largest |Vth3|; ICMR(−) uses the largest Vth1.
> 4. gm7 ≥ 10gm1 puts the RHP zero at 10·GB.

> [!info]- Concept and formulas
> The standard seven-step Miller design: Cc from the phase margin, the tail current from the slew rate, gm1 from the GBW, then each W/L from one spec (ICMR+ sizes the mirror, ICMR− sizes the tail, the RHP zero sizes the output device).
> $$C_c \ge 0.22\,C_L\ (PM\ 60^\circ,\ z = 10\,GB)$$
> $$I_5 = SR\cdot C_c,\quad g_{m1} = 2\pi\,GB\,C_c,\quad (W/L)_1 = \dfrac{g_{m1}^2}{2\mu_nC_{ox}I_{D1}}$$
> $$(W/L)_3 = \dfrac{2I_{D3}}{\mu_pC_{ox}\left[V_{DD} - ICMR^+ - |V_{th3}|_{max} + V_{th1,min}\right]^2}$$
> $$V_{ov5} = ICMR^- - \sqrt{\tfrac{2I_{D1}}{\mu_nC_{ox}(W/L)_1}} - V_{th1,max}$$
> $$g_{m7} \ge 10g_{m1},\quad (W/L)_7 = \dfrac{g_{m7}}{\mu_pC_{ox}V_{ov3}},\quad (W/L)_8 = (W/L)_5\dfrac{I_{D7}}{I_5}$$

> [!success]- Answers
> - Compensation capacitor: **1.1 pF**
> - Bias current I (= I5): **55 µA**
> - Input pair: **7.238**
> - Mirror load: **35.81**
> - Tail and reference: **16.11**
> - Second-stage PMOS: **360**
> - Second-stage current source: **81**

> [!example]- Full solution
> 1. ① Cc for 60° with the zero at 10·GB: Cc ≥ 0.22 CL
>    $$C_c = 0.22\times 5\,\mathrm{pF} = 1.1\,\mathrm{pF}$$
> 2. ② Slew rate sets the tail current (M5 = M6 so I = I5)
>    $$I_5 = SR\cdot C_c = 50\,\mathrm{V/\mu s}\times 1.1\,\mathrm{pF} = 55\,\mathrm{\mu A}$$
> 3. ③ GBW sets gm1; square law gives (W/L)1,2 at ID1 = I5/2
>    $$g_{m1} = 2\pi(50\,\mathrm{M})C_c = 0.346\,\mathrm{mS},\quad (W/L)_{1,2} = \frac{g_{m1}^2}{2(300\mu)(27.5\,\mathrm{\mu A})} = 7.24$$
> 4. ④ ICMR(+): M1 at its edge against M3’s diode drop (worst-case thresholds)
>    $$(W/L)_{3,4} = \frac{2(27.5\,\mathrm{\mu A})}{60\mu\,(1.8 - 1.6 - 0.51 + 0.47)^2} = 35.81$$
> 5. ⑤ ICMR(−): what is left for the tail after VGS1
>    $$V_{ov5} = 0.9 - 0.159 - 0.59 = 0.151,\quad (W/L)_{5,6} = 16.11$$
> 6. ⑥ RHP zero at 10·GB → gm7 = 10gm1; perfect mirror → |Vov7| = |Vov3|
>    $$g_{m7} = 3.46\,\mathrm{mS},\; |V_{ov3}| = 0.16,\; (W/L)_7 = \frac{g_{m7}}{60\mu\times 0.16} = 360$$
> 7. ⑦ M8 mirrors M5 and must carry I7
>    $$I_7 = \tfrac12(60\mu)(W/L)_7V_{ov3}^2 = 276\,\mathrm{\mu A},\quad (W/L)_8 = 16.11\times\frac{276\,\mathrm{\mu A}}{55\,\mathrm{\mu A}} = 81$$

> [!note]- Official solution, Q2
> ![[k-m25q2.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **gm1 from GBW:** `2 × π × 50 [M] × 1.1 [p]`
> - **(W/L)3,4 in one line:** `2 × 27.5[µ] ÷ ( 60[µ] × ( 1.8 − 1.6 − 0.51 + 0.47 )² )`

