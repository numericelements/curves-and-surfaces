import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { Vector, VectorSpace } from "../mathVector/VectorSpaceConstructorInterface";
import { areSameVSpaceAndDimension, getVectorSpaceTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ControlPolygonComplexProjectiveVectorStrategy } from "./ControlPolygonComplexProjectiveVectorStrategy";
import { ControlPolygonComplexVectorStrategy } from "./ControlPolygonComplexVectorStrategy";
import { ControlPolygonRealProjectiveVectorStrategy } from "./ControlPolygonRealProjectiveVectorStrategy";
import { ControlPolygonRealVectorStrategy } from "./ControlPolygonRealVectorStrategy";


// Strategy interface
export interface ControlPolygonStrategy {
    moveControlPoint(index: number, displacement: Vector): void;
}

export class ControlPolygon extends VectorCollection1D {

    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;
    // protected _vectorSpace: VectorSpace;
    protected strategy: ControlPolygonStrategy;

    constructor(controlPoints: Vector[]) {
        super(controlPoints);
        const {type: vectorSpace, dimension: spaceDimension} = getVectorSpaceTypeAndDimension(this._vectorCollection[0]);
        this._vectorSpaceType = vectorSpace;
        this._spaceDimension = spaceDimension;
        switch(this._vectorSpaceType) {
            case VectorSpaceType.REAL:
                this.strategy = new ControlPolygonRealVectorStrategy(this);
                break;
            case VectorSpaceType.COMPLEX:
                this.strategy = new ControlPolygonComplexVectorStrategy(this);
                break;
            case VectorSpaceType.PROJECTIVE:
                this.strategy = new ControlPolygonRealProjectiveVectorStrategy(this);
                break;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new ControlPolygonComplexProjectiveVectorStrategy(this);
                break;
            default:
                throw new Error("Invalid vector space for OpenBSplineR1toRn constructor");
        }
    }

    get spaceDimension() {
        return this._spaceDimension;
    }
    
    moveControlPoint(index: number, displacement: Vector) {
        const firstVector = this._vectorCollection[0];
        if(!areSameVSpaceAndDimension(displacement, firstVector)) {
            throw new Error(`Displacement type mismatch. Expected ${firstVector.constructor.name}, got ${displacement.constructor.name}`);
        }
        this.strategy.moveControlPoint(index, displacement);
    }

    private isSameVectorType(v1: Vector, v2: Vector): boolean {
        return v1.constructor === v2.constructor;
    }
}