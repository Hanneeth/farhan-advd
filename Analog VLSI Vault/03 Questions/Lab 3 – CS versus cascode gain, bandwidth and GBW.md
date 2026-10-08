---
tags: ["question", "source/lab", "unit/U9", "unit/U12"]
aliases: ["Lab 3 (hand calculations)"]
---
# Lab 3: CS versus cascode gain, bandwidth and GBW

**Source:** Lab 3 (hand calculations)

**Topics:** [[U9 Cascode]] · [[U12 Poles and bandwidth]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

ID = 20 µA, V* = 200 mV, CL = 1 pF, ideal current-source loads. Example chart reading: VA = 5 V (rO = VA/ID). Find gm, the CS gain gm·rO, the cascode gain ≈ (gm·rO)², the CS bandwidth and the GBW of both.

| Given | Value |
|---|---|
| $I_D$ | 20 µA |
| $V^*$ | 200 mV |
| $V_A$ | 5 V |
| $C_L$ | 1 pF |

**Find:** gm = 2ID/V* · CS gain · Cascode gain · CS bandwidth · GBW (both)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. gm = 2ID/V*.
> 2. Intrinsic gain = 2VA/V*.
> 3. GBW = gm/(2πCL): Rout cancels.
> 4. gm = 0.2 mS.

> [!success]- Answers
> - gm = 2ID/V*: **200 µS**
> - CS gain: **50 V/V**
> - Cascode gain: **2500 V/V**
> - CS bandwidth: **636.6 kHz**
> - GBW (both): **31.83 MHz**

> [!example]- Full solution
> 1. gm from V*
>    $$g_m = \frac{2(20\mu)}{0.2} = 0.2\,\mathrm{mS}$$
> 2. CS with an ideal load: intrinsic gain 2VA/V*
>    $$A_{CS} = g_m r_O = \frac{2V_A}{V^*} = 50$$
> 3. Cascode (cascoded load too): about the square
>    $$A_{cas} \approx (g_m r_O)^2 = 2500$$
> 4. CS pole at the output
>    $$f_{-3dB} = \frac{1}{2\pi r_O C_L} = 637\,\mathrm{kHz}$$
> 5. GBW = gm/(2πCL) for both: the cascode trades bandwidth for gain one-for-one
>    $$GBW = 31.8\,\mathrm{MHz}$$

