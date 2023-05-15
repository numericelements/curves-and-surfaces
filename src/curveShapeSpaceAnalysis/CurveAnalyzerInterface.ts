import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { ExtremumLocation } from "./ExtremumLocationClassifiier";

export interface CurveAnalyzerInterface {

    sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;

    curveCurvatureCntrlPolygon: number[];

    curvatureSignChanges: number[];

    curvatureNumerator: BSplineR1toR1Interface;

    curvatureDerivativeNumerator: BSplineR1toR1Interface;

    // globalExtremumOffAxisCurvaturePoly: ExtremumLocation;

    curvatureCrtlPtsClosestToZero: number[];

    curveCurvatureDerivativeCntrlPolygon: number[];

    curvatureDerivativeSignChanges:  number[];

    // globalExtremumOffAxisCurvatureDerivPoly: ExtremumLocation;

    curvatureDerivCrtlPtsClosestToZero: number[];

    computeCurvatureCPClosestToZero(): void;

    computeCurvatureDerivCPClosestToZero(): void;

    update(): void;
}