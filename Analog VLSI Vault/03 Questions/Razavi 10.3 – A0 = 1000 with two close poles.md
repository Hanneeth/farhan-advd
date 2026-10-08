---
tags: ["question", "source/Razavi", "unit/L12"]
aliases: ["Razavi Problem 10.3"]
---
# Razavi 10.3: A0 = 1000 with two close poles

**Source:** Razavi Problem 10.3

**Topics:** [[L12 Stability II]] · **Lectures:** [[Lec 15]] · [[Lec 16]]

## Question

An amplifier has A0 = 1000 and poles at ωp1 = 1 MHz and ωp2. In unity-gain feedback, what is the phase margin if (a) ωp2 = 2ωp1 and (b) ωp2 = 4ωp1? (Frequencies in Hz here.)

| Given | Value |
|---|---|
| $A_0$ | 1000 |
| $f_{p1}$ | 1 MHz |

**Find:** (a) fp2 = 2 MHz · (b) fp2 = 4 MHz

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Where does |βA| reach 1?
> 2. Solve the quadratic in f².
> 3. PM = 180° − atan(fgx/fp1) − atan(fgx/fp2).
> 4. fgx ≈ 44.7 MHz in (a).

> [!info]- Concept and formulas
> Solve |βA| = 1 (a quadratic in f²), then add the two arctangents.
> $$(1 + f^2/f_{p1}^2)(1 + f^2/f_{p2}^2) = (\beta A_0)^2$$

> [!success]- Answers
> - (a) fp2 = 2 MHz: **3.844 °**
> - (b) fp2 = 4 MHz: **4.53 °**

> [!example]- Full solution
> 1. |βA| = 1: (1 + f²/fp1²)(1 + f²/fp2²) = 10⁶, a quadratic in f²
>    $$f_{gx,(a)} = 44.7\,\mathrm{MHz},\; f_{gx,(b)} = 63.2\,\mathrm{MHz}$$
> 2. (a) Both poles are far below ωgx: each gives nearly 90°
>    $$PM = 180^\circ - 88.7^\circ - 87.4^\circ = 3.84^\circ$$
> 3. (b) Moving fp2 up helps only a little
>    $$PM = 4.53^\circ$$
> 4. Almost oscillating: with this much gain the second pole must be far above A0·fp1 = 1 GHz

> [!abstract]- Calculator keys (fx-991CW)
> - **Solve the quadratic in f²:** `[HOME] ▸ Equation ▸ Polynomial ▸ ax²+bx+c`

