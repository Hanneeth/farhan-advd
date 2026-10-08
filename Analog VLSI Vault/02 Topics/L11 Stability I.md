---
tags: ["topic", "unit/L11", "group/handout"]
aliases: ["Stability I"]
---
# L11 · Stability I

*Barkhausen, multi-pole systems*

**Reference:** Handout L11 · 1st ed §10.1–10.2 · 2nd ed §10.1–10.2 · **Lectures:** [[Lec 14]] · [[Lec 15]]

**Needs first:** [[L10 PSRR and noise]]

## Why feedback can oscillate: the loop feeds its own noise

**Why:** Every stability question (Lec 14–17, Razavi Ch 10) rests on one idea: a loop oscillates if what comes back lines up with what went in.

> [!question] Predict first: Negative feedback flips the signal (180°). The amplifier then delays it by another 180° at some frequency. What comes back is…
> a) opposite to the original: it cancels
> b) in phase with the original: it adds
> c) at a different frequency

> [!success]- Answer
> **in phase with the original: it adds**. 180° + 180° = 360°: the “negative” feedback has turned positive at that frequency. If the loop gain is still ≥ 1 there, the circuit amplifies its own noise.

Close the loop and write $A_f = \dfrac{A}{1 + \beta A}$ (your notes’ $A_f$). The $\beta A$ is the gain once round the loop.

If at some frequency $\omega_1$: $|\beta A(j\omega_1)| = 1$ and $\angle\beta A(j\omega_1) = -180^\circ$, the denominator is $1 - 1 = 0$: infinite gain, the circuit makes an output from nothing (its own noise). These are **Barkhausen’s criteria**.

A **single pole** can delay the signal by at most 90°, so a one-pole loop can never reach −180°: it is unconditionally stable (Lec 15). The closed-loop pole simply moves up to $\omega_{p1}(1 + \beta A_0)$.

> [!tip] Picture it
> Pushing a swing: a push that arrives in step with the motion (360° round the loop) makes it grow, however small each push.

**The rule**

$$A_f(s) = \dfrac{A(s)}{1 + \beta A(s)}$$

$$|\beta A(j\omega_1)| = 1\;\text{ and }\;\angle\beta A(j\omega_1) = -180^\circ \Rightarrow \text{oscillation}$$

$$\text{one pole: } \omega_{p,closed} = \omega_{p1}(1 + \beta A_0)$$

> [!important] Lock it in
> Oscillation needs |βA| = 1 at ∠βA = −180° (Barkhausen). One pole gives at most −90°, so a one-pole loop is always stable.
> **Hook:** “Flip twice and it comes back in step: the loop sings.”

## Two and three poles: the phase runs out before the gain does

**Why:** Lec 15–16 and Razavi 10.1–10.3: every real op amp has several poles, and the extra poles eat phase long before they cut gain.

> [!question] Predict first: You make the feedback weaker (smaller β, higher closed-loop gain). The loop becomes…
> a) less stable
> b) more stable
> c) no different

> [!success]- Answer
> **more stable**. Smaller β shifts the whole |βA| curve down, so ωgx moves to lower frequency where the phase is kinder. The phase curve itself does not move (Razavi Ex 10.1).

Each pole takes up to 90° of phase, but it starts eating phase a decade **before** the pole ($0.1\omega_p$), while the magnitude only bends **at** the pole. So extra poles hurt the phase much more than the gain.

Two poles approach −180° only at infinity (still stable, but maybe barely). Three poles cross −180° at a finite frequency: the **phase crossover** $\omega_{px}$. If the loop gain is still above 1 there, it oscillates.

Weaker feedback (smaller β) lowers $|\beta A|$ and pulls the **gain crossover** $\omega_{gx}$ left, into safer phase. The worst case is β = 1: the unity-gain buffer.

> [!tip] Picture it
> Walking toward a cliff edge (−180°) while your energy (loop gain) runs out: you want to run out of energy well before the edge.

**The rule**

$$A(s) = \dfrac{A_0}{(1 + s/\omega_{p1})(1 + s/\omega_{p2})}$$

$$\angle\beta A = -\tan^{-1}\tfrac{\omega}{\omega_{p1}} - \tan^{-1}\tfrac{\omega}{\omega_{p2}} - \dots$$

$$|\beta A(\omega_{gx})| = 1,\quad \angle\beta A(\omega_{px}) = -180^\circ$$

> [!important] Lock it in
> Poles eat phase from 0.1ωp but cut gain only from ωp. Two poles: −180° only at ∞; three poles: a finite ωpx. Smaller β is more stable; β = 1 is the worst case.
> **Hook:** “Run out of gain before you run out of phase.”

## Questions you can solve after this topic

- [[Past tutorial – how far feedback moves a single pole]] · Past tutorial 2024-25 T2 Ex 1
- [[Past tutorial – two poles closing in — coincident poles and maximally flat]] · Past tutorial 2024-25 T2 Ex 2

## Flashcards

[[Flashcards – L11]]

## Symbols

[[closed-loop gain (notes) (Af)]] · [[loop gain (betaA)]] · [[phase crossover (omegapx)]] · [[gain crossover (omegagx)]]
