---
tags: ["lecture", "lec/03"]
aliases: ["Unity-gain buffer; telescopic cascode (two versions); the buffer window"]
date: "7 Aug"
---
# Lec 03 · Unity-gain buffer; telescopic cascode (two versions); the buffer window

**Date:** 7 Aug · **Handout:** L2 · **Topics:** 

> [!abstract] In one paragraph
> The 5-T OTA in unity feedback (Rout → 1/gm2, pole → gm2/CL), the telescopic op amp’s gain (gm·rO)²/2 and swing, and why a telescopic buffer only works in a narrow window.

**Before:** [[Lec 02]] · **Next:** [[Lec 04]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec03.webp]]

Original PDF: [[Notes – lecture-03-07082026.pdf]]

## The page, item by item

### 5-T OTA as a unity-gain buffer (output tied to the − input)

Output wired straight back: $\beta = 1$. Because $A_{open} \gg 1$, the closed-loop gain is about 1. For an NMOS-input OTA with equal $r_O$, $A_{open} = g_{mN}(r_{ON}\parallel r_{OP}) \approx g_{mN}r_{ON}/2$.

$$A_{closed} = \dfrac{A_{open}}{1 + \beta A_{open}},\quad \beta = 1 \Rightarrow A_{closed} = \dfrac{A_{open}}{1 + A_{open}} \approx 1$$

$$A_{open} = g_{mN}(r_{ON}\parallel r_{OP}) \approx g_{mN}\dfrac{r_{ON}}{2}$$

### What the load sees: a source behind Rout,closed

Seen from a load $R_L$, the closed-loop op amp is a voltage source $V_{in}A_{closed}$ behind a small resistance. Feedback divides the output resistance by $(1 + \beta A_{open})$; for the buffer that leaves $1/g_{m2}$.

- $R_{out,open} = r_{O2}\parallel r_{O4}$
- $R_{out,closed} = \dfrac{R_{out,open}}{1+\beta A_{open}} \approx \dfrac{R_{out,open}}{A_{open}}$
- $= \dfrac{r_{O2}\parallel r_{O4}}{g_{m2}(r_{O2}\parallel r_{O4})} = \dfrac{1}{g_{m2}}$

$$R_{out,closed} \approx \dfrac{1}{g_{m2}}$$

### The buffer’s bandwidth

Open loop, the pole is $1/((r_{O2}\parallel r_{O4})C_L)$. Closed loop, the same $C_L$ sees only $1/g_{m2}$, so the pole moves up by the loop gain to $g_{m2}/C_L$ — the GBW.

$$\omega_{p,open} = \dfrac{1}{(r_{O2}\parallel r_{O4})C_L}$$

$$\omega_{out,closed} = \dfrac{1}{\frac{1}{g_{m2}}C_L} = \dfrac{g_{m2}}{C_L}$$

> [!question] Asked in exams
> Mid-sem Q1(e): "output short-circuited with Vin2 (buffer), bandwidth with 4 pF?" → gm2/(2πCL).

### Telescopic cascode op amp, fully differential (M1–M8, ISS)

Cascoding both the input pair (M3, M4 on M1, M2) and the loads (M5, M6 on M7, M8) makes each side’s resistance $g_m r_O^2$. Looking up and looking down are both $g_m r_O r_O$, and in parallel they halve.

- $A_{open} = g_{m1,2}\left[g_{m4}r_{O4}r_{O2} \parallel g_{m6}r_{O6}r_{O8}\right]$
- gmP = gmN, rOP = rON: $= g_{mN}\left[g_{mN}r_{ON}^2 \parallel g_{mP}r_{OP}^2\right]$
- $= g_{mN}\dfrac{g_{mN}r_{ON}^2}{2} = \dfrac{(g_{mN}r_{ON})^2}{2}$

$$A_{open} \approx \dfrac{(g_m r_O)^2}{2}$$

$$\text{swing} = 2\left[V_{DD} - \{|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS}\}\right]$$

> [!question] Asked in exams
> Tutorial 2 Q1–Q2, Razavi Ex 9.7: gain and differential swing of a telescopic.

### Mirror-loaded telescopic (single output, diode stack M5, M7)

Replace the top current sources by a cascode mirror. The diode-connected stack (M7, M5) fixes M6’s gate at $V_{DD} - |V_{GS7}| - |V_{GS5}|$, and M6 stays saturated only while its drain is no more than $|V_{thp}|$ above that gate. So the output tops out at $V_{DD} - |V_{ov8}| - |V_{ov6}| - |V_{thp}|$: the mirror costs **one extra $|V_{thp}|$** of swing.

$$\text{swing} = V_{DD} - \{|V_{ov8}| + |V_{ov6}| + |V_{thp}| + V_{ov4} + V_{ov2} + V_{ISS}\}$$

