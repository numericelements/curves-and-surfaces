import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { IObserver } from "../newDesignPatterns/Observer";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { ClosedCurveDifferentialEventsExtractor } from "./ClosedCurveDifferentialEventsExtractor";

export class ClosedCurveDifferentialEventsExtractorWithoutSequence extends ClosedCurveDifferentialEventsExtractor 
                                                                        implements IObserver<BSplineR1toR2Interface> {

    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;

    constructor(curveToAnalyze: PeriodicBSplineR1toR2) {
        super(curveToAnalyze);
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        return this._sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: PeriodicBSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        // this.notifyObservers();
    }
}