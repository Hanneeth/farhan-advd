---
tags: ["topic", "unit/L2", "group/handout"]
aliases: ["One-stage op amps"]
---
# L2 · One-stage op amps

*5-T OTA, telescopic, buffer window*

**Reference:** Handout L2 · 1st ed §9.2.1 · 2nd ed §9.2.1 · **Lectures:** [[Lec 02]]

**Needs first:** [[L1 Performance parameters]]

## One-stage op amps: gain versus swing

**Why:** Tutorial 2 Q1 and PS1 P3–P4: the fully differential pair and the telescopic cascode, their gains and their swings.

> [!question] Predict first: Cascoding a fully differential pair (making it telescopic) roughly…
> a) doubles the gain and keeps the swing
> b) squares the gain (gm·rO)² but costs two more overdrives per side
> c) halves both

> [!success]- Answer
> **squares the gain (gm·rO)² but costs two more overdrives per side**. Rout grows by gm·rO on both sides, so the gain goes from ~gm·rO to ~(gm·rO)². Each side stacks two more devices, each costing |Vov|.

**Fully differential, simple loads:** gain $g_{m1}(r_{O1}\parallel r_{O3})$ ≈ gm·rO/2, swing $2(V_{DD} - |V_{ov3}| - V_{ov1} - V_{ISS})$. Its output CM floats: it needs CMFB (L7).

**Telescopic cascode:** cascode both sides, $A \approx g_{m1}(g_m r_O^2 \parallel g_m r_O^2)$ ≈ (gm·rO)²/2. The price: five devices in the stack, so swing $= 2[V_{DD} - (V_{ISS} + 2V_{ov,N} + 2|V_{ov,P}|)]$.

**Mirror-loaded (single-ended) telescopic:** the diode-biased PMOS cascode costs an extra |Vthp| at the top.

Full swing needs every device at its edge: Vin,CM, Vb1, Vb2 fixed exactly (Ex 9.7).

**The rule**

$$A_{tele} = g_{m1}\left(g_{m3}r_{O3}r_{O1} \parallel g_{m5}r_{O5}r_{O7}\right)$$

$$V_{pp,diff} = 2\left[V_{DD} - (V_{ISS} + V_{ov1} + V_{ov3} + |V_{ov5}| + |V_{ov7}|)\right]$$

> [!note]
> Cascode squares the gain and doubles the headroom bill.

> [!important] Lock it in
> Simple pair: gain gm·rO/2, big swing. Telescopic: (gm·rO)²/2, five overdrives per side. Mirror-loaded: lose another |Vthp|.
> **Hook:** “Cascode squares the gain and doubles the headroom bill.”

## The unity-gain buffer and its window

**Why:** Tutorial 2 Q2(b), Tutorial 3 Q1(c) and PS1 P5(d) all ask for the output range of a telescopic used as a buffer: the answer is a narrow window.

> [!question] Predict first: Vth = 0.7 V and Vov4 = 0.19 V. How wide is the buffer window of a telescopic?
> a) About 0.5 V
> b) About 1.5 V
> c) It depends on VDD

> [!success]- Answer
> **About 0.5 V**. Window = Vth − Vov4 = 0.7 − 0.19 ≈ 0.51 V, independent of VDD and of Vb1.

In a buffer the output is wired to the inverting input, so **the output is also a gate voltage**.

The floor comes from M4 (the NMOS cascode): $V_{out} \ge V_{b1} - V_{th4}$.
The ceiling comes from M2, whose gate is now the output: M2’s drain is fixed at $V_{b1} - V_{GS4}$, so $V_{out} \le V_{b1} - V_{GS4} + V_{th2}$.

Width: $V_{th} - V_{ov4}$ — roughly half a volt, whatever you do with Vb1. That is why telescopics are poor buffers and why we fold (L4).

Closing the loop also makes the output stiff: $R_{out}/(1+\beta A)$ → about $1/g_m$.

**The rule**

$$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - V_{GS4} + V_{th2}$$

$$\text{width} = V_{th} - V_{ov4}$$

$$R_{out,closed} = \dfrac{R_{out}}{1+\beta A}$$

> [!note]
> In a buffer the output is a gate voltage.

