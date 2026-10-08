---
tags: ["topic", "unit/L10", "group/handout"]
aliases: ["PSRR and noise"]
---
# L10 · PSRR and noise

*Supply rejection, input-referred noise*

**Reference:** Handout L10 · 1st ed §9.11–9.12 · 2nd ed §9.11–9.12 · **Lectures:** 

**Needs first:** [[L9 Input range and slew rate]]

## Supply rejection: how much of the VDD ripple reaches the output

**Why:** Handout L10 (Razavi §9.11): a quiz asks for the PSRR of a 5-T OTA or why feedback does not improve it.

> [!question] Predict first: In the 5-T OTA, VDD rises by 10 mV. The diode-connected node X…
> a) stays put
> b) rises by about 10 mV
> c) falls by about 10 mV

> [!success]- Answer
> **rises by about 10 mV**. The diode keeps its |VGS| (its current is fixed by the tail), so X sits a fixed amount below VDD and moves with it. The output follows X.

Razavi’s way in: **wiggle VDD and watch.** The diode-connected PMOS keeps $|V_{GS3}|$ fixed, so node X rides up and down with VDD. With a symmetric circuit the output copies X: the supply reaches the output with gain ≈ 1.

The signal, meanwhile, is amplified by $g_m(r_{O2}\|r_{O4})$. $PSRR$ compares the two:
PSRR = (gain from input) ÷ (gain from supply) ≈ $g_{mN}(r_{OP}\|r_{ON})$.

Feedback does not rescue it: the loop cuts the supply-to-output gain and the input-to-output gain by the same $1 + \beta A$, so the ratio stays.

> [!tip] Picture it
> Drawing on a bumpy bus: every bump of the bus (VDD) lands on the page almost 1:1, while your hand’s movement (the signal) is magnified.

**The rule**

$$\text{supply gain} \approx 1 \;\text{(the diode clamps X to } V_{DD})$$

$$PSRR \approx g_{mN}(r_{OP}\,\|\,r_{ON}),\quad 20\log_{10}PSRR\;\mathrm{dB}$$

> [!important] Lock it in
> In the 5-T OTA the diode lets VDD straight to the output (gain ≈ 1), so PSRR ≈ gm(rOP‖rON). Feedback scales both paths equally.
> **Hook:** “Bumpy bus: the bumps reach the page 1:1.”

## What noise is: power per hertz, and the kT/C surprise

**Why:** Every noise answer (op-amp input noise, sampling noise) is an area under a spectrum; kT/C is the one number you must know.

> [!question] Predict first: A resistor charges a 1 pF capacitor. You make the resistor 100 times bigger. The total noise on the capacitor…
> a) grows 10 times
> b) stays the same
> c) drops 10 times

> [!success]- Answer
> **stays the same**. More R means more noise per hertz (4kTR) but a narrower filter (1/(2πRC)). They cancel: the total is √(kT/C), set by C alone.

Razavi’s picture: noise is random, so we cannot say its value at any instant, only how **strong** it is on average.

To see which frequencies carry it, pass it through a 1 Hz-wide window and measure the power that gets through. Do that at every frequency: that is the spectrum, in V²/Hz. A resistor’s is flat (“white”): 4kTR.

The total noise is the **area** under the spectrum after any filtering. On an RC, the area is $4kTR\cdot\frac{\pi}{2}\cdot\frac{1}{2\pi RC} = kT/C$.

Independent noises add as **powers**: $\sqrt{v_1^2 + v_2^2}$, never $v_1 + v_2$.

> [!tip] Picture it
> A river’s roar: you cannot predict each splash, but you can measure how loud it is in each pitch band.

**The rule**

$$\overline{V_n^2} = 4kTR\;\mathrm{(V^2/Hz)}$$

$$\overline{v_{n,C}^2} = \frac{kT}{C}$$

$$v_{tot} = \sqrt{v_1^2 + v_2^2}$$

> [!note]
> Noise bandwidth of one pole = (π/2)·f−3dB. 1 pF at 300 K: 64 µV rms.

> [!important] Lock it in
> Spectrum = power per hertz; total = area. R on C leaves √(kT/C), whatever R. Independent noises add as squares.
> **Hook:** “Taller but narrower: same area.”

## Noise: wiggle each gate and see if the output moves

**Why:** Handout L10 (Razavi §9.12): find the input-referred noise of a 5-T OTA, telescopic or folded cascode, and say which devices matter.

> [!question] Predict first: In a telescopic op amp, which devices add noticeable noise at low frequency?
> a) all nine
> b) the input pair and the PMOS current sources
> c) only the cascodes

> [!success]- Answer
> **the input pair and the PMOS current sources**. Wiggle a cascode gate: its source follows and the output barely moves. Wiggle an input or current-source gate: the output current changes. Only those count.

Every saturated MOSFET hisses: a random drain current with power density $4kT\gamma g_m$ ($\gamma$ ≈ 2/3). Refer it to the input by dividing by the gain.

Razavi’s rule: **wiggle each gate a little**. If the output moves, that device counts. The tail does not (it moves both sides equally); cascodes barely do (their noise is degenerated). Input devices count fully; a current-source load counts as $g_{m,load}/g_{m1}^2$.

For the pair both halves add: $\overline{V_n}$$^2 = 8kT\gamma(1/g_{m1} + g_{m3}/g_{m1}^2)$. The folded cascode adds a second set of current sources, so it is noisier. Small load $g_m$ (big overdrive) means less noise but less swing.

> [!tip] Picture it
> A crowded room: only the people standing next to the microphone (input devices) are loud; people behind a wall (cascodes) are muffled.

**The rule**

$$\overline{I_n^2} = 4kT\gamma g_m$$

$$\overline{V_{n}^2} = 8kT\gamma\left(\frac{1}{g_{m1}} + \frac{g_{m3}}{g_{m1}^2}\right)\;\text{(5-T, telescopic)}$$

$$\text{folded: } 8kT\gamma\left(\frac{1}{g_{m1}} + \frac{g_{m7}}{g_{m1}^2} + \frac{g_{m9}}{g_{m1}^2}\right)$$

> [!important] Lock it in
> Wiggle each gate: inputs and current sources count, tails and cascodes do not. Vn² = 8kTγ(1/gm1 + gm_load/gm1²); the folded cascode adds another term.
> **Hook:** “If wiggling the gate moves the output, it’s noisy.”

## Questions you can solve after this topic

- [[Your exam OTA – PSRR and input noise]] · Worked example: your exam OTA (L10)
- [[PS2 P6 – noise of a folded cascode]] · Problem Set 2 P6 (L10)

## Flashcards

[[Flashcards – L10]]

## Symbols

[[power-supply rejection ratio (PSRR)]] · [[noise coefficient (gamma)]] · [[input-referred noise (Vn)]]
