import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator,
        CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER } from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";


export abstract class NavigationState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveNavigator;
    }

    setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator): void {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    abstract setNavigationStrictlyInsideShapeSpace(): void;

    abstract setNavigationThroughSimplerShapeSpaces(): void;

    abstract setNavigationWithoutShapeSpaceMonitoring(): void;

    public navigate(): void {
        this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        this.shapeSpaceConstraintsMonitoring();
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.curveShapeSpaceNavigator.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            this.curveConstraintsMonitoring();
            this.curveShapeSpaceNavigator.curveAnalyserOptimizedtCurve.update();
            this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve = this.curveShapeSpaceNavigator.curveAnalyserOptimizedtCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve, this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }

    protected shapeSpaceConstraintsMonitoring(): void {};

    protected curveConstraintsMonitoring(): void {};


}

export class NavigationWithoutShapeSpaceMonitoring extends NavigationState {


    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

}

export class NavigationThroughSimplerShapeSpaces extends NavigationState {


    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationWithoutShapeSpaceMonitoring(this.curveShapeSpaceNavigator));
    }

}

export class NavigationStrictlyInsideShapeSpace extends NavigationState {

    setNavigationThroughSimplerShapeSpaces(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationWithoutShapeSpaceMonitoring(this.curveShapeSpaceNavigator));
    }
}