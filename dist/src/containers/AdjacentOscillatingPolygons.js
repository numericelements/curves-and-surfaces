"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdjacentOscillatingPolygons = void 0;
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const VertexR1_1 = require("./VertexR1");
class AdjacentOscillatingPolygons {
    constructor(oscillatingPolygons) {
        this._oscillatingPolygons = oscillatingPolygons;
        this._closestVertex = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        this._indexOscillatingPolygon = ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        this.checkConsistency();
        this.getClosestVertexToZero();
    }
    get oscillatingPolygons() {
        return this._oscillatingPolygons;
    }
    get closestVertex() {
        return this._closestVertex;
    }
    get indexOscillatingPolygon() {
        return this._indexOscillatingPolygon;
    }
    checkConsistency() {
        for (let i = 0; i < this._oscillatingPolygons.length - 1; i++) {
            const firstIndex1 = this._oscillatingPolygons[i].getFirstIndex();
            const lastVertex1 = this._oscillatingPolygons[i].getVertexAt(firstIndex1 + this._oscillatingPolygons[i].length() - 1);
            const firstIndex2 = this._oscillatingPolygons[i + 1].getFirstIndex();
            const firstVertex2 = this._oscillatingPolygons[i + 1].getVertexAt(firstIndex2);
            if (lastVertex1.checkIndex() !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && firstVertex2.checkIndex() !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                if ((lastVertex1.index + 1) !== firstVertex2.index) {
                    const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistency", "Indices of contiguous oscillating polygons are not in strict increasing order.");
                    error.logMessage();
                }
                else {
                    if (lastVertex1.value * firstVertex2.value <= 0.0) {
                        const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistency", "Extreme vertices ordinates are not of same sign.");
                        error.logMessage();
                    }
                }
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "checkConsistency", "Inconsistent indices of extreme vertices of oscillating polygons.");
                error.logMessage();
            }
        }
    }
    getClosestVertexToZeroAtConnection(index) {
        let closestVertex = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        const firstIndex = this._oscillatingPolygons[index].getFirstIndex();
        const lastIndex = firstIndex + this._oscillatingPolygons[index].length() - 1;
        if (this._oscillatingPolygons[index].closestVertexAtEnd.index === lastIndex) {
            closestVertex = this._oscillatingPolygons[index].closestVertexAtEnd;
            if (this._oscillatingPolygons[index + 1].closestVertexAtBeginning.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE &&
                this._oscillatingPolygons[index + 1].closestVertexAtBeginning.index === this._oscillatingPolygons[index + 1].getFirstIndex()) {
                if (Math.pow(closestVertex.value, 2) > Math.pow(this._oscillatingPolygons[index + 1].closestVertexAtBeginning.value, 2)) {
                    closestVertex = this._oscillatingPolygons[index + 1].closestVertexAtBeginning;
                }
            }
            else {
                closestVertex = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
            }
        }
        else if (this._oscillatingPolygons[index].closestVertexAtEnd.index === ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            if (this._oscillatingPolygons[index + 1].closestVertexAtBeginning.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                closestVertex = this._oscillatingPolygons[index + 1].closestVertexAtBeginning;
            }
        }
        return closestVertex;
    }
    getClosestVertexToZero() {
        if (this._oscillatingPolygons.length === 1) {
            return;
        }
        this.findFirstVertex();
        let closestVertex = Math.pow(this._closestVertex.value, 2);
        for (let i = 1; i < this._oscillatingPolygons.length; i++) {
            if (this._oscillatingPolygons[i].closestVertexAtEnd.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE && i < (this._oscillatingPolygons.length - 1)) {
                if (Math.pow(this._oscillatingPolygons[i].closestVertexAtEnd.value, 2) < closestVertex) {
                    closestVertex = Math.pow(this._oscillatingPolygons[i].closestVertexAtEnd.value, 2);
                    this._closestVertex = this._oscillatingPolygons[i].closestVertexAtEnd;
                    this._indexOscillatingPolygon = i;
                }
            }
            if (this._oscillatingPolygons[i].closestVertexAtBeginning.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                if (Math.pow(this._oscillatingPolygons[i].closestVertexAtBeginning.value, 2) < closestVertex) {
                    closestVertex = Math.pow(this._oscillatingPolygons[i].closestVertexAtBeginning.value, 2);
                    this._closestVertex = this._oscillatingPolygons[i].closestVertexAtBeginning;
                    this._indexOscillatingPolygon = i;
                }
            }
        }
    }
    findFirstVertex() {
        this._closestVertex = this._oscillatingPolygons[0].closestVertexAtEnd;
        this._indexOscillatingPolygon = 0;
        if (this._closestVertex.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
            return;
        }
        else {
            this._indexOscillatingPolygon = 1;
            if (this._oscillatingPolygons[1].closestVertexAtBeginning.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._closestVertex = this._oscillatingPolygons[1].closestVertexAtBeginning;
            }
            else if (this._oscillatingPolygons[1].closestVertexAtEnd.index !== ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE) {
                this._closestVertex = this._oscillatingPolygons[1].closestVertexAtEnd;
            }
            else {
                const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "findFirstVertex", "Inconsistent content of closestVertexAtBeginning and closestVertexAtEnd for oscillating polygon 1.");
                error.logMessage();
            }
        }
    }
}
exports.AdjacentOscillatingPolygons = AdjacentOscillatingPolygons;
