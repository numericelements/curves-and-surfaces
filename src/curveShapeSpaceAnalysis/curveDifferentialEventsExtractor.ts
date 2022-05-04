import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { BSplineR1toR2DifferentialPropertiesInterface } from "../newBsplines/BSplineR1toR2DifferentialPropertiesInterface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";
import { CurveDifferentialEventsExtractorInterface } from "./CurveDifferentialEventsExtractorInterface";

export abstract class AbstractCurveDifferentialEventsExtractor implements CurveDifferentialEventsExtractorInterface {

    protected curve: BSplineR1toR2Interface;

    constructor(curveToAnalyze: BSplineR1toR2Interface) {
        this.curve = curveToAnalyze;
        // if(this.curve instanceof BSplineR1toR2) {
        //     this.curveDiffProperties = new BSplineR1toR2DifferentialProperties(this.curve);
        // } else if(this.curve instanceof PeriodicBSplineR1toR2) {
        //     this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        // }
        // this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        // this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        // this.sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
    }

    abstract get curvatureNumerator(): BSplineR1toR1Interface;

    abstract get curvatureDerivativeNumerator(): BSplineR1toR1Interface;

    abstract update(curveToAnalyze: BSplineR1toR2Interface): void;

    abstract extractSeqOfDiffEvents(): SequenceOfDifferentialEvents;
}

export class OpenCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor {

    public sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected curve: BSplineR1toR2;
    private _curvatureNumerator: BSplineR1toR1;
    private _curvatureDerivativeNumerator: BSplineR1toR1;
    private curveDiffProperties: BSplineR1toR2DifferentialProperties;
    private inflectionLocations: number[] = [];
    private curvatureExtremaLocations: number[] = [];

    constructor(curveToAnalyze: BSplineR1toR2) {
        super(curveToAnalyze);
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
        this.inflectionLocations = this._curvatureNumerator.zeros();
        this.curvatureExtremaLocations = this._curvatureDerivativeNumerator.zeros();
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

export class ClosedCurveDifferentialEventsExtractor extends AbstractCurveDifferentialEventsExtractor {

    public sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;
    protected curve: PeriodicBSplineR1toR2;
    private _curvatureNumerator: BSplineR1toR1;
    private _curvatureDerivativeNumerator: BSplineR1toR1;
    private curveDiffProperties: PeriodicBSplineR1toR2DifferentialProperties;
    private inflectionLocations: number[] = [];
    private curvatureExtremaLocations: number[] = [];

    constructor(curveToAnalyze: PeriodicBSplineR1toR2) {
        super(curveToAnalyze);
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
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
        this.inflectionLocations = this._curvatureNumerator.zeros();
        this.curvatureExtremaLocations = this._curvatureDerivativeNumerator.zeros();
        this.sequenceOfDifferentialEvents.insertEvents(this.curvatureExtremaLocations, this.inflectionLocations);
        return this.sequenceOfDifferentialEvents;
    }

    update(curveToAnalyze: PeriodicBSplineR1toR2): void {
        this.curve = curveToAnalyze;
        this.curveDiffProperties = new PeriodicBSplineR1toR2DifferentialProperties(this.curve);
        this._curvatureNumerator = this.curveDiffProperties.curvatureNumerator();
        this._curvatureDerivativeNumerator = this.curveDiffProperties.curvatureDerivativeNumerator();
        this.extractSeqOfDiffEvents();
    }

}