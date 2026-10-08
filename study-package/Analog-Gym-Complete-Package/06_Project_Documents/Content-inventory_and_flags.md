# Analog Gym — content inventory

Built from everything in `source/`: the exported tutoring conversation, Razavi 2nd ed. (801 pp.), your handwritten lecture notes 1–12, the settling-time example, the current-mirror handout, Tutorials 1–6, the Quiz 1 and Quiz 2 keys, and the course handout.

Tags such as **[U4]** or **[L2]** give the curriculum unit each item belongs to (CLAUDE.md §7). "Conv" means the tutoring conversation.

---

## 0. Source status

| Source | Status | Notes |
|---|---|---|
| Conversation text | ✅ complete | 4,723 lines, 22 turns |
| Conversation **diagrams** (~130 widgets) | ❌ **lost in export** | Every diagram became the placeholder `[Claude used visualize:show_widget]`, so no SVG came through. The diagrams will be redrawn from the surrounding text, your lecture notes and Razavi's figures (§5). |
| Conversation **quizzes** (`quiz_display`) | ❌ lost | Only the "20 things to answer cold" audit and the Problem Set 1 statements survive. New check questions will be written per lesson. |
| Conversation images (your photos) | ✅ recovered in the second export | 40 files in `source/conversation/images/`: lecture-note screenshots, **the exam paper** (`1789657566261_image.png`), tutorial sheets and **your Tutorial 1 handwritten solutions** (`20260820_*.jpg`). |
| Razavi 2nd ed. PDF | ✅ | `source/razavi.pdf`, 801 pages, text-searchable |
| Lecture notes 1–4, 6–12 | ✅ | vector handwriting, readable at 300 dpi. Lecture 5 (12 Aug) uploaded 29 Sep. Lec 1–5 audited: every item is in the app (see §12). |
| Settling-time example | ✅ | Razavi Ex 9.2 worked out by hand |
| Current-mirror handout | ✅ | typed, 8 pp.: cascode mirror, low-voltage cascode, generating Vb |
| Tutorials 1–6 | ✅ | question sheets, typed, with vector figures |
| Tutorial 1 handwritten solutions | ✅ | In the conversation images; the engine reproduces your key. |
| Quiz 1 key (Parts A, B, C) | ✅ | **Part C is the "exam question"** (same numbers); question sheet not uploaded |
| Quiz 2 key (Parts A, B, C) | ✅ | triode-sensing CMFB on a telescopic; question sheet and figure not uploaded |
| Course handout | ✅ | lecture plan and evaluation dates |

---

## 1. Flags: where the sources disagree or are incomplete (please decide)

1. **Your lecture numbering is not the handout's numbering.** Your notes are numbered by class date and run ahead of the handout plan:

   | Your notes | Content | Handout lecture | 2nd ed § |
   |---|---|---|---|
   | Lec 01 (3 Aug) | Gain, gain error, Ex 9.1 | L1 | 9.1.1 |
   | Lec 02 (5 Aug) | Performance parameters; 5-T OTA and fully differential one-stage: CMIR, swing, BW | L1–L2 | 9.1, 9.2.1 |
   | Settling example | Ex 9.2 by Laplace | L1 | 9.1.1 |
   | Lec 03 (7 Aug) | Unity-gain buffer (Ex 9.4), telescopic, mirror-loaded telescopic, buffer window | L2 | 9.2.1 |
   | Lec 04 (10 Aug) | Buffer window again; **design of telescopic (Ex 9.7)** | L3 | 9.2.2–9.2.3 |
   | Lec 06 (14 Aug) | Folded cascode CMIR (NMOS and PMOS input), shorted output, **gain boosting starts** | L4, L6 | 9.2.4–9.2.6, 9.4 |
   | Lec 07 (17 Aug) | **Two-stage op amp**, gain boosting derivation (Rout = RS + rO + (1+A1)gm RS rO) | L5, L6 | 9.3, 9.4 |
   | Lec 08 (19 Aug) | Gain boosting: Gm, Rout, (gm rO)³, circuit implementation (M3 auxiliary), Vout,min = VGS3 + Vov2 | L6 | 9.4 |
   | Lec 09 (21 Aug) | Aux amp as CS stage; differential gain boosting; folded-cascode aux; **CMFB intro** | L6, L7 | 9.4, 9.7.1 |
   | Lec 10 (24 Aug) | CMFB: concept, resistive sensing (R1 = R2), gain with R1, R2, source-follower sensing | L7 | 9.7.1–9.7.2 |
   | Lec 11 (31 Aug) | CMFB: triode sensing (Ron10 ‖ Ron11), differential-pair sensing, feedback loop | L7–L8 | 9.7.2–9.7.3 |
   | Lec 12 (2 Sep) | CMFB techniques: Vout1 + Vout2 equation, current-mirror implementations, error removal | L8 | 9.7.3 |

   **Proposal:** the app follows the handout's L1–L14 (the exams follow it) and shows "your notes: Lec 07" on each lesson. So **L5 two-stage, L6 gain boosting and L7–L8 CMFB already have notes** and don't need to stay empty placeholders.

2. **Tutorial ↔ Razavi mapping is only partly right in CLAUDE.md §3.4.** I checked it against the book:
   - Tut 2 = Razavi **9.1, 9.2, 9.3** ✅ (noise sub-parts removed)
   - Tut 3 = Razavi **9.4, 9.6, 9.8** ✅ (noise sub-part removed)
   - Tut 4 Q1 is an **adapted 9.10**: different µnCox (172.35) and λ, and an extra part (b) with ideal sources. **Q2 and Q3 are not Razavi problems** (gain-boosting design).
   - Tut 5 Q1 is **9.11 extended** with parts (b) and (c); Q2 = **9.12** ✅; **Q3 is not Razavi** (CMFB with R = 10 MΩ).
   - Tut 6 (slew rate, 3 questions) is **not Razavi**.
   - **Tut 1 is Sedra–Smith style** (k′n, |V′A|, Q1…Q4 naming), not Razavi.

3. **The exam question is Quiz 1 Part C.** The exam paper (now recovered) and the Quiz 1 key both give (W/L)5,6 = **30**, so the cut-off-scan flag in §11 is resolved.

