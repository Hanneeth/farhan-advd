---
tags: ["topic", "unit/L1", "group/handout"]
aliases: ["Performance parameters"]
---
# L1 · Performance parameters

*Gain error, settling, slewing, swing*

**Reference:** Handout L1 · 1st ed §9.1 · 2nd ed §9.1 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U12 Poles and bandwidth]]

## Gain and feedback: why an op amp needs so much gain

**Why:** Razavi Ex 9.1 and Problem Set 1 P2: “how much open-loop gain do I need for 1% accuracy?” is the first question of the op-amp chapter.

> [!question] Predict first: An op amp with A = 1000 is wired for 1/β = 10. The actual closed-loop gain is about…
> a) 10.00 exactly
> b) 9.90
> c) 1000

> [!success]- Answer
> **9.90**. Aclosed = A/(1 + βA) = 1000/101 = 9.90. The 1% shortfall is the gain error 1/(1 + βA).

An op amp is a super-sensitive see-saw: its open-loop gain $A_{open}$ is huge but sloppy (it changes with temperature and process). Feedback trades that sloppy gain for an accurate one.

A divider feeds a fraction $\beta$ of the output back. The closed-loop gain is $A/(1+\beta A)$, which is almost $1/\beta$ — set by two resistors, not by the transistors. The shortfall is the **gain error** $\varepsilon$ $= 1/(1+\beta A) \approx 1/(\beta A)$.

So accuracy is bought with gain: for error ε at closed-loop gain $1/\beta$, you need $A \ge A_{closed}/\varepsilon$.

> [!tip] Picture it
> Filling a glass while watching the line: the more attentively you watch (loop gain), the closer you stop to the mark.

**The rule**

$$A_{closed} = \dfrac{A}{1 + \beta A} \approx \dfrac{1}{\beta}$$

$$\varepsilon = \dfrac{1}{1 + \beta A} \approx \dfrac{1}{\beta A}$$

$$A_{min} = \dfrac{A_{closed}}{\varepsilon}$$

> [!note]
> β = R2/(R1 + R2) for the non-inverting amplifier.

> [!important] Lock it in
> Aclosed = A/(1 + βA) ≈ 1/β; gain error ε = 1/(1 + βA); need A ≥ Aclosed/ε.
> **Hook:** “Gain error is one over loop gain.”

## Speed: bandwidth, settling and slew rate

**Why:** Ex 9.2 (“settle to 1% in 5 ns — how fast must the op amp be?”) and Tutorial 6 (slewing then settling) are straight applications.

> [!question] Predict first: Same op amp, closed-loop gain raised from 1 to 10. The settling time becomes…
> a) 10× longer
> b) the same
> c) 10× shorter

> [!success]- Answer
> **10× longer**. τ = Aclosed/ωu. Ten times the closed-loop gain means ten times the time constant: feedback pushes the pole out by only (1 + βA0).

With one pole at $\omega_0$, the open-loop gain falls after $\omega_0$ and crosses 1 at $\omega_u$ $= A_0\omega_0$ (the GBW — a fixed pocket of coins you can spend on gain or on bandwidth).

Closing the loop moves the pole out by $(1+\beta A_0)$: bandwidth ≈ $\beta\omega_u$, and the step settles with $\tau$ $= 1/(\beta\omega_u) = A_{closed}/\omega_u$. To reach error ε takes $\tau\ln(1/\varepsilon)$: 4.6τ for 1%, 6.9τ for 0.1%.

A big step first **slews**: the output ramps at $SR$ $= I_{SS}/C_L$ until the linear response can take over.

> [!tip] Picture it
> GBW is a fixed pocket of coins. Settling: eating a share of what is left of a cake. Slewing: a fixed tap filling a bucket.

**The rule**

$$\omega_u = A_0\,\omega_0$$

$$\tau = \dfrac{1}{\beta\,\omega_u} = \dfrac{A_{closed}}{\omega_u}$$

$$t_s = \tau\ln\dfrac{1}{\varepsilon},\quad SR = \dfrac{I_{SS}}{C_L}$$

> [!important] Lock it in
> GBW = A0·ω0 is fixed; closed-loop bandwidth ≈ β·ωu; τ = Aclosed/ωu; settling τ·ln(1/ε); big steps slew at ISS/CL first.
> **Hook:** “Accuracy costs 2.3τ per decade.”

## Swing, offset, noise and supply rejection

**Why:** Every design question trades these off: more swing means smaller overdrives, which means bigger devices, more noise and more capacitance.

> [!question] Predict first: An op amp with 5 mV of input offset is used at closed-loop gain 10. The output error is about…
> a) 5 mV
> b) 50 mV
> c) 5 V

> [!success]- Answer
> **50 mV**. The offset sits at the input and is amplified by the closed-loop gain 1/β = 10: 50 mV at the output.

**Output swing** is the room between the floor and the ceiling of the output stack: each stacked transistor eats its $V_{ov}$.

**Offset** is a bathroom scale that reads 0.5 kg with nobody on it: a small input error from mismatch, multiplied by whatever gain follows.

**Noise** and **supply rejection** (PSRR — drawing on a bumpy bus) are also referred to the input: the lower the input-referred value, the better.

**Linearity**: the gain changes with the signal; negative feedback flattens it, just as it fixes the gain.

The trade: big swing → small overdrives → wide devices → more capacitance and a slower op amp.

> [!tip] Picture it
> Offset: a bathroom scale reading 0.5 kg with nobody on it. Supply rejection: drawing steadily on a bumpy bus.

**The rule**

$$V_{out,error} = \dfrac{V_{os}}{\beta}\ (\text{closed loop})$$

$$\text{swing} = V_{DD} - \sum |V_{ov}|\ (\text{stacked devices})$$

> [!note]
> Swing is the ceiling; noise and offset are the floor.

> [!important] Lock it in
> Swing from the headroom stack; offset and noise referred to the input and multiplied by 1/β; feedback also linearises.
> **Hook:** “Swing is the ceiling, noise and offset are the floor.”

## Questions you can solve after this topic

- [[Ex 9.1 – how much open-loop gain for 1% gain error]] · Razavi Example 9.1
- [[Ex 9.2 – how fast must the op amp be to settle in 5 ns]] · Razavi Example 9.2
- [[PS1 P2 – gain error and settling of the P1 op amp]] · Problem Set 1 P2 (tutoring chat)
- [[Lab 8 – behavioural op amp in a capacitive non-inverting amplifier]] · Lab 8 (hand calculations)

## Questions that also use it

- [[Tutorial 6 Q1 – linear settling versus slewing]]

## Flashcards

[[Flashcards – L1]]

## Symbols

[[open-loop gain (Aopen)]] · [[feedback factor (beta)]] · [[error (eps)]] · [[unity-gain frequency (GBW) (omegau)]] · [[time constant (tau)]] · [[slew rate (SR)]] · [[overdrive (Vov)]]
