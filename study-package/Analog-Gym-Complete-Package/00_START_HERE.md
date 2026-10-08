# Analog Gym: complete package

**What this is:** everything from the Analog Gym project in one place:
- the finished app (one HTML file that runs offline),
- every file you uploaded, renamed so you can tell what it is,
- the textbook and the extra references I downloaded,
- the original tutoring conversation,
- this whole Claude Code session (readable, plus the raw log),
- the project documents, the full source code, and screenshots.

Course: **EEE/INSTR F313 Analog & Digital VLSI Design**, BITS Pilani K K Birla Goa Campus, semester 1 of 2026–27.
Package built 6 Oct 2026, from commit `5f879b3` on branch `claude/eloquent-mendel-r0gqm4` of `claudecode3340/analog`.

> **To start studying right now:** open `01_App/Analog-Gym.html` in Chrome, Edge or Firefox. It needs no internet,
> no install and no login. Press **1–5** to switch between Path, Learn, Labs, Practice and Review.

## Putting the parts together

> **Downloaded this from GitHub?** Skip this section: you already have everything except the raw session log, which
> is kept out of the repo on purpose (it contains your email and internal instructions; see §10). It was sent in the
> chat as three pieces; the readable transcript in `05_Claude_Code_Session/` holds every message.

The chat only accepts files up to 30 MB, so the package (235 MB) came as **8 zip parts plus 3 pieces of the raw session log**.

**The zip parts**
- Every part unzips into the same folder, `Analog-Gym-Complete-Package/`.
- Extract all 8 into one place and you get the full structure described below.
- Each part is also complete on its own; Part 01 alone gives you the app, this guide and the conversations.

| Part | Contents |
|---|---|
| `Part-01_App-Guide-Conversations-Code.zip` | This guide, `LINKS.md`, `FILE_INDEX.md`, the app, the tutoring conversation and its images, the readable session transcript, project documents, source code, screenshots |
| `Part-02_Lecture-Notes-01-05.zip` | Lecture notes 01–05 |
| `Part-03_Lecture-Notes-06-08.zip` | Lecture notes 06–08 |
| `Part-04_Lecture-Notes-09-11.zip` | Lecture notes 09–11 |
| `Part-05_Lecture-Notes-12-14.zip` | Lecture notes 12–14 |
| `Part-06_Lecture-Notes-15-17_Handout_Tutorials.zip` | Lecture notes 15–17, the course handout, Tutorials 1–6, the settling-time and current-mirror handouts |
| `Part-07_Quizzes_Lab-Sheets.zip` | Quiz 1 and 2 keys, Lab sheets 1–9 and their page images |
| `Part-08_Textbook_References.zip` | Razavi 2nd ed., Razavi UCLA handouts, Allen lectures |

**The raw session log (optional)**
- It comes in 3 pieces: `session-log-raw.jsonl.gz.part1`, `.part2` and `.part3`.
- You only need it for the complete unedited log. The readable transcript in Part 01 already holds every message.
- To join the pieces, open a terminal in the folder that holds them and run the line for your system:
  - **Windows:** `copy /b session-log-raw.jsonl.gz.part1 + session-log-raw.jsonl.gz.part2 + session-log-raw.jsonl.gz.part3 session-log-raw.jsonl.gz`
  - **macOS / Linux:** `cat session-log-raw.jsonl.gz.part* > session-log-raw.jsonl.gz`
- Then move the joined file into `05_Claude_Code_Session/`.
- Expected MD5 of the joined file: `1db0aca662e6635b3e1c4e976ebf9935`.

---

## Contents

