import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE, EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE } from "../namedConstants/Vectors";
import { COMPLEXVECTOR2D } from "../namedConstants/VectorTypeTags";
import { AbstractComplexVector } from "./AbstractComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { RealVectorSpace } from "./RealVectorSpace";
import { IVector } from "./Vector";
import { Vector4DTypeReal } from "./Vector4DTypeReal";
import { copyDescriptorComplexVector2D, createComplexVector1DDescriptor, createComplexVector2DDescriptor } from "./VectorDescriptorFactory";
import type { IComplex, ComplexVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";


export class Vector2DTypeComplex extends AbstractComplexVector<2, ComplexVector2D> 
     implements IVector<2, ComplexVector2D>
{

    private static readonly DIMENSION = 2 as const;
    private static readonly _vectorType = COMPLEXVECTOR2D;
    private readonly _descriptor: ComplexVector2D;
    protected readonly _vectorSpace: ComplexVectorSpace<2, ComplexVector2D>;

    constructor();
    constructor(vectorSpace: ComplexVectorSpace<2>);
    constructor(complex1: Complex, complex2: Complex, vectorSpace?: ComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, real2: number, imaginary2: number, vectorSpace?: ComplexVectorSpace<2>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<2>, imaginaryOrComplex?: number | Complex, real2OrVectorSpace?: number | ComplexVectorSpace<2>, imaginary2?: number, vectorSpace?: ComplexVectorSpace<2>) {
        super();
        const nullComplex: IComplex = createComplexVector1DDescriptor();
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this._descriptor = createComplexVector2DDescriptor(nullComplex, nullComplex);
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace && imaginaryOrComplex === undefined) {
            super.checkVectorSpaceDimensionConsistency(Vector2DTypeComplex.DIMENSION, realOrComplexOrVectorSpace);
            this._vectorSpace = realOrComplexOrVectorSpace;
            this._descriptor = createComplexVector2DDescriptor(nullComplex, nullComplex);
            return;
        } 
        
        // Case 3: coordinates as complex numbers with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex && imaginaryOrComplex instanceof Complex) {
            if(real2OrVectorSpace instanceof ComplexVectorSpace) {
                super.checkVectorSpaceConsistency(Vector2DTypeComplex.DIMENSION, real2OrVectorSpace);
            } else if (real2OrVectorSpace !== undefined) {
                const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
                throw new RangeError(error.generateMessageString());
            }
            // At this point: realOrComplexOrVectorSpace and imaginaryOrComplex are Complex (guaranteed by overload)
            const complex1 = realOrComplexOrVectorSpace;
            const complex2 = imaginaryOrComplex;
            this._descriptor = createComplexVector2DDescriptor(complex1, complex2);
            this._vectorSpace = (real2OrVectorSpace instanceof ComplexVectorSpace)
                ? real2OrVectorSpace
                : this.getDefaultVectorSpace();
            return;
        }
            
        // Case 4: coordinates as sequence of real and imaginary parts with optional vectorSpace
        if(typeof realOrComplexOrVectorSpace !== 'number' || typeof imaginaryOrComplex !== 'number'
            || typeof real2OrVectorSpace !== 'number' || typeof imaginary2 !== 'number') {
            const error = sendRangeErrorMessage(this.constructor.name, 'constructor', EM_VECTORSPACE_PARAMETERS_INCOMPATIBLE);
            throw new RangeError(error.generateMessageString());
        }
        // At this point: realOrComplexOrVectorSpace, imaginaryOrComplex, real2OrVectorSpace, imaginary2 are numbers (guaranteed by overload)
        super.checkVectorSpaceConsistency(Vector2DTypeComplex.DIMENSION, vectorSpace);
        const real = realOrComplexOrVectorSpace;
        // real2OrVectorSpace and imaginary2 are numbers (guaranteed by overload)
        this._descriptor = createComplexVector2DDescriptor(real, imaginaryOrComplex!, real2OrVectorSpace!, imaginary2!);
        this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
    }

    private getDefaultVectorSpace(): ComplexVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, Vector2DTypeComplex.DIMENSION);
        } catch(error) {
            return new ComplexVectorSpace(Vector2DTypeComplex.DIMENSION, true);
        }
    }

    get dimension(): 2 { return Vector2DTypeComplex.DIMENSION; }
    get vectorType(): string { return Vector2DTypeComplex._vectorType; }
    get vectorSpace(): ComplexVectorSpace<2, ComplexVector2D> { return this._vectorSpace; }

    get coordinates(): readonly Complex[] { 
        let result: Complex[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(new Complex(this._descriptor.coordinates[i].real, this._descriptor.coordinates[i].imaginary));
        }
        return result;
    }

    get descriptor(): ComplexVector2D { return copyDescriptorComplexVector2D(this._descriptor); }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= Vector2DTypeComplex.DIMENSION) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex(this._descriptor.coordinates[index].real, this._descriptor.coordinates[index].imaginary);
    }

    add(other: Vector2DTypeComplex): this {
        const result = super.add(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    subtract(other: Vector2DTypeComplex): this {
        const result = super.subtract(other);
        return this.createVectorFromDescriptor(result.descriptor);
    }

    dot(other: Vector2DTypeComplex): number {
        const error = sendRangeErrorMessage(this.constructor.name, 'dot', EM_VECTORSPACE_DIMENSION_INCOMPATIBLE);
        throw new RangeError(error.generateMessageString());
    }

    equals(other: Vector2DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector2DTypeComplex, angularTolerance?: number): boolean {
        const error = sendRangeErrorMessage(this.constructor.name, 'isParallel', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }

    isOrthogonal(other: Vector2DTypeComplex, angularTolerance?: number): boolean {
        const error = sendRangeErrorMessage(this.constructor.name, 'isOrthogonal', EM_TRANSFORMATION_NOT_AVAILABLE);
        throw new RangeError(error.generateMessageString());
    }
    
    toString(): string {
        return this.vectorType + `(${this.coordinates[0].toString()}, ${this.coordinates[1].toString()})` + ` ` + this._vectorSpace.toString();
    }

    toRealVector(realVectorSpace?: RealVectorSpace<4>): Vector4DTypeReal {
        if(realVectorSpace !== undefined) return new Vector4DTypeReal(this.getCoordinate(0).real, this.getCoordinate(0).imaginary, this.getCoordinate(1).real, this.getCoordinate(1).imaginary, realVectorSpace);
        return new Vector4DTypeReal(this.getCoordinate(0).real, this.getCoordinate(0).imaginary, this.getCoordinate(1).real, this.getCoordinate(1).imaginary);
    }

    clone(): this {
        return this.createVectorFromDescriptor(this.descriptor);
    }

    createVectorFromDescriptor(vectorDescriptor: ComplexVector2D): this {
        return new Vector2DTypeComplex(vectorDescriptor.coordinates[0].real, vectorDescriptor.coordinates[0].imaginary, vectorDescriptor.coordinates[1].real, vectorDescriptor.coordinates[1].imaginary, this.vectorSpace) as this;
    }
}