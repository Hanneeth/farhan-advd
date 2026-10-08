/**
 * Casio fx-991CW recipes for this course (keys from Casio's fx-570CW/991CW user guide). Each recipe is the
 * fastest correct keystroke path for one kind of calculation that turns up in the tutorials and papers.
 */
const RECIPES: Array<{ id: string; title: string; when: string; steps: Array<[string, string?]>; example?: string }> = [
  {
    id: 'R1',
    title: 'Set up once (before the exam)',
    when: 'Results with µ, m, k, M; angles in degrees for phase margin.',
    steps: [
      ['[SETTINGS] ▸ Calc Settings ▸ Engineer Symbol ▸ On', 'answers show as 600µ, 9k, 1.47G'],
      ['[SETTINGS] ▸ Calc Settings ▸ Angle Unit ▸ Degree', 'tan⁻¹ and sin⁻¹ give degrees (phase margin)'],
      ['[SETTINGS] ▸ Input/Output ▸ MathI/DecimalO', 'decimal answers, not fractions'],
    ],
  },
  {
    id: 'R2',
    title: 'Type prefixes directly',
    when: 'Every number with a unit: 400 µA/V², 0.5 mA, 4 pF.',
    steps: [['400 [CATALOG] ▸ Engineer Symbol ▸ µ', 'the screen shows 400µ'], ['results show µ/m/k by themselves once R1’s Engineer Symbol is On']],
    example: '2 × 0.1m ÷ ( 400µ × 0.15² ) = 22.22',
  },
  {
    id: 'R3',
    title: 'Square law, both ways, in one line',
    when: 'W/L from ID and Vov; Vov from ID and W/L; gm.',
    steps: [['W/L = 2 × ID ÷ ( µCox × Vov² )'], ['Vov = √( 2 × ID ÷ ( µCox × W/L ) )'], ['gm = √( 2 × µCox × W/L × ID )  or  2 × ID ÷ Vov']],
    example: '√( 2 × 100µ ÷ ( 135µ × 200 ) ) = 0.08607  → VGS = 0.786 V',
  },
  {
    id: 'R4',
    title: 'Parallel resistances',
    when: 'rO ‖ rO, Rup ‖ Rdown, R1 ‖ R2.',
    steps: [['( a⁻¹ + b⁻¹ + c⁻¹ )⁻¹', '⁻¹ is [SHIFT] [^] on the CW (no separate x⁻¹ key)']],
    example: '0.25m × ( 10M⁻¹ + 80M⁻¹ )⁻¹ = 2222.2',
  },
  {
    id: 'R5',
    title: 'Store intermediate results',
    when: 'gm, rO, Vov you reuse in the next part (no retyping, no rounding).',
    steps: [['after a result: [VARIABLE] ▸ A ▸ Store', 'Ans goes into A'], ['use it: [VARIABLE] ▸ A ▸ Recall (or pick A in an expression)']],
  },
  {
    id: 'R6',
    title: 'Phase margin and crossover',
    when: 'Two poles + gain → PM; Miller PM; peaking.',
    steps: [
      ['PM = 180 − tan⁻¹(f/fp1) − tan⁻¹(f/fp2) − tan⁻¹(f/fz)', 'degree mode (R1)'],
      ['[HOME] ▸ Equation ▸ Solver:  A0 ÷ ( √(1+(x÷p1)²) × √(1+(x÷p2)²) ) = 1', 'gives the crossover x'],
      ['K = 1 ÷ ( 2 sin(PM ÷ 2) ),  PM = 2 sin⁻¹( 1 ÷ (2K) )', 'peaking ↔ PM'],
    ],
    example: '2 sin⁻¹( 1 ÷ 3 ) = 38.94',
  },
  {
    id: 'R7',
    title: 'Settling and slewing',
    when: 'Settling time, ωu needed, time to slew.',
    steps: [['t = ln(1 ÷ ε) ÷ ( β × ωu )'], ['ωu = ln(100) ÷ ( β × t )', 'ln 100 = 4.605, ln 1000 = 6.908'], ['Vout(t) = V0 × Acl × ( 1 − e^( −t ÷ τ ) )']],
    example: 'ln(100) ÷ ( 0.1 × 5n ) = 9.21G',
  },
  {
    id: 'R8',
    title: 'Quadratics (triode, degeneration, two-pole crossover)',
    when: 'Anything of the form ax² + bx + c = 0.',
    steps: [['[HOME] ▸ Equation ▸ Polynomial ▸ ax²+bx+c', 'type a, b, c; read both roots and keep the physical one']],
  },
  {
    id: 'R9',
    title: 'dB and back',
    when: 'Gain in dB, CMRR in dB, 80 dB → V/V.',
    steps: [['dB = 20 log(x)'], ['x = 10^( dB ÷ 20 )']],
    example: '10^(80 ÷ 20) = 10000',
  },
];

export function CalcView() {
  return (
    <div className="page calc-page">
      <h1>Your fx-991CW, for this course</h1>
      <p className="lede">
        Nine recipes cover every calculation in your tutorials and past papers. Do R1 once before the exam. Each solution in the app lists the exact keys under “On your fx-991CW”.
      </p>
      <div className="calc-grid">
        {RECIPES.map((r) => (
          <section key={r.id} className="calc-card" id={r.id}>
            <h2>
              <span className="calc-id">{r.id}</span> {r.title}
            </h2>
            <p className="small muted">{r.when}</p>
            <ol>
              {r.steps.map(([k, note], i) => (
                <li key={i}>
                  <code className="calc-keys">{k}</code>
                  {note && <span className="small muted"> — {note}</span>}
                </li>
              ))}
            </ol>
            {r.example && (
              <p className="small">
                <strong>Example:</strong> <code className="calc-keys">{r.example}</code>
              </p>
            )}
          </section>
        ))}
      </div>
      <p className="small muted">Key names follow Casio’s fx-570CW/fx-991CW user guide (Engineer Symbol, Calc Settings, Equation ▸ Solver / Polynomial).</p>
    </div>
  );
}
