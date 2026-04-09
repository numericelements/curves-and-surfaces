import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { AbstractRealVector } from "./AbstractRealVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { ProjectiveRealVector, Vector } from "./interfaces/VectorInterfaces";
import { Vector2DComplex } from "./Vector2DComplex";
import { copyDescriptorRealVector4D, createRealVector4DDescriptor } from "./VectorDescriptorFactory";
import type { RealVector4D } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";


export class Vector4DReal extends AbstractRealVector<4, RealVector4D> 
     implements Vector<4, RealVector4D>
{

    private static readonly DIMENSION = 4 as const;
    private static readonly _vectorType = REALVECTOR4D;
    private readonly _descriptor: RealVector4D;
    protected readonly _vectorSpace: RealVectorSpace<4, RealVector4D>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<4>);
    constructor(x: number, y: number, z: number, t: number, vectorSpace?: RealVectorSpace<4>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<4>, y?: number, z?: number, t?: number, vectorSpace?: RealVectorSpace<4>) {
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = createRealVector4DDescriptor(0, 0, 0, 0);
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector4DReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            this._descriptor = createRealVector4DDescriptor(0, 0, 0, 0);
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        super.checkVectorSpaceConsistency(Vector4DReal.DIMENSION, vectorSpace);
        if(typeof xOrVectorSpace !== 'number' || typeof y !== 'number' || typeof z !== 'number' || typeof t !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        this._descriptor = createRealVector4DDescriptor(xOrVectorSpace, y!, z!, t!);
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<4> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector4DReal.DIMENSION);
        } catch(error) {
            return new RealVectorSpace(4, true);
        }
    }

    get dimension(): 4 { return Vector4DReal.DIMENSION; }
    get vectorType(): string { return Vector4DReal._vectorType; }
    get vectorSpace(): RealVectorSpace<4, RealVector4D> { return this._vectorSpace; }
    get coordinates(): readonly number[] { return [...this._descriptor.coordinates]; }
    get descriptor(): RealVector4D { return copyDescriptorRealVector4D(this._descriptor); }
    get y(): number { return this.getCoordinate(1); }
    get z(): number { return this.getCoordinate(2); }
    get t(): number { return this.getCoordinate(Vector4DReal.DIMENSION - 1); }
    
    getCoordinate(index: number): number {
        if (index < 0 || index >= Vector4DReal.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this._descriptor.coordinates[index];
    }

    add(other: Vector4DReal): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: Vector4DReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(scalar: number): this {
        const result = super.scale(scalar);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    dot(other: Vector4DReal): number {
        return super.dot(other);
    }

    equals(other: Vector4DReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector4DReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector4DReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<5>): ProjectiveRealVector {
        const error = sendRangeErrorMessage(this.constructor.name, 'toProjectiveRealVector', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    toComplexVector(complexVectorSpace?: ComplexVectorSpace<2>): Vector2DComplex {
        if (complexVectorSpace !== undefined) {
            return new Vector2DComplex(new Complex(this.x, this.y), new Complex(this.z, this.t), complexVectorSpace);
        }
        return new Vector2DComplex(new Complex(this.x, this.y), new Complex(this.z, this.t));
    }
    
    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    createVectorFromDescriptor(descriptor: RealVector4D): this {
        return new Vector4DReal(descriptor.coordinates[0], descriptor.coordinates[1], descriptor.coordinates[2], descriptor.coordinates[3], this.vectorSpace) as this;
    }
}
