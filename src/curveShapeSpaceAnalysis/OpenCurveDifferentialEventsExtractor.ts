import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IObserver } from "../newDesignPatterns/Observer";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { AbstractCurveDifferentialEventsExtractor } from "./AbstractCurveDifferentialEventsExtractor";

export class OpenCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor 
                                                    implements IObserver<BSplineR1toR2Interface> {

    protected curve: BSplineR1toR2;
    protected _curvatureNumerator: BSplineR1toR1;
    protected _curvatureDerivativeNumerator: BSplineR1toR1;
    protected curveDiffProperties: BSplineR1toR2DifferentialProperties;
    protected _inflectionParametricLocations: number[] = [];
    protected _curvatureExtremaParametricLocations: number[] = [];

    constructor(curveToAnalyze: BSplineR1toR2) {
        super(curveToAnalyze);
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }

    get curvatureNumerator(): BSplineR1toR1 {
        return this._curvatureNumerator;
    }

    get curvatureDerivativeNumerator(): BSplineR1toR1 {
        return this._curvatureDerivativeNumerator;
    }

    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }

    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: BSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
        this.notifyObservers();
    }

}