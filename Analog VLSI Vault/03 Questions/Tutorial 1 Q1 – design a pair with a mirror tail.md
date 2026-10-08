---
tags: ["question", "source/tutorial", "unit/U10", "unit/U6"]
aliases: ["Tutorial 1 Q1"]
---
# Tutorial 1 Q1: design a pair with a mirror tail

**Source:** Tutorial 1 Q1

**Topics:** [[U10 Differential pair]] · [[U6 Impedance rules, sources, diodes, mirrors]] · **Lectures:** [[Lec 01]] · [[Lec 02]]

> [!quote] Tutorial 1, Question 1 (as printed)
> ![[t1q1.webp]]

## Question

Supplies ±0.9 V. Design the circuit so both drains sit at 0 V when both gates are at 0 V. Every transistor runs at Vov = 0.15 V; Vth = 0.35 V, µnCox = 400 µA/V², λ = 0. The reference current through R into diode Q4 is 0.1 mA and the tail Q3 carries 0.2 mA. Find RD, R, and W/L of Q1–Q4, and the input common-mode range.

| Given | Value |
|---|---|
| $V_{DD}$ | 900 mV |
| $V_{SS}$ | -900 mV |
| $V_{ov}$ | 150 mV |
| $V_{th}$ | 350 mV |
| $\mu_n C_{ox}$ | 0.0004 A/V² |
| $I_{REF}$ | 100 µA |
| $I_{SS}$ | 200 µA |

**Find:** Drain resistors · Q1, Q2 · Q3 (tail) · Q4 (diode) · Reference resistor · Lowest input CM · Highest input CM

## Your attempt

- 

> [!tip]- Hints (open one at a time)
> 1. Start with currents: the tail splits 0.1 mA / 0.1 mA; the reference branch carries 0.1 mA.
> 2. Each W/L comes from the square law at Vov = 0.15 V with that device’s own current.
> 3. R = (VDD − VSS − VGS4)/IREF; CMIR = [VSS + Vov3 + VGS1, VD + Vth].
> 4. VGS = 0.35 + 0.15 = 0.5 V for every device.

> [!info]- Concept and formulas
> Bias design of a differential pair: split the tail current, drop the drain voltage across RD, square law backwards for each W/L, then the two CM fences.
> $$R_D = \dfrac{V_{DD} - V_D}{I_{SS}/2}$$
> $$\dfrac{W}{L} = \dfrac{2I_D}{\mu_nC_{ox}V_{ov}^2}$$
> $$V_{in,CM}: [V_{SS} + V_{ov3} + V_{GS1},\; V_{D1} + V_{th}]$$

> [!success]- Answers
> - Drain resistors: **9 kΩ**
> - Q1, Q2: **22.22**
> - Q3 (tail): **44.44**
> - Q4 (diode): **22.22**
> - Reference resistor: **13 kΩ**
> - Lowest input CM: **-250 mV**
> - Highest input CM: **350 mV**

> [!example]- Full solution
> 1. Q1, Q2 each carry half the tail: 0.1 mA. Drop 0.9 V across RD
>    $$R_D = \frac{0.9 - 0}{0.1\,\mathrm{mA}} = 9\,\mathrm{k\Omega}$$
> 2. Square law backwards for each device
>    $$\left(\tfrac{W}{L}\right)_{1,2} = \frac{2(0.1\mathrm{m})}{400\mu\,(0.15)^2} = 22.22$$
> 3. Tail Q3 carries 0.2 mA
>    $$\left(\tfrac{W}{L}\right)_3 = \frac{2(0.2\mathrm{m})}{400\mu\,(0.15)^2} = 44.44$$
> 4. Diode Q4 carries IREF = 0.1 mA
>    $$\left(\tfrac{W}{L}\right)_4 = \frac{2(0.1\mathrm{m})}{400\mu\,(0.15)^2} = 22.22$$
> 5. Q4’s drain sits a full VGS = 0.5 V above VSS: −0.4 V. R drops the rest
>    $$R = \frac{0.9 - (-0.9 + 0.5)}{0.1\,\mathrm{mA}} = 13\,\mathrm{k\Omega}$$
> 6. CM floor: Q3 needs Vov, then Q1 needs its VGS
>    $$V_{in,CM,min} = -0.9 + 0.15 + 0.5 = -0.25\,\mathrm{V}$$
> 7. CM ceiling: Q1’s fence against its drain at 0 V
>    $$V_{in,CM,max} = V_D + V_{th} = 0 + 0.35 = 0.35\,\mathrm{V}$$

> [!note]- Class solution (handwritten), Tutorial 1 Q1
> ![[k-t1q1.webp]]

> [!abstract]- Calculator keys (fx-991CW)
> - **Type µ, m, k, M directly:** `[CATALOG] ▸ Engineer Symbol ▸ µ  (turn on: [SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On)`
> - **W/L from the square law, in one line:** `2 × I ÷ ( µCox × Vov² )   e.g.  2 × 0.1[m] ÷ ( 400[µ] × 0.15² )`

