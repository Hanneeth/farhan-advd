---
tags: ["topic", "unit/L8", "group/handout"]
aliases: ["CMFB techniques"]
---
# L8 · CMFB techniques

*Triode sensing and the loop*

**Reference:** Handout L8 · 1st ed §9.7.3 · 2nd ed §9.7.3 · **Lectures:** [[Lec 11]] · [[Lec 12]]

**Needs first:** [[L7 CMFB concept and sensing]]

## CMFB techniques: the loop and its gain

**Why:** Quiz 2 (all three parts) is a triode-sensing CMFB on a telescopic: VD4, VP, the sensing W/L, Vout,min and Rout.

> [!question] Predict first: In a triode-sensing CMFB, both outputs rise by 50 mV. The triode devices’ resistance…
> a) rises, pulling the outputs further up
> b) falls, pulling more current and the outputs back down
> c) does not change

> [!success]- Answer
> **falls, pulling more current and the outputs back down**. Higher gate voltage, lower triode resistance, more tail current, bigger drop across the loads: the outputs come back down. Negative feedback.

Close the loop on paper: the tail current $2I_D$ must flow through the sensing resistance with $V_P$ across it, so
$V_{out1} + V_{out2} = \dfrac{2I_D}{\mu_n C_{ox}(W/L)\,V_P} + 2V_{th}$.

Anything that fixes $V_P$ (for example a cascode bias: $V_P = V_{b1} - V_{GS}$) therefore fixes the output CM. In practice an **error amplifier** compares $V_{out,CM}$ with $V_{REF}$ and drives a current source (Tutorial 5 Q2, Lec 12): the **CMFB loop gain** is error-amp gain × how strongly that current source moves the output CM.

Differential signals do not disturb it: $V_{out1} + V_{out2}$ is unchanged when the outputs move in opposite directions.

**The rule**

$$V_{out1} + V_{out2} = \dfrac{2I_D}{\mu_n C_{ox}(W/L)\,V_P} + 2V_{th}$$

$$\text{a differential signal leaves } V_{out1} + V_{out2}\text{ unchanged}$$

> [!important] Lock it in
> Triode sensing: Vout1 + Vout2 = 2ID/(µnCox(W/L)VP) + 2Vth. Fix VP and the output CM is fixed; differential signals cancel in the sum.
> **Hook:** “The sum is what the loop sees.”

## Replica CMFB: make the output CM equal VREF

**Why:** Lec 12’s last circuit sets the output CM of the folded cascode exactly to VREF with a copied (“replica”) branch: you size M14 and M15.

> [!question] Predict first: M11 and M14 have the same W/L, the same gate voltage and the same current I1. Their source voltages are…
> a) equal
> b) different: M11 carries signal
> c) set by VREF alone

> [!success]- Answer
> **equal**. Same size, same current → same VGS. Same gate → same source voltage. So the resistance under M11 must equal the one under M14.

The trick is a **twin**. M14 copies M11: same size, same gate, same current $I_1$, so the same $V_{GS}$ and the same source voltage.

Under M11 sit M12 and M13 in deep triode, gates on $V_{out1}$, $V_{out2}$. Under M14 sits M15, gate on $V_{REF}$. Equal source voltages with equal currents means equal resistances, and deep-triode conductance is $\mu C_{ox}(W/L)(V_G - V_{th})$:

$(W/L)_{15}(V_{REF} - V_{th}) = (W/L)_{12}(V_{out1} - V_{th}) + (W/L)_{13}(V_{out2} - V_{th})$.

Choose $(W/L)_{15} = (W/L)_{12} + (W/L)_{13}$ and the outputs must average to $V_{REF}$. Lec 12’s final fix adds M16–M18 so $V_{DS}$ of M11 and M14 match too.

> [!tip] Picture it
> Two identical taps on the same pipe pressure: if one flows through a known opening (VREF), the other opening must be the same size.

**The rule**

$$I_{D11} = I_{D14} = I_1,\quad (W/L)_{14} = (W/L)_{11}$$

$$(W/L)_{15} = (W/L)_{12} + (W/L)_{13} \Rightarrow V_{out,CM} = V_{REF}$$

> [!important] Lock it in
> M14 is M11’s twin, M15 is the twin of M12 ‖ M13 with VREF on its gate: (W/L)15 = (W/L)12 + (W/L)13 forces Vout,CM = VREF.
> **Hook:** “Copy the branch, swap the outputs for VREF.”

## Questions you can solve after this topic

- [[Tutorial 5 Q2 – which pair for the CMFB amplifier, and the loop gain]] · Tutorial 5 Q2 (Razavi Problem 9.12)
- [[Tutorial 5 Q3 – CM gain and CMRR with and without CMFB]] · Tutorial 5 Q3
- [[Quiz 2 Part A – triode-sensing CMFB on a telescopic]] · Quiz 2 Part A
- [[Quiz 2 Part B – triode-sensing CMFB on a telescopic]] · Quiz 2 Part B
- [[Quiz 2 Part C – triode-sensing CMFB on a telescopic]] · Quiz 2 Part C
- [[PS2 P5 – the replica CMFB of Lec 12]] · Problem Set 2 P5 (L8, Lec 12)
- [[2024 mid-sem Q1 – CMFB with R = 10 MΩ sensing (= Tutorial 5 Q3)]] · Mid-sem 2024-25 Q1 (20 marks)

## Flashcards

[[Flashcards – L8]]

## Symbols

[[reference voltage (VREF)]]
