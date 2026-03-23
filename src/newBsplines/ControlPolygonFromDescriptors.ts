import { VectorDescriptorCollection1D } from "../mathVector/VectorDescriptorCollection1D";
import { ComplexVector1D, ComplexVector2D, ProjectiveComplexVector1D, ProjectiveVector2D, ProjectiveVector3D, RealVector1D, RealVector2D, RealVector3D, RealVector4D, Vector, RealVectorOfDimension } from "../mathVector/VectorSpaceConstructorInterface";
import { areSameVSpaceAndDimension, getVectorTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { ControlPolygonComplexProjectiveVectorStrategy } from "./ControlPolygonComplexProjectiveVectorStrategy";
import { ControlPolygonComplexVectorStrategy } from "./ControlPolygonComplexVectorStrategy";
import { ControlPolygonRealProjectiveVectorStrategy } from "./ControlPolygonRealProjectiveVectorStrategy";
import { ControlPolygonRealVectorStrategy } from "./ControlPolygonRealVectorStrategy";


// Strategy interface
export interface ControlPolygonStrategy<V extends Vector> {
    moveControlPoint(index: number, displacement: V): void;
}

export class ControlPolygonFromDescriptors <V extends Vector = Vector, D extends number = number> extends VectorDescriptorCollection1D {

    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;
    // protected _vectorSpace: VectorSpace;
    protected strategy: ControlPolygonStrategy<V>;

    constructor(controlPoints: Array<V>) {
        super(controlPoints);
        const {type: vectorSpace, dimension: spaceDimension} = getVectorTypeAndDimension(this._vectorCollection[0]);
        this._vectorSpaceType = vectorSpace;
        this._spaceDimension = spaceDimension;
        switch(this._vectorSpaceType) {
            case VectorSpaceType.REAL:
                const collection =  this.vectorCollection as RealVectorOfDimension<D>[]
                this.strategy = new ControlPolygonRealVectorStrategy(collection, this._spaceDimension) as ControlPolygonStrategy<V>;
                break;
            case VectorSpaceType.COMPLEX:
                this.strategy = new ControlPolygonComplexVectorStrategy(this) as ControlPolygonStrategy<V>;
                break;
            case VectorSpaceType.PROJECTIVE:
                this.strategy = new ControlPolygonRealProjectiveVectorStrategy(this) as ControlPolygonStrategy<V>;
                break;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new ControlPolygonComplexProjectiveVectorStrategy(this) as ControlPolygonStrategy<V>;
                break;
            default:
                throw new Error("Invalid vector space for ControlPolygonFromDescriptors constructor");
        }
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }
    
    moveControlPoint(index: number, displacement: V) {
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

export function createControlPolygon(controlpPoints: RealVector1D[]): ControlPolygonFromDescriptors<RealVector1D>;
export function createControlPolygon(controlpPoints: RealVector2D[]): ControlPolygonFromDescriptors<RealVector2D>;
export function createControlPolygon(controlpPoints: RealVector3D[]): ControlPolygonFromDescriptors<RealVector3D>;
export function createControlPolygon(controlpPoints: RealVector4D[]): ControlPolygonFromDescriptors<RealVector4D>;
export function createControlPolygon(controlpPoints: ComplexVector1D[]): ControlPolygonFromDescriptors<ComplexVector1D>;
export function createControlPolygon(controlpPoints: ComplexVector2D[]): ControlPolygonFromDescriptors<ComplexVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveVector2D[]): ControlPolygonFromDescriptors<ProjectiveVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveVector3D[]): ControlPolygonFromDescriptors<ProjectiveVector3D>;
export function createControlPolygon(controlpPoints: ProjectiveComplexVector1D[]): ControlPolygonFromDescriptors<ProjectiveComplexVector1D>;
export function createControlPolygon<V extends Vector>(controlpPoints: V[]): ControlPolygonFromDescriptors<V>;
export function createControlPolygon<V extends Vector>(controlpPoints: V[]): ControlPolygonFromDescriptors<V> {
    return new ControlPolygonFromDescriptors(controlpPoints);
}