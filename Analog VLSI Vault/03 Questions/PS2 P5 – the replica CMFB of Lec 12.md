---
tags: ["question", "source/problem-set", "unit/L8"]
aliases: ["Problem Set 2 P5 (L8, Lec 12)"]
---
# PS2 P5: the replica CMFB of Lec 12

**Source:** Problem Set 2 P5 (L8, Lec 12)

**Topics:** [[L8 CMFB techniques]] · **Lectures:** [[Lec 11]] · [[Lec 12]]

## Question

In the Lec 12 folded-cascode CMFB, (W/L)11 = 40 and the sensing devices are (W/L)12 = (W/L)13 = 12. VREF = 1.5 V, Vth = 0.7 V. (a) What (W/L)14 and (W/L)15 make the output CM equal VREF? (b) If (W/L)15 = 30 is used instead, where does the output CM settle?

| Given | Value |
|---|---|
| $(W/L)_{11}$ | 40 |
| $(W/L)_{12,13}$ | 12 |
| $V_{REF}$ | 1.5 V |
| $V_{th}$ | 700 mV |

**Find:** (a) (W/L)14 · (a) (W/L)15 · (b) Output CM

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Twins: same gate + same current + same size = same VGS.
> 2. So the resistances under them match.
> 3. Deep triode: conductance ∝ (W/L)(VG − Vth); parallel ones add.
> 4. (W/L)15 = (W/L)12 + (W/L)13.

> [!success]- Answers
> - (a) (W/L)14: **40**
> - (a) (W/L)15: **24**
> - (b) Output CM: **1.7 V**

> [!example]- Full solution
> 1. (a) M14 must be M11’s twin (same current I1, same gate)
>    $$(W/L)_{14} = (W/L)_{11} = 40$$
> 2. M15 must equal M12 ‖ M13 in conductance
>    $$(W/L)_{15} = 12 + 12 = 24$$
> 3. (b) Conductances must still match: 30(1.5 − 0.7) = 24(Vout,CM − 0.7)
>    $$V_{out,CM} = 0.7 + \frac{30}{24}(0.8) = 1.7\,\mathrm{V}$$

