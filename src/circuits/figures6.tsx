/**
 * Tutorial circuits that had no figure yet: Razavi Fig 9.24 (Tutorial 3 Q3), the two gain-boosting circuits of
 * Tutorial 4 (Q2 PMOS auxiliary, Q3 folded-cascode auxiliary), and the CMFB circuits of Tutorial 5 (Q2 =
 * Razavi 9.12, Q3 with R = 10 MΩ sensing). Bias gates carry net labels (Vbp, Vbn, …) instead of long wires,
 * so the signal path stays readable. Colour code: NMOS purple, PMOS teal (from the primitives).
 */
import { Plot, type Series } from './Plot';
import { Capacitor, CurrentSource, Canvas, Dot, Ground, Label, Nmos, Pmos, Rail, Resistor, ResistorH, Terminal, Wire } from './primitives';

const NET = 'var(--ink-2)';

function Net({ x, y, text, anchor = 'end' }: { x: number; y: number; text: string; anchor?: 'start' | 'end' | 'middle' }) {
  return <Label x={x} y={y + 4} text={text} anchor={anchor} size={12} weight={600} color={NET} />;
}

/** Razavi Fig 9.24 (Tutorial 3 Q3): telescopic first stage (M1–M8), CS second stages M9–M12. */
export function TwoStageTeleFig({ highlight }: { highlight?: string[] }) {
  const xL = 240, xR = 400, x9 = 90, x10 = 550, xm = 320;
  const y7 = 70, y5 = 140, yXY = 190, y3 = 240, y1 = 310, yT = 355;
  const yO = 170, y11 = 250;
  return (
    <Canvas w={640} h={440} title="Two-stage op amp with a telescopic first stage (Razavi Fig 9.24)" highlight={highlight} maxWidth={720}>
      <Rail x1={50} x2={590} y={30} label="VDD" />
      {[xL, xR, x9, x10].map((x) => (
        <Wire key={x} points={[[x, 30], [x, (x === x9 || x === x10 ? 70 : y7) - 30]]} />
      ))}
      {/* first stage */}
      <Pmos x={xL} y={y7} name="M7" flip />
      <Pmos x={xR} y={y7} name="M8" />
      <Wire points={[[xL + 30, y7], [xR - 30, y7]]} />
      <Net x={xm} y={y7 - 14} text="Vb4" anchor="middle" />
      <Wire points={[[xL, y7 + 30], [xL, y5 - 30]]} />
      <Wire points={[[xR, y7 + 30], [xR, y5 - 30]]} />
      <Pmos x={xL} y={y5} name="M5" flip />
      <Pmos x={xR} y={y5} name="M6" />
      <Wire points={[[xL + 30, y5], [xR - 30, y5]]} />
      <Net x={xm} y={y5 - 14} text="Vb3" anchor="middle" />
      <Wire points={[[xL, y5 + 30], [xL, y3 - 30]]} id="x" />
      <Wire points={[[xR, y5 + 30], [xR, y3 - 30]]} id="x" />
      <Dot x={xL} y={yXY} id="x" />
      <Dot x={xR} y={yXY} id="x" />
      <Label x={xL + 10} y={yXY + 4} text="X" weight={700} />
      <Label x={xR - 10} y={yXY + 4} text="Y" anchor="end" weight={700} />
      <Nmos x={xL} y={y3} name="M3" flip />
      <Nmos x={xR} y={y3} name="M4" />
      <Wire points={[[xL + 30, y3], [xR - 30, y3]]} />
      <Net x={xm} y={y3 - 14} text="Vb2" anchor="middle" />
      <Wire points={[[xL, y3 + 30], [xL, y1 - 30]]} />
      <Wire points={[[xR, y3 + 30], [xR, y1 - 30]]} />
      <Nmos x={xL} y={y1} name="M1" />
      <Nmos x={xR} y={y1} name="M2" flip />
      <Wire points={[[xL - 30, y1], [xL - 44, y1]]} />
      <Terminal x={xL - 48} y={y1} />
      <Label x={xL - 56} y={y1 + 4} text="Vin1" anchor="end" weight={600} />
      <Wire points={[[xR + 30, y1], [xR + 44, y1]]} />
      <Terminal x={xR + 48} y={y1} />
      <Label x={xR + 56} y={y1 + 4} text="Vin2" weight={600} />
      <Wire points={[[xL, y1 + 30], [xL, yT], [xR, yT], [xR, y1 + 30]]} />
      <Dot x={xm} y={yT} />
      <CurrentSource x={xm} y1={yT} y2={yT + 56} label="ISS" />
      <Ground x={xm} y={yT + 56} />
      {/* second stages */}
      <Pmos x={x9} y={70} name="M9" flip />
      <Pmos x={x10} y={70} name="M10" />
      <Wire points={[[x9 + 30, 70], [150, 70], [150, yXY], [xL, yXY]]} id="x" />
      <Wire points={[[x10 - 30, 70], [490, 70], [490, yXY], [xR, yXY]]} id="x" />
      <Wire points={[[x9, 100], [x9, y11 - 30]]} id="out" />
      <Wire points={[[x10, 100], [x10, y11 - 30]]} id="out" />
      <Dot x={x9} y={yO} id="out" />
      <Dot x={x10} y={yO} id="out" />
      <Wire points={[[x9, yO], [50, yO]]} id="out" />
      <Terminal x={46} y={yO} />
      <Label x={46} y={yO - 12} text="Vout1" anchor="middle" weight={600} />
      <Wire points={[[x10, yO], [590, yO]]} id="out" />
      <Terminal x={594} y={yO} />
      <Label x={594} y={yO - 12} text="Vout2" anchor="middle" weight={600} />
      <Nmos x={x9} y={y11} name="M11" flip />
      <Nmos x={x10} y={y11} name="M12" />
      <Wire points={[[x9 + 30, y11], [x9 + 36, y11]]} />
      <Net x={x9 + 40} y={y11} text="Vb1" anchor="start" />
      <Wire points={[[x10 - 30, y11], [x10 - 36, y11]]} />
      <Net x={x10 - 40} y={y11} text="Vb1" />
      <Ground x={x9} y={y11 + 30} />
      <Ground x={x10} y={y11 + 30} />
    </Canvas>
  );
}

