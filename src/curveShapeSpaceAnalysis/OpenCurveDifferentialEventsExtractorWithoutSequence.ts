import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IObserver } from "../newDesignPatterns/Observer";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { OpenCurveDifferentialEventsExtractor } from "./OpenCurveDifferentialEventsExtractor";

export class OpenCurveDifferentialEventsExtractorWithoutSequence extends OpenCurveDifferentialEventsExtractor 
                                                                        implements IObserver<BSplineR1toR2Interface> {
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;

    constructor(curveToAnalyze: BSplineR1toR2) {
        super(curveToAnalyze);
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
        this.extractSeqOfDiffEvents();
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this._inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        return this._sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: BSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    }
}