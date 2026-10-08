---
tags: ["topic", "unit/U2", "group/foundations"]
aliases: ["Triode, saturation, pinch-off"]
---
# U2 · Triode, saturation, pinch-off

*The waterfall and the fence*

**Reference:** Razavi §2.2–2.3 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U1 The MOSFET]]

## Triode, pinch-off, saturation: the waterfall

**Why:** Amplifiers only work in saturation, and every “is it in saturation?” check in your tutorials comes from this picture.

> [!question] Predict first: Vov = 0.3 V. You raise VDS from 0.1 V to 0.2 V to 0.3 V. At the drain end, the channel…
> a) gets thicker
> b) gets thinner and reaches zero at 0.3 V
> c) stays the same thickness

> [!success]- Answer
> **gets thinner and reaches zero at 0.3 V**. At the drain end the gate only sees VGS − VDS, so the local overdrive is Vov − VDS. It reaches zero exactly when VDS = Vov: pinch-off.

The channel is **not equally thick everywhere**. At the source end the gate sees the full $V_{ov}$; at the drain end it sees only $V_{ov} - V_{DS}$. So raising $V_{DS}$ thins the drain end.

While the channel still reaches the drain, the device is a resistor: **triode**. At $V_{DS} = V_{ov}$ it **pinches off**. Beyond that the extra voltage just drops across a tiny gap at the drain, and the current is set upstream by $V_{ov}$ alone: **saturation**.

In node voltages this is the $V_D \ge V_G - V_{th}$: *the drain must stay above the gate minus one threshold*.

> [!tip] Picture it
> A waterfall: how much water flows over is set by the river upstream, not by how tall the cliff is.

**The rule**

$$\text{Saturation}\iff V_{DS} \ge V_{ov} \iff V_D \ge V_G - V_{th}$$

$$\text{PMOS: } V_D \le V_G + |V_{th}|$$

> [!important] Lock it in
> Channel thickness at the drain end is Vov − VDS. It pinches off at VDS = Vov. Saturated ⟺ VD ≥ VG − Vth (NMOS).
> **Hook:** “The drain must stay above the gate minus one threshold.”

## The square law and λ

**Why:** The square law is the bridge equation in every sizing problem: Exam Q1(a) asks for W/L from a current and an overdrive.

> [!question] Predict first: In saturation you double the overdrive (0.2 V → 0.4 V). The drain current…
> a) doubles
> b) quadruples
> c) stays the same

> [!success]- Answer
> **quadruples**. ID ∝ Vov². Twice the overdrive gives four times the current.

In saturation the current depends on the overdrive **squared**: $I_D = \tfrac12\,\mu_n C_{ox}\,\tfrac{W}{L}\,V_{ov}^2$. $\mu_n C_{ox}$ is fixed by the process; $W/L$ and $V_{ov}$ are your two knobs.

In triode the current also depends on $V_{DS}$, like a resistor. The two formulas meet exactly at $V_{DS} = V_{ov}$.

The “flat” part is not quite flat: as $V_{DS}$ grows, the pinch-off point creeps toward the source and the current rises slightly. That slope is $\lambda$, and longer channels have smaller λ. Use λ = 0 for DC bias unless told otherwise.

**The rule**

$$\text{Saturation: } I_D = \tfrac12\,\mu C_{ox}\tfrac{W}{L}\,V_{ov}^2\,(1+\lambda V_{DS})$$

$$\text{Triode: } I_D = \mu C_{ox}\tfrac{W}{L}\left[V_{ov}V_{DS} - \tfrac{V_{DS}^2}{2}\right]$$

$$\text{Design: } \tfrac{W}{L} = \dfrac{2I_D}{\mu C_{ox} V_{ov}^2}$$

> [!note]
> Don’t forget the ½, and square Vov, not VGS.

> [!important] Lock it in
> Saturation: ID = ½µCox(W/L)Vov². Triode adds VDS. Run it backwards for design: W/L = 2ID/(µCox Vov²).
> **Hook:** “Double the overdrive, four times the current.”

## Flashcards

[[Flashcards – U2]]

## Symbols

[[drain-source voltage (VDS)]] · [[the saturation fence (fence)]] · [[process transconductance (muCox)]] · [[aspect ratio (WL)]] · [[channel-length modulation (lambda)]]
