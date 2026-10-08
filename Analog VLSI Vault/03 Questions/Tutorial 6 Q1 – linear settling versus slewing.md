---
tags: ["question", "source/tutorial", "unit/L9", "unit/L1"]
aliases: ["Tutorial 6 Q1"]
---
# Tutorial 6 Q1: linear settling versus slewing

**Source:** Tutorial 6 Q1

**Topics:** [[L9 Input range and slew rate]] · [[L1 Performance parameters]] · **Lectures:** [[Lec 01]] · [[Lec 02]] · [[Lec 13]] · [[Lec 14]]

> [!quote] Tutorial 6, Question 1 (as printed)
> ![[t6q1.webp]]

## Question

Non-inverting amplifier: R1 = 4 MΩ, R2 = 1 MΩ, CL = 8 pF, A = 80 dB, Rout = 50 kΩ, Imax = 160 µA. (a) Closed-loop gain, time constant, and Vout 1 ns after a 50 mV step. (b) The initial slope for that step. (c) The slew rate and the step size above which slewing starts. (d) For a 1 V step, how long the output slews.

| Given | Value |
|---|---|
| $A$ | 10000 |
| $R_{out}$ | 50 kΩ |
| $C_L$ | 8 pF |
| $I_{max}$ | 160 µA |

**Find:** (a) Closed-loop gain · (a) Time constant · (a) Output at 1 ns · (b) Initial slope · (c) Slew rate · (c) Critical step · (d) Slewing time for 1 V

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. β = R2/(R1 + R2).
> 2. τ = RoutCL/(1 + βA) (the formula printed on the sheet).
> 3. Initial slope = V0·ACL/τ; slewing when that exceeds Imax/CL.
> 4. β = 0.2.

> [!info]- Concept and formulas
> Linear settling: τ = RoutCL/(1 + βA); initial slope = final value/τ. If that slope exceeds SR = Imax/CL the output slews first, then settles.
> $$A_{CL} = \dfrac{A}{1+\beta A},\; \tau = \dfrac{R_{out}C_L}{1+\beta A}$$
> $$SR = \dfrac{I_{max}}{C_L},\quad V_{0,crit} = \dfrac{SR\cdot\tau}{A_{CL}}$$

> [!success]- Answers
> - (a) Closed-loop gain: **4.998**
> - (a) Time constant: **199.9 ps**
> - (a) Output at 1 ns: **248.2 mV**
> - (b) Initial slope: **1250 V/µs**
> - (c) Slew rate: **20 V/µs**
> - (c) Critical step: **800 µV**
> - (d) Slewing time for 1 V: **249.7 ns**

> [!example]- Full solution
> 1. β = R2/(R1 + R2) = 0.2; ACL = A/(1 + βA)
>    $$A_{CL} = \frac{10^4}{1 + 2000} = 4.9975$$
> 2. Feedback divides the output time constant RoutCL by (1 + βA)
>    $$\tau = \frac{(8\,\mathrm{pF})(50\,\mathrm{k\Omega})}{2001} = 200\,\mathrm{ps}$$
> 3. Linear step response
>    $$V_{out} = 0.05\times 4.998\,(1 - e^{-1\,\mathrm{ns}/\tau}) = 0.2482\,\mathrm{V}$$
> 4. (b) Initial slope = final value / τ
>    $$\frac{0.05\times 4.998}{\tau} = 1250\,\mathrm{V/\mu s}$$
> 5. (c) The op amp can deliver at most Imax into CL
>    $$SR = \frac{160\,\mu\mathrm{A}}{8\,\mathrm{pF}} = 20\,\mathrm{V/\mu s}$$
> 6. Slewing starts when V0·ACL/τ exceeds SR
>    $$V_{0,crit} = \frac{SR\,\tau}{A_{CL}} = 800\,\mathrm{\mu V}$$
> 7. (d) Ramp at SR until the remaining error is SR·τ, then settle linearly
>    $$t_{slew} = \frac{V_0 A_{CL} - SR\,\tau}{SR} = 250\,\mathrm{ns}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Output after t:** `V0 × Acl × ( 1 − e^( −t ÷ τ ) )`

