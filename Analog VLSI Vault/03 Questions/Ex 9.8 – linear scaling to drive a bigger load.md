---
tags: ["question", "source/problem-set", "unit/L3"]
aliases: ["Razavi Example 9.8 / Problem Set 1 P9"]
---
# Ex 9.8: linear scaling to drive a bigger load

**Source:** Razavi Example 9.8 / Problem Set 1 P9

**Topics:** [[L3 Design procedure]] · **Lectures:** [[Lec 04]]

## Question

The folded cascode of Problem Set 1 P6 (4.5 mW, CL = 2 pF) must drive CL = 8 pF with the same unity-gain bandwidth. Scale every width and every bias current by α. Find α, the new power and the new (W/L)1,2.

| Given | Value |
|---|---|
| $C_{L,old}$ | 2 pF |
| $C_{L,new}$ | 8 pF |
| $P_{old}$ | 0.0045 |

**Find:** Scale factor · New power (W) · New input size

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Linear scaling only buys speed and silence.
> 2. What keeps Vov fixed? Scaling W and I together.
> 3. gm ∝ α, rO ∝ 1/α: gain unchanged, ωu = gm/CL.
> 4. CL grew 4×.

> [!info]- Concept and formulas
> Linear scaling by α: widths and currents ×α keep every Vov (so swing and gain), gm ×α, rO ÷α, power ×α.
> $$\alpha = C_{L,new}/C_{L,old}\ (\text{same }\omega_u)$$
> $$P_{new} = \alpha P$$

> [!success]- Answers
> - Scale factor: **4**
> - New power (W): **0.018**
> - New input size: **869**

> [!example]- Full solution
> 1. ωu = gm/CL. Widths and currents ×α keep every Vov, so gm ×α: need α = CL,new/CL,old
>    $$\alpha = \frac{8}{2} = 4$$
> 2. Power scales with current
>    $$P = 4\times 4.5\,\mathrm{mW} = 18\,\mathrm{mW}$$
> 3. Widths scale too; overdrives, gain and swing do not change (rO ÷ α, gm × α)
>    $$\left(\tfrac{W}{L}\right)_{1,2} = 4\times 217 = 869$$

