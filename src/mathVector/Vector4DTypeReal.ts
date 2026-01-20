import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveVector } from "./Vector";
import type { RealVector4D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 4;

export class Vector4DTypeReal extends AbstractRealVector<4> {
    private readonly data: RealVector4D;
    protected readonly _vectorSpace: RealVectorSpace<4>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<4>);
    constructor(x: number, y: number, z: number, t: number, vectorSpace?: RealVectorSpace<4>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<4>, y?: number, z?: number, t?: number, vectorSpace?: RealVectorSpace<4>) {
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this.data = { type: REALVECTOR4D, coordinates: [0, 0, 0, 0] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR4D, coordinates: [0, 0, 0, 0] };
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        this.data = { type: REALVECTOR4D, coordinates: [xOrVectorSpace, y!, z!, t!] };
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<4> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<4>;
        } catch(error) {
            return new RealVectorSpace(this.dimension, true) as RealVectorSpace<4>;
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR4D; }
    get vectorSpace(): RealVectorSpace<4> { return this._vectorSpace; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get descriptor(): RealVector4D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(2); }
    get t(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.data.coordinates[index];
    }

    add(other: Vector4DTypeReal): Vector4DTypeReal {
        return new Vector4DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], super.add(other).coordinates[3], this.vectorSpace);
    }

    subtract(other: Vector4DTypeReal): Vector4DTypeReal {
        return new Vector4DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], super.subtract(other).coordinates[3], this.vectorSpace);
    }

    scale(scalar: number): Vector4DTypeReal {
        return new Vector4DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], super.scale(scalar).coordinates[2], super.scale(scalar).coordinates[3], this.vectorSpace);
    }

    dot(other: Vector4DTypeReal): number {
        return super.dot(other);
    }

    equals(other: Vector4DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector4DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector4DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }
    
    clone(): Vector4DTypeReal {
        return new Vector4DTypeReal(this.x!, this.y!, this.z!, this.t!, this.vectorSpace);
    }

    createVectorFromDescriptor(raw: RealVector4D): Vector4DTypeReal {
        return new Vector4DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3], this.vectorSpace);
    }
    
    // static fromRaw(raw: RealVector4D): Vector4DTypeReal {
    //     return new Vector4DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], raw.coordinates[3]);
    // }
    
    // static fromCoordinates(coords: number[]): Vector4DTypeReal {
    //     if (coords.length !== 4) throw new RangeError('4D vector requires exactly 4 coordinates');
    //     return new Vector4DTypeReal(coords[0], coords[1], coords[2], coords[3]);
    // }
}
