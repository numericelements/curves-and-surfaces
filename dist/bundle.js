/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/controllers/CurveSceneController.ts":
/*!*************************************************!*\
  !*** ./src/controllers/CurveSceneController.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveSceneController = void 0;
var CurveModel_1 = __webpack_require__(/*! ../models/CurveModel */ "./src/models/CurveModel.ts");
var ControlPointsView_1 = __webpack_require__(/*! ../views/ControlPointsView */ "./src/views/ControlPointsView.ts");
var ControlPointsShaders_1 = __webpack_require__(/*! ../views/ControlPointsShaders */ "./src/views/ControlPointsShaders.ts");
var ControlPolygonShaders_1 = __webpack_require__(/*! ../views/ControlPolygonShaders */ "./src/views/ControlPolygonShaders.ts");
var ControlPolygonView_1 = __webpack_require__(/*! ../views/ControlPolygonView */ "./src/views/ControlPolygonView.ts");
var CurveShaders_1 = __webpack_require__(/*! ../views/CurveShaders */ "./src/views/CurveShaders.ts");
var CurveView_1 = __webpack_require__(/*! ../views/CurveView */ "./src/views/CurveView.ts");
var InsertKnotButtonShaders_1 = __webpack_require__(/*! ../views/InsertKnotButtonShaders */ "./src/views/InsertKnotButtonShaders.ts");
var ClickButtonView_1 = __webpack_require__(/*! ../views/ClickButtonView */ "./src/views/ClickButtonView.ts");
var DifferentialEventShaders_1 = __webpack_require__(/*! ../views/DifferentialEventShaders */ "./src/views/DifferentialEventShaders.ts");
var TransitionDifferentialEventShaders_1 = __webpack_require__(/*! ../views/TransitionDifferentialEventShaders */ "./src/views/TransitionDifferentialEventShaders.ts");
var CurvatureExtremaView_1 = __webpack_require__(/*! ../views/CurvatureExtremaView */ "./src/views/CurvatureExtremaView.ts");
var InflectionsView_1 = __webpack_require__(/*! ../views/InflectionsView */ "./src/views/InflectionsView.ts");
var SlidingStrategy_1 = __webpack_require__(/*! ./SlidingStrategy */ "./src/controllers/SlidingStrategy.ts");
var NoSlidingStrategy_1 = __webpack_require__(/*! ./NoSlidingStrategy */ "./src/controllers/NoSlidingStrategy.ts");
var TransitionCurvatureExtremaView_1 = __webpack_require__(/*! ../views/TransitionCurvatureExtremaView */ "./src/views/TransitionCurvatureExtremaView.ts");
var CurveSceneController = /** @class */ (function () {
    function CurveSceneController(canvas, gl) {
        this.canvas = canvas;
        this.gl = gl;
        this.selectedControlPoint = null;
        this.dragging = false;
        this.curveModel = new CurveModel_1.CurveModel();
        this.controlPointsShaders = new ControlPointsShaders_1.ControlPointsShaders(this.gl);
        this.controlPointsView = new ControlPointsView_1.ControlPointsView(this.curveModel.spline, this.controlPointsShaders, 1, 1, 1);
        this.controlPolygonShaders = new ControlPolygonShaders_1.ControlPolygonShaders(this.gl);
        this.controlPolygonView = new ControlPolygonView_1.ControlPolygonView(this.curveModel.spline, this.controlPolygonShaders, false);
        this.curveShaders = new CurveShaders_1.CurveShaders(this.gl);
        this.curveView = new CurveView_1.CurveView(this.curveModel.spline, this.curveShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.insertKnotButtonShaders = new InsertKnotButtonShaders_1.InsertKnotButtonShaders(this.gl);
        this.insertKnotButtonView = new ClickButtonView_1.ClickButtonView(-0.8, 0.8, this.insertKnotButtonShaders);
        this.differentialEventShaders = new DifferentialEventShaders_1.DifferentialEventShaders(this.gl);
        this.transitionDifferentialEventShaders = new TransitionDifferentialEventShaders_1.TransitionDifferentialEventShaders(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView_1.CurvatureExtremaView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.transitionCurvatureExtremaView = new TransitionCurvatureExtremaView_1.TransitionCurvatureExtremaView(this.curveModel.spline, this.transitionDifferentialEventShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.inflectionsView = new InflectionsView_1.InflectionsView(this.curveModel.spline, this.differentialEventShaders, 216 / 255, 120 / 255, 120 / 255, 1);
        this.controlOfCurvatureExtrema = true;
        this.controlOfInflection = true;
        this.curveModel.registerObserver(this.controlPointsView);
        this.curveModel.registerObserver(this.controlPolygonView);
        this.curveModel.registerObserver(this.curveView);
        this.curveModel.registerObserver(this.curvatureExtremaView);
        this.curveModel.registerObserver(this.transitionCurvatureExtremaView);
        this.curveModel.registerObserver(this.inflectionsView);
        this.curveControl = new SlidingStrategy_1.SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema);
        this.sliding = true;
    }
    CurveSceneController.prototype.renderFrame = function () {
        var px = 100, size = Math.min(window.innerWidth, window.innerHeight) - px;
        this.canvas.width = size;
        this.canvas.height = size;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.clearColor(0.3, 0.3, 0.3, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.curveView.renderFrame();
        this.curvatureExtremaView.renderFrame();
        //this.transitionCurvatureExtremaView.renderFrame()
        this.inflectionsView.renderFrame();
        this.controlPolygonView.renderFrame();
        this.controlPointsView.renderFrame();
        this.insertKnotButtonView.renderFrame();
    };
    CurveSceneController.prototype.toggleControlOfCurvatureExtrema = function () {
        this.curveControl.toggleControlOfCurvatureExtrema();
        this.controlOfCurvatureExtrema = !this.controlOfCurvatureExtrema;
        //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
    };
    CurveSceneController.prototype.toggleControlOfInflections = function () {
        this.curveControl.toggleControlOfInflections();
        this.controlOfInflection = !this.controlOfInflection;
        //console.log("constrol of inflections: " + this.controlOfInflection)
    };
    CurveSceneController.prototype.toggleSliding = function () {
        if (this.sliding === true) {
            this.sliding = false;
            //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
            //console.log("constrol of inflections: " + this.controlOfInflection)
            this.curveControl = new NoSlidingStrategy_1.NoSlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema);
        }
        else {
            this.sliding = true;
            //console.log("constrol of curvature extrema: " + this.controlOfCurvatureExtrema)
            //console.log("constrol of inflections: " + this.controlOfInflection)
            this.curveControl = new SlidingStrategy_1.SlidingStrategy(this.curveModel, this.controlOfInflection, this.controlOfCurvatureExtrema);
        }
    };
    CurveSceneController.prototype.leftMouseDown_event = function (ndcX, ndcY, deltaSquared) {
        if (deltaSquared === void 0) { deltaSquared = 0.01; }
        if (this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== null) {
            var cp = this.selectedControlPoint;
            if (cp === 0) {
                cp += 1;
            }
            if (cp === this.curveModel.spline.controlPoints.length - 1) {
                cp -= 1;
            }
            var grevilleAbscissae = this.curveModel.spline.grevilleAbscissae();
            if (cp != null) {
                this.curveModel.spline.insertKnot(grevilleAbscissae[cp]);
                this.curveControl.resetCurve(this.curveModel);
                this.curveModel.notifyObservers();
            }
        }
        this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
        this.controlPointsView.setSelected(this.selectedControlPoint);
        if (this.selectedControlPoint !== null) {
            this.dragging = true;
        }
    };
    CurveSceneController.prototype.leftMouseDragged_event = function (ndcX, ndcY) {
        var x = ndcX, y = ndcY, selectedControlPoint = this.controlPointsView.getSelectedControlPoint();
        if (selectedControlPoint != null && this.dragging === true) {
            this.curveModel.setControlPoint(selectedControlPoint, x, y);
            this.curveControl.optimize(selectedControlPoint, x, y);
            this.curveModel.notifyObservers();
        }
    };
    CurveSceneController.prototype.leftMouseUp_event = function () {
        this.dragging = false;
    };
    return CurveSceneController;
}());
exports.CurveSceneController = CurveSceneController;


/***/ }),

/***/ "./src/controllers/NoSlidingStrategy.ts":
/*!**********************************************!*\
  !*** ./src/controllers/NoSlidingStrategy.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NoSlidingStrategy = void 0;
var OptimizationProblem_BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/OptimizationProblem_BSpline_R1_to_R2 */ "./src/mathematics/OptimizationProblem_BSpline_R1_to_R2.ts");
var Optimizer_1 = __webpack_require__(/*! ../mathematics/Optimizer */ "./src/mathematics/Optimizer.ts");
var NoSlidingStrategy = /** @class */ (function () {
    function NoSlidingStrategy(curveModel, controlOfInflection, controlOfCurvatureExtrema) {
        this.activeOptimizer = true;
        var activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both;
        if (!controlOfCurvatureExtrema) {
            activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections;
        }
        else if (!controlOfInflection) {
            activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema;
        }
        if (!controlOfInflection && !controlOfCurvatureExtrema) {
            this.activeOptimizer = false;
            //console.log("activeOptimizer in NoSlidingStrategy: " + this.activeOptimizer)
        }
        this.curveModel = curveModel;
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl);
        this.optimizer = this.newOptimizer(this.optimizationProblem);
    }
    NoSlidingStrategy.prototype.setWeightingFactor = function (optimizationProblem) {
        optimizationProblem.weigthingFactors[0] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length - 1] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length * 2 - 1] = 10;
    };
    NoSlidingStrategy.prototype.newOptimizer = function (optimizationProblem) {
        this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    NoSlidingStrategy.prototype.resetCurve = function (curveModel) {
        this.curveModel = curveModel;
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
    };
    NoSlidingStrategy.prototype.toggleControlOfCurvatureExtrema = function () {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true;
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema");
        }
    };
    NoSlidingStrategy.prototype.toggleControlOfInflections = function () {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true;
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else {
            console.log("Error in logic of toggle control over inflections");
        }
    };
    NoSlidingStrategy.prototype.toggleSliding = function () {
        throw new Error("Method not implemented.");
    };
    NoSlidingStrategy.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        if (this.activeOptimizer === false)
            return;
        var p = this.curveModel.spline.controlPoints[selectedControlPoint];
        this.curveModel.setControlPoint(selectedControlPoint, ndcX, ndcY);
        this.optimizationProblem.setTargetSpline(this.curveModel.spline);
        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800);
            this.curveModel.setSpline(this.optimizationProblem.spline.clone());
        }
        catch (e) {
            this.curveModel.setControlPoint(selectedControlPoint, p.x, p.y);
            console.log(e);
        }
    };
    return NoSlidingStrategy;
}());
exports.NoSlidingStrategy = NoSlidingStrategy;


/***/ }),

/***/ "./src/controllers/SlidingStrategy.ts":
/*!********************************************!*\
  !*** ./src/controllers/SlidingStrategy.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingStrategy = void 0;
var OptimizationProblem_BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/OptimizationProblem_BSpline_R1_to_R2 */ "./src/mathematics/OptimizationProblem_BSpline_R1_to_R2.ts");
var Optimizer_1 = __webpack_require__(/*! ../mathematics/Optimizer */ "./src/mathematics/Optimizer.ts");
var SlidingStrategy = /** @class */ (function () {
    function SlidingStrategy(curveModel, controlOfInflection, controlOfCurvatureExtrema) {
        this.activeOptimizer = true;
        this.curveModel = curveModel;
        //enum ActiveControl {curvatureExtrema, inflections, both}
        var activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both;
        if (!controlOfCurvatureExtrema) {
            activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections;
        }
        else if (!controlOfInflection) {
            activeControl = OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema;
        }
        if (!controlOfInflection && !controlOfCurvatureExtrema) {
            this.activeOptimizer = false;
            //console.log("activeOptimizer in SlidingStrategy: " + this.activeOptimizer)
        }
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), activeControl);
        this.optimizer = this.newOptimizer(this.optimizationProblem);
    }
    SlidingStrategy.prototype.setWeightingFactor = function (optimizationProblem) {
        optimizationProblem.weigthingFactors[0] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length - 1] = 10;
        optimizationProblem.weigthingFactors[this.curveModel.spline.controlPoints.length * 2 - 1] = 10;
    };
    SlidingStrategy.prototype.newOptimizer = function (optimizationProblem) {
        this.setWeightingFactor(optimizationProblem);
        return new Optimizer_1.Optimizer(optimizationProblem);
    };
    SlidingStrategy.prototype.resetCurve = function (curveModel) {
        this.curveModel = curveModel;
        this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone());
        this.optimizer = this.newOptimizer(this.optimizationProblem);
    };
    SlidingStrategy.prototype.toggleControlOfCurvatureExtrema = function () {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true;
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema) {
            this.activeOptimizer = false;
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else {
            console.log("Error in logic of toggle control over curvature extrema");
        }
    };
    SlidingStrategy.prototype.toggleControlOfInflections = function () {
        if (this.activeOptimizer === false) {
            this.activeOptimizer = true;
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.inflections) {
            this.activeOptimizer = false;
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else if (this.optimizationProblem.activeControl === OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.curvatureExtrema) {
            this.optimizationProblem = new OptimizationProblem_BSpline_R1_to_R2_1.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(this.curveModel.spline.clone(), this.curveModel.spline.clone(), OptimizationProblem_BSpline_R1_to_R2_1.ActiveControl.both);
            this.optimizer = this.newOptimizer(this.optimizationProblem);
        }
        else {
            console.log("Error in logic of toggle control over inflections");
        }
    };
    SlidingStrategy.prototype.toggleSliding = function () {
        throw new Error("Method not implemented.");
    };
    SlidingStrategy.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
        if (this.activeOptimizer === false)
            return;
        var p = this.curveModel.spline.controlPoints[selectedControlPoint];
        this.curveModel.setControlPoint(selectedControlPoint, ndcX, ndcY);
        this.optimizationProblem.setTargetSpline(this.curveModel.spline);
        try {
            this.optimizer.optimize_using_trust_region(10e-8, 100, 800);
            this.curveModel.setSpline(this.optimizationProblem.spline.clone());
        }
        catch (e) {
            this.curveModel.setControlPoint(selectedControlPoint, p.x, p.y);
            console.log(e);
        }
    };
    return SlidingStrategy;
}());
exports.SlidingStrategy = SlidingStrategy;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
//import { OvalCurveSceneController } from "./controllers/OvalCurveSceneController"
var CurveSceneController_1 = __webpack_require__(/*! ./controllers/CurveSceneController */ "./src/controllers/CurveSceneController.ts");
var webgl_utils_1 = __webpack_require__(/*! ./webgl/webgl-utils */ "./src/webgl/webgl-utils.ts");
function main() {
    var canvas = document.getElementById("webgl");
    var toggleButtonCurvatureExtrema = document.getElementById("toggleButtonCurvatureExtrema");
    var toggleButtonInflection = document.getElementById("toggleButtonInflections");
    var toggleButtonSliding = document.getElementById("toggleButtonSliding");
    var gl = webgl_utils_1.WebGLUtils().setupWebGL(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
    var sceneController = new CurveSceneController_1.CurveSceneController(canvas, gl);
    // let sceneController = new OvalCurveSceneController(canvas, gl)
    function mouse_get_NormalizedDeviceCoordinates(event) {
        var x, y, rect = canvas.getBoundingClientRect(), ev;
        ev = event;
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        return [x, y];
    }
    function touch_get_NormalizedDeviceCoordinates(event) {
        var x, y, rect = canvas.getBoundingClientRect(), ev;
        ev = event.touches[0];
        x = ((ev.clientX - rect.left) - canvas.width / 2) / (canvas.width / 2);
        y = (canvas.height / 2 - (ev.clientY - rect.top)) / (canvas.height / 2);
        return [x, y];
    }
    //function click(ev, canvas) {
    function mouse_click(ev) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDown_event(c[0], c[1], 0.0005);
        sceneController.renderFrame();
        ev.preventDefault();
    }
    //function drag(ev, canvas) {
    function mouse_drag(ev) {
        var c = mouse_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDragged_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }
    function mouse_stop_drag(ev) {
        sceneController.leftMouseUp_event();
        ev.preventDefault();
    }
    //function click(ev, canvas) {
    function touch_click(ev) {
        var c = touch_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDown_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }
    //function drag(ev, canvas) {
    function touch_drag(ev) {
        var c = touch_get_NormalizedDeviceCoordinates(ev);
        sceneController.leftMouseDragged_event(c[0], c[1]);
        sceneController.renderFrame();
        ev.preventDefault();
    }
    function touch_stop_drag(ev) {
        sceneController.leftMouseUp_event();
        ev.preventDefault();
    }
    function toggleControlOfCurvatureExtrema() {
        sceneController.toggleControlOfCurvatureExtrema();
    }
    function toggleControlOfInflections() {
        sceneController.toggleControlOfInflections();
    }
    function toggleSliding() {
        sceneController.toggleSliding();
    }
    canvas.addEventListener('mousedown', mouse_click, false);
    canvas.addEventListener('mousemove', mouse_drag, false);
    canvas.addEventListener('mouseup', mouse_stop_drag, false);
    canvas.addEventListener('touchstart', touch_click, false);
    canvas.addEventListener('touchmove', touch_drag, false);
    canvas.addEventListener('touchend', touch_stop_drag, false);
    toggleButtonCurvatureExtrema.addEventListener('click', toggleControlOfCurvatureExtrema);
    toggleButtonInflection.addEventListener('click', toggleControlOfInflections);
    toggleButtonSliding.addEventListener('click', toggleSliding);
    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, false);
    sceneController.renderFrame();
}
exports.main = main;
main();


/***/ }),

/***/ "./src/mathematics/BSpline_R1_to_R1.ts":
/*!*********************************************!*\
  !*** ./src/mathematics/BSpline_R1_to_R1.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BSpline_R1_to_R1 = void 0;
var Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts");
var Piegl_Tiller_NURBS_Book_2 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts");
var Piegl_Tiller_NURBS_Book_3 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts");
/**
 * A B-Spline function from a one dimensional real space to a one dimensional real space
 */
