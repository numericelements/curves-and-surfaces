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


    // abstract setControlOfCurvatureExtrema(): void;

    // abstract setControlOfInflections(): void;

    // abstract setSliding(): void;

    // abstract removeControlOfCurvatureExtrema(): void;

    // abstract removeControlOfInflections(): void;

    // abstract removeSliding(): void;
}

export class NavigationThroughSimplerShapeSpaces extends NavigationState {


    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        console.log("No navigation process to change there.");
    }

}

export class NavigationStrictlyInsideShapeSpace extends NavigationState {

    setNavigationThroughSimplerShapeSpaces(): void {
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        console.log("No navigation process to change there.");
    }
}
// export class NavigationWithoutMonitoring extends NavigationState {

//     setControlOfCurvatureExtrema(): void {
//         this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoring(this.curveShapeSpaceNavigator));
//     }

//     setControlOfInflections(): void {
//         this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoring(this.curveShapeSpaceNavigator));
//     }

//     setSliding(): void {
//         this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoringAndSliding(this.curveShapeSpaceNavigator));
//     }

//     removeControlOfCurvatureExtrema(): void {
//         let warning = new WarningLog(this.constructor.name, "removeControlOfCurvatureExtrema", "no state change there.");
//         warning.logMessageToConsole();
//     }

//     removeControlOfInflections(): void {
//         let warning = new WarningLog(this.constructor.name, "removeControlOfInflections", "no state change there.");
//         warning.logMessageToConsole();
//     }

//     removeSliding(): void {
//         let warning = new WarningLog(this.constructor.name, "removeSliding", "no state change there.");
//         warning.logMessageToConsole();
//     }

// }