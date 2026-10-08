---
tags: ["question", "source/Razavi", "unit/L12"]
aliases: ["Razavi Problem 10.4"]
---
# Razavi 10.4: 50% peaking → what phase margin?

**Source:** Razavi Problem 10.4

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

A unity-gain feedback amplifier peaks by 50% near the gain crossover. What is its phase margin?

| Given | Value |
|---|---|
| $|A_f(\omega_{gx})|\beta$ | 1.5 |

**Find:** Phase margin

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Use the Lec 16 calculation backwards.
> 2. |1 + 1∠(PM − 180°)| = 2 sin(PM/2).
> 3. Peak = 1/(2 sin(PM/2)) = 1.5.
> 4. sin(PM/2) = 1/3.

> [!info]- Concept and formulas
> Peak K/β at ωgx → PM = 2 sin⁻¹(1/(2K)).
> $$PM = 2\sin^{-1}\dfrac{1}{2K}$$

> [!success]- Answers
> - Phase margin: **38.94 °**

> [!example]- Full solution
> 1. At ωgx: |βA| = 1 and ∠βA = PM − 180°, so |1 + βA| = 2 sin(PM/2)
>    $$|A_f(\omega_{gx})| = \frac{1}{\beta}\cdot\frac{1}{2\sin(PM/2)}$$
> 2. Set it equal to 1.5/β
>    $$\sin\frac{PM}{2} = \frac{1}{3} \Rightarrow PM = 2\sin^{-1}\frac{1}{3} = 38.9^\circ$$
> 3. Check with Lec 16: 45° gives 1.3×, 60° gives 1.0×, so 1.5× must be below 45°

> [!abstract]- Calculator keys (fx-991CW)
> - **PM from peaking:** `2 sin⁻¹( 1 ÷ ( 2 × 1.5 ) )`

