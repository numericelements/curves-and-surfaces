import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CONVERGENCE_THRESHOLD,
        MAX_TRUST_REGION_RADIUS,
        MAX_NB_STEPS_TRUST_REGION_OPTIMIZER } from "./CurveShapeSpaceNavigator";
import { ComparatorOfSequencesOfDiffEvents } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OpenMode } from "fs";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { ClosedCurveAnalyzer, ClosedCurveDummyAnalyzer, OpenCurveAnalyzer, OPenCurveDummyAnalyzer } from "../curveShapeSpaceAnalysis/CurveAnalyzer";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { CurveModel } from "../newModels/CurveModel";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";
import { CurveAnalyzerInterface } from "../curveShapeSpaceAnalysis/CurveAnalyzerInterface";
import { ClosedCurveShapeSpaceNavigator, NavigationCurveModel, OpenCurveShapeSpaceNavigator } from "./NavigationCurveModel";
import { CurveConstraintClampedFirstControlPoint, CurveConstraintNoConstraint } from "./CurveConstraintStrategy";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";

export abstract class NavigationState {

    protected _navigationStateChange: boolean;

    constructor() {
        this._navigationStateChange = true;
    }

    abstract setNavigationCurveModel(navigationCurveModel: NavigationCurveModel): void;

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

    abstract setNavigationStrictlyInsideShapeSpace(): void;

    abstract setNavigationThroughSimplerShapeSpaces(): void;

    abstract setNavigationWithoutShapeSpaceMonitoring(): void;

    abstract setCurrentCurve(curve: BSplineR1toR2Interface): void;

    abstract get curveAnalyserCurrentCurve(): CurveAnalyzerInterface;

    abstract get curveAnalyserOptimizedCurve(): CurveAnalyzerInterface;

    get navigationStateChange(): boolean {
        return this._navigationStateChange;
    }

    set navigationStateChange(navigationStateChange: boolean) {
        this._navigationStateChange = navigationStateChange;
    }
}

export abstract class OpenCurveNavigationState extends NavigationState{

    protected navigationCurveModel: OpenCurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected currentCurve: BSplineR1toR2;
    protected optimizedCurve: BSplineR1toR2;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if(this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessageToConsole();
            this.currentCurve = new BSplineR1toR2;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if(!this.navigationCurveModel.shapeNavigableCurve) {
            const warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setNavigationCurveModel(navigationCurveModel: OpenCurveShapeSpaceNavigator): void {
        this.navigationCurveModel = navigationCurveModel;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        const warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new OCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setCurrentCurve(curve: BSplineR1toR2): void {
        this.currentCurve = curve.clone();
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class OCurveNavigationWithoutShapeSpaceMonitoring extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OPenCurveDummyAnalyzer;
    private _curveAnalyserOptimizedCurve: OPenCurveDummyAnalyzer;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve =this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OPenCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OPenCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }

    get curveAnalyserCurrentCurve(): OPenCurveDummyAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OPenCurveDummyAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        // JCL pas nécessaire dans cette config si pas incompatible avec la connexion de l'optimiseur
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;

        this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.targetCurve.clone();
        // this.shapeNavigableCurve.updateCurve();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.update();
        this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    }

}

export class OCurveNavigationThroughSimplerShapeSpaces extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: OpenCurveAnalyzer;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }

    get curveAnalyserCurrentCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        for(let i = 0; i < this.optimizedCurve.controlPoints.length; i++) {
            if(isNaN(this.optimizedCurve.controlPoints[i].x) || isNaN(this.optimizedCurve.controlPoints[i].y)) {
                const error = new ErrorLog(this.constructor.name, "curveConstraintsMonitoring", "NaN");
                error.logMessageToConsole();
            }
        }
        if(this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve instanceof BSplineR1toR2) {
            this.navigationCurveModel.optimizedCurve = this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.optimizedCurve;
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        }
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this._curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        try {
            this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            let curveModelOptimized = new CurveModel();
            curveModelOptimized.setSpline(this.navigationCurveModel.curveControl.optimizationProblem.spline);
            this.navigationCurveModel.optimizedCurve = curveModelOptimized.spline;
            this.optimizedCurve = curveModelOptimized.spline;
            this.curveConstraintsMonitoring();

            // problème: OpenCurveAnalyzer appliqué à optimizedCurve utilise update mais celle-ci utilise
            // navigationCurveModel.currentCurve au lieu de navigationCurveModel.optimizedCurve
            // this._curveAnalyserOptimizedCurve.update();
            for(let i = 0; i < this.optimizedCurve.controlPoints.length; i++) {
                if(isNaN(this.optimizedCurve.controlPoints[i].x) || isNaN(this.optimizedCurve.controlPoints[i].y)) {
                    const error = new ErrorLog(this.constructor.name, "navigate", "NaN");
                    error.logMessageToConsole();
                }
            }
            // this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            // const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }

}

export class OCurveNavigationStrictlyInsideShapeSpace extends OpenCurveNavigationState {

