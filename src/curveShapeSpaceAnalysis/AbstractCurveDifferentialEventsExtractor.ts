import { BSplineR1toR1 } from "../newBsplines/BSplineR1toR1";
import { BSplineR1toR1Interface } from "../newBsplines/BSplineR1toR1Interface";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { BSplineR1toR2DifferentialPropertiesInterface } from "../newBsplines/BSplineR1toR2DifferentialPropertiesInterface";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { IObserver } from "../newDesignPatterns/Observer";
import { SequenceOfDifferentialEvents } from "../sequenceOfDifferentialEvents/SequenceOfDifferentialEvents";

export abstract class AbstractCurveDifferentialEventsExtractor implements IObserver<BSplineR1toR2Interface> {

    protected readonly curve: BSplineR1toR2Interface;
    protected _sequenceOfDifferentialEvents: SequenceOfDifferentialEvents;

    constructor(curveToAnalyze: BSplineR1toR2Interface) {
        this.curve = curveToAnalyze;
        this._sequenceOfDifferentialEvents = new SequenceOfDifferentialEvents();
    }

    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }

    abstract get curvatureNumerator(): BSplineR1toR1;

    abstract get curvatureDerivativeNumerator(): BSplineR1toR1Interface;

    abstract update(curveToAnalyze: BSplineR1toR2Interface): void;

    abstract extractSeqOfDiffEvents(): SequenceOfDifferentialEvents;
}