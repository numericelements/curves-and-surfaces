"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleNoDiffEventSlidingState = exports.HandleInflectionsAndCurvatureExtremaSlidingState = exports.HandleCurvatureExtremaSlidingState = exports.HandleInflectionsSlidingState = exports.HandleNoDiffEventNoSlidingState = exports.HandleInflectionsAndCurvatureExtremaNoSlidingState = exports.HandleCurvatureExtremaNoSlidingState = exports.HandleInflectionsNoSlidingState = exports.CurveControlState = void 0;
const ClosedCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractor");
const ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/ClosedCurveDifferentialEventsExtractorWithoutSequence");
const OpenCurveDifferentialEventsExtractor_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractor");
const OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("../curveShapeSpaceAnalysis/OpenCurveDifferentialEventsExtractorWithoutSequence");
const NavigationCurveModel_1 = require("../curveShapeSpaceNavigation/NavigationCurveModel");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const CurveModel_1 = require("../newModels/CurveModel");
const CurveShapeMonitoringStrategy_1 = require("./CurveShapeMonitoringStrategy");
class CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        this.curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this.shapeSpaceDiffEventsStructure = this.curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this.shapeNavigableCurve = this.curveShapeSpaceNavigator.shapeNavigableCurve;
        this._curveControlParamChange = true;
    }
    get curveControlParamChange() {
        return this._curveControlParamChange;
    }
    set curveControlParamChange(curveControlParamChange) {
        this._curveControlParamChange = curveControlParamChange;
    }
}
exports.CurveControlState = CurveControlState;
class HandleInflectionsNoSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflexionsNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleInflectionsNoSlidingState = HandleInflectionsNoSlidingState;
class HandleCurvatureExtremaNoSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleCurvatureExtremaNoSlidingState = HandleCurvatureExtremaNoSlidingState;
class HandleInflectionsAndCurvatureExtremaNoSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleInflectionsAndCurvatureExtremaNoSlidingState = HandleInflectionsAndCurvatureExtremaNoSlidingState;
class HandleNoDiffEventNoSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
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
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleNoDiffEventNoSlidingState = HandleNoDiffEventNoSlidingState;
class HandleInflectionsSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflexionsSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleInflectionsSlidingState = HandleInflectionsSlidingState;
class HandleCurvatureExtremaSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleCurvatureExtremaSlidingState = HandleCurvatureExtremaSlidingState;
class HandleInflectionsAndCurvatureExtremaSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = true;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = true;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = true;
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = true;
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
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsAndCurvatureExtremaNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithInflectionsAndCurvatureExtremaSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleInflectionsAndCurvatureExtremaSlidingState = HandleInflectionsAndCurvatureExtremaSlidingState;
class HandleNoDiffEventSlidingState extends CurveControlState {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer = false;
        this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema = false;
        this.shapeSpaceDiffEventsStructure.activeControlInflections = false;
        // The sliding state cannot be active when control of inflections and curvature extrema are deactivated
        this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents = false;
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
        this.shapeNavigableCurve.curveCategory.curveModelDifferentialEventsLocations = this.shapeNavigableCurve.curveCategory.curveModelDifferentialEvents.crvDiffEventsLocations;
        this.monitorCurveShape();
    }
    handleInflections() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleInflectionsSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleCurvatureExtrema() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleCurvatureExtremaSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    handleSliding() {
        this.curveShapeSpaceNavigator.transitionTo(new HandleNoDiffEventNoSlidingState(this.curveShapeSpaceNavigator));
        if (this._curveControlParamChange) {
            this.shapeNavigableCurve.notifyObservers();
            this._curveControlParamChange = false;
        }
    }
    monitorCurveShape() {
        this.curveShapeSpaceNavigator.curveControlState = this;
        this.curveShapeSpaceNavigator.navigationCurveModel.curveControlState = this;
        if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.OpenCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        else if (this.curveShapeSpaceNavigator.navigationCurveModel instanceof NavigationCurveModel_1.ClosedCurveShapeSpaceNavigator) {
            this.curveShapeSpaceNavigator.navigationCurveModel.changeCurveShapeMonitoring(new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventSliding(this.curveShapeSpaceNavigator.navigationCurveModel));
        }
        const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "monitorCurveUsingDifferentialEvents", " activeNavigationWithOptimizer : " + this.shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer
            + " activeControlCurvatureExtrema: " + this.shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema
            + " activeControlInflections: " + this.shapeSpaceDiffEventsStructure.activeControlInflections
            + " slidingDifferentialEvents: " + this.shapeSpaceDiffEventsStructure.slidingDifferentialEvents);
        warning.logMessage();
    }
}
exports.HandleNoDiffEventSlidingState = HandleNoDiffEventSlidingState;
