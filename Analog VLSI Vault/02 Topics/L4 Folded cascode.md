---
tags: ["topic", "unit/L4", "group/handout"]
aliases: ["Folded cascode"]
---
# L4 · Folded cascode

*Folding flips the inequality*

**Reference:** Handout L4 · 1st ed §9.2.4–9.2.5 · 2nd ed §9.2.4–9.2.6 · **Lectures:** [[Lec 05]]

**Needs first:** [[L3 Design procedure]]

## Folded cascode: don’t stack, fold

**Why:** Tutorial 2 Q3 and Problem Set 1 P6–P8: the folded cascode fixes the telescopic’s swing and buffer problems.

> [!question] Predict first: In a PMOS-input folded cascode, how much current does each bottom NMOS source (M5, M6) carry?
> a) I
> b) ISS/2
> c) ISS/2 + I

> [!success]- Answer
> **ISS/2 + I**. M5 sinks both the input device’s current (ISS/2) and the cascode branch current I that flows down through M3.

Take the telescopic, and instead of stacking the input pair under the cascodes, **fold** it: the input pair’s current is injected sideways into nodes X, Y, and flows down through NMOS sources M5, M6 that carry $I_{SS}/2 + I$.

The input pair and the tail are no longer in the output stack, so the output only pays **four** overdrives: $V_{ov3} + V_{ov5}$ below and $|V_{ov7}| + |V_{ov9}|$ above.

**Folding flips the inequality:** with a PMOS input, the input CM is held from **below** by M1’s fence against X: $V_{in,CM} \ge V_{ov5} - |V_{thp}|$, which can be below ground. Input CM = output CM becomes possible.

**The rule**

$$I_{D5,6} = \tfrac{I_{SS}}{2} + I$$

$$V_{out} \in [\,V_{ov3}+V_{ov5},\; V_{DD} - |V_{ov7}| - |V_{ov9}|\,]$$

$$V_{in,CM,min} = V_{ov5} - |V_{thp}|,\;\; V_{in,CM,max} = V_{DD} - V_{ISS} - |V_{GS1}|$$

> [!note]
> Folding costs current (two extra branches) and adds a pole at the folding node.

> [!important] Lock it in
> Folded: input pair off to the side, M5,6 carry ISS/2 + I, four overdrives of headroom, PMOS input can go below ground.
> **Hook:** “Don’t stack — fold. Folding flips the inequality.”

## Folded-cascode gain and the current divider

**Why:** Problem Set 1 P7: Gm = gm1 is an approximation; the folding node splits the signal current, and you can quantify it.

> [!question] Predict first: At the folding node, M1’s signal current can go into the cascode source (≈ 1/gm3) or into rO1 ‖ rO5. Most of it goes…
> a) into rO1 ‖ rO5
> b) into the cascode source
> c) half and half

> [!success]- Answer
> **into the cascode source**. The cascode source is the easy path: ≈ 1/gm3 is kilohms, rO1 ‖ rO5 is tens of kilohms. Smallest resistance wins.

The gain is still $G_m$ × $R_{out}$.

**Rout** = $R_{up}$ ‖ $R_{down}$: looking up, $g_{m7}r_{O7}r_{O9}$; looking down, $g_{m3}r_{O3}(r_{O1}\parallel r_{O5})$ — M1 and M5 both hang on the folding node.

**Gm**: M1’s signal current arrives at X and splits by the **current divider**. The share that reaches the output is
$\dfrac{r_{O1}\parallel r_{O5}}{(1/g_{m3}\parallel r_{O3}) + (r_{O1}\parallel r_{O5})}$, typically 90%+. So $G_m \approx g_{m1}$ is close, and the exact version is a few percent lower.

**The rule**

$$R_{up} = g_{m7}r_{O7}r_{O9},\quad R_{down} = g_{m3}r_{O3}(r_{O1}\parallel r_{O5})$$

$$G_m = g_{m1}\,\dfrac{r_{O1}\parallel r_{O5}}{(1/g_{m3}\parallel r_{O3}) + (r_{O1}\parallel r_{O5})}$$

$$A_v = G_m\,(R_{up}\parallel R_{down})$$

> [!note]
> Your Lec 5 numbers the folded cascode differently: bottom sources M9, M10, PMOS cascodes M5, M6, top sources M7, M8. In that numbering Rup = gm5·rO5·rO7 and Rdown = gm3·rO3·(rO1 ‖ rO9). Same formulas; the app follows Razavi and your tutorial sheets.

> [!important] Lock it in
> Folded: Rup = gm7rO7rO9, Rdown = gm3rO3(rO1 ‖ rO5); Gm ≈ gm1 (current divider gives the exact few-percent loss).
> **Hook:** “The cascode source is the easy path.”

## Questions you can solve after this topic

- [[Tutorial 2 Q3 – design a folded cascode for 2.4 V swing and 6 mW]] · Tutorial 2 Q3 (Razavi Problem 9.3)
- [[PS1 P6 – design a folded cascode (2.0 V swing, 4.5 mW)]] · Problem Set 1 P6 (tutoring chat)
- [[PS1 P7 – how much of M1’s current reaches the output]] · Problem Set 1 P7 (tutoring chat)
- [[PS1 P8 – folded cascode CM ranges (input = output CM is possible)]] · Problem Set 1 P8 (tutoring chat)
- [[PS1 P10 – capstone, design for settling and swing]] · Problem Set 1 P10 (tutoring chat)
- [[2023 Quiz 1 Q2 – NMOS-input folded cascode CM range, bias limits, swing, gain]] · Quiz 1 2023-24 Q2 (folded cascode)

## Questions that also use it

- [[Tutorial 6 Q3 – folded-cascode slew rate]]

## Flashcards

[[Flashcards – L4]]

## Symbols

[[stage transconductance (Gm)]] · [[output resistance (Rout)]] · [[resistance looking up (Rup)]] · [[resistance looking down (Rdown)]]
