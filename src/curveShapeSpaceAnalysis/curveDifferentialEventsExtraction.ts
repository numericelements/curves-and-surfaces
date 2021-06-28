import { BSpline_R1_to_R1 } from "../bsplines/BSpline_R1_to_R1";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { BSpline_R1_to_R2_DifferentialProperties } from "../bsplines/BSpline_R1_to_R2_DifferentialProperties";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";

export class CurveDifferentialEventsExtractor {

    public sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    private curve: BSpline_R1_to_R2;
    private curvatureNumerator: BSpline_R1_to_R1;
    private curvatureDerivativeNumerator: BSpline_R1_to_R1;
    private curveDiffProperties: BSpline_R1_to_R2_DifferentialProperties;
    private inflectionLocations: number[] = [];
    private curvatureExtremaLocations: number[] = [];

    constructor(curveToAnalyze: BSpline_R1_to_R2) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSpline_R1_to_R2_DifferentialProperties(this.curve);
        this.curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this.curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
    }

    generateSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this.inflectionLocations = this.curvatureNumerator.zeros();
        this.curvatureExtremaLocations = this.curvatureDerivativeNumerator.zeros();
        this.sequenceOfDifferentialEvents.insertEvents(this.curvatureExtremaLocations, this.inflectionLocations);
        return this.sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: BSpline_R1_to_R2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSpline_R1_to_R2_DifferentialProperties(this.curve);
        this.curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this.curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.generateSeqOfDiffEvents();
    }
}