/** Tutorial 4 Q2: cascode M1–M2 with PMOS source M5; auxiliary PMOS CS M3 (gate at VP, source at VS) loaded by M4. */
export function GainBoostPmosFig({ highlight }: { highlight?: string[] }) {
  const xm = 340, xa = 190;
  const y5 = 80, yO = 125, y2 = 180, yP = 225, y1 = 270;
  const y3 = 150, y4 = 240;
  return (
    <Canvas w={470} h={330} title="Gain boosting with a PMOS auxiliary: M3 senses VP and drives M2’s gate" highlight={highlight} maxWidth={600}>
      <Rail x1={xm - 40} x2={xm + 40} y={30} label="VDD" />
      <Wire points={[[xm, 30], [xm, y5 - 30]]} />
      <Pmos x={xm} y={y5} name="M5" flip />
      <Wire points={[[xm + 30, y5], [xm + 36, y5]]} />
      <Net x={xm + 40} y={y5} text="Vbp" anchor="start" />
      <Wire points={[[xm, y5 + 30], [xm, y2 - 30]]} id="out" />
      <Dot x={xm} y={yO} id="out" />
      <Wire points={[[xm, yO], [430, yO]]} id="out" />
      <Terminal x={434} y={yO} />
      <Label x={434} y={yO - 12} text="Vout" anchor="middle" weight={600} />
      <Nmos x={xm} y={y2} name="M2" />
      <Wire points={[[xm, y2 + 30], [xm, y1 - 30]]} id="p" />
      <Dot x={xm} y={yP} id="p" />
      <Label x={xm + 10} y={yP + 4} text="VP" weight={700} />
      <Nmos x={xm} y={y1} name="M1" />
      <Wire points={[[xm - 30, y1], [xm - 44, y1]]} />
      <Terminal x={xm - 48} y={y1} />
      <Label x={xm - 56} y={y1 + 4} text="Vin" anchor="end" weight={600} />
      <Ground x={xm} y={y1 + 30} />
      {/* auxiliary */}
      <Terminal x={xa} y={y3 - 44} />
      <Wire points={[[xa, y3 - 40], [xa, y3 - 30]]} />
      <Label x={xa} y={y3 - 54} text="VS" anchor="middle" weight={600} />
      <Pmos x={xa} y={y3} name="M3" flip />
      <Wire points={[[xa + 30, y3], [260, y3], [260, yP], [xm, yP]]} id="p" />
      <Wire points={[[xa, y3 + 30], [xa, y4 - 30]]} id="g2" />
      <Dot x={xa} y={y2} id="g2" />
      <Wire points={[[xa, y2], [xm - 30, y2]]} id="g2" />
      <Nmos x={xa} y={y4} name="M4" />
      <Wire points={[[xa - 30, y4], [xa - 36, y4]]} />
      <Net x={xa - 40} y={y4} text="Vbn" />
      <Ground x={xa} y={y4 + 30} />
    </Canvas>
  );
}

/**
 * Tutorial 4 Q3: cascode M1–M2 with PMOS source M6; the auxiliary is a folded cascode (PMOS input M3 on R3,
 * NMOS cascode M4, loads M5 and M9) driving M2’s gate; bias string M8–R1–R2–M7.
 */
