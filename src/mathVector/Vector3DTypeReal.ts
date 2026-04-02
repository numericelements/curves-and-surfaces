import { WeightManagement } from "../namedConstants/ProjectiveVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR3D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractRealVector } from "./AbstractRealVector";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveVector3DTypeReal } from "./ProjectiveVector3DTypeReal";
import type { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { IProjectiveVector, IVector } from "./Vector";
import { copyDescriptorRealVector3D, createRealVector3DDescriptor } from "./VectorDescriptorFactory";
import type { RealVector3D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class Vector3DTypeReal extends AbstractRealVector<3> 
    implements IVector<3, RealVector3D>
{

    private static readonly DIMENSION = 3 as const;
    private static readonly _vectorType = REALVECTOR3D;
    private readonly _descriptor: RealVector3D;
    protected readonly _vectorSpace: RealVectorSpace<3>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<3>);
    constructor(x: number, y: number, z: number, vectorSpace?: RealVectorSpace<3>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<3>, y?: number, z?: number, vectorSpace?: RealVectorSpace<3>) {
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = createRealVector3DDescriptor(0, 0, 0);
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector3DTypeReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            this._descriptor = createRealVector3DDescriptor(0, 0, 0);
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        super.checkVectorSpaceConsistency(Vector3DTypeReal.DIMENSION, vectorSpace);
        if(typeof xOrVectorSpace !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        this._descriptor = createRealVector3DDescriptor(xOrVectorSpace, y!, z!);
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<3> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector3DTypeReal.DIMENSION);
        } catch(error) {
            return new RealVectorSpace(Vector3DTypeReal.DIMENSION, true);
        }
    }
    
    get dimension(): 3 { return Vector3DTypeReal.DIMENSION; }
    get vectorType(): string { return Vector3DTypeReal._vectorType; }
    get vectorSpace(): RealVectorSpace<3> { return this._vectorSpace; }
    get coordinates(): number[] { return [...this._descriptor.coordinates]; }
    get descriptor(): RealVector3D { return copyDescriptorRealVector3D(this._descriptor); }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(Vector3DTypeReal.DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= Vector3DTypeReal.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this._descriptor.coordinates[index];
    }

    add(other: Vector3DTypeReal): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: Vector3DTypeReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(scalar: number): this {
        const result = super.scale(scalar);
        return this.createVectorFromDescriptor(result.descriptor);
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
                return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight(DEFAULT_WEIGHT_VALUE, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight(DEFAULT_WEIGHT_VALUE), projectiveRealVectorSpace);
        }
        return new ProjectiveVector3DTypeReal(this.x, this.y, this.z, new Weight(DEFAULT_WEIGHT_VALUE));
    }
    
    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    createVectorFromDescriptor(descriptor: RealVector3D): this {
        return new Vector3DTypeReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], this.vectorSpace) as this;
    }
}