---
tags: ["question", "source/problem-set", "unit/L2"]
aliases: ["Problem Set 1 P3 (tutoring chat)"]
---
# PS1 P3: telescopic gain, swing and bias

**Source:** Problem Set 1 P3 (tutoring chat)

**Topics:** [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Fully differential telescopic: (W/L)1–4 = 50/0.5, (W/L)5–8 = 100/0.5, ISS = 1 mA, VISS = 0.4 V. (a) Gain. (b) Maximum differential swing. (c) Vin,CM, Vb1 and Vb2 for that swing.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-4}$ | 100 |
| $(W/L)_{5-8}$ | 200 |
| $V_{ISS}$ | 400 mV |

**Find:** (a) Gain · (b) Differential swing · (c) Input CM · (c) Vb1 · (c) Vb2

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Ex 9.7 in reverse: sizes given, find the performance.
> 2. Swing = 2 × (ceiling − floor).
> 3. Full-swing bias sits every device at its edge.
> 4. Vov,N = 0.273 V, |Vov,P| = 0.361 V.

> [!info]- Concept and formulas
> Telescopic: gain gm1(Rup ‖ Rdown); differential swing 2[VDD − stack of overdrives]; bias voltages put the input pair and cascodes at their edges.
> $$A = g_{m1}(g_{m3}r_{O3}r_{O1}\parallel g_{m5}r_{O5}r_{O7})$$
> $$V_{b1} = V_{in,CM} - V_{th} + V_{GS3}$$

> [!success]- Answers
> - (a) Gain: **853.7 V/V**
> - (b) Differential swing: **2.664 V**
> - (c) Input CM: **1.373 V**
> - (c) Vb1: **1.646 V**
> - (c) Vb2: **1.478 V**

> [!example]- Full solution
> 1. (a) gm1 (gm3 rO3 rO1 ‖ gm5 rO5 rO7)
>    $$A_v = 854$$
> 2. (b) 2 × [VDD − 2|Vov,P| − (VISS + 2Vov,N)]
>    $$2.66\,\mathrm{V}$$
> 3. (c) Vin,CM = VISS + VGS1
>    $$1.373\,\mathrm{V}$$
> 4. Vb1 = Vin,CM − Vth + VGS3
>    $$1.646\,\mathrm{V}$$
> 5. Vb2 = VDD − |Vov7| − |VGS5|
>    $$1.478\,\mathrm{V}$$

