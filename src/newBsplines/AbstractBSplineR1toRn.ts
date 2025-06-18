import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { getVectorSpaceTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_type, BSplineR1toR1_type, BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY, ControlPoints } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";


export abstract class AbstractBSplineR1toRn {

    protected abstract _curveOrigin: number;
    protected abstract _controlPolygon: ControlPolygon | number[];
    protected abstract _degree: number;
    // protected abstract _evaluator: CoxDeBoorView | null;
    protected _vectorSpace: VectorSpaceType;
    protected _spaceDimension: number;
    // protected _isDirty: boolean;
 
    constructor(curveParameters: BSpline_type | BSplineR1toR1_type) {
        // this._isDirty = true;
        if(curveParameters.type === BSPL_CP_NO_KNOT || curveParameters.type === BSPL_CP_DEG_UNIFORM ||
            curveParameters.type === BSPL_CP_DEG_UNIFORM_EUCLIDEAN || curveParameters.type === BSPL_CP_DEG_NONUNIFORM) {
            let vector: Vector;
            if(curveParameters.controlPoints instanceof ControlPolygon) {
                vector = curveParameters.controlPoints.pop();
            } else {
                vector = curveParameters.controlPoints[0]
            }
            try {
            const vSpaceDim = getVectorSpaceTypeAndDimension(vector);
            this._vectorSpace = vSpaceDim.type;
            this._spaceDimension = vSpaceDim.dimension;
            } catch(error) {
                throw new Error("Control points are not valid");
            }
        } else if(curveParameters.type === BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY) {
            let controlPoint: number;
            // for(const vector of curveParameters.controlPoints) {
            //     this._controlPolygon.push(vector);
            // }
            this._vectorSpace = VectorSpaceType.REAL;
            this._spaceDimension = 1;
        } else {
            throw new Error("Control polygon is required");
        }
    }

    get vectorSpace(): VectorSpaceType {
        return this._vectorSpace;
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }

    get curveOrigin(): number {
        return this._curveOrigin;
    }

    get degree(): number {
        return this._degree;
    }

    set degree(degree: number) {
        this._degree = degree;
    }

    // protected invalidate(): void {
    //     this._isDirty = true;
    // }
}