export function GainBoostFoldedFig({ highlight }: { highlight?: string[] }) {
  const xb = 100, x3 = 250, xa = 380, xm = 530;
  const yTop = 80, yO = 125, yMid = 170, yF = 215, yBot = 260;
  return (
    <Canvas w={640} h={330} title="Gain boosting with a folded-cascode auxiliary (M3, M4, M5, M9) driving M2’s gate" highlight={highlight} maxWidth={760}>
      <Rail x1={60} x2={590} y={30} label="VDD" />
      {/* bias string */}
      <Wire points={[[xb, 30], [xb, yTop - 30]]} />
      <Pmos x={xb} y={yTop} name="M8" diode />
      <Net x={xb - 36} y={yTop} text="Vbp" />
      <Resistor x={xb} y1={yTop + 30} y2={yMid} label="R1" />
      <Dot x={xb} y={yMid} />
      <Wire points={[[xb, yMid], [xb - 12, yMid]]} />
      <Net x={xb - 16} y={yMid} text="Vb4" />
      <Resistor x={xb} y1={yMid} y2={yBot - 30} label="R2" />
      <Nmos x={xb} y={yBot} name="M7" diode />
      <Net x={xb - 36} y={yBot} text="Vbn" />
      <Ground x={xb} y={yBot + 30} />
      {/* M3 on R3 */}
      <Resistor x={x3} y1={30} y2={yMid - 30} label="R3" />
      <Pmos x={x3} y={yMid} name="M3" />
      <Wire points={[[x3 - 30, yMid], [x3 - 36, yMid]]} />
      <Net x={x3 - 40} y={yMid} text="VP" />
      <Wire points={[[x3, yMid + 30], [x3, yF], [xa, yF]]} id="f" />
      {/* folded auxiliary */}
      <Wire points={[[xa, 30], [xa, yTop - 30]]} />
      <Pmos x={xa} y={yTop} name="M5" />
      <Net x={xa - 36} y={yTop} text="Vbp" />
      <Wire points={[[xa, yTop + 30], [xa, yMid - 30]]} id="g2" />
      <Dot x={xa} y={yO} id="g2" />
      <Wire points={[[xa, yO], [460, yO], [460, yMid], [xm - 30, yMid]]} id="g2" />
      <Nmos x={xa} y={yMid} name="M4" />
      <Net x={xa - 36} y={yMid} text="Vb4" />
      <Wire points={[[xa, yMid + 30], [xa, yBot - 30]]} id="f" />
      <Dot x={xa} y={yF} id="f" />
      <Nmos x={xa} y={yBot} name="M9" />
      <Net x={xa - 36} y={yBot} text="Vbn" />
      <Ground x={xa} y={yBot + 30} />
      {/* main cascode */}
      <Wire points={[[xm, 30], [xm, yTop - 30]]} />
      <Pmos x={xm} y={yTop} name="M6" />
      <Net x={xm - 36} y={yTop} text="Vbp" />
      <Wire points={[[xm, yTop + 30], [xm, yMid - 30]]} id="out" />
      <Dot x={xm} y={yO} id="out" />
      <Wire points={[[xm, yO], [596, yO]]} id="out" />
      <Terminal x={600} y={yO} />
      <Label x={600} y={yO - 12} text="Vout" anchor="middle" weight={600} />
      <Nmos x={xm} y={yMid} name="M2" />
      <Wire points={[[xm, yMid + 30], [xm, yBot - 30]]} id="p" />
      <Dot x={xm} y={yF} id="p" />
      <Label x={xm + 10} y={yF + 4} text="VP" weight={700} />
      <Nmos x={xm} y={yBot} name="M1" flip />
      <Wire points={[[xm + 30, yBot], [xm + 44, yBot]]} />
      <Terminal x={xm + 48} y={yBot} />
      <Label x={xm + 48} y={yBot - 12} text="Vin" anchor="middle" weight={600} />
      <Ground x={xm} y={yBot + 30} />
    </Canvas>
  );
}

/**
 * Tutorial 5 Q2 (Razavi 9.12): NMOS-input folded cascode; R1, R2 sense Vout,CM; an error amplifier compares it
 * with VREF and drives the bottom current sources M3, M4 (VE). The input pair's drains fold into A and B.
 */
