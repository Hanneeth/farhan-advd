---
tags: ["topic", "unit/U7", "group/foundations"]
aliases: ["CS with every load + degeneration"]
---
# U7 · CS with every load + degeneration

*The ratio rule*

**Reference:** Razavi §3.3 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U6 Impedance rules, sources, diodes, mirrors]]

## CS with every load: Av = −Gm·Rout

**Why:** The 5-T OTA in your exam is a CS stage with a current-source load: Av = gm1(rO2 ‖ rO4). Same method for every load.

> [!question] Predict first: Which load gives the most gain from the same input transistor?
> a) Diode-connected PMOS
> b) Resistor
> c) PMOS current source

> [!success]- Answer
> **PMOS current source**. Gain = Gm × Rout. A current source looks like rO (tens to hundreds of kΩ); a diode looks like 1/gm (a few kΩ). Big resistance, big gain.

The input device M1 always does the same job: it turns $v_{in}$ into a current $g_{m1} v_{in}$. The **load decides what resistance that current flows into**. So only $R_{out}$ changes:

- **Resistor:** $R_D \parallel r_{O1}$
- **Diode:** $1/g_{m2} \parallel r_{O1} \parallel r_{O2}$ — small, so low gain
- **Current source:** $r_{O1} \parallel r_{O2}$ — big, high gain
- **Active (both gates driven):** same Rout, but both devices make current: $G_m = g_{m1} + g_{m2}$

Then $A_v = -G_m R_{out}$. Everything at the output node is **in parallel**, and the smallest resistance wins.

**The rule**

$$A_v = -G_m R_{out}$$

$$R_{out}:\; R_D\parallel r_{O1} \;\big|\; \tfrac{1}{g_{m2}}\parallel r_{O1}\parallel r_{O2} \;\big|\; r_{O1}\parallel r_{O2}$$

$$G_m = g_{m1}\;(\text{active load: } g_{m1}+g_{m2})$$

> [!note]
> Equal rO in parallel: rO ‖ rO = rO/2.

> [!important] Lock it in
> Gm from the input device; Rout = everything at the output node in parallel; Av = −Gm·Rout. Diode load = low gain; current-source load = high gain.
> **Hook:** “Same Gm, different Rout.”

## Degeneration and the ratio rule

**Why:** The ratio rule gives any gain by inspection, including the CM gain of a differential pair in Tutorial 1 Q4: ACM = −RD/(1/gm + 2RSS).

> [!question] Predict first: 1/gm = 1 kΩ, RD = 10 kΩ. You add RS = 1 kΩ. The gain magnitude becomes about…
> a) 10
> b) 5
> c) 20

> [!success]- Answer
> **5**. Ratio rule: RD/(1/gm + RS) = 10k/2k = 5. RS doubled the resistance in the source path, so the gain halved.

Put a resistor $R_S$ under the source. When the input rises, the current rises, the source rises with it, and the real $V_{GS}$ rises by less: the resistor **fights back** (negative feedback). The stage becomes weaker: $G_m = g_m/(1 + g_m R_S)$.

The quickest way to get the gain is the **ratio rule**: count the transistor itself as a resistor $1/g_m$ in the source path. Then

$|A_v| = \dfrac{\text{resistance at the drain}}{\text{resistance in the source path}} = \dfrac{R_D}{1/g_m + R_S}$.

When $R_S \gg 1/g_m$ the gain is just $R_D/R_S$: less gain, but set by resistors, so it is linear and predictable.

> [!tip] Picture it
> A see-saw: output movement over input movement is the ratio of the two arm lengths.

**The rule**

$$G_m = \dfrac{g_m}{1 + g_m R_S} = \dfrac{1}{1/g_m + R_S}$$

$$|A_v| = \dfrac{R_D}{1/g_m + R_S}\quad(\lambda = 0)$$

> [!note]
> Ratio rule for any stage: |Av| = (R at the output terminal) ÷ (R in the source path, the transistor counting as 1/gm).

> [!important] Lock it in
> Degeneration trades gain for linearity: Gm = gm/(1 + gm·RS). Ratio rule: |Av| = RD/(1/gm + RS).
> **Hook:** “Top resistance over bottom resistance; the transistor counts as 1/gm.”

## Questions that also use it

- [[Tutorial 1 Q2 – pair with diode-connected PMOS loads]]
- [[Tutorial 1 Q3 – pair with PMOS current-source loads]]

## Flashcards

[[Flashcards – U7]]

## Symbols

[[output resistance (Rout)]] · [[source resistor (RS)]]
