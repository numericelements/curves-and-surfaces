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
var CurveModel_1 = __webpack_require__(/*! ../models/CurveModel */ "./src/models/CurveModel.ts");
var ControlPointsView_1 = __webpack_require__(/*! ../views/ControlPointsView */ "./src/views/ControlPointsView.ts");
var ControlPointsShaders_1 = __webpack_require__(/*! ../views/ControlPointsShaders */ "./src/views/ControlPointsShaders.ts");
var ControlPolygonShaders_1 = __webpack_require__(/*! ../views/ControlPolygonShaders */ "./src/views/ControlPolygonShaders.ts");
var ControlPolygonView_1 = __webpack_require__(/*! ../views/ControlPolygonView */ "./src/views/ControlPolygonView.ts");
var CurveShaders_1 = __webpack_require__(/*! ../views/CurveShaders */ "./src/views/CurveShaders.ts");
var CurveView_1 = __webpack_require__(/*! ../views/CurveView */ "./src/views/CurveView.ts");
var InsertKnotButtonShaders_1 = __webpack_require__(/*! ../views/InsertKnotButtonShaders */ "./src/views/InsertKnotButtonShaders.ts");
var ClickButtonView_1 = __webpack_require__(/*! ../views/ClickButtonView */ "./src/views/ClickButtonView.ts");
var CurvatureExtremaShaders_1 = __webpack_require__(/*! ../views/CurvatureExtremaShaders */ "./src/views/CurvatureExtremaShaders.ts");
var CurvatureExtremaView_1 = __webpack_require__(/*! ../views/CurvatureExtremaView */ "./src/views/CurvatureExtremaView.ts");
var InflectionsView_1 = __webpack_require__(/*! ../views/InflectionsView */ "./src/views/InflectionsView.ts");
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
        this.curvatureExtremaShaders = new CurvatureExtremaShaders_1.CurvatureExtremaShaders(this.gl);
        this.curvatureExtremaView = new CurvatureExtremaView_1.CurvatureExtremaView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 91 / 255, 95 / 255, 1);
        this.inflectionsView = new InflectionsView_1.InflectionsView(this.curveModel.spline, this.curvatureExtremaShaders, 216 / 255, 120 / 255, 120 / 255, 1);
        this.curveModel.registerObserver(this.controlPointsView);
        this.curveModel.registerObserver(this.controlPolygonView);
        this.curveModel.registerObserver(this.curveView);
        this.curveModel.registerObserver(this.curvatureExtremaView);
        this.curveModel.registerObserver(this.inflectionsView);
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
        this.inflectionsView.renderFrame();
        this.controlPolygonView.renderFrame();
        this.controlPointsView.renderFrame();
        this.insertKnotButtonView.renderFrame();
    };
    CurveSceneController.prototype.toggleOptimizer = function () {
    };
    CurveSceneController.prototype.toggleControlOfCurvatureExtrema = function () {
    };
    CurveSceneController.prototype.toggleControlOfInflections = function () {
    };
    CurveSceneController.prototype.toggleSliding = function () {
    };
    CurveSceneController.prototype.leftMouseDown_event = function (ndcX, ndcY, deltaSquared) {
        if (deltaSquared === void 0) { deltaSquared = 0.01; }
        if (this.insertKnotButtonView.selected(ndcX, ndcY) && this.selectedControlPoint !== -1) {
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
                this.curveModel.notifyObservers();
            }
        }
        this.selectedControlPoint = this.controlPointsView.controlPointSelection(ndcX, ndcY, deltaSquared);
        this.controlPointsView.setSelected(this.selectedControlPoint);
        if (this.selectedControlPoint !== -1) {
            this.dragging = true;
        }
    };
    CurveSceneController.prototype.leftMouseDragged_event = function (ndcX, ndcY) {
        var x = ndcX, y = ndcY, selectedControlPoint = this.controlPointsView.getSelectedControlPoint();
        if (selectedControlPoint !== -1 && selectedControlPoint != null && this.dragging === true) {
            this.curveModel.setControlPoint(selectedControlPoint, x, y);
            this.curveModel.notifyObservers();
        }
    };
    CurveSceneController.prototype.leftMouseUp_event = function () {
        this.dragging = false;
    };
    CurveSceneController.prototype.optimize = function (selectedControlPoint, ndcX, ndcY) {
    };
    return CurveSceneController;
}());
exports.CurveSceneController = CurveSceneController;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R1.prototype, "knots", {
        get: function () {
            return this._knots;
        },
        set: function (knots) {
            this._knots = knots;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R1.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: true,
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
        enumerable: true,
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
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BSpline_R1_to_R2.prototype, "degree", {
        get: function () {
            return this._degree;
        },
        enumerable: true,
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

/***/ "./src/mathematics/Piegl_Tiller_NURBS_Book.ts":
/*!****************************************************!*\
  !*** ./src/mathematics/Piegl_Tiller_NURBS_Book.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
        var result = -1;
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

/***/ "./src/views/CurvatureExtremaShaders.ts":
/*!**********************************************!*\
  !*** ./src/views/CurvatureExtremaShaders.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var cuon_utils_1 = __webpack_require__(/*! ../webgl/cuon-utils */ "./src/webgl/cuon-utils.ts");
var CurvatureExtremaShaders = /** @class */ (function () {
    function CurvatureExtremaShaders(gl) {
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
    CurvatureExtremaShaders.prototype.renderFrame = function (numberOfElements) {
        if (this.program) {
            this.gl.drawElements(this.gl.TRIANGLES, numberOfElements, this.gl.UNSIGNED_BYTE, 0);
        }
    };
    return CurvatureExtremaShaders;
}());
exports.CurvatureExtremaShaders = CurvatureExtremaShaders;


/***/ }),

/***/ "./src/views/CurvatureExtremaView.ts":
/*!*******************************************!*\
  !*** ./src/views/CurvatureExtremaView.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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
        /*
        if (spline instanceof PeriodicBSpline_R1_to_R2) {
            const splineDP = new PeriodicBSpline_R1_to_R2_DifferentialProperties(spline)
            this.controlPoints = splineDP.curvatureExtrema()
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

/***/ "./src/views/InflectionsView.ts":
/*!**************************************!*\
  !*** ./src/views/InflectionsView.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
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