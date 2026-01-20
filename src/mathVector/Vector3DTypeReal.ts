import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { REALVECTOR3D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVector3DTypeReal } from "./ProjectiveVector3DTypeReal";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveVector } from "./Vector";
import type { RealVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";

const SPACE_DIMENSION = 3;

export class Vector3DTypeReal extends AbstractRealVector<3> {
    private readonly data: RealVector3D;
    protected readonly _vectorSpace: RealVectorSpace<3>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<3>);
    constructor(x: number, y: number, z: number, vectorSpace?: RealVectorSpace<3>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<3>, y?: number, z?: number, vectorSpace?: RealVectorSpace<3>) {
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this.data = { type: REALVECTOR3D, coordinates: [0, 0, 0] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR3D, coordinates: [0, 0, 0] };
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        this.data = { type: REALVECTOR3D, coordinates: [xOrVectorSpace, y!, z!] };
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<3> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<3>;
        } catch(error) {
            return new RealVectorSpace(this.dimension, true) as RealVectorSpace<3>;
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR3D; }
    get vectorSpace(): RealVectorSpace<3> { return this._vectorSpace; }
    get coordinates(): number[] { return [...this.data.coordinates]; }
    get descriptor(): RealVector3D { return { ...this.data }; }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(SPACE_DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this.data.coordinates[index];
    }

    add(other: Vector3DTypeReal): Vector3DTypeReal {
        return new Vector3DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], this.vectorSpace);
    }

    subtract(other: Vector3DTypeReal): Vector3DTypeReal {
        return new Vector3DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], this.vectorSpace);
    }

    scale(scalar: number): Vector3DTypeReal {
        return new Vector3DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], super.scale(scalar).coordinates[2], this.vectorSpace);
    }

    dot(other: Vector3DTypeReal): number {
        return super.dot(other);
    }

    equals(other: Vector3DTypeReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector3DTypeReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector3DTypeReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    toProjectiveVector(projectiveRealVectorSpace?: ProjectiveVectorSpace<4>): IProjectiveVector {
        if (projectiveRealVectorSpace !== undefined) {
            if(projectiveRealVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight(1, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight(), projectiveRealVectorSpace);
        }
        return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight());
    }
    
    clone(): Vector3DTypeReal {
        return new Vector3DTypeReal(this.x!, this.y!, this.z!, this.vectorSpace);
    }

    createVectorFromDescriptor(raw: RealVector3D): Vector3DTypeReal {
        return new Vector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2], this.vectorSpace);
    }
    
    // static fromRaw(raw: RealVector3D): Vector3DTypeReal {
    //     return new Vector3DTypeReal(raw.coordinates[0], raw.coordinates[1], raw.coordinates[2]);
    // }
    
    // static fromCoordinates(coords: number[]): Vector3DTypeReal {
    //     if (coords.length !== 3) throw new RangeError('3D vector requires exactly 3 coordinates');
    //     return new Vector3DTypeReal(coords[0], coords[1], coords[2]);
    // }
}