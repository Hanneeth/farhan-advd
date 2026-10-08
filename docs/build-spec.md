# Build prompt: "Analog Gym" — an interactive tutor for Razavi's op-amp chapter

> **How to use this file (for me, the student)**
> 1. Make a new folder, e.g. `analog-gym/`. Inside it create `source/` and put in:
>    - `source/conversation/` — the exported Claude conversation (all text + the inline SVG diagrams)
>    - `source/razavi.pdf` — Razavi, *Design of Analog CMOS Integrated Circuits*, 2nd ed.
>    - `source/notes/` — photos of my lecture notes and handwritten tutorial solutions
>    - `source/tutorials/` — tutorial sheets and the exam paper images
>    - `source/handout.pdf` — the EEE/INSTR F313 course handout
> 2. Save this file in the folder root as `CLAUDE.md` so Claude Code keeps it as standing project instructions (see https://docs.claude.com/en/docs/claude-code/overview).
> 3. Start Claude Code in the folder and say: **"Read CLAUDE.md and start Milestone 1."** Review after every milestone before saying "continue".

---

## 1. Your role and mission

You are building a personal, offline, interactive learning app that takes one student from **zero** to **confidently solving tutorial- and exam-level problems** in analog CMOS op-amp design (Razavi Chapter 9, plus the prerequisite parts of Chapters 2–6 and 8).

The student has said, repeatedly and clearly: *"I don't understand what's going on at all."* Long text explanations — even good ones — have not worked. The app must teach by **doing, seeing, and predicting**, one small idea at a time, with a picture for everything and a number for everything.

Success = the student can take a fresh problem like their Tutorial 1–3 sheets or their exam question, draw the circuit, run the method, and get the right numbers — without looking anything up.

---

## 2. The learner

- Course: **EEE/INSTR F313 Analog & Digital VLSI Design**, BITS Pilani K K Birla Goa Campus, semester 1 of 2026–27. Textbook: Razavi (the handout cites 1st-edition section numbers; map them to the 2nd edition — see §7).
- **Mid-semester exam: 9 Oct 2026, 90 min, closed book.** Quiz III: 30 Oct (open book). Quiz IV: 20 Nov. Comprehensive: 8 Dec (closed book). Show a countdown and prioritise content that is needed first.
- Current state: has seen all the material once, retained almost none of it. Needs the foundations rebuilt: voltage drops, the MOSFET, saturation, small signal, every single-stage amplifier, the differential pair, the five-transistor OTA, poles — *then* the op-amp lectures.
- Learns best with: pictures, analogies, interactive manipulation, worked numbers, short steps, immediate feedback, and repetition until it sticks.
- Notation: uses **exactly** the notation in their lecture notes (see §6). Do not introduce alternative symbols.

---

## 3. Source material — read this before writing any code

1. **`source/conversation/`** is the most important input. It is a long tutoring conversation that already contains:
   - a complete ground-up curriculum (Parts 1–3: Modules 1–22) and rebuilt Lecture 1, plus lectures on gain error, settling, one-stage op amps, cascode/telescopic op amps, the unity-gain buffer window, and the folded cascode;
   - Razavi's methods distilled: the four-step master method, transistor roles, the three impedance rules, the ratio rule, headroom stacking, the saturation "fences";
   - ~60 hand-checked SVG circuit diagrams (look for `widget_code` / `<svg` blocks) — use them as **reference designs** for the parametric diagram components;
   - worked solutions with verified numbers (see §11 regression table);
   - analogies that worked (water tank, tap handle, waterfall for pinch-off, see-saw, tap-and-bucket for slew rate, cake for exponential settling, room with ceiling and floor for headroom).
   Build a structured inventory from it first: every concept, formula, worked example, analogy, diagram, and quiz question, each tagged with its unit. Save it as `content/inventory.md` and show me before building lessons.
2. **`source/razavi.pdf`** — use for section numbers, the order Razavi introduces ideas, his examples (9.1–9.8 etc.) and end-of-chapter problems. **Do not copy book text or figures verbatim.** Paraphrase, redraw, and cite "Razavi 2nd ed. §x.y / Example x.y / Problem x.y".
3. **`source/notes/`, `source/tutorials/`** — the student's actual lecture notes and tutorial sheets. The tutorial sheets are verbatim Razavi end-of-chapter problems (Tut 2 = Problems 9.1–9.3, Tut 3 = 9.4, 9.6, 9.8, Tut 4 Q1 = 9.10, Tut 5 = 9.11, 9.12). The handwritten solutions are for Tutorial 1 and are correct.
4. **`source/handout.pdf`** — the lecture plan and exam dates.

Where sources disagree, flag it to me; do not silently pick one.

---

## 4. What to build — the product

A single-page web app with five areas:

| Area | Purpose |
|---|---|
| **Path** | The curriculum as a map of units and lessons, with mastery state (locked / learning / mastered) and the exam countdown. Always shows "your next step". |
| **Learn** | Bite-sized interactive lessons (template in §5.2). |
| **Labs** | Free-play interactive simulators (§8) — every lesson links to the relevant lab with a preset. |
| **Practice** | Endless generated problems in tutorial style, plus the fixed problem bank (§10), with hint ladders and full step-by-step solutions. |
| **Review** | Spaced-repetition deck of formulas, rules, pictures and "why" questions; a mistake log; a timed exam mode. |

No login, no backend, no network needed. Progress persists locally and can be exported/imported as a JSON file.

---

## 5. Pedagogy — non-negotiable rules

### 5.1 Principles
1. **Intuition first, then math** (Razavi's own rule). Every concept opens with a picture or a manipulable widget, *then* the words, *then* the formula, *then* numbers.
2. **One idea per step.** A lesson step has at most ~120 words of text and always one visual. No walls of text anywhere in the app.
3. **Predict, then reveal.** Before showing any result, ask the student to predict it (multiple choice, a slider guess, or "which way will it move?"). Then show the answer and why.
4. **Every symbol defined where it first appears**, and hoverable/tappable everywhere afterwards (global glossary).
5. **Worked example → faded example → independent problem.** The first time a method appears, show every step. Next time, hide one step. Then hide all.
6. **Mastery gating.** A lesson is "mastered" at ≥ 80% on its check, including at least one numeric problem. Later units stay locked until prerequisites are mastered (allow a manual override).
7. **Retrieval and spacing.** Every lesson adds cards to Review. Use a Leitner or SM-2 schedule.
8. **Interleave** once a unit is mastered: practice sets mix problem types so the student must *recognise* which method applies.
9. **Diagnose mistakes, don't just mark them wrong.** Detect common errors (§5.4) and give targeted feedback.
10. **Consistency.** One method, taught everywhere: the four-step master method (§5.3). Every lesson and every solution uses the same steps, same words, same notation.

### 5.2 Lesson template (every lesson follows this)
1. **Why you need this** — one sentence tied to a real tutorial/exam question.
2. **The picture** — interactive diagram or animation.
3. **Predict** — a question before the explanation.
4. **The idea** — ≤ 120 words, plain language, one analogy if helpful.
5. **The rule** — the formula, boxed, with every symbol labelled on the diagram.
6. **Worked example** — real numbers, every step shown, tied to the diagram (hovering a step highlights the relevant part of the circuit).
7. **Your turn** — 2–3 generated problems, faded support.
8. **Lock it in** — one-line summary + the memory hook; cards added to Review.

### 5.3 The master method (must appear identically everywhere)
```
STEP A  DC recipe: assume saturation → square law → walk the node voltages → CHECK the fence
STEP B  Give every transistor a ROLE by where the signal enters and leaves:
          gate→drain = common source · gate→source = follower · source→drain = common gate
          gate fixed, no signal = current source (rO) · gate tied to drain = diode (1/gm)
STEP C  Replace every load by its resistance using the three impedance rules
STEP D  Av = −Gm × Rout, then fix the sign by inspection
```
Plus the rules taught alongside it:
- **Three impedance rules:** into gate = ∞; into drain = rO (degenerated: rO + (1 + gm·rO)·RS ≈ gm·rO·RS); into source ≈ 1/gm (+ RD/(gm·rO) if the drain is loaded).
- **"Up multiplies, down divides — by gm·rO."**
- **Ratio rule:** |Av| = (resistance at the output terminal) ÷ (resistance in the source path, where the transistor itself counts as 1/gm).
- **Fences:** NMOS saturated ⟺ VD ≥ VG − Vth; PMOS saturated ⟺ VD ≤ VG + |Vth|.
- **Headroom:** each stacked device costs |Vov|; a diode connection costs |VGS|; a tail source costs VISS.
- **Smallest resistance in parallel wins.**

### 5.4 Mistake catalogue (detect and give targeted feedback)
Forgot to square Vov · used VGS where Vov was needed · forgot the ½ in the square law · forgot to check saturation · PMOS sign errors (should use magnitudes) · forgot 2π when converting ω to f · forgot rO in parallel · used rO instead of rO/2 for equal parallel pair · forgot the diode costs a full threshold · confused β with βA · used A instead of 1/β for closed-loop gain · used RSS instead of 2RSS in the CM half circuit · treated a cascode with a simple load as if Rout were gm·rO² · wrong unit prefix (µ vs m) · mixed up ln(1/ε) values. For each, write the specific hint.

### 5.5 Analogies (use these; they worked)
Voltage = water height; current = flow; resistance = narrow pipe; ground = sea level · MOSFET = tap whose handle is the gate · saturation = waterfall (flow set upstream, not by the drop) · op amp = super-sensitive see-saw · feedback = filling a glass while watching the line · GBW = a fixed pocket of coins · exponential settling = eating half of what's left of a cake each minute · slewing = a fixed tap filling a bucket · headroom = a room with a ceiling and floor where every stacked transistor needs breathing room · differential outputs = two kids on a see-saw (difference is twice as tall) · offset = bathroom scale reading 0.5 kg with nobody on it · supply rejection = drawing on a bumpy bus.

---

## 6. Notation and physics — single source of truth

Put all physics in one pure TypeScript module (`src/physics/`) with no UI code, fully unit-tested. Every formula in the app must come from here.

**Symbols (exactly these):** VDD, VSS, VGS, VDS, VG, VD, VS, Vth (Vthn, Vthp), Vov (overdrive = VGS − Vth), |Vov3| for PMOS, ID, ISS, VISS (headroom of the tail source — *not* a supply), µnCox, µpCox, W/L, λ, gm, rO, Av, Ad, ACM, A (open-loop), Aopen, Aclosed, β, ε, A0, ω0, ωu (= GBW), τ, CL, Rout, Rup, Rdown, SR, VCM, vd.

**Device model:**
```
Vov = VGS − Vth
triode (VDS < Vov):   ID = µCox (W/L) [ Vov·VDS − VDS²/2 ]
saturation (VDS ≥ Vov): ID = ½ µCox (W/L) Vov² (1 + λ VDS)     (use λ = 0 for DC bias unless told otherwise)
gm = µCox (W/L) Vov = √(2 µCox (W/L) ID) = 2 ID / Vov
rO = 1/(λ ID) = VA / ID,  VA = |V'A| · L
PMOS: identical with magnitudes |VGS| = VS − VG, |Vov| = |VGS| − |Vth|
Body effect: γ = 0 by default (the tutorials state this); keep gmb = 0 unless a lesson explicitly introduces it.
```

**Circuit results (all must exist as tested functions):** CS with resistor / diode / current-source / triode / active load; degenerated CS (Gm, Av, Rout); follower (Av, Rout); common gate (Av, Rin); cascode (Rout, Av); telescopic (gain, swing, three bias conditions, unity-gain window Vth − Vov4); folded cascode (Rup, Rdown, Gm with the exact current-divider expression, swing, input CM limits); differential pair (steering curve, ±√2·Vov, Ad, ACM = −RD/(1/gm + 2RSS), CMRR); current mirror ratio; five-transistor OTA (Gm = gm1,2, Av = gm(rO2‖rO4), Vin,CM,min/max, swing); single pole (ωp = 1/(Rout·CL), GBW = gm/CL); feedback (A/(1+βA), ε = 1/(1+βA), A_min = Aclosed/ε, Rout,closed = Rout/(1+βA)); settling (τ = Aclosed/ωu, t = τ·ln(1/ε)); slew (SR = ISS/CL); linear scaling (W, I × α).

---

## 7. Curriculum map

Map the handout's 1st-edition sections to the 2nd edition in the UI (e.g. "Handout L4 · 1st ed §9.2.4–9.2.5 · 2nd ed §9.2.4–9.2.6").

**Foundations (build first — this is where the student is)**
- **U0 Circuit language** — voltage/current/resistance, Ohm, KCL, KVL, node voltages, voltage drops (the "node = supply − drops" skill), resistor divider, parallel resistances, current divider.
- **U1 The MOSFET** — structure, the gate as a capacitor, channel formation, Vth, overdrive, W/L.
- **U2 Triode, saturation, pinch-off** — channel thickness along the channel, the waterfall, the fence, the square law, λ, the ID–VDS family.
- **U3 DC recipe and PMOS** — assume/solve/walk/check, analysis vs design direction, PMOS with magnitudes.
- **U4 Small signal** — linearisation (tangent at Q), gm three ways, rO, intrinsic gain gm·rO = 2/(λVov), the three conversion rules (DC voltages → AC ground, DC currents → open, transistor → gm·vgs ‖ rO).
- **U5 First amplifier: common source** — transfer curve, gain = slope at Q, −gm(RD‖rO), |Av| = 2·V_drop/Vov, Av = −Gm·Rout.
- **U6 Impedance rules, current sources, diodes, mirrors** — derive each rule from the model; the diode costs a threshold.
- **U7 CS with every load + degeneration** — ratio rule.
- **U8 Source follower and common gate.**
- **U9 Cascode** — degeneration by rO, shielding, the load trap, telescopic.
- **U10 Differential pair** — CM/DM split, current steering, CM input range, half circuit, 2RSS common-mode half circuit, CMRR, MOS loads.
- **U11 Five-transistor OTA** — signal-current flow through the mirror, Gm = gm, CM range, swing.
- **U12 Poles and bandwidth** — capacitor as frequency-dependent resistor, pole per node, dominant pole, GBW = gm/CL, the mirror pole.

**Handout lectures**
- **L1 Performance parameters** (§9.1) — gain & feedback (Ex 9.1), small-signal bandwidth & settling (Ex 9.2), wrong-polarity feedback (Ex 9.3), large-signal/slewing, output swing, linearity, noise, offset, supply rejection.
- **L2 One-stage op amps** (§9.2.1) — 5-T OTA, fully differential with current-source loads, telescopic cascode, unity-gain buffer (Ex 9.4), buffer window (Ex 9.5), CM choice for switched-capacitor use (Ex 9.6).
- **L3 Design procedure** (§9.2.2–9.2.3) — power budget → swing budget → overdrives → W/L → check gain → lengthen off-signal-path devices (gm·rO ∝ √(WL/ID)) → bias voltages (Ex 9.7) → linear scaling (Ex 9.8) → Vb1 tracking (Fig 9.12).
- **L4 Folded cascode** (§9.2.4–9.2.6) — folding transformation, ISS1 = ISS/2 + I1, input-CM inequality flip, Rup/Rdown, Gm via current divider, swing, folding-node pole, NMOS-input version.
- **L5–L14** — create empty, locked placeholders now (two-stage op amp, gain boosting, CMFB ×2, input range & slew rate, PSRR & noise, stability ×2, compensation ×2). They will be filled later.

---

## 8. Interactive labs (the heart of the app)

Each lab: live SVG circuit + sliders/inputs + live numbers + live graph + a "what to discover" checklist of 3–5 guided challenges ("Make M1 leave saturation. What happened to the gain?").

1. **MOSFET lab** — sliders VGS, VDS, W/L, µCox, λ. Shows the channel cross-section thinning toward the drain and pinching off, the ID–VDS curve family with the live operating point, the region badge (OFF / TRIODE / SAT), and gm, rO, gm·rO.
2. **DC recipe stepper** — pick or generate a circuit (NMOS/PMOS with RD, mirror bias, diff pair). The app walks through Step A one click at a time, writing each node voltage onto the diagram, and highlights the fence check in green or red.
3. **Headroom stack** — draggable bands for each stacked device (|Vov| per device, VISS, diode = |VGS|); shows the remaining swing and which device leaves saturation first. Presets: 5-T OTA, telescopic, mirror-loaded telescopic, folded cascode, Ex 9.7.
4. **Impedance explorer** — click a terminal of a transistor; add RS or RD; the app shows the formula, the number, and animates the "fighting back" current.
5. **CS amplifier lab** — switch the load (resistor / diode / current source / triode / active / degenerated); transfer curve with a draggable Q point; tangent = gain; shows Gm, Rout, Av and the output swing limits.
6. **Differential pair lab** — sliders Vin1, Vin2 (also shown as VCM and vd); animated current steering with ±√2·Vov marked; toggle "half circuit" to show the DM and CM half circuits (2RSS); computes Ad, ACM, CMRR.
7. **Five-transistor OTA lab** — animated signal currents (+i through M1 and M3, mirrored +i in M4, −i in M2, net 2i into CL); live CM range and swing; toggle unity-gain feedback to show Rout → 1/gm and the pole → gm/CL.
8. **Feedback, Bode and settling lab** — sliders A0, ω0, β, CL, ISS; Bode plot with the 1/β line and βωu; step response with the ε band and 4.6τ/6.9τ markers; a "big step" toggle that shows slewing at ISS/CL before the exponential.
9. **Cascode lab** — telescopic and folded cascode, with Vb1/Vb2/Vin,CM sliders; each device shows its saturation status; bias-voltage ladder (every node on one voltage axis, as in Ex 9.7); Rout comparison chart (simple load vs cascoded load).

---

## 9. Circuit diagram system

- Build a small React SVG component library: `Nmos`, `Pmos`, `Resistor`, `Capacitor`, `CurrentSource`, `Ground`, `Rail`, `Wire`, `Node`, `Label`, `CurrentArrow`, `OpAmp`. Components take props for node voltages, region, currents, and highlight state.
- Offer two drawing styles, switchable: proper transistor symbols, and the simplified labelled boxes used in the conversation (NMOS = purple, PMOS = teal, passives = gray).
- Every node can show its live voltage; every transistor can show a region badge and its ID.
- Rebuild **every** figure from the conversation as a parametric component — including the student's lecture-note figures (5-T OTA, telescopic both versions, folded cascode, half circuits, Fig 9.9 buffer, Fig 9.11 with bias mirrors, Fig 9.12 tracking circuit).
- No overlapping labels. After building each diagram, screenshot it (Playwright) at desktop and mobile widths and check.

---

## 10. Practice engine

- **Problem schema (JSON/TS):** id, unit/lecture tags, source (e.g. "Razavi Problem 9.2" or "generated"), circuit reference, givens (with units), unknowns, solution function (from `src/physics`), step trace (following the master method), tolerance, hints ladder (nudge → which method → which formula → first worked step), common-mistake detectors.
- **Generators** per problem type, with randomised but *physically sane* values: every generated bias point must be verified (all devices saturated, positive currents, voltages within rails) before showing it.
- **Answer entry** with units and SI prefixes (µ, m, k, M, p); accept ±1–2% (configurable); explain *why* a wrong answer is wrong using §5.4.
- **Full solution view**: the step trace rendered next to the diagram, each step highlighting the relevant devices/nodes.
- **Fixed bank (include all, restated in plain words, with the circuit drawn):** Tutorial 1 Q1–Q5; the exam question (5-T OTA, parts a–e); Razavi Examples 9.1, 9.2, 9.4, 9.7, 9.8; Tutorial 2 (Razavi 9.1–9.3); Tutorial 3 (Razavi 9.4, 9.6, 9.8); Problem Set 1 P1–P10 from the conversation. Tutorials 4–5 (gain boosting, CMFB) as locked items tied to L6–L8.
- **Problem sets:** every 3–4 handout lectures, assemble a set of ~10 problems at tutorial level or harder, on topics common to the book, the handout and the lectures, each with its figure.

---

## 11. Verification — check everything twice

1. **Unit tests** (Vitest) for every physics function, including edge cases (PMOS magnitudes, triode boundary, λ = 0).
2. **Regression tests** — these answers were verified in the conversation and must be reproduced exactly (to rounding):

| Problem | Expected |
|---|---|
| Part 1 WE1 (VDD 1.8, VG 0.7, Vth 0.4, µnCox 200µ, W/L 10, RD 10k, λ 0.1) | Vov 0.3 V, ID 90 µA, VD 0.9 V, gm 0.6 mA/V, rO 111.1 kΩ, gm·rO 66.7, Av −5.50 (−6 with rO ignored) |
| Part 1 WE2 (design) | W/L 22.2, VG 0.5 V, RD 9 kΩ |
| Part 1 WE3 (PMOS: VS 1.8, VG 0.9, \|Vth\| 0.5, µpCox 100µ, W/L 20, RD 5k) | \|Vov\| 0.4 V, ID 160 µA, VD 0.8 V |
| Tut 1 Q1 | RD 9 kΩ; (W/L)1,2 22.22; (W/L)3 44.44; (W/L)4 22.22; R 13 kΩ; CMIR −0.25 V to +0.35 V |
| Tut 1 Q2 | W1,2/W3,4 = 25 |
| Tut 1 Q3 | (W/L)1,2 12.5; (W/L)3,4 50; Ad 18 V/V |
| Tut 1 Q4 | VCM 2.33 V; RD 5.06 kΩ; VD 2.47 V; ACM −1.92 V/V; ΔVCM 0.29 V |
| Tut 1 Q5 | I = 250 µA |
| Exam Q1 (assumes (W/L)5,6 = 30 — the scan is cut off; flag this in the UI) | (W/L)3 19.2; (W/L)1 26.67; Av 88.9; Vout 0.35–1.55 V (swing 1.2 V); f−3dB 358 kHz; buffer f−3dB 31.8 MHz; SR 30 V/µs |
| Razavi Ex 9.1 | A ≥ 1000 (990 exact) |
| Razavi Ex 9.2 | ωu ≥ 9.21 Grad/s; fu ≥ 1.47 GHz |
| Razavi Ex 9.7 | (W/L)1–4 1250, (W/L)5–8 1111, (W/L)9 400; Av ≈ 1.4×10³ (book: 1416); ≈ 4000 after doubling W and L of M5–M8; Vin,CM 1.4 V, Vb1 1.6 V, Vb2 1.7 V; Vout 0.9–2.4 V |
| Problem Set 1 P1 | Av 84.3; CM 0.874–1.417 V; Vout 0.474–1.517 V; f−3dB 1.19 MHz; buffer 100.7 MHz |
| P2 | ε 5.6%; A0 ≥ 1000; τ 7.9 ns; t0.1% 54.6 ns |
| P3 | Av ≈ 854; swing 2.66 Vpp diff; Vin,CM 1.373 V, Vb1 1.646 V, Vb2 1.478 V |
| P4 | Vb1 +0.227 V → 1.873 V; diff swing −0.454 V |
| P5 | VX 0.707 V; Vout 0.900–1.478 V; buffer window 0.900–1.407 V (0.507 V) |
| P6 | ISS 0.75 mA, I 0.375 mA; overdrives 0.5 V; (W/L)3,4 22.3, (W/L)5,6 44.7, (W/L)7–10 78.2, (W/L)1,2 217; Av ≈ 333; ωu 1.25 Grad/s |
| P7 | 91.1% reaches output; Av ≈ 304 |
| P8 | Vin,CM ≈ −0.3 V to 1.5 V; Vout 1.0–2.0 V; choose VCM = 1.5 V |
| P9 | α = 4; power 18 mW; (W/L)1,2 869 |
| P10 | folded cascode; gm ≥ 0.69 mA/V; overdrives 0.3 V; ISS 200 µA, I 100 µA; Av ≈ 2300; 0.72 mW |

3. **Not yet verified in the conversation — solve with the engine and report agreement or disagreement to me:** Tutorial 2 (my preliminary values: 9.1(b) Av ≈ 24.4, single-ended output 0.60–2.49 V; 9.2 minimum PMOS W ≈ 106 µm at L = 0.5 µm, output 0.70–1.50 V, Av ≈ 1.3×10³; 9.3 overdrives ≈ 0.45 V, Av ≈ 250, input CM can reach 0 V) and all of Tutorial 3.
4. **Two independent solves**: for every generated problem, compute the answer both from the direct formula and from the step trace; they must agree, or the problem is discarded and logged.
5. **Content lint** per lesson: every symbol defined; a visual present; a prediction question present; text per step ≤ ~120 words; notation matches §6.
6. **Diagram check**: screenshots at 1280 px and 390 px widths; no overlapping text; labels readable in light and dark mode.

---

## 12. Tech stack and architecture

- **Vite + React + TypeScript**, no backend. **KaTeX** for formulas. Hand-rolled SVG for circuits; a light charting approach (SVG or a small library) for curves.
- State: local storage / IndexedDB with JSON export/import.
- Tests: **Vitest** (physics, generators, regression table); **Playwright** for screenshots and a smoke test of every lesson.
- Build targets: `npm run dev` for local use, and a **single self-contained HTML file** (e.g. via `vite-plugin-singlefile`) that I can open anywhere offline.
- Structure:
```
src/physics/        pure functions + tests (single source of truth)
src/circuits/       SVG component library + parametric figures
src/labs/           the nine labs
src/content/        units/lessons as data (MDX or TS objects), glossary, analogies, cards
src/practice/       schema, generators, fixed bank, checker, hint ladders, mistake detectors
src/review/         spaced repetition, mistake log, exam mode
src/app/            routing, Path map, progress, settings
content/inventory.md  extracted from the conversation
```

---

## 13. Visual design direction

The subject is an engineer's lab notebook and a circuit bench. Choose a distinctive, calm, readable identity — not a generic dashboard or card grid. Priorities, in order: legibility of circuits and numbers, a consistent colour code for device types and signal paths, generous spacing, clear focus states. Support dark mode, keyboard navigation, reduced motion, and mobile widths (I will study on a phone too). Motion only to show cause and effect (current flowing, channel pinching, the output ramping). Propose a small token system (4–6 colours, 1–2 typefaces, spacing scale) before building and show it to me.

---

## 14. Milestones — stop after each, summarise, and tell me what to test

1. **M1 Foundations:** inventory from the conversation; physics module with tests and the regression table passing; circuit component library; U0–U5 lessons; MOSFET lab; DC recipe stepper; generators for DC and CS problems; Path map with progress.
2. **M2 Single-stage:** U6–U9; impedance explorer; CS amplifier lab; cascode lab (telescopic part); generators for every CS load, follower, CG, cascode.
3. **M3 Differential and bandwidth:** U10–U12; differential pair lab; OTA lab; feedback/Bode/settling lab; headroom stack; Tutorial 1 and the exam question in the fixed bank.
4. **M4 Handout lectures 1–4:** L1–L4 lessons; Tutorials 2–3 and Problem Set 1; folded-cascode lab; Review deck; mistake log; timed exam mode (mid-sem style); single-file HTML build.
5. **M5 onward:** fill L5–L14 as I send notes for each lecture, plus Tutorials 4–5 and a new problem set every 3–4 lectures.

---

## 15. Acceptance criteria

- I can open the app offline and always see my next step.
- Every lesson follows the template; every concept has a picture and a prediction question.
- Every formula comes from `src/physics` and is tested; the full regression table passes.
- Every generated problem is physically valid and has a step-by-step solution in master-method form.
- Wrong answers get a specific, diagnosed hint, not just "incorrect".
- All figures from the conversation and my lecture notes exist as parametric diagrams with no overlapping labels.
- Notation matches §6 everywhere.

## 16. Do not

- Write long paragraphs, or introduce a formula before its picture.
- Skip defining a symbol, or use a symbol not in §6.
- Copy Razavi's text or figures verbatim.
- Hard-code an answer that is not produced by the physics module.
- Move on to the next milestone without stopping for my review.
