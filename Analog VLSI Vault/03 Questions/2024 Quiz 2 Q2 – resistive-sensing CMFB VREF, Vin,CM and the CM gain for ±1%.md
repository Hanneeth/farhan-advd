---
tags: ["question", "source/quiz", "unit/L7"]
aliases: ["Quiz 2 2024-25 Q2 (9 marks)"]
---
# 2024 Quiz 2 Q2: resistive-sensing CMFB: VREF, Vin,CM and the CM gain for ±1%

**Source:** Quiz 2 2024-25 Q2 (9 marks) · **Exam time:** 18 min (9 marks × 2 min)

**Topics:** [[L7 CMFB concept and sensing]] · **Lectures:** [[Lec 09]] · [[Lec 10]] · [[Lec 11]]

> [!quote] 2024-25 Quiz 2, Question 2 (as printed)
> ![[q24bq2.webp]]

## Question

Differential gain 50 V/V without the sensing resistors and feedback amplifier. 2Vov1 = Vov5, 3Vov1 = |Vov3|, (W/L)3,4,6 equal. λn = λp = 0.2 V⁻¹, µnCox = 150 µA/V², µpCox = 50 µA/V², Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. For the optimum Vo,CM (symmetric swing) find VREF, the optimum Vin,CM, and the CM gain needed if Vo,CM may vary by ±1%.

| Given | Value |
|---|---|
| $A_d$ | 50 V/V |
| $\lambda$ | 0.2 |

**Find:** VREF (= optimum Vo,CM) · Optimum Vin,CM · CM gain with feedback

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. With λn = λp, Ad = 1/(λ·Vov1).
> 2. VREF = the middle of the output swing.
> 3. Input CM can reach Vo,CM + Vth before M1 enters triode.
> 4. Output may move ±1% of Vo,CM (2% in total) over the whole input range.

> [!info]- Concept and formulas
> Ad = gm(rO ‖ rO) = 1/(λVov1) fixes Vov1, hence every overdrive. The optimum output CM is the middle of the output range; VREF must equal it. Optimum Vin,CM is the middle of the input range. The course rule for “±1%”: the output CM may move 2·1%·Vo,CM over the whole input CM range.
> $$A_d = \dfrac{1}{\lambda V_{ov1}}$$
> $$V_{o,CM} = \tfrac12\left[(V_{ov5} + V_{ov1}) + (V_{DD} - |V_{ov3}|)\right] = V_{REF}$$
> $$V_{in,CM} \in [V_{ov5} + V_{GS1},\; V_{o,CM} + V_{th1}]$$
> $$A_{CM} = \dfrac{2(0.01)V_{o,CM}}{V_{in,CM,max} - V_{in,CM,min}}$$

> [!success]- Answers
> - VREF (= optimum Vo,CM): **900 mV**
> - Optimum Vin,CM: **1 V**
> - CM gain with feedback: **0.03 V/V**

> [!example]- Full solution
> 1. Ad = 50 with equal λ: Vov1 = 1/(λAd)
>    $$V_{ov1} = 0.1,\; V_{ov5} = 0.2,\; |V_{ov3}| = 0.3$$
> 2. Output range and its middle
>    $$[0.3,\,1.5] \Rightarrow V_{REF} = 0.9\,\mathrm{V}$$
> 3. Input CM range: tail + VGS1 up to Vo,CM + Vth1; take the middle
>    $$[0.7,\,1.3] \Rightarrow V_{in,CM} = 1\,\mathrm{V}$$
> 4. CM gain allowed by ±1%
>    $$A_{CM} = \frac{2(0.01)(0.9)}{0.6} = 0.03$$

> [!abstract]- Calculator keys (fx-991CW)
> - **CM gain:** `2 × 0.01 × 0.9 ÷ ( 1.3 − 0.7 )`