var BSpline_R1_to_R1 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSpline_R1_to_R1(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [0]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = [];
        this._knots = [];
        this._degree = 0;
        this._controlPoints = controlPoints;
        this._knots = knots;
        this._degree = this._knots.length - this._controlPoints.length - 1;
        if (this._degree < 0) {
            throw new Error("Negative degree BSpline_R1_to_R1 are not supported");
        }
    }
    Object.defineProperty(BSpline_R1_to_R1.prototype, "controlPoints", {
        get: function () {
            return this._controlPoints;
        },
        set: function (controlPoints) {
            this._controlPoints = controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R1.prototype, "knots", {
        get: function () {
            return this._knots;
        },
        set: function (knots) {
            this._knots = knots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R1.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    BSpline_R1_to_R1.prototype.setControlPoint = function (index, value) {
        this._controlPoints[index] = value;
    };
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    BSpline_R1_to_R1.prototype.evaluate = function (u) {
        var span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        var basis = Piegl_Tiller_NURBS_Book_2.basisFunctions(span, u, this._knots, this._degree);
        var result = 0;
        for (var i = 0; i < this.degree + 1; i += 1) {
            result += basis[i] * this._controlPoints[span - this._degree + i];
        }
        return result;
    };
    BSpline_R1_to_R1.prototype.derivative = function () {
        var newControlPoints = [];
        var newKnots = [];
        for (var i = 0; i < this.controlPoints.length - 1; i += 1) {
            newControlPoints[i] = (this.controlPoints[i + 1] - (this.controlPoints[i])) * (this.degree / (this.knots[i + this.degree + 1] - this.knots[i + 1]));
        }
        newKnots = this.knots.slice(1, this.knots.length - 1);
        return new BSpline_R1_to_R1(newControlPoints, newKnots);
    };
    BSpline_R1_to_R1.prototype.bernsteinDecomposition = function () {
        // Piegl_Tiller_NURBS_BOOK.ts
        return Piegl_Tiller_NURBS_Book_3.decomposeFunction(this);
    };
    BSpline_R1_to_R1.prototype.distinctKnots = function () {
        var result = [this.knots[0]];
        var temp = result[0];
        for (var i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    };
    BSpline_R1_to_R1.prototype.zeros = function (tolerance) {
        if (tolerance === void 0) { tolerance = 10e-8; }
        //see : chapter 11 : Computing Zeros of Splines by Tom Lyche and Knut Morken for u_star method
        var spline = new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice());
        var greville = spline.grevilleAbscissae();
        var maxError = tolerance * 2;
        var vertexIndex = [];
        while (maxError > tolerance) {
            var cpLeft = spline.controlPoints[0];
            vertexIndex = [];
            var maximum = 0;
            for (var index = 1; index < spline.controlPoints.length; index += 1) {
                var cpRight = spline.controlPoints[index];
                if (cpLeft <= 0 && cpRight > 0) {
                    vertexIndex.push(index);
                }
                if (cpLeft >= 0 && cpRight < 0) {
                    vertexIndex.push(index);
                }
                cpLeft = cpRight;
            }
            for (var i = 0; i < vertexIndex.length; i += 1) {
                var uLeft = greville[vertexIndex[i] - 1];
                var uRight = greville[vertexIndex[i]];
                if (uRight - uLeft > maximum) {
                    maximum = uRight - uLeft;
                }
                if (uRight - uLeft > tolerance) {
                    spline.insertKnot((uLeft + uRight) / 2);
                    greville = spline.grevilleAbscissae();
                }
            }
            maxError = maximum;
        }
        var result = [];
        for (var i = 0; i < vertexIndex.length; i += 1) {
            result.push(greville[vertexIndex[i]]);
        }
        return result;
    };
    BSpline_R1_to_R1.prototype.grevilleAbscissae = function () {
        var result = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var sum = 0;
            for (var j = i + 1; j < i + this.degree + 1; j += 1) {
                sum += this.knots[j];
            }
            result.push(sum / this.degree);
        }
        return result;
    };
    BSpline_R1_to_R1.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this.knots, this.degree);
        var multiplicity = 0;
        var newControlPoints = [];
        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (var i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = this.controlPoints[i - 1] * (1 - alpha) + this.controlPoints[i] * alpha;
            }
            for (var i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this.knots.splice(index + 1, 0, u);
            this.controlPoints = newControlPoints.slice();
        }
    };
    BSpline_R1_to_R1.prototype.knotMultiplicity = function (indexFromFindSpan) {
        var result = 0;
        var i = 0;
        while (this.knots[indexFromFindSpan + i] === this.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    /**
     * Return a deep copy of this b-spline
     */
    BSpline_R1_to_R1.prototype.clone = function () {
        return new BSpline_R1_to_R1(this.controlPoints.slice(), this.knots.slice());
    };
    BSpline_R1_to_R1.prototype.clamp = function (u) {
        // Piegl and Tiller, The NURBS book, p: 151
        var index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this.knots, this.degree);
        var newControlPoints = [];
        var multiplicity = 0;
        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        var times = this.degree - multiplicity + 1;
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (var i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = this.controlPoints[i - 1] * (1 - alpha) + this.controlPoints[i] * alpha;
            }
            for (var i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this.knots.splice(index + 1, 0, u);
            this.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    return BSpline_R1_to_R1;
}());
exports.BSpline_R1_to_R1 = BSpline_R1_to_R1;


/***/ }),

/***/ "./src/mathematics/BSpline_R1_to_R2.ts":
/*!*********************************************!*\
  !*** ./src/mathematics/BSpline_R1_to_R2.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.create_BSpline_R1_to_R2 = exports.BSpline_R1_to_R2 = void 0;
var Piegl_Tiller_NURBS_Book_1 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts");
var Piegl_Tiller_NURBS_Book_2 = __webpack_require__(/*! ./Piegl_Tiller_NURBS_Book */ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts");
var Vector_2d_1 = __webpack_require__(/*! ./Vector_2d */ "./src/mathematics/Vector_2d.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
var BSpline_R1_to_R2 = /** @class */ (function () {
    /**
     * Create a B-Spline
     * @param controlPoints The control points array
     * @param knots The knot vector
     */
    function BSpline_R1_to_R2(controlPoints, knots) {
        if (controlPoints === void 0) { controlPoints = [new Vector_2d_1.Vector_2d(0, 0)]; }
        if (knots === void 0) { knots = [0, 1]; }
        this._controlPoints = [];
        this._knots = [];
        this._degree = 0;
        this._controlPoints = controlPoints;
        this._knots = knots;
        this._degree = this._knots.length - this._controlPoints.length - 1;
        if (this._degree < 0) {
            throw new Error("Negative degree BSpline_R1_to_R2 are not supported");
        }
    }
    Object.defineProperty(BSpline_R1_to_R2.prototype, "controlPoints", {
        get: function () {
            return this._controlPoints;
        },
        set: function (controlPoints) {
            this._controlPoints = controlPoints;
        },
        enumerable: false,
        configurable: true
    });
    BSpline_R1_to_R2.prototype.visibleControlPoints = function () {
        return this.controlPoints;
    };
    Object.defineProperty(BSpline_R1_to_R2.prototype, "knots", {
        get: function () {
            return this._knots;
        },
        set: function (knots) {
            this._knots = knots;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R2.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: false,
        configurable: true
    });
    BSpline_R1_to_R2.prototype.setControlPoint = function (index, value) {
        this._controlPoints[index] = value;
    };
    BSpline_R1_to_R2.prototype.setControlPoints = function (controlPoints) {
        this.controlPoints = controlPoints;
    };
    /**
     * B-Spline evaluation
     * @param u The parameter
     * @returns the value of the B-Spline at u
     */
    BSpline_R1_to_R2.prototype.evaluate = function (u) {
        var span = Piegl_Tiller_NURBS_Book_1.findSpan(u, this._knots, this._degree);
        var basis = Piegl_Tiller_NURBS_Book_2.basisFunctions(span, u, this._knots, this._degree);
        var result = new Vector_2d_1.Vector_2d(0, 0);
        for (var i = 0; i < this.degree + 1; i += 1) {
            result.x += basis[i] * this._controlPoints[span - this._degree + i].x;
            result.y += basis[i] * this._controlPoints[span - this._degree + i].y;
        }
        return result;
    };
    /**
     * Return a deep copy of this b-spline
     */
    BSpline_R1_to_R2.prototype.clone = function () {
        var cloneControlPoints = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            cloneControlPoints.push(new Vector_2d_1.Vector_2d(this.controlPoints[i].x, this.controlPoints[i].y));
        }
        return new BSpline_R1_to_R2(cloneControlPoints, this.knots.slice());
    };
    BSpline_R1_to_R2.prototype.optimizerStep = function (step) {
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            this.controlPoints[i].x += step[i];
            this.controlPoints[i].y += step[i + this.controlPoints.length];
        }
    };
    BSpline_R1_to_R2.prototype.getControlPointsX = function () {
        var result = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            result.push(this.controlPoints[i].x);
        }
        return result;
    };
    BSpline_R1_to_R2.prototype.getControlPointsY = function () {
        var result = [];
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            result.push(this.controlPoints[i].y);
        }
        return result;
    };
    BSpline_R1_to_R2.prototype.distinctKnots = function () {
        var result = [this.knots[0]];
        var temp = result[0];
        for (var i = 1; i < this.knots.length; i += 1) {
            if (this.knots[i] !== temp) {
                result.push(this.knots[i]);
                temp = this.knots[i];
            }
        }
        return result;
    };
    BSpline_R1_to_R2.prototype.moveControlPoint = function (i, deltaX, deltaY) {
        if (i < 0 || i >= this.controlPoints.length - this.degree) {
            throw new Error("Control point indentifier is out of range");
        }
        this.controlPoints[i].x += deltaX;
        this.controlPoints[i].y += deltaY;
    };
    BSpline_R1_to_R2.prototype.insertKnot = function (u, times) {
        if (times === void 0) { times = 1; }
        // Piegl and Tiller, The NURBS book, p: 151
        if (times <= 0) {
            return;
        }
        var index = Piegl_Tiller_NURBS_Book_1.findSpan(u, this.knots, this.degree), multiplicity = 0, i = 0, t = 0, newControlPoints, alpha = 0;
        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        for (t = 0; t < times; t += 1) {
            newControlPoints = [];
            for (i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = (this.controlPoints[i - 1].multiply(1 - alpha)).add(this.controlPoints[i].multiply(alpha));
            }
            for (i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this._knots.splice(index + 1, 0, u);
            this._controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    BSpline_R1_to_R2.prototype.knotMultiplicity = function (indexFromFindSpan) {
        var result = 0, i = 0;
        while (this.knots[indexFromFindSpan + i] === this.knots[indexFromFindSpan]) {
            i -= 1;
            result += 1;
            if (indexFromFindSpan + i < 0) {
                break;
            }
        }
        return result;
    };
    BSpline_R1_to_R2.prototype.grevilleAbscissae = function () {
        var result = [], i, j, sum;
        for (i = 0; i < this.controlPoints.length; i += 1) {
            sum = 0;
            for (j = i + 1; j < i + this.degree + 1; j += 1) {
                sum += this.knots[j];
            }
            result.push(sum / this.degree);
        }
        return result;
    };
    BSpline_R1_to_R2.prototype.clamp = function (u) {
        // Piegl and Tiller, The NURBS book, p: 151
        var index = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(u, this.knots, this.degree);
        var newControlPoints = [];
        var multiplicity = 0;
        if (u === this.knots[index]) {
            multiplicity = this.knotMultiplicity(index);
        }
        var times = this.degree - multiplicity + 1;
        for (var t = 0; t < times; t += 1) {
            for (var i = 0; i < index - this.degree + 1; i += 1) {
                newControlPoints[i] = this.controlPoints[i];
            }
            for (var i = index - this.degree + 1; i <= index - multiplicity; i += 1) {
                var alpha = (u - this.knots[i]) / (this.knots[i + this.degree] - this.knots[i]);
                newControlPoints[i] = (this.controlPoints[i - 1].multiply(1 - alpha)).add(this.controlPoints[i].multiply(alpha));
            }
            for (var i = index - multiplicity; i < this.controlPoints.length; i += 1) {
                newControlPoints[i + 1] = this.controlPoints[i];
            }
            this.knots.splice(index + 1, 0, u);
            this.controlPoints = newControlPoints.slice();
            multiplicity += 1;
            index += 1;
        }
    };
    /**
     *
     * @param from Parametric position where the section start
     * @param to Parametric position where the section end
     * @retrun the BSpline_R1_to_R2 section
     */
    BSpline_R1_to_R2.prototype.section = function (from, to) {
        var spline = this.clone();
        spline.clamp(from);
        spline.clamp(to);
        //const newFromSpan = findSpan(from, spline._knots, spline._degree)
        //const newToSpan = findSpan(to, spline._knots, spline._degree)
        var newFromSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(from, spline._knots, spline._degree);
        var newToSpan = Piegl_Tiller_NURBS_Book_1.clampingFindSpan(to, spline._knots, spline._degree);
        var newKnots = [];
        var newControlPoints = [];
        for (var i = newFromSpan - spline._degree; i < newToSpan + 1; i += 1) {
            newKnots.push(spline._knots[i]);
        }
        for (var i = newFromSpan - spline._degree; i < newToSpan - spline._degree; i += 1) {
            newControlPoints.push(new Vector_2d_1.Vector_2d(spline._controlPoints[i].x, spline._controlPoints[i].y));
        }
        return new BSpline_R1_to_R2(newControlPoints, newKnots);
    };
    return BSpline_R1_to_R2;
}());
exports.BSpline_R1_to_R2 = BSpline_R1_to_R2;
function create_BSpline_R1_to_R2(controlPoints, knots) {
    var newControlPoints = [];
    for (var i = 0, n = controlPoints.length; i < n; i += 1) {
        newControlPoints.push(new Vector_2d_1.Vector_2d(controlPoints[i][0], controlPoints[i][1]));
    }
    return new BSpline_R1_to_R2(newControlPoints, knots);
}
exports.create_BSpline_R1_to_R2 = create_BSpline_R1_to_R2;


/***/ }),

/***/ "./src/mathematics/BSpline_R1_to_R2_DifferentialProperties.ts":
/*!********************************************************************!*\
  !*** ./src/mathematics/BSpline_R1_to_R2_DifferentialProperties.ts ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BSpline_R1_to_R2_DifferentialProperties = void 0;
var BSpline_R1_to_R1_1 = __webpack_require__(/*! ./BSpline_R1_to_R1 */ "./src/mathematics/BSpline_R1_to_R1.ts");
var BernsteinDecomposition_R1_to_R1_1 = __webpack_require__(/*! ./BernsteinDecomposition_R1_to_R1 */ "./src/mathematics/BernsteinDecomposition_R1_to_R1.ts");
/**
 * A B-Spline function from a one dimensional real space to a two dimensional real space
 */
var BSpline_R1_to_R2_DifferentialProperties = /** @class */ (function () {
    function BSpline_R1_to_R2_DifferentialProperties(spline) {
        this.spline = spline;
    }
    BSpline_R1_to_R2_DifferentialProperties.prototype.expensiveComputation = function (spline) {
        var sx = new BSpline_R1_to_R1_1.BSpline_R1_to_R1(spline.getControlPointsX(), spline.knots);
        var sy = new BSpline_R1_to_R1_1.BSpline_R1_to_R1(spline.getControlPointsY(), spline.knots);
        var sxu = sx.derivative();
        var syu = sy.derivative();
        var sxuu = sxu.derivative();
        var syuu = syu.derivative();
        var sxuuu = sxuu.derivative();
        var syuuu = syuu.derivative();
        var bdsxu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxu.bernsteinDecomposition());
        var bdsyu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syu.bernsteinDecomposition());
        var bdsxuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxuu.bernsteinDecomposition());
        var bdsyuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syuu.bernsteinDecomposition());
        var bdsxuuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxuuu.bernsteinDecomposition());
        var bdsyuuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syuuu.bernsteinDecomposition());
        var h1 = (bdsxu.multiply(bdsxu)).add((bdsyu.multiply(bdsyu)));
        var h2 = (bdsxu.multiply(bdsyuuu)).subtract((bdsyu.multiply(bdsxuuu)));
        var h3 = (bdsxu.multiply(bdsxuu)).add((bdsyu.multiply(bdsyuu)));
        var h4 = (bdsxu.multiply(bdsyuu)).subtract((bdsyu.multiply(bdsxuu)));
        return {
            h1: h1,
            h2: h2,
            h3: h3,
            h4: h4
        };
    };
    BSpline_R1_to_R2_DifferentialProperties.prototype.curvatureNumerator = function () {
        var e = this.expensiveComputation(this.spline);
        var distinctKnots = this.spline.distinctKnots();
        var controlPoints = e.h4.flattenControlPointsArray();
        var curvatureNumeratorDegree = 2 * this.spline.degree - 3;
        var knots = [];
        for (var i = 0; i < distinctKnots.length; i += 1) {
            for (var j = 0; j < curvatureNumeratorDegree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1_1.BSpline_R1_to_R1(controlPoints, knots);
    };
    BSpline_R1_to_R2_DifferentialProperties.prototype.h1 = function () {
        var e = this.expensiveComputation(this.spline);
        var distinctKnots = this.spline.distinctKnots();
        var controlPoints = e.h1.flattenControlPointsArray();
        var h1Degree = 2 * this.spline.degree - 2;
        var knots = [];
        for (var i = 0; i < distinctKnots.length; i += 1) {
            for (var j = 0; j < h1Degree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1_1.BSpline_R1_to_R1(controlPoints, knots);
    };
    BSpline_R1_to_R2_DifferentialProperties.prototype.inflections = function (curvatureNumerator) {
        if (!curvatureNumerator) {
            curvatureNumerator = this.curvatureNumerator();
        }
        var zeros = curvatureNumerator.zeros();
        var result = [];
        for (var i = 0; i < zeros.length; i += 1) {
            result.push(this.spline.evaluate(zeros[i]));
        }
        return result;
    };
    BSpline_R1_to_R2_DifferentialProperties.prototype.curvatureDerivativeNumerator = function () {
        var e = this.expensiveComputation(this.spline);
        var bd_curvatureDerivativeNumerator = (e.h1.multiply(e.h2)).subtract(e.h3.multiply(e.h4).multiplyByScalar(3));
        var distinctKnots = this.spline.distinctKnots();
        var controlPoints = bd_curvatureDerivativeNumerator.flattenControlPointsArray();
        var curvatureDerivativeNumeratorDegree = 4 * this.spline.degree - 6;
        var knots = [];
        for (var i = 0; i < distinctKnots.length; i += 1) {
            for (var j = 0; j < curvatureDerivativeNumeratorDegree + 1; j += 1) {
                knots.push(distinctKnots[i]);
            }
        }
        return new BSpline_R1_to_R1_1.BSpline_R1_to_R1(controlPoints, knots);
    };
    BSpline_R1_to_R2_DifferentialProperties.prototype.curvatureExtrema = function (curvatureDerivativeNumerator) {
        if (!curvatureDerivativeNumerator) {
            curvatureDerivativeNumerator = this.curvatureDerivativeNumerator();
        }
        var zeros = curvatureDerivativeNumerator.zeros();
        var result = [];
        for (var i = 0; i < zeros.length; i += 1) {
            result.push(this.spline.evaluate(zeros[i]));
        }
        return result;
    };
    return BSpline_R1_to_R2_DifferentialProperties;
}());
exports.BSpline_R1_to_R2_DifferentialProperties = BSpline_R1_to_R2_DifferentialProperties;


/***/ }),

/***/ "./src/mathematics/BernsteinDecomposition_R1_to_R1.ts":
/*!************************************************************!*\
  !*** ./src/mathematics/BernsteinDecomposition_R1_to_R1.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BernsteinDecomposition_R1_to_R1 = void 0;
var BinomialCoefficient_1 = __webpack_require__(/*! ./BinomialCoefficient */ "./src/mathematics/BinomialCoefficient.ts");
/**
* A Bernstein decomposition of a B-Spline function from a one dimensional real space to a one dimensional real space
*/
var BernsteinDecomposition_R1_to_R1 = /** @class */ (function () {
    /**
     *
     * @param controlPointsArray An array of array of control points
     */
    function BernsteinDecomposition_R1_to_R1(controlPointsArray) {
        this.controlPointsArray = controlPointsArray;
    }
    BernsteinDecomposition_R1_to_R1.prototype.add = function (bd) {
        var result = [];
        for (var i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] + bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    };
    BernsteinDecomposition_R1_to_R1.prototype.subtract = function (bd) {
        var result = [];
        for (var i = 0; i < bd.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < bd.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] - bd.controlPointsArray[i][j];
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    };
    BernsteinDecomposition_R1_to_R1.prototype.multiply = function (bd) {
        return new BernsteinDecomposition_R1_to_R1(this.bernsteinMultiplicationArray(this.controlPointsArray, bd.controlPointsArray));
    };
    /**
     *
     * @param bd: BernsteinDecomposition_R1_to_R1
     * @param index: Index of the basis function
     */
    BernsteinDecomposition_R1_to_R1.prototype.multiplyRange = function (bd, start, lessThan) {
        var result = [];
        for (var i = start; i < lessThan; i += 1) {
            result[i - start] = this.bernsteinMultiplication(this.controlPointsArray[i], bd.controlPointsArray[i]);
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    };
    BernsteinDecomposition_R1_to_R1.prototype.bernsteinMultiplicationArray = function (f, g) {
        var result = [];
        for (var i = 0; i < f.length; i += 1) {
            result[i] = this.bernsteinMultiplication(f[i], g[i]);
        }
        return result;
    };
    BernsteinDecomposition_R1_to_R1.prototype.bernsteinMultiplication = function (f, g) {
        var f_degree = f.length - 1;
        var g_degree = g.length - 1;
        var result = [];
        /*
        for (let k = 0; k < f_degree + g_degree + 1; k += 1) {
            let cp = 0;
            for (let i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                let bfu = binomialCoefficient(f_degree, i);
                let bgu = binomialCoefficient(g_degree, k - i);
                let bfugu = binomialCoefficient(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }
        */
        /*
        BernsteinDecomposition_R1_to_R1.flopsCounter += 1
        if (BernsteinDecomposition_R1_to_R1.flopsCounter % 1000 === 0) {
          //console.log("Bernstein Multiplication")
          //console.log(BernsteinDecomposition_R1_to_R1.flopsCounter)
        }
        */
        for (var k = 0; k < f_degree + g_degree + 1; k += 1) {
            var cp = 0;
            for (var i = Math.max(0, k - g_degree); i < Math.min(f_degree, k) + 1; i += 1) {
                var bfu = BernsteinDecomposition_R1_to_R1.binomial(f_degree, i);
                var bgu = BernsteinDecomposition_R1_to_R1.binomial(g_degree, k - i);
                var bfugu = BernsteinDecomposition_R1_to_R1.binomial(f_degree + g_degree, k);
                cp += bfu * bgu / bfugu * f[i] * g[k - i];
            }
            result[k] = cp;
        }
        return result;
    };
    BernsteinDecomposition_R1_to_R1.prototype.multiplyByScalar = function (value) {
        var result = [];
        for (var i = 0; i < this.controlPointsArray.length; i += 1) {
            result[i] = [];
            for (var j = 0; j < this.controlPointsArray[0].length; j += 1) {
                result[i][j] = this.controlPointsArray[i][j] * value;
            }
        }
        return new BernsteinDecomposition_R1_to_R1(result);
    };
    BernsteinDecomposition_R1_to_R1.prototype.flattenControlPointsArray = function () {
        //return this.controlPointsArray.flat();
        return this.controlPointsArray.reduce(function (acc, val) {
            return acc.concat(val);
        }, []);
    };
    BernsteinDecomposition_R1_to_R1.prototype.subset = function (start, lessThan) {
        return new BernsteinDecomposition_R1_to_R1(this.controlPointsArray.slice(start, lessThan));
    };
    BernsteinDecomposition_R1_to_R1.binomial = BinomialCoefficient_1.memoizedBinomialCoefficient();
    BernsteinDecomposition_R1_to_R1.flopsCounter = 0;
    return BernsteinDecomposition_R1_to_R1;
}());
exports.BernsteinDecomposition_R1_to_R1 = BernsteinDecomposition_R1_to_R1;


/***/ }),

