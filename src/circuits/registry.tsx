/** Registry for FigureSpec (problems and lesson steps): a key → a parametric figure. */
import {
  ChannelCrossSection,
  CsSmallSignal,
  IdVdsFamily,
  MosBias,
  NmosRd,
  ParallelPair,
  PmosRd,
  ResStack,
  SmallSignalModel,
  TransferCurve,
  WaterAnalogy,
} from './figures';
import { BodePlot, DiffPairFig, FiveTOtaFig, HalfCircuitFig, StepPlot, SteeringPlot } from './figures3';
import { CmfbTriodeFig, FoldedCascodeFig, GainBoostFig, MirrorTeleFig, NonInvertingFig, TwoStageFig } from './figures4';
import { CapFeedbackFig, CmChoiceFig, FoldingStepsFig, TelescopicBiasFig, CapNonInvFig, CmfbTut5Q3Fig, FoldedCmfbFig, PmosFollowerFig, PmosPairRdFig, GainBoostFoldedFig, GainBoostPmosFig, TwoStageTeleFig } from './figures6';
import { BarkhausenFig, ClosedStepFig, KtcSpectrumFig, LoopBodeFig, MillerBlockFig, NoiseShareFig, ReplicaCmfbFig, TwoStageMillerFig } from './figures5';
import { CmosVtcFig, DynamicGateFig, EffortPathFig, FlopTimingFig, InverterFig, NoiseMarginFig, PassGateFig, RcLadderFig, SramCellFig, StaticGateFig, SwitchingFig, VtcPlot } from './figuresD';
import { CascodeFig, CommonGateFig, CsLoadFig, FollowerFig, ImpedanceFig, MirrorFig, TelescopicFig } from './figures2';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FIGURES: Record<string, (props: any) => React.ReactElement> = {
  water: WaterAnalogy,
  resStack: ResStack,
  parallelPair: ParallelPair,
  mosBias: MosBias,
  channel: ChannelCrossSection,
  idvds: IdVdsFamily,
  nmosRd: NmosRd,
  pmosRd: PmosRd,
  smallSignalModel: SmallSignalModel,
  csSmallSignal: CsSmallSignal,
  transfer: TransferCurve,
  impedance: ImpedanceFig,
  mirror: MirrorFig,
  csLoad: CsLoadFig,
  follower: FollowerFig,
  commonGate: CommonGateFig,
  cascode: CascodeFig,
  telescopic: TelescopicFig,
  diffPair: DiffPairFig,
  halfCircuit: HalfCircuitFig,
  fiveT: FiveTOtaFig,
  steering: SteeringPlot,
  bode: BodePlot,
  step: StepPlot,
  folded: FoldedCascodeFig,
  mirrorTele: MirrorTeleFig,
  twoStage: TwoStageFig,
  nonInverting: NonInvertingFig,
  gainBoost: GainBoostFig,
  cmfbTriode: CmfbTriodeFig,
  loopBode: LoopBodeFig,
  closedStep: ClosedStepFig,
  barkhausen: BarkhausenFig,
  millerBlock: MillerBlockFig,
  twoStageMiller: TwoStageMillerFig,
  replicaCmfb: ReplicaCmfbFig,
  noiseShare: NoiseShareFig,
  ktcSpectrum: KtcSpectrumFig,
  twoStageTele: TwoStageTeleFig,
  gainBoostPmos: GainBoostPmosFig,
  gainBoostFolded: GainBoostFoldedFig,
  foldedCmfb: FoldedCmfbFig,
  cmfbTut5Q3: CmfbTut5Q3Fig,
  telescopicBias: TelescopicBiasFig,
  cmChoice: CmChoiceFig,
  capFeedback: CapFeedbackFig,
  foldingSteps: FoldingStepsFig,
  pmosFollower: PmosFollowerFig,
  pmosPairRd: PmosPairRdFig,
  capNonInv: CapNonInvFig,
  inverter: InverterFig,
  vtc: VtcPlot,
  cmosVtc: CmosVtcFig,
  noiseMargin: NoiseMarginFig,
  switching: SwitchingFig,
  staticGate: StaticGateFig,
  rcLadder: RcLadderFig,
  effortPath: EffortPathFig,
  flopTiming: FlopTimingFig,
  dynamicGate: DynamicGateFig,
  passGate: PassGateFig,
  sramCell: SramCellFig,
};

export function Figure({ kind, props, highlight }: { kind: string; props?: Record<string, unknown>; highlight?: string[] }) {
  const C = FIGURES[kind];
  if (!C) return <p className="callout bad">Missing figure: {kind}</p>;
  return <C {...(props ?? {})} highlight={highlight} />;
}