4. **Buffer bandwidth, three accepted answers.** For Exam Q1(e) the key gives **31.95 MHz** from 1/(2πCL(1/gm2 ‖ rO4)) and **32.19 MHz** from f3dB·(1 + βA). The conversation's 1/gm gives **31.8 MHz**. The app will teach 1/gm as the fast route and accept all three, explaining the difference.

5. **Ex 9.7 gain.** The exact square law gives **1429**, Razavi prints **1416**, your notes (Lec 4) say **1428** and the conversation says "≈ 1.4 × 10³". They agree to 1%. The app shows 1429 and cites the book's value.

6. **Quiz 2 key rounds intermediates** (VP = 0.11 V instead of 0.1106 V, and so on), so its W/L answers differ from exact arithmetic by up to 1.3%. The engine gives exact values, and the practice checker's ±2% tolerance accepts either.

7. **Part 1 WE2 statement was lost.** Only its answers survive (W/L 22.2, VG 0.5 V, RD 9 kΩ). I rebuilt the givens that reproduce them: VDD 1.8 V, ID 100 µA, Vov 0.15 V, Vth 0.35 V, µnCox 400 µA/V², VD = 0.9 V. Please confirm or send the original.

8. **Tutorial 2 Q2(b), a real disagreement with your preliminary values.** You had output 0.70–1.50 V. That range is right for the cascode stacks alone. But in Fig. 9.9, **M2's gate is tied to Vout**, so M2 leaves saturation above Vb − VGS4 + Vth2 = **1.21 V**. The true range is **0.70–1.21 V** (a 0.507 V window, Vth − Vov4, the Ex 9.5 result). See §7.

9. **Tutorial 2 Q1(c) is ambiguous.** "Gain at the peaks of the output swing" depends on whether you average the two halves (one PMOS in triode, the other still saturated, giving **19.8**) or quote the triode half alone (**15.2**). Nominal is 24.4. The engine reports both; please ask your instructor which one they want.

10. **Notation clash: Sedra vs Razavi.** Tutorial 1 uses k′n(W/L), |V′A| and Vt, while your notes use µnCox(W/L), λ and Vth. The app uses your notes' symbols (§6) and shows a one-line translation on Tutorial 1 problems (k′n = µnCox, VA = 1/λ = |V′A|·L).

11. **Problem Set 1 P5 (from our chat) has a hidden triode device.** With (W/L)5–8 = 100/0.5 in Set A, each PMOS diode costs |VGS| = 1.161 V, so the diode stack puts M3's drain at 3 − 2(1.161) = 0.678 V, *below* M3's source VX = 0.707 V: M3 is in triode, not saturation. The chat's key (VX 0.707 V, Vout 0.900–1.478 V) assumes every device is saturated. The formulas and numbers are right *given* that assumption, but the circuit as sized can't hold it: the PMOS need W/L ≥ 417 (|Vov| ≤ 0.25 V). This is exactly the trap Tutorial 2 Q2(a) asks about. The app keeps the key's numbers, shows M3 red in the figure, and explains why.

---

## 2. Curriculum map with sources

| Unit | Content | Razavi 2nd ed | Your sources |
|---|---|---|---|
| **U0** Circuit language | V/I/R, Ohm, KCL/KVL, node = supply − drops, dividers, parallel, current divider | — | Conv Part 1 Module 1; Lec 06 (current divider) |
| **U1** The MOSFET | structure, gate capacitor, channel, Vth, Vov, W/L | §2.1–2.2 | Conv Module 2 |
| **U2** Triode, saturation, pinch-off | channel thickness, waterfall, fence, square law, λ | §2.2–2.3 | Conv Module 3; Lec 02 margin (VDS ≥ VGS − Vth) |
| **U3** DC recipe and PMOS | assume → solve → walk → check; analysis vs design; magnitudes | §2.2, §3.1 | Conv WE1–WE3; Tut 1 Q1 |
| **U4** Small signal | tangent at Q, gm three ways, rO, gm·rO = 2/(λVov), conversion rules | §2.4.3 | Conv A2, Module 5 |
| **U5** Common source | transfer curve, slope = gain, −gm(RD‖rO), 2·Vdrop/Vov, −Gm·Rout | §3.3.1 | Conv Part 1 WE5, Ch 3 lecture 2.1 |
| **U6** Impedance rules, sources, diodes, mirrors | three rules derived, diode costs a threshold, mirror ratio | §3.3.2, Ch 5 | Conv Part 2 Modules 8–9; current-mirror handout |
| **U7** CS loads + degeneration | five loads, ratio rule | §3.3 | Conv Part 2 Modules 10–11; triode/active-load deep dive |
| **U8** Follower and common gate | Av, Rout, Rin → ∞ with ideal load | §3.4–3.5 | Conv Module 12 onward |
| **U9** Cascode | degeneration by rO, shielding, load trap, telescopic | §3.6 | Conv Part 2; Lec 03 |
| **U10** Differential pair | CM/DM, steering ±√2 Vov, CMIR, half circuit, 2RSS, CMRR, MOS loads | Ch 4 | Conv Part 3 Modules 16–20; Tut 1 |
| **U11** 5-T OTA | mirror adds the half-currents, Gm = gm, CMIR, swing | §5.3 | Conv Module 21; Lec 02; Quiz 1 |
| **U12** Poles and bandwidth | C as a frequency-dependent R, pole per node, GBW = gm/CL, mirror pole | Ch 6 | Conv Module 22 |
| **L1** Performance parameters | gain/ε, BW, settling, slewing, swing, linearity, noise, offset, PSRR | §9.1 | Lec 01, 02, settling example; Tut 6 |
| **L2** One-stage op amps | 5-T OTA, fully differential, telescopic, buffer, Ex 9.4–9.6 | §9.2.1 | Lec 02, 03, 04 |
| **L3** Design procedure | power → swing → Vov → W/L → gain → lengthen loads → biases; scaling; Vb1 tracking | §9.2.2–9.2.3 | Lec 04 (Ex 9.7); Conv "Lecture 3" |
| **L4** Folded cascode | folding, ISS1 = ISS/2 + I1, CM inequality flips, Rup/Rdown, Gm divider, swing | §9.2.4–9.2.6 | Lec 06; Conv folded-cascode lecture |
| **L5** Two-stage | A = A1·A2, high-gain + high-swing stages | §9.3 | Lec 07 |
| **L6** Gain boosting | Rout·(1+A1), regulated cascode, (gm rO)³, aux implementations, Vout,min | §9.4 | Lec 06–09; Tut 4 |
| **L7** CMFB concept and sensing | why fully differential outputs float, resistive / follower / triode sensing | §9.7.1–9.7.2 | Lec 09–11; Tut 5; Quiz 2 |
| **L8** CMFB techniques | feedback amplifier, triode-sensing equation, mirror implementations | §9.7.3 | Lec 11–12; Quiz 2 |
| **L9** Input range, slew rate | rail-to-rail inputs; SR = ISS/CL; slewing then linear settling | §9.8–9.9 | Tut 6 |
| **L10** PSRR, noise | | §9.11–9.12 | — |
| **L11–L14** Stability and compensation | | §10.1–10.5 | — |

