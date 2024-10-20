import { ClosedCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor";
import { ClosedCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence";
import { OpenCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor";
import { OpenCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence";
import { CurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/CurveShapeSpaceNavigator";
import { ClosedCurveShapeSpaceNavigator, OpenCurveShapeSpaceNavigator } from "../curveShapeSpaceNavigation/NavigationCurveModel";
import { ShapeSpaceDiffEventsStructure } from "../curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { CurveModel } from "../newModels/CurveModel";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { CCurveShapeMonitoringStrategyWithInflexionsNoSliding, OCurveShapeMonitoringStrategyWithInflexionsNoSliding, OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding, CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding, OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding, CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding, OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding, CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding, OCurveShapeMonitoringStrategyWithInflexionsSliding, CCurveShapeMonitoringStrategyWithInflexionsSliding, OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding, CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding, OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding, CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding, OCurveShapeMonitoringStrategyWithNoDiffEventSliding, CCurveShapeMonitoringStrategyWithNoDiffEventSliding } from "./CurveShapeMonitoringStrategy";

export abstract class CurveControlState {

    protected readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    protected readonly shapeNavigableCurve: ShapeNavigableCurve;
    protected readonly shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure;


    protected _curveControlParamChange: boolean;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;


        this._curveControlParamChange = true;
    }

    // setContext(context: ShapeSpaceNavigationEventListener) {
    //     this.shapeSpaceNavigationEventListener = context;
    // }

    abstract handleInflections(): void

    abstract handleCurvatureExtrema(): void

    abstract handleSliding(): void

    abstract monitorCurveShape(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void;

    get curveControlParamChange(): boolean {
        return this._curveControlParamChange;
    }

    set curveControlParamChange(curveControlParamChange: boolean) {
        this._curveControlParamChange = curveControlParamChange;
    }
}

export class HandleInflectionsNoSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }

}

export class HandleCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }

        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    
    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleNoDiffEventNoSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            if(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents instanceof OpenCurveDifferentialEventsExtractorWithoutSequence) {
                // It is the initialization phase and this curve differential event extractor has been already set up when creating the OpenCurve
                const warning = new WarningLog(this.constructor.name, "constructor", "curve differential event extractor has been already set up. No new creation");
                warning.logMessage();
            } else {
                this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
                this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
                this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            }
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleInflectionsSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator)
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleCurvatureExtremaSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }

        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    
    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}

export class HandleNoDiffEventSlidingState extends CurveControlState {

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else if(curveToAnalyze instanceof ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        } else {
            const error = new ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }

    handleInflections(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleCurvatureExtrema(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    handleSliding(): void {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if(this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }

    monitorCurveShape(): void {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new OCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        } else if(this.curveShapeSpaceNavigator.navigationCurveModel instanceof ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }

        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}