import { VectorCollection1D } from "../mathVector/VectorCollection1D";
import { ComplexVector1D, ComplexVector2D, ProjectiveComplexVector1D, ProjectiveVector2D, ProjectiveVector3D, RealVector1D, RealVector2D, RealVector3D, RealVector4D, Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { areSameVSpaceAndDimension, getVectorSpaceTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ControlPolygonComplexProjectiveVectorStrategy } from "./ControlPolygonComplexProjectiveVectorStrategy";
import { ControlPolygonComplexVectorStrategy } from "./ControlPolygonComplexVectorStrategy";
import { ControlPolygonRealProjectiveVectorStrategy } from "./ControlPolygonRealProjectiveVectorStrategy";
import { ControlPolygonRealVectorStrategy } from "./ControlPolygonRealVectorStrategy";


// Strategy interface
export interface ControlPolygonStrategy<T extends Vector> {
    moveControlPoint(index: number, displacement: T): void;
}

export class ControlPolygon <T extends Vector = Vector> extends VectorCollection1D {

    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;
    // protected _vectorSpace: VectorSpace;
    protected strategy: ControlPolygonStrategy<T>;

    constructor(controlPoints: Array<T>) {
        super(controlPoints);
        const {type: vectorSpace, dimension: spaceDimension} = getVectorSpaceTypeAndDimension(this._vectorCollection[0]);
        this._vectorSpaceType = vectorSpace;
        this._spaceDimension = spaceDimension;
        switch(this._vectorSpaceType) {
            case VectorSpaceType.REAL:
                this.strategy = new ControlPolygonRealVectorStrategy(this) as ControlPolygonStrategy<T>;
                break;
            case VectorSpaceType.COMPLEX:
                this.strategy = new ControlPolygonComplexVectorStrategy(this) as ControlPolygonStrategy<T>;
                break;
            case VectorSpaceType.PROJECTIVE:
                this.strategy = new ControlPolygonRealProjectiveVectorStrategy(this) as ControlPolygonStrategy<T>;
                break;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new ControlPolygonComplexProjectiveVectorStrategy(this) as ControlPolygonStrategy<T>;
                break;
            default:
                throw new Error("Invalid vector space for OpenBSplineR1toRn constructor");
        }
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }
    
    moveControlPoint(index: number, displacement: T) {
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

export function createControlPolygon(controlpPoints: RealVector1D[]): ControlPolygon<RealVector1D>;
export function createControlPolygon(controlpPoints: RealVector2D[]): ControlPolygon<RealVector2D>;
export function createControlPolygon(controlpPoints: RealVector3D[]): ControlPolygon<RealVector3D>;
export function createControlPolygon(controlpPoints: RealVector4D[]): ControlPolygon<RealVector4D>;
export function createControlPolygon(controlpPoints: ComplexVector1D[]): ControlPolygon<ComplexVector1D>;
export function createControlPolygon(controlpPoints: ComplexVector2D[]): ControlPolygon<ComplexVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveVector2D[]): ControlPolygon<ProjectiveVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveVector3D[]): ControlPolygon<ProjectiveVector3D>;
export function createControlPolygon(controlpPoints: ProjectiveComplexVector1D[]): ControlPolygon<ProjectiveComplexVector1D>;
export function createControlPolygon<T extends Vector>(controlpPoints: T[]): ControlPolygon<T>;
export function createControlPolygon<T extends Vector>(controlpPoints: T[]): ControlPolygon<T> {
    return new ControlPolygon(controlpPoints);
}