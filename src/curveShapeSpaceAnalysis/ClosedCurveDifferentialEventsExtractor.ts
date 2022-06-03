import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { IObserver } from "../newDesignPatterns/Observer";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { AbstractCurveDifferentialEventsExtractor } from "./AbstractCurveDifferentialEventsExtractor";


export class ClosedCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor 
                                                    implements IObserver<BSplineR1toR2Interface> {

    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected curve: PeriodicBSplineR1toR2;
    private _curvatureNumerator: BSplineR1toR1;
    private _curvatureDerivativeNumerator: BSplineR1toR1;
    private curveDiffProperties: PeriodicBSplineR1toR2DifferentialProperties;
    private _inflectionParametricLocations: number[] = [];
    private _curvatureExtremaParametricLocations: number[] = [];
    private _inflectionLocationsEuclideanSpace: Vector2d[];
    private _curvatureExtremaLocationsEuclideanSpace: Vector2d[];
    protected _transientCurvatureExtremaLocationsEuclideanSpace: Vector2d[];


    constructor(curveToAnalyze: PeriodicBSplineR1toR2) {
        super(curveToAnalyze);
        this.curve = curveToAnalyze;
        this._inflectionLocationsEuclideanSpace = [];
        this._curvatureExtremaLocationsEuclideanSpace = [];
        this._transientCurvatureExtremaLocationsEuclideanSpace = [];
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
        this.extractSeqOfDiffEvents();
    }

    get curvatureNumerator(): BSplineR1toR1 {
        return this._curvatureNumerator;
    }

    get curvatureDerivativeNumerator(): BSplineR1toR1 {
        return this._curvatureDerivativeNumerator;
    }

    get inflectionLocationsEuclideanSpace() {
        return this._inflectionLocationsEuclideanSpace;
    }

    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }

    get curvatureExtremaLocationsEuclideanSpace() {
        return this._curvatureExtremaLocationsEuclideanSpace;
    }

    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }

    get transientCurvatureExtremaLocationsEuclideanSpace() {
        return this._transientCurvatureExtremaLocationsEuclideanSpace;
    }

    extractSeqOfDiffEvents(): SequenceOfDifferentialEvents {
        this._inflectionLocationsEuclideanSpace = this.curveDiffProperties.inflections();
        this._inflectionParametricLocations = this._curvatureNumerator.zeros();
        this._curvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.curvatureExtrema();
        this._curvatureExtremaParametricLocations = this._curvatureDerivativeNumerator.zeros();
        this._transientCurvatureExtremaLocationsEuclideanSpace = this.curveDiffProperties.transitionCurvatureExtrema();
        this._sequenceOfDifferentialEvents.insertEvents(this._curvatureExtremaParametricLocations, this._inflectionParametricLocations);
        return this._sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: PeriodicBSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    }

}