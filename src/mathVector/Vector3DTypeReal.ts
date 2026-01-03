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

export class Vector3DTypeReal extends AbstractRealVector {
    private data: RealVector3D;
    protected _vectorSpace: RealVectorSpace<3>;
    
    constructor();
    constructor(x: number, y: number, z: number, vectorSpace?: RealVectorSpace<3>);
    constructor(vectorSpace: RealVectorSpace<3>);
    constructor(xOrVectorSpace?: number | RealVectorSpace<3>, y?: number, z?: number, vectorSpace?: RealVectorSpace<3>) {
        super();
        if(xOrVectorSpace instanceof RealVectorSpace) {
            this._vectorSpace = xOrVectorSpace;
            this.data = { type: REALVECTOR3D, coordinates: [0, 0, 0] };
        } else {
            const x = xOrVectorSpace ?? 0;
            this.data = { type: REALVECTOR3D, coordinates: [x, y ?? 0, z ?? 0] };
            if(vectorSpace !== undefined) {
                this._vectorSpace = vectorSpace;
            } else {
                try{
                    this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as RealVectorSpace<3>;
                } catch(error) {
                    this._vectorSpace = new RealVectorSpace(this.dimension, true) as RealVectorSpace<3>;
                }
            }
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return REALVECTOR3D; }
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
        // return super.add(other) as Vector3DTypeReal;
        return new Vector3DTypeReal(super.add(other).coordinates[0], super.add(other).coordinates[1], super.add(other).coordinates[2], this.vectorSpace) as Vector3DTypeReal;
    }

    subtract(other: Vector3DTypeReal): Vector3DTypeReal {
        return new Vector3DTypeReal(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], super.subtract(other).coordinates[2], this.vectorSpace) as Vector3DTypeReal;
    }

    scale(scalar: number): Vector3DTypeReal {
        return new Vector3DTypeReal(super.scale(scalar).coordinates[0], super.scale(scalar).coordinates[1], super.scale(scalar).coordinates[2], this.vectorSpace) as Vector3DTypeReal;
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

    createVectorFromRaw(raw: RealVector3D): Vector3DTypeReal {
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