import { EM_TRANSFORMATION_NOT_AVAILABLE } from "../ErrorMessages/ComplexVectorSpace";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { EM_VECTOR_COORDINATE_INDEX_OUT_RANGE, EM_VECTORSPACE_DIMENSION_INCOMPATIBLE } from "../namedConstants/Vectors";
import { COMPLEXVECTOR2D } from "../namedConstants/VectorTypeTags";
import { AbstractComplexVector } from "./AbstractComplexVector";
import { Complex } from "./Complex";
import { ComplexVectorSpace } from "./ComplexVectorSpace";
import { getDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import type { IComplex, ComplexVector2D } from "./VectorSpaceConstructorInterface";
import { sendRangeErrorMessage } from "./VectorSpaceUtilities";

const SPACE_DIMENSION = 2;

export class Vector2DTypeComplex extends AbstractComplexVector<2> {
    private readonly _descriptor: ComplexVector2D;
    protected readonly _vectorSpace: ComplexVectorSpace<2>;

    constructor();
    constructor(vectorSpace: ComplexVectorSpace<2>);
    constructor(complex1: Complex, complex2: Complex, vectorSpace?: ComplexVectorSpace<2>);
    constructor(real: number, imaginary: number, real2: number, imaginary2: number, vectorSpace?: ComplexVectorSpace<2>);

    constructor(realOrComplexOrVectorSpace?: number | Complex | ComplexVectorSpace<2>, imaginaryOrComplex?: number | Complex, real2OrVectorSpace?: number | ComplexVectorSpace<2>, imaginary2?: number, vectorSpace?: ComplexVectorSpace<2>) {
        super();
        const nullComplex: IComplex = { type: COMPLEX, real: 0, imaginary: 0 };
        // Case 1: no arguments
        if(realOrComplexOrVectorSpace === undefined) {
            this._descriptor = { type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
            this._vectorSpace = this.getDefaultVectorSpace();
            return;
        }

        // Case 2: vectorSpace only
        if (realOrComplexOrVectorSpace instanceof ComplexVectorSpace) {
            this._vectorSpace = realOrComplexOrVectorSpace;
            this._descriptor = { type: COMPLEXVECTOR2D, coordinates: [nullComplex, nullComplex] };
            return;
        } 
        
        // Case 3: coordinates as complex numbers with optional vectorSpace
        if (realOrComplexOrVectorSpace instanceof Complex) {
            const complex1 = realOrComplexOrVectorSpace;
            if(imaginaryOrComplex instanceof Complex) {
                const complex2 = imaginaryOrComplex;
                this._descriptor = { type: COMPLEXVECTOR2D, coordinates: [
                    { type: COMPLEX, real: complex1.real, imaginary: complex1.imaginary },
                    { type: COMPLEX, real: complex2.real, imaginary: complex2.imaginary }
                ]};
                this._vectorSpace = (real2OrVectorSpace instanceof ComplexVectorSpace)
                    ? real2OrVectorSpace
                    : this.getDefaultVectorSpace();
                return;
            } else {
                this._descriptor = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: complex1.real, imaginary: complex1.imaginary }, nullComplex] };
                this._vectorSpace = this.getDefaultVectorSpace();
                return;
            }
        }
            
        // Case 4: coordinates as sequence of real and imaginary parts with optional vectorSpace
        // At this point: realOrComplexOrVectorSpace is number (guaranteed by overload)
        const real = realOrComplexOrVectorSpace;
        if (imaginaryOrComplex instanceof Complex) {
            // cannot be reached with overloads, but added for type safety -> not covered by istanbul ignore
            throw new RangeError();
        } else {
            // imaginaryOrVectorSpace is number (guaranteed by overload)
            if(real2OrVectorSpace instanceof ComplexVectorSpace) {
                // cannot be reached with overloads, but added for type safety -> not covered by istanbul ignore
                throw new RangeError();
            }
            // real2OrVectorSpace and imaginary2 are numbers (guaranteed by overload)
            this._descriptor = { type: COMPLEXVECTOR2D, coordinates: [{ type: COMPLEX, real: real, imaginary: imaginaryOrComplex!}, { type: COMPLEX, real: real2OrVectorSpace!, imaginary: imaginary2!}] };
            this._vectorSpace = vectorSpace ?? this.getDefaultVectorSpace();
        }
    }

    private getDefaultVectorSpace(): ComplexVectorSpace<2> {
        try{
            return getDefaultVectorSpace(this.spaceType, this.dimension) as ComplexVectorSpace<2>;
        } catch(error) {
            return new ComplexVectorSpace(this.dimension, true) as ComplexVectorSpace<2>;
        }
    }

    get dimension(): number { return SPACE_DIMENSION; }
    get vectorSpace(): ComplexVectorSpace<2> { return this._vectorSpace; }
    get vectorType(): string { return COMPLEXVECTOR2D; }

    get coordinates(): Complex[] { 
        let result: Complex[] = [];
        for (let i = 0; i < this.dimension; i++) {
            result.push(new Complex(this._descriptor.coordinates[i].real, this._descriptor.coordinates[i].imaginary));
        }
        return result;
    }

    get descriptor(): ComplexVector2D { return this._descriptor; }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= 2) {
            const error = sendRangeErrorMessage(this.constructor.name, 'getCoordinate', EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        return new Complex(this._descriptor.coordinates[index].real, this._descriptor.coordinates[index].imaginary);
    }

    add(other: Vector2DTypeComplex): Vector2DTypeComplex {
        return new Vector2DTypeComplex(super.add(other).coordinates[0], super.add(other).coordinates[1], this.vectorSpace);
    }

    subtract(other: Vector2DTypeComplex): Vector2DTypeComplex {
        return new Vector2DTypeComplex(super.subtract(other).coordinates[0], super.subtract(other).coordinates[1], this.vectorSpace);
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

    clone(): Vector2DTypeComplex {
        return new Vector2DTypeComplex(this._descriptor.coordinates[0].real, this._descriptor.coordinates[0].imaginary, this._descriptor.coordinates[1].real, this._descriptor.coordinates[1].imaginary, this.vectorSpace);
    }

    createVectorFromDescriptor(vectorDescriptor: ComplexVector2D): Vector2DTypeComplex {
        return new Vector2DTypeComplex(vectorDescriptor.coordinates[0].real, vectorDescriptor.coordinates[0].imaginary, vectorDescriptor.coordinates[1].real, vectorDescriptor.coordinates[1].imaginary, this.vectorSpace);
    }
}