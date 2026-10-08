---
tags: ["question", "source/worked-example", "unit/U3", "unit/U4", "unit/U5"]
aliases: ["Worked Example 1 (tutoring conversation, Part 1)"]
---
# WE1: analyse a common-source stage

**Source:** Worked Example 1 (tutoring conversation, Part 1)

**Topics:** [[U3 DC recipe and PMOS]] · [[U4 Small signal]] · [[U5 First amplifier common source]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

## Question

VDD = 1.8 V, VG = 0.7 V, Vth = 0.4 V, µnCox = 200 µA/V², W/L = 10, RD = 10 kΩ, λ = 0.1 V⁻¹ (λ = 0 for the DC bias). Find Vov, ID, VD, gm, rO and the gain Av.

| Given | Value |
|---|---|
| $V_{DD}$ | 1.8 V |
| $V_G$ | 700 mV |
| $V_{th}$ | 400 mV |
| $\mu_n C_{ox}$ | 0.0002 A/V² |
| $W/L$ | 10 |
| $R_D$ | 10 kΩ |
| $\lambda$ | 0.1 |

**Find:** Drain current · Drain voltage · Transconductance · Output resistance · Gain (with rO)

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Bias first, gain second.
> 2. Step A: Vov → ID → VD → fence. Then B, C, D.
> 3. ID = ½µCox(W/L)Vov²; gm = 2ID/Vov; rO = 1/(λID); Av = −gm(RD ‖ rO).
> 4. Vov = 0.3 V.

> [!success]- Answers
> - Drain current: **90 µA**
> - Drain voltage: **900 mV**
> - Transconductance: **600 µS**
> - Output resistance: **111.1 kΩ**
> - Gain (with rO): **-5.505 V/V**

> [!example]- Full solution
> 1. Overdrive
>    $$V_{ov} = 0.7 - 0.4 = 0.3\,\mathrm{V}$$
> 2. Square law
>    $$I_D = \tfrac12(200\mu)(10)(0.3)^2 = 90\,\mathrm{\mu A}$$
> 3. Walk the node
>    $$V_D = 1.8 - (90\mu)(10\mathrm{k}) = 0.9\,\mathrm{V}$$
> 4. Fence
>    $$0.9 \ge 0.7 - 0.4 = 0.3\;\checkmark$$
> 5. Gate in, drain out: common source
>    $$g_m = \frac{2I_D}{V_{ov}} = 0.6\,\mathrm{mS}$$
> 6. Output node: RD ‖ rO
>    $$r_O = \frac{1}{(0.1)(90\mu)} = 111\,\mathrm{k\Omega}$$
> 7. Av = −Gm·Rout
>    $$A_v = -0.6\mathrm{m}\times(10\mathrm{k}\parallel 111\mathrm{k}) = -5.5\quad(-6\text{ without } r_O)$$

