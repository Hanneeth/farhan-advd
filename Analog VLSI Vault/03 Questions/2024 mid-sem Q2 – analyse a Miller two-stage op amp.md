---
tags: ["question", "source/mid-sem", "unit/L5", "unit/L14"]
aliases: ["Mid-sem 2024-25 Q2 (15 marks)"]
---
# 2024 mid-sem Q2: analyse a Miller two-stage op amp

**Source:** Mid-sem 2024-25 Q2 (15 marks) · **Exam time:** 23 min (15 marks × 1.5 min)

**Topics:** [[L5 Two-stage op amp]] · [[L14 Compensation II]] · **Lectures:** [[Lec 07]] · [[Lec 17]]

> [!quote] 2024-25 mid-sem, Question 2 (as printed)
> ![[m24q2.webp]]

## Question

I1 = 10 µA, (W/L)6 = 10/1, (W/L)5 = 20/1, (W/L)1,2 = 10/1, (W/L)3,4 = 10/1, (W/L)7 = 80/1, Cc = 0.22 pF, CL = 1 pF. Find SR, GBW, DC gain, bandwidth, second pole, RHP zero and PM. VDD = 1.8 V, µnCox = 100 µA/V², µpCox = 50 µA/V², λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.

| Given | Value |
|---|---|
| $I_1$ | 10 µA |
| $C_c$ | 220 fF |
| $C_L$ | 1 pF |

**Find:** Slew rate · Gain-bandwidth product · DC gain · Bandwidth · Second pole · RHP zero · Phase margin

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Mirror ratios give every current: I5 = 2·I1, I7 = 8·I4.
> 2. SR and GBW both use Cc (not CL).
> 3. The second pole uses CL, the zero uses Cc, both with gm7.
> 4. PM: −90° from the dominant pole, minus atan(GBW/fp2) and atan(GBW/fz).

> [!info]- Concept and formulas
> Currents first (mirror ratios), then the four Miller results: SR = I5/Cc, GBW = gm1/(2πCc), second pole gm7/(2πCL), RHP zero gm7/(2πCc). DC gain is the product of the two stage gains; bandwidth = GBW/A0.
> $$SR = \dfrac{I_5}{C_c},\quad GBW = \dfrac{g_{m1}}{2\pi C_c}$$
> $$A_0 = g_{m1}(r_{O2}\parallel r_{O4})\cdot g_{m7}(r_{O7}\parallel r_{O8}),\quad f_{-3dB} = GBW/A_0$$
> $$f_{p2} = \dfrac{g_{m7}}{2\pi C_L},\quad f_z = \dfrac{g_{m7}}{2\pi C_c}$$
> $$PM = 180^\circ - \tan^{-1}A_0 - \tan^{-1}\dfrac{GBW}{f_{p2}} - \tan^{-1}\dfrac{GBW}{f_z}$$

> [!success]- Answers
> - Slew rate: **90.91 V/µs**
> - Gain-bandwidth product: **72.34 MHz**
> - DC gain: **1571 V/V**
> - Bandwidth: **46.04 kHz**
> - Second pole: **180.1 MHz**
> - RHP zero: **818.5 MHz**
> - Phase margin: **63.1 °**

> [!example]- Full solution
> 1. M5 is twice M6: I5 = 20 µA, 10 µA per input device
>    $$SR = \frac{20\,\mu A}{0.22\,\mathrm{pF}} = 90.9\,\mathrm{V/\mu s}$$
> 2. GBW from gm1 (PMOS, 10 µA, W/L 10)
>    $$g_{m1} = 0.1\,\mathrm{mS},\; GBW = \frac{g_{m1}}{2\pi C_c} = 72.3\,\mathrm{MHz}$$
> 3. VGS7 = VGS4, so I7 scales with W/L: 80/10 × 10 µA
>    $$V_{GS4} = 0.541\,\mathrm{V},\; I_7 = 80\,\mathrm{\mu A},\; g_{m7} = 1.13\,\mathrm{mS}$$
> 4. DC gain = A1·A2
>    $$A_0 = 0.1\,\mathrm{mS}(500\,\mathrm{k\Omega}\parallel 1\,\mathrm{M\Omega})\times 1.13\,\mathrm{mS}(125\,\mathrm{k\Omega}\parallel 62.5\,\mathrm{k\Omega}) = 33.3\times 47.1 = 1571$$
> 5. Bandwidth = GBW / A0
>    $$f_{-3dB} = 46\,\mathrm{kHz}$$
> 6. Second pole and RHP zero
>    $$f_{p2} = \frac{g_{m7}}{2\pi C_L} = 180\,\mathrm{MHz},\quad f_z = \frac{g_{m7}}{2\pi C_c} = 818\,\mathrm{MHz}$$
> 7. RHP zero (adds phase lag)
>    $$f_z = 818\,\mathrm{MHz}$$
> 8. PM at ω = GBW (β = 1)
>    $$PM = 180^\circ - 90^\circ - \tan^{-1}\frac{72.34}{180.1} - \tan^{-1}\frac{72.34}{818.5} = 63.1^\circ$$

> [!note]- Official key, Q2
> ![[k-m24q2.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **PM in degree mode:** `180 − tan⁻¹(1555) − tan⁻¹(72.34 ÷ 178.3) − tan⁻¹(72.34 ÷ 810.2)`

