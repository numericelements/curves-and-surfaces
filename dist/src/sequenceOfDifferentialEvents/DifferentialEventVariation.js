"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyDifferentialEventVariation = exports.DiffrentialEventVariation = void 0;
const Vector2d_1 = require("../mathVector/Vector2d");
const Piegl_Tiller_NURBS_Book_1 = require("../newBsplines/Piegl_Tiller_NURBS_Book");
const ComparatorOfSequencesDiffEvents_1 = require("./ComparatorOfSequencesDiffEvents");
class DiffrentialEventVariation {
    constructor(curveAnalyserCurrentCurve, curveAnalyserOptimizedCurve) {
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
        const seqComparator = new ComparatorOfSequencesDiffEvents_1.ComparatorOfSequencesOfDiffEvents(this._sequenceDiffEvents1, this._sequenceDiffEvents2);
        seqComparator.locateNeiboringEvents();
        this._neighboringEvents = seqComparator.neighboringEvents;
    }
    get neighboringEvents() {
        return this._neighboringEvents.slice();
    }
    get curveAnalyser1() {
        return this._curveAnalyser1;
    }
    get curveAnalyser2() {
        return this._curveAnalyser2;
    }
    get extremumValue() {
        return this._extremumValue;
    }
    get extremumValueOpt() {
        return this._extremumValueOpt;
    }
    get extremumLocation() {
        return this._extremumLocation;
    }
    get extremumLocationOpt() {
        return this._extremumLocationOpt;
    }
    get span() {
        return this._span;
    }
    get rangeOfInfluence() {
        return this._rangeOfInfluence;
    }
    get CPvariations() {
        return this._CPvariations.slice();
    }
    set neighboringEvents(neighboringEvents) {
        this._neighboringEvents = neighboringEvents.slice();
    }
    set curveAnalyser1(curveAnalyser) {
        this._curveAnalyser1 = curveAnalyser;
    }
    set curveAnalyser2(curveAnalyser) {
        this._curveAnalyser2 = curveAnalyser;
    }
    set extremumValue(extremumValue) {
        this._extremumValue = extremumValue;
    }
    set extremumValueOpt(extremumValueOpt) {
        this._extremumValueOpt = extremumValueOpt;
    }
    set extremumLocation(extremumLocation) {
        this._extremumLocation = extremumLocation;
    }
    set extremumLocationOpt(extremumLocationOpt) {
        this._extremumLocationOpt = extremumLocationOpt;
    }
    set span(span) {
        this._span = span;
    }
    set rangeOfInfluence(rangeOfInfluence) {
        this._rangeOfInfluence = rangeOfInfluence;
    }
    set CPvariations(CPvariations) {
        this._CPvariations = CPvariations.slice();
    }
    neighboringEventsAt(index) {
        return this._neighboringEvents[index];
    }
    variationDifferentialEvents() {
        const curvatureDerivativeNumeratorOpt = this._curveAnalyser2.curvatureDerivativeNumerator;
        const curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        const curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();
        const curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        const curvatureDerivativeExtremaLocations = curvatureDerivativeNumerator.derivative().zeros();
        const curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();
        if ((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            let curvatureExtremumInterval = [];
            // let variationsOptim1_2: number[] = []
            for (let exLocOpt = 0; exLocOpt < curvatureDerivativeExtremaLocationsOpt.length; exLocOpt += 1) {
                const currentNbExtremumLocations = curvatureExtremumInterval.length;
                const curvatureDerivExtremumOpt = curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                let extremumLocationFound = false;
                for (let zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc += 1) {
                    if (curvatureDerivativeExtremaLocationsOpt[exLocOpt] > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && curvatureDerivativeExtremaLocationsOpt[exLocOpt] < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        curvatureExtremumInterval.push(zeroLoc);
                        extremumLocationFound = true;
                        if (curvatureDerivativeExtremaLocations.length === curvatureDerivativeExtremaLocationsOpt.length) {
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[exLocOpt]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[exLocOpt];
                        }
                        else {
                            let minDist = Math.abs(curvatureDerivativeExtremaLocations[0] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                            let indexMin = 0;
                            for (let exLoc = 1; exLoc < curvatureDerivativeExtremaLocations.length; exLoc += 1) {
                                if (Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]) < minDist) {
                                    minDist = Math.abs(curvatureDerivativeExtremaLocations[exLoc] - curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                                    indexMin = exLoc;
                                }
                            }
                            this._extremumValue = curvatureDerivativeNumerator.evaluate(curvatureDerivativeExtremaLocations[indexMin]);
                            this._extremumLocation = curvatureDerivativeExtremaLocations[indexMin];
                        }
                        const curvatureDerivExtremumOpt = curvatureDerivativeNumeratorOpt.evaluate(curvatureDerivativeExtremaLocationsOpt[exLocOpt]);
                        this._extremumValueOpt = curvatureDerivExtremumOpt;
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
                        for (let j = 0; j < curvatureDerivativeNumeratorOpt.controlPoints.length; j += 1) {
                            // variationsOptim1_2.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - functionBOptim.controlPoints[j])
                            // variations1.push(functionBOptim.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j])
                            this._CPvariations.push(curvatureDerivativeNumeratorOpt.controlPoints[j] - curvatureDerivativeNumerator.controlPoints[j]);
                        }
                        console.log("variations1_2: " + this._CPvariations);
                    }
                    const span = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(this._extremumLocation, curvatureDerivativeNumerator.knots, curvatureDerivativeNumerator.degree);
                    const spanOptim = (0, Piegl_Tiller_NURBS_Book_1.findSpan)(this._extremumLocationOpt, curvatureDerivativeNumeratorOpt.knots, curvatureDerivativeNumeratorOpt.degree);
                    const curveDegree = curvatureDerivativeNumerator.degree;
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
    }
    updateCPDisplacement(currentCurve, selectedControlPoint, x, y) {
        let newDisplacement = new Vector2d_1.Vector2d();
        const controlPointsInit = currentCurve.controlPoints;
        let ratio = Math.abs(this._extremumValue / (this._extremumValueOpt - this._extremumValue));
        newDisplacement.x = controlPointsInit[selectedControlPoint].x + (x - controlPointsInit[selectedControlPoint].x) * ratio;
        newDisplacement.y = controlPointsInit[selectedControlPoint].y + (y - controlPointsInit[selectedControlPoint].y) * ratio;
        return newDisplacement;
    }
    updateExtremumValueOptimized(curvatureDerivativeNumeratorOptimized) {
        const curvatureDerivativeNumeratorOpt = curvatureDerivativeNumeratorOptimized;
        const curvatureDerivativeExtremaLocationsOpt = curvatureDerivativeNumeratorOpt.derivative().zeros();
        const curvatureDerivativeZerosLocationsOpt = curvatureDerivativeNumeratorOpt.zeros();
        const curvatureDerivativeNumerator = this._curveAnalyser1.curvatureDerivativeNumerator;
        const curvatureDerivativeZerosLocations = curvatureDerivativeNumerator.zeros();
        if ((curvatureDerivativeZerosLocationsOpt.length - curvatureDerivativeZerosLocations.length) % 2 === 0
            && curvatureDerivativeZerosLocationsOpt.length !== curvatureDerivativeZerosLocations.length) {
            /* JCL 06/03/2021 Configuration where one or more couples of extrema appeared */
            let updateExtremumValue = false;
            for (const exLocOpt of curvatureDerivativeExtremaLocationsOpt) {
                let extremumLocationFound = false;
                for (let zeroLoc = 0; zeroLoc < curvatureDerivativeZerosLocationsOpt.length - 1; zeroLoc += 1) {
                    if (exLocOpt > curvatureDerivativeZerosLocationsOpt[zeroLoc]
                        && exLocOpt < curvatureDerivativeZerosLocationsOpt[zeroLoc + 1]) {
                        extremumLocationFound = true;
                        const curvatureDerivExtremumOpt = curvatureDerivativeNumeratorOpt.evaluate(exLocOpt);
                        this._extremumValueOpt = curvatureDerivExtremumOpt;
                        updateExtremumValue = true;
                    }
                }
                if (extremumLocationFound && this._extremumValue * this._extremumValueOpt > 0) {
                    console.log("Inconsistency of function B(u) extrema values functionBExtremum: " + this._extremumValue + " functionBOptimExtremum" + this._extremumValueOpt);
                }
            }
            if (!updateExtremumValue) {
                console.log("Extremum has not been correctly located and not updated.");
            }
        }
        else {
            let closestExt = curvatureDerivativeNumerator.getExtremumClosestToZero();
            if (closestExt.location !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._extremumLocation = closestExt.location;
                this._extremumValue = closestExt.value;
            }
            let closestExtOpt = curvatureDerivativeNumeratorOpt.getExtremumClosestToZero();
            if (closestExtOpt.location !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._extremumLocationOpt = closestExtOpt.location;
                this._extremumValueOpt = closestExtOpt.value;
            }
        }
    }
    clearVariation() {
        this._extremumValue = 0.0;
        this._extremumValueOpt = 0.0;
        this._extremumLocation = -1.0;
        this._extremumLocationOpt = -1.0;
        this._span = -1;
        this._rangeOfInfluence = 0;
        this._CPvariations = [];
    }
}
exports.DiffrentialEventVariation = DiffrentialEventVariation;
function deepCopyDifferentialEventVariation(diffEventVariation) {
    const diffEvent = new DiffrentialEventVariation(diffEventVariation.curveAnalyser1, diffEventVariation.curveAnalyser2);
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