**Exam scope.** The mid-sem (9 Oct 2026, closed book) is the analog block, L1–L14. The digital half (L15 onward, Kang/Weste) is out of scope for this app unless you ask for it.

---

## 3. Inventory by unit

Format for each unit: **concepts · formulas · worked examples (verified numbers) · analogies · diagrams to build · check questions**. Every formula listed here already exists in `src/physics/`.

### U0 Circuit language
- **Concepts:** voltage is height and current is flow; ground is sea level; a node voltage is "supply minus the drops"; series/parallel; "smallest resistance in parallel wins"; voltage divider; current divider (cross-over rule).
- **Formulas:** V = IR · R1‖R2 · V·R2/(R1+R2) · IA = I·RB/(RA+RB)
- **Examples:** 0.1 mA through 10 kΩ drops 1 V (Conv M1); 1 MΩ ‖ 20 kΩ ≈ 19.6 kΩ; the current divider in folded-cascode Gm (P7: 91.1%).
- **Analogies:** water height / flow / narrow pipe / sea level.
- **Diagrams:** water-tank analogy; resistor divider; current divider with arrows sized by current.
- **Checks:** walk the node voltages of a two-resistor stack; which branch takes more current.

### U1 The MOSFET  ·  U2 Triode / saturation
- **Concepts:** gate = capacitor plate on glass, so gate current is 0; channel forms at Vth; Vov = VGS − Vth is channel thickness; W/L is tap size; the channel is thinner at the drain end (Vov − VDS); pinch-off at VDS = Vov; waterfall; λ ∝ 1/L.
- **Formulas:** triode ID = µCox(W/L)[Vov·VDS − VDS²/2]; saturation ID = ½µCox(W/L)Vov²(1 + λVDS); deep-triode Ron = 1/(µCox(W/L)Vov); fence VD ≥ VG − Vth.
- **Analogies:** tap and handle; waterfall (flow set upstream, not by the height of the drop); "overdrive is rent paid in volts".
- **Diagrams:** cross-section with a channel that thins as VDS rises (three panels); ID–VDS family with the knee at VDS = Vov and a live operating point.
- **Checks:** audit Q1 (why ID stops growing); why λ ∝ 1/L; forgotten ½ (mistake catalogue).

### U3 DC recipe and PMOS
- **Concepts:** assume saturation → square law → walk the nodes → **check the fence** (skipping the check costs marks); analysis direction (W/L → Vov) vs design direction (Vov → W/L); PMOS with magnitudes, |VGS| = VS − VG; the "five numbers per device" (ID, Vov, W/L, gm, rO), where any two fix the rest.
- **Examples (verified):**
  - **WE1** VDD 1.8, VG 0.7, Vth 0.4, µnCox 200µ, W/L 10, RD 10k, λ 0.1 → Vov 0.3, ID 90 µA, VD 0.9 V, saturated ✓
  - **WE2** (design, givens reconstructed, see flag 7) → W/L 22.2, VG 0.5 V, RD 9 kΩ
  - **WE3** PMOS, VS 1.8, VG 0.9, |Vth| 0.5, µpCox 100µ, W/L 20, RD 5k → |Vov| 0.4, ID 160 µA, VD 0.8 V ✓
  - **Tut 1 Q1** (bias design with a mirror): RD 9k, W/L 22.22 / 44.44 / 22.22, R 13 kΩ
  - **Current-mirror handout problem:** cascode mirror, Vp,min = 2Vov + Vth = 0.6 V → Vov 0.11 V, W/L 22.04
- **Diagrams:** "node-voltage walk" stepper (each node labelled as it is solved); fence check in green or red.

### U4 Small signal
- **Concepts:** linearise at Q (tangent); DC voltage sources → AC ground; DC current sources → open; transistor → gm·vgs ‖ rO; gm·rO is independent of ID ("you can't buy gain with current").
- **Formulas:** gm = µCox(W/L)Vov = √(2µCox(W/L)ID) = 2ID/Vov (a table of when to use each form); rO = 1/(λID) = VA/ID, VA = |V′A|·L; gm·rO = 2/(λVov); gm·rO ∝ √(WL/ID).
- **Examples:** WE1 gm 0.6 mA/V, rO 111.1 kΩ, gm·rO 66.7; Tut 1 Q3 rO = 3.6 V/100 µA = 36 kΩ.
- **Checks:** audit Q2, Q3; "if ID is still in your gain formula, you probably made an error".

### U5 Common source
- **Concepts:** transfer curve (off → saturated → triode); gain = slope at Q; inverts; Av = −Gm·Rout.
- **Formulas:** Av = −gm(RD‖rO); |Av| = 2·Vdrop/Vov.
- **Examples:** WE1 → Av −5.50 (−6 without rO); a gain of 10 at Vov 0.2 needs a 1 V drop, impossible on a 1 V supply.
- **Diagrams:** transfer curve with a draggable Q and its tangent; small-signal model side by side.

