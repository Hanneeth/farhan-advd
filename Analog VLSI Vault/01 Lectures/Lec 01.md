---
tags: ["lecture", "lec/01"]
aliases: ["Gain and gain error (Razavi Ex 9.1)"]
date: "3 Aug"
---
# Lec 01 · Gain and gain error (Razavi Ex 9.1)

**Date:** 3 Aug · **Handout:** L1 · **Topics:** [[U0 Circuit language]] · [[U1 The MOSFET]] · [[U2 Triode, saturation, pinch-off]] · [[U3 DC recipe and PMOS]] · [[U4 Small signal]] · [[U5 First amplifier common source]] · [[U6 Impedance rules, sources, diodes, mirrors]] · [[U7 CS with every load + degeneration]] · [[U8 Source follower and common gate]] · [[U9 Cascode]] · [[U10 Differential pair]] · [[U11 Five-transistor OTA]] · [[U12 Poles and bandwidth]] · [[L1 Performance parameters]]

> [!abstract] In one paragraph
> Why an op amp needs a huge open-loop gain: design a gain-of-10 amplifier with under 1% error.

**Before:** [[Home]] · **Next:** [[Lec 02]] · **All formulas:** [[Formula sheet]]

## Your handwritten page

![[lec01.webp]]

Original PDF: [[Notes – lecture-01-03082026.pdf]]

## The page, item by item

### The task: gain 10, gain error under 1%

A single transistor (common source) gives $A_v = -g_m R_D$, but $g_m$ and $R_D$ drift with temperature and process, so the gain is not accurate. Instead we put a **high-gain op amp** inside a feedback loop. The resistors set the gain; the op amp only has to be "big enough".

$$A_v = -g_m R_D$$

### Feedback factor β from the resistor divider

The output is fed back through $R_1$ (top) and $R_2$ (bottom). The fraction of $V_{out}$ that reaches the inverting input is $\beta$. An ideal op amp keeps both inputs equal, so the ideal gain is $1/\beta$.

$$V_f = \dfrac{R_2}{R_1 + R_2}V_{out}$$

$$\beta = \dfrac{V_f}{V_{out}} = \dfrac{R_2}{R_1+R_2}$$

$$A_{ideal} = \dfrac{1}{\beta} = \dfrac{R_1+R_2}{R_2} = 1 + \dfrac{R_1}{R_2} = 10$$

> [!question] Asked in exams
> Any "non-inverting amplifier with gain 10" question: β = 0.1.

### Closed-loop (actual) gain

With a finite open-loop gain $A$, the real gain is a little below $1/\beta$.

$$A_{closed} = A_{actual} = \dfrac{A}{1 + \beta A}$$

### Gain error ε, derived

The error is how far the actual gain falls short of the ideal gain, as a fraction of the ideal gain. Your page simplifies it in three lines:

- $\varepsilon = \dfrac{A_{ideal} - A_{actual}}{A_{ideal}} = \dfrac{\frac{1}{\beta} - \frac{A}{1+\beta A}}{\frac{1}{\beta}}$
- common denominator β(1 + βA); the βA terms cancel: $= \beta \cdot \dfrac{1 + \beta A - \beta A}{\beta(1+\beta A)} = \dfrac{1}{1+\beta A}$
- because βA ≫ 1: $\varepsilon \approx \dfrac{1}{\beta A}$

$$\varepsilon = \dfrac{1}{1+\beta A} \approx \dfrac{1}{\beta A}$$

### Minimum open-loop gain

Set the error at its limit and solve for A. Exactly, $0.01 \ge 10 - \frac{A}{1 + A/10}$ (your first line) gives $A \ge 990$; the approximation $\varepsilon \approx 1/(\beta A)$ gives the round answer $A \ge 1000$. Quote 1000: it is the answer the course uses.

- $0.01 \ge \dfrac{1}{\beta A} = \dfrac{10}{A}$
- $A \ge \dfrac{10}{0.01} = 1000$