export function FoldedCmfbFig({ highlight }: { highlight?: string[] }) {
  const xL = 300, xR = 460, xm = 380;
  const yS = 70, yA = 110, yPc = 150, yO = 200, yNc = 250, yB = 320;
  return (
    <Canvas w={720} h={400} title="Folded cascode with resistive CM sensing: the error amplifier drives M3, M4 through VE" highlight={highlight} maxWidth={760}>
      <Rail x1={40} x2={640} y={30} label="VDD" />
      {/* input pair */}
      <Nmos x={90} y={200} name="M1" />
      <Nmos x={190} y={200} name="M2" flip />
      <Wire points={[[60, 200], [50, 200]]} />
      <Terminal x={46} y={200} />
      <Label x={46} y={186} text="Vin1" anchor="middle" weight={600} />
      <Wire points={[[220, 200], [230, 200]]} />
      <Terminal x={234} y={200} />
      <Label x={234} y={186} text="Vin2" anchor="middle" weight={600} />
      <Wire points={[[90, 170], [90, 150]]} />
      <Net x={90} y={140} text="to A" anchor="middle" />
      <Wire points={[[190, 170], [190, 150]]} />
      <Net x={190} y={140} text="to B" anchor="middle" />
      <Wire points={[[90, 230], [90, 250], [190, 250], [190, 230]]} />
      <Dot x={140} y={250} />
      <CurrentSource x={140} y1={250} y2={306} label="ISS" />
      <Ground x={140} y={306} />
      {/* folded cascode */}
      <Wire points={[[xL, 30], [xL, yS - 30]]} />
      <Wire points={[[xR, 30], [xR, yS - 30]]} />
      <Pmos x={xL} y={yS} flip />
      <Pmos x={xR} y={yS} />
      <Wire points={[[xL + 30, yS], [xR - 30, yS]]} />
      <Net x={xm} y={yS - 12} text="Vb1" anchor="middle" />
      <Wire points={[[xL, yS + 30], [xL, yPc - 30]]} />
      <Wire points={[[xR, yS + 30], [xR, yPc - 30]]} />
      <Dot x={xL} y={yA} />
      <Dot x={xR} y={yA} />
      <Wire points={[[xL, yA], [xL - 16, yA]]} />
      <Net x={xL - 20} y={yA} text="A" />
      <Wire points={[[xR, yA], [xR + 16, yA]]} />
      <Net x={xR + 20} y={yA} text="B" anchor="start" />
      <Pmos x={xL} y={yPc} flip />
      <Pmos x={xR} y={yPc} />
      <Wire points={[[xL + 30, yPc], [xR - 30, yPc]]} />
      <Net x={xm} y={yPc - 12} text="Vb2" anchor="middle" />
      <Wire points={[[xL, yPc + 30], [xL, yNc - 30]]} id="out" />
      <Wire points={[[xR, yPc + 30], [xR, yNc - 30]]} id="out" />
      <Dot x={xL} y={yO} id="out" />
      <Dot x={xR} y={yO} id="out" />
      <Label x={xL - 10} y={yO - 8} text="Vout1" anchor="end" weight={600} />
      <Label x={xR + 10} y={yO - 8} text="Vout2" weight={600} />
      <ResistorH x1={xL} x2={xm} y={yO} label="R1" />
      <ResistorH x1={xm} x2={xR} y={yO} label="R2" />
      <Dot x={xm} y={yO} id="cm" />
      <Net x={xm} y={yO + 20} text="Vout,CM" anchor="middle" />
      <Nmos x={xL} y={yNc} flip />
      <Nmos x={xR} y={yNc} />
      <Wire points={[[xL + 30, yNc], [xL + 40, yNc]]} />
      <Wire points={[[xR - 30, yNc], [xR - 40, yNc]]} />
      <Net x={xm} y={yNc} text="Vb3" anchor="middle" />
      <Wire points={[[xL, yNc + 30], [xL, yB - 30]]} />
      <Wire points={[[xR, yNc + 30], [xR, yB - 30]]} />
      <Nmos x={xL} y={yB} name="M3" flip />
      <Nmos x={xR} y={yB} name="M4" />
      <Wire points={[[xL + 30, yB], [xR - 30, yB]]} id="ve" />
      <Net x={xm} y={yB - 12} text="VE" anchor="middle" />
      <Ground x={xL} y={yB + 30} />
      <Ground x={xR} y={yB + 30} />
      {/* error amplifier */}
      <path d="M 590 250 L 590 310 L 650 280 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
      <Label x={597} y={268} text="+" size={14} weight={700} />
      <Label x={597} y={300} text="−" size={14} weight={700} />
      <Wire points={[[590, 264], [576, 264]]} />
      <Net x={572} y={258} text="Vout,CM" />
      <Wire points={[[590, 296], [576, 296]]} />
      <Net x={572} y={302} text="VREF" />
      <Wire points={[[650, 280], [666, 280]]} id="ve" />
      <Net x={670} y={280} text="VE" anchor="start" />
    </Canvas>
  );
}

/**
 * Tutorial 5 Q3: NMOS pair M1, M2 with PMOS sources M3, M4 (mirrored from M6, I1) and tail M5; R, R sense VO,CM.
 * Error amplifier: PMOS pair M7 (VREF), M8 (VO,CM), tail M11 (mirrored from M12, I2), diode loads M9, M10;
 * M9's gate drives M5.
 */