    private _curveAnalyserCurrentCurve: OpenCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: OpenCurveAnalyzer;

    constructor(navigationCurveModel: OpenCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof OCurveNavigationWithoutShapeSpaceMonitoring
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new OpenCurveAnalyzer(this.currentCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
        this._curveAnalyserOptimizedCurve = new OpenCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel, this.navigationCurveModel.slidingEventsAtExtremities);
    }

    get curveAnalyserCurrentCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): OpenCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.navigationCurveModel.curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.navigationCurveModel.curveControl.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.curveControl.optimizationProblem.spline.clone();
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.navigationCurveModel.curveAnalyserOptimizedCurve.update();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }
}

export abstract class ClosedCurveNavigationState extends NavigationState{

    protected navigationCurveModel: ClosedCurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected currentCurve: PeriodicBSplineR1toR2;
    protected optimizedCurve: PeriodicBSplineR1toR2;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super();
        this.navigationCurveModel = navigationCurveModel;
        this.shapeNavigableCurve = this.navigationCurveModel.shapeNavigableCurve;
        if(this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel) {
            this.currentCurve = this.navigationCurveModel.currentCurve;
            // this.currentCurve = this.navigationCurveModel.shapeNavigableCurve.curveCategory.curveModel.spline;
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "Inconsistent object type to initialize the currentCurve.");
            error.logMessageToConsole();
            this.currentCurve = new PeriodicBSplineR1toR2;
        }
        this.navigationCurveModel.currentCurve = this.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        this.navigationCurveModel.optimizedCurve = this.optimizedCurve;
        if(!this.navigationCurveModel.shapeNavigableCurve) {
            let warning = new WarningLog(this.constructor.name, 'constructor', 'Not able to initialize curveConstraints field.');
            warning.logMessageToConsole();
        }
    }

    setNavigationCurveModel(navigationCurveModel: ClosedCurveShapeSpaceNavigator): void {
        this.navigationCurveModel = navigationCurveModel;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationStrictlyInsideShapeSpace', 'set NavigationStrictlyInsideShapeSpace');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationStrictlyInsideShapeSpace(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationThroughSimplerShapeSpaces', 'set NavigationThroughSimplerShapeSpaces');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationThroughSimplerShapeSpaces(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        let warning = new WarningLog(this.constructor.name, 'setNavigationWithoutShapeSpaceMonitoring', 'set NavigationWithoutShapeSpaceMonitoring');
        warning.logMessageToConsole();
        this.navigationCurveModel.changeNavigationState(new CCurveNavigationWithoutShapeSpaceMonitoring(this.navigationCurveModel));
        this.shapeNavigableCurve.notifyObservers();
        this.navigationCurveModel.curveShapeSpaceNavigator.navigationState.navigationStateChange = false;
    }

    setCurrentCurve(curve: PeriodicBSplineR1toR2): void {
        this.currentCurve = curve.clone();
    }

    abstract navigate(selectedControlPoint: number, x: number, y: number): void;

}

export class CCurveNavigationWithoutShapeSpaceMonitoring extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveDummyAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveDummyAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationThroughSimplerShapeSpaces
            || curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationStrictlyInsideShapeSpace) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveDummyAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveDummyAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveDummyAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveDummyAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationWithoutShapeSpaceMonitoring(): void {
        this.currentCurve = this.navigationCurveModel.currentCurve;
        this.optimizedCurve = this.currentCurve.clone();
        // this.curveAnalyserCurrentCurve = new CurveAnalyzer(this.currentCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);
        // this.curveAnalyserOptimizedCurve = new CurveAnalyzer(this.optimizedCurve, this.curveShapeSpaceNavigator, this.curveShapeSpaceNavigator.slidingEventsAtExtremities);

        let warning = new WarningLog(this.constructor.name, "setNavigationWithoutShapeSpaceMonitoring", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        // JCL pas nécessaire dans cette config si pas incompatible avec la connexion de l'optimiseur
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;

        this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.targetCurve;
        // this.shapeNavigableCurve.updateCurve();
        this.curveConstraintsMonitoring();
        this.curveAnalyserOptimizedCurve.update();
        this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
    }

}

