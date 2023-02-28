import { ShapeSpaceDiffEventsStructure } from "./ShapeSpaceDiffEventsStructure"; 
import { ShapeSpaceDiffEventsConfigurator } from "../designPatterns/IShapeSpaceConfigurator";
import { CurveCategory } from "../shapeNavigableCurve/CurveCategory";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { CurveShapeSpaceNavigator } from "./CurveShapeSpaceNavigator";
import { ShapeNavigableCurve } from "../shapeNavigableCurve/ShapeNavigableCurve";
import { OpenCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence";
import { CurveModel } from "../newModels/CurveModel";
import { ClosedCurveModel } from "../newModels/ClosedCurveModel";
import { ClosedCurveDifferentialEventsExtractorWithoutSequence } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence";
import { OpenCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor";
import { ClosedCurveDifferentialEventsExtractor } from "../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor";
import { NoSlidingStrategy } from "../controllers/NoSlidingStrategy";
import { SlidingStrategy } from "../controllers/SlidingStrategy";
import { OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors } from "../bsplineOptimizationProblems/OptimizationProblem_BSpline_R1_to_R2";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";

export abstract class ShapeSpaceConfiguration {

    protected _shapeSpaceConfigurationChange: boolean;

    constructor() {
        this._shapeSpaceConfigurationChange = true;
    }

    abstract monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void;

    get shapeSpaceConfigurationChange(): boolean {
        return this._shapeSpaceConfigurationChange;
    }

    set shapeSpaceConfigurationChange(shapeSpaceConfigurationChange: boolean) {
        this._shapeSpaceConfigurationChange = shapeSpaceConfigurationChange;
    }
}

export class ShapeSpaceConfiguratorWithInflectionsNoSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }


    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // removeCurvatureExtremaFromShapeSpaceMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }


    // setShapeSpaceMonitoringToNoMonitoring(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToInflectionsAndCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if(curveToAnalyze instanceof CurveModel) {
            if(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents instanceof OpenCurveDifferentialEventsExtractorWithoutSequence) {
                // It is the initialization phase and this curve differential event extractor has been already set up when creating the OpenCurve
                const warning = new WarningLog(this.constructor.name, "constructor", "curve differential event extractor has been already set up. No new creation");
                warning.logMessageToConsole();
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a Dummy strategy
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
            error.logMessageToConsole();
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();

    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}

export class ShapeSpaceConfiguratorWithInflectionsSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithCurvatureExtremaSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

}

export class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding extends ShapeSpaceConfiguration implements ShapeSpaceDiffEventsConfigurator {

    private readonly curveShapeSpaceNavigator: CurveShapeSpaceNavigator;
    private readonly shapeNavigableCurve: ShapeNavigableCurve;

    constructor(curveShapeSpaceNavigator: CurveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
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
        }
    }

    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure: ShapeSpaceDiffEventsStructure): void {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a dummy strategy
        if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
            this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
                shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        } else {
            const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        }
        const warning = new WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", 
        " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
        + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
        + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
        + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessageToConsole();
    }

    // setShapeSpaceMonitoringToInflections(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithInflections(this.shapSpaceDiffEventsStructure));
    // }

    // setShapeSpaceMonitoringToCurvatureExtrema(): void {
    //     this.shapSpaceDiffEventsStructure.changeShapSpaceStructure(new ShapeSpaceConfiguratorWithCurvatureExtrema(this.shapSpaceDiffEventsStructure));
    // }
}