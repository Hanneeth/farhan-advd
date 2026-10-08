---
tags: ["topic", "unit/L13", "group/handout"]
aliases: ["Compensation I"]
---
# L13 · Compensation I

*Dominant pole, Miller, pole splitting*

**Reference:** Handout L13 · 1st ed §10.4 · 2nd ed §10.4–10.5 · **Lectures:** [[Lec 17]]

**Needs first:** [[L12 Stability II]]

## Compensation: make the gain fall before the phase gets dangerous

**Why:** Lec 17 starts compensation with the 100 dB, three-pole Bode plot and the 20log(1/β) line: where must the first pole go?

> [!question] Predict first: To stabilise the loop, which change helps?
> a) raise Rout (more gain)
> b) move the dominant pole down (bigger C at that node)
> c) move a non-dominant pole down

> [!success]- Answer
> **move the dominant pole down (bigger C at that node)**. Lowering the dominant pole drops the gain earlier, pulling ωgx into a region of small phase shift. Raising Rout only raises the low-frequency gain; moving a high pole down makes it worse.

Your notes draw $20\log|A|$ and the line $20\log(1/\beta)$: their gap is $20\log|\beta A|$, and where they cross is $\omega_{gx}$.

**Dominant-pole compensation**: leave the fast poles alone and slide the first pole $\omega_{p1}$ down (add capacitance at that node). Near ωgx the dominant pole’s phase is already ≈ −90°, so sliding it changes the gain, not the dangerous phase.

Hand method: the other poles may use only 90° − PM at ωgx. For one other pole: $\omega_{gx} = \omega_{p2}\tan(90^\circ - PM)$ (at 45°, ωgx = ωp2). Then $\omega'_{p1} = \omega_{gx}/(\beta A_0)$. Cost: bandwidth. With β < 1 you may compensate 1/β less (Ex 10.5).

> [!tip] Picture it
> Taking your foot off the accelerator early so the car stops before the cliff edge, rather than trying to move the edge.

**The rule**

$$20\log|A| - 20\log\tfrac{1}{\beta} = 20\log|\beta A|$$

$$\omega_{gx} = \omega_{p2}\tan(90^\circ - PM),\quad \omega'_{p1} = \dfrac{\omega_{gx}}{\beta A_0}$$

> [!note]
> Razavi’s shortcut on the Bode plot: start at the first non-dominant pole on the 0 dB line and draw a −20 dB/dec line back up to the flat gain. Where it meets is the new dominant pole (PM ≈ 45°).

> [!important] Lock it in
> Keep the fast poles, lower the dominant one: ωgx = ωp2·tan(90° − PM), ω′p1 = ωgx/(βA0). The compensated GBW cannot pass the first non-dominant pole.
> **Hook:** “Lift your foot early; don’t move the cliff.”

## One stage vs two: the load capacitor helps one and hurts the other

**Why:** A classic viva/quiz question: does a telescopic op amp need compensation, and what happens if you double CL?

> [!question] Predict first: A telescopic (one-stage) op amp in unity feedback rings a little. You add more load capacitance. It will…
> a) ring more
> b) ring less, but settle more slowly
> c) oscillate

> [!success]- Answer
> **ring less, but settle more slowly**. In a one-stage op amp the output node IS the dominant pole. More CL lowers fu = gm/(2πCL) while the internal pole stays put: more phase margin.

Razavi asks: does a telescopic op amp need compensation? Usually not. Its high-resistance output node carries CL, so it is already the **dominant pole**. The internal nodes (mirror, cascode sources) see about 1/gm and sit far above.

So CL is the compensation: fu = gm/(2πCL), and more CL only adds margin, at the cost of speed.

In a **two-stage** op amp the dominant pole is set by CC at the first stage, and CL sits on the **second** pole, Gm2/CL. More CL pulls that pole down towards fu: the margin shrinks and the step rings.

> [!tip] Picture it
> A heavier trailer slows a steady truck (one stage) but makes a wobbly one (two stage) sway more.

**The rule**

$$\text{one stage: } f_u = \frac{g_m}{2\pi C_L},\; PM \approx 90^\circ - \tan^{-1}\frac{\beta f_u}{f_{nd}}$$

$$C_{L,min} = \frac{\beta g_m}{2\pi f_{nd}\tan(90^\circ - PM)}$$

$$\text{two stage: } \omega_{p2} \approx \frac{G_{m2}}{C_L}\;(\text{more } C_L \Rightarrow \text{less } PM)$$

> [!note]
> The hand CL is on the safe side: the exact margin comes out a few degrees higher.

> [!important] Lock it in
> One stage: CL is the dominant pole; more CL = more margin, less speed. Two stage: CL sets P2 = Gm2/CL; more CL = less margin.
> **Hook:** “CL steadies one stage and shakes two.”

## Miller compensation: one small capacitor, two poles split apart

**Why:** Lec 17: CC across the second stage gives P1′ ≈ 1/(R1A2CC) with a small capacitor, and pushes the output pole up.

> [!question] Predict first: A 1 pF capacitor bridges a stage with gain −50. Seen from the stage’s input it looks like…
> a) 1 pF
> b) about 50 pF
> c) about 51 pF

> [!success]- Answer
> **about 51 pF**. Its input end moves by v, its output end by −50v: 51v across it, so it draws 51 times the current of a grounded 1 pF: CC(1 + A2).

A capacitor across a gain stage feels **both** ends move. Input moves by $v$, output by $-A_2 v$: the voltage across $C_C$ is $(1 + A_2)v$, so node 1 sees $C_C(1 + A_2)$. The dominant pole drops to $P_1' \approx 1/(R_1 A_2 C_C)$ with only a small CC.

Bonus, **pole splitting**: at high frequency CC shorts M6’s gate to its drain, turning it into a diode ($\approx 1/G_{m2}$). The output resistance collapses, so the output pole jumps up to $P_2' \approx G_{m2}/C_2$.

Before: $P_1 = 1/(R_1C_1)$, $P_2 = 1/(R_2C_2)$, close together. After: far apart, exactly what a stable loop needs.

> [!tip] Picture it
> A see-saw rope tied from the ground to the far end: pull the near end by 1 cm and the far end moves 50 cm, so the rope stretches 51 cm.

**The rule**

$$C_{node1} = C_1 + C_C(1 + A_2),\quad A_2 = G_{m2}R_2$$

$$P_1' \approx \dfrac{1}{R_1 A_2 C_C},\quad P_2' \approx \dfrac{G_{m2}C_C}{C_1C_2 + C_2C_C + C_1C_C} \approx \dfrac{G_{m2}}{C_2}$$

> [!important] Lock it in
> CC across A2 looks like CC(1 + A2) at node 1: P1′ ≈ 1/(R1A2CC). At high f CC makes M6 a diode: P2′ ≈ Gm2/C2. The poles split.
> **Hook:** “The rope stretches 1 + A2 times.”

## Questions you can solve after this topic

- [[PS2 P3 – compensate the Lec 17 three-pole amplifier]] · Problem Set 2 P3 (L13, Lec 17)
- [[Past tutorial – dominant-pole compensation for closed-loop gains down to 20 dB]] · Past tutorial 2024-25 T2 Ex 5–6

## Flashcards

[[Flashcards – L13]]

## Symbols

[[gain crossover (omegagx)]] · [[first (dominant) pole (omegap1)]] · [[compensation (Miller) capacitor (CC)]]
