---
tags: ["question", "source/worked-example", "unit/U3"]
aliases: ["Worked Example 3 (tutoring conversation, Part 1)"]
---
# WE3: a PMOS with magnitudes

**Source:** Worked Example 3 (tutoring conversation, Part 1)

**Topics:** [[U3 DC recipe and PMOS]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

A PMOS has its source at 1.8 V, gate at 0.9 V, |Vth| = 0.5 V, µpCox = 100 µA/V², W/L = 20, and RD = 5 kΩ from drain to ground. Find |Vov|, ID and VD.

| Given | Value |
|---|---|
| $V_S$ | 1.8 V |
| $V_G$ | 900 mV |
| $|V_{th}|$ | 500 mV |
| $\mu_p C_{ox}$ | 0.0001 A/V² |
| $W/L$ | 20 |
| $R_D$ | 5 kΩ |

**Find:** Overdrive magnitude · Drain current · Drain voltage

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Use magnitudes.
> 2. |VGS| = VS − VG.
> 3. |Vov| = |VGS| − |Vth|, then the square law.
> 4. |VGS| = 0.9 V.

> [!success]- Answers
> - Overdrive magnitude: **400 mV**
> - Drain current: **160 µA**
> - Drain voltage: **800 mV**

> [!example]- Full solution
> 1. Magnitudes
>    $$|V_{ov}| = (1.8 - 0.9) - 0.5 = 0.4\,\mathrm{V}$$
> 2. Square law
>    $$I_D = \tfrac12(100\mu)(20)(0.4)^2 = 160\,\mathrm{\mu A}$$
> 3. Up from ground
>    $$V_D = (160\mu)(5\mathrm{k}) = 0.8\,\mathrm{V}$$
> 4. PMOS fence
>    $$0.8 \le 0.9 + 0.5\;\checkmark$$