### U6 Impedance rules, current sources, diodes, mirrors
- **Concepts:** into the gate ∞; into the drain rO, or rO + (1 + gm rO)RS ≈ gm rO RS; into the source 1/gm (+ RD/(gm rO)), → ∞ with an ideal current-source drain load; "up multiplies, down divides — by gm·rO"; a current source costs |Vov| and looks like rO; a diode costs |VGS| and looks like 1/gm; mirror ratio = (W/L) ratio; cascode mirror; low-voltage cascode mirror and its Vb generation (handout).
- **Examples:** push-current derivations (Conv Part 2); cascode mirror Vp,min = 2Vov + Vth.
- **Analogies:** "the transistor fights back" (impedance explorer animation); "bodyguard" (cascode shielding).
- **Diagrams:** three-terminal impedance card; diode-connected device; basic, cascode and low-voltage cascode mirrors (handout Figs 1–10).
- **Checks:** audit Q8, Q9, Q14.

### U7 CS with every load, and degeneration
- **Formulas:** resistor −gm(rO‖RD); diode −gm1/gm2 = −√(µn(W/L)1/µp(W/L)2); current source −gm1(rO1‖rO2); triode −gm1·Ron2 with Ron2 = 1/(µpCox(W/L)2(VDD − Vb − |Vthp|)); active −(gm1 + gm2)(rO1‖rO2); degenerated −RD/(1/gm + RS), Rout = rO + (1 + gm rO)RS.
- **Ratio rule:** |Av| = (R at the output terminal) ÷ (R in the source path, where the transistor counts as 1/gm).
- **Examples:** WE9 gm 1 mA/V, RD 10k, RS 1k → 10 becomes 5; the "circuit you've never seen" (current source + diode load) → Rout 3.85 kΩ, Av −3.85.
- **Trade-off table:** triode (headroom-efficient but process-fragile) vs active (gain-efficient but bias-fragile).

### U8 Source follower and common gate
- **Formulas:** follower Av = RS′/(1/gm + RS′) < 1, Rout = 1/gm ‖ rO; CG Av = +gm RD, Rin = (RD + rO)/(1 + gm rO).
- **Concepts:** the follower is an inefficient driver (0.5 when 1/gm = RL); CG gives a low Rin only if its load is small; no Miller effect in CG.
- **Note:** γ = 0 by default (the tutorials say so); gmb appears only where the source moves, and is introduced only if a lesson needs it.

### U9 Cascode
- **Formulas:** Rout ≈ gm2 rO2 rO1; Av ≈ −(gm rO)²; telescopic Rout = (gm rO²)‖(gm rO²) → Av ≈ (gm rO)²/2.
- **Example (WE12, all gm = 1 mA/V, rO = 20k):** CS + source load 10; cascode + simple load 19; cascode + cascode load 220; ideal load 440.
- **The load trap:** a simple load wins the parallel combination (mistake catalogue).
- **Diagrams:** shielding (node X barely moves); an Rout bar chart comparing the loads.

### U10 Differential pair
- **Concepts:** VCM = (V1 + V2)/2, vd = V1 − V2; tail = fixed pie; full steering at ±√2·Vov; P is a virtual ground for DM only; half circuit; CM half circuit with 2RSS; CMRR.
- **Formulas:** ID1 − ID2 = ½µCox(W/L)ΔVin√(4ISS/(µCox W/L) − ΔVin²); gm at balance √(µCox(W/L)ISS); Ad = −gm(RD‖rO); ACM = −RD/(1/gm + 2RSS); CMRR ≈ (1 + 2gm RSS)gm/Δgm; Vin,CM,min = VISS + VGS1, Vin,CM,max = VD1 + Vth1.
- **Examples (verified):** Tut 1 Q1 CMIR −0.25…+0.35 V; Q2 W1,2/W3,4 = 25; Q3 W/L 12.5/50, Ad 18; Q4 VCM 2.33, RD 5.06k, VD 2.47, ACM −1.92, ΔVCM 0.29.
- **Analogies:** two kids on a see-saw (the differential output is twice as tall).

### U11 5-T OTA
- **Concepts:** follow the signal currents (+i up M1 → M3, mirrored +i in M4, −i in M2, so 2i reaches the output); Gm = gm1,2; the diode pins X at VDD − |VGS3| (a threshold lost from CMIR); output only pays |Vov4|.
- **Formulas:** Av = gm1,2(rO2‖rO4); Vin,CM ∈ [VISS + VGS1, VDD − |VGS3| + Vth1]; Vout ∈ [VISS + Vov2, VDD − |Vov4|].
- **Examples (verified):** Tut 1 Q5 I = 250 µA; **Exam = Quiz 1 C**: (W/L)3 19.2, (W/L)1 26.67, Av 88.9, Vout 0.35–1.55, f−3dB 358 kHz, buffer 31.8 MHz, SR 30 V/µs; **Quiz 1 A**: W/L 80 and 71.11, Av 133.3, swing 1.35, 636.6 kHz, 85.5 MHz; **Quiz 1 B**: 44.44 and 50, Av 88.9 (key 88.67), 1.2 V, 1.19 MHz, 106.7 MHz; **PS1 P1**: Av 84.3, CM 0.874–1.417, Vout 0.474–1.517, 1.19 MHz, 100.7 MHz.

### U12 Poles and bandwidth
- **Formulas:** ωp = 1/(RC); dominant pole 1/(Rout·CL); GBW = gm/CL (Rout cancels); mirror pole ≈ gm3/CX; Miller C(1 + A).
- **Check:** GBW = gain × f−3dB (88.9 × 358 kHz = 31.8 MHz).

