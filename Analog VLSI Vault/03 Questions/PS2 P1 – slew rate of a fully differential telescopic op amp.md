---
tags: ["question", "source/problem-set", "unit/L9"]
aliases: ["Problem Set 2 P1 (L9, Lec 14)"]
---
# PS2 P1: slew rate of a fully differential telescopic op amp

**Source:** Problem Set 2 P1 (L9, Lec 14)

**Topics:** [[L9 Input range and slew rate]] · **Lectures:** [[Lec 13]] · [[Lec 14]]

## Question

A fully differential telescopic op amp has ISS = 1 mA; its PMOS current sources each carry ISS/2 = 0.5 mA; each output drives CL = 2 pF. A large input step turns M2 off. Find the slope of each output and of the differential output (Lec 14).

| Given | Value |
|---|---|
| $I_{SS}$ | 1 mA |
| $C_L$ | 2 pF |

**Find:** Each output · Differential output

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Count the currents into each output node.
> 2. Top sources give ISS/2 each; the pair gives ISS to one side only.
> 3. Net ±ISS/2 per side.
> 4. Differential = ISS/CL.

> [!info]- Concept and formulas
> Fully differential telescopic: each output slews at ISS/(2CL); the difference at ISS/CL.
> $$\dfrac{dV_{out,d}}{dt} = \dfrac{I_{SS}}{C_L}$$

> [!success]- Answers
> - Each output: **250 V/µs**
> - Differential output: **500 V/µs**

> [!example]- Full solution
> 1. M2 off: M1 pulls ISS from Vout1 while the top source still pushes ISS/2 in: net −ISS/2 into CL
>    $$\frac{dV_{out1}}{dt} = -\frac{I_{SS}}{2C_L} = -250\,\mathrm{V/\mu s}$$
> 2. Vout2: nothing pulls down, the top source pushes ISS/2 in: +ISS/(2CL)
> 3. The difference moves at twice that
>    $$\left|\frac{dV_{out1}}{dt} - \frac{dV_{out2}}{dt}\right| = \frac{I_{SS}}{C_L} = 500\,\mathrm{V/\mu s}$$