export function CmfbTut5Q3Fig({ highlight }: { highlight?: string[] }) {
  const x6 = 80, xL = 200, xR = 360, xT = 280;
  const x12 = 490, x7 = 590, x8 = 690, x11 = 640;
  return (
    <Canvas w={790} h={350} title="CMFB with resistive sensing and a PMOS-input error amplifier (M7–M12) that sets the tail M5" highlight={highlight} maxWidth={860}>
      <Rail x1={50} x2={730} y={30} label="VDD" />
      {/* main amplifier */}
      <Wire points={[[x6, 30], [x6, 50]]} />
      <Pmos x={x6} y={80} name="M6" diode flip />
      <Wire points={[[x6 + 30, 80], [xL - 30, 80]]} />
      <Net x={(x6 + xL) / 2} y={66} text="Vbp" anchor="middle" />
      <Wire points={[[x6, 110], [x6, 120]]} />
      <CurrentSource x={x6} y1={120} y2={176} label="I1" />
      <Ground x={x6} y={176} />
      <Wire points={[[xL, 30], [xL, 50]]} />
      <Wire points={[[xR, 30], [xR, 50]]} />
      <Pmos x={xL} y={80} name="M3" />
      <Pmos x={xR} y={80} name="M4" flip />
      <Wire points={[[xR + 30, 80], [xR + 34, 80]]} />
      <Net x={xR + 36} y={80} text="Vbp" anchor="start" />
      <Wire points={[[xL, 110], [xL, 170]]} id="out" />
      <Wire points={[[xR, 110], [xR, 170]]} id="out" />
      <Dot x={xL} y={135} id="out" />
      <Dot x={xR} y={135} id="out" />
      <ResistorH x1={xL} x2={xT} y={135} label="R" />
      <ResistorH x1={xT} x2={xR} y={135} label="R" />
      <Dot x={xT} y={135} id="cm" />
      <Net x={xT} y={156} text="VO,CM" anchor="middle" />
      <Nmos x={xL} y={200} name="M1" />
      <Wire points={[[xL - 30, 200], [xL - 44, 200]]} />
      <Terminal x={xL - 48} y={200} />
      <Label x={xL - 56} y={204} text="Vin1" anchor="end" weight={600} />
      <Nmos x={xR} y={200} name="M2" flip />
      <Wire points={[[xR + 30, 200], [xR + 44, 200]]} />
      <Terminal x={xR + 48} y={200} />
      <Label x={xR + 48} y={186} text="Vin2" anchor="middle" weight={600} />
      <Wire points={[[xL, 230], [xL, 245], [xR, 245], [xR, 230]]} />
      <Dot x={xT} y={245} />
      <Wire points={[[xT, 245], [xT, 260]]} />
      <Nmos x={xT} y={290} name="M5" flip />
      <Ground x={xT} y={320} />
      <Wire points={[[xT + 30, 290], [x7 - 50, 290], [x7 - 50, 250], [x7 - 30, 250]]} id="cmfb" />
      {/* error amplifier */}
      <Wire points={[[x12, 30], [x12, 50]]} />
      <Pmos x={x12} y={80} name="M12" diode flip />
      <Wire points={[[x12 + 30, 80], [x11 - 30, 80]]} />
      <Wire points={[[x12, 110], [x12, 120]]} />
      <CurrentSource x={x12} y1={120} y2={176} label="I2" labelSide="left" />
      <Ground x={x12} y={176} />
      <Wire points={[[x11, 30], [x11, 50]]} />
      <Pmos x={x11} y={80} name="M11" />
      <Wire points={[[x11, 110], [x11, 125], [x7, 125], [x7, 140]]} />
      <Wire points={[[x11, 125], [x8, 125], [x8, 140]]} />
      <Dot x={x11} y={125} />
      <Pmos x={x7} y={170} name="M7" />
      <Wire points={[[x7 - 30, 170], [x7 - 40, 170]]} />
      <Terminal x={x7 - 44} y={170} />
      <Label x={x7 - 44} y={156} text="VREF" anchor="middle" weight={600} />
      <Pmos x={x8} y={170} name="M8" flip />
      <Wire points={[[x8 + 30, 170], [x8 + 40, 170]]} />
      <Terminal x={x8 + 44} y={170} />
      <Label x={x8 + 44} y={156} text="VO,CM" anchor="middle" weight={600} />
      <Wire points={[[x7, 200], [x7, 220]]} id="cmfb" />
      <Wire points={[[x8, 200], [x8, 220]]} />
      <Nmos x={x7} y={250} name="M9" diode />
      <Nmos x={x8} y={250} name="M10" diode flip />
      <Ground x={x7} y={280} />
      <Ground x={x8} y={280} />
    </Canvas>
  );
}

/** Lab 4: PMOS source follower. The bias source pushes current up into the source; the output is the source. */
export function PmosFollowerFig({ highlight }: { highlight?: string[] }) {
  const x = 200;
  return (
    <Canvas w={380} h={260} title="PMOS source follower: input on the gate, output on the source (about |VGS| above the input)" highlight={highlight} maxWidth={480}>
      <Rail x1={x - 40} x2={x + 40} y={30} label="VDD" />
      <CurrentSource x={x} y1={30} y2={100} label="I" />
      <Wire points={[[x, 100], [x, 130]]} id="out" />
      <Dot x={x} y={115} id="out" />
      <Wire points={[[x, 115], [300, 115]]} id="out" />
      <Terminal x={304} y={115} />
      <Label x={304} y={103} text="Vout" anchor="middle" weight={600} />
      <Wire points={[[270, 115], [270, 150]]} />
      <Capacitor x={270} y1={150} y2={200} label="CL" />
      <Ground x={270} y={200} />
      <Pmos x={x} y={160} name="M1" />
      <Wire points={[[x - 30, 160], [x - 70, 160]]} />
      <Terminal x={x - 74} y={160} />
      <Label x={x - 82} y={164} text="Vin" anchor="end" weight={600} />
      <Ground x={x} y={190} />
    </Canvas>
  );
}