### L1 Performance parameters
- **Formulas:** Aclosed = A/(1 + βA); β = R2/(R1 + R2); ε = 1/(1 + βA) ≈ 1/βA; Amin = Aclosed/ε; ΔAc/Ac = ε·ΔA/A; A(s) = A0/(1 + s/ω0); ωu = A0ω0; τ = 1/[(1 + βA0)ω0] ≈ Aclosed/ωu; t = τ·ln(1/ε) (10% → 2.3τ, 1% → 4.6τ, 0.1% → 6.9τ); SR = ISS/CL; PSRR; swing and noise trade through the load Vov.
- **Examples:** Ex 9.1 A ≥ 990 (exact) / 1000; desensitisation table A = 500/1000/2000 → 9.804/9.901/9.950; Ex 9.2 ωu ≥ 9.21 Grad/s, fu ≥ 1.47 GHz; gm ≥ 9.21 mA/V at CL = 1 pF → ISS ≥ 1.84 mA; Ex 9.3 wrong polarity gives a RHP pole; PS1 P2.
- **Laplace kit (from the settling-example notes):** u(t) ↔ 1/s, e^(−at) ↔ 1/(s + a), partial fractions 1/[s(1 + sτ)] = 1/s − τ/(1 + sτ), factor out (1 + βA0).
- **Analogies:** see-saw op amp; filling a glass while watching the line (feedback); a fixed pocket of coins (GBW); cake eaten by half each minute (settling); a fixed tap filling a bucket (slewing); a room with a ceiling and floor (headroom); a bathroom scale reading 0.5 kg with nobody on it (offset); drawing on a bumpy bus (supply rejection).
- **Tutorial 6** (slewing + linear settling) belongs here and to L9.

### L2 One-stage op amps
- **Formulas:** fully differential swing 2(VDD − |Vov3| − Vov1 − VISS); telescopic Av = gm1[gm3rO3rO1 ‖ gm5rO5rO7] ≈ (gm rO)²/2; swing 2[VDD − (Vov1 + Vov3 + VISS + |Vov5| + |Vov7|)]; mirror-loaded swing loses |Vthp|; three bias conditions; buffer Rout → 1/gm, pole → gm/CL; buffer window Vb1 − Vth4 ≤ Vout ≤ Vb1 − VGS4 + Vth2 (width Vth − Vov4); Ex 9.6 VCM choice; the saturation-algebra trick (the source voltage cancels).
- **Examples:** VDD 1.0 / Vth 0.3 / Vov 0.1 numbers; Ex 9.4 gm 1 mS, rO 20k → Rout 10k → 910 Ω; ε = 17% at Aopen = 5; telescopic vs OTA swing at 1.2 V (0.8 vs 1.4 Vpp); window 0.25 V at Vth 0.4 / Vov 0.15; PS1 P3–P5.

### L3 Design procedure
- Ex 9.7 walk-through (flag 5); gm·rO ∝ √(WL/ID); lengthen off-signal-path devices; bias voltages at the saturation edges (1.4 / 1.6 / 1.7 V); Vb1 tracking VGS,b1 = Vov1,2 + VGS3,4 (Eq. 9.16), so Mb1 is narrow and long; linear scaling (Ex 9.8, PS1 P9).

### L4 Folded cascode
- Folding; ISS1 = ISS/2 + I1; the input-CM inequality flips (telescopic caps it from above, folded holds it from below); Rup = gm5rO5rO7, Rdown = gm3rO3(rO1‖rO9); Gm by current divider (≈ gm1); swing VDD − 4 overdrives (no VISS); folding-node pole; NMOS-input version; CMIR both versions (Lec 06: Vin,CM,max = VDD − |Vov11| − |VGS1|, Vin,CM,min = Vov9 − |Vthp|); comparison table; PS1 P6–P10.

### L5 Two-stage (Lec 07) · L6 Gain boosting (Lec 06–09) · L7–L8 CMFB (Lec 09–12)
- **Two-stage:** A1 = gm1,2(rO1,2‖rO3,4), A2 = gm5,6(rO5,6‖rO7,8), A = A1A2; a cascode first stage with a CS second stage.
- **Gain boosting:** Iout/Vin = A1gm/(RS + (1 + A1)gm rO RS); Rout = RS + rO + (1 + A1)gm RS rO; cascode version Rout ≈ (1 + A1)gm2rO2rO1 → (gm rO)³; with the aux as a CS device M3, A1 = gm3rO3 (or gm3gm4rO4rO3 when cascoded); Vout,min = VGS3 + Vov2 (the disadvantage); M3 saturation needs VGS2 ≤ |Vth3|; differential and folded-cascode aux amps.
- **CMFB:** outputs of two current sources in series float; resistive sensing (R1 = R2 gives Vout,CM; gain drops to gm(rO‖rO‖R1)); source-follower sensing; triode sensing (Rtot = 1/(µCox(W/L)(Vout1 + Vout2 − 2Vth))); the loop Vb1 − VGS3 = 2ID·Rtot,P gives Vout1 + Vout2; mirror implementations and error removal (Lec 12).
- **Quiz 2** (verified): Part A VD4 1.16, VP 0.11, W/L11,12 3.62 (key 3.63), Vout,min 0.29, Rout,down 55.9 MΩ (key 55.63); Parts B and C likewise.

---

## 4. Memory hooks (verbatim from the conversation)

"Gain error is one over loop gain" · "Absolutes lie, ratios don't" · "β is what comes back; 1/β is what you get" · "Spend gain, buy accuracy, at 1:1" · "Overdrive is rent" · "Diode connections cost a threshold" · "Gain needs rO, speed doesn't" · "Swing is the ceiling, noise and offset are the floor" · "Poles are time in disguise" · "Feedback pushes the pole out by 1 + βA0" · "τ = closed-loop gain ÷ ωu" · "Accuracy costs 2.3τ per decade" · "Gate infinite, drain big, source small" · "Up multiplies, down divides" · "Av = −Gm·Rout, always" · "Gain = twice the drop over the overdrive" · "Body effect lives where the source moves" · "Cascode squares the gain and doubles the headroom bill" · "Voltage feedback makes the output stiff" · "In a buffer the output is a gate voltage" · "Don't stack — fold" · "Folding flips the inequality" · "The cascode source is the easy path" · "Start with power, even if nobody asked" · "Gain lives in √(WL/ID)" · "Linear scaling only buys speed and silence" · "Split into shared and different" · "The tail is a fixed pie" · "The mirror recovers the lost half".

---

## 5. Diagrams to rebuild (parametric components)

The originals were lost, so each diagram is listed with the source it will be drawn from.