### Telescopic as a buffer: the output window

Tie $V_{out}$ to the gate of M2. Now the output is also an input, so two fences fight. **M4 saturated** needs the output high enough; **M2 saturated** needs its drain X (one $V_{GS4}$ below $V_{b1}$) to stay within $V_{th}$ of its gate, which is the output.

- (1): $M4:\; V_{out} - V_X \ge V_{b1} - V_X - V_{th4} \Rightarrow V_{out} \ge V_{b1} - V_{th4}$
- $M2:\; V_X - V_P \ge V_{out} - V_P - V_{th2} \Rightarrow V_X + V_{th2} \ge V_{out}$
- (2): $V_X = V_{b1} - V_{GS4} \Rightarrow V_{b1} - V_{GS4} + V_{th2} \ge V_{out}$

$$V_{b1} - V_{th4} \le V_{out} \le V_{b1} - V_{GS4} + V_{th2}$$

$$\text{width} = V_{th} - V_{ov4}$$

> [!question] Asked in exams
> Tutorial 2 Q2(b), Tutorial 3 Q1(c): "maximum output swing if the gate of M2 is tied to the output".

## Explained step by step

Wire the output back to the **− input**, which in the 5-T OTA is **M2’s gate** (raising it lowers $V_{out}$). Now β = 1: the whole output is fed back, and the closed-loop gain is $A/(1+A) \approx 1$.

So why is $V_{out} = V_{in}$? Because the op amp keeps adjusting until its two inputs nearly match — and its two inputs are now $V_{in}$ and $V_{out}$ itself. The miss is about $1/A$.

Why would anyone want a gain of 1? A **buffer** copies a voltage without loading it (the input sees only a gate) and can drive a load (the output becomes very stiff — next step).

![[s-lec03-buffer.svg]]

Its weak spot is **accuracy**. The 5-T OTA’s gain is $g_m(r_{ON}\parallel r_{OP}) \approx g_mr_O/2$ (two similar $r_O$ in parallel halve), only about 25 — so $V_{out}$ misses $V_{in}$ by about 4 %. Hold on to that: it is why this lecture moves on to the cascode.

Picture the buffer from the load’s side: a voltage $V_{in}A_{closed}$ behind a resistance $R_{out,closed}$, driving a test load $R_L$. The output sags under load only if $R_{out,closed}$ is not much smaller than $R_L$.

Feedback makes that resistance tiny. Pull current and the output dips; the dip appears at M2’s gate, the op amp amplifies it by $A$ and pushes back. So the output is $(1 + \beta A)$ times stiffer: $R_{out,closed} = R_{out,open}/(1+\beta A)$.

For the OTA it cancels beautifully: $\dfrac{r_{O2}\parallel r_{O4}}{1 + g_m(r_{O2}\parallel r_{O4})} \approx \dfrac{1}{g_m}$ — the same as looking into a source.

A pole sits at $1/(R\cdot C)$ of the node. Open loop the output sees $R = r_{O2}\parallel r_{O4}$ with $C_L$. Close the loop and the same $C_L$ only sees $1/g_{m2}$, so the pole jumps up to $g_{m2}/C_L$.

That is exactly the GBW: $A_0\omega_0 = g_m(r_O\parallel r_O)\cdot\dfrac{1}{(r_O\parallel r_O)C_L} = g_m/C_L$. A gain-1 buffer gets the **whole** GBW as its bandwidth — feedback trades gain for speed one-for-one. (In Hz: $g_m/(2\pi C_L)$.)

To raise the gain without adding a second stage, Razavi **cascodes**: he stacks a common-gate device on each transistor. The cascode **guards** the device below it — its source barely moves (it looks like $1/g_m$), so the lower device’s drain is held almost still while the output swings. Seen from the output, the resistance is multiplied by $g_mr_O$: “up multiplies”.

Both circuits on this page are **telescopic** cascodes (one straight column): left fully differential, right single-ended with a cascode mirror. Neither is the folded cascode — that comes in Lec 5, as the fix for the problem this lecture ends with.

Why stack instead of a second stage? Stacking keeps **one** high-impedance node (one dominant pole, easy to stabilise) while squaring the gain. The cost is headroom — that trade is the rest of the lecture.

Use one half and look into the output node both ways.

Looking **down**: M2’s $r_{O2}$ sits under the cascode M4’s source, and a resistance under a source looks $g_mr_O$ times bigger from the drain: $R_{down} = g_{m4}r_{O4}r_{O2}$. Looking **up**: the same with the PMOS pair, $R_{up} = g_{m6}r_{O6}r_{O8}$.

![[s-lec03-tele.svg]]

