# Learning RF circuit design from Razavi's book

## Human

you need to teach me the lecture notes i have attached in the image from this book i had studied this before but i forgot teach me the topic referring to the razavis book and his teaching methods, make me memorise all the formulas and make sure its intuitive and easy to understand and memorise and follow the lecture notes in the image, dont assume ik anything bout this topic also use figures and diagrams wherever required

[attachment: 1789548855350_image.png]

[attachment: Design-of-Analog-CMOS-Integrated-Circuits.pdf]

## Assistant

_[Claude used view]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used visualize:read_me]_

I pulled up the exact sections of Razavi your notes come from — Chapter 8 §8.1.1 (gain desensitization, Eqs. 8.5–8.6) and Chapter 9 §9.1.1, Example 9.1 with Figs. 9.2 and 9.3. Your handwritten page is that example, worked out the long way. Let me teach it from zero the way Razavi builds it.

## The design problem

> Design an amplifier with a voltage gain of 10, and the gain must be accurate to better than 1%.

Two specs, and the second one is the hard one. Notice what "gain error" means: not noise, not distortion. It means the number 10 printed on the datasheet has to actually be 10 when the chip comes back from the fab, on a hot day, on any wafer. Hold that thought — everything below is a fight for that second spec.

## Attempt 1: just build an amplifier (Razavi Fig. 9.3)

The simplest voltage amplifier in CMOS is the common-source stage: one NMOS, one drain resistor.

_[Claude used visualize:show_widget]_

Its small-signal gain is the first formula in your notes:

```
A_v = − g_m R_D
```

Where that comes from, in one line: the input wiggles the gate, so the drain current wiggles by `i_d = g_m·v_gs`; that current has nowhere to go but `R_D`, so `v_out = −i_d·R_D = −g_m R_D·v_in`. The minus sign is just "more current means the drain gets pulled *down*."

Now unpack `g_m`:

```
g_m = μ_n C_ox (W/L) V_ov = √( 2 μ_n C_ox (W/L) I_D )
```

Look at what the gain of 10 is made of: `μ_n` (electron mobility), `C_ox` (= ε_ox/t_ox, set by oxide thickness), W/L (set by lithography), and `R_D` (set by sheet resistance). Every one of those is a *physical* quantity that drifts:

- `μ_n` falls as temperature rises — your gain changes between a cold boot and an hour of operation.
- `t_ox`, and therefore `C_ox`, varies wafer to wafer and even across one wafer.
- `R_D` sheet resistance commonly spreads ±20–30% and has its own temperature coefficient.

Razavi's verdict on this circuit is blunt: you can get a *nominal* gain of 10 easily, but process and temperature variation typically leave you with an error above 20%. You asked for 1%. You missed by a factor of twenty.

Here is the lesson to actually memorise, because it is the reason op-amps exist:

> An absolute quantity (`g_m`, `R_D`, `C_ox`) can never be trusted. A **ratio** of two like components made in the same process step (R₁/R₂, C₁/C₂) can be trusted to a fraction of a percent, because whatever shifts one shifts the other identically.

So the design goal becomes: get the gain to depend on a *ratio*, not on device physics.

## Attempt 2: feedback (Razavi §8.1)

Harold Black's 1927 idea, and the whole of Chapter 8. Take an amplifier with huge, sloppy gain, measure a fraction of its own output, subtract that from the input, and feed the difference in.

_[Claude used visualize:show_widget]_

Do not memorise the closed-loop formula. Memorise these two sentences and re-derive it every time — it takes ten seconds:

1. The amplifier sees the difference: `error = Vin − βVout`
2. The amplifier multiplies what it sees: `Vout = A · error`

```
Vout = A (Vin − β·Vout)
Vout (1 + βA) = A·Vin
```
```
    Vout        A
    ──── =  ────────         ← Razavi Eq. (8.5)
    Vin     1 + βA
```

Four names you must be able to say without hesitating, because exam questions hinge on confusing them:

| Symbol | Name | What it is here |
|---|---|---|
| `A` | open-loop gain (forward gain) | the raw op-amp gain, huge and untrustworthy |
| `β` | feedback factor | fraction of the output sent back, set by resistors |
| `βA` | **loop gain** | what one trip around the loop multiplies by |
| `1 + βA` | amount of feedback | the "desensitivity factor" |

Razavi puts a footnote on this specifically: loop gain `βA` and open-loop gain `A` must never be confused with each other.

## Where β comes from: the resistive divider

Now the actual circuit from your notes, Razavi's Fig. 9.2.

_[Claude used visualize:show_widget]_

Let me redraw just the feedback network on its own — the third sketch on your page — since that's where β actually comes from.

_[Claude used visualize:show_widget]_

`R1` and `R2` sit in series across `Vout`, so the tap is a plain voltage divider:

```
Vf = Vout · R2/(R1 + R2)
```
```
     Vf        R2
β =  ──── = ───────
    Vout    R1 + R2
```

That is the whole of the `Vf/Vout = β` line in your notes. And now the payoff — flip it:

```
 1     R1 + R2         R1
─── = ───────── = 1 + ────
 β       R2            R2
```

The ideal closed-loop gain is `1/β`. Notice what it's made of: **nothing but a ratio of two resistors.** No `μ_n`, no `C_ox`, no `g_m`. That is the whole trick. Set `R1/R2 = 9` and you get exactly 10, and the two resistors, drawn side by side on the same die from the same material, drift together.

Two ways to see why `1/β` is the answer, and you should know both:

**Algebraically.** In `A/(1+βA)`, let `A → ∞`. Divide top and bottom by `A`: `1/(1/A + β) → 1/β`.

**Physically (the better one).** The loop's job is to make the error tiny, which means driving `Vf` until it equals `Vin`. The divider attenuates by `β` on the way back. So if `Vf` has to equal `Vin`, then `Vout` must be `Vin/β`. The amplifier is forced to output exactly whatever value makes the divider spit `Vin` back out. This is also why Razavi calls the amplifier's input a virtual ground — the signal there is squeezed to almost nothing.

## The gain error

`1/β` is what you want. `A/(1+βA)` is what you get. The gap between them is the gain error, defined in your notes as a fractional error:

```
      A_ideal − A_actual
ε =  ───────────────────
          A_ideal
```

Substitute and grind through it — this is exactly the cancellation on the right-hand side of your page:

```
      (1/β) − A/(1+βA)                 βA
ε =  ───────────────── =  1  −  ───────────
           (1/β)                  1 + βA

     (1 + βA) − βA
  =  ─────────────
        1 + βA
```

And out drops the single most important formula in this entire lecture:

```
        1              1
ε = ────────  ≈  ──────  for βA ≫ 1
     1 + βA          βA
```

Read that in words and never forget it:

> **The gain error is one over the loop gain.**

Everything else on your page is bookkeeping around this sentence. It also explains why both `990` and `1000` appear in your notes — they are the two versions of the same answer:

```
exact:        1/(1 + 0.1A) ≤ 0.01  →  1 + 0.1A ≥ 100  →  A ≥ 990
approximate:  1/(0.1A)     ≤ 0.01  →  0.1A ≥ 100      →  A ≥ 1000
```

The difference is only whether you kept the `1` next to `βA`. It's a 1% difference in a number that already has ±30% process spread on it, so Razavi simply states the design target as `A > 1000`. Use the approximate form for design; use the exact form if an exam asks for the minimum.

## The one line to actually memorise

Combine `ε ≈ 1/(βA)` with `1/β = A_closed`:

```
                A_closed          10
A_min  =  ───────────────  =  ────── = 1000
                   ε           0.01
```

> Required open-loop gain = closed-loop gain ÷ allowed error.

Gain 10 at 1% needs 1000. Gain 10 at 0.1% needs 10,000. Gain 100 at 1% needs 10,000. You can answer any version of this question in three seconds without writing down a single equation. Equivalently, in dB: a 1% error demands a loop gain of 100, which is 40 dB — "one percent costs forty decibels of loop gain."

Here's how brutally that requirement bites as `A` falls short:

_[Claude used chart_display_v0]_

Every 10× of open-loop gain buys exactly one decimal place of accuracy — a straight line on the log plot, because `ε ≈ 1/(βA)` is pure inverse proportionality.

## Why this actually works: desensitization

Here is the part that makes feedback feel like magic rather than algebra. Watch what happens to the closed-loop gain when `A` is wildly wrong:

| Open-loop `A` | `A/(1+0.1A)` | Error from 10 |
|---|---|---|
| 500 (half of spec) | 9.804 | 1.96% |
| 1000 (nominal) | 9.901 | 0.99% |
| 2000 (double spec) | 9.950 | 0.50% |

`A` changed by a factor of 4 — 500 to 2000 — and the closed-loop gain moved by 1.5%. Razavi's Eq. (8.6) states this as an expansion:

```
A_closed ≈ (1/β)(1 − 1/βA)
```

and the sensitivity relation is worth memorising on its own:

```
ΔA_closed / A_closed  =  ε · (ΔA / A)
```

> A fractional error in `A` gets divided by the loop gain before it reaches the output.

With `βA = 100`, a 100% drift in the transistor's `g_m` shows up as a 1% drift in your amplifier. That is the same 100× you gave away when you turned a gain of 1000 into a gain of 10. Nothing is free — you spent a factor of `1+βA` of gain and bought a factor of `1+βA` of accuracy. Razavi states the trade-off plainly: start with a high-gain amplifier and apply feedback to obtain a low but far less sensitive closed-loop gain.

The mechanism, in one sentence: if `A` drifts upward, `Vout` starts to rise, the divider sends back more, the error voltage at the input shrinks, and the amplifier is starved back down. The loop is self-correcting, and how hard it corrects *is* the loop gain.

## Why this circuit needs an op-amp

Look back at the block diagram: it needs a subtractor. A single common-source stage has one input — it cannot subtract anything. A differential pair has two, and it amplifies `V⁺ − V⁻` — it *is* the subtractor. That is why Razavi's working definition of an op-amp is a high-gain differential amplifier, with the gain "high" meaning whatever the application needs, typically anywhere from 10¹ to 10⁵. You don't chase infinite gain. You compute the gain your error spec demands — 1000, here — and then spend everything else on speed, swing, and power.

## Formula sheet

```
1.  A_v = −g_m R_D                    open loop, inaccurate (>20% error)
2.  g_m = μ_n C_ox (W/L) V_ov = √(2 μ_n C_ox (W/L) I_D)
3.  Vout/Vin = A / (1 + βA)           closed-loop gain
4.  β = R2/(R1 + R2)                  feedback factor
5.  1/β = 1 + R1/R2 = A_ideal         ideal closed-loop gain
6.  ε = (A_ideal − A_actual)/A_ideal = 1/(1 + βA) ≈ 1/(βA)
7.  A_min = A_closed / ε              ← the design equation
8.  βA = loop gain;  βA ≥ 1/ε
```

Four hooks to make them stick:

- **"Gain error is one over loop gain."** Formula 6, which generates 7 and 8.
- **"Absolutes lie, ratios don't."** Why `1/β = 1 + R1/R2` is the goal and `g_m R_D` is not.
- **"β is what comes back; 1/β is what you get."** A divider that returns 1/10 forces a gain of 10.
- **"Spend gain, buy accuracy, at 1:1."** `1+βA` of gain sacrificed = `1+βA` of desensitization gained.

Try these — they're the same question in the disguises an exam will use:

_[Claude used quiz_display_v0]_

The gain spec is only the first of Razavi's performance parameters — §9.1.1 continues straight into small-signal bandwidth, where the same story repeats: `A` falls off with frequency, so `βA` falls, so `ε` grows, and the gain error you carefully designed for at DC quietly degrades as the signal gets faster. Say the word and I'll take you through that one next, along with slew rate, output swing and the others in the same section.

## Human

this is my next lecture teach me all the prerequisite topics required in depth and then the whole lecture in depth dont skip anything teach me properly and refer to the book for the methods for teaching it use the best practices for teaching electronics to me draw as many diagrams as required double check the diagrams and all the explanations, draw all the diagrams in the lecture notes and make the explanations intuitive and cover everything

[attachment: 1789550703974_image.png]

[attachment: 1789550721145_image.png]

[attachment: 1789550743515_image.png]

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

This lecture has a lot of machinery hiding behind it. Your notes say `A_v = g_m1,2(r_O1,2 ‖ r_O3,4)` in one line, but that line assumes you already own five separate ideas: saturation, `g_m`, `r_O`, the current-source load, and the half-circuit. So I'm going to build all of it from the transistor up, then do the lecture properly. Take your time with Part A — if that part is solid, Part C writes itself.

---

# PART A — Prerequisites

## A1. The MOSFET as a voltage-controlled current source

Forget everything about switches. For analog design there is exactly one thing a MOSFET does:

> You put a voltage between gate and source. It pushes a current from drain to source. And — crucially — that current barely cares what the drain voltage is.

That last clause is the whole reason amplifiers work, and it is only true in one region of operation.

**Cutoff.** `V_GS < V_th`: no channel exists, `I_D = 0`. Useless for amplification.

**Triode (linear).** A channel exists all the way from source to drain. The device behaves like a voltage-controlled resistor — the drain current depends strongly on `V_DS`. Useless for amplification, because the "current source" is leaning on its own output voltage.

**Saturation (active).** This is where every analog transistor lives.

Here is the physical picture. Define the **overdrive voltage**, the single most important quantity in this entire course:

```
V_ov  ≡  V_GS − V_th          (also written V_OD, or V_dsat)
```

The channel is induced wherever the local gate-to-channel voltage exceeds `V_th`. At the source end, that's `V_GS − V_th = V_ov`, so the channel is thick there. At the drain end it's `V_GD − V_th = V_GS − V_DS − V_th = V_ov − V_DS`. As you raise `V_DS`, the drain end of the channel gets thinner. When `V_DS` reaches `V_ov` exactly, the channel thickness at the drain hits zero — the channel is **pinched off**. Push `V_DS` higher and the pinch-off point just backs away slightly from the drain; the extra voltage drops across that depleted gap, and the current stops growing.

That gives you the saturation condition, the two lines written at the top-left of your notes:

```
V_DS  ≥  V_GS − V_th  =  V_ov         equivalently     V_D  ≥  V_G − V_th
```

and the square-law current:

```
I_D = ½ μ_n C_ox (W/L) V_ov² (1 + λ V_DS)
```

_[Claude used visualize:show_widget]_

Three things to burn in from that picture:

- The curves flatten *after* `V_DS = V_ov`. The knee of every curve sits at `V_DS = V_ov`. A transistor with a 0.2 V overdrive needs only 0.2 V of drain-source voltage to work; one with 0.6 V overdrive eats 0.6 V. **Overdrive is rent paid in volts.** Remember that — it is the entire output-swing discussion later.
- Bigger `V_ov` gives bigger `I_D`, but quadratically.
- The "flat" region isn't flat. It has a small upward slope. That slope is `λ`, channel-length modulation, and it is the thing that limits how much gain you can get.

**PMOS convention.** Everything is mirrored. A PMOS conducts when the source (tied up at `V_DD`) is more positive than the gate by more than a threshold, and saturates when `|V_DS| ≥ |V_GS| − |V_th| = |V_ov|`. This is exactly why every PMOS quantity in your notes wears absolute-value bars: `|V_ov3|`, `|V_GS3|`, `|V_ov4|`. The bars are not decoration — they are how you remember the device sits upside-down.

## A2. Small-signal parameters: g_m and r_O

An amplifier processes *small changes* riding on a DC bias. So we linearize: sit at a bias point and ask "if the input wiggles by `v_gs`, how much does the drain current wiggle?"

**Transconductance** is that slope, `g_m = ∂I_D/∂V_GS`. Differentiate the square law and you get three equivalent faces of the same number:

```
g_m = μ_n C_ox (W/L) V_ov  =  √( 2 μ_n C_ox (W/L) I_D )  =  2 I_D / V_ov
```

Learn all three, because each answers a different design question:

| Form | Use it when |
|---|---|
| `μ_n C_ox (W/L) V_ov` | you're sizing the device |
| `√(2 μ_n C_ox (W/L) I_D)` | you're trading width against current |
| `2 I_D / V_ov` | **headroom questions** — the one you'll use constantly |

The third form is the designer's form. Read it as: *transconductance is current divided by overdrive.* Want more `g_m` at fixed current? Lower the overdrive. But lower overdrive means a fatter, slower device — and, as you'll see, lower overdrive on a *load* device buys you output swing while costing you noise.

**Output resistance.** Because the curves in saturation aren't perfectly flat, the drain does have a finite say in the current. Model that slope as a resistor from drain to source:

```
r_O = ∂V_DS/∂I_D ≈ 1/(λ I_D)
```

`λ` shrinks with longer channels, so a long device has high `r_O`. Note the tension immediately: more current gives more `g_m` but less `r_O`.

_[Claude used visualize:show_widget]_

The gate draws no current — it's a capacitor plate. So the model is just: a current source whose value is `g_m·v_gs`, with `r_O` sitting across it.

**Intrinsic gain.** Drive the gate, let the drain current flow into the device's own `r_O`, and you get the largest voltage gain a single transistor can ever produce:

```
g_m · r_O  =  (2 I_D / V_ov) · (1 / λ I_D)  =  2 / (λ V_ov)
```

Notice the bias current cancels. You cannot buy gain with current. You buy it with a long channel (small `λ`) and a small overdrive — both of which cost you speed. This number is roughly 10–20 in modern nanometer CMOS, and Razavi says flatly that the gain of the one-stage op amps we're about to study "hardly exceeds 10 in nanometer technologies."

## A3. Why the load must be a current source, not a resistor

Take the common-source stage from last lecture: `A_v = −g_m R_D`. To get gain you want `R_D` large. But `R_D` carries the DC bias current, so it drops `I_D·R_D` volts. With `I_D = 100 µA` and `R_D = 100 kΩ` you've dropped 10 V — you don't have 10 V. On a 1 V supply you simply cannot afford a big resistor.

The fix is the central trick of analog CMOS: **replace the resistor with a transistor biased in saturation.** A saturated transistor has a huge small-signal resistance `r_O` but only needs `|V_ov|` of DC voltage across it. It is a resistor for AC and almost a short for DC budgeting.

_[Claude used visualize:show_widget]_

Purple is NMOS, teal is PMOS — I'll keep that convention for every circuit from here on.

`V_b` is a fixed DC voltage, so for small signals M3's gate is grounded, `v_gs3 = 0`, and its controlled source contributes nothing. What's left of M3 is just `r_O3`. The signal current `g_m1·v_in` therefore flows into `r_O1` and `r_O3` in parallel:

```
A_v = − g_m1 ( r_O1 ‖ r_O3 )
```

Two things you must internalise about `‖`:

- **The smaller resistance wins.** `1 MΩ ‖ 20 kΩ ≈ 19.6 kΩ`. If one device is much leakier, it sets the gain alone. So in an op amp you must make *both* the NMOS and the PMOS long — improving only one is wasted effort.
- **Two equal `r_O` give `r_O/2`,** so the achievable gain is about half the intrinsic gain. You never get `g_m r_O`; you get `g_m r_O / 2`.

And the DC cost of that load is just `|V_ov3|`, not `I_D R_D`. That single substitution is what makes 1 V analog design possible.

## A4. The differential pair

Now, why does an op amp have two inputs? Because feedback needs a subtractor (last lecture), and a single-ended stage cannot subtract. But differential signalling brings four more benefits, and you should be able to recite them:

1. **Noise on the supply or substrate appears on both sides equally** — it's common-mode, and the differential output ignores it. (Razavi: this is why fully differential topologies are preferred for supply rejection.)
2. **Double the output swing** for the same supply, since you use the difference of two nodes moving in opposite directions.
3. **Even-order harmonics cancel**, improving linearity.
4. **The bias current is set by a tail source**, so the operating point doesn't wander with the input level.

The structure: two matched transistors, sources tied together, and a **tail current source `I_SS`** that fixes the total current. Whatever `M1` takes, `M2` gives up — `I_D1 + I_D2 = I_SS` always.

_[Claude used visualize:show_widget]_

**Decompose any input into two parts.** Write `V_in1 = V_in,CM + V_in,d/2` and `V_in2 = V_in,CM − V_in,d/2`.

- **Common mode** (`V_in,CM`): both gates move together. Both transistors want more current, but the tail source refuses to supply more. The source node `P` just rises to follow, and the drain currents don't change. The pair *rejects* it.
- **Differential mode** (`V_in,d`): one gate up by `v/2`, the other down by `v/2`. By symmetry, whatever extra current `M1` pulls, `M2` gives back exactly. The total tail current is constant, so node `P` doesn't move at all. It is a **virtual ground** for differential signals.

That virtual ground is what licenses the **half-circuit**: for differential inputs you may snip the circuit down the middle, ground the tail node, and analyse a plain common-source stage driven by `v_in,d/2`. So:

```
v_out1 / (v_in,d/2) = −g_m R_D        ⇒    v_out,d / v_in,d = −g_m R_D
```

The differential gain of the pair equals the gain of one half. That's why your notes can write `A_v = g_m1,2(r_O1,2 ‖ r_O3,4)` — it's a half-circuit result, with `R_D` replaced by the current-source load from A3.

## A5. The current mirror

One more building block, needed for the second circuit in your notes. A **diode-connected** transistor is one with gate tied to drain. That forces `V_DS = V_GS ≥ V_GS − V_th`, so it is always in saturation, and it behaves as a resistor of about `1/g_m`. Force a current through it and it develops whatever `V_GS` that current requires.

Now share that `V_GS` with a second, matched transistor, and the second one carries a copy of the current.

_[Claude used visualize:show_widget]_

Two consequences that matter enormously in a few minutes:

- The diode-connected node sits at `V_DD − |V_GS3|`, which is a **full threshold lower** than the `V_DD − |V_ov3|` of a plain current-source load. A diode connection is expensive in headroom.
- Its impedance is only `1/g_m3`, not `r_O`. So it's a low-impedance node — never a gain node — but it does create an extra pole (the **mirror pole**) that hurts stability in feedback.

## A6. Poles, in one paragraph

Any circuit node with a resistance `R` to ground and a capacitance `C` to ground is a low-pass filter. Its **pole frequency** is

```
ω_p = 1 / (R C)
```

Below `ω_p` the impedance of the node is `R` and the gain is flat. Above `ω_p`, `C` shorts the node out; the impedance falls as `1/(ωC)` and the gain falls with it, at 20 dB per decade. A circuit with only one such node is a **single-pole (one-pole) system**, and that's the assumption written across the top of your notes.

---

# PART B — Op amp performance parameters (Razavi §9.1.1)

Your notes list seven headings. Razavi's framing is important: nobody designs a "general-purpose ideal op amp" any more. Every parameter trades against the others, so the job is to know *the adequate value* for each one in your application, and spend the silicon there.

## 1. Gain

Covered last lecture. The open-loop gain sets the precision of the feedback system: `ε = 1/(1+βA)`, so `A_min = A_closed/ε`. The required value ranges over four orders of magnitude depending on the application, and a high gain is also needed to suppress nonlinearity.

## 2. Bandwidth

Model the op amp as a single-pole amplifier — one dominant node, as in A6:

```
             A0
A(s) = ───────────────
         1 + s/ω0
```

`A0` is the DC gain, `ω0` is the 3-dB bandwidth (the pole). Above `ω0` the gain falls at 20 dB/decade until it reaches unity at `ω_u`, the **unity-gain frequency**.

_[Claude used visualize:show_widget]_

On a log-log plot, a 20 dB/decade slope means gain × frequency is constant. That gives the formula your notes box in:

```
ω_u  =  A0 · ω0  =  GBW        (gain–bandwidth product)
```

> The transistor gives you a fixed amount of "gain × bandwidth." You choose how to spend it — lots of gain over a narrow band, or little gain over a wide band. You cannot have both.

This is the bridge back to last lecture. Close the loop with feedback factor `β`: the closed-loop gain is `1/β`, and the closed-loop bandwidth is the point where the falling open-loop curve meets that level:

```
ω_cl  =  GBW / (1/β)  =  β A0 ω0  =  (1 + βA0) ω0
```

You gave away gain by a factor of `1+βA0` and got bandwidth back by exactly the same factor. Feedback did not create bandwidth; it traded gain for it — the same 1:1 exchange as gain-for-accuracy last time. And there's a subtler point Razavi makes: because `A` falls with frequency, `βA` falls too, so the gain error `ε = 1/(βA)` *grows* with frequency. Your 1% amplifier is only 1% accurate at DC.

**Where bandwidth really comes from: settling time.** Razavi's Example 9.2 puts the three ideas together. For the non-inverting amplifier with a one-pole op amp, the closed loop is also one-pole, with time constant

```
τ = 1 / [ (1 + βA0) ω0 ]  ≈  (1 + R1/R2) / (A0 ω0)      since βA0 ≫ 1
```

A step response settles as `1 − e^(−t/τ)`, so settling to within 1% needs `t = τ·ln 100 ≈ 4.6τ`. For a gain of 10 settling to 1% in 5 ns: `τ ≈ 1.09 ns`, and `A0ω0 ≈ 10/1.09n = 9.21 Grad/s`, i.e. about 1.47 GHz. Memorise the shape of that result:

```
t_settle ≈ 4.6 τ  with  τ ≈ A_closed / GBW
```

so **required GBW = 4.6 × closed-loop gain / settling time.** Bandwidth is dictated jointly by the settling accuracy you need and the closed-loop gain you chose.

## 3. Output voltage swing

Most systems need large swings. Razavi's example: a microphone capturing an orchestra produces instantaneous voltages spanning more than four orders of magnitude, so every downstream stage must handle large signals or else achieve very low noise.

Two structural facts:

- The need for swing is why **fully differential op amps** are popular — complementary outputs roughly double the available swing.
- Swing trades against device size and bias current, and therefore against speed. Razavi calls achieving large swings "the principal challenge in today's op amp design," and devotes a whole section (§9.6) to verifying it in simulation: sweep the input amplitude up, watch `|V_out/V_in|`, and call the maximum allowable swing the point where the gain has dropped by, say, 10%.

We will compute swings precisely in Part C. The mechanism is always the same: **every transistor between the two supply rails demands its `V_ov` of headroom, and whatever is left over is yours to swing in.**

## 4. Linearity

Open-loop op amps are substantially nonlinear — the differential pair's drain current is not a linear function of its input voltage (it's a square-root-ish relationship, and it hard-limits once all the tail current has tipped to one side). Two remedies:

- **Fully differential implementations** cancel even-order harmonics by symmetry.
- **Sufficient open-loop gain**, so the feedback loop can linearize the transfer characteristic — same `1/(1+βA)` suppression as gain error, applied to distortion.

Razavi adds a note worth carrying into design work: in many feedback circuits it is the *linearity* requirement, not the gain-error requirement, that ends up dictating the open-loop gain. So the `A ≥ 1000` from last lecture is often a floor, not the answer.

## 5. Noise (and the missing 6: supply rejection)

Input noise sets the **smallest** signal you can process — the floor. Output swing sets the ceiling. Their ratio is the dynamic range, which is why these two parameters are always discussed together.

In a typical op amp several devices contribute, demanding large dimensions or large bias currents. Razavi's structural observation: **in every op amp topology, at least four devices contribute input noise** — the two input transistors and the two load transistors.

And the trade-off you must be able to state:

> For a fixed bias current, lowering the overdrive of the load devices buys output swing — but a lower overdrive means a higher `g_m` for those loads, and a higher `g_m` means more drain noise current.

