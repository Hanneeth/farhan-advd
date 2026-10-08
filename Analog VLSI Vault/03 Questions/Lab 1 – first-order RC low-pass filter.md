---
tags: ["question", "source/lab", "unit/U12"]
aliases: ["Lab 1 (hand calculations)"]
---
# Lab 1: first-order RC low-pass filter

**Source:** Lab 1 (hand calculations)

**Topics:** [[U12 Poles and bandwidth]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Design a first-order RC low-pass filter with R = 1 kΩ and a 1 ns time constant. Find C, the 10–90% rise time, the DC gain and the −3 dB bandwidth.

| Given | Value |
|---|---|
| $R$ | 1 kΩ |
| $\tau$ | 1 ns |

**Find:** Capacitor · Rise time (10–90%) · Bandwidth

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. A capacitor charging through a resistor: τ = RC.
> 2. Rise time 10–90% = 2.2τ.
> 3. f = 1/(2πRC).
> 4. C = 1 pF.

> [!success]- Answers
> - Capacitor: **1 pF**
> - Rise time (10–90%): **2.2 ns**
> - Bandwidth: **159.2 MHz**

> [!example]- Full solution
> 1. τ = RC
>    $$C = \frac{1\,\mathrm{ns}}{1\,\mathrm{k\Omega}} = 1\,\mathrm{pF}$$
> 2. 10% at 0.105τ, 90% at 2.303τ: the difference is ln 9 ≈ 2.2τ
>    $$t_r = \ln 9\,\tau \approx 2.2\tau = 2.2\,\mathrm{ns}$$
> 3. One pole at 1/(RC); divide by 2π for Hz (DC gain = 1)
>    $$f_{-3dB} = \frac{1}{2\pi\,(1\,\mathrm{ns})} = 159\,\mathrm{MHz}$$

