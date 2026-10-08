---
tags: ["question", "source/tutorial", "unit/L7"]
aliases: ["Tutorial 5 Q1 (Razavi 9.11 extended)"]
---
# Tutorial 5 Q1: size the triode CMFB devices

**Source:** Tutorial 5 Q1 (Razavi 9.11 extended)

**Topics:** [[L7 CMFB concept and sensing]] · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]]

> [!quote] Tutorial 5, Question 1 (as printed)
> ![[t5q1.webp]]

## Question

Each branch carries 0.5 mA. M7, M8 (gates on Vout1, Vout2) form the tail in deep triode. VDD = 3 V, µnCox = 135 µA/V², µpCox = 40 µA/V², Vthn = 0.7 V, |Vthp| = 0.8 V. (a) Size M7, M8 for an output CM of 1.5 V with VP = 100 mV. (b) If all transistors have that size, Vb1. (c) The maximum differential swing.

| Given | Value |
|---|---|
| $I_D$ | 500 µA |
| $V_{out,CM}$ | 1.5 V |
| $V_P$ | 100 mV |

**Find:** (a) Size of M7, M8 · (b) Vb1 (all devices this size) · (c) Differential swing

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. M7 and M8 have a tiny VDS (= VP): triode.
> 2. Their gates are the outputs, so VGS = Vout,CM = 1.5 V.
> 3. ID = ½µnCox(W/L)[2(VGS − Vth)VDS − VDS²] with VDS = VP = 0.1 V.
> 4. Vb1 is the gate of the NMOS cascode M5 standing on P: Vb1 = VP + VGS5.

> [!info]- Concept and formulas
> Two triode devices whose gates are the outputs act as one resistor set by Vout1 + Vout2. The tail current through that resistor fixes VP, so fixing VP (by the cascode bias) pins the output CM.
> $$R_{tot} = \dfrac{1}{\mu_nC_{ox}(W/L)(V_{out1}+V_{out2}-2V_{th})}$$
> $$V_P = 2I_D R_{tot},\quad V_P = V_{b1} - V_{GS}$$
> $$V_{out,min} = V_P + V_{ov} + V_{ov}$$

> [!success]- Answers
> - (a) Size of M7, M8: **49.38**
> - (b) Vb1 (all devices this size): **1.187 V**
> - (c) Differential swing: **1.405 V**

> [!example]- Full solution
> 1. M7, M8 are in triode (VDS = VP = 0.1 V is small) with VGS = Vout,CM = 1.5 V; each carries 0.5 mA. Use the full triode equation, as the key does
>    $$0.5\,\mathrm{mA} = \tfrac12 (135\mu)\tfrac{W}{L}\left[2(1.5-0.7)(0.1) - 0.1^2\right] \Rightarrow \left(\tfrac{W}{L}\right)_{7,8} = 49.38$$
> 2. (b) Every device this size: M5 (NMOS, 0.5 mA) needs Vov5; Vb1 sits one VGS5 above P
>    $$V_{ov5} = 0.387\,\mathrm{V},\quad V_{b1} = V_P + V_{GS5} = 0.1 + 0.7 + 0.387 = 1.187\,\mathrm{V}$$
> 3. (c) Lowest output: VP + Vov5 + Vov3 (two NMOS overdrives on P). Highest: VDD − |Vov9| − |Vov11| (two PMOS). Differential doubles it
>    $$V_{out} \in [0.875,\,1.58]\,\mathrm{V},\quad 2(1.58 - 0.875) = 1.4\,\mathrm{V}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **Full triode W/L:** `2 × 0.5[m] ÷ ( 135[µ] × ( 2 × 0.8 × 0.1 − 0.1² ) )`