$$A_{min} = \dfrac{A_{closed}}{\varepsilon}$$

> [!question] Asked in exams
> Razavi Ex 9.1 and every "gain error" part: A ≥ Aclosed/ε.

## Explained step by step

One transistor *can* give a gain of 10: a common-source stage gives $A_v = -g_mR_D$. The trouble is $g_m$. It drifts with temperature, with the process, even with the signal itself — so that gain is never **exactly** 10, and it is not linear.

Razavi’s cure is not a better transistor. It is **feedback**: take a very large but sloppy gain $A$, and let two resistors decide the final gain, because a **ratio of resistors** is precise.

That is the whole lecture in one sentence: error = $1/(1+\beta A)$, so a precise amplifier needs a **big open-loop gain**. Lectures 2–8 are all about getting a big $A$ without losing swing.

Follow the signal round the loop. The output goes down through $R_1$ and $R_2$, and the voltage across $R_2$ — called $V_f$ — goes back to the **− input**.

Why the − input? Feedback has to **oppose** a change. If $V_{out}$ rises, the − input rises, and that pushes $V_{out}$ back down. Wired to the + input it would push the output further up until it hits a rail.

Now **β** is just the divider ratio: the fraction of the output that arrives back at the − input. The tap is across the **bottom** resistor, so it is $R_2/(R_1+R_2)$ — not $R_1$ on top.

![[s-lec01-feedback.svg]]

The op amp amplifies the difference between its inputs: $V_{out} = A(V_{in} - \beta V_{out})$. Move the $V_{out}$ terms together and you get $V_{out}(1+\beta A) = AV_{in}$, so

$A_{closed} = A/(1+\beta A)$.

If $A$ were infinite, the op amp would force its two inputs equal: $\beta V_{out} = V_{in}$, so the gain is exactly $1/\beta = (R_1+R_2)/R_2 = 1 + R_1/R_2$. For gain 10 you pick $R_1 = 9R_2$.

“But if the inputs are equal, how does the op amp make any output?” They are not **exactly** equal — they differ by a tiny $V_{out}/A$ (1 mV for 1 V out with $A = 1000$). That small leftover is precisely what makes the real gain fall a little short of $1/\beta$.

So the resistors set the gain; $A$ only decides **how close** you get.

Error is simply “how far short, as a fraction of the ideal gain”.

The exact route to 990: $\varepsilon = 1/(1+\beta A) \le 0.01$ means $1 + \beta A \ge 100$, so $\beta A \ge 99$, so $A \ge 99/\beta = 990$ with β = 0.1. Nobody builds 990, so round up to **1000** — and the quick rule on the next step gives 1000 directly.

All gains here are in V/V. If a question wants dB: $20\log_{10}1000 = 60$ dB.

Write the error with a common denominator: $\dfrac{1}{\beta} - \dfrac{A}{1+\beta A} = \dfrac{(1+\beta A) - \beta A}{\beta(1+\beta A)} = \dfrac{1}{\beta(1+\beta A)}$. The $\beta A$ terms cancel on top. Divide by the ideal gain $1/\beta$ and only this is left:

**error = one over (one plus the loop gain)**.

The **loop gain** $\beta A$ — the gain once round the loop — is the hero of the whole chapter: more loop gain, less error.

Because $\beta A \gg 1$ (anything above about 50), drop the 1: $\varepsilon \approx 1/(\beta A)$. The difference from the exact form is then under 2 % of the error itself, which is why 990 and 1000 are both accepted — just say which one you used.

Now the design rule is one line: **open-loop gain = closed-loop gain ÷ allowed error**. Gain 10, error 1 % → $A \ge 1000$.

Keep this for Lecture 3: a **buffer** has β = 1, so its error is about $1/A$. A 5-T OTA ($A \approx 25$) misses by 4 %; a telescopic ($A \approx 1250$) by 0.08 %.

