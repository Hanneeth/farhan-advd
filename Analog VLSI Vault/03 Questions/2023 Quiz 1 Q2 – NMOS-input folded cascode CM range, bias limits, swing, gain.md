---
tags: ["question", "source/quiz", "unit/L4"]
aliases: ["Quiz 1 2023-24 Q2 (folded cascode)"]
---
# 2023 Quiz 1 Q2: NMOS-input folded cascode: CM range, bias limits, swing, gain

**Source:** Quiz 1 2023-24 Q2 (folded cascode)

**Topics:** [[L4 Folded cascode]] · **Lectures:** [[Lec 05]]

> [!quote] 2023-24 Quiz 1, Question 2 (as printed)
> ![[q23q2.webp]]

## Question

|Vov| = 0.15 V, rO = 50 kΩ, gm = 1 mS, |Vth| = 0.3 V for all, VDD = 3 V. Vb2 at its maximum, Vb1 at its minimum. Find Vin,CM,min, Vin,CM,max, the maximum differential swing, Vb1,min, Vb2,max and the gain. Then with Vb2 = Vb2,max − 0.1 V and Vb1 = Vb1,min + 0.1 V: Vin,CM,max and the swing.

| Given | Value |
|---|---|
| $|V_{ov}|$ | 150 mV |
| $r_O$ | 50 kΩ |
| $g_m$ | 1 mS |
| $V_{DD}$ | 3 V |

**Find:** Vin,CM,min · Vin,CM,max (formula value) · Max differential swing · Vb1,min · Vb2,max · Gain · Part 2: Vin,CM,max · Part 2: swing

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Find the four node voltages first: fold node Y, the two cascode sources.
> 2. Vb2,max puts M5 at its edge; Vb1,min puts M9 at its edge.
> 3. The output floor is Vb1 − Vth (M7 fence), the ceiling Vb2 + |Vth| (M3 fence).
> 4. At the fold node rO1 ‖ rO5 appears under the PMOS cascode.

> [!info]- Concept and formulas
> NMOS input folded into PMOS cascodes M3, M4 (gate Vb2) on top sources M5, M6; NMOS cascodes M7, M8 (gate Vb1) on M9, M10. Each bias voltage is set so its device’s current source sits exactly at the edge. The input can go above VDD in principle (the fold node is high), so the key writes “3 V (3.15 V)”.
> $$V_{in,CM,min} = V_{ov11} + V_{GS1},\quad V_{in,CM,max} = V_Y + V_{th1},\; V_Y = V_{b2} + |V_{GS3}|$$
> $$V_{b2,max} = V_{DD} - |V_{ov5}| - |V_{GS3}|,\quad V_{b1,min} = V_{ov9} + V_{GS7}$$
> $$V_{out} \in [V_{b1} - V_{th},\; V_{b2} + |V_{th}|],\quad \text{diff swing} = 2(\cdot)$$
> $$A_v = g_m\left[g_mr_O(r_O\parallel r_O) \parallel g_mr_Or_O\right]$$

> [!success]- Answers
> - Vin,CM,min: **600 mV**
> - Vin,CM,max (formula value): **3.15 V**
> - Max differential swing: **4.8 V**
> - Vb1,min: **600 mV**
> - Vb2,max: **2.4 V**
> - Gain: **833.3 V/V**
> - Part 2: Vin,CM,max: **3.05 V**
> - Part 2: swing: **4.4 V**

> [!example]- Full solution
> 1. Input floor: M11 needs Vov, then M1 needs VGS
>    $$V_{in,CM,min} = 0.15 + 0.45 = 0.6\,\mathrm{V}$$
> 2. Bias limits: each puts its current source at the edge
>    $$V_{b2,max} = 3 - 0.15 - 0.45 = 2.4\,\mathrm{V},\quad V_{b1,min} = 0.15 + 0.45 = 0.6\,\mathrm{V}$$
> 3. Vb1,min
>    $$V_{b1,min} = 0.6\,\mathrm{V}$$
> 4. Input ceiling: M1’s drain is the fold node Y = Vb2 + |VGS3|; its gate may go Vth above it (capped at VDD = 3 V)
>    $$V_{in,CM,max} = 2.85 + 0.3 = 3.15\,\mathrm{V}\;(\text{use } 3\,\mathrm{V})$$
> 5. Output: from Vb1 − Vth up to Vb2 + |Vth|, doubled
>    $$2\left[(2.7) - (0.3)\right] = 4.8\,\mathrm{V}$$
> 6. Gain: Rup = gm rO (rO ‖ rO) (fold node), Rdown = gm rO rO
>    $$A_v = 1\,\mathrm{mS}\,(1.25\,\mathrm{M\Omega}\parallel 2.5\,\mathrm{M\Omega}) = 833.3$$
> 7. Part 2: Vb2 down 0.1 V lowers Y and the ceiling; Vb1 up 0.1 V raises the floor
>    $$V_{in,CM,max} = 3.05\,\mathrm{V},\quad \text{swing} = 4.4\,\mathrm{V}$$
> 8. Part 2 swing
>    $$4.4\,\mathrm{V}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Gain:** `1[m] × ( 1.25[M]⁻¹ + 2.5[M]⁻¹ )⁻¹`

