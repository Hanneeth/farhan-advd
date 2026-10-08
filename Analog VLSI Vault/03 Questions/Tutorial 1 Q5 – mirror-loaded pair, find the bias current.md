---
tags: ["question", "source/tutorial", "unit/U11"]
aliases: ["Tutorial 1 Q5"]
---
# Tutorial 1 Q5: mirror-loaded pair, find the bias current

**Source:** Tutorial 1 Q5

**Topics:** [[U11 Five-transistor OTA]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Tutorial 1, Question 5 (as printed)
> ![[t1q5.webp]]

## Question

In a current-mirror-loaded pair (a 5-T OTA) every device has µCox(W/L) = 4 mA/V² and |VA| = 5 V. Find the bias current I for which vo/vid = 20 V/V.

| Given | Value |
|---|---|
| $\mu C_{ox} W/L$ | 0.004 A/V² |
| $|V_A|$ | 5 V |
| $A_d$ | 20 V/V |

**Find:** Tail bias current

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. A mirror-loaded pair has Ad = gm(rO2 ‖ rO4).
> 2. Write gm = √(2kID) and rO = VA/ID; ID cancels partly.
> 3. Ad = VA·√(k/(2ID)).
> 4. Each side carries I/2.

> [!info]- Concept and formulas
> Mirror-loaded pair: Ad = gm(rO/2). With gm = √(2k′(W/L)ID) and rO = VA/ID the gain ∝ 1/√ID: solve for ID, then I = 2ID.
> $$A_d = \sqrt{2k'(W/L)I_D}\,\dfrac{V_A}{2I_D} = \dfrac{V_A}{2}\sqrt{\dfrac{2k'(W/L)}{I_D}}$$

> [!success]- Answers
> - Tail bias current: **250 µA**

> [!example]- Full solution
> 1. Mirror-loaded pair: Gm = gm, Rout = rO2 ‖ rO4 = rO/2
>    $$A_d = g_m \frac{r_O}{2} = \sqrt{2k I_D}\cdot\frac{V_A}{2 I_D} = V_A\sqrt{\frac{k}{2 I_D}}$$
> 2. Solve for the current in each side
>    $$I_D = \frac{2k(V_A/2)^2}{A_d^2} = \frac{2(4\mathrm{m})(2.5)^2}{20^2} = 125\,\mathrm{\mu A}$$
> 3. The tail carries both sides
>    $$I = 2I_D = 250\,\mathrm{\mu A}$$

