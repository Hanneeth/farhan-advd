# Design token proposal (for review before any UI is built)

**Identity: an engineer's lab notebook on a circuit bench.** The page reads like squared notebook paper with a red margin rule. Circuits are drawn in ink, device types keep one colour everywhere, and numbers are set in a monospace face so columns of values line up like a bias table. Lessons are laid out as one continuous notebook page with numbered margin steps, not a grid of cards.

## Colours: 6 core tokens

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--paper` | `#F7F4EC` warm off-white | `#16181D` | page background |
| `--ink` | `#1F2328` | `#E6E3DA` | text, wires, rails |
| `--nmos` | `#6B4FBB` purple | `#A48FF0` | every NMOS device, NMOS labels (the conversation's convention) |
| `--pmos` | `#0E8A82` teal | `#4CC9BF` | every PMOS device and label |
| `--signal` | `#D9622B` orange | `#F08A55` | the signal path: small-signal current arrows, the active step, the "your next step" marker |
| `--rule` | `#E3DCCB` grid / `#D9534F` margin rule | `#2A2E36` / `#B5504C` | notebook grid and margin |

**Status colours** (derived, used sparingly): `--ok` `#2E7D4F` (saturated, correct), `--bad` `#B8382A` (triode, off, wrong answer), and passives in `--muted` `#7A7F87` (resistors and capacitors in the simplified box style).

Every pairing will be checked for ≥ 4.5:1 contrast on `--paper` in both modes. Colour is never the only cue: region badges also carry text (SAT / TRI / OFF), and correct/wrong also shows ✓ / ✗.

## Type: 2 faces, bundled locally so the app works offline

- **IBM Plex Sans** for UI and prose: 16 px body (17 px on phones), 1.55 line height, headings 20 / 24 / 30.
- **IBM Plex Mono** for every number, unit, node voltage and bias table, with tabular figures so values line up.
- **KaTeX** for formulas (its own math font), with boxed rules framed by a thin `--ink` border.

## Spacing and shape

- A 4 px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- Notebook grid pitch 24 px, so diagrams snap to the same grid.
- Radius 4 px (small, like paper tabs), no drop shadows, only 1 px rules.
- Circuit strokes: wires 1.5 px, device bodies 2 px, highlighted signal path 3 px `--signal`.
- Layout: a content column of at most 720 px for text, with diagrams allowed to 960 px. On phones, 16 px gutters and each lesson step stacks as diagram → text → action.

## Motion

Motion appears only to show cause and effect: current dots flowing, the channel pinching, the output ramping. It lasts 200–600 ms, and `prefers-reduced-motion` swaps it for instant state changes with a "step" button.

## Focus and keyboard

Focus shows as a 2 px `--signal` outline offset by 2 px. Every slider supports arrow keys and fine steps with Shift. The main areas (Path / Learn / Labs / Practice / Review) get single-key shortcuts `1`–`5`.
