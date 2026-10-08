---
tags: ["question", "source/mid-sem", "unit/L12", "unit/L14"]
aliases: ["Mid-sem 2023-24 Q5 (5 marks)"]
---
# 2023 mid-sem Q5: peaking factor K at PM 50°; Cc vs CL for 45°

**Source:** Mid-sem 2023-24 Q5 (5 marks) · **Exam time:** 8 min (5 marks × 1.5 min)

**Topics:** [[L12 Stability II]] · [[L14 Compensation II]] · **Lectures:** [[Lec 15]] · [[Lec 16]] · [[Lec 17]]

> [!quote] 2023-24 mid-sem, Question 5 (as printed)
> ![[m23q5.webp]]

## Question

(a) If PM = 50°, |Vout/Vin(jωGX)| = K/β. Find K. (b) In a Miller-compensated OTA, for PM = 45° with the RHP zero at 10 × GBW, what relation is needed between CL and Cc?

| Given | Value |
|---|---|
| $PM$ | 50 ° |

**Find:** (a) K · (b) minimum Cc / CL

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Peaking factor: 1/(2 sin(PM/2)).
> 2. The zero at 10ωu costs atan(0.1) = 5.7°.
> 3. The dominant pole costs 90°.
> 4. gm2 = 10gm1 because ωz/ωu = gm2/gm1.

> [!info]- Concept and formulas
> (a) At ωGX the loop gain is 1∠(PM − 180°), so the closed loop is (1/β)/|1 + e^{−j(180°−PM)}| = (1/β)/(2 sin(PM/2)). (b) Two-stage Miller: ωu = gm1/Cc, ωp2 = gm2/CL, ωz = gm2/Cc. Zero at 10ωu means gm2 = 10gm1; then spend the remaining phase on the second pole.
> $$K = \dfrac{1}{2\sin(PM/2)}$$
> $$PM = 90^\circ - \tan^{-1}\dfrac{\omega_u}{\omega_{p2}} - \tan^{-1}\dfrac{\omega_u}{\omega_z}$$
> $$\omega_z = 10\omega_u \Rightarrow g_{m2} = 10g_{m1},\quad C_c = \dfrac{g_{m1}}{g_{m2}}\dfrac{C_L}{\tan(\cdot)}$$

> [!success]- Answers
> - (a) K: **1.183**
> - (b) minimum Cc / CL: **0.1222**

> [!example]- Full solution
> 1. (a) K = 1/(2 sin 25°)
>    $$K = 1.183$$
> 2. (b) Phase left for the second pole: 45° − atan(0.1)
>    $$\tan^{-1}\frac{\omega_u}{\omega_{p2}} = 39.29^\circ$$
> 3. ωp2 = ωu/tan(that), with gm2 = 10gm1
>    $$\frac{g_{m2}}{C_L} = \frac{g_{m1}}{C_c\tan(39.29^\circ)} \Rightarrow C_c \ge 0.122\,C_L$$

> [!note]- Official answers, Q5
> ![[k-m23q5.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **(b):** `0.1 ÷ tan( 45 − tan⁻¹(0.1) )`