/** Lab 6: PMOS-input differential pair with resistor loads to ground. */
export function PmosPairRdFig({ highlight }: { highlight?: string[] }) {
  const xL = 150, xR = 290, xm = 220;
  return (
    <Canvas w={440} h={300} title="PMOS-input pair with resistor loads: the tail pushes ISS down into the pair" highlight={highlight} maxWidth={560}>
      <Rail x1={xm - 40} x2={xm + 40} y={30} label="VDD" />
      <CurrentSource x={xm} y1={30} y2={90} label="ISS" />
      <Wire points={[[xm, 90], [xm, 100]]} />
      <Dot x={xm} y={100} />
      <Wire points={[[xL, 110], [xL, 100], [xR, 100], [xR, 110]]} />
      <Pmos x={xL} y={140} name="M1" />
      <Pmos x={xR} y={140} name="M2" flip />
      <Wire points={[[xL - 30, 140], [xL - 44, 140]]} />
      <Terminal x={xL - 48} y={140} />
      <Label x={xL - 56} y={144} text="Vin1" anchor="end" weight={600} />
      <Wire points={[[xR + 30, 140], [xR + 44, 140]]} />
      <Terminal x={xR + 48} y={140} />
      <Label x={xR + 56} y={144} text="Vin2" weight={600} />
      <Dot x={xL} y={185} id="out" />
      <Dot x={xR} y={185} id="out" />
      <Wire points={[[xL, 170], [xL, 200]]} id="out" />
      <Wire points={[[xR, 170], [xR, 200]]} id="out" />
      <Label x={xL - 10} y={181} text="Vout1" anchor="end" weight={600} />
      <Label x={xR + 10} y={181} text="Vout2" weight={600} />
      <Resistor x={xL} y1={200} y2={260} label="RD" labelSide="left" />
      <Resistor x={xR} y1={200} y2={260} label="RD" />
      <Ground x={xL} y={260} />
      <Ground x={xR} y={260} />
    </Canvas>
  );
}

/** Lab 8: capacitive non-inverting amplifier, CIN from the inverting input to ground and CF to the output. */
export function CapNonInvFig({ highlight }: { highlight?: string[] }) {
  return (
    <Canvas w={440} h={250} title="Capacitive non-inverting amplifier: ideal gain 1 + CIN/CF, β = CF/(CF + CIN)" highlight={highlight} maxWidth={560}>
      <path d="M 180 70 L 180 150 L 260 110 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
      <Label x={188} y={92} text="+" size={14} weight={700} />
      <Label x={188} y={138} text="−" size={14} weight={700} />
      <Wire points={[[180, 86], [110, 86]]} />
      <Terminal x={106} y={86} />
      <Label x={98} y={90} text="Vin" anchor="end" weight={600} />
      <Wire points={[[260, 110], [360, 110]]} id="out" />
      <Dot x={320} y={110} id="out" />
      <Terminal x={364} y={110} />
      <Label x={364} y={98} text="Vout" anchor="middle" weight={600} />
      <Wire points={[[180, 134], [150, 134], [150, 190]]} id="fb" />
      <Dot x={150} y={190} id="fb" />
      <Wire points={[[150, 190], [150, 200]]} id="fb" />
      <Capacitor x={150} y1={200} y2={236} label="CIN" />
      <Ground x={150} y={236} />
      <Wire points={[[150, 190], [230, 190]]} id="fb" />
      <line x1={234} x2={234} y1={176} y2={204} stroke="var(--ink)" strokeWidth={3} />
      <line x1={242} x2={242} y1={176} y2={204} stroke="var(--ink)" strokeWidth={3} />
      <Label x={238} y={170} text="CF" anchor="middle" weight={600} />
      <Wire points={[[246, 190], [320, 190], [320, 110]]} id="fb" />
    </Canvas>
  );
}

/**
 * Lecture 4 / Razavi Fig 9.11: the telescopic op amp with its bias branch. Ib1 flows through the diodes Mb1
 * (sets the gates of M7, M8) and Mb2 (sets Vb2 for M5, M6); Ib2 through the diode Mb3 sets the tail M9.
 */