Swing and noise pull in opposite directions through the same knob, `V_ov` of the loads. (Item 6 in Razavi's list, which your notes skip, is **supply rejection**: op amps often sit next to noisy digital supplies, and fully differential topologies are preferred because supply noise arrives as common mode.)

## 7. Offset

Offset is noise's DC twin. `M1` and `M2` are never perfectly matched — thresholds, dimensions, and the load pair all differ slightly — so the output is nonzero even with the inputs shorted. Refer that error back to the input and you get the **input-referred offset** `V_OS`, which limits the minimum detectable signal just as noise does.

The design levers:

- Mismatch falls as device area grows (roughly `σ ∝ 1/√(WL)`), so low-offset input pairs are physically large — and slow.
- The load pair's mismatch enters scaled by `g_m,load/g_m,input`. So you want a **large `g_m` on the inputs (small `V_ov1`) and a small `g_m` on the loads (large `|V_ov3|`)**. Note that this fights the swing requirement, which wanted small `|V_ov3|`. Everything in this chapter is a tug-of-war over overdrive voltages.

---

# PART C — One-stage op amps (Razavi §9.2.1)

Razavi's opening line for this section is worth quoting in spirit: *all* the differential amplifiers from Chapters 4 and 5 already are op amps. Your notes draw the two canonical ones — his Fig. 9.6(b) and 9.6(a).

## C1. Circuit (a): fully differential, current-source loads

_[Claude used visualize:show_widget]_

**Gain.** Apply the half-circuit: ground the tail, drive one gate with `v_in,d/2`. The output node sees `r_O1` (looking down into M1) in parallel with `r_O3` (looking up into M3, whose gate is a small-signal ground because `V_b` is fixed):

```
A_v = g_m1,2 ( r_O1,2 ‖ r_O3,4 )
```

That is the first formula in your notes, now fully earned.

**Bandwidth.** The dominant node is the output, with resistance `r_O2 ‖ r_O4` and capacitance `C_L`:

```
ω_p1 = 1 / [ (r_O2 ‖ r_O4) C_L ]
```

Now multiply the two, as the GBW definition demands, and watch something beautiful happen:

```
GBW = A0 · ω_p1 = g_m (r_O ‖ r_O) × 1/[(r_O ‖ r_O) C_L]  =  g_m / C_L
```

> **The output resistance cancels.** Gain depends on `r_O`; speed does not. The unity-gain frequency of a one-stage op amp is just `g_m/C_L`.

This is one of the most useful results in the chapter. It tells you that making devices longer to raise gain does not slow down the unity-gain frequency — it lowers `ω_p1` and raises `A0` by the same factor. If you want more speed, you need more `g_m` (more current, or wider devices) or a smaller load capacitor. Nothing else.

### Headroom analysis — the method

This is where students lose marks, so do it the same way every time:

> **Stand at a supply rail. Walk toward the signal node. Subtract what each device demands on the way. Whatever is left is your range.** Then ask, separately, *which transistor leaves saturation first* at each extreme.

**Input common-mode range (CMIR), lower limit.** The source of `M1` sits one `V_GS1` below its gate, at `V_P = V_in,CM − V_GS1`. The tail current source needs some minimum voltage across it to stay in saturation — call it `V_ISS`. (Note carefully: `V_ISS` is *the headroom the tail source requires*, not a negative supply. Razavi defines it as "the voltage required across the current source.") So:

```
V_in,CM − V_GS1 ≥ V_ISS     ⟹     V_in,CM,min = V_ISS + V_GS1
```

Go below this and the tail source falls into triode; `I_SS` collapses and the gain with it.

**CMIR, upper limit.** Now the limiting device is `M1` itself, which must stay saturated: `V_D1 ≥ V_G1 − V_th1`. Its drain *is* the output node, which can rise as high as `V_DD − |V_ov3|`. So:

```
V_in,CM ≤ V_D1 + V_th1     ⟹     V_in,CM,max = V_DD − |V_ov3| + V_th1
```

Note the `+V_th1` — this is why your notes have a tick mark next to it. If `V_th1 > |V_ov3|`, this limit is *above* `V_DD`, meaning the top of the CM range isn't set by the circuit at all, just by the supply. Current-source loads are generous with input range.

**Output limits.**

```
Vout1,max = V_DD − |V_ov3|     ← M3 needs |V_ov3| to stay saturated
Vout2,max = V_DD − |V_ov4|
Vout1,min = V_in,CM − V_th1  ≥  V_ISS + V_ov1     ← M1 needs to stay saturated
Vout2,min = V_in,CM − V_th1  ≥  V_ISS + V_ov2
```

That inequality on the last two lines is exactly the "minimum possible value" arrow in your notes. In general the output floor tracks the input common-mode level; it reaches its lowest possible value `V_ISS + V_ov1` only when you choose `V_in,CM` at its own minimum, `V_ISS + V_GS1`. (`V_GS1 = V_th1 + V_ov1`, so subtracting `V_th1` leaves `V_ISS + V_ov1` — check that algebra yourself, it's the step people skip.) Razavi makes the identical point for telescopic cascodes: the full swing is only available if the input CM level is chosen low enough.

_[Claude used visualize:show_widget]_

### Why differential doubles the swing

Each individual output can only move inside the green band. But the *useful* signal is the difference:

```
V_out = V_out1 − V_out2
```

The two outputs move in opposite directions. When `V_out1` is at its ceiling, `V_out2` is at its floor, and vice versa:

```
V_out,d,max = Vout1,max − Vout2,min = (V_DD − |V_ov3|) − (V_ISS + V_ov2)
V_out,d,min = Vout1,min − Vout2,max = (V_ISS + V_ov1) − (V_DD − |V_ov4|)
```

The second is just the negative of the first (matched devices), so the total peak-to-peak differential swing is the difference of those two:

```
Output swing = 2 ( V_DD − |V_ov3| − V_ov1 − V_ISS )
```

There is the factor of 2 from your notes, and there is Razavi's "roughly doubling the available swing," derived rather than asserted. You also see precisely what you're paying for: **every overdrive in the stack is subtracted from your swing, and the tail source's headroom is subtracted too.** Three devices, three deductions.

**Numbers, so it's concrete.** Take `V_DD = 1.0 V`, `V_th = 0.3 V` for all devices, every overdrive 0.1 V, and `V_ISS = 0.1 V`:

```
Vout1 range:   0.2 V  to  0.9 V     → 0.7 V single-ended
Differential:  2 × (1.0 − 0.1 − 0.1 − 0.1) = 1.4 V peak-to-peak
V_in,CM,min = 0.1 + (0.3+0.1) = 0.5 V
V_in,CM,max = 1.0 − 0.1 + 0.3 = 1.2 V → clipped by the supply at 1.0 V
```

**The catch with circuit (a).** Both `M3`/`M4` and the tail source are current sources, and two current sources in series don't define the voltage between them. The output *common-mode* level is essentially undefined and drifts to a rail with tiny mismatches. Real fully differential op amps therefore need **common-mode feedback (CMFB)** — Razavi §9.7 — a second loop that senses the output CM and adjusts `V_b`. Worth knowing now, because it's the price of the extra swing.

## C2. Circuit (b): the five-transistor OTA

Now replace the two independent load current sources with a mirror.

_[Claude used visualize:show_widget]_

**How the mirror makes the gain.** Follow the signal. `M1` produces a small-signal drain current `g_m·v_in,d/2`, which flows into diode-connected `M3`. The mirror copies it into `M4` and pushes it into the output node. Meanwhile `M2` pulls `g_m·v_in,d/2` out of the same node, in the opposite phase. The two halves **add**:

```
i_out = g_m1,2 · v_in,d        (not g_m·v_in,d/2)
A_v = g_m1,2 ( r_O2 ‖ r_O4 )
```

So the mirror gives back the factor of 2 you lost by taking a single-ended output. Circuit (b) has the same gain magnitude as circuit (a) — it just has half the swing. That's the honest summary of the whole comparison.

**Bandwidth.** The output node again has `r_O2‖r_O4` and `C_L`:

```
ω_p1 = 1 / [ (r_O2 ‖ r_O4) C_L ]        GBW = g_m1,2 / C_L
```

identical to circuit (a). But there is now a *second* pole at node `X`, the **mirror pole**, at roughly `g_m3/C_X`. It's a high-frequency pole because node `X` is low-impedance (`1/g_m3`), but Razavi flags it as a critical difference: the single-ended topology has a mirror pole, the differential one does not, and that matters for stability when you close a loop around it (Chapter 10).

**Headroom — and the one line where the two circuits genuinely differ.** Node `X` is diode-connected, so it is *pinned* at `V_DD − |V_GS3|`. That node is `M1`'s drain. Therefore:

```
V_in,CM,max = V_DD − |V_GS3| + V_th1        (circuit b)
V_in,CM,max = V_DD − |V_ov3| + V_th1        (circuit a)
```

Since `|V_GS3| = |V_th3| + |V_ov3|`, **circuit (b) loses an entire threshold voltage of input common-mode range.** That is exactly why your notes write `|V_GS3|` on the right-hand page and `|V_ov3|` on the left. It's not a typo, it's the whole point of the comparison. The rest:

```
V_in,CM,min = V_ISS + V_GS1                  (same as (a) — the tail hasn't changed)
V_out,max   = V_DD − |V_ov4|                 (M4 is a plain current source, not diode-connected)
V_out,min   = V_ISS + V_ov2                  (M2 saturated, with V_in,CM at its minimum)
Output swing = V_DD − |V_ov4| − V_ov2 − V_ISS
```

Note the asymmetry inside circuit (b): `M3` is pinned at `V_GS`, but `M4`'s drain is free to swing, so the *output* only pays `|V_ov4|`. The `V_GS` penalty lands on the input range, not on the swing.

_[Claude used visualize:show_widget]_

Correction on that last figure — the boundary marked on bar (a) is its **minimum**, not its maximum. Here it is again, labelled properly:

_[Claude used visualize:show_widget]_

## C3. Side by side

| | (a) Fully differential, `V_b` loads | (b) Five-transistor OTA |
|---|---|---|
| Gain | `g_m1,2 (r_O1,2 ‖ r_O3,4)` | `g_m1,2 (r_O2 ‖ r_O4)` — same |
| Output | differential, two nodes | single-ended, one node |
| Swing | `2(V_DD − \|V_ov3\| − V_ov1 − V_ISS)` | `V_DD − \|V_ov4\| − V_ov2 − V_ISS` — half |
| CM input max | `V_DD − \|V_ov3\| + V_th1` | `V_DD − \|V_GS3\| + V_th1` — a threshold worse |
| Dominant pole | `1/[(r_O‖r_O)C_L]` | same |
| Extra pole | none | mirror pole at node X ≈ `g_m3/C_X` |
| Output CM level | undefined → needs CMFB | set by the mirror → no CMFB |
| Supply / even-order distortion | rejected by symmetry | not rejected |

The trade is clean: **(a) buys you double swing, better supply rejection, better linearity and no mirror pole, at the cost of a whole extra common-mode feedback loop. (b) is simple and self-biasing, but gives up half the swing and a threshold of input range.**

---

# Formula sheet

```
DEVICE
V_ov = V_GS − V_th                     saturation:  V_DS ≥ V_ov   (V_D ≥ V_G − V_th)
I_D  = ½ μC_ox (W/L) V_ov²(1+λV_DS)
g_m  = μC_ox(W/L)V_ov = √(2μC_ox(W/L)I_D) = 2I_D/V_ov
r_O  = 1/(λ I_D)                       intrinsic gain  g_m r_O = 2/(λV_ov)

STAGE
A_v  = −g_m (r_O,N ‖ r_O,P)            CS with current-source load / diff half-circuit
ω_p1 = 1/[(r_O2‖r_O4) C_L]
GBW  = ω_u = A0 ω0 = g_m/C_L           output resistance cancels
ω_cl = β·GBW = (1+βA0) ω0
τ ≈ A_closed/GBW,  t_1% ≈ 4.6 τ

HEADROOM  (a) differential            (b) mirror
V_in,CM,min = V_ISS + V_GS1            V_ISS + V_GS1
V_in,CM,max = V_DD − |V_ov3| + V_th1   V_DD − |V_GS3| + V_th1
V_out,max   = V_DD − |V_ov3,4|         V_DD − |V_ov4|
V_out,min   = V_ISS + V_ov1,2          V_ISS + V_ov2
Swing = 2(V_DD−|V_ov3|−V_ov1−V_ISS)    V_DD−|V_ov4|−V_ov2−V_ISS
```

Four hooks:

- **"Overdrive is rent."** Every device between the rails charges you its `V_ov`; the swing is the change left in your pocket.
- **"Diode connections cost a threshold."** `|V_GS|` instead of `|V_ov|` — that single substitution explains every difference between circuit (a) and (b)'s input range.
- **"Gain needs `r_O`, speed doesn't."** `A0 = g_m r_O/…`, but `GBW = g_m/C_L`.
- **"Swing is the ceiling, noise and offset are the floor."** And they fight each other through the same knob: the loads' overdrive.

_[Claude used quiz_display_v0]_

Where this goes next in Razavi, in case you want to keep the thread: §9.2 continues straight into **cascode (telescopic) op amps**, which stack `M5`–`M8` on top to get `g_m[(g_m r_O²)‖(g_m r_O²)]` — gain in the thousands instead of ten — and pay for it with two more overdrives of swing and a very tightly constrained input CM level. Then **folded cascode** to recover the input range, **two-stage** op amps for maximum swing, **common-mode feedback** (the loop circuit (a) needs), and **slew rate**, which is the large-signal speed limit that `g_m/C_L` completely fails to predict. Say which one and I'll build it the same way.

## Human

this is my next lecture teach me all the prerequisite topics required in depth and then the whole lecture in depth dont skip anything teach me properly and refer to the book for the methods for teaching it use the best practices for teaching electronics to me draw as many diagrams as required double check the diagrams and all the explanations, draw all the diagrams in the lecture notes and make the explanations intuitive and cover everything, refer to razavi for the teaching methodologies also make diagrams better and nicer make me understand all of this properly

[attachment: 1789551461446_image.png]

[attachment: 1789551479079_image.png]

[attachment: 1789551505149_image.png]

[attachment: 1789551520071_image.png]

[attachment: 1789551533140_image.png]

## Assistant

Your notes here are Razavi's Example 9.2 worked out in full — and it's the most important worked example in Chapter 9, because it's the one that finally tells you *how much current to burn*. But it's also the first one that needs real Laplace machinery. So Part A builds the s-domain toolkit from scratch, Part B does the example line by line, and Part C pushes into what Razavi says immediately after.

---

# PART A — Prerequisites

## A1. Why we leave the time domain at all

In the time domain, a capacitor forces you into a differential equation. A single RC node gives `RC·dv/dt + v = v_in`, and once you cascade an amplifier around it you're solving ODEs with initial conditions. That's unmanageable for circuit design.

The Laplace transform converts that pain into algebra:

```
F(s) = ∫₀^∞ f(t) e^(−st) dt
```

The one property that makes it worth learning: **differentiation becomes multiplication by `s`.** So `dv/dt → sV(s)`, and the RC equation becomes `(1 + sRC)V = V_in`, which you solve by dividing. Every capacitor becomes an impedance `1/(sC)`, every inductor `sL`, and circuit analysis becomes the same resistive algebra you already know.

`s` is a complex frequency, `s = σ + jω`. Two special substitutions cover almost everything:

- Set `s = jω` and you get the frequency response — that's where Bode plots come from.
- Look at where the denominator vanishes — the **poles** — and you get the time behaviour, because a pole at `s = p` contributes a term `e^(pt)` to the response.

That second sentence is the bridge this whole lecture walks across. **Pole location is time-domain behaviour in disguise.**

## A2. The three transform pairs you need

That's genuinely all that's required for this lecture:

```
u(t)  (unit step)        ↔   1/s
e^(−at) u(t)             ↔   1/(s + a)
linearity: αf + βg       ↔   αF + βG
```

A step scaled by `a`, i.e. `V_in = a·u(t)`, transforms to `a/s`. That's the line on the first page of your notes.

**Why a step?** Because this is exactly what an op amp sees in a real sampled system. In a switched-capacitor amplifier or an ADC (Razavi's Chapter 13), a clock closes a switch and the input jumps abruptly to a new value. The amplifier then has one clock phase — a few nanoseconds — to get its output close enough to the correct answer before the next sample is taken. "Close enough" is a precision spec: within 1% of the final value. Hence the problem statement.

## A3. Anatomy of a first-order system

Everything in this lecture is this one object:

```
            K
H(s) = ─────────
         1 + sτ
```

Three parameters that are really one:

| Face | Value | Meaning |
|---|---|---|
| DC gain | `K` (set `s = 0`) | where the output ends up |
| Pole | `s = −1/τ` | where the denominator vanishes |
| 3-dB bandwidth | `ω = 1/τ` | where `\|H(jω)\|` drops by √2 |
| Time constant | `τ` | how fast the exponential decays |

**These are the same number wearing different clothes.** Learn to jump between them without thinking.

_[Claude used visualize:show_widget]_

## A4. Partial fractions — the one manipulation you must be fluent in

You'll get `Vout(s)` as a product of two simple pieces and need it as a *sum*, because the transform table only knows sums. The expansion used in your notes:

```
     1            A        B
────────── =  ───── + ───────
 s(1 + sτ)      s      1 + sτ
```

Multiply both sides by `s(1+sτ)`:

```
1 = A(1 + sτ) + B s
```

This is an identity — true for *every* `s` — so pick convenient values:

- Set `s = 0`: the `B s` term dies. `1 = A` → **A = 1**.
- Set `s = −1/τ`: the `(1+sτ)` term dies. `1 = B(−1/τ)` → **B = −τ**.

(That's the "cover-up" trick: to find the numerator over a factor, kill that factor by setting `s` to its root.) So:

```
    1            1        τ          1        1
────────── =  ───  −  ──────  =  ───  −  ───────
 s(1 + sτ)      s      1 + sτ       s      s + 1/τ
```

The last step divides top and bottom by `τ` to match the table entry `1/(s+a) ↔ e^(−at)`. Now invert term by term:

```
  ⟶   u(t) − e^(−t/τ) u(t)  =  [1 − e^(−t/τ)] u(t)
```

**Take a moment on that result.** Feeding a step into any first-order system always gives `final value × (1 − e^(−t/τ))`. You will use it for the rest of your career; the partial-fraction work above is just the proof.

## A5. What the exponential actually does

Define the **fractional error** remaining at time `t`:

```
ε(t) = [VF − Vout(t)] / VF = e^(−t/τ)
```

Set that equal to your accuracy spec and take logarithms:

```
t = τ · ln(1/ε)
```

That single line is the whole settling-time theory. Memorise the common cases:

| Accuracy | `ln(1/ε)` | Time |
|---|---|---|
| 10% | 2.30 | 2.3 τ |
| 1% | 4.61 | 4.6 τ |
| 0.1% | 6.91 | 6.9 τ |
| 0.01% | 9.21 | 9.2 τ |

Note the pattern: **every extra factor of 10 in accuracy costs exactly `ln 10 = 2.3` more time constants.** Accuracy is cheap in time but the price is relentless and linear.

_[Claude used chart_display_v0]_

Each bar is exactly 2.3 taller than the one before — that's `ln 10`, and it's why a 12-bit converter needs roughly twice the settling time of a 6-bit one.

## A6. Feedback when the gain is frequency-dependent

Nothing changes structurally from lecture 1 — `A` just becomes `A(s)`:

```
Vout        A(s)
──── =  ──────────
Vin     1 + β A(s)
```

And one algebra move that trips people up, so do it slowly. You'll reach a denominator of the form `1 + s/ω0 + βA0` and need it in standard `1 + sτ` form. **Factor out the constant part:**

```
1 + s/ω0 + βA0  =  (1 + βA0) · [ 1 + s / ((1 + βA0) ω0) ]
```

Check by expanding: `(1+βA0)·1 = 1+βA0` ✓, and `(1+βA0) · s/((1+βA0)ω0) = s/ω0` ✓. The factoring works because you divided the `s` term by exactly what you pulled out front.

## A7. Units

`ω` is in rad/s, `f` is in Hz, `ω = 2πf`. Every formula here is in rad/s; convert only at the very last line. Forgetting the `2π` is the single most common way to be wrong by a factor of 6.28.

---

# PART B — The lecture: Razavi Example 9.2

## The problem

Here is the circuit from your notes:

_[Claude used visualize:show_widget]_

**The specification, in Razavi's words:** the op amp is a single-pole voltage amplifier, `V_in` is a small step, the target closed-loop gain is `1 + R1/R2 ≈ 10`, and the output must reach within 1% of its final value in under 5 ns. Find the unity-gain bandwidth the op amp must provide. He also says to assume the low-frequency gain is much greater than unity — I'll come back to why that assumption matters.

Before grinding, here's the shape of the whole derivation. When you see a settling problem in an exam, run these five steps in this order:

_[Claude used visualize:show_widget]_

## Step 1 — The op amp model and β

```
          A0
A(s) = ────────        β = R2/(R1+R2)   ⟹   1/β = 1 + R1/R2 = 10   ⟹   β = 0.1
        1 + s/ω0
```

`A0` is the DC open-loop gain, `ω0` its 3-dB pole. From lecture 2, their product is the unity-gain bandwidth: `ω_u = A0 ω0`.

## Step 2 — Close the loop

Write the loop equation directly, exactly as your notes do (Razavi's Eq. 9.4): the op amp amplifies the difference between the input and the fed-back fraction of the output.

```
[ Vin − βVout ] A(s) = Vout        ⟹        Vout/Vin (s) = A(s) / (1 + βA(s))
```

## Step 3 — Massage into standard form

Substitute and clear the compound fraction. Multiply numerator and denominator by `(1 + s/ω0)`:

```
Vout        A0/(1 + s/ω0)                    A0
──── = ───────────────────────  =  ──────────────────────
Vin     1 + βA0/(1 + s/ω0)           1 + s/ω0 + βA0
```

Now apply the factoring move from A6 — pull `(1 + βA0)` out of the denominator:

```
                        A0
      = ─────────────────────────────────────
         (1 + βA0) [ 1 + s / ((1+βA0) ω0) ]
```

Split it into "DC gain" × "one-pole roll-off" and read off both parameters:

```
Vout          A0/(1 + βA0)              A_dc,closed
──── =  ──────────────────────────  =  ─────────────
Vin      1 + s/((1+βA0) ω0)               1 + sτ
```

```
A_dc,closed = A0/(1 + βA0) ≈ 1/β = 1 + R1/R2 ≈ 10

τ = 1 / [ (1 + βA0) ω0 ]
```

## The key insight hiding in τ

This is the part to actually understand, not memorise mechanically. Simplify `τ` using `βA0 ≫ 1` and then `A0ω0 = ω_u`:

```
        1              1             1          A_closed
τ = ───────────  ≈  ────────  =  ───────  =  ──────────
     (1+βA0)ω0        βA0ω0        β ω_u          ω_u
```

Read those four expressions left to right — they're the same fact told four ways:

1. **`1/[(1+βA0)ω0]`** — the closed-loop pole sits `(1+βA0)` times further out than the open-loop pole. Feedback widened the bandwidth by the amount of feedback, exactly as in lecture 2.
2. **`1/(βω_u)`** — the time constant depends only on `β` and the unity-gain bandwidth. `A0` and `ω0` individually have vanished. Only their *product* survives.
3. **`A_closed/ω_u`** — the plainest statement: **the higher the closed-loop gain you demand, the slower the amplifier settles, in direct proportion.**

That last one is the design formula. A unity-gain buffer (`A_closed = 1`) settles ten times faster than a gain-of-ten stage built from the same op amp. Gain and speed are the same currency.

On the s-plane, feedback has shoved the pole away from the origin:

_[Claude used visualize:show_widget]_

And the same fact in the frequency domain — the closed-loop corner is where the falling open-loop curve crosses the `1/β` level:

_[Claude used visualize:show_widget]_

## Step 4 — Apply the step and go back to time

Input `V_in = a·u(t)`, so `V_in(s) = a/s`. Multiply:

```
                A_dc,closed     a                  ⌈      1      ⌉
Vout(s) = ──────────── · ───  =  a·A_dc,closed ⌊ ────────── ⌋
                 1 + sτ         s                  ⌊  s(1+sτ)   ⌋
```

Expand with the partial fractions from A4 (`A = 1`, `B = −τ`):

```
                       ⌈  1        τ    ⌉            ⌈  1        1     ⌉
Vout(s) = a·A_dc,closed ⌊ ─── − ────── ⌋ = a·A_dc,closed ⌊ ─── − ───────── ⌋
                       ⌊  s     1+sτ   ⌋            ⌊  s     s + 1/τ  ⌋
```

Invert term by term:

```
Vout(t) = a · A_dc,closed [ 1 − e^(−t/τ) ] u(t)
```

with final value `VF = a·A_dc,closed ≈ 10a`. Exactly Razavi's Eq. (9.10).

## Step 5 — Impose the 1% specification

The output must reach `0.99 VF`:

```
0.99 · a·A_dc = a·A_dc [ 1 − e^(−t₁%/τ) ]
    ⟹  e^(−t₁%/τ) = 0.01
    ⟹  t₁%/τ = ln 100 = 4.605
    ⟹  t₁% = 4.605 τ
```

Here is the picture — and note that the input jumps instantly while the output can only crawl toward its target:

_[Claude used visualize:show_widget]_

## The numbers

```
t₁% = 4.605 τ ≤ 5 ns        ⟹   τ ≤ 1.086 ns

τ = 1/(β ω_u)  with  β = 0.1

     4.605              4.605
t = ─────── ≤ 5 ns  ⟹  ω_u ≥ ───────────── = 9.21 × 10⁹ rad/s
      β ω_u                   0.1 × 5×10⁻⁹

f_u = ω_u / 2π = 9.21×10⁹ / 6.283 = 1.47 GHz
```

So the op amp must have a gain–bandwidth product of about **1.47 GHz**. That matches Razavi's answer exactly (he writes `A0ω0 ≈ 9.21 Grad/s`).

## What this number actually means for your silicon

This is where the three lectures finally close the loop. From lecture 2, a one-stage op amp has `ω_u = g_m/C_L`. So:

```
g_m / C_L ≥ 9.21 × 10⁹        ⟹        g_m ≥ 9.21×10⁹ · C_L
```

With a 1 pF load: `g_m ≥ 9.21 mA/V`. And using `g_m = 2I_D/V_ov` with a 0.2 V overdrive:

```
I_D ≥ g_m V_ov / 2 = 9.21m × 0.2 / 2 = 0.92 mA        ⟹   I_SS ≥ 1.84 mA
```

**A settling-time spec written in nanoseconds has just been converted into milliamps of bias current.** That is the entire job of this chapter: turn system specs into transistor bias points. Notice also that halving the load capacitance halves the current — which is why nobody in analog design is casual about load capacitance.

## The generalised formula — memorise this one

Strip the example away and what remains is:

```
                  A_closed
t_settle = ln(1/ε) · ──────────
                     ω_u
```

Three knobs, and every one of them is a straight proportionality:

- Want more accuracy? Costs `ln(1/ε)` — 2.3 more time constants per decade.
- Want more gain? Costs linearly in `A_closed`.
- Want it faster? Buy `ω_u` — with current.

Razavi's own summary of this example is the sentence to write in the margin: *the bandwidth is dictated by both the required settling accuracy and the closed-loop gain.*

## The error budget subtlety

There are now **two** distinct 1% errors in your life, and they are not the same thing:

| Error | Source | Fixed by | From |
|---|---|---|---|
| Static gain error `1/(βA0)` | finite DC gain | raising `A0` (≥ 1000) | lecture 1 |
| Dynamic settling error `e^(−t/τ)` | finite bandwidth | raising `ω_u` (≥ 9.21 Grad/s) | this lecture |

Razavi's instruction to "assume the low-frequency gain is much greater than unity" is what lets us ignore the first one while computing the second. In a real design you cannot: if the total output must be within 1% of ideal, you must **budget** — perhaps 0.5% static and 0.5% dynamic, which costs you `A0 ≥ 2000` *and* `ln(200) = 5.3` time constants instead of 4.6. The two specs are independent: `A0` fixes where the output eventually lands, `ω_u` fixes how fast it gets there.

---

# PART C — What Razavi does next

## C1. Example 9.3: swap the two inputs

A student wires the inverting and non-inverting terminals the wrong way round. Now the feedback subtracts the *input* instead of the output, and the sign in the denominator flips:

```
Vout          A0/(1 − βA0)
──── (s) = ───────────────────────
Vin          1 − s/[(1 − βA0) ω0]
```

The pole is now at `s = +(βA0 − 1)ω0` — in the **right half plane**. A right-half-plane pole means `e^(+t/τ)`, so the step response is

```
Vout(t) ≈ a(1 + R1/R2) [ e^(t/τ) − 1 ] u(t)
```

which grows exponentially until the op amp output slams into a supply rail. Same algebra, one sign different, completely different circuit. This is the cleanest demonstration of why pole *location* — not pole magnitude — is what you actually care about.

## C2. The caveat: this is the small-signal answer

Razavi raises this right before the example, under **Large-Signal Behaviour**, and it matters. Our whole derivation assumed the amplifier stays linear. But consider a 1 V input step: the output cannot change instantaneously, so at `t = 0⁺` the op amp sees the full 1 V across its inputs. With an open-loop gain of 1000 it would "want" to produce 1000 V. It obviously cannot — the differential pair has dumped its entire tail current to one side and can only deliver `I_SS` into `C_L`. The output then ramps at a constant rate:

```
SR = I_SS / C_L        (slew rate)
```

Real settling is therefore two phases: a **slewing** phase at constant slope, then a **linear** phase with the exponential we derived. Total settling time is the sum. So `t = 4.6τ` is a *lower bound*, valid for small steps; large-signal settling needs the slew-rate analysis of §9.9, and in practice, careful simulation.

## C3. And one more: what if there are two poles?

Everything above assumed one pole. If the op amp has a second pole near the unity-gain frequency, the closed-loop system becomes second-order and the step response can **ring** — overshooting the final value and oscillating into the 1% band from both sides. The settling time can then be far worse than `4.6τ` even though the bandwidth looks fine. That's precisely the mirror pole warning from lecture 2, and it's the subject of Chapter 10 (Stability and Frequency Compensation).

---

# Formula sheet

```
LAPLACE
u(t) ↔ 1/s          e^(−at)u(t) ↔ 1/(s+a)         a·u(t) ↔ a/s
1/[s(1+sτ)] = 1/s − 1/(s+1/τ)            ⟶  1 − e^(−t/τ)

FIRST-ORDER SYSTEM  H(s) = K/(1+sτ)
pole at −1/τ    ·    3-dB at ω = 1/τ    ·    step: K(1 − e^(−t/τ))

CLOSED LOOP WITH ONE-POLE OP AMP
Vout/Vin = A_dc,closed / (1 + sτ)
A_dc,closed = A0/(1+βA0) ≈ 1/β = 1 + R1/R2
τ = 1/[(1+βA0)ω0] ≈ 1/(βω_u) = A_closed/ω_u
closed-loop bandwidth = (1+βA0)ω0 = βω_u

SETTLING
ε(t) = e^(−t/τ)          t = τ·ln(1/ε)
t_settle = ln(1/ε) · A_closed / ω_u
1% → 4.605τ    0.1% → 6.908τ    every decade costs 2.303τ

DESIGN CLOSURE
ω_u = g_m/C_L   ⟹   g_m ≥ ω_u·C_L   ⟹   I_D ≥ ω_u·C_L·V_ov/2
```

Four hooks:

- **"Poles are time in disguise."** A pole at `−1/τ` *is* an `e^(−t/τ)`. Left is decay, right is disaster.
- **"Feedback pushes the pole out by `1+βA0`."** Same factor as gain sacrifice, gain-error suppression, and bandwidth extension. One number, four jobs.
- **"τ = closed-loop gain ÷ ω_u."** Speed is what you have left after you've bought gain.
- **"Accuracy costs 2.3τ per decade."** 10% is 2.3τ, 1% is 4.6τ, 0.1% is 6.9τ.

_[Claude used quiz_display_v0]_

You now have the full chain across three lectures: a 1% accuracy spec sets `A0 ≥ 1000`, a 5 ns settling spec sets `ω_u ≥ 9.21 Grad/s`, `ω_u = g_m/C_L` turns that into `g_m`, and `g_m = 2I_D/V_ov` turns that into a bias current — which then gets spent against the swing and noise budgets from lecture 2. That's the entire design loop of Chapter 9.

The two natural next steps are **slew rate** (§9.9 — the large-signal limit that makes `4.6τ` optimistic) and **stability** (Chapter 10 — what the mirror pole does to all of this once you close the loop). Say which and I'll build it out the same way.

## Human

cover all the amplifier configurations required to memorise before starting these lectures, common source common drain etc all of them refer to the book or razavi lectures online search them up do proper reasearch and then explain me very extensively in a very easy to understand way with proper diagrams and theory and i should remember all the formulas just as referred in razavi and my notes, follow the names and symbols and notations as given in my notes actually and cover anything else i need to remember

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

I pulled the exact sections out of the book for this — Razavi's Chapter 3 (*Single-Stage Amplifiers*), which is the chapter your lectures assume you've already done. His own Table 3.1 lists the taxonomy, and it's the right skeleton to hang everything on:

| Common-source | Source follower | Common-gate | Cascode |
|---|---|---|---|
| resistive load | resistive bias | resistive load | telescopic |
| diode-connected load | current-source bias | current-source load | folded |
| current-source load | | | |
| active load | | | |
| source degeneration | | | |

I'll use your notes' notation throughout: `Av`, `gm`, `rO`, `Vov`, `Vth`, `|Vov3|` for PMOS. (Razavi writes `V_OD` for overdrive and `V_TH` for threshold — same things.)

---

# PART 0 — The four tools that generate every formula

Do not memorise thirty gain expressions. Memorise these four things and *derive* the thirty.

## Tool 1: the three terminal impedances

Every circuit in this chapter is built by asking "what resistance does this node see?" There are only three answers.

_[Claude used visualize:show_widget]_

The precise versions, which are Razavi's Eqs. (3.116)–(3.117) and (3.128):

```
Gate:    R = ∞                                   (at low frequency; C_GS at high frequency)

Source:  R = 1/(gm + gmb)              if the drain sees a small load
         R = (R_D + rO)/(1 + (gm+gmb)rO)   in general
         ≈ 1/(gm+gmb) + R_D/((gm+gmb)rO)   ← the drain load divided by the intrinsic gain
         R → ∞                         if the drain load is an ideal current source

Drain:   R = rO                        if the source is grounded
         R = [1 + (gm+gmb)R_S] rO + R_S    if the source is degenerated by R_S
         ≈ (gm+gmb) rO R_S                 for large R_S
```

Read the last two lines as a single sentence and you have the entire cascode chapter:

> **A resistance at the source gets multiplied by `gm·rO` when you look into the drain. A resistance at the drain gets divided by `gm·rO` when you look into the source.**

The transistor is an impedance transformer with ratio `gm rO` in both directions.

## Tool 2: Razavi's lemma

```
Av = − Gm · Rout
```

Where `Gm` is the short-circuit transconductance of the whole stage and `Rout` is the resistance seen at the output with the input grounded. Razavi uses this constantly — it lets you compute any gain by answering two easy questions separately instead of writing KCL. Every gain in this document is an instance of it.

## Tool 3: the device parameters

```
gm  = μCox(W/L)Vov = √(2μCox(W/L)I_D) = 2I_D/Vov
rO  ≈ 1/(λ I_D)
gm rO = 2/(λVov)          intrinsic gain — Razavi: roughly 5 to 10 in modern CMOS
gmb = η gm                η ≈ 0.1 … 0.2
```

**When does `gmb` appear?** Only when the source is not at the bulk potential — i.e. when the source moves with the signal. That happens in the **source follower**, the **common-gate** stage, and the **cascode device**. It never appears in a plain grounded-source CS stage. That single rule tells you which formulas carry `(gm+gmb)` and which carry just `gm`.

## Tool 4: headroom accounting

Every stage's swing is `V_DD` minus the `Vov` of each stacked device, exactly as in your op-amp notes. Count the transistors between the output node and each rail; each one charges `|Vov|`.

---

# PART 1 — The common-source family

The workhorse. Razavi's table lists five variants, distinguished only by what you hang on the drain.

_[Claude used visualize:show_widget]_

## 1.1 Resistive load

```
Av = −gm RD              (λ = 0)
Av = −gm (rO ‖ RD)       (including channel-length modulation)
```

Now rewrite it using `gm = 2I_D/Vov`:

```
             2 I_D RD        2 × (dc drop across RD)
|Av| = ───────── = ───────────────────────
               Vov                    Vov
```

**This is the most useful line in the whole section.** Gain equals twice the DC voltage you're willing to drop across the load, divided by the overdrive. Want a gain of 10 with `Vov = 0.2 V`? You must burn 1 V across `RD`. On a 1 V supply that's impossible — which is exactly why resistive loads vanished from IC design and why everything in your op-amp notes uses transistor loads.

Swing: output max ≈ `VDD`, min = `Vin − Vth` (edge of triode).

## 1.2 Diode-connected load

Load resistance is `1/gm2` (or `1/(gm2+gmb2)` if the load is an NMOS with body effect), so:

```
Av = − gm1 / gm2 = − √( μn(W/L)1 / μp(W/L)2 )         PMOS load, no body effect
Av = − (1/(1+η)) √( (W/L)1 / (W/L)2 )                 NMOS load, with body effect  [Razavi Eq. 3.34]
```

What to notice:

- The gain is set by a **ratio of device dimensions** — well controlled, and independent of bias current. Same philosophy as `1+R1/R2` in the feedback lecture.
- The stage is **linear**: `M1` squares, the diode-connected `M2` square-roots, and the two undo each other.
- But the gain is *low* and expensive: doubling the gain needs a 4× dimension ratio.
- Swing is bad: the output can only rise to `VDD − VGS2 ≈ VDD − Vth2 − Vov2`. A diode connection always costs a full threshold, exactly as in the five-transistor OTA from your last lecture.

## 1.3 Current-source load

```
Av = − gm1 (rO1 ‖ rO2)
```

Maximum gain for the fewest devices — about half the intrinsic gain. Output max = `VDD − |Vov2|`. Razavi's Example 3.8 makes the honest comparison: the current-source load actually gives a *slightly smaller* maximum output voltage than a resistor (which can swing nearly to `VDD`), but it delivers far higher gain and you can raise that gain further by lengthening `L1` and `L2`.

## 1.4 Active load (complementary CS)

Drive *both* gates. `M1` pulls down harder while `M2` pushes less, so the two effects add:

```
Av = − (gm1 + gm2)(rO1 ‖ rO2)         [Razavi Eq. 3.48]
```

Same output resistance, higher transconductance. The catch: since `VGS1 + |VGS2| = VDD`, the bias current is a strong function of supply and threshold variation. This is the CMOS inverter used as an analog amplifier.

## 1.5 Source degeneration

Put a resistor under the source and the stage partly regulates its own current.

_[Claude used visualize:show_widget]_

The mechanism: as `Vin` rises, `I_D` rises, so the drop across `RS` rises, which eats part of the input — the gate-source voltage sees less than you applied. It's negative feedback built from one resistor.

```
                gm
Gm = ─────────────────────        [Razavi Eq. 3.55, with body effect]
       1 + (gm + gmb) RS

Av = − Gm RD =  − gm RD/(1 + gm RS)  =  − RD / (1/gm + RS)

Rout(drain) = [1 + (gm + gmb) rO] RS + rO   ≈ (gm+gmb) rO RS      [Eq. 3.128 applied here]
```

The form worth memorising is the middle-right one:

> **Gain = (resistance at the drain) ÷ (resistance at the source), where the transistor itself contributes `1/gm` to the source.**

And the limit: for `RS ≫ 1/gm`, `Gm → 1/RS`. The gain becomes `−RD/RS`, a pure resistor ratio — **independent of `gm`**, hence linear and process-insensitive. You trade gain for linearity, exactly the same bargain as global feedback, done locally. That boosted `Rout` expression is also the foundation of the cascode, so keep it in view.

---

# PART 2 — Source follower (common drain)

Input at the gate, output at the source, drain tied to `VDD`. It has *no* voltage gain to offer — its job is impedance transformation: high input resistance, low output resistance.

_[Claude used visualize:show_widget]_

```
            gm RS
Av = ──────────────────            [Razavi Eq. 3.86]
      1 + (gm + gmb) RS

with an ideal current-source bias (load = rO):
             gm rO                 gm            1
Av = ───────────────── ≈ ───────── = ───── < 1
      1 + (gm+gmb) rO       gm+gmb      1 + η

Rin  = ∞                (low frequency)
Rout = 1/(gm + gmb) ‖ rO ≈ 1/(gm + gmb)
```

Four things to remember:

- **The gain is always less than 1**, and with body effect it's about 0.8–0.9. That's the `1/(1+η)` — and since `η` depends on `V_SB`, which moves with the output, the gain varies with signal level. **Body effect makes the follower nonlinear.**
- The output sits one `VGS` *below* the input. That level shift is sometimes the point (shifting a DC level), and sometimes the problem (it eats headroom).
- The output resistance `1/(gm+gmb)` is the whole reason the stage exists — it can drive a low-resistance load without the load killing the gain of the previous stage.
- Razavi's warning, worth taking seriously: **followers are not efficient drivers.** Driving `RL` with a follower gives `RL/(RL + 1/gm)`, so if `1/gm ≈ RL` you get a gain of 0.5, whereas simply making the load part of a CS stage gives `gm RL ≈ 1`. His general rule is to avoid source followers unless they are absolutely necessary.

---

# PART 3 — Common-gate stage

Input at the **source**, output at the drain, gate held at a fixed bias. It's the only non-inverting stage here.

_[Claude used visualize:show_widget]_

```
Av = (gm + gmb) RD                      (λ = 0, non-inverting)

Av = (gm + gmb) rO + 1                  with an ideal current-source load  [Eq. 3.120]

           RD + rO                  1              RD
Rin = ──────────────── ≈ ───────── + ─────────────     [Eqs. 3.116–3.117]
        1 + (gm+gmb)rO       gm+gmb       (gm+gmb) rO

Rout = RD ‖ { rO[1 + (gm+gmb)RS] + RS }
```

The `Rin` expression is Tool 1 in action: **the drain load, divided by the intrinsic gain, plus `1/(gm+gmb)`.** And a result that surprises everybody the first time — Razavi calls it out explicitly: if the drain load is an *ideal* current source, `Rin → ∞`. The reason is physical, not algebraic: the total device current is fixed by `I1`, so moving the source potential cannot change the current, hence `I_X = 0`. **A common-gate stage has low input impedance only if its drain load is small.**

Where the stage earns its keep:

- **Low, controllable input resistance** — the natural way to match to 50 Ω in an RF front end.
- **No Miller effect.** The gate is an AC ground, so `C_GD` couples the output to ground, not back to the input. This makes it fast.
- **It's the top half of a cascode**, which is where you'll actually meet it in your op-amp lectures.

---

# PART 4 — The cascode

A CS stage with a common-gate device stacked on its drain. This is the single most important composite structure in analog CMOS.

_[Claude used visualize:show_widget]_

**Output resistance.** Razavi's trick (his Fig. 3.65): to compute `Rout`, view the structure as a common-source device `M2` degenerated by `rO1`. Then just reuse the degeneration formula:

```
Rout = [1 + (gm2 + gmb2) rO2] rO1 + rO2  ≈  (gm2 + gmb2) rO2 rO1        [Eq. 3.128]
```

**`M2` multiplies `M1`'s output resistance by its own intrinsic gain.** And with `Av = −Gm·Rout` and `Gm ≈ gm1`:

```
Av ≈ − gm1 (gm2 + gmb2) rO2 rO1  ≈  −(gm rO)²
```

> The cascode squares the intrinsic gain. If one transistor gives you 10, a cascode gives you 100.

**The physical intuition — shielding.** `M2` is a common-gate device, so the impedance looking into its source is tiny. Node `X` therefore barely moves no matter how much `Vout` swings — the drain load seen from `X` is divided by `gm2 rO2`. Two consequences follow:

1. `M1`'s drain voltage is nearly constant, so `M1` suffers almost no channel-length modulation. It behaves like a much better current source.
2. `M1`'s `C_GD` no longer sees a large voltage swing, so the **Miller effect is suppressed**. The cascode is fast as well as high-gain.

**The price is headroom.** Two stacked devices means `Vout,min = Vov1 + Vov2`, and `Vb` must be set carefully: high enough to keep `M1` saturated, low enough to keep `M2` saturated. A triple cascode gives `(gm rO)³` but costs three overdrives — Razavi notes this is usually too expensive. He also adds a nanometer-era caveat: with limited headroom, cascode current sources are only *moderately* better than single transistors, because at low `V_X` the cascode's advantage largely disappears.

## 4.1 Telescopic cascode

To actually *use* `(gm rO)²` of gain you need a load that's equally high-impedance — so you cascode the load too.

_[Claude used visualize:show_widget]_

```
Av ≈ − gm1 [ (gm2 rO2 rO1) ‖ (gm3 rO3 rO4) ]

Vout swings between  (Vov1 + Vov2)  and  VDD − (|Vov3| + |Vov4|)
```

In the fully differential version from your op-amp notes, add the tail source and you get Razavi's swing expression `2[VDD − (Vov1 + Vov3 + VISS + |Vov5| + |Vov7|)]` — five overdrives gone. That is the telescopic bargain: **gain squared, swing halved.**

Its other drawbacks, which motivate the next topology: the input CM level must be tightly controlled, and you cannot easily short input to output (so it's awkward as a unity-gain buffer).

## 4.2 Folded cascode

Same idea, but the cascode device is the **opposite type** — the signal current from an NMOS input pair is "folded" up into a PMOS cascode (or vice versa). Because the cascode device no longer sits in series with the input device's supply path, the input common-mode level can sit near a rail and the output swing improves. The cost is extra bias current (the folding branch carries both currents) and therefore more noise and power. Razavi's own comparison table rates telescopic and folded-cascode as medium gain and medium swing, with telescopic fastest and lowest noise, folded-cascode more flexible.

---

# PART 5 — The differential pair (recap)

You already have this from lecture 2, so just the memory items:

```
Half circuit:  Av = −gm (rO ‖ R_load)         tail node = virtual ground for DM
CM gain:       Av,CM = −gm RD/(1 + (gm+gmb)·2R_SS)    ← degeneration by the tail resistance
CMRR ∝ (gm + gmb)·R_SS
Tail:  I_D1 + I_D2 = I_SS
```

The key structural insight: **the differential pair is two CS stages sharing a tail, and for differential signals each half is a degeneration-free CS stage.** Everything in Part 1 therefore applies directly to it.

---

# PART 6 — The frequency-response facts you also need

## Pole at every node

```
ω_p = 1 / (R_node × C_node)
```

Find every node, find its resistance to ground and its capacitance to ground, and you have every pole. The *dominant* pole is the one at the node with the largest `R·C` — almost always the high-impedance output node.

## Miller effect

A capacitor `C_F` bridging the input and output of an inverting stage with gain `−A` looks like:

```
at the input:   C_F (1 + A)
at the output:  C_F (1 + 1/A) ≈ C_F
```

In a CS stage, `C_GD` is that bridge, so the input sees `C_GD(1 + gm R_D)` — potentially enormous. **Miller multiplication is the main speed limit of the common-source stage**, and the reason a CS stage driven from a high source resistance is slow.

Which stages escape it:

| Stage | Miller problem? |
|---|---|
| Common source | yes — `C_GD(1+gm R_D)` |
| Cascode | largely suppressed — `M1` sees a low-gain load |
| Common gate | no — gate is AC ground |
| Source follower | no — input and output move together, so `C_GS` is bootstrapped |

## The results your op-amp lectures use

```
One-stage op amp:   ω_p1 = 1/[(rO2‖rO4) C_L]      GBW = ω_u = gm/C_L
Mirror pole (5-T OTA):  ω_X ≈ gm3/C_X
```

---

# PART 7 — Master table

Memorise this table and you own Chapter 3.

| Stage | `Av` | `Rin` | `Rout` | Output swing limit | Use it for |
|---|---|---|---|---|---|
| CS, resistive load | `−gm(rO‖RD)` = `−2·V_RD/Vov` | ∞ | `rO‖RD` | up to ≈`VDD`; down to `Vin−Vth` | simple gain, wide swing |
| CS, diode load | `−gm1/gm2` = `−√((W/L)₁/(W/L)₂)` | ∞ | `1/gm2‖rO` | up to `VDD−VGS2` | linear, well-defined gain |
| CS, current-source load | `−gm1(rO1‖rO2)` | ∞ | `rO1‖rO2` | up to `VDD−\|Vov2\|` | maximum gain per device |
| CS, active load | `−(gm1+gm2)(rO1‖rO2)` | ∞ | `rO1‖rO2` | as above | gain at low current |
| CS, degenerated | `−RD/(1/gm+RS)` | ∞ | `[1+(gm+gmb)rO]RS+rO` | costs `V_RS` | linearity, high `Rout` |
| Source follower | `gm/(gm+gmb)` = `1/(1+η)` < 1 | ∞ | `1/(gm+gmb)` | costs `VGS` shift | buffering, level shift |
| Common gate | `+(gm+gmb)RD` | `1/(gm+gmb)+RD/((gm+gmb)rO)` | `RD‖{rO[1+(gm+gmb)RS]+RS}` | up to `VDD−\|Vov\|` | 50 Ω match, no Miller |
| Cascode | `−gm1(gm2+gmb2)rO2 rO1` ≈ `−(gm rO)²` | ∞ | `(gm2+gmb2)rO2 rO1` | down to `Vov1+Vov2` | high gain, high `Rout` |
| Telescopic | `−gm1[(gm2rO2rO1)‖(gm3rO3rO4)]` | ∞ | that parallel pair | four overdrives gone | highest gain, fastest |
| Differential pair | `−gm(rO‖R_L)` per half | ∞ | `rO‖R_L` | see op-amp notes | subtraction, CM rejection |

**Sanity rules that catch most algebra mistakes:**

- Gate input → `Rin = ∞`. Source input → `Rin` small. No exceptions.
- CS and cascode invert. Common gate and follower do not.
- `gmb` appears only where the source moves: follower, common gate, cascode device.
- A diode connection costs `VGS`; a current-source load costs only `|Vov|`.

---

# PART 8 — Choosing a stage

_[Claude used visualize:show_widget]_

# Memory hooks

- **"Gate infinity, drain `rO`, source `1/gm`."** Chant it. Every impedance question starts there.
- **"Up multiplies, down divides."** A resistance at the source appears `gm rO` times larger at the drain; a resistance at the drain appears `gm rO` times smaller at the source. `gm rO` is the exchange rate in both directions.
- **"`Av = −Gm Rout`, always."** Two easy questions instead of one hard one.
- **"Gain equals twice the drop over the overdrive"** — for any resistive load, `|Av| = 2V_RD/Vov`. It's why low supplies killed resistor loads.
- **"A diode costs `VGS`; a current source costs `Vov`."** One threshold of headroom is the entire difference, and it's the difference between the two OTAs in your notes.
- **"Body effect lives where the source moves."** Follower, common gate, cascode device — and nowhere else.
- **"Cascode squares the gain and doubles the headroom bill."**

_[Claude used quiz_display_v0]_

One last thing worth knowing about, since it's the closing section of the chapter: Razavi's §3.7, *Choice of Device Models*. His advice is to use the simplest model that captures what you're asking — ignore `λ` and `gmb` for a first-pass hand analysis to get intuition, add `rO` when the gain depends on it, and only go to full models in simulation. Hand analysis is for understanding *why*; the simulator is for the last 10%.

If it would help, I can turn the master table plus the impedance rules into a single printable one-page formula sheet you can keep next to you while working problems.

## Human

cover all the amplifier configurations required to memorise before starting these lectures, common source common drain etc all of them refer to the book or razavi lectures online search them up do proper reasearch and then explain me very extensively in a very easy to understand way with proper diagrams and theory and i should remember all the formulas just as referred in razavi and my notes, follow the names and symbols and notations as given in my notes actually and cover anything else i need to remember, teach it to me better than earlier, cover everything dont assume ik anything

[attachment: 1789555575546_image.png]

[attachment: 1789555601019_image.png]

[attachment: 1789555616340_image.png]

[attachment: 1789555630550_image.png]

## Assistant



## Human

this is my next lecture teach me all the prerequisite topics required in depth and then the whole lecture in depth dont skip anything teach me properly and refer to the book for the methods for teaching it use the best practices for teaching electronics to me draw as many diagrams as required double check the diagrams and all the explanations, draw all the diagrams in the lecture notes and make the explanations intuitive and cover everything, refer to razavi for the teaching methodologies also make diagrams better and nicer make me understand all of this properly

[attachment: 1789555710717_image.png]

[attachment: 1789555715977_image.png]

[attachment: 1789555720831_image.png]

[attachment: 1789555726005_image.png]

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

Your notes here cover two connected things: what happens when you wrap the **five-transistor OTA in unity-gain feedback** (Razavi Example 9.4), and then the **cascode / telescopic op amps** of §9.2.1 with their swing and bias headaches (his Figs. 9.8 and 9.9). The link between them is the last derivation on your page — why you *can't* easily short the input and output of a telescopic cascode.

I'll build every prerequisite first, then do both halves line by line.

---

# PART A — Prerequisites

## A1. Every amplifier is a Thévenin source

An amplifier is not an ideal voltage source. Model any real amplifier output as an **ideal source of value `Aclosed·Vin`, in series with an output resistance `Rout`.** That's the box on the top right of your notes.

_[Claude used visualize:show_widget]_

Why you should care about `Rout`, in two sentences:

```
With a resistive load:     Vout = Aclosed·Vin × RL/(RL + Rout)
With a capacitive load:    output pole at ω = 1/(Rout·CL)
```

A big `Rout` means the load steals your signal, and it means the output is slow. So for a buffer — a circuit whose whole job is driving something — `Rout` *is* the specification.

## A2. Where `Rout` comes from in the OTA

At the output node of the five-transistor OTA, two drains meet: `M2` (NMOS input device) and `M4` (PMOS mirror output). Using the "looking into the drain" rule from the last session, each presents `rO`, and they're in parallel:

```
Rout,open = rO2 ‖ rO4
```

**Parallel shortcut:** if `rO2 = rO4 = rO`, then `rO2‖rO4 = rO/2`. That's why your notes write `Aopen = gmN(rON ‖ rOP) ≈ gmN·rON/2`. Whenever a derivation says "assume NMOS and PMOS are matched," it means `gmP = gmN` and `rOP = rON`, and every parallel pair collapses to a half.

## A3. The open-loop output pole

```
ωp,open = 1 / [ (rO2 ‖ rO4) · CL ]
```

This is the first line on your notes page. It's just `1/(RC)` at the output node, with `R` from A2.

## A4. Feedback recap, and what β = 1 means

```
Aclosed = Aopen / (1 + β·Aopen)
```

In a **unity-gain buffer** you connect the output *directly* to the inverting input — no divider, no resistors. So the entire output is fed back:

```
β = 1        ⟹     Aclosed = Aopen/(1 + Aopen) ≈ 1   for Aopen ≫ 1
```

That's your notes' "For this circuit β = 1." The loop gain is simply `Aopen`, and the ideal closed-loop gain is `1/β = 1`.

## A5. The new idea: feedback changes impedances

This is the piece you haven't met yet, and it's the heart of the first half of the lecture. Razavi covers it in §8.1.1 under *Terminal Impedance Modification*.

**Rule:** feedback that **senses the output voltage** divides the output resistance by one plus the loop gain.

```
Rout,closed = Rout,open / (1 + β·Aopen)
```

Here is the intuition, which is much better than the algebra. Apply a test voltage `VX` at the output and ask how much current flows in.

_[Claude used visualize:show_widget]_

Without the loop, `IX = VX/Rout,open` — that's the definition of `Rout`. With the loop closed, the feedback wire tells the amplifier's input that the output has moved, and the amplifier responds by driving hard *against* the disturbance. That reaction current is `βA` times larger than the passive one, so:

```
IX = (VX/Rout,open)(1 + βA)      ⟹     Rout,closed = Rout,open/(1 + βA)
```

> **Negative feedback makes the output stiff.** The loop refuses to let `Vout` move, and "refusing to let the voltage move" is precisely what a low output impedance means.

The mirror-image rule (same section of Razavi): feedback that **returns a voltage in series at the input** multiplies the input resistance by `(1+βA)`. Same factor, opposite direction. You've now seen `1+βA` do four jobs: shrink gain, shrink gain error, widen bandwidth, and shrink output impedance. It's always the same number.

## A6. Cascode recap (needed for Part C)

```
Looking into the drain of a device degenerated by R_S:   Rout = [1+(gm+gmb)rO]R_S + rO
With R_S = rO of the device below:                       Rout ≈ (gm+gmb) rO · rO  ≈ gm rO²
```

A cascode device multiplies the output resistance beneath it by its own intrinsic gain. Your notes drop `gmb` for simplicity and write `gm4 rO4 rO2` — same thing.

## A7. The headroom method, restated

Walk from a rail toward the output and subtract what each device demands:

```
plain current-source / cascode device in saturation  →  costs |Vov|
diode-connected device                               →  costs |VGS| = |Vth| + |Vov|
tail current source                                  →  costs VISS
```

## A8. The saturation-algebra trick

For a stacked device you'll always write `V_DS ≥ V_GS − Vth` using **node voltages**, and the source-node voltage always cancels. Example for `M4` whose source is node `X`:

```
V_D4 − V_X  ≥  V_G4 − V_X − Vth4      ⟹     V_D4 ≥ V_G4 − Vth4
```

The `V_X` on both sides cancels — that's the cross-out in your notes. **A device's drain limit depends only on its own gate voltage and threshold, never on where its source sits.** Memorise that; it makes every stacked-device problem trivial.

---

# PART B — The unity-gain buffer (Razavi Example 9.4)

Take the five-transistor OTA and tie the output straight back to the inverting input.

_[Claude used visualize:show_widget]_

## Step 1 — what the op amp is on its own (open loop)

```
Aopen    = gmN (rON ‖ rOP)  ≈  gmN · rON/2
Rout,open = rO2 ‖ rO4
ωp,open  = 1 / [(rO2 ‖ rO4) CL]
```

## Step 2 — close the loop

The feedback wire carries the whole output back, so `β = 1`:

```
Aclosed = Aopen/(1 + Aopen) ≈ 1        for Aopen ≫ 1
```

The circuit copies its input to its output. That's the point of a buffer.

## Step 3 — the output resistance collapses

Apply A5 with `β = 1`:

```
             Rout,open        Rout,open        rO2 ‖ rO4              1
Rout,closed = ─────────── ≈ ─────────── = ───────────────── = ─────
              1 + Aopen         Aopen       gm2 (rO2 ‖ rO4)        gm2
```

Watch the cancellation in the third step — `rO2‖rO4` appears in both numerator and denominator and vanishes. That's the algebraic fact; here's what it *means*:

> **The closed-loop output impedance is `1/gm` — completely independent of the open-loop output impedance.**

Razavi flags this as an important observation, and it's genuinely a designer's licence: *you can chase gain by making `rO` enormous (long devices, cascodes) and still get a low closed-loop output impedance.* The two specifications don't fight. Whatever you do to `rO`, feedback divides it right back out.

There's also a lovely structural echo: `1/gm` is exactly the output resistance of a source follower. **Feedback has turned the OTA into a follower** — but a better one, with no `VGS` level shift and no body-effect nonlinearity.

## Step 4 — and the output pole moves out

```
                    1           gm2
ωout,closed = ───────────── = ──────
               (1/gm2)·CL        CL
```

Two things to notice, and the second one is a beautiful consistency check.

First, the pole moved out by exactly `(1+Aopen)` — from `1/[(rO‖rO)CL]` to `gm/CL`, the same factor by which the resistance shrank. Numbers make it concrete:

```
gm2 = 1 mS, rO2 = rO4 = 20 kΩ, CL = 1 pF

Rout,open   = 10 kΩ     Aopen = 1m × 10k = 10
ωp,open     = 1/(10k × 1p)  = 100 Mrad/s
Rout,closed = 10k/11 ≈ 910 Ω  ≈ 1/gm = 1 kΩ
ωout,closed = 1/(1k × 1p)   = 1 Grad/s        ← ten times faster
```

Second: from the previous lecture, the unity-gain bandwidth of a one-stage op amp is `ωu = gm/CL`, and the closed-loop bandwidth is `β·ωu`. With `β = 1` that's `gm/CL`. **The impedance route and the bandwidth route give the identical answer.** When two independent derivations land on the same expression, you've understood the circuit.

## The reality check that motivates the rest of the lecture

`Aclosed ≈ 1` — but how close to 1? From lecture one, the gain error is `1/(1+βAopen) = 1/(1+Aopen)`. With a five-transistor OTA in a nanometer process, `Aopen = gm rO/2 ≈ 5`:

```
ε = 1/(1 + 5) ≈ 17%
```

Your "unity-gain" buffer has a gain of 0.83. That is useless for anything precise. To get 1% you need `Aopen ≈ 100`; for 0.1%, about 1000. A single-stage OTA cannot deliver that. **This is exactly why the next page of your notes is about cascodes.**

Also from Example 9.4, the input common-mode range of this buffer, with `VDD = 1 V`, `Vth = 0.3 V`, every overdrive 0.1 V:

```
Vin,min = VISS + VGS1 = 0.1 + 0.4 = 0.5 V
Vin,max = VDD − |VGS3| + Vth1 = 1 − 0.4 + 0.3 = 0.9 V      → range = 0.4 V
```

---

# PART C — Cascode (telescopic) op amps

## C1. The fully differential telescopic cascode

Stack a cascode device on the input pair, and cascode the load too.

_[Claude used visualize:show_widget]_

## Human

continue  you left from part C

## Assistant

**Gain.** Use `Av = −Gm·Rout`. `Gm` is just the input pair's `gm1,2`. For `Rout`, look both ways from the output node:

```
looking down:  M4 cascoding M2   →   gm4 rO4 rO2
looking up:    M6 cascoding M8   →   gm6 rO6 rO8
```

```
Aopen = gm1,2 [ gm4 rO4 rO2 ‖ gm6 rO6 rO8 ]
```

Now apply the matched-device simplification from your notes (`gmP = gmN`, `rOP = rON`), so both branches are `gmN rON²` and the parallel pair halves:

```
                            gmN rON²        ( gmN rON )²
Aopen = gmN [ gmN rON² ‖ gmN rON² ] = gmN · ────────── = ──────────
                                                 2               2
```

**The gain is half the square of the intrinsic gain.** With `gm rO = 10` that's 50; with `gm rO = 20`, it's 200. Compare with the five-transistor OTA's `gm rO/2 ≈ 5`. Cascoding bought you a factor of `gm rO` — one or two orders of magnitude — which is what finally makes 1% gain error and precise buffering possible.

**Output swing.** Count the overdrives on the way to each rail:

```
Vout2,max = VDD − |Vov8| − |Vov6|          (M8 and M6 must stay saturated)
Vout2,min = VISS + Vov2 + Vov4             (M2 and M4 must stay saturated)
```

Single-ended swing is the difference; the differential output doubles it:

```
Output swing = 2 [ VDD − { |Vov8| + |Vov6| + Vov4 + Vov2 + VISS } ]
```

which is exactly the boxed line in your notes. Put numbers on it to feel the pain, with `VDD = 1.2 V`, every overdrive `0.15 V`, `VISS = 0.2 V`:

```
telescopic:   2 × (1.2 − 0.15 − 0.15 − 0.15 − 0.15 − 0.2) = 2 × 0.4 = 0.8 V pp
simple OTA:   2 × (1.2 − 0.15 − 0.15 − 0.2)               = 2 × 0.7 = 1.4 V pp
```

> **Cascoding squared the gain and cost you nearly half the swing.** That is the single trade-off that defines the topology.

_[Claude used visualize:show_widget]_

## C2. The catch nobody tells you: you only get that swing if the biases are perfect

Razavi is explicit that the swing formula above holds only under **three simultaneous conditions**, and that this is a serious practical problem:

```
(1)  Vin,CM  = VGS1 + VISS                         input CM as low as possible
(2)  Vb1     = VGS3 + (Vin,CM − Vth1)              puts M1 exactly at the edge of saturation
(3)  Vb2     = VDD − |Vov7| − |VGS5|               puts M7 exactly at the edge of saturation
```

Read them as a chain: the input common-mode level decides `Vb1`, and `Vb2` has to be set from the top rail. If any of the three drifts — with process, temperature, or supply — a transistor slides into triode and your gain collapses. Razavi's verdict: `Vin,CM` (and `Vb1` and `Vb2`) **must be controlled tightly, a serious issue**.

This is the real reason telescopic cascodes are fiddly. On paper they're the highest-gain, fastest, lowest-noise one-stage topology. In silicon they demand three well-controlled bias voltages and give you very little slack.

---

# PART D — The single-ended version with a cascode mirror

Now the right-hand circuit on your notes page. Replace the `Vb2`/`Vb3` rails with a **cascode current mirror**: `M7` and `M5` are diode-connected, and `M8`, `M6` copy them.

_[Claude used visualize:show_widget]_

The gain expression is unchanged in form — the mirror adds the two half-currents just as in the five-transistor OTA, so `Gm = gm1,2` and `Rout` is still the two cascode branches in parallel.

**But the swing gets worse, and here's exactly why.** The gate of `M6` is no longer a free bias voltage `Vb2` you can tune — it's *forced* by the diode-connected stack on the left:

```
VG6 = VG5 = VD5 = VDD − |VGS7| − |VGS5|
```

Apply the saturation-algebra trick from A8 to `M6` (its drain limit depends only on its own gate and threshold):

```
Vout ≤ VG6 + |Vth6| = VDD − |VGS7| − |VGS5| + |Vthp|
     = VDD − (|Vthp| + |Vov7|) − (|Vthp| + |Vov5|) + |Vthp|
     = VDD − |Vthp| − |Vov8| − |Vov6|
```

(using `|Vov7| = |Vov8|` and `|Vov5| = |Vov6|`, since mirrored pairs carry equal current in equal devices). The bottom limit is unchanged, so:

```
Output swing = VDD − { |Vov8| + |Vov6| + |Vthp| + Vov4 + Vov2 + VISS }
```

That is the boxed formula on the right-hand side of your notes, and the extra `|Vthp|` has a name now: **the diode connection sets the cascode's gate one whole threshold too low.** You have met this exact penalty twice before — it's the same `|VGS3|` versus `|Vov3|` difference that cost the five-transistor OTA its input common-mode range. Whenever a diode connection biases something, budget a threshold.

So the single-ended version pays twice: no factor of 2 from differential outputs, *and* one extra threshold. Plus it has a mirror pole. Its compensation is simplicity — the output common-mode level is defined by the mirror, so no common-mode feedback loop is needed.

---

# PART E — Why you can't make a unity-gain buffer from this

This is the final derivation on your page, and it is Razavi's Fig. 9.9. Short the output back to `Vin2`, exactly as you did with the five-transistor OTA in Part B. Now ask: **can `M2` and `M4` both stay in saturation?**

_[Claude used visualize:show_widget]_

**Condition 1 — `M4` (the cascode device) must stay saturated.**

```
V_DS4 ≥ V_GS4 − Vth4
Vout − VX  ≥  Vb1 − VX − Vth4          ← VX cancels on both sides
Vout ≥ Vb1 − Vth4                                            ... (1)
```

**Condition 2 — `M2` (the input device) must stay saturated.**

```
V_DS2 ≥ V_GS2 − Vth2
VX − VP  ≥  Vin2 − VP − Vth2           ← VP cancels on both sides
VX ≥ Vin2 − Vth2
```

and here is the step that makes the buffer special: in unity-gain feedback, `Vin2 = Vout`. So

```
VX + Vth2 ≥ Vout
```

Now substitute `VX`. Node `X` is the source of `M4`, whose gate is held at `Vb1`, so `VX = Vb1 − VGS4`:

```
Vb1 − VGS4 + Vth2 ≥ Vout                                     ... (2)
```

**Put (1) and (2) together:**

```
Vb1 − VGS4 + Vth2  ≥  Vout  ≥  Vb1 − Vth4
```

The output is trapped between two limits that both sit near `Vb1`. How wide is the window?

```
width = (Vb1 − VGS4 + Vth2) − (Vb1 − Vth4)
      = Vth2 + Vth4 − VGS4
      = Vth2 + Vth4 − (Vth4 + Vov4)
      = Vth2 − Vov4
```

Razavi writes the same result as `Vth4 − (VGS4 − Vth2)` — **one threshold minus one overdrive**, and he notes it is maximised by minimising `M4`'s overdrive but is *always less than one threshold voltage*.

_[Claude used visualize:show_widget]_

Put numbers on that window. With `Vth = 0.4 V` and `Vov4 = 0.15 V`:

```
window = 0.4 − 0.15 = 0.25 V
```

A quarter of a volt — and not a swing you can place wherever you like, but an absolute band pinned to `Vb1`. That's the answer to "why not just use the telescopic cascode for everything."

**What happens outside the window** (Razavi's Example 9.5). The loop forces `Vout ≈ Vin`, so sweeping `Vin` walks the output through three regimes:

| `Vin` range | What happens |
|---|---|
| `Vin < Vb1 − Vth4` | `M4` falls into triode; everything else saturated; open-loop gain drops |
| `Vb1 − Vth4 < Vin < Vb1 − (VGS4 − Vth2)` | `M2` and `M4` both saturated — gain at maximum |
| `Vin > Vb1 − (VGS4 − Vth2)` | `M2` and `M1` enter triode; gain degrades |

**Why this matters even though nobody builds a cascode buffer.** Razavi's exact framing: a cascode op amp is rarely used as a unity-gain buffer, *but* switched-capacitor circuits (Chapter 13) **reduce to this configuration for part of their operating period** — during one clock phase the amplifier really is shorted input-to-output. So this constraint quietly governs a huge class of real circuits.

And his Example 9.6 gives the design answer: choose the output common-mode level at

```
VCM = Vb1 − (VGS3,4 − Vth1,2)
```

which places `M1`/`M2` right at the edge of saturation. Then the output can fall all the way to `Vb1 − Vth3,4` with the cascodes still saturated, and — because a high-gain op amp barely moves its own input gate voltages — it can rise freely (limited only by the PMOS loads above). The result is a symmetric excursion of **±(one threshold − one overdrive)** around `VCM`. Setting `VCM` at the *other* limit would leave zero downswing.

---

# Summary: the three op amps you now know

| | 5-transistor OTA | Differential telescopic | Single-ended telescopic |
|---|---|---|---|
| Gain | `gm(rO‖rO)` ≈ `gm rO/2` ≈ 5–10 | `(gm rO)²/2` ≈ 50–200 | `(gm rO)²/2` |
| Swing | `VDD − \|Vov4\| − Vov2 − VISS` | `2[VDD − \|Vov8\| − \|Vov6\| − Vov4 − Vov2 − VISS]` | that, minus `\|Vthp\|`, and no ×2 |
| Bias rails needed | one (`Vb` for tail) | `Vb1`, `Vb2`, `Vb3`, tightly controlled | `Vb1` + the mirror sets itself |
| Output CM | set by mirror | undefined → needs CMFB | set by mirror |
| Mirror pole | yes | no | yes |
| As a unity-gain buffer | fine — wide input CM range | output trapped in a `Vth2 − Vov4` window | same window problem |
| `Rout` closed-loop | `1/gm` | `1/gm` | `1/gm` |

Notice the last row. **Whatever you do to the open-loop output resistance, voltage feedback drives the closed-loop value to `1/gm`.** Gain is what cascoding buys you; output impedance is not.

# Formula sheet

```
FEEDBACK AND IMPEDANCE
Aclosed     = Aopen/(1 + βAopen)            β = 1 for a unity-gain buffer
Rout,closed = Rout,open/(1 + βAopen)        voltage-sensing feedback
Rin,closed  = Rin,open ×(1 + βAopen)        series-returning feedback

THE BUFFER (5-T OTA, β = 1)
Aopen       = gmN(rON‖rOP) ≈ gmN·rON/2
Aclosed     ≈ 1,      gain error ε = 1/(1+Aopen)
Rout,open   = rO2 ‖ rO4         ωp,open = 1/[(rO2‖rO4)CL]
Rout,closed = 1/gm2             ωout,closed = gm2/CL  ( = ωu )

TELESCOPIC CASCODE
Aopen = gm1,2[ gm4 rO4 rO2 ‖ gm6 rO6 rO8 ] = (gmN rON)²/2
Swing (differential) = 2[ VDD − { |Vov8| + |Vov6| + Vov4 + Vov2 + VISS } ]
Swing (mirror load)  =    VDD − { |Vov8| + |Vov6| + |Vthp| + Vov4 + Vov2 + VISS }
Bias:  Vin,CM = VGS1 + VISS,   Vb1 = VGS3 + (Vin,CM − Vth1),   Vb2 = VDD − |Vov7| − |VGS5|

UNITY-GAIN CONSTRAINT
Vb1 − VGS4 + Vth2  ≥  Vout  ≥  Vb1 − Vth4
window = Vth2 − Vov4   (one threshold minus one overdrive, always < Vth2)
```

**Memory hooks**

- **"Voltage feedback makes the output stiff."** `Rout/(1+βA)`, and it always lands at `1/gm`.
- **"The closed-loop output pole is `gm/CL` — the same `ωu` as always."** Two derivations, one answer.
- **"Cascode: gain squared, swing halved, three bias rails."**
- **"A diode connection costs a threshold."** Third appearance: the OTA's input range, the mirror-loaded swing, and the cascode gate bias.
- **"In a buffer the output *is* a gate voltage."** That's the whole reason `Vout` gets trapped in a one-threshold window — the same node has to satisfy a drain constraint and a gate constraint at once.

_[Claude used quiz_display_v0]_

Everything in this lecture points at the same unresolved tension: the telescopic cascode gives you the gain you need, but its input common-mode range and its output window are both painfully tight, and it can't tolerate having its input shorted to its output. That is precisely the problem the **folded cascode** solves — and it's what Razavi introduces next in §9.2.1, right after Fig. 9.9. Say the word and I'll build that one out the same way.

## Human

this is my next lecture teach me all the prerequisite topics required in depth and then the whole lecture in depth dont skip anything teach me properly and refer to the book for the methods for teaching it use the best practices for teaching electronics to me draw as many diagrams as required double check the diagrams and all the explanations, draw all the diagrams in the lecture notes and make the explanations intuitive and cover everything, refer to razavi for the teaching methodologies also make diagrams better and nicer make me understand all of this properly, remember to make all the figures and follow the progression as in the lecture notes

[attachment: 1789556761729_image.png]

[attachment: 1789556777204_image.png]

[attachment: 1789556802574_image.png]

[attachment: 1789556811172_image.png]

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

This lecture is Razavi §9.2.4–9.2.5, the **folded-cascode op amp** — and it exists entirely to fix the two problems we ended on last time: the tight output window and the impossible input/output CM levels of the telescopic cascode. Your notes open by showing exactly that unresolved problem, then build the fix.

---

# PART A — Prerequisites

## A1. What a current source really does

Two separate facts, and students constantly mix them:

- **DC:** it fixes the current in its branch. So at any node where a current source meets transistors, KCL gives you a hard constraint. In the folded stage you'll use `|I_D1| + I_D2 = I1` — as one device takes more, the other must take less.
- **AC (small signal):** an ideal current source is an **open circuit**. It cannot pass a signal current. A real one is `rO` to the rail.

That second fact is the whole reason folding works: a signal current injected at a node *cannot* go into the current source, so it is forced into whatever else is connected there.

## A2. The Norton view of a transistor

Any common-source device, seen from its drain, is a **Norton source**: a current `gm·vin` in parallel with `rO`.

```
M1 as seen from its drain   ≡   current source gm1·vin   ‖   resistance rO1
```

You will use this to replace `M1` with two elements and then do pure resistor algebra. That's exactly the transformation on the right-hand side of your notes' image 3.

## A3. The current divider — the key new tool

A current `I` arriving at a node that has two paths to ground splits between them in **inverse** proportion to their resistances:

_[Claude used visualize:show_widget]_

```
         RB                         RA
IA = I ────────        IB = I ────────
       RA + RB                    RA + RB
```

Note the **cross-over**: the current into branch A is scaled by the *other* branch's resistance. If `RA ≪ RB`, then `IA ≈ I` — almost everything goes down the easy path. That single sentence is the whole `Gm` derivation at the end of your notes.

## A4. Impedance rules (recap, you'll need all three)

```
into the gate:      ∞
into the source:    1/(gm+gmb) ‖ rO        ≈ small
into the drain:     rO, or [1+(gm+gmb)rO]·R_S + rO ≈ gm rO R_S if degenerated by R_S
```

## A5. The framework

```
|Av| = Gm · Rout
```

`Gm` = output short-circuit current per input volt. `Rout` = resistance at the output with the input grounded. Compute them separately; never write KCL for the whole circuit.

## A6. The "drain fence" — the little sketch in your notes

The saturation condition, rearranged into the form you'll actually use for CM limits:

```
NMOS:   V_D ≥ V_G − Vth            the drain must stay ABOVE a fence one threshold below the gate
PMOS:   V_D ≤ V_G + |Vth|          the drain must stay BELOW a fence one threshold above the gate
```

That's the meaning of the `VG − Vth` annotation on your page. Every input common-mode limit in this lecture comes from applying this one line to the input device.

---

# PART B — Where we left off: the closed-loop telescopic

Your notes begin with the circuit that shows the problem — Razavi's Fig. 9.10, a fully differential feedback amplifier.

_[Claude used visualize:show_widget]_

Redraw it at transistor level and the problem jumps out: the feedback resistors tie each output node **directly to an input gate**, so the input and output common-mode levels are forced to be equal.

_[Claude used visualize:show_widget]_

From last lecture, the two nodes `X` and `Y` are trapped:

```
Vb − Vth3,4  ≤  VX, VY  ≤  Vb − (VGS3,4 − Vth1,2)
```

and the best you can do — putting `VCM` at the upper edge so `M1`, `M2` sit right at the saturation boundary — buys a symmetric excursion of only **±(one threshold − one overdrive)**. The root cause is structural: the cascode device `M3` is *stacked on top of* the input device `M1`, so `M1`'s drain voltage and the input gate voltage are locked together through the loop.

**The fix is to stop stacking them.**

---

# PART C — The folding idea

Razavi's move (Ch. 3, Fig. 3.74, and Ch. 9, Fig. 9.13): keep the cascode device where it is, but **replace the input device with the opposite type**, moved to the other rail. It still converts `Vin` into a drain current; that current now flows *sideways* into the cascode instead of *upward* through it.

_[Claude used visualize:show_widget]_

**Follow the signal.** `Vin` moves the gate of the PMOS `M1`, which produces a small-signal drain current `gm1·vin` at node `X`. Where can that current go? Three paths meet at `X`:

```
into the source of M2:  1/(gm2+gmb2)  — tiny
into I2:                open circuit (AC)  — or rO of the real source
into rO1 of M1:         large
```

By the current divider of A3, **essentially all of it goes into `M2`'s source**, flows up through `M2`, and lands on the output. So

```
Vout ≈ gm1 · Rout · Vin
```

— the same gain expression as the stacked cascode. The signal current has simply been *folded* sideways instead of flowing straight up. That's where the name comes from: Razavi says the small-signal current is "folded" up or down.

**Three consequences, all of which you must remember.**

**(1) DC: the currents add instead of being reused.** At node `X`, KCL gives

```
|I_D1| + I_D2 = I1        (constant)
```

In the stacked cascode, `M1`'s bias current *flows through* `M2` — it is reused. Here the bias source must supply both. **The folded cascode always burns more power for the same performance.**

**(2) Large-signal behaviour.** Raise `Vin` on the PMOS: `|I_D1|` falls, so `I_D2` must rise, so the output is pulled down. Still inverting. Push far enough and `I_D2 → 0` (the cascode turns off) or `M1` enters triode — Razavi works this out in Eqs. (3.143)–(3.145).

**(3) The output resistance drops.** For the folded cascode, `M2` is degenerated not by `rO1` alone but by `rO1` in parallel with the bias source's `rO3`:

```
Rout = [1 + (gm2+gmb2) rO2](rO1 ‖ rO3) + rO2  ≈  gm2 rO2 (rO1 ‖ rO3)
```

That parallel combination is strictly smaller than `rO1`, so **a folded cascode always has a lower output impedance — and hence lower gain — than a telescopic one.** Keep this line; it is exactly the `Rdown` formula on your notes page.

**The dual.** Everything mirrors: an NMOS input device at the bottom with a PMOS cascode above it, the current folded *down*.

_[Claude used visualize:show_widget]_

---

# PART D — Folding the differential pair

Apply the same move to the telescopic differential pair from last lecture: replace the NMOS input pair with a PMOS pair fed by its own tail from `VDD`, and let each input device inject its current sideways into the source of its NMOS cascode.

_[Claude used visualize:show_widget]_

**Difference 1 — power.** At each folding node the bias source must carry *both* the input device's share of the tail and the cascode branch current:

```
ISS1 = ISS/2 + I1
```

Razavi states it exactly this way, and concludes: the folded-cascode configuration generally consumes more power.

**Difference 2 — and this is the whole point — the input CM constraint flips direction.**

Work out the folding-node voltage. In *both* topologies `M3` is an NMOS cascode with its gate at `Vb1` and its source at node `X`, so

```
VX = Vb1 − VGS3
```

Now apply the drain-fence rule (A6) to the input device:

```
TELESCOPIC (NMOS input):   VX ≥ Vin,CM − Vth1
                     ⟹   Vin,CM ≤ Vb1 − VGS3 + Vth1        an UPPER bound

FOLDED (PMOS input):       VX ≤ Vin,CM + |VthP|
                     ⟹   Vin,CM ≥ Vb1 − VGS3 − |VthP|      a LOWER bound
```

> **Same node voltage, opposite inequality.** The telescopic says "your input CM must not be too *high*"; the folded says "must not be too *low*" — and that lower limit can be set well below any level you care about.

This is precisely why you can now short input to output. Razavi: *it is therefore possible to design the latter to allow shorting its input and output terminals with negligible swing limitation. This is in contrast to the behavior depicted in Fig. 9.9* — i.e. in contrast to the one-threshold window we derived last lecture.

---

# PART E — The complete folded-cascode op amp

Replace the ideal current sources with real transistors, and cascode the loads so the gain isn't thrown away. This is the circuit at the bottom of your notes page.

_[Claude used visualize:show_widget]_

**Output swing.** Count the fences from each rail to the output node:

```
Vout,min = Vov3 + Vov9                  (NMOS cascode M3 + NMOS current source M9)
Vout,max = VDD − (|Vov5| + |Vov7|)      (PMOS cascode M5 + PMOS current source M7)

single-ended swing = VDD − ( Vov3 + Vov9 + |Vov5| + |Vov7| )
differential swing = 2 × that
```

**Four overdrives — and no `VISS` term.** That's the structural win: the tail current source is no longer in the output branch, so its headroom no longer eats into the swing. Compare with the telescopic, where you paid five deductions.

_[Claude used visualize:show_widget]_

The honest caveat, which Razavi flags immediately: `M9` and `M10` carry a **large** current (both the input device's share and the cascode branch's), so they must be wide — and if you want their capacitance at nodes `X` and `Y` to stay small you may be forced to give them a *high* overdrive. So in practice the swing advantage over a telescopic is, in his words, **only slightly higher**.

---

# PART F — The gain

Use `|Av| = Gm · Rout` and take the half circuit.

## F1. Rout — look both ways from the output

_[Claude used visualize:show_widget]_

**Looking up** you see a plain cascode: `M5` sitting on `M7`.

```
Rup = gm5 rO5 rO7
```

**Looking down** you see `M3`, but `M3` is degenerated by whatever hangs off node `X`. Two things do: the NMOS current source `M9` (resistance `rO9` to ground) and the input device `M1` (resistance `rO1` to `VDD`). Both rails are AC grounds, so they are **in parallel**:

```
Rdown = gm3 rO3 (rO1 ‖ rO9)
```

These are exactly the two lines in your notes. Then

```
Rout = Rup ‖ Rdown
|Av| = gm1 ( Rup ‖ Rdown )
     = gm1 { [ (gm3+gmb3) rO3 (rO1 ‖ rO9) ] ‖ [ (gm5+gmb5) rO5 rO7 ] }        ← Razavi Eq. (9.17)
```

**Why this is 2–3× lower than a telescopic cascode**, and you should be able to give all three reasons:

1. `Rdown` is degenerated by `rO1 ‖ rO9` instead of `rO1` alone — strictly smaller.
2. `M9` carries *both* currents, so it's a wide device with a relatively low `rO9`, dragging that parallel combination down further.
3. A PMOS input pair has lower `gm` than an NMOS pair of comparable size and current (lower mobility), so `Gm` is smaller too.

## F2. Gm — the current-divider derivation

Now the part your notes work through in detail. Short the output to AC ground and find the current that flows out of it.

Replace `M1` by its Norton equivalent (A2): a current source `gm1·Vin` in parallel with `rO1`. The current source `M9` becomes `rO9`. And looking into `M3`'s source you see `1/gm3 ‖ rO3`.

_[Claude used visualize:show_widget]_

Now apply the current divider from A3. The current `gm1·Vin` arrives at the folding node and splits between the path into `M3`'s source and the path through `rO9 ‖ rO1` to ground:

```
                     (rO9 ‖ rO1)
Iout = gm1 Vin × ─────────────────────────────
                  (1/gm3 ‖ rO3) + (rO9 ‖ rO1)
```

That is the first line of the derivation on your page. Now the approximation: `1/gm3` is a few hundred ohms while `rO9 ‖ rO1` is tens of kilohms, so the denominator is dominated by the second term and the fraction goes to 1:

```
Iout ≈ gm1 Vin × (rO1 ‖ rO9)/(rO1 ‖ rO9) = gm1 Vin
```

```
Gm = Iout/Vin = gm1
```

**Read what that means physically**, because it is the whole justification for folding: the cascode's source is such an easy path that essentially *all* of the input device's signal current gets delivered to the output. The folding costs you nothing in `Gm`. It costs you in `Rout`, in power, and in the pole at the folding node — but not in transconductance.

```
|Av| = gm1 ( Rup ‖ Rdown ) = gm1 [ gm5 rO5 rO7 ‖ gm3 rO3 (rO1 ‖ rO9) ]
```

---

# PART G — Properties and trade-offs

**The folding-node pole is worse.** The pole at `X` is `1/[(1/(gm3+gmb3))·C_tot]`. In a telescopic, `C_tot` at the cascode source comes from `C_GS3`, `C_SB3`, `C_DB1`, `C_GD1`. In the folded version you add `C_GD9` and `C_DB9` — and `M9` is *wide*, because it carries both currents. Razavi: the folding-point pole is "quite closer to the origin" than the corresponding telescopic pole. That's a stability liability.

**NMOS-input version.** You can fold the other way: NMOS input pair, PMOS cascodes (Razavi's Fig. 9.18). It gives **higher gain** because NMOS mobility is larger, but a **lower folding pole**, because a PMOS cascode has a low `gm` *and* the NMOS current sources must be even wider. For flicker-noise-sensitive applications the PMOS-input version is preferred.

**Input common-mode range.** For the NMOS-input folded cascode:

```
VGS1,2 + Vov11  ≤  Vin,CM  ≤  Vb2 + |VGS3| + Vth1,2
```

and the upper bound **can exceed `VDD`**. A PMOS-input version can accept input CM levels all the way down to zero. Compare that with the telescopic, which was boxed in from above.

**In closed loop.** With a folded cascode in the feedback amplifier of Part B, the input and output CM levels can be equal without penalty, and `VX`, `VY` can swing to **within two overdrives of either rail** — as against the one-threshold-minus-one-overdrive window of the telescopic.

| | Telescopic | Folded cascode |
|---|---|---|
| Gain | higher | 2–3× lower |
| Output swing | 4 overdrives + `VISS` lost | 4 overdrives lost |
| Power | lower (current reused) | higher (`ISS1 = ISS/2 + I1`) |
| Speed | highest | high — folding pole is lower |
| Noise | low | medium |
| Input CM range | narrow, upper-bounded | wide; can reach a rail |
| Input shorted to output | one-threshold window | fine |

Razavi's summary judgement: the folded cascode's swing advantage is slight and it costs power, gain, pole frequencies and noise — **yet folded cascodes are used more widely**, for exactly two reasons: input and output CM levels can be chosen equal without limiting swing, and they accommodate a wider input CM range.

---

# Formula sheet

```
FOLDING
|I_D1| + I_D2 = I1                       bias currents add, not reused
ISS1 = ISS/2 + I1                        folding source carries both

CURRENT DIVIDER
IA = I·RB/(RA+RB)                        smaller resistance takes the current

GAIN (notes' numbering)
Gm    = gm1                              cascode source is the easy path
Rup   = gm5 rO5 rO7
Rdown = gm3 rO3 (rO1 ‖ rO9)
|Av|  = gm1 (Rup ‖ Rdown)

SWING
Vout,min = Vov3 + Vov9
Vout,max = VDD − (|Vov5| + |Vov7|)
swing    = VDD − (Vov3 + Vov9 + |Vov5| + |Vov7|)     ×2 differential

INPUT CM
telescopic (NMOS in):  Vin,CM ≤ Vb1 − VGS3 + Vth1       upper bound
folded (PMOS in):      Vin,CM ≥ Vb1 − VGS3 − |VthP|     lower bound
folded (NMOS in):      VGS1 + Vov,tail ≤ Vin,CM ≤ Vb2 + |VGS3| + Vth1

SINGLE-STAGE FOLDED CASCODE
Rout = [1+(gm2+gmb2)rO2](rO1 ‖ rO3) + rO2
```

**Memory hooks**

- **"Don't stack — fold."** The cascode stops sitting on the input device, so their voltages stop being locked together.
- **"Folding flips the inequality."** Same folding-node voltage; the telescopic caps `Vin,CM` from above, the folded holds it from below.
- **"The cascode source is the easy path."** Hence `Gm = gm1` — folding is free in transconductance.
- **"You pay in current, gain, and the folding pole."** `ISS1 = ISS/2 + I1`; `rO1‖rO9` instead of `rO1`; a wide `M9` loading node `X`.
- **"Swing gains exactly one `VISS`."** The tail left the output branch.

_[Claude used quiz_display_v0]_

The natural next step in Razavi is §9.2.6, the **design procedure** — Example 9.9 walks through designing a folded-cascode op amp to a real spec sheet (3 V supply, 3 V differential swing, 10 mW, gain of 2000), allocating the power budget across the input pair, the cascode branches and the mirrors, then picking every overdrive and every `W/L`. That's where all five lectures finally combine into a number-by-number design. After that comes **gain boosting** and then **common-mode feedback**, which the fully differential versions you've been drawing all quietly need.

## Human

explain these parts again more properly, cover all the amplifier configurations required to memorise before starting these lectures, common source common drain etc all of them refer to the book or razavi lectures online search them up do proper reasearch and then explain me very extensively in a very easy to understand way with proper diagrams and theory and i should remember all the formulas just as referred in razavi and my notes, follow the names and symbols and notations as given in my notes actually and cover anything else i need to remember, teach it to me better than earlier, cover everything dont assume ik anything

## Assistant

_[Claude used web_search]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

I searched for Razavi's own lecture material (his UCLA *Electronic Circuits* series and the standard course sets built on Chapter 3) and re-extracted the relevant chapters from your PDF. The teaching order below is his: **device → large-signal → small-signal → design trade-off**, every single time. That's the pattern I'll repeat for each configuration so it becomes automatic for you.

Notation throughout is yours: `Av`, `gm`, `rO`, `Vov`, `Vth`, `|Vov3|` for PMOS, `VISS` for tail headroom.

---

# PART 0 — The method

Razavi never analyses a circuit by writing node equations. He uses four moves, in this order. Learn the moves and the thirty formulas below become derivable in ten seconds each.

```
1.  Bias it:      which region is each device in? what is Vov of each?
2.  Large signal: sweep the input, see where it breaks
3.  Small signal: Av = −Gm · Rout          ← compute Gm and Rout separately
4.  Trade-off:    what did this cost in headroom, speed, noise, power?
```

---

# PART 1 — The device

## 1.1 Regions and the overdrive

```
V_ov ≡ V_GS − Vth                       "overdrive"

cutoff:      V_GS < Vth                 I_D = 0
triode:      V_DS < V_ov                I_D = μCox(W/L)[(V_GS−Vth)V_DS − V_DS²/2]
saturation:  V_DS ≥ V_ov                I_D = ½ μCox(W/L) V_ov² (1 + λV_DS)
deep triode: V_DS ≪ 2V_ov               R_on = 1/[μCox(W/L)(V_GS−Vth)]
```

_[Claude used visualize:show_widget]_

## 1.2 The three small-signal parameters

```
gm  = μCox(W/L)·Vov  =  √(2 μCox (W/L) I_D)  =  2 I_D / V_ov
rO  ≈ 1/(λ I_D)                        λ ∝ 1/L, so long devices have high rO
gmb = η·gm             η ≈ 0.1 … 0.2   body effect — only when the source moves
gm·rO = 2/(λ V_ov)     "intrinsic gain" — 5 to 10 in nanometer CMOS
```

Three things to lock in now, because every later result leans on them:

- **`gm = 2I_D/Vov` is the designer's form.** More `gm` at the same current means less overdrive — which means less headroom to spare and a fatter, slower device.
- **`gm·rO` doesn't depend on `I_D`.** You cannot buy gain with current. You buy it with channel length and low overdrive.
- **`gmb` appears only where the source is not tied to the bulk** — i.e. where the source *moves with the signal*: source follower, common gate, cascode device. Never in a grounded-source CS stage.

## 1.3 The three terminal impedances — the master key

Ninety percent of analysis is answering "what resistance does this node see?" There are only three answers, with two modifiers.

_[Claude used visualize:show_widget]_

Compress that entire diagram into one sentence and you have the most useful idea in Chapter 3:

> **The transistor is an impedance transformer with ratio `gm rO`.** A resistance at the source appears `gm rO` times *larger* when viewed from the drain. A resistance at the drain appears `gm rO` times *smaller* when viewed from the source.

The cascode is the first rule used deliberately; the common-gate input impedance is the second rule used deliberately. Nothing else is going on.

## 1.4 The other two rules

```
Av = − Gm · Rout            Gm = output short-circuit current per input volt
ω_p = 1/(R_node · C_node)   one pole per node; the dominant one has the biggest RC
headroom: each stacked device costs |Vov|; each diode connection costs |VGS|
```

---

# PART 2 — Common source: the workhorse

Input at the gate, output at the drain. It is the only configuration that gives you real voltage gain, and Razavi lists five variants differing only in the load.

## 2.1 Large-signal behaviour (do this first, always)

Sweep `Vin` from 0 upward on a resistively loaded CS stage:

```
Vin < Vth              M1 off,  Vout = VDD
Vth < Vin < Vin1       M1 saturated,  Vout = VDD − RD·½μCox(W/L)(Vin−Vth)²
Vin > Vin1             M1 in triode — gain collapses
```

The boundary (Razavi's point A) is where the drain falls to one threshold below the gate:

```
Vin1 − Vth = VDD − RD · ½μCox(W/L)(Vin1 − Vth)²
```

_[Claude used visualize:show_widget]_

The small-signal gain is nothing more than **the slope of that curve at your bias point** — that's Razavi's Eq. (3.8), `Av = ∂Vout/∂Vin`. Differentiate the parabola and you get `−RD μCox(W/L)(Vin−Vth) = −gm RD`. Same answer, two routes.

## 2.2 The five loads

_[Claude used visualize:show_widget]_

**Resistive load.** Rewrite `gm = 2I_D/Vov`:

```
|Av| = gm RD = 2·(I_D RD)/Vov = 2 × (dc voltage dropped across RD) / Vov
```

> **A resistively loaded stage's gain is twice the DC drop divided by the overdrive.** Gain of 10 at `Vov = 0.2 V` demands 1 V across `RD`. On a 1 V supply that is impossible — which is the whole reason resistors disappeared from IC amplifiers.

**Diode-connected load.** The load resistance is `1/gm2` (or `1/(gm2+gmb2)` for an NMOS load), so

```
Av = − gm1/gm2 = − √( μn(W/L)₁ / μp(W/L)₂ )            PMOS load, no body effect
Av = − [1/(1+η)] √( (W/L)₁ / (W/L)₂ )                   NMOS load, with body effect
```

Three properties worth memorising: the gain is a **ratio of dimensions**, so it's well controlled; it's **independent of bias current**; and the stage is **linear**, because `M1` squares and the diode square-roots. The price: low gain (doubling it costs a 4× size ratio) and a full `|VGS|` of headroom.

**Current-source load.** Maximum gain for two devices, at a cost of only `|Vov2|`:

```
Av = − gm1 (rO1 ‖ rO2)
```

Raise it further by lengthening both devices. This is the load in every op amp you've studied.

**The remaining two loads:**

_[Claude used visualize:show_widget]_

**Triode load.** Bias `M2` deep in triode so it behaves as a resistor:

```
Ron2 = 1 / [ μp Cox (W/L)₂ (VDD − Vb − |VthP|) ]        Av = −gm1 Ron2
```

Its one advantage over the diode load: `Vout,max = VDD`, not `VDD − |VthP|` — a triode load eats less headroom. Its fatal drawback, in Razavi's words: `Ron2` depends on `μpCox`, `Vb` and `VthP`, all of which drift with process and temperature, and generating a precise `Vb` needs extra circuitry. **Difficult to use in practice.**

**Active load.** Drive both gates. `M1` pulls harder while `M2` pushes less, so the transconductances add:

```
Av = − (gm1 + gm2)(rO1 ‖ rO2)
```

Same `Rout`, nearly double the `Gm`. The catch: since `VGS1 + |VGS2| = VDD`, the bias current is a strong function of supply and threshold variation. This is the CMOS inverter used as an analogue amplifier.

---

# PART 3 — Source degeneration

Put a resistor under the source and the stage regulates its own current.

_[Claude used visualize:show_widget]_

**The mechanism:** `Vin` rises → `I_D` rises → the drop across `RS` rises → the source rises → `V_GS` gets less than you applied. The stage eats part of its own input. That's negative feedback built from one resistor.

The form worth memorising is `Av = −RD/(1/gm + RS)`:

> **Gain = (resistance at the drain) ÷ (resistance at the source)** — where the transistor itself contributes `1/gm` to the source side.

The limit matters: for `RS ≫ 1/gm`, `Gm → 1/RS` and `Av → −RD/RS`, **independent of `gm`**. You have traded gain for linearity and process-insensitivity. And the boosted `Rout` is the entire foundation of the cascode — hold onto it.

---

# PART 4 — Source follower (common drain)

Input at the gate, output at the **source**, drain at `VDD`. It has no voltage gain to give; its job is impedance transformation and level shifting.

_[Claude used visualize:show_widget]_

```
General (load RS):        Av = gm RS / [1 + (gm + gmb) RS]
With a current-source bias (load = rO):  Av = gm rO/[1+(gm+gmb)rO] ≈ 1/(1+η)
Driving an external RL:   Av = RL / (RL + 1/gm)
```

**Why the gain is less than one, physically:** the source chases the gate, but it must always develop a `VGS` to carry the current. Worse, as the output rises, `V_SB` rises, the threshold rises through the body effect, and `VGS` has to grow further. The output is always losing the race by a hair — that's the `1/(1+η)`, typically 0.8–0.9.

**And because `η` depends on `V_SB`, which moves with the signal, the follower is nonlinear.** That's its biggest weakness.

**Razavi's warning, which is worth taking seriously:** followers are *not* efficient drivers. Driving `RL`, you get `RL/(RL + 1/gm)` — so if `1/gm ≈ RL` your gain is 0.5, whereas simply *making `RL` the load of a CS stage* gives `gm RL ≈ 1`. His rule: **avoid source followers unless they are absolutely necessary.**

Use them for: buffering a high-impedance node to a low-impedance one, and **level shifting** (the output sits one `VGS` below the input, which is sometimes exactly what you want).

---

# PART 5 — Common gate

Input at the **source**, output at the drain, gate at a fixed bias. The only non-inverting stage here.

_[Claude used visualize:show_widget]_

**Why it's non-inverting:** raise the source, and `V_GS` *shrinks* (the gate is fixed). Less current, less drop across `RD`, so `Vout` goes **up**. Input and output move together.

**The `Rin` expression is Tool 1 in action:** the drain load divided by the intrinsic gain, plus `1/(gm+gmb)`. And the result that surprises everyone the first time, which Razavi calls out explicitly: **if the drain load is an ideal current source, `Rin → ∞`.** The reason is physical, not algebraic — the device's total current is fixed by `I1`, so moving the source cannot change the current, so no current flows into the input. A common-gate stage has low input impedance *only if its drain load is small*. With an ideal current-source load the gain becomes `Av = (gm+gmb)rO + 1`.

Where it earns its keep:

- **A well-defined, low input resistance** — the natural way to match 50 Ω in an RF front end.
- **No Miller effect.** The gate is an AC ground, so `C_GD` couples the output to ground rather than back to the input. This makes it fast.
- **As a current buffer** — takes current in at the source, delivers it at the drain, into a high impedance.
- **It is the top half of a cascode**, which is where you actually meet it.

---

# PART 6 — Cascode

A CS stage with a common-gate device standing on its drain. The most important composite structure in analogue CMOS.

_[Claude used visualize:show_widget]_

**Derive it in one line** using Razavi's trick: to find `Rout`, view `M2` as a common-source device *degenerated by `rO1`*, and reuse the degeneration formula from Part 3:

```
Rout = [1 + (gm2+gmb2) rO2] rO1 + rO2  ≈  (gm2+gmb2) rO2 rO1
Av   = −Gm Rout ≈ −gm1 (gm2+gmb2) rO2 rO1 ≈ −(gm rO)²
```

**The cascode squares the intrinsic gain.** One transistor gives you 10; a cascode gives 100.

**The shielding intuition** — this is the part to actually understand. `M2` is a common-gate device, so the impedance looking into its source is tiny; node `X` therefore barely moves no matter how far `Vout` swings. Two payoffs follow:

1. `M1`'s drain sits still, so `M1` suffers almost no channel-length modulation — it behaves like a far better current source.
2. `M1`'s `C_GD` no longer sees a big swing, so the **Miller effect is suppressed**. Cascodes are fast *and* high-gain.

**Costs and variants:**

- Headroom: `Vout,min = Vov1 + Vov2`, and `Vb` must be set carefully (high enough for `M1`, low enough for `M2`).
- **Telescopic**: cascode the load too → `Av ≈ −gm1[(gm2rO2rO1) ‖ (gm3rO3rO4)]`, at four overdrives of swing.
- **Triple cascode**: `(gm rO)³`, but three overdrives — Razavi says usually too expensive.
- **Folded cascode**: input device replaced by the opposite type so it isn't stacked; `Rout = [1+(gm2+gmb2)rO2](rO1‖rO3) + rO2` — lower, because of the extra parallel resistance. Covered in full last lecture.
- Nanometer caveat: with limited headroom, cascode current sources are only *moderately* better than single devices.

---

# PART 7 — The differential pair

Two matched CS stages sharing a tail current source. Everything from Parts 2–6 applies to each half.

_[Claude used visualize:show_widget]_

```
Large signal:  I_D1 + I_D2 = ISS  always
               ΔVin,max = √2 · Vov         ← beyond this, one device takes all of ISS
gm at equilibrium = √( μCox (W/L) ISS )

Differential:  P is a virtual ground →  Av = −gm (rO ‖ R_load)   (half circuit)
Common mode:   P follows the input; drain currents don't change → rejected
With a finite tail resistance RSS:  Av,CM = −gm RD/(1 + 2gm RSS)
CMRR ≈ (1 + 2gm RSS) · gm/Δgm
```

**Why differential, in four lines you should be able to recite:** supply and substrate noise arrive as common mode and are rejected; the differential output doubles the swing; symmetry cancels even-order harmonics; and the tail source pins the bias so the operating point doesn't wander with input level.

---

# PART 8 — Current mirrors

The biasing element behind every current-source load you've drawn.

_[Claude used visualize:show_widget]_

---

**What to remember about mirrors:** the copy ratio is a **`W/L` ratio**, so it's accurate (same process, same temperature). But the diode-connected reference node sits at `VGS` below the rail, not `Vov` — **a diode connection always costs a threshold of headroom.** That single fact explains the five-transistor OTA's reduced input CM range, the mirror-loaded telescopic's reduced swing, and the cascode mirror's headroom bill. A cascode mirror gives `Rout ≈ gm4 rO4 rO2` at the cost of another `Vov` (or a full `VGS` if biased naively).

---

# PART 9 — Frequency response essentials

```
one pole per node:   ω_p = 1/(R_node · C_node)
dominant pole:       the node with the largest R·C — usually a high-impedance output
```

And the one effect that catches everybody:

_[Claude used visualize:show_widget]_

In a CS stage, `C_GD` is that bridge, so the input sees `C_GD(1 + gm RD)` — potentially enormous. **Miller multiplication is the main speed limit of the common-source stage.**

| Stage | Miller problem? | Why |
|---|---|---|
| Common source | **yes** | `C_GD` bridges an inverting gain |
| Cascode | largely suppressed | `M1` sees a low-gain load |
| Common gate | no | gate is an AC ground |
| Source follower | no | input and output move together — `C_GS` is bootstrapped |

---

# PART 10 — Master table

| Stage | `Av` | `Gm` | `Rin` | `Rout` | Sign | Headroom cost | Use for |
|---|---|---|---|---|---|---|---|
| CS, resistive | `−gm(rO‖RD)` = `−2V_RD/Vov` | `gm` | ∞ | `rO‖RD` | − | `I_D RD` | simple gain |
| CS, diode load | `−gm1/gm2` = `−√((W/L)₁/(W/L)₂)` | `gm1` | ∞ | `1/gm2‖rO` | − | `\|VGS2\|` | linear, defined gain |
| CS, current-source | `−gm1(rO1‖rO2)` | `gm1` | ∞ | `rO1‖rO2` | − | `\|Vov2\|` | max gain |
| CS, triode load | `−gm1 Ron2` | `gm1` | ∞ | `Ron2‖rO1` | − | ~0 | headroom-starved |
| CS, active load | `−(gm1+gm2)(rO1‖rO2)` | `gm1+gm2` | ∞ | `rO1‖rO2` | − | `\|Vov2\|` | gain at low current |
| CS, degenerated | `−RD/(1/gm+RS)` | `gm/[1+(gm+gmb)RS]` | ∞ | `[1+(gm+gmb)rO]RS+rO` | − | `I_D RS` | linearity, high `Rout` |
| Source follower | `1/(1+η)` < 1 | — | ∞ | `1/(gm+gmb)‖rO` | + | `VGS` shift | buffering, level shift |
| Common gate | `+(gm+gmb)RD` | `gm+gmb` | `1/(gm+gmb)+RD/(gm rO)` | `RD‖{rO[1+(gm+gmb)RS]+RS}` | + | `Vov` | 50 Ω match, no Miller |
| Cascode | `−gm1(gm2+gmb2)rO2rO1` ≈ `−(gm rO)²` | `gm1` | ∞ | `(gm2+gmb2)rO2rO1` | − | `Vov1+Vov2` | high gain, high `Rout` |
| Folded cascode | `−gm1[gm2rO2(rO1‖rO3)‖…]` | `gm1` | ∞ | lower than telescopic | − | 4 overdrives, no `VISS` | CM flexibility |
| Diff pair | `−gm(rO‖R_L)` per half | `gm` | ∞ | `rO‖R_L` | − | `VISS` + load | subtraction, CMRR |

---

# How to actually memorise this

Don't memorise the table. Memorise the **derivation tree** — five facts at the root, everything else grown from them:

```
ROOT 1:  gm = 2I_D/Vov,  rO = 1/(λI_D),  gm rO = 2/(λVov)
ROOT 2:  gate ∞ · drain rO · source 1/(gm+gmb)
ROOT 3:  a source resistance is multiplied by gm rO when seen from the drain;
         a drain resistance is divided by gm rO when seen from the source
ROOT 4:  Av = −Gm · Rout
ROOT 5:  each device costs |Vov|; each diode connection costs |VGS|
```

From those:

- CS gain = `−gm × (whatever is at the drain)` → all five load variants at once.
- Degeneration = ROOT 3 forward → `Rout` boosted, `Gm` reduced.
- Cascode = degeneration applied with `R_S = rO` → `(gm rO)²`.
- Common gate `Rin` = ROOT 3 backward → `RD/(gm rO) + 1/(gm+gmb)`.
- Follower `Rout` = ROOT 2, third entry.
- Every headroom formula = ROOT 5, counted device by device.

**Five sanity checks that catch most mistakes:**

1. Gate input → `Rin = ∞`. Source input → `Rin` small. No exceptions.
2. CS and cascode invert; common gate and follower do not.
3. `gmb` appears only where the source moves: follower, common gate, cascode device.
4. A diode connection costs `|VGS|`; a plain current source costs `|Vov|`.
5. If your gain formula still has `I_D` in it after substituting `gm` and `rO`, you probably made an error — intrinsic gain shouldn't depend on bias current.

_[Claude used quiz_display_v0]_

One closing note from Razavi's §3.7, *Choice of Device Models*, because it changes how you should use everything above: use the **simplest model that answers your question**. Drop `λ` and `gmb` for a first-pass hand analysis to get the intuition, add `rO` only when the gain depends on it, and save full models for the simulator. Hand analysis tells you *why*; SPICE tells you the last 10%.

If it would help, I can turn the master table plus the five root facts into a single printable one-page sheet you keep beside you while working problems.

## Human

explain this part to me

[attachment: excerpt_from_previous_claude_message.txt]

## Assistant

Let's slow down on these two — they're the "leftover" loads in Razavi's Chapter 3 taxonomy, and each one teaches a different lesson about the trade-offs you're always juggling in analog design.

---

# The triode load

## What "deep triode" means, physically

Go back to the region boundary: a MOSFET is in saturation when `V_DS ≥ V_ov`, and in triode when `V_DS` is smaller than that. **Deep triode** pushes this further — `V_DS` is kept *much* smaller than `V_ov`, not just below it.

_[Claude used visualize:show_widget]_

Zoom into that green corner of the curve near the origin and it's essentially a **straight line through zero** — exactly what a resistor's I-V curve looks like. That's the whole idea: bias a transistor way down in this corner, and small-signal-wise it behaves like a resistor whose value you can *set electronically* by choosing the gate bias, instead of etching a physical resistor into the die.

## The circuit and where the resistor value comes from

_[Claude used visualize:show_widget]_

Let's build the resistance formula from something you already know. For a triode-region PMOS, the drain current near `V_DS = 0` linearizes to

```
I_D ≈ μp Cox (W/L) (VGS − Vth) · VDS        (small VDS, triode)
```

That's Ohm's law in disguise — current proportional to voltage across the device — with the "conductance" being `μpCox(W/L)(VGS−Vth)`. Take the reciprocal, and for the PMOS `|VGS| = VDD − Vb` and its threshold enters as `|VthP|`:

```
Ron2 = 1 / [ μp Cox (W/L)2 (VDD − Vb − |VthP|) ]
```

Read this the way Razavi wants you to: the **gate-to-source overdrive of M2**, which is `VDD − Vb − |VthP|`, plays exactly the role `V_ov` played for `g_m` everywhere else in this course — bigger overdrive, bigger conductance, smaller `Ron2`. You're tuning a physical resistor by turning a voltage knob.

Then it's just a CS stage with that resistor as the load:

```
Av = −gm1 · Ron2
```

## Why this is attractive: `Vout,max = VDD`

Compare directly with the diode-connected load from the previous message. A diode-connected `M2` forces its own drain to sit at `VDD − |VGS2|` — you lose a full `|VGS|` just to keep the diode connection self-consistent, because gate and drain are wired together. In the triode load, `M2`'s gate is tied to a **separate** fixed bias `Vb`, not to its own drain. So the drain (= `Vout`) is free to rise all the way up toward `VDD`, limited only by `M1` needing to stay saturated at the bottom of its swing. **You saved a whole threshold voltage of headroom** — exactly the kind of win that matters on a 1 V supply.

## Why it's "difficult to use in practice"

This is the punchline, and it's the same punchline as the resistive-load story from lecture one, just wearing a different disguise. `Ron2` depends on:

```
μp Cox     → drifts with process, and with temperature
VthP       → drifts with process, and with temperature
Vb         → you have to generate this precisely, which needs extra circuitry
```

None of these are ratios of matched on-chip devices — they're **absolute** quantities, and absolutes drift. This is the exact same lesson from your very first lecture: `gm R_D` was untrustworthy because it depended on absolute device physics, and the fix was feedback with a resistor *ratio*. Here, `Ron2` is untrustworthy for the identical reason — it's built from raw process parameters, not a ratio.

So the triode load is a genuine trade: it buys back headroom versus the diode load, but it reintroduces the process-sensitivity problem that ratio-based loads (diode-connected, current mirrors) were specifically invented to avoid. Razavi's verdict — "difficult to use" — means: you'll see it in textbooks and in low-precision or headroom-starved corners of a design, but you won't find it anywhere a tight, guaranteed gain spec matters.

---

# The active load

## The idea: stop wasting the second transistor

In every load you've seen so far — resistor, diode, triode, current source — the *load* transistor (or resistor) is a passive bystander. Its gate sits at a fixed DC voltage; it never sees the input signal; all it contributes is an impedance for `M1`'s current to push against. The active load asks: **why waste that second transistor's amplifying ability?**

_[Claude used visualize:show_widget]_

This is literally a **CMOS inverter** — the same six-transistor-per-gate structure from digital logic — being reused as a linear analog amplifier by biasing it in its high-gain transition region instead of slamming it to one rail or the other.

## Why the two transconductances *add* instead of fighting

Walk through it slowly, because the sign logic is the whole insight:

- `Vin` rises a little.
- `M1`'s `V_GS` rises → `M1` wants to pull **more** current out of the output node → pulls `Vout` **down**.
- At the *same instant*, `M2`'s `V_SG` (= `VDD − Vin`) **shrinks**, since the PMOS gate rose too → `M2` wants to push **less** current into the output node → this also lets `Vout` sag **down**.

Both transistors are cooperating to move `Vout` in the same direction for the same input wiggle. In small-signal terms, `M1` contributes a current `gm1·vin` pulling down, and `M2` contributes a current `gm2·vin` that is *also* effectively pulling in the same direction (less push-up = extra pull-down, relative to the fixed bias case). So the two short-circuit output currents **superpose**:

```
Gm = gm1 + gm2        (instead of just gm1, as with a fixed-gate current-source load)
```

`Rout` doesn't change — it's still `rO1 ‖ rO2`, because neither device's small-signal drain resistance cares who's driving its gate. Only `Gm` grows. Using `Av = −Gm·Rout`:

```
Av = −(gm1 + gm2)(rO1 ‖ rO2)
```

Compare this line by line with the plain current-source load, `Av = −gm1(rO1‖rO2)`. Same `Rout`, but you've picked up a "free" `gm2` of transconductance — for the price of zero extra devices and zero extra current, since `M2` was already sitting there anyway. That's the appeal: **more gain per microamp of bias current** than a passive load gives you.

## Why the bias current is fragile — the catch

Here's the part that makes this circuit hard to bias reliably. Since both gates are tied to the same `Vin`, and the two source terminals sit at the two supply rails, KVL around the loop forces:

```
VGS1 + |VGS2| = VDD
```

This is not a free choice — it's a **constraint**. Given `VDD`, the two `V_GS` magnitudes must sum to it. But `V_GS = Vth + V_ov`, and `I_D` depends *exponentially-steep* on `V_ov` through the square law (`I_D ∝ V_ov²`). So:

```
VDD = Vth,n + Vov1 + |Vthp| + |Vov2|
```

If `VDD` drifts slightly, or if `Vth,n` and `|Vthp|` drift with temperature or process (and they never track each other perfectly — an NMOS and PMOS threshold are set by different implants), the overdrives `Vov1` and `Vov2` have to absorb all of that drift. And because `I_D` depends on `V_ov` squared, a small change in overdrive produces a disproportionately large change in bias current. **The DC operating point of this circuit is at the mercy of exactly the process and supply variations that feedback is normally used to suppress** — and here there's no feedback loop protecting it, because the "load" transistor's gate is slaved to the signal, not to a stable reference.

This is precisely why, despite the attractive `gm1+gm2` gain boost, the active-load CS stage rarely appears as a stand-alone biased amplifier in production analog design — it needs external circuitry (or operation only inside a tightly-controlled feedback loop) to pin down its operating point.

---

## Putting the two loads side by side

| | Triode load | Active load |
|---|---|---|
| What's driven | `M2`'s gate → fixed `Vb` | `M2`'s gate → tied to `Vin` |
| Region of `M2` | deep triode (acts as a resistor) | saturation (acts as an amplifier) |
| Gain | `−gm1 Ron2` | `−(gm1+gm2)(rO1‖rO2)` |
| Headroom win | `Vout,max = VDD` (no threshold lost) | same as current-source load |
| What goes wrong | `Ron2` drifts with `μpCox`, `VthP`; needs a precision `Vb` generator | `VGS1+\|VGS2\|=VDD` constraint makes `I_D` swing wildly with process/temperature |
| One-line verdict | headroom-efficient but process-fragile | gain-efficient but bias-fragile |

Both circuits teach the same underlying lesson from a different angle: **whenever you reach for an "absolute" quantity — a raw `μCox`, a raw `Vth`, a fixed voltage generated from nothing — you're signing up for process and temperature drift.** The loads that survive into real op-amp designs (diode-connected, current-source, cascoded current mirrors) are the ones built from *ratios* and from devices that sit inside a larger biasing/feedback structure that stabilizes them — never from a lone absolute resistor value or a delicately balanced KVL constraint standing on its own.

## Human

this is the level of questions you will be helping me solve analyse them very very carefully and find the solutions which you can also i will attach the solutions of some of the tutorials so you can verify the answers, i am attaching these questions so you can help me learn this topic on the level that these questions become really really easy for me like really easy look for the best problem solving methods and always draw the diagram in every problem and make sure you are teaching me according to the level of these problems and i am well equipped to solve these problems research on razavis methods and his notes and his teaching methods and his problem solving methods and how to solve these questions most effectively, and make sure your teachings are consistent across whatever theory you have taught and these questions and how you solved them, for now analyse all of them, make a note of all of the questions and give me the solutions of those problems which can be fully solved by the thoery we have learnt uptil now in the lectures i have pasted earlier, and keep solving problems when i post more lectures and we cover the thoery to solve those problems

[attachment: 1789657566261_image.png]

[attachment: 1789768804938_image.png]

[attachment: 1789768819021_image.png]

[attachment: 1789768826824_image.png]

[attachment: 1789768839548_image.png]

[attachment: 1789768851534_image.png]

[attachment: 1789768873401_image.png]

[attachment: 1789768889549_image.png]

[attachment: 1789768899408_image.png]

[attachment: 1789768911934_image.png]

[attachment: 1789768925760_image.png]

[attachment: 1789768940657_image.png]

[attachment: 1789768952726_image.png]

[attachment: 1789768964686_image.png]

[attachment: 20260820_225244.jpg]

[attachment: 20260820_225249.jpg]

[attachment: 20260820_225252.jpg]

[attachment: 20260820_234746.jpg]

[attachment: 20260820_234752.jpg]

## Assistant

I've read all nineteen images carefully. Let me first give you the map, then the method that cracks all of them, then the solutions.

---

# PART 1 — Inventory of every question

| # | Source | Topic | Solvable with theory so far? |
|---|---|---|---|
| **E1** | Exam paper, Q1(a–e) | 5-transistor OTA: sizing, gain, swing, BW, buffer BW | ✅ **Yes — fully** |
| **T1.Q1** | Tutorial 1 | Diff pair biasing design: R, RD, W/L, CMIR | ✅ Yes (you have the key) |
| **T1.Q2** | Tutorial 1 | Diode-loaded diff pair: half circuit, `Ad`, sizing | ✅ Yes (you have the key) |
| **T1.Q3** | Tutorial 1 | Current-source-loaded diff pair: W/L and `Ad` | ✅ Yes |
| **T1.Q4** | Tutorial 1 | `RSS`-biased diff pair: `VCM`, `RD`, CM gain, triode onset | ✅ Yes (you have the key) |
| **T1.Q5** | Tutorial 1 | Mirror-loaded diff amp: find `I` for a target gain | ✅ Yes |
| **T2.Q1** | Tutorial 2 | Triode `gm`/`rO` derivation + diff pair gain/swing + gain at triode entry | ✅ Yes |
| **T2.Q2** | Tutorial 2 | Telescopic cascode: min PMOS width, swing, open-loop gain | ✅ Yes |
| **T2.Q3** | Tutorial 2 | Folded-cascode design from swing + power budget | ✅ Yes |
| **T3.Q1** | Tutorial 3 | Telescopic: max input CM, `VX`, buffer window, `Vb2` range | ✅ Yes — this *is* our last lecture |
| **T3.Q2** | Tutorial 3 | CM level at cascode drains, gain, swing | ✅ Yes |
| **T3.Q3** | Tutorial 3 | CM at X,Y; sizing for 200 mV swing; gain | ✅ Yes |
| **T4.Q1** | Tutorial 4 | Cascode with auxiliary-biased device | ⚠️ Needs **gain boosting** (Razavi §9.3) |
| **T4.Q2** | Tutorial 4 | Gain-boosting stage: `Vbp`, regions, `λ` for 2550 V/V | ❌ Needs gain boosting |
| **T4.Q3** | Tutorial 4 | Gain-boosted regulated cascode with `R1,R2,R3` | ❌ Needs gain boosting |
| **T5.Q1** | Tutorial 5 | Telescopic sizing for output CM and `VP` | ⚠️ Mostly yes; CMFB context |
| **T5.Q2** | Tutorial 5 | CMFB network: NMOS/PMOS input choice, loop gain | ❌ Needs **CMFB** (Razavi §9.7) |
| **T5.Q3** | Tutorial 5 | CM gain, CMRR with and without CMFB | ❌ Needs CMFB |

**Verdict: 12 of 18 are fully solvable right now.** Tutorial 4 needs one more lecture (gain boosting), Tutorial 5 needs two (CMFB + CMRR). Everything else is in reach today.

---

# PART 2 — The method that solves all of them

Every single one of these problems — from the simplest biasing question to the folded-cascode design — is the **same four-step procedure**. Razavi does it identically every time. Internalise this and these stop being separate problems.

_[Claude used visualize:show_widget]_

## The toolkit — everything you actually plug in

```
BRIDGE EQUATION (used in both directions)
  I_D = ½ µCox (W/L) Vov²     ⟺     Vov = √( 2I_D / [µCox(W/L)] )
                              ⟺     (W/L) = 2I_D / [µCox·Vov²]

SMALL SIGNAL
  gm = 2I_D/Vov = √(2 µCox (W/L) I_D)
  rO = 1/(λ I_D)     or     rO = V_A/I_D  with V_A = |V'_A|·L

THE TWO FENCES (saturation)
  NMOS:  V_D ≥ V_G − Vth            PMOS:  V_D ≤ V_G + |Vth|

NODE WALKING
  NMOS:  V_S = V_G − VGS            PMOS:  V_S = V_G + |VGS|

ANSWERS
  Av (single stage)   = gm (rO,n ‖ rO,p)
  Av (cascode)        = gm1 [ gm_c rO_c rO_low ‖ (load branch) ]
  Vout,max            = VDD − Σ|Vov| going up   (add |Vth| if a diode connection biases the gate)
  Vout,min            = Σ Vov going down        (or Vin,CM − Vth for the input device's drain)
  Vin,CM,min          = V_ISS + VGS1
  Vin,CM,max          = V_D1 + Vth1
  ω−3dB               = 1/(Rout·CL)            f−3dB = 1/(2π Rout CL)
  Buffer (β=1)        = Rout → 1/gm,   f−3dB → gm/(2π CL)
```

**The one thing that varies between problems is which way you run the bridge equation.** Given `W/L` → find `Vov`. Given a CM limit or a swing spec → find `Vov`, then find `W/L`. That's the entire difference between an "analysis" question and a "design" question.

---

# PART 3 — Exam Question 1 (full solution)

_[Claude used visualize:show_widget]_

**Note on the cut-off text:** the scan cuts `(W/L)₅ = (W/L)₆ = 3…`. The value that makes the arithmetic come out exact is **30**, so I'll use that — and I'll show you the one line to change if the real number differs.

### Step 1 — branch currents

`M6` is diode-connected and carries `I1 = 120 µA`. `M5` is the same size, so it mirrors 1:1 → `ISS = 120 µA`. The pair splits it: **`ID1 = ID2 = ID3 = ID4 = 60 µA`**.

### Step 2 — (a) sizes of M1 and M3

Run the two CM limits *backwards* to extract the overdrives. This is the key move — the examiner gave you the CM limits precisely so you could do this.

**Upper limit gives you the PMOS.** The drain of `M1` is pinned at `VDD − |VGS3|` by the diode connection, so:

```
Vin,CM,max = VDD − |VGS3| + Vtn
1.45 = 1.8 − |VGS3| + 0.4    ⟹   |VGS3| = 0.75 V   ⟹   |Vov3| = 0.75 − 0.5 = 0.25 V
```
```
(W/L)3 = 2 I_D /(µpCox · Vov3²) = 2(60µ)/(100µ × 0.0625) = 19.2
```

**Lower limit gives you the NMOS.** First find the tail's overdrive:

```
Vov5 = √(2·ISS /[µnCox (W/L)5]) = √(240µ /(200µ × 30)) = √0.04 = 0.20 V      ← change this line if (W/L)5 ≠ 30

Vin,CM,min = Vov5 + VGS1
0.75 = 0.20 + VGS1   ⟹   VGS1 = 0.55 V   ⟹   Vov1 = 0.55 − 0.4 = 0.15 V
```
```
(W/L)1 = 2(60µ)/(200µ × 0.0225) = 26.67
```

### The bias table (everything else falls out of this)

| Device | `I_D` | `Vov` | `gm = 2I_D/Vov` | `rO = 1/(λ I_D)` |
|---|---|---|---|---|
| M1, M2 (N) | 60 µA | 0.15 V | **0.80 mS** | `1/(0.05×60µ)` = **333 kΩ** |
| M3, M4 (P) | 60 µA | 0.25 V | 0.48 mS | `1/(0.1×60µ)` = **167 kΩ** |
| M5 (N) | 120 µA | 0.20 V | — | — |

### (b) Gain

```
Rout = rO2 ‖ rO4 = 333.3k ‖ 166.7k = 111.1 kΩ
Av = gm1,2 · Rout = 0.80 mS × 111.1 kΩ = 88.9 V/V   (≈ 39 dB)
```

### (c) Maximum output swing

```
Vout,max = VDD − |Vov4| = 1.8 − 0.25 = 1.55 V
Vout,min = Vin,CM − Vtn ,  lowest possible at Vin,CM = Vin,CM,min
         = 0.75 − 0.4 = 0.35 V      (equivalently Vov5 + Vov2 = 0.20 + 0.15 ✓)

Swing = 1.55 − 0.35 = 1.20 V
```

The two routes to `Vout,min` agreeing is your built-in check — always do it.

### (d) 3-dB bandwidth with `CL = 4 pF`

```
f−3dB = 1/(2π Rout CL) = 1/(2π × 111.1k × 4p) = 358 kHz
```

### (e) Bandwidth as a unity-gain buffer

Shorting output to `Vin2` gives `β = 1`, so the output resistance collapses from `Rout` to `1/gm`:

```
Rout,closed = 1/gm2 = 1/0.80m = 1.25 kΩ
f−3dB = gm2 /(2π CL) = 0.80m/(2π × 4p) = 31.8 MHz
```

**Check it against GBW:** `88.9 × 358 kHz = 31.8 MHz` ✓. Gain fell by 88.9×, bandwidth rose by 88.9×. Exactly the trade from the settling-time lecture.

---

# PART 4 — Tutorial 1, all five questions

## T1.Q1 — verifying your handwritten solution

Your key: `RD = 9 kΩ`, `(W/L)₁,₂ = 22.22`, `(W/L)₃ = 44.44`, `(W/L)₄ = 22.22`, `R = 13 kΩ`, CMIR `−0.25 V to +0.35 V`. **All correct.** The reasoning chain, so you can reproduce it cold:

```
1. Currents:  Q3 carries 0.2 mA (tail), Q1 = Q2 = 0.1 mA, Q4 = 0.1 mA (mirror reference)
2. RD:        VD = 0 V required  ⟹  RD = (VDD − 0)/I_D = 0.9/0.1m = 9 kΩ
3. Sizes:     I_D = ½ (400µ)(W/L)(0.15)²  = 4.5µ·(W/L)
              0.1 mA → 22.22 ;  0.2 mA → 44.44
4. R:         VGS4 = 0.35 + 0.15 = 0.5 V,  so VG4 = VD4 = VSS + 0.5 = −0.4 V
              R = (VDD − VD4)/0.1m = (0.9 + 0.4)/0.1m = 13 kΩ
5. CMIR:      min = VSS + Vov3 + VGS1 = −0.9 + 0.15 + 0.5 = −0.25 V
              max = VD1 + Vtn        = 0 + 0.35         = +0.35 V
```

The one step students drop: in line 4, `VD4 = VG4` **because `Q4` is diode-connected** — that's what lets you find `R`.

## T1.Q2 — diode-loaded diff pair

Your key is right. The reasoning:

**(a)** Half circuit = one CS stage loaded by a diode-connected PMOS. At the output you see three things in parallel — the input device's `rO`, the load's `rO`, and the load's `1/gm`:

```
Ad = gm1,2 [ rO1,2 ‖ rO3,4 ‖ 1/gm3,4 ]
```

**(b)** `1/gm3,4` is far smaller than either `rO`, so it dominates:

```
Ad ≈ gm1,2/gm3,4 = √( 2µnCox(W/L)1,2·I_D ) / √( 2µpCox(W/L)3,4·I_D ) = √( µn(W/L)1,2 / [µp(W/L)3,4] )
```

The `I_D` cancels — **the gain of a diode-loaded stage is independent of bias current.** That's the signature property; expect it as a viva question.

**(c)** With `µn = 4µp` and equal `L`:

```
10 = √( 4 · W1,2/W3,4 )  ⟹  W1,2/W3,4 = 25
```

## T1.Q3 — current-source-loaded diff pair (0.18 µm)

```
Step 1:  I_D = I/2 = 100 µA per side
Step 2:  µpCox = µnCox/4 = 100 µA/V²;   L = 2 × 0.18 = 0.36 µm
         V_A = |V'_A|·L = 10 × 0.36 = 3.6 V  →  rO = 3.6/100µ = 36 kΩ  (both n and p)

Sizing from |Vov| = 0.2 V:
  (W/L)1,2 = 2I_D/(µnCox Vov²) = 200µ/(400µ × 0.04) = 12.5
  (W/L)3,4 = 2I_D/(µpCox Vov²) = 200µ/(100µ × 0.04) = 50

Step 4:  gm1,2 = 2I_D/Vov = 200µ/0.2 = 1 mA/V
         Ad = gm1,2 (rO2 ‖ rO4) = 1m × 18k = 18 V/V
```

Note how `V_A = |V'_A|·L` replaces `rO = 1/(λ I_D)` — same quantity, Sedra-Smith's notation instead of Razavi's. `λ = 1/V_A`.

## T1.Q4 — `RSS`-biased pair (verifying your key)

Your answers `VCM = 2.33 V`, `RD = 5.06 kΩ`, `VD = 2.47 V`, `ACM = −1.922`, `ΔVCM = 0.29 V` are **all correct**. Part (d) is the one worth drawing, because the `2RSS` is where everyone slips:

_[Claude used visualize:show_widget]_

**Why `2RSS`:** for a common-mode input both halves carry the *same* signal current `i`, so `2i` flows through `RSS` and the tail node rises by `2i·RSS`. Splitting `RSS` into two parallel `2RSS` resistors leaves each half circuit identical — and now it is just a **source-degenerated CS stage**, exactly Part 3 of the theory lecture:

```
ACM = −RD/(1/gm + 2RSS) = −5.06k/(0.633k + 2k) = −1.92 V/V
```

**(e)** `Q1` enters triode when its drain falls to one threshold below its gate. Raise `VCM` by `ΔVCM`: the gate rises by `ΔVCM` while the drain rises by only `ACM·ΔVCM` (a *negative* number, so it falls). Setting the two equal at the boundary:

```
VD + ACM·ΔVCM = VCM + ΔVCM − Vtn
ΔVCM = (VD − VCM + Vtn)/(1 − ACM) = (2.47 − 2.33 + 0.7)/(1 + 1.92) = 0.29 V
```

## T1.Q5 — find `I` for a gain of 20 V/V

This one is a nice trick question, because the gain **falls as current rises**:

```
Ad = gm1 (rO2 ‖ rO4),   with rO = |V_A|/I_D = 5/I_D  each  ⟹  rO2‖rO4 = 2.5/I_D
gm1 = √(2 k'(W/L) I_D) = √(8m · I_D)

Ad = √(8m·I_D) × 2.5/I_D = 2.5√(8m)/√I_D = 0.2236/√I_D

20 = 0.2236/√I_D   ⟹   √I_D = 0.01118   ⟹   I_D = 125 µA   ⟹   I = 250 µA
```

**Check:** `gm = √(2×4m×125µ) = 1 mA/V`, `rO = 5/125µ = 40 kΩ`, parallel `= 20 kΩ`, `Ad = 1m × 20k = 20` ✓

The structural lesson worth carrying: `Ad ∝ 1/√I_D`. Gain *decreases* with bias current, because `gm ∝ √I_D` grows slower than `rO ∝ 1/I_D` shrinks. This is the same `gm rO = 2/(λVov)` fact wearing a different hat — you can't buy gain with current.

---

# Where this leaves us

**Done today:** Exam Q1 (all five parts) and Tutorial 1 (all five questions, with your three handwritten solutions confirmed correct).

**Next, and fully within reach right now — I'll work these in my next message:**

- **Tutorial 2** — Q1 (triode `gm`/`rO`, diff-pair gain and swing, gain when the PMOS dips 50 mV into triode), Q2 (telescopic: minimum PMOS width for `M3` saturation, swing, open-loop gain ≈ 1300 V/V), Q3 (folded-cascode design from a 2.4 V swing and 6 mW budget).
- **Tutorial 3** — Q1 is literally last lecture's buffer-window derivation with numbers on it; Q2 and Q3 are folded-cascode/telescopic CM-level problems.

**Blocked on theory:** Tutorial 4 needs **gain boosting** (Razavi §9.3 — the auxiliary amplifier that raises `Rout` to `gm rO × gm rO × A_aux`), and Tutorial 5 needs **common-mode feedback** (§9.7) plus the CMRR treatment. Post those lectures and I'll clear both tutorials the same way.

## Human

also i need you to make a list of all the topics i need to study before starting these lectures like look for razavi notes like you did earlier and you found out all the amplifier configurations and stuff i need to know simiilarly do the same but for everything i need to know before starting these lectures, refer the book, lecture notes any online resources on this topic, razavi etc anything and then make a prereq guide on everything i need to know before starting this it should help me master the prerequisites thoroughly

## Assistant

_[Claude used bash_tool]_

_[Claude used web_search]_

I pulled the book's full table of contents down to the subsection level, plus Razavi's own preface where he explains the intended dependency chain: Chapter 2 gives the device, Chapters 3–5 build "efficient analytical tools for quantifying the behavior of basic circuits **by inspection**," Chapters 6–7 add the two imperfections (frequency response and noise), Chapter 8 gives feedback — and only then does Chapter 9 (your lectures) make sense.

Here is the complete prerequisite guide, built from that structure and aimed specifically at your tutorials.

---

# The dependency map

_[Claude used visualize:show_widget]_

---

# TIER 0 — The toolkit you must already have

Not from Razavi, but every derivation assumes it. If any of these is shaky, fix it first — it will cost you marks everywhere.

| Topic | What you must be able to do | Used in |
|---|---|---|
| KCL / KVL by inspection | Write node currents without hesitation; sum voltages around a device stack | Every headroom calculation |
| Thévenin & Norton | Convert a controlled source + resistor either way | `Gm·Rout`, the folded-cascode current divider |
| Series/parallel & the divider laws | `R1‖R2`, voltage divider, **current divider** `IA = I·RB/(RA+RB)` | `rO1‖rO2` everywhere; folded-cascode `Gm` |
| Laplace & transfer functions | `H(s)`, poles, `u(t)↔1/s`, `e^(−at)↔1/(s+a)`, partial fractions | Settling-time lecture |
| Bode plots | 20 dB/dec per pole, corner = `1/τ`, dB↔ratio | GBW, stability |
| First-order RC | `τ = RC`, step response `1−e^(−t/τ)`, `f−3dB = 1/(2πRC)` | Every bandwidth question |
| dB arithmetic | `20log₁₀` for gain; 40 dB = 100× | Loop-gain specs |
| Unit discipline | µA, mA/V (= mS), kΩ, pF, rad/s vs Hz | The single biggest source of lost marks |

---

# TIER 1 — Chapter 2: Basic MOS Device Physics

**Sections:** 2.1 General Considerations · 2.2 MOS I/V Characteristics (threshold, I/V derivation, transconductance) · 2.3 Second-Order Effects · 2.4 MOS Device Models (layout, **capacitances**, small-signal model, SPICE, NMOS vs PMOS, long vs short channel)

## Must-know results

```
THRESHOLD & REGIONS
  Vth = VTH0 + γ[ √(2Φ_F + V_SB) − √(2Φ_F) ]          γ = √(2qε_si N_sub)/Cox
  Vov = VGS − Vth
  triode:      I_D = µCox(W/L)[(Vov)V_DS − V_DS²/2]
  deep triode: R_on = 1/[µCox(W/L)·Vov]
  saturation:  I_D = ½µCox(W/L)Vov²(1 + λV_DS)         λ ∝ 1/L

SMALL SIGNAL
  gm  = µCox(W/L)Vov = √(2µCox(W/L)I_D) = 2I_D/Vov
  gmb = gm · γ/(2√(2Φ_F+V_SB)) = η·gm       η ≈ 0.1–0.2
  rO  = 1/(λI_D) = V_A/I_D

CAPACITANCES (the part everyone skips)
  C_GS ≈ (2/3)WLCox + WC_ov      (saturation)
  C_GD ≈ WC_ov                    (saturation — overlap only)
  C_DB, C_SB = junction caps, bias-dependent
  f_T ≈ gm/(2π C_GS) ≈ 1.5µ Vov /(2πL²)
```

The piece I have *not* drawn for you yet, and which you need before Chapter 6:

_[Claude used visualize:show_widget]_

**Why you need it:** every `Vov`/`W/L` conversion in your tutorials; the `γ = 0` assumption printed on your tutorial sheets is meaningless unless you know what `γ` *is*; and `C_GS`, `C_GD` are the raw material of every pole in Chapter 6.

**Self-check:** Can you state the saturation condition from the channel-pinch-off picture, not from memory? Can you explain why `λ ∝ 1/L`? Can you say why `C_GD` in saturation is *only* overlap capacitance? Can you write `f_T` and explain why short channels are fast?

**Status: mostly covered** in our lectures — except capacitances, body-effect algebra, and subthreshold conduction.

---

# TIER 2 — Chapter 3: Single-Stage Amplifiers

**Sections:** 3.2 General Considerations · 3.3 Common-Source (resistive, diode, current-source, active, triode, degenerated) · 3.4 Source Follower · 3.5 Common-Gate · 3.6 Cascode + Folded Cascode · 3.7 Choice of Device Models

**Status: ✅ fully covered** — this is the master-table lecture. Your checklist:

```
□ Av of all five CS loads, and why |Av| = 2·(dc drop)/Vov kills resistive loads
□ Gm and Rout of a degenerated stage — and that Rout ≈ gm rO RS
□ Follower: Av = 1/(1+η), Rout = 1/(gm+gmb), why it's an inefficient driver
□ Common gate: Av = +(gm+gmb)RD, Rin = 1/(gm+gmb) + RD/(gm rO), Rin → ∞ with an ideal load
□ Cascode: Rout ≈ gm rO², shielding, Miller suppression, headroom cost
□ The three terminal impedances, and "up multiplies, down divides by gm rO"
□ Av = −Gm·Rout as the universal method
```

---

# TIER 3 — Chapter 4: Differential Amplifiers

**Sections:** 4.1 Single-Ended vs Differential · 4.2 Basic Differential Pair (qualitative, quantitative, **degenerated pair**) · 4.3 **Common-Mode Response** · 4.4 Differential Pair with MOS Loads · 4.5 Gilbert Cell

## Must-know results

```
LARGE SIGNAL
  I_D1 + I_D2 = I_SS  always
  I_D1 − I_D2 = ½µCox(W/L)·ΔVin·√( 4I_SS/[µCox(W/L)] − ΔVin² )
  ΔVin,max = √2 · Vov          ← beyond this, one device takes all of I_SS
  Gm is maximum at ΔVin = 0:   Gm = √( µCox(W/L)·I_SS )

SMALL SIGNAL (half circuit — valid only for a symmetric pair)
  Ad = −gm (rO ‖ R_load)
  degenerated pair:  Ad = −R_D/(1/gm + R_S/2)

COMMON MODE — the part your tutorials test
  A_CM = −gm R_D/(1 + 2gm R_SS) = −R_D/(1/gm + 2R_SS)
  with load mismatch ΔR_D:  A_CM→DM = −ΔR_D/(1/gm + 2R_SS)
  CMRR ≈ (1 + 2gm R_SS)·gm/Δgm

INPUT CM RANGE
  Vin,CM,min = V_ISS + VGS1        Vin,CM,max = V_D1 + Vth1
```

**Why you need it:** T1.Q4 is pure §4.3. The `2R_SS` trick and "CM-to-DM conversion by mismatch" is the foundation of everything in Tutorial 5.

**Self-check:** Why does the tail node act as a virtual ground for differential signals but *not* for common-mode? Why does a differential pair with perfectly matched loads have zero CM-to-DM gain no matter how bad `R_SS` is? Sketch `I_D1`, `I_D2` versus `ΔVin` and mark `√2 Vov`.

**Status: ✅ covered** (large-signal limit, half circuit, CM gain, CMRR) — revise §4.2.3 degenerated pair and §4.4 MOS loads.

---

# TIER 4 — Chapter 5: Current Mirrors and Biasing Techniques

**Sections:** 5.1 Basic Mirrors · 5.2 **Cascode Mirrors** · 5.3 **Active Current Mirrors** (large-signal, small-signal, **CM properties**, other properties of the five-transistor OTA) · 5.4 Biasing (CS, CG, follower, differential pair)

## Must-know results

```
BASIC MIRROR
  I_out/I_REF = (W/L)₂/(W/L)₁            Rout = rO2
  error sources: ΔV_DS through λ, and Vth/dimension mismatch
  the diode-connected node sits at VGS — a full threshold of headroom

CASCODE MIRROR
  Rout ≈ (gm+gmb)·rO²                     accuracy hugely improved
  naive biasing costs VGS + Vov; high-swing biasing costs only 2Vov

ACTIVE MIRROR / FIVE-TRANSISTOR OTA  (§5.3 — this IS your exam question)
  Gm = gm1,2      (the mirror adds the two half-currents: no factor of 2 lost)
  Rout = rO2 ‖ rO4        Av = gm1,2(rO2 ‖ rO4)
  mirror pole at node X ≈ gm3/C_X
  systematic offset if V_DS3 ≠ V_DS4
```

**Why you need it:** the exam question and half the tutorials are five-transistor OTAs. §5.4 (biasing) is exactly the `M6`/`I1` reference branch in your exam figure.

**Self-check:** Why does the five-transistor OTA have `Gm = gm1,2` and not `gm1,2/2`? Why does a cascode mirror biased the naive way waste a threshold, and how does high-swing biasing recover it? Why is the mirror pole a *stability* problem and not a *gain* problem?

**Status: ✅ mostly covered** — revise §5.2 cascode-mirror biasing and §5.3.3 CM properties (that one feeds Tutorial 5).

---

# TIER 5 — Chapter 6: Frequency Response

**Sections:** 6.1 Miller Effect + **Association of Poles with Nodes** · 6.2 CS · 6.3 Source Followers · 6.4 CG · 6.5 Cascode · 6.6 Differential Pair · 6.7 Gain-Bandwidth Trade-offs · Appendices: Extra Element Theorem, **Zero-Value Time Constant method**, Dual of Miller

## Must-know results

```
MILLER:  a bridging C_F across a gain of −A looks like C_F(1+A) at the input,
         C_F(1+1/A) ≈ C_F at the output

ASSOCIATION OF POLES:  ω_pj = 1/(R_j C_j) for each node j — the fastest hand method

CS STAGE
  input pole   ≈ 1/{ R_S [ C_GS + C_GD(1+gm R_D) ] }
  output pole  ≈ 1/{ R_D (C_DB + C_GD + C_L) }
  right-half-plane zero at ω_z = gm/C_GD

CG / CASCODE:   no Miller;  cascode node X pole ≈ (gm+gmb)/C_X
SOURCE FOLLOWER: wide band, but output impedance is inductive → can ring
GBW:  one-pole circuit → gain × bandwidth is constant = gm/C_L for a one-stage op amp
```

**Why you need it:** every "3-dB bandwidth" part of your exam; the mirror pole; and you cannot even discuss CMFB loop stability without it.

**Self-check:** Which node sets the dominant pole in a five-transistor OTA, and why? Why does a cascode escape Miller multiplication? Can you use the zero-value time constant method to estimate the −3 dB frequency of a CS stage in under two minutes?

**Status: ⚠️ partly covered** — we did Miller, poles-per-node, and GBW. **Gap:** per-stage pole expressions and the ZVTC method.

---

# TIER 6 — Chapter 7: Noise

**Sections:** 7.1 Statistics (spectrum, SNR, **noise analysis procedure**) · 7.2 Thermal and Flicker Noise · 7.3 Representation in Circuits · 7.4 Noise in Single-Stage Amplifiers · 7.5 In Current Mirrors · 7.6 **In Differential Pairs** · 7.7 Noise-Power Trade-off · 7.8 Noise Bandwidth

## Must-know results

```
THERMAL (MOSFET channel):  I_n² = 4kT·γ·gm        γ ≈ 2/3 (long channel)
                 referred to the gate:  V_n² = 4kT·γ/gm
RESISTOR:        V_n² = 4kTR          or  I_n² = 4kT/R
FLICKER:         V_n² = K/(Cox·W·L·f)     → large devices for low 1/f noise
CORNER FREQUENCY: where flicker = thermal

DIFFERENTIAL PAIR (input-referred):
  V_n,in² = 2·[ 4kTγ/gm1,2 ] · [ 1 + gm,load/gm1,2 ]
  ⟹ want LARGE gm on the inputs, SMALL gm on the loads (large |Vov,load|)
```

**Why you need it:** Razavi's §9.12 (op amp noise) and the noise-versus-swing trade-off I flagged in the performance-parameters lecture — lowering the load overdrive buys swing but raises `gm,load` and therefore noise.

**Self-check:** Why does a PMOS input pair usually beat NMOS for flicker noise? Why does the load pair's noise enter scaled by `gm,load/gm,input`? What is the noise–power trade-off, quantitatively?

**Status: ⚠️ only the concepts covered.** Read §7.2, §7.4.1 and §7.6 properly.

---

# TIER 7 — Chapter 8: Feedback

**Sections:** 8.1 Properties, **Types of Amplifiers**, **Sense and Return Mechanisms** · 8.2 The Four Topologies · 8.3 Effect on Noise · 8.4 Analysis Difficulties · 8.5 **Effect of Loading** (two-port models)

The part we have *not* done, and which Tutorial 5 needs:

_[Claude used visualize:show_widget]_

## Must-know results

```
CORE
  A_closed = A/(1 + βA)        loop gain = βA        amount of feedback = 1+βA
  gain error ε = 1/(1+βA)      bandwidth ×(1+βA)     distortion ÷(1+βA)

IMPEDANCES  (the matrix above)
  sensing output voltage  → Rout ÷ (1+βA)
  sensing output current  → Rout × (1+βA)
  returning voltage (series at input) → Rin × (1+βA)
  returning current (shunt at input)  → Rin ÷ (1+βA)

LOADING (§8.5) — how to find β properly
  break the loop, load the forward amp with the feedback network's impedance,
  then compute A and β on the *loaded* circuit
```

**Why you need it:** the gain-error and settling lectures used only §8.1. Tutorial 5 Q2 asks for a **CMFB loop gain**, which requires you to identify the sense mechanism, the return mechanism, and the loading — i.e. §8.1.3, §8.2 and §8.5.

**Self-check:** Given any transistor-level feedback amplifier, can you say in five seconds whether `Rin` and `Rout` go up or down? Can you explain why a unity-gain buffer's output impedance lands at `1/gm` regardless of the open-loop `Rout`?

**Status: ⚠️ core covered, topologies and loading not.**

---

# TIER 8 — Chapter 10: Stability and Frequency Compensation

Strictly *after* Chapter 9, but your Tutorials 4 and 5 need it, because gain-boosting loops and CMFB loops must be stable.

```
□ Loop gain, phase margin, gain margin; PM ≥ 45° (60° for good settling)
□ Two-pole systems; ringing and overshoot vs PM
□ Dominant-pole compensation; Miller compensation and its RHP zero (nulling resistor)
□ Why the mirror pole and the folding-node pole are the usual culprits
```

---

# Your personal gap list

Given everything we've covered in this conversation, here is precisely what stands between you and every remaining tutorial question:

| Gap | Book section | Unlocks |
|---|---|---|
| Device capacitances, `f_T` | §2.4.2 | Chapter 6 |
| Per-stage frequency response, ZVTC | §6.2–6.6, App. B | BW parts of exam questions |
| Noise: thermal, flicker, input-referred in a diff pair | §7.2, §7.4.1, §7.6 | Razavi §9.12 |
| Four feedback topologies + loading | §8.1.3, §8.2, §8.5 | **T5.Q2** (CMFB loop gain) |
| Cascode-mirror high-swing biasing | §5.2 | T2.Q2, T3.Q2–Q3 |
| **Gain boosting** | §9.3 | **Tutorial 4 (all)** |
| **Common-mode feedback** | §9.7 | **Tutorial 5 (all)** |
| Slew rate | §9.9 | Large-signal settling |
| Stability / phase margin | Ch 10 | CMFB and gain-boost loop design |

---

# Study plan — the order that minimises wasted effort

**Week 1 — plug the device and biasing holes (fastest payoff).**
§2.4.2 capacitances → §5.2 cascode mirrors and high-swing biasing → §5.3.3 active-mirror CM properties → §5.4 biasing techniques. These are short and directly unlock Tutorials 2 and 3.

**Week 2 — frequency response.**
§6.1 (Miller + association of poles) → §6.2 CS → §6.5 cascode → §6.6 differential pair → App. B (ZVTC). Do every in-chapter example by hand before reading the answer.

**Week 3 — feedback done properly.**
§8.1.3 sense and return → §8.2 all four topologies → §8.5 loading. Then re-derive the unity-gain-buffer result (`Rout → 1/gm`) yourself as a check.

**Week 4 — noise + the two missing op-amp sections.**
§7.2, §7.4.1, §7.6 → then §9.3 gain boosting and §9.7 CMFB. At that point Tutorials 4 and 5 open up and I can work them with you.

**Throughout:** do Razavi's end-of-chapter problems for Ch 3, 4 and 5. They are written in exactly the style of your tutorials.

---

# The audit — 20 things you should be able to answer cold

If any of these makes you pause, that's your next study session.

```
DEVICE
 1. Why does I_D stop growing once V_DS exceeds Vov?
 2. Write gm three ways and say when each is the useful one.
 3. Why is gm·rO independent of bias current?
 4. When does gmb appear, and why?
 5. Why is C_GD only overlap capacitance in saturation?

SINGLE STAGE
 6. Gain of all five CS loads, from memory.
 7. Why |Av| = 2·(dc drop)/Vov ended the resistive load.
 8. Rout of a degenerated device — and how that becomes the cascode.
 9. Rin of a common-gate stage, and why it goes infinite with an ideal load.
10. Why a follower's gain is 1/(1+η) and why that makes it nonlinear.

DIFFERENTIAL & MIRRORS
11. ΔVin,max = √2 Vov — derive it.
12. Why the CM half circuit uses 2R_SS.
13. Why a five-transistor OTA has Gm = gm1,2, not gm1,2/2.
14. Why a diode connection costs a threshold — and name three places it bites.
15. Where the mirror pole is and why it matters.

FREQUENCY, FEEDBACK, OP AMPS
16. Miller multiplication, and which three stages escape it.
17. ε = 1/(1+βA), and A_min = A_closed/ε.
18. τ = A_closed/ω_u and t_settle = ln(1/ε)·τ.
19. Telescopic vs folded: gain, swing, power, input CM — four differences.
20. Why a telescopic op amp's output is trapped in a Vth2 − Vov4 window as a buffer.
```

Next message I'll work **Tutorial 2 (Q1–Q3)** and **Tutorial 3 (Q1–Q3)** in full, since both are already inside the theory we've built.

## Human

also for every 3-4 lectures we complete you need to make me solve 10 questions from the book and develop my problem solving skills to make them extremely good the problems should be of the same level as my tutorial problems or better basically based on the similar pattern so after every 3-4 lectures you make me solve  the book problems along with the tutorial problems actually the tutorial problem you make me solve as soon as we complete all the prerequisites for it and then the book problems every 3-4 lectures whatever is a good point to solve them i am also attaching my course handout to help you see my syllabus plan the book questions we can solve with whatever we have covered till now and also the topic must be common in the book and handout and lectures as well for the question and remember to make the figure for it always

[attachment: EEE F313_INSTR F313_1_26-27.pdf]

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

Your handout changes how I should structure this — and it revealed something important. **Your tutorial sheets are Razavi's end-of-chapter problems, verbatim.** I checked them against the book's problem list:

| Your tutorial | Razavi problem |
|---|---|
| Tut 2 Q1, Q2, Q3 | **9.1, 9.2, 9.3** |
| Tut 3 Q1, Q2, Q3 | **9.4, 9.6, 9.8** |
| Tut 4 Q1 | **9.10** |
| Tut 5 Q1, Q2 | **9.11, 9.12** |

So the exam pool is almost certainly the same source. That makes the plan simple: work Razavi's Chapter 9 problems, plus variants I build on the same figures so you're not just memorising answers.

---

# Your handout, decoded

Your handout cites the **1st edition** section numbers. Here's the mapping to the 2nd edition (the PDF you gave me), plus our status:

| Lect | Handout topic | 1st ed § | **2nd ed §** | Status |
|---|---|---|---|---|
| 1 | Performance parameters | 9.1 | 9.1.1 | ✅ done |
| 2 | Single-stage op amp analysis | 9.2.1 | 9.2.1 | ✅ done |
| 3 | Single-stage design procedure | 9.2.2, 9.2.3 | 9.2.2, 9.2.3 | ⚠️ partly |
| 4 | Folded cascode | 9.2.4, 9.2.5 | 9.2.4, 9.2.5, 9.2.6 | ✅ done |
| 5 | Two-stage op amp | 9.3 | **9.3** | ❌ |
| 6 | Gain boosting | 9.4 | **9.4** | ❌ |
| 7–8 | CMFB | 9.7.1–9.7.3 | **9.7.1–9.7.3** | ❌ |
| 9 | Input range, slew rate | 9.8, 9.9 | 9.8, 9.9 | ❌ |
| 10 | PSRR, noise | 9.11, 9.12 | 9.11, 9.12 | ❌ |
| 11–14 | Stability & compensation | 10.1–10.5 | 10.1–10.5 | ❌ |

**Timing note:** your mid-semester exam is 9 October — about three weeks out — and it is closed book. Lectures 1–14 (the entire analog block) are the natural scope. Quizzes I and II have passed; Quiz-III is 30 October.

---

# The schedule

| After lectures | Problem set | Tutorials unlocked |
|---|---|---|
| **1–4** (§9.1, 9.2) | **Set 1 — now, below** | Tut 2 (all), Tut 3 (all) — I owe you these worked |
| 5–6 (two-stage, gain boosting) | Set 2: Razavi 9.14, 9.15, 9.18, 9.19 + variants | Tut 4 (all) |
| 7–9 (CMFB, input range, slew) | Set 3: Razavi 9.11–9.13, 9.26, 9.27 + variants | Tut 5 (all) |
| 10–14 (PSRR, noise, stability, compensation) | Set 4: Razavi 9.20–9.25, Ch 10 problems | Full mock exam |

---

# PROBLEM SET 1 — after Lectures 1–4

Four circuits, ten problems. Attempt them cold, then check against the key at the bottom. Ask me for the full worked solution on any you miss.

**Parameter Set A (0.5 µm):** `µnCox = 134.28 µA/V²`, `µpCox = 38.36 µA/V²`, `λn = 0.1 V⁻¹`, `λp = 0.2 V⁻¹` (at `L = 0.5 µm`), `Vth,n = 0.7 V`, `Vth,p = −0.8 V`, `VDD = 3 V`, `γ = 0`.

**Parameter Set B (modern):** `µnCox = 200 µA/V²`, `µpCox = 100 µA/V²`, `λn = 0.05 V⁻¹`, `λp = 0.1 V⁻¹`, `Vth,n = 0.4 V`, `Vth,p = −0.5 V`, `VDD = 1.8 V`, `γ = 0`.

## Figure 1 — Five-transistor OTA

_[Claude used visualize:show_widget]_

**P1.** *(Set B)* In Figure 1, `ISS = 200 µA`, `(W/L)₁,₂ = 40`, `(W/L)₃,₄ = 25`, `(W/L)₅ = 20`, `CL = 2 pF`.
(a) Open-loop voltage gain. (b) Input common-mode range. (c) Maximum output swing. (d) −3 dB bandwidth. (e) Bandwidth when the output is shorted to `Vin2`.

**P2.** *(same circuit)* The op amp of P1 is placed in a non-inverting configuration with a closed-loop gain of 5.
(a) Static gain error. (b) What open-loop gain would be needed for 0.5% gain error? (c) With `CL = 2 pF`, how long does the closed loop take to settle within 0.1% of its final value?

## Figure 2 — Telescopic cascode (fully differential)

_[Claude used visualize:show_widget]_

**P3.** *(Set A)* In Figure 2, `(W/L)₁₋₄ = 50/0.5`, `(W/L)₅₋₈ = 100/0.5`, `ISS = 1 mA`, and the tail current source requires `VISS = 0.4 V`.
(a) Open-loop differential voltage gain. (b) Maximum differential output swing. (c) The values of `Vin,CM`, `Vb1` and `Vb2` required to actually achieve that swing.

**P4.** *(same circuit, continuing from P3)*
(a) With `Vb1` fixed at the P3 value, show that the input common-mode level cannot be raised **at all** without pushing a device into triode. Which device, and why?
(b) The system now demands `Vin,CM = 1.6 V`. By how much must `Vb1` be raised, and what does it cost in differential output swing?

## Figure 3 — Telescopic with a cascode mirror load (single-ended)

_[Claude used visualize:show_widget]_

**P5.** *(Set A)* In Figure 3, `(W/L)₁₋₈ = 100/0.5`, `ISS = 1 mA`, `Vb1 = 1.6 V`.
(a) Find `VX`. (b) Find `Vout,max` and `Vout,min`, and hence the single-ended output swing. (c) Explain in one line why `Vout,max` is *not* simply `VDD − |Vov8| − |Vov6|`. (d) The gate of `M2` is now connected to `Vout` (unity-gain buffer). What is the allowable output range?

## Figure 4 — Folded-cascode op amp (PMOS input)

_[Claude used visualize:show_widget]_

**P6.** *(Set A)* Design the folded cascode of Figure 4 for: maximum **differential** output swing = 2.0 V, total power dissipation = 4.5 mW, all `L = 0.5 µm`, `CL = 2 pF`.
(a) Allocate `ISS` and the cascode branch current `I`. (b) Choose the four swing-critical overdrives and find `W/L` (and `W`) for `M3`–`M10`. (c) Choose `|Vov1,2| = 0.3 V` and find `(W/L)₁,₂`. (d) Overall voltage gain. (e) Unity-gain bandwidth.

**P7.** *(same design)* You assumed `Gm = gm1` when computing the gain. Quantify the error:
(a) Write the exact current-divider expression for `Iout/vin`. (b) Evaluate it with your P6 numbers — what fraction of `M1`'s signal current actually reaches the output? (c) Correct the gain of P6(d).

**P8.** *(same design)*
(a) Find the allowable input common-mode range, assuming the tail device `M11` needs 0.4 V across it. (b) Find the output CM range, and show that the input and output CM levels can be made **equal**. What value would you choose? (c) In one sentence, why is this impossible in the telescopic of Figure 2?

**P9.** *(linear scaling, §9.2.3)* The op amp of P6 must now drive `CL = 8 pF` with the **same** unity-gain bandwidth. Apply linear scaling: multiply every width and every bias current by `α`.
(a) What `α` is required? (b) What happens to each of: all overdrives, DC gain, output swing, `rO`, power? (c) State the new power dissipation and the new `(W/L)₁,₂`.

**P10.** *(capstone — Set B)* Design a fully differential op amp on `VDD = 1.8 V` meeting: DC gain ≥ 500, differential output swing ≥ 1.2 V peak-to-peak, `CL = 2 pF`, settling to 0.1% in 20 ns **in unity-gain feedback**, and the input CM level must equal the output CM level.
(a) Which topology — telescopic or folded cascode? Justify with the specific constraint that rules one out. (b) From the settling spec, find the required `gm1,2`. (c) From the swing spec, find the maximum allowable overdrive for each of the four swing-critical devices. (d) Choose `ISS` and the branch currents, verify the gain spec, and state the total power.

---

# Answer key (final answers only — work first, then check)

| | Answer |
|---|---|
| **P1** | (a) `Av = 84.3 V/V` (b) `0.874 V ≤ Vin,CM ≤ 1.417 V` (c) `0.474 V → 1.517 V`, swing `1.043 V` (d) `f−3dB = 1.19 MHz` (e) `100.7 MHz` |
| **P2** | (a) `ε = 5.6%` (b) `A0 ≥ 1000` (c) `τ = 7.9 ns`, `t₀.₁% = 6.91τ = 54.6 ns` |
| **P3** | (a) `Av ≈ 854 V/V` (b) `2.66 V pp differential` (c) `Vin,CM = 1.373 V`, `Vb1 = 1.646 V`, `Vb2 = 1.478 V` |
| **P4** | (a) `M1`/`M2` — `VX = 0.673 V` sits exactly at `Vin,CM − Vth`, so any rise pushes the input devices into triode (b) `Vb1` must rise by `0.227 V` to `1.873 V`; differential swing shrinks by `0.454 V` |
| **P5** | (a) `VX = 0.707 V` (b) `0.900 V → 1.478 V`, swing `0.578 V` (c) the diode-connected mirror pins `M6`'s gate a full `\|Vthp\|` too low (d) `0.900 V → 1.407 V`, window `= Vth2 − Vov4 = 0.507 V` |
| **P6** | (a) `ISS = 0.75 mA`, `I = 0.375 mA`, `M5,6` carry `0.75 mA` (b) all four overdrives `= 0.5 V`; `(W/L)₃,₄ = 22.3`, `(W/L)₅,₆ = 44.7`, `(W/L)₇₋₁₀ = 78.2` (c) `(W/L)₁,₂ = 217` (d) `Av ≈ 333 V/V` (e) `ωu = gm1/CL = 1.25 Grad/s ≈ 199 MHz` |
| **P7** | (a) `Iout = gm1·vin·(rO1‖rO5)/[(1/gm3‖rO3) + (rO1‖rO5)]` (b) `91.1%` (c) `Av ≈ 304 V/V` |
| **P8** | (a) `≈ −0.3 V` (i.e. ground is fine) up to `1.5 V` (b) output `1.0 V → 2.0 V`; choose `VCM = 1.5 V` for both (c) in the telescopic the input CM and the output floor are set by different, conflicting constraints — tying them gives the one-threshold window of P5(d) |
| **P9** | (a) `α = 4` (b) overdrives, gain, swing all unchanged; `gm ×4`, `rO ÷4`, power `×4` (c) `18 mW`, `(W/L)₁,₂ = 869` |
| **P10** | (a) **Folded cascode** — the telescopic cannot be used in unity-gain feedback (output trapped in a `Vth − Vov` window) (b) `gm1,2 ≥ 0.69 mS` (c) four overdrives sum to `1.2 V` → `0.3 V` each (d) `ISS = 200 µA`, `I = 100 µA`, `Rout ≈ 3.3 MΩ`, `Av ≈ 2300 ≫ 500` ✓, power `= 0.72 mW` |

---

**How to use this:** do P1–P5 in one sitting (analysis), P6–P10 in another (design). Time yourself — an exam part worth 3–4 marks should take 4–6 minutes. Send me the ones you got wrong and I'll work them in full with the four-step bias-table method.

Next message I'll deliver the **Tutorial 2 and Tutorial 3 worked solutions** (Razavi 9.1–9.4, 9.6, 9.8), since those are fully unlocked and your mid-sem is three weeks out.

## Human

improve lecture 1-3 with all the prereqs

## Assistant

_[Claude used bash_tool]_

_[Claude used bash_tool]_

_[Claude used bash_tool]_

I re-read §9.1 and §9.2.1–9.2.3 against everything we've done, and found three genuine holes in how I taught these the first time: **large-signal behaviour** and **supply rejection** (handout Lecture 1) were only mentioned in passing, and **handout Lecture 3 — the design procedure (Example 9.7) and linear scaling — was never taught at all**. This version fixes all three, follows your handout's lecture boundaries exactly, and puts every prerequisite in a box right at the moment you need it.

---

# LECTURE 1 — Op-amp performance parameters (§9.1)

Razavi's definition, which frames everything: an op amp is **a high-gain differential amplifier**, where "high" means *adequate for the application* — anywhere from 10¹ to 10⁵. You don't design for infinite gain; you design for enough.

> **PREREQ — why differential.** A differential pair amplifies `Vin1 − Vin2` and rejects what's common to both. For differential signals the tail node doesn't move (it's a virtual ground), so each half is a plain CS stage: `Ad = −gm(rO‖R_load)`. For common-mode signals the tail node follows the input and the drain currents don't change. Feedback needs a subtractor; the differential pair *is* the subtractor.

## 1.1 Gain

> **PREREQ — negative feedback.** `A_closed = A/(1 + βA)`. `β` = fraction of the output fed back; `βA` = loop gain. As `A → ∞`, `A_closed → 1/β`, which is set by a resistor *ratio* — ratios are accurate, absolute device parameters are not.

**Gain error** is the fractional shortfall from the ideal `1/β`:

```
ε = (1/β − A_closed)/(1/β) = 1/(1 + βA) ≈ 1/(βA)
⟹  A_min = A_closed / ε
```

**Example 9.1:** closed-loop gain 10, error < 1% → `A ≥ 10/0.01 = 1000` (exactly 990 if you keep the "1+").

## 1.2 Small-signal bandwidth

> **PREREQ — the single pole.** A node with resistance `R` and capacitance `C` has a pole at `ω = 1/RC`. Above it, gain falls 20 dB/decade, so gain × frequency is constant. A first-order step response is `1 − e^(−t/τ)`; settling within fractional error `ε` takes `t = τ·ln(1/ε)` — 4.6τ for 1%, 6.9τ for 0.1%.

```
A(s) = A0/(1 + s/ω0)        ωu = A0·ω0 = GBW
closed loop:  τ = 1/[(1+βA0)ω0] ≈ 1/(β ωu) = A_closed/ωu
```

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Real settling is therefore **two phases**: a constant-slope slewing phase (nonlinear — the pair is fully steered) followed by the exponential linear phase from Example 9.2. So the small-signal `4.6τ` is only a **lower bound**; Razavi's own conclusion is that large-signal behaviour is complex enough to demand careful simulation. For exam purposes remember: *small steps settle exponentially; big steps slew first.*

## 1.4 Output swing

> **PREREQ — the saturation fence and headroom stacking.** NMOS saturated ⟺ `V_D ≥ V_G − Vth`; PMOS ⟺ `V_D ≤ V_G + |Vth|`. Every device stacked between an output and a rail costs its `|Vov|`; a diode connection costs `|VGS|`; the tail source costs `VISS`.

Large swings are needed because real signals span huge ranges — Razavi's example is an orchestra recording spanning over four orders of magnitude. Two structural facts: **fully differential outputs roughly double the swing**, and swing trades directly against device size, bias current and hence speed. In his words, achieving large swings is *the principal challenge in today's op amp design*.

## 1.5 Linearity

> **PREREQ — harmonics and symmetry.** A symmetric (odd) transfer characteristic produces only odd harmonics. A fully differential circuit is symmetric about zero, so its even-order harmonics cancel.

Open-loop op amps are substantially nonlinear (the pair's differential current vs input voltage is not a straight line). Two cures: **fully differential** topologies to kill even harmonics, and **enough open-loop gain** that the feedback loop linearises the result by `1+βA`. The line to remember: *in many feedback circuits, the linearity requirement — not gain error — sets the open-loop gain.*

## 1.6 Noise and offset

> **PREREQ — two error sources.** A MOSFET's channel noise referred to its gate is `4kTγ/gm` — so **more gm means less input-referred noise**. Offset comes from mismatch between supposedly identical devices (thresholds, dimensions); it shrinks with device area.

Both set the **smallest** signal the op amp can handle — the floor, where swing is the ceiling. In a typical op amp the input pair and the load pair contribute the most, which forces large devices or large currents.

The trade-off you must be able to state: **for a fixed bias current, lowering the load devices' overdrive buys output swing — but raises their `gm = 2I_D/Vov`, and with it their drain noise current.** Swing and noise pull on the same knob.

## 1.7 Supply rejection — also under-taught before

> **PREREQ — common-mode rejection.** Anything that arrives equally on both halves of a differential circuit is common-mode, and the differential output ignores it.

Op amps often sit next to digital logic on noisy supply lines, and supply noise gets worse at high frequency. Watch what happens when the supply wiggles in a fully differential stage:

_[Claude used visualize:show_widget]_

The ripple reaches both outputs through identical paths, so it's **common-mode** and vanishes from `Vout1 − Vout2`. A single-ended output (like the five-transistor OTA) has no partner to cancel against — hence Razavi's conclusion that **fully differential topologies are preferred** for supply rejection. The figure of merit, treated fully in Lecture 10 (§9.11), is `PSRR = (gain from input to output)/(gain from supply to output)`.

## Lecture 1 at a glance

| Parameter | What sets it | What it trades against |
|---|---|---|
| Gain | `gm·Rout` (≈ `(gm rO)ⁿ`) | swing (cascoding), speed |
| Small-signal BW | `ωu = gm/CL` | power (`gm` costs current) |
| Large-signal speed | `SR = ISS/CL` | power |
| Output swing | `VDD − Σ\|Vov\|` | gain, noise, device size |
| Linearity | open-loop gain + symmetry | power, complexity |
| Noise | `gm` of inputs vs loads | swing (load `Vov`), power |
| Offset | device area | speed (large devices are slow) |
| Supply rejection | differential symmetry | CMFB complexity |

---

# LECTURE 2 — One-stage op amps: analysis (§9.2.1)

The circuits for this lecture are Figures 1–3 of Problem Set 1 above (five-transistor OTA, fully differential telescopic, mirror-loaded telescopic).

> **PREREQ — the device numbers.** `gm = 2I_D/Vov`; `rO = 1/(λI_D)` with `λ ∝ 1/L`; intrinsic gain `gm rO = 2/(λVov)`, independent of current.
>
> **PREREQ — impedances.** Looking into a drain: `rO`. Looking into a drain degenerated by `R_S`: `≈ gm rO R_S` — so a cascode gives `gm rO²`. Looking into a source: `≈ 1/gm`.
>
> **PREREQ — mirrors.** A diode-connected node sits at `|VGS|` from the rail, not `|Vov|` — one full threshold of headroom. In a five-transistor OTA the mirror *adds* the two half-currents, so `Gm = gm1,2`, not `gm1,2/2`.

## 2.1 The basic one-stage topologies

Razavi's point: **every differential amplifier from Chapters 4–5 is already an op amp.** Both basic forms have

```
Av = gmN (rON ‖ rOP)            ← "hardly exceeds 10 in nanometer technologies"
ωp,out = 1/[(rON ‖ rOP) CL]     GBW = gm/CL
```

The single-ended five-transistor OTA has a **mirror pole** (≈ `gm3/C_X`); the fully differential version doesn't, but needs common-mode feedback.

```
                     5-transistor OTA                 fully differential, Vb loads
Vin,CM,min           VISS + VGS1                      VISS + VGS1
Vin,CM,max           VDD − |VGS3| + Vth1              VDD − |Vov3| + Vth1
Vout range           VISS+Vov2 … VDD−|Vov4|           each side the same, ×2 differential
swing                VDD − |Vov4| − Vov2 − VISS       2(VDD − |Vov3| − Vov1 − VISS)
```

## 2.2 Telescopic cascode

To beat "hardly exceeds 10", cascode both the inputs and the loads:

```
Av = gm1 [ (gm3 rO3 rO1) ‖ (gm5 rO5 rO7) ]  ≈  (gm rO)²/2
swing = 2[ VDD − (Vov1 + Vov3 + VISS + |Vov5| + |Vov7|) ]      ← five deductions
```

and the swing is only achieved if **three bias conditions hold simultaneously**: `Vin,CM = VGS1 + VISS`, `Vb1 = VGS3 + (Vin,CM − Vth1)`, `Vb2 = VDD − |Vov7| − |VGS5|`. The mirror-loaded single-ended version loses a further `|Vthp|` because the diode connection biases the PMOS cascode a threshold too low.

## 2.3 The unity-gain buffer and its catch

> **PREREQ — feedback changes impedances.** Voltage-sensing feedback divides output resistance by `1+βA`.

```
Example 9.4 (five-transistor OTA, β = 1):   Rout,closed = (rON‖rOP)/[1 + gmN(rON‖rOP)] ≈ 1/gmN
                                              output pole ≈ gmN/CL   (= ωu — same answer both ways)
Examples 9.5/9.6 (telescopic, β = 1):       Vb1 − VGS4 + Vth2 ≥ Vout ≥ Vb1 − Vth4
                                              window = Vth − Vov4  (one threshold minus one overdrive)
```

For switched-capacitor use, set `VCM = Vb − (VGS3,4 − Vth1,2)` to get a symmetric ±(one threshold − one overdrive) swing.

---

# LECTURE 3 — Design procedure and linear scaling (§9.2.2, §9.2.3)

This is the lecture I never taught you, and it's the one that turns analysis into design.

> **PREREQ — the five parameters of every transistor.** Razavi designs with exactly five numbers per device: `I_D`, `Vov`, `W/L`, `gm`, `rO`. **Any two fix the rest**, through `I_D = ½µCox(W/L)Vov²`, `gm = 2I_D/Vov`, `rO = 1/(λI_D)`.
>
> **PREREQ — capacitance scales with area.** `C_GS ≈ (2/3)WLCox`. Devices *in the signal path* should be small to keep poles high; devices off it (current-source loads) can be large.

## 3.1 The method

Razavi's advice: **always start with a power budget, even if none is specified** — the design can be scaled afterwards. Then:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Razavi adds an important caution here: this allocation may *look* arbitrary, but **each overdrive only has a range of a few tens of millivolts** before the device dimensions become absurdly large. The design space is narrower than it seems.

**Step 4 — size every device** (minimum `L` first, to minimise capacitance):

```
(W/L)1–4 = 2I_D/(µnCox·Vov²) = 2(1.5m)/(60µ × 0.04)  = 1250
(W/L)5–8 = 2(1.5m)/(30µ × 0.09)                       = 1111
(W/L)9   = 2(3m)/(60µ × 0.25)                         = 400
```

**Step 5 — check the gain.** Build the bias table:

| Device | `I_D` | `Vov` | `gm = 2I_D/Vov` | `rO = 1/(λI_D)` |
|---|---|---|---|---|
| M1–M4 (N) | 1.5 mA | 0.2 V | 15 mS | 6.67 kΩ |
| M5–M8 (P) | 1.5 mA | 0.3 V | 10 mS | 3.33 kΩ |

```
Rdown = gm3 rO3 rO1 = 15m × 6.67k × 6.67k = 667 kΩ
Rup   = gm5 rO5 rO7 = 10m × 3.33k × 3.33k = 111 kΩ
Av = gm1 (Rdown ‖ Rup) = 15m × 95.2k ≈ 1.4 × 10³      (Razavi quotes 1416)
```

**Far short of 2000.** Now the key design insight of the lecture.

## 3.3 Where gain comes from — `gm·rO ∝ √(WL/I_D)`

> **PREREQ — `λ ∝ 1/L`.** Channel-length modulation is a fixed-size effect at the drain end, so it matters proportionally less in a longer channel.

```
gm·rO = √(2µCox(W/L)I_D) / (λ I_D)       with λ ∝ 1/L
      ∝ √(W/L) · L / √I_D
      = √(WL / I_D)
```

Three knobs: **widen, lengthen, or reduce current.** But speed and noise usually fix the current, so in practice **dimensions are the knob** — and to keep the overdrive constant, `W` must scale with `L`.

**Which devices to lengthen?** `M1`–`M4` sit in the signal path; their capacitance sets poles, so keep them small. The PMOS `M5`–`M8` affect the signal much less, so **make them bigger**. Double both `W` and `L` of `M5`–`M8`: `W/L` stays the same (so `gm` and `Vov` are unchanged), `λp` halves to 0.1 V⁻¹, so `rO` doubles:

```
(W/L)5–8 = 2222 µm / 1.0 µm
Rup = 10m × 6.67k × 6.67k = 444 kΩ           (×4, because both rO5 and rO7 doubled)
Av = 15m × (667k ‖ 444k) = 15m × 267k ≈ 4000   ✓ exceeds 2000
```

**Step 6 — set the bias voltages** at the saturation edges:

```
Vin,CM,min = VGS1 + Vov9 = (0.7+0.2) + 0.5          = 1.4 V
Vb1,min    = VGS3 + Vov1 + Vov9 = 0.9 + 0.2 + 0.5   = 1.6 V     (M1, M2 at edge of triode)
Vb2,max    = VDD − (|VGS5| + |Vov7|) = 3 − (1.0+0.3) = 1.7 V
```

Every node voltage in the circuit, on one axis — this is the picture that makes these numbers memorable:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Node `P` follows the input — `VP = Vin,CM − VGS1,2` — so hanging `Mb1` on top of it makes `Vb1` rise and fall with the input CM automatically:

```
Vb1 = VP + VGS,b1 = Vin,CM − VGS1,2 + VGS,b1                          (Razavi Eq. 9.15)
```

For `M1`/`M2` to sit at the edge of saturation we need `Vb1 = Vin,CM − Vth1,2 + VGS3,4`. Equate the two:

```
VGS,b1 = (VGS1,2 − Vth1,2) + VGS3,4 = Vov1,2 + VGS3,4                  (Razavi Eq. 9.16)
```

`Mb1` must hold up **one overdrive plus a full `VGS`** while carrying only the small current `I1`. The only way to get a large `VGS` at small current is a "weak" device — **narrow and long**. Hand-analysis step: pick `I1` small (say `ISS/20`), then solve `I1 = ½µCox(W/L)b1 (VGS,b1 − Vth)²` for a small `(W/L)b1`.

---

# Consolidated formula sheet — Lectures 1–3

```
LECTURE 1 — PERFORMANCE PARAMETERS
  ε = 1/(1+βA)            A_min = A_closed/ε
  ωu = A0ω0 = gm/CL       τ = A_closed/ωu         t_settle = τ·ln(1/ε)
  SR = ISS/CL             (large steps slew first, then settle exponentially)
  fully differential: ~2× swing, even harmonics cancel, supply noise is common-mode
  noise-swing trade: lower load Vov → more swing, more gm,load → more noise

LECTURE 2 — ONE-STAGE ANALYSIS
  Av = gmN(rON‖rOP)  (≲10)          telescopic: Av ≈ (gm rO)²/2
  5T OTA:  Vin,CM ∈ [VISS+VGS1, VDD−|VGS3|+Vth1],  swing VDD−|Vov4|−Vov2−VISS
  telescopic swing = 2[VDD − (Vov1+Vov3+VISS+|Vov5|+|Vov7|)]
  buffer: Rout → 1/gm,  pole → gm/CL;   telescopic buffer window = Vth − Vov4

LECTURE 3 — DESIGN
  five numbers per device: I_D, Vov, W/L, gm, rO   (any two fix the rest)
  procedure: power → swing → overdrives → W/L → check gain → biases → scale
  gm·rO ∝ √(WL/I_D)   → lengthen OFF-signal-path devices (loads)
  Vout,min = Vb1 − Vth3      Vout,max = Vb2 + |Vth5|
  linear scaling (W, I × α): Vov, swing, gain fixed; gm, power, speed ×α; rO ÷α; noise ÷√α
  Vb1 tracking: VGS,b1 = Vov1,2 + VGS3,4  → Mb1 narrow and long
```

**Memory hooks for the new material:**

- **"Start with power, even if nobody asked."** It's the only number that doesn't depend on anything else.
- **"The swing budget is a zero-sum split of `VDD`."** Biggest current gets the biggest overdrive; low-mobility PMOS gets more than NMOS.
- **"Gain lives in `√(WL/I_D)`."** When gain falls short, lengthen the loads, not the signal path.
- **"The output is fenced by the cascode gates."** One threshold below `Vb1`, one above `Vb2`.
- **"Linear scaling only buys speed and silence."** Gain and swing never move.

With Lecture 3 now actually taught, **all ten problems in Problem Set 1 are fully within reach** — P6 is Example 9.7's procedure applied to a folded cascode, and P9 is Example 9.8 with numbers. Tutorial 2 and 3 worked solutions come next.

## Human

lets start with lecture 1 teach me like i dont know anything and i am a kid

## Assistant



## Human

draw all the figures and everything too

## Human

also remember the level of questions we have to solve

## Human

also remember the level of questions we have to solve

## Human

also remember the level of questions we have to solve, give me 3 questions to solve based on whategver you taught and with diagrams and everything

## Assistant

Imagine you're a judge at an **amplifier contest**. Before you can pick a winner, you need a scorecard — a list of things to grade. **Lecture 1 is that scorecard.** Razavi grades every op amp on eight things, and by the end of today you'll know all eight, why each one matters, and the formulas behind them.

But first, two tiny warm-ups.

---

# Warm-up 1: What is an amplifier?

**Voltage is a push.** Think of it like water pressure in a pipe — more voltage, harder push.

An **amplifier** takes a small push and turns it into a big push. It's a megaphone for electricity: you whisper in, it shouts out — same words, just louder.

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

That straight "top speed" part is called **slewing**. Why is it a straight line? Here's the picture that makes it obvious:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used quiz_display_v0]_

That's the whole of Lecture 1: one scorecard, eight grades, and a handful of formulas that each come from a single picture — the see-saw, the glass of water, the pocket of coins, the cake, the tap and bucket, the room with a ceiling.

When you're ready, **Lecture 2** opens the box and shows what's actually *inside* an op amp — the transistors, and why the simplest one only gets a gain of about 10. Same style, same pictures-first approach.

## Human

no not good enough i dont understand anything teach me all the prerequisites and everything required in depth research online in how razavi and other profs teach it how their notes and stuff look and the best practices for teaching this topic do proper research and teach me ground up assume idk anything, do proper research adn then teach me all the prereqs, make it stick to my head make it intuitive make proper detailed diagrams, check everything twice make sure you cover everything required for me to start with these lectures all the amplifier configurations and everything teach me on the same level as required to solve the level of questions i have shown you

## Assistant

_[Claude used web_search]_

_[Claude used web_search]_

The earlier lessons started at op amps and assumed you already understood the transistor itself. That's the real gap — everything in Lectures 1–4 rests on about a dozen transistor ideas, and if those aren't solid, nothing on top can stick. So I'm restarting from the true bottom.

**How I built this.** I looked at how Razavi and other university courses actually sequence this material. Razavi's stated method is to introduce each concept from an intuitive perspective first and only then treat it with careful analysis, with the goal of learning to analyze circuits by inspection. Standard DC-analysis procedure across courses is to assume the transistor is in saturation, analyze with the saturation equations, then evaluate whether the result is consistent with that assumption — and instructors warn that skipping the check against the original assumption costs significant credit on exams. One study of teaching MOSFETs found that students most often struggle with the saturation region, and that common analogies like students rushing through lecture-hall doors fail to explain it — so I'll use the channel-thickness picture instead, which is what device physicists use.

**The plan — three parts, one at a time:**

| Part | Modules | After it you can… |
|---|---|---|
| **1 (this message)** | Circuit language · the MOSFET · triode vs saturation · the DC recipe · PMOS · small signal · your first amplifier | Solve T1.Q1-style biasing problems and find a CS stage's gain |
| 2 | Current sources & mirrors · all CS loads · the three impedance rules · source follower · common gate · cascode | Read any single-stage circuit by inspection |
| 3 | Differential pair from scratch · CM vs DM · half circuit · `RSS` and CM gain · 5-transistor OTA · poles and bandwidth | Start Lectures 1–4 and every tutorial |

Every module has the same shape: **why you need it → the picture → the rule → a worked example with numbers → lock it in.**

---

# MODULE 1 — Circuit language

**Why you need it:** every tutorial problem is secretly a voltage-drop problem. If you can't instantly say "the node is 0.8 V because 0.1 mA through 10 kΩ drops 1 V," everything else stalls.

Electricity behaves a lot like water in pipes:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Four parts:

- **Source (S)** and **drain (D)**: two pools of electrons (the teal `n+` regions). Electrons start at the source and flow to the drain.
- **Gate (G)**: a metal plate on top, separated by a thin layer of glass (the yellow **oxide**). Because glass is an insulator, **no current ever flows into the gate.** Remember that — it's why gates have infinite input resistance later.
- **Body**: the p-type silicon underneath.

**How the tap opens.** The gate, oxide and body form a capacitor. Put a positive voltage on the gate and it pulls electrons up to the surface right under the oxide. Once the gate voltage (measured from the source) passes a certain value — the **threshold voltage `Vth`** — enough electrons gather to form a continuous sheet connecting source to drain. That sheet is the **channel**, and now current can flow.

The amount you exceed the threshold by has its own name, and it is **the most important quantity in this whole course**:

```
Vov = VGS − Vth          "overdrive" — how thick the electron sheet is
```

More overdrive → thicker channel → more current can flow. The size of the tap is set by the channel's **width `W`** (how wide the sheet is) and **length `L`** (how far the electrons travel). Wide and short = big tap. So **`W/L`** is the tap size.

> **Lock it in:** gate voltage controls a sheet of electrons. `VGS < Vth` → off. `VGS > Vth` → on, with channel thickness ∝ `Vov`. Gate current is always zero.

---

# MODULE 3 — Triode, saturation, and pinch-off

**Why you need it:** amplifiers only work in **saturation**, and every "is it in saturation?" check in your tutorials comes from this one picture. This is where students most often get lost, so we go slowly.

The key fact: the channel is **not equally thick everywhere**. At any point along it, the thickness depends on how much the gate voltage exceeds the local channel voltage. Device physicists draw it exactly this way — the channel carries more charge near the source end than near the drain end.

- At the **source end**, the gate sees `VGS`, so the thickness ∝ `VGS − Vth = Vov`.
- At the **drain end**, the gate sees only `VGS − VDS`, so the thickness ∝ `Vov − VDS`.

So as you raise `VDS`, the drain end of the channel gets thinner and thinner:

_[Claude used visualize:show_widget]_

Walk through the three panels:

**Left — small `VDS`:** the channel is nearly even, like a plain resistor. Double `VDS`, double the current. This is the **triode** (or linear) region.

**Middle — `VDS = Vov`:** the drain end has thinned to exactly zero. We've reached the edge.

**Right — `VDS > Vov`:** the channel now ends *before* the drain, at the **pinch-off point**. This is **saturation**.

**Why does the current stop growing in saturation?** Think of a **waterfall**. How much water flows over the edge is decided by the river *upstream* — not by how tall the cliff is. Make the cliff taller and the same amount still falls. In the transistor, the channel from the source to the pinch-off point always has exactly `Vov` across it, no matter what. Any extra `VDS` you add just drops across the tiny gap near the drain, where electrons are swept across like falling water. So the current is set by `Vov` alone.

That gives the two equations and the one condition that separate them:

```
TRIODE      (VDS < Vov):   ID = µnCox (W/L) [ Vov·VDS − VDS²/2 ]
SATURATION  (VDS ≥ Vov):   ID = ½ µnCox (W/L) Vov²

THE SATURATION CHECK:      VDS ≥ Vov     ⟺     VD ≥ VG − Vth
```

Read the last line as a **fence**: *the drain must stay above the gate minus one threshold.* That's the form you'll use in every CM-range and swing calculation later.

**What each piece of the square law means:**

| Factor | Meaning | Knob |
|---|---|---|
| `µn` | how easily electrons move (mobility) | fixed by silicon — holes in PMOS are ~2–4× slower |
| `Cox` | gate capacitance per area | fixed by the process |
| `W/L` | tap size | **you choose it** |
| `Vov²` | how far past threshold, squared | **you choose it** |

`µnCox` always appears together, so problems just give it as one number (e.g. 200 µA/V²).

**One real-world correction — channel-length modulation.** In reality the waterfall isn't perfect: as `VDS` rises, the pinch-off point creeps slightly toward the source, the effective channel gets a little shorter, and the current creeps up a little. We model this with `λ`:

```
ID = ½ µnCox (W/L) Vov² (1 + λVDS)          λ ∝ 1/L  (longer channel → smaller λ)
```

Here's every region on one picture:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

## Worked Example 1 — analysis ("given the circuit, find everything")

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

**Read the curve left to right:**

- **Input below `Vth`** — the transistor is off, no current, no drop across `RD`, so `Vout = VDD`.
- **Input above `Vth`, transistor saturated** — current rises with the square of `Vov`, the drop across `RD` grows fast, and `Vout` falls steeply: `Vout = VDD − RD·½µnCox(W/L)(Vin − Vth)²`.
- **Input too high** — `Vout` falls below the fence `Vin − Vth`, the transistor enters triode, and the curve flattens. The amplifier stops working.

You **bias** the circuit at a point `Q` in the steep part. For small wiggles, the gain is just **the slope at `Q`**. Differentiating the saturated equation gives `−RD·µnCox(W/L)(Vin − Vth) = −gm·RD`.

**The same answer from the small-signal circuit** (the right panel of the previous figure). The current `gm·vin` is pulled out of the output node. The only things connected to that node are `RD` and `rO`, both going to AC ground — so they're **in parallel**:

```
vout = −gm · vin · (RD ‖ rO)

Av = vout/vin = −gm (RD ‖ rO)          RD ‖ rO = (RD·rO)/(RD + rO)
```

**Why the minus sign:** more input → more current → bigger drop across `RD` → lower output. A common-source stage **inverts**.

## Worked Example 5 — finishing the circuit from Example 1

```
gm = 0.6 mA/V,   RD = 10 kΩ,   rO = 111 kΩ
RD ‖ rO = (10k × 111k)/(121k) = 9.17 kΩ
Av = −0.6m × 9.17k = −5.5 V/V          (ignoring rO: −gm·RD = −6)

Output range while still in saturation:
  top    = VDD = 1.8 V            (input low, transistor nearly off)
  bottom = Vin − Vth ≈ 0.3 V      (the fence)
  the bias point VD = 0.9 V sits comfortably inside
```

**A deep shortcut worth memorising.** Substitute `gm = 2ID/Vov`:

```
|Av| = gm·RD = 2·(ID·RD)/Vov = 2 × (DC voltage dropped across RD) / Vov
     = 2 × 0.9 / 0.3 = 6  ✓
```

To get a gain of 10 with `Vov = 0.2 V` you'd need to drop 1 V across `RD` — impossible on a 1 V supply. That single line is why real chips replace `RD` with a transistor (the first topic of Part 2).

**The method you'll now use forever.** Razavi calls it analysis *by inspection*:

```
Av = −Gm × Rout

Gm   = how much output current the input creates          (here: gm)
Rout = the resistance seen looking into the output node    (here: RD ‖ rO)
```

Two easy questions instead of one hard KCL problem. Every amplifier in Parts 2 and 3 — cascodes, differential pairs, op amps — is solved this way.

> **Lock it in:** CS stage: input at gate, output at drain, inverts. Gain = slope at the bias point = `−gm(RD ‖ rO)`. Always `Av = −Gm·Rout`.

---

# Checkpoint — Part 1

Do these without scrolling up. If you get 8/10, you're ready for Part 2.

_[Claude used quiz_display_v0]_

That's Part 1: from "what is voltage" to computing a real amplifier's gain, using the same recipe your Tutorial 1 solutions used.

**Part 2** picks up exactly where the `2·drop/Vov` problem left off — replacing `RD` with a transistor. It covers current sources and current mirrors (and why a diode-connected transistor costs a full threshold of headroom), all five common-source loads, the three impedance rules (looking into gate, drain and source), the source follower, the common-gate stage, and the cascode. **Part 3** then builds the differential pair from scratch — common mode vs differential mode, the half circuit, the `2RSS` trick from T1.Q4 — and assembles the five-transistor OTA from your exam question, plus poles and bandwidth. After Part 3, Lectures 1–4 and the tutorials will read as applications of things you already own.

Tell me which checkpoint questions tripped you up (if any), and I'll go over those before starting Part 2.

## Human

start part 2 and look for razavis notes or videos andhow he taught all the amplifier configurations and how he made it intuitive and make sure whatever you are teaching applies to all the circuits and everything  and make it even more detailed and easy to memorsise and remember okay start now

## Assistant

_[Claude used web_search]_

_[Claude used web_search]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Don't just memorise these — here's *why* each one is true, using only the small-signal model from Part 1 (`gm·vgs` in parallel with `rO`).

**Rule 1 — into the gate: ∞.** The gate sits on glass. No current can enter. Done.

**Rule 2 — into the drain: `rO`.** Push a test current into the drain. With the source grounded and gate held still, `vgs = 0`, so the `gm·vgs` source does nothing. All that's left between drain and ground is `rO`.

Now add a resistor `RS` under the source. Push current `i` into the drain: it flows through `RS`, so the source **rises** by `i·RS`. That makes `vgs = −i·RS` — the transistor tries to **turn itself down**, fighting the current you're pushing. You have to push the drain voltage much higher to force the current through:

```
v = i·RS + (i + gm·i·RS)·rO   ⟹   R_drain = rO + (1 + gm·rO)·RS  ≈  gm·rO·RS
```

**The transistor multiplied `RS` by `gm·rO`.** Hold onto this — it *is* the cascode.

**Rule 3 — into the source: `1/gm`.** Hold the gate still and push the source up by `v`. Now `vgs = −v`, so the transistor responds by pulling a current `gm·v` — it **fights** your push hard. A big current for a small voltage = a small resistance:

```
R_source = 1/gm       (≈ 1 kΩ when gm = 1 mA/V)
```

If a resistance `RD` hangs on the drain, it shows through, but **divided** by `gm·rO`: `R_source ≈ 1/gm + RD/(gm·rO)`.

> **The one sentence behind all three rules:** a transistor is an **impedance transformer** with ratio `gm·rO`. A resistance in its source looks `gm·rO` times **bigger** from the drain. A resistance on its drain looks `gm·rO` times **smaller** from the source. **Up multiplies, down divides.**

---

# MODULE 9 — Current sources, diodes and mirrors

**Why you need it:** Part 1 ended on a wall — a resistor load needs a huge DC drop to give decent gain (`|Av| = 2·V_drop/Vov`). We need something with a **big AC resistance but a small DC drop**.

## 9.1 The current source

Hold a transistor's gate at a fixed voltage `Vb` and keep it saturated. From Part 1, its current is set by `Vb` and barely depends on the drain voltage. That's a **current source**. By Rule 2, looking into its drain you see **`rO`** — typically tens to hundreds of kΩ. And it only needs **`|Vov|`** of DC voltage across it to stay saturated (a few hundred mV), not the volts a resistor would eat.

> **Current source = big AC resistance (`rO`), tiny DC cost (`|Vov|`).** That's why every op amp load is a transistor.

## 9.2 The diode-connected transistor

Now tie a transistor's **gate to its own drain**:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Apply the master method once, and all three fall out together. `M1`'s signal enters at the gate and leaves at the drain → **common source**, so `Gm = gm1`. The output node sees `M1`'s own drain (`rO1`, by Rule 2) **in parallel with** whatever load is on top:

| Load | Its resistance (Step C) | `Rout` | `Av = −gm1·Rout` |
|---|---|---|---|
| Resistor | `RD` | `rO1 ‖ RD` | `−gm1(rO1 ‖ RD)` |
| Diode-connected `M2` | `1/gm2` (diode rule) | `≈ 1/gm2` | `−gm1/gm2` |
| Current source `M2` | `rO2` (Rule 2) | `rO1 ‖ rO2` | `−gm1(rO1 ‖ rO2)` |

**The diode load, expanded.** Both devices carry the same current `ID`, so using `gm = √(2µCox(W/L)ID)`, the `ID` cancels:

```
Av = −gm1/gm2 = −√( µn(W/L)1 / [µp(W/L)2] )
```

The gain is set by **a ratio of sizes** — independent of bias current and very linear. But it's low, and costs `|VGS2|` of headroom.

## Worked Example 7 — your Tutorial 1, Q2 (diode loads)

`µn = 4µp`, equal lengths, want `|Ad| = 10`:

```
10 = √( 4 × W1/W2 )   ⟹   100 = 4 × W1/W2   ⟹   W1/W2 = 25          ✓ matches your key
```

## Worked Example 8 — your Tutorial 1, Q3 (current-source loads)

`I = 200 µA` so `ID = 100 µA` per side; `|Vov| = 0.2 V`; `V_A = 10 V/µm × 0.36 µm = 3.6 V`:

```
gm1 = 2ID/Vov = 2(100µ)/0.2 = 1 mA/V
rO  = V_A/ID  = 3.6/100µ   = 36 kΩ     (both NMOS and PMOS)
Ad  = gm1 (rO1 ‖ rO2) = 1m × 18k = 18 V/V
```

The current-source load wins: gain limited only by the transistors themselves, at a DC cost of just `|Vov2|`. Maximum possible gain from one stage is about **half the intrinsic gain**, `gm·rO/2` (two equal `rO`s in parallel give `rO/2`).

**Two more loads you should recognise** (details in my earlier note on them):

```
Triode load (M2 gate at a low fixed Vb, deep triode):   Av = −gm1·Ron2      (saves headroom, but drifts)
Active load (both gates driven by Vin):                  Av = −(gm1 + gm2)(rO1 ‖ rO2)
```

> **Lock it in:** a CS stage's gain is always `−gm1 × (everything in parallel at the drain)`. Change the load → change one resistance → same formula.

---

# MODULE 11 — Source degeneration

**Why you need it:** it introduces the single most memorable gain rule in the whole subject, and it's the stepping stone to the cascode.

Add a resistor `RS` under the source of a CS stage:

_[Claude used visualize:show_widget]_

**The mechanism:** raise `Vin` → more current → more drop across `RS` → the source rises → `vgs` grows by *less* than you applied. The transistor partly cancels its own input. That's negative feedback built from one resistor.

**Deriving `Gm` in two lines.** The output current `i` flows through `RS`, so `vgs = vin − i·RS`, and the transistor makes `i = gm·vgs`:

```
i = gm(vin − i·RS)   ⟹   i = gm·vin / (1 + gm·RS)   ⟹   Gm = gm/(1 + gm·RS) = 1/(1/gm + RS)
```

Now multiply by the drain resistance (ignoring `rO` for the moment) and you get the rule to tattoo on your hand:

> ## The ratio rule
> ```
> |Av| = (resistance at the output terminal) / (resistance in the source path)
> ```
> **where the transistor itself always counts as `1/gm` in the source path.**

Watch it cover every stage in this lecture:

| Stage | Output resistance | Source-path resistance | `|Av|` |
|---|---|---|---|
| Plain CS | `RD` | `1/gm` | `gm·RD` |
| Degenerated CS | `RD` | `1/gm + RS` | `RD/(1/gm + RS)` |
| Source follower (next) | `RS` (output *is* the source) | `1/gm + RS` | `RS/(1/gm + RS)` |
| Common gate (next) | `RD` | `1/gm` | `gm·RD` |

**When `RS ≫ 1/gm`:** `|Av| → RD/RS` — a pure resistor ratio, independent of `gm`, so linear and process-proof. You traded gain for precision, exactly like feedback in Lecture 1.

**And the drain resistance went up.** By Rule 2, looking into the drain now gives `rO + (1 + gm·rO)·RS ≈ gm·rO·RS`. Keep that in view — replace `RS` with another transistor's `rO` and you've built a cascode.

## Worked Example 9

`gm = 1 mA/V`, `RD = 10 kΩ`, `RS = 1 kΩ`, `λ = 0`:

```
without RS:  |Av| = RD/(1/gm)         = 10k / 1k       = 10
with RS:     |Av| = RD/(1/gm + RS)    = 10k / (1k + 1k) = 5
```

Adding `RS = 1/gm` halves the gain — an easy number to remember.

> **Lock it in:** degeneration: `|Av| = RD/(1/gm + RS)`. Ratio rule: output resistance ÷ source-path resistance, transistor counts as `1/gm`.

---

# MODULE 12 — Source follower (common drain)

**Why you need it:** it's the circuit that drives heavy loads, and it shows the third impedance rule in action.

Input at the **gate**, output at the **source**, drain tied to `VDD`:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

**Run the master method:**

- **Roles:** `M1` — enters gate, leaves drain → common source. `M2` — enters source, leaves drain → common gate. **A cascode is a CS stage feeding a CG stage.**
- **`Gm`:** the CG device is a current buffer — it passes `M1`'s current straight up. So `Gm = gm1`.
- **`Rout`:** look down into `M2`'s drain. `M2` has `rO1` under its source, so by **Rule 2** with `RS = rO1`:

```
Rout = rO2 + (1 + gm2·rO2)·rO1  ≈  gm2·rO2·rO1          ("up multiplies")
Av   = −gm1·Rout ≈ −gm1·gm2·rO2·rO1 ≈ −(gm·rO)²        with an ideal current-source load
```

**The cascode squares the intrinsic gain.** One transistor gives ~10; a cascode gives ~100.

**The physical picture — shielding.** Look *up* from node `X` into `M2`'s source: by **Rule 3** it's only `1/gm2`. So node `X` barely moves, no matter how much `Vout` swings. `M1`'s drain sits almost perfectly still, so `M1` behaves like a near-ideal current source. `M2` is a bodyguard protecting `M1` from the output.

**The cost — headroom.** Two stacked devices, two fences: `Vout,min = Vov1 + Vov2`. And `Vb` must sit in a window that keeps both saturated.

## The trap: the load must be cascoded too

Here's what catches everyone. Put a *simple* current-source load `M3` on top (resistance `rO3`). The output node sees the cascode's huge resistance **in parallel** with `rO3` — and in a parallel combination, **the smaller one wins**:

```
Rout = (gm2·rO2·rO1) ‖ rO3  ≈  rO3            ← all that cascoding, wasted
```

The fix: cascode the load as well. That's the **telescopic** structure from your op-amp lectures:

```
Rout = (gm2·rO2·rO1) ‖ (gm3·rO3·rO4)  ≈  gm·rO²/2        Av ≈ −(gm·rO)²/2
```

## Worked Example 12 — putting numbers on it

Every device: `gm = 1 mA/V`, `rO = 20 kΩ` (so `gm·rO = 20`).

```
CS + current-source load:      Rout = rO ‖ rO                    = 10 kΩ      Av = −10
Cascode + simple load:         Rout = 440k ‖ 20k                 = 19.1 kΩ    Av = −19
Cascode + cascode load:        Rout = 440k ‖ 440k                = 220 kΩ     Av = −220
Cascode, ideal load:           Rout = 20k + 21 × 20k             = 440 kΩ     Av = −440
```

_[Claude used chart_display_v0]_

_[Claude used visualize:show_widget]_

```
Step B  roles:   M1 → common source (gate in, drain out)   ⟹ Gm = gm1
                 M2 → current source (gate fixed)           ⟹ rO2
                 M3 → diode (gate tied to drain)            ⟹ 1/gm3 ‖ rO3
Step C  Rout = rO1 ‖ rO2 ‖ (1/gm3) ‖ rO3                   (everything touching the output node, in parallel)
Step D  Av = −gm1 · [ rO1 ‖ rO2 ‖ (1/gm3) ‖ rO3 ]
```

With `gm1 = 1 mA/V`, all `rO = 50 kΩ`, `gm3 = 0.2 mA/V` (so `1/gm3 = 5 kΩ`):

```
Rout = 50k ‖ 50k ‖ 5k ‖ 50k = 3.85 kΩ        Av = −1m × 3.85k = −3.85
```

Notice the diode's small `1/gm3` dominates — **smallest resistance in parallel wins**. You never needed a special formula for this circuit. That's the whole point: roles → rules → `Gm·Rout`.

---

# The master table

| Stage | Role test | `Av` (γ = 0) | `Rin` | `Rout` | Sign |
|---|---|---|---|---|---|
| CS, resistor | gate in, drain out | `−gm(rO ‖ RD)` | ∞ | `rO ‖ RD` | − |
| CS, current source | ″ | `−gm1(rO1 ‖ rO2)` | ∞ | `rO1 ‖ rO2` | − |
| CS, diode load | ″ | `−gm1/gm2` | ∞ | `≈ 1/gm2` | − |
| CS, degenerated | ″ | `−RD/(1/gm + RS)` | ∞ | `rO + (1+gm·rO)RS` | − |
| Source follower | gate in, source out | `RL/(1/gm + RL)` ≈ 1 | ∞ | `1/gm` | + |
| Common gate | source in, drain out | `+gm·RD` | `≈ 1/gm` | `≈ RD` | + |
| Cascode | CS under CG | `≈ −(gm·rO)²` | ∞ | `≈ gm·rO²` | − |
| Current source (load) | gate fixed | — | — | `rO` | — |
| Diode (load) | gate = drain | — | — | `1/gm` | — |

# The memory kit — seven lines, everything else derives from them

1. **"Gate infinite, drain big, source small."** (∞, `rO`, `1/gm`)
2. **"Up multiplies, down divides — by `gm·rO`."**
3. **"Current source costs `Vov` and looks like `rO`; a diode costs `VGS` and looks like `1/gm`."**
4. **"Gain = output resistance ÷ source-path resistance, and the transistor is always `1/gm`."**
5. **"Only common source inverts."** Follower and common gate don't.
6. **"Follower: gain 1, `Rout = 1/gm`. Common gate: gain `gm·RD`, `Rin = 1/gm`."**
7. **"Cascode squares the gain — but only if the load is cascoded too. Smallest in parallel wins."**

---

# Checkpoint — Part 2

_[Claude used quiz_display_v0]_

That's Part 2: one method, three impedance rules, and every single-stage configuration — including a circuit you'd never seen — solved the same way.

**Part 3** builds the differential pair on top of exactly these tools. A differential pair turns out to be two common-source stages sharing a tail, so its gain is `−gm(rO‖R_load)` by the half-circuit trick; its common-mode gain is a **degenerated** CS stage with `2RSS` in the source (the ratio rule again — that's your T1.Q4); and the five-transistor OTA from your exam is a differential pair with a current-mirror load (Module 9). Then poles and bandwidth, and you're ready for Lectures 1–4 and the tutorials.

Tell me which checkpoint questions (if any) you missed, and I'll walk through those before Part 3.

## Human

build part 3 and lecture 1

## Assistant

Part 3 finishes the foundation, then Lecture 1 is rebuilt directly on top of it — so every parameter in Lecture 1 points back to a circuit you now understand.

---

# PART 3 — The differential pair and the op amp's first stage

## MODULE 16 — Two inputs: common mode and differential mode

**Why you need it:** an op amp has two inputs. To analyse them, split any pair of input voltages into two simpler pieces — the part they **share** and the part where they **differ**.

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

Three things to take from that picture:

- **Near the middle it's linear** — a small `ΔVin` shifts a proportional amount of current. That's the amplifying region.
- **At `ΔVin = ±√2·Vov` the swap is complete** (where `Vov` is each device's overdrive at balance). Why √2? For `M1` to carry *all* of `ISS` — twice its balance current — its overdrive must grow by √2 (current ∝ `Vov²`), while `M2` drops right to threshold. So `ΔVin = (Vth + √2·Vov) − Vth = √2·Vov`.
- **Beyond that, the pair is a switch**: one side has everything, the other is off. Remember this — in Lecture 1 it's called **slewing**.

**The input common-mode range** — both limits come straight from Part 1's fences:

```
Lower limit — the tail source needs its headroom VISS:
    VP = VCM − VGS1 ≥ VISS          ⟹   Vin,CM,min = VISS + VGS1

Upper limit — M1 must stay saturated (drain above gate minus Vth):
    VD1 ≥ VCM − Vth                  ⟹   Vin,CM,max = VD1 + Vth
```

**Your Tutorial 1, Q1:** `VSS = −0.9 V`, tail `Vov3 = 0.15 V` (so `VISS = 0.15 V` above `VSS`), `VGS1 = 0.5 V`, `VD1 = 0 V`, `Vth = 0.35 V`:

```
Vin,CM,min = −0.9 + 0.15 + 0.5 = −0.25 V        Vin,CM,max = 0 + 0.35 = +0.35 V      ✓ your key
```

---

## MODULE 18 — Differential signals: the half circuit

Now apply a small differential input: `+vd/2` on `M1`, `−vd/2` on `M2`.

- `M1`'s current rises by `i`; `M2`'s falls by exactly `i` (the tail forces the total to stay `ISS`).
- So the total current into node `P` **doesn't change** — which means **`P` doesn't move**.

A node that doesn't move for signals is an **AC ground**. So for differential signals you may **cut the circuit down the middle and ground `P`** — the right half of the figure above. What's left is a plain **common-source stage** from Part 2, driven by `vd/2`:

```
vout1 = −gm(RD ‖ rO)·(vd/2)       vout2 = +gm(RD ‖ rO)·(vd/2)

Ad = (vout1 − vout2)/vd = −gm (RD ‖ rO)
```

> **The half-circuit rule:** the differential gain of a pair **equals the gain of one half**. Every diff-pair gain formula you'll see is a Part 2 CS formula wearing a disguise.

**Your Tutorial 1, Q4(b):** `ID = 0.5 mA`, `Vov = 0.632 V`, want `Ad = 8`, `λ = 0`:

```
gm = 2ID/Vov = 1m/0.632 = 1.58 mA/V        RD = Ad/gm = 8/1.58m = 5.06 kΩ     ✓ your key
```

---

## MODULE 19 — Common-mode signals: the `2RSS` trick

Now raise **both** inputs together by `vcm`. A perfect tail current source would refuse to change, so nothing would happen. But real tails have a finite resistance `RSS` (in T1.Q4 it's literally a 1 kΩ resistor).

Both halves now carry the **same** extra current `i`, so `2i` flows through `RSS`. Split `RSS` into two resistors of `2RSS` in parallel — each half now sees its own `2RSS`, and the circuit is perfectly symmetric again:

_[Claude used visualize:show_widget]_

Look at the right half: it's a **source-degenerated CS stage** from Module 11, with `2RSS` in the source. The ratio rule gives the common-mode gain instantly:

```
ACM = −RD / (1/gm + 2RSS)          (output resistance ÷ source-path resistance)
```

Big `RSS` → tiny `ACM`. With an ideal tail (`RSS = ∞`), `ACM = 0`.

## Worked Example 13 — your Tutorial 1, Q4, all five parts

`VDD = 5 V`, `RSS = 1 kΩ` sets 1 mA, `k'n·W/L = 2.5 mA/V²`, `Vth = 0.7 V`, `λ = 0`.

```
(a) VCM:   tail current 1 mA through RSS    →  VP = 1m × 1k = 1 V
           each side ID = 0.5 mA            →  Vov = √(2ID/k'W/L) = √(1m/2.5m) = 0.632 V
           VGS = 0.7 + 0.632 = 1.332 V      →  VCM = VP + VGS = 2.33 V

(b) RD:    gm = 2ID/Vov = 1.58 mA/V         →  RD = 8/gm = 5.06 kΩ   (half circuit, Module 18)

(c) VD:    VD = VDD − ID·RD = 5 − 0.5m × 5.06k = 2.47 V

(d) ACM:   ACM = −RD/(1/gm + 2RSS) = −5.06k/(0.633k + 2k) = −1.92 V/V

(e) triode onset: raise VCM by ΔVCM. The gate rises by ΔVCM, the drain FALLS by |ACM|·ΔVCM.
           M1 hits the fence when   VD + ACM·ΔVCM = VCM + ΔVCM − Vth
           ΔVCM = (VD − VCM + Vth)/(1 − ACM) = (2.47 − 2.33 + 0.7)/(1 + 1.92) = 0.29 V
```

Every number matches your handwritten key — and now each step has a reason.

**CMRR, briefly.** With perfectly matched halves, a CM input moves both outputs *identically*, so it cancels completely in `Vout1 − Vout2`. Real halves are slightly mismatched, which leaks a little CM into the differential output. The figure of merit is `CMRR = |Ad/A_CM→DM|`, approximately `(1 + 2gm·RSS)·gm/Δgm` — a big tail resistance and good matching both help.

> **Lock it in:** differential signals → `P` is ground → half circuit = CS stage → `Ad = −gm(RD‖rO)`. Common-mode signals → split `RSS` into `2RSS` → degenerated CS → `ACM = −RD/(1/gm + 2RSS)`.

---

## MODULE 20 — The differential pair with transistor loads

Because of the half-circuit rule, **every Part 2 load drops straight in**:

| Load (per side) | Half circuit | `Ad` | Your tutorial |
|---|---|---|---|
| Resistor `RD` | CS + resistor | `−gm(RD ‖ rO)` | T1.Q4 |
| Diode-connected PMOS | CS + diode | `−gm1,2/gm3,4 = −√(µn(W/L)1,2 / µp(W/L)3,4)` | T1.Q2 → ratio 25 |
| PMOS current source | CS + current source | `−gm1,2(rO1,2 ‖ rO3,4)` | T1.Q3 → 18 V/V |

There's one more load — and it's the most important circuit in your course.

---

## MODULE 21 — The five-transistor OTA (current-mirror load)

**The problem with the loads above:** they give two outputs. Often you want **one**. But if you just take one output, you throw away half the signal. The fix: load the pair with a **PMOS current mirror** (Module 9). Watch where the signal current goes:

_[Claude used visualize:show_widget]_

**Follow the signal currents** (orange arrows):

1. `+vd/2` on `M1` raises its current by `i = gm·vd/2`. That current flows up through the diode-connected `M3`.
2. The mirror **copies** it: `M4` now pushes an extra `+i` into the output node.
3. Meanwhile `−vd/2` on `M2` makes it draw `i` **less** from the output node.
4. KCL at the output: extra `i` coming in from `M4`, `i` less leaving through `M2` → **`2i` must flow into the load**.

`2i = gm·vd`, so the whole input signal reaches the output — nothing wasted:

```
Gm   = gm1,2                   (the mirror recovers the "lost" half)
Rout = rO2 ‖ rO4               (two drains meet at the output — Rule 2 twice)
Av   = gm1,2 (rO2 ‖ rO4)       ≈ gm·rO/2
```

`Vin1` is the **non-inverting** input (raise it, `Vout` rises); `Vin2` is the inverting one.

**Headroom — and the diode costs a threshold again:**

```
Vin,CM,min = VISS + VGS1                  (tail needs room; VISS = Vov5 for a transistor tail)
Vin,CM,max = VDD − |VGS3| + Vth1          (the diode pins M1's drain at VDD − |VGS3|; then M1's fence)
Vout,max   = VDD − |Vov4|                 (M4 is a plain current source here, not a diode)
Vout,min   = Vin,CM − Vth2  ≥  VISS + Vov2
```

## Worked Example 14 — your Tutorial 1, Q5

Mirror-loaded pair, `k'W/L = 4 mA/V²` for all, `|V_A| = 5 V`. Find `I` for `Ad = 20`:

```
per side: ID = I/2          rO2 = rO4 = 5/ID    →   rO2 ‖ rO4 = 2.5/ID
gm = √(2 × 4m × ID)
Ad = √(8m·ID) × 2.5/ID = 20     ⟹   ID = 125 µA     ⟹   I = 250 µA
check: gm = 1 mA/V, rO = 40 kΩ, rO‖rO = 20 kΩ, Ad = 1m × 20k = 20  ✓
```

Your exam question (parts a–c) is this module with numbers: the CM limits give you `|Vov3|` and `Vov1`, the square law gives the sizes, `gm(rO2‖rO4)` gives the gain, and the swing is `VDD − |Vov4|` down to `Vov5 + Vov2`.

---

## MODULE 22 — Poles and bandwidth

**Why you need it:** every "3-dB bandwidth" part of an exam question, and all of Lecture 1's speed parameters.

A **capacitor** is a resistor that depends on frequency: `Z = 1/(jωC)`. At DC it's an open circuit; at very high frequency it's a short. So a node with a resistance `R` and a capacitance `C` to ground behaves differently at slow and fast signals:

_[Claude used visualize:show_widget]_

- **Slow signals:** the capacitor is effectively open, so the node sees just `R`, and the gain is `gm·R`.
- **Fast signals:** the capacitor starts shorting the node to ground, its impedance `1/(ωC)` shrinks, and the gain falls — **10× lower for every 10× faster** (−20 dB/decade).
- **The corner** is the **pole**: `ω_p = 1/(R·C)`, or in hertz `f_p = 1/(2πRC)`.

**In an op amp**, the node with the biggest resistance is the output (`Rout`), and it drives the load `CL`. That node sets the bandwidth — the **dominant pole**:

```
ω_p = 1/(Rout·CL)
```

Now multiply the gain by the bandwidth and watch something remarkable:

```
GBW = Av × ω_p = gm·Rout × 1/(Rout·CL) = gm/CL
```

**`Rout` cancels.** Making the transistors longer raises the gain but lowers the bandwidth by exactly the same factor. **The speed of a one-stage op amp depends only on `gm` and `CL`.**

**Your exam question, part (d):** `Rout = 111.1 kΩ`, `CL = 4 pF`, `gm = 0.8 mA/V`:

```
f−3dB = 1/(2π × 111.1k × 4p) = 358 kHz          GBW = gm/(2πCL) = 0.8m/(2π × 4p) = 31.8 MHz
check: 88.9 (gain) × 358 kHz = 31.8 MHz  ✓
```

(The five-transistor OTA also has a second pole at the mirror node `X`, near `gm3/C_X`. It's high, so it doesn't set the bandwidth — but it matters for stability, in Lectures 11–14.)

> **Lock it in:** pole = `1/(RC)` at every node. Dominant pole = `1/(Rout·CL)`. `GBW = gm/CL` — `rO` cancels.

## Part 3 memory kit

1. **"Split into shared and different."** `VCM = (V1+V2)/2`, `vd = V1 − V2`.
2. **"The tail is a fixed pie."** `ID1 + ID2 = ISS`; full steering at `±√2·Vov`.
3. **"Differential: P is ground, half circuit is a CS stage."** `Ad = −gm(RD‖rO)`.
4. **"Common mode: split `RSS` into `2RSS`, then use the ratio rule."**
5. **"The mirror recovers the lost half."** Five-transistor OTA: `Gm = gm`, `Av = gm(rO2‖rO4)`.
6. **"`GBW = gm/CL` — speed is `gm` over `CL`, nothing else."**

---
---

# LECTURE 1 — Op-amp performance parameters (Razavi §9.1)

Everything above was the foundation. Now we grade the op amp — and each grade is something you can already calculate.

**What an op amp is**, in Razavi's words: a **high-gain differential amplifier**, where "high" means *enough for the application* — typically 10 to 100,000. The five-transistor OTA from Module 21 **is** an op amp. Its gain from your exam question was 88.9.

## 1.1 Gain

**The problem:** `Av = gm(rO2‖rO4)` depends on mobility, `Cox`, `λ` — all of which drift with process and temperature. An 89 on one chip might be 70 on another.

**The fix: negative feedback.** Wrap the op amp in a resistor divider and feed a fraction of the output back to the inverting input:

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used visualize:show_widget]_

_[Claude used quiz_display_v0]_

The foundation is now complete, and Lecture 1 sits on it: every performance parameter is a calculation you can do from the modules above, and your exam question — sizing, gain, swing, bandwidth, buffer bandwidth — uses only Modules 17, 21 and 22 plus Lecture 1's feedback results.

**Next: Lecture 2** (one-stage op amps, §9.2.1) — the five-transistor OTA and its fully differential cousin analysed completely, then the telescopic cascode (Module 14 applied to the differential pair), and the unity-gain-buffer trap. After that, Tutorials 2 and 3 are fully in reach, and I'll work them with you.
