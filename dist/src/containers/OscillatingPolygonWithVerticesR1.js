"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAdjacentOscillatingPolygons = exports.OscillatingPolygonWithVerticesR1 = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const AbstractPolygonWithVerticesR1_1 = require("./AbstractPolygonWithVerticesR1");
const AdjacentOscillatingPolygons_1 = require("./AdjacentOscillatingPolygons");
const VertexR1_1 = require("./VertexR1");
class OscillatingPolygonWithVerticesR1 extends AbstractPolygonWithVerticesR1_1.AbstractPolygonWithVerticesR1 {
    constructor(polygon) {
        super();
        this._vertices = [];
        const firstIndex = polygon.getFirstIndex();
        const upperBound = polygon.getFirstIndex() + polygon.length();
        for (let vertex = firstIndex; vertex < upperBound; vertex++) {
            this._vertices.push(new VertexR1_1.VertexR1(polygon.getVertexAt(vertex).index, polygon.getVertexAt(vertex).value));
        }
        this._closestVertexAtBeginning = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        this._closestVertexAtEnd = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        this.checkConsistency();
        this.extractControlPtsClosestToZeroAtExtremities();
    }
    get closestVertexAtBeginning() {
        return this._closestVertexAtBeginning;
    }
    get closestVertexAtEnd() {
        return this._closestVertexAtEnd;
    }
    checkConsistency() {
        let code = 0;
        if (this._vertices.length > 1) {
            let previousIndex = this._vertices[0].index;
            let previousValue = this._vertices[0].value;
            const vertices = this._vertices.slice(1);
            for (let vertex of vertices) {
                if ((vertex.index - previousIndex) !== 1) {
                    const error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Inconsistent sequence of indices values.");
                    error.logMessage();
                    code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                    return code;
                }
                else if (vertex.value * previousValue > 0) {
                    const error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Vertices values are not oscillating.");
                    error.logMessage();
                    code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
                }
                previousIndex = vertex.index;
                previousValue = vertex.value;
            }
        }
        else {
            const error = new ErrorLoging_1.WarningLog(this.constructor.name, "checkConsistency", "Cannot process an oscillating polygon with less than two vertices.");
            error.logMessage();
            code = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
        return code;
    }
    extractControlPtClosestToZeroAtExtremityEvenNbEdges(index) {
        if (index !== this.getFirstIndex() && index !== this.getVertexAt(this.getFirstIndex() + this.length() - 1).index) {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "extractControlPtClosestToZeroAtExtremityEvenNbEdges", "Current vertex index is not at an extremity of the polygon.");
            error.logMessage();
            return new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        }
        const vertex1 = this.getVertexAt(index);
        let vertex2;
        if (index === this.getFirstIndex()) {
            vertex2 = this.getVertexAt(index + 1);
        }
        else {
            vertex2 = this.getVertexAt(index - 1);
        }
        if (Math.pow(vertex1.value, 2) > Math.pow(vertex2.value, 2)) {
            return vertex2;
        }
        else {
            return vertex1;
        }
    }
    extractControlPtClosestToZeroAtExtremityOddNbEdges() {
        const firstIndex = this.getFirstIndex();
        const vertex1 = this.getVertexAt(firstIndex);
        const lastIndex = firstIndex + this.length() - 1;
        const vertex2 = this.getVertexAt(lastIndex);
        if (Math.pow(vertex1.value, 2) > Math.pow(vertex2.value, 2)) {
            this._closestVertexAtEnd = vertex2;
        }
        else {
            this._closestVertexAtBeginning = vertex1;
        }
    }
    extractControlPtsClosestToZeroAtExtremities() {
        const firstIndex = this.getFirstIndex();
        const lastIndex = firstIndex + this.length() - 1;
        if ((this.length() - 1) % 2 === 0) {
            this._closestVertexAtBeginning = this.extractControlPtClosestToZeroAtExtremityEvenNbEdges(firstIndex);
            this._closestVertexAtEnd = this.extractControlPtClosestToZeroAtExtremityEvenNbEdges(lastIndex);
        }
        else {
            this.extractControlPtClosestToZeroAtExtremityOddNbEdges();
        }
    }
}
exports.OscillatingPolygonWithVerticesR1 = OscillatingPolygonWithVerticesR1;
function extractAdjacentOscillatingPolygons(oscillatingPolygons) {
    let adjacentPolygons = [];
    for (let i = 0; i < oscillatingPolygons.length; i++) {
        let polygons = [];
        if ((i + 1) < oscillatingPolygons.length) {
            if (oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index) {
                polygons.push(oscillatingPolygons[i]);
                polygons.push(oscillatingPolygons[i + 1]);
                i += 1;
                if ((i + 1) < oscillatingPolygons.length) {
                    while (oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index) {
                        polygons.push(oscillatingPolygons[i + 1]);
                        i += 1;
                        if ((i + 1) === oscillatingPolygons.length) {
                            i += 1;
                            break;
                        }
                    }
                }
            }
            else {
                polygons.push(oscillatingPolygons[i]);
            }
        }
        else {
            polygons.push(oscillatingPolygons[i]);
        }
        adjacentPolygons.push(new AdjacentOscillatingPolygons_1.AdjacentOscillatingPolygons(polygons));
    }
    return adjacentPolygons;
}
exports.extractAdjacentOscillatingPolygons = extractAdjacentOscillatingPolygons;
