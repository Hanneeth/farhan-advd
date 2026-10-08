---
tags: ["question", "source/quiz", "unit/L14"]
aliases: ["Quiz 2 2024-25 Q1 (6 marks)"]
---
# 2024 Quiz 2 Q1: GBW, PM and Cc from a Miller op amp’s Bode data

**Source:** Quiz 2 2024-25 Q1 (6 marks) · **Exam time:** 12 min (6 marks × 2 min)

**Topics:** [[L14 Compensation II]] · **Lectures:** [[Lec 17]]

> [!quote] 2024-25 Quiz 2, Question 1 (as printed)
> ![[q24bq1.webp]]

## Question

A Miller-compensated two-stage op amp has DC gain 80 dB, poles at 15.9 kHz and 740 MHz, and a zero at 3.18 GHz. CL = 5 pF. Find the GBW, the PM and Cc.

| Given | Value |
|---|---|
| $A_0$ | 10000 |
| $f_{p1}$ | 15.9 kHz |
| $f_{p2}$ | 740 MHz |
| $f_z$ | 3.18 GHz |

**Find:** GBW · Phase margin · Compensation capacitor

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. 80 dB = 10⁴.
> 2. GBW = A0·fp1.
> 3. fp2 = gm2/(2πCL), fz = gm2/(2πCc).
> 4. Divide them: Cc/CL = fp2/fz.

> [!info]- Concept and formulas
> GBW = A0 × fp1. PM at the GBW. The second pole gives gm2 (= 2πfp2CL); the zero gm2/(2πCc) then gives Cc.
> $$GBW = A_0f_{p1}$$
> $$PM = 180^\circ - \tan^{-1}A_0 - \tan^{-1}\tfrac{GBW}{f_{p2}} - \tan^{-1}\tfrac{GBW}{f_z}$$
> $$g_{m2} = 2\pi f_{p2}C_L,\quad C_c = \dfrac{g_{m2}}{2\pi f_z}$$

> [!success]- Answers
> - GBW: **159 MHz**
> - Phase margin: **75.02 °**
> - Compensation capacitor: **1.164 pF**

> [!example]- Full solution
> 1. GBW = 10⁴ × 15.9 kHz
>    $$GBW = 159\,\mathrm{MHz}$$
> 2. PM
>    $$PM = 180^\circ - 90^\circ - \tan^{-1}\frac{159}{740} - \tan^{-1}\frac{159}{3180} = 75^\circ$$
> 3. gm2 from the second pole, then Cc from the zero
>    $$g_{m2} = 2\pi(740\,\mathrm{M})(5\,\mathrm{p}) = 23.2\,\mathrm{mS},\; C_c = \frac{g_{m2}}{2\pi(3.18\,\mathrm{G})} = 1.16\,\mathrm{pF}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Cc directly:** `5[p] × 740[M] ÷ 3.18[G]`

