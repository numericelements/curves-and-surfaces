"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPolygonWithVerticesR1 = void 0;
const ComparatorOfSequencesDiffEvents_1 = require("../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents");
const VertexR1_1 = require("./VertexR1");
class AbstractPolygonWithVerticesR1 {
    get vertices() {
        return this._vertices.slice();
    }
    length() {
        return this._vertices.length;
    }
    getFirstIndex() {
        if (this._vertices.length > 0) {
            return this._vertices[0].index;
        }
        else {
            return ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE;
        }
    }
    getVertexAt(index) {
        let result = new VertexR1_1.VertexR1(ComparatorOfSequencesDiffEvents_1.RETURN_ERROR_CODE, 0.0);
        for (let vertex of this._vertices) {
            if (vertex.index === index)
                result = new VertexR1_1.VertexR1(vertex.index, vertex.value);
        }
        return result;
    }
    getValues() {
        let result = [];
        for (let vertex of this._vertices) {
            result.push(vertex.value);
        }
        return result;
    }
    extend(vertex) {
        this._vertices.push(vertex);
        this.checkConsistency();
    }
    extendWithNewValue(value) {
        const newIndex = this.getFirstIndex() + this._vertices.length;
        const newVertex = new VertexR1_1.VertexR1(newIndex, value);
        this._vertices.push(newVertex);
        this.checkConsistency();
    }
}
exports.AbstractPolygonWithVerticesR1 = AbstractPolygonWithVerticesR1;
