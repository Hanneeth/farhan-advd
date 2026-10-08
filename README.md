# Analog Gym

An offline, interactive tutor for Razavi's op-amp chapter (EEE/INSTR F313), built from `docs/build-spec.md` (the original build prompt; `CLAUDE.md` is now a short working guide).

## Use it

- **One file, anywhere:** `npm run build:single` → open `dist-single/index.html` in any browser (works offline, on a phone too).
- **Develop:** `npm install`, then `npm run dev`.

Progress lives in your browser. Export or import it from **Settings**.

## Checks

| Command | What it checks |
|---|---|
| `npm test` | Physics unit tests, the full CLAUDE.md §11 regression table, Quiz 1/2 keys, Tutorials 2–3, generators (300 seeds each, two independent solves), answer checker, content lint |
| `npm run shots` | Playwright: every figure at 1280 px and 390 px in light and dark mode, with automatic label-overlap detection; a smoke test of every lesson and page; the offline single-file build |
| `npm run typecheck` | TypeScript |

## Layout

```
src/physics/    pure functions + tests: the single source of truth for every number
src/circuits/   SVG component library (transistor symbols or simplified boxes) and parametric figures
src/labs/       MOSFET lab, DC recipe stepper (more labs in later milestones)
src/content/    curriculum, lessons as data, glossary
src/practice/   problem schema, generators, fixed bank, checker, mistake catalogue
src/review/     Leitner review deck, mistake log
src/app/        routing, Path map, progress store, settings
content/        inventory.md (source inventory and flags), design-tokens.md
source/         your material: conversation, Razavi, notes, tutorials, quizzes, handout
```