> [!important] Lock it in
> Telescopic buffer window: Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2, width Vth − Vov4. Feedback lowers Rout by (1 + βA).
> **Hook:** “In a buffer the output is a gate voltage.”

## Closed loop through capacitors: choose the CM level

**Why:** Your Lec 5 opens with this circuit (Razavi Ex 9.6): a telescopic in closed loop, where one choice of CM level doubles the usable swing.

> [!question] Predict first: The loop forces the input CM to equal the output CM. Where should VCM sit for the largest symmetric swing?
> a) At Vb − Vth (M3, M4 at their edge)
> b) At Vb − (VGS3,4 − Vth) (M1, M2 at their edge)
> c) Exactly at VDD/2

> [!success]- Answer
> **At Vb − (VGS3,4 − Vth) (M1, M2 at their edge)**. At the top edge X can fall a full Vth − Vov before M3, M4 leave saturation, and rising only meets the PMOS loads. At the bottom edge it cannot fall at all.

The input capacitors block DC, so the resistors set the bias: **the input CM equals the output CM**. The drains X, Y therefore sit at the same level as the input gates.

Two fences box X in: M3, M4 need $V_X \ge V_b - V_{th}$; M1, M2 need $V_X \le V_b - (V_{GS3,4} - V_{th})$ at DC.

Pick the **top** edge. X can fall by $V_{th} - V_{ov}$. It can rise freely, because the op amp's gain keeps its input gates almost still; only the PMOS loads stop it. So each output swings $\pm(V_{th} - V_{ov})$ around VCM.

> [!tip] Picture it
> Parking in a garage with a low beam and a floor drain: park as high as the beam allows and you have the most room to bounce down.

**The rule**

$$V_{CM} = V_b - (V_{GS3,4} - V_{th1,2}) = V_b - V_{ov3,4}$$

$$V_{X,min} = V_b - V_{th3,4}$$

$$\text{swing per side} = \pm(V_{th} - V_{ov}),\quad V_{pp,diff} = 4(V_{th} - V_{ov})$$

> [!note]
> This is the buffer window’s cousin: the same two fences, but here the gates stay still, so only the bottom fence limits the swing.

> [!important] Lock it in
> In closed loop Vin,CM = Vout,CM. Put VCM at Vb − (VGS3,4 − Vth): X can fall Vth − Vov to Vb − Vth; the swing is ±(Vth − Vov) per side.
> **Hook:** “Park just under the beam.”

## Questions you can solve after this topic

- [[Exam Q1 – five-transistor OTA (a–e)]] · Mid-sem exam Q1 (= Quiz 1 Part C)
- [[Tutorial 2 Q1 – fully differential pair with PMOS current-source loads]] · Tutorial 2 Q1 (Razavi Problem 9.1)
- [[Tutorial 2 Q2 – telescopic with a diode-connected cascode mirror]] · Tutorial 2 Q2 (Razavi Problem 9.2)
- [[Tutorial 3 Q1 – telescopic with a low-voltage cascode mirror]] · Tutorial 3 Q1 (Razavi Problem 9.4)
- [[PS1 P1 – five-transistor OTA, full analysis]] · Problem Set 1 P1 (tutoring chat)
- [[PS1 P3 – telescopic gain, swing and bias]] · Problem Set 1 P3 (tutoring chat)
- [[PS1 P4 – raising the input CM costs swing]] · Problem Set 1 P4 (tutoring chat)
- [[PS1 P5 – mirror-loaded telescopic and its buffer window]] · Problem Set 1 P5 (tutoring chat)
- [[Quiz 1 Part A – five-transistor OTA]] · Quiz 1 Part A
- [[Quiz 1 Part B – five-transistor OTA]] · Quiz 1 Part B
- [[Chat – what feedback does to a 5-T OTA buffer]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[Chat – input range of a 5-T OTA buffer on a 1 V supply]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[Chat – the telescopic buffer window]] · Buffer window lecture (tutoring chat, Razavi Ex 9.5)
- [[2024 mid-sem Q3 – PMOS-input telescopic with a cascode mirror, and as a buffer]] · Mid-sem 2024-25 Q3 (10 marks)

## Questions that also use it

- [[Tutorial 3 Q2 – two-stage op amp, CM level at X and Y]]

## Flashcards

[[Flashcards – L2]]