- **Foundations:** water analogy; MOSFET cross-section (3 panels); ID–VDS family; CS schematic + small-signal model; transfer curve; three impedance rules; diode; basic, cascode and low-voltage cascode mirrors (handout Figs 1–10); five CS loads; degeneration; follower; CG; cascode + shielding; telescopic stack; diff pair; steering curve; DM half circuit; CM half circuit with 2RSS; 5-T OTA with signal-current arrows; RC pole; Bode with 1/β line.
- **Lecture notes (your figures):** Lec 01 CS + feedback divider + β network; Lec 02 fully differential (Vb loads) and 5-T OTA; Lec 03 buffer + Thévenin model, telescopic differential and mirror-loaded, buffer window sketch; Lec 04 Fig 9.11 with bias mirrors, telescopic design; Lec 06 folded cascodes (NMOS and PMOS input), shorted-output folded, Vb1 tracking; Lec 07 two-stage (both), gain-boost basics; Lec 08 regulated cascode, M3 aux implementation, test source; Lec 09 aux variants, differential gain boosting, folded-cascode aux; Lec 10 CMFB general structure, resistive sensing, follower sensing; Lec 11 triode sensing, diff-pair sensing, CMFB loop; Lec 12 CMFB implementations 1–5.
- **Tutorial figures:** Tut 1 Q1–Q5; Tut 2 Fig 9.6(b), 9.9, 9.15; Tut 3 Fig 9.21(b), 9.23, 9.24; Tut 4 Fig 9.88, gain-boost circuits Q2, Q3; Tut 5 Fig 9.53, 9.51, Q3 CMFB; Tut 6 non-inverting amp, 5-T OTA with feedback, folded cascode.
- **Others:** settling step response with the ε band; s-plane pole shift; the bias-voltage ladder (Ex 9.7); Fig 9.12 tracking circuit.

---

## 6. Problem bank inventory

| Set | Items | Status |
|---|---|---|
| Part 1 WE1–WE3, WE5, WE9, WE12 | foundations | ✅ engine-verified |
| Tutorial 1 Q1–Q5 | diff pairs | ✅ all verified |
| Exam Q1 = Quiz 1 C (a–e) | 5-T OTA | ✅ |
| Quiz 1 A, B | 5-T OTA variants | ✅ |
| Razavi Ex 9.1, 9.2, 9.4, 9.7, 9.8 | L1–L3 | ✅ (9.4 and 9.8 are qualitative or numeric) |
| Problem Set 1 P1–P10 | L1–L4 | ✅ all ten reproduced |
| Tutorial 2 (9.1–9.3), Tutorial 3 (9.4, 9.6, 9.8) | L2–L4 | ✅ solved, see §7 |
| Current-mirror handout problem | U6 | ✅ |
| Quiz 2 A–C | L7–L8 CMFB | ✅ (key rounding noted) |
| Tutorial 4 Q1–Q3 | L6 gain boosting | ✅ all three in the bank with figures (no key: Flag 18) |
| Tutorial 5 Q1–Q3 | L7–L8 CMFB | ✅ all three in the bank with figures (Q2 = Razavi 9.12 asked as concepts; Flag 19) |
| Tutorial 6 Q1–Q3 | L1/L9 slewing | ✅ in the bank |
| "20 things to answer cold" audit | mixed | becomes Review cards |

---

## 7. Verification report: Tutorials 2–3 solved by the engine (§11.3)

Set A: µnCox 134.28 µ, µpCox 38.36 µ, λn 0.1, λp 0.2 (L = 0.5 µm), Vthn 0.7, |Vthp| 0.8, VDD 3 V. Note that "50/0.5" means W/L = 100.

| Problem | Engine | Your preliminary | Verdict |
|---|---|---|---|
| 9.1(b) gain | **24.4** | 24.4 | ✅ agree |
| 9.1(b) single-ended output | **0.60–2.49 V** (3.78 Vpp differential) | 0.60–2.49 V | ✅ agree |
| 9.1(c) gain at peak | **19.8** (average of halves; triode half alone 15.2) | — | ⚠️ interpretation, flag 9 |
| 9.2(a) min PMOS W | **106.4 µm** (W/L 212.8) | ≈ 106 µm | ✅ agree |
| 9.2(b) output range | **0.70–1.21 V** with M2's gate on Vout (0.70–1.50 V from the stacks alone) | 0.70–1.50 V | ❌ **disagree**, flag 8 |
| 9.2(c) open-loop gain | **1301** | ≈ 1.3 × 10³ | ✅ agree |
| 9.3 overdrives | **0.45 V** each (ISS 1 mA, I 0.5 mA) | ≈ 0.45 V | ✅ agree |
| 9.3 gain | **247** (Gm = gm1); 227 with the exact current divider | ≈ 250 | ✅ agree |
| 9.3 CM down to 0 V? | **yes**, Vin,CM,min = −0.35 V | yes | ✅ agree |
| 9.4(a) max input CM | **1.507 V** | — | new |
| 9.4(b) VX | **1.839 V** | — | new |
| 9.4(c) buffer output range | **1.00–1.507 V** (0.507 V) | — | new |
| 9.4(d) Vb2 range | **1.039–1.478 V** | — | new |
| 9.6(a) CM at X, Y | **1.689 V** → Vin,CM,max 2.389 V | — | new |
| 9.6(b) gain / swing | **451** (34.5 × 13.1) / **4.43 Vpp** differential | — | new |
| 9.8(a) CM at X, Y | **1.839 V** | — | new |
| 9.8(b) min dimensions | **(W/L)1–4 = 16.6, (W/L)5–8 = 92.6** (equal overdrive split: 0.669 V N, 0.531 V P) | — | new; this assumes an equal split, which the problem doesn't specify |
| 9.8(c) gain | **≈ 3950** (214 × 18.5) | — | new |

Checks run: 54 automated tests pass (unit tests, the full §11 regression table, both quiz keys, and these tutorial solutions).

---

## 8. Lab sheets 1–9 (Cadence labs): calculation parts only

