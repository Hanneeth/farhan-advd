---
tags: ["question", "source/tutorial", "unit/U10", "unit/U7"]
aliases: ["Tutorial 1 Q3"]
---
# Tutorial 1 Q3: pair with PMOS current-source loads

**Source:** Tutorial 1 Q3

**Topics:** [[U10 Differential pair]] · [[U7 CS with every load + degeneration]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Tutorial 1, Question 3 (as printed)
> ![[t1q3.webp]]

## Question

0.18 µm CMOS: µnCox = 4µpCox = 400 µA/V², |Vth| = 0.5 V, |V′A| = 10 V/µm. Bias I = 200 µA, every L is twice the minimum (0.36 µm), every |Vov| = 0.2 V. Find W/L of Q1–Q4 and the differential gain Ad.

| Given | Value |
|---|---|
| $I$ | 200 µA |
| $|V_{ov}|$ | 200 mV |
| $\mu_n C_{ox}$ | 0.0004 A/V² |
| $\mu_p C_{ox}$ | 0.0001 A/V² |
| $|V'_A|$ | 10 |
| $L$ | 3.6e-7 |

**Find:** Q1, Q2 · Q3, Q4 · Differential gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Each side carries half of I.
> 2. W/L from the square law; rO = VA/ID with VA = |V′A|·L.
> 3. Ad = gm(rO1 ‖ rO3).
> 4. gm = 2ID/Vov = 1 mA/V.

> [!info]- Concept and formulas
> PMOS current-source loads: the half circuit is a CS stage with rO ‖ rO. Size each device from its current and Vov; rO from the Early voltage.
> $$A_d = g_{m1}(r_{O1}\parallel r_{O3}) = g_m\dfrac{r_O}{2}$$
> $$r_O = \dfrac{|V_A|}{I_D}$$

> [!success]- Answers
> - Q1, Q2: **12.5**
> - Q3, Q4: **50**
> - Differential gain: **18 V/V**

> [!example]- Full solution
> 1. Each side carries I/2 = 100 µA
>    $$\left(\tfrac{W}{L}\right)_{1,2} = \frac{2(100\mu)}{400\mu(0.2)^2} = 12.5$$
> 2. PMOS loads, same current, µpCox four times smaller
>    $$\left(\tfrac{W}{L}\right)_{3,4} = \frac{2(100\mu)}{100\mu(0.2)^2} = 50$$
> 3. Early voltage and rO
>    $$V_A = 10\,\tfrac{\mathrm{V}}{\mu\mathrm{m}}\times 0.36\,\mu\mathrm{m} = 3.6\,\mathrm{V},\; r_O = \frac{V_A}{I_D} = 36\,\mathrm{k\Omega}$$
> 4. Half circuit: CS with a current-source load, rO ‖ rO = rO/2
>    $$A_d = g_m (r_{O1}\parallel r_{O3}) = 1\,\mathrm{mS}\times 18\,\mathrm{k\Omega} = 18$$

> [!abstract]- Calculator keys (fx-991CW)
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

