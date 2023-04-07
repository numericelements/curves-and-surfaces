import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { OscillatingPolygonWithVerticesR1 } from "./OscillatingPolygonWithVerticesR1";
import { VertexR1 } from "./VertexR1";

export class AdjacentOscillatingPolygons {

    private _oscillatingPolygons: OscillatingPolygonWithVerticesR1[];
    private _closestVertex: VertexR1;
    private _indexOscillatingPolygon: number;

    constructor(oscillatingPolygons: OscillatingPolygonWithVerticesR1[]) {
        this._oscillatingPolygons = oscillatingPolygons;
        this._closestVertex = new VertexR1(RETURN_ERROR_CODE, 0.0);
        this._indexOscillatingPolygon = RETURN_ERROR_CODE;
        this.checkConsistency();
        this.getClosestVertexToZero();
    }


    get oscillatingPolygons(): OscillatingPolygonWithVerticesR1[] {
        return this._oscillatingPolygons;
    }

    get closestVertex(): VertexR1 {
        return this._closestVertex;
    }

    get indexOscillatingPolygon(): number {
        return this._indexOscillatingPolygon;
    }

    checkConsistency(): void {
        for(let i = 0; i < this._oscillatingPolygons.length - 1; i++) {
            const firstIndex1 = this._oscillatingPolygons[i].getFirstIndex();
            const lastVertex1 = this._oscillatingPolygons[i].getVertexAt(firstIndex1 + this._oscillatingPolygons[i].length() - 1);
            const firstIndex2 = this._oscillatingPolygons[i + 1].getFirstIndex();
            const firstVertex2 = this._oscillatingPolygons[i + 1].getVertexAt(firstIndex2);
            if(lastVertex1.checkIndex() !== RETURN_ERROR_CODE && firstVertex2.checkIndex() !== RETURN_ERROR_CODE) {
                if((lastVertex1.index + 1) !== firstVertex2.index) {
                    const error = new ErrorLog(this.constructor.name, "checkConsistency", "Indices of contiguous oscillating polygons are not in strict increasing order.");
                    error.logMessageToConsole();
                } else {
                    if(lastVertex1.value * firstVertex2.value <= 0.0) {
                        const error = new ErrorLog(this.constructor.name, "checkConsistency", "Extreme vertices ordinates are not of same sign.");
                        error.logMessageToConsole();
                    }
                }
            } else {
                const error = new ErrorLog(this.constructor.name, "checkConsistency", "Inconsistent indices of extreme vertices of oscillating polygons.");
                error.logMessageToConsole();
            }
        }
    }

    getClosestVertexToZero(): void {
        let closestVertex = Math.pow(this.oscillatingPolygons[0].closestVertexAtEnd.value, 2);
        this._closestVertex = this._oscillatingPolygons[0].closestVertexAtEnd;
        this._indexOscillatingPolygon = 0;
        for(let i = 1; i < this._oscillatingPolygons.length; i++) {
            if(Math.pow(this._oscillatingPolygons[i].closestVertexAtEnd.value, 2) < closestVertex) {
                closestVertex = Math.pow(this._oscillatingPolygons[i].closestVertexAtEnd.value, 2);
                this._closestVertex = this._oscillatingPolygons[i].closestVertexAtEnd;
                this._indexOscillatingPolygon = i;
            } else if(Math.pow(this._oscillatingPolygons[i].closestVertexAtBeginning.value, 2) < closestVertex) {
                closestVertex = Math.pow(this._oscillatingPolygons[i].closestVertexAtBeginning.value, 2);
                this._closestVertex = this._oscillatingPolygons[i].closestVertexAtBeginning;
                this._indexOscillatingPolygon = i;
            }
        }
    }
}