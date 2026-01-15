import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE } from "../namedConstants/Vectors";
import { COMPLEXVECTOR1D } from "../namedConstants/VectorTypeTags";
import { AbstractComplexVector } from "./AbstractComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import type { IComplex, ComplexVector1D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";


const SPACE_DIMENSION = 1;

export class Vector1DTypeComplex extends AbstractComplexVector {
    private readonly data: IComplex;
    protected readonly _vectorSpace: ComplexVectorSpace<1>;
    
    constructor();
    constructor(vectorSpace: ComplexVectorSpace<1>);
    constructor(complex: Complex, vectorSpace?: ComplexVectorSpace<1>);
    constructor(real: number, imaginary: number, vectorSpace?: ComplexVectorSpace<1>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<1>, imaginaryOrVectorSpace?: number | ComplexVectorSpace<1>, vectorSpace?: ComplexVectorSpace<1>) {
        super();
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this.data = { type: COMPLEX, real: 0, imaginary: 0 };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            this.data = { type: COMPLEX, real: 0, imaginary: 0 };
            return;
        }
        
        // Case 3: coordinates as complex number with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex) {
            const complex = realOrComplexOrVectorSpace;
            this.data = { type: COMPLEX, real: complex.real, imaginary: complex.imaginary };
            this._vectorSpace = (imaginaryOrVectorSpace instanceof ComplexVectorSpace) 
                ? imaginaryOrVectorSpace 
                : this.getDefaultVectorSpace();
            return;
        }

        // Case 4: coordinates as real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number (guaranteed by overload)
        // imaginaryOrVectorSpace is either number or ComplexVectorSpace (not undefined, by overload)
        if (imaginaryOrVectorSpace instanceof ComplexVectorSpace) {
            // cannot be reached with overloads, but added for type safety -> not covered by istanbul ignore
            throw new RangeError();
        } else {
            // imaginaryOrVectorSpace is number (guaranteed by overload)
            this.data = { type: COMPLEX, real: realOrComplexOrVectorSpace, imaginary: imaginaryOrVectorSpace! };
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
        }
    }

    private getDefaultVectorSpace(): ComplexVectorSpace<1> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<1>;
        } catch(error) {
            return new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<1>;
        }
    }
    
    get dimension(): number { return SPACE_DIMENSION; }
    get vectorType(): string { return COMPLEXVECTOR1D; }
    get real(): number { return this.data.real; }
    get imaginary(): number { return this.data.imaginary; }
        
    get coordinates(): Complex[] { return [new Complex(this.data.real, this.data.imaginary)]; }
    get descriptor(): ComplexVector1D { return this.data; }
    
    getCoordinate(index: number): Complex {
        if (index !== 0) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex(this.data.real, this.data.imaginary);
    }

    add(other: Vector1DTypeComplex): Vector1DTypeComplex {
        return super.add(other) as Vector1DTypeComplex;
    }

    subtract(other: Vector1DTypeComplex): Vector1DTypeComplex {
        return super.subtract(other) as Vector1DTypeComplex;
    }
    
    dot(other: Vector1DTypeComplex): number {
        return super.dot(other);
    }

    equals(other: Vector1DTypeComplex, tolerance?: number): boolean {
        return super.equals(other, tolerance);
    }

    isParallel(other: Vector1DTypeComplex, angularTolerance?: number): boolean {
        return super.isParallel(other, angularTolerance);
    }

    isOrthogonal(other: Vector1DTypeComplex, angularTolerance?: number): boolean {
        return super.isOrthogonal(other, angularTolerance);
    }

    toString(): string {
        return this.vectorType + `(${this.getCoordinate(0).toString()})` + ` ` + this._vectorSpace.toString();
    }
    
    clone(): Vector1DTypeComplex {
        return new Vector1DTypeComplex(this.data.real, this.data.imaginary, this.vectorSpace);
    }

    createVectorFromDescriptor(vectorDescriptor: ComplexVector1D): Vector1DTypeComplex {
        return new Vector1DTypeComplex(vectorDescriptor.real, vectorDescriptor.imaginary, this.vectorSpace);
    }
}