/***/ "./src/mathematics/BinomialCoefficient.ts":
/*!************************************************!*\
  !*** ./src/mathematics/BinomialCoefficient.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.memoizedBinomialCoefficient = exports.binomialCoefficient = void 0;
function binomialCoefficient(n, k) {
    var result = 1;
    if (n < k || k < 0) {
        return 0;
    }
    // take advantage of symmetry
    if (k > n - k) {
        k = n - k;
    }
    for (var x = n - k + 1; x <= n; x += 1) {
        result *= x;
    }
    for (var x = 1; x <= k; x += 1) {
        result /= x;
    }
    return result;
}
exports.binomialCoefficient = binomialCoefficient;
;
function memoizedBinomialCoefficient() {
    var cache = [];
    return function (n, k) {
        if (cache[n] !== undefined && cache[n][k] !== undefined) {
            return cache[n][k];
        }
        else {
            if (cache[n] === undefined) {
                cache[n] = [];
            }
            var result = binomialCoefficient(n, k);
            cache[n][k] = result;
            return result;
        }
    };
}
exports.memoizedBinomialCoefficient = memoizedBinomialCoefficient;
;


/***/ }),

/***/ "./src/mathematics/CholeskyDecomposition.ts":
/*!**************************************************!*\
  !*** ./src/mathematics/CholeskyDecomposition.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CholeskyDecomposition = void 0;
/**
 * A decomposition of a positive-definite matirx into a product of a lower triangular matrix and its conjugate transpose
 */
var CholeskyDecomposition = /** @class */ (function () {
    /**
     * The values of the decomposition are stored in the lower triangular portion of the matrix g
     * @param matrix Matrix
     */
    function CholeskyDecomposition(matrix) {
        this.success = false;
        this.CLOSE_TO_ZERO = 10e-8;
        this.firstNonPositiveDefiniteLeadingSubmatrixSize = -1;
        this.g = matrix.squareMatrix();
        var n = this.g.shape[0];
        if (this.g.get(0, 0) < this.CLOSE_TO_ZERO) {
            return;
        }
        var sqrtGjj = Math.sqrt(this.g.get(0, 0));
        for (var i = 0; i < n; i += 1) {
            this.g.divideAt(i, 0, sqrtGjj);
        }
        for (var j = 1; j < n; j += 1) {
            for (var i = j; i < n; i += 1) {
                var sum = 0;
                for (var k = 0; k < j; k += 1) {
                    sum += this.g.get(i, k) * this.g.get(j, k);
                }
                this.g.substractAt(i, j, sum);
            }
            if (this.g.get(j, j) < this.CLOSE_TO_ZERO) {
                this.firstNonPositiveDefiniteLeadingSubmatrixSize = j + 1;
                return;
            }
            sqrtGjj = Math.sqrt(this.g.get(j, j));
            for (var i = j; i < n; i += 1) {
                this.g.divideAt(i, j, sqrtGjj);
            }
        }
        for (var j = 0; j < n; j += 1) {
            for (var i = 0; i < j; i += 1) {
                this.g.set(i, j, 0);
            }
        }
        this.success = true;
    }
    /**
     * Solve the linear system
     * @param b Vector
     * @return The vector x
     * @throws If the Cholesky decomposition failed
     */
    CholeskyDecomposition.prototype.solve = function (b) {
        'use strict';
        // See Numerical Recipes Third Edition p. 101
        if (!this.success) {
            throw new Error("CholeskyDecomposistion.success === false");
        }
        if (b.length !== this.g.shape[0]) {
            throw new Error("The size of the cholesky decomposed matrix g and the vector b do not match");
        }
        var n = this.g.shape[0];
        var x = b.slice();
        // Ly = b
        for (var i = 0; i < n; i += 1) {
            var sum = b[i];
            for (var k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        // LT x = Y
        for (var i = n - 1; i >= 0; i -= 1) {
            var sum = x[i];
            for (var k = i + 1; k < n; k += 1) {
                sum -= this.g.get(k, i) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    };
    /**
     * Solve the linear equation Lower triangular matrix LT * x = b
     * @param b Vector
     */
    CholeskyDecomposition.prototype.solve_LT_result_equal_b = function (b) {
        var n = this.g.shape[0];
        var x = b.slice();
        for (var i = 0; i < n; i += 1) {
            var sum = b[i];
            for (var k = i - 1; k >= 0; k -= 1) {
                sum -= this.g.get(i, k) * x[k];
            }
            x[i] = sum / this.g.get(i, i);
        }
        return x;
    };
    return CholeskyDecomposition;
}());
exports.CholeskyDecomposition = CholeskyDecomposition;


/***/ }),

/***/ "./src/mathematics/DenseMatrix.ts":
/*!****************************************!*\
  !*** ./src/mathematics/DenseMatrix.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DenseMatrix = void 0;
/**
 * A dense matrix
 */
var DenseMatrix = /** @class */ (function () {
    /**
     * Create a square matrix
     * @param nrows Number of rows
     * @param ncols Number of columns
     * @param data A row after row flat array
     * @throws If data length is not equal to nrows*ncols
     */
    function DenseMatrix(nrows, ncols, data) {
        this._shape = [nrows, ncols];
        if (data) {
            if (data.length !== this.shape[0] * this.shape[1]) {
                throw new Error("Dense matrix constructor expect the data to have nrows*ncols length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (var i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(DenseMatrix.prototype, "shape", {
        /**
         * Returns the shape of the matrix : [number of rows, number of columns]
         */
        get: function () {
            return this._shape;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    DenseMatrix.prototype.dataIndex = function (row, column) {
        var n = row * this.shape[1] + column;
        return n;
    };
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    DenseMatrix.prototype.get = function (row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    };
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    DenseMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Check that the column index is inside appropriate range
     * @param index The column index
     * @throws If index is out of range
     */
    DenseMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("DenseMatrix column index out of range");
        }
    };
    /**
     * Check that the row index is inside appropriate range
     * @param index The row index
     * @throws If index is out of range
     */
    DenseMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("DenseMatrix row index out of range");
        }
    };
    return DenseMatrix;
}());
exports.DenseMatrix = DenseMatrix;


/***/ }),

/***/ "./src/mathematics/DiagonalMatrix.ts":
/*!*******************************************!*\
  !*** ./src/mathematics/DiagonalMatrix.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.identityMatrix = exports.DiagonalMatrix = void 0;
/**
 * An identity matrix
 */
var DiagonalMatrix = /** @class */ (function () {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    function DiagonalMatrix(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size) {
                throw new Error("Diagonal matrix constructor expect the data to have size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            var n = size;
            for (var i = 0; i < n; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(DiagonalMatrix.prototype, "shape", {
        /**
         * Returns the shape of the matrix : [number of rows, number of columns]
         */
        get: function () {
            return this._shape;
        },
        enumerable: false,
        configurable: true
    });
    /**
 * Returns the value at a given row and column position
 * @param row The row index
 * @param column The column index
 * @return Scalar
 * @throws If an index is out of range
 */
    DiagonalMatrix.prototype.get = function (row, column) {
        this.checkRange(row, column);
        return this.data[row];
    };
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    DiagonalMatrix.prototype.set = function (row, column, value) {
        this.checkRange(row, column);
        this.data[row] = value;
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    DiagonalMatrix.prototype.checkRange = function (row, column) {
        if (row < 0 || row >= this.shape[0] || row != column) {
            throw new Error("DiagonalMatrix index is out of range");
        }
    };
    return DiagonalMatrix;
}());
exports.DiagonalMatrix = DiagonalMatrix;
function identityMatrix(n) {
    var result = new DiagonalMatrix(n);
    for (var i = 0; i < n; i += 1) {
        result.set(i, i, 1);
    }
    return result;
}
exports.identityMatrix = identityMatrix;


/***/ }),

/***/ "./src/mathematics/MathVectorBasicOperations.ts":
/*!******************************************************!*\
  !*** ./src/mathematics/MathVectorBasicOperations.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.containsNaN = exports.randomVector = exports.isZeroVector = exports.product_v1_v2t = exports.product_v_vt = exports.zeroVector = exports.norm1 = exports.norm = exports.squaredNorm = exports.addSecondVectorToFirst = exports.addTwoVectors = exports.dotProduct = exports.saxpy2 = exports.saxpy = exports.divideVectorByScalar = exports.multiplyVectorByScalar = void 0;
var SquareMatrix_1 = __webpack_require__(/*! ./SquareMatrix */ "./src/mathematics/SquareMatrix.ts");
var DenseMatrix_1 = __webpack_require__(/*! ./DenseMatrix */ "./src/mathematics/DenseMatrix.ts");
/**
 * Multiply a vector by a scalar
 * @param vector vector
 * @param value scalar
 */
function multiplyVectorByScalar(vector, value) {
    var result = [];
    for (var i = 0; i < vector.length; i += 1) {
        result.push(vector[i] * value);
    }
    return result;
}
exports.multiplyVectorByScalar = multiplyVectorByScalar;
/**
 * Divide a vector by a scalar
 * @param vector Vector
 * @param value Scalar
 * @throws If the scalar value is zero
 */
function divideVectorByScalar(vector, value) {
    if (value === 0) {
        throw new Error("Division by zero");
    }
    var result = [];
    for (var i = 0; i < vector.length; i += 1) {
        result.push(vector[i] / value);
    }
    return result;
}
exports.divideVectorByScalar = divideVectorByScalar;
/**
 * A standard function in basic linear algebra : y = ax + y
 * @param a Scalar
 * @param x Vector
 * @param y Vector
 * @throws If x and y have different length
 */
function saxpy(a, x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    for (var i = 0; i < x.length; i += 1) {
        y[i] += a * x[i];
    }
}
exports.saxpy = saxpy;
/**
 * A standard function in basic linear algebra : z = ax + y
 * @param a Scalar
 * @param x Vector
 * @param y Vector
 * @returns ax + y
 * @throws If x and y have different length
 */
function saxpy2(a, x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    var result = [];
    for (var i = 0; i < x.length; i += 1) {
        result.push(a * x[i] + y[i]);
    }
    return result;
}
exports.saxpy2 = saxpy2;
/**
 * Compute the dot product of two vectors
 * @param x Vector
 * @param y Vector
 * @return The scalar result
 * @throws If x and y have different length
 */
function dotProduct(x, y) {
    if (x.length !== y.length) {
        throw new Error("Making the dot product of two vectors of different length");
    }
    var result = 0;
    for (var i = 0; i < x.length; i += 1) {
        result += x[i] * y[i];
    }
    return result;
}
exports.dotProduct = dotProduct;
/**
 * Add two vectors
 * @param x Vector
 * @param y Vector
 * @return Vector
 * @throws If x and y have different length
 */
function addTwoVectors(x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    var result = [];
    for (var i = 0; i < x.length; i += 1) {
        result.push(x[i] + y[i]);
    }
    return result;
}
exports.addTwoVectors = addTwoVectors;
/**
 * Add the second vector to the first vector
 * @param x Vector
 * @param y Vector
 * @throws If x and y have different length
 */
function addSecondVectorToFirst(x, y) {
    if (x.length !== y.length) {
        throw new Error("Adding two vectors of different length");
    }
    for (var i = 0; i < x.length; i += 1) {
        x[i] += y[i];
    }
}
exports.addSecondVectorToFirst = addSecondVectorToFirst;
/**
 * Compute the square of the norm
 * @param v Vector
 * @return Non negative scalar
 */
function squaredNorm(v) {
    var result = 0;
    for (var i = 0; i < v.length; i += 1) {
        result += v[i] * v[i];
    }
    return result;
}
exports.squaredNorm = squaredNorm;
/**
 * Compute the norm
 * @param v Vector
 * @return Non negative scalar
 */
function norm(v) {
    return Math.sqrt(squaredNorm(v));
}
exports.norm = norm;
/**
 * Compute the norm p = 1
 * @param v Vector
 * @return Non negative scalar
 */
function norm1(v) {
    var result = 0;
    for (var i = 0; i < v.length; i += 1) {
        result += Math.abs(v[i]);
    }
    return result;
}
exports.norm1 = norm1;
/**
 * Create a zero vector of size n
 * @param n Size
 */
function zeroVector(n) {
    var result = [];
    for (var i = 0; i < n; i += 1) {
        result.push(0);
    }
    return result;
}
exports.zeroVector = zeroVector;
;
/**
 * Compute the product of a vector and its transpose
 * @param v Vector
 */
function product_v_vt(v) {
    var n = v.length;
    var result = new SquareMatrix_1.SquareMatrix(n);
    for (var i = 0; i < n; i += 1) {
        for (var j = 0; j < n; j += 1) {
            result.set(i, j, v[i] * v[j]);
        }
    }
    return result;
}
exports.product_v_vt = product_v_vt;
/**
 * Compute the product of a first vector with the transpose of a second vector
 * @param v1 The first vector taken as a column vector
 * @param v2 The second vector taken after transposition as a row vector
 */
function product_v1_v2t(v1, v2) {
    var m = v1.length;
    var n = v2.length;
    var result = new DenseMatrix_1.DenseMatrix(m, n);
    for (var i = 0; i < m; i += 1) {
        for (var j = 0; j < n; j += 1) {
            result.set(i, j, v1[i] * v2[j]);
        }
    }
    return result;
}
exports.product_v1_v2t = product_v1_v2t;
function isZeroVector(v) {
    var n = v.length;
    for (var i = 0; i < v.length; i += 1) {
        if (v[i] !== 0) {
            return false;
        }
    }
    return true;
}
exports.isZeroVector = isZeroVector;
/**
 * Returns a vector filled with random values between 0 and 1
 * @param n The size of the random vector
 */
function randomVector(n) {
    var result = [];
    for (var i = 0; i < n; i += 1) {
        result.push((Math.random() - 0.5) * 10e8);
        //result.push((Math.random())*10e8)
    }
    return result;
}
exports.randomVector = randomVector;
function containsNaN(v) {
    var n = v.length;
    for (var i = 0; i < v.length; i += 1) {
        if (isNaN(v[i])) {
            return true;
        }
    }
    return false;
}
exports.containsNaN = containsNaN;
/**
 * Return the sign of a number.
 * It returns 1 if the number is positive, -1 if the number is negative and 0 if it is zero or minus zero
 * The standard Math.sign() function doesn't work with Windows Internet Explorer
 * @param x Number
 */
function sign(x) {
    return x ? x < 0 ? -1 : 1 : 0;
}
exports.sign = sign;


/***/ }),

