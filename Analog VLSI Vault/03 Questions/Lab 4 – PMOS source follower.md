---
tags: ["question", "source/lab", "unit/U8"]
aliases: ["Lab 4 (hand calculations)"]
---
# Lab 4: PMOS source follower

**Source:** Lab 4 (hand calculations)

**Topics:** [[U8 Source follower and common gate]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A PMOS source follower biased at 10 µA with V* = 200 mV drives CL = 2 pF. Find gm, the output resistance (≈ 1/gm) and the output pole, and say how far the output shifts from the input.

| Given | Value |
|---|---|
| $I_D$ | 10 µA |
| $V^*$ | 200 mV |
| $C_L$ | 2 pF |

**Find:** gm · Output resistance · Output pole · DC shift

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. The source is the small terminal: 1/gm.
> 2. gm = 2ID/V*.
> 3. f = gm/(2πCL).
> 4. Rout = 10 kΩ.

> [!success]- Answers
> - gm: **100 µS**
> - Output resistance: **10 kΩ**
> - Output pole: **7.958 MHz**
> - DC shift: **0**

> [!example]- Full solution
> 1. gm = 2ID/V*
>    $$g_m = 0.1\,\mathrm{mS}$$
> 2. Looking into the source: 1/gm
>    $$R_{out} = 10\,\mathrm{k\Omega}$$
> 3. Output pole
>    $$f_p = \frac{g_m}{2\pi C_L} = 7.96\,\mathrm{MHz}$$
> 4. A PMOS source sits one |VGS| above its gate
>    $$V_{out} = V_{in} + |V_{GS}|$$

