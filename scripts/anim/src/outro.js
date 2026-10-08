/* Closing: the exam playbook for Lectures 7–12. */
'use strict';
scene('Exam playbook', 'How to attack any Lec 7–12 question', 44, (S) => {
  header(S, 'EXAM PLAYBOOK', 'Five moves that solve every question in these lectures');
  remember(S, [
    '**1 · Currents first.** KCL at fold nodes, mirrors (equal $V_{GS}$ ⇒ current ∝ W/L), power ÷ $V_{DD}$.',
    '**2 · Levels by checks and links.** Walk from a rail: a $V_{ov}$ per channel (check), a $V_{GS}$ per gate (link). Two-stage X = $V_{DD} - |V_{GS9}|$; booster X = $V_{GS3}$.',
    '**3 · Gain by two looks.** $G_m$ (current divider), look up ∥ look down, two stages multiply, boosting multiplies $R_{out}$ by $(1 + A_{aux})$ — then **check the load** (the trap).',
    '**4 · CMFB.** Output range’s middle = $V_{REF}$; DM half circuit (midpoint = AC ground) vs CM half circuit ($2r_{O,tail}$, R’s open); CM gain ÷ $(1 + T)$.',
    '**5 · Triode and replica.** $R_{on} = 1/(\\mu C_{ox}\\tfrac WL(V_{GS}-V_{th}))$; $V_P = 2I_DR_{tot}$; replica = copy above, sum below, balance conductances.',
  ], 0.4, 'The playbook');
  S.say(0.4, 'One card to keep: currents, levels, gain, CMFB, triode. Every past paper in this lesson used these five moves in this order.');
  S.say(14, 'Use the chapter list to jump back to any question, the formula sheet below for revision, and the flashcards to test yourself.');
});
