"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractOscillatingPolygons = exports.PolygonWithVerticesR1 = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const MathVectorBasicOperations_1 = require("../linearAlgebra/MathVectorBasicOperations");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const VertexR1_1 = require("./VertexR1");
const OscillatingPolygonWithVerticesR1_1 = require("./OscillatingPolygonWithVerticesR1");
const AbstractPolygonWithVerticesR1_1 = require("./AbstractPolygonWithVerticesR1");
class PolygonWithVerticesR1 extends AbstractPolygonWithVerticesR1_1.AbstractPolygonWithVerticesR1 {
    constructor(points, startIndex) {
        super();
        this._vertices = [];
        this._localPositiveMinima = [];
        this._localNegativeMaxima = [];
        let index;
        if (startIndex !== undefined) {
            index = startIndex;
            if (startIndex < 0) {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "constructor", "Cannot create a polygon with vertices with a start index negative");
                error.logMessage();
            }
        }
        else {
            index = 0;
        }
        for (let point of points) {
            this._vertices.push(new VertexR1_1.VertexR1(index, point));
            index++;
        }
    }
    get localPositiveMinima() {
        return this._localPositiveMinima.slice();
    }
    get localNegativeMaxima() {
        return this._localNegativeMaxima.slice();
    }
    checkConsistency() {
        let code = 0;
        if (this._vertices.length > 1) {
            let previousIndex = this._vertices[0].index;
            const vertices = this._vertices.slice(1);
            for (let vertex of vertices) {
                if ((vertex.index - previousIndex) !== 1) {
                    const error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Inconsistent sequence of indices values.");
                    error.logMessage();
                    code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                    return code;
                }
                previousIndex = vertex.index;
            }
        }
        return code;
    }
    clear() {
        this._vertices = [];
        this._localPositiveMinima = [];
        this._localNegativeMaxima = [];
    }
    deepCopy() {
        const firstIndex = this.getFirstIndex();
        let polygon;
        if (firstIndex !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            polygon = new PolygonWithVerticesR1(this.getValues(), this.getFirstIndex());
            polygon._localNegativeMaxima = this._localNegativeMaxima.slice();
            polygon._localPositiveMinima = this._localPositiveMinima.slice();
            this.checkConsistency();
        }
        else {
            polygon = new PolygonWithVerticesR1([]);
            polygon._vertices.push(new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0));
        }
        return polygon;
    }
    sortLocalExtrema(localExtrema) {
        localExtrema.sort(function (a, b) {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
        });
        const sortedExtrema = localExtrema.slice();
        return sortedExtrema;
    }
    extractLocalPositiveMinima() {
        this._localPositiveMinima = [];
        for (let i = 0; i < this._vertices.length - 2; i += 1) {
            if ((0, MathVectorBasicOperations_1.sign)(this._vertices[i].value) === 1 && (0, MathVectorBasicOperations_1.sign)(this._vertices[i + 1].value) === 1 && (0, MathVectorBasicOperations_1.sign)(this._vertices[i + 2].value) === 1) {
                if (this._vertices[i].value > this._vertices[i + 1].value && this._vertices[i + 1].value < this._vertices[i + 2].value) {
                    this._localPositiveMinima.push(new VertexR1_1.VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    }
    extractLocalNegativeMaxima() {
        this._localNegativeMaxima = [];
        for (let i = 0; i < this._vertices.length - 2; i += 1) {
            if ((0, MathVectorBasicOperations_1.sign)(this._vertices[i].value) === -1 && (0, MathVectorBasicOperations_1.sign)(this._vertices[i + 1].value) === -1 && (0, MathVectorBasicOperations_1.sign)(this._vertices[i + 2].value) === -1) {
                if (this._vertices[i].value < this._vertices[i + 1].value && this._vertices[i + 1].value > this._vertices[i + 2].value) {
                    this._localNegativeMaxima.push(new VertexR1_1.VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    }
    extractClosestLocalExtremmumToAxis() {
        let localExtremum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        let smallestPositiveMinimum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        let largestNegativeMaximum = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        this.extractLocalPositiveMinima();
        if (this._localPositiveMinima.length > 0) {
            smallestPositiveMinimum = this.sortLocalExtrema(this._localPositiveMinima)[0];
        }
        this.extractLocalNegativeMaxima();
        if (this._localNegativeMaxima.length > 0) {
            largestNegativeMaximum = this.sortLocalExtrema(this._localNegativeMaxima)[this._localNegativeMaxima.length - 1];
        }
        if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && Math.abs(smallestPositiveMinimum.value) > Math.abs(largestNegativeMaximum.value)) {
            return largestNegativeMaximum;
        }
        else if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        }
        else if (smallestPositiveMinimum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        }
        else if (largestNegativeMaximum.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return largestNegativeMaximum;
        }
        else
            return localExtremum;
    }
    extractOscillatingPolygons() {
        let result = [];
        if (this._vertices.length > 1) {
            let i = 1;
            while (i < this._vertices.length) {
                if (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                    const firstEdge = [this._vertices[i - 1].value, this._vertices[i].value];
                    let oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                    i += 1;
                    if (i < (this._vertices.length - 1)) {
                        while (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                            oscillatingPolygon.extend(this._vertices[i]);
                            i += 1;
                            if (i === this._vertices.length)
                                break;
                        }
                    }
                    result.push(new OscillatingPolygonWithVerticesR1_1.OscillatingPolygonWithVerticesR1(oscillatingPolygon));
                }
                i += 1;
            }
        }
        return result;
    }
}
exports.PolygonWithVerticesR1 = PolygonWithVerticesR1;
function extractOscillatingPolygons(controlPoints) {
    let result = [];
    if (controlPoints.length > 1) {
        let i = 1;
        while (i < controlPoints.length) {
            if (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                const firstEdge = [controlPoints[i - 1], controlPoints[i]];
                const oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                i += 1;
                if (i < (controlPoints.length - 1)) {
                    while (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                        oscillatingPolygon.extendWithNewValue(controlPoints[i]);
                        i += 1;
                        if (i === controlPoints.length)
                            break;
                    }
                }
                result.push(new OscillatingPolygonWithVerticesR1_1.OscillatingPolygonWithVerticesR1(oscillatingPolygon));
            }
            i += 1;
        }
    }
    return result;
}
exports.extractOscillatingPolygons = extractOscillatingPolygons;
