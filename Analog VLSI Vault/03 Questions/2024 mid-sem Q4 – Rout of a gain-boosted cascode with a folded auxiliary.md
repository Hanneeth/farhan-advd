---
tags: ["question", "source/mid-sem", "unit/L6"]
aliases: ["Mid-sem 2024-25 Q4 (7 marks)"]
---
# 2024 mid-sem Q4: Rout of a gain-boosted cascode with a folded auxiliary

**Source:** Mid-sem 2024-25 Q4 (7 marks) · **Exam time:** 11 min (7 marks × 1.5 min)

**Topics:** [[L6 Gain boosting]] · **Lectures:** [[Lec 06]] · [[Lec 07]] · [[Lec 08]] · [[Lec 09]]

> [!quote] 2024-25 mid-sem, Question 4 (as printed)
> ![[m24q4.webp]]

## Question

Vov of every NMOS is 0.1 V, |Vov| of every PMOS is 0.2 V, ID2 = ID4 = ID7 = 10 µA. Find Rout and the minimum and maximum Vb2. VDD = 1.8 V, λp = 0.2 V⁻¹, λn = 0.1 V⁻¹, Vthn = 0.4 V, |Vthp| = 0.5 V.

| Given | Value |
|---|---|
| $I_D$ | 10 µA |
| $V_{ov,n}$ | 100 mV |
| $|V_{ov,p}|$ | 200 mV |

**Find:** Auxiliary gain · Rout · Minimum Vb2

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Identify the auxiliary amplifier: input M7, cascode M4, load M5/M6, sink M3.
> 2. Fold node (M3’s drain) sees rO3 ‖ rO7.
> 3. Aaux multiplies the cascode’s gm2rO2rO1.
> 4. Vb2 can drop until M3 hits its edge.

> [!info]- Concept and formulas
> This is Lec 8’s third implementation: the auxiliary amplifier is a folded cascode (PMOS input M7 folded into NMOS cascode M4, PMOS cascode load M5/M6). Its gain is gm7 × (Rup,aux ‖ Rdown,aux); the boosted Rout is that gain × gm2rO2rO1.
> $$A_{aux} = g_{m7}\left[g_{m5}r_{O5}r_{O6} \parallel g_{m4}r_{O4}(r_{O3}\parallel r_{O7})\right]$$
> $$R_{out} \approx A_{aux}\,g_{m2}r_{O2}r_{O1}$$
> $$V_{b2,min} = V_{ov3} + V_{GS4}$$

> [!success]- Answers
> - Auxiliary gain: **1667 V/V**
> - Rout: **333.3 GΩ**
> - Minimum Vb2: **600 mV**

> [!example]- Full solution
> 1. Currents: M3 carries M4’s and M7’s 10 µA each = 20 µA
>    $$g_{m7} = 0.1\,\mathrm{mS},\; g_{m4} = 0.2\,\mathrm{mS},\; r_{O5} = 500\,\mathrm{k\Omega},\; r_{O4} = 1\,\mathrm{M\Omega},\; r_{O3} = 500\,\mathrm{k\Omega}$$
> 2. Auxiliary: Rup,aux (PMOS cascode) ‖ Rdown,aux (NMOS cascode on rO3 ‖ rO7)
>    $$A_{aux} = 0.1\,\mathrm{mS}\,(25\,\mathrm{M\Omega}\parallel 50\,\mathrm{M\Omega}) = 1667$$
> 3. Boosted cascode: Rout ≈ Aaux·gm2rO2rO1
>    $$R_{out} = 1667\times 0.2\,\mathrm{mS}\times 1\,\mathrm{M\Omega}\times 1\,\mathrm{M\Omega} = 333.3\,\mathrm{G\Omega}$$
> 4. Vb2,min: M3 must stay saturated under M4’s source
>    $$V_{b2} - V_{GS4} \ge V_{ov3} \Rightarrow V_{b2,min} = 0.1 + 0.5 = 0.6\,\mathrm{V}$$

> [!note]- Official key, Q4
> ![[k-m24q4.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Aaux:** `0.1[m] × ( 25[M]⁻¹ + 50[M]⁻¹ )⁻¹`

