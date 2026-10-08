---
tags: ["question", "source/Razavi", "unit/U11", "unit/L2"]
aliases: ["Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)"]
---
# Chat: input range of a 5-T OTA buffer on a 1 V supply

**Source:** Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)

**Topics:** [[U11 Five-transistor OTA]] · [[L2 One-stage op amps]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A five-transistor OTA on VDD = 1 V, every |Vth| = 0.3 V, every overdrive 0.1 V (the tail needs VISS = 0.1 V). Find the input CM range.

| Given | Value |
|---|---|
| $V_{DD}$ | 1 V |
| $V_{th}$ | 300 mV |
| $V_{ov}$ | 100 mV |

**Find:** Lowest input · Highest input

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Two fences.
> 2. Floor = tail headroom + VGS1.
> 3. Ceiling = diode node + Vth.
> 4. VGS = 0.4 V.

> [!success]- Answers
> - Lowest input: **500 mV**
> - Highest input: **900 mV**

> [!example]- Full solution
> 1. Floor: VISS + VGS1
>    $$0.1 + 0.4 = 0.5\,\mathrm{V}$$
> 2. Ceiling: VDD − |VGS3| + Vth1
>    $$1 - 0.4 + 0.3 = 0.9\,\mathrm{V}$$

