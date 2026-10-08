# How other tools teach this — and what Analog Gym borrows

Research notes (Sept 2026) for the M2/M3 build. The question: how do the best
interactive tools make transistor circuits *visible*, and does that still work once
a circuit has 5–11 MOSFETs (5-T OTA, telescopic, folded cascode)?

| Tool | What it does well | What we take |
|---|---|---|
| **Falstad CircuitJS** ([falstad.com/circuit](https://falstad.com/circuit/)) | Wires coloured by voltage (green +, grey 0, red −); current as moving yellow dots whose speed = current; hover any element to read V and I. Still the most-loved teaching simulator because you *watch* the circuit. | Flow dots on every branch with speed ∝ current; node-voltage pills; hover-to-inspect a transistor (VGS, VDS, Vov, ID, region, gm, rO). Optional "voltage colour" mode for wires. |
| **EveryCircuit** ([everycircuit.com](https://everycircuit.com/)) | Node voltages printed on the schematic; dot brightness/speed for current; **the region (linear/saturation) drawn inside the MOSFET symbol**; one knob for the selected parameter. | Region badge on every device, coloured green (SAT) / amber (TRIODE) / grey (OFF). One slider panel per lab, the thing you change sits next to the picture. |
| **PhET Circuit Construction Kit** ([phet.colorado.edu](https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc)), *implicit scaffolding* research ([arXiv 1306.6544](https://arxiv.org/pdf/1306.6544)) | Hide everything that isn't the concept; the interface itself guides exploration; conventional-current vs electron toggle; 600+ student interviews behind the design. | Each lab shows only the 2–4 sliders that matter, plus a "what to discover" checklist. Presets instead of a blank canvas. |
| **nanoHUB MOSFet tool** ([nanohub.org/resources/mosfet](https://nanohub.org/resources/mosfet)) | Device physics: I–V families, channel charge. Accurate, but a research GUI — too many knobs for a beginner. | Keep our cross-section (channel thinning + pinch-off) but only for the single-device lessons. |
| **MIT 6.002/6.012 demos** ([OCW demo](https://www.ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/04c5b9d07519db0f7d6a145175be86e2_demo_10.pdf)) | Load line over the I–V family; operating point sliding; hear distortion when it leaves saturation. | Draggable Q point on the CS transfer curve; the swing limits drawn as the two "fences". |
| **Razavi's own teaching** ([UCLA 215A info](http://www.seas.ucla.edu/brweb/teaching/215A_F2014/CourseInfo.pdf)) | Intuition first, then rigour; the goal is analysis **by inspection** and knowing which approximations are safe. | The master method + ratio rule + "up multiplies, down divides" are the inspection tools; every solution trace uses them. |
| **Explorable explanations / Bret Victor, "Up and Down the Ladder of Abstraction"** ([worrydream.com](https://worrydream.com/)) | Reactive documents: numbers in the text change as you drag; step down to one concrete case, step up to "all cases" (a plot over a parameter). | Every lab pairs the live circuit (one case) with a plot over the swept parameter (all cases), e.g. Rout vs load type, Ad vs vd, Bode vs β. |

## Why a single-transistor picture does not scale — and the fix

With one transistor you can show the channel. With the 5-T OTA or a telescopic
cascode, that level of detail is noise. What the good tools do instead, and what the
new `Schematic` engine in `src/circuits/schematic.tsx` does:

1. **Every device carries its own state** — region badge + ID, so "which transistor
   left saturation?" is answered by colour, not by reading numbers.
2. **Branch currents as flow dots**, dot speed ∝ ID. In a diff pair you *see* the
   current steer from one side to the other; in the OTA you see the mirror copy it.
3. **Node-voltage pills on every internal node**, so the DC recipe "node = supply −
   drops" is readable straight off the picture.
4. **Hover/tap a device → inspector card** (VGS, VDS, Vov, ID, gm, rO, fence check).
5. **Voltage ladder beside the stack** (as in Ex 9.7): every node on one vertical axis,
   bands for each |Vov|, so headroom is a picture rather than a sum.
6. **Signal-path highlight**: the devices on the signal path glow, the bias devices
   fade — this is Step B of the master method (roles) made visual.

## Level check (from the student's tutorials, quizzes and exam)

Every question in Tut 1–3, Quiz 1–2 and the mid-sem sample is one of: bias a
stack (walk the node voltages + fence), size W/L from ID and Vov, gain by
inspection (Gm × Rout with rO combos), CM range / output swing (headroom sums),
bandwidth (Rout·CL, GBW = gm/CL), feedback/settling numbers. So every lesson ends
with a problem *in that exact shape* and every lab has a preset from those papers.

## Second pass (Sep 2026): what the best learning apps do, and what changed here

| Source | What it does | Applied in Analog Gym |
|---|---|---|
| Brilliant (ustwo case study; UX Collective on interactive play) | One concept per lesson, **pretest before teaching**, instant custom feedback, a "gameboard" of progress, a companion pointing to the next lesson, small celebrations | Predict-then-reveal in every lesson; diagnosed mistakes; Path "your next step"; a pop-in celebration on mastery |
| Duolingo (path redesign, streak research) | One visible path; a **streak kept by a single lesson**; daily feedback | Streak and "today" counter on the Path; everything still open, the path is a suggestion |
| EveryCircuit, CircuitLab | Animated current, instant re-plot on every change | Flow dots on schematics; every slider re-plots live (Bode, step, VTC, delay) |
| Razavi’s own teaching (book; UCLA handouts were not reachable from this environment) | Intuition first: "the loop amplifies its own noise", "wiggle each gate", Miller as (1 + A) swing, pole splitting as a diode at high f | Used as the opening idea of the L10–L14 lessons |

New navigation: a search box and collapsible course parts on Learn, grouped Practice topics, Analog/Digital lab sections, and a mid-sem pace line (analog lessons left ÷ days left).
