---
tags: ["question", "source/lab", "unit/U11", "unit/U12"]
aliases: ["Lab 7 (hand calculations)"]
---
# Lab 7: turn the 5-T OTA specs into numbers

**Source:** Lab 7 (hand calculations)

**Topics:** [[U11 Five-transistor OTA]] · [[U12 Poles and bandwidth]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Specs: GBW ≥ 5 MHz with CL = 5 pF, DC gain ≥ 34 dB, CMRR ≥ 74 dB. Find the minimum gm1,2, the minimum gain as a ratio, and the minimum CMRR as a ratio.

| Given | Value |
|---|---|
| $GBW$ | 5 MHz |
| $C_L$ | 5 pF |

**Find:** Minimum gm · Minimum gain (V/V) · Minimum CMRR (ratio)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. GBW fixes gm (CL given).
> 2. Voltage ratios use 20·log10.
> 3. 34 dB ≈ 50, 74 dB ≈ 5000.
> 4. gm ≈ 157 µS.

> [!success]- Answers
> - Minimum gm: **157.1 µS**
> - Minimum gain (V/V): **50.12**
> - Minimum CMRR (ratio): **5012**

> [!example]- Full solution
> 1. GBW = gm/(2πCL)
>    $$g_m = 2\pi(5\,\mathrm{MHz})(5\,\mathrm{pF}) = 0.157\,\mathrm{mS}$$
> 2. dB to a ratio: divide by 20, then 10^
>    $$10^{34/20} = 50.1$$
> 3. Same for CMRR
>    $$10^{74/20} = 5012$$