The input current $g_{m2}v_{in}$ is unchanged (all of M2’s signal current goes up through M4’s low-resistance source), so $G_m$ is still just $g_m$. Two roughly equal resistances in parallel halve, so $A = g_m\cdot g_mr_O^2/2 = (g_mr_O)^2/2$. With $g_mr_O = 50$: about **1250**, against 25 for the 5-T OTA.

The price of stacking. Each output column from VDD to ground holds M8, M6, M4, M2 and the tail, and each must stay saturated, so each keeps its own $V_{ov}$ (the tail’s is $V_{ISS}$). Whatever is left of VDD is the room the output moves in; the differential swing is twice that:

$2[V_{DD} - (|V_{ov8}| + |V_{ov6}| + V_{ov4} + V_{ov2} + V_{ISS})]$.

**How to read the towers** used from here on: each transistor is drawn as a block whose **height is the voltage across it** (top node minus bottom node). The blocks always add up to VDD, and no block may be shorter than its $V_{ov}$. When the output moves, the boundary at the output slides: the block above shrinks and the block below grows (or the reverse). The limit is the moment a block is squeezed to its minimum — drawn **red**. A block labelled **room** is not a transistor: it is the spare voltage the output can move through. So a swing question is always: *which block gets squeezed first?*

![[s-lec03-tower.svg]]

![[s-lec03-headroom.svg]]

The mirror version loses one more $|V_{thp}|$. To see why, first ask what $|V_{th}|$ actually does. It is the gate’s **entry fee**: the gate must be $|V_{th}|$ away from the source before any channel forms, and none of that produces current. The drain does not pay it — it only needs $|V_{ov}|$ from the source. So, measured **from the gate**, a PMOS drain may sit up to $|V_{th}|$ **above** its gate and still be saturated.

Now count. In the fully differential version you choose $V_{b2}$ freely: walking down from VDD to M6’s gate you pass one $V_{GS}$ (one $V_{th}$ taken), and M6’s drain gets one back — **0 lost**. In the mirror version M6’s gate is set by **two diodes**, each a whole $V_{GS}$: two taken, one given back — **exactly 1 lost**.

![[s-lec03-vth.svg]]

Where does that lost $|V_{thp}|$ physically sit? The upper diode pins the top current source’s drain one whole $V_{GS}$ below VDD, when the source only needed one $V_{ov}$. The extra $|V_{th}|$ sits across it doing nothing: the **diode tax**. (A wide-swing cascode mirror, driving the cascode gate from its own bias, removes it.)

Now use the telescopic as the buffer from the start of the lecture: $V_{out}$ is wired to **M2’s gate**. The output is suddenly also an **input**, so it has to keep two transistors happy at once.

First meet node **X**: M2’s drain, which is the cascode M4’s source. M4’s gate is held at $V_{b1}$ and it carries a fixed current, so its $V_{GS4}$ is fixed: $X = V_{b1} - V_{GS4}$. X is **pinned** — it does not follow the input. (That is also why the input CM is not the same as X: one is M2’s gate, the other its drain.)

**Floor** — M4’s fence: its drain ($V_{out}$) must stay above its gate minus $V_{th4}$: $V_{out} \ge V_{b1} - V_{th4}$. Lower, and M4 falls into triode.

**Ceiling** — M2’s fence, which is new: M2’s gate (now $V_{out}$) may be at most $V_{th2}$ above its pinned drain X: $V_{out} \le V_{b1} - V_{GS4} + V_{th2}$. Higher, and M2 falls into triode.

The same two lines as checks and links: X comes from a **link** ($X = V_{b1} - V_{GS4}$). M4’s **check** ($V_{out} - X \ge V_{ov4}$) gives the floor. M2’s **check** ($X - P \ge V_{ov2}$), with M2’s own link $P = V_{out} - V_{GS2}$, gives the ceiling. Because M2 sits **under** the output in the same column, raising $V_{out}$ squeezes M2 — that is why there is a ceiling at all.

![[s-lec03-window.svg]]

Subtract the two fences: $(V_{b1} - V_{GS4} + V_{th2}) - (V_{b1} - V_{th4}) = V_{th} - V_{ov4}$. $V_{b1}$ cancels, so moving it only **slides** the window up or down; it never widens it. The output can live in only about **half a volt**.

So here is the whole lecture as one story:

**(1)** a buffer needs a big $A$ (error ≈ 1/A), and the 5-T OTA’s is small; **(2)** cascoding squares the gain; **(3)** but stacking eats headroom — five overdrives, plus one $|V_{th}|$ with a diode stack; **(4)** and as a buffer the telescopic is so cramped that the output has only a $V_{th} - V_{ov}$ window.

The fix is the **folded cascode** (Lec 5): it takes the input pair out of the output column, so input and output stop fighting over the same half-volt.

## Animated lessons

- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · 

