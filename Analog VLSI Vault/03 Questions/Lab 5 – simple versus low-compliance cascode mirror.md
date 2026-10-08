---
tags: ["question", "source/lab", "unit/U6", "unit/U9"]
aliases: ["Lab 5 (hand calculations)"]
---
# Lab 5: simple versus low-compliance cascode mirror

**Source:** Lab 5 (hand calculations)

**Topics:** [[U6 Impedance rules, sources, diodes, mirrors]] · [[U9 Cascode]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A mirror takes IBIN = 20 µA and gives IBOUT = 2·IBIN (output devices twice as wide). V* = 200 mV. Example chart reading: VA = 10 V at this length. Find IBOUT, Rout of the simple mirror (rO) and of the cascode mirror (≈ gm·rO²), and the minimum output voltage of each (V* and 2V*).

| Given | Value |
|---|---|
| $I_{BIN}$ | 20 µA |
| $V^*$ | 200 mV |
| $V_A$ | 10 V |

**Find:** Output current · Simple mirror Rout · Cascode mirror Rout · Cascode minimum output

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. A mirror copies in proportion to size.
> 2. Simple: Rout = rO. Cascode: ≈ gm·rO².
> 3. The “magic battery” bias lets the cascode work down to 2V*.
> 4. IBOUT = 40 µA.

> [!success]- Answers
> - Output current: **40 µA**
> - Simple mirror Rout: **250 kΩ**
> - Cascode mirror Rout: **25 MΩ**
> - Cascode minimum output: **400 mV**

> [!example]- Full solution
> 1. Twice the width, twice the current
>    $$I_{BOUT} = 2\times 20\,\mu = 40\,\mathrm{\mu A}$$
> 2. Simple mirror: the output device’s rO
>    $$R_{out} = \frac{V_A}{I_{BOUT}} = 250\,\mathrm{k\Omega}$$
> 3. Cascode: up multiplies by gm·rO
>    $$R_{out} \approx g_m r_O^2 = 25\,\mathrm{M\Omega}$$
> 4. Low-compliance (wide-swing) cascode: two devices at their edge
>    $$V_{out,min} = 2V^* = 0.4\,\mathrm{V}$$

