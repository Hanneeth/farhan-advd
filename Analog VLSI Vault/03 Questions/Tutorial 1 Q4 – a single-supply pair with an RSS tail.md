---
tags: ["question", "source/tutorial", "unit/U10"]
aliases: ["Tutorial 1 Q4"]
---
# Tutorial 1 Q4: a single-supply pair with an RSS tail

**Source:** Tutorial 1 Q4

**Topics:** [[U10 Differential pair]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Tutorial 1, Question 4 (as printed)
> ![[t1q4.webp]]

## Question

A pair runs from a single 5 V supply; RSS sets a 1 mA tail current. Q1, Q2 have µnCox(W/L) = 2.5 mA/V², Vth = 0.7 V, λ = 0. (a) Find VCM. (b) RD for Ad = 8. (c) The drain DC voltage. (d) The CM gain ΔVD1/ΔVCM (keep 1/gm!). (e) How much can VCM rise before Q1, Q2 enter triode?

| Given | Value |
|---|---|
| $V_{DD}$ | 5 V |
| $R_{SS}$ | 1 kΩ |
| $I_{SS}$ | 1 mA |
| $\mu_n C_{ox} W/L$ | 0.0025 A/V² |
| $V_{th}$ | 700 mV |
| $A_d$ | 8 V/V |

**Find:** (a) Required input CM · (b) Drain resistor · (c) Drain DC voltage · (d) CM gain (with sign) · (e) CM rise to the triode edge

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. The tail resistor fixes VP = ISS·RSS.
> 2. VCM = VP + VGS; Ad = gm·RD; ACM = −RD/(1/gm + 2RSS).
> 3. For (e): the drain falls while the gate rises, so the fence closes from both sides.
> 4. Vov = 0.632 V.

> [!info]- Concept and formulas
> Resistive tail: the source node is ISS·RSS. Differential half circuit gives Ad = gm·RD; the CM half circuit sees 2RSS, so ACM = −RD/(1/gm + 2RSS). The CM can rise until M1 hits its fence.
> $$V_{CM} = V_{GS1} + I_{SS}R_{SS}$$
> $$A_d = g_mR_D,\quad A_{CM} = -\dfrac{R_D}{1/g_m + 2R_{SS}}$$
> $$\Delta V_{CM} = \dfrac{V_D - V_{CM} + V_{th}}{1 - A_{CM}}$$

> [!success]- Answers
> - (a) Required input CM: **2.332 V**
> - (b) Drain resistor: **5.06 kΩ**
> - (c) Drain DC voltage: **2.47 V**
> - (d) CM gain (with sign): **-1.922 V/V**
> - (e) CM rise to the triode edge: **286.7 mV**

> [!example]- Full solution
> 1. Tail node: 1 mA through 1 kΩ puts the sources at 1 V
>    $$V_P = I_{SS} R_{SS} = 1\,\mathrm{V}$$
> 2. (a) Each device carries 0.5 mA: Vov, then the gate sits a VGS above P
>    $$V_{ov} = \sqrt{\tfrac{2(0.5\mathrm{m})}{2.5\mathrm{m}}} = 0.632\,\mathrm{V},\; V_{CM} = 1 + 0.7 + 0.6325 = 2.332\,\mathrm{V}$$
> 3. (b) Differential half circuit: Ad = gm·RD
>    $$g_m = \frac{2I_D}{V_{ov}} = 1.58\,\mathrm{mS},\; R_D = \frac{8}{g_m} = 5.06\,\mathrm{k\Omega}$$
> 4. (c) Walk the drain node
>    $$V_D = 5 - (0.5\mathrm{m})R_D = 2.47\,\mathrm{V}$$
> 5. (d) CM half circuit: each half sees 2RSS; ratio rule with 1/gm
>    $$A_{CM} = -\frac{R_D}{1/g_m + 2R_{SS}} = -1.922$$
> 6. (e) Gate rises by ΔV, drain moves by ACM·ΔV. Triode when VD + ACM·ΔV = VCM + ΔV − Vth
>    $$\Delta V_{CM} = \frac{V_D - V_{CM} + V_{th}}{1 - A_{CM}} = 0.287\,\mathrm{V}$$

> [!note]- Class solution (handwritten), Tutorial 1 Q4
> ![[k-t1q4.webp]]

