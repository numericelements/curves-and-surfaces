import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { REALVECTOR2D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractRealVector } from "./AbstractRealVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DComplex } from "./ProjectiveVector1DComplex";
import { ProjectiveVector2DReal } from "./ProjectiveVector2DReal";
import type { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { Vector } from "./interfaces/VectorInterfaces";
import { Vector1DComplex } from "./Vector1DComplex";
import { copyDescriptorRealVector2D, createRealVector2DDescriptor } from "./VectorDescriptorFactory";
import type { RealVector2D } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";


export class Vector2DReal extends AbstractRealVector<2, RealVector2D> 
    implements Vector<2, RealVector2D>
{

    private static readonly DIMENSION = 2 as const;
    private static readonly _vectorType = REALVECTOR2D;
    private readonly _descriptor: RealVector2D;
    protected readonly _vectorSpace: RealVectorSpace<2, RealVector2D>;
    
    constructor();
    constructor(vectorSpace: RealVectorSpace<2>);
    constructor(x: number, y: number, vectorSpace?: RealVectorSpace<2>);

    constructor(xOrVectorSpace?: number | RealVectorSpace<2>, y?: number, vectorSpace?: RealVectorSpace<2>){
        super();
        // Case 1: no arguments
        if(xOrVectorSpace === undefined) {
            this._descriptor = createRealVector2DDescriptor(0, 0);
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if(xOrVectorSpace instanceof RealVectorSpace && y === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector2DReal.DIMENSION, xOrVectorSpace);
            this._vectorSpace = xOrVectorSpace;
            this._descriptor = createRealVector2DDescriptor(0, 0);
            return;
        }

        // Case 3: all coordinates with optional vectorSpace
        super.checkVectorSpaceConsistency(Vector2DReal.DIMENSION, vectorSpace);
        if(typeof xOrVectorSpace !== 'number' || typeof y !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        this._descriptor = createRealVector2DDescriptor(xOrVectorSpace, y!);
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): RealVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector2DReal.DIMENSION);
        } catch(error) {
            return new RealVectorSpace(2, true);
        }
    }

    get dimension(): 2 { return Vector2DReal.DIMENSION; }
    get vectorType(): string { return Vector2DReal._vectorType; }
    get vectorSpace(): RealVectorSpace<2, RealVector2D> { return this._vectorSpace; }
    get coordinates(): readonly number[] { return [...this._descriptor.coordinates]; }
    get descriptor(): RealVector2D { return copyDescriptorRealVector2D(this._descriptor); }
    get y(): number { return this.getCoordinate(Vector2DReal.DIMENSION - 1); }

    getCoordinate(index: number): number {
        if (index < 0 || index >= Vector2DReal.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return this._descriptor.coordinates[index];
    }

    add(other: Vector2DReal): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: Vector2DReal): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    scale(scalar: number): this {
        const result = super.scale(scalar);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    dot(other: Vector2DReal): number {
        return super.dot(other);
    }

    equals(other: Vector2DReal, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector2DReal, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector2DReal, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }
    
    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<3>): ProjectiveVector2DReal {
        if (projectiveRealVectorSpace !== undefined) {
            if(projectiveRealVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector2DReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), projectiveRealVectorSpace);
        }
        return new ProjectiveVector2DReal(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE));
    }

    toComplexVector(complexVectorSpace?: ComplexVectorSpace<1>): Vector1DComplex {
        if (complexVectorSpace !== undefined) {
            return new Vector1DComplex(this.x, this.y, complexVectorSpace);
        }
        return new Vector1DComplex(this.x, this.y);
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveVector1DComplex {
        if (projectiveComplexVectorSpace !== undefined) {
            if(projectiveComplexVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector1DComplex(new Complex(this.x, this.y), new ComplexWeight(new Weight(DEFAULT_WEIGHT_VALUE, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            }
            return new ProjectiveVector1DComplex(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false), projectiveComplexVectorSpace);
        }
        return new ProjectiveVector1DComplex(this.x, this.y, new Weight(DEFAULT_WEIGHT_VALUE), new  Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false));
    }
    
    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    createVectorFromDescriptor(descriptor: RealVector2D): this {
        return new Vector2DReal(descriptor.coordinates[0], descriptor.coordinates[1], this.vectorSpace) as this;
    }
}