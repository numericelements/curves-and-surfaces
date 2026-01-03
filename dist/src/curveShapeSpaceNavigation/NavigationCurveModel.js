"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveShapeSpaceNavigator = exports.OpenCurveShapeSpaceNavigator = exports.NavigationCurveModel = void 0;
const OptimizationProblemCtrlParameters_1 = require("../bsplineOptimizationProblems/OptimizationProblemCtrlParameters");
const CurveShapeMonitoringStrategy_1 = require("../controllers/CurveShapeMonitoringStrategy");
const ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties_1 = require("../curveShapeSpaceAnalysis/ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const Vector2d_1 = require("../mathVector/Vector2d");
const ClosedCurveModel_1 = require("../newModels/ClosedCurveModel");
const CurveModel_1 = require("../newModels/CurveModel");
const NeighboringEvents_1 = require("../sequenceOfDifferentialEvents/NeighboringEvents");
const CurveShapeSpaceDescriptor_1 = require("./CurveShapeSpaceDescriptor");
const NavigationState_1 = require("./NavigationState");
class NavigationCurveModel {
    constructor(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        this._shapeSpaceDiffEventsStructure = curveShapeSpaceNavigator.shapeSpaceDiffEventsStructure;
        this._curveControlState = this._curveShapeSpaceNavigator.curveControlState;
        this.controlOfInflections = this._shapeSpaceDiffEventsStructure.activeControlInflections;
        this.controlOfCurvatureExtrema = this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema;
        this.sliding = this._shapeSpaceDiffEventsStructure.slidingDifferentialEvents;
        this._shapeNavigableCurve = curveShapeSpaceNavigator.shapeNavigableCurve;
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get navigationState() {
        return this._navigationState;
    }
    get shapeSpaceDiffEventsStructure() {
        return this._shapeSpaceDiffEventsStructure;
    }
    // get activeExtremaLocationControl(): ActiveExtremaLocationControl {
    //     return this._activeExtremaLocationControl;
    // }
    get curveShapeMonitoringStrategy() {
        return this._curveShapeMonitoringStrategy;
    }
    set navigationState(navigationState) {
        this._navigationState = navigationState;
    }
    get curveControlState() {
        return this._curveControlState;
    }
    set curveControlState(curveControlState) {
        this._curveControlState = curveControlState;
    }
    set curveShapeMonitoringStrategy(curveShapeMonitoringStrategy) {
        this._curveShapeMonitoringStrategy = curveShapeMonitoringStrategy;
    }
    changeCurveShapeMonitoring(strategy) {
        this._curveShapeMonitoringStrategy = strategy;
    }
}
exports.NavigationCurveModel = NavigationCurveModel;
class OpenCurveShapeSpaceNavigator extends NavigationCurveModel {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this._displacementCurrentCurveControlPolygon = [];
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new CurveModel_1.CurveModel();
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        this._currentCurve = this.curveModel.spline;
        this.currentControlPolygon = this.currentCurve.controlPoints;
        this._selectedControlPoint = undefined;
        this.locationSelectedCP = new Vector2d_1.Vector2d(0, 0);
        this._targetCurve = this.curveModel.spline;
        this._optimizedCurve = this._currentCurve.clone();
        this.currentControlPolygon.forEach(() => this.displacementCurrentCurveControlPolygon.push(new Vector2d_1.Vector2d(0.0, 0.0)));
        this._curveShapeMonitoringStrategy = new CurveShapeMonitoringStrategy_1.OCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor_1.CurveShapeSpaceDescriptor(this._currentCurve);
        // this._eventMgmtAtCurveExtremities = new EventMgmtAtCurveExtremities();
        this._slidingEventsAtExtremities = new ExtractionCPClosestToZeroUnderEventSlidingAtExtremeties_1.CurveAnalyzerEventsSlidingOutOfInterval();
        // JCL Setting up the navigation state requires having defined the shapeSpaceDiffEventsStructure and its shapeSpaceDiffEventsConfigurator
        // JCL as well as the CurveShapeSpaceDescriptor
        this._navigationState = new NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring(this);
        this._curveShapeSpaceNavigator.navigationState = this._navigationState;
        // JCL requires the setting of the navigationState
        this.curveAnalyserCurrentCurve = this._navigationState.curveAnalyserCurrentCurve;
        this._seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = this._navigationState.curveAnalyserOptimizedCurve;
        this._seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        this.diffEvents = new NeighboringEvents_1.NeighboringEvents();
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters_1.OptimizationProblemCtrlParameters();
        this.changeNavigationState(this._navigationState);
        console.log("end constructor curveShapeSpaceNavigator");
    }
    get seqDiffEventsCurrentCurve() {
        return this._seqDiffEventsCurrentCurve;
    }
    get seqDiffEventsOptimizedCurve() {
        return this._seqDiffEventsOptimizedCurve;
    }
    set optimizationProblemParam(optimPbParam) {
        this._optimizationProblemParam = optimPbParam;
    }
    set selectedControlPoint(cpIndex) {
        if (cpIndex !== undefined) {
            this.selectedControlPoint = cpIndex;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'set', 'the control point index must not be of type undefined.');
            error.logMessage();
        }
    }
    // set eventMgmtAtCurveExtremities(eventMgmtAtCurveExtremities: EventMgmtAtCurveExtremities) {
    //     this._eventMgmtAtCurveExtremities = eventMgmtAtCurveExtremities;
    // }
    set optimizedCurve(aBSpline) {
        this._optimizedCurve = aBSpline.clone();
    }
    set currentCurve(curve) {
        this._currentCurve = curve.clone();
    }
    set adjacentShapeSpaceCurve(adjacentShapeSpaceCurve) {
        this._adjacentShapeSpaceCurve = adjacentShapeSpaceCurve;
    }
    ;
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    set seqDiffEventsCurrentCurve(seqDiffEventsCurrentCurve) {
        this._seqDiffEventsCurrentCurve = seqDiffEventsCurrentCurve;
    }
    set seqDiffEventsOptimizedCurve(seqDiffEventsOptimizedCurve) {
        this._seqDiffEventsOptimizedCurve = seqDiffEventsOptimizedCurve;
    }
    get optimizationProblemParam() {
        return this._optimizationProblemParam;
    }
    get selectedControlPoint() {
        if (this._selectedControlPoint !== undefined) {
            return this._selectedControlPoint;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
            error.logMessage();
        }
    }
    // get eventMgmtAtCurveExtremities(): EventMgmtAtCurveExtremities {
    //     return this._eventMgmtAtCurveExtremities;
    // }
    get currentCurve() {
        return this._currentCurve.clone();
    }
    get targetCurve() {
        return this._targetCurve.clone();
    }
    get optimizedCurve() {
        return this._optimizedCurve.clone();
    }
    get adjacentShapeSpaceCurve() {
        var _a;
        return (_a = this._adjacentShapeSpaceCurve) === null || _a === void 0 ? void 0 : _a.clone();
    }
    ;
    get displacementCurrentCurveControlPolygon() {
        return this._displacementCurrentCurveControlPolygon;
    }
    get slidingEventsAtExtremities() {
        return this._slidingEventsAtExtremities;
    }
    get curveModel() {
        return this._curveModel;
    }
    changeNavigationState(state) {
        this._navigationState = state;
        this.navigationState.setNavigationCurveModel(this);
    }
    navigateSpace(selectedControlPoint, x, y) {
        // const message = new WarningLog(this.constructor.name, "navigateSpace", this.navigationState.constructor.name + " "
        // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
        // message.logMessageToConsole();
        this._selectedControlPoint = selectedControlPoint;
        this.navigationState.navigate(selectedControlPoint, x, y);
    }
    // initializeNavigationStep(): void {
    //     const diffEventsExtractor = new CurveDifferentialEventsExtractor(this.currentCurve);
    //     this.seqDiffEventsCurrentCurve = diffEventsExtractor.generateSeqOfDiffEvents();
    //     this._optimizationProblemParam.updateConstraintBounds = true;
    // }
    updateCurrentCurve(newSelectedControlPoint, newDispSelctdCP) {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    }
    setTargetCurve() {
        if (this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessage();
        }
        if (this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
            // this.curveControl.optimizationProblem.setTargetSpline(this.targetCurve);
            this._curveShapeMonitoringStrategy.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    }
    resetCurveToOptimize() {
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof CurveModel_1.CurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new CurveModel_1.CurveModel();
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        this._curveShapeMonitoringStrategy.resetAfterCurveChange();
    }
    curveDisplacement() {
        for (let i = 0; i < this.displacementCurrentCurveControlPolygon.length; i += 1) {
            this.displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    }
}
exports.OpenCurveShapeSpaceNavigator = OpenCurveShapeSpaceNavigator;
class ClosedCurveShapeSpaceNavigator extends NavigationCurveModel {
    constructor(curveShapeSpaceNavigator) {
        super(curveShapeSpaceNavigator);
        this._displacementCurrentCurveControlPolygon = [];
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        // this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
        //     this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        this._currentCurve = this.curveModel.spline;
        this.currentControlPolygon = this.currentCurve.controlPoints.slice();
        this._selectedControlPoint = undefined;
        this.locationSelectedCP = new Vector2d_1.Vector2d(0, 0);
        this._targetCurve = this.curveModel.spline;
        this._optimizedCurve = this._currentCurve.clone();
        this.currentControlPolygon.forEach(() => this._displacementCurrentCurveControlPolygon.push(new Vector2d_1.Vector2d(0.0, 0.0)));
        this._curveShapeMonitoringStrategy = new CurveShapeMonitoringStrategy_1.CCurveShapeMonitoringStrategyWithNoDiffEventNoSliding(this);
        this._shapeSpaceDescriptor = new CurveShapeSpaceDescriptor_1.CurveShapeSpaceDescriptor(this._currentCurve);
        this._navigationState = new NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring(this);
        this._curveShapeSpaceNavigator.navigationState = this._navigationState;
        this.curveAnalyserCurrentCurve = this.navigationState.curveAnalyserCurrentCurve;
        this._seqDiffEventsCurrentCurve = this.curveAnalyserCurrentCurve.sequenceOfDifferentialEvents;
        this.curveAnalyserOptimizedCurve = this.navigationState.curveAnalyserOptimizedCurve;
        this._seqDiffEventsOptimizedCurve = this.curveAnalyserOptimizedCurve.sequenceOfDifferentialEvents;
        // JCL temporary setting before adapting the optimization problem setting to closed curves
        // const dummyCurveModel = new CurveModel()
        this._optimizationProblemParam = new OptimizationProblemCtrlParameters_1.OptimizationProblemCtrlParameters();
    }
    get seqDiffEventsCurrentCurve() {
        return this._seqDiffEventsCurrentCurve;
    }
    get seqDiffEventsOptimizedCurve() {
        return this._seqDiffEventsOptimizedCurve;
    }
    get currentCurve() {
        return this._currentCurve.clone();
    }
    get targetCurve() {
        return this._targetCurve.clone();
    }
    get optimizedCurve() {
        return this._optimizedCurve.clone();
    }
    get adjacentShapeSpaceCurve() {
        var _a;
        return (_a = this._adjacentShapeSpaceCurve) === null || _a === void 0 ? void 0 : _a.clone();
    }
    get optimizationProblemParam() {
        return this._optimizationProblemParam;
    }
    get selectedControlPoint() {
        if (this._selectedControlPoint !== undefined) {
            return this._selectedControlPoint;
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'get', 'the selected control point has a status undefined.');
            error.logMessage();
        }
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    get displacementCurrentCurveControlPolygon() {
        return this._displacementCurrentCurveControlPolygon;
    }
    get curveModel() {
        return this._curveModel;
    }
    set currentCurve(curve) {
        this._currentCurve = curve.clone();
    }
    set optimizedCurve(aBSpline) {
        this._optimizedCurve = aBSpline.clone();
    }
    set adjacentShapeSpaceCurve(adjacentShapeSpaceCurve) {
        this._adjacentShapeSpaceCurve = adjacentShapeSpaceCurve;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    set seqDiffEventsCurrentCurve(seqDiffEventsCurrentCurve) {
        this._seqDiffEventsCurrentCurve = seqDiffEventsCurrentCurve;
    }
    set seqDiffEventsOptimizedCurve(seqDiffEventsOptimizedCurve) {
        this._seqDiffEventsOptimizedCurve = seqDiffEventsOptimizedCurve;
    }
    changeNavigationState(state) {
        this._navigationState = state;
        this._navigationState.setNavigationCurveModel(this);
    }
    setTargetCurve() {
        if (this.selectedControlPoint !== undefined) {
            this._targetCurve = this._currentCurve.clone();
            this._targetCurve.setControlPointPosition(this.selectedControlPoint, this.locationSelectedCP);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'setTargetCurve', 'the index of the selected control point is undefined.');
            error.logMessage();
        }
        if (this._shapeSpaceDiffEventsStructure.activeNavigationWithOptimizer) {
            this._curveShapeMonitoringStrategy.optimizationProblem.setTargetSpline(this.targetCurve);
            // this.optimizationProblem.setTargetSpline(this.targetCurve);
        }
    }
    resetCurveToOptimize() {
        if (this._shapeNavigableCurve.curveCategory.curveModel instanceof ClosedCurveModel_1.ClosedCurveModel) {
            this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        }
        else {
            this._curveModel = new ClosedCurveModel_1.ClosedCurveModel();
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'constructor', "curve model is undefined. Cannot proceed.");
            error.logMessage();
        }
        // this._curveControl = new DummyStrategy(this.curveModel, this._shapeSpaceDiffEventsStructure.activeControlInflections,
        //     this._shapeSpaceDiffEventsStructure.activeControlCurvatureExtrema);
        this._curveShapeMonitoringStrategy.resetAfterCurveChange();
    }
    updateCurrentCurve(newSelectedControlPoint, newDispSelctdCP) {
        //this.curveModel = newCurve;
        //this._currentCurve = newCurve.spline.clone();
        this.currentControlPolygon = this._currentCurve.controlPoints.slice();
        this._selectedControlPoint = newSelectedControlPoint;
        this.locationSelectedCP = newDispSelctdCP;
    }
    navigateSpace(selectedControlPoint, x, y) {
        let message = new ErrorLoging_1.WarningLog(this.constructor.name, "navigateSpace", this._navigationState.constructor.name + " "
            // + this._shapeSpaceDiffEventsConfigurator.constructor.name + " ");
            + this._curveControlState.constructor.name);
        message.logMessage();
        this._selectedControlPoint = selectedControlPoint;
        this._navigationState.navigate(selectedControlPoint, x, y);
    }
    curveDisplacement() {
        for (let i = 0; i < this._displacementCurrentCurveControlPolygon.length; i += 1) {
            this._displacementCurrentCurveControlPolygon[i] = this.optimizedCurve.controlPoints[i].substract(this.currentControlPolygon[i]);
        }
    }
}
exports.ClosedCurveShapeSpaceNavigator = ClosedCurveShapeSpaceNavigator;
