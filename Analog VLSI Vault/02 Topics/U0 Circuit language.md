---
tags: ["topic", "unit/U0", "group/foundations"]
aliases: ["Circuit language"]
---
# U0 · Circuit language

*Voltage drops, dividers, parallel*

**Reference:** — · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[Home]]

## Voltage drops: node = supply − drops

**Why:** Every tutorial question starts by finding node voltages. Tutorial 1 Q1 asks for RD so that the drain sits at exactly 0 V.

> [!question] Predict first: You make R1 bigger and keep R2 the same. What happens to the voltage at node A?
> a) It goes up
> b) It goes down
> c) It stays the same

> [!success]- Answer
> **It goes down**. A bigger R1 takes a bigger share of the drop from the top, so less height is left at A. (The current also falls, but R1’s share of VDD still grows.)

Think of $V_{DD}$ as the height of water in a tank and $0\,\mathrm{V}$ as sea level. **Current** is the flow, and a **resistor** is a narrow pipe. Every time the flow passes through a resistor it loses height: the **drop** is $I \cdot R$.

So any node's voltage is simply **the supply minus all the drops above it**. Resistors in a single chain (series) all carry the same current, so first find that current, then walk down the chain subtracting drops. The last drop always lands exactly on ground: that is your built-in check.

> [!tip] Picture it
> Water height = voltage, flow = current, narrow pipe = resistor, sea level = ground.

**The rule**

$$V = I\,R$$

$$I = \dfrac{V_{DD}}{R_1 + R_2}\quad\text{(series)}$$

$$V_{\text{node}} = V_{DD} - \sum \text{drops above it}$$

> [!important] Lock it in
> Find the current, then walk down from the supply, subtracting I·R at each resistor.
> **Hook:** “Node = supply minus drops.”

## Parallel resistors and the current divider

**Why:** Every gain formula has a “‖” in it: Av = −gm(RD ‖ rO). And the folded-cascode Gm is a current divider.

> [!question] Predict first: A 1 MΩ resistor and a 20 kΩ resistor are in parallel. Roughly what is the combination?
> a) About 1 MΩ
> b) About 510 kΩ
> c) A bit under 20 kΩ

> [!success]- Answer
> **A bit under 20 kΩ**. 1 MΩ ‖ 20 kΩ = 19.6 kΩ. The smallest resistance wins: nearly all the current takes the easy path.

Two resistors are **in parallel** when they connect the same two nodes, so they share one voltage. Current then has two paths, and the combination is *easier* than either alone: {{par|R₁ ‖ R₂}} $= R_1R_2/(R_1+R_2)$ is always **smaller than the smallest one**.

When a current $I$ arrives at such a node it splits, and **more goes down the easier path**. Branch A's share is set by the *other* resistor: $I_A = I\,R_B/(R_A+R_B)$. That cross-over is the one thing people get backwards.

**The rule**

$$R_A \parallel R_B = \dfrac{R_A R_B}{R_A + R_B}$$

$$I_A = I\,\dfrac{R_B}{R_A + R_B}$$

$$r \parallel r = \dfrac{r}{2}$$

> [!note]
> Smallest resistance in parallel wins.

> [!important] Lock it in
> Parallel = product over sum, always smaller than the smallest. A current splits toward the easy path; each branch gets the other’s share.
> **Hook:** “Smallest resistance in parallel wins.”

## Flashcards

[[Flashcards – U0]]

## Symbols

[[supply voltage (VDD)]] · [[ground (ground)]]
