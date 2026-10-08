---
tags: ["question", "source/lab", "unit/L5", "unit/L9"]
aliases: ["Lab 9 (hand calculations)"]
---
# Lab 9: turn the two-stage buffer specs into numbers

**Source:** Lab 9 (hand calculations)

**Topics:** [[L5 Two-stage op amp]] · [[L9 Input range and slew rate]] · **Lectures:** [[Lec 07]] · [[Lec 13]] · [[Lec 14]]

## Question

A two-stage Miller OTA used as a unity-gain buffer: static gain error ≤ 0.05%, 10–90% rise time ≤ 70 ns, slew rate 5 V/µs, CL = 5 pF, Cc = 0.5·CL. Find the minimum DC gain (ratio and dB), τ, the required unity-gain frequency, and the first-stage current.

| Given | Value |
|---|---|
| $\varepsilon$ | 0.0005 |
| $t_r$ | 70 ns |
| $SR$ | 5 V/µs |
| $C_L$ | 5 pF |

**Find:** Minimum DC gain (V/V) · Minimum DC gain (dB) · Time constant · Unity-gain frequency · First-stage current

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Gain error of a buffer is about 1/A.
> 2. t(10–90%) = 2.2τ; τ = 1/ωu when β = 1.
> 3. SR = IB1/Cc in a Miller-compensated two-stage.
> 4. A ≥ 2000.

> [!success]- Answers
> - Minimum DC gain (V/V): **2000**
> - Minimum DC gain (dB): **66.02**
> - Time constant: **31.82 ns**
> - Unity-gain frequency: **5.002 MHz**
> - First-stage current: **12.5 µA**

> [!example]- Full solution
> 1. Buffer: ACL ≈ 1 − 1/A, so the error is 1/A
>    $$A \ge \frac{1}{0.0005} = 2000$$
> 2. In dB
>    $$20\log_{10}(2000) = 66.02\,\mathrm{dB}$$
> 3. Rise time = 2.2τ
>    $$\tau = \frac{70\,\mathrm{ns}}{2.2} = 31.8\,\mathrm{ns}$$
> 4. β = 1: τ = 1/ωu
>    $$f_u = \frac{1}{2\pi\tau} = 5\,\mathrm{MHz}$$
> 5. Miller OTA: SR = IB1/Cc
>    $$I_{B1} = (5\,\mathrm{V/\mu s})(2.5\,\mathrm{pF}) = 12.5\,\mathrm{\mu A}$$

