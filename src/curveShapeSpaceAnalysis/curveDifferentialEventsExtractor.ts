import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";

export class CurveDifferentialEventsExtractor {

    public sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    private curve: BSplineR1toR2;
    private _curvatureNumerator: BSplineR1toR1;
    private _curvatureDerivativeNumerator: BSplineR1toR1;
    private curveDiffProperties: BSplineR1toR2DifferentialProperties;
    private inflectionLocations: number[] = [];
    private curvatureExtremaLocations: number[] = [];

    constructor(curveToAnalyze: BSplineR1toR2) {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
    }

    get curvatureNumerator(): BSplineR1toR1 {
        return this._curvatureNumerator;
    }

    get curvatureDerivativeNumerator(): BSplineR1toR1 {
        return this._curvatureDerivativeNumerator;
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this.inflectionLocations = this.curvatureNumerator.zeros();
        this.curvatureExtremaLocations = this.curvatureDerivativeNumerator.zeros();
        this.sequenceOfDifferentialEvents.insertEvents(this.curvatureExtremaLocations, this.inflectionLocations);
        return this.sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: BSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    }
}