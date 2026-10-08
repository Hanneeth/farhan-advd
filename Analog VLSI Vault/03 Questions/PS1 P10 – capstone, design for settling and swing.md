---
tags: ["question", "source/problem-set", "unit/L4", "unit/L3"]
aliases: ["Problem Set 1 P10 (tutoring chat)"]
---
# PS1 P10: capstone, design for settling and swing

**Source:** Problem Set 1 P10 (tutoring chat)

**Topics:** [[L4 Folded cascode]] · [[L3 Design procedure]] · **Lectures:** [[Lec 04]] · [[Lec 05]]

## Question

Set B: µnCox = 200 µA/V², µpCox = 100 µA/V², λn = 0.05 V⁻¹, λp = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. Design a fully differential op amp: gain ≥ 500, differential swing ≥ 1.2 Vpp, CL = 2 pF, settle to 0.1% in 20 ns in unity-gain feedback, input CM = output CM. (a) Topology. (b) Required gm1,2. (c) Overdrive of the four swing-critical devices. (d) Currents, gain, power.

| Given | Value |
|---|---|
| $C_L$ | 2 pF |
| $t_s$ | 20 ns |
| $V_{pp,diff}$ | 1.2 V |

**Find:** (a) Topology · (b) Required gm1,2 · (c) Swing-critical overdrive · (d) Power (W)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Which topology can have input CM = output CM in unity gain?
> 2. τ = 1/(β·ωu) with β = 1.
> 3. gm = ωu·CL; four overdrives from the swing.
> 4. ln(1000) = 6.91.

> [!success]- Answers
> - (a) Topology: **1**
> - (b) Required gm1,2: **690.8 µS**
> - (c) Swing-critical overdrive: **300 mV**
> - (d) Power (W): **0.00072**

> [!example]- Full solution
> 1. (a) Unity-gain feedback with input CM = output CM: the telescopic is trapped in a Vth − Vov window. Fold
>    $$\text{folded cascode}$$
> 2. (b) β = 1: τ = 1/ωu; 0.1% in 20 ns needs 6.91τ ≤ 20 ns
>    $$g_m \ge \omega_u C_L = \frac{6.91}{20\,\mathrm{ns}}\times 2\,\mathrm{pF} = 0.691\,\mathrm{mS}$$
> 3. (c) Each output swings 0.6 V; four overdrives share 1.8 − 0.6 = 1.2 V
>    $$V_{ov} = 0.3\,\mathrm{V}$$
> 4. (d) ISS = 200 µA, I = 100 µA; gain ≈ 2300 ≫ 500
>    $$P = 1.8 \times (200\mu + 2\times 100\mu) = 0.72\,\mathrm{mW}$$

