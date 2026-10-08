---
tags: ["question", "source/worked-example", "unit/U3"]
aliases: ["Worked Example 2 (tutoring conversation, Part 1)"]
---
# WE2: design a biased NMOS

**Source:** Worked Example 2 (tutoring conversation, Part 1)

**Topics:** [[U3 DC recipe and PMOS]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

Design an NMOS stage on VDD = 1.8 V to carry ID = 100 µA at Vov = 0.15 V with the drain at 0.9 V. Vth = 0.35 V, µnCox = 400 µA/V². Find W/L, VG and RD.

| Given | Value |
|---|---|
| $V_{DD}$ | 1.8 V |
| $I_D$ | 100 µA |
| $V_{ov}$ | 150 mV |
| $V_{th}$ | 350 mV |
| $\mu_n C_{ox}$ | 0.0004 A/V² |

**Find:** Aspect ratio · Gate voltage · Drain resistor

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Design direction.
> 2. Run the square law backwards.
> 3. W/L = 2ID/(µCox Vov²).
> 4. W/L ≈ 22.

> [!success]- Answers
> - Aspect ratio: **22.22**
> - Gate voltage: **500 mV**
> - Drain resistor: **9 kΩ**

> [!example]- Full solution
> 1. Bridge equation backwards
>    $$\tfrac{W}{L} = \frac{2(100\mu)}{(400\mu)(0.15)^2} = 22.2$$
> 2. Gate = Vth + Vov
>    $$V_G = 0.35 + 0.15 = 0.5\,\mathrm{V}$$
> 3. RD drops VDD − VD
>    $$R_D = \frac{1.8 - 0.9}{100\mu} = 9\,\mathrm{k\Omega}$$

