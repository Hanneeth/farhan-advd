---
tags: ["question", "source/Razavi", "unit/L1"]
aliases: ["Razavi Example 9.2"]
---
# Ex 9.2: how fast must the op amp be to settle in 5 ns?

**Source:** Razavi Example 9.2

**Topics:** [[L1 Performance parameters]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A one-pole op amp is used with a closed-loop gain of 10. The output must settle to within 1% of its final value in 5 ns after a small step. Find the minimum unity-gain frequency ωu (and fu).

| Given | Value |
|---|---|
| $A_{closed}$ | 10 |
| $\varepsilon$ | 0.01 |
| $t_s$ | 5 ns |

**Find:** Minimum ωu · Minimum fu

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Settling is exponential with τ = Aclosed/ωu.
> 2. How many τ for 1%?
> 3. t = τ·ln(1/ε); ωu = Aclosed·ln(1/ε)/t.
> 4. ln(100) = 4.605.

> [!info]- Concept and formulas
> One-pole closed loop: τ = 1/(βωu). Settling to ε takes ln(1/ε) time constants.
> $$t_s = \tau\ln\dfrac{1}{\varepsilon} = \dfrac{\ln(1/\varepsilon)}{\beta\omega_u}$$
> $$f_u = \omega_u/2\pi$$

> [!success]- Answers
> - Minimum ωu: **9210000000 rad/s**
> - Minimum fu: **1.466 GHz**

> [!example]- Full solution
> 1. 1% settling takes ln(100) = 4.6 time constants
>    $$\tau \le \frac{5\,\mathrm{ns}}{4.6}$$
> 2. τ = 1/(β·ωu), so ωu ≥ ln(1/ε)/(β·t)
>    $$\omega_u \ge \frac{4.605}{0.1 \times 5\,\mathrm{ns}} = 9.21\,\mathrm{Grad/s}$$
> 3. Divide by 2π
>    $$f_u = 1.47\,\mathrm{GHz}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **ωu in one line:** `ln(100) ÷ ( 0.1 × 5[n] )`

