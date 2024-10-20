import { ErrorLog } from "../errorProcessing/ErrorLoging";
import { Vector2d } from "../mathVector/Vector2d";
import { deepCopyControlPoints } from "../newBsplines/AbstractBSplineR1toR2"

export class BezierR1toR2 {

    private _controlPoints: Vector2d[];
    private _degree: number;

    constructor(controlPoints: Vector2d[] = [new Vector2d(0, 0)]) {
        this._controlPoints = deepCopyControlPoints(controlPoints);
        this._degree = this._controlPoints.length - 1;
    }

    get controlPoints(): Vector2d[] {
        return deepCopyControlPoints(this._controlPoints);
    }

    get degree(): number {
        return this._degree;
    }

    set controlPoints(controlPoints: Vector2d[]) {
        this._controlPoints = controlPoints;
        this._degree = this._controlPoints.length - 1;
    }

    clone(): BezierR1toR2 {
        let cloneControlPoints = deepCopyControlPoints(this._controlPoints);
        return new BezierR1toR2(cloneControlPoints);
    }

    evaluate(u: number): Vector2d {
        let result = new Vector2d(0, 0);
        if(u < 0.0 || u > 1.0) {
            const error = new ErrorLog(this.constructor.name, "evaluate", "Parameter value for evaluation is outside the interval [0,1].");
            error.logMessage();
        } else {
            let vertices: Array<Array<Vector2d>> = [];
            vertices[0] = deepCopyControlPoints(this._controlPoints);
            for(let i = 1; i < this._degree + 1; i ++) {
                for(let j = 0; j < (this._degree + 1 - i); j++) {
                    vertices[i][j] = vertices[i - 1][j].multiply(1 - u).add(vertices[i - 1][j + 1].multiply(u));
                }
            }
            result = vertices[this._degree][0];
        }
        return result;
    }

    extend(u: number): BezierR1toR2 {
        let result = new BezierR1toR2();
        if(u >= 0.0 && u <= 1.0) {
            const error = new ErrorLog(this.constructor.name, "extend", "Parameter value for extension is not outside the interval [0,1].");
            error.logMessage();
        } else {
            let ctrlPoints = deepCopyControlPoints(this._controlPoints);
            let reversed = false;
            if(u < 0.0) {
                ctrlPoints = revertPolygon(ctrlPoints);
                u = 1.0 - u;
                reversed = true;
            }
            let vertices: Array<Array<Vector2d>> = [];
            for(let i= 1; i < this._degree + 1; i++) {
                let controlPolygon: Array<Vector2d> = [];
                controlPolygon.push(ctrlPoints[ctrlPoints.length - 1 - i]);
                const vertex = ctrlPoints[ctrlPoints.length - 1 - i].multiply(1  - u).add(ctrlPoints[ctrlPoints.length - i].multiply(u));
                controlPolygon.push(vertex);
                for(let j = 1; j < i; j++) {
                    controlPolygon.push(controlPolygon[controlPolygon.length - 1].multiply(1 - u).add(vertices[i - 2][j - 1].multiply(u)));
                }
                vertices.push(controlPolygon);
            }
            if(reversed) {
                vertices[vertices.length - 1] = revertPolygon(vertices[vertices.length - 1]);
            }
            result = new BezierR1toR2(vertices[vertices.length - 1]);
        }
        return result;
    }

    generateBezierFromBSplineR1toR1(sx: number[], sy: number[]): BezierR1toR2 {
        let result = new BezierR1toR2();
        if(sx.length !== sy.length) {
            const error = new ErrorLog(this.constructor.name, "generateBezierFromBSplineR1toR1", "Sizes of x and y component arrays are not equal. Impossible to generate the curve.");
            error.logMessage();
        } else {
            let controlPolygon: Array<Vector2d> = [];
            for(let i = 0; i < sx.length; i++) {
                let vertex = new Vector2d(sx[i], sy[i]);
                controlPolygon.push(vertex);
            }
            result.controlPoints = controlPolygon;
        }
        return result;
    }
}

export function revertPolygon(ctrlPoints: Vector2d[]): Vector2d[] {
    let vertices: Array<Vector2d> = [];
    for(let i = 0; i < ctrlPoints.length; i++) {
        vertices.push(ctrlPoints[ctrlPoints.length - 1 -i]);
    }
    return vertices;
}