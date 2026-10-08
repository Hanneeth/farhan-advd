/**
 * "The audit — 20 things you should be able to answer cold" from the tutoring chat, as Review cards.
 * (The chat's interactive quizzes did not survive the export; this list did.) Answers written from the lessons.
 */
import type { Card } from './types';

export const AUDIT_CARDS: Card[] = [
  { id: 'audit-01', front: 'Why does ID stop growing once VDS exceeds Vov?', back: 'The channel pinches off at the drain end; beyond that the extra VDS drops across the tiny pinch-off region (the waterfall), so the current is set upstream by VGS. Only λ adds a small slope.' },
  { id: 'audit-02', front: 'Write gm three ways and say when each is useful.', back: 'µCox(W/L)Vov (fixed size and bias voltage); √(2µCox(W/L)ID) (fixed size and current); 2ID/Vov (headroom and design questions: the one you use most).' },
  { id: 'audit-03', front: 'Why is gm·rO independent of bias current?', back: 'gm = 2ID/Vov and rO = 1/(λID): ID cancels, leaving 2/(λVov). (That holds at a fixed Vov; in a fixed-size device more current raises Vov and lowers the gain.)' },
  { id: 'audit-04', front: 'When does gmb appear, and why?', back: 'When the source is not at the body potential (a source that moves with the signal, e.g. followers, cascodes). The body acts as a second gate. Your tutorials set γ = 0.' },
  { id: 'audit-05', front: 'Why is CGD only overlap capacitance in saturation?', back: 'The channel is pinched off at the drain end, so the gate no longer sees the drain through the channel; only the gate–drain overlap remains.' },
  { id: 'audit-06', front: 'Gain of the five CS loads, from memory.', back: 'Resistor −gm(RD‖rO); diode −gm1/gm2 (‖rO’s); current source −gm1(rO1‖rO2); active −(gm1+gm2)(rO1‖rO2); degenerated −RD/(1/gm + RS).' },
  { id: 'audit-07', front: 'Why did |Av| = 2·(DC drop)/Vov end the resistor load?', back: 'Gain needs a big DC drop across RD, but the drop comes out of a small supply. Gain 10 at Vov = 0.2 V needs 1 V across RD.' },
  { id: 'audit-08', front: 'Rout of a degenerated device, and how it becomes the cascode?', back: 'rO + (1 + gm·rO)RS ≈ gm·rO·RS. Replace RS by the rO of a device underneath and you get the cascode gm·rO².' },
  { id: 'audit-09', front: 'Rin of a common-gate stage, and why it goes infinite with an ideal load?', back: '(RD + rO)/(1 + gm·rO) ≈ 1/gm + RD/(gm·rO). With an ideal current-source load RD → ∞, so Rin → ∞: the current has nowhere to go.' },
  { id: 'audit-10', front: 'Why is a follower’s gain 1/(1 + η), and why is that nonlinear?', back: 'With body effect the source pulls the threshold up: gmb = η·gm fights the output. η depends on VSB, which moves with the signal, so the gain changes with the signal.' },
  { id: 'audit-11', front: 'Derive ΔVin,max = √2·Vov.', back: 'All of ISS flows in M1 when √(2ISS/(µCox W/L)) = VGS1 − Vth, and M2 just turns off (VGS2 = Vth). The difference is √(2ISS/k) = √2·√(ISS/k) = √2·Vov (Vov at balance).' },
  { id: 'audit-12', front: 'Why does the CM half circuit use 2RSS?', back: 'Both halves push equal currents into RSS, so its voltage rises by 2i·RSS; each half sees that as its own 2RSS.' },
  { id: 'audit-13', front: 'Why does the five-transistor OTA have Gm = gm1,2, not gm1,2/2?', back: 'The mirror copies M1’s +i to the output, where it adds to M2’s −i (sunk less): total 2i = gm·vd.' },
  { id: 'audit-14', front: 'Why does a diode connection cost a threshold? Name three places it bites.', back: 'Its drain sits a full |VGS| = |Vth| + |Vov| from its rail. Bites: 5-T OTA CM ceiling (VDD − |VGS3|), mirror-loaded telescopic swing (|Vthp| lost), mirror bias nodes (R in Tut 1 Q1).' },
  { id: 'audit-15', front: 'Where is the mirror pole, and why does it matter?', back: 'At the diode node: ≈ gm3/CX (1/gm3 times the gate capacitances of M3, M4). It is a second, non-dominant pole that eats phase margin.' },
  { id: 'audit-16', front: 'Miller multiplication, and which stages escape it?', back: 'A capacitor across a gain −A looks like C(1 + A) at the input. The follower, the common gate and the cascode (its input device sees gain ≈ −1) escape it.' },
  { id: 'audit-17', front: 'ε and Amin?', back: 'ε = 1/(1 + βA); Amin = Aclosed/ε.' },
  { id: 'audit-18', front: 'τ and the settling time?', back: 'τ = Aclosed/ωu; t = τ·ln(1/ε) (4.6τ for 1%, 6.9τ for 0.1%).' },
  { id: 'audit-19', front: 'Telescopic vs folded: four differences.', back: 'Gain: telescopic slightly higher. Swing: folded larger (four overdrives, no input pair or tail in the stack). Power: folded more (two extra branches). Input CM: folded can reach a rail and equal the output CM.' },
  { id: 'audit-20', front: 'Why is a telescopic’s output trapped in a Vth2 − Vov4 window as a buffer?', back: 'M4 needs Vout ≥ Vb1 − Vth4; M2’s gate is the output and its drain is fixed at Vb1 − VGS4, so Vout ≤ Vb1 − VGS4 + Vth2. Width Vth − Vov4.' },
];
