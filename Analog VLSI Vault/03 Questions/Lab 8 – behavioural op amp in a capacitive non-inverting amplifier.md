---
tags: ["question", "source/lab", "unit/L1"]
aliases: ["Lab 8 (hand calculations)"]
---
# Lab 8: behavioural op amp in a capacitive non-inverting amplifier

**Source:** Lab 8 (hand calculations)

**Topics:** [[L1 Performance parameters]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Behavioural OTA: GM = 159 µS, DC gain Av = 58.75, fu = 5 MHz. It is used as a non-inverting amplifier with CF = 4 pF and CIN = 4 pF (ideal gain 1 + CIN/CF). Find COUT and ROUT of the model, β, the loop gain, the actual closed-loop DC gain and the closed-loop bandwidth.

| Given | Value |
|---|---|
| $G_M$ | 159 µS |
| $A_v$ | 58.75 V/V |
| $f_u$ | 5 MHz |
| $C_F$ | 4 pF |
| $C_{IN}$ | 4 pF |

**Find:** Model output capacitance · Model output resistance · Feedback factor · Closed-loop DC gain · Closed-loop bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. A one-pole model: GM into ROUT ‖ COUT.
> 2. β for a capacitive divider uses the capacitors like resistors, flipped: CF/(CF + CIN).
> 3. ACL = A/(1 + βA); BW ≈ β·fu.
> 4. β = 0.5.

> [!success]- Answers
> - Model output capacitance: **5.061 pF**
> - Model output resistance: **369.5 kΩ**
> - Feedback factor: **0.5**
> - Closed-loop DC gain: **1.934**
> - Closed-loop bandwidth: **2.585 MHz**

> [!example]- Full solution
> 1. fu = GM/(2π·COUT)
>    $$C_{OUT} = \frac{159\,\mu}{2\pi(5\,\mathrm{MHz})} = 5.06\,\mathrm{pF}$$
> 2. Av = GM·ROUT
>    $$R_{OUT} = \frac{58.75}{159\,\mu} = 369\,\mathrm{k\Omega}$$
> 3. Capacitive divider: β = CF/(CF + CIN)
>    $$\beta = \frac{4}{4 + 4} = 0.5$$
> 4. A/(1 + βA): the ideal 2 is missed by the gain error
>    $$A_{CL} = \frac{58.75}{1 + 29.375} = 1.934$$
> 5. Closed-loop bandwidth = (1 + βA)·f0 with f0 = fu/A
>    $$f_{-3dB} = (1 + 29.375)\times\frac{5\,\mathrm{MHz}}{58.75} = 2.59\,\mathrm{MHz}$$