/***/ "./src/mathematics/OptimizationProblem_BSpline_R1_to_R2.ts":
/*!*****************************************************************!*\
  !*** ./src/mathematics/OptimizationProblem_BSpline_R1_to_R2.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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
exports.OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints = exports.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints = exports.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors = exports.OptimizationProblem_BSpline_R1_to_R2 = exports.ActiveControl = void 0;
var MathVectorBasicOperations_1 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var BSpline_R1_to_R1_1 = __webpack_require__(/*! ./BSpline_R1_to_R1 */ "./src/mathematics/BSpline_R1_to_R1.ts");
var BernsteinDecomposition_R1_to_R1_1 = __webpack_require__(/*! ./BernsteinDecomposition_R1_to_R1 */ "./src/mathematics/BernsteinDecomposition_R1_to_R1.ts");
var DiagonalMatrix_1 = __webpack_require__(/*! ./DiagonalMatrix */ "./src/mathematics/DiagonalMatrix.ts");
var DenseMatrix_1 = __webpack_require__(/*! ./DenseMatrix */ "./src/mathematics/DenseMatrix.ts");
var SymmetricMatrix_1 = __webpack_require__(/*! ./SymmetricMatrix */ "./src/mathematics/SymmetricMatrix.ts");
var ExpensiveComputationResults = /** @class */ (function () {
    function ExpensiveComputationResults(bdsxu, bdsyu, bdsxuu, bdsyuu, bdsxuuu, bdsyuuu, h1, h2, h3, h4) {
        this.bdsxu = bdsxu;
        this.bdsyu = bdsyu;
        this.bdsxuu = bdsxuu;
        this.bdsyuu = bdsyuu;
        this.bdsxuuu = bdsxuuu;
        this.bdsyuuu = bdsyuuu;
        this.h1 = h1;
        this.h2 = h2;
        this.h3 = h3;
        this.h4 = h4;
    }
    return ExpensiveComputationResults;
}());
var ActiveControl;
(function (ActiveControl) {
    ActiveControl[ActiveControl["curvatureExtrema"] = 0] = "curvatureExtrema";
    ActiveControl[ActiveControl["inflections"] = 1] = "inflections";
    ActiveControl[ActiveControl["both"] = 2] = "both";
})(ActiveControl = exports.ActiveControl || (exports.ActiveControl = {}));
var OptimizationProblem_BSpline_R1_to_R2 = /** @class */ (function () {
    //public activeControl: ActiveControl = ActiveControl.both
    function OptimizationProblem_BSpline_R1_to_R2(target, initial, activeControl) {
        if (activeControl === void 0) { activeControl = ActiveControl.both; }
        this.activeControl = activeControl;
        this.curvatureExtremaConstraintsSign = [];
        this.curvatureExtremaInactiveConstraints = [];
        this.inflectionConstraintsSign = [];
        this.inflectionInactiveConstraints = [];
        //private _hessian_f: SymmetricMatrixInterface[] | undefined = undefined
        this._hessian_f = undefined;
        this.isComputingHessian = false;
        this.Dh5xx = [];
        this.Dh6_7xy = [];
        this.Dh8_9xx = [];
        this.Dh10_11xy = [];
        this.spline = initial.clone();
        this._target = target.clone();
        var n = this.spline.controlPoints.length;
        this._numberOfIndependentVariables = n * 2;
        var diracControlPoints = MathVectorBasicOperations_1.zeroVector(n);
        this.Dsu = [];
        this.Dsuu = [];
        this.Dsuuu = [];
        for (var i = 0; i < n; i += 1) {
            diracControlPoints[i] = 1;
            var s = new BSpline_R1_to_R1_1.BSpline_R1_to_R1(diracControlPoints.slice(), this.spline.knots.slice());
            var su = s.derivative();
            var suu = su.derivative();
            var suuu = suu.derivative();
            this.Dsu.push(new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(su.bernsteinDecomposition()));
            this.Dsuu.push(new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(suu.bernsteinDecomposition()));
            this.Dsuuu.push(new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(suuu.bernsteinDecomposition()));
            diracControlPoints[i] = 0;
        }
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        this._hessian_f0 = DiagonalMatrix_1.identityMatrix(this.numberOfIndependentVariables);
        var e = this.expensiveComputation(this.spline);
        var curvatureNumerator = this.curvatureNumerator(e.h4);
        this.inflectionTotalNumberOfConstraints = curvatureNumerator.length;
        var g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this.curvatureExtremaTotalNumberOfConstraints = g.length;
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g);
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length;
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator);
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        if (this.isComputingHessian) {
            this.prepareForHessianComputation(this.Dsu, this.Dsuu, this.Dsuuu);
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu, e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        }
    }
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "targetSpline", {
        set: function (spline) {
            this._target = spline;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "curvatureExtremaConstraintsFreeIndices", {
        get: function () {
            return this.curvatureExtremaInactiveConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "inflectionConstraintsFreeIndices", {
        get: function () {
            return this.inflectionInactiveConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "numberOfIndependentVariables", {
        get: function () {
            return this._numberOfIndependentVariables;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "numberOfConstraints", {
        get: function () {
            return this._curvatureExtremaNumberOfActiveConstraints + this._inflectionNumberOfActiveConstraints;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "f0", {
        get: function () {
            return this._f0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "gradient_f0", {
        get: function () {
            return this._gradient_f0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "hessian_f0", {
        get: function () {
            return this._hessian_f0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "f", {
        get: function () {
            if (MathVectorBasicOperations_1.containsNaN(this._f)) {
                throw new Error("OptimizationProblem_BSpline_R1_to_R2 contains Nan in its f vector");
            }
            return this._f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "gradient_f", {
        get: function () {
            return this._gradient_f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2.prototype, "hessian_f", {
        get: function () {
            return this._hessian_f;
        },
        enumerable: false,
        configurable: true
    });
    OptimizationProblem_BSpline_R1_to_R2.prototype.step = function (deltaX) {
        this.spline.optimizerStep(deltaX);
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this._gradient_f0);
        var e = this.expensiveComputation(this.spline);
        var g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        this.curvatureExtremaConstraintsSign = this.computeConstraintsSign(g);
        this.curvatureExtremaInactiveConstraints = this.computeInactiveConstraints(this.curvatureExtremaConstraintsSign, g);
        this._curvatureExtremaNumberOfActiveConstraints = g.length - this.curvatureExtremaInactiveConstraints.length;
        var curvatureNumerator = this.curvatureNumerator(e.h4);
        this.inflectionConstraintsSign = this.computeConstraintsSign(curvatureNumerator);
        this.inflectionInactiveConstraints = this.computeInactiveConstraints(this.inflectionConstraintsSign, curvatureNumerator);
        this._inflectionNumberOfActiveConstraints = curvatureNumerator.length - this.inflectionInactiveConstraints.length;
        this._f = this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        this._gradient_f = this.compute_gradient_f(e, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        if (this.isComputingHessian) {
            this._hessian_f = this.compute_hessian_f(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu, e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
        }
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.computeConstraintsSign = function (controlPoints) {
        var result = [];
        for (var i = 0, n = controlPoints.length; i < n; i += 1) {
            if (controlPoints[i] > 0) {
                result.push(-1);
            }
            else {
                result.push(1);
            }
        }
        //console.log(result.length)
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.computeSignChangeIntervals = function (constraintsSign) {
        var signChangesIntervals = [];
        var previousSign = constraintsSign[0];
        for (var i = 1, n = constraintsSign.length; i < n; i += 1) {
            if (previousSign !== constraintsSign[i]) {
                signChangesIntervals.push(i - 1);
            }
            previousSign = constraintsSign[i];
        }
        return signChangesIntervals;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.computeControlPointsClosestToZero = function (signChangesIntervals, controlPoints) {
        var result = [];
        for (var i = 0, n = signChangesIntervals.length; i < n; i += 1) {
            if (i < n - 1 && signChangesIntervals[i] + 1 === signChangesIntervals[i + 1]) {
                result.push(signChangesIntervals[i] + 1);
                i += 1;
            }
            else {
                if (Math.pow(controlPoints[signChangesIntervals[i]], 2) < Math.pow(controlPoints[signChangesIntervals[i] + 1], 2)) {
                    result.push(signChangesIntervals[i]);
                }
                else {
                    result.push(signChangesIntervals[i] + 1);
                }
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.addInactiveConstraintsForInflections = function (list, controlPoints) {
        var result = [];
        for (var i = 0, n = list.length; i < n; i += 1) {
            if (list[i] !== 0 && controlPoints[list[i] - 1] === controlPoints[list[i]]) {
                if (i == 0) {
                    result.push(list[i] - 1);
                }
                if (i !== 0 && list[i - 1] !== list[i] - 1) {
                    result.push(list[i] - 1);
                }
            }
            result.push(list[i]);
            if (list[i] !== controlPoints.length - 2 && controlPoints[list[i]] === controlPoints[list[i] + 1]) {
                if (i == list.length - 1) {
                    result.push(list[i] + 1);
                }
                if (i !== list.length - 1 && list[i + 1] !== list[i] + 1) {
                    result.push(list[i] + 1);
                }
            }
        }
        return result;
    };
    /**
     * Some contraints are set inactive to allowed the point of curvature extrema to slide along the curve.
     * A curvature extremum or an inflection is located between two coefficient of different signs.
     * For the general case, the smallest coefficient in absolute value is chosen to be free.
     * For the specific case of two successive sign changes, the coefficient in the middle is chosen.
     *
     * @param constraintsSign The vector of sign for the constraints: sign f_i <= 0
     * @param controlPoints The vector of value of the function: f_i
     */
    OptimizationProblem_BSpline_R1_to_R2.prototype.computeInactiveConstraints = function (constraintsSign, controlPoints) {
        var signChangesIntervals = this.computeSignChangeIntervals(constraintsSign);
        var controlPointsClosestToZero = this.computeControlPointsClosestToZero(signChangesIntervals, controlPoints);
        var result = this.addInactiveConstraintsForInflections(controlPointsClosestToZero, controlPoints);
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_gradient_f0 = function (spline) {
        var result = [];
        var n = spline.controlPoints.length;
        for (var i = 0; i < n; i += 1) {
            result.push(spline.controlPoints[i].x - this._target.controlPoints[i].x);
        }
        for (var i = 0; i < n; i += 1) {
            result.push(spline.controlPoints[i].y - this._target.controlPoints[i].y);
        }
        return result;
    };
    //f0: function to minimize
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_f0 = function (gradient_f0) {
        var result = 0;
        var n = gradient_f0.length;
        for (var i = 0; i < n; i += 1) {
            result += Math.pow(gradient_f0[i], 2);
        }
        return 0.5 * result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.curvatureNumerator = function (h4) {
        return h4.flattenControlPointsArray();
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.curvatureDerivativeNumerator = function (h1, h2, h3, h4) {
        var g = (h1.multiply(h2)).subtract(h3.multiply(h4).multiplyByScalar(3));
        var result = g.flattenControlPointsArray();
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.g = function () {
        var e = this.expensiveComputation(this.spline);
        return this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.gradient_g = function () {
        var e = this.expensiveComputation(this.spline);
        return this.gradient_curvatureDerivativeNumerator(e.bdsxu, e.bdsyu, e.bdsxuu, e.bdsyuu, e.bdsxuuu, e.bdsyuuu, e.h1, e.h2, e.h3, e.h4);
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_curvatureExtremaConstraints = function (curvatureDerivativeNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureDerivativeNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_inflectionConstraints = function (curvatureNumerator, constraintsSign, inactiveConstraints) {
        var result = [];
        for (var i = 0, j = 0, n = constraintsSign.length; i < n; i += 1) {
            if (i === inactiveConstraints[j]) {
                j += 1;
            }
            else {
                result.push(curvatureNumerator[i] * constraintsSign[i]);
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_f = function (curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        //let result: number[] = []
        if (this.activeControl === ActiveControl.both) {
            var r1 = this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            var r2 = this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
            return r1.concat(r2);
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints(curvatureDerivativeNumerator, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints(curvatureNumerator, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.expensiveComputation = function (spline) {
        var sx = new BSpline_R1_to_R1_1.BSpline_R1_to_R1(spline.getControlPointsX(), spline.knots), sy = new BSpline_R1_to_R1_1.BSpline_R1_to_R1(spline.getControlPointsY(), spline.knots), sxu = sx.derivative(), syu = sy.derivative(), sxuu = sxu.derivative(), syuu = syu.derivative(), sxuuu = sxuu.derivative(), syuuu = syuu.derivative(), bdsxu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxu.bernsteinDecomposition()), bdsyu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syu.bernsteinDecomposition()), bdsxuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxuu.bernsteinDecomposition()), bdsyuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syuu.bernsteinDecomposition()), bdsxuuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(sxuuu.bernsteinDecomposition()), bdsyuuu = new BernsteinDecomposition_R1_to_R1_1.BernsteinDecomposition_R1_to_R1(syuuu.bernsteinDecomposition()), h1 = (bdsxu.multiply(bdsxu)).add(bdsyu.multiply(bdsyu)), h2 = (bdsxu.multiply(bdsyuuu)).subtract(bdsyu.multiply(bdsxuuu)), h3 = (bdsxu.multiply(bdsxuu)).add(bdsyu.multiply(bdsyuu)), h4 = (bdsxu.multiply(bdsyuu)).subtract(bdsyu.multiply(bdsxuu));
        return new ExpensiveComputationResults(bdsxu, bdsyu, bdsxuu, bdsyuu, bdsxuuu, bdsyuuu, h1, h2, h3, h4);
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.gradient_curvatureDerivativeNumerator = function (sxu, syu, sxuu, syuu, sxuuu, syuuu, h1, h2, h3, h4) {
        var dgx = [];
        var dgy = [];
        var m = this.spline.controlPoints.length;
        var n = this.curvatureExtremaTotalNumberOfConstraints;
        var result = new DenseMatrix_1.DenseMatrix(n, 2 * m);
        for (var i = 0; i < m; i += 1) {
            var h5 = this.Dsu[i].multiply(sxu);
            var h6 = this.Dsu[i].multiply(syuuu);
            var h7 = syu.multiply(this.Dsuuu[i]).multiplyByScalar(-1);
            var h8 = this.Dsu[i].multiply(sxuu);
            var h9 = sxu.multiply(this.Dsuu[i]);
            var h10 = this.Dsu[i].multiply(syuu);
            var h11 = syu.multiply(this.Dsuu[i]).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < m; i += 1) {
            var h5 = this.Dsu[i].multiply(syu);
            var h6 = this.Dsu[i].multiply(sxuuu).multiplyByScalar(-1);
            var h7 = sxu.multiply(this.Dsuuu[i]);
            var h8 = this.Dsu[i].multiply(syuu);
            var h9 = syu.multiply(this.Dsuu[i]);
            var h10 = this.Dsu[i].multiply(sxuu).multiplyByScalar(-1);
            var h11 = sxu.multiply(this.Dsuu[i]);
            dgy.push((h5.multiply(h2).multiplyByScalar(2)).add(h1.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4))).add((h10.add(h11)).multiply(h3))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < m; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            for (var j = 0; j < n; j += 1) {
                result.set(j, i, cpx[j]);
                result.set(j, m + i, cpy[j]);
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_gradient_f = function (e, inflectionConstraintsSign, inflectionInactiveConstraints, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints) {
        if (this.activeControl === ActiveControl.both) {
            var m1 = this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
            var m2 = this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints);
            var _a = m1.shape, row_m1 = _a[0], n = _a[1];
            var row_m2 = m2.shape[0];
            var m = row_m1 + row_m2;
            var result = new DenseMatrix_1.DenseMatrix(m, n);
            for (var i = 0; i < row_m1; i += 1) {
                for (var j = 0; j < n; j += 1) {
                    result.set(i, j, m1.get(i, j));
                }
            }
            for (var i = 0; i < row_m2; i += 1) {
                for (var j = 0; j < n; j += 1) {
                    result.set(row_m1 + i, j, m2.get(i, j));
                }
            }
            return result;
        }
        else if (this.activeControl === ActiveControl.curvatureExtrema) {
            return this.compute_curvatureExtremaConstraints_gradient(e, curvatureExtremaConstraintsSign, curvatureExtremaInactiveConstraints);
        }
        else {
            return this.compute_inflectionConstraints_gradient(e, inflectionConstraintsSign, inflectionInactiveConstraints);
        }
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_curvatureExtremaConstraints_gradient = function (e, constraintsSign, inactiveConstraints) {
        var sxu = e.bdsxu;
        var sxuu = e.bdsxuu;
        var sxuuu = e.bdsxuuu;
        var syu = e.bdsyu;
        var syuu = e.bdsyuu;
        var syuuu = e.bdsyuuu;
        var h1 = e.h1;
        var h2 = e.h2;
        var h3 = e.h3;
        var h4 = e.h4;
        var dgx = [];
        var dgy = [];
        var controlPointsLength = this.spline.controlPoints.length;
        var totalNumberOfConstraints = this.curvatureExtremaTotalNumberOfConstraints;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.Dsu[i].multiplyRange(sxu, start, lessThan);
            var h6 = this.Dsu[i].multiplyRange(syuuu, start, lessThan);
            var h7 = syu.multiplyRange(this.Dsuuu[i], start, lessThan).multiplyByScalar(-1);
            var h8 = this.Dsu[i].multiplyRange(sxuu, start, lessThan);
            var h9 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
            var h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h1_subset = h1.subset(start, lessThan);
            var h2_subset = h2.subset(start, lessThan);
            var h3_subset = h3.subset(start, lessThan);
            var h4_subset = h4.subset(start, lessThan);
            var h5 = this.Dsu[i].multiplyRange(syu, start, lessThan);
            var h6 = this.Dsu[i].multiplyRange(sxuuu, start, lessThan).multiplyByScalar(-1);
            var h7 = sxu.multiplyRange(this.Dsuuu[i], start, lessThan);
            var h8 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
            var h9 = syu.multiplyRange(this.Dsuu[i], start, lessThan);
            var h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
            dgy.push((h5.multiply(h2_subset).multiplyByScalar(2)).add(h1_subset.multiply(h6.add(h7))).add(((((h8.add(h9)).multiply(h4_subset))).add((h10.add(h11)).multiply(h3_subset))).multiplyByScalar(-3)));
        }
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (4 * degree - 5);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (4 * degree - 5);
            var deltaj = 0;
            for (var i_1 = 0; i_1 < inactiveConstraints.length; i_1 += 1) {
                if (inactiveConstraints[i_1] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_inflectionConstraints_gradient = function (e, constraintsSign, inactiveConstraints) {
        var sxu = e.bdsxu;
        var sxuu = e.bdsxuu;
        var syu = e.bdsyu;
        var syuu = e.bdsyuu;
        var dgx = [];
        var dgy = [];
        var controlPointsLength = this.spline.controlPoints.length;
        var degree = this.spline.degree;
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.Dsu[i].multiplyRange(syuu, start, lessThan);
            var h11 = syu.multiplyRange(this.Dsuu[i], start, lessThan).multiplyByScalar(-1);
            dgx.push((h10.add(h11)));
        }
        for (var i = 0; i < controlPointsLength; i += 1) {
            var start = Math.max(0, i - degree);
            var lessThan = Math.min(controlPointsLength - degree, i + 1);
            var h10 = this.Dsu[i].multiplyRange(sxuu, start, lessThan).multiplyByScalar(-1);
            var h11 = sxu.multiplyRange(this.Dsuu[i], start, lessThan);
            dgy.push(h10.add(h11));
        }
        var totalNumberOfConstraints = this.inflectionConstraintsSign.length;
        var result = new DenseMatrix_1.DenseMatrix(totalNumberOfConstraints - inactiveConstraints.length, 2 * controlPointsLength);
        for (var i = 0; i < controlPointsLength; i += 1) {
            var cpx = dgx[i].flattenControlPointsArray();
            var cpy = dgy[i].flattenControlPointsArray();
            var start = Math.max(0, i - degree) * (2 * degree - 2);
            var lessThan = Math.min(controlPointsLength - degree, i + 1) * (2 * degree - 2);
            var deltaj = 0;
            for (var i_2 = 0; i_2 < inactiveConstraints.length; i_2 += 1) {
                if (inactiveConstraints[i_2] >= start) {
                    break;
                }
                deltaj += 1;
            }
            for (var j = start; j < lessThan; j += 1) {
                if (j === inactiveConstraints[deltaj]) {
                    deltaj += 1;
                }
                else {
                    result.set(j - deltaj, i, cpx[j - start] * constraintsSign[j]);
                    result.set(j - deltaj, controlPointsLength + i, cpy[j - start] * constraintsSign[j]);
                }
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.compute_hessian_f = function (sxu, syu, sxuu, syuu, sxuuu, syuuu, h1, h2, h3, h4, constraintsSign, inactiveConstraints) {
        var n = this.spline.controlPoints.length;
        var result = [];
        var h5x = [];
        var h5y = [];
        var h6x = [];
        var h6y = [];
        var h7x = [];
        var h7y = [];
        var h8x = [];
        var h8y = [];
        var h9x = [];
        var h9y = [];
        var h10x = [];
        var h10y = [];
        var h11x = [];
        var h11y = [];
        var hessian_gxx = [];
        var hessian_gyy = [];
        var hessian_gxy = [];
        for (var i = 0; i < n; i += 1) {
            hessian_gxx.push([]);
            hessian_gyy.push([]);
            hessian_gxy.push([]);
        }
        for (var i = 0; i < n; i += 1) {
            h5x.push(this.Dsu[i].multiply(sxu));
            h6x.push(this.Dsu[i].multiply(syuuu));
            h7x.push(syu.multiply(this.Dsuuu[i]).multiplyByScalar(-1));
            h8x.push(this.Dsu[i].multiply(sxuu));
            h9x.push(sxu.multiply(this.Dsuu[i]));
            h10x.push(this.Dsu[i].multiply(syuu));
            h11x.push(syu.multiply(this.Dsuu[i]).multiplyByScalar(-1));
        }
        for (var i = 0; i < n; i += 1) {
            h5y.push(this.Dsu[i].multiply(syu));
            h6y.push(this.Dsu[i].multiply(sxuuu).multiplyByScalar(-1));
            h7y.push(sxu.multiply(this.Dsuuu[i]));
            h8y.push(this.Dsu[i].multiply(syuu));
            h9y.push(syu.multiply(this.Dsuu[i]));
            h10y.push(this.Dsu[i].multiply(sxuu).multiplyByScalar(-1));
            h11y.push(sxu.multiply(this.Dsuu[i]));
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                var term1 = this.Dh5xx[i][j].multiply(h2).multiplyByScalar(2);
                var term2xx = ((h5x[j].multiply(h6x[i].add(h7x[i]))).add(h5x[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term2yy = ((h5y[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6y[j].add(h7y[j]))))).multiplyByScalar(2);
                // term3 = 0
                var term4 = this.Dh8_9xx[i][j].multiply(h4).multiplyByScalar(-3);
                var term5xx = (((h8x[j].add(h9x[j])).multiply(h10x[i].add(h11x[i]))).add((h8x[i].add(h9x[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term5yy = (((h8y[j].add(h9y[j])).multiply(h10y[i].add(h11y[i]))).add((h8y[i].add(h9y[i])).multiply((h10y[j].add(h11y[j]))))).multiplyByScalar(-3);
                // term 6 = 0
                hessian_gxx[i][j] = (term1.add(term2xx).add(term4).add(term5xx)).flattenControlPointsArray();
                hessian_gyy[i][j] = (term1.add(term2yy).add(term4).add(term5yy)).flattenControlPointsArray();
            }
        }
        for (var i = 1; i < n; i += 1) {
            for (var j = 0; j < i; j += 1) {
                // term1 = 0
                var term2xy = ((h5x[j].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term3 = this.Dh6_7xy[j][i].multiply(h1).multiplyByScalar(-1); //Dh_6_7xy is antisymmetric
                // term4 = 0
                var term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term6 = this.Dh10_11xy[j][i].multiply(h3).multiplyByScalar(3); //Dh_10_11xy is antisymmetric
                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = i + 1; j < n; j += 1) {
                // term1 = 0
                var term2xy = ((h5x[j].multiply((h6y[i].add(h7y[i])))).add(h5y[i].multiply((h6x[j].add(h7x[j]))))).multiplyByScalar(2);
                var term3 = this.Dh6_7xy[i][j].multiply(h1); //Dh_6_7xy is antisymmetric
                // term4 = 0
                var term5xy = (((h8x[j].add(h9x[j])).multiply((h10y[i].add(h11y[i])))).add((h8y[i].add(h9y[i])).multiply((h10x[j].add(h11x[j]))))).multiplyByScalar(-3);
                var term6 = this.Dh10_11xy[i][j].multiply(h3).multiplyByScalar(-3); //Dh_10_11xy is antisymmetric
                hessian_gxy[i][j] = (term2xy.add(term3).add(term5xy).add(term6)).flattenControlPointsArray();
            }
        }
        for (var i = 0; i < n; i += 1) {
            // term1 = 0
            var term2xy = ((h5x[i].multiply(h6y[i].add(h7y[i]))).add(h5y[i].multiply((h6x[i].add(h7x[i]))))).multiplyByScalar(2);
            //const term3 = this.Dh6_7xy[i][i].multiply(h1)
            // term3 = 0
            // term4 = 0
            var term5xy = (((h8y[i].add(h9y[i])).multiply((h10x[i].add(h11x[i])))).add((h8x[i].add(h9x[i])).multiply(h10y[i].add(h11y[i])))).multiplyByScalar(-3);
            // term6 = 0
            hessian_gxy[i][i] = (term2xy.add(term5xy)).flattenControlPointsArray();
        }
        var deltak = 0;
        for (var k = 0; k < constraintsSign.length; k += 1) {
            if (k === inactiveConstraints[deltak]) {
                deltak += 1;
            }
            else {
                var m = new SymmetricMatrix_1.SymmetricMatrix(2 * n);
                for (var i = 0; i < n; i += 1) {
                    for (var j = 0; j <= i; j += 1) {
                        m.set(i, j, hessian_gxx[i][j][k] * constraintsSign[k]);
                        m.set(n + i, n + j, hessian_gyy[i][j][k] * constraintsSign[k]);
                    }
                }
                for (var i = 0; i < n; i += 1) {
                    for (var j = 0; j < n; j += 1) {
                        m.set(n + i, j, hessian_gxy[i][j][k] * constraintsSign[k]);
                    }
                }
                result.push(m);
            }
        }
        return result;
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.prepareForHessianComputation = function (Dsu, Dsuu, Dsuuu) {
        var n = this.spline.controlPoints.length;
        for (var i = 0; i < n; i += 1) {
            this.Dh5xx.push([]);
            this.Dh6_7xy.push([]);
            this.Dh8_9xx.push([]);
            this.Dh10_11xy.push([]);
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                this.Dh5xx[i][j] = Dsu[i].multiply(Dsu[j]);
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                this.Dh6_7xy[i][j] = (Dsu[i].multiply(Dsuuu[j])).subtract(Dsu[j].multiply(Dsuuu[i]));
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j <= i; j += 1) {
                this.Dh8_9xx[i][j] = (Dsu[i].multiply(Dsuu[j])).add(Dsu[j].multiply(Dsuu[i]));
            }
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                this.Dh10_11xy[i][j] = (Dsu[i].multiply(Dsuu[j])).subtract(Dsu[j].multiply(Dsuu[i]));
            }
        }
    };
    /**
     * The vector of constraint functions values: f(x + step)
     */
    OptimizationProblem_BSpline_R1_to_R2.prototype.fStep = function (step) {
        var splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        var e = this.expensiveComputation(splineTemp);
        var g = this.curvatureDerivativeNumerator(e.h1, e.h2, e.h3, e.h4);
        var curvatureNumerator = this.curvatureNumerator(e.h4);
        return this.compute_f(curvatureNumerator, this.inflectionConstraintsSign, this.inflectionInactiveConstraints, g, this.curvatureExtremaConstraintsSign, this.curvatureExtremaInactiveConstraints);
    };
    /**
     * The objective function value: f0(x + step)
     */
    OptimizationProblem_BSpline_R1_to_R2.prototype.f0Step = function (step) {
        var splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        return this.compute_f0(this.compute_gradient_f0(splineTemp));
    };
    OptimizationProblem_BSpline_R1_to_R2.prototype.setTargetSpline = function (spline) {
        this._target = spline.clone();
        this._gradient_f0 = this.compute_gradient_f0(this.spline);
        this._f0 = this.compute_f0(this.gradient_f0);
    };
    return OptimizationProblem_BSpline_R1_to_R2;
}());
exports.OptimizationProblem_BSpline_R1_to_R2 = OptimizationProblem_BSpline_R1_to_R2;
var OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors = /** @class */ (function (_super) {
    __extends(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors, _super);
    function OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors(target, initial, activeControl) {
        if (activeControl === void 0) { activeControl = ActiveControl.both; }
        var _this = _super.call(this, target, initial, activeControl) || this;
        _this.activeControl = activeControl;
        _this.weigthingFactors = [];
        for (var i = 0; i < _this.spline.controlPoints.length * 2; i += 1) {
            _this.weigthingFactors.push(1);
        }
        return _this;
    }
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors.prototype, "f0", {
        get: function () {
            var result = 0;
            var n = this._gradient_f0.length;
            for (var i = 0; i < n; i += 1) {
                result += Math.pow(this._gradient_f0[i], 2) * this.weigthingFactors[i];
            }
            return 0.5 * result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors.prototype, "gradient_f0", {
        get: function () {
            var result = [];
            var n = this._gradient_f0.length;
            for (var i = 0; i < n; i += 1) {
                result.push(this._gradient_f0[i] * this.weigthingFactors[i]);
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors.prototype, "hessian_f0", {
        get: function () {
            var n = this._gradient_f0.length;
            var result = new DiagonalMatrix_1.DiagonalMatrix(n);
            for (var i = 0; i < n; i += 1) {
                result.set(i, i, this.weigthingFactors[i]);
            }
            return result;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * The objective function value: f0(x + step)
     */
    OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors.prototype.f0Step = function (step) {
        var splineTemp = this.spline.clone();
        splineTemp.optimizerStep(step);
        var gradient = this.compute_gradient_f0(splineTemp);
        var n = gradient.length;
        var result = 0;
        for (var i = 0; i < n; i += 1) {
            result += Math.pow(gradient[i], 2) * this.weigthingFactors[i];
        }
        return 0.5 * result;
    };
    return OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
}(OptimizationProblem_BSpline_R1_to_R2));
exports.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors = OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors;
var OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints = /** @class */ (function (_super) {
    __extends(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints, _super);
    function OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints(target, initial, activeControl) {
        if (activeControl === void 0) { activeControl = ActiveControl.both; }
        var _this = _super.call(this, target, initial, activeControl) || this;
        _this.activeControl = activeControl;
        return _this;
    }
    OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints.prototype.computeInactiveConstraints = function (constraintsSign, curvatureDerivativeNumerator) {
        return [];
    };
    return OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints;
}(OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors));
exports.OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints = OptimizationProblem_BSpline_R1_to_R2_with_weigthingFactors_no_inactive_constraints;
var OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints = /** @class */ (function (_super) {
    __extends(OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints, _super);
    function OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints(target, initial) {
        return _super.call(this, target, initial) || this;
    }
    OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints.prototype.computeInactiveConstraints = function (constraintsSign, curvatureDerivativeNumerator) {
        return [];
    };
    return OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints;
}(OptimizationProblem_BSpline_R1_to_R2));
exports.OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints = OptimizationProblem_BSpline_R1_to_R2_no_inactive_constraints;


/***/ }),

/***/ "./src/mathematics/Optimizer.ts":
/*!**************************************!*\
  !*** ./src/mathematics/Optimizer.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimizer = void 0;
var TrustRegionSubproblem_1 = __webpack_require__(/*! ./TrustRegionSubproblem */ "./src/mathematics/TrustRegionSubproblem.ts");
var MathVectorBasicOperations_1 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_2 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_3 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var SymmetricMatrix_1 = __webpack_require__(/*! ./SymmetricMatrix */ "./src/mathematics/SymmetricMatrix.ts");
var CholeskyDecomposition_1 = __webpack_require__(/*! ./CholeskyDecomposition */ "./src/mathematics/CholeskyDecomposition.ts");
var Optimizer = /** @class */ (function () {
    function Optimizer(o) {
        this.o = o;
        this.success = false;
        if (this.o.f.length !== this.o.gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in the Optimizer Constructor");
        }
    }
    Optimizer.prototype.optimize_using_trust_region = function (epsilon, maxTrustRadius, maxNumSteps) {
        if (epsilon === void 0) { epsilon = 10e-8; }
        if (maxTrustRadius === void 0) { maxTrustRadius = 10; }
        if (maxNumSteps === void 0) { maxNumSteps = 800; }
        this.success = false;
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        var numSteps = 0;
        //let numGradientComputation = 0
        var t = this.o.numberOfConstraints / this.o.f0;
        var trustRadius = 9;
        var rho;
        var eta = 0.1; // [0, 1/4)
        var mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.o.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log("number of steps")
                //console.log(numSteps) 
                if (this.o.f.length !== this.o.gradient_f.shape[0]) {
                    console.log("Problem about f length and gradient_f shape 0 is in the function optimize_using_trust_region");
                }
                var b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f);
                var gradient = MathVectorBasicOperations_2.saxpy2(t, this.o.gradient_f0, b.gradient);
                var hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t);
                var trustRegionSubproblem = new TrustRegionSubproblem_1.TrustRegionSubproblem(gradient, hessian);
                var tr = trustRegionSubproblem.solve(trustRadius);
                var fStep = this.o.fStep(tr.step);
                var numSteps2 = 0;
                while (Math.max.apply(null, fStep) >= 0) {
                    numSteps2 += 1;
                    trustRadius *= 0.25;
                    tr = trustRegionSubproblem.solve(trustRadius);
                    //numGradientComputation += 1;
                    fStep = this.o.fStep(tr.step);
                    if (numSteps2 > 100) {
                        throw new Error("maxSteps2 > 100");
                    }
                }
                var barrierValueStep = this.barrierValue(fStep);
                var actualReduction = t * (this.o.f0 - this.o.f0Step(tr.step)) + (b.value - barrierValueStep);
                var predictedReduction = -MathVectorBasicOperations_1.dotProduct(gradient, tr.step) - 0.5 * hessian.quadraticForm(tr.step);
                rho = actualReduction / predictedReduction;
                if (rho < 0.25) {
                    trustRadius *= 0.25;
                }
                else if (rho > 0.75 && tr.hitsBoundary) {
                    trustRadius = Math.min(2 * trustRadius, maxTrustRadius);
                }
                if (rho > eta) {
                    //numGradientComputation += 1;
                    //console.log("number of gradient computation")
                    //console.log(numGradientComputation) 
                    //numGradientComputation = 0
                    this.o.step(tr.step);
                }
                if (numSteps > maxNumSteps) {
                    //throw new Error("numSteps > maxNumSteps")
                    //break;
                    return;
                }
                var newtonDecrementSquared = this.newtonDecrementSquared(tr.step, t, this.o.gradient_f0, b.gradient);
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero");
                }
                //if (newtonDecrementSquared < epsilon && !tr.hitsBoundary) {
                if (newtonDecrementSquared < epsilon) {
                    //console.log('break newtonDecrementSquared < epsilon && !hitsBoundary');
                    break;
                }
                if (trustRadius < 10e-18) {
                    //console.log('trustRadius < 10e-10');
                    console.log(b);
                    throw new Error("trust Radius < 10e-18");
                    //break;
                }
            }
            t *= mu;
        }
        //if (numSteps === maxNumSteps) {
        //    return -1;
        //}
        //console.log(numSteps)
        this.success = true;
    };
    Optimizer.prototype.optimize_using_line_search = function (epsilon, maxNumSteps) {
        if (epsilon === void 0) { epsilon = 10e-6; }
        if (maxNumSteps === void 0) { maxNumSteps = 300; }
        // Bibliographic reference: Numerical Optimization, second edition, Jorge Nocedal and Stephen J. Wright, p. 69
        var numSteps = 0;
        var t = this.o.numberOfConstraints / this.o.f0;
        var rho;
        var eta = 0.1; // [0, 1/4)
        var mu = 10; // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 569
        while (this.o.numberOfConstraints / t > epsilon) {
            while (true) {
                numSteps += 1;
                //console.log(numSteps) 
                var b = this.barrier(this.o.f, this.o.gradient_f, this.o.hessian_f);
                var gradient = MathVectorBasicOperations_2.saxpy2(t, this.o.gradient_f0, b.gradient);
                var hessian = b.hessian.plusSymmetricMatrixMultipliedByValue(this.o.hessian_f0, t);
                var newtonStep = this.computeNewtonStep(gradient, hessian);
                var stepRatio = this.backtrackingLineSearch(t, newtonStep, this.o.f0, b.value, this.o.gradient_f0, b.gradient);
                if (stepRatio < 1) {
                    //console.log(stepRatio)
                }
                var step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, stepRatio);
                /*
                if (Math.max(...this.o.fStep(step)) > 0) {
                    console.log(Math.max(...this.o.fStep(step)))
                }
                */
                //console.log(Math.max(...this.o.fStep(step)))
                /*
                if (Math.max(...this.o.fStep(step)) < 0) {
                    this.o.step(step)
                }
                */
                this.o.step(step);
                if (numSteps > maxNumSteps) {
                    //throw new Error("numSteps > maxNumSteps")
                    //break;
                    console.log("numSteps > maxNumSteps");
                    return;
                }
                var newtonDecrementSquared = this.newtonDecrementSquared(step, t, this.o.gradient_f0, b.gradient);
                if (newtonDecrementSquared < 0) {
                    throw new Error("newtonDecrementSquared is smaller than zero");
                }
                //if (newtonDecrementSquared < epsilon && !tr.hitsBoundary) {
                if (newtonDecrementSquared < epsilon) {
                    //console.log('break newtonDecrementSquared < epsilon && !hitsBoundary');
                    //console.log(numSteps)
                    break;
                }
            }
            t *= mu;
            //console.log(t)
        }
        //if (numSteps === maxNumSteps) {
        //    return -1;
        //}
        //console.log(numSteps)
    };
    Optimizer.prototype.newtonDecrementSquared = function (newtonStep, t, gradient_f0, barrierGradient) {
        return -MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_2.saxpy2(t, gradient_f0, barrierGradient), newtonStep);
    };
    Optimizer.prototype.barrierValue = function (f) {
        //console.log(f)
        var result = 0;
        var n = f.length;
        for (var i = 0; i < n; i += 1) {
            result -= Math.log(-f[i]);
        }
        return result;
    };
    Optimizer.prototype.barrierGradient = function (f, gradient_f) {
        var result = MathVectorBasicOperations_3.zeroVector(gradient_f.shape[1]);
        var n = f.length;
        var m = gradient_f.shape[1];
        if (n !== gradient_f.shape[0]) {
            throw new Error("barrierGradient f and gradient_f dimensions do not match");
        }
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < m; j += 1) {
                if (f[i] === 0) {
                    throw new Error("barrierGradient makes a division by zero");
                }
                result[j] += -gradient_f.get(i, j) / f[i];
                //console.log(result[j])
            }
        }
        //console.log(gradient_f)
        //console.log(result)
        return result;
    };
    Optimizer.prototype.barrierHessian = function (f, gradient_f, hessian_f) {
        // Bibliographic reference: Convex Optimization, Stephen Boyd and Lieven Vandenberghe, p. 564
        var m = gradient_f.shape[0];
        var n = gradient_f.shape[1];
        var result = new SymmetricMatrix_1.SymmetricMatrix(n);
        // barrier hessian first term
        for (var i = 0; i < m; i += 1) {
            for (var k = 0; k < n; k += 1) {
                for (var l = 0; l <= k; l += 1) {
                    result.addAt(k, l, gradient_f.get(i, k) * gradient_f.get(i, l) / (f[i] * f[i]));
                }
            }
        }
        // barrier hessian second term
        if (hessian_f) {
            for (var i = 0; i < n; i += 1) {
                for (var j = 0; j <= i; j += 1) {
                    for (var k = 0; k < f.length; k += 1) {
                        result.addAt(i, j, -hessian_f[k].get(i, j) / f[k]);
                    }
                }
            }
        }
        return result;
    };
    Optimizer.prototype.barrier = function (f, gradient_f, hessian_f) {
        /*
        if (f.length !== gradient_f.shape[0]) {
            console.log("Problem about f length and gradient_f shape 0 is in Optimizer in the function barrier")
        }
        */
        return { value: this.barrierValue(f),
            gradient: this.barrierGradient(f, gradient_f),
            hessian: this.barrierHessian(f, gradient_f, hessian_f)
        };
    };
    Optimizer.prototype.backtrackingLineSearch = function (t, newtonStep, f0, barrierValue, gradient_f0, barrierGradient) {
        var alpha = 0.2;
        var beta = 0.5;
        var result = 1;
        var step = newtonStep.slice();
        while (Math.max.apply(Math, this.o.fStep(step)) > 0) {
            result *= beta;
            //console.log(Math.max(...this.o.fStep(step)))
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        while (t * this.o.f0Step(step) + this.barrierValue(this.o.fStep(step)) > t * f0 + barrierValue
            + alpha * result * MathVectorBasicOperations_1.dotProduct(MathVectorBasicOperations_1.addTwoVectors(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient_f0, t), barrierGradient), newtonStep)) {
            result *= beta;
            step = MathVectorBasicOperations_1.multiplyVectorByScalar(newtonStep, result);
        }
        return result;
    };
    Optimizer.prototype.computeNewtonStep = function (gradient, hessian) {
        var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessian);
        if (choleskyDecomposition.success === false) {
            console.log("choleskyDecomposition failed");
        }
        return choleskyDecomposition.solve(MathVectorBasicOperations_1.multiplyVectorByScalar(gradient, -1));
    };
    return Optimizer;
}());
exports.Optimizer = Optimizer;


/***/ }),

/***/ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts":
/*!****************************************************!*\
  !*** ./src/mathematics/Piegl_Tiller_NURBS_Book.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.decomposeFunction = exports.basisFunctions = exports.clampingFindSpan = exports.findSpan = void 0;
/**
 * Returns the span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function findSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        console.log(u);
        console.log(knots);
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 2;
    }
    // Do binary search
    var low = degree;
    var high = knots.length - 1 - degree;
    var i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.findSpan = findSpan;
/**
 * Returns the span index used for clamping a periodic B-Spline
 * Note: The only difference with findSpan is the for the special case u = knots[-degree - 1]
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns span index i for which knots[i] ≤ u < knots[i+1]
 */
function clampingFindSpan(u, knots, degree) {
    // Bibliographic reference : Piegl and Tiller, The NURBS book, p: 68
    if (u < knots[degree] || u > knots[knots.length - degree - 1]) {
        throw new Error("Error: parameter u is outside valid span");
    }
    // Special case
    if (u === knots[knots.length - degree - 1]) {
        return knots.length - degree - 1;
    }
    // Do binary search
    var low = degree;
    var high = knots.length - 1 - degree;
    var i = Math.floor((low + high) / 2);
    while (!(knots[i] <= u && u < knots[i + 1])) {
        if (u < knots[i]) {
            high = i;
        }
        else {
            low = i;
        }
        i = Math.floor((low + high) / 2);
    }
    return i;
}
exports.clampingFindSpan = clampingFindSpan;
/**
 * Returns the basis functions values
 * @param span span index
 * @param u parameter
 * @param knots knot vector
 * @param degree degree
 * @returns the array of values evaluated at u
 */
function basisFunctions(span, u, knots, degree) {
    // Bibliographic reference : The NURBS BOOK, p.70
    var result = [1];
    var left = [];
    var right = [];
    for (var j = 1; j <= degree; j += 1) {
        left[j] = u - knots[span + 1 - j];
        right[j] = knots[span + j] - u;
        var saved = 0.0;
        for (var r = 0; r < j; r += 1) {
            var temp = result[r] / (right[r + 1] + left[j - r]);
            result[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        result[j] = saved;
    }
    return result;
}
exports.basisFunctions = basisFunctions;
function decomposeFunction(spline) {
    //Piegl and Tiller, The NURBS book, p.173
    var result = [];
    var number_of_bezier_segments = spline.distinctKnots().length - 1;
    for (var i = 0; i < number_of_bezier_segments; i += 1) {
        result.push([]);
    }
    for (var i = 0; i <= spline.degree; i += 1) {
        result[0][i] = spline.controlPoints[i];
    }
    var a = spline.degree;
    var b = spline.degree + 1;
    var bezier_segment = 0;
    var alphas = [];
    while (b < spline.knots.length - 1) {
        var i = b;
        while (b < spline.knots.length - 1 && spline.knots[b + 1] === spline.knots[b]) {
            b += 1;
        }
        var mult = b - i + 1;
        if (mult < spline.degree) {
            var numer = spline.knots[b] - spline.knots[a]; // Numerator of alpha
            // Compute and store alphas
            for (var j = spline.degree; j > mult; j -= 1) {
                alphas[j - mult - 1] = numer / (spline.knots[a + j] - spline.knots[a]);
            }
            var r = spline.degree - mult; // insert knot r times
            for (var j = 1; j <= r; j += 1) {
                var save = r - j;
                var s = mult + j; // this many new controlPoints
                for (var k = spline.degree; k >= s; k -= 1) {
                    var alpha = alphas[k - s];
                    result[bezier_segment][k] = (result[bezier_segment][k] * alpha) + (result[bezier_segment][k - 1] * (1 - alpha));
                }
                if (b < spline.knots.length) {
                    result[bezier_segment + 1][save] = result[bezier_segment][spline.degree]; // next segment
                }
            }
        }
        bezier_segment += 1; // Bezier segment completed
        if (b < spline.knots.length - 1) {
            //initialize next bezier bezier_segment
            for (i = Math.max(0, spline.degree - mult); i <= spline.degree; i += 1) {
                result[bezier_segment][i] = spline.controlPoints[b - spline.degree + i];
            }
            a = b;
            b += 1;
        }
    }
    return result;
}
exports.decomposeFunction = decomposeFunction;


/***/ }),

/***/ "./src/mathematics/SquareMatrix.ts":
/*!*****************************************!*\
  !*** ./src/mathematics/SquareMatrix.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SquareMatrix = void 0;
/**
 * A square matrix
 */
var SquareMatrix = /** @class */ (function () {
    /**
     * Create a square matrix
     * @param size Number of row and column
     * @param data A row after row flat array
     * @throws If data length is not equal to size*size
     */
    function SquareMatrix(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * size) {
                throw new Error("Square matrix constructor expect the data to have size*size length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            for (var i = 0; i < this.shape[0] * this.shape[1]; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(SquareMatrix.prototype, "shape", {
        /**
         * Returns the shape of the matrix : [number of rows, number of columns]
         */
        get: function () {
            return this._shape;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Return the corresponding index in the flat row by row data vector
     * @param row The row index
     * @param column The column index
     */
    SquareMatrix.prototype.dataIndex = function (row, column) {
        var n = row * this._shape[1] + column;
        return n;
    };
    /**
     * Return the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.get = function (row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    };
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Change the value of the matrix at a given row and column position by this value divided by the divisor value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.divideAt = function (row, column, divisor) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] /= divisor;
    };
    /**
     * Change the value of the matrix at a given row and column position by this value substracted by the subtrahend value
     * @param row The row index
     * @param column The column index
     * @param divisor The divisor value
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.substractAt = function (row, column, subtrahend) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] -= subtrahend;
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SquareMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Multiply two matrices
     * @param that A square or a symmetric matrix
     * @return a square matrix
     */
    SquareMatrix.prototype.multiplyByMatrix = function (that) {
        if (this.shape[1] !== that.shape[0]) {
            throw new Error("Size mismatch in matrix multiplication");
        }
        var result = new SquareMatrix(this.shape[1]);
        for (var i = 0; i < this.shape[0]; i += 1) {
            for (var j = 0; j < this.shape[0]; j += 1) {
                var temp = 0;
                for (var k = 0; k < this.shape[0]; k += 1) {
                    temp += this.get(i, k) * that.get(k, j);
                }
                result.set(i, j, temp);
            }
        }
        return result;
    };
    return SquareMatrix;
}());
exports.SquareMatrix = SquareMatrix;


/***/ }),

/***/ "./src/mathematics/SymmetricMatrix.ts":
/*!********************************************!*\
  !*** ./src/mathematics/SymmetricMatrix.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SymmetricMatrix = void 0;
var SquareMatrix_1 = __webpack_require__(/*! ./SquareMatrix */ "./src/mathematics/SquareMatrix.ts");
var DiagonalMatrix_1 = __webpack_require__(/*! ./DiagonalMatrix */ "./src/mathematics/DiagonalMatrix.ts");
var MathVectorBasicOperations_1 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
/**
 * A symmetric matrix
 */
var SymmetricMatrix = /** @class */ (function () {
    /**
     * Create a Symmetric Matrix
     * @param size The number of rows or the number columns
     * @param data The matrix data in a flat vector
     */
    function SymmetricMatrix(size, data) {
        this._shape = [size, size];
        if (data) {
            if (data.length !== size * (size + 1) / 2) {
                throw new Error("Square matrix constructor expect the data to have (size * (size + 1) / 2) length");
            }
            this.data = data.slice();
        }
        else {
            this.data = [];
            var n = (size * (size + 1)) / 2;
            for (var i = 0; i < n; i += 1) {
                this.data.push(0);
            }
        }
    }
    Object.defineProperty(SymmetricMatrix.prototype, "shape", {
        /**
        * Returns the shape of the matrix : [number of rows, number of columns]
        */
        get: function () {
            return this._shape;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns the corresponding index in the flat data vector.
     * In this flat data vector the upper triangular matrix is store row-wise.
     * @param row The row index
     * @param column The column index
     */
    SymmetricMatrix.prototype.dataIndex = function (row, column) {
        if (row <= column) {
            return row * this.shape[1] - (row - 1) * row / 2 + column - row;
        }
        return column * this.shape[0] - (column - 1) * column / 2 + row - column;
    };
    /**
     * Returns the value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @return Scalar
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.get = function (row, column) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        return this.data[this.dataIndex(row, column)];
    };
    /**
     * Set a given value at a given row and column position
     * @param row The row index
     * @param column The column index
     * @param value The new value
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.set = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(column);
        this.data[this.dataIndex(row, column)] = value;
    };
    /**
     * Check that the index is inside appropriate range
     * @param index The column or the row index
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.checkRowRange = function (index) {
        if (index < 0 || index >= this.shape[0]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
 * Check that the index is inside appropriate range
 * @param index The column or the row index
 * @throws If an index is out of range
 */
    SymmetricMatrix.prototype.checkColumnRange = function (index) {
        if (index < 0 || index >= this.shape[1]) {
            throw new Error("SymmetricMatrix index is out of range");
        }
    };
    /**
     * Compute the product v^t M v
     * @param v Vector
     * @return Scalar
     */
    SymmetricMatrix.prototype.quadraticForm = function (v) {
        var result = 0;
        for (var i = 1; i < this.shape[1]; i += 1) {
            for (var j = 0; j < i; j += 1) {
                result += this.get(i, j) * v[i] * v[j];
            }
        }
        result *= 2;
        for (var i = 0; i < this.shape[1]; i += 1) {
            result += this.get(i, i) * Math.pow(v[i], 2);
        }
        return result;
    };
    /**
     * Return a safe copy of this matrix
     * */
    SymmetricMatrix.prototype.clone = function () {
        return new SymmetricMatrix(this.shape[0], this.data);
    };
    /**
     * Increases the given element of the matrix by the value
     * @param row The row index
     * @param column The column index
     * @param value The number to be added
     * @throws If an index is out of range
     */
    SymmetricMatrix.prototype.addAt = function (row, column, value) {
        this.checkRowRange(row);
        this.checkColumnRange(row);
        this.data[this.dataIndex(row, column)] += value;
    };
    /**
     * Increases every diagonal element of the matrix by the value
     * @param value The number to be added
     */
    SymmetricMatrix.prototype.addValueOnDiagonalInPlace = function (value) {
        var m = this.shape[0];
        for (var i = 0; i < m; i += 1) {
            this.data[this.dataIndex(i, i)] += value;
        }
    };
    /**
     * Returns the new matrix: this.matrix + value * I
     * @param value
     * @returns SymmetricMatrix
     */
    SymmetricMatrix.prototype.addValueOnDiagonal = function (value) {
        var result = this.clone();
        result.addValueOnDiagonalInPlace(value);
        return result;
    };
    /**
     * Returns a SquareMatrix with the values of this matrix
     */
    SymmetricMatrix.prototype.squareMatrix = function () {
        var n = this.shape[0];
        var result = new SquareMatrix_1.SquareMatrix(n);
        for (var i = 0; i < n; i += 1) {
            for (var j = 0; j < n; j += 1) {
                result.set(i, j, this.get(i, j));
            }
        }
        return result;
    };
    SymmetricMatrix.prototype.plusSymmetricMatrixMultipliedByValue = function (matrix, value) {
        if (this.shape[0] !== matrix.shape[0]) {
            throw new Error("Adding two symmetric matrix with different shapes");
        }
        var result = this.clone();
        var n = result.shape[0];
        if (matrix instanceof DiagonalMatrix_1.DiagonalMatrix) {
            for (var i = 0; i < n; i += 1) {
                result.addAt(i, i, matrix.get(i, i) * value);
            }
            return result;
        }
        else {
            for (var i = 0; i < n; i += 1) {
                for (var j = 0; j <= i; j += 1) {
                    result.addAt(i, j, matrix.get(i, j) * value);
                }
            }
            return result;
        }
    };
    SymmetricMatrix.prototype.multiplyByVector = function (v) {
        if (this.shape[1] !== v.length) {
            throw new Error("SymmetricMatrix multiply a vector of incorrect length");
        }
        var result = [];
        var n = this.shape[1];
        for (var i = 0; i < n; i += 1) {
            var temp = 0;
            for (var j = 0; j < n; j += 1) {
                temp += this.get(i, j) * v[j];
            }
            result.push(temp);
        }
        return result;
    };
    SymmetricMatrix.prototype.containsNaN = function () {
        return MathVectorBasicOperations_1.containsNaN(this.data);
    };
    return SymmetricMatrix;
}());
exports.SymmetricMatrix = SymmetricMatrix;


/***/ }),

/***/ "./src/mathematics/TrustRegionSubproblem.ts":
/*!**************************************************!*\
  !*** ./src/mathematics/TrustRegionSubproblem.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoundariesIntersections = exports.gershgorin_bounds = exports.frobeniusNorm = exports.TrustRegionSubproblem = void 0;
var SquareMatrix_1 = __webpack_require__(/*! ./SquareMatrix */ "./src/mathematics/SquareMatrix.ts");
var MathVectorBasicOperations_1 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_2 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_3 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_4 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_5 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_6 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_7 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_8 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var MathVectorBasicOperations_9 = __webpack_require__(/*! ./MathVectorBasicOperations */ "./src/mathematics/MathVectorBasicOperations.ts");
var CholeskyDecomposition_1 = __webpack_require__(/*! ./CholeskyDecomposition */ "./src/mathematics/CholeskyDecomposition.ts");
// Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 187
// note: lambda is never negative
var lambdaRange;
(function (lambdaRange) {
    lambdaRange[lambdaRange["N"] = 0] = "N";
    lambdaRange[lambdaRange["L"] = 1] = "L";
    lambdaRange[lambdaRange["G"] = 2] = "G";
    lambdaRange[lambdaRange["F"] = 3] = "F";
})(lambdaRange || (lambdaRange = {}));
/**
 * A trust region subproblem solver
 */
var TrustRegionSubproblem = /** @class */ (function () {
    /**
     * Create the trust region subproblem solver
     * @param gradient The gradient of the objective function to minimize
     * @param hessian The hessian of the objective function to minimize
     * @param k_easy Optional value in the range (0, 1)
     * @param k_hard Optional value in the range (0, 1)
     */
    function TrustRegionSubproblem(gradient, hessian, k_easy, k_hard) {
        if (k_easy === void 0) { k_easy = 0.1; }
        if (k_hard === void 0) { k_hard = 0.2; }
        this.gradient = gradient;
        this.hessian = hessian;
        this.k_easy = k_easy;
        this.k_hard = k_hard;
        this.CLOSE_TO_ZERO = 10e-8;
        this.numberOfIterations = 0;
        this.lambda = { current: 0, lowerBound: 0, upperBound: 0 };
        this.hitsBoundary = true;
        this.step = [];
        this.stepSquaredNorm = 0;
        this.stepNorm = 0;
        this.range = lambdaRange.F;
        this.lambdaPlus = 0;
        this.hardCase = false;
        this.gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        if (MathVectorBasicOperations_1.containsNaN(gradient)) {
            throw new Error("The gradient parameter passed to the TrustRegionSubproblem constructor contains NaN");
        }
        if (hessian.containsNaN()) {
            throw new Error("The hessian parameter passed to the TrustRegionSubproblem to constructor contains NaN");
        }
        this.cauchyPoint = MathVectorBasicOperations_8.zeroVector(this.gradient.length);
    }
    /**
     * Find the nearly exact trust region subproblem minimizer
     * @param trustRegionRadius The trust region radius
     * @returns The vector .step and the boolean .hitsBoundary
     */
    TrustRegionSubproblem.prototype.solve = function (trustRegionRadius) {
        // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 193
        // see also the list of errata: ftp://ftp.numerical.rl.ac.uk/pub/trbook/trbook-errata.pdf for Algorithm 7.3.4 Step 1a
        this.cauchyPoint = this.computeCauchyPoint(trustRegionRadius);
        this.lambda = this.initialLambdas(trustRegionRadius);
        this.numberOfIterations = 0;
        var maxNumberOfIterations = 300;
        while (true) {
            this.numberOfIterations += 1;
            // step 1.
            var hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
            var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            //We have found the exact lambda, however the hessian is indefinite
            //The idea is then to find an approximate solution increasing the lambda value by EPSILON
            if (this.lambda.upperBound === this.lambda.lowerBound && !choleskyDecomposition.success) {
                var EPSILON = 10e-6;
                this.lambda.upperBound += EPSILON;
                this.lambda.current += EPSILON;
                hessianPlusLambda = this.hessian.addValueOnDiagonal(this.lambda.current);
                choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
                this.range = lambdaRange.G;
            }
            // step 1a.
            this.update_step_and_range(trustRegionRadius, choleskyDecomposition);
            if (this.interiorConvergence()) {
                break;
            }
            // step 2.
            this.update_lower_and_upper_bounds();
            // step 3.
            this.update_lambda_lambdaPlus_lowerBound_and_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition);
            // step 4.
            if (this.check_for_termination_and_update_step(trustRegionRadius, hessianPlusLambda, choleskyDecomposition)) {
                break;
            }
            // step 5.
            this.update_lambda();
            if (this.numberOfIterations > maxNumberOfIterations) {
                throw new Error("Trust region subproblem maximum number of step exceeded");
            }
        }
        //console.log(this.numberOfIterations)
        return {
            step: this.step,
            hitsBoundary: this.hitsBoundary,
            hardCase: this.hardCase
        };
    };
    /**
     * An interior solution with a zero Lagrangian multiplier implies interior convergence
     */
    TrustRegionSubproblem.prototype.interiorConvergence = function () {
        // A range G corresponds to a step smaller than the trust region radius
        if (this.lambda.current === 0 && this.range === lambdaRange.G) {
            this.hitsBoundary = false;
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Updates the lambdaRange set. Updates the step if the factorization succeeded.
     * @param trustRegionRadius Trust region radius
     * @param choleskyDecomposition Cholesky decomposition
     */
    TrustRegionSubproblem.prototype.update_step_and_range = function (trustRegionRadius, choleskyDecomposition) {
        if (choleskyDecomposition.success) {
            this.step = choleskyDecomposition.solve(MathVectorBasicOperations_4.multiplyVectorByScalar(this.gradient, -1));
            this.stepSquaredNorm = MathVectorBasicOperations_3.squaredNorm(this.step);
            this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            if (this.stepNorm < trustRegionRadius) {
                this.range = lambdaRange.G;
            }
            else {
                this.range = lambdaRange.L; // once a Newton iterate falls into L it stays there
            }
        }
        else {
            this.range = lambdaRange.N;
        }
    };
    /**
     * Update lambda.upperBound or lambda.lowerBound
     */
    TrustRegionSubproblem.prototype.update_lower_and_upper_bounds = function () {
        if (this.range === lambdaRange.G) {
            this.lambda.upperBound = this.lambda.current;
        }
        else {
            this.lambda.lowerBound = this.lambda.current;
        }
    };
    /**
     * Update lambdaPlus, lambda.lowerBound, lambda.current and step
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The Cholesky Decomposition of Hessian + lambda.current * I
     */
    TrustRegionSubproblem.prototype.update_lambda_lambdaPlus_lowerBound_and_step = function (trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        // Step 3. If lambda in F
        if (this.range === lambdaRange.L || this.range === lambdaRange.G) {
            // Step 3a. Solve Lw = step and set lambdaPlus (algorithm 7.3.1)
            var w = solveLowerTriangular(choleskyDecomposition.g, this.step);
            var wSquaredNorm = MathVectorBasicOperations_3.squaredNorm(w);
            this.lambdaPlus = this.lambda.current + (this.stepNorm / trustRegionRadius - 1) * (this.stepSquaredNorm / wSquaredNorm);
            // Step 3b. If lambda in G
            if (this.range === lambdaRange.G) {
                // i. Use the LINPACK method to find a unit vector u to make <u, H(lambda), u> small.
                var s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
                // ii. Replace lambda.lowerBound by max [lambda_lb, lambda - <u, H(lambda), u>].
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current - Math.pow(s_min.value, 2));
                // iii. Find the root alpha of the equation || step + alpha u || = trustRegionRadius which makes
                // the model q(step + alpha u) smallest and replace step by step + alpha u
                var intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
                var t = void 0;
                if (Math.abs(intersection.tmin) < Math.abs(intersection.tmax)) {
                    t = intersection.tmin;
                }
                else {
                    t = intersection.tmax;
                }
                MathVectorBasicOperations_7.saxpy(t, s_min.vector, this.step);
                this.stepSquaredNorm = MathVectorBasicOperations_3.squaredNorm(this.step);
                this.stepNorm = Math.sqrt(this.stepSquaredNorm);
            }
        }
        else {
            // Step 3c. Use the partial factorization to find delta and v such that (H(lambda) + delta e_k e_k^T) v = 0
            var sls = singularLeadingSubmatrix(hessianPlusLambda, choleskyDecomposition.g, choleskyDecomposition.firstNonPositiveDefiniteLeadingSubmatrixSize);
            // Step 3d. Replace lambda.lb by max [ lambda_lb, lambda_current + delta / || v ||^2 ]
            var vSquaredNorm = MathVectorBasicOperations_3.squaredNorm(sls.vector);
            this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambda.current + sls.delta / vSquaredNorm);
            //lambda.current = Math.max(Math.sqrt(lambda.lb * lambda.ub), lambda.lb + this.UPDATE_COEFF * (lambda.ub - lambda.lb));
        }
    };
    /**
     * Check for termination
     * @param trustRegionRadius Trust region radius
     * @param hessianPlusLambda Hessian + lambda.current * I
     * @param choleskyDecomposition The CholeskyDecomposition of Hessian + lambda.current * I
     */
    TrustRegionSubproblem.prototype.check_for_termination_and_update_step = function (trustRegionRadius, hessianPlusLambda, choleskyDecomposition) {
        var terminate = false;
        // Algorithm 7.3.5, Step 1. If lambda is in F and | ||s(lambda)|| - trustRegionRadius | <= k_easy * trustRegionRadius
        if ((this.range === lambdaRange.L || this.range === lambdaRange.G) && Math.abs(this.stepNorm - trustRegionRadius) <= this.k_easy * trustRegionRadius) {
            // Added test to make sure that the result is better than the Cauchy point
            var evalResult = MathVectorBasicOperations_6.dotProduct(this.gradient, this.step) + 0.5 * this.hessian.quadraticForm(this.step);
            var evalCauchy = MathVectorBasicOperations_6.dotProduct(this.gradient, this.cauchyPoint) + 0.5 * this.hessian.quadraticForm(this.cauchyPoint);
            if (evalResult > evalCauchy) {
                return false;
            }
            else {
                // stop with s = s(lambda)
                this.hitsBoundary = true;
                terminate = true;
            }
        }
        if (this.range === lambdaRange.G) {
            // Algorithm 7.3.5, Step 2. If lambda = 0 in G
            if (this.lambda.current === 0) {
                this.hitsBoundary = false; // since the Lagrange Multiplier is zero
                terminate = true;
                return terminate;
            }
            // Algorithm 7.3.5, Step 3. If lambda is in G and the LINPACK method gives u and alpha such that
            // alpha^2 <u, H(lambda), u> <= k_hard ( <s(lambda), H(lambda) * s(lambda) + lambda * trustRegionRadius^2 >)
            var s_min = estimateSmallestSingularValue(choleskyDecomposition.g);
            //let alpha = s_min.value
            //let u = s_min.vector
            var intersection = getBoundariesIntersections(this.step, s_min.vector, trustRegionRadius);
            var t_abs_max = void 0;
            // To do : explain better why > instead of <
            // relative_error is smaller for <
            // it seems that we need the worst case to make sure the result is a better solution
            // than the Cauchy point
            if (Math.abs(intersection.tmin) > Math.abs(intersection.tmax)) {
                t_abs_max = intersection.tmin;
            }
            else {
                t_abs_max = intersection.tmax;
            }
            var quadraticTerm = hessianPlusLambda.quadraticForm(this.step);
            var relative_error = Math.pow(t_abs_max * s_min.value, 2) / (quadraticTerm + this.lambda.current * Math.pow(trustRegionRadius, 2));
            //if (relative_error <= this.k_hard || t_abs_min < this.CLOSE_TO_ZERO) {
            if (relative_error <= this.k_hard) {
                //saxpy(t_abs_min, s_min.vector, this.step) done at step 3b iii.
                this.hitsBoundary = true;
                this.hardCase = true;
                terminate = true;
            }
        }
        return terminate;
    };
    /**
     * Update lambda.current
     */
    TrustRegionSubproblem.prototype.update_lambda = function () {
        //step 5.
        if (this.range === lambdaRange.L && this.gNorm !== 0) {
            this.lambda.current = this.lambdaPlus;
        }
        else if (this.range === lambdaRange.G) {
            var hessianPlusLambda = this.hessian.clone();
            hessianPlusLambda.addValueOnDiagonal(this.lambdaPlus);
            var choleskyDecomposition = new CholeskyDecomposition_1.CholeskyDecomposition(hessianPlusLambda);
            // If the factorization succeeds, then lambdaPlus is in L. Otherwise, lambdaPlus is in N
            if (choleskyDecomposition.success) {
                this.lambda.current = this.lambdaPlus;
            }
            else {
                this.lambda.lowerBound = Math.max(this.lambda.lowerBound, this.lambdaPlus);
                // Check lambda.lb for interior convergence ???
                this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
            }
        }
        else {
            this.lambda.current = updateLambda_using_equation_7_3_14(this.lambda.lowerBound, this.lambda.upperBound);
        }
    };
    /**
     * Returns the minimizer along the steepest descent (-gradient) direction subject to trust-region bound.
     * Note: If the gradient is a zero vector then the function returns a zero vector
     * @param trustRegionRadius The trust region radius
     * @return The minimizer vector deta x
     */
    TrustRegionSubproblem.prototype.computeCauchyPoint = function (trustRegionRadius) {
        // Bibliographic referece: Numerical Optimizatoin, second edition, Nocedal and Wright, p. 71-72
        var gHg = this.hessian.quadraticForm(this.gradient);
        var gNorm = MathVectorBasicOperations_1.norm(this.gradient);
        // return a zero step if the gradient is zero
        if (gNorm === 0) {
            return MathVectorBasicOperations_8.zeroVector(this.gradient.length);
        }
        var result = MathVectorBasicOperations_4.multiplyVectorByScalar(this.gradient, -trustRegionRadius / gNorm);
        if (gHg <= 0) {
            return result;
        }
        var tau = Math.pow(gNorm, 3) / trustRegionRadius / gHg;
        if (tau < 1) {
            return MathVectorBasicOperations_4.multiplyVectorByScalar(result, tau);
        }
        return result;
    };
    /**
     * Return an initial value, an upper bound and a lower bound for lambda.
     * @param trustRegionRadius The trust region radius
     * @return .current (lambda intial value) .lb (lower bound) and .ub (upper bound)
     */
    TrustRegionSubproblem.prototype.initialLambdas = function (trustRegionRadius) {
        // Bibliographic reference : Trust-Region Methods, Conn, Gould and Toint p. 192
        var gershgorin = gershgorin_bounds(this.hessian);
        var hessianFrobeniusNorm = frobeniusNorm(this.hessian);
        var hessianInfiniteNorm = 0;
        var minHessianDiagonal = this.hessian.get(0, 0);
        for (var i = 0; i < this.hessian.shape[0]; i += 1) {
            var tempInfiniteNorm = 0;
            for (var j = 0; j < this.hessian.shape[0]; j += 1) {
                tempInfiniteNorm += Math.abs(this.hessian.get(i, j));
            }
            hessianInfiniteNorm = Math.max(hessianInfiniteNorm, tempInfiniteNorm);
            minHessianDiagonal = Math.min(minHessianDiagonal, this.hessian.get(i, i));
        }
        var lowerBound = Math.max(0, Math.max(-minHessianDiagonal, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius - Math.min(gershgorin.upperBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm))));
        var upperBound = Math.max(0, MathVectorBasicOperations_1.norm(this.gradient) / trustRegionRadius + Math.min(-gershgorin.lowerBound, Math.min(hessianFrobeniusNorm, hessianInfiniteNorm)));
        var lambda_initial;
        if (lowerBound === 0) {
            lambda_initial = 0;
        }
        else {
            lambda_initial = updateLambda_using_equation_7_3_14(lowerBound, upperBound);
        }
        return {
            current: lambda_initial,
            lowerBound: lowerBound,
            upperBound: upperBound
        };
    };
    return TrustRegionSubproblem;
}());
exports.TrustRegionSubproblem = TrustRegionSubproblem;
/**
 *
 * @param A
 * @param L
 * @param k
 * @return dela, vector
 * @throws If k < 0
 */
function singularLeadingSubmatrix(A, L, k) {
    if (k < 0) {
        throw new Error('k should not be a negative value');
    }
    var delta = 0;
    var l = new SquareMatrix_1.SquareMatrix(k);
    var v = [];
    var u = MathVectorBasicOperations_8.zeroVector(k);
    for (var j = 0; j < k - 1; j += 1) {
        delta += Math.pow(L.get(k - 1, j), 2);
    }
    delta -= A.get(k - 1, k - 1);
    for (var i = 0; i < k - 1; i += 1) {
        for (var j = 0; j <= i; j += 1) {
            l.set(i, j, L.get(i, j));
        }
        u[i] = L.get(k - 1, i);
    }
    v = MathVectorBasicOperations_8.zeroVector(A.shape[0]);
    v[k - 1] = 1;
    if (k !== 1) {
        var vtemp = solveLowerTriangular(l, u);
        for (var i = 0; i < k - 1; i += 1) {
            v[i] = vtemp[i];
        }
    }
    return {
        delta: delta,
        vector: v
    };
}
/**
 * Estimate the smallest singular value
 * @param lowerTriangular
 */
function estimateSmallestSingularValue(lowerTriangular) {
    // Bibliographic reference :  Golub, G. H., Van Loan, C. F. (2013), "Matrix computations". Forth Edition. JHU press. pp. 140-142.
    // Web reference: https://github.com/scipy/scipy/blob/master/scipy/optimize/_trustregion_exact.py
    var n = lowerTriangular.shape[0];
    var p = MathVectorBasicOperations_8.zeroVector(n);
    var y = MathVectorBasicOperations_8.zeroVector(n);
    var p_plus = [];
    var p_minus = [];
    for (var k = 0; k < n; k += 1) {
        var y_plus = (1 - p[k]) / lowerTriangular.get(k, k);
        var y_minus = (-1 - p[k]) / lowerTriangular.get(k, k);
        for (var i = k + 1; i < n; i += 1) {
            p_plus.push(p[i] + lowerTriangular.get(i, k) * y_plus);
            p_minus.push(p[i] + lowerTriangular.get(i, k) * y_minus);
        }
        if (Math.abs(y_plus) + MathVectorBasicOperations_2.norm1(p_plus) >= Math.abs(y_minus) + MathVectorBasicOperations_2.norm1(p_minus)) {
            y[k] = y_plus;
            for (var i = k + 1; i < n; i += 1) {
                p[i] = p_plus[i - k - 1];
            }
        }
        else {
            y[k] = y_minus;
            for (var i = k + 1; i < n; i += 1) {
                p[i] = p_minus[i - k - 1];
            }
        }
    }
    var v = solveUpperTriangular(lowerTriangular, y);
    var vNorm = MathVectorBasicOperations_1.norm(v);
    var yNorm = MathVectorBasicOperations_1.norm(y);
    if (vNorm === 0) {
        throw new Error("divideVectorByScalar division by zero");
    }
    return {
        value: yNorm / vNorm,
        vector: MathVectorBasicOperations_5.divideVectorByScalar(v, vNorm)
    };
}
/**
 * Solve the linear problem upper triangular matrix UT x = y
 * @param lowerTriangular The transpose of the upper triangular matrix
 * @param y The vector y
 */
function solveUpperTriangular(lowerTriangular, y) {
    var x = y.slice();
    var n = lowerTriangular.shape[0];
    // LT x = y
    for (var i = n - 1; i >= 0; i -= 1) {
        var sum = x[i];
        for (var k = i + 1; k < n; k += 1) {
            sum -= lowerTriangular.get(k, i) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * Solve the linear problem lower triangular matrix LT x = b
 * @param lowerTriangular The lower triangular matrix
 * @param b The vector b
 */
function solveLowerTriangular(lowerTriangular, b) {
    if (lowerTriangular.shape[0] !== b.length) {
        throw new Error('solveLowerTriangular: matrix and vector are not the same sizes');
    }
    var x = b.slice();
    var n = lowerTriangular.shape[0];
    // L x = b
    for (var i = 0; i < n; i += 1) {
        var sum = b[i];
        for (var k = i - 1; k >= 0; k -= 1) {
            sum -= lowerTriangular.get(i, k) * x[k];
        }
        x[i] = sum / lowerTriangular.get(i, i);
    }
    return x;
}
/**
 * The frobenius norm
 * @param matrix The matrix
 * @return The square root of the sum of every elements squared
 */
function frobeniusNorm(matrix) {
    var result = 0;
    var m = matrix.shape[0];
    var n = matrix.shape[1];
    for (var i = 0; i < m; i += 1) {
        for (var j = 0; j < n; j += 1) {
            result += Math.pow(matrix.get(i, j), 2);
        }
    }
    result = Math.sqrt(result);
    return result;
}
exports.frobeniusNorm = frobeniusNorm;
/**
* Given a symmetric matrix, compute the Gershgorin upper and lower bounds for its eigenvalues
* @param matrix Symmetric Matrix
* @return .lb (lower bound) and .ub (upper bound)
*/
function gershgorin_bounds(matrix) {
    // Bibliographic Reference : Trust-Region Methods, Conn, Gould and Toint p. 19
    // Gershgorin Bounds : All eigenvalues of a matrix A lie in the complex plane within the intersection
    // of n discs centered at a_(i, i) and of radii : sum of a_(i, j) for 1 ≤ i ≤ n and  j != i
    // When the matrix is symmetric, the eigenvalues are real and the discs become intervals on the real
    // line
    var m = matrix.shape[0];
    var n = matrix.shape[1];
    var matrixRowSums = [];
    for (var i = 0; i < m; i += 1) {
        var rowSum = 0;
        for (var j = 0; j < n; j += 1) {
            rowSum += Math.abs(matrix.get(i, j));
        }
        matrixRowSums.push(rowSum);
    }
    var matrixDiagonal = [];
    var matrixDiagonalAbsolute = [];
    for (var i = 0; i < m; i += 1) {
        matrixDiagonal.push(matrix.get(i, i));
        matrixDiagonalAbsolute.push(Math.abs(matrix.get(i, i)));
    }
    var lb = [];
    var ub = [];
    for (var i = 0; i < m; i += 1) {
        lb.push(matrixDiagonal[i] + matrixDiagonalAbsolute[i] - matrixRowSums[i]);
        ub.push(matrixDiagonal[i] - matrixDiagonalAbsolute[i] + matrixRowSums[i]);
    }
    var lowerBound = Math.min.apply(null, lb);
    var upperBound = Math.max.apply(null, ub);
    return {
        lowerBound: lowerBound,
        upperBound: upperBound
    };
}
exports.gershgorin_bounds = gershgorin_bounds;
/**
 * Solve the scalar quadratic equation ||z + t d|| == trust_radius
 * This is like a line-sphere intersection
 * @param z Vector
 * @param d Vector
 * @param trustRegionRadius
 * @returns The two values of t, sorted from low to high
 */
function getBoundariesIntersections(z, d, trustRegionRadius) {
    if (MathVectorBasicOperations_1.isZeroVector(d)) {
        throw new Error("In getBoundariesInstersections the d vector cannot be the zero vector");
    }
    var a = MathVectorBasicOperations_3.squaredNorm(d);
    var b = 2 * MathVectorBasicOperations_6.dotProduct(z, d);
    var c = MathVectorBasicOperations_3.squaredNorm(z) - trustRegionRadius * trustRegionRadius;
    var sqrtDiscriminant = Math.sqrt(b * b - 4 * a * c);
    var sign_b = MathVectorBasicOperations_9.sign(b);
    if (sign_b === 0) {
        sign_b = 1;
    }
    var aux = b + sqrtDiscriminant * sign_b;
    var ta = -aux / (2 * a);
    var tb = -2 * c / aux;
    return {
        tmin: Math.min(ta, tb),
        tmax: Math.max(ta, tb)
    };
}
exports.getBoundariesIntersections = getBoundariesIntersections;
function updateLambda_using_equation_7_3_14(lowerBound, upperBound, theta) {
    if (theta === void 0) { theta = 0.01; }
    // Bibliographic Reference: Trust-Region Methods, Conn, Gould and Toint p. 190
    return Math.max(Math.sqrt(upperBound * lowerBound), lowerBound + theta * (upperBound - lowerBound));
}


/***/ }),

/***/ "./src/mathematics/Vector_2d.ts":
/*!**************************************!*\
  !*** ./src/mathematics/Vector_2d.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * A two dimensional vector
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector_2d = void 0;
var Vector_2d = /** @class */ (function () {
    function Vector_2d(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector_2d.prototype.negative = function () {
        return new Vector_2d(-this.x, -this.y);
    };
    Vector_2d.prototype.add = function (v) {
        return new Vector_2d(this.x + v.x, this.y + v.y);
    };
    Vector_2d.prototype.multiply = function (value) {
        return new Vector_2d(this.x * value, this.y * value);
    };
    Vector_2d.prototype.substract = function (v) {
        return new Vector_2d(this.x - v.x, this.y - v.y);
    };
    Vector_2d.prototype.rotate90degrees = function () {
        return new Vector_2d(-this.y, this.x);
    };
    Vector_2d.prototype.normalize = function () {
        var x, y, norm;
        norm = Math.sqrt(this.x * this.x + this.y * this.y);
        x = this.x / norm;
        y = this.y / norm;
        return new Vector_2d(x, y);
    };
    Vector_2d.prototype.dot = function (v) {
        'use strict';
        return this.x * v.x + this.y * v.y;
    };
    Vector_2d.prototype.distance = function (v) {
        'use strict';
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    };
    return Vector_2d;
}());
exports.Vector_2d = Vector_2d;


/***/ }),

/***/ "./src/models/CurveModel.ts":
/*!**********************************!*\
  !*** ./src/models/CurveModel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveModel = void 0;
var BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2 */ "./src/mathematics/BSpline_R1_to_R2.ts");
var Vector_2d_1 = __webpack_require__(/*! ../mathematics/Vector_2d */ "./src/mathematics/Vector_2d.ts");
var CurveModel = /** @class */ (function () {
    function CurveModel() {
        //private target: PeriodicBSpline_R1_to_R2
        this.observers = [];
        //const cp = [ [-0.5, 0.5], [-0.25, -0.4], [0.25, 0.0], [0.5, -0.5] ]
        var deltay = -0.3;
        var cp = [[-0.5, 0.2 + deltay], [-0.25, 0 + deltay], [0.25, 0.1 + deltay], [0.5, 0.6 + deltay]];
        var knots = [0, 0, 0, 0, 1, 1, 1, 1];
        this.spline = BSpline_R1_to_R2_1.create_BSpline_R1_to_R2(cp, knots);
        //this.spline.insertKnot(0.1)
        //this.spline.insertKnot(0.2)
        //this.spline.insertKnot(1/3)
        //this.spline.insertKnot(0.4)
        //this.spline.insertKnot(0.5)
        //this.spline.insertKnot(2/3)
        //this.spline.insertKnot(0.7)
        //this.spline.insertKnot(0.8)
        //this.spline.insertKnot(0.9)
        /*
               const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4], [0.5, 0.5] ]
               const knots = [0, 0, 0, 0, 0, 0,  1, 1, 1, 1, 1, 1]
               this.spline = create_BSpline_R1_to_R2(cp, knots)
        */
        /*
               const cp = [ [-0.5, 0.5], [-0.35, 0.4], [0, 0], [0.35, 0.4], [0.5, 0.5] ]
               const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
               this.spline = create_BSpline_R1_to_R2(cp, knots)
        */
        //this.spline.insertKnot(0.1)
        //this.spline.insertKnot(0.2)
        //this.spline.insertKnot(0.3)
        //this.spline.insertKnot(0.4)
        //this.spline.insertKnot(0.5)
        //this.spline.insertKnot(0.6)
        //this.spline.insertKnot(0.7)
        //this.spline.insertKnot(0.8)
        //this.spline.insertKnot(0.9)
        /*
        const cp = [ [-0.5, 0.5], [-0.35, 0.4], [-0.2, 0], [0.2, 0], [0.35, 0.4] ]
        const knots = [0, 0, 0, 0, 0,  1, 1, 1, 1, 1]
        this.spline = create_BSpline_R1_to_R2(cp, knots)
         */
        /*
        let knots = [0, 0, 0, 0]
        const n = 20
        for (let i = 1; i < n; i += 1) {
            knots.push(i/n)
        }
        knots.push(1)
        knots.push(1)
        knots.push(1)
        knots.push(1)
        const cp = [ [0.975, 0.248], [0.902, 0.294], [0.876, 0.397], [0.773, 0.466], [0.775, 0.486], [0.822, 0.517], [0.819, 0.535], [0.795, 0.543], [0.788, 0.559], [0.846, 0.572], [0.793, 0.589], [0.792, 0.603], [0.807, 0.613], [0.831, 0.626], [0.801, 0.660], [0.800, 0.699], [0.819, 0.724], [0.863, 0.736], [0.917, 0.720], [0.958, 0.753], [0.943, 0.814], [0.988, 0.873], [0.995, 0.943] ]

        for (let i = 0; i < cp.length; i += 1) {
            cp[i][0] -= 0.9
            cp[i][1] -= 0.6
        }

        for (let i = 0; i < cp.length; i += 1) {
            cp[i][0] = cp[i][0] * 2.5
            cp[i][1] = -cp[i][1] * 2.5
        }

        this.spline = create_BSpline_R1_to_R2(cp, knots)
        */
    }
    CurveModel.prototype.registerObserver = function (observer) {
        this.observers.push(observer);
    };
    CurveModel.prototype.removeObserver = function (observer) {
        this.observers.splice(this.observers.indexOf(observer), 1);
    };
    CurveModel.prototype.notifyObservers = function () {
        for (var i = 0; i < this.observers.length; i += 1) {
            this.observers[i].update(this.spline);
        }
    };
    CurveModel.prototype.moveControlPoint = function (controlPointIndex, deltaX, deltaY) {
        this.spline.moveControlPoint(controlPointIndex, deltaX, deltaY);
        if (deltaX * deltaX + deltaY * deltaY > 0) {
            this.notifyObservers();
        }
    };
    CurveModel.prototype.setControlPoint = function (controlPointIndex, x, y) {
        this.spline.setControlPoint(controlPointIndex, new Vector_2d_1.Vector_2d(x, y));
        //this.notifyObservers()
    };
    CurveModel.prototype.setControlPoints = function (controlPoints) {
        this.spline.setControlPoints(controlPoints);
        //this.notifyObservers()
    };
    CurveModel.prototype.setSpline = function (spline) {
        this.spline = spline;
        this.notifyObservers();
    };
    return CurveModel;
}());
exports.CurveModel = CurveModel;


/***/ }),

/***/ "./src/views/ClickButtonView.ts":
/*!**************************************!*\
  !*** ./src/views/ClickButtonView.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickButtonView = void 0;
var ClickButtonView = /** @class */ (function () {
    function ClickButtonView(x, y, clickButtonShaders) {
        this.x = x;
        this.y = y;
        this.clickButtonShaders = clickButtonShaders;
        this.red = 0.5;
        this.green = 0.5;
        this.blue = 0.5;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        var check = this.initVertexBuffers(this.clickButtonShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    ClickButtonView.prototype.updateVerticesAndIndices = function () {
        var size = 0.05;
        var ratio = 1.5;
        this.vertices = new Float32Array(4 * 8);
        this.indices = new Uint8Array(2 * 3);
        this.vertices[0] = this.x - size * ratio;
        this.vertices[1] = this.y - size;
        this.vertices[2] = this.z;
        this.vertices[3] = -ratio;
        this.vertices[4] = -1;
        this.vertices[5] = this.red;
        this.vertices[6] = this.green;
        this.vertices[7] = this.blue;
        this.vertices[8] = this.x + size * ratio;
        this.vertices[9] = this.y - size;
        this.vertices[10] = this.z;
        this.vertices[11] = ratio;
        this.vertices[12] = -1;
        this.vertices[13] = this.red;
        this.vertices[14] = this.green;
        this.vertices[15] = this.blue;
        this.vertices[16] = this.x + size * ratio;
        this.vertices[17] = this.y + size;
        this.vertices[18] = this.z;
        this.vertices[19] = ratio;
        this.vertices[20] = 1;
        this.vertices[21] = this.red;
        this.vertices[22] = this.green;
        this.vertices[23] = this.blue;
        this.vertices[24] = this.x - size * ratio;
        this.vertices[25] = this.y + size;
        this.vertices[26] = this.z;
        this.vertices[27] = -ratio;
        this.vertices[28] = 1;
        this.vertices[29] = this.red;
        this.vertices[30] = this.green;
        this.vertices[31] = this.blue;
        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 0;
        this.indices[4] = 2;
        this.indices[5] = 3;
    };
    ClickButtonView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    ClickButtonView.prototype.renderFrame = function () {
        var gl = this.clickButtonShaders.gl, a_Position = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.clickButtonShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        gl.useProgram(this.clickButtonShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        this.clickButtonShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    ClickButtonView.prototype.selected = function (x, y) {
        var deltaSquared = 0.01;
        var result = false;
        if (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < deltaSquared) {
            result = true;
        }
        return result;
    };
    ClickButtonView.prototype.updateBuffers = function () {
        var gl = this.clickButtonShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return ClickButtonView;
}());
exports.ClickButtonView = ClickButtonView;


/***/ }),

/***/ "./src/views/ControlPointsShaders.ts":
/*!*******************************************!*\
  !*** ./src/views/ControlPointsShaders.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPointsShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var ControlPointsShaders = /** @class */ (function () {
    function ControlPointsShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'attribute vec3 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    v_Color = a_Color; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            '//uniform bool selected; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '     vec4 fColor = vec4(0.1, 0.1, 0.1, 0.0); \n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     vec4 color1 = vec4(v_Color, 0.35); \n' +
            '     vec4 color2 = vec4(v_Color, 0.9); \n' +
            '     float delta = 0.1; \n' +
            '     float alpha1 = smoothstep(0.35-delta, 0.35, dist); \n' +
            '     float alpha2 = smoothstep(0.65-delta, 0.65, dist); \n' +
            '     vec4 fColor1 = mix(color1, fColor, alpha1); \n' +
            '     vec4 fColor2 = mix(color2, fColor, alpha2); \n' +
            '     gl_FragColor = (fColor1+fColor2)/2.0; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    ControlPointsShaders.prototype.renderFrame = function (numberOfElements, selectedControlPoint) {
        //const False = 0
        //const True = 1
        if (this.program) {
            //this.gl.uniform1i(this.gl.getUniformLocation(this.program, "selected"), False);
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
            if (selectedControlPoint != -1 && selectedControlPoint !== null) {
                //this.gl.uniform1i(this.gl.getUniformLocation(this.program, "selected"), True);
                this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_BYTE, selectedControlPoint * 6);
            }
        }
    };
    return ControlPointsShaders;
}());
exports.ControlPointsShaders = ControlPointsShaders;


/***/ }),

/***/ "./src/views/ControlPointsView.ts":
/*!****************************************!*\
  !*** ./src/views/ControlPointsView.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPointsView = void 0;
var ControlPointsView = /** @class */ (function () {
    function ControlPointsView(spline, controlPointsShaders, red, blue, green) {
        this.spline = spline;
        this.controlPointsShaders = controlPointsShaders;
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.z = 0;
        this.selectedControlPoint = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.visibleControlPoints();
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.controlPointsShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    ControlPointsView.prototype.updateVerticesAndIndices = function () {
        var size = 0.03;
        //const size = 0.05
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var x = this.controlPoints[i].x;
            var y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    ControlPointsView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    ControlPointsView.prototype.renderFrame = function () {
        var gl = this.controlPointsShaders.gl, a_Position = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Texture'), a_Color = gl.getAttribLocation(this.controlPointsShaders.program, 'a_Color'), FSIZE = this.vertices.BYTES_PER_ELEMENT;
        gl.useProgram(this.controlPointsShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);
        this.controlPointsShaders.renderFrame(this.indices.length, this.selectedControlPoint);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    ControlPointsView.prototype.controlPointSelection = function (x, y, deltaSquared) {
        if (deltaSquared === void 0) { deltaSquared = 0.01; }
        //const deltaSquared = 0.01
        //const deltaSquared = 0.001
        var result = null;
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            if (Math.pow(x - this.controlPoints[i].x, 2) + Math.pow(y - this.controlPoints[i].y, 2) < deltaSquared) {
                return i;
            }
        }
        return result;
    };
    ControlPointsView.prototype.update = function (spline) {
        this.controlPoints = spline.visibleControlPoints();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    ControlPointsView.prototype.updatePoints = function (points) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    ControlPointsView.prototype.updateBuffers = function () {
        var gl = this.controlPointsShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    ControlPointsView.prototype.getSelectedControlPoint = function () {
        return this.selectedControlPoint;
    };
    ControlPointsView.prototype.setSelected = function (controlPointIndex) {
        this.selectedControlPoint = controlPointIndex;
    };
    return ControlPointsView;
}());
exports.ControlPointsView = ControlPointsView;


/***/ }),

/***/ "./src/views/ControlPolygonShaders.ts":
/*!********************************************!*\
  !*** ./src/views/ControlPolygonShaders.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var ControlPolygonShaders = /** @class */ (function () {
    function ControlPolygonShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'void main() {\n' +
            '     gl_FragColor = vec4(216.0/255.0, 216.0/255.0, 216.0/255.0, 0.05); \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    ControlPolygonShaders.prototype.renderFrame = function (numberOfElements) {
        this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
    };
    return ControlPolygonShaders;
}());
exports.ControlPolygonShaders = ControlPolygonShaders;
;


/***/ }),

/***/ "./src/views/ControlPolygonView.ts":
/*!*****************************************!*\
  !*** ./src/views/ControlPolygonView.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonView = void 0;
var ControlPolygonView = /** @class */ (function () {
    function ControlPolygonView(spline, controlPolygonShaders, closed) {
        if (closed === void 0) { closed = false; }
        this.spline = spline;
        this.controlPolygonShaders = controlPolygonShaders;
        this.closed = closed;
        this.z = 0;
        this.selectedControlPoint = null;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.visibleControlPoints();
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.controlPolygonShaders = controlPolygonShaders;
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.controlPolygonShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    ControlPolygonView.prototype.updateVerticesAndIndices = function () {
        var thickness = 0.003;
        //const thickness = 0.0075
        //const thickness = 0.006
        this.vertices = new Float32Array(this.controlPoints.length * 12);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length - 1; i += 1) {
            var normal = this.controlPoints[i + 1].substract(this.controlPoints[i]).normalize().rotate90degrees();
            this.vertices[12 * i] = this.controlPoints[i].x - thickness * normal.x;
            this.vertices[12 * i + 1] = this.controlPoints[i].y - thickness * normal.y;
            this.vertices[12 * i + 2] = this.z;
            this.vertices[12 * i + 3] = this.controlPoints[i + 1].x - thickness * normal.x;
            this.vertices[12 * i + 4] = this.controlPoints[i + 1].y - thickness * normal.y;
            this.vertices[12 * i + 5] = this.z;
            this.vertices[12 * i + 6] = this.controlPoints[i + 1].x + thickness * normal.x;
            this.vertices[12 * i + 7] = this.controlPoints[i + 1].y + thickness * normal.y;
            this.vertices[12 * i + 8] = this.z;
            this.vertices[12 * i + 9] = this.controlPoints[i].x + thickness * normal.x;
            this.vertices[12 * i + 10] = this.controlPoints[i].y + thickness * normal.y;
            this.vertices[12 * i + 11] = this.z;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    ControlPolygonView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.controlPolygonShaders.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    ControlPolygonView.prototype.renderFrame = function () {
        var gl = this.controlPolygonShaders.gl;
        var a_Position = gl.getAttribLocation(this.controlPolygonShaders.program, 'a_Position');
        gl.useProgram(this.controlPolygonShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        this.controlPolygonShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    ControlPolygonView.prototype.update = function (message) {
        this.controlPoints = message.visibleControlPoints();
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    ControlPolygonView.prototype.updateBuffers = function () {
        var gl = this.controlPolygonShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return ControlPolygonView;
}());
exports.ControlPolygonView = ControlPolygonView;


/***/ }),

/***/ "./src/views/CurvatureExtremaView.ts":
/*!*******************************************!*\
  !*** ./src/views/CurvatureExtremaView.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureExtremaView = void 0;
//import { PeriodicBSpline_R1_to_R2_DifferentialProperties } from "../mathematics/PeriodicBSpline_R1_to_R2_DifferentialProperties";
//import { PeriodicBSpline_R1_to_R2 } from "../mathematics/PeriodicBSpline_R1_to_R2";
var BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2 */ "./src/mathematics/BSpline_R1_to_R2.ts");
var BSpline_R1_to_R2_DifferentialProperties_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2_DifferentialProperties */ "./src/mathematics/BSpline_R1_to_R2_DifferentialProperties.ts");
var CurvatureExtremaView = /** @class */ (function () {
    function CurvatureExtremaView(spline, curvatureExtremaShaders, red, green, blue, alpha) {
        this.curvatureExtremaShaders = curvatureExtremaShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.visibleControlPoints();
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.update(spline);
    }
    CurvatureExtremaView.prototype.updateVerticesAndIndices = function () {
        var size = 0.03;
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var x = this.controlPoints[i].x;
            var y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    CurvatureExtremaView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    CurvatureExtremaView.prototype.renderFrame = function () {
        var gl = this.curvatureExtremaShaders.gl, a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT, a_ColorLocation = gl.getUniformLocation(this.curvatureExtremaShaders.program, "a_Color");
        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curvatureExtremaShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    CurvatureExtremaView.prototype.update = function (spline) {
        if (spline instanceof BSpline_R1_to_R2_1.BSpline_R1_to_R2) {
            var splineDP = new BSpline_R1_to_R2_DifferentialProperties_1.BSpline_R1_to_R2_DifferentialProperties(spline);
            this.controlPoints = splineDP.curvatureExtrema();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
    };
    CurvatureExtremaView.prototype.updateBuffers = function () {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return CurvatureExtremaView;
}());
exports.CurvatureExtremaView = CurvatureExtremaView;


/***/ }),

/***/ "./src/views/CurveShaders.ts":
/*!***********************************!*\
  !*** ./src/views/CurveShaders.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var CurveShaders = /** @class */ (function () {
    function CurveShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'void main() {\n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision mediump float; \n' +
            'uniform vec4 fColor; \n' +
            'void main() {\n' +
            '    gl_FragColor = fColor; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    CurveShaders.prototype.renderFrame = function (numberOfVertices) {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, numberOfVertices);
    };
    return CurveShaders;
}());
exports.CurveShaders = CurveShaders;
;


/***/ }),

/***/ "./src/views/CurveView.ts":
/*!********************************!*\
  !*** ./src/views/CurveView.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveView = void 0;
var CurveView = /** @class */ (function () {
    function CurveView(spline, curveShaders, red, green, blue, alpha) {
        this.spline = spline;
        this.curveShaders = curveShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.POINT_SEQUENCE_SIZE = 1000;
        //private readonly z = 0
        this.pointSequenceOnSpline = [];
        //private selectedControlPoint: number | null = null
        this.vertexBuffer = null;
        //private indexBuffer: WebGLBuffer | null = null
        this.vertices = new Float32Array(this.POINT_SEQUENCE_SIZE * 6);
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.curveShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    CurveView.prototype.updatePointSequenceOnSpline = function () {
        var start = this.spline.knots[this.spline.degree];
        var end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        this.pointSequenceOnSpline = [];
        for (var i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            var point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            this.pointSequenceOnSpline.push(point);
        }
    };
    CurveView.prototype.updateVertices = function () {
        var thickness = 0.005;
        //const thickness = 0.004
        //const thickness = 0.008
        var maxLength = thickness * 3;
        var tangent = ((this.pointSequenceOnSpline[1]).substract(this.pointSequenceOnSpline[0])).normalize(), normal = tangent.rotate90degrees(), miter, length, result = [];
        result.push(this.pointSequenceOnSpline[0].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[0].substract(normal.multiply(thickness)));
        for (var i = 1; i < this.pointSequenceOnSpline.length - 1; i += 1) {
            normal = (this.pointSequenceOnSpline[i].substract(this.pointSequenceOnSpline[i - 1])).normalize().rotate90degrees();
            tangent = (this.pointSequenceOnSpline[i + 1].substract(this.pointSequenceOnSpline[i - 1])).normalize();
            miter = tangent.rotate90degrees();
            length = thickness / (miter.dot(normal));
            if (length > maxLength) {
                length = maxLength;
            }
            result.push(this.pointSequenceOnSpline[i].add(miter.multiply(length)));
            result.push(this.pointSequenceOnSpline[i].substract(miter.multiply(length)));
        }
        tangent = this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 2]).normalize();
        normal = tangent.rotate90degrees();
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(normal.multiply(thickness)));
        for (var i = 0; i < result.length; i += 1) {
            this.vertices[3 * i] = result[i].x;
            this.vertices[3 * i + 1] = result[i].y;
            this.vertices[3 * i + 2] = 0.0;
        }
    };
    CurveView.prototype.update = function (spline) {
        this.spline = spline;
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        this.updateBuffers();
    };
    CurveView.prototype.updateBuffers = function () {
        var gl = this.curveShaders.gl;
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    };
    CurveView.prototype.renderFrame = function () {
        var gl = this.curveShaders.gl;
        var a_Position = gl.getAttribLocation(this.curveShaders.program, 'a_Position');
        var fColorLocation = gl.getUniformLocation(this.curveShaders.program, "fColor");
        gl.useProgram(this.curveShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(fColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curveShaders.renderFrame(this.vertices.length / 3);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    CurveView.prototype.initVertexBuffers = function (gl) {
        var a_Position = gl.getAttribLocation(this.curveShaders.program, 'a_Position');
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return 1;
    };
    return CurveView;
}());
exports.CurveView = CurveView;


/***/ }),

/***/ "./src/views/DifferentialEventShaders.ts":
/*!***********************************************!*\
  !*** ./src/views/DifferentialEventShaders.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DifferentialEventShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var DifferentialEventShaders = /** @class */ (function () {
    function DifferentialEventShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            'uniform vec4 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     if (dist > 0.5) discard; \n' +
            '     gl_FragColor = a_Color; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    DifferentialEventShaders.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return DifferentialEventShaders;
}());
exports.DifferentialEventShaders = DifferentialEventShaders;


/***/ }),

/***/ "./src/views/InflectionsView.ts":
/*!**************************************!*\
  !*** ./src/views/InflectionsView.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InflectionsView = void 0;
//import { PeriodicBSpline_R1_to_R2_DifferentialProperties } from "../mathematics/PeriodicBSpline_R1_to_R2_DifferentialProperties";
//import { PeriodicBSpline_R1_to_R2 } from "../mathematics/PeriodicBSpline_R1_to_R2";
var BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2 */ "./src/mathematics/BSpline_R1_to_R2.ts");
var BSpline_R1_to_R2_DifferentialProperties_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2_DifferentialProperties */ "./src/mathematics/BSpline_R1_to_R2_DifferentialProperties.ts");
var InflectionsView = /** @class */ (function () {
    function InflectionsView(spline, curvatureExtremaShaders, red, green, blue, alpha) {
        this.curvatureExtremaShaders = curvatureExtremaShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.visibleControlPoints();
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.update(spline);
    }
    InflectionsView.prototype.updateVerticesAndIndices = function () {
        var size = 0.025;
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var x = this.controlPoints[i].x;
            var y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    InflectionsView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    InflectionsView.prototype.renderFrame = function () {
        var gl = this.curvatureExtremaShaders.gl, a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT, a_ColorLocation = gl.getUniformLocation(this.curvatureExtremaShaders.program, "a_Color");
        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curvatureExtremaShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    InflectionsView.prototype.update = function (spline) {
        if (spline instanceof BSpline_R1_to_R2_1.BSpline_R1_to_R2) {
            var splineDP = new BSpline_R1_to_R2_DifferentialProperties_1.BSpline_R1_to_R2_DifferentialProperties(spline);
            this.controlPoints = splineDP.inflections();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
        /*
        if (spline instanceof PeriodicBSpline_R1_to_R2) {
            const splineDP = new PeriodicBSpline_R1_to_R2_DifferentialProperties(spline)
            this.controlPoints = splineDP.inflections()
            this.updateVerticesAndIndices()
            this.updateBuffers()
        }
        */
    };
    /*
    updatePoints(points: Vector_2d[]) {
        this.controlPoints = points;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    */
    InflectionsView.prototype.updateBuffers = function () {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return InflectionsView;
}());
exports.InflectionsView = InflectionsView;


/***/ }),

/***/ "./src/views/InsertKnotButtonShaders.ts":
/*!**********************************************!*\
  !*** ./src/views/InsertKnotButtonShaders.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertKnotButtonShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var InsertKnotButtonShaders = /** @class */ (function () {
    function InsertKnotButtonShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'attribute vec3 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    v_Color = a_Color; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            'varying vec2 v_Texture; \n' +
            'varying vec3 v_Color; \n' +
            'void main() {\n' +
            '     float dist1 = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     float dist2 = distance(v_Texture, vec2(0.9, 0.0)); \n' +
            '     float dist3 = distance(v_Texture, vec2(-0.9, 0.0)); \n' +
            '     if (dist1 < 0.25 || dist2 < 0.25 || dist3 < 0.25) { \n' +
            '     gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0); } \n ' +
            '     else if (v_Texture[0] > -0.9 && v_Texture[0] < 0.9 && v_Texture[1] < 0.1 && v_Texture[1] > -0.1) { \n' +
            '     gl_FragColor = vec4(0.25, 0.25, 0.25, 1.0); } \n ' +
            '     else if ( distance(v_Texture, vec2(1.2, 0.7)) > 0.3 && v_Texture[0] > 1.2 && v_Texture[1] > 0.7 ) { \n' +
            '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
            '     else if ( distance(v_Texture, vec2(1.2, -0.7)) > 0.3 && v_Texture[0] > 1.2 && v_Texture[1] < -0.7 ) { \n' +
            '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
            '     else if ( distance(v_Texture, vec2(-1.2, 0.7)) > 0.3 && v_Texture[0] < -1.2 && v_Texture[1] > 0.7 ) { \n' +
            '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
            '     else if ( distance(v_Texture, vec2(-1.2, -0.7)) > 0.3 && v_Texture[0] < -1.2 && v_Texture[1] < -0.7 ) { \n' +
            '     gl_FragColor = vec4(0.3, 0.3, 0.3, 0.0); } \n' +
            '     else { \n' +
            '     /*gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); } */ \n' +
            '     gl_FragColor = vec4(v_Color, 1.0); } \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    InsertKnotButtonShaders.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return InsertKnotButtonShaders;
}());
exports.InsertKnotButtonShaders = InsertKnotButtonShaders;
;


/***/ }),

/***/ "./src/views/TransitionCurvatureExtremaView.ts":
/*!*****************************************************!*\
  !*** ./src/views/TransitionCurvatureExtremaView.ts ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionCurvatureExtremaView = void 0;
//import { PeriodicBSpline_R1_to_R2_DifferentialProperties } from "../mathematics/PeriodicBSpline_R1_to_R2_DifferentialProperties";
//import { PeriodicBSpline_R1_to_R2 } from "../mathematics/PeriodicBSpline_R1_to_R2";
var BSpline_R1_to_R2_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2 */ "./src/mathematics/BSpline_R1_to_R2.ts");
var BSpline_R1_to_R2_DifferentialProperties_1 = __webpack_require__(/*! ../mathematics/BSpline_R1_to_R2_DifferentialProperties */ "./src/mathematics/BSpline_R1_to_R2_DifferentialProperties.ts");
var TransitionCurvatureExtremaView = /** @class */ (function () {
    function TransitionCurvatureExtremaView(spline, curvatureExtremaShaders, red, green, blue, alpha) {
        this.curvatureExtremaShaders = curvatureExtremaShaders;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
        this.z = 0;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.controlPoints = spline.visibleControlPoints();
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers(this.curvatureExtremaShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
        this.update(spline);
    }
    TransitionCurvatureExtremaView.prototype.updateVerticesAndIndices = function () {
        var size = 0.03;
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length; i += 1) {
            var x = this.controlPoints[i].x;
            var y = this.controlPoints[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;
            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;
            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;
            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    TransitionCurvatureExtremaView.prototype.initVertexBuffers = function (gl) {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    TransitionCurvatureExtremaView.prototype.renderFrame = function () {
        var gl = this.curvatureExtremaShaders.gl, a_Position = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Position'), a_Texture = gl.getAttribLocation(this.curvatureExtremaShaders.program, 'a_Texture'), 
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        FSIZE = this.vertices.BYTES_PER_ELEMENT, a_ColorLocation = gl.getUniformLocation(this.curvatureExtremaShaders.program, "a_Color");
        gl.useProgram(this.curvatureExtremaShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);
        this.curvatureExtremaShaders.renderFrame(this.indices.length);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    };
    TransitionCurvatureExtremaView.prototype.update = function (spline) {
        if (spline instanceof BSpline_R1_to_R2_1.BSpline_R1_to_R2) {
            var splineDP = new BSpline_R1_to_R2_DifferentialProperties_1.BSpline_R1_to_R2_DifferentialProperties(spline);
            this.controlPoints = splineDP.curvatureExtrema();
            this.updateVerticesAndIndices();
            this.updateBuffers();
        }
    };
    TransitionCurvatureExtremaView.prototype.updateBuffers = function () {
        var gl = this.curvatureExtremaShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return TransitionCurvatureExtremaView;
}());
exports.TransitionCurvatureExtremaView = TransitionCurvatureExtremaView;


/***/ }),

/***/ "./src/views/TransitionDifferentialEventShaders.ts":
/*!*********************************************************!*\
  !*** ./src/views/TransitionDifferentialEventShaders.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TransitionDifferentialEventShaders = void 0;
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var TransitionDifferentialEventShaders = /** @class */ (function () {
    function TransitionDifferentialEventShaders(gl) {
        this.gl = gl;
        // Vertex shader program
        this.VSHADER_SOURCE = 'attribute vec3 a_Position; \n' +
            'attribute vec2 a_Texture; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '    v_Texture = a_Texture; \n' +
            '    gl_Position = vec4(a_Position, 1.0); \n' +
            '}\n';
        // Fragment shader program
        this.FSHADER_SOURCE = 'precision highp float; \n' +
            'uniform vec4 a_Color; \n' +
            'varying vec2 v_Texture; \n' +
            'void main() {\n' +
            '     float dist = distance(v_Texture, vec2(0.0, 0.0)); \n' +
            '     if (dist > 0.4 && dist < 0.55 || dist > 0.75) discard; \n' +
            '     gl_FragColor = a_Color; \n' +
            '}\n';
        this.program = cuon_utils_1.createProgram(this.gl, this.VSHADER_SOURCE, this.FSHADER_SOURCE);
        if (!this.program) {
            console.log('Failed to create program');
        }
        this.gl.useProgram(this.program);
    }
    TransitionDifferentialEventShaders.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return TransitionDifferentialEventShaders;
}());
exports.TransitionDifferentialEventShaders = TransitionDifferentialEventShaders;


/***/ }),

/***/ "./src/webgl/cuon-utils.ts":
/*!*********************************!*\
  !*** ./src/webgl/cuon-utils.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Reference: cuon-utils.js
// cuon-utils.js (c) 2012 kanda and matsuda
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgram = void 0;
/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
    // Create shader object
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader);
    if (!vertexShader || !fragmentShader) {
        console.log("createProgram was unable to produce a vertex or fragment shader");
        return null;
    }
    // Create a program object
    var program = gl.createProgram();
    if (!program) {
        console.log("createProgram was unable to produce a program");
        return null;
    }
    // Attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // Link the program object
    gl.linkProgram(program);
    // Check the result of linking
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program;
}
exports.createProgram = createProgram;
/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (shader == null) {
        console.log('unable to create shader');
        return null;
    }
    // Set the shader program
    gl.shaderSource(shader, source);
    // Compile the shader
    gl.compileShader(shader);
    // Check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}


/***/ }),

/***/ "./src/webgl/webgl-utils.ts":
/*!**********************************!*\
  !*** ./src/webgl/webgl-utils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLUtils = void 0;
/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimationFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */
function WebGLUtils() {
    /**
     * Creates the HTLM for a failure message
     * @param {string} canvasContainerId id of container of th
     *        canvas.
     * @return {string} The html.
     */
    var makeFailHTML = function (msg) {
        return '' +
            '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
        return '' +
            '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
            '<td align="center">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<div style="">' + msg + '</div>' +
            '</div>' +
            '</td></tr></table>';
    };
    /**
     * Mesasge for getting a webgl browser
     * @type {string}
     */
    var GET_A_WEBGL_BROWSER = '' +
        'This page requires a browser that supports WebGL.<br/>' +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
    /**
     * Mesasge for need better hardware
     * @type {string}
     */
    var OTHER_PROBLEM = '' +
        "It doesn't appear your computer can support WebGL.<br/>" +
        '<a href="http://get.webgl.org">Click here for more information.</a>';
    /**
     * Creates a webgl context. If creation fails it will
     * change the contents of the container of the <canvas>
     * tag to an error message with the correct links for WebGL.
     * @param {Element} canvas. The canvas element to create a
     *     context from.
     * @param {WebGLContextCreationAttirbutes} opt_attribs Any
     *     creation attributes you want to pass in.
     * @param {function:(msg)} opt_onError An function to call
     *     if there is an error during creation.
     * @return {WebGLRenderingContext} The created context.
     */
    var setupWebGL = function (canvas, opt_attribs, opt_onError) {
        function handleCreationError(msg) {
            var container = document.getElementsByTagName("body")[0];
            //var container = canvas.parentNode;
            if (container) {
                var str = window.WebGLRenderingContext ?
                    OTHER_PROBLEM :
                    GET_A_WEBGL_BROWSER;
                if (msg) {
                    str += "<br/><br/>Status: " + msg;
                }
                container.innerHTML = makeFailHTML(str);
            }
        }
        ;
        opt_onError = opt_onError || handleCreationError;
        if (canvas.addEventListener) {
            canvas.addEventListener("webglcontextcreationerror", function (event) {
                opt_onError(event.statusMessage);
            }, false);
        }
        var context = create3DContext(canvas, opt_attribs);
        if (!context) {
            if (!window.WebGLRenderingContext) {
                opt_onError("");
            }
            else {
                opt_onError("");
            }
        }
        return context;
    };
    /**
     * Creates a webgl context.
     * @param {!Canvas} canvas The canvas tag to get context
     *     from. If one is not passed in one will be created.
     * @return {!WebGLContext} The created context.
     */
    var create3DContext = function (canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            }
            catch (e) { }
            if (context) {
                break;
            }
        }
        return context;
    };
    return {
        create3DContext: create3DContext,
        setupWebGL: setupWebGL
    };
}
exports.WebGLUtils = WebGLUtils;
/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}
/** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
 *
 * Cancels an animation frame request.
 * Checks for cross-browser support, falls back to clearTimeout.
 * @param {number}  Animation frame request. */
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
        window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
        window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
        window.clearTimeout);
}


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map