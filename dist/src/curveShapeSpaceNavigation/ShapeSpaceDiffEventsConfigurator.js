"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithCurvatureExtremaSliding = exports.ShapeSpaceConfiguratorWithInflectionsSliding = exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding = exports.ShapeSpaceConfiguratorWithInflectionsNoSliding = exports.ShapeSpaceConfiguration = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
const CurveModel_1 = require("../newModels/CurveModel");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
const OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
const ClosedCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor");
class ShapeSpaceConfiguration {
    constructor() {
        this._shapeSpaceConfigurationChange = true;
    }
    get shapeSpaceConfigurationChange() {
        return this._shapeSpaceConfigurationChange;
    }
    set shapeSpaceConfigurationChange(shapeSpaceConfigurationChange) {
        this._shapeSpaceConfigurationChange = shapeSpaceConfigurationChange;
    }
}
exports.ShapeSpaceConfiguration = ShapeSpaceConfiguration;
class ShapeSpaceConfiguratorWithInflectionsNoSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithInflectionsNoSliding = ShapeSpaceConfiguratorWithInflectionsNoSliding;
class ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithCurvatureExtremaNoSliding;
class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaNoSliding;
class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            if (this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents instanceof OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence) {
                // It is the initialization phase and this curve differential event extractor has been already set up when creating the OpenCurve
                const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", "curve differential event extractor has been already set up. No new creation");
                warning.logMessage();
            }
            else {
                this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
                this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
                this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            }
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a Dummy strategy
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new NoSlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        //     error.logMessageToConsole();
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding = ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaNoSliding;
class ShapeSpaceConfiguratorWithInflectionsSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithInflectionsSliding = ShapeSpaceConfiguratorWithInflectionsSliding;
class ShapeSpaceConfiguratorWithCurvatureExtremaSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithCurvatureExtremaSliding = ShapeSpaceConfiguratorWithCurvatureExtremaSliding;
class ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        shapeSpaceDiffEventsStructure.activeControlInflections = true;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding = ShapeSpaceConfiguratorWithInflectionsAndCurvatureExtremaSliding;
class ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding extends ShapeSpaceConfiguration {
    constructor(curveShapeSpaceNavigator) {
        super();
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        const curveToAnalyze = this.shapeNavigableCurve.curveCategory.curveModel;
        if (curveToAnalyze instanceof CurveModel_1.CurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else if (curveToAnalyze instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this.shapeNavigableCurve.curveCategory.curveModel.removeObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
            this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(curveToAnalyze.spline);
            this.shapeNavigableCurve.curveCategory.curveModel.registerObserver(this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents, "control points");
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "inconsistent object type. Cannot configure shape space.");
            error.logMessage();
        }
    }
    monitorCurveUsingDifferentialEvents(shapeSpaceDiffEventsStructure) {
        shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        shapeSpaceDiffEventsStructure.activeControlInflections = false;
        shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
        // this.curveShapeSpaceNavigator.shapeSpaceDiffEventsConfigurator = this;
        // this.curveShapeSpaceNavigator.navigationCurveModel.shapeSpaceDiffEventsConfigurator = this;
        // JCL Should be a dummy strategy
        // if(this.shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel) {
        //     this.curveShapeSpaceNavigator.navigationCurveModel.curveControl = new SlidingStrategy(this.shapeNavigableCurve.curveCategory.curveModel, shapeSpaceDiffEventsStructure.activeControlInflections,
        //         shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema, this.curveShapeSpaceNavigator);
        // } else {
        //     const error = new ErrorLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", "Not yet able to handle closed curve optimization");
        // }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding = ShapeSpaceConfiguratorWithoutInflectionsAndCurvatureExtremaSliding;
