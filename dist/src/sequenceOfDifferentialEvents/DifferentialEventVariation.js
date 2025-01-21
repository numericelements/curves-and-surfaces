"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyDifferentialEventVariation = exports.DiffrentialEventVariation = void 0;
var Vector2d_1 = require("../mathVector/Vector2d");
var Piegl_Tiller_NURBS_Book_1 = require("../newBsplines/Piegl_Tiller_NURBS_Book");
var ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
var DiffrentialEventVariation = /** @class */ (function () {
    function DiffrentialEventVariation(curveAnalyserCurrentCurve, curveAnalyserOptimizedCurve) {
        this._curveAnalyser1 = curveAnalyserCurrentCurve;
        this._curveAnalyser2 = curveAnalyserOptimizedCurve;
        this._sequenceDiffEvents1 = this._curveAnalyser1.sequenceOfDifferentialEvents;
        this._sequenceDiffEvents2 = this._curveAnalyser2.sequenceOfDifferentialEvents;
        this._extremumValue = 0.0;
        this._extremumValueOpt = 0.0;
        this._extremumLocation = -1.0;
        this._extremumLocationOpt = -1.0;
        this._span = -1;
        this._rangeOfInfluence = 0;
        this._CPvariations = [];
        var seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
        seqComparator.locateNeiboringEvents();
        this._neighboringEvents = seqComparator.neighboringEvents;
    }
    Object.defineProperty(DiffrentialEventVariation.prototype, "neighboringEvents", {
        get: function () {
            return this._neighboringEvents.slice();
        },
        set: function (neighboringEvents) {
            this._neighboringEvents = neighboringEvents.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "curveAnalyser1", {
        get: function () {
            return this._curveAnalyser1;
        },
        set: function (curveAnalyser) {
            this._curveAnalyser1 = curveAnalyser;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "curveAnalyser2", {
        get: function () {
            return this._curveAnalyser2;
        },
        set: function (curveAnalyser) {
            this._curveAnalyser2 = curveAnalyser;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "extremumValue", {
        get: function () {
            return this._extremumValue;
        },
        set: function (extremumValue) {
            this._extremumValue = extremumValue;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "extremumValueOpt", {
        get: function () {
            return this._extremumValueOpt;
        },
        set: function (extremumValueOpt) {
            this._extremumValueOpt = extremumValueOpt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "extremumLocation", {
        get: function () {
            return this._extremumLocation;
        },
        set: function (extremumLocation) {
            this._extremumLocation = extremumLocation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "extremumLocationOpt", {
        get: function () {
            return this._extremumLocationOpt;
        },
        set: function (extremumLocationOpt) {
            this._extremumLocationOpt = extremumLocationOpt;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "span", {
        get: function () {
            return this._span;
        },
        set: function (span) {
            this._span = span;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "rangeOfInfluence", {
        get: function () {
            return this._rangeOfInfluence;
        },
        set: function (rangeOfInfluence) {
            this._rangeOfInfluence = rangeOfInfluence;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DiffrentialEventVariation.prototype, "CPvariations", {
        get: function () {
            return this._CPvariations.slice();
        },
        set: function (CPvariations) {
            this._CPvariations = CPvariations.slice();
        },
        enumerable: false,
        configurable: true
    });
    DiffrentialEventVariation.prototype.neighboringEventsAt = function (index) {
        return this._neighboringEvents[index];
    };
    DiffrentialEventVariation.prototype.variationDifferentialEvents = function () {
        var curvatureDerivativeNumeratorOpt = this._curveAnalyser2.curvatureDerivativeNumerator;
        var curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        var curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();
        var curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        var curvatureDerivativeExtremaLocations = curvatureDerivativeNumerator.derivative().zeros();
        var curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();
        if ((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            var curvatureExtremumInterval = [];
            // let variationsOptim1_2: number[] = []
            for (var exLocOpt = 0; exLocOpt < curvatureDerivativeExtremaLocationsOpt.length; exLocOpt += 1) {
                var currentNbExtremumLocations = curvatureExtremumInterval.length;
                var curvatureDerivExtremumOpt = curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                var extremumLocationFound = false;
                for (var zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc += 1) {
                    if (curvatureDerivativeExtremaLocationsOpt[exLocOpt] > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && curvatureDerivativeExtremaLocationsOpt[exLocOpt] < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        curvatureExtremumInterval.push(zeroLoc);
                        extremumLocationFound = true;
                        if (curvatureDerivativeExtremaLocations.length === curvatureDerivativeExtremaLocationsOpt.length) {
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[exLocOpt]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[exLocOpt];
                        }
                        else {
                            var minDist = Math.abs(curvatureDerivativeExtremaLocations[0] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                            var indexMin = 0;
                            for (var exLoc = 1; exLoc < curvatureDerivativeExtremaLocations.length; exLoc += 1) {
                                if (Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]) < minDist) {
                                    minDist = Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                                    indexMin = exLoc;
                                }
                            }
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[indexMin]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[indexMin];
                        }
                        var curvatureDerivExtremumOpt_1 = curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                        this._extremumValueOpt = curvatureDerivExtremumOpt_1;
                        this._extremumLocationOpt = curvatureDerivativeExtremaLocationsOpt[exLocOpt];
                    }
                }
                if (extremumLocationFound) {
                    if (this._extremumValue * this._extremumValueOpt > 0) {
                        console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + this._extremumValue + " functionBOptimExtremum" + this._extremumValueOpt);
                    }
                    if (currentNbExtremumLocations === curvatureExtremumInterval.length)
                        console.log("Problem to locate a curvature derivative extremum. ");
                    if (curvatureDerivExtremumOpt > 0.0) {
                        for (var j = 0; j < curvatureDerivativeNumeratorOpt.controlPoints.length; j += 1) {
                            // variationsOptim1_2.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - functionBOptim.controlPoints[j])
                            // variations1.push(functionBOptim.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j])
                            this._CPvariations.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j]);
                        }
                        console.log("variations1_2: " + this._CPvariations);
                    }
                    var span = Piegl_Tiller_NURBS_Book_1.findSpan(this._extremumLocation, curvatureDerivativeNumerator.knots, curvatureDerivativeNumerator.degree);
                    var spanOptim = Piegl_Tiller_NURBS_Book_1.findSpan(this._extremumLocationOpt, curvatureDerivativeNumeratorOpt.knots, curvatureDerivativeNumeratorOpt.degree);
                    var curveDegree = curvatureDerivativeNumerator.degree;
                    if (span === spanOptim) {
                        this._span = span;
                        this._rangeOfInfluence = curveDegree;
                    }
                    else {
                        if (span < spanOptim) {
                            this._span = span;
                            this._rangeOfInfluence = curveDegree + spanOptim - span;
                        }
                        else {
                            this._span = spanOptim;
                            this._rangeOfInfluence = curveDegree + span - spanOptim;
                        }
                    }
                }
            }
        }
        else {
        }
    };
    DiffrentialEventVariation.prototype.updateCPDisplacement = function (currentCurve, selectedControlPoint, x, y) {
        var newDisplacement = new Vector2d_1.Vector2d();
        var controlPointsInit = currentCurve.controlPoints;
        var ratio = Math.abs(this._extremumValue / (this._extremumValueOpt - this._extremumValue));
        newDisplacement.x = controlPointsInit[selectedControlPoint].x + (x - controlPointsInit[selectedControlPoint].x) * ratio;
        newDisplacement.y = controlPointsInit[selectedControlPoint].y + (y - controlPointsInit[selectedControlPoint].y) * ratio;
        return newDisplacement;
    };
    DiffrentialEventVariation.prototype.updateExtremumValueOptimized = function (curvatureDerivativeNumeratorOptimized) {
        var e_1, _a;
        var curvatureDerivativeNumeratorOpt = curvatureDerivativeNumeratorOptimized;
        var curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        var curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();
        var curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        var curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();
        if ((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0
            && curvatureDerivativeZerosLocationsOpt.length !== curvatureDerivativeZerosLocations.length) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            var updateExtremumValue = false;
            try {
                for (var curvatureDerivativeExtremaLocationsOpt_1 = __values(curvatureDerivativeExtremaLocationsOpt), curvatureDerivativeExtremaLocationsOpt_1_1 = curvatureDerivativeExtremaLocationsOpt_1.next(); !curvatureDerivativeExtremaLocationsOpt_1_1.done; curvatureDerivativeExtremaLocationsOpt_1_1 = curvatureDerivativeExtremaLocationsOpt_1.next()) {
                    var exLocOpt = curvatureDerivativeExtremaLocationsOpt_1_1.value;
                    var extremumLocationFound = false;
                    for (var zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc += 1) {
                        if (exLocOpt > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                            && exLocOpt < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                            extremumLocationFound = true;
                            var curvatureDerivExtremumOpt = curvatureDerivativeNumeratorOpt.evaluate(exLocOpt);
                            this._extremumValueOpt = curvatureDerivExtremumOpt;
                            updateExtremumValue = true;
                        }
                    }
                    if (extremumLocationFound && this._extremumValue * this._extremumValueOpt > 0) {
                        console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + this._extremumValue + " functionBOptimExtremum" + this._extremumValueOpt);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (curvatureDerivativeExtremaLocationsOpt_1_1 && !curvatureDerivativeExtremaLocationsOpt_1_1.done && (_a = curvatureDerivativeExtremaLocationsOpt_1.return)) _a.call(curvatureDerivativeExtremaLocationsOpt_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (!updateExtremumValue) {
                console.log("Extremum has not been correctly located and not updated.");
            }
        }
        else {
            var closestExt = curvatureDerivativeNumerator.getExtremumClosestToZero();
            if (closestExt.location !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._extremumLocation = closestExt.location;
                this._extremumValue = closestExt.value;
            }
            var closestExtOpt = curvatureDerivativeNumeratorOpt.getExtremumClosestToZero();
            if (closestExtOpt.location !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._extremumLocationOpt = closestExtOpt.location;
                this._extremumValueOpt = closestExtOpt.value;
            }
        }
    };
    DiffrentialEventVariation.prototype.clearVariation = function () {
        this._extremumValue = 0.0;
        this._extremumValueOpt = 0.0;
        this._extremumLocation = -1.0;
        this._extremumLocationOpt = -1.0;
        this._span = -1;
        this._rangeOfInfluence = 0;
        this._CPvariations = [];
    };
    return DiffrentialEventVariation;
}());
exports.DiffrentialEventVariation = DiffrentialEventVariation;
function deepCopyDifferentialEventVariation(diffEventVariation) {
    var diffEvent = new DiffrentialEventVariation(diffEventVariation.curveAnalyser1, diffEventVariation.curveAnalyser2);
    diffEvent.extremumValue = diffEventVariation.extremumValue;
    diffEvent.extremumValueOpt = diffEventVariation.extremumValueOpt;
    diffEvent.extremumLocation = diffEventVariation.extremumLocation;
    diffEvent.extremumLocationOpt = diffEventVariation.extremumLocationOpt;
    diffEvent.neighboringEvents = diffEventVariation.neighboringEvents;
    diffEvent.span = diffEventVariation.span;
    diffEvent.rangeOfInfluence = diffEventVariation.rangeOfInfluence;
    diffEvent.CPvariations = diffEventVariation.CPvariations;
    return diffEvent;
}
exports.deepCopyDifferentialEventVariation = deepCopyDifferentialEventVariation;
