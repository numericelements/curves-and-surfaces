import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { AbstractPolygonWithVerticesR1 } from "./AbstractPolygonWithVerticesR1";
import { AdjacentOscillatingPolygons } from "./AdjacentOscillatingPolygons";
import { PolygonWithVerticesR1 } from "./PolygonWithVerticesR1";
import { VertexR1 } from "./VertexR1";

export class OscillatingPolygonWithVerticesR1 extends AbstractPolygonWithVerticesR1 {

    protected _vertices: Array<VertexR1>;
    private _closestVertexAtBeginning: VertexR1;
    private _closestVertexAtEnd: VertexR1;

    constructor(polygon: PolygonWithVerticesR1) {
        super();
        this._vertices = [];
        const firstIndex = polygon.getFirstIndex();
        const upperBound = polygon.getFirstIndex() + polygon.length();
        for(let vertex = firstIndex; vertex < upperBound; vertex++) {
            this._vertices.push(new VertexR1(polygon.getVertexAt(vertex).index, polygon.getVertexAt(vertex).value));
        }
        this._closestVertexAtBeginning = new VertexR1(RETURN_ERROR_CODE, 0.0);
        this._closestVertexAtEnd = new VertexR1(RETURN_ERROR_CODE, 0.0);
        this.checkConsistency();
        this.extractControlPtsClosestToZeroAtExtremities();
    }

    get closestVertexAtBeginning(): VertexR1 {
        return this._closestVertexAtBeginning;
    }

    get closestVertexAtEnd(): VertexR1 {
        return this._closestVertexAtEnd;
    }

    checkConsistency(): number {
        let code = 0;
        if(this._vertices.length > 1) {
            let previousIndex = this._vertices[0].index;
            let previousValue = this._vertices[0].value;
            const vertices = this._vertices.slice(1);
            for(let vertex of vertices) {
                if((vertex.index - previousIndex) !== 1) {
                    const error = new WarningLog(this.constructor.name, "checkConsistency", "Inconsistent sequence of indices values.");
                    error.logMessageToConsole();
                    code = RETURN_ERROR_CODE;
                    return code;
                } else if(vertex.value * previousValue > 0) {
                    const error = new WarningLog(this.constructor.name, "checkConsistency", "Vertices values are not oscillating.");
                    error.logMessageToConsole();
                    code = RETURN_ERROR_CODE;
                }
                previousIndex = vertex.index;
                previousValue = vertex.value;
            }
        } else {
            const error = new WarningLog(this.constructor.name, "checkConsistency", "Cannot process an oscillating polygon with less than two vertices.");
            error.logMessageToConsole();
            code = RETURN_ERROR_CODE;
        }
        return code;
    }



    extractControlPtClosestToZeroAtExtremity(index: number): VertexR1 {
        if(index !== this.getFirstIndex() && index !== this.getVertexAt(this.getFirstIndex() + this.length() - 1).index) {
            const error = new ErrorLog(this.constructor.name, "extractControlPtClosestToZeroAtExtremity", "Current vertex index is not at an extremity of the polygon.");
            error.logMessageToConsole();
            return new VertexR1(RETURN_ERROR_CODE, 0.0);
        }
        const vertex1 = this.getVertexAt(index);
        let vertex2;
        if(index === this.getFirstIndex()) {
            vertex2 = this.getVertexAt(index + 1);
        } else {
            vertex2 = this.getVertexAt(index - 1);
        }
        if(Math.pow(vertex1.value, 2) > Math.pow(vertex2.value, 2)) {
            return vertex2;
        } else {
            return vertex1;
        }
    }

    extractControlPtsClosestToZeroAtExtremities(): void {
        const firstIndex = this.getFirstIndex();
        this._closestVertexAtBeginning = this.extractControlPtClosestToZeroAtExtremity(firstIndex);
        const lastIndex = firstIndex + this.length() - 1;
        this._closestVertexAtEnd = this.extractControlPtClosestToZeroAtExtremity(lastIndex);
    }
}

export function extractAdjacentOscillatingPolygons(oscillatingPolygons: OscillatingPolygonWithVerticesR1[]): AdjacentOscillatingPolygons[] {
    let adjacentPolygons: AdjacentOscillatingPolygons[] = [];
    for(let i = 0; i < oscillatingPolygons.length; i++) {
        let polygons: OscillatingPolygonWithVerticesR1[] = [];
        if((i + 1) < oscillatingPolygons.length) {
            if(oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index ) {
                polygons.push(oscillatingPolygons[i]);
                polygons.push(oscillatingPolygons[i + 1]);
                i += 1;
                if((i + 1) < oscillatingPolygons.length) {
                    while(oscillatingPolygons[i].vertices[oscillatingPolygons[i].vertices.length - 1].index + 1 === oscillatingPolygons[i + 1].vertices[0].index) {
                        polygons.push(oscillatingPolygons[i + 1]);
                        i += 1;
                    }
                }
            } else {
                polygons.push(oscillatingPolygons[i]);
            }
        } else {
            polygons.push(oscillatingPolygons[i]);
        }
        adjacentPolygons.push(new AdjacentOscillatingPolygons(polygons));
    }
    return adjacentPolygons;
}