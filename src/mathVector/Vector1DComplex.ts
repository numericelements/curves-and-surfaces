import { WeightManagement } from "../namedConstants/ProjectiveRealVectorSpace";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { COMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { DEFAULT_IMAGINARY_WEIGHT_VALUE, DEFAULT_WEIGHT_VALUE } from "../namedConstants/Weight";
import { AbstractComplexVector } from "./AbstractComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { ComplexWeight } from "./ComplexWeight";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { ProjectiveVector1DComplex } from "./ProjectiveVector1DComplex";
import { ProjectiveVector2DReal } from "./ProjectiveVector2DReal";
import { ProjectiveRealVectorSpace } from "./ProjectiveRealVectorSpace";
import { RealVectorSpace } from "./RealVectorSpace";
import type { Vector } from "./interfaces/VectorInterfaces";
import { Vector2DReal } from "./Vector2DReal";
import { copyDescriptorComplexVector1D, createComplexVector1DDescriptor } from "./VectorDescriptorFactory";
import type { ComplexDesc } from "./VectorDescriptorConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";
import { Weight } from "./Weight";
import type { ComplexVector1D } from "./utilityTypes/VectorDescriptorTypes";


export class Vector1DComplex extends AbstractComplexVector<1, ComplexVector1D> 
    implements Vector<1, ComplexVector1D>
{

    private static readonly DIMENSION = 1 as const;
    private static readonly _vectorType = COMPLEXVECTOR1D;
    private readonly _descriptor: ComplexDesc;
    protected readonly _vectorSpace: ComplexVectorSpace<1, ComplexVector1D>;
    
    constructor();
    constructor(vectorSpace: ComplexVectorSpace<1>);
    constructor(complex: Complex, vectorSpace?: ComplexVectorSpace<1>);
    constructor(real: number, imaginary: number, vectorSpace?: ComplexVectorSpace<1>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<1>, imaginaryOrVectorSpace?: number | ComplexVectorSpace<1>, vectorSpace?: ComplexVectorSpace<1>) {
        super();
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this._descriptor = createComplexVector1DDescriptor();
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace && imaginaryOrVectorSpace === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector1DComplex.DIMENSION, realOrComplexOrVectorSpace);
            this._vectorSpace = realOrComplexOrVectorSpace;
            this._descriptor = createComplexVector1DDescriptor();
            return;
        }
        
        // Case 3: coordinates as complex number with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex) {
            if(imaginaryOrVectorSpace instanceof ComplexVectorSpace) {
                super.checkVectorSpaceConsistency(Vector1DComplex.DIMENSION, imaginaryOrVectorSpace);
            } 
            const complex = realOrComplexOrVectorSpace;
            this._descriptor = createComplexVector1DDescriptor(complex.real, complex.imaginary);
            this._vectorSpace = (imaginaryOrVectorSpace instanceof ComplexVectorSpace) 
                ? imaginaryOrVectorSpace 
                : this.getDefaultVectorSpace();
            return;
        }

        // Case 4: coordinates as real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number (guaranteed by overload)
        // imaginaryOrVectorSpace is either number or ComplexVectorSpace (not undefined, by overload)
        if (imaginaryOrVectorSpace instanceof ComplexVectorSpace) {
            // cannot be reached with overloads, but added for type safety
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        } else {
            // imaginaryOrVectorSpace is number (guaranteed by overload)
            super.checkVectorSpaceConsistency(Vector1DComplex.DIMENSION, vectorSpace);
            if(typeof realOrComplexOrVectorSpace !== 'number' || typeof imaginaryOrVectorSpace !== 'number') {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            this._descriptor = createComplexVector1DDescriptor(realOrComplexOrVectorSpace, imaginaryOrVectorSpace!);
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
        }
    }

    private getDefaultVectorSpace(): ComplexVectorSpace<1> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector1DComplex.DIMENSION);
        } catch(error) {
            return new ComplexVectorSpace(Vector1DComplex.DIMENSION, true);
        }
    }

    get dimension(): 1 { return Vector1DComplex.DIMENSION; }
    get vectorType(): string { return Vector1DComplex._vectorType; }
    get vectorSpace(): ComplexVectorSpace<1, ComplexVector1D> { return this._vectorSpace; }
    get real(): number { return this._descriptor.real; }
    get imaginary(): number { return this._descriptor.imaginary; }
    get coordinates(): readonly Complex[] { return [new Complex(this._descriptor.real, this._descriptor.imaginary)]; }
    get descriptor(): ComplexVector1D { return copyDescriptorComplexVector1D(this._descriptor); }
    
    getCoordinate(index: number): Complex {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex(this._descriptor.real, this._descriptor.imaginary);
    }

    add(other: Vector1DComplex): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: Vector1DComplex): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }
    
    dot(other: Vector1DComplex): number {
        return super.dot(other);
    }

    equals(other: Vector1DComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector1DComplex, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector1DComplex, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()})` + ` ` + this._vectorSpace.toString();
    }

    toProjectiveComplexVector(projectiveComplexVectorSpace?: ProjectiveComplexVectorSpace<2>): ProjectiveVector1DComplex {
        if( projectiveComplexVectorSpace !== undefined) {
            if(projectiveComplexVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector1DComplex(this.getCoordinate(0), new ComplexWeight( new Weight(DEFAULT_WEIGHT_VALUE, false), new Weight(DEFAULT_IMAGINARY_WEIGHT_VALUE, false)), projectiveComplexVectorSpace);
            }
            return new ProjectiveVector1DComplex(this.getCoordinate(0), projectiveComplexVectorSpace);
        }
        return new ProjectiveVector1DComplex(this.getCoordinate(0));
    }

    toProjectiveRealVector(projectiveRealVectorSpace?: ProjectiveRealVectorSpace<3>): ProjectiveVector2DReal {
        if( projectiveRealVectorSpace !== undefined) {
            if(projectiveRealVectorSpace.weightManagement === WeightManagement.AllPositiveWeights) {
                return new ProjectiveVector2DReal(this.real, this.imaginary, new Weight(DEFAULT_WEIGHT_VALUE, false), projectiveRealVectorSpace);
            }
            return new ProjectiveVector2DReal(this.real, this.imaginary, new Weight(DEFAULT_WEIGHT_VALUE), projectiveRealVectorSpace);
        }
        return new ProjectiveVector2DReal(this.real, this.imaginary, new Weight(DEFAULT_WEIGHT_VALUE));
    }

    toRealVector(realVectorSpace?: RealVectorSpace<2>): Vector2DReal {
        if(realVectorSpace !== undefined) return new Vector2DReal(this.getCoordinate(0).real, this.getCoordinate(0).imaginary, realVectorSpace);
        return new Vector2DReal(this.getCoordinate(0).real, this.getCoordinate(0).imaginary);
    }
    
    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    createVectorFromDescriptor(vectorDescriptor: ComplexVector1D): this {
        return new Vector1DComplex(vectorDescriptor.real, vectorDescriptor.imaginary, this.vectorSpace) as this;
    }
}