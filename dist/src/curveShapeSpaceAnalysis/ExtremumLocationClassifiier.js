"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtremumLocationClassifier = exports.INITIAL_INDEX = void 0;
const MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
exports.INITIAL_INDEX = -1;
;
class ExtremumLocationClassifier {
    constructor(controlPoints) {
        this._localExtremum = [];
        this.controlPoints = [];
        this.controlPoints = controlPoints;
        this.globalExtremum = { index: exports.INITIAL_INDEX, value: 0.0 };
    }
    getLocalMinima() {
        for (let i = 0; i < this.controlPoints.length - 2; i += 1) {
            if ((0, MathVectorBasicOperations_1.sign)(this.controlPoints[i]) === 1 && (0, MathVectorBasicOperations_1.sign)(this.controlPoints[i + 1]) === 1 && (0, MathVectorBasicOperations_1.sign)(this.controlPoints[i + 2]) === 1) {
                if (this.controlPoints[i] > this.controlPoints[i + 1] && this.controlPoints[i + 1] < this.controlPoints[i + 2]) {
                    this._localExtremum.push({ index: (i + 1), value: this.controlPoints[i + 1] });
                }
            }
        }
    }
    getLocalMaxima() {
        for (let i = 0; i < this.controlPoints.length - 2; i += 1) {
            if ((0, MathVectorBasicOperations_1.sign)(this.controlPoints[i]) === -1 && (0, MathVectorBasicOperations_1.sign)(this.controlPoints[i + 1]) === -1 && (0, MathVectorBasicOperations_1.sign)(this.controlPoints[i + 2]) === -1) {
                if (this.controlPoints[i] < this.controlPoints[i + 1] && this.controlPoints[i + 1] > this.controlPoints[i + 2]) {
                    this._localExtremum.push({ index: (i + 1), value: this.controlPoints[i + 1] });
                }
            }
        }
    }
    getGlobalMinimum() {
        this.getLocalMinima();
        this.sortLocalExtrema();
        if (this.globalExtremum.index !== exports.INITIAL_INDEX) {
            return true;
        }
        else {
            return false;
        }
    }
    getGlobalMaximum() {
        this.getLocalMaxima();
        this.sortLocalExtrema();
        if (this.globalExtremum.index !== exports.INITIAL_INDEX) {
            return true;
        }
        else {
            return false;
        }
    }
    sortLocalExtrema() {
        if (this._localExtremum.length > 0) {
            this._localExtremum.sort(function (a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                if (a.value < b.value) {
                    return -1;
                }
                return 0;
            });
            this.globalExtremum = { index: this._localExtremum[0].index, value: this._localExtremum[0].value };
        }
    }
}
exports.ExtremumLocationClassifier = ExtremumLocationClassifier;
