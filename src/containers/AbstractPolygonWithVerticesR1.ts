import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { VertexR1 } from "./VertexR1";

export abstract class AbstractPolygonWithVerticesR1 {

    protected abstract _vertices: Array<VertexR1>;

    get vertices() {
        return this._vertices.slice();
    }

    abstract checkConsistency(): number;

    length(): number {
        return this._vertices.length;
    }

    getFirstIndex(): number {
        if(this._vertices.length > 0) {
            return this._vertices[0].index;
        } else {
            return RETURN_ERROR_CODE;
        }
    }

    getVertexAt(index: number): VertexR1 {
        let result = new VertexR1(RETURN_ERROR_CODE, 0.0);
        for(let vertex of this._vertices) {
            if(vertex.index === index) result = new VertexR1(vertex.index, vertex.value);
        }
        return result;
    }

    getValues(): number[] {
        let result: number[] = [];
        for(let vertex of this._vertices) {
            result.push(vertex.value);
        }
        return result;
    }

    extend(vertex: VertexR1): void {
        this._vertices.push(vertex);
        this.checkConsistency();
    }

    extendWithNewValue(value: number): void {
        const newIndex = this.getFirstIndex() + this._vertices.length;
        const newVertex = new VertexR1(newIndex, value);
        this._vertices.push(newVertex);
        this.checkConsistency();
    }
}