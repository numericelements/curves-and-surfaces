import { WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator,
        CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER } from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { CurveConstraints } from "./CurveConstraints";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { CurveModel } from "../newModels/CurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";


export abstract class NavigationState {

    protected curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
        if(!this.curveShapeSpaceNavigator.curveConstraints) {
            let warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: CurveShapeSpaceNavigator): void {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new NavigationWithoutShapeSpaceMonitoring(this.curveShapeSpaceNavigator));
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class NavigationWithoutShapeSpaceMonitoring extends NavigationState {

    private currentCurve: BSplineR1toR2Interface;
    private optimizedCurve: BSplineR1toR2Interface;
    private curveAnalyserCurrentCurve: CurveAnalyzer;
    private curveAnalyserOptimizedCurve: CurveAnalyzer;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        if(this.currentCurve instanceof BSplineR1toR2) {
            this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        } else {
            console.log(" use a dummy curve in place of Periodic BSpline")
            const dummyCurve = new CurveModel()
            this.curveAnalyserCurrentCurve = new CurveAnalyzer(dummyCurve.spline, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        }
        if(this.optimizedCurve  instanceof BSplineR1toR2) {
            this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        } else {
            console.log(" use a dummy curve in place of Periodic BSpline")
            const dummyCurve = new CurveModel()
            this.curveAnalyserOptimizedCurve = new CurveAnalyzer(dummyCurve.spline, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        }
        
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        if(this.curveShapeSpaceNavigator.currentCurve instanceof PeriodicBSplineR1toR2 && this.currentCurve instanceof BSplineR1toR2) {
            this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
            this.optimizedCurve = this.currentCurve;
        } else if (this.curveShapeSpaceNavigator.currentCurve instanceof BSplineR1toR2 && this.currentCurve instanceof PeriodicBSplineR1toR2) {
            this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
            this.optimizedCurve = this.currentCurve;
            // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
            // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        }
        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.curveShapeSpaceNavigator.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        // JCL pas nécessaire dans cette config si pas incompatible avec la connexion de l'optimiseur
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = false;

        this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.targetCurve;
        this.curveConstraints.updateCurve();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsOptimizedCurve = this.curveShapeSpaceNavigator.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    }

}

export class NavigationThroughSimplerShapeSpaces extends NavigationState {

    private currentCurve: BSplineR1toR2Interface;
    private optimizedCurve: BSplineR1toR2Interface;
    private curveAnalyserCurrentCurve: CurveAnalyzer;
    private curveAnalyserOptimizedCurve: CurveAnalyzer;

    constructor(curveNavigator: CurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        if(this.currentCurve  instanceof BSplineR1toR2) {
            this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        } else {
            console.log(" use a dummy curve in place of Periodic BSpline")
            const dummyCurve = new CurveModel()
            this.curveAnalyserCurrentCurve = new CurveAnalyzer(dummyCurve.spline, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        }
        if(this.optimizedCurve  instanceof BSplineR1toR2) {
            this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        } else {
            console.log(" use a dummy curve in place of Periodic BSpline")
            const dummyCurve = new CurveModel()
            this.curveAnalyserOptimizedCurve = new CurveAnalyzer(dummyCurve.spline, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

        }
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.curveShapeSpaceNavigator.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
        this.curveShapeSpaceNavigator.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.curveShapeSpaceNavigator.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.update();
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


    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.curveShapeSpaceNavigator.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.update();
        this.curveShapeSpaceNavigator.seqDiffEventsCurrentCurve = this.curveShapeSpaceNavigator.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveShapeSpaceNavigator.setTargetCurve();
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