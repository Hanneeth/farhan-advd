---
tags: ["topic", "unit/U3", "group/foundations"]
aliases: ["DC recipe and PMOS"]
---
# U3 · DC recipe and PMOS

*Assume, solve, walk, check*

**Reference:** Razavi §2.2, Tutorial 1 Q1 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U2 Triode, saturation, pinch-off]]

## The DC recipe: assume, solve, walk, check

**Why:** Step A of the master method. Tutorial 1 Q1, Exam Q1(a) and every bias question are this recipe.

> [!question] Predict first: Raise VG in this circuit. The drain voltage VD…
> a) rises
> b) falls
> c) stays at VDD

> [!success]- Answer
> **falls**. More VG → more overdrive → more ID → a bigger drop across RD → VD falls. Push too far and VD falls below VG − Vth: triode.

You can't know the region before you solve, so **assume saturation**, solve, then **check**.

1. **Assume** saturation (λ = 0 for DC).
2. **Solve** the square law for $I_D$.
3. **Walk** the node voltages: start at a rail and subtract drops.
4. **Check** the fence: $V_D \ge V_G - V_{th}$. If it fails, the device is in triode: redo with the triode equation.

Skipping step 4 is the classic way to lose marks: the numbers look fine but describe a circuit that can't exist.

**The rule**

$$\text{1. Assume saturation}$$

$$\text{2. Solve: } I_D = \tfrac12\mu C_{ox}\tfrac{W}{L}V_{ov}^2$$

$$\text{3. Walk: } V_D = V_{DD} - I_D R_D$$

$$\text{4. CHECK: } V_D \ge V_G - V_{th}$$

> [!important] Lock it in
> Assume saturation → square law → walk the nodes → check the fence. Always finish with the check.
> **Hook:** “Assume, solve, walk, CHECK.”

## PMOS with magnitudes, and the design direction

**Why:** Exam Q1(a) sizes the PMOS loads from a CM limit: a PMOS run in the design direction.

> [!question] Predict first: PMOS source at 1.8 V, gate at 0.9 V, |Vth| = 0.5 V. What is |Vov|?
> a) 0.4 V
> b) 0.9 V
> c) −0.4 V

> [!success]- Answer
> **0.4 V**. |VGS| = VS − VG = 0.9 V, and |Vov| = 0.9 − 0.5 = 0.4 V. Use magnitudes and every number stays positive.

A PMOS is an NMOS turned upside down: its source sits at the **top** (usually $V_{DD}$), and it turns on when the gate goes **below** the source by more than $|V_{th}|$. Use **magnitudes** and the same square law works unchanged: $|V_{GS}| = V_S - V_G$, $|V_{ov}| = |V_{GS}| - |V_{th}|$.

The **design direction** runs the recipe backwards. Instead of “given W/L, find $I_D$”, you are told $I_D$ and $V_{ov}$ and asked for W/L, $V_G$ and $R_D$. It's the same equation solved for a different unknown.

**The rule**

$$|V_{GS}| = V_S - V_G,\quad |V_{ov}| = |V_{GS}| - |V_{th}|$$

$$I_D = \tfrac12\mu_p C_{ox}\tfrac{W}{L}|V_{ov}|^2$$

$$\tfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox}V_{ov}^2},\quad V_G = V_{th} + V_{ov}$$

> [!important] Lock it in
> PMOS: magnitudes everywhere, source at the top. Design: solve the square law for W/L; the gate sits at Vth + Vov above the source.
> **Hook:** “PMOS is NMOS upside down: use magnitudes.”

## Questions you can solve after this topic

- [[WE2 – design a biased NMOS]] · Worked Example 2 (tutoring conversation, Part 1)
- [[WE3 – a PMOS with magnitudes]] · Worked Example 3 (tutoring conversation, Part 1)

## Questions that also use it

- [[WE1 – analyse a common-source stage]]

## Flashcards

[[Flashcards – U3]]

## Symbols

[[supply voltage (VDD)]]