Uploaded as `source/labs/lab-1..9.pdf` (page images in `source/labs/images/`). Only the hand calculations are
used; simulator steps (Virtuoso, ADE, calculator expressions, ADT) are skipped as you asked.

| Lab | Topic | Hand calculations in the app (bank "Lab sheets") | Unit |
|---|---|---|---|
| 1 | RC LPF, MOSFET curves | C from τ, rise time 2.2τ, f−3dB = 1/(2πRC) | U12 |
| 2 | CS amplifier with V* | RD = VRD/ID, V* = 2VRD/|Av|, W by ratio from a chart reading, max gain 2(VDD − V*)/V* | U5 |
| 3 | Cascode | gm = 2ID/V*, intrinsic gain 2VA/V*, cascode ≈ square, BW, GBW = gm/(2πCL) | U9, U12 |
| 4 | PMOS source follower | gm, Rout = 1/gm, output pole, DC shift = |VGS| (peaking needs simulated caps: skipped) | U8 |
| 5 | Simple vs low-compliance cascode mirror | Iout = 2Iin, Rout rO vs gm·rO², Vout,min = 2V* | U6, U9 |
| 6 | PMOS-input resistive diff amp | RD from the CM level, V* from Ad, gm, BW | U10 |
| 7 | 5-T OTA from specs | gm = 2π·GBW·CL, dB → ratio for gain and CMRR | U11, U12 |
| 8 | Negative feedback (behavioural OTA) | COUT, ROUT, β = CF/(CF + CIN), ACL, closed-loop BW, desensitisation | L1 |
| 9 | Two-stage Miller OTA buffer | A ≥ 1/ε (2000, 66 dB), τ = tr/2.2, fu = 1/(2πτ), IB1 = SR·Cc | L5, L9 |

**Flag 12 (Lab 8):** the sheet lists COUT = 4.88 pF, but GM/(2π·fu) = 159 µS/(2π·5 MHz) = 5.06 pF; 4.88 pF would need GM ≈ 153 µS. Worth asking your instructor.

Chart-based sizing (V* and gm/ID charts) depends on your own simulation data, so the app uses clearly labelled *example* chart readings to practise the ratio-and-proportion method.

## 9. Lecture notes 13–17 (uploaded later) → L9–L14

| Notes | Date | Content | Handout lecture | App |
|---|---|---|---|---|
| Lec 13 | 07 Sep | RC step response; closed-loop τ = CL·Rout/(1 + A·R2/(R1+R2)); 5-T OTA small vs large step; SR = ISS/CL | L9 | `l9-slew` (refs updated) |
| Lec 14 | 09 Sep | Slew of the fully differential telescopic (each output ISS/2CL, differential ISS/CL) and folded cascode (IP); concept of stability, loop gain, Barkhausen | L9, L11 | `l9-slew`, `l11-barkhausen`, PS2 P1 |
| Lec 15 | 11 Sep | Loop-gain Bode plots, ωgx, ωpx, gain and phase margin, one-pole systems unconditionally stable, two-pole systems | L11–L12 | `l11-multipole`, `l12-margins` |
| Lec 16 | 16 Sep | PM → closed-loop peaking: 5° → 11.5/β, 45° → 1.3/β, 60° → 1/β; step responses | L12 | `l12-ringing`, bank `bank-lec16` |
| Lec 17 | 18 Sep | Frequency compensation: 20log A − 20log(1/β); three-pole 100 dB example; Miller CC(1 + A2); P1′ ≈ 1/(R1A2CC); notes’ two-stage op amp (M1–M7) and its transfer function with the RHP zero (1 − sCC/Gm2) | L13–L14 | `l13-dominant`, `l13-miller`, `l14-twostage`, `l14-rz`, Stability lab |

**Flag 13 (L10):** none of your notes cover PSRR or noise (handout L10, Razavi §9.11–9.12). The two L10 lessons are built from Razavi only; check against the lecture when it happens.

**Flag 14 (L14):** your notes stop at the start of two-stage compensation (Lec 17). The nulling resistor, CC for 60°, and two-stage slewing come from Razavi §10.5–10.6.

**Flag 15 (Razavi Ex 9.26):** the book’s numbers for the noise example could not be reproduced from the stated sizes (M1/M3 part matches with 0.125 mA per side, the M5/M7 part does not match any reading of the figure). It is not used as a regression value.

**Lec 12 (L8)** also has the replica CMFB (M14–M15 copy M11–M13 with VREF; M16–M18 fix VDS): now lesson `l8-replica` and PS2 P5.

**Problem Set 2 (L8–L14)** added: P1 telescopic slew, P2 two-pole PM at β = 1 and 0.2, P3 compensating the Lec 17 three-pole amplifier, P4 compensating a two-stage built on the exam OTA, P5 replica CMFB, P6 folded-cascode noise.

## 10. Digital half (handout L15–L38): built from the textbooks

No digital lecture notes, tutorials or books are in `source/` yet (the handout cites Kang & Leblebici 3rd ed and Weste & Harris). Every digital lesson, generator and Problem Set 3 item is written from the standard treatments and flagged in the app. Notation: VM for the inverter switching threshold (Kang calls it Vth; here Vth stays the transistor threshold), kR = kn/kp, τPHL/τPLH, Weste’s g, h, p, F, f̂.

**Flag 16:** carry-skip and ripple delay formulas follow Weste & Harris §11.2.2 with unit delays; check them against the lecture when it happens.
**Flag 17:** VIL/VIH of an unsymmetric CMOS inverter are computed from the exact square-law VTC (slope −1 points); Kang also gives closed forms. They agree to the displayed precision for the symmetric case ((3VDD + 2Vth)/8, (5VDD − 2Vth)/8), which is tested.

---

## 11. Tutorial audit (29 Sep) and Razavi/Allen handouts

Every question on Tutorial sheets 1–6 now has a bank entry with its circuit drawn: T1 Q1–Q5, T2 Q1–Q3, T3 Q1–Q3,
T4 Q1–Q3, T5 Q1–Q3, T6 Q1–Q3. Added in this pass: T4 Q3, T5 Q2, T5 Q3, plus figures for Razavi Fig 9.24 (T3 Q3),
T4 Q2, Quiz 2, Ex 9.2, Ex 9.8, PS1 P10, Labs 1–9 and the chat's 1 V buffer.