export class CCurveNavigationThroughSimplerShapeSpaces extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationThroughSimplerShapeSpaces(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationThroughSimplerShapeSpaces", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = false;
        try {
            this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // requires optimization process for periodic B-Splines
            // this.navigationCurveModel.optimizedCurve = this.navigationCurveModel.optimizationProblem.spline.clone();
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.curveAnalyserOptimizedCurve.update();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }

}

export class CCurveNavigationStrictlyInsideShapeSpace extends ClosedCurveNavigationState {

    private _curveAnalyserCurrentCurve: ClosedCurveAnalyzer;
    private _curveAnalyserOptimizedCurve: ClosedCurveAnalyzer;

    constructor(navigationCurveModel: ClosedCurveShapeSpaceNavigator) {
        super(navigationCurveModel);
        // JCL 09/11/2021 Set up a curve analyzer whenever the navigation state changes
        this.optimizedCurve = this.navigationCurveModel.optimizedCurve;
        const curveShapeSpaceNavigator = this.navigationCurveModel.curveShapeSpaceNavigator;
        if(curveShapeSpaceNavigator.navigationState instanceof CCurveNavigationWithoutShapeSpaceMonitoring) {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
            this.shapeNavigableCurve.clampedPoints[0] = 0;
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintClampedFirstControlPoint(this.shapeNavigableCurve.curveConstraints));
        } else {
            curveShapeSpaceNavigator.navigationState = this;
            this.navigationCurveModel.navigationState = this;
        }
        this._curveAnalyserCurrentCurve = new ClosedCurveAnalyzer(this.currentCurve, this.navigationCurveModel);
        this._curveAnalyserOptimizedCurve = new ClosedCurveAnalyzer(this.optimizedCurve, this.navigationCurveModel);
    }

    get curveAnalyserCurrentCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserCurrentCurve;
    }

    get curveAnalyserOptimizedCurve(): ClosedCurveAnalyzer {
        return this._curveAnalyserOptimizedCurve;
    }

    setNavigationStrictlyInsideShapeSpace(): void {
        let warning = new WarningLog(this.constructor.name, "setNavigationStrictlyInsideShapeSpace", "No navigation process to change there.");
        warning.logMessageToConsole();
    }

    curveConstraintsMonitoring(): void {
        this.shapeNavigableCurve.curveConstraints.processConstraint();
        this.navigationCurveModel.currentCurve = this.navigationCurveModel.optimizedCurve;
        this.currentCurve = this.navigationCurveModel.currentCurve.clone();
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.currentCurve = this.currentCurve.clone();
    }

    navigate(selectedControlPoint: number, x: number, y: number): void {
        this.navigationCurveModel.updateCurrentCurve(selectedControlPoint, new Vector2d(x, y));
        this.navigationCurveModel.curveAnalyserCurrentCurve.update();
        this.navigationCurveModel.seqDiffEventsCurrentCurve = this.navigationCurveModel.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.navigationCurveModel.setTargetCurve();
        this.navigationCurveModel.optimizationProblemParam.updateConstraintBounds = true;
        try {
            this.navigationCurveModel.optimizer.optimize_using_trust_region(CONVERGENCE_THRESHOLD, MAX_TRUST_REGION_RADIUS, MAX_NB_STEPS_TRUST_REGION_OPTIMIZER);
            // this.curveShapeSpaceNavigator.optimizedCurve = this.curveShapeSpaceNavigator.optimizationProblem.spline.clone();
            this.optimizedCurve = this.navigationCurveModel.optimizedCurve.clone();
            this.curveConstraintsMonitoring();
            this.navigationCurveModel.curveAnalyserOptimizedCurve.update();
            this.navigationCurveModel.seqDiffEventsOptimizedCurve = this.navigationCurveModel.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
            const seqComparator = new ComparatorOfSequencesOfDiffEvents(this.navigationCurveModel.seqDiffEventsCurrentCurve, this.navigationCurveModel.seqDiffEventsOptimizedCurve);
            // to be added later
            // seqComparator.locateNeiboringEvents();
        }
        catch(e)
        {

        }
    }
}