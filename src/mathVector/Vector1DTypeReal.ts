import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR1D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import { IProjectiveVector } from "./Vector";
import { RealVector1D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 1;

export class Vector1DTypeReal extends AbstractRealVector {

    private value: number;
    protected _vectorSpace: RealVectorSpace<1>;

    constructor();
    constructor(value: number, vectorSpace?: RealVectorSpace<1>);
    constructor(vectorSpace: RealVectorSpace<1>); 
    constructor(xOrVectorSpace?: number | RealVectorSpace<1>, vectorSpace?: RealVectorSpace<1>) {
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.value = 0;
        } else {
            this.value = xOrVectorSpace ?? 0;
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<1>;
            }
        }
    }

    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR1D; }
    get coordinates(): number[] { return [this.value]; }
    get descriptor(): RealVector1D { return this.value; }
    
    getCoordinate(index: number): number {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.value;
    }
    
    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
    
    clone(): Vector1DTypeReal {
        return new Vector1DTypeReal(this.value, this.vectorSpace);
    }

    add(other: Vector1DTypeReal): Vector1DTypeReal {
        return super.add(other) as Vector1DTypeReal;
    }

    subtract(other: Vector1DTypeReal): Vector1DTypeReal {
        return super.subtract(other) as Vector1DTypeReal;
    }

    dot(other: Vector1DTypeReal): number {
        return super.dot(other);
    }

    equals(other: Vector1DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector1DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector1DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    // Factory methods
    static fromRaw(raw: RealVector1D, vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        return new Vector1DTypeReal(raw, vectorSpace);
    }
    
    static fromCoordinates(coords: number[], vectorSpace?: RealVectorSpace<1>): Vector1DTypeReal {
        if (coords.length !== 1) throw new RangeError('1D vector requires exactly 1 coordinate');
        return new Vector1DTypeReal(coords[0], vectorSpace);
    }

    // Static method to create with default vector space
    static create(value: number = 0): Vector1DTypeReal {
        return new Vector1DTypeReal(value);
    }
}