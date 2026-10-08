---
tags: ["question", "source/tutorial", "unit/L5", "unit/L2"]
aliases: ["Tutorial 3 Q2 (Razavi Problem 9.6)"]
---
# Tutorial 3 Q2: two-stage op amp, CM level at X and Y

**Source:** Tutorial 3 Q2 (Razavi Problem 9.6)

**Topics:** [[L5 Two-stage op amp]] · [[L2 One-stage op amps]] · **Lectures:** [[Lec 02]] · [[Lec 07]]

> [!quote] Tutorial 3, Question 2 (as printed)
> ![[t3q2.webp]]

## Question

Set A (Razavi 0.5 µm): µnCox = 134.28 µA/V², µpCox = 38.36 µA/V², λn = 0.1 V⁻¹, λp = 0.2 V⁻¹ (L = 0.5 µm), Vthn = 0.7 V, |Vthp| = 0.8 V, VDD = 3 V, γ = 0. Two-stage op amp (Fig. 9.23): (W/L)1–8 = 100/0.5, ISS = 1 mA. (a) What CM level at X, Y gives ID5 = ID6 = 1 mA, and how does it cap the input CM? (b) Overall gain and maximum output swing.

| Given | Value |
|---|---|
| $\mu_n C_{ox}$ | 0.0001343 A/V² |
| $\mu_p C_{ox}$ | 0.00003836 A/V² |
| $V_{thn}$ | 700 mV |
| $|V_{thp}|$ | 800 mV |
| $V_{DD}$ | 3 V |
| $(W/L)_{1-8}$ | 200 |
| $I_{SS}$ | 1 mA |
| $I_{D5,6}$ | 1 mA |

**Find:** (a) CM level at X and Y · (a) Maximum input CM · (b) Overall gain · (b) Differential swing

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. X drives M5’s gate: its voltage fixes M5’s current.
> 2. VX = VDD − |VGS5| at 1 mA.
> 3. A = A1·A2; swing = 2(VDD − |Vov5| − Vov7).
> 4. |VGS5| = 1.311 V.

> [!info]- Concept and formulas
> Two-stage op amp: X and Y must sit where the second-stage PMOS carries its current (VDD − |VGS5|); that caps the input CM. Gains multiply; the CS output stage swings almost rail to rail.
> $$V_X = V_{DD} - |V_{GS5}|$$
> $$A = g_{m1}(r_{O1}\parallel r_{O3})\cdot g_{m5}(r_{O5}\parallel r_{O7})$$
> $$V_{pp,diff} = 2(V_{DD} - |V_{ov5}| - V_{ov7})$$

> [!success]- Answers
> - (a) CM level at X and Y: **1.689 V**
> - (a) Maximum input CM: **2.389 V**
> - (b) Overall gain: **451.1 V/V**
> - (b) Differential swing: **4.433 V**

> [!example]- Full solution
> 1. (a) M5 carries 1 mA only if its |VGS| is right: X sits one |VGS5| below VDD
>    $$V_{X,Y} = 3 - 1.311 = 1.689\,\mathrm{V}$$
> 2. M1’s fence against X
>    $$V_{in,CM,max} = V_X + V_{th} = 2.389\,\mathrm{V}$$
> 3. (b) Gain multiplies: A1 = gm1(rO1 ‖ rO3), A2 = gm5(rO5 ‖ rO7)
>    $$A_v = 34.5 \times 13.1 = 451$$
> 4. Output swing: CS stages, one overdrive at each rail
>    $$2[(3 - 0.511) - 0.273] = 4.43\,\mathrm{V}$$