export function TelescopicBiasFig({ highlight }: { highlight?: string[] }) {
  const xb = 90, xL = 300, xR = 440, xm = 370, x9b = 530;
  const y7 = 70, y5 = 140, yO = 190, y3 = 240, y1 = 310, yT = 355, y9 = 385;
  return (
    <Canvas w={620} h={450} title="Telescopic op amp with its bias branch: Ib1 through Mb1, Mb2 sets the PMOS gates; Ib2 through Mb3 sets the tail" highlight={highlight} maxWidth={680}>
      <Rail x1={50} x2={540} y={30} label="VDD" />
      {/* bias branch */}
      <Wire points={[[xb, 30], [xb, y7 - 30]]} />
      <Pmos x={xb} y={y7} name="Mb1" diode flip />
      <Wire points={[[xb + 30, y7], [xL - 30, y7]]} />
      <Wire points={[[xb, y7 + 30], [xb, y5 - 30]]} />
      <Pmos x={xb} y={y5} name="Mb2" diode flip />
      <Wire points={[[xb + 30, y5], [xL - 30, y5]]} />
      <Wire points={[[xb, y5 + 30], [xb, 200]]} />
      <CurrentSource x={xb} y1={200} y2={256} label="Ib1" labelSide="left" />
      <Ground x={xb} y={256} />
      <Wire points={[[x9b, 30], [x9b, 300]]} />
      <CurrentSource x={x9b} y1={300} y2={y9 - 30} label="Ib2" />
      <Nmos x={x9b} y={y9} name="Mb3" diode />
      <Wire points={[[x9b - 30, y9], [xm + 30, y9]]} />
      <Ground x={x9b} y={y9 + 30} />
      {/* main amplifier */}
      <Wire points={[[xL, 30], [xL, y7 - 30]]} />
      <Wire points={[[xR, 30], [xR, y7 - 30]]} />
      <Pmos x={xL} y={y7} name="M7" flip />
      <Pmos x={xR} y={y7} name="M8" />
      <Wire points={[[xL + 30, y7], [xR - 30, y7]]} />
      <Wire points={[[xL, y7 + 30], [xL, y5 - 30]]} />
      <Wire points={[[xR, y7 + 30], [xR, y5 - 30]]} />
      <Pmos x={xL} y={y5} name="M5" flip />
      <Pmos x={xR} y={y5} name="M6" />
      <Wire points={[[xL + 30, y5], [xR - 30, y5]]} />
      <Wire points={[[xL, y5 + 30], [xL, y3 - 30]]} id="out" />
      <Wire points={[[xR, y5 + 30], [xR, y3 - 30]]} id="out" />
      <Dot x={xL} y={yO} id="out" />
      <Dot x={xR} y={yO} id="out" />
      <Label x={xL + 10} y={yO - 6} text="Vout1" weight={600} />
      <Label x={xR - 10} y={yO - 6} text="Vout2" anchor="end" weight={600} />
      <Nmos x={xL} y={y3} name="M3" flip />
      <Nmos x={xR} y={y3} name="M4" />
      <Wire points={[[xL + 30, y3], [xR - 30, y3]]} />
      <Net x={xm} y={y3 - 12} text="Vb1" anchor="middle" />
      <Wire points={[[xL, y3 + 30], [xL, y1 - 30]]} />
      <Wire points={[[xR, y3 + 30], [xR, y1 - 30]]} />
      <Nmos x={xL} y={y1} name="M1" />
      <Nmos x={xR} y={y1} name="M2" flip />
      <Wire points={[[xL - 30, y1], [xL - 44, y1]]} />
      <Terminal x={xL - 48} y={y1} />
      <Label x={xL - 48} y={y1 - 12} text="Vin1" anchor="middle" weight={600} />
      <Wire points={[[xR + 30, y1], [xR + 44, y1]]} />
      <Terminal x={xR + 48} y={y1} />
      <Label x={xR + 48} y={y1 - 12} text="Vin2" anchor="middle" weight={600} />
      <Wire points={[[xL, y1 + 30], [xL, yT - 10], [xR, yT - 10], [xR, y1 + 30]]} />
      <Dot x={xm} y={yT - 10} />
      <Wire points={[[xm, yT - 10], [xm, y9 - 30]]} />
      <Nmos x={xm} y={y9} name="M9" flip />
      <Ground x={xm} y={y9 + 30} />
    </Canvas>
  );
}

/**
 * Razavi Fig 9.10(c, d) / Lec 5: the drain voltage VX of a telescopic in closed loop swings around VCM. It must stay
 * above Vb − Vth3,4 (M3, M4) and, at DC, below Vb − (VGS3,4 − Vth1,2) (M1, M2). A VCM at the top edge leaves the
 * most room to fall; a VCM at the bottom edge leaves none.
 */
export function CmChoiceFig({ vb, vth, vov, vcm, amp }: { vb: number; vth: number; vov: number; vcm: number; amp: number }) {
  const top = vb - vov; // Vb − (VGS − Vth) with equal thresholds
  const floor = vb - vth;
  const lo = floor - 0.35, hi = vb + 0.15;
  const wave: Array<[number, number]> = [];
  for (let k = 0; k <= 200; k++) {
    const t = (k / 200) * 2;
    wave.push([t, Math.max(lo, Math.min(hi, vcm + amp * Math.sin(2 * Math.PI * t)))]);
  }
  const clips = vcm - amp < floor - 1e-9 || vcm > top + 1e-9;
  const series: Series[] = [
    { points: [[0, vb], [2, vb]], color: 'var(--muted)', width: 1.2, dashed: true, label: 'Vb', labelAt: 'end' },
    { points: [[0, top], [2, top]], color: 'var(--nmos)', width: 1.6, dashed: true, label: 'Vb − (VGS − Vth)', labelAt: 'end' },
    { points: [[0, floor], [2, floor]], color: 'var(--bad)', width: 1.6, dashed: true, label: 'Vb − Vth', labelAt: 'end' },
    { points: wave, color: clips ? 'var(--bad)' : 'var(--signal)', width: 2.6 },
  ];
  return (
    <Plot
      title="Drain voltage VX of a telescopic in closed loop: where to put VCM"
      xRange={[0, 2]}
      yRange={[lo, hi]}
      xLabel="time (cycles)"
      yLabel="VX (V)"
      xTicks={[0, 1, 2]}
      yFmt={(v) => v.toFixed(1)}
      series={series}
    />
  );
}

