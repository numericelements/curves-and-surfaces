import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator,
        CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER } from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";

export abstract class NavigationState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveNavigator;
    }

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

    
    abstract setControlOfCurvatureExtrema(): void;

    abstract setControlOfInflections(): void;

    abstract setSliding(): void;

    abstract removeControlOfCurvatureExtrema(): void;

    abstract removeControlOfInflections(): void;

    abstract removeSliding(): void;
}

export class NavigationWithoutMonitoring extends NavigationState {

    setControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoring(this.curveShapeSpaceNavigator));
    }

    setControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoring(this.curveShapeSpaceNavigator));
    }

    setSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    removeSliding(): void {
        let warning = new WarningLog(this.constructor.name, "removeSliding", "no state change there.");
        warning.logMessageToConsole();
    }

}

export class NavigationWithoutMonitoringAndSliding extends NavigationState {

    navigate(): void {
        if(this.curveShapeSpaceNavigator.navigationParams.curvatureExtremaControl) {
            this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoring(this.curveShapeSpaceNavigator));
        }
    }

    setControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    setControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    setSliding(): void {
        let warning = new WarningLog(this.constructor.name, "setSliding", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    removeSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoring(this.curveShapeSpaceNavigator));
    }
}

export class NavigationWithCurvatureExtMonitoring extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    setControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoring(this.curveShapeSpaceNavigator));
    }

    setSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoring(this.curveShapeSpaceNavigator));
    }

    removeControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    removeSliding(): void {
        let warning = new WarningLog(this.constructor.name, "removeSliding", "no state change there.");
        warning.logMessageToConsole();
    }
}

export class NavigationWithCurvatureExtMonitoringAndSliding extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    setControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    setSliding(): void {
        let warning = new WarningLog(this.constructor.name, "setSliding", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    removeSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoring(this.curveShapeSpaceNavigator));
    }
}

export class NavigationWithInflectionMonitoring extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoring(this.curveShapeSpaceNavigator));
    }

    setControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    setSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoring(this.curveShapeSpaceNavigator));
    }

    removeSliding(): void {
        let warning = new WarningLog(this.constructor.name, "removeSliding", "no state change there.");
        warning.logMessageToConsole();
    }
}

export class NavigationWithInflectionMonitoringAndSliding extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    setControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    setSliding(): void {
        let warning = new WarningLog(this.constructor.name, "setSliding", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "removeControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithoutMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoring(this.curveShapeSpaceNavigator));
    }
}

export class NavigationWithCurvatureExtAndInflectionMonitoring extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    setControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    setSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoring(this.curveShapeSpaceNavigator));
    }

    removeControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoring(this.curveShapeSpaceNavigator));
    }

    removeSliding(): void {
        let warning = new WarningLog(this.constructor.name, "removeSliding", "no state change there.");
        warning.logMessageToConsole();
    }
}

export class NavigationWithCurvatureExtAndInflectionMonitoringAndSliding extends NavigationState {

    navigate(): void {

    }

    setControlOfCurvatureExtrema(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfCurvatureExtrema", "no state change there.");
        warning.logMessageToConsole();
    }

    setControlOfInflections(): void {
        let warning = new WarningLog(this.constructor.name, "setControlOfInflections", "no state change there.");
        warning.logMessageToConsole();
    }

    setSliding(): void {
        let warning = new WarningLog(this.constructor.name, "setSliding", "no state change there.");
        warning.logMessageToConsole();
    }

    removeControlOfCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeControlOfInflections(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithInflectionMonitoringAndSliding(this.curveShapeSpaceNavigator));
    }

    removeSliding(): void {
        this.curveShapeSpaceNavigator.changeState(new NavigationWithCurvatureExtAndInflectionMonitoring(this.curveShapeSpaceNavigator));
    }
}