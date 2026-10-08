---
tags: ["question", "source/Razavi", "unit/L2"]
aliases: ["Buffer window lecture (tutoring chat, Razavi Ex 9.5)"]
---
# Chat: the telescopic buffer window

**Source:** Buffer window lecture (tutoring chat, Razavi Ex 9.5)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

## Question

A telescopic op amp is used as a unity-gain buffer. Vth = 0.4 V, Vov4 = 0.15 V, Vb1 = 1.2 V. Find the lowest and highest output and the window width.

| Given | Value |
|---|---|
| $V_{th}$ | 400 mV |
| $V_{ov4}$ | 150 mV |
| $V_{b1}$ | 1.2 V |

**Find:** Lowest output · Highest output · Window width

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. In a buffer the output is a gate voltage.
> 2. Floor from M4, ceiling from M2.
> 3. Width = Vth − Vov4.
> 4. VGS4 = 0.55 V.

> [!success]- Answers
> - Lowest output: **800 mV**
> - Highest output: **1.05 V**
> - Window width: **250 mV**

> [!example]- Full solution
> 1. M4 fence
>    $$V_{b1} - V_{th4} = 0.8\,\mathrm{V}$$
> 2. M2 fence (its gate is the output)
>    $$V_{b1} - V_{GS4} + V_{th2} = 1.2 - 0.55 + 0.4 = 1.05\,\mathrm{V}$$
> 3. One threshold minus one overdrive
>    $$V_{th} - V_{ov4} = 0.25\,\mathrm{V}$$

