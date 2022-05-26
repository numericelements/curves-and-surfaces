import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractCurveShapeSpaceNavigator,
        CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER, 
        OpenCurveShapeSpaceNavigator,
        ClosedCurveShapeSpaceNavigator} from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ClosedCurveAnalyzer, OpenCurveAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { CurveConstraints } from "./CurveConstraints";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { CurveModel } from "../newModels/CurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";

export abstract class NavigationState {

    abstract setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: AbstractCurveShapeSpaceNavigator): void;

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

    abstract setNavigationStrictlyInsideShapeSpace(): void;

    abstract setNavigationThroughSimplerShapeSpaces(): void;

    abstract setNavigationWithoutShapeSpaceMonitoring(): void;
}

export abstract class OpenCurveNavigationState extends NavigationState{

    protected curveShapeSpaceNavigator: OpenCurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(curveNavigator: OpenCurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
        if(!this.curveShapeSpaceNavigator.curveConstraints) {
            let warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: OpenCurveShapeSpaceNavigator): void {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(this.curveShapeSpaceNavigator));
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class OCurveNavigationWithoutShapeSpaceMonitoring extends OpenCurveNavigationState {

    private currentCurve: BSplineR1toR2;
    private optimizedCurve: BSplineR1toR2;
    private curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private curveAnalyserOptimizedCurve: OpenCurveAnalyzer;

    constructor(curveNavigator: OpenCurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        this.curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        this.curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

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

export class OCurveNavigationThroughSimplerShapeSpaces extends OpenCurveNavigationState {

    private currentCurve: BSplineR1toR2;
    private optimizedCurve: BSplineR1toR2;
    private curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private curveAnalyserOptimizedCurve: OpenCurveAnalyzer;

    constructor(curveNavigator: OpenCurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        this.curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        this.curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

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

export class OCurveNavigationStrictlyInsideShapeSpace extends OpenCurveNavigationState {


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

export abstract class ClosedCurveNavigationState extends NavigationState{

    protected curveShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator;
    protected curveConstraints: CurveConstraints;

    constructor(curveNavigator: ClosedCurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveNavigator;
        this.curveConstraints = this.curveShapeSpaceNavigator.curveConstraints;
        if(!this.curveShapeSpaceNavigator.curveConstraints) {
            let warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setCurveShapeSpaceNavigator(curveShapeSpaceNavigator: ClosedCurveShapeSpaceNavigator): void {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(this.curveShapeSpaceNavigator));
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(this.curveShapeSpaceNavigator));
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.curveShapeSpaceNavigator.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(this.curveShapeSpaceNavigator));
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class CCurveNavigationWithoutShapeSpaceMonitoring extends ClosedCurveNavigationState {

    private currentCurve: PeriodicBSplineR1toR2;
    private optimizedCurve: PeriodicBSplineR1toR2;
    private curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(curveNavigator: ClosedCurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        this.curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator);
        this.curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator);
        
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.currentCurve;
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

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

export class CCurveNavigationThroughSimplerShapeSpaces extends ClosedCurveNavigationState {

    private currentCurve: PeriodicBSplineR1toR2;
    private optimizedCurve: PeriodicBSplineR1toR2;
    private curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(curveNavigator: ClosedCurveShapeSpaceNavigator) {
        super(curveNavigator);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.currentCurve = this.curveShapeSpaceNavigator.currentCurve;
        this.optimizedCurve = this.curveShapeSpaceNavigator.optimizedCurve;
        this.curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator);
        this.curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator);

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
            // this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
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

export class CCurveNavigationStrictlyInsideShapeSpace extends ClosedCurveNavigationState {


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
            // this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
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