**Flag 18 (Tutorial 4 Q3, no key):** read from the figure: M3 is a PMOS on R3 whose drain folds into node F (M4 source,
M9 drain); M5, M6 share M8's gate; M7/M9 form a mirror. Currents follow from 3 mW and equal |VGS|: 500/200/200/100 µA,
M9 = 300 µA. Engine: (W/L)6 = 296.1, R3 = 19.26 kΩ, M4 saturated (VD4 1.016 V ≥ 0.241 V), (W/L)7 = 133.3,
R1 = 5.377 kΩ, R2 = 591.9 Ω, |Av| ≈ 63.1. The gain is set by the simple PMOS load M6 (the load trap), and M3's source
resistor R3 degenerates the auxiliary gain to about 1.26. If your class solution treats R3 as bypassed or M6 as ideal,
the gain will differ.

**Flag 19 (Tutorial 5 Q2 = Razavi 9.12 and Q3):** 9.12 gives no sizes, so (b) is asked as an expression
(T = A_EA·gm3·(Rup ‖ Rdown)). For Q3 three readings are assumed: the optimum VO,CM is the middle of the output range
(0.971 V); “±1%” means |ACM| ≤ 0.010; ACM uses rO3/(1/gm + 2rO5). Engine: Ad 46.8, |ACM| 0.497, CMRR 94.3
(39.5 dB), loop gain 17.1, |ACM|fb 0.0274, CMRR 1707 (64.6 dB).

**Razavi's UCLA EE215A handouts (Fall 2014, #10 noise, #10 feedback, #12 stability) and Allen's lectures 22–23**
were read for their intuition, not copied. Used: noise as power in a 1 Hz window and the kT/C cancellation
(new lesson L10 “What noise is”); “does a telescopic op amp need compensation?” and the opposite effect of CL on one-
and two-stage op amps (new lesson L13 “One stage vs two”); breaking the loop with a test source to measure βA;
Rz from a triode MOSFET that tracks 1/gm; Allen's “fewer than three rings” and CC ≥ 0.22·CL (matches the engine's
tan formula with the zero kept: 0.2216·CL for Gm2 = 10·Gm1). No disagreement with the book was found.

---

## 12. Lecture 1–4 notes audit (29 Sep)

| Notes | Content | Where in the app |
|---|---|---|
| Lec 1 | gain 10 with < 1% error; Aclosed = A/(1+βA), β = R2/(R1+R2), ε = 1/(1+βA) ≈ 1/βA, A ≥ 990 → 1000 | L1 “gain and gain error”, bank Ex 9.1, generator l1-gain |
| Lec 2 | gain, BW (ωu = A0ω0 = GBW), swing, linearity, noise, offset; fully differential pair with current-source loads and 5-T OTA: Av, CM range, swing, BW = 1/((rO2‖rO4)CL) | L1 speed/other, L2 one-stage, U11 OTA and OTA range |
| Lec 3 | 5-T OTA in unity feedback: Aopen = gmN(rON‖rOP), Rout,closed = 1/gm2, ω = gm2/CL, Thevenin picture with RL; telescopic both versions, gain (gm·rO)²/2, both swings (mirror version loses |Vthp|); buffer window | L2 buffer, U12 poles, L2 one-stage, card c-l2-model |
| Lec 4 | buffer window (shaded sketch); Ex 9.7 with 3.33 mA (0.33 mA bias), overdrives 0.5/0.3/0.2, W/L 1250/1111/400, Av 1428, gm·rO ∝ √(WL/ID), λ ∝ 1/L → L = 1 µm for M5–M8, Av ≈ 4000; bias branch Mb1–Mb3 | L3 design (figure telescopicBias), bank Ex 9.7, cascode lab |

Fixed in this audit: the Ex 9.7 power split now shows the 0.33 mA bias share; the notes' gain was misread as 1408 earlier
(it is 1428, matching the engine's 1429); the bias-branch figure (Fig 9.11 as drawn in Lec 4) was added; a card for the
closed-loop Thevenin picture of Lec 3 was added.

| Lec 5 | fully differential op amp closed through C1–R1–R2 / C2–R3–R4 and its telescopic version (Razavi Ex 9.6, Fig 9.10); folding transformation (NMOS cascode → PMOS input + I2, and the PMOS version); fully differential folded cascode with ISS1, ISS2; PMOS-input folded cascode M1–M11, Rup, Rdown, Gm by current divider ≈ gm1 | new lesson L2 “Closed loop through capacitors: choose the CM level” (widget, generator l2-cmchoice, figures capFeedback and cmChoice); L4 folding lesson now shows the folding steps (figure foldingSteps); card for ISS2 = ISS1 + ISS/2 |

**Flag 20 (Lec 5 numbering):** your notes number the folded cascode M9, M10 (bottom sources), M5, M6 (PMOS cascodes), M7, M8
(top sources), so Rup = gm5rO5rO7 and Rdown = gm3rO3(rO1‖rO9). The app keeps Razavi’s numbering (also used by Tutorial 2 Q3
and Problem Set 1): M5, M6 bottom, M7, M8 cascodes, M9, M10 top. The L4 gain lesson states the translation.

**Topic links (29 Sep):** every lesson's “Your turn” and “Lock it in” steps and every topic on the Learn page list the
tutorial, problem-set, quiz, Razavi and lab questions you can solve after that topic (a question lives in the last topic
it needs; earlier topics show it as “coming up”). Links open the question in Practice (#/practice/<id>).

**End-of-topic Tutorials & PYQs (2 Oct):** every topic ends with a page (#/topic/<unit>) listing the tutorials, PYQs
(Quiz 1, Quiz 2 and the mid-sem; no earlier-year papers are in source/), problem sets, Razavi examples and lab questions
that need only topics up to that one. Each is attempted inline, shows whether its topics are covered, and is marked
solved once every part has been right. Problems on a computer screen show the figure (large, pinned) beside the question
and one-line answer rows; figures run in question mode (non-given numbers shown as “?”) until the full solution opens.
