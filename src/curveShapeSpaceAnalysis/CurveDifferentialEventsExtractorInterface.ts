import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";

export interface CurveDifferentialEventsExtractorInterface {

    curvatureNumerator: BSplineR1toR1Interface;

    curvatureDerivativeNumerator: BSplineR1toR1Interface;

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents;
}