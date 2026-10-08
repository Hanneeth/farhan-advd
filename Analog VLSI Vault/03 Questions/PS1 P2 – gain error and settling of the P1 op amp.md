---
tags: ["question", "source/problem-set", "unit/L1"]
aliases: ["Problem Set 1 P2 (tutoring chat)"]
---
# PS1 P2: gain error and settling of the P1 op amp

**Source:** Problem Set 1 P2 (tutoring chat)

**Topics:** [[L1 Performance parameters]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

The op amp of P1 is used in a non-inverting amplifier with closed-loop gain 5. (a) Static gain error. (b) Open-loop gain needed for 0.5% error. (c) With CL = 2 pF, the time to settle within 0.1%.

| Given | Value |
|---|---|
| $A_{closed}$ | 5 |
| $A$ | 84.33 V/V |

**Find:** (a) Gain error (fraction) · (b) Open-loop gain for 0.5% · (c) Time constant · (c) Settling time

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. β = 1/Aclosed.
> 2. ε = 1/(1 + βA); A ≥ Aclosed/ε.
> 3. τ = Aclosed/ωu; t = τ·ln(1/ε).
> 4. ωu = gm1/CL from P1.

> [!info]- Concept and formulas
> Gain error 1/(1 + βA); minimum A = Aclosed/ε; τ = 1/(βωu) with ωu = gm/CL; settle to 0.1% in ln(1000) = 6.91τ.
> $$\varepsilon = \dfrac{1}{1+\beta A}$$
> $$\tau = \dfrac{1}{\beta\omega_u},\; t = \tau\ln\dfrac{1}{\varepsilon}$$

> [!success]- Answers
> - (a) Gain error (fraction): **0.05597**
> - (b) Open-loop gain for 0.5%: **1000**
> - (c) Time constant: **7.906 ns**
> - (c) Settling time: **54.61 ns**

> [!example]- Full solution
> 1. (a) β = 1/5; ε = 1/(1 + βA)
>    $$\varepsilon = \frac{1}{1 + 0.2\times 84.3} = 0.056$$
> 2. (b) A ≥ Aclosed/ε
>    $$A \ge \frac{5}{0.005} = 1000$$
> 3. (c) τ = 1/(β ωu), ωu = gm1/CL
>    $$\tau = 7.91\,\mathrm{ns}$$
> 4. 0.1% needs ln(1000) = 6.91 τ
>    $$t = 6.91\tau = 54.6\,\mathrm{ns}$$

