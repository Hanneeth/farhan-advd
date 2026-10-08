---
tags: ["question", "source/quiz", "unit/U11"]
aliases: ["Quiz 1 2024-25 Q1 (9 marks)"]
---
# 2024 Quiz 1 Q1: five-transistor OTA from its sizes

**Source:** Quiz 1 2024-25 Q1 (9 marks) · **Exam time:** 18 min (9 marks × 2 min)

**Topics:** [[U11 Five-transistor OTA]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] 2024-25 Quiz 1, Question 1 (as printed)
> ![[q24aq1.webp]]

## Question

(W/L)1,2,5 = 15/1, (W/L)3,4 = 30/2, (W/L)6 = 7.5/1, I1 = 20 µA (ideal). λn = 0.1, λp = 0.2 V⁻¹ at L = 1 µm; µnCox = 100 µA/V², µpCox = 50 µA/V², Vthn = 0.4 V, |Vthp| = 0.5 V, VDD = 1.8 V. Find the gain, output swing, Vin,CM,max, Vin,CM,min and power.

| Given | Value |
|---|---|
| $I_1$ | 20 µA |
| $V_{DD}$ | 1.8 V |

**Find:** Gain · Output swing · Vin,CM,max · Vin,CM,min · Power

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. ISS from the mirror ratio M5:M6.
> 2. λ halves when L doubles.
> 3. gm = √(2µCox(W/L)ID).
> 4. Power counts the reference branch too.

> [!info]- Concept and formulas
> Mirror ratio gives ISS; λ scales as 1/L (M3, M4 have L = 2 µm, so λp = 0.1). Then the four standard OTA results.
> $$I_{SS} = I_1\dfrac{(W/L)_5}{(W/L)_6},\quad \lambda \propto 1/L$$
> $$A_v = g_{m1}(r_{O2}\parallel r_{O4})$$
> $$V_{in,CM}: [V_{ov5} + V_{GS1},\; V_{DD} - |V_{GS3}| + V_{thn}]$$
> $$\text{swing} = (V_{DD} - |V_{ov4}|) - (V_{ov5} + V_{ov2}),\quad P = V_{DD}(I_1 + I_{SS})$$

> [!success]- Answers
> - Gain: **61.24 V/V**
> - Output swing: **1.175 V**
> - Vin,CM,max: **1.469 V**
> - Vin,CM,min: **794.2 mV**
> - Power: **108 µW**

> [!example]- Full solution
> 1. ISS = 20 µA × 15/7.5 = 40 µA; 20 µA per side. M3, M4: L = 2 µm → λp = 0.1
>    $$g_{m1} = 0.245\,\mathrm{mS},\; r_{O2} = 500\,\mathrm{k\Omega},\; r_{O4} = 500\,\mathrm{k\Omega}$$
> 2. Gain
>    $$A_v = 0.245\,\mathrm{mS}\times 250\,\mathrm{k\Omega} = 61.24$$
> 3. Swing: ceiling VDD − |Vov4|, floor Vov5 + Vov2
>    $$(1.8 - 0.231) - (0.231 + 0.163) = 1.17\,\mathrm{V}$$
> 4. CM ceiling: M1 against the diode M3
>    $$1.8 - (0.5 + 0.231) + 0.4 = 1.47\,\mathrm{V}$$
> 5. CM floor: tail plus VGS1
>    $$0.231 + 0.4 + 0.163 = 0.794\,\mathrm{V}$$
> 6. Power: VDD × (I1 + ISS)
>    $$1.8 \times 60\,\mu A = 108\,\mathrm{\mu W}$$

> [!abstract]- Calculator keys (fx-991CW)
> - **gm1 and gain:** `√(2 × 100[µ] × 15 × 20[µ]) × ( 500[k]⁻¹ + 500[k]⁻¹ )⁻¹`

