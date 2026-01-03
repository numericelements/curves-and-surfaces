"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneEventListener = exports.ShapeSpaceNavigationEventListener = exports.CurveModelDefinitionEventListener = exports.FileEventListener = exports.ChartEventListener = exports.UserInterfaceEventListener = void 0;
const ChartSceneController_1 = require("../chartcontrollers/ChartSceneController");
const CurveSceneController_1 = require("../controllers/CurveSceneController");
const ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
const CurveShapeSpaceNavigator_1 = require("../curveShapeSpaceNavigation/CurveShapeSpaceNavigator");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const FileController_1 = require("../filecontrollers/FileController");
const AbstractCurveModel_1 = require("../newModels/AbstractCurveModel");
const CurveModelObserver_1 = require("../models/CurveModelObserver");
const webgl_utils_1 = require("../webgl/webgl-utils");
const cuon_utils_1 = require("../webgl/cuon-utils");
const CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
const NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
class UserInterfaceEventListener {
}
exports.UserInterfaceEventListener = UserInterfaceEventListener;
class ChartEventListener extends UserInterfaceEventListener {
    // private  static a: ChartEventListener
    constructor(shapeNavigableCurve) {
        super();
        this.chartRenderingContext = [];
        // ChartEventListener.a = this
        this._curveModel = shapeNavigableCurve.curveCategory.curveModel;
        this._shapeNavigableCurve = shapeNavigableCurve;
        this.canvasChart1 = document.getElementById('chart1');
        this.canvasChart2 = document.getElementById('chart2');
        this.canvasChart3 = document.getElementById('chart3');
        this.checkBoxFunctionA = document.getElementById("chkBoxFunctionA");
        this.checkBoxFunctionB = document.getElementById("chkBoxFunctionB");
        this.checkBoxFunctionBsqrtScaled = document.getElementById("chkBoxSqrtFunctionB");
        this.checkBoxCurvature = document.getElementById("chkBoxCurvature");
        this.checkBoxAbsCurvature = document.getElementById("chkBoxAbsCurvature");
        this.chartFunctionA = false;
        this.chartFunctionB = false;
        this.chartCurvatureCrv = false;
        this.chartAbsCurvatureCurv = false;
        this.chartFunctionBsqrtScaled = false;
        this.noAddChart = false;
        this.ctxChart1 = this.canvasChart1.getContext('2d');
        this.ctxChart2 = this.canvasChart2.getContext('2d');
        this.ctxChart3 = this.canvasChart3.getContext('2d');
        this.setupChartRenderingContexts();
        this._chartSceneController = new ChartSceneController_1.ChartSceneController(this.chartRenderingContext, this._shapeNavigableCurve);
        this._shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInChartEventListener(this));
        /* Add event handlers for checkbox processing */
        this.checkBoxFunctionA.addEventListener('click', this.chkboxFunctionA.bind(this));
        this.checkBoxFunctionB.addEventListener('click', this.chkboxFunctionB.bind(this));
        this.checkBoxFunctionBsqrtScaled.addEventListener('click', this.chkboxFunctionBsqrtScaled.bind(this));
        this.checkBoxCurvature.addEventListener('click', this.chkboxCurvature.bind(this));
        this.checkBoxAbsCurvature.addEventListener('click', this.chkboxAbsCurvature.bind(this));
    }
    get chartSceneController() {
        return this._chartSceneController;
    }
    get curveModel() {
        return this._curveModel;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    setupChartRenderingContexts() {
        if (this.ctxChart1 !== null)
            this.chartRenderingContext.push(this.ctxChart1);
        if (this.ctxChart2 !== null)
            this.chartRenderingContext.push(this.ctxChart2);
        if (this.ctxChart3 !== null)
            this.chartRenderingContext.push(this.ctxChart3);
        if (this.ctxChart1 === null || this.ctxChart2 === null || this.ctxChart3 === null) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "setupChartRenderingContexts", "Unable to get one or more CanvasRenderingContext2D required to process charts.");
            error.logMessage();
        }
    }
    uncheckCkbox() {
        console.log("uncheckChart " + this._chartSceneController.uncheckedChart);
        if (ChartSceneController_1.CHART_TITLES.indexOf(this._chartSceneController.uncheckedChart) !== -1) {
            this.noAddChart = true;
            switch (this._chartSceneController.uncheckedChart) {
                case ChartSceneController_1.CHART_TITLES[0]:
                    console.log("uncheck " + ChartSceneController_1.CHART_TITLES[0]);
                    this.checkBoxFunctionA.click();
                    break;
                case ChartSceneController_1.CHART_TITLES[1]:
                    console.log("uncheck " + ChartSceneController_1.CHART_TITLES[1]);
                    this.checkBoxFunctionB.click();
                    break;
                case ChartSceneController_1.CHART_TITLES[2]:
                    console.log("uncheck " + ChartSceneController_1.CHART_TITLES[2]);
                    this.checkBoxCurvature.click();
                    break;
                case ChartSceneController_1.CHART_TITLES[3]:
                    console.log("uncheck " + ChartSceneController_1.CHART_TITLES[3]);
                    this.checkBoxAbsCurvature.click();
                    break;
                case ChartSceneController_1.CHART_TITLES[4]:
                    console.log("uncheck " + ChartSceneController_1.CHART_TITLES[4]);
                    this.checkBoxFunctionBsqrtScaled.click();
                    break;
            }
        }
        this._chartSceneController.resetUncheckedChart();
        this.noAddChart = false;
    }
    chkboxFunctionA() {
        // if(ChartEventListener.a.chartFunctionA) {
        if (this.chartFunctionA) {
            this.chartFunctionA = false;
            if (!this.noAddChart)
                this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[0]);
        }
        else {
            this.chartFunctionA = true;
            this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[0]);
            this.uncheckCkbox();
        }
    }
    chkboxFunctionB() {
        if (this.chartFunctionB) {
            this.chartFunctionB = false;
            if (!this.noAddChart)
                this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[1]);
        }
        else {
            this.chartFunctionB = true;
            this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[1]);
            this.uncheckCkbox();
        }
    }
    chkboxFunctionBsqrtScaled() {
        if (this.chartFunctionBsqrtScaled) {
            this.chartFunctionBsqrtScaled = false;
            if (!this.noAddChart)
                this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[4]);
        }
        else {
            this.chartFunctionBsqrtScaled = true;
            this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[4]);
            this.uncheckCkbox();
        }
    }
    chkboxCurvature() {
        if (this.chartCurvatureCrv) {
            this.chartCurvatureCrv = false;
            if (!this.noAddChart)
                this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[2]);
        }
        else {
            this.chartCurvatureCrv = true;
            this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[2]);
            this.uncheckCkbox();
        }
    }
    chkboxAbsCurvature() {
        if (this.chartAbsCurvatureCurv) {
            this.chartAbsCurvatureCurv = false;
            if (!this.noAddChart)
                this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[3]);
        }
        else {
            this.chartAbsCurvatureCurv = true;
            this._chartSceneController.addChart(ChartSceneController_1.CHART_TITLES[3]);
            this.uncheckCkbox();
        }
    }
    resetChartContext() {
        this._chartSceneController.restart(this._curveModel);
        this.noAddChart = true;
        if (this.chartFunctionA)
            this.checkBoxFunctionA.click();
        if (this.chartFunctionB)
            this.checkBoxFunctionB.click();
        if (this.chartCurvatureCrv)
            this.checkBoxCurvature.click();
        if (this.chartAbsCurvatureCurv)
            this.checkBoxAbsCurvature.click();
        if (this.chartFunctionBsqrtScaled)
            this.checkBoxFunctionBsqrtScaled.click();
        this.noAddChart = false;
    }
}
exports.ChartEventListener = ChartEventListener;
class FileEventListener extends UserInterfaceEventListener {
    constructor(curveModelEventListener, curveSceneController) {
        super();
        this._shapeNavigableCurve = curveModelEventListener.shapeNavigableCurve;
        this._curveModel = curveModelEventListener.curveModel;
        this.curveSceneController = curveSceneController;
        /* JCL 2020/10/13 Get input IDs for file management purposes */
        this.buttonFileLoad = document.getElementById("buttonFileLoad");
        this.buttonFileSave = document.getElementById("buttonFileSave");
        this.inputFileLoad = document.getElementById("inputFileLoad");
        this.inputFileSave = document.getElementById("inputFileSave");
        this.inputFileName = document.getElementById("inputFileName");
        this.validateInput = document.getElementById("validateInput");
        this.labelFileExtension = document.getElementById("labelFileExtension");
        this.fileR = new FileReader();
        this._fileController = new FileController_1.FileController(this.shapeNavigableCurve, this.curveSceneController);
        this.currentFileName = "";
        this.shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInFileEventListener(this));
        /* JCL 2020/10/13 Add event handlers for file processing */
        this.buttonFileLoad.addEventListener('click', this.buttonFileLoadCurve.bind(this));
        this.buttonFileSave.addEventListener('click', this.buttonFileSaveCurve.bind(this));
        this.inputFileLoad.addEventListener('input', this.inputLoadFileCurve.bind(this));
        this.inputFileSave.addEventListener('input', this.inputSaveFileCurve.bind(this));
        this.inputFileName.addEventListener('input', this.inputCurveFileName.bind(this));
        this.validateInput.addEventListener('click', this.inputButtonValidate.bind(this));
        this.fileR.addEventListener('load', this.processInputFile.bind(this));
    }
    get fileController() {
        return this._fileController;
    }
    get curveModel() {
        return this._curveModel;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    buttonFileLoadCurve(ev) {
        if (this.inputFileLoad !== null)
            this.inputFileLoad.click();
    }
    buttonFileSaveCurve(ev) {
        if (this.currentFileName === "") {
            this.inputFileName.style.display = "inline";
            this.labelFileExtension.style.display = "inline";
            this.validateInput.style.display = "inline";
        }
        else {
            this._fileController.saveCurveToFile(this.currentFileName);
        }
        ev.preventDefault();
    }
    inputLoadFileCurve() {
        var _a;
        if (this.inputFileLoad !== null) {
            let aFileList = this.inputFileLoad.files;
            if (aFileList !== null && aFileList.length > 0) {
                if (((_a = aFileList.item(0)) === null || _a === void 0 ? void 0 : _a.name) !== undefined) {
                    let curveFile = aFileList.item(0);
                    if (curveFile !== null) {
                        this.inputFileLoad.value = "";
                        this.currentFileName = curveFile.name;
                        if (this.currentFileName.indexOf(".json") !== -1) {
                            this.fileR.readAsText(curveFile);
                        }
                        else if (this.currentFileName.indexOf(".png") !== -1) {
                            console.log("read an image");
                            this.fileR.readAsArrayBuffer(curveFile);
                            /* for test purposes to load an image
                            // iconKnotInsertion.src = currentFileName
                            //imageFile = curveFile*/
                        }
                    }
                }
            }
        }
    }
    inputSaveFileCurve() {
    }
    inputCurveFileName() {
    }
    inputButtonValidate() {
        this.currentFileName = this.inputFileName.value;
        console.log("inputButtonValidate:" + this.inputFileName.value);
        this.inputFileName.style.display = "none";
        this.labelFileExtension.style.display = "none";
        this.validateInput.style.display = "none";
        this._fileController.saveCurveToFile(this.currentFileName);
    }
    getFileContent(ev) {
        if (ev.target !== null)
            console.log("Reading the file: " + this.currentFileName);
        if (this.fileR.readyState === this.fileR.DONE) {
            if (this.fileR.result !== null) {
                this.currentFileName = "";
                if (typeof this.fileR.result === "string") {
                    this.currentFileName = this.fileR.result.toString();
                    return;
                }
                else {
                    /* JCL 2020/10/16 fileR.result is of type ArrayBuffer */
                    if (this.currentFileName.indexOf(".png") !== -1) {
                        console.log("Input file is an image. No need to reinitialize curve controls.");
                        return;
                    }
                }
            }
            else {
                const error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Error when reading the input file. Incorrect text format.");
                error.logMessage();
            }
        }
    }
    processInputFile(ev) {
        this.getFileContent(ev);
        const aSpline = this._fileController.loadCurveFromFile(this.currentFileName);
        if (typeof (aSpline) !== "undefined") {
            this._fileController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
            this.curveModel = this._fileController.curveModel;
            if (this.curveModel === undefined) {
                const error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to get a curveModel to restart the chartSceneController.");
                error.logMessage();
                return;
            }
        }
        else {
            const error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to reset the curve context. Undefined curve model.");
            error.logMessage();
        }
    }
}
exports.FileEventListener = FileEventListener;
class CurveModelDefinitionEventListener extends UserInterfaceEventListener {
    constructor() {
        super();
        /* Get selector ID for curve category and degree*/
        this._currentCurveDegree = "3";
        this._currentCurveCategory = "0";
        this._inputCurveCategory = document.getElementById("curveCategory");
        this._inputDegree = document.getElementById("curveDegree");
        this._toggleButtonCurveClamping = document.getElementById("toggleButtonCurveClamping");
        this._curveShapeSpaceNavigator = undefined;
        this._shapeNavigableCurve = new ShapeNavigableCurve_1.ShapeNavigableCurve();
        this._curveModel = this._shapeNavigableCurve.curveCategory.curveModel;
        // this._curveModel.registerObserver(this, "curve");
        // Initizalizes clamped points monitoring in accordance with navigation modes:
        //      mode 0: controlOfCurveClamping = false,
        //      mode 1, mode 2: controlOfCurveClamping =  true
        this.controlOfCurveClamping = false;
        this.previousControlOfCurveClamping = false;
        this._shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInCurveModelEventListener(this));
        /* JCL  Add event handlers for curve degree and curve category selection processing */
        this._inputDegree.addEventListener('input', this.inputSelectDegree.bind(this));
        this._inputDegree.addEventListener('click', this.clickSelectDegree.bind(this));
        this._inputCurveCategory.addEventListener('input', this.inputSelectCurveCategory.bind(this));
        this._inputCurveCategory.addEventListener('click', this.clickCurveCategory.bind(this));
        this._toggleButtonCurveClamping.addEventListener('click', this.toggleCurveClamping.bind(this));
    }
    get currentCurveDegree() {
        return this._currentCurveDegree;
    }
    get inputDegree() {
        return this._inputDegree;
    }
    get curveModel() {
        return this._curveModel;
    }
    get shapeNavigableCurve() {
        return this._shapeNavigableCurve;
    }
    get curveShapeSpaceNavigator() {
        if (this._curveShapeSpaceNavigator !== undefined) {
            return this._curveShapeSpaceNavigator;
        }
        else {
            return undefined;
        }
    }
    set currentCurveDegree(curveDegree) {
        this._currentCurveDegree = curveDegree;
    }
    set curveModel(curveModel) {
        this._curveModel = curveModel;
    }
    set curveShapeSpaceNavigator(curveShapeSpaceNavigator) {
        this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
    }
    get toggleButtonCurveClamping() {
        return this._toggleButtonCurveClamping;
    }
    toggleCurveClamping() {
        var _a;
        this.controlOfCurveClamping = !this.controlOfCurveClamping;
        if ((!this._shapeNavigableCurve.curveCategory.curveModelChange)
            && (!((_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationState.navigationStateChange)))
            this._shapeNavigableCurve.toggleCurveClamping();
    }
    disableCurveClamping() {
        this._toggleButtonCurveClamping.disabled = true;
    }
    enableCurveClamping() {
        this._toggleButtonCurveClamping.disabled = false;
    }
    clickSelectDegree() {
        console.log("select Degree click");
        this._inputDegree.value = this._currentCurveDegree;
    }
    clickCurveCategory() {
        console.log("select Curve type click");
        this._inputCurveCategory.value = this._currentCurveCategory;
    }
    inputSelectCurveCategory() {
        const curveCategory = Number(this._inputCurveCategory.value);
        this._currentCurveCategory = this._inputCurveCategory.value;
        this._shapeNavigableCurve.inputSelectCurveCategory(curveCategory);
    }
    inputSelectDegree() {
        console.log("select:  " + this._inputDegree.value);
        const optionName = "option";
        if (!isNaN(Number(this._inputDegree.value))) {
            const curveDegree = Number(this._inputDegree.value);
            this._currentCurveDegree = this._inputDegree.value;
            this._shapeNavigableCurve.curveCategory.inputSelectDegree(curveDegree);
            if (curveDegree > AbstractCurveModel_1.DEFAULT_CURVE_DEGREE) {
                for (let i = 1; i < (curveDegree - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1); i += 1) {
                    console.log("select" + optionName + i.toString());
                    const option = document.getElementById(optionName + i.toString());
                    if (option !== null)
                        option.setAttribute("disabled", "");
                    else {
                        const error = new ErrorLoging_1.ErrorLog("curveModelEventListener", "inputSelectDegree", "No ID found to identify an Option in the Selector.");
                        error.logMessage();
                    }
                }
            }
        }
        else {
            const error = new ErrorLoging_1.ErrorLog("curveModelEventListener", "inputSelectDegree", "The selected option cannot be converted into a Number");
            error.logMessage();
        }
    }
    updateCurveConstraintControlButton() {
        if (this.controlOfCurveClamping) {
            this._toggleButtonCurveClamping.click();
        }
    }
    restorePreviousConstraintControl() {
        var _a, _b;
        if (!this._shapeNavigableCurve.curveCategory.curveModelChange) {
            this._shapeNavigableCurve.clampedPoints = [];
            if (this._shapeNavigableCurve.clampedPointsPreviousState[0] === ShapeNavigableCurve_1.NO_CONSTRAINT
                && this._shapeNavigableCurve.clampedPointsPreviousState[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
                if (!this.controlOfCurveClamping)
                    this._toggleButtonCurveClamping.click();
                this._shapeNavigableCurve.controlOfCurveClamping = true;
                this.controlOfCurveClamping = true;
                this._shapeNavigableCurve.clampedPoints.push(0);
                this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
            }
            else {
                this._shapeNavigableCurve.clampedPoints = this._shapeNavigableCurve.clampedPointsPreviousState;
                if (!(this.controlOfCurveClamping && this.previousControlOfCurveClamping))
                    this._toggleButtonCurveClamping.click();
            }
            if (this._shapeNavigableCurve.clampedPoints[0] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
                if (this._shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
                    this._shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this._shapeNavigableCurve.curveConstraints));
                }
                else {
                    this._shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedLastControlPoint(this._shapeNavigableCurve.curveConstraints));
                }
            }
            else {
                if (this._shapeNavigableCurve.clampedPoints[1] === ShapeNavigableCurve_1.NO_CONSTRAINT) {
                    this._shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this._shapeNavigableCurve.curveConstraints));
                }
                else {
                    this._shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstAndLastControlPoint(this._shapeNavigableCurve.curveConstraints));
                }
            }
            this._shapeNavigableCurve.curveConstraints.curveConstraintStrategy = this._shapeNavigableCurve.crvConstraintAtExtremitiesStgy;
            this._shapeNavigableCurve.controlOfCurveClamping = this.controlOfCurveClamping;
        }
        else {
            this._shapeNavigableCurve.clampedPoints = [];
            if (((_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationState) instanceof NavigationState_1.OCurveNavigationWithoutShapeSpaceMonitoring
                || ((_b = this._curveShapeSpaceNavigator) === null || _b === void 0 ? void 0 : _b.navigationState) instanceof NavigationState_1.CCurveNavigationWithoutShapeSpaceMonitoring) {
                this._shapeNavigableCurve.clampedPointsPreviousState = [];
                this._shapeNavigableCurve.clampedPointsPreviousState.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
                this._shapeNavigableCurve.clampedPointsPreviousState.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
                this._shapeNavigableCurve.clampedPoints = this._shapeNavigableCurve.clampedPointsPreviousState;
            }
            else {
                this._shapeNavigableCurve.controlOfCurveClamping = true;
                this.controlOfCurveClamping = true;
                this._shapeNavigableCurve.clampedPoints.push(0);
                this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
                this._shapeNavigableCurve.clampedPointsPreviousState = this._shapeNavigableCurve.clampedPoints;
                this._shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintClampedFirstControlPoint(this._shapeNavigableCurve.curveConstraints));
                this._shapeNavigableCurve.curveConstraints.curveConstraintStrategy = this._shapeNavigableCurve.crvConstraintAtExtremitiesStgy;
                this._shapeNavigableCurve.controlOfCurveClamping = this.controlOfCurveClamping;
            }
        }
    }
    storeCurrentConstraintControl() {
        this.previousControlOfCurveClamping = this.controlOfCurveClamping;
        this.shapeNavigableCurve.clampedPointsPreviousState = this.shapeNavigableCurve.clampedPoints;
    }
    resetConstraintControl() {
        if (this.controlOfCurveClamping) {
            this.storeCurrentConstraintControl();
            this._toggleButtonCurveClamping.click();
            this._shapeNavigableCurve.controlOfCurveClamping = false;
            this._shapeNavigableCurve.clampedPoints = [];
            this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
            this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
        }
        else {
            this.storeCurrentConstraintControl();
        }
        this._shapeNavigableCurve.curveConstraints.curveConstraintStrategy = this._shapeNavigableCurve.crvConstraintAtExtremitiesStgy;
    }
    reinitializeConstraintControl() {
        if (this.controlOfCurveClamping) {
            this._toggleButtonCurveClamping.click();
            this._shapeNavigableCurve.controlOfCurveClamping = false;
            this._shapeNavigableCurve.clampedPoints = [];
            this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
            this._shapeNavigableCurve.clampedPoints.push(ShapeNavigableCurve_1.NO_CONSTRAINT);
            this.shapeNavigableCurve.changeCurveConstraintStrategy(new CurveConstraintStrategy_1.CurveConstraintNoConstraint(this.shapeNavigableCurve.curveConstraints));
            this.storeCurrentConstraintControl();
        }
        else {
            this.storeCurrentConstraintControl();
        }
    }
    updateCurveDegreeSelector(newCurveDegree) {
        if (newCurveDegree >= AbstractCurveModel_1.DEFAULT_CURVE_DEGREE) {
            const optionNumber = Number(this.currentCurveDegree) - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1;
            const optionName = "option";
            let option;
            for (let i = 1; i < (newCurveDegree - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1); i += 1) {
                option = document.getElementById(optionName + i.toString());
                if (option !== null)
                    option.setAttribute("disabled", "");
                else {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "updateCurveDegreeSelector", "No id found to identify an Option in the Selector.");
                    error.logMessage();
                }
            }
            option = document.getElementById(optionName + optionNumber);
            option.removeAttribute("selected");
            option = document.getElementById(optionName + (newCurveDegree - 2).toString());
            option.setAttribute("selected", "selected");
            this.currentCurveDegree = newCurveDegree.toString();
            this.inputDegree.click();
        }
        else {
            const error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
            error.logMessage();
        }
    }
    update(message) {
    }
}
exports.CurveModelDefinitionEventListener = CurveModelDefinitionEventListener;
// export class ShapeSpaceNavigationEventListener extends UserInterfaceEventListener {
class ShapeSpaceNavigationEventListener {
    // private sceneController: CurveSceneController;
    constructor(curveModelDefinitionEventListener) {
        // super();
        this.shapeNavigableCurve = curveModelDefinitionEventListener.shapeNavigableCurve;
        this._curveShapeSpaceNavigator = new CurveShapeSpaceNavigator_1.CurveShapeSpaceNavigator(this.shapeNavigableCurve);
        curveModelDefinitionEventListener.curveShapeSpaceNavigator = this._curveShapeSpaceNavigator;
        this.shapeNavigableCurve.curveShapeSpaceNavigator = this._curveShapeSpaceNavigator;
        this.shapeNavigableCurve.curveConstraints.curveConstraintStrategy.curveShapeSpaceNavigator = this._curveShapeSpaceNavigator;
        // this.shapeNavigableCurve.curveCategory.curveShapeSpaceNavigator = this._curveShapeSpaceNavigator;
        /* Get control button IDs for curve shape control*/
        this._toggleButtonCurvatureExtrema = document.getElementById("toggleButtonCurvatureExtrema");
        this._toggleButtonInflection = document.getElementById("toggleButtonInflections");
        this._toggleButtonSliding = document.getElementById("toggleButtonSliding");
        this._toggleButtonEventsStayInside = document.getElementById("toggleButtonEventsStayInside");
        /* Get control button IDs for curve shape control*/
        // Initializes the navigation mode to: 
        //      Without shape space constraints = 0
        //      Nested simpler shape spaces = 1
        //      Strictly in shape space = 2
        this._currentNavigationMode = "0";
        this._inputNavigationMode = document.getElementById("navigationMode");
        // Initializes the navigation parameters in accordance with navigation modes above:
        //      mode 0: controlOfCurvatureExtrema = false, controlOfInflection = false, sliding = false,
        //      mode 1: controlOfCurvatureExtrema =  true, controlOfInflection = true, sliding = true,
        //      mode 2: controlOfCurvatureExtrema =  true, controlOfInflection = true, sliding = true
        this.controlOfCurvatureExtrema = false;
        this.controlOfInflection = false;
        this._sliding = false;
        this.controlOfEventAtExtremity = false;
        this._previousControlOfCurvatureExtrema = false;
        this._previousControlOfInflection = false;
        this._previousSliding = false;
        this.previousControlOfEventAtExtremity = false;
        this.previousCtrlOfEventAtExtrmtyWrtSliding = false;
        this.resetButtons = false;
        this.resetControlOfEventAtExtremity = false;
        this.shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInShapeSpaceNavigationEventListener(this));
        this._inputNavigationMode.addEventListener('input', this.inputSelectNavigationMode.bind(this));
        this._inputNavigationMode.addEventListener('click', this.clickNavigationMode.bind(this));
        this._toggleButtonCurvatureExtrema.addEventListener('click', this.toggleControlOfCurvatureExtrema.bind(this));
        this._toggleButtonInflection.addEventListener('click', this.toggleControlOfInflections.bind(this));
        this._toggleButtonSliding.addEventListener('click', this.toggleSliding.bind(this));
        this._toggleButtonEventsStayInside.addEventListener('click', this.toggleEventMgmtAtCurveExt.bind(this));
    }
    get curveShapeSpaceNavigator() {
        return this._curveShapeSpaceNavigator;
    }
    get toggleButtonCurvatureExtrema() {
        return this._toggleButtonCurvatureExtrema;
    }
    get toggleButtonInflection() {
        return this._toggleButtonInflection;
    }
    get toggleButtonSliding() {
        return this._toggleButtonSliding;
    }
    get toggleButtonEventsStayInside() {
        return this._toggleButtonEventsStayInside;
    }
    get sliding() {
        return this._sliding;
    }
    get previousControlOfCurvatureExtrema() {
        return this._previousControlOfCurvatureExtrema;
    }
    get previousControlOfInflection() {
        return this._previousControlOfInflection;
    }
    get previousSliding() {
        return this._previousSliding;
    }
    toggleControlOfCurvatureExtrema() {
        this.controlOfCurvatureExtrema = !this.controlOfCurvatureExtrema;
        if ((!this.controlOfCurvatureExtrema) && (!this.controlOfInflection) && this._sliding) {
            this.toggleButtonSliding.click();
            this.disableControlOfSliding();
        }
        else {
            this.enableControlOfSliding();
        }
        if (!this.resetButtons) {
            this._curveShapeSpaceNavigator.toggleControlOfCurvatureExtrema();
        }
    }
    disableControlOfCurvatureExtrema() {
        this._toggleButtonCurvatureExtrema.disabled = true;
    }
    enableControlOfCurvatureExtrema() {
        this._toggleButtonCurvatureExtrema.disabled = false;
    }
    toggleControlOfInflections() {
        this.controlOfInflection = !this.controlOfInflection;
        if ((!this.controlOfCurvatureExtrema) && (!this.controlOfInflection) && this._sliding) {
            this.toggleButtonSliding.click();
            this.disableControlOfSliding();
        }
        else {
            this.enableControlOfSliding();
        }
        if (!this.resetButtons) {
            this._curveShapeSpaceNavigator.toggleControlOfInflections();
        }
    }
    disableControlOfInflections() {
        this._toggleButtonInflection.disabled = true;
    }
    enableControlOfInflections() {
        this._toggleButtonInflection.disabled = false;
    }
    toggleSliding() {
        this._sliding = !this._sliding;
        if (!this.resetButtons) {
            this._curveShapeSpaceNavigator.toggleSliding();
            if (!this._sliding) {
                this.resetControlOfEventAtExtremity = true;
                this.previousCtrlOfEventAtExtrmtyWrtSliding = this.controlOfEventAtExtremity;
                if (this.controlOfEventAtExtremity) {
                    this._toggleButtonEventsStayInside.click();
                }
                this.disableEventMgmtAtCurveExt();
            }
            else {
                this.enableEventMgmtAtCurveExt();
                this.controlOfEventAtExtremity = this.previousCtrlOfEventAtExtrmtyWrtSliding;
                if (this.controlOfEventAtExtremity) {
                    this._toggleButtonEventsStayInside.click();
                }
                this.resetControlOfEventAtExtremity = false;
            }
        }
    }
    disableControlOfSliding() {
        this._toggleButtonSliding.disabled = true;
    }
    enableControlOfSliding() {
        this._toggleButtonSliding.disabled = false;
    }
    toggleEventMgmtAtCurveExt() {
        if (!this.resetControlOfEventAtExtremity) {
            this.controlOfEventAtExtremity = !this.controlOfEventAtExtremity;
            if (!this.resetButtons) {
                this._curveShapeSpaceNavigator.toggleEventMgmtAtCurveExt();
            }
        }
    }
    disableEventMgmtAtCurveExt() {
        this._toggleButtonEventsStayInside.disabled = true;
    }
    enableEventMgmtAtCurveExt() {
        this._toggleButtonEventsStayInside.disabled = false;
    }
    clickNavigationMode() {
        console.log("select Navigation click");
        this._inputNavigationMode.value = this._currentNavigationMode;
    }
    inputSelectNavigationMode() {
        console.log("select" + this._inputNavigationMode.value);
        const navigationMode = Number(this._inputNavigationMode.value);
        this._currentNavigationMode = this._inputNavigationMode.value;
        this._curveShapeSpaceNavigator.inputSelectNavigationProcess(navigationMode);
    }
    reinitializeNavigationMode() {
        this._currentNavigationMode = "0";
        this.clickNavigationMode();
    }
    updateCurveShapeControlButtons() {
        if (this._previousSliding) {
            this._toggleButtonSliding.click();
            this.enableEventMgmtAtCurveExt();
        }
        if (this._previousControlOfCurvatureExtrema) {
            this._toggleButtonCurvatureExtrema.click();
        }
        if (this._previousControlOfInflection) {
            this._toggleButtonInflection.click();
        }
        if (this.previousControlOfEventAtExtremity) {
            this._toggleButtonEventsStayInside.click();
        }
    }
    resetCurveShapeControlButtons() {
        this.resetButtons = true;
        if (this.controlOfEventAtExtremity) {
            this._toggleButtonEventsStayInside.click();
            this._curveShapeSpaceNavigator.controlOfEventsAtExtremity = false;
        }
        if (this._sliding) {
            this._toggleButtonSliding.click();
            this._curveShapeSpaceNavigator.setSlidingDifferentialEvents(false);
        }
        if (this.controlOfCurvatureExtrema) {
            this._toggleButtonCurvatureExtrema.click();
            this._curveShapeSpaceNavigator.setActiveControlCurvatureExtrema(false);
        }
        if (this.controlOfInflection) {
            this._toggleButtonInflection.click();
            this._curveShapeSpaceNavigator.setActiveControlInflections(false);
        }
        this.resetButtons = false;
    }
    restorePreviousCurveShapeControlButtons() {
        this.controlOfCurvatureExtrema = this._previousControlOfCurvatureExtrema;
        this.controlOfInflection = this._previousControlOfInflection;
        this._sliding = this._previousSliding;
        this.controlOfEventAtExtremity = this.previousControlOfEventAtExtremity;
        this._curveShapeSpaceNavigator.restoreCurveControlState(this);
    }
    storeCurrentCurveShapeControlButtons() {
        this._previousControlOfCurvatureExtrema = this.controlOfCurvatureExtrema;
        this._previousControlOfInflection = this.controlOfInflection;
        this._previousSliding = this._sliding;
        this.previousControlOfEventAtExtremity = this.controlOfEventAtExtremity;
    }
    reinitializePreviousShapeControlButtons() {
        this._previousControlOfCurvatureExtrema = false;
        this._previousControlOfInflection = false;
        this._previousSliding = false;
        this.previousControlOfEventAtExtremity = false;
    }
    updateEventMgmtAtCurveExtControlButton() {
        if (this.controlOfEventAtExtremity) {
            this._toggleButtonEventsStayInside.click();
        }
    }
}
exports.ShapeSpaceNavigationEventListener = ShapeSpaceNavigationEventListener;
class CurveSceneEventListener {
    // private readonly iconKnotInsertion: HTMLImageElement;
    // private readonly textureInfo: {width: number, height: number, texture: WebGLTexture|null};
    constructor(curveModelDefinitionEventListener, shapeSpaceNavigationEventListener) {
        this.canvas = document.getElementById("webgl");
        this.gl = (0, webgl_utils_1.WebGLUtils)().setupWebGL(this.canvas);
        this.shapeSpaceNavigationEventListener = shapeSpaceNavigationEventListener;
        this.curveModelDefinitionEventListener = curveModelDefinitionEventListener;
        this._curveSceneController = new CurveSceneController_1.CurveSceneController(this.canvas, this.gl, this.curveModelDefinitionEventListener, this.shapeSpaceNavigationEventListener);
        this.stuffThatCouldBeUsedToLoadAnImageAndProcessTextures();
        this.canvas.addEventListener('mousedown', this.mouse_click.bind(this), false);
        this.canvas.addEventListener('dblclick', this.mouse_double_click.bind(this), false);
        this.canvas.addEventListener('mousemove', this.mouse_drag.bind(this), false);
        this.canvas.addEventListener('mouseup', this.mouse_stop_drag.bind(this), false);
        this.canvas.addEventListener('touchstart', this.touch_click.bind(this), false);
        this.canvas.addEventListener('touchmove', this.touch_drag.bind(this), false);
        this.canvas.addEventListener('touchmove', this.touch_stop_drag.bind(this), false);
        document.body.addEventListener('keydown', this.keyDown.bind(this));
        document.body.addEventListener('keyup', this.keyUp.bind(this));
        // Prevent scrolling when touching the canvas with a tablet device
        document.body.addEventListener("touchstart", (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchend", (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchmove", (e) => {
            if (e.target === this.canvas) {
                e.preventDefault();
            }
        }, false);
        if (!this.gl) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "CurveSceneEventListener", "Failed to get the rendering context for WebGL. Stop program.");
            error.logMessage();
            return;
        }
    }
    get curveSceneController() {
        return this._curveSceneController;
    }
    mouse_get_NormalizedDeviceCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x, y;
        x = ((event.clientX - rect.left) - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - (event.clientY - rect.top)) / (this.canvas.height / 2);
        return [x, y];
    }
    touch_get_NormalizedDeviceCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x, y;
        const ev = event.touches[0];
        x = ((ev.clientX - rect.left) - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - (ev.clientY - rect.top)) / (this.canvas.height / 2);
        return [x, y];
    }
    mouse_click(ev) {
        const c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDown_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    }
    mouse_double_click(ev) {
        const c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        let active_clamping = this._curveSceneController.dbleClick_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        console.log("mouse_double_click: " + active_clamping);
        if (!active_clamping)
            this.curveModelDefinitionEventListener.toggleButtonCurveClamping.click();
        ev.preventDefault();
    }
    mouse_drag(ev) {
        const c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDragged_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    }
    mouse_stop_drag(ev) {
        this._curveSceneController.leftMouseUp_event();
        ev.preventDefault();
    }
    touch_click(ev) {
        const c = this.touch_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDown_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    }
    touch_drag(ev) {
        const c = this.touch_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDragged_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    }
    touch_stop_drag(ev) {
        this._curveSceneController.leftMouseUp_event();
        ev.preventDefault();
    }
    keyDown(ev) {
        const keyName = ev.key;
        if (keyName === "Shift")
            this._curveSceneController.shiftKeyDown();
    }
    keyUp(ev) {
        const keyName = ev.key;
        if (keyName === "Shift")
            this._curveSceneController.shiftKeyUp();
    }
    // All methods hereunder are a basis for tests to be able to load texture from a file and use it as background of the canvas
    processInputTexture() {
        // this.textureInfo.width = this.iconKnotInsertion.width;
        // this.textureInfo.height = this.iconKnotInsertion.height;
        // this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureInfo.texture);
        // this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.iconKnotInsertion);
    }
    stuffThatCouldBeUsedToLoadAnImageAndProcessTextures() {
        let VSHADER_SOURCE = 'attribute vec4 a_position;\n' +
            'attribute vec2 a_texcoord;\n' +
            'uniform mat4 u_matrix;\n' +
            'varying vec2 v_texcoord;\n' +
            'void main() {\n' +
            '   gl_Position = u_matrix * a_position;\n' +
            '   v_texcoord = a_texcoord;\n' +
            '}\n';
        let FSHADER_SOURCE = 'precision mediump float;\n' +
            'varying vec2 v_texcoord;\n' +
            'uniform sampler2D u_texture;\n' +
            'void main() {\n' +
            '   gl_FragColor = texture2D(u_texture, v_texcoord);\n' +
            '}\n';
        let program = (0, cuon_utils_1.createProgram)(this.gl, VSHADER_SOURCE, FSHADER_SOURCE);
        if (!program) {
            console.log('Failed to create program');
        }
        else {
            //gl.useProgram(program);
            let positionLocation = this.gl.getAttribLocation(program, "a_position");
            let texcoordLocation = this.gl.getAttribLocation(program, "a_texcoord");
            // lookup uniforms
            let matrixLocation = this.gl.getUniformLocation(program, "u_matrix");
            let textureLocation = this.gl.getUniformLocation(program, "u_texture");
        }
        // Create a buffer.
        let positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // Put a unit quad in the buffer
        let positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        // Create a buffer for texture coords
        let texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        // Put texcoords in the buffer
        let texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);
        const tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        // let's assume all images are not a power of 2
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        // this.textureInfo = {
        //     width: 1,   // we don't know the size until it loads
        //     height: 1,
        //     texture: tex,
        // };
        // this.iconKnotInsertion = new Image();
        // this.iconKnotInsertion.addEventListener('load', this.processInputTexture.bind(this));
    }
    loadImageAndCreateTextureInfo(url) {
        let tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        // let's assume all images are not a power of 2
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        let textureInfo = {
            width: 1,
            height: 1,
            texture: tex,
        };
        let img = new Image();
        img.addEventListener('load', () => {
            textureInfo.width = img.width;
            textureInfo.height = img.height;
            this.gl.bindTexture(this.gl.TEXTURE_2D, textureInfo.texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        });
        img.src = url;
        return textureInfo;
    }
    drawImage(tex, texWidth, texHeight, dstX, dstY) {
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        // // Tell WebGL to use our shader program pair
        // this.gl.useProgram(program);
        // // Setup the attributes to pull data from our buffers
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // this.gl.enableVertexAttribArray(positionLocation);
        // this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        // this.gl.enableVertexAttribArray(texcoordLocation);
        // this.gl.vertexAttribPointer(texcoordLocation, 2, this.gl.FLOAT, false, 0, 0);
        // // this matrix will convert from pixels to clip space
        // /*var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);
        // // this matrix will translate our quad to dstX, dstY
        // matrix = m4.translate(matrix, dstX, dstY, 0);
        // // this matrix will scale our 1 unit quad
        // // from 1 unit to texWidth, texHeight units
        // matrix = m4.scale(matrix, texWidth, texHeight, 1);
        // // Set the matrix.
        // gl.uniformMatrix4fv(matrixLocation, false, matrix);*/
        // // Tell the shader to get the texture from texture unit 0
        // this.gl.uniform1i(textureLocation, 0);
        // draw the quad (2 triangles, 6 vertices)
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
exports.CurveSceneEventListener = CurveSceneEventListener;
