import { ComplexVector1D, RealVector1D, VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { VectorDescriptorCollection1D } from "../mathVector/VectorDescriptorCollection1D";
import { ComplexVector2D, ProjectiveComplexVector1D, ProjectiveRealVector2D, ProjectiveRealVector3D, RealVector2D, RealVector3D, RealVector4D } from "../mathVector/VectorDescriptorConstructorInterface";
import { areSameVSpaceAndDimension, getVectorSpaceTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ControlPolygonComplexProjectiveVectorStrategy } from "./ControlPolygonComplexProjectiveVectorStrategy";
import { ControlPolygonComplexVectorStrategy } from "./ControlPolygonComplexVectorStrategy";
import { ControlPolygonRealProjectiveVectorStrategy } from "./ControlPolygonRealProjectiveVectorStrategy";
import { ControlPolygonRealVectorStrategy } from "./ControlPolygonRealVectorStrategy";


// Strategy interface
export interface ControlPolygonStrategy<VD extends VectorDesc> {
    moveControlPoint(index: number, displacement: VD): ControlPolygonFromDescriptors<VD>;
}

export class ControlPolygonFromDescriptors <VD extends VectorDesc = VectorDesc, D extends number = number> extends VectorDescriptorCollection1D {

    protected _vectorSpaceType: VectorSpaceType;
    protected _spaceDimension: number;
    // protected _vectorSpace: VectorSpace;
    protected strategy: ControlPolygonStrategy<VD>;

    constructor(controlPoints: Array<VD>) {
        super(controlPoints);
        const {type: vectorSpace, dimension: spaceDimension} = getVectorSpaceTypeAndDimension(this._vectorCollection[0]);
        this._vectorSpaceType = vectorSpace;
        this._spaceDimension = spaceDimension;
        switch(this._vectorSpaceType) {
            case VectorSpaceType.REAL:
                this.strategy = new ControlPolygonRealVectorStrategy(this, this._spaceDimension) as ControlPolygonStrategy<VD>;
                break;
            case VectorSpaceType.COMPLEX:
                this.strategy = new ControlPolygonComplexVectorStrategy(this) as ControlPolygonStrategy<VD>;
                break;
            case VectorSpaceType.PROJECTIVEREAL:
                this.strategy = new ControlPolygonRealProjectiveVectorStrategy(this) as ControlPolygonStrategy<VD>;
                break;
            case VectorSpaceType.PROJECTIVECOMPLEX:
                this.strategy = new ControlPolygonComplexProjectiveVectorStrategy(this) as ControlPolygonStrategy<VD>;
                break;
            default:
                throw new Error("Invalid vector space for ControlPolygonFromDescriptors constructor");
        }
    }

    get spaceDimension(): number {
        return this._spaceDimension;
    }
    
    moveControlPoint(index: number, displacement: VD): ControlPolygonFromDescriptors<VD> {
        const firstVector = this._vectorCollection[0];
        if(!areSameVSpaceAndDimension(displacement, firstVector)) {
            throw new Error(`Displacement type mismatch. Expected ${firstVector.constructor.name}, got ${displacement.constructor.name}`);
        }
        return this.strategy.moveControlPoint(index, displacement);
    }

    private isSameVectorType(v1: VectorDesc, v2: VectorDesc): boolean {
        return v1.constructor === v2.constructor;
    }
}

export function createControlPolygon(controlpPoints: RealVector1D[]): ControlPolygonFromDescriptors<RealVector1D>;
export function createControlPolygon(controlpPoints: RealVector2D[]): ControlPolygonFromDescriptors<RealVector2D>;
export function createControlPolygon(controlpPoints: RealVector3D[]): ControlPolygonFromDescriptors<RealVector3D>;
export function createControlPolygon(controlpPoints: RealVector4D[]): ControlPolygonFromDescriptors<RealVector4D>;
export function createControlPolygon(controlpPoints: ComplexVector1D[]): ControlPolygonFromDescriptors<ComplexVector1D>;
export function createControlPolygon(controlpPoints: ComplexVector2D[]): ControlPolygonFromDescriptors<ComplexVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveRealVector2D[]): ControlPolygonFromDescriptors<ProjectiveRealVector2D>;
export function createControlPolygon(controlpPoints: ProjectiveRealVector3D[]): ControlPolygonFromDescriptors<ProjectiveRealVector3D>;
export function createControlPolygon(controlpPoints: ProjectiveComplexVector1D[]): ControlPolygonFromDescriptors<ProjectiveComplexVector1D>;
export function createControlPolygon<VD extends VectorDesc>(controlpPoints: VD[]): ControlPolygonFromDescriptors<VD>;
export function createControlPolygon<VD extends VectorDesc>(controlpPoints: VD[]): ControlPolygonFromDescriptors<VD> {
    return new ControlPolygonFromDescriptors(controlpPoints);
}