---
tags: ["question", "source/mid-sem", "unit/L12"]
aliases: ["Mid-sem 2025-26 Q5 (9 marks)"]
---
# 2025 mid-sem Q5: phase margin of two close poles, and PM from 50% peaking

**Source:** Mid-sem 2025-26 Q5 (9 marks) · **Exam time:** 14 min (9 marks × 1.5 min)

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

> [!quote] 2025-26 mid-sem, Question 5 (as printed)
> ![[m25q5.webp]]

## Question

(a) AM = 1000, poles at ωp1 and ωp2, ωp1 = 1 MHz, unity-gain feedback. PM for (i) ωp2 = 2ωp1 and (ii) ωp2 = 4ωp1. (b) A unity-gain closed loop peaks by 50% near the gain crossover: what is the PM?

| Given | Value |
|---|---|
| $A_M$ | 1000 |
| $\beta$ | 1 |

**Find:** (a)(i) ωp2 = 2ωp1 · (a)(ii) ωp2 = 4ωp1 · (b) PM for 50% peaking

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. With AM = 1000 and poles 1–4 MHz apart, the crossover is far above both poles.
> 2. Above both poles |βA| ≈ AM·ωp1ωp2/ω².
> 3. PM = 180° − Σ atan(ωGX/ωp).
> 4. Peaking: |1 + e^{jθ}| with θ = −(180° − PM).

> [!info]- Concept and formulas
> Find where |βA| = 1 (both poles are far below it, so each contributes almost −90°), then PM = 180° minus the two arctangents. For peaking, at ωGX the closed-loop gain is (1/β)/|1 + e^{−j(180°−PM)}| = 1/(2 sin(PM/2)).
> $$|\beta A| = \dfrac{A_M}{\sqrt{1+(\omega/\omega_{p1})^2}\sqrt{1+(\omega/\omega_{p2})^2}} = 1 \Rightarrow \omega_{GX} \approx \sqrt{A_M\omega_{p1}\omega_{p2}}$$
> $$PM = 180^\circ - \tan^{-1}\dfrac{\omega_{GX}}{\omega_{p1}} - \tan^{-1}\dfrac{\omega_{GX}}{\omega_{p2}}$$
> $$\dfrac{|A_f(\omega_{GX})|}{1/\beta} = \dfrac{1}{2\sin(PM/2)} \Rightarrow PM = 2\sin^{-1}\dfrac{1}{2K}$$

> [!success]- Answers
> - (a)(i) ωp2 = 2ωp1: **3.844 °**
> - (a)(ii) ωp2 = 4ωp1: **4.53 °**
> - (b) PM for 50% peaking: **38.94 °**

> [!example]- Full solution
> 1. (i) Both poles are far below ωGX: |βA| ≈ AM·ωp1ωp2/ω² = 1
>    $$\omega_{GX} = 44.69\,\omega_{p1}$$
> 2. Add up the two phase lags
>    $$PM = 180^\circ - \tan^{-1}(44.69) - \tan^{-1}(22.35) = 3.84^\circ$$
> 3. (ii) Same with ωp2 = 4ωp1: still tiny — two poles this close cannot be fixed by moving one a little
>    $$\omega_{GX} = 63.18\,\omega_{p1},\quad PM = 4.53^\circ$$
> 4. (b) 50% peaking: 1/(2 sin(PM/2)) = 1.5
>    $$PM = 2\sin^{-1}\frac{1}{3} = 38.94^\circ$$

> [!note]- Official solution, Q5
> ![[k-m25q5.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Degree mode first:** `[SETTINGS] ▸ Calc Settings ▸ Angle Unit ▸ Degree`
> - **Crossover with the Solver:** `[HOME] ▸ Equation ▸ Solver:  1000 ÷ ( √(1+x²) × √(1+(x÷2)²) ) = 1   → solve near x = 40`
> - **PM:** `180 − tan⁻¹(44.71) − tan⁻¹(44.71 ÷ 2)`
> - **(b) in one line:** `2 sin⁻¹( 1 ÷ (2 × 1.5) )`