## Questions that use this lecture

- [[WE1 – analyse a common-source stage]] · Worked Example 1 (tutoring conversation, Part 1)
- [[WE2 – design a biased NMOS]] · Worked Example 2 (tutoring conversation, Part 1)
- [[WE3 – a PMOS with magnitudes]] · Worked Example 3 (tutoring conversation, Part 1)
- [[Tutorial 1 Q1 – design a pair with a mirror tail]] · Tutorial 1 Q1
- [[Tutorial 1 Q2 – pair with diode-connected PMOS loads]] · Tutorial 1 Q2
- [[Tutorial 1 Q3 – pair with PMOS current-source loads]] · Tutorial 1 Q3
- [[Tutorial 1 Q4 – a single-supply pair with an RSS tail]] · Tutorial 1 Q4
- [[Tutorial 1 Q5 – mirror-loaded pair, find the bias current]] · Tutorial 1 Q5
- [[Exam Q1 – five-transistor OTA (a–e)]] · Mid-sem exam Q1 (= Quiz 1 Part C)
- [[Ex 9.1 – how much open-loop gain for 1% gain error]] · Razavi Example 9.1
- [[Ex 9.2 – how fast must the op amp be to settle in 5 ns]] · Razavi Example 9.2
- [[PS1 P1 – five-transistor OTA, full analysis]] · Problem Set 1 P1 (tutoring chat)
- [[PS1 P2 – gain error and settling of the P1 op amp]] · Problem Set 1 P2 (tutoring chat)
- [[Quiz 1 Part A – five-transistor OTA]] · Quiz 1 Part A
- [[Quiz 1 Part B – five-transistor OTA]] · Quiz 1 Part B
- [[Tutorial 6 Q1 – linear settling versus slewing]] · Tutorial 6 Q1
- [[Tutorial 6 Q2 – a 5-T OTA slews, then settles]] · Tutorial 6 Q2
- [[Lab 1 – first-order RC low-pass filter]] · Lab 1 (hand calculations)
- [[Lab 2 – design a resistor-loaded CS amplifier with V]] · Lab 2 (hand calculations)
- [[Lab 3 – CS versus cascode gain, bandwidth and GBW]] · Lab 3 (hand calculations)
- [[Lab 4 – PMOS source follower]] · Lab 4 (hand calculations)
- [[Lab 5 – simple versus low-compliance cascode mirror]] · Lab 5 (hand calculations)
- [[Lab 6 – design a PMOS-input resistive diff amp]] · Lab 6 (hand calculations)
- [[Lab 7 – turn the 5-T OTA specs into numbers]] · Lab 7 (hand calculations)
- [[Lab 8 – behavioural op amp in a capacitive non-inverting amplifier]] · Lab 8 (hand calculations)
- [[Chat – what feedback does to a 5-T OTA buffer]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[Chat – input range of a 5-T OTA buffer on a 1 V supply]] · Unity-gain buffer lecture (tutoring chat, Razavi Ex 9.4)
- [[2024 Quiz 1 Q1 – five-transistor OTA from its sizes]] · Quiz 1 2024-25 Q1 (9 marks)
- [[2024 Quiz 1 Q2 – the same OTA sized for 10 V µs into 2 pF]] · Quiz 1 2024-25 Q2 (6 marks)

## Animated lessons

- [[Analog Lab Revision Lec 1-10 (animated).html]]

## Flashcards

[[Flashcards – Lecture formulas]] · [[Flashcards – U0]] · [[Flashcards – U1]] · [[Flashcards – U2]] · [[Flashcards – U3]] · [[Flashcards – U4]] · [[Flashcards – U5]] · [[Flashcards – U6]] · [[Flashcards – U7]] · [[Flashcards – U8]] · [[Flashcards – U9]] · [[Flashcards – U10]] · [[Flashcards – U11]] · [[Flashcards – U12]] · [[Flashcards – L1]]

