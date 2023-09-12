import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IObserver } from "../newDesignPatterns/Observer";
import { LOWER_BOUND_CURVE_INTERVAL, UPPER_BOUND_CURVE_INTERVAL } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { AbstractCurveDifferentialEventsExtractor } from "./AbstractCurveDifferentialEventsExtractor";

export class OpenCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor 
                                                    implements IObserver<BSplineR1toR2Interface> {

    protected curve: BSplineR1toR2;
    protected _curvatureNumerator: BSplineR1toR1;
    protected _curvatureDerivativeNumerator: BSplineR1toR1;
    protected curveDiffProperties: BSplineR1toR2DifferentialProperties;
    protected _inflectionParametricLocations: number[];
    protected _curvatureNumeratorExtremaEstimators: number[];
    protected _curvatureExtremaParametricLocations: number[];
    protected _curvatureDerivativeNumeratorExtremaEstimators: number[];

    constructor(curveToAnalyze: BSplineR1toR2) {
        super(curveToAnalyze);
        this._inflectionParametricLocations = [];
        this._curvatureNumeratorExtremaEstimators = [];
        this._curvatureExtremaParametricLocations = [];
        this._curvatureDerivativeNumeratorExtremaEstimators = [];
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

    get curvatureNumeratorExtremaEstimators() {
        return this._curvatureNumeratorExtremaEstimators;
    }

    get curvatureDerivativeNumeratorExtremaEstimators() {
        return this._curvatureDerivativeNumeratorExtremaEstimators;
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this._crvDiffEventsLocations.inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this.extractInflectionEstimators();
        this._crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    }

    extractInflectionEstimators(): void {
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(LOWER_BOUND_CURVE_INTERVAL));
        for(let i = 0; i < (this._inflectionParametricLocations.length - 1); i++) {
            const midAbscissa = this._inflectionParametricLocations[i + 1] - this._inflectionParametricLocations[i];
            this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(midAbscissa));
        }
        this._curvatureNumeratorExtremaEstimators.push(this._curvatureNumerator.evaluate(UPPER_BOUND_CURVE_INTERVAL));
    }

    extractCurvatureExtremaExtimators(): void {
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(LOWER_BOUND_CURVE_INTERVAL));
        for(let i = 0; i < (this._curvatureExtremaParametricLocations.length - 1); i++) {
            const midAbscissa = this._curvatureExtremaParametricLocations[i + 1] - this._curvatureExtremaParametricLocations[i];
            this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(midAbscissa));
        }
        this._curvatureDerivativeNumeratorExtremaEstimators.push(this._curvatureDerivativeNumerator.evaluate(UPPER_BOUND_CURVE_INTERVAL));
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