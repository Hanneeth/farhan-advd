---
tags: ["topic", "unit/U10", "group/foundations"]
aliases: ["Differential pair"]
---
# U10 · Differential pair

*CM/DM, half circuit, 2RSS*

**Reference:** Razavi Ch 4 · Tutorial 1 · **Lectures:** [[Lec 01]] · [[Lec 02]]

**Needs first:** [[U9 Cascode]]

## The differential pair: CM, DM and current steering

**Why:** Every op amp in the course starts with this pair, and Tutorial 1 is all about it. It only listens to the difference between its inputs.

> [!question] Predict first: Both gates rise by 100 mV together. What happens to ID1 and ID2?
> a) Both rise
> b) Nothing: they stay at ISS/2 each
> c) ID1 rises, ID2 falls

> [!success]- Answer
> **Nothing: they stay at ISS/2 each**. The tail fixes ID1 + ID2 = ISS, and by symmetry each gets half. A common move just lifts the tail node P by the same 100 mV.

Two matched transistors share one **tail current** $I_{SS}$. Split the inputs into a **common part** $V_{CM}$ $= (V_{in1}+V_{in2})/2$ and a **difference** $v_d$ $= V_{in1} - V_{in2}$.

A common move changes nothing: the tail node simply rides up and down, and each side keeps $I_{SS}/2$. A difference **steers** the current: one side gains exactly what the other loses. For small $v_d$ the extra current is $g_m v_d/2$ on each side.

When $|v_d|$ reaches $\sqrt{2}\,V_{ov}$ (with $V_{ov}$ at balance), **all** of $I_{SS}$ is on one side and the other transistor is off.

> [!tip] Picture it
> Two kids on a see-saw: lift both ends together and nothing tips; push one down and the other goes up by the same amount.

**The rule**

$$V_{CM} = \tfrac{V_{in1}+V_{in2}}{2},\quad v_d = V_{in1}-V_{in2}$$

$$I_{D1}+I_{D2} = I_{SS},\quad \Delta I_{D1} \approx +\tfrac{g_m v_d}{2},\ \Delta I_{D2} \approx -\tfrac{g_m v_d}{2}$$

$$|v_d|_{max} = \sqrt{2}\,V_{ov},\quad V_{ov} = \sqrt{\tfrac{I_{SS}}{\mu_n C_{ox} W/L}}$$

> [!important] Lock it in
> The pair ignores VCM and steers ISS with vd: ±gm·vd/2 on each side, all of it past √2·Vov.
> **Hook:** “Two kids on a see-saw.”

## Half circuits: Ad, ACM with 2RSS, and CMRR

**Why:** Tutorial 1 Q4 asks for Ad, the CM gain and the CM step that pushes the pair into triode. All three come from two half circuits.

> [!question] Predict first: In the common-mode half circuit, what resistance sits under each transistor’s source if the tail is a resistor RSS?
> a) 0 (AC ground)
> b) RSS
> c) 2RSS

> [!success]- Answer
> **2RSS**. Both halves push the same current into RSS, so the voltage there rises by 2i·RSS. To one half it looks like 2RSS of its own.

Cut the symmetric circuit in half along its mirror line.

**Differential mode:** one side goes up, the other down, so the tail node P **does not move**. It is AC ground, and each half is a plain CS stage: $A_d = g_m R_D$ (differential output).

**Common mode:** both sides move together and push the same current into the tail. Each half sees **2RSS** under its source, so by the ratio rule $A_{CM} = -R_D/(1/g_m + 2R_{SS})$: small.

The pair’s quality is how much bigger $A_d$ is than $A_{CM}$: the **CMRR**, usually quoted as $20\log_{10}|A_d/A_{CM}|$.

**The rule**

$$A_d = g_m R_D\ (\text{DM half circuit, P = AC ground})$$

$$A_{CM} = -\dfrac{R_D}{1/g_m + 2R_{SS}}\ (\text{CM half circuit})$$

$$\text{CMRR} = 20\log_{10}\left|\dfrac{A_d}{A_{CM}}\right|$$

> [!note]
> An ideal tail (RSS → ∞) gives ACM = 0 for a perfectly matched pair. Mismatch brings it back.

> [!important] Lock it in
> DM: P is AC ground, Ad = gm·RD. CM: each half sees 2RSS, ACM = −RD/(1/gm + 2RSS). CMRR = 20·log|Ad/ACM|.
> **Hook:** “DM: ground the tail. CM: double the tail.”

## Input CM range: a fence at each end

**Why:** Tutorial 1 Q1 ends with “what is the input common-mode range?” It is two fence checks: one on the tail, one on the input pair.

> [!question] Predict first: You raise the input CM. Which node follows it up, one VGS below?
> a) The drains
> b) The tail node P
> c) VSS

> [!success]- Answer
> **The tail node P**. The current in each device is fixed by the tail, so VGS is fixed: the sources (node P) follow the gates. The drains stay put (fixed current through RD).

Raising $V_{CM}$ lifts the tail node P with it (P = VCM − VGS1), while the drains stay where RD puts them.

**Floor:** P must stay high enough for the tail source to stay saturated. P ≥ VSS + $V_{ISS}$, so
$V_{CM,min} = V_{SS} + V_{ISS} + V_{GS1}$.

**Ceiling:** Q1’s fence: its drain must stay above its gate minus a threshold, so
$V_{CM,max} = V_{D1} + V_{th}$.

Inside that window every transistor is saturated and the pair works.

**The rule**

$$V_{in,CM,min} = V_{SS} + V_{ISS} + V_{GS1}$$

$$V_{in,CM,max} = V_{D1} + V_{th}\;(\text{resistor load})$$

$$V_{in,CM,max} = V_{DD} - |V_{GS3}| + V_{thn}\;(\text{mirror load, 5-T OTA})$$

> [!important] Lock it in
> CM range: floor = tail headroom + VGS1; ceiling = input device fence (drain + Vth). P follows VCM one VGS below.
> **Hook:** “A fence at each end.”

## Questions you can solve after this topic

- [[Tutorial 1 Q1 – design a pair with a mirror tail]] · Tutorial 1 Q1
- [[Tutorial 1 Q2 – pair with diode-connected PMOS loads]] · Tutorial 1 Q2
- [[Tutorial 1 Q3 – pair with PMOS current-source loads]] · Tutorial 1 Q3
- [[Tutorial 1 Q4 – a single-supply pair with an RSS tail]] · Tutorial 1 Q4
- [[Lab 6 – design a PMOS-input resistive diff amp]] · Lab 6 (hand calculations)

## Flashcards

[[Flashcards – U10]]

## Symbols

[[tail current (ISS)]] · [[common-mode voltage (VCM)]] · [[differential input (vd)]] · [[differential gain (Ad)]] · [[common-mode gain (ACM)]] · [[tail headroom (VISS)]]
