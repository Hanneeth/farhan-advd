---
tags: ["topic", "unit/U12", "group/foundations"]
aliases: ["Poles and bandwidth"]
---
# U12 · Poles and bandwidth

*GBW = gm/CL*

**Reference:** Razavi Ch 6 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U11 Five-transistor OTA]]

## Poles and GBW: one pole per node

**Why:** Exam Q1(d) and (e): the bandwidth with CL = 4 pF, then the bandwidth as a buffer. Both are one line once you see the pole.

> [!question] Predict first: You double Rout of a one-stage OTA (same gm, same CL). What happens to its unity-gain frequency?
> a) It doubles
> b) It halves
> c) It stays the same

> [!success]- Answer
> **It stays the same**. The gain doubles and the bandwidth halves. Their product gm/CL does not depend on Rout at all.

A capacitor is a resistor that shrinks with frequency: $1/(\omega C)$. On a node with resistance $R$ it starts to steal current when $1/(\omega C) = R$: a **pole** at $\omega_p = 1/(RC)$.

A one-stage OTA has one high-resistance node, the output, so one important pole: $\omega_p = 1/(R_{out} C_L)$. Above it the gain falls 20 dB per decade and hits 1 at
$\omega_u = A_0\,\omega_p = g_m R_{out}/(R_{out} C_L) = g_m/C_L$: the $\omega_u$, or **GBW**. Rout cancels.

In a **unity-gain buffer** Rout drops to about $1/g_m$, so the bandwidth becomes $g_m/C_L$: the GBW itself. Divide by $2\pi$ for Hz.

**The rule**

$$\omega_p = \dfrac{1}{R_{out} C_L},\quad f_{-3dB} = \dfrac{1}{2\pi R_{out} C_L}$$

$$\omega_u = A_0\,\omega_p = \dfrac{g_m}{C_L}$$

$$f_{buffer} \approx \dfrac{g_m}{2\pi C_L}$$

> [!note]
> Forgetting the 2π is the most common slip: rad/s ÷ 6.28 = Hz.

> [!important] Lock it in
> One pole per node: 1/(RC). One-stage OTA: f−3dB = 1/(2πRoutCL), GBW = gm/(2πCL), buffer bandwidth ≈ GBW.
> **Hook:** “GBW = gm/CL: Rout cancels.”

## Settling and slewing: the cake and the tap

**Why:** Razavi Ex 9.2 and Problem Set 1 P2 ask how fast an op amp settles to 0.1%. Big steps add slewing first.

> [!question] Predict first: Settling to 1% takes 4.6 τ. How many τ does 0.1% take?
> a) About 4.6 again
> b) About 6.9
> c) 46

> [!success]- Answer
> **About 6.9**. The error is e^(−t/τ). For 0.1% you need ln(1000) = 6.9 time constants: only 2.3 τ more for ten times better accuracy.

In feedback, a one-pole op amp answers a small step like $1 - e^{-t/\tau}$, with $\tau$ $= 1/(\beta\omega_u) = A_{closed}/\omega_u$. Every τ the remaining error shrinks by $e$ — like eating a fixed share of what is left of a cake. To get within $\varepsilon$: $t = \tau\ln(1/\varepsilon)$: 4.6τ for 1%, 6.9τ for 0.1%.

A **big** step would need a steeper start than the op amp can give: the tail current can only charge $C_L$ so fast. The output then ramps at the **slew rate** $SR = I_{SS}/C_L$ (a fixed tap filling a bucket), and only settles exponentially at the end.

> [!tip] Picture it
> Settling: eating a fixed share of what is left of a cake every minute. Slewing: a fixed tap filling a bucket.

**The rule**

$$\tau = \dfrac{1}{\beta\,\omega_u} = \dfrac{A_{closed}}{\omega_u}$$

$$t_s = \tau\,\ln\dfrac{1}{\varepsilon}\quad(1\%: 4.6\tau,\ 0.1\%: 6.9\tau)$$

$$SR = \dfrac{I_{SS}}{C_L}$$

> [!important] Lock it in
> τ = Aclosed/ωu; settle in τ·ln(1/ε); a big step first slews at ISS/CL.
> **Hook:** “Eat half the cake each minute; a tap fills the bucket at a fixed rate.”

## Questions you can solve after this topic

- [[Lab 1 – first-order RC low-pass filter]] · Lab 1 (hand calculations)
- [[Lab 3 – CS versus cascode gain, bandwidth and GBW]] · Lab 3 (hand calculations)
- [[Lab 7 – turn the 5-T OTA specs into numbers]] · Lab 7 (hand calculations)
- [[2024 Quiz 1 Q2 – the same OTA sized for 10 V µs into 2 pF]] · Quiz 1 2024-25 Q2 (6 marks)

## Questions that also use it

- [[Exam Q1 – five-transistor OTA (a–e)]]
- [[Chat – what feedback does to a 5-T OTA buffer]]

## Flashcards

[[Flashcards – U12]]

## Symbols

[[unity-gain frequency (GBW) (omegau)]] · [[time constant (tau)]] · [[error (eps)]]
