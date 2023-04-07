import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { sign } from "../linearAlgebra/MathVectorBasicOperations";
import { RETURN_ERROR_CODE } from "../sequenceOfDifferentialEvents/ComparatorOfSequencesDiffEvents";
import { VertexR1 } from "./VertexR1";
import { OscillatingPolygonWithVerticesR1 } from "./OscillatingPolygonWithVerticesR1";
import { AbstractPolygonWithVerticesR1 } from "./AbstractPolygonWithVerticesR1";

export class PolygonWithVerticesR1 extends AbstractPolygonWithVerticesR1{

    protected _vertices: Array<VertexR1>;
    private _localPositiveMinima: Array<VertexR1>;
    private _localNegativeMaxima: Array<VertexR1>;

    constructor(points: number[], startIndex?: number) {
        super();
        this._vertices = [];
        this._localPositiveMinima = [];
        this._localNegativeMaxima = [];
        let index;
        if(startIndex !== undefined) {
            index = startIndex;
            if(startIndex < 0) {
                const error = new ErrorLog(this.constructor.name, "constructor", "Cannot create a polygon with vertices with a start index negative");
                error.logMessageToConsole();
            }
        } else {
            index = 0;
        }
        for(let point of points) {
            this._vertices.push(new VertexR1(index, point));
            index++;
        }
    }

    get localPositiveMinima() {
        return this._localPositiveMinima.slice();
    }

    get localNegativeMaxima() {
        return this._localNegativeMaxima.slice();
    }

    checkConsistency(): number {
        let code = 0;
        if(this._vertices.length > 1) {
            let previousIndex = this._vertices[0].index;
            const vertices = this._vertices.slice(1);
            for(let vertex of vertices) {
                if((vertex.index - previousIndex) !== 1) {
                    const error = new WarningLog(this.constructor.name, "checkConsistency", "Inconsistent sequence of indices values.");
                    error.logMessageToConsole();
                    code = RETURN_ERROR_CODE;
                    return code;
                }
                previousIndex = vertex.index;
            }
        }
        return code;
    }

    clear(): void {
        this._vertices = [];
        this._localPositiveMinima = [];
        this._localNegativeMaxima = [];
    }

    deepCopy(): PolygonWithVerticesR1 {
        const firstIndex = this.getFirstIndex();
        let polygon: PolygonWithVerticesR1;
        if(firstIndex !== RETURN_ERROR_CODE) {
            polygon = new PolygonWithVerticesR1(this.getValues(), this.getFirstIndex());
            polygon._localNegativeMaxima = this._localNegativeMaxima.slice();
            polygon._localPositiveMinima = this._localPositiveMinima.slice();
            this.checkConsistency();
        } else {
            polygon = new PolygonWithVerticesR1([]);
            polygon._vertices.push(new VertexR1(RETURN_ERROR_CODE, 0.0));
        }
        return polygon;
    }

    sortLocalExtrema(localExtrema: Array<VertexR1>): Array<VertexR1> {
        localExtrema.sort(function(a, b) {
            if (a.value > b.value) {
              return 1;
            }
            if (a.value < b.value) {
              return -1;
            }
            return 0;
        })
        const sortedExtrema = localExtrema.slice();
        return sortedExtrema;
    }

    extractLocalPositiveMinima(): void {
        this._localPositiveMinima = [];
        for(let i = 0; i < this._vertices.length - 2; i += 1) {
            if(sign(this._vertices[i].value) === 1 && sign(this._vertices[i + 1].value) === 1 && sign(this._vertices[i + 2].value) === 1) {
                if(this._vertices[i].value > this._vertices[i + 1].value && this._vertices[i + 1].value < this._vertices[i + 2].value) {
                    this._localPositiveMinima.push(new VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    }

    extractLocalNegativeMaxima(): void {
        this._localNegativeMaxima = [];
        for(let i = 0; i < this._vertices.length - 2; i += 1) {
            if(sign(this._vertices[i].value) === -1 && sign(this._vertices[i + 1].value) === -1 && sign(this._vertices[i + 2].value) === -1) {
                if(this._vertices[i].value < this._vertices[i + 1].value && this._vertices[i + 1].value > this._vertices[i + 2].value) {
                    this._localNegativeMaxima.push(new VertexR1((i + 1), this._vertices[i + 1].value));
                }
            }
        }
    }

    extractClosestLocalExtremmumToAxis(): VertexR1 {
        let localExtremum = new VertexR1(RETURN_ERROR_CODE, 0.0);
        let smallestPositiveMinimum: VertexR1 = new VertexR1(RETURN_ERROR_CODE, 0.0);
        let largestNegativeMaximum: VertexR1 = new VertexR1(RETURN_ERROR_CODE, 0.0);
        this.extractLocalPositiveMinima();
        if(this._localPositiveMinima.length > 0) {
            smallestPositiveMinimum = this.sortLocalExtrema(this._localPositiveMinima)[0];
        }
        this.extractLocalNegativeMaxima();
        if(this._localNegativeMaxima.length > 0) {
            largestNegativeMaximum = this.sortLocalExtrema(this._localNegativeMaxima)[this._localNegativeMaxima.length - 1];
        }
        if(smallestPositiveMinimum.index !== RETURN_ERROR_CODE && largestNegativeMaximum.index !== RETURN_ERROR_CODE && Math.abs(smallestPositiveMinimum.value) > Math.abs(largestNegativeMaximum.value)) {
            return largestNegativeMaximum;
        } else if(smallestPositiveMinimum.index !== RETURN_ERROR_CODE && largestNegativeMaximum.index !== RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        } else if(smallestPositiveMinimum.index !== RETURN_ERROR_CODE) {
            return smallestPositiveMinimum;
        } else if(largestNegativeMaximum.index !== RETURN_ERROR_CODE) {
            return largestNegativeMaximum;
        } else return localExtremum;
    }

    extractOscillatingPolygons(): OscillatingPolygonWithVerticesR1[] {
        let result: OscillatingPolygonWithVerticesR1[] = [];
        if(this._vertices.length > 1) {
            let i = 1;
            while (i < this._vertices.length) {
                if (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                    const firstEdge = [this._vertices[i - 1].value, this._vertices[i].value];
                    let oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                    i += 1;
                    if(i < (this._vertices.length - 1)) {
                        while (this._vertices[i - 1].value * this._vertices[i].value <= 0.0) {
                            oscillatingPolygon.extend(this._vertices[i]);
                            i += 1;
                            if(i === this._vertices.length) break;
                        }
                    }
                    result.push(new OscillatingPolygonWithVerticesR1(oscillatingPolygon));
                }
                i += 1;
            }
        }
        return result;
    }

}

export function extractOscillatingPolygons(controlPoints: number[]): OscillatingPolygonWithVerticesR1[] {
    let result: OscillatingPolygonWithVerticesR1[] = [];
    if(controlPoints.length > 1) {
        let i = 1;
        while (i < controlPoints.length) {
            if (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                const firstEdge = [controlPoints[i - 1], controlPoints[i]];
                const oscillatingPolygon = new PolygonWithVerticesR1(firstEdge, (i - 1));
                i += 1;
                if(i < (controlPoints.length - 1)) {
                    while (controlPoints[i - 1] * controlPoints[i] <= 0.0) {
                        oscillatingPolygon.extendWithNewValue(controlPoints[i]);
                        i += 1;
                        if(i === controlPoints.length) break;
                    }
                }
                result.push(new OscillatingPolygonWithVerticesR1(oscillatingPolygon));
            }
            i += 1;
        }
    }
    return result;
}