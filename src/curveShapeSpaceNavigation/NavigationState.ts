import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator,
        CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER } from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";
import { BSpline_R1_to_R2 } from "../bsplines/BSpline_R1_to_R2";
import { CurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { CurveConstraints } from "./CurveConstraints";


export abstract class NavigationState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
    }

    setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator): void {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    curveConstraintsMonitoring(): void {
        this.curveConstraints.processConstraint();
    }

    abstract setNavigationStrictlyInsideShapeSpace(): void;

    abstract setNavigationThroughSimplerShapeSpaces(): void;

    abstract setNavigationWithoutShapeSpaceMonitoring(): void;

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

    protected shapeSpaceConstraintsMonitoring(): void {}

}

export class NavigationWithoutShapeSpaceMonitoring extends NavigationState {

    private currentCurve: BSpline_R1_to_R2;
    private optimizedCurve: BSpline_R1_to_R2;
    private curveAnalyserCurrentCurve: CurveAnalyzer;
    private curveAnalyserOptimizedCurve: CurveAnalyzer;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
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

    navigate(): void {
        this.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        this.shapeSpaceConstraintsMonitoring();
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = true;

        this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve = this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    }

}

export class NavigationThroughSimplerShapeSpaces extends NavigationState {


    // constructor(curveNavigator: CurveShapeSpaceNavigator) {
    //     super(curveNavigator);
    // }

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

    navigate(): void {
        this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        this.shapeSpaceConstraintsMonitoring();
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.curveShapeSpaceNavigator.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            this.curveConstraintsMonitoring();
            this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.update();
            this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve = this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve, this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
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

    navigate(): void {
        this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        this.shapeSpaceConstraintsMonitoring();
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.curveShapeSpaceNavigator.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            this.curveConstraintsMonitoring();
            this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.update();
            this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve = this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve, this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve);
            seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }
}