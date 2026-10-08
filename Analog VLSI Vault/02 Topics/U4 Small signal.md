---
tags: ["topic", "unit/U4", "group/foundations"]
aliases: ["Small signal"]
---
# U4 · Small signal

*gm three ways, rO, gm·rO*

**Reference:** Razavi §2.4.3 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U3 DC recipe and PMOS]]

## Small signal: gm is a slope

**Why:** Every gain in the course is gm times a resistance. Exam Q1(b) needs gm1 = 2ID/Vov.

> [!question] Predict first: You move the bias point Q to a higher VGS. The slope gm at Q…
> a) gets steeper
> b) gets flatter
> c) does not change

> [!success]- Answer
> **gets steeper**. A parabola gets steeper as you go up it. gm = µCox(W/L)·Vov grows with the overdrive.

An amplifier handles **small wiggles riding on a DC bias**. Around the bias point Q the curved square law looks like a straight line, its **tangent**. The slope of that tangent is the **transconductance** $g_m$: how much drain current changes per volt of gate wiggle.

Differentiate the square law and you get **three faces of the same number**. Use whichever fits what you were given. The designer's favourite is $g_m = 2I_D/V_{ov}$: current divided by overdrive.

**The rule**

$$g_m = \dfrac{\partial I_D}{\partial V_{GS}} = \mu C_{ox}\tfrac{W}{L}V_{ov} = \sqrt{2\mu C_{ox}\tfrac{W}{L}I_D} = \dfrac{2I_D}{V_{ov}}$$

> [!note]
> Sizing a device → first form. Trading width against current → second. Headroom questions → third.

> [!important] Lock it in
> gm is the slope of ID vs VGS at the bias point. Three faces: µCox(W/L)Vov = √(2µCox(W/L)ID) = 2ID/Vov.
> **Hook:** “gm is current over overdrive (times 2).”

## rO, intrinsic gain, and the small-signal model

**Why:** rO sets every gain in your op-amp lectures: Exam Q1(b) is gm(rO2 ‖ rO4).

> [!question] Predict first: You double the bias current AND the width, so the overdrive stays the same. The intrinsic gain gm·rO…
> a) doubles
> b) halves
> c) stays the same

> [!success]- Answer
> **stays the same**. gm·rO = 2/(λVov): at a fixed overdrive the current cancels, so you cannot buy gain with current. (Doubling ID in the SAME device raises Vov by √2 and actually lowers the gain.)

The saturation curve has a small slope set by λ. Its inverse is the device's **output resistance**: $r_O = 1/(\lambda I_D)$, what you see looking into the drain.

For small signals, replace the transistor by a **model**: an open circuit at the gate, and a current source $g_m v_{gs}$ in parallel with $r_O$ between drain and source. Three conversion rules: **DC voltage sources → ground**, **DC current sources → open**, **transistor → $g_m v_{gs} \parallel r_O$**.

The biggest gain one device can give is $g_m r_O$: $g_m r_O = 2/(\lambda V_{ov})$. At a fixed overdrive it does not depend on $I_D$.

**The rule**

$$r_O = \dfrac{1}{\lambda I_D} = \dfrac{V_A}{I_D}$$

$$g_m r_O = \dfrac{2}{\lambda V_{ov}}$$

> [!note]
> λ ∝ 1/L: a longer channel gives a bigger rO. Sedra–Smith write VA = 1/λ = |V′A|·L (Tutorial 1).

> [!important] Lock it in
> rO = 1/(λID). Model: open gate, gm·vgs ‖ rO. Intrinsic gain gm·rO = 2/(λVov) does not depend on current.
> **Hook:** “You can’t buy gain with current.”

## Questions that also use it

- [[WE1 – analyse a common-source stage]]

## Flashcards

[[Flashcards – U4]]

## Symbols

[[transconductance (gm)]] · [[intrinsic gain (gmro)]]
