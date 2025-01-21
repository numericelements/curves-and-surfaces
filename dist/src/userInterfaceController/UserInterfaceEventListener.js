"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneEventListener = exports.ShapeSpaceNavigationEventListener = exports.CurveModelDefinitionEventListener = exports.FileEventListener = exports.ChartEventListener = exports.UserInterfaceEventListener = void 0;
var ChartSceneController_1 = require("../chartcontrollers/ChartSceneController");
var CurveSceneController_1 = require("../controllers/CurveSceneController");
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var CurveShapeSpaceNavigator_1 = require("../curveShapeSpaceNavigation/CurveShapeSpaceNavigator");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var FileController_1 = require("../filecontrollers/FileController");
var AbstractCurveModel_1 = require("../newModels/AbstractCurveModel");
var CurveModelObserver_1 = require("../models/CurveModelObserver");
var webgl_utils_1 = require("../webgl/webgl-utils");
var cuon_utils_1 = require("../webgl/cuon-utils");
var CurveConstraintStrategy_1 = require("../curveShapeSpaceNavigation/CurveConstraintStrategy");
var NavigationState_1 = require("../curveShapeSpaceNavigation/NavigationState");
var UserInterfaceEventListener = /** @class */ (function () {
    function UserInterfaceEventListener() {
    }
    return UserInterfaceEventListener;
}());
exports.UserInterfaceEventListener = UserInterfaceEventListener;
var ChartEventListener = /** @class */ (function (_super) {
    __extends(ChartEventListener, _super);
    // private  static a: ChartEventListener
    function ChartEventListener(shapeNavigableCurve) {
        var _this = _super.call(this) || this;
        _this.chartRenderingContext = [];
        // ChartEventListener.a = this
        _this._curveModel = shapeNavigableCurve.curveCategory.curveModel;
        _this._shapeNavigableCurve = shapeNavigableCurve;
        _this.canvasChart1 = document.getElementById('chart1');
        _this.canvasChart2 = document.getElementById('chart2');
        _this.canvasChart3 = document.getElementById('chart3');
        _this.checkBoxFunctionA = document.getElementById("chkBoxFunctionA");
        _this.checkBoxFunctionB = document.getElementById("chkBoxFunctionB");
        _this.checkBoxFunctionBsqrtScaled = document.getElementById("chkBoxSqrtFunctionB");
        _this.checkBoxCurvature = document.getElementById("chkBoxCurvature");
        _this.checkBoxAbsCurvature = document.getElementById("chkBoxAbsCurvature");
        _this.chartFunctionA = false;
        _this.chartFunctionB = false;
        _this.chartCurvatureCrv = false;
        _this.chartAbsCurvatureCurv = false;
        _this.chartFunctionBsqrtScaled = false;
        _this.noAddChart = false;
        _this.ctxChart1 = _this.canvasChart1.getContext('2d');
        _this.ctxChart2 = _this.canvasChart2.getContext('2d');
        _this.ctxChart3 = _this.canvasChart3.getContext('2d');
        _this.setupChartRenderingContexts();
        _this._chartSceneController = new ChartSceneController_1.ChartSceneController(_this.chartRenderingContext, _this._shapeNavigableCurve);
        _this._shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInChartEventListener(_this));
        /* Add event handlers for checkbox processing */
        _this.checkBoxFunctionA.addEventListener('click', _this.chkboxFunctionA.bind(_this));
        _this.checkBoxFunctionB.addEventListener('click', _this.chkboxFunctionB.bind(_this));
        _this.checkBoxFunctionBsqrtScaled.addEventListener('click', _this.chkboxFunctionBsqrtScaled.bind(_this));
        _this.checkBoxCurvature.addEventListener('click', _this.chkboxCurvature.bind(_this));
        _this.checkBoxAbsCurvature.addEventListener('click', _this.chkboxAbsCurvature.bind(_this));
        return _this;
    }
    Object.defineProperty(ChartEventListener.prototype, "chartSceneController", {
        get: function () {
            return this._chartSceneController;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartEventListener.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChartEventListener.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    ChartEventListener.prototype.setupChartRenderingContexts = function () {
        if (this.ctxChart1 !== null)
            this.chartRenderingContext.push(this.ctxChart1);
        if (this.ctxChart2 !== null)
            this.chartRenderingContext.push(this.ctxChart2);
        if (this.ctxChart3 !== null)
            this.chartRenderingContext.push(this.ctxChart3);
        if (this.ctxChart1 === null || this.ctxChart2 === null || this.ctxChart3 === null) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "setupChartRenderingContexts", "Unable to get one or more CanvasRenderingContext2D required to process charts.");
            error.logMessage();
        }
    };
    ChartEventListener.prototype.uncheckCkbox = function () {
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
    };
    ChartEventListener.prototype.chkboxFunctionA = function () {
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
    };
    ChartEventListener.prototype.chkboxFunctionB = function () {
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
    };
    ChartEventListener.prototype.chkboxFunctionBsqrtScaled = function () {
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
    };
    ChartEventListener.prototype.chkboxCurvature = function () {
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
    };
    ChartEventListener.prototype.chkboxAbsCurvature = function () {
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
    };
    ChartEventListener.prototype.resetChartContext = function () {
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
    };
    return ChartEventListener;
}(UserInterfaceEventListener));
exports.ChartEventListener = ChartEventListener;
var FileEventListener = /** @class */ (function (_super) {
    __extends(FileEventListener, _super);
    function FileEventListener(curveModelEventListener, curveSceneController) {
        var _this = _super.call(this) || this;
        _this._shapeNavigableCurve = curveModelEventListener.shapeNavigableCurve;
        _this._curveModel = curveModelEventListener.curveModel;
        _this.curveSceneController = curveSceneController;
        /* JCL 2020/10/13 Get input IDs for file management purposes */
        _this.buttonFileLoad = document.getElementById("buttonFileLoad");
        _this.buttonFileSave = document.getElementById("buttonFileSave");
        _this.inputFileLoad = document.getElementById("inputFileLoad");
        _this.inputFileSave = document.getElementById("inputFileSave");
        _this.inputFileName = document.getElementById("inputFileName");
        _this.validateInput = document.getElementById("validateInput");
        _this.labelFileExtension = document.getElementById("labelFileExtension");
        _this.fileR = new FileReader();
        _this._fileController = new FileController_1.FileController(_this.shapeNavigableCurve, _this.curveSceneController);
        _this.currentFileName = "";
        _this.shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInFileEventListener(_this));
        /* JCL 2020/10/13 Add event handlers for file processing */
        _this.buttonFileLoad.addEventListener('click', _this.buttonFileLoadCurve.bind(_this));
        _this.buttonFileSave.addEventListener('click', _this.buttonFileSaveCurve.bind(_this));
        _this.inputFileLoad.addEventListener('input', _this.inputLoadFileCurve.bind(_this));
        _this.inputFileSave.addEventListener('input', _this.inputSaveFileCurve.bind(_this));
        _this.inputFileName.addEventListener('input', _this.inputCurveFileName.bind(_this));
        _this.validateInput.addEventListener('click', _this.inputButtonValidate.bind(_this));
        _this.fileR.addEventListener('load', _this.processInputFile.bind(_this));
        return _this;
    }
    Object.defineProperty(FileEventListener.prototype, "fileController", {
        get: function () {
            return this._fileController;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileEventListener.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FileEventListener.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    FileEventListener.prototype.buttonFileLoadCurve = function (ev) {
        if (this.inputFileLoad !== null)
            this.inputFileLoad.click();
    };
    FileEventListener.prototype.buttonFileSaveCurve = function (ev) {
        if (this.currentFileName === "") {
            this.inputFileName.style.display = "inline";
            this.labelFileExtension.style.display = "inline";
            this.validateInput.style.display = "inline";
        }
        else {
            this._fileController.saveCurveToFile(this.currentFileName);
        }
        ev.preventDefault();
    };
    FileEventListener.prototype.inputLoadFileCurve = function () {
        var _a;
        if (this.inputFileLoad !== null) {
            var aFileList = this.inputFileLoad.files;
            if (aFileList !== null && aFileList.length > 0) {
                if (((_a = aFileList.item(0)) === null || _a === void 0 ? void 0 : _a.name) !== undefined) {
                    var curveFile = aFileList.item(0);
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
    };
    FileEventListener.prototype.inputSaveFileCurve = function () {
    };
    FileEventListener.prototype.inputCurveFileName = function () {
    };
    FileEventListener.prototype.inputButtonValidate = function () {
        this.currentFileName = this.inputFileName.value;
        console.log("inputButtonValidate:" + this.inputFileName.value);
        this.inputFileName.style.display = "none";
        this.labelFileExtension.style.display = "none";
        this.validateInput.style.display = "none";
        this._fileController.saveCurveToFile(this.currentFileName);
    };
    FileEventListener.prototype.getFileContent = function (ev) {
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
                var error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Error when reading the input file. Incorrect text format.");
                error.logMessage();
            }
        }
    };
    FileEventListener.prototype.processInputFile = function (ev) {
        this.getFileContent(ev);
        var aSpline = this._fileController.loadCurveFromFile(this.currentFileName);
        if (typeof (aSpline) !== "undefined") {
            this._fileController.resetCurveContext(aSpline.knots, aSpline.controlPoints);
            this.curveModel = this._fileController.curveModel;
            if (this.curveModel === undefined) {
                var error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to get a curveModel to restart the chartSceneController.");
                error.logMessage();
                return;
            }
        }
        else {
            var error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to reset the curve context. Undefined curve model.");
            error.logMessage();
        }
    };
    return FileEventListener;
}(UserInterfaceEventListener));
exports.FileEventListener = FileEventListener;
var CurveModelDefinitionEventListener = /** @class */ (function (_super) {
    __extends(CurveModelDefinitionEventListener, _super);
    function CurveModelDefinitionEventListener() {
        var _this = _super.call(this) || this;
        /* Get selector ID for curve category and degree*/
        _this._currentCurveDegree = "3";
        _this._currentCurveCategory = "0";
        _this._inputCurveCategory = document.getElementById("curveCategory");
        _this._inputDegree = document.getElementById("curveDegree");
        _this._toggleButtonCurveClamping = document.getElementById("toggleButtonCurveClamping");
        _this._curveShapeSpaceNavigator = undefined;
        _this._shapeNavigableCurve = new ShapeNavigableCurve_1.ShapeNavigableCurve();
        _this._curveModel = _this._shapeNavigableCurve.curveCategory.curveModel;
        // this._curveModel.registerObserver(this, "curve");
        // Initizalizes clamped points monitoring in accordance with navigation modes:
        //      mode 0: controlOfCurveClamping = false,
        //      mode 1, mode 2: controlOfCurveClamping =  true
        _this.controlOfCurveClamping = false;
        _this.previousControlOfCurveClamping = false;
        _this._shapeNavigableCurve.registerObserver(new CurveModelObserver_1.CurveModelObserverInCurveModelEventListener(_this));
        /* JCL  Add event handlers for curve degree and curve category selection processing */
        _this._inputDegree.addEventListener('input', _this.inputSelectDegree.bind(_this));
        _this._inputDegree.addEventListener('click', _this.clickSelectDegree.bind(_this));
        _this._inputCurveCategory.addEventListener('input', _this.inputSelectCurveCategory.bind(_this));
        _this._inputCurveCategory.addEventListener('click', _this.clickCurveCategory.bind(_this));
        _this._toggleButtonCurveClamping.addEventListener('click', _this.toggleCurveClamping.bind(_this));
        return _this;
    }
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "currentCurveDegree", {
        get: function () {
            return this._currentCurveDegree;
        },
        set: function (curveDegree) {
            this._currentCurveDegree = curveDegree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "inputDegree", {
        get: function () {
            return this._inputDegree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "curveModel", {
        get: function () {
            return this._curveModel;
        },
        set: function (curveModel) {
            this._curveModel = curveModel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "shapeNavigableCurve", {
        get: function () {
            return this._shapeNavigableCurve;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            if (this._curveShapeSpaceNavigator !== undefined) {
                return this._curveShapeSpaceNavigator;
            }
            else {
                return undefined;
            }
        },
        set: function (curveShapeSpaceNavigator) {
            this._curveShapeSpaceNavigator = curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CurveModelDefinitionEventListener.prototype, "toggleButtonCurveClamping", {
        get: function () {
            return this._toggleButtonCurveClamping;
        },
        enumerable: false,
        configurable: true
    });
    CurveModelDefinitionEventListener.prototype.toggleCurveClamping = function () {
        var _a;
        this.controlOfCurveClamping = !this.controlOfCurveClamping;
        if ((!this._shapeNavigableCurve.curveCategory.curveModelChange)
            && (!((_a = this._curveShapeSpaceNavigator) === null || _a === void 0 ? void 0 : _a.navigationState.navigationStateChange)))
            this._shapeNavigableCurve.toggleCurveClamping();
    };
    CurveModelDefinitionEventListener.prototype.disableCurveClamping = function () {
        this._toggleButtonCurveClamping.disabled = true;
    };
    CurveModelDefinitionEventListener.prototype.enableCurveClamping = function () {
        this._toggleButtonCurveClamping.disabled = false;
    };
    CurveModelDefinitionEventListener.prototype.clickSelectDegree = function () {
        console.log("select Degree click");
        this._inputDegree.value = this._currentCurveDegree;
    };
    CurveModelDefinitionEventListener.prototype.clickCurveCategory = function () {
        console.log("select Curve type click");
        this._inputCurveCategory.value = this._currentCurveCategory;
    };
    CurveModelDefinitionEventListener.prototype.inputSelectCurveCategory = function () {
        var curveCategory = Number(this._inputCurveCategory.value);
        this._currentCurveCategory = this._inputCurveCategory.value;
        this._shapeNavigableCurve.inputSelectCurveCategory(curveCategory);
    };
    CurveModelDefinitionEventListener.prototype.inputSelectDegree = function () {
        console.log("select:  " + this._inputDegree.value);
        var optionName = "option";
        if (!isNaN(Number(this._inputDegree.value))) {
            var curveDegree = Number(this._inputDegree.value);
            this._currentCurveDegree = this._inputDegree.value;
            this._shapeNavigableCurve.curveCategory.inputSelectDegree(curveDegree);
            if (curveDegree > AbstractCurveModel_1.DEFAULT_CURVE_DEGREE) {
                for (var i = 1; i < (curveDegree - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1); i += 1) {
                    console.log("select" + optionName + i.toString());
                    var option = document.getElementById(optionName + i.toString());
                    if (option !== null)
                        option.setAttribute("disabled", "");
                    else {
                        var error = new ErrorLoging_1.ErrorLog("curveModelEventListener", "inputSelectDegree", "No ID found to identify an Option in the Selector.");
                        error.logMessage();
                    }
                }
            }
        }
        else {
            var error = new ErrorLoging_1.ErrorLog("curveModelEventListener", "inputSelectDegree", "The selected option cannot be converted into a Number");
            error.logMessage();
        }
    };
    CurveModelDefinitionEventListener.prototype.updateCurveConstraintControlButton = function () {
        if (this.controlOfCurveClamping) {
            this._toggleButtonCurveClamping.click();
        }
    };
    CurveModelDefinitionEventListener.prototype.restorePreviousConstraintControl = function () {
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
    };
    CurveModelDefinitionEventListener.prototype.storeCurrentConstraintControl = function () {
        this.previousControlOfCurveClamping = this.controlOfCurveClamping;
        this.shapeNavigableCurve.clampedPointsPreviousState = this.shapeNavigableCurve.clampedPoints;
    };
    CurveModelDefinitionEventListener.prototype.resetConstraintControl = function () {
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
    };
    CurveModelDefinitionEventListener.prototype.reinitializeConstraintControl = function () {
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
    };
    CurveModelDefinitionEventListener.prototype.updateCurveDegreeSelector = function (newCurveDegree) {
        if (newCurveDegree >= AbstractCurveModel_1.DEFAULT_CURVE_DEGREE) {
            var optionNumber = Number(this.currentCurveDegree) - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1;
            var optionName = "option";
            var option = void 0;
            for (var i = 1; i < (newCurveDegree - AbstractCurveModel_1.DEFAULT_CURVE_DEGREE + 1); i += 1) {
                option = document.getElementById(optionName + i.toString());
                if (option !== null)
                    option.setAttribute("disabled", "");
                else {
                    var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "updateCurveDegreeSelector", "No id found to identify an Option in the Selector.");
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
            var error = new ErrorLoging_1.ErrorLog("FileEventListener", "processInputFile", "Unable to assign a consistent curve degree when loading a curve. Curve degree must be greater or equal to 3.");
            error.logMessage();
        }
    };
    CurveModelDefinitionEventListener.prototype.update = function (message) {
    };
    return CurveModelDefinitionEventListener;
}(UserInterfaceEventListener));
exports.CurveModelDefinitionEventListener = CurveModelDefinitionEventListener;
// export class ShapeSpaceNavigationEventListener extends UserInterfaceEventListener {
var ShapeSpaceNavigationEventListener = /** @class */ (function () {
    // private sceneController: CurveSceneController;
    function ShapeSpaceNavigationEventListener(curveModelDefinitionEventListener) {
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
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "curveShapeSpaceNavigator", {
        get: function () {
            return this._curveShapeSpaceNavigator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "toggleButtonCurvatureExtrema", {
        get: function () {
            return this._toggleButtonCurvatureExtrema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "toggleButtonInflection", {
        get: function () {
            return this._toggleButtonInflection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "toggleButtonSliding", {
        get: function () {
            return this._toggleButtonSliding;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "toggleButtonEventsStayInside", {
        get: function () {
            return this._toggleButtonEventsStayInside;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "sliding", {
        get: function () {
            return this._sliding;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "previousControlOfCurvatureExtrema", {
        get: function () {
            return this._previousControlOfCurvatureExtrema;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "previousControlOfInflection", {
        get: function () {
            return this._previousControlOfInflection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeSpaceNavigationEventListener.prototype, "previousSliding", {
        get: function () {
            return this._previousSliding;
        },
        enumerable: false,
        configurable: true
    });
    ShapeSpaceNavigationEventListener.prototype.toggleControlOfCurvatureExtrema = function () {
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
    };
    ShapeSpaceNavigationEventListener.prototype.disableControlOfCurvatureExtrema = function () {
        this._toggleButtonCurvatureExtrema.disabled = true;
    };
    ShapeSpaceNavigationEventListener.prototype.enableControlOfCurvatureExtrema = function () {
        this._toggleButtonCurvatureExtrema.disabled = false;
    };
    ShapeSpaceNavigationEventListener.prototype.toggleControlOfInflections = function () {
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
    };
    ShapeSpaceNavigationEventListener.prototype.disableControlOfInflections = function () {
        this._toggleButtonInflection.disabled = true;
    };
    ShapeSpaceNavigationEventListener.prototype.enableControlOfInflections = function () {
        this._toggleButtonInflection.disabled = false;
    };
    ShapeSpaceNavigationEventListener.prototype.toggleSliding = function () {
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
    };
    ShapeSpaceNavigationEventListener.prototype.disableControlOfSliding = function () {
        this._toggleButtonSliding.disabled = true;
    };
    ShapeSpaceNavigationEventListener.prototype.enableControlOfSliding = function () {
        this._toggleButtonSliding.disabled = false;
    };
    ShapeSpaceNavigationEventListener.prototype.toggleEventMgmtAtCurveExt = function () {
        if (!this.resetControlOfEventAtExtremity) {
            this.controlOfEventAtExtremity = !this.controlOfEventAtExtremity;
            if (!this.resetButtons) {
                this._curveShapeSpaceNavigator.toggleEventMgmtAtCurveExt();
            }
        }
    };
    ShapeSpaceNavigationEventListener.prototype.disableEventMgmtAtCurveExt = function () {
        this._toggleButtonEventsStayInside.disabled = true;
    };
    ShapeSpaceNavigationEventListener.prototype.enableEventMgmtAtCurveExt = function () {
        this._toggleButtonEventsStayInside.disabled = false;
    };
    ShapeSpaceNavigationEventListener.prototype.clickNavigationMode = function () {
        console.log("select Navigation click");
        this._inputNavigationMode.value = this._currentNavigationMode;
    };
    ShapeSpaceNavigationEventListener.prototype.inputSelectNavigationMode = function () {
        console.log("select" + this._inputNavigationMode.value);
        var navigationMode = Number(this._inputNavigationMode.value);
        this._currentNavigationMode = this._inputNavigationMode.value;
        this._curveShapeSpaceNavigator.inputSelectNavigationProcess(navigationMode);
    };
    ShapeSpaceNavigationEventListener.prototype.reinitializeNavigationMode = function () {
        this._currentNavigationMode = "0";
        this.clickNavigationMode();
    };
    ShapeSpaceNavigationEventListener.prototype.updateCurveShapeControlButtons = function () {
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
    };
    ShapeSpaceNavigationEventListener.prototype.resetCurveShapeControlButtons = function () {
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
    };
    ShapeSpaceNavigationEventListener.prototype.restorePreviousCurveShapeControlButtons = function () {
        this.controlOfCurvatureExtrema = this._previousControlOfCurvatureExtrema;
        this.controlOfInflection = this._previousControlOfInflection;
        this._sliding = this._previousSliding;
        this.controlOfEventAtExtremity = this.previousControlOfEventAtExtremity;
        this._curveShapeSpaceNavigator.restoreCurveControlState(this);
    };
    ShapeSpaceNavigationEventListener.prototype.storeCurrentCurveShapeControlButtons = function () {
        this._previousControlOfCurvatureExtrema = this.controlOfCurvatureExtrema;
        this._previousControlOfInflection = this.controlOfInflection;
        this._previousSliding = this._sliding;
        this.previousControlOfEventAtExtremity = this.controlOfEventAtExtremity;
    };
    ShapeSpaceNavigationEventListener.prototype.reinitializePreviousShapeControlButtons = function () {
        this._previousControlOfCurvatureExtrema = false;
        this._previousControlOfInflection = false;
        this._previousSliding = false;
        this.previousControlOfEventAtExtremity = false;
    };
    ShapeSpaceNavigationEventListener.prototype.updateEventMgmtAtCurveExtControlButton = function () {
        if (this.controlOfEventAtExtremity) {
            this._toggleButtonEventsStayInside.click();
        }
    };
    return ShapeSpaceNavigationEventListener;
}());
exports.ShapeSpaceNavigationEventListener = ShapeSpaceNavigationEventListener;
var CurveSceneEventListener = /** @class */ (function () {
    // private readonly iconKnotInsertion: HTMLImageElement;
    // private readonly textureInfo: {width: number, height: number, texture: WebGLTexture|null};
    function CurveSceneEventListener(curveModelDefinitionEventListener, shapeSpaceNavigationEventListener) {
        var _this = this;
        this.canvas = document.getElementById("webgl");
        this.gl = webgl_utils_1.WebGLUtils().setupWebGL(this.canvas);
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
        document.body.addEventListener("touchstart", function (e) {
            if (e.target === _this.canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchend", function (e) {
            if (e.target === _this.canvas) {
                e.preventDefault();
            }
        }, false);
        document.body.addEventListener("touchmove", function (e) {
            if (e.target === _this.canvas) {
                e.preventDefault();
            }
        }, false);
        if (!this.gl) {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "CurveSceneEventListener", "Failed to get the rendering context for WebGL. Stop program.");
            error.logMessage();
            return;
        }
    }
    Object.defineProperty(CurveSceneEventListener.prototype, "curveSceneController", {
        get: function () {
            return this._curveSceneController;
        },
        enumerable: false,
        configurable: true
    });
    CurveSceneEventListener.prototype.mouse_get_NormalizedDeviceCoordinates = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x, y;
        x = ((event.clientX - rect.left) - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - (event.clientY - rect.top)) / (this.canvas.height / 2);
        return [x, y];
    };
    CurveSceneEventListener.prototype.touch_get_NormalizedDeviceCoordinates = function (event) {
        var rect = this.canvas.getBoundingClientRect();
        var x, y;
        var ev = event.touches[0];
        x = ((ev.clientX - rect.left) - this.canvas.width / 2) / (this.canvas.width / 2);
        y = (this.canvas.height / 2 - (ev.clientY - rect.top)) / (this.canvas.height / 2);
        return [x, y];
    };
    CurveSceneEventListener.prototype.mouse_click = function (ev) {
        var c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDown_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.mouse_double_click = function (ev) {
        var c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        var active_clamping = this._curveSceneController.dbleClick_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        console.log("mouse_double_click: " + active_clamping);
        if (!active_clamping)
            this.curveModelDefinitionEventListener.toggleButtonCurveClamping.click();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.mouse_drag = function (ev) {
        var c = this.mouse_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDragged_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.mouse_stop_drag = function (ev) {
        this._curveSceneController.leftMouseUp_event();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.touch_click = function (ev) {
        var c = this.touch_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDown_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.touch_drag = function (ev) {
        var c = this.touch_get_NormalizedDeviceCoordinates(ev);
        this._curveSceneController.leftMouseDragged_event(c[0], c[1]);
        this._curveSceneController.renderFrame();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.touch_stop_drag = function (ev) {
        this._curveSceneController.leftMouseUp_event();
        ev.preventDefault();
    };
    CurveSceneEventListener.prototype.keyDown = function (ev) {
        var keyName = ev.key;
        if (keyName === "Shift")
            this._curveSceneController.shiftKeyDown();
    };
    CurveSceneEventListener.prototype.keyUp = function (ev) {
        var keyName = ev.key;
        if (keyName === "Shift")
            this._curveSceneController.shiftKeyUp();
    };
    // All methods hereunder are a basis for tests to be able to load texture from a file and use it as background of the canvas
    CurveSceneEventListener.prototype.processInputTexture = function () {
        // this.textureInfo.width = this.iconKnotInsertion.width;
        // this.textureInfo.height = this.iconKnotInsertion.height;
        // this.gl.bindTexture(this.gl.TEXTURE_2D, this.textureInfo.texture);
        // this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.iconKnotInsertion);
    };
    CurveSceneEventListener.prototype.stuffThatCouldBeUsedToLoadAnImageAndProcessTextures = function () {
        var VSHADER_SOURCE = 'attribute vec4 a_position;\n' +
            'attribute vec2 a_texcoord;\n' +
            'uniform mat4 u_matrix;\n' +
            'varying vec2 v_texcoord;\n' +
            'void main() {\n' +
            '   gl_Position = u_matrix * a_position;\n' +
            '   v_texcoord = a_texcoord;\n' +
            '}\n';
        var FSHADER_SOURCE = 'precision mediump float;\n' +
            'varying vec2 v_texcoord;\n' +
            'uniform sampler2D u_texture;\n' +
            'void main() {\n' +
            '   gl_FragColor = texture2D(u_texture, v_texcoord);\n' +
            '}\n';
        var program = cuon_utils_1.createProgram(this.gl, VSHADER_SOURCE, FSHADER_SOURCE);
        if (!program) {
            console.log('Failed to create program');
        }
        else {
            //gl.useProgram(program);
            var positionLocation = this.gl.getAttribLocation(program, "a_position");
            var texcoordLocation = this.gl.getAttribLocation(program, "a_texcoord");
            // lookup uniforms
            var matrixLocation = this.gl.getUniformLocation(program, "u_matrix");
            var textureLocation = this.gl.getUniformLocation(program, "u_texture");
        }
        // Create a buffer.
        var positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // Put a unit quad in the buffer
        var positions = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
        // Create a buffer for texture coords
        var texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        // Put texcoords in the buffer
        var texcoords = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);
        var tex = this.gl.createTexture();
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
    };
    CurveSceneEventListener.prototype.loadImageAndCreateTextureInfo = function (url) {
        var _this = this;
        var tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        // Fill the texture with a 1x1 blue pixel.
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        // let's assume all images are not a power of 2
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        var textureInfo = {
            width: 1,
            height: 1,
            texture: tex,
        };
        var img = new Image();
        img.addEventListener('load', function () {
            textureInfo.width = img.width;
            textureInfo.height = img.height;
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, textureInfo.texture);
            _this.gl.texImage2D(_this.gl.TEXTURE_2D, 0, _this.gl.RGBA, _this.gl.RGBA, _this.gl.UNSIGNED_BYTE, img);
        });
        img.src = url;
        return textureInfo;
    };
    CurveSceneEventListener.prototype.drawImage = function (tex, texWidth, texHeight, dstX, dstY) {
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
    };
    return CurveSceneEventListener;
}());
exports.CurveSceneEventListener = CurveSceneEventListener;
