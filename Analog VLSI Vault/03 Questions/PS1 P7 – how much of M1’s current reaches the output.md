---
tags: ["question", "source/problem-set", "unit/L4"]
aliases: ["Problem Set 1 P7 (tutoring chat)"]
---
# PS1 P7: how much of M1’s current reaches the output?

**Source:** Problem Set 1 P7 (tutoring chat)

**Topics:** [[L4 Folded cascode]] · **Lectures:** [[Lec 05]]

## Question

In the P6 design you assumed Gm = gm1. At the folding node the signal current splits between the cascode source (≈ 1/gm3 ‖ rO3) and rO1 ‖ rO5. What fraction reaches the output, and what is the corrected gain?

**Find:** Fraction reaching the output · Corrected gain

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. The cascode source is the easy path.
> 2. Current divider: each branch gets the share set by the other resistance.
> 3. fraction = (rO1 ‖ rO5)/[(1/gm3 ‖ rO3) + (rO1 ‖ rO5)].
> 4. About 91%.

> [!info]- Concept and formulas
> At the folding node M1’s current divides between the cascode source (1/gm3 ‖ rO3) and rO1 ‖ rO5.
> $$G_m = g_{m1}\dfrac{r_{O1}\parallel r_{O5}}{(1/g_{m3}\parallel r_{O3}) + (r_{O1}\parallel r_{O5})}$$

> [!success]- Answers
> - Fraction reaching the output: **0.9111**
> - Corrected gain: **303.7 V/V**

> [!example]- Full solution
> 1. Current divider at X: the easy path is the cascode source
>    $$\text{fraction} = \frac{r_{O1}\parallel r_{O5}}{(\tfrac{1}{g_{m3}}\parallel r_{O3}) + (r_{O1}\parallel r_{O5})} = 0.9111$$
> 2. Scale the gain
>    $$A_v = 333 \times 0.911 = 304$$

