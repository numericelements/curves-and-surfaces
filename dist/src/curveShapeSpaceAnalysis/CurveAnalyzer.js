"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClosedCurveDummyAnalyzer = exports.ClosedCurveAnalyzer = exports.OPenCurveDummyAnalyzer = exports.OpenCurveAnalyzer = exports.AbstractCurveAnalyzer = void 0;
const SequenceOfDifferentialEvents_1 = require("../../src/sequenceOfDifferentialEvents/SequenceOfDifferentialEvents");
const OpenCurveDifferentialEventsExtractor_1 = require("./OpenCurveDifferentialEventsExtractor");
const ExtremumLocationClassifiier_1 = require("./ExtremumLocationClassifiier");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ClosedCurveDifferentialEventsExtractor_1 = require("./ClosedCurveDifferentialEventsExtractor");
const OpenCurveDifferentialEventsExtractorWithoutSequence_1 = require("./OpenCurveDifferentialEventsExtractorWithoutSequence");
const ClosedCurveDifferentialEventsExtractorWithoutSequence_1 = require("./ClosedCurveDifferentialEventsExtractorWithoutSequence");
const BSplineR1toR1_1 = require("../newBsplines/BSplineR1toR1");
class AbstractCurveAnalyzer {
    constructor(curveToAnalyze, navigationCurveModel) {
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._curveCurvatureCntrlPolygon = [];
        this._curvatureCrtlPtsClosestToZero = [];
        this._curvatureSignChanges = [];
        this._curvatureDerivativeSignChanges = [];
        this._curveCurvatureDerivativeCntrlPolygon = [];
        this._curvatureDerivCrtlPtsClosestToZero = [];
    }
    get curvatureSignChanges() {
        return this._curvatureSignChanges.slice();
    }
    get curveCurvatureCntrlPolygon() {
        return this._curveCurvatureCntrlPolygon.slice();
    }
    get curvatureCrtlPtsClosestToZero() {
        return this._curvatureCrtlPtsClosestToZero.slice();
    }
    get curvatureDerivativeSignChanges() {
        return this._curvatureDerivativeSignChanges.slice();
    }
    get curveCurvatureDerivativeCntrlPolygon() {
        return this._curveCurvatureDerivativeCntrlPolygon.slice();
    }
    get curvatureDerivCrtlPtsClosestToZero() {
        return this._curvatureDerivCrtlPtsClosestToZero.slice();
    }
    get curvatureNumerator() {
        return this._curvatureNumerator;
    }
    get curvatureDerivativeNumerator() {
        return this._curvatureDerivativeNumerator;
    }
    getGlobalExtremmumOffAxis(controlPoints) {
        const localMinima = new ExtremumLocationClassifiier_1.ExtremumLocationClassifier(controlPoints);
        const validGlobalMinimum = localMinima.getGlobalMinimum();
        const localMaxima = new ExtremumLocationClassifiier_1.ExtremumLocationClassifier(controlPoints);
        const validGlobalMaximum = localMaxima.getGlobalMaximum();
        if (validGlobalMinimum && validGlobalMaximum && Math.abs(localMinima.globalExtremum.value) > Math.abs(localMaxima.globalExtremum.value)) {
            return localMaxima.globalExtremum;
        }
        else if (validGlobalMinimum && validGlobalMaximum) {
            return localMinima.globalExtremum;
        }
        else if (validGlobalMinimum) {
            return localMinima.globalExtremum;
        }
        else if (validGlobalMaximum) {
            return localMaxima.globalExtremum;
        }
        else
            return { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
    }
    getControlPointsSign(controlPoints) {
        let result = [];
        for (let i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        return result;
    }
    getSignChangesControlPolygon(controlPointsSigns) {
        let signChangesControlPolygon = [];
        let previousSign = controlPointsSigns[0];
        for (let i = 1, n = controlPointsSigns.length; i < n; i += 1) {
            if (previousSign !== controlPointsSigns[i]) {
                signChangesControlPolygon.push(i - 1);
            }
            previousSign = controlPointsSigns[i];
        }
        return signChangesControlPolygon;
    }
    updateCurrent() {
        this.curve = this.navigationCurveModel.currentCurve;
        this.update();
    }
    updateOptimized() {
        this.curve = this.navigationCurveModel.optimizedCurve;
        this.update();
    }
}
exports.AbstractCurveAnalyzer = AbstractCurveAnalyzer;
class OpenCurveAnalyzer extends AbstractCurveAnalyzer {
    constructor(curveToAnalyze, navigationCurveModel, slidingEventsAtExtremities) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (this._curveControlState) {
            this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
            this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureCntrlPolygon);
            this._curvatureSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureCntrlPolygon);
            this.computeCurvatureCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessage();
        }
        this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (this._curveControlState) {
            this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
            this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureDerivativeCntrlPolygon);
            this._curvatureDerivativeSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureDerivativeCntrlPolygon);
            this.computeCurvatureDerivCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature deriv control polygon.');
            warning.logMessage();
        }
    }
    get sequenceOfDifferentialEvents() {
        return (0, SequenceOfDifferentialEvents_1.deepCopySequenceOfDifferentialEvents)(this._sequenceOfDifferentialEvents);
    }
    get curveControlState() {
        return this._curveControlState;
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    get slidingEventsAtExtremities() {
        return this._slidingEventsAtExtremities;
    }
    set slidingEventsAtExtremities(slidingEventsAtExtremities) {
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    }
    setStrategyForSlidingEventsAtExtremitities(slidingEventsAtExtremities) {
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
    }
    computeCurvatureCPClosestToZero() {
        this._slidingEventsAtExtremities.getCurvatureCrtlPtsClosestToZero(this);
    }
    computeCurvatureDerivCPClosestToZero() {
        this._slidingEventsAtExtremities.getCurvatureDerivCrtlPtsClosestToZero(this);
    }
    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }
    update() {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractor_1.OpenCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    }
}
exports.OpenCurveAnalyzer = OpenCurveAnalyzer;
class OPenCurveDummyAnalyzer extends AbstractCurveAnalyzer {
    constructor(curveToAnalyze, navigationCurveModel, slidingEventsAtExtremities) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this._slidingEventsAtExtremities = slidingEventsAtExtremities;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
    }
    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    get curveControlState() {
        return this._curveControlState;
    }
    computeCurvatureCPClosestToZero() {
    }
    computeCurvatureDerivCPClosestToZero() {
    }
    update() {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new OpenCurveDifferentialEventsExtractorWithoutSequence_1.OpenCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    }
}
exports.OPenCurveDummyAnalyzer = OPenCurveDummyAnalyzer;
class ClosedCurveAnalyzer extends AbstractCurveAnalyzer {
    constructor(curveToAnalyze, navigationCurveModel) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (this._curveControlState) {
            this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
            this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureCntrlPolygon);
            this._curvatureSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureCntrlPolygon);
            this.computeCurvatureCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature control polygon.');
            warning.logMessage();
        }
        this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        if (this._curveControlState) {
            this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
            this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this._curveCurvatureDerivativeCntrlPolygon);
            this._curvatureDerivativeSignChanges = this.getSignChangesControlPolygon(this._curveCurvatureDerivativeCntrlPolygon);
            this.computeCurvatureDerivCPClosestToZero();
        }
        else {
            warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'Cannot initialize consistently curvature deriv control polygon.');
            warning.logMessage();
        }
    }
    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }
    get curveControlState() {
        return this._curveControlState;
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    // set curvatureCrtlPtsClosestToZero(controlPolygon: number[]) {
    //     this._curvatureCrtlPtsClosestToZero = controlPolygon;
    // }
    computeCurvatureCPClosestToZero() {
    }
    computeCurvatureDerivCPClosestToZero() {
    }
    update() {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractor_1.ClosedCurveDifferentialEventsExtractor(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    }
}
exports.ClosedCurveAnalyzer = ClosedCurveAnalyzer;
class ClosedCurveDummyAnalyzer extends AbstractCurveAnalyzer {
    constructor(curveToAnalyze, navigationCurveModel) {
        super(curveToAnalyze, navigationCurveModel);
        let warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'constructor', 'start constructor.');
        warning.logMessage();
        this._curvatureNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this._curvatureDerivativeNumerator = new BSplineR1toR1_1.BSplineR1toR1();
        this.curve = curveToAnalyze;
        this.navigationCurveModel = navigationCurveModel;
        this.navigationState = navigationCurveModel.navigationState;
        this._shapeSpaceDescriptor = navigationCurveModel.shapeSpaceDescriptor;
        this._curveControlState = navigationCurveModel.curveShapeSpaceNavigator.curveControlState;
        this.globalExtremumOffAxisCurvaturePoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this.globalExtremumOffAxisCurvatureDerivPoly = { index: ExtremumLocationClassifiier_1.INITIAL_INDEX, value: 0.0 };
    }
    get sequenceOfDifferentialEvents() {
        return this._sequenceOfDifferentialEvents;
    }
    get curveControlState() {
        return this._curveControlState;
    }
    get shapeSpaceDescriptor() {
        return this._shapeSpaceDescriptor;
    }
    computeCurvatureCPClosestToZero() {
    }
    computeCurvatureDerivCPClosestToZero() {
    }
    update() {
        // this.curve = this.navigationCurveModel.currentCurve;
        const diffEventsExtractor = new ClosedCurveDifferentialEventsExtractorWithoutSequence_1.ClosedCurveDifferentialEventsExtractorWithoutSequence(this.curve);
        this._sequenceOfDifferentialEvents = diffEventsExtractor.extractSeqOfDiffEvents();
        this._curveCurvatureCntrlPolygon = diffEventsExtractor.curvatureNumerator.controlPoints;
        this.globalExtremumOffAxisCurvaturePoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureCntrlPolygon);
        this._curveCurvatureDerivativeCntrlPolygon = diffEventsExtractor.curvatureDerivativeNumerator.controlPoints;
        this.globalExtremumOffAxisCurvatureDerivPoly = this.getGlobalExtremmumOffAxis(this.curveCurvatureDerivativeCntrlPolygon);
        this._curvatureNumerator = diffEventsExtractor.curvatureNumerator;
        this._curvatureDerivativeNumerator = diffEventsExtractor.curvatureDerivativeNumerator;
    }
}
exports.ClosedCurveDummyAnalyzer = ClosedCurveDummyAnalyzer;