1. [What is in this package (folder by folder)](#1-what-is-in-this-package)
2. [How to use the app](#2-how-to-use-the-app)
3. [What the app contains](#3-what-the-app-contains)
4. [How it was built](#4-how-it-was-built)
5. [How everything was checked](#5-how-everything-was-checked)
6. [Flags: where your sources disagree, and the assumptions I made](#6-flags-where-sources-disagree-and-assumptions)
7. [Development history (what you asked for, and what was done)](#7-development-history)
8. [Known limitations and what is still open](#8-known-limitations-and-what-is-still-open)
9. [Working on the code yourself](#9-working-on-the-code-yourself)
10. [Privacy and copyright notes](#10-privacy-and-copyright-notes)

`LINKS.md` lists every web link: repo, session, references, and the old artifact.
`FILE_INDEX.md` lists every file in this package with its size, and where it came from.

---

## 1. What is in this package

| Folder | What is inside | Where it came from |
|---|---|---|
| `00_START_HERE.md` | This guide | Written for this package |
| `LINKS.md` | Every link (repo, session, references) | Written for this package |
| `FILE_INDEX.md` | Every file with its size and origin | Generated for this package |
| `01_App/Analog-Gym.html` | **The app.** One self-contained 3.9 MB file (code, fonts, figures, content all inside) | Fresh build from commit `5f879b3` (`vite build --mode single`) |
| `02_Course_Material/1_Course_Handout` | Course handout (lecture plan, exam dates) | Your upload `EEE_F313_INSTR_F313_1_26-27.pdf` |
| `02_Course_Material/2_Lecture_Notes` | Your handwritten lecture notes 01–17, each renamed with date and topic | Your uploads `Lecture_NN_DDMMYYYY.pdf` |
| `02_Course_Material/3_Tutorials` | Tutorial sheets 1–6, renamed with topic | Your uploads `Tutorial_N.pdf` |
| `02_Course_Material/4_Quizzes_PYQs` | Quiz 1 and Quiz 2 solution keys | Your uploads |
| `02_Course_Material/5_Lab_Sheets` | Lab sheets 1–9 (renamed with topic) plus a PNG of every page (`page-images/lab-N-pK.png`) | Your uploads; the page images were rendered by me so the sheets could be read |
| `02_Course_Material/6_Extra_Handouts` | Settling-time worked example (Ex 9.2 by hand) and the current-mirror handout | Your uploads |
| `03_Textbook_and_References` | Razavi 2nd ed. (full PDF), Razavi's UCLA EE215A lecture handouts (6), Allen's CMOS analog lectures (5) | Razavi PDF came inside your conversation zip; the handouts were downloaded during the session (links in `LINKS.md`) |
| `04_Tutoring_Conversation` | The full tutoring conversation export (the app's main source), the repo copy, the excerpt, the export-error log, and all 44 images from it | Your upload `Learning_RF_circuit_design_from_Razavis_book--0131ea38.zip` |
| `05_Claude_Code_Session` | This build session: a readable transcript, the one image you attached, and the compressed raw log | Exported from the session log |
| `06_Project_Documents` | Build prompt (`CLAUDE.md`), content inventory with all flags, research notes, design tokens | From the repo |
| `07_Source_Code` | The whole app's source as a zip (everything except `source/`, which is already in folders 02–04), plus the git history | `git archive` of commit `5f879b3` |
| `08_Screenshots` | 32 screenshots: 16 pages at 1366×768 (light) and 1920×1080 (dark) | Taken from `01_App/Analog-Gym.html` for this package |

### 1.1 Lecture notes: what each one covers

| File | Date | Topic | Handout lecture | Razavi 2nd ed |
|---|---|---|---|---|
| Lecture-01 | 3 Aug | Gain, gain error, Ex 9.1 | L1 | §9.1.1 |
| Lecture-02 | 5 Aug | Performance parameters; fully differential pair and 5-T OTA: CM range, swing, bandwidth | L1–L2 | §9.1, §9.2.1 |
| Lecture-03 | 7 Aug | Unity-gain buffer (Ex 9.4), telescopic (both versions), buffer window | L2 | §9.2.1 |
| Lecture-04 | 10 Aug | Buffer window again; design of a telescopic op amp (Ex 9.7) | L3 | §9.2.2–9.2.3 |
| Lecture-05 | 12 Aug | Closed loop through capacitors, choosing the CM level (Ex 9.6); folded cascode | L2, L4 | §9.2.1, §9.2.4 |
| Lecture-06 | 14 Aug | Folded-cascode CM range (NMOS and PMOS input); gain boosting starts | L4, L6 | §9.2.4–9.2.6, §9.4 |
| Lecture-07 | 17 Aug | Two-stage op amp; gain-boosting derivation | L5, L6 | §9.3, §9.4 |
| Lecture-08 | 19 Aug | Gain boosting: Gm, Rout, (gm·rO)³, implementation | L6 | §9.4 |
| Lecture-09 | 21 Aug | Auxiliary amplifiers, differential gain boosting, CMFB intro | L6, L7 | §9.4, §9.7.1 |
| Lecture-10 | 24 Aug | CMFB: concept, resistive and source-follower sensing | L7 | §9.7.1–9.7.2 |
| Lecture-11 | 31 Aug | CMFB: triode sensing, pair sensing, the feedback loop | L7–L8 | §9.7.2–9.7.3 |
| Lecture-12 | 2 Sep | CMFB techniques, replica CMFB | L8 | §9.7.3 |
| Lecture-13 | 7 Sep | RC step, closed-loop τ, small vs large step, SR = ISS/CL | L9 | §9.9–9.10 |
| Lecture-14 | 9 Sep | Telescopic and folded slewing; stability concept, Barkhausen | L9, L11 | §9.10, §10.1 |
| Lecture-15 | 11 Sep | Loop-gain Bode plots, ωgx, ωpx, phase and gain margin | L11–L12 | §10.2–10.3 |
| Lecture-16 | 16 Sep | Phase margin vs closed-loop peaking (5°, 45°, 60°) | L12 | §10.3 |
| Lecture-17 | 18 Sep | Frequency compensation, Miller, two-stage with RHP zero | L13–L14 | §10.4–10.5 |

Your notes are numbered by class date, so they run ahead of the handout's L1–L14 plan. The app follows the handout
(the exams do), and each lesson shows which of your lectures it matches.

### 1.2 Tutorials

| File | Contents | In the app |
|---|---|---|
| Tutorial-1 | 5 differential-pair questions (Sedra–Smith style notation) | Bank: Tutorial 1 Q1–Q5 |
| Tutorial-2 | Razavi Problems 9.1, 9.2, 9.3 (noise parts removed) | Bank: Tutorial 2 Q1–Q3 |
| Tutorial-3 | Razavi Problems 9.4, 9.6, 9.8 | Bank: Tutorial 3 Q1–Q3 |
| Tutorial-4 | Gain boosting (Q1 = adapted Razavi 9.10; Q2, Q3 are not from Razavi) | Bank: Tutorial 4 Q1–Q3 |
| Tutorial-5 | CMFB (Q1 = Razavi 9.11 extended, Q2 = 9.12, Q3 not from Razavi) | Bank: Tutorial 5 Q1–Q3 |
| Tutorial-6 | Slewing and settling (not from Razavi) | Bank: Tutorial 6 Q1–Q3 |

All 21 tutorial questions are in the app, each with its circuit drawn.

### 1.3 Lab sheets

| Lab | Topic | Hand calculations in the app |
|---|---|---|
| 1 | RC low-pass, MOSFET curves | C from τ, rise time 2.2τ, f−3dB |
| 2 | CS amplifier with V* | RD, V*, W by ratio, maximum gain |
| 3 | CS vs cascode | gm, intrinsic gain, bandwidth, GBW |
| 4 | PMOS source follower | gm, Rout = 1/gm, output pole, DC shift |
| 5 | Simple vs low-compliance cascode mirror | Iout, Rout, Vout,min |
| 6 | PMOS-input resistive diff amp | RD, V*, gm, bandwidth |
| 7 | 5-T OTA from specs | gm from GBW, dB to ratios |
| 8 | Behavioural OTA in a capacitive amplifier | β, closed-loop gain and bandwidth |
| 9 | Two-stage Miller buffer | A ≥ 1/ε, τ, fu, IB1 = SR·CC |

Only the hand calculations are used; the Cadence steps (Virtuoso, ADE, calculator) are skipped, as you asked.

### 1.4 References

**`Razavi_Design-of-Analog-CMOS-Integrated-Circuits_2nd-ed.pdf`**
- 801 pages. The whole app cites it as "Razavi 2nd ed. §x.y / Example x.y / Problem x.y".
- It came inside your conversation zip; you couldn't upload it on its own.

**`Razavi_UCLA_EE215A_Fall2014_handouts/`**: Razavi's own lecture handouts from UCLA.
- Files: op amps, feedback, frequency response, stability and compensation, noise, differential pairs and mirrors.
- I read them for how Razavi builds intuition, then rewrote the ideas in my own words. Nothing was copied.
- Used for:
  - the "What noise is" lesson (power per hertz, kT/C);
  - the "One stage vs two" lesson;
  - the Barkhausen picture.

**`Allen_CMOS_Analog_Lectures/`**: P. E. Allen's lecture notes from aicdesign.org.
- Lectures 22 (compensation), 23 (two-stage design) and 24 (cascode op amps), plus short-course lectures 17 and 18.
- Used for:
  - the "fewer than three rings" rule of thumb;
  - CC ≥ 0.22·CL, which matches the app's own formula, 0.2216·CL.

### 1.5 Tutoring conversation

| File | What it is |
|---|---|
| `Tutoring-conversation_FULL-export.md` | The complete export from your zip (272,802 bytes). It is the newest version and includes the last turn, where the build prompt was written |
| `Tutoring-conversation_repo-copy.md` | The copy the app was built from (243,821 bytes). The full export contains all of it word for word, plus that last turn |
| `Excerpt.txt`, `Export-errors.txt` | From the same zip |
| `images/` | All 44 images: lecture-note photos, the exam paper (`1789657566261_image.png`), tutorial sheets, and your handwritten Tutorial 1 solutions (`20260820_*.jpg`). 4 are byte-identical duplicates kept under their original names |

The interactive diagrams and quizzes from that chat did not survive the export. They became the placeholder
`[Claude used visualize:show_widget]`. Every diagram was therefore redrawn from the text around it, your notes and
Razavi's figures.

The zip itself is not included again, because everything in it is in this package:
- the conversation;
- the Razavi PDF (byte-identical to the one in folder 03);
- the excerpt;
- the images.

### 1.6 This Claude Code session

| File | What it is |
|---|---|
| `Session-transcript_readable.md` | The whole build session, 26 Sep – 6 Oct 2026. It holds: your 38 messages; my 328 replies; the automatic summaries written each time the conversation got too long and was condensed; and all 1,266 tool actions (commands, file edits, screenshots), each with a short preview of its result. My hidden reasoning notes are not included. Open it in any Markdown viewer (VS Code, GitHub, Obsidian) |
| `images-you-sent/` | The screenshot you attached on 29 Sep ("add figures on pages like these") |
| `session-log-raw.jsonl.gz` | The complete raw log, compressed (122 MB unpacked). Every message and tool result in full, including every screenshot I took. Unpack with any unzip tool; each line is one JSON event. See §10 before sharing it |

---

## 2. How to use the app

### 2.1 Opening it
- Double-click `01_App/Analog-Gym.html`. It opens in your browser and works fully offline.
- The app is built mainly for a computer screen. It also works down to phone width.
- Dark mode follows your system setting. The sun icon in the top bar toggles it.

### 2.2 Your progress is saved
- Progress saves automatically in your browser's local storage, under the key `analog-gym/progress/v1`.
- Progress belongs to **that browser and that file location**. If you move the file, use a different browser, or clear site data, you start fresh.
- **Back it up:** go to Settings → "Your progress file" → **Download**. This saves a JSON file. You can also **Copy** it as text.
- **Restore it:** Settings → **Import** the JSON. Do this before the mid-sem.

### 2.3 Keyboard
- `1` Path · `2` Learn · `3` Labs · `4` Practice · `5` Review.
- Sliders move with the arrow keys; hold Shift for fine steps.
- Every control is reachable with Tab.

### 2.4 A good study loop
1. **Path** shows the exam countdowns and "your next step". Start there.
2. Do the lesson. Each lesson has 8 short steps; predict before every reveal.
3. At the end of a topic, open **Tutorials & PYQs** and attempt every question that needs only what you have covered.
4. Use **Practice** for endless fresh problems of the same type, until they feel automatic.
5. Use **Review** daily, for the cards that are due.
6. In the last week, use **Exam mode**: a timed paper in mid-sem style.

---

## 3. What the app contains

### 3.1 The five areas

**Path**
- Every unit, with its state: locked, learning or mastered.
- Countdowns: Mid-sem 9 Oct 2026 · Quiz III 30 Oct · Quiz IV 20 Nov · Comprehensive 8 Dec.
- Always shows your next step.
- Every unit is unlocked, as you asked, so you can go anywhere.

**Learn**
- Bite-sized lessons, grouped by unit.
- Each unit links to its end-of-topic page, labelled "Tutorials & PYQs · x/N solved".

**Labs**
- 13 interactive simulators: live circuit, sliders, live numbers and graphs.
- Each has a "what to discover" checklist.

**Practice**
- Generated problems: every type, endless, with fresh numbers.
- The fixed bank of your tutorials, quizzes, mid-sem, problem sets, Razavi examples, lab sheets and chat questions.

**Review**
- A spaced-repetition deck: formulas, rules, pictures and "why" questions.
- A mistake log.
- Timed exam mode.

### 3.2 Lessons: the 8-step template
Every lesson uses the same eight steps:

1. **Why you need this.** One sentence, tied to a real tutorial or exam question.
2. **The picture.** An interactive figure.
3. **Predict.** You commit to an answer before anything is explained.
4. **The idea.** At most about 120 words, with an analogy where one helps.
5. **The rule.** The boxed formula, with every symbol labelled.
6. **Worked example.** Real numbers, every step shown.
7. **Your turn.** 2–3 generated problems, with less help each time.
8. **Lock it in.** A one-line summary and memory hook; cards are added to Review.

How lessons behave:
- On a computer screen, in every analog lesson, a figure sits beside every text step.
- A lesson is **mastered** at ≥ 80% on its check, including at least one numeric problem.
- When you come back to a lesson, it resumes at the step you had reached.

**The master method.** Every solution in the app uses it, word for word the same:
```
STEP A  DC recipe: assume saturation → square law → walk the node voltages → CHECK the fence
STEP B  Give every transistor a ROLE by where the signal enters and leaves
STEP C  Replace every load by its resistance using the three impedance rules
STEP D  Av = −Gm × Rout, then fix the sign by inspection
```

**Rules taught alongside it:**
- the three impedance rules;
- "up multiplies, down divides — by gm·rO";
- the ratio rule;
- the saturation fences;
- headroom stacking;
- "smallest resistance in parallel wins".

**Analogies:**
- water height for voltage;
- a tap for the MOSFET;
- a waterfall for saturation;
- a see-saw for the op amp;
- eating half the cake for settling;
- a tap filling a bucket for slewing;
- a room with a ceiling and floor for headroom.

### 3.3 Curriculum: 51 units, 77 lessons (53 analog)

**Foundations (U0–U12)**

| Unit | Lessons |
|---|---|
| U0 Circuit language | Voltage drops (node = supply − drops) · Parallel resistors and the current divider |
| U1 The MOSFET (Razavi §2.1–2.2) | The MOSFET: a tap whose handle is the gate |
| U2 Triode, saturation, pinch-off (§2.2–2.3) | The waterfall · The square law and λ |
| U3 DC recipe and PMOS | Assume, solve, walk, check · PMOS with magnitudes, design direction |
| U4 Small signal (§2.4.3) | gm is a slope · rO, intrinsic gain, the small-signal model |
| U5 Common source (§3.3.1) | Gain is the slope at Q |
| U6 Impedance rules, mirrors (§3.3, Ch 5) | Three impedance rules · Diodes and current mirrors |
| U7 CS with every load (§3.3) | Av = −Gm·Rout · Degeneration and the ratio rule |
| U8 Follower and common gate (§3.4–3.5) | Source follower · Common gate |
| U9 Cascode (§3.6) | gm·rO² and the load trap · Telescopic: headroom stacking |
| U10 Differential pair (Ch 4, Tutorial 1) | CM, DM and current steering · Half circuits, ACM with 2RSS, CMRR · Input CM range |
| U11 Five-transistor OTA (§5.3, Quiz 1) | The mirror recovers the lost half · CM range and swing: your exam, step by step |
| U12 Poles and bandwidth (Ch 6) | One pole per node, GBW · Settling and slewing |

**Handout lectures (L1–L14)**

Each lesson shows the mapping, for example "Handout L4 · 1st ed §9.2.4–9.2.5 · 2nd ed §9.2.4–9.2.6".

| Lecture | Lessons |
|---|---|
| L1 Performance parameters (§9.1) | Gain and feedback · Bandwidth, settling, slew · Swing, offset, noise, supply rejection |
| L2 One-stage op amps (§9.2.1) | Gain vs swing · Unity-gain buffer and its window · Closed loop through capacitors: choose the CM level (Ex 9.6, your Lec 5) |
| L3 Design procedure (§9.2.2–9.2.3) | Power → swing → Vov → W/L → gain · Linear scaling and bias tracking |
| L4 Folded cascode (§9.2.4–9.2.6) | Don't stack, fold · Gain and the current divider |
| L5 Two-stage (§9.3) | One stage for gain, one for swing |
| L6 Gain boosting (§9.4) | Make the cascode fight back harder |
| L7 CMFB concept (§9.7.1–9.7.2) | Why fully differential outputs float |
| L8 CMFB techniques (§9.7.3) | The loop and its gain · Replica CMFB |
| L9 Input range and slew (§9.8–9.10) | A fixed tap before the exponential |
| L10 PSRR and noise (§9.11–9.12) | Supply rejection · What noise is (kT/C) · Wiggle each gate |
| L11 Stability I (§10.1–10.2) | Why feedback can oscillate · Two and three poles |
| L12 Stability II (§10.3) | Phase and gain margin · Peaking and ringing |
| L13 Compensation I (§10.4–10.5) | Dominant pole · One stage vs two · Miller pole splitting |
| L14 Compensation II (§10.5–10.6) | Two-stage: CC for 60° · RHP zero and nulling resistor |

**Digital half (L15–L38)**
- 24 lessons from Kang & Leblebici and Weste & Harris: inverters, delay, logic gates, logical effort, power, dynamic logic, sequencing, adders, multipliers, SRAM.
- Built before you asked to focus on analog only. It works, but has had no further work since then.
- No digital notes or tutorials were uploaded, so it is built from the standard textbook treatments and flagged in the app.

### 3.4 Labs (13)
| Lab | What you play with |
|---|---|
| MOSFET lab | VGS, VDS, W/L, µCox, λ sliders. Channel cross-section with moving electrons pinching off. ID–VDS family with live operating point. Region badge (OFF/TRIODE/SAT). gm, rO, gm·rO |
| DC recipe stepper | Step A one click at a time. Node voltages written onto the circuit. The fence check turns green or red |
| Impedance explorer | Click a terminal: ∞, rO, 1/gm, degenerated values, and why the device "fights back" |
| CS amplifier lab | Every load (resistor, diode, current source, triode, active, degenerated). Transfer curve with a draggable Q point. Tangent = gain |
| Cascode lab | Telescopic, bias-voltage ladder, Rout comparison (simple vs cascoded load) |
| Folded-cascode lab | Eleven live transistors. Current divider at the folding node. Input CM below ground |
| Headroom stack | Stacked overdrives, VISS, diode costs → swing left. Presets: 5-T OTA, telescopic, folded, Ex 9.7 |
| Differential pair lab | Vin1, Vin2 (also as VCM, vd). Animated current steering with ±√2·Vov marked. DM and CM half circuits (2RSS). Ad, ACM, CMRR |
| Five-transistor OTA lab | Signal currents through the mirror (net 2i into CL). CM range and swing. Unity-gain feedback toggle |
| Feedback, Bode and settling | A0, ω0, β, CL, ISS sliders. Bode plot with the 1/β line. Step response with the ε band and 4.6τ / 6.9τ markers. Slewing then settling |
| Stability & compensation | Poles, ωgx, ωpx, phase and gain margin, ringing. Two-stage with CC and Rz |
| Inverter lab, Logical effort lab | Digital half |

### 3.5 Practice

**Generators (61)**
- One or more for every problem type in every unit; 43 of them are analog.
- Every generated problem is solved twice: once by the physics formula, and once by an independent step-by-step trace. If the two disagree, the problem is thrown away.
- Every bias point is checked before you see it: all devices saturated, positive currents, voltages within the rails.

**Fixed bank (73 questions, each with its circuit drawn)**

| Group | Count | Items |
|---|---|---|
| Tutorials 1–6 | 21 | T1 Q1–Q5, T2–T6 Q1–Q3 |
| Quizzes and mid-sem (PYQs) | 6 | Mid-sem Q1 (= Quiz 1 Part C), Quiz 1 A, B, Quiz 2 A, B, C |
| Problem Set 1 (L1–L4) | 9 | P1–P8, P10 (P9 sits with Ex 9.8) |
| Problem Set 2 (L8–L14) | 6 | Slew, phase margin, compensation, replica CMFB, noise |
| Problem Set 3 (digital) | 6 | Digital half |
| Razavi examples | 5 | Ex 9.1, 9.2, 9.7, 9.8 (= PS1 P9), 10.6 |
| Razavi end-of-chapter | 4 | Problems 10.1–10.4 |
| Lab sheets | 9 | Labs 1–9 |
| From the tutoring chat | 6 | WE1–WE3, buffer, 1 V buffer CM range, buffer window |
| Lecture notes | 1 | Lec 16 peaking |
| Worked example | 1 | Your exam OTA: PSRR and noise |

**Answering**
- Type answers with SI prefixes: `90u`, `9k`, `0.6m`, `1.2M`, `5p`.
- Answers within ±2% count as right. You can change this in Settings.

**Hints and solutions**
- Each question has a hint ladder: nudge → which method → which formula → first worked step.
- The full solution is the master-method step trace beside the circuit.

**Diagnosing mistakes**
- 29 mistake detectors explain *why* an answer is wrong, not just that it is wrong.
- Examples: forgot to square Vov · forgot the ½ · used VGS for Vov · PMOS sign · forgot rO in parallel · rO instead of rO/2 · diode costs a threshold · β vs βA · RSS instead of 2RSS · cascode with a simple load · µ vs m prefix · ln(1/ε) values · forgot 2π · Miller without the +1 · RHP zero treated as a lead · and more.

**Layout on a computer screen**
- The figure is large and pinned on the left; the statement, givens and one-line answer rows are on the right.
- Everything fits on one screen.

**Question mode**
- While you attempt a question, any number on the figure that is not a given is shown as "?". The figure never gives away an answer.
- Numbers appear once you open the full solution, or hand in an exam.

### 3.6 End-of-topic "Tutorials & PYQs" pages
- Every topic ends with a page (`#/topic/<unit>`) listing every tutorial, PYQ, problem-set, Razavi and lab question that needs **only topics up to that one**.
- A question lives at the end of the **last** topic it needs. Earlier topics list it under "Coming up", with a link.
- You attempt each question right there.
- A pill shows its state:
  - *ready*,
  - *needs U10*,
  - *2/5 parts*,
  - *solved*.
- A question is marked ✓ once every part has been answered right.
- The last lesson of each topic ends with an "Attempt them →" button.

**PYQs** here means Quiz 1, Quiz 2 and the mid-sem question. Your sources contain no papers from earlier years.

### 3.7 Review
**Cards**
- 174 cards. Each lesson adds its cards when you reach "Lock it in".
- They are scheduled with Leitner boxes:
  - a card you know comes back after 1, 2, 4, 8, then 16 days;
  - a card you miss goes back to box 1.

**Mistake log**
- Every diagnosed mistake, with the question it came from.

**Exam mode**: timed papers with fresh numbers. Answers and figure values stay hidden until you hand in.

| Paper | Time | Content |
|---|---|---|
| Mid-semester style | 90 min, closed book | 5-T OTA design, telescopic design, folded cascode, feedback accuracy, phase margin, two-stage compensation |
| Quiz III style | 30 min | Slewing, phase margin, Miller compensation |
| Quiz style | 30 min | Differential pair, OTA, poles |
| Foundations check | 30 min | DC recipe, small signal, gain by inspection |
| Digital check | 45 min | Digital half |

### 3.8 Figures
- 62 parametric circuit figures, each redrawn from scratch: every figure from the conversation and from your lecture notes.
- Examples:
  - 5-T OTA;
  - both telescopic versions;
  - folded cascode, and the folding steps;
  - half circuits;
  - Fig 9.9 buffer;
  - Fig 9.11 with bias mirrors;
  - Fig 9.12 tracking;
  - two-stage;
  - gain-boosting (three kinds);
  - CMFB (resistive, triode, replica, Tutorial 5 Q3);
  - capacitive feedback (Ex 9.6);
  - and more.
- Two drawing styles, switchable in Settings:
  - proper transistor symbols;
  - the simplified labelled boxes from the chat.
- One colour code everywhere: NMOS purple, PMOS teal, signal path orange. Region badges say SAT / TRI / OFF in text, not just colour.
- Hover a figure to inspect node voltages and currents. This is off in question mode.
- 85 glossary entries. Every symbol is underlined where it appears; hover or tap it for the definition.

---

## 4. How it was built

### 4.1 The steps
1. **Organised your uploads** into `source/` and committed them to a private GitHub repo.
2. **Wrote an inventory** of the conversation (`06_Project_Documents/Content-inventory_and_flags.md`). It lists every concept, formula, worked example, analogy, diagram and question, tagged by unit. Every place where your sources disagree is flagged there (§6).
3. **Wrote the physics engine first**, as pure TypeScript with no UI (`src/physics/`):
   - the MOSFET model;
   - every circuit result in CLAUDE.md §6;
   - plus the tutorial-specific solvers.
   Every formula shown anywhere in the app comes from here.
4. **Locked the engine down with tests**: unit tests, the full regression table of answers already verified in the conversation, and engine solutions of every tutorial and quiz.
5. **Built the circuit-drawing system** (`src/circuits/`):
   - SVG components: `Nmos`, `Pmos`, `Resistor`, `Capacitor`, `CurrentSource`, `Rail`, `Wire`, `Node`, `CurrentArrow`, `OpAmp`, and others;
   - a schematic engine for multi-transistor circuits;
   - 62 parametric figures that take node voltages, regions and currents as props.
6. **Wrote the content as data** (`src/content/`): units, lessons following the 8-step template, glossary, cards, and side figures for each lesson.
7. **Built the practice engine** (`src/practice/`):
   - problem schema;
   - SI-unit parser and checker;
   - 61 generators with the double solve;
   - hint ladders;
   - mistake detectors;
   - the fixed bank and its figures.
8. **Built the labs** (`src/labs/`), the Review deck and exam mode (`src/review/`), and the app shell, Path and progress store (`src/app/`).
9. **Checked it repeatedly**: tests, a content lint, Playwright screenshots of every page and figure at desktop and phone widths in light and dark mode, and overlap checks on every figure's labels. I then fixed what the screenshots showed.
10. **Packaged it** as a single offline HTML file.

### 4.2 Milestones
The build followed the milestones in CLAUDE.md §14:

| Milestone | What it delivered |
|---|---|
| M1 | Foundations U0–U5, MOSFET lab, DC stepper, Path |
| M2 | Single-stage U6–U9, impedance / CS / cascode labs |
| M3 | Differential and bandwidth U10–U12, diff-pair / OTA / feedback / headroom labs, Tutorial 1 and the exam question |
| M4 | L1–L4, Tutorials 2–3, Problem Set 1, folded-cascode lab, Review, exam mode, single-file build |
| M5 | L5–L14 from your lecture notes 6–17, Tutorials 4–6, Quiz 2, Problem Set 2 |

The digital half and the later refinements came on top (§7).

### 4.3 Tech stack
- **Vite + React 19 + TypeScript** (strict). No backend.
- **KaTeX** for formulas.
- Hand-written SVG for circuits and plots.
- **IBM Plex Sans / Mono** fonts, bundled so the app works offline.
- **Vitest** for unit and regression tests; **Playwright** (Chromium) for screenshots, smoke and leak tests.
- `vite-plugin-singlefile` inlines everything into one HTML file.

### 4.4 Source layout (inside `07_Source_Code/analog-gym-source_5f879b3.zip`)
```
src/physics/    device model, stages, diff pair, op amps, CMFB, frequency, stability, noise, digital, tutorial solvers  (+ tests)
src/circuits/   SVG component library, schematic engine, 62 parametric figures, figure registry, gallery
src/labs/       the 13 labs
src/content/    curriculum, lessons (foundations, single, diff, handout, late, stability, digital), glossary, cards, idea figures
src/practice/   schema, units/SI parser, checker, mistakes, generators/, fixed bank files, bank figures, QuestionFigure
src/learn/      lesson view, Learn index, topic pages (Tutorials & PYQs), sheet links
src/review/     Review deck, mistake log, exam mode
src/app/        App shell and routing, Path, progress store, settings
src/styles/     tokens.css (colours, type, spacing), app.css
e2e/            Playwright: smoke (every page/lesson/lab), diagrams (overlap check), leaks (no answers on figures), single-file
content/        inventory.md, research.md, design-tokens.md
CLAUDE.md       the build prompt (standing project instructions)
```

### 4.5 Design
- **Identity:** an engineer's lab notebook. Warm paper background and squared grid; circuits drawn in ink.
- **Colours:**
  - NMOS purple `#6B4FBB`;
  - PMOS teal `#0E8A82`;
  - signal path orange `#D9622B`;
  - status green and red, always paired with text.
- **Type:** IBM Plex. Every number is set in a monospace face so values line up.
- **Motion:** used only for cause and effect (current dots, the channel pinching, the output ramping). It respects reduced-motion settings.
- **Layout:** desktop-first, as you asked. Content runs up to 1600 px wide, and the figure sits beside the text.
- Full token proposal: `06_Project_Documents/Design-tokens.md`.

---

## 5. How everything was checked

The tests were run again for this package, on commit `5f879b3`.

| Check | Result |
|---|---|
| Vitest: physics, generators, content lint, tutorials, regression table | **674 / 674 passed** (12 files) |
| TypeScript strict typecheck | clean |
| Playwright: smoke test of every page, lesson, lab and topic page; deep links; exam mode; a diagnosed mistake; progress recording | passed |
| Playwright: every figure at 1280 px and 390 px, light and dark, with no overlapping labels | passed |
| Playwright: no figure in question mode prints an answer (bank and generated) | passed |
| Playwright: the single-file HTML opens offline | passed |
| Playwright total | **112 / 112 passed** |
| Package screenshots of `01_App/Analog-Gym.html` | 16 pages × 2 sizes, no page errors (`08_Screenshots`) |

### 5.1 Regression table
All of these answers were verified by hand in the tutoring conversation. The engine reproduces each one (`src/physics/regression.test.ts`).

| Problem | Expected (reproduced) |
|---|---|
| Part 1 WE1 | Vov 0.3 V, ID 90 µA, VD 0.9 V, gm 0.6 mA/V, rO 111.1 kΩ, gm·rO 66.7, Av −5.50 (−6 without rO) |
| Part 1 WE2 | W/L 22.2, VG 0.5 V, RD 9 kΩ |
| Part 1 WE3 (PMOS) | \|Vov\| 0.4 V, ID 160 µA, VD 0.8 V |
| Tutorial 1 Q1 | RD 9 kΩ; (W/L)1,2 22.22; (W/L)3 44.44; (W/L)4 22.22; R 13 kΩ; CMIR −0.25 V to +0.35 V |
| Tutorial 1 Q2 | W1,2/W3,4 = 25 |
| Tutorial 1 Q3 | (W/L)1,2 12.5; (W/L)3,4 50; Ad 18 V/V |
| Tutorial 1 Q4 | VCM 2.33 V; RD 5.06 kΩ; VD 2.47 V; ACM −1.92; ΔVCM 0.29 V |
| Tutorial 1 Q5 | I = 250 µA |
| Mid-sem Q1 | (W/L)3 19.2; (W/L)1 26.67; Av 88.9; Vout 0.35–1.55 V; f−3dB 358 kHz; buffer 31.8 MHz; SR 30 V/µs |
| Razavi Ex 9.1 | A ≥ 1000 (990 exact) |
| Razavi Ex 9.2 | ωu ≥ 9.21 Grad/s; fu ≥ 1.47 GHz |
| Razavi Ex 9.7 | (W/L)1–4 1250, 5–8 1111, 9 400; Av ≈ 1.4×10³; ≈ 4000 after doubling M5–M8; Vin,CM 1.4 V, Vb1 1.6 V, Vb2 1.7 V; Vout 0.9–2.4 V |
| Problem Set 1 P1–P10 | All values in CLAUDE.md §11, e.g. P1 Av 84.3, P2 τ 7.9 ns and t0.1% 54.6 ns, P6 Av ≈ 333, P10 Av ≈ 2300 |

### 5.2 Answers solved by the engine for the first time
- **Tutorials 2–6 and Quiz 2.** These had no verified key, so the engine solved them and I compared the results with your preliminary values. Agreement and disagreement are in the inventory §7 and §11 and summarised in §6 below.
- **Quiz 1 and Quiz 2.** The engine matches both keys. Quiz 2 rounds its intermediate values, so it differs by up to 1.3%; the checker's ±2% tolerance accepts either answer.

### 5.3 Content lint (automatic)
Every lesson is checked for:
- the template is followed (picture, prediction, rule, worked example, your turn, lock-in);
- at most about 120 words per step;
- notation as in CLAUDE.md §6;
- every glossary term, generator and bank question referred to really exists;
- correctly escaped formulas.

---

## 6. Flags: where sources disagree, and assumptions

These are also shown inside the app, on the questions they affect.

1. **Lecture numbering.** Your notes are numbered by date and don't match the handout's L1–L14. The app follows the handout and shows "your notes: Lec NN" on each lesson.
2. **Tutorial ↔ Razavi mapping** (corrects CLAUDE.md §3):
   - Tutorial 4 Q1 is an *adapted* Razavi 9.10, with different µnCox and λ.
   - Tutorial 4 Q2, Q3, Tutorial 5 Q3 and all of Tutorial 6 are not Razavi problems.
   - Tutorial 1 is Sedra–Smith style.
3. **The mid-sem question = Quiz 1 Part C.** The recovered exam paper confirms (W/L)5,6 = 30, so the "scan cut off" worry is resolved.
4. **Mid-sem Q1(e), buffer bandwidth.** The app accepts all three answers and explains the difference:
   - **31.8 MHz** using 1/gm;
   - **31.95 MHz** using 1/gm2 ‖ rO4 (the key);
   - **32.19 MHz** using f3dB·(1 + βA).
5. **Ex 9.7 gain.** Exact arithmetic gives 1429, the book prints 1416 and your Lec 4 says 1428. They agree to within 1%.
6. **Quiz 2 key rounds intermediates.** The exact values differ by up to 1.3%; both are accepted.
7. **Part 1 WE2.** Its statement was lost in the export. I rebuilt givens that reproduce its answers: VDD 1.8 V, ID 100 µA, Vov 0.15 V, Vth 0.35 V, µnCox 400 µA/V², VD 0.9 V.
8. **Tutorial 2 Q2(b): a real disagreement.** Your preliminary output range was 0.70–1.50 V. Because M2's gate is tied to Vout, M2 leaves saturation above 1.21 V, so the true range is **0.70–1.21 V**, the Ex 9.5 window Vth − Vov4.
9. **Tutorial 2 Q1(c) is ambiguous.** "Gain at the peaks" gives 19.8 if you average the two halves, or 15.2 for the triode half alone. Nominal is 24.4. Ask your instructor which is meant.
10. **Notation.** Tutorial 1 uses k′n, |V′A| and Vt. The app uses your notes' µnCox, λ and Vth, with a one-line translation.
11. **Problem Set 1 P5 hides a triode device.** As sized, M3 is in triode. The key assumes every device is saturated. The app keeps the key's numbers, shows M3 in red and explains why.
12. **Lab 8.** The sheet's COUT = 4.88 pF does not match GM/(2π·fu) = 5.06 pF.
13. **L10 (PSRR, noise).** Built from Razavi only; none of your notes cover it.
14. **L14.** The nulling resistor and choosing CC for 60° come from Razavi §10.5–10.6; your notes stop at Lec 17.
15. **Razavi Ex 9.26 (noise)** could not be reproduced from the stated sizes, so it is not used.
16. **Digital: carry-skip delay.** Follows Weste & Harris with unit delays.
17. **Digital: VIL/VIH** come from the exact square-law VTC. They match Kang's closed forms in the symmetric case.
18. **Tutorial 4 Q3 has no key.** The circuit was read from the figure. The engine gives:
    - (W/L)6 296.1, R3 19.26 kΩ, (W/L)7 133.3;
    - R1 5.377 kΩ, R2 591.9 Ω;
    - |Av| ≈ 63.1.
    The gain is limited by M6's simple load. It will differ if your class treats R3 as bypassed.
19. **Tutorial 5 Q2 and Q3.** Razavi 9.12 gives no sizes, so its loop gain is asked as an expression. Q3 assumes the optimum VO,CM is mid-range and that "±1%" means |ACM| ≤ 0.010. The engine gives:
    - without CMFB: Ad 46.8, |ACM| 0.497, CMRR 94.3;
    - with CMFB: loop gain 17.1, |ACM| 0.0274, CMRR 1707.
20. **Lec 5 transistor numbering.** Your notes number the folded cascode differently from Razavi. The app keeps Razavi's numbering, which the tutorials use too, and states the translation.

Full details, with every number: `06_Project_Documents/Content-inventory_and_flags.md`, sections 1, 7, 8, 9, 11 and 12.

---

## 7. Development history

All dates are 2026 and times are UTC. Every message and action is in `05_Claude_Code_Session/Session-transcript_readable.md`.

| Date | You asked | What was done | Commit |
|---|---|---|---|
| 26 Sep | Build the app from my CLAUDE.md; uploads of tutorials, lecture notes 1–12, quizzes, handout, current-mirror and settling-time notes; "can't upload the book" | Repo organised into `source/`, physics engine with tests, inventory, design tokens | `95f2a6d`–`5820e86` |
| 26 Sep | Conversation zip (with the book inside): "build the app" | Milestone 1: U0–U5, MOSFET lab, DC stepper, practice, review | `e22cc6d`, `2b032d4` |
| 26 Sep | "Use proper transistor figures, not boxes" · "UI looks too simple, make it attractive" · "I use it on a PC monitor, optimise for that" | Real transistor symbols plus a box-style toggle; visual refresh; desktop-first layout | `9f14b1f`, `f5da6b9` |
| 26 Sep | "Look online for similar apps…, continue with the next two milestones" · "keep the level of my tutorial/exam questions in mind" · Labs 1–9 | Research notes; M2 (schematic engine, U6–U9, three labs); M3 (U10–U12, four labs, Tutorial 1, exam); lab sheets 1–9 | `eb4a11c`, `41220a6` |
| 26 Sep | "Screenshot every page and fix everything" · "cover all lectures and their tutorials" · "and all questions from the chat" | M4 (L1–L4, Tutorials 2–3, PS1, Razavi examples, exam mode, folded lab); L5–L9 with Tutorials 4–6 and Quiz 2; chat questions; audit pass | `d22436d`–`9becaa5` |
| 28 Sep | "Unlock all chapters, build the rest, look at similar apps, verify everything" · lecture notes 13–17 · "use Razavi's own notes to make it intuitive" | L10–L14 (PSRR, noise, stability, compensation); all units unlocked; digital half L15–L38; UI refresh; Razavi UCLA and Allen handouts read; kT/C and one-vs-two-stage lessons | `8cabfa7`–`410484f` |
| 28 Sep | "Does it save my progress?" | Yes: local storage plus export/import (§2.2) | — |
| 29 Sep | "Cover all tutorial questions and add figures on pages like these" (screenshot) · "only analog for now" · "don't publish, give me the file here" | Figures beside every text step; all 21 tutorial questions in the bank with circuits; TeX escaping fix; publish workarounds undone; HTML sent in chat | `16ce962` |
| 29 Sep | "Have you covered everything in my handwritten notes, Lec 1–5?" · "all questions covered in class?" · "link problems from each topic" · Lecture 5 upload | Lec 1–5 audit (bias-branch figure, Ex 9.7 power split, gain 1428, closed-loop card); Lec 5 → Ex 9.6 CM-choice lesson and folding figure; topic links | `7efd832`, `28f4de4` |
| 2 Oct | "Add PYQs and tutorials at the end of each topic… screenshot-check the UI" · "figure on one side, answers on the other" · "figure decently big" | End-of-topic Tutorials & PYQs pages; desktop problem layout; large pinned figures; figures hide answers until the solution | `5f879b3` |
| 6 Oct | "Make a zip of everything, labelled, with the HTML, a guide…" · "add all of this conversation too" | This package | (no code change) |

The full commit list is in `07_Source_Code/git-history.txt`. That list also shows two commits made on GitHub before the session (`5d73a91` "Initial commit" and `6579fd4` "Add files via upload").

---

## 8. Known limitations and what is still open

**The online artifact is out of date.**
- The artifact link from 26–29 Sep holds an older test build: version 12, which is missing Tutorial 5 Q3.
- Publishing newer builds kept failing an automatic size check that wrongly flagged them. You asked me to stop publishing, so the file in `01_App/` is the current version.
- Use the file, not the link.

**Progress is stored per browser.** Export a backup before the mid-sem (§2.2).

**Digital half (L15–L38).**
- Built from textbooks only. No digital notes, tutorials or quizzes were uploaded.
- No further work on it after you asked to focus on analog.

**Lab sheets.**
- Answers that come from a sizing chart (V* and gm/ID charts) use clearly labelled example chart readings.
- Your own simulation data will give slightly different numbers.

**Still open:**
- Tutorial 2 Q1(c): which "gain at the peaks" your instructor wants (flag 9).
- Tutorial 4 Q3 and Tutorial 5 Q3 have no official key (flags 18–19). Compare them with the class solutions when you get them.
- New lectures after Lec 17, new tutorials and new quizzes can be added the same way: upload them and ask.

---

## 9. Working on the code yourself

Unzip `07_Source_Code/analog-gym-source_5f879b3.zip`, then:

```bash
npm install
npm run dev               # live app at http://localhost:5173
npm test                  # 674 Vitest tests (physics, generators, content lint, regression table)
npm run typecheck         # TypeScript strict
npx vite build --mode single   # → dist-single/index.html (the one-file app)
npx vite build && npx playwright test   # 112 browser tests (needs a Chromium; see playwright.config.ts)
```

**Repo-only files.** `source/` (your uploads) is not in the source zip, because it is already in folders 02–04. To rebuild the repo exactly, use the GitHub repo in `LINKS.md`.

**Adding content.** Lessons are TypeScript objects in `src/content/lessons/*.ts`, and bank questions are in `src/practice/bank*.ts`. Every number must come from a function in `src/physics/` that has a test. `CLAUDE.md` in `06_Project_Documents` is the full specification and the rules.

---

## 10. Privacy and copyright notes

**Razavi's textbook and the UCLA and Allen handouts** are copyrighted.
- They are here for your personal study only. Don't share them on.
- That is also why the GitHub repo must stay **private**: it contains the textbook PDF.
- The app itself paraphrases and redraws, cites "Razavi 2nd ed. §…", and copies no text or figures.

**`session-log-raw.jsonl.gz`** is the unedited log. Read this before sharing it:
- It contains the tool's internal instructions and your account email.
- It contains every file and screenshot that passed through the session.
- Share the readable transcript instead if you need to show someone the session.

**Your uploads** are included unchanged; only the file names were changed.