/** Lec 5 / Razavi Fig 9.10(a): a fully differential op amp closed through C1–R1–R2 and C2–R3–R4. */
export function CapFeedbackFig({ highlight }: { highlight?: string[] }) {
  return (
    <Canvas w={480} h={250} title="Closed loop through input capacitors: the input CM becomes the output CM" highlight={highlight} maxWidth={600}>
      <path d="M 200 70 L 200 180 L 290 125 Z" fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
      <Label x={207} y={98} text="−" size={14} weight={700} />
      <Label x={207} y={160} text="+" size={14} weight={700} />
      <Label x={262} y={110} text="+" size={12} weight={700} />
      <Label x={262} y={148} text="−" size={12} weight={700} />
      <Wire points={[[40, 94], [60, 94]]} />
      <line x1={64} x2={64} y1={82} y2={106} stroke="var(--ink)" strokeWidth={3} />
      <line x1={72} x2={72} y1={82} y2={106} stroke="var(--ink)" strokeWidth={3} />
      <Label x={68} y={76} text="C1" anchor="middle" weight={600} />
      <ResistorH x1={76} x2={150} y={94} label="R1" />
      <Wire points={[[150, 94], [200, 94]]} />
      <Dot x={170} y={94} />
      <Wire points={[[170, 94], [170, 40]]} />
      <ResistorH x1={170} x2={320} y={40} label="R2" />
      <Wire points={[[320, 40], [320, 112], [284, 112]]} id="out" />
      <Wire points={[[40, 156], [60, 156]]} />
      <line x1={64} x2={64} y1={144} y2={168} stroke="var(--ink)" strokeWidth={3} />
      <line x1={72} x2={72} y1={144} y2={168} stroke="var(--ink)" strokeWidth={3} />
      <Label x={68} y={186} text="C2" anchor="middle" weight={600} />
      <ResistorH x1={76} x2={150} y={156} label="R3" />
      <Wire points={[[150, 156], [200, 156]]} />
      <Dot x={170} y={156} />
      <Wire points={[[170, 156], [170, 212]]} />
      <ResistorH x1={170} x2={340} y={212} label="R4" />
      <Wire points={[[340, 212], [340, 138], [284, 138]]} id="out" />
      <Wire points={[[320, 112], [380, 112]]} id="out" />
      <Wire points={[[340, 138], [380, 138]]} id="out" />
      <Terminal x={384} y={112} />
      <Terminal x={384} y={138} />
      <Label x={392} y={116} text="Vout1" weight={600} />
      <Label x={392} y={142} text="Vout2" weight={600} />
      <Label x={36} y={98} text="Vin1" anchor="end" weight={600} />
      <Label x={36} y={160} text="Vin2" anchor="end" weight={600} />
    </Canvas>
  );
}

/**
 * Lec 5: folding a cascode. Left: an NMOS cascode (M1 under M2, fed by I1). Right: the input device turned into a
 * PMOS that injects its current into M2's source, which now needs its own current source I2 to ground.
 */
export function FoldingStepsFig({ highlight }: { highlight?: string[] }) {
  return (
    <Canvas w={520} h={290} title="Folding: move the input device from under the cascode to beside it" highlight={highlight} maxWidth={640}>
      <Label x={110} y={24} text="cascode" anchor="middle" weight={700} color="var(--ink-2)" />
      <Label x={370} y={24} text="folded cascode" anchor="middle" weight={700} color="var(--ink-2)" />
      {/* left: NMOS cascode */}
      <Wire points={[[70, 36], [150, 36]]} />
      <Label x={154} y={40} text="VDD" size={11} weight={600} />
      <CurrentSource x={110} y1={36} y2={96} label="I1" />
      <Wire points={[[110, 96], [110, 120]]} id="out" />
      <Dot x={110} y={108} id="out" />
      <Wire points={[[110, 108], [160, 108]]} id="out" />
      <Label x={164} y={112} text="Vout" size={12} weight={600} />
      <Nmos x={110} y={150} name="M2" />
      <Net x={76} y={150} text="Vb" />
      <Wire points={[[110, 180], [110, 200]]} />
      <Nmos x={110} y={230} name="M1" />
      <Net x={76} y={230} text="Vin" />
      <Ground x={110} y={260} />
      {/* arrow */}
      <line x1={200} x2={244} y1={150} y2={150} stroke="var(--signal)" strokeWidth={3} />
      <polygon points="256,150 242,142 242,158" fill="var(--signal)" />
      {/* right: folded */}
      <Wire points={[[300, 36], [470, 36]]} />
      <Label x={474} y={40} text="VDD" size={11} weight={600} />
      <CurrentSource x={330} y1={36} y2={96} label="I1" labelSide="left" />
      <Wire points={[[330, 96], [330, 120]]} id="out" />
      <Dot x={330} y={108} id="out" />
      <Wire points={[[330, 108], [300, 108]]} id="out" />
      <Label x={296} y={112} text="Vout" anchor="end" size={12} weight={600} />
      <Nmos x={330} y={150} name="M2" />
      <Net x={296} y={150} text="Vb" />
      <Wire points={[[330, 180], [330, 200]]} />
      <Dot x={330} y={200} />
      <Wire points={[[330, 200], [430, 200], [430, 180]]} />
      <Wire points={[[430, 36], [430, 120]]} />
      <Pmos x={430} y={150} name="M1" flip />
      <Net x={466} y={150} text="Vin" anchor="start" />
      <CurrentSource x={330} y1={200} y2={256} label="I2" labelSide="left" />
      <Ground x={330} y={256} />
    </Canvas>
  